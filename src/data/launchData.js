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
  { date: '2026-03-10', missiles: 38, drones: 58, intercepted: 88, targets: ['UAE', 'Saudi Arabia', 'Israel', 'Qatar', 'Kuwait', 'Bahrain', 'Jordan', 'Iraq'] },
  { date: '2026-03-11', missiles: 35, drones: 75, intercepted: 95, targets: ['Israel', 'UAE', 'Kuwait', 'Saudi Arabia', 'Qatar', 'Bahrain', 'Iraq'] },
  { date: '2026-03-12', missiles: 30, drones: 55, intercepted: 72, targets: ['Israel', 'UAE', 'Kuwait', 'Saudi Arabia', 'Bahrain', 'Iraq'] },
  { date: '2026-03-13', missiles: 25, drones: 40, intercepted: 58, targets: ['Israel', 'Saudi Arabia', 'UAE', 'Bahrain', 'Kuwait'] },
];

// Cumulative missiles & drones by targeted country (from defense ministry reports)
export const countryBreakdown = {
  missiles: [
    { country: 'Israel', count: 325 },
    { country: 'UAE', count: 290 },
    { country: 'Saudi Arabia', count: 275 },
    { country: 'Kuwait', count: 232 },
    { country: 'Qatar', count: 156 },
    { country: 'Bahrain', count: 118 },
    { country: 'Jordan', count: 63 },
    { country: 'Iraq', count: 22 },
  ],
  drones: [
    { country: 'UAE', count: 1560 },
    { country: 'Kuwait', count: 435 },
    { country: 'Bahrain', count: 198 },
    { country: 'Saudi Arabia', count: 95 },
    { country: 'Qatar', count: 74 },
    { country: 'Jordan', count: 62 },
    { country: 'Iraq', count: 27 },
    { country: 'Israel', count: 10 },
  ],
};

export default dailyLaunches;
