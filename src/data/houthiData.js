// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News
export const houthiData = {
  updated: '2026-05-27',
  status: 'ACTIVE — MAY 27: IRANIAN DELEGATION RETURNS FROM DOHA; RUBIO: DEAL "WORK IN PROGRESS" — "DISAGREEMENTS OVER A WORD, A SENTENCE"; CEASEFIRE HOLDS 2ND DAY; IRAN INTERNET PARTIALLY RESTORED AFTER 88-DAY BLACKOUT; IDF EXPANDS BEYOND "YELLOW LINE" IN LEBANON; IDF STRIKES MASHGHARA BEKAA VALLEY (12 KILLED); LEBANON TOLL 3,213 KILLED / 9,737 WOUNDED; KHAMENEI HAJJ MESSAGE WARNS GCC "NO LONGER A SHIELD FOR AMERICAN BASES"; BRENT ~$99/BBL (STABILIZING); PGSA OPERATIONAL; UKMTO 2026-041 IN EFFECT; PENTAGON TALKS MAY 29; POLITICAL TALKS JUNE 2–3',
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
