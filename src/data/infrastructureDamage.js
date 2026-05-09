// Iranian military infrastructure damage assessment
// Sources: Pentagon briefings, Alma Center, Critical Threats, IISS
export const infrastructureDamage = {
  updated: '2026-05-09',
  categories: [
    { id: 'nuclear', label: 'Nuclear Facilities', destructionPct: 96, detail: 'Natanz, Fordow, Isfahan, Arak struck; IAEA seals reapplied Apr 25', color: '#ff6600' },
    { id: 'naval', label: 'Naval Forces', destructionPct: 92, detail: '140+ vessels destroyed; Bandar Abbas port partially repaired', color: '#00aaff' },
    { id: 'air_defense', label: 'Air Defenses', destructionPct: 87, detail: '~45 SAM sites neutralized; S-300/Bavar-373 destroyed', color: '#ef4060' },
    { id: 'missile_prod', label: 'Missile Production', destructionPct: 80, detail: 'Parchin, Isfahan; launch rate down 99% under ceasefire', color: '#ef4060' },
    { id: 'drone_prod', label: 'Drone Production', destructionPct: 72, detail: 'Shahed factories in Isfahan, Kerman hit', color: '#ff6600' },
    { id: 'oil_export', label: 'Oil Export', destructionPct: 95, detail: 'Kharg terminal repairs ~30% complete under sanctions relief licenses; exports near-zero', color: '#d4a017' },
    { id: 'power_grid', label: 'Power Grid', destructionPct: 48, detail: 'Tehran restored 75%; Karaj, Shiraz substations being rebuilt; Project Freedom complicates fuel supply', color: '#d4a017' },
    { id: 'command', label: 'Command & Control', destructionPct: 65, detail: 'Multiple IRGC HQs struck; 7+ senior IRGC commanders killed; IDF killed senior Hezbollah commander in Beirut (May 7); CENTCOM struck Iranian C2 nodes, launch sites, ISR in self-defense strikes May 7', color: '#c084fc' },
  ],
};