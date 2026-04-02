// War cost comparison with historical US conflicts at same day count
// Sources: Congressional Research Service, Penn Wharton, DoD, Reuters
export const warCostComparison = {
  current: {
    name: 'Iran 2026', flag: 'ir', days: 32,
    costBn: 38, dailyBn: 1.2, troops: 85000, sorties: 12000,
    totalEstBn: 70, note: 'Ongoing; Penn Wharton est. $70B',
  },
  historical: [
    {
      name: 'Iraq 2003', flag: 'iq', days: 32,
      costBn: 25, dailyBn: 0.78, troops: 150000, sorties: 20000,
      totalBn: 815, duration: '8+ years',
      note: 'Baghdad fell Day 21',
    },
    {
      name: 'Gulf War 1991', flag: 'kw', days: 32,
      costBn: 20, dailyBn: 0.63, troops: 540000, sorties: 48000,
      totalBn: 61, duration: '43 days',
      note: 'Air campaign only; ground Day 38',
    },
    {
      name: 'Afghanistan 2001', flag: 'af', days: 32,
      costBn: 3.8, dailyBn: 0.12, troops: 1300, sorties: 6500,
      totalBn: 2300, duration: '20 years',
      note: 'SOF + air; Kabul fell Day 35',
    },
    {
      name: 'Libya 2011', flag: 'ly', days: 32,
      costBn: 0.9, dailyBn: 0.028, troops: 0, sorties: 5600,
      totalBn: 1.1, duration: '7 months',
      note: 'NATO air-only; no ground troops',
    },
  ],
};
