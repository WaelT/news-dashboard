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
  updated: '2026-07-03',
  gdpImpact: [
    { region: 'Iran', flag: 'ir', pct: -22.0, costBn: 0, note: 'July 3 (Day 126, ceasefire Day 10): IMF projects Iranian economy to contract 6.1% in 2026; inflation 50.6% annually — IMF projects 70%+ for 2026 (GlobalSecurity Day 125); $6B Iranian assets in Qatar to be used for goods-purchase mechanism per Doha talks July 1–2; Iran FM Araghchi confirmed sanctions on Iranian oil waived and some frozen assets released; IAEA access standoff: Iran parliament speaker Qalibaf blocked access to Fordow/Natanz/Isfahan — only Bushehr + Tehran research reactor allowed (NBC News; Times of Israel); Kharg Island export capacity rising; US Treasury 60-day Iranian oil sales authorization in effect; 60-day follow-on talks on nuclear disposition, sanctions relief, proxy support, ballistic missiles continuing (GlobalSecurity; Reuters; Al Jazeera; July 3)' },
    { region: 'Israel', flag: 'il', pct: -5.8, costBn: 26, note: 'Finance Ministry initial estimate: NIS 35B (~$11.5B) war cost (ToI Apr 12); ~$3B/week GDP loss; fiscal deficit from 3.9%→5.1% GDP; Lebanon toll 4,175 killed / 12,190 wounded (ceasefire Day 10 — unchanged since June 23 last Lebanese casualties); IDF maintaining positions in south Lebanon; ceasefire Day 14 for Lebanon front holding under US mediation; IDF withdrawal timeline negotiations continuing (Lebanese Ministry of Health; Times of Israel; Al Jazeera; July 3)' },
    { region: 'GCC', flag: 'sa', pct: -3.8, costBn: 64, note: 'GDP recovery underway as Hormuz reopens; ~$58B infrastructure damage (80 energy facilities struck); UAE exports restored to 3.9 mbd (TradingEconomics); total daily Hormuz flows past 10 mbd; Saudi Ras Tanura at full loading capacity; ADNOC, KNPC at full export capacity; Al Jazeera July 2: "With Hormuz reopened, has the oil shortage turned into a glut?"; Brent ~$71–72/bbl; GCC airline routes restoring; Jebel Ali port congestion clearing; Bab al-Mandab fully open (Al Jazeera; CNBC; TradingEconomics; July 3)' },
    { region: 'Japan', flag: 'jp', pct: -1.1, costBn: 10, note: '80% oil via Hormuz; resumed direct Hormuz transits at pre-war schedule; IEA strategic reserve drawdown halted; LNG spot price falling from $43/MMBtu peak; supply normalizing (IEA; July 3)' },
    { region: 'EU', flag: 'eu', pct: -0.8, costBn: 18, note: 'Energy import surge easing as Hormuz reopens; IMF cut growth forecast to 1.1%; Brent ~$71–72/bbl (well below wartime $126 peak); Bab al-Mandab fully open reducing LNG surcharges (TradingEconomics; July 3)' },
    { region: 'India', flag: 'in', pct: -0.7, costBn: 9, note: '60% oil via Gulf; direct Hormuz transits fully resumed; IEA strategic reserve drawdown halted; India resuming full Gulf crude purchasing at pre-war volumes; 10 Indian sailors released from Iran May 27 (India MEA); diverting purchases from West Africa/Americas back to Gulf (IEA; Reuters; July 3)' },
    { region: 'US', flag: 'us', pct: -0.5, costBn: 70, note: 'Pentagon: $29B+ direct military cost (Military Times May 12); Moody\'s: $100B household cost (~$750/household); independent economists: $630B–$1T total; US gas prices ~$3.05–3.10/gal (4-year low and falling); Hormuz transits at ~55/day (35+ energy tankers exited July 2 alone); CENTCOM escort operations concluded post-MOU; 60-day follow-on talks progressing; Doha indirect talks concluded July 1–2 with $6B Iranian assets goods-purchase mechanism; Iran/US/Lebanon High Level Committee established June 30 (Reuters; CBS News; GlobalSecurity; July 3)' },
    { region: 'China', flag: 'cn', pct: -0.5, costBn: 13, note: '45% oil via Hormuz; PGSA toll system closed post-ceasefire; 12 entities sanctioned May 12; Xi pledges no military equipment to Iran (summit May 15); Hormuz transits at ~55/day — Chinese oil imports via Gulf fully recovering (TradingEconomics; Reuters; July 3)' },
  ],
  disruptions: {
    flightsCancelled: '78,000+',
    airspaceClosed: 'Iran (partial), S. Lebanon, Gulf corridors',
    shippingDelay: '6–14 days avg via Cape of Good Hope reroute',
    portsCongestd: 'Jebel Ali, Fujairah, Salalah',
  },
  oil: {
    preWar: 68, current: 61, peak: 126, forecast: 80,
    note: 'Brent ~$60–63/bbl (ceasefire Day 10; further below pre-war level $68) — Hormuz transits ~56/day; oil flows ~8.5 mbd; Bab al-Mandab open (Houthi ceasefire Day 9 — 21st quiet day); US gas prices ~$2.88–2.98/gal (4-year low, continuing to fall); IAEA DG Grossi completing Day 7 in Tehran — forensic review advancing at Fordow/Natanz/Isfahan; Rome 60-day follow-on talks inaugural session preparation advancing; Goldman Sachs Q4 2026 forecast $80/bbl; Day 9: ~$62–65; Day 8: ~$64–66; Day 7: ~$66–68; Day 6: ~$67–68; Day 5: ~$68–69; June 26: $72; June 25: ~$74–76; June 23: ~$77.5; June 21 spike: ~$90 on US nuclear strikes; down 52%+ from $126 peak (TradingEconomics; CNBC; Goldman Sachs; July 3)',
  },
};
