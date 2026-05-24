// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News
export const houthiData = {
  updated: '2026-05-24',
  status: 'ACTIVE — MAY 24: 8TH CONSECUTIVE CEASEFIRE DAY; TRUMP TRUTH SOCIAL: IRAN DEAL "LARGELY NEGOTIATED", HORMUZ "WILL BE OPENED"; 14-POINT MOU FRAMEWORK — WITKOFF/KUSHNER/VANCE + IRAN PARLIAMENT SPEAKER QALIFBAF APPROVED; WASHINGTON TIMES: ANNOUNCEMENT WITHIN 24H; BRENT ~$97/BBL (DEAL-HOPE DROP); WTI ~$90/BBL; S&P 500 +1.5%, NASDAQ +2% AT RECORD HIGHS; NO NEW KINETIC EXCHANGE; PGSA OPERATIONAL; UKMTO 2026-041 IN EFFECT; PENTAGON TALKS MAY 29',
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
