// Global economic impact data
// Sources: IEA, World Bank (Apr 28), IMF (Apr 2026 REO), Goldman Sachs, Oxford Economics, Bloomberg,
//          TradingEconomics (May 7 2026), CNBC (May 6-19 2026), NBC News (May 6-19 2026), CBC News (May 6 2026),
//          CENTCOM (May 7-19 2026), Al Jazeera (May 9-19 2026), PBS NewsHour (May 9-19 2026),
//          Bloomberg (May 11-19 2026 — US sanctions 12 Iran oil entities; ~2 mbd crude now transiting Hormuz),
//          CNBC (May 11 2026 — Saudi Aramco CEO Nasser; market won't normalize until 2027 if Hormuz closed past mid-June),
//          AP/Reuters (May 14-16 2026 — Trump-Xi summit concludes; Israel-Lebanon 45-day ceasefire extension),
//          The Star/Reuters (May 15-16 2026 — Brent ~$107-108; US gas $4.53/gal; Iran PGSA toll plan; Trump extends ceasefire indefinitely),
//          NPR/Arab News/Maritime Executive (May 14-16 2026 — Persian Gulf Strait Authority operational; Hormuz toll fees up to $2M),
//          CNN/CBS/Bloomberg (May 18 2026 — Trump "Clock is Ticking"; Brent futures ~$111.19; IRGC seizes vessel + sinks ship near Oman),
//          Times of Israel/countryeconomy.com (May 19 2026 — Trump signals 20-year enrichment offer; Brent ~$107.71 May 18 close; Lebanon toll 3,020+),
//          NPR/CBS News/NBC News (May 22 2026 — House GOP pulls War Powers Resolution vote; Senate advances after Cassidy flip),
//          CNN/Business Standard (May 21-22 2026 — Iran rebuilding drone/missile capability faster than expected; ~50% drone capability intact),
//          Washington Times/NBC News/CNBC/CNN/Fortune/NPR/PBS (May 23-24 2026 — Trump: deal "largely negotiated"; 14-point MOU; Hormuz reopening; Brent ~$97),
//          Wikipedia/UAE Defense Ministry/CENTCOM/Al Jazeera (May 25-26 2026 — Iran fires 2 BMs + 3 drones at UAE; US-IRGC Hormuz exchange; Araghchi + Ghalibaf Doha talks; Brent ~$99),
//          CENTCOM/PressTV/Reuters/CNBC (May 26 2026 — CENTCOM strikes 2 IRGC mine-laying boats; IRGC claims MQ-9 Reaper shot down; Lebanon 3,185 killed / 9,633 wounded)
//          ABC News/CBS News/Rubio/NetBlocks/RFERL/WashPost (May 27 2026 — Iranian delegation returns from Doha; Rubio "work in progress"; Iran internet partially restored; IDF beyond yellow line; Lebanon 3,213 killed / 9,737 wounded; Brent ~$99)
//          ABC News/Reuters/CBS News/PBS/CENTCOM (May 28 2026 — CENTCOM new airstrikes near Bandar Abbas; Iran accuses US "grave violation"; Trump "negotiating on fumes" Cabinet meeting; Iran-US broad principles agreed; Iran in principle agrees to HEU disposal; Khamenei endorsed template; Lebanon 3,275/9,926; Brent ~$99)
export const globalImpact = {
  updated: '2026-05-28',
  gdpImpact: [
    { region: 'Iran', flag: 'ir', pct: -22.0, costBn: 0, note: 'Economy near-collapse; oil exports halted; PGSA collecting Hormuz transit fees (up to $2M/ship in CNY); Kharg Island ~71 sq km oil slick (~80,000 bbls); drone production already resuming (CIA, May 21); ~50% drone capability intact; ~2/3 missile launchers survived; Russia + China reconstitution support; internet partially restored after 88-day blackout (May 27); Iran in principle agrees to HEU disposal (CBS News, May 28); Khamenei endorsed broad deal template; US accuses Iran of "grave violation" after CENTCOM Bandar Abbas strikes; $24B frozen assets at stake; PGSA operational' },
    { region: 'Israel', flag: 'il', pct: -5.8, costBn: 26, note: 'Mobilization + Lebanon ops + reconstruction; Lebanon ceasefire extended 45 days (to ~July 1) — IDF continues strikes; Lebanon toll 3,275 killed, 9,926 wounded (updated May 28); IDF operations north of yellow line continuing; Lebanese Health Ministry: 31 killed / 149 wounded overnight May 27–28; Hezbollah drone activity in northern Israel sectors' },
    { region: 'GCC', flag: 'sa', pct: -3.8, costBn: 64, note: 'Infrastructure + oil revenue + Hormuz loss; Aramco CEO: market won\'t normalize until 2027 if Hormuz closed past mid-June; Bloomberg: ~2.1 mbd crude flow; PGSA fees apply to GCC-linked tankers; May 25: Iran fires 2 BMs + 3 drones at UAE (all intercepted; 3 UAE civilians wounded); May 26: CENTCOM destroys 2 IRGC mine-laying boats; May 27: ceasefire holds — Brent ~$99/bbl stabilizing; Khamenei Hajj message warns Gulf states will "no longer be a shield for American bases"' },
    { region: 'Japan', flag: 'jp', pct: -1.1, costBn: 10, note: '80% oil via Hormuz; LNG rerouting; Eneos-managed tanker transits Hormuz May 15 (LSEG); deal framework agreed May 24 — Japan closely monitoring formal Hormuz reopening announcement' },
    { region: 'EU', flag: 'eu', pct: -0.8, costBn: 18, note: 'Energy import surge; IMF cut to 1.1% growth; Israel-Lebanon 45-day extension eases some fears; Brent ~$97/bbl (deal hope dip from $113 peak); deal framework agreed May 24 may signal gradual Hormuz reopening' },
    { region: 'India', flag: 'in', pct: -0.7, costBn: 9, note: '60% oil via Gulf; Indian cargo vessel sunk off Oman by IRGC May 15; India-UAE defence pacts signed May 15; diverting purchases to West Africa and Americas; watching deal announcement for PGSA fee status' },
    { region: 'US', flag: 'us', pct: -0.5, costBn: 70, note: '~$1.1B/day military; May 28: CENTCOM new airstrikes near Bandar Abbas (self-defense); Trump Cabinet "Iran negotiating on fumes", "time is on our side"; Iran-US agreed "broad principles" — Iran in principle agrees to HEU disposal; Khamenei endorsed template; Brent ~$99/bbl; gas ~$4.50/gal; Pentagon talks May 29; political talks June 2–3' },
    { region: 'China', flag: 'cn', pct: -0.5, costBn: 13, note: '45% oil via Hormuz; paying Iranian PGSA fees in yuan; 12 entities sanctioned May 12; summit concluded May 15 — Xi pledges no military equipment to Iran; Bessent: China "working behind scenes"; Brent ~$97 on deal framework' },
  ],
  disruptions: {
    flightsCancelled: '78,000+',
    airspaceClosed: 'Iran (partial), S. Lebanon, Gulf corridors',
    shippingDelay: '6–14 days avg via Cape of Good Hope reroute',
    portsCongestd: 'Jebel Ali, Fujairah, Salalah',
  },
  oil: {
    preWar: 68, current: 99, peak: 126, forecast: 82,
    note: 'Brent ~$99/bbl; WTI ~$93/bbl; Trump Cabinet: "Iran negotiating on fumes"; Iran-US agreed "broad principles" — Iran in principle agrees to HEU disposal, Khamenei endorsed template; new CENTCOM strikes near Bandar Abbas; Lebanon toll 3,275/9,926 (31 killed overnight); Lebanon Abraham Accords demand — Saudi Arabia, Pakistan reject; war-risk insurance still 8× pre-crisis; PGSA operating; UKMTO 2026-041 in effect; IEA: "largest supply disruption in history"; Pentagon talks May 29; political talks June 2–3',
  },
};
