// Global economic impact data
// Sources: IEA, Goldman Sachs, IMF, Oxford Economics, Bloomberg
export const globalImpact = {
  updated: '2026-04-26',
  gdpImpact: [
    { region: 'Iran', flag: 'ir', pct: -19.5, costBn: 0, note: 'Economy near-collapse' },
    { region: 'Israel', flag: 'il', pct: -5.1, costBn: 22, note: 'Mobilization + Lebanon ops' },
    { region: 'GCC', flag: 'sa', pct: -3.6, costBn: 58, note: 'Infrastructure + oil revenue' },
    { region: 'Japan', flag: 'jp', pct: -0.9, costBn: 8, note: '80% oil via Hormuz' },
    { region: 'EU', flag: 'eu', pct: -0.7, costBn: 16, note: 'Energy import surge' },
    { region: 'India', flag: 'in', pct: -0.6, costBn: 7, note: '60% oil via Gulf' },
    { region: 'US', flag: 'us', pct: -0.5, costBn: 62, note: '~$1.1B/day military' },
    { region: 'China', flag: 'cn', pct: -0.4, costBn: 11, note: '45% oil via Hormuz' },
  ],
  disruptions: {
    flightsCancelled: '78,000+',
    airspaceClosed: 'Iran (partial), S. Lebanon, Gulf corridors',
    shippingDelay: '6-10 days avg',
    portsCongestd: 'Jebel Ali, Fujairah, Salalah',
  },
  oil: {
    preWar: 68, current: 86, peak: 116, forecast: 105,
  },
};
