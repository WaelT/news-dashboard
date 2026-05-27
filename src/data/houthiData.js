// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News
export const houthiData = {
  updated: '2026-05-27',
  status: 'ACTIVE — MAY 27 PM: IDF STRIKES KILL 31 IN LEBANON (BURJ AL-SHAMALI 14, MAARAKEH 6, OTHERS); NABATIEH EVACUATED — CIVIL DEFENSE DESTROYED; HEZBOLLAH DRONES HIT NORTHERN ISRAEL; RUBIO: DEAL NEEDS "SEVERAL MORE DAYS"; IRAN: NO DEAL "IMMINENT"; $24B FROZEN ASSETS AT STAKE; 10 INDIAN SAILORS RELEASED FROM IRAN; LEBANON TOLL 3,244 / 9,777; BRENT ~$99/BBL; PGSA OPERATIONAL; UKMTO 2026-041 IN EFFECT; PENTAGON TALKS MAY 29',
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
