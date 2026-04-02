// Iranian military infrastructure damage assessment
// Sources: Pentagon briefings, Alma Center, Critical Threats, IISS
export const infrastructureDamage = {
  updated: '2026-04-01',
  categories: [
    { id: 'nuclear', label: 'Nuclear Facilities', destructionPct: 95, detail: 'Natanz, Fordow, Isfahan, Arak — all declared sites struck', color: '#ff6600' },
    { id: 'naval', label: 'Naval Forces', destructionPct: 92, detail: '140+ vessels destroyed; Bandar Abbas port hit', color: '#00aaff' },
    { id: 'air_defense', label: 'Air Defenses', destructionPct: 85, detail: '~40 SAM sites neutralized; S-300/Bavar-373 destroyed', color: '#ef4060' },
    { id: 'missile_prod', label: 'Missile Production', destructionPct: 78, detail: 'Parchin, Isfahan; launch rate down 90%', color: '#ef4060' },
    { id: 'drone_prod', label: 'Drone Production', destructionPct: 70, detail: 'Shahed factories in Isfahan, Kerman hit', color: '#ff6600' },
    { id: 'oil_export', label: 'Oil Export', destructionPct: 98, detail: 'Kharg terminal destroyed; all exports offline', color: '#d4a017' },
    { id: 'power_grid', label: 'Power Grid', destructionPct: 45, detail: 'Tehran blackout; Karaj, Shiraz substations hit', color: '#d4a017' },
    { id: 'command', label: 'Command & Control', destructionPct: 60, detail: 'Multiple IRGC HQs struck; 5+ senior commanders killed', color: '#c084fc' },
  ],
};
