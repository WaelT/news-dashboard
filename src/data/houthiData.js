// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News
export const houthiData = {
  updated: '2026-05-28',
  status: 'ACTIVE — MAY 28: TRUMP CABINET MEETING — "IRAN NEGOTIATING ON FUMES"; NEW US AIRSTRIKES IN SOUTHERN IRAN NEAR BANDAR ABBAS (CENTCOM SELF-DEFENSE); IRAN ACCUSES US OF "GRAVE VIOLATION" OF CEASEFIRE; IRAN-US AGREED "BROAD PRINCIPLES" — IRAN IN PRINCIPLE AGREES TO HEU DISPOSAL; KHAMENEI ENDORSED BROAD TEMPLATE; RUBIO: "TIME IS ON OUR SIDE"; IDF OPERATIONS CONTINUE IN LEBANON OVERNIGHT (31 KILLED / 149 WOUNDED — HEALTH MINISTRY); LEBANON TOLL 3,275 / 9,926; BRENT ~$99/BBL; PGSA OPERATIONAL; UKMTO 2026-041 IN EFFECT; PENTAGON TALKS MAY 29',
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
