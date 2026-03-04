import { useState, useEffect, useCallback } from 'react';
import useInterval from './useInterval';
import { fetchRssFeeds, fetchArabicRssFeeds } from '../utils/rssParser';

const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const REFRESH_INTERVAL = 2 * 60 * 1000; // 2 minutes

async function fetchGNews(lang = 'en') {
  if (!GNEWS_API_KEY) return [];

  try {
    const url = `https://gnews.io/api/v4/search?q=iran+war+conflict&lang=${lang}&max=10&token=${GNEWS_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GNews API error: ${res.status}`);
    const data = await res.json();

    return (data.articles || []).map((article) => ({
      title: article.title,
      link: article.url,
      pubDate: article.publishedAt,
      source: article.source?.name || 'GNews',
      sourceColor: '#8ac926',
      image: article.image,
    }));
  } catch (err) {
    console.warn(`GNews (${lang}) fetch failed:`, err.message);
    return [];
  }
}

function dedup(articles) {
  const seen = new Set();
  return articles.filter((a) => {
    const key = a.title?.toLowerCase().slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function useNewsFeed(lang, rssFetcher) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setError(null);
      const [gnews, rss] = await Promise.allSettled([
        fetchGNews(lang),
        rssFetcher(),
      ]);

      const allArticles = [
        ...(gnews.status === 'fulfilled' ? gnews.value : []),
        ...(rss.status === 'fulfilled' ? rss.value : []),
      ];

      const unique = dedup(allArticles);
      unique.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));
      setArticles(unique);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [lang, rssFetcher]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useInterval(fetchAll, REFRESH_INTERVAL);

  return { articles, loading, error, lastUpdated, refetch: fetchAll };
}

export function useEnglishNews() {
  return useNewsFeed('en', fetchRssFeeds);
}

export function useArabicNews() {
  return useNewsFeed('ar', fetchArabicRssFeeds);
}

// Combined feed for map marker matching
export function useAllNews() {
  const en = useEnglishNews();
  const ar = useArabicNews();
  const all = [...en.articles, ...ar.articles].sort(
    (a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0)
  );
  return { articles: all, loading: en.loading || ar.loading };
}
