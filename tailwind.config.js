/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        primary: {
          700: '#7b1d2e',
          800: '#6a1828',
        },
        accent: {
          100: '#f5e6d3',
          300: '#e8c9a8',
        }
      }
    }
  },
  plugins: []
}
