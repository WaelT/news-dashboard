export const dailyLaunches = [
  { date: '2026-02-28', missiles: 158, drones: 200, intercepted: 310, targets: ['Israel', 'UAE', 'Qatar', 'Kuwait', 'Bahrain'] },
  { date: '2026-03-01', missiles: 30, drones: 332, intercepted: 340, targets: ['UAE', 'Israel', 'Kuwait', 'Jordan'] },
  { date: '2026-03-02', missiles: 40, drones: 250, intercepted: 265, targets: ['Israel', 'UAE', 'Saudi Arabia'] },
  { date: '2026-03-03', missiles: 25, drones: 230, intercepted: 235, targets: ['Israel', 'UAE', 'Qatar'] },
  { date: '2026-03-04', missiles: 21, drones: 180, intercepted: 190, targets: ['UAE', 'Kuwait', 'Bahrain'] },
  { date: '2026-03-05', missiles: 26, drones: 162, intercepted: 179, targets: ['UAE', 'Qatar', 'Bahrain', 'Saudi Arabia', 'Israel'] },
  { date: '2026-03-06', missiles: 12, drones: 132, intercepted: 137, targets: ['UAE', 'Qatar', 'Bahrain', 'Saudi Arabia', 'Kuwait', 'Jordan', 'Israel'] },
  { date: '2026-03-07', missiles: 44, drones: 139, intercepted: 167, targets: ['UAE', 'Israel', 'Saudi Arabia', 'Qatar', 'Bahrain', 'Jordan', 'Kuwait', 'Iraq'] },
  { date: '2026-03-08', missiles: 42, drones: 155, intercepted: 180, targets: ['UAE', 'Saudi Arabia', 'Israel', 'Qatar', 'Kuwait', 'Bahrain', 'Iraq'] },
  { date: '2026-03-09', missiles: 50, drones: 128, intercepted: 162, targets: ['UAE', 'Israel', 'Qatar', 'Saudi Arabia', 'Kuwait', 'Bahrain', 'Jordan'] },
];

// Cumulative missiles & drones by targeted country (from defense ministry reports)
export const countryBreakdown = {
  missiles: [
    { country: 'UAE', count: 253 },
    { country: 'Israel', count: 200 },
    { country: 'Kuwait', count: 97 },
    { country: 'Bahrain', count: 95 },
    { country: 'Qatar', count: 30 },
    { country: 'Saudi Arabia', count: 18 },
    { country: 'Jordan', count: 12 },
    { country: 'Iraq', count: 8 },
  ],
  drones: [
    { country: 'UAE', count: 1440 },
    { country: 'Kuwait', count: 283 },
    { country: 'Bahrain', count: 164 },
    { country: 'Saudi Arabia', count: 52 },
    { country: 'Qatar', count: 24 },
    { country: 'Jordan', count: 18 },
    { country: 'Iraq', count: 12 },
    { country: 'Israel', count: 5 },
  ],
};

export default dailyLaunches;
