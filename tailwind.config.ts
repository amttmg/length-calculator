import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#111827',
        surface2: '#1f2937',
        accent: '#7c3aed',
        accentSoft: '#a78bfa',
        border: '#374151'
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.2)'
      }
    }
  },
  plugins: []
};

export default config;
