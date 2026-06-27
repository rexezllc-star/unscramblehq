import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        brand: '#3B5BDB',
        emerald: '#22C55E',
        ink: '#111827',
        soft: '#F8F9FA',
        line: '#E5E7EB'
      },
      boxShadow: {
        soft: '0 18px 60px rgba(17, 24, 39, 0.08)'
      }
    },
  },
  plugins: [],
}
export default config
