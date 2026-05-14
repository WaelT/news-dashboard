// Global economic impact data
// Sources: IEA, World Bank (Apr 28), IMF (Apr 2026 REO), Goldman Sachs, Oxford Economics, Bloomberg,
//          TradingEconomics (May 7 2026), CNBC (May 6-14 2026), NBC News (May 6-14 2026), CBC News (May 6 2026),
//          CENTCOM (May 7-14 2026), Al Jazeera (May 9-14 2026), PBS NewsHour (May 9 2026),
//          Bloomberg (May 11 2026 — US sanctions 12 Iran oil entities), Al-Monitor (May 11 2026),
//          CNBC (May 11 2026 — Saudi Aramco CEO Nasser; market won't normalize until 2027 if Hormuz closed past mid-June),
//          AP/Reuters (May 14 2026 — Trump-Xi summit Day 2; US delivers revised counter-proposal to Iran; Israel-Lebanon Round 3 talks open Washington)
export const globalImpact = {
  updated: '2026-05-14',
  gdpImpact: [
    { region: 'Iran', flag: 'ir', pct: -22.0, costBn: 0, note: 'Economy near-collapse; oil exports halted; reviewing revised US counter-proposal via Pakistan; May 17 ceasefire deadline 3 days away' },
    { region: 'Israel', flag: 'il', pct: -5.8, costBn: 26, note: 'Mobilization + Lebanon ops + reconstruction; Lebanon round 3 peace talks open May 14 in Washington (Dermer + Karam)' },
    { region: 'GCC', flag: 'sa', pct: -3.8, costBn: 64, note: 'Infrastructure + oil revenue + Hormuz loss; Aramco CEO: market won\'t normalize until 2027 if Hormuz closed past mid-June' },
    { region: 'Japan', flag: 'jp', pct: -1.1, costBn: 10, note: '80% oil via Hormuz; LNG rerouting; cautiously optimistic on Trump-Xi summit Day 2 Hormuz progress' },
    { region: 'EU', flag: 'eu', pct: -0.8, costBn: 18, note: 'Energy import surge; IMF cut to 1.1% growth; watching May 17 ceasefire deadline' },
    { region: 'India', flag: 'in', pct: -0.7, costBn: 9, note: '60% oil via Gulf; alternative routes costly; on hold pending Iran counter-response' },
    { region: 'US', flag: 'us', pct: -0.5, costBn: 70, note: '~$1.1B/day military; Trump in Beijing May 13–15 for Xi summit Day 2; delivered revised counter-proposal to Iran via Pakistan; Israel-Lebanon talks Round 3 open Washington; May 17 deadline 3 days away' },
    { region: 'China', flag: 'cn', pct: -0.5, costBn: 13, note: '45% oil via Hormuz; Trump-Xi summit Day 2 May 14 — Xi signals readiness to relay Hormuz message to Tehran; 12 entities sanctioned May 12; China pressing Iran for flexibility on enrichment moratorium' },
  ],
  disruptions: {
    flightsCancelled: '78,000+',
    airspaceClosed: 'Iran (partial), S. Lebanon, Gulf corridors',
    shippingDelay: '6–14 days avg via Cape of Good Hope reroute',
    portsCongestd: 'Jebel Ali, Fujairah, Salalah',
  },
  oil: {
    preWar: 68, current: 106, peak: 126, forecast: 88,
  },
};
