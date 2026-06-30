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
//          CNBC (May 29 2026 — Brent $91.2/bbl −2% on day; −17% for May; lowest in ~6 weeks — ceasefire deal optimism)
//          RFERL/NBC News/ABC7/CBS News/Al Jazeera (May 29-30 2026 — US-Iran tentative 60-day MOU; Trump/Khamenei sign-off still pending; Trump May 30 Truth Social: "Hormuz Strait must be immediately open, no tolls... All water mines will be terminated"; Lebanon toll 3,324/10,027)
export const globalImpact = {
  updated: '2026-06-30',
  gdpImpact: [
    { region: 'Iran', flag: 'ir', pct: -22.0, costBn: 0, note: 'June 21 (Day 114): US strikes Fordow, Natanz, and Isfahan nuclear facilities; economy expected to deepen contraction; oil recovery halted; deal framework in doubt; Iran FM calls MOU "nullified"; IRGC on maximum alert; vows unprecedented response — sanctions relief now blocked; IMF forecast: GDP −6.1% for 2026, inflation 68.9%; $24B frozen assets now back in limbo; June 15 (Day 108): deal "Now Complete" had offered path to recovery; June 19: MOU signed at Burgenstock; now in doubt 2 days later after nuclear strikes (Wikipedia — United States strikes on Iranian nuclear sites; ASIL; CNBC; CBS News; Al Jazeera, June 21)' },
    { region: 'Israel', flag: 'il', pct: -5.8, costBn: 26, note: 'Finance Ministry initial estimate: NIS 35B (~$11.5B) war cost (ToI Apr 12); ~$3B/week GDP loss; fiscal deficit from 3.9%→5.1% GDP; Lebanon toll ~3,795 killed / ~11,730 wounded (Times of Israel, June 15); June 15 (Day 108): Trump announces deal "Now Complete"; Israel "not a party" to MOU; IDF issues evacuation warnings for 24 locations including Nabatieh city, strikes 70+ Hezbollah sites; Lebanese army withdraws from Kfar Tebnit near Nabatieh; deal does not formally end Israeli operations in Lebanon, which continue per Netanyahu\'s stated policy (Times of Israel, Al Jazeera, June 15)' },
    { region: 'GCC', flag: 'sa', pct: -3.8, costBn: 64, note: 'GDP forecast cut from 4.4%→−0.2% for 2026 (Oxford Economics, June; −4.6pp revision); World Bank: downgraded 4.4%→1.3%; ~$58B infrastructure damage (80 energy facilities struck); Aramco CEO: market won\'t normalize until 2027 if Hormuz closed past mid-June — deal averts that scenario; Saudi East-West pipeline rerouting 7 mbd; UAE Habshan-Fujairah pipeline at 1.8 mbd; Dubai hotel occupancy at 10% (Moody\'s); GCC net borrowing doubled; June 15: deal "Now Complete" — G7 at Evian discusses Hormuz reopening; GCC relief expected as Hormuz reopens formally June 19; Brent ~$81/bbl (June 15)' },
    { region: 'Japan', flag: 'jp', pct: -1.1, costBn: 10, note: '80% oil via Hormuz; LNG rerouting; Eneos-managed tanker transits Hormuz May 15 (LSEG); May 30: awaiting Trump signature on 60-day MOU — formal Hormuz reopening would relieve pressure' },
    { region: 'EU', flag: 'eu', pct: -0.8, costBn: 18, note: 'Energy import surge; IMF cut growth forecast to 1.1%; World Bank downgraded regional GDP from 4.4%→1.3%; Brent $91.2/bbl (down from $126 peak) on deal optimism; May 30: MOU awaiting final sign-off' },
    { region: 'India', flag: 'in', pct: -0.7, costBn: 9, note: '60% oil via Gulf; Indian cargo vessel sunk off Oman by IRGC May 15; India-UAE defence pacts signed May 15; 10 Indian sailors released from Iran May 27 (India MEA); diverting purchases to West Africa and Americas' },
    { region: 'US', flag: 'us', pct: -0.5, costBn: 70, note: 'Pentagon: $29B+ direct military cost (Military Times May 12); Moody\'s: $100B household cost (~$750/household); independent economists: $630B–$1T total; ~$1.1B/day; CENTCOM: 139 vessels redirected, 9 disabled total (as of June 14); June 15 (Day 108, G7 Evian): DEAL COMPLETE — Trump announces US-Iran deal "Now Complete", authorizes end to US naval blockade; formal signing June 19 in Switzerland; Hormuz to reopen with no tolls; 60-day follow-on talks begin; Brent ~$81/bbl (down 4%+ on deal news); gas prices expected to fall; US stocks surged on Hormuz reopening optimism; war-risk insurance expected to normalize post-signing; CENTCOM escort operations continuing until formal Hormuz reopening (RFERL, PBS News, NBC News, CBS News, June 15)' },
    { region: 'China', flag: 'cn', pct: -0.5, costBn: 13, note: '45% oil via Hormuz; paying PGSA fees in yuan; 12 entities sanctioned May 12; Xi pledges no military equipment to Iran (summit May 15); Brent $91.2/bbl on deal optimism — China closely monitoring Hormuz reopening for oil security' },
  ],
  disruptions: {
    flightsCancelled: '78,000+',
    airspaceClosed: 'Iran (partial), S. Lebanon, Gulf corridors',
    shippingDelay: '6–14 days avg via Cape of Good Hope reroute',
    portsCongestd: 'Jebel Ali, Fujairah, Salalah',
  },
  oil: {
    preWar: 68, current: 68, peak: 126, forecast: 80,
    note: 'Brent ~$66–68/bbl (ceasefire Day 7; at/below pre-war level $68) — Hormuz transits ~43/day (highest since Feb 28 pre-war baseline); oil flows ~7.0 mbd; Persian Gulf exports ~82% of pre-war levels across all routes; Bab al-Mandab open (Houthi ceasefire Day 6); US gas prices ~$3.05–3.12/gal (4-year low continuing); IAEA DG Grossi completing Day 4 in Tehran — site access schedule for Fordow/Natanz/Isfahan nearing finalization; Goldman Sachs Q4 2026 forecast $80/bbl; Day 6: ~$67–68; Day 5: ~$68–69; June 26: $72; June 25: ~$74–76; June 23: ~$77.5; June 21 spike: ~$90 on US nuclear strikes; down 47%+ from $126 peak (TradingEconomics; CNBC; Goldman Sachs; June 30)',
  },
};
