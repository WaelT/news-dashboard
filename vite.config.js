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
    },
  },
});
