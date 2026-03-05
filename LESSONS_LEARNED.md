# Lessons Learned — Iran Conflict Dashboard

Issues encountered during development and how they were resolved.

---

## 1. Oil Price Colors Inverted

**Problem:** The oil price indicator in the header showed green for negative % change and red for positive — the opposite of what's expected.

**Cause:** The ternary condition was backwards in the className.

**Fix:** Swapped the condition:
```jsx
// Before (wrong)
oilPrice.change >= 0 ? 'text-[#ff0040]' : 'text-[#00ff41]'

// After (correct)
oilPrice.change >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'
```

**Lesson:** Always verify color logic matches financial conventions (green = up, red = down).

---

## 2. Casualties Not Updating — Stale `public/casualties.json`

**Problem:** Updated casualty numbers in code (`DEFAULT_CASUALTIES`) but the dashboard kept showing old numbers (e.g., Iran wounded: 500 instead of 2,100).

**Cause:** `ImpactTracker.jsx` fetched `/casualties.json` at runtime, which overrode the hardcoded defaults. The `public/casualties.json` file had old data and Vercel's CDN cached it aggressively.

**Fix (multi-step):**
1. First tried adding cache-busting query param (`?t=${Date.now()}`) — didn't help because Vercel CDN ignores query params for static files.
2. Removed the `/casualties.json` fetch entirely — component now uses only hardcoded `DEFAULT_CASUALTIES`.
3. GitHub Action updates the hardcoded values directly in code, which triggers a Vercel rebuild.

**Lesson:** On Vercel, static files in `public/` are CDN-cached. Don't rely on runtime fetching of static JSON for frequently-changing data. Either use an API endpoint or bake data into the JS bundle.

---

## 3. Polymarket API Tag Filter Doesn't Work

**Problem:** Added Polymarket polls to the Markets panel using `?tag=iran` filter, but it returned unrelated polls showing 0%.

**Cause:** The Gamma API `tag` parameter doesn't filter by topic as expected. The `outcomePrices` field was sometimes a JSON string needing `JSON.parse()`.

**Fix:** Switched to fetching specific known event slugs via `/events/slug/{slug}` endpoint. Also added `JSON.parse()` for `outcomePrices`. Eventually removed Polymarket entirely in favor of an Economic Impact section.

**Lesson:** Test third-party API filters before building features around them. API docs may not match actual behavior.

---

## 4. Flag Emoji Not Rendering on Windows

**Problem:** Country flag emoji (🇮🇷, 🇮🇱, etc.) showed as two-letter codes or blank boxes on Windows.

**Cause:** Windows doesn't support flag emoji natively in most browsers — they render as regional indicator letter pairs.

**Fix:** Replaced Unicode flag emoji with images from `flagcdn.com`:
```jsx
// Before
<span>{p.flag}</span>  // Unicode emoji

// After
<img src={`https://flagcdn.com/20x15/${p.cc}.png`} />
```

**Lesson:** Never rely on Unicode flag emoji for cross-platform display. Use image-based flags (flagcdn.com, Twemoji, or SVG sprites).

---

## 5. Wikipedia Scraper Breaking — Article Structure Changed

**Problem:** The automated casualty scraper (GitHub Action) failed with all zeros. Worked fine when first built, then started failing.

**Cause:** The Wikipedia "2026 Iran war" article was restructured. Casualty data moved from infobox fields (`casualties1`, `casualties2`, `casualties3`) to a `{| class="wikitable"` table under `=== Casualties by country ===`.

**Fix:** Rewrote the scraper to parse the new wikitable format:
```js
// Old approach (broken)
const cas1Match = text.match(/casualties1\s*=[\s\S]*?(?=\ncasualties2)/);

// New approach (works)
const tableStart = text.indexOf('Casualties by country');
const rows = tableText.split(/\n\|-\s*\n/);
// Parse each row for {{Flag|Country}}, killed, injured columns
```

**Lesson:** Web scraping is inherently fragile. Wikipedia articles are actively edited and restructured. The scraper includes a sanity check (aborts if Iran killed = 0) to prevent writing bad data. Always validate scraped data before committing.

---

## 6. Attack Routes Not Visible to Users

**Problem:** Added animated attack route lines to the map, but users couldn't find them.

**Cause:** The toggle button was hidden inside the map legend (bottom-right corner), which users don't typically interact with.

**Fix:** Moved the "ATTACK ROUTES" toggle to the `MapFilterBar` component (top-left filters dropdown), next to the "LIVE ONLY" toggle where users naturally look for map controls.

**Lesson:** Feature toggles should be placed where users expect to find controls, not buried in decorative elements.

---

## 7. Breaking News Audio Too Loud/Harsh

**Problem:** The initial breaking news alert used square-wave beeps at 880Hz and 1100Hz — too harsh and alarming.

**Fix:** Changed to subtle sine-wave chime with two gentle tones (660Hz, 880Hz) using `exponentialRampToValueAtTime` for smooth fade-out:
```js
osc.type = 'sine';  // was 'square'
gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
```

**Lesson:** Audio alerts should be noticeable but not jarring, especially for dashboards that run continuously.

---

## 8. Bash Escaping Issues with Node.js Inline Scripts

**Problem:** Running inline Node.js scripts via bash (e.g., `node -e "..."`) failed when the code contained `!` characters, which bash interprets as history expansion.

**Fix:** Wrote test scripts to `.mjs` files instead of using inline `node -e` evaluation.

**Lesson:** Avoid inline `node -e` with complex code in bash. Write to temporary files instead.

---

## 9. `useAllNews` vs Separate Hooks for EN/AR Tabs

**Problem:** When adding EN/AR tabs to the news panel and timeline, needed separate English and Arabic article arrays. The existing `useAllNews()` hook combined them.

**Fix:** Switched `Dashboard.jsx` to call `useEnglishNews()` and `useArabicNews()` separately, then combined with `useMemo` for components that need all articles:
```js
const enArticles = useEnglishNews();
const arArticles = useArabicNews();
const articles = useMemo(() => [...enArticles, ...arArticles], [enArticles, arArticles]);
```

**Lesson:** Design hooks for composability — prefer granular hooks that can be combined over monolithic ones.

---

## 10. Vercel CDN Caching Static Assets

**Problem:** Even after pushing updated `casualties.json` to GitHub and Vercel redeploying, the old data persisted.

**Cause:** Vercel aggressively caches static files at the CDN edge. Cache-busting query params (`?t=123`) are stripped/ignored for static assets in `public/`.

**Fix:** Eliminated runtime dependency on static JSON entirely. Data is now hardcoded in the JS bundle, which gets a new content-hash filename on every build (e.g., `index-DdfOIEub.js`), bypassing CDN caches.

**Lesson:** For data that changes frequently, don't use `public/` static files on Vercel. Either:
- Bake data into the JS bundle (updated via CI/CD)
- Use Vercel API routes (`/api/`) which aren't edge-cached the same way
- Set custom cache headers via `vercel.json`

---

## Summary of Architectural Decisions

| Decision | Why |
|----------|-----|
| Hardcoded casualties (no runtime fetch) | Vercel CDN caches `public/` files; stale data overrides defaults |
| GitHub Action updates code directly | Triggers Vercel rebuild with fresh content-hashed JS bundle |
| flagcdn.com images over Unicode emoji | Windows doesn't render flag emoji |
| Sine-wave audio over square-wave | Less jarring for continuous monitoring |
| Wikipedia table parser (not infobox) | Article was restructured; tables are more stable |
| Sanity check before committing scraped data | Prevents writing zeros if scraping fails |
| Feature toggles in filter bar | Users expect controls where they look for filters |
