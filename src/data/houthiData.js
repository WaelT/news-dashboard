// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News, Long War Journal, UANI, gCaptain
export const houthiData = {
  updated: '2026-06-14',
  status: 'ACTIVE — JUNE 14 (DAY 107): HOUTHIS RESUMED RED SEA ATTACKS JUNE 7 AFTER ~2-MONTH PAUSE; MV NORDERNEY STRUCK JUNE 8, MV TAVVISHI JUNE 9, MV TUTOR SUNK JUNE 12 (USV+ASBM COMBO), MV VERBENA STRUCK JUNE 13 (ASCM); 4 SHIPS ATTACKED IN 7 DAYS; US-IRAN DEAL TEXT AGREED (PAKISTAN PM SHARIF JUNE 12) BUT UNSIGNED; NO NEW HOUTHI ATTACKS JUNE 14; DEAL SIGNING EXPECTED IN EUROPE THIS WEEKEND',
  babAlMandab: {
    globalTradePct: 15,
    closureThreat: 'IRGC and Axis of Resistance resolve to activate Bab al-Mandab front (June 1) — Iran cites Israeli Lebanon ops as ceasefire violation; Houthis resumed Red Sea shipping attacks June 7 after ~2-month pause since Gaza ceasefire Oct 2025; June 7: Houthis launch 4 ASBMs targeting Red Sea shipping; June 8: 2 BMs at central Israel (first Houthi Israel strike since April 8 ceasefire) + MV Norderney struck (anti-ship ballistic missile hit, crew evacuated); June 9: MV Tavvishi struck by 2 ASBMs, 1 Eilat-bound drone intercepted; June 12: MV Tutor sunk — first Houthi sinking since Oct 2025 Gaza ceasefire; USV combined with 2 ASBM attack; June 13: MV Verbena struck by 2 ASCMs (anti-ship cruise missiles); June 12 (Day 105): Pakistan PM Sharif announces final agreed text of US-Iran deal — Houthi posture unchanged pending final signatures; June 14 (Day 107): no new Houthi attacks confirmed — ceasefire holding; deal expected this weekend (MARAD Advisory 2026-006, Long War Journal, UANI, gCaptain, Euronews, June 7–14)',
  },
  attacks: {
    totalLaunched: 29,
    missilesAtIsrael: 10,
    dronesAtIsrael: 4,
    attacksOnShipping: 7,
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
