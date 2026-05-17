// Global economic impact data
// Sources: IEA, World Bank (Apr 28), IMF (Apr 2026 REO), Goldman Sachs, Oxford Economics, Bloomberg,
//          TradingEconomics (May 7 2026), CNBC (May 6-16 2026), NBC News (May 6-16 2026), CBC News (May 6 2026),
//          CENTCOM (May 7-16 2026), Al Jazeera (May 9-16 2026), PBS NewsHour (May 9 2026),
//          Bloomberg (May 11-14 2026 — US sanctions 12 Iran oil entities; ~2 mbd crude now transiting Hormuz),
//          CNBC (May 11 2026 — Saudi Aramco CEO Nasser; market won't normalize until 2027 if Hormuz closed past mid-June),
//          AP/Reuters (May 14-16 2026 — Trump-Xi summit concludes; Israel-Lebanon 45-day ceasefire extension),
//          The Star/Reuters (May 15-16 2026 — Brent ~$107-108; US gas $4.53/gal; Iran PGSA toll plan; Trump extends ceasefire indefinitely),
//          NPR/Arab News/Maritime Executive (May 14-16 2026 — Persian Gulf Strait Authority operational; Hormuz toll fees up to $2M)
export const globalImpact = {
  updated: '2026-05-17',
  gdpImpact: [
    { region: 'Iran', flag: 'ir', pct: -22.0, costBn: 0, note: 'Economy near-collapse; oil exports halted; Persian Gulf Strait Authority (PGSA) collecting Hormuz transit fees (up to $2M/ship in CNY); IRGC sinks Indian vessel + seizes ship near Fujairah May 15; Iran has not publicly responded to US revised MoU' },
    { region: 'Israel', flag: 'il', pct: -5.8, costBn: 26, note: 'Mobilization + Lebanon ops + reconstruction; Lebanon ceasefire extended 45 days (to ~July 1) after Round 3 Washington talks — IDF continues "ceasefire in name only" strikes; >670 killed since April 16 ceasefire' },
    { region: 'GCC', flag: 'sa', pct: -3.8, costBn: 64, note: 'Infrastructure + oil revenue + Hormuz loss; Aramco CEO: market won\'t normalize until 2027 if Hormuz closed past mid-June; Bloomberg: ~2 mbd crude flow; PGSA fees apply to GCC-linked tankers; Brent ~$113/bbl (May 17)' },
    { region: 'Japan', flag: 'jp', pct: -1.1, costBn: 10, note: '80% oil via Hormuz; LNG rerouting; Eneos-managed tanker transits Hormuz May 15 (LSEG); Trump extends ceasefire indefinitely May 16 — next Japan-linked transit cautiously monitored' },
    { region: 'EU', flag: 'eu', pct: -0.8, costBn: 18, note: 'Energy import surge; IMF cut to 1.1% growth; Israel-Lebanon 45-day extension eases some fears; Iran PGSA imposes Hormuz fees — UNCLOS violation; Brent ~$107–108' },
    { region: 'India', flag: 'in', pct: -0.7, costBn: 9, note: '60% oil via Gulf; Indian cargo vessel sunk off Oman by IRGC May 15; India-UAE defence pacts signed May 15; diverting purchases to West Africa and Americas; watching PGSA fee regime' },
    { region: 'US', flag: 'us', pct: -0.5, costBn: 70, note: '~$1.1B/day military; Trump extended Iran ceasefire indefinitely May 16 — May 17 deadline passes without incident; blockade remains; claims US controls Hormuz; gas $4.53/gal; Israel-Lebanon 45-day extension confirmed; IEA: Hormuz disruption is "largest supply disruption in history of global oil market"' },
    { region: 'China', flag: 'cn', pct: -0.5, costBn: 13, note: '45% oil via Hormuz; paying Iranian PGSA fees in yuan; 12 entities sanctioned May 12; summit concluded May 15 — Xi to relay Hormuz message to Tehran, pledges no military equipment to Iran; Bessent: China "working behind scenes"' },
  ],
  disruptions: {
    flightsCancelled: '78,000+',
    airspaceClosed: 'Iran (partial), S. Lebanon, Gulf corridors',
    shippingDelay: '6–14 days avg via Cape of Good Hope reroute',
    portsCongestd: 'Jebel Ali, Fujairah, Salalah',
  },
  oil: {
    preWar: 68, current: 113, peak: 126, forecast: 88,
  },
};
