// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News
export const houthiData = {
  updated: '2026-05-26',
  status: 'ACTIVE — MAY 26: CENTCOM STRIKES 2 IRGC MINE-LAYING BOATS IN HORMUZ + MISSILE LAUNCH SITES (SELF-DEFENSE); IRGC CLAIMS MQ-9 REAPER SHOT DOWN OVER PERSIAN GULF; IRGC WARNS OF RECIPROCAL RESPONSE; ARAGHCHI + GHALIBAF IN DOHA FOR 14-POINT MOU FRAMEWORK TALKS; BRENT ~$99/BBL (+3%; CNBC); LEBANON TOLL 3,185 KILLED / 9,633 WOUNDED; PGSA OPERATIONAL; UKMTO 2026-041 IN EFFECT; PENTAGON TALKS MAY 29; POLITICAL TALKS JUNE 2–3',
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
