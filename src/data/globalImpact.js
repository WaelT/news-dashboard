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
  updated: '2026-06-12',
  gdpImpact: [
    { region: 'Iran', flag: 'ir', pct: -22.0, costBn: 0, note: 'Economy near-collapse; IMF forecast: GDP −6.1% for 2026, inflation 68.9%; oil exports halted; $24B frozen assets at stake; June 11 (evening): Trump announces "great settlement of the war with Iran, subject to finalization of documents" — deal signing possibly in Europe within days; Iran FM spokesperson: announcement is "merely speculation", no final Iranian decision; June 12: no new kinetic exchanges — ceasefire holding ahead of deal; PGSA operational; 60-day MOU framework pending Khamenei sign-off' },
    { region: 'Israel', flag: 'il', pct: -5.8, costBn: 26, note: 'Finance Ministry initial estimate: NIS 35B (~$11.5B) war cost (ToI Apr 12); ~$3B/week GDP loss; fiscal deficit from 3.9%→5.1% GDP; Lebanon toll 3,696 killed / 11,413 wounded (Lebanese Health Ministry, June 12); Netanyahu says Israel is "not party to emerging Iran deal" announced by Trump June 11 — pledges to continue military operations; IDF continues Lebanon ops north of Litani River toward Nabatieh; Netanyahu "expressed appreciation" to Trump for commitment that final deal removes Iran HEU, dismantles nuclear infrastructure, limits missiles, halts proxy support' },
    { region: 'GCC', flag: 'sa', pct: -3.8, costBn: 64, note: 'GDP forecast cut from 4.4%→−0.2% for 2026 (Oxford Economics, June; −4.6pp revision); World Bank: downgraded 4.4%→1.3%; ~$58B infrastructure damage (80 energy facilities struck); Aramco CEO: market won\'t normalize until 2027 if Hormuz closed past mid-June; Saudi East-West pipeline rerouting 7 mbd; UAE Habshan-Fujairah pipeline at 1.8 mbd; Dubai hotel occupancy at 10% (Moody\'s); GCC net borrowing doubled; Brent ~$97/bbl (June 5)' },
    { region: 'Japan', flag: 'jp', pct: -1.1, costBn: 10, note: '80% oil via Hormuz; LNG rerouting; Eneos-managed tanker transits Hormuz May 15 (LSEG); May 30: awaiting Trump signature on 60-day MOU — formal Hormuz reopening would relieve pressure' },
    { region: 'EU', flag: 'eu', pct: -0.8, costBn: 18, note: 'Energy import surge; IMF cut growth forecast to 1.1%; World Bank downgraded regional GDP from 4.4%→1.3%; Brent $91.2/bbl (down from $126 peak) on deal optimism; May 30: MOU awaiting final sign-off' },
    { region: 'India', flag: 'in', pct: -0.7, costBn: 9, note: '60% oil via Gulf; Indian cargo vessel sunk off Oman by IRGC May 15; India-UAE defence pacts signed May 15; 10 Indian sailors released from Iran May 27 (India MEA); diverting purchases to West Africa and Americas' },
    { region: 'US', flag: 'us', pct: -0.5, costBn: 70, note: 'Pentagon: $29B+ direct military cost (Military Times May 12; updated from $25B at Day 60); Moody\'s: $100B household cost (~$750/household); independent economists: $630B–$1T total; ~$1.1B/day; CENTCOM: 129 vessels redirected, 6 disabled total (M/T Lexie most recent ~June 10); June 12 (Day 105): Trump announces "great settlement of the war with Iran" June 11 — deal signing possibly in Europe "within days"; Iran FM not confirming; gas ~$4.50/gal; war-risk insurance still 8× pre-crisis; stocks rally sharply on deal optimism (ABC News, CENTCOM, Reuters, Al Jazeera, June 11–12)' },
    { region: 'China', flag: 'cn', pct: -0.5, costBn: 13, note: '45% oil via Hormuz; paying PGSA fees in yuan; 12 entities sanctioned May 12; Xi pledges no military equipment to Iran (summit May 15); Brent $91.2/bbl on deal optimism — China closely monitoring Hormuz reopening for oil security' },
  ],
  disruptions: {
    flightsCancelled: '78,000+',
    airspaceClosed: 'Iran (partial), S. Lebanon, Gulf corridors',
    shippingDelay: '6–14 days avg via Cape of Good Hope reroute',
    portsCongestd: 'Jebel Ali, Fujairah, Salalah',
  },
  oil: {
    preWar: 68, current: 90, peak: 126, forecast: 88,
    note: 'Brent ~$90/bbl (June 12; TradingEconomics/CNBC — falling sharply on Trump "great settlement" deal optimism; $89–$93 range intraday); June 11 (evening): Trump announces from Oval Office "We just made a great settlement of the war with Iran, subject to finalization of documents. Should get done over the next few days and probably have a signing, maybe in Europe" — Brent falls ~5% from $97; US stocks rally sharply; Iran FM spokesperson: deal is "merely speculation", no final decision; Netanyahu: Israel "not party to emerging Iran deal"; deal would include Hormuz reopening with no tolls, Iran clears mines, US lifts blockade, enriched uranium removed, nuclear infrastructure dismantled; signing possibly this weekend in Europe; June 12 (Day 105): no new IRGC kinetic exchanges — ceasefire holding ahead of deal; PGSA operational; UKMTO 2026-041 in effect; dark fleet transits ~7/day; Lebanon toll 3,696/11,413 (Lebanese Health Ministry); CENTCOM: 129 vessels redirected, 6 disabled (ABC News, Reuters, CNN, CNBC, Al Jazeera, TradingEconomics, June 11–12)',
  },
};
