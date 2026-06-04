// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News
export const houthiData = {
  updated: '2026-06-04',
  status: 'ACTIVE — JUNE 4 (DAY 96): ISRAEL-LEBANON US-BROKERED CEASEFIRE IMPLEMENTATION AGREEMENT ANNOUNCED JUNE 3 (CONTINGENT ON HEZBOLLAH WITHDRAWAL SOUTH OF LITANI); IDF CHIEF: "NO CEASEFIRE FOR OUR FORCES"; IDF ISSUES EVACUATION WARNINGS FOR 6 SOUTH LEBANON TOWNS; IRAN-US 60-DAY MOU STILL UNSIGNED; NO NEW HORMUZ KINETIC EXCHANGES CONFIRMED JUNE 4; US HOUSE PASSES WAR POWERS RESOLUTION 215-208 (JUNE 3); LEBANON TOLL 3,468/10,577; BRENT ~$97/BBL; PGSA OPERATIONAL; UKMTO 2026-041 IN EFFECT; IRGC AXIS OF RESISTANCE BAB AL-MANDAB CLOSURE THREAT PERSISTS',
  babAlMandab: {
    globalTradePct: 15,
    closureThreat: 'IRGC and Axis of Resistance resolve to activate Bab al-Mandab front (June 1) — Iran cites Israeli Lebanon ops as ceasefire violation; Houthis ordered to resume Red Sea shipping attacks if Hormuz deal collapses',
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
