import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'custom-color': '#A5C058',
      },
    },
  },
  plugins: [nextui({
        themes: {
          dark: {
            colors: {
              background: {
                DEFAULT: "#1f1f1f", // Set the default background color to a darker gray for dark mode
              },
            },
          }
        }
      }
  )],
}
