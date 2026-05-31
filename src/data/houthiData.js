// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News
export const houthiData = {
  updated: '2026-05-31',
  status: 'ACTIVE — MAY 31 (DAY 92): CEASEFIRE HOLDS — NO NEW KINETIC EXCHANGE ON IRAN FRONT; CENTCOM DISABLES M/V LIAN STAR (5TH BLOCKADE-RUNNER, 116 REDIRECTED); HEGSETH SHANGRI-LA: "BLOCKADE STILL IN PLACE; ABLE TO RECOMMENCE"; TRUMP TO MAKE "FINAL DETERMINATION" ON 60-DAY MOU; IRAN FM BAGHAEI: "NO FINAL AGREEMENT, EXCHANGES CONTINUING"; LEBANON TOLL ~3,336 / ~10,067; BRENT ~$91.12/BBL; PGSA OPERATIONAL; UKMTO 2026-041 IN EFFECT; PENTAGON POLITICAL TALKS JUNE 2–3',
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
