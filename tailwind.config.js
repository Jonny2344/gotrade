/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0B0F19',
          card: '#111827',
          blue: '#3B82F6',
          orange: '#F97316',
          text: '#FFFFFF',
          muted: '#A1A1AA'
        }
      },
      boxShadow: {
        glowBlue: '0 10px 30px rgba(59, 130, 246, 0.35)',
        glowOrange: '0 12px 34px rgba(249, 115, 22, 0.35)'
      }
    }
  },
  plugins: []
};
