// Houthi/Bab al-Mandab tracker data
// Sources: CENTCOM, Al Jazeera, USNI News, Alma Center, MARAD Advisory 2026-006,
//          Gulf News, The Middle East Insider, NBC News, Long War Journal, UANI, gCaptain
export const houthiData = {
  updated: '2026-06-25',
  status: 'CEASEFIRE — JUNE 25 (DAY 118): HOUTHIS FORMALLY DECLARE CEASEFIRE — SPOKESMAN AL-BUKHAITI CONFIRMS HOUTHI ARMED FORCES CEASEFIRE DECLARATION JUNE 25; 13TH CONSECUTIVE QUIET DAY; MARAD ADVISORY 2026-006 LIFTED FOLLOWING FORMAL HOUTHI DECLARATION; NO CONFIRMED HOUTHI ATTACKS SINCE MV VERBENA JUNE 13; CEASEFIRE DAY 2 IN EFFECT — ALL FRONTS QUIET; BRENT ~$74–76/BBL; BAB AL-MANDAB SHIPPING RESUMING NORMAL OPERATIONS; 60-DAY FOLLOW-ON TALKS TO COVER HOUTHI PROXY SUPPORT COMPONENT',
  babAlMandab: {
    globalTradePct: 15,
    closureThreat: 'IRGC and Axis of Resistance resolve to activate Bab al-Mandab front (June 1) — Iran cites Israeli Lebanon ops as ceasefire violation; Houthis resumed Red Sea shipping attacks June 7 after ~2-month pause since Gaza ceasefire Oct 2025; June 7: Houthis launch 4 ASBMs targeting Red Sea shipping; June 8: 2 BMs at central Israel (first Houthi Israel strike since April 8 ceasefire) + MV Norderney struck (anti-ship ballistic missile hit, crew evacuated); June 9: MV Tavvishi struck by 2 ASBMs, 1 Eilat-bound drone intercepted; June 12: MV Tutor sunk — first Houthi sinking since Oct 2025 Gaza ceasefire; USV combined with 2 ASBM attack; June 13: MV Verbena struck by 2 ASCMs (anti-ship cruise missiles); June 12 (Day 105): Pakistan PM Sharif announces final agreed text of US-Iran deal — Houthi posture unchanged pending final signatures; June 14 (Day 107): no new Houthi attacks confirmed; June 15 (Day 108): Trump announces US-Iran deal "Now Complete" and authorizes end to US naval blockade — Houthis have not formally declared ceasefire; MARAD Advisory 2026-006 remains in effect; Houthi posture likely to depend on formal signing June 19 and whether deal includes Gaza component demanded by Iran; June 16–17 (Days 109–110): no new confirmed Houthi attacks — 4th consecutive quiet day; MARAD Advisory 2026-006 remains in effect; Houthis expected to formally respond to deal framework after June 19 Switzerland signing; June 18 (Day 111): 5th consecutive quiet day — T-1 before signing; June 19 (Day 112): MOU signed at Burgenstock by VP Vance + Ghalibaf; 7th consecutive Houthi quiet day; formal ceasefire declaration expected within 24–48h; MARAD Advisory 2026-006 still in effect pending Houthi statement; Houthi spokesman Mohammed Al-Bukhaiti signals Houthis will "reassess posture" once Gaza component is addressed in 60-day follow-on talks (MARAD Advisory 2026-006, Long War Journal, UANI, gCaptain, Euronews, RFERL, Al Jazeera, June 7–19)',
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
