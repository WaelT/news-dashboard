// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News
export const houthiData = {
  updated: '2026-06-07',
  status: 'ACTIVE — JUNE 7 (DAY 100): CEASEFIRE FRAGILE; JUNE 6: IRAN FIRES 7 BMS AT KUWAIT/BAHRAIN (6 INTERCEPTED) + 4 DRONES TOWARD HORMUZ — CENTCOM SELF-DEFENSE STRIKES GORUK/QESHM; 60-DAY MOU STILL UNSIGNED; TRUMP "THIS WEEKEND" DEADLINE UNMET; IRAN FM: NO "SIGNIFICANT PROGRESS"; LEBANON TOLL 3,593/10,990 (JUNE 6); BRENT ~$93.71/BBL; PGSA OPERATIONAL; UKMTO 2026-041 IN EFFECT; IRGC BAB AL-MANDAB CLOSURE THREAT PERSISTS (JUNE 1 THREAT STANDS)',
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
