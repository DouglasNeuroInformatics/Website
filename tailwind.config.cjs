const typographyPlugin = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,svg}'],
  darkMode: ['class', '[data-mode="dark"]'],
  plugins: [typographyPlugin()],
  root: __dirname,
  theme: {
    extend: {
      animation: {
        dash: 'dash 2s forwards'
      },
      colors: {
        logo: {
          300: '#57abda',
          800: '#0743c6',
          900: '#102e71'
        }
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          md: '2rem',
          xl: '3rem'
        }
      },
      keyframes: {
        dash: {
          '50%, 100%': {
            strokeDashoffset: 0
          }
        }
      }
    }
  }
};
