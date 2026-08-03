/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef4fb',
          600: '#1b4f8c',
          700: '#143a68',
        },
        clinical: {
          50: '#ecf8f4',
          600: '#0f7a5f',
          700: '#0b5c48',
        },
      },
      fontFamily: {
        display: ['Sora', 'Segoe UI', 'sans-serif'],
        body: ['"Source Sans 3"', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
