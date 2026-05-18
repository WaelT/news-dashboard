// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News
export const houthiData = {
  updated: '2026-05-18',
  status: 'ACTIVE — MAY 18: TRUMP POSTS "CLOCK IS TICKING, IRAN!" ON TRUTH SOCIAL; IRGC SEIZES VESSEL OFF UAE + SINKS CARGO SHIP NEAR OMAN; SAUDI ARABIA INTERCEPTS 3 DRONES FROM IRAQ; IDF STRIKES 7 KILLED IN LEBANON (TAYR FELSAY, TAYR DEBBA); BRENT FUTURES ~$111.19/BBL; CEASEFIRE HOLDS BUT TRUMP 5-POINT DEAL CONDITIONS ISSUED; PAKISTAN MEDIATING; UKMTO 2026-041 IN EFFECT',
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
