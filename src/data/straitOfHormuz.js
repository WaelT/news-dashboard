// Strait of Hormuz — shipping, naval presence, and disruption tracker
// Sources: Wikipedia '2026 Strait of Hormuz crisis', CENTCOM press releases, CNN, PBS,
//          Al Jazeera, US 5th Fleet, UNCTAD, IMO, Lloyd's List, UKMTO, Insurance Journal
export const straitOfHormuz = {
  updated: '2026-05-04',

  status: 'CONTESTED — PROJECT FREEDOM ACTIVE',

  preWarDaily: {
    oilMbpd: 21,        // million barrels per day pre-war
    lngPctWorld: 25,    // % of global LNG through strait
    shipsPerDay: 90,    // vessels transiting daily (pre-war)
    oilPctWorld: 20,    // % of global oil supply
  },

  currentTraffic: {
    shipsPerDay: 12,           // as of May 2, 2026 (AIS data)
    pctOfPreWar: 13,           // % of pre-war transit volume
    darkActivityEvents: 176,   // AIS-dark vessel events May 2 (highest of crisis)
    stranded: 2000,            // ships stuck in Gulf
    seafarersAffected: 20000,
  },

  blockades: {
    irgcBlockade: {
      startDate: '2026-03-05',
      status: 'ACTIVE',
      description: 'IRGC selectively blocks US/Western/Israeli-linked vessels; toll corridor via Larak Island',
      tollUsd: 0,           // tolls eliminated for non-aligned vessels (Apr 24)
      inspectionRate: 'spot-checks only',
    },
    usNavalBlockade: {
      startDate: '2026-04-13',
      status: 'ACTIVE',
      description: 'US blockade of Iranian ports; "Project Freedom" escort mission launched May 4',
      operation: 'Project Freedom',
      personnel: 15000,
      aircraft: 100,
    },
  },

  navalPresence: [
    { force: 'US 5th Fleet', assets: '2 guided-missile destroyers + carrier strike group + 100+ aircraft', status: 'ACTIVE' },
    { force: 'IRGC Navy', assets: 'Fast-attack boats, coastal missile batteries, sea mines', status: 'ACTIVE' },
    { force: 'EMASoH/EMASOH', assets: 'EU naval mission; monitoring role; no escort mandate', status: 'OBSERVING' },
    { force: 'Operation Prosperity Guardian', assets: 'US-led coalition; escort missions paused during Hormuz crisis', status: 'PAUSED' },
    { force: 'UKMTO', assets: 'UK Maritime Trade Operations — advisory only in Gulf', status: 'ADVISORY' },
  ],

  recentIncidents: [
    {
      date: '2026-05-04',
      type: 'attack',
      description: 'Iran fires 4 cruise missiles + 8 drones at UAE and US commercial vessels in Hormuz; CENTCOM destroys 6 IRGC fast-attack boats',
      source: 'CENTCOM press release; Al Jazeera May 4',
    },
    {
      date: '2026-05-04',
      type: 'transit',
      description: '2 US-flagged merchant ships escort-transit Hormuz under Project Freedom; IRGC denies transit occurred',
      source: 'PBS News, CNN May 4',
    },
    {
      date: '2026-05-03',
      type: 'warning',
      description: 'Iranian military warns US to keep warships out of Hormuz; Trump announces Project Freedom',
      source: 'Al Jazeera, Stars & Stripes May 3',
    },
    {
      date: '2026-04-29',
      type: 'analysis',
      description: 'CNN: Hormuz traffic at ~12% of pre-war volume; queue of ~2,000 tankers in Gulf',
      source: 'CNN visual deep dive Apr 29',
    },
    {
      date: '2026-04-28',
      type: 'transit',
      description: 'Single oil tanker completes rare Hormuz transit; Iran-linked vessel category',
      source: 'WorldOil / Insurance Journal Apr 28',
    },
    {
      date: '2026-04-24',
      type: 'easing',
      description: 'IRGC eliminates Larak corridor transit tolls for non-aligned vessels; 65 ships/day at peak',
      source: 'diplomaticEvents entry Apr 24',
    },
    {
      date: '2026-04-13',
      type: 'escalation',
      description: 'US naval blockade of Iranian ports begins — "dual blockade" now in effect',
      source: 'NPR, Wikipedia',
    },
  ],

  insurance: {
    warRiskPremium: '2–3% of vessel value/voyage',
    trend: 'Elevated; Lloyd\'s halved Apr 16 but surged again post-May 4',
    lloydsSurveillanceStatus: 'HIGH RISK ZONE',
  },

  oilImpact: {
    brentPeakUsd: 116,
    brentCurrentUsd: 82,
    iaeaWarning: 'Greatest global energy security challenge in history',
    alternativeRoute: 'Cape of Good Hope — adds 6–14 days/voyage',
  },
};

export default straitOfHormuz;
