/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ops: {
          bg: 'var(--ops-bg, #050a0e)',
          panel: 'var(--ops-panel, #0d1117)',
          border: 'var(--ops-border, #1b3a2a)',
          green: '#00ff41',
          amber: '#ff6600',
          red: '#ff0040',
          text: 'var(--ops-text, #c9d1d9)',
          muted: 'var(--ops-muted, #6e7681)',
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
          from: { boxShadow: '0 0 5px #00ff41, 0 0 10px #00ff4133' },
          to: { boxShadow: '0 0 10px #00ff41, 0 0 20px #00ff4144' },
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
