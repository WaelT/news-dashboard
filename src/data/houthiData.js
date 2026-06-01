// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News
export const houthiData = {
  updated: '2026-06-01',
  status: 'ACTIVE — JUNE 1 (DAY 93): CEASEFIRE HOLDS — NO NEW KINETIC EXCHANGE ON IRAN FRONT; CENTCOM: 118 VESSELS REDIRECTED, 5 DISABLED; NETANYAHU ORDERS IDF TO EXPAND LEBANON GROUND OP — LITANI CROSSED, ADVANCING TOWARD NABATIEH; HEZBOLLAH FIRES 25+ PROJECTILES AT N. ISRAEL (KARMIEL, SAFED); LEBANON TOLL 3,412 / 10,269; 60-DAY MOU STILL AWAITING TRUMP/KHAMENEI SIGN-OFF; BRENT ~$91/BBL; PGSA OPERATIONAL; UKMTO 2026-041 IN EFFECT; PENTAGON POLITICAL TALKS JUNE 2–3',
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
