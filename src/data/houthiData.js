// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News, Long War Journal, UANI, gCaptain
export const houthiData = {
  updated: '2026-06-27',
  status: 'CEASEFIRE — JUNE 27 (DAY 120): HOUTHI CEASEFIRE DAY 3 — 15TH CONSECUTIVE QUIET DAY; NO CONFIRMED HOUTHI ATTACKS SINCE MV VERBENA JUNE 13; MARAD ADVISORY 2026-006 LIFTED; BAB AL-MANDAB FULLY OPEN — NORMAL SHIPPING OPERATIONS AT FULL PACE; BRENT ~$70–71/BBL; US GAS PRICES ~$3.15–3.20/GAL (4-YEAR LOW); 60-DAY FOLLOW-ON TALKS ORGANIZING IN ROME — HOUTHI PROXY SUPPORT COMPONENT ON AGENDA; IAEA DG GROSSI IN TEHRAN FOR INSPECTION DISCUSSIONS UNDER MOU FRAMEWORK',
  babAlMandab: {
    globalTradePct: 15,
    closureThreat: 'IRGC and Axis of Resistance resolve to activate Bab al-Mandab front (June 1) — Iran cites Israeli Lebanon ops as ceasefire violation; Houthis resumed Red Sea shipping attacks June 7 after ~2-month pause since Gaza ceasefire Oct 2025; June 7: Houthis launch 4 ASBMs targeting Red Sea shipping; June 8: 2 BMs at central Israel (first Houthi Israel strike since April 8 ceasefire) + MV Norderney struck (anti-ship ballistic missile hit, crew evacuated); June 9: MV Tavvishi struck by 2 ASBMs, 1 Eilat-bound drone intercepted; June 12: MV Tutor sunk — first Houthi sinking since Oct 2025 Gaza ceasefire; USV combined with 2 ASBM attack; June 13: MV Verbena struck by 2 ASCMs (anti-ship cruise missiles); June 14 (Day 107): no new Houthi attacks confirmed; June 15 (Day 108): Trump announces US-Iran deal "Now Complete" — Houthis have not formally declared ceasefire; MARAD Advisory 2026-006 remains in effect; June 16–19 (Days 109–112): no new confirmed Houthi attacks — quiet days continuing; June 19: MOU signed at Burgenstock by VP Vance + Ghalibaf; 7th consecutive Houthi quiet day; formal ceasefire declaration expected within 24–48h; Houthi spokesman Mohammed Al-Bukhaiti signals Houthis will "reassess posture" once Gaza component addressed in 60-day follow-on talks; June 23 (Day 116): Iran-Israel ceasefire announced by Trump; June 24 (Day 117, ceasefire Day 1): Iran formally ceases hostilities; 12th consecutive Houthi quiet day — formal declaration imminent per Al-Bukhaiti; June 25 (Day 118, ceasefire Day 2): Houthi spokesman Mohammed Al-Bukhaiti formally announces Houthi Armed Forces ceasefire declaration; MARAD Advisory 2026-006 lifted following formal Houthi declaration; June 26 (Day 119, ceasefire Day 3): 14th consecutive quiet day; Bab al-Mandab shipping resuming normal operations; June 27 (Day 120, ceasefire Day 4): 15th consecutive quiet day; Bab al-Mandab at full commercial traffic pace — major shipping lines resuming Red Sea schedules; LNG tankers transiting without escort; Houthi proxy support component to be addressed in Rome 60-day follow-on talks (MARAD Advisory 2026-006, Long War Journal, UANI, gCaptain, Euronews, RFERL, Al Jazeera, June 7–27)',
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
    redSeaReturn: 'Fully resumed — MARAD 2026-006 lifted June 25; war-risk insurance normalized; Bab al-Mandab fully open; major shipping lines resuming Red Sea schedules (Day 4: June 27)',
  },
  capabilities: {
    antiShipBallistic: true,
    seaSkimmingCruise: true,
    uwDrones: true,
    rangeKm: 200,
    note: 'Iranian-supplied ASBM with 200km range; can hit anywhere in southern Red Sea',
  },
};
