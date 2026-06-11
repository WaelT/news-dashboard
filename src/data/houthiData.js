// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News
export const houthiData = {
  updated: '2026-06-11',
  status: 'ACTIVE — JUNE 11 (DAY 104): IRGC FIRES 3 MISSILES + 6 DRONES AT BAHRAIN/KUWAIT — ALL 9 INTERCEPTED; IRAN/ISRAEL DIRECT STRIKE HALT HOLDS 3RD DAY; IRAN DECLARED HORMUZ "CLOSED TO ALL VESSELS" JUNE 10 — CENTCOM DISPUTES; DARK FLEET AT ~7–8 TRANSITS/DAY; 60-DAY MOU STALLED; HOUTHIS FIRED 2 BMS AT CENTRAL ISRAEL (JUNE 8); IRGC BAB AL-MANDAB CLOSURE THREAT PERSISTS; PGSA OPERATIONAL; BRENT ~$97/BBL',
  babAlMandab: {
    globalTradePct: 15,
    closureThreat: 'IRGC and Axis of Resistance resolve to activate Bab al-Mandab front (June 1) — Iran cites Israeli Lebanon ops as ceasefire violation; Houthis ordered to resume Red Sea shipping attacks if Hormuz deal collapses; Houthis fired 2 ballistic missiles at central Israel June 8 — first Houthi attack on Israel since April 8 ceasefire (Euronews, June 8)',
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
