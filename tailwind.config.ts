import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0D0D0D',
        ivory: '#F5F0E8',
        'heritage-gold': '#C9A96E',
        'slate-gray': '#333333',
        'muted-text': '#888888',
        surface: '#121414',
        'surface-dim': '#121414',
        'surface-bright': '#383939',
        'surface-container-lowest': '#0d0e0f',
        'surface-container-low': '#1b1c1c',
        'surface-container': '#1f2020',
        'surface-container-high': '#292a2a',
        'surface-container-highest': '#343535',
        'surface-variant': '#343535',
        outline: '#8e9192',
        'outline-variant': '#444748',
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '9999px',
      },
      spacing: {
        'container-max': '1440px',
        'margin-edge': '64px',
        gutter: '40px',
        'section-gap': '120px',
      },
      maxWidth: {
        'container-max': '1440px',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['72px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '400' }],
        'display-lg-mobile': ['40px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '400' }],
        'headline-xl': ['48px', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '400' }],
        'headline-md': ['32px', { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'label-caps': ['12px', { lineHeight: '1.0', letterSpacing: '0.4em', fontWeight: '500' }],
        metadata: ['10px', { lineHeight: '1.2', letterSpacing: '0.1em', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}

export default config
