// Daily cumulative casualties (killed) by country — curated from news reports
// Sources: Al Jazeera tracker, Wikipedia, HRANA, Reuters
const casualtyTimeline = [
  { date: '2026-02-28', iran: 120, lebanon: 45, israel: 2, usa: 0, uae: 0, iraq: 5, kuwait: 0 },
  { date: '2026-03-01', iran: 280, lebanon: 95, israel: 4, usa: 0, uae: 1, iraq: 8, kuwait: 1 },
  { date: '2026-03-02', iran: 450, lebanon: 160, israel: 6, usa: 2, uae: 2, iraq: 12, kuwait: 2 },
  { date: '2026-03-03', iran: 620, lebanon: 230, israel: 8, usa: 4, uae: 3, iraq: 15, kuwait: 3 },
  { date: '2026-03-04', iran: 800, lebanon: 310, israel: 9, usa: 5, uae: 4, iraq: 18, kuwait: 4 },
  { date: '2026-03-05', iran: 980, lebanon: 390, israel: 10, usa: 6, uae: 5, iraq: 22, kuwait: 5 },
  { date: '2026-03-06', iran: 1145, lebanon: 460, israel: 11, usa: 7, uae: 6, iraq: 25, kuwait: 5 },
  { date: '2026-03-07', iran: 1350, lebanon: 530, israel: 12, usa: 7, uae: 7, iraq: 30, kuwait: 6 },
  { date: '2026-03-08', iran: 1600, lebanon: 590, israel: 13, usa: 9, uae: 8, iraq: 35, kuwait: 6 },
  { date: '2026-03-09', iran: 1850, lebanon: 640, israel: 14, usa: 11, uae: 9, iraq: 40, kuwait: 7 },
  { date: '2026-03-10', iran: 2100, lebanon: 687, israel: 15, usa: 13, uae: 10, iraq: 45, kuwait: 7 },
  { date: '2026-03-11', iran: 2300, lebanon: 720, israel: 15, usa: 13, uae: 10, iraq: 50, kuwait: 8 },
  { date: '2026-03-12', iran: 2500, lebanon: 773, israel: 15, usa: 15, uae: 11, iraq: 55, kuwait: 8 },
  { date: '2026-03-13', iran: 2650, lebanon: 826, israel: 17, usa: 15, uae: 12, iraq: 60, kuwait: 8 },
  { date: '2026-03-14', iran: 2800, lebanon: 850, israel: 17, usa: 15, uae: 12, iraq: 65, kuwait: 8 },
  { date: '2026-03-15', iran: 2900, lebanon: 886, israel: 19, usa: 15, uae: 12, iraq: 70, kuwait: 8 },
  { date: '2026-03-16', iran: 2980, lebanon: 900, israel: 19, usa: 15, uae: 12, iraq: 73, kuwait: 8 },
  { date: '2026-03-17', iran: 3065, lebanon: 912, israel: 19, usa: 15, uae: 12, iraq: 73, kuwait: 8 },
  { date: '2026-03-18', iran: 3200, lebanon: 926, israel: 22, usa: 15, uae: 12, iraq: 73, kuwait: 8 },
  { date: '2026-03-19', iran: 4500, lebanon: 960, israel: 22, usa: 15, uae: 12, iraq: 73, kuwait: 8 },
  { date: '2026-03-20', iran: 5900, lebanon: 1000, israel: 22, usa: 15, uae: 12, iraq: 73, kuwait: 8 },
];

export default casualtyTimeline;
