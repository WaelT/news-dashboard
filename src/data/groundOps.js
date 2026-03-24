// Ground operations data — Israel invasion of southern Lebanon
// Sources: Al Jazeera, CNN, IDF briefings
const groundOps = {
  updated: 'MAR 23, 2026',
  status: 'ACTIVE',
  startDate: '2026-03-16',

  summary: {
    troopsDeployed: 50000,
    divisions: 5,
    territoryCapturedKm2: 180,
    objectiveLine: 'Litani River',
    civilianDisplaced: 1200000,
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
      status: 'engaged',
    },
    {
      name: '36th Division',
      lat: 33.18,
      lng: 35.50,
      sector: 'Central',
      strength: '~12,000',
      objective: 'Nabatieh',
      status: 'engaged',
    },
    {
      name: '98th Division',
      lat: 33.23,
      lng: 35.75,
      sector: 'Eastern',
      strength: '~8,000',
      objective: 'Bekaa Valley approach',
      status: 'advancing',
    },
    {
      name: '146th Division',
      lat: 33.12,
      lng: 35.35,
      strength: '~10,000',
      sector: 'South-Central',
      objective: 'Marjayoun pocket',
      status: 'advancing',
    },
    {
      name: '210th Division',
      lat: 33.10,
      lng: 35.15,
      strength: '~10,000',
      sector: 'Coastal',
      objective: 'Tyre outskirts',
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
    {
      date: '2026-03-19',
      lat: 33.14,
      lng: 35.42,
      event: 'Fierce fighting at al-Aadaissah — Hezbollah counterattack repelled',
      type: 'engagement',
    },
    {
      date: '2026-03-19',
      lat: 33.16,
      lng: 35.55,
      event: 'IDF secures Maroun al-Ras hilltop stronghold',
      type: 'ground',
    },
    {
      date: '2026-03-19',
      lat: 33.85,
      lng: 35.52,
      event: 'Massive IDF strikes on Dahiyeh, south Beirut',
      type: 'airstrike',
    },
    {
      date: '2026-03-20',
      lat: 33.12,
      lng: 35.48,
      event: '146th Division pushes toward Marjayoun',
      type: 'ground',
    },
    {
      date: '2026-03-20',
      lat: 33.18,
      lng: 35.60,
      event: 'Hezbollah ATGM ambush — 5 IDF soldiers wounded',
      type: 'engagement',
    },
    {
      date: '2026-03-21',
      lat: 33.20,
      lng: 35.35,
      event: 'IDF expands buffer zone operations near Tyre',
      type: 'ground',
    },
    {
      date: '2026-03-21',
      lat: 33.15,
      lng: 35.50,
      event: 'Hezbollah fires ~100 rockets at northern Israel; schools closed nationwide',
      type: 'engagement',
    },
    {
      date: '2026-03-22',
      lat: 33.17,
      lng: 35.42,
      event: 'Radwan Force commander Abu Khalil Barji killed in Majdal Selm airstrike',
      type: 'airstrike',
    },
    {
      date: '2026-03-22',
      lat: 33.28,
      lng: 35.50,
      event: 'IDF strikes key bridges over Litani River to cut supply lines',
      type: 'ground',
    },
    {
      date: '2026-03-22',
      lat: 33.22,
      lng: 35.55,
      event: 'Givati Brigade firefight — 1 Hezbollah fighter killed, 3 by tank fire',
      type: 'engagement',
    },
    {
      date: '2026-03-23',
      lat: 33.85,
      lng: 35.50,
      event: 'Waves of IDF airstrikes on Dahiyeh suburbs, southern Beirut',
      type: 'airstrike',
    },
    {
      date: '2026-03-23',
      lat: 33.32,
      lng: 35.30,
      event: 'IDF strikes Qasmiyeh Bridge — Hezbollah logistics route cut',
      type: 'ground',
    },
  ],
};

export default groundOps;
