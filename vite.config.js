import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/yahoo': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo/, ''),
      },
      '/rss/ap': {
        target: 'https://news.google.com',
        changeOrigin: true,
        rewrite: () => '/rss/search?q=iran+conflict+middle+east&hl=en-US&gl=US&ceid=US:en',
      },
      '/rss/reuters': {
        target: 'https://news.google.com',
        changeOrigin: true,
        rewrite: () => '/rss/search?q=iran+war+strikes&hl=en-US&gl=US&ceid=US:en',
      },
      '/rss/bbc-ar': {
        target: 'https://feeds.bbci.co.uk',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rss\/bbc-ar/, '/arabic/rss.xml'),
      },
      '/rss/bbc': {
        target: 'https://feeds.bbci.co.uk',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rss\/bbc/, '/news/world/middle_east/rss.xml'),
      },
      '/rss/skynews-ar': {
        target: 'https://www.skynewsarabia.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rss\/skynews-ar/, '/rss.xml'),
      },
      '/rss/aljazeera-ar': {
        target: 'https://www.aljazeera.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rss\/aljazeera-ar/, '/rss'),
      },
      '/rss/aljazeera': {
        target: 'https://www.aljazeera.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rss\/aljazeera/, '/xml/rss/all.xml'),
      },
      '/api/polymarket': {
        target: 'https://gamma-api.polymarket.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/polymarket/, ''),
      },
      '/rss/alarabiya-ar': {
        target: 'https://www.alarabiya.net',
        changeOrigin: true,
        rewrite: () => '/feed',
      },
      '/rss/rt-ar': {
        target: 'https://arabic.rt.com',
        changeOrigin: true,
        rewrite: () => '/rss',
      },
      '/rss/google-ar': {
        target: 'https://news.google.com',
        changeOrigin: true,
        rewrite: () => '/rss/search?q=%D8%A5%D9%8A%D8%B1%D8%A7%D9%86+%D8%AD%D8%B1%D8%A8+%D8%B6%D8%B1%D8%A8%D8%A7%D8%AA&hl=ar&gl=SA&ceid=SA:ar',
      },
      '/rss/france24-ar': {
        target: 'https://www.france24.com',
        changeOrigin: true,
        rewrite: () => '/ar/rss',
      },
      '/rss/bbc-breaking': {
        target: 'https://feeds.bbci.co.uk',
        changeOrigin: true,
        rewrite: () => '/news/world/rss.xml',
      },
      '/rss/breaking-ar': {
        target: 'https://news.google.com',
        changeOrigin: true,
        rewrite: () => '/rss/search?q=%D8%B9%D8%A7%D8%AC%D9%84+%D8%A5%D9%8A%D8%B1%D8%A7%D9%86&hl=ar&gl=SA&ceid=SA:ar',
      },
      '/tg-proxy': {
        target: 'https://t.me',
        changeOrigin: true,
        rewrite: (path) => '/s' + path.replace(/^\/tg-proxy/, ''),
      },
    },
  },
});
