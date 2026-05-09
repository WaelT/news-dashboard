// Strait of Hormuz situation data
// Sources: CENTCOM, US 5th Fleet, IRGC Navy statements, IMO, Lloyd's List Intelligence,
//          EIA (March 2026 STEO), IEA, UKMTO Advisory 2026-014, EMASoH, MarineTraffic AIS,
//          AP, Reuters, Al Jazeera, Operation Prosperity Guardian statements,
//          Kpler (May 7 2026), CNBC (May 6-9 2026), NBC News (May 6-9 2026),
//          CENTCOM (May 7-9 2026), CBS News (May 8-9 2026), PBS NewsHour (May 9 2026)
export const hormuzData = {
  updated: '2026-05-09',

  current: {
    transitsPerDay: 6,
    oilFlowMbd: 1.0,
    disruptionPct: 94,
  },

  preWar: {
    transitsPerDay: 90,
    oilFlowMbd: 18.1,
    globalOilPct: 20,
    globalLngPct: 18,
  },

  crisis: {
    tankersQueued: 295,
    vesselsStranded: 1900,
    seafarersStranded: 22500,
    vesselsAttacked: 16,
    seafarersKilled: 6,
    minesDetected: 12,
    minesFound: 12,
    minelayersDestroyed: 16,
    insuranceSurge: '+420%',
    tankerRates: '$385,000+/day (VLCC to Asia; doubled from pre-crisis levels)',
    trumpUltimatum: 'Project Freedom launched May 4 (5 ships total escaped under escort); PAUSED May 5 by Trump citing "great progress" on Iran deal; 6 IRGC fast-attack boats destroyed; May 6: Trump threatens "much higher level" bombing if Iran does not make a deal; Rubio declares "Operation Epic Fury over"; May 7: CENTCOM-IRGC exchange — Iran attacked USS Truxtun, USS Rafael Peralta, USS Mason with missiles, drones, small boats; US responds with self-defense strikes on launch sites; US strikes Iranian tanker M/T Hasna for violating blockade; US-Iran nearing one-page MoU — moratorium on enrichment (10+ yr), Hormuz protocol, frozen assets released, 30-day war-end window; Iran reply delivered via Pakistan; Brent at ~$99 on deal hopes; May 8: Trump says war will be "over quickly"; Iran expected to formally respond to MoU within 48 hours; May 9: Iran MoU response still pending — FM spokesperson Baqaei: "US proposal still under review; Iran will convey position to Pakistan side"; ceasefire extended with May 17 deadline; State Dept announces Israel-Lebanon peace talks May 14-15; Brent at ~$101; 12-year enrichment moratorium emerging as compromise',
    iranThreat: 'IRGC declares Hormuz "sovereign Iranian maritime zone"; warns all US warships will be engaged on sight; FM Araghchi meets Wang Yi in Beijing May 6 — China demands "comprehensive ceasefire" ahead of Trump-Xi summit May 14; Araghchi: "will only accept fair and comprehensive agreement"; May 7: IRGC attacked 3 US destroyers with missiles, drones, and FABs — no US vessels struck; IRGC signals safe transit "possible under new procedures" contingent on deal; Iran reviewing US one-page MoU; response expected via Pakistan; May 8: Iran expected to formally respond to MoU; ~170M bbls crude stranded on 166 tankers (Kpler); strait effectively closed — only 6 vessels/day average since May 4; May 9: Iran MoU response still pending — IRGC continues shadow operations in strait; Iran shows "surprising openness" on transferring HEU stockpile to third country per US officials; Iran insists nuclear enrichment is "non-negotiable red line" but signals flexibility on Hormuz protocol; ceasefire deadline May 17',
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
      detail: 'Jebel Ali container port at 72% throughput; Fujairah Petroleum Industries Zone struck by Iranian drone May 4 — fire extinguished, 3 Indian nationals injured; ADNOC rerouting Murban crude loadings; UAE intercepted 15 missiles + 4 drones in single-day barrage; US struck Iranian tanker M/T Hasna near Strait for violating US naval blockade (May 7)',
    },
    {
      country: 'Asia',
      detail: 'Japan, South Korea, India activating IEA strategic reserves; LNG spot price $43/MMBtu; South Korea 70% Hormuz-dependent; India diverting purchases to West Africa and Americas; ~170M barrels stranded on 166 tankers (Kpler May 7); Brent ~$101 (May 9) as Iran MoU response still pending; global inventories at 8-year low (Goldman Sachs); US gas price $4.46/gal; strait near-closed since May 4 — only ~6 vessels/day average vs pre-war 90/day',
    },
  ],
};
