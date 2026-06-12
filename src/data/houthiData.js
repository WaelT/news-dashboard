// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News
export const houthiData = {
  updated: '2026-06-12',
  status: 'ACTIVE — JUNE 12 (DAY 105): TRUMP ANNOUNCES "GREAT SETTLEMENT" WITH IRAN (JUNE 11 EVENING) — SIGNING POSSIBLY IN EUROPE "WITHIN DAYS"; IRAN FM CALLS IT "SPECULATION"; NO NEW IRGC KINETIC EXCHANGES; CEASEFIRE HOLDING AHEAD OF DEAL; DARK FLEET AT ~7 TRANSITS/DAY; LEBANON TOLL 3,696/11,413; IRGC BAB AL-MANDAB CLOSURE THREAT PERSISTS; PGSA OPERATIONAL; BRENT ~$90/BBL',
  babAlMandab: {
    globalTradePct: 15,
    closureThreat: 'IRGC and Axis of Resistance resolve to activate Bab al-Mandab front (June 1) — Iran cites Israeli Lebanon ops as ceasefire violation; Houthis ordered to resume Red Sea shipping attacks if Hormuz deal collapses; Houthis fired 2 ballistic missiles at central Israel June 8 — first Houthi attack on Israel since April 8 ceasefire (Euronews, June 8); June 12 (Day 105): threat persists but ceasefire holding as Trump "great settlement" deal announcement (June 11 evening) raises prospects of full Hormuz reopening — Houthi posture unchanged pending final deal signing',
  },
  attacks: {
    totalLaunched: 14,
    missilesAtIsrael: 8,
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
