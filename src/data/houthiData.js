// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News
export const houthiData = {
  updated: '2026-06-06',
  status: 'ACTIVE — JUNE 6 (DAY 99): CENTCOM SHOOTS DOWN 4 IRANIAN DRONES OVER HORMUZ (SELF-DEFENSE ACTION); CEASEFIRE FRAGILE AND VIOLATED BY BOTH SIDES; TRUMP SAYS DEAL REACHABLE "THIS WEEKEND" — IRAN FM CONTRADICTS, SAYS NO "SIGNIFICANT PROGRESS"; 60-DAY MOU STILL UNSIGNED; LEBANON TOLL 3,516/10,674; BRENT ~$97/BBL; PGSA OPERATIONAL; UKMTO 2026-041 IN EFFECT; IRGC AXIS OF RESISTANCE BAB AL-MANDAB CLOSURE THREAT PERSISTS',
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
