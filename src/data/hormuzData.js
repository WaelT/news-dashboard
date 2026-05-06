// Strait of Hormuz situation data
// Sources: CENTCOM, US 5th Fleet, IRGC Navy statements, IMO, Lloyd's List Intelligence,
//          EIA (March 2026 STEO), IEA, UKMTO Advisory 2026-014, EMASoH, MarineTraffic AIS,
//          AP, Reuters, Al Jazeera, Operation Prosperity Guardian statements
export const hormuzData = {
  updated: '2026-05-06',

  current: {
    transitsPerDay: 55,
    oilFlowMbd: 10.5,
    disruptionPct: 42,
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
    seafarersStranded: 20000,
    vesselsAttacked: 14,
    seafarersKilled: 6,
    minesDetected: 12,
    minesFound: 12,
    minelayersDestroyed: 16,
    insuranceSurge: '+420%',
    tankerRates: '$385,000+/day (VLCC to Asia; doubled from pre-crisis levels)',
    trumpUltimatum: 'Project Freedom launched May 4 (5 ships total escaped under escort); PAUSED May 5 by Trump citing "great progress" on Iran deal; 6 IRGC fast-attack boats destroyed; Iran fired at US forces 10+ times since ceasefire — below restart threshold per Gen. Caine; May 6: Trump threatens "much higher level" bombing if Iran does not make a deal; Rubio declares "Operation Epic Fury over"',
    iranThreat: 'IRGC declares Hormuz "sovereign Iranian maritime zone"; warns all US warships will be engaged on sight; allies told not to provide staging for US Navy; FM Araghchi meets Wang Yi in Beijing — first China visit since war start; Iran demands full US withdrawal + end blockade before reopening Hormuz',
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
      detail: 'Jebel Ali container port at 72% throughput; Fujairah Petroleum Industries Zone struck by Iranian drone May 4 — fire extinguished, 3 Indian nationals injured; ADNOC rerouting Murban crude loadings; UAE intercepted 15 missiles + 4 drones in single-day barrage',
    },
    {
      country: 'Asia',
      detail: 'Japan, South Korea, India activating IEA strategic reserves; LNG spot price $43/MMBtu; South Korea 70% Hormuz-dependent; India diverting purchases to West Africa and the Americas',
    },
  ],
};
