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

          /* Utility classes using theme variables */
          .bg-primary { background-color: var(--color-primary) !important; }
          .bg-secondary { background-color: var(--color-secondary) !important; }
          .bg-surface { background-color: var(--color-surface) !important; }

          .text-primary-color { color: var(--color-primary) !important; }
          .text-secondary-color { color: var(--color-secondary) !important; }

          .border-color { border-color: var(--color-border) !important; }

          .shadow { box-shadow: var(--shadow) !important; }
          .rounded { border-radius: var(--border-radius) !important; }
        `
      }} />
    </>
  )
}
