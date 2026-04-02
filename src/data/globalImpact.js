// Global economic impact data
// Sources: IEA, Goldman Sachs, IMF, Oxford Economics, Bloomberg
export const globalImpact = {
  updated: '2026-04-01',
  gdpImpact: [
    { region: 'Iran', flag: 'ir', pct: -18.0, costBn: 0, note: 'Economy near-collapse' },
    { region: 'Israel', flag: 'il', pct: -4.5, costBn: 15, note: 'Mobilization + damage' },
    { region: 'GCC', flag: 'sa', pct: -3.2, costBn: 45, note: 'Infrastructure + oil revenue' },
    { region: 'Japan', flag: 'jp', pct: -0.8, costBn: 6, note: '80% oil via Hormuz' },
    { region: 'EU', flag: 'eu', pct: -0.6, costBn: 12, note: 'Energy import surge' },
    { region: 'India', flag: 'in', pct: -0.5, costBn: 5, note: '60% oil via Gulf' },
    { region: 'US', flag: 'us', pct: -0.4, costBn: 38, note: '$1.2B/day military' },
    { region: 'China', flag: 'cn', pct: -0.3, costBn: 8, note: '45% oil via Hormuz' },
  ],
  disruptions: {
    flightsCancelled: '55,000+',
    airspaceClosed: 'Iran, Iraq (partial), Gulf',
    shippingDelay: '8-14 days avg',
    portsCongestd: 'Jebel Ali, Fujairah, Salalah',
  },
  oil: {
    preWar: 68, current: 108, peak: 116, forecast: 147,
  },
};
