// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News
export const houthiData = {
  updated: '2026-06-02',
  status: 'ACTIVE — JUNE 2 (DAY 94): IRAN SUSPENDS ALL TALKS WITH US VIA MEDIATORS (TASNIM/IRGC, JUNE 1) — CITES ISRAELI "CONTINUING CRIMES" IN LEBANON; IRGC THREATENS FULL HORMUZ CLOSURE + BAB AL-MANDAB ACTIVATION; OIL SURGES 7%+ (BRENT ~$97/BBL); TRUMP SAYS TALKS "BACK ON AT RAPID PACE"; HEZBOLLAH FIRES BALLISTIC MISSILE AT ASHDOD NAVAL BASE; IDF DOCTOR KILLED BY HEZBOLLAH FPV DRONE IN ZAWTAR AL-SHARQIYAH; 19 KILLED IN NABATIEH INCL. 13 LEBANESE STATE SECURITY; PENTAGON LEBANON POLITICAL TALKS JUNE 2–3 ONGOING; 60-DAY MOU STILL UNSIGNED',
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
