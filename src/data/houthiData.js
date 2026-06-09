// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News
export const houthiData = {
  updated: '2026-06-09',
  status: 'ACTIVE — JUNE 9 (DAY 102): IRAN + ISRAEL HALT DIRECT STRIKES ON EACH OTHER AFTER TRUMP "STOP SHOOTING" APPEAL; BOTH WARN READY TO RESUME; IRAN FIRED 24 BMS AT ISRAEL JUNE 7-8 (ALL INTERCEPTED); IDF STRUCK BEIRUT DAHIYEH JUNE 7 KILLING HEZBOLLAH INTEL CHIEF MAKLED; LEBANON TOLL ~3,640/~11,130; 60-DAY MOU STILL UNSIGNED; BRENT ~$95/BBL; PGSA OPERATIONAL; UKMTO 2026-041 IN EFFECT; IRGC BAB AL-MANDAB CLOSURE THREAT PERSISTS',
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
