'use client'
import React from 'react'
import type { Theme } from '@/payload-types'

type ThemeProviderProps = {
  theme: Theme | null
  children: React.ReactNode
}

/**
 * ThemeProvider Component
 *
 * Converts Payload Theme global settings into CSS variables
 * This makes the design system 100% driven by CMS data
 *
 * Framework principle: "Use design tokens" - payload-website-framework-b2b-b2c.md
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  // Default theme fallback if global not configured yet
  const defaults = {
    primaryColor: '#00796B',
    secondaryColor: '#0A1628',
    accentColor: '#8b5cf6',
    backgroundColor: '#ffffff',
    surfaceColor: '#f9fafb',
    borderColor: '#e5e7eb',
    textPrimary: '#0A1628',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    headingFont: 'Inter, system-ui, sans-serif',
    bodyFont: 'Inter, system-ui, sans-serif',
    fontScale: 'md',
    borderRadius: 'lg',
    spacing: 'md',
    containerWidth: '7xl',
    shadowSize: 'md',
    enableAnimations: true,
    customCSS: '',
  }

  // Merge theme data with defaults
  const themeData = theme ? { ...defaults, ...theme } : defaults

  // Map border radius values
  const radiusMap = {
    none: '0px',
    sm: '2px',
    md: '6px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  }

  // Map container width values
  const containerMap = {
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '7xl': '1792px',
  }

  // Map shadow size values
  const shadowMap = {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  }

  // Map font scale values
  const fontScaleMap = {
    sm: '0.875',
    md: '1',
    lg: '1.125',
  }

  // Map spacing scale values
  const spacingMap = {
    sm: '0.75',
    md: '1',
    lg: '1.25',
  }

  const cssVariables = {
    // Colors
    '--color-primary': themeData.primaryColor,
    '--color-secondary': themeData.secondaryColor,
    '--color-accent': themeData.accentColor,
    '--color-background': themeData.backgroundColor,
    '--color-surface': themeData.surfaceColor,
    '--color-border': themeData.borderColor,
    '--color-text-primary': themeData.textPrimary,
    '--color-text-secondary': themeData.textSecondary,
    '--color-text-muted': themeData.textMuted,

    // Typography
    '--font-heading': themeData.headingFont,
    '--font-body': themeData.bodyFont,
    '--font-scale': fontScaleMap[themeData.fontScale as keyof typeof fontScaleMap] || '1',

    // Layout
    '--border-radius': radiusMap[themeData.borderRadius as keyof typeof radiusMap] || '12px',
    '--container-width': containerMap[themeData.containerWidth as keyof typeof containerMap] || '1792px',
    '--shadow': shadowMap[themeData.shadowSize as keyof typeof shadowMap] || shadowMap.md,
    '--spacing-scale': spacingMap[themeData.spacing as keyof typeof spacingMap] || '1',

    // Effects
    '--transition-duration': themeData.enableAnimations ? '200ms' : '0ms',
  } as React.CSSProperties

  return (
    <>
      <div
        style={cssVariables}
        className="theme-provider"
      >
        {children}
      </div>

      {/* Custom CSS from Theme global (advanced users) */}
      {themeData.customCSS && (
        <style dangerouslySetInnerHTML={{ __html

: `:root { ${themeData.customCSS} }` }} />
      )}

      {/* Global CSS to apply theme variables */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .theme-provider {
            min-height: 100vh;
            background-color: var(--color-background);
            color: var(--color-text-primary);
            font-family: var(--font-body);
          }

          /* Apply theme to common elements */
          h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-heading);
            color: var(--color-text-primary);
          }

          a {
            color: var(--color-primary);
            transition-duration: var(--transition-duration);
          }

          button, .btn {
            border-radius: var(--border-radius);
            transition-duration: var(--transition-duration);
          }

          /* ===================================================================
             CRITICAL: Override Tailwind .container with Theme settings
             This makes container max-width CMS-driven instead of hardcoded
             =================================================================== */
          .container {
            max-width: var(--container-width) !important;
            margin-left: auto !important;
            margin-right: auto !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }

          @media (min-width: 640px) {
            .container {
              padding-left: 1.5rem !important;
              padding-right: 1.5rem !important;
            }
          }

          /* ===================================================================
             ROUNDED UTILITIES - Use theme border radius
             =================================================================== */
          .rounded-xl, .rounded-2xl, .rounded-3xl {
            border-radius: var(--border-radius) !important;
          }

          /* ===================================================================
             SHADOW UTILITIES - Use theme shadow
             =================================================================== */
          .shadow, .shadow-md, .shadow-lg, .shadow-xl {
            box-shadow: var(--shadow) !important;
          }

          .shadow-2xl {
            box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25) !important;
          }

          /* ===================================================================
             HOVER SHADOWS - Respects theme shadow
             =================================================================== */
          .hover\\:shadow-xl:hover {
            box-shadow: var(--shadow) !important;
          }

          /* ===================================================================
             FONT SCALE - Apply to headings and key text classes
             Note: Only applies to headings to avoid breaking component layouts
             =================================================================== */
          .theme-provider h1 { font-size: calc(2.25rem * var(--font-scale)); line-height: 1.2; }
          .theme-provider h2 { font-size: calc(1.875rem * var(--font-scale)); line-height: 1.3; }
          .theme-provider h3 { font-size: calc(1.5rem * var(--font-scale)); line-height: 1.3; }
          .theme-provider h4 { font-size: calc(1.25rem * var(--font-scale)); line-height: 1.4; }
          .theme-provider h5 { font-size: calc(1.125rem * var(--font-scale)); line-height: 1.4; }
          .theme-provider h6 { font-size: calc(1rem * var(--font-scale)); line-height: 1.5; }

          /* Apply font scale to specific text size utilities */
          .text-xl { font-size: calc(1.25rem * var(--font-scale)) !important; }
          .text-2xl { font-size: calc(1.5rem * var(--font-scale)) !important; }
          .text-3xl { font-size: calc(1.875rem * var(--font-scale)) !important; }
          .text-4xl { font-size: calc(2.25rem * var(--font-scale)) !important; }
          .text-5xl { font-size: calc(3rem * var(--font-scale)) !important; }
          .text-6xl { font-size: calc(3.75rem * var(--font-scale)) !important; }

          /* ===================================================================
             SPACING SCALE - Apply to common section spacing
             =================================================================== */
          .py-12 {
            padding-top: calc(3rem * var(--spacing-scale)) !important;
            padding-bottom: calc(3rem * var(--spacing-scale)) !important;
          }
          .py-16 {
            padding-top: calc(4rem * var(--spacing-scale)) !important;
            padding-bottom: calc(4rem * var(--spacing-scale)) !important;
          }
          .py-20 {
            padding-top: calc(5rem * var(--spacing-scale)) !important;
            padding-bottom: calc(5rem * var(--spacing-scale)) !important;
          }

          /* ===================================================================
             TRANSITIONS - Respect enableAnimations setting
             Note: Only applies to interactive elements to avoid breaking animations
             =================================================================== */
          a, button, .btn, .card, [class*="hover:"] {
            transition-duration: var(--transition-duration);
          }

          /* ===================================================================
             COLOR UTILITY CLASSES
             =================================================================== */
          .bg-primary { background-color: var(--color-primary) !important; }
          .bg-secondary { background-color: var(--color-secondary) !important; }
          .bg-surface { background-color: var(--color-surface) !important; }

          .text-primary-color { color: var(--color-primary) !important; }
          .text-secondary-color { color: var(--color-secondary) !important; }

          .border-color { border-color: var(--color-border) !important; }
        `
      }} />
    </>
  )
}
