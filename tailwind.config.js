/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ops: {
          bg: 'var(--ops-bg, #050a0e)',
          panel: 'var(--ops-panel, #0c1320)',
          'panel-header': 'var(--ops-panel-header, #111b27)',
          border: 'var(--ops-border, #1a2d3d)',
          green: 'var(--ops-green, #2dd4a8)',
          amber: '#ff6600',
          red: '#ef4060',
          text: 'var(--ops-text, #c9d1d9)',
          muted: 'var(--ops-muted, #6e7681)',
          glow: 'var(--ops-glow, rgba(45, 212, 168, 0.08))',
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", 'monospace'],
        display: ['system-ui', 'sans-serif'],
      },
      animation: {
        pulse_marker: 'pulse_marker 2s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        scanline: 'scanline 8s linear infinite',
      },
      keyframes: {
        pulse_marker: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.5)' },
        },
        glow: {
          from: { boxShadow: '0 0 5px var(--ops-green, #2dd4a8), 0 0 10px rgba(45, 212, 168, 0.2)' },
          to: { boxShadow: '0 0 10px var(--ops-green, #2dd4a8), 0 0 20px rgba(45, 212, 168, 0.25)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
};
