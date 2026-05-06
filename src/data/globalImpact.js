// Global economic impact data
// Sources: IEA, World Bank (Apr 28), IMF (Apr 2026 REO), Goldman Sachs, Oxford Economics, Bloomberg,
//          TradingEconomics (May 5 2026), CNN Business (Apr 30 2026), CNBC (May 4 2026)
export const globalImpact = {
  updated: '2026-05-06',
  gdpImpact: [
    { region: 'Iran', flag: 'ir', pct: -22.0, costBn: 0, note: 'Economy near-collapse; oil exports halted' },
    { region: 'Israel', flag: 'il', pct: -5.8, costBn: 26, note: 'Mobilization + Lebanon ops + reconstruction' },
    { region: 'GCC', flag: 'sa', pct: -3.8, costBn: 64, note: 'Infrastructure + oil revenue + Hormuz loss' },
    { region: 'Japan', flag: 'jp', pct: -1.1, costBn: 10, note: '80% oil via Hormuz; LNG rerouting' },
    { region: 'EU', flag: 'eu', pct: -0.8, costBn: 18, note: 'Energy import surge; IMF cut to 1.1% growth' },
    { region: 'India', flag: 'in', pct: -0.7, costBn: 9, note: '60% oil via Gulf; alternative routes costly' },
    { region: 'US', flag: 'us', pct: -0.5, costBn: 68, note: '~$1.1B/day military; Project Freedom ops' },
    { region: 'China', flag: 'cn', pct: -0.5, costBn: 13, note: '45% oil via Hormuz; spot purchases surge' },
  ],
  disruptions: {
    flightsCancelled: '78,000+',
    airspaceClosed: 'Iran (partial), S. Lebanon, Gulf corridors',
    shippingDelay: '6–14 days avg via Cape of Good Hope reroute',
    portsCongestd: 'Jebel Ali, Fujairah, Salalah',
  },
  oil: {
    preWar: 68, current: 108, peak: 126, forecast: 95,
  },
};
