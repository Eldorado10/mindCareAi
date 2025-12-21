/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { ...colors.blue, DEFAULT: '#5B8BF5', 500: '#5B8BF5' },
        secondary: { ...colors.violet, DEFAULT: '#9D71E8', 500: '#9D71E8' },
        accent: {
          ...colors.emerald,
          DEFAULT: '#4CD7B6',
          500: '#4CD7B6',
          mint: '#4CD7B6',
          sky: colors.sky[400],
          coral: colors.rose[400],
          lavender: colors.violet[400],
        },
        neutral: {
          ...colors.slate,
          light: '#F8FAFC',
          dark: '#1E293B',
        },
        success: colors.emerald[500],
        warning: colors.amber[500],
        error: colors.red[500],
        info: colors.blue[500],
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        display: ['Poppins', ...fontFamily.sans],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '3rem',
      },
      borderRadius: {
        'lg': '8px',
        'xl': '12px',
        '2xl': '20px',
      },
      boxShadow: {
        'soft-1': '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'soft-2': '0 4px 8px 0 rgba(0, 0, 0, 0.07)',
        'soft-3': '0 10px 20px 0 rgba(0, 0, 0, 0.07)',
      },
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        pulseCta: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(76, 215, 182, 0.7)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(76, 215, 182, 0)' },
        },
        fill: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        countUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 16px rgba(93, 139, 245, 0.15)' },
          '50%': { boxShadow: '0 0 32px rgba(157, 113, 232, 0.3)' },
          '100%': { boxShadow: '0 0 16px rgba(93, 139, 245, 0.15)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0.6) translateY(0)' },
          '50%': { opacity: '1', transform: 'scale(1) translateY(-8px)' },
        },
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'pulse-cta': 'pulseCta 2s infinite',
        'fill': 'fill 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'count-up': 'countUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) both',
        'slide-in-right': 'slideInRight 0.7s cubic-bezier(0.4, 0, 0.2, 1) both',
        'slide-in': 'slideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1) both',
        'pulse-slow': 'pulse 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 5s ease-in-out infinite',
        'sparkle': 'sparkle 4s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'custom-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
