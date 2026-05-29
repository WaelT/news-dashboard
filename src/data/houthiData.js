// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News
export const houthiData = {
  updated: '2026-05-29',
  status: 'ACTIVE — MAY 29: US-IRAN TENTATIVE 60-DAY MOU — HORMUZ REOPEN (NO TOLLS), IRAN CLEARS MINES, US LIFTS BLOCKADE + SANCTIONS WAIVERS; TRUMP/KHAMENEI FINAL SIGN-OFF PENDING; VANCE: "STILL TBD"; IDF STRIKES SHUWAYFAT (BEIRUT) FIRST TIME IN 3 WEEKS — 3 KILLED; SIDON (5 KILLED), ADLOUN (6 KILLED); IRGC WARNING SHOTS AT 4 VESSELS IN HORMUZ; PENTAGON LEBANON TALKS UNDERWAY; LEBANON TOLL ~3,290 / ~9,962; BRENT ~$96–97/BBL; PGSA OPERATIONAL; UKMTO 2026-041 IN EFFECT',
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
