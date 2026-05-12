// Strait of Hormuz situation data
// Sources: CENTCOM, US 5th Fleet, IRGC Navy statements, IMO, Lloyd's List Intelligence,
//          EIA (March 2026 STEO), IEA, UKMTO Advisory 2026-014, EMASoH, MarineTraffic AIS,
//          AP, Reuters, Al Jazeera, Operation Prosperity Guardian statements,
//          Kpler (May 7 2026), CNBC (May 6-12 2026), NBC News (May 6-12 2026),
//          CENTCOM (May 7-12 2026), CBS News (May 8-12 2026), PBS NewsHour (May 9-12 2026),
//          Al Jazeera (May 8-12 2026), UPI/GlobalSecurity (May 8 2026), Al-Monitor/ITV (May 9 2026),
//          Misbar/MarineTraffic AIS (May 11 2026 — first Qatari LNG tanker transit), Bloomberg (May 11 2026),
//          CNBC (May 11 2026 — Saudi Aramco CEO Nasser: market won't normalize until 2027 if Hormuz closed past mid-June; 880M bbls lost)
export const hormuzData = {
  updated: '2026-05-12',

  current: {
    transitsPerDay: 8,
    oilFlowMbd: 1.2,
    disruptionPct: 93,
  },

  preWar: {
    transitsPerDay: 90,
    oilFlowMbd: 18.1,
    globalOilPct: 20,
    globalLngPct: 18,
  },

  crisis: {
    tankersQueued: 295,
    vesselsStranded: 1900,    // JCS Gen. Caine confirmed 1,550+ on May 6; higher estimates account for subsequent arrivals
    seafarersStranded: 22500,
    vesselsAttacked: 16,
    seafarersKilled: 6,
    minesDetected: 12,
    minesFound: 12,
    minelayersDestroyed: 16,
    insuranceSurge: '+420%',
    tankerRates: '$385,000+/day (VLCC to Asia; doubled from pre-crisis levels)',
    trumpUltimatum: 'Project Freedom launched May 4 (5 ships total escaped under escort); PAUSED May 5 by Trump citing "great progress" on Iran deal; 6 IRGC fast-attack boats destroyed; May 6: Trump threatens "much higher level" bombing if Iran does not make a deal; Rubio declares "Operation Epic Fury over"; May 7: CENTCOM-IRGC exchange — Iran attacked USS Truxtun, USS Rafael Peralta, USS Mason with missiles, drones, small boats; US responds with self-defense strikes on launch sites; US strikes Iranian tanker M/T Hasna for violating blockade; US-Iran nearing one-page MoU — moratorium on enrichment (10+ yr), Hormuz protocol, frozen assets released, 30-day war-end window; Iran reply delivered via Pakistan; Brent at ~$99 on deal hopes; May 8: Trump says war will be "over quickly"; US disables M/T Sea Star III and M/T Sevda (F/A-18 from USS George H.W. Bush fires precision munitions into smokestacks, Gulf of Oman); Iran seizes Barbados-flagged tanker Ocean Koi in Gulf of Oman claiming it was disrupting Iranian oil exports; 70+ tankers now blocked from Iranian ports by US forces (166M bbls/$13B+); May 9: Iran MoU response still pending — FM spokesperson Baqaei: "US proposal still under review; Iran will convey position to Pakistan side"; ceasefire extended with May 17 deadline; UK deploys Type 45 destroyer HMS Dragon to Middle East for potential post-ceasefire Hormuz escort mission alongside France carrier strike group; Brent at ~$101; 12-year enrichment moratorium emerging as compromise; May 10: Iran formally responds to US MoU via Pakistan mediators — Trump rejects it on Truth Social as "TOTALLY UNACCEPTABLE"; Iran demands Hormuz remain under Iranian control, war-end guarantee via UNSC, and rejects 12-yr enrichment moratorium; Iran drones strike cargo vessel near Mesaieed port (Qatar), UAE intercepts 2 drones, Kuwait repels multiple drones; deal at impasse — May 17 deadline 6 days away; May 11: Trump calls ceasefire "on massive life support" after rejecting Iran counter-proposal as "garbage"; US Treasury sanctions 12 entities (Iran/Hong Kong/UAE/Oman) for selling Iranian oil to China — IRGC front companies targeted ahead of Trump-Xi summit May 14–15; first Qatari LNG tanker transits Hormuz (MarineTraffic AIS confirmed); May 10 saw 17 vessels transit (13 in, 4 out); Brent surges to $104; May 12: talks at impasse — Pakistan continues to mediate; US counter-offer not yet delivered; May 17 deadline now 5 days away; ~8 vessels/day average transiting',
    iranThreat: 'IRGC declares Hormuz "sovereign Iranian maritime zone"; warns all US warships will be engaged on sight; FM Araghchi meets Wang Yi in Beijing May 6 — China demands "comprehensive ceasefire" ahead of Trump-Xi summit May 14; Araghchi: "will only accept fair and comprehensive agreement"; May 7: IRGC attacked 3 US destroyers with missiles, drones, and FABs — no US vessels struck; IRGC signals safe transit "possible under new procedures" contingent on deal; Iran reviewing US one-page MoU; response expected via Pakistan; May 8: Iran seizes Ocean Koi (Barbados-flagged) in Gulf of Oman; Iran expected to formally respond to MoU; ~170M bbls crude stranded on 166 tankers (Kpler); strait effectively closed — only 6 vessels/day average since May 4; May 9: Iran vows "heavy assault" against US assets in Middle East if more Iranian vessels are attacked during ceasefire; Iran MoU response still pending — IRGC continues shadow operations in strait; Iran shows "surprising openness" on transferring HEU stockpile to third country per US officials; Iran insists nuclear enrichment is "non-negotiable red line" but signals flexibility on Hormuz protocol; ceasefire deadline May 17; May 10: Iran formally delivers MoU response via Pakistan — rejects US enrichment terms, demands Hormuz remain under Iranian control and a binding UNSC ceasefire guarantee; Trump calls response "TOTALLY UNACCEPTABLE"; Iran also launches drone barrage at UAE (2 intercepted), Kuwait (multiple repelled), Qatar (cargo vessel struck near Mesaieed); May 11: Iran vows to "fight on" as Trump calls ceasefire "on massive life support"; Iranian senior military warns countries enforcing sanctions that they will "face problems" transiting Hormuz; Iran rejects staggered US nuclear demands — proposes deferring nuclear talks until after war-end declaration; May 12: No new kinetic exchange in strait overnight; deal impasse continues; UKMTO advisory 2026-041 remains in effect; Iran has forced 48+ US-blockaded ships to turn around over past 20 days; May 17 deadline now 5 days away',
  },

  disruptions: [
    {
      country: 'Saudi Arabia',
      detail: 'East-West Yanbu pipeline restored Apr 20 (4.6M bpd); Red Sea crude exports ~85% of pre-war capacity; Aramco routing select cargoes via Cape of Good Hope as contingency',
    },
    {
      country: 'Iraq',
      detail: 'Basra crude exports via Khor al-Amaya SPM under US Navy escort; Iraq-Turkey Ceyhan pipeline at 68% capacity; SOMO offering extended payment terms to Asian spot buyers',
    },
    {
      country: 'UAE',
      detail: 'Jebel Ali container port at 72% throughput; Fujairah Petroleum Industries Zone struck by Iranian drone May 4 — fire extinguished, 3 Indian nationals injured; ADNOC rerouting Murban crude loadings; UAE intercepted 15 missiles + 4 drones in single-day barrage; US struck Iranian tanker M/T Hasna near Strait for violating US naval blockade (May 7); US F/A-18 from USS George H.W. Bush disables M/T Sea Star III and M/T Sevda in Gulf of Oman (May 8) — both attempting to evade blockade',
    },
    {
      country: 'Asia',
      detail: 'Japan, South Korea, India activating IEA strategic reserves; LNG spot price $43/MMBtu; South Korea 70% Hormuz-dependent; India diverting purchases to West Africa and Americas; ~170M barrels stranded on 166 tankers (Kpler May 7); Brent ~$105 (May 12) after Trump calls ceasefire "on massive life support"; Saudi Aramco CEO Amin Nasser warns oil market will not normalize until 2027 if Hormuz remains closed past mid-June — conflict has destroyed ~880M barrels of supply (100M/week); global inventories at 8-year low (Goldman Sachs); US gas price $4.46/gal; first Qatari LNG tanker transited Hormuz May 11 (MarineTraffic AIS); May 10 saw 17 vessels transit (13 in, 4 out) — uptick from 6/day average since May 4; UK HMS Dragon + French carrier strike group pre-positioning for post-ceasefire escort; Trump departs for Beijing (Trump-Xi summit May 13–15) — Iran/Hormuz top agenda; Houthi drone intercepted near Eilat May 12',
    },
  ],
};
