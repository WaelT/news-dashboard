// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News
export const houthiData = {
  updated: '2026-06-03',
  status: 'ACTIVE — JUNE 3 (DAY 95): PENTAGON LEBANON POLITICAL TALKS (ROUND 4) DAY 2 CONCLUDES; LEBANON TOLL 3,468/10,577 (LEBANESE MINISTRY OF HEALTH); IDF NABATIEH AIRSTRIKE KILLS 1 LEBANESE SOLDIER, 4 INJURED; IRAN-US 60-DAY MOU STILL UNSIGNED — TRUMP: TALKS "CONTINUING AT RAPID PACE"; BRENT ~$94.58/BBL (JUNE 2 CLOSE, TRADINGECONOMICS); NO NEW HORMUZ KINETIC EXCHANGES; PGSA OPERATIONAL; UKMTO 2026-041 IN EFFECT; IRGC AXIS OF RESISTANCE CLOSURE THREAT PERSISTS',
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
