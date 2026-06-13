// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News
export const houthiData = {
  updated: '2026-06-13',
  status: 'ACTIVE — JUNE 13 (DAY 106): PAKISTAN PM SHARIF CONFIRMS "FINAL AGREED TEXT" OF US-IRAN PEACE DEAL REACHED (JUNE 12); TRUMP CALLS IRAN "DISHONORABLE" OVER LEAKED TERMS; CENTCOM INTERCEPTS 2 IRAN DRONES IN HORMUZ; IDF STRIKES TYRE: 8 KILLED, 37 WOUNDED; LEBANON TOLL ~3,704/~11,450; NO NEW IRGC SALVO; DEAL SIGNING EXPECTED THIS WEEKEND IN EUROPE; BRENT ~$87/BBL',
  babAlMandab: {
    globalTradePct: 15,
    closureThreat: 'IRGC and Axis of Resistance resolve to activate Bab al-Mandab front (June 1) — Iran cites Israeli Lebanon ops as ceasefire violation; Houthis ordered to resume Red Sea shipping attacks if Hormuz deal collapses; Houthis fired 2 ballistic missiles at central Israel June 8 — first Houthi attack on Israel since April 8 ceasefire (Euronews, June 8); June 12 (Day 105): Pakistan PM Sharif announces final agreed text of US-Iran deal — deal signing expected this weekend in Europe, raising prospects of full Hormuz reopening; Houthi posture unchanged pending final signatures; June 13 (Day 106): no new Houthi attacks confirmed — ceasefire holding; deal expected this weekend',
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
