/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        focus: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
        },
        defer: {
          50: '#fafafa',
          100: '#f4f4f5',
          500: '#71717a',
        },
      },
    },
  },
  plugins: [],
}
