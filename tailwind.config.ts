import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        space: { 950: '#05060f', 900: '#0a0b1e', 800: '#111233' },
        neon: { blue: '#3b82f6', purple: '#8b5cf6', magenta: '#d946ef' },
      },
      fontFamily: { sans: ['var(--font-sans)', 'system-ui', 'sans-serif'] },
      backgroundImage: {
        'neon-gradient':
          'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #d946ef 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: { float: 'float 6s ease-in-out infinite' },
    },
  },
  plugins: [],
};

export default config;
