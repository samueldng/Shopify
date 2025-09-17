/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'luxury': {
          DEFAULT: '#2c3e50',
          light: '#ecf0f1',
          dark: '#1a252f'
        },
        'accent': {
          DEFAULT: '#d4af37',
          light: '#f4e4a6',
          dark: '#b8941f'
        },
        'premium': {
          DEFAULT: '#8b4513',
          light: '#deb887',
          dark: '#654321'
        },
        'warm': {
          bronze: '#cd7f32',
          gold: '#ffd700',
          cream: '#f5f5dc'
        }
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
        'crimson': ['Crimson Text', 'serif']
      }
    },
  },
  plugins: [],
};
