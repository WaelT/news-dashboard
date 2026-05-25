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
//          Washington Times/NBC News/CNBC/CNN/Fortune/NPR/PBS (May 23-24 2026 — Trump: deal "largely negotiated"; 14-point MOU; Hormuz reopening; Brent ~$97)
export const globalImpact = {
  updated: '2026-05-25',
  gdpImpact: [
    { region: 'Iran', flag: 'ir', pct: -22.0, costBn: 0, note: 'Economy near-collapse; oil exports halted; PGSA collecting Hormuz transit fees (up to $2M/ship in CNY); Kharg Island ~71 sq km oil slick (~80,000 bbls); drone production already resuming (CIA, May 21); ~50% drone capability intact; ~2/3 missile launchers survived; Russia + China reconstitution support; FM Araghchi: "no trust in Americans"; Iran Parliament Speaker Qalifbaf approved 14-point MOU framework (May 24 per Washington Times)' },
    { region: 'Israel', flag: 'il', pct: -5.8, costBn: 26, note: 'Mobilization + Lebanon ops + reconstruction; Lebanon ceasefire extended 45 days (to ~July 1) after Round 3 Washington talks — IDF continues strikes; Lebanon toll 3,073+ killed, 9,340+ wounded (May 22); IDF Maj. Sapir killed by Hezbollah; IDF kills Hezbollah Radwan commander in Beirut' },
    { region: 'GCC', flag: 'sa', pct: -3.8, costBn: 64, note: 'Infrastructure + oil revenue + Hormuz loss; Aramco CEO: market won\'t normalize until 2027 if Hormuz closed past mid-June; Bloomberg: ~2.1 mbd crude flow; PGSA fees apply to GCC-linked tankers; GCC leaders (MBS, MBZ, Emir Tamim) jointly urged Trump not to strike Iran on May 20' },
    { region: 'Japan', flag: 'jp', pct: -1.1, costBn: 10, note: '80% oil via Hormuz; LNG rerouting; Eneos-managed tanker transits Hormuz May 15 (LSEG); deal framework agreed May 24 — Japan closely monitoring formal Hormuz reopening announcement' },
    { region: 'EU', flag: 'eu', pct: -0.8, costBn: 18, note: 'Energy import surge; IMF cut to 1.1% growth; Israel-Lebanon 45-day extension eases some fears; Brent ~$97/bbl (deal hope dip from $113 peak); deal framework agreed May 24 may signal gradual Hormuz reopening' },
    { region: 'India', flag: 'in', pct: -0.7, costBn: 9, note: '60% oil via Gulf; Indian cargo vessel sunk off Oman by IRGC May 15; India-UAE defence pacts signed May 15; diverting purchases to West Africa and Americas; watching deal announcement for PGSA fee status' },
    { region: 'US', flag: 'us', pct: -0.5, costBn: 70, note: '~$1.1B/day military; May 22: House GOP pulls War Powers vote; Senate advances (Cassidy flip); May 24: Trump Truth Social — deal "largely negotiated", Hormuz "will be opened"; Washington Times: announcement within 24h; Brent ~$97/bbl; WTI ~$90/bbl; S&P 500 +1.5%, Nasdaq +2% at record highs; gas ~$4.50/gal; Pentagon talks May 29' },
    { region: 'China', flag: 'cn', pct: -0.5, costBn: 13, note: '45% oil via Hormuz; paying Iranian PGSA fees in yuan; 12 entities sanctioned May 12; summit concluded May 15 — Xi pledges no military equipment to Iran; Bessent: China "working behind scenes"; Brent ~$97 on deal framework' },
  ],
  disruptions: {
    flightsCancelled: '78,000+',
    airspaceClosed: 'Iran (partial), S. Lebanon, Gulf corridors',
    shippingDelay: '6–14 days avg via Cape of Good Hope reroute',
    portsCongestd: 'Jebel Ali, Fujairah, Salalah',
  },
  oil: {
    preWar: 68, current: 97, peak: 126, forecast: 82,
    note: 'Brent ~$98–100/bbl (May 25 — stabilizing after $97 deal-hope low May 24); WTI ~$91–93/bbl; 9th consecutive ceasefire day; formal US-Iran deal announcement still pending — Iran FM Baghaei: deal is "framework requiring 30–60 days follow-on talks"; war-risk insurance still 8× pre-crisis; PGSA operating; UKMTO 2026-041 in effect; IEA: "largest supply disruption in history"; Pentagon talks May 29',
  },
};
