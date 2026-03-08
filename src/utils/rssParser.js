const EN_FEEDS = [
  { name: 'BBC', url: '/rss/bbc', color: '#e63946' },
  { name: 'Al Jazeera EN', url: '/rss/aljazeera', color: '#d4a017' },
  { name: 'Reuters', url: '/rss/reuters', color: '#ff8000' },
  { name: 'AP News', url: '/rss/ap', color: '#00aaff' },
];

const AR_FEEDS = [
  { name: 'الجزيرة', url: '/rss/aljazeera-ar', color: '#d4a017' },
  { name: 'BBC عربي', url: '/rss/bbc-ar', color: '#e63946' },
  { name: 'سكاي نيوز', url: '/rss/skynews-ar', color: '#00b4d8' },
  { name: 'العربية', url: '/rss/alarabiya-ar', color: '#ff6600' },
  { name: 'RT عربي', url: '/rss/rt-ar', color: '#8ac926' },
  { name: 'أخبار غوغل', url: '/rss/google-ar', color: '#4285f4' },
  { name: 'فرانس 24', url: '/rss/france24-ar', color: '#00a1e0' },
];

// Keywords to filter Arabic feeds for Iran war-related news
const AR_KEYWORDS = [
  'إيران', 'ايران', 'طهران', 'الحرس الثوري', 'خامنئي',
  'هرمز', 'الخليج', 'حرب', 'ضربة', 'ضربات', 'قصف',
  'صاروخ', 'صواريخ', 'مسيّرة', 'مسيرة', 'درون',
  'حزب الله', 'الحوثي', 'حوثي', 'أنصار الله',
  'البحر الأحمر', 'باب المندب',
  'إسرائيل', 'اسرائيل', 'تل أبيب', 'نتنياهو',
  'البنتاغون', 'أمريكي', 'القيادة المركزية',
  'العراق', 'بغداد', 'سوريا', 'دمشق',
  'لبنان', 'بيروت', 'اليمن', 'صنعاء',
  'الكويت', 'نووي', 'تخصيب', 'يورانيوم',
  'عسكري', 'عسكرية', 'حاملة طائرات',
  'أسلحة', 'دفاع جوي', 'شظايا',
];

function getTagText(item, tagName) {
  const el = item.getElementsByTagName(tagName)[0];
  if (!el) return '';
  if (el.textContent) return el.textContent.trim();
  if (el.childNodes.length > 0) return el.childNodes[0].nodeValue?.trim() || '';
  return '';
}

function parseXmlItems(xmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    console.warn('RSS XML parse error:', parseError.textContent);
    return [];
  }

  const items = doc.getElementsByTagName('item');
  const results = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    results.push({
      title: getTagText(item, 'title'),
      link: getTagText(item, 'link'),
      pubDate: getTagText(item, 'pubDate'),
      description: getTagText(item, 'description'),
    });
  }

  return results;
}

function filterByKeywords(items, keywords) {
  if (!keywords || !keywords.length) return items;
  return items.filter((item) => {
    const text = `${item.title} ${item.description}`.toLowerCase();
    return keywords.some((kw) => text.includes(kw.toLowerCase()));
  });
}

async function fetchFeeds(feeds, keywords) {
  const results = [];

  for (const feed of feeds) {
    try {
      const res = await fetch(feed.url);
      if (!res.ok) {
        console.warn(`RSS ${feed.name}: HTTP ${res.status}`);
        continue;
      }
      const text = await res.text();
      let items = parseXmlItems(text);

      if (keywords) {
        items = filterByKeywords(items, keywords);
      }

      const mapped = items.slice(0, 20).map((item) => ({
        title: item.title,
        description: item.description,
        link: item.link,
        pubDate: item.pubDate,
        source: feed.name,
        sourceColor: feed.color,
      }));
      results.push(...mapped);
    } catch (err) {
      console.warn(`Failed to fetch RSS from ${feed.name}:`, err.message);
    }
  }

  return results.sort(
    (a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0)
  );
}

const BREAKING_FEEDS = [
  { name: 'BBC', url: '/rss/bbc-breaking', color: '#e63946' },
  { name: 'عاجل', url: '/rss/breaking-ar', color: '#ff0040' },
];

const BREAKING_KEYWORDS_EN = [
  'breaking', 'urgent', 'just in',
  'iran', 'tehran', 'israel', 'hezbollah',
  'missile', 'strike', 'attack', 'war',
];

export function fetchRssFeeds() {
  return fetchFeeds(EN_FEEDS);
}

export function fetchArabicRssFeeds() {
  return fetchFeeds(AR_FEEDS, AR_KEYWORDS);
}

export async function fetchBreakingFeeds() {
  const results = [];

  for (const feed of BREAKING_FEEDS) {
    try {
      const res = await fetch(feed.url);
      if (!res.ok) continue;
      const text = await res.text();
      let items = parseXmlItems(text);

      // BBC World feed is broad — filter to conflict-related items
      if (feed.url.includes('bbc-breaking')) {
        items = items.filter((item) => {
          const t = `${item.title} ${item.description}`.toLowerCase();
          return BREAKING_KEYWORDS_EN.some((kw) => t.includes(kw));
        });
      }

      const mapped = items.slice(0, 10).map((item) => ({
        title: item.title,
        description: item.description,
        link: item.link,
        pubDate: item.pubDate,
        source: feed.name,
        sourceColor: feed.color,
      }));
      results.push(...mapped);
    } catch (err) {
      console.warn(`Failed to fetch breaking RSS from ${feed.name}:`, err.message);
    }
  }

  return results.sort(
    (a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0)
  );
}
