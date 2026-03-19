// Ground operations data — Israel invasion of southern Lebanon
// Sources: Al Jazeera, CNN, IDF briefings
const groundOps = {
  updated: 'MAR 19, 2026',
  status: 'ACTIVE',
  startDate: '2026-03-16',

  summary: {
    troopsDeployed: 35000,
    divisions: 3,
    territoryCapturedKm2: 120,
    objectiveLine: 'Litani River',
    civilianDisplaced: 1100000,
  },

  // IDF division positions (approximate)
  divisions: [
    {
      name: '91st Division',
      lat: 33.15,
      lng: 35.25,
      strength: '~10,000',
      sector: 'Western',
      objective: 'Tyre corridor',
      status: 'advancing',
    },
    {
      name: '36th Division',
      lat: 33.20,
      lng: 35.50,
      sector: 'Central',
      strength: '~12,000',
      objective: 'Nabatieh',
      status: 'engaged',
    },
    {
      name: '98th Division',
      lat: 33.25,
      lng: 35.75,
      sector: 'Eastern',
      strength: '~8,000',
      objective: 'Bekaa Valley approach',
      status: 'advancing',
    },
  ],

  // Frontline polyline (approximate, west to east)
  frontline: [
    [33.10, 35.10],
    [33.12, 35.20],
    [33.15, 35.30],
    [33.18, 35.40],
    [33.20, 35.50],
    [33.22, 35.60],
    [33.25, 35.70],
    [33.28, 35.80],
    [33.30, 35.85],
  ],

  // Litani River objective line (approximate)
  objectiveLine: [
    [33.30, 35.10],
    [33.32, 35.25],
    [33.35, 35.40],
    [33.33, 35.55],
    [33.35, 35.70],
    [33.38, 35.85],
  ],

  // Key operations
  operations: [
    {
      date: '2026-03-16',
      lat: 33.27,
      lng: 35.20,
      event: 'IDF crosses border near Naqoura',
      type: 'ground',
    },
    {
      date: '2026-03-16',
      lat: 33.12,
      lng: 35.48,
      event: 'Airborne insertion near Nabatieh',
      type: 'airborne',
    },
    {
      date: '2026-03-17',
      lat: 33.18,
      lng: 35.30,
      event: 'Hezbollah ambush — 3 IDF wounded',
      type: 'engagement',
    },
    {
      date: '2026-03-17',
      lat: 33.22,
      lng: 35.65,
      event: 'IDF secures bridge on Litani approach',
      type: 'ground',
    },
    {
      date: '2026-03-18',
      lat: 33.20,
      lng: 35.45,
      event: '36th Division engages 1,000 Radwan Force operatives',
      type: 'engagement',
    },
    {
      date: '2026-03-18',
      lat: 33.30,
      lng: 35.50,
      event: 'IDF strikes Litani River crossings to cut supply lines',
      type: 'ground',
    },
  ],
};

export default groundOps;
