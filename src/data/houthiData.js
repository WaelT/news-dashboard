// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News
export const houthiData = {
  updated: '2026-05-18',
  status: 'ACTIVE — MAY 18: CEASEFIRE EXTENDED INDEFINITELY HOLDS (NO NEW KINETIC EXCHANGE DAY 2); US-ISRAEL STRIKE PREPARATIONS ONGOING — OPTIONS INCLUDE KHARG ISLAND SEIZURE + COMMANDO RAID FOR HEU STOCKPILE (NYT); TRUMP ADVISORS CONVENED; PGSA TOLL COLLECTION CONTINUES; BRENT ~$110.74/BBL (DOWN FROM $113 PEAK); PAKISTAN MEDIATING "NEW FORMULA"; IRGC CHIEF CONFIRMS "NO CEASEFIRE" IN LEBANON — 350+ HEZBOLLAH KILLED SINCE APRIL 16; MILITARY TALKS PENTAGON MAY 29; POLITICAL TALKS JUNE 2–3',
  babAlMandab: {
    globalTradePct: 15,
    closureThreat: 'Houthis threaten Bab al-Mandab closure tied to Hormuz/Lebanon escalation',
  },
  attacks: {
    totalLaunched: 10,
    missilesAtIsrael: 4,
    dronesAtIsrael: 3,
    attacksOnShipping: 3,
  },
  israelImpact: {
    redSeaImportPct: 55,
    eilatStatus: 'PARTIAL',
  },
  shipping: {
    shipsDiverted: 430,
    additionalDays: 6,
    containerRateSurge: '+95%',
    redSeaReturn: 'Cautious resumption; insurance premiums still elevated',
  },
  capabilities: {
    antiShipBallistic: true,
    seaSkimmingCruise: true,
    uwDrones: true,
    rangeKm: 200,
    note: 'Iranian-supplied ASBM with 200km range; can hit anywhere in southern Red Sea',
  },
};
