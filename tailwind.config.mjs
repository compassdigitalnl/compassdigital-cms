import plugin from 'tailwindcss/plugin.js'
import typographyPlugin from '@tailwindcss/typography'

// Helper: CSS variable color with Tailwind opacity modifier support
// Includes fallback RGB values so colors work even without ThemeProvider
const fallbacks = {
  '--color-primary-rgb': '0 137 123',
  '--color-primary-light-rgb': '38 166 154',
  '--color-secondary-rgb': '10 22 40',
  '--color-secondary-light-rgb': '18 31 51',
  '--color-accent-rgb': '139 92 246',
  '--color-grey-light-rgb': '241 244 248',
  '--color-grey-mid-rgb': '148 163 184',
  '--color-grey-dark-rgb': '100 116 139',
  '--color-success-rgb': '0 200 83',
  '--color-success-light-rgb': '232 245 233',
  '--color-warning-rgb': '245 158 11',
  '--color-warning-light-rgb': '255 248 225',
  '--color-error-rgb': '239 68 68',
  '--color-error-light-rgb': '255 240 240',
  '--color-info-rgb': '0 137 123',
  '--color-info-light-rgb': '224 242 241',
}
const withOpacity = (cssVar) => {
  const fb = fallbacks[cssVar]
  return fb
    ? `rgb(var(${cssVar}, ${fb}) / <alpha-value>)`
    : `rgb(var(${cssVar}) / <alpha-value>)`
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  safelist: [
    'lg:col-span-4',
    'lg:col-span-6',
    'lg:col-span-8',
    'lg:col-span-12',
    'border-border',
    'bg-card',
    'border-error',
    'bg-error/30',
    'border-success',
    'bg-success/30',
    'border-warning',
    'bg-warning/30',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        '2xl': '2rem',
        DEFAULT: '1rem',
        lg: '2rem',
        md: '2rem',
        sm: '1rem',
        xl: '2rem',
      },
      screens: {
        '2xl': '86rem',
        lg: '64rem',
        md: '48rem',
        sm: '40rem',
        xl: '80rem',
      },
    },
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        // ═══════════════════════════════════════════════════════════════════
        // THEME-AWARE COLORS (CMS-driven via ThemeProvider CSS variables)
        // All colors follow the Theme global at /admin/globals/theme/
        // ═══════════════════════════════════════════════════════════════════

        // Theme tokens (use as bg-theme-primary, text-theme-text-primary, etc.)
        theme: {
          primary: {
            DEFAULT: withOpacity('--color-primary-rgb'),
            light: withOpacity('--color-primary-light-rgb'),
            glow: 'var(--color-primary-glow)',
          },
          secondary: {
            DEFAULT: withOpacity('--color-secondary-rgb'),
            light: withOpacity('--color-secondary-light-rgb'),
          },
          accent: withOpacity('--color-accent-rgb'),
          bg: 'var(--color-background, #F5F7FA)',
          background: 'var(--color-background, #F5F7FA)',
          surface: 'var(--color-surface, #ffffff)',
          border: 'var(--color-border, #E8ECF1)',
          grey: {
            light: withOpacity('--color-grey-light-rgb'),
            mid: withOpacity('--color-grey-mid-rgb'),
            dark: withOpacity('--color-grey-dark-rgb'),
          },
          text: {
            primary: 'var(--color-text-primary, #0A1628)',
            secondary: 'var(--color-text-secondary, #64748b)',
            muted: 'var(--color-text-muted, #94a3b8)',
          },
          success: 'var(--color-success, #00C853)',
          warning: 'var(--color-warning, #F59E0B)',
          error: 'var(--color-error, #EF4444)',
          info: 'var(--color-info, #00897B)',
        },

        // ─── Primary brand (follows --color-primary from Theme global) ───
        teal: {
          DEFAULT: withOpacity('--color-primary-rgb'),
          light: withOpacity('--color-primary-light-rgb'),
          dark: 'var(--color-primary, #00897B)',
          glow: 'var(--color-primary-glow, rgba(0,137,123,0.12))',
          50: 'color-mix(in srgb, var(--color-primary, #00897B) 8%, white)',
          100: 'color-mix(in srgb, var(--color-primary, #00897B) 15%, white)',
          200: 'color-mix(in srgb, var(--color-primary, #00897B) 30%, white)',
          300: 'color-mix(in srgb, var(--color-primary, #00897B) 50%, white)',
          400: 'color-mix(in srgb, var(--color-primary, #00897B) 75%, white)',
          500: withOpacity('--color-primary-rgb'),
          600: 'color-mix(in srgb, var(--color-primary, #00897B) 88%, black)',
          700: 'color-mix(in srgb, var(--color-primary, #00897B) 75%, black)',
          800: 'color-mix(in srgb, var(--color-primary, #00897B) 60%, black)',
          900: 'color-mix(in srgb, var(--color-primary, #00897B) 45%, black)',
        },

        // ─── Secondary brand (follows --color-secondary from Theme global) ───
        navy: {
          DEFAULT: withOpacity('--color-secondary-rgb'),
          light: withOpacity('--color-secondary-light-rgb'),
          dark: 'var(--color-secondary, #0A1628)',
          700: withOpacity('--color-secondary-light-rgb'),
          800: 'color-mix(in srgb, var(--color-secondary, #0A1628) 90%, var(--color-secondary-light, #121F33))',
          900: withOpacity('--color-secondary-rgb'),
        },

        // ─── Grey scale ──────────────────────────────────────────────────
        grey: {
          light: withOpacity('--color-grey-light-rgb'),
          mid: withOpacity('--color-grey-mid-rgb'),
          dark: withOpacity('--color-grey-dark-rgb'),
        },

        // ─── Semantic: Info (blue) ───────────────────────────────────────
        blue: {
          DEFAULT: withOpacity('--color-info-rgb'),
          light: withOpacity('--color-info-light-rgb'),
          50: withOpacity('--color-info-light-rgb'),
          500: withOpacity('--color-info-rgb'),
          900: 'var(--color-info-dark, #004D40)',
        },

        // ─── Semantic: Success (green) ───────────────────────────────────
        green: {
          DEFAULT: withOpacity('--color-success-rgb'),
          light: withOpacity('--color-success-light-rgb'),
          50: withOpacity('--color-success-light-rgb'),
          500: withOpacity('--color-success-rgb'),
          900: 'var(--color-success-dark, #1B5E20)',
        },

        // ─── Semantic: Warning (amber) ───────────────────────────────────
        amber: {
          DEFAULT: withOpacity('--color-warning-rgb'),
          light: withOpacity('--color-warning-light-rgb'),
          50: withOpacity('--color-warning-light-rgb'),
          500: withOpacity('--color-warning-rgb'),
          600: 'color-mix(in srgb, var(--color-warning, #F59E0B) 88%, black)',
          900: 'var(--color-warning-dark, #92400E)',
        },

        // ─── Semantic: Error (coral) ─────────────────────────────────────
        coral: {
          DEFAULT: withOpacity('--color-error-rgb'),
          light: withOpacity('--color-error-light-rgb'),
          50: withOpacity('--color-error-light-rgb'),
          500: withOpacity('--color-error-rgb'),
          900: 'var(--color-error-dark, #991B1B)',
        },

        // ═══════════════════════════════════════════════════════════════════
        // BASE SHADCN/UI COLORS (keep existing for UI components)
        // ═══════════════════════════════════════════════════════════════════
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        background: 'hsl(var(--background))',
        border: 'hsl(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        foreground: 'hsl(var(--foreground))',
        input: 'hsl(var(--input))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        ring: 'hsl(var(--ring))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        success: 'hsl(var(--success))',
        error: 'hsl(var(--error))',
        warning: 'hsl(var(--warning))',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--color-text-primary)',
            '--tw-prose-headings': 'var(--color-text-primary)',
            h1: {
              fontSize: '4rem',
              fontWeight: 'normal',
              marginBottom: '0.25em',
            },
            a: {
              color: 'inherit',
            },
          },
        },
      }),
      fontFamily: {
        mono: ['var(--font-geist-mono)'],
        sans: ['var(--font-geist-sans)'],
      },
      keyframes: {
        // Plastimed animations
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideRight: {
          from: { opacity: 0, transform: 'translateX(-20px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        countUp: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },

        // Base animations (keep existing)
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        fadeOut: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        in: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        out: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'slide-in-from-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-out-to-left': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
        'slide-in-from-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-out-to-right': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(100%)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        blink: {
          '0%': { opacity: 0.2 },
          '20%': { opacity: 1 },
          '100% ': { opacity: 0.2 },
        },
      },
      animation: {
        // Plastimed animations
        fadeUp: 'fadeUp 0.7s ease-out forwards',
        slideRight: 'slideRight 0.7s ease-out forwards',
        pulse: 'pulse 2s infinite',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 3s ease-in-out infinite',
        countUp: 'countUp 0.5s ease-out forwards',

        // Base animations (keep existing)
        in: 'in 0.2s ease-out',
        out: 'out 0.2s ease-out',
        fadeIn: 'fadeIn .3s ease-in-out',
        fadeOut: 'fadeOut .3s ease-in-out',
        carousel: 'marquee 60s linear infinite',
        'slide-in-from-left': 'slide-in-from-left 0.2s ease-out',
        'slide-out-to-left': 'slide-out-to-left 0.2s ease-out',
        'slide-in-from-right': 'slide-in-from-right 0.2s ease-out',
        'slide-out-to-right': 'slide-out-to-right 0.2s ease-out',
        blink: 'blink 1.4s both infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    typographyPlugin,
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'animation-delay': (value) => {
            return {
              'animation-delay': value,
            }
          },
        },
        {
          values: theme('transitionDelay'),
        },
      )
    }),
  ],
}
