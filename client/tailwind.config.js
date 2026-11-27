/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Dark theme surfaces & text (warm, earthy)
        canvas: '#14100D', // page background
        surface: '#1F1813', // cards, sidebar, inputs
        raised: '#2B221B', // hover, tracks, subtle chips
        line: '#3A2E25', // borders
        ink: '#F5EBDD', // main text
        muted: '#B9A898', // secondary text
        // Brand palette (cream/brown are used for text on coloured backgrounds)
        cream: { DEFAULT: '#FAF5EC', dark: '#F1E7D6' },
        terracotta: { DEFAULT: '#C2542D', light: '#E9B8A4', dark: '#9E4122' },
        indigo: { DEFAULT: '#2F3E66', light: '#C9CFE0', dark: '#1F2A47' },
        mustard: { DEFAULT: '#E0A526', light: '#F6E2B3', dark: '#B5831A' },
        brown: { DEFAULT: '#2B2118', light: '#6B5A4B' },
        leaf: { DEFAULT: '#4F7942', light: '#D3E2CD' },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0, 0, 0, 0.35)',
        lift: '0 14px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(224, 165, 38, 0.18)',
        glow: '0 0 30px rgba(194, 84, 45, 0.35)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.4s linear infinite',
        slideUp: 'slideUp 0.25s ease-out',
      },
    },
  },
  plugins: [],
};
