import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        blink: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        wave: {
          '0%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.5)' },
          '100%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        blink: 'blink 1s infinite alternate',
        wave: 'wave 0.5s ease-in-out infinite',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        josefin: ['Josefin Sans', ...defaultTheme.fontFamily.sans],
        maven: ['Maven Pro', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        text: '#212121',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '15px',
          sm: '15px',
          md: '32px',
          lg: '16px',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
      maxWidth: {
        mobile: '640px',
        tablet: '768px',
        laptop: '1024px',
        desktop: '1280px',
      },
    },
  },
  plugins: [],
} satisfies Config;
