// Global economic impact data
// Sources: IEA, World Bank (Apr 28), IMF (Apr 2026 REO), Goldman Sachs, Oxford Economics, Bloomberg,
//          TradingEconomics (May 7 2026), CNBC (May 6-15 2026), NBC News (May 6-15 2026), CBC News (May 6 2026),
//          CENTCOM (May 7-15 2026), Al Jazeera (May 9-15 2026), PBS NewsHour (May 9 2026),
//          Bloomberg (May 11 2026 — US sanctions 12 Iran oil entities), Al-Monitor (May 11 2026),
//          CNBC (May 11 2026 — Saudi Aramco CEO Nasser; market won't normalize until 2027 if Hormuz closed past mid-June),
//          AP/Reuters (May 14-15 2026 — Trump-Xi summit concludes; Hormuz "must remain open" agreed; Israel-Lebanon Round 3 concludes no deal),
//          The Star/Reuters (May 15 2026 — Brent $106.89 flat; US gas $4.53/gal; Eneos Japan tanker transit; Indian vessel sunk)
export const globalImpact = {
  updated: '2026-05-15',
  gdpImpact: [
    { region: 'Iran', flag: 'ir', pct: -22.0, costBn: 0, note: 'Economy near-collapse; oil exports halted; reviewing US revised counter-proposal via Pakistan; IRGC sinks Indian vessel + seizes ship near Fujairah May 15; May 17 ceasefire deadline 2 days away' },
    { region: 'Israel', flag: 'il', pct: -5.8, costBn: 26, note: 'Mobilization + Lebanon ops + reconstruction; Lebanon round 3 peace talks conclude May 14–15 Washington — no deal; IDF expanding "prolonged" Lebanon ground ops' },
    { region: 'GCC', flag: 'sa', pct: -3.8, costBn: 64, note: 'Infrastructure + oil revenue + Hormuz loss; Aramco CEO: market won\'t normalize until 2027 if Hormuz closed past mid-June; ~15 transits/day uptick May 15' },
    { region: 'Japan', flag: 'jp', pct: -1.1, costBn: 10, note: '80% oil via Hormuz; LNG rerouting; Eneos-managed tanker transits Hormuz May 15 — second Japan-linked transit since war began (LSEG)' },
    { region: 'EU', flag: 'eu', pct: -0.8, costBn: 18, note: 'Energy import surge; IMF cut to 1.1% growth; watching May 17 ceasefire deadline; Brent $106.89' },
    { region: 'India', flag: 'in', pct: -0.7, costBn: 9, note: '60% oil via Gulf; Indian cargo vessel sunk off Oman by IRGC May 15; diverting purchases to West Africa and Americas' },
    { region: 'US', flag: 'us', pct: -0.5, costBn: 70, note: '~$1.1B/day military; Trump returns from Beijing May 15 after summit concludes — joint Hormuz "must remain open" statement; May 17 deadline 2 days away; gas $4.53/gal' },
    { region: 'China', flag: 'cn', pct: -0.5, costBn: 13, note: '45% oil via Hormuz; summit concludes May 15 — Xi to relay Hormuz message to Tehran, pledges no military equipment to Iran; 12 entities sanctioned May 12; Bessent: China "working behind scenes" on Hormuz' },
  ],
  disruptions: {
    flightsCancelled: '78,000+',
    airspaceClosed: 'Iran (partial), S. Lebanon, Gulf corridors',
    shippingDelay: '6–14 days avg via Cape of Good Hope reroute',
    portsCongestd: 'Jebel Ali, Fujairah, Salalah',
  },
  oil: {
    preWar: 68, current: 107, peak: 126, forecast: 88,
  },
};
