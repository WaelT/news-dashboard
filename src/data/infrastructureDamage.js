// Iranian military infrastructure damage assessment
// Sources: Pentagon briefings, Alma Center, Critical Threats, IISS
export const infrastructureDamage = {
  updated: '2026-05-21',
  categories: [
    { id: 'nuclear', label: 'Nuclear Facilities', destructionPct: 96, detail: 'Natanz, Fordow, Isfahan, Arak struck; IAEA seals reapplied Apr 25; 440.9 kg of 60%-enriched HEU remains in Iranian custody per IAEA (key US deal demand); Barakah Nuclear Plant (UAE, Arab world\'s only nuclear plant) Unit 3 off-site power restored May 19 — IAEA DG Grossi: "an important step for nuclear safety"; Trump confirms US Space Force surveilling Iranian nuclear sites (May 10)', color: '#ff6600' },
    { id: 'naval', label: 'Naval Forces', destructionPct: 92, detail: '140+ vessels destroyed; Bandar Abbas port partially repaired; IRGC fast-attack boats still conducting shadow ops in Hormuz', color: '#00aaff' },
    { id: 'air_defense', label: 'Air Defenses', destructionPct: 87, detail: '~45 SAM sites neutralized; S-300/Bavar-373 destroyed', color: '#ef4060' },
    { id: 'missile_prod', label: 'Missile Production', destructionPct: 80, detail: 'Parchin, Isfahan; launch rate down 99% under ceasefire; drone production partially resumed (May 10 barrage at UAE/Kuwait/Qatar)', color: '#ef4060' },
    { id: 'drone_prod', label: 'Drone Production', destructionPct: 70, detail: 'Shahed factories in Isfahan, Kerman hit; partial resumption evident — Iran launched drone barrages on May 10 at UAE, Kuwait, Qatar', color: '#ff6600' },
    { id: 'oil_export', label: 'Oil Export', destructionPct: 95, detail: 'Kharg terminal repairs ~30% complete under sanctions relief licenses; exports near-zero; 166+ tankers (170M bbls) blocked by US naval blockade', color: '#d4a017' },
    { id: 'power_grid', label: 'Power Grid', destructionPct: 48, detail: 'Tehran restored 75%; Karaj, Shiraz substations being rebuilt; South Pars gas field strike cut ~80% of power generation capacity', color: '#d4a017' },
    { id: 'command', label: 'Command & Control', destructionPct: 65, detail: 'Multiple IRGC HQs struck; 7+ senior IRGC commanders killed; IDF killed Hezbollah Radwan Force commander in Beirut (May 21); CENTCOM struck 11,000+ targets in Iran total; Trump-Xi summit concludes May 15 — Hormuz "must remain open" agreed; Trump extends Iran ceasefire indefinitely May 16 (no new deadline); Israel-Lebanon ceasefire extended 45 days (~July 1); PGSA toll plan announced May 16; drone strikes Barakah Nuclear Plant (UAE) generator May 17 — IAEA DG Grossi "grave concern"; Barakah Unit 3 power restored May 19 (IAEA); May 18: Trump calls off scheduled May 19 Iran strike after GCC leaders intervene; May 20: Trump says talks in "final stages" — Brent plunges 5%+ to $105.02; May 21: 5th consecutive ceasefire day; IRGC threatens "new fronts" "beyond the region"; Israel readying nuclear site strike if talks fail (Times of Israel/CNN); IDF Maj. Sapir killed by Hezbollah (May 21)', color: '#c084fc' },
  ],
};
