// Iranian military infrastructure damage assessment
// Sources: Pentagon briefings, Alma Center, Critical Threats, IISS
export const infrastructureDamage = {
  updated: '2026-04-26',
  categories: [
    { id: 'nuclear', label: 'Nuclear Facilities', destructionPct: 96, detail: 'Natanz, Fordow, Isfahan, Arak struck; IAEA seals reapplied Apr 25', color: '#ff6600' },
    { id: 'naval', label: 'Naval Forces', destructionPct: 92, detail: '140+ vessels destroyed; Bandar Abbas port partially repaired', color: '#00aaff' },
    { id: 'air_defense', label: 'Air Defenses', destructionPct: 87, detail: '~45 SAM sites neutralized; S-300/Bavar-373 destroyed', color: '#ef4060' },
    { id: 'missile_prod', label: 'Missile Production', destructionPct: 80, detail: 'Parchin, Isfahan; launch rate down 99% under ceasefire', color: '#ef4060' },
    { id: 'drone_prod', label: 'Drone Production', destructionPct: 72, detail: 'Shahed factories in Isfahan, Kerman hit', color: '#ff6600' },
    { id: 'oil_export', label: 'Oil Export', destructionPct: 95, detail: 'Kharg terminal repairs underway under sanctions relief licenses', color: '#d4a017' },
    { id: 'power_grid', label: 'Power Grid', destructionPct: 48, detail: 'Tehran restored 70%; Karaj, Shiraz substations being rebuilt', color: '#d4a017' },
    { id: 'command', label: 'Command & Control', destructionPct: 62, detail: 'Multiple IRGC HQs struck; 7+ senior commanders killed', color: '#c084fc' },
  ],
};
