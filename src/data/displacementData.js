// Refugee and displacement data — curated from UNHCR, Al Jazeera, Reuters
const displacementData = {
  updated: 'MAR 17, 2026',
  totalDisplaced: 4500000,
  countries: [
    {
      country: 'Iran',
      displaced: 3200000,
      lat: 32.4,
      lng: 53.7,
      detail: '25 hospitals damaged, 3.2M internally displaced',
      flows: [
        { to: 'Iraq', count: 180000, toLat: 33.3, toLng: 44.4 },
        { to: 'Turkey', count: 120000, toLat: 39.9, toLng: 32.9 },
        { to: 'Afghanistan', count: 80000, toLat: 34.5, toLng: 69.2 },
        { to: 'Pakistan', count: 60000, toLat: 33.7, toLng: 73.0 },
      ],
    },
    {
      country: 'Lebanon',
      displaced: 1000000,
      lat: 33.9,
      lng: 35.5,
      detail: 'Israel ground invasion, 1M+ displaced from south',
      flows: [
        { to: 'Syria', count: 150000, toLat: 33.5, toLng: 36.3 },
        { to: 'Beirut', count: 500000, toLat: 33.9, toLng: 35.5 },
      ],
    },
    {
      country: 'UAE',
      displaced: 120000,
      lat: 24.5,
      lng: 54.7,
      detail: 'Foreign workers evacuating, flights cancelled',
      flows: [
        { to: 'India', count: 60000, toLat: 19.1, toLng: 72.9 },
        { to: 'Philippines', count: 20000, toLat: 14.6, toLng: 121.0 },
      ],
    },
    {
      country: 'Kuwait',
      displaced: 50000,
      lat: 29.4,
      lng: 47.9,
      detail: 'Civilian evacuations from attack zones',
      flows: [],
    },
    {
      country: 'Bahrain',
      displaced: 30000,
      lat: 26.2,
      lng: 50.6,
      detail: 'Fuel infrastructure attacks causing displacement',
      flows: [],
    },
    {
      country: 'Qatar',
      displaced: 25000,
      lat: 25.3,
      lng: 51.2,
      detail: 'LNG workers evacuated, flight cancellations',
      flows: [],
    },
  ],
};

export default displacementData;
