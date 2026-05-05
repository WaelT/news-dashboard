// Strait of Hormuz situation data
// Sources: CENTCOM, US 5th Fleet, IRGC Navy statements, IMO, Lloyd's List Intelligence,
//          EIA (March 2026 STEO), IEA, UKMTO Advisory 2026-014, EMASoH, MarineTraffic AIS,
//          AP, Reuters, Al Jazeera, Operation Prosperity Guardian statements
export const hormuzData = {
  updated: '2026-05-05',

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
    seafarersStranded: 19000,
    vesselsAttacked: 14,
    seafarersKilled: 6,
    minesDetected: 12,
    minesFound: 12,
    minelayersDestroyed: 16,
    insuranceSurge: '+380%',
    tankerRates: '$95,000/day',
    trumpUltimatum: 'Project Freedom launched May 4 — CENTCOM convoy escorts active; Iran fired on US-escorted vessels; 6 IRGC fast-attack boats destroyed by USS Gravely',
    iranThreat: 'IRGC declares Hormuz "sovereign Iranian maritime zone"; warns all US warships will be engaged on sight; allies told not to provide staging for US Navy',
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
      detail: 'Jebel Ali container port at 72% throughput; ADNOC rerouting Murban crude loadings via Fujairah anchorage; bunkering at Khor Fakkan limited by security screening protocols',
    },
    {
      country: 'Asia',
      detail: 'Japan, South Korea, India activating IEA strategic reserves; LNG spot price $43/MMBtu; South Korea 70% Hormuz-dependent; India diverting purchases to West Africa and the Americas',
    },
  ],
};
