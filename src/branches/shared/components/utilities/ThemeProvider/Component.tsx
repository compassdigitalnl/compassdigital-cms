'use client'
import React from 'react'
import type { ThemeProviderProps } from './types'

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const defaults = {
    primaryColor: '#00897B',
    primaryLight: '#26A69A',
    primaryGlow: 'rgba(0,137,123,0.12)',
    secondaryColor: '#0A1628',
    secondaryLight: '#121F33',
    accentColor: '#8b5cf6',
    backgroundColor: '#F5F7FA',
    surfaceColor: '#ffffff',
    borderColor: '#E8ECF1',
    greyLight: '#F1F4F8',
    greyMid: '#94A3B8',
    greyDark: '#64748B',
    textPrimary: '#0A1628',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    successColor: '#00C853',
    successLight: '#E8F5E9',
    successDark: '#1B5E20',
    warningColor: '#F59E0B',
    warningLight: '#FFF8E1',
    warningDark: '#92400E',
    errorColor: '#EF4444',
    errorLight: '#FFF0F0',
    errorDark: '#991B1B',
    infoColor: '#00897B',
    infoLight: 'rgba(0,137,123,0.12)',
    infoDark: '#004D40',
    primaryGradient: 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)',
    secondaryGradient: 'linear-gradient(135deg, #0A1628 0%, #1a2847 100%)',
    heroGradient: 'linear-gradient(135deg, rgba(0,137,123,0.1) 0%, rgba(38,166,154,0.1) 100%)',
    headingFont: 'Inter, system-ui, sans-serif',
    bodyFont: 'Inter, system-ui, sans-serif',
    fontMono: "'JetBrains Mono', 'Courier New', monospace",
    fontScale: 'md',
    spacing: 'md',
    containerWidth: '7xl',
    enableAnimations: true,
    customCSS: '',
    // Type scale
    heroSize: 36,
    sectionSize: 24,
    cardTitleSize: 18,
    bodyLgSize: 15,
    bodySize: 13,
    smallSize: 12,
    labelSize: 10,
    microSize: 8,
    // Individual radius
    radiusSm: 8,
    radiusMd: 12,
    radiusLg: 16,
    radiusXl: 20,
    radiusFull: 9999,
    // Individual shadows
    shadowSm: '0 1px 3px rgba(10, 22, 40, 0.06)',
    shadowMd: '0 4px 20px rgba(10, 22, 40, 0.08)',
    shadowLg: '0 8px 40px rgba(10, 22, 40, 0.12)',
    shadowXl: '0 20px 60px rgba(10, 22, 40, 0.16)',
    // Z-index
    zDropdown: 100,
    zSticky: 200,
    zOverlay: 300,
    zModal: 400,
    zToast: 500,
  }

  const t: Record<string, any> = theme ? { ...defaults, ...theme } : defaults

  const containerMap: Record<string, string> = {
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '7xl': '1792px',
  }

  const fontScaleMap: Record<string, string> = {
    sm: '0.875',
    md: '1',
    lg: '1.125',
  }

  const spacingMap: Record<string, string> = {
    sm: '0.75',
    md: '1',
    lg: '1.25',
  }

  const cssVariables = {
    // ─── Colors ───────────────────────────────────────
    '--color-primary': t.primaryColor,
    '--color-primary-light': t.primaryLight,
    '--color-primary-glow': t.primaryGlow,
    '--color-secondary': t.secondaryColor,
    '--color-secondary-light': t.secondaryLight,
    '--color-accent': t.accentColor,
    '--color-background': t.backgroundColor,
    '--color-surface': t.surfaceColor,
    '--color-border': t.borderColor,
    '--color-grey-light': t.greyLight,
    '--color-grey-mid': t.greyMid,
    '--color-grey-dark': t.greyDark,
    '--color-text-primary': t.textPrimary,
    '--color-text-secondary': t.textSecondary,
    '--color-text-muted': t.textMuted,

    // ─── Status Colors ────────────────────────────────
    '--color-success': t.successColor,
    '--color-success-light': t.successLight,
    '--color-success-dark': t.successDark,
    '--color-warning': t.warningColor,
    '--color-warning-light': t.warningLight,
    '--color-warning-dark': t.warningDark,
    '--color-error': t.errorColor,
    '--color-error-light': t.errorLight,
    '--color-error-dark': t.errorDark,
    '--color-info': t.infoColor,
    '--color-info-light': t.infoLight,
    '--color-info-dark': t.infoDark,

    // ─── Gradients ────────────────────────────────────
    '--gradient-primary': t.primaryGradient,
    '--gradient-secondary': t.secondaryGradient,
    '--gradient-hero': t.heroGradient,

    // ─── Typography ───────────────────────────────────
    '--font-heading': t.headingFont,
    '--font-body': t.bodyFont,
    '--font-mono': t.fontMono,
    '--font-scale': fontScaleMap[t.fontScale as string] || '1',

    // ─── Type Scale ───────────────────────────────────
    '--text-hero': `${t.heroSize}px`,
    '--text-section': `${t.sectionSize}px`,
    '--text-card-title': `${t.cardTitleSize}px`,
    '--text-body-lg': `${t.bodyLgSize}px`,
    '--text-body': `${t.bodySize}px`,
    '--text-small': `${t.smallSize}px`,
    '--text-label': `${t.labelSize}px`,
    '--text-micro': `${t.microSize}px`,

    // ─── Border Radius ────────────────────────────────
    '--r-sm': `${t.radiusSm}px`,
    '--r-md': `${t.radiusMd}px`,
    '--r-lg': `${t.radiusLg}px`,
    '--r-xl': `${t.radiusXl}px`,
    '--r-full': `${t.radiusFull}px`,
    // Legacy single --border-radius (uses --r-md as default)
    '--border-radius': `${t.radiusMd}px`,

    // ─── Shadows ──────────────────────────────────────
    '--sh-sm': t.shadowSm,
    '--sh-md': t.shadowMd,
    '--sh-lg': t.shadowLg,
    '--sh-xl': t.shadowXl,
    // Legacy single --shadow (uses --sh-md as default)
    '--shadow': t.shadowMd,

    // ─── Z-index ──────────────────────────────────────
    '--z-dropdown': String(t.zDropdown),
    '--z-sticky': String(t.zSticky),
    '--z-overlay': String(t.zOverlay),
    '--z-modal': String(t.zModal),
    '--z-toast': String(t.zToast),

    // ─── Layout ───────────────────────────────────────
    '--container-width': containerMap[t.containerWidth as string] || '1792px',
    '--spacing-scale': spacingMap[t.spacing as string] || '1',

    // ─── Effects ──────────────────────────────────────
    '--transition-duration': t.enableAnimations ? '200ms' : '0ms',

    // ─── Button tokens ────────────────────────────────
    '--btn-font-weight': String(t.btnFontWeight || 700),
    '--btn-border-radius': t.btnBorderRadius || '8px',
    '--btn-border-width': t.btnBorderWidth || '1.5px',
    '--btn-icon-gap': `${t.btnIconGap ?? 6}px`,
    '--btn-transition': t.btnTransitionDuration || '0.2s',
    '--btn-hover-y': t.btnHoverTranslateY || '-1px',
    '--btn-disabled-opacity': String(t.btnDisabledOpacity ?? 0.5),
    '--btn-sm-py': `${t.btnSmPaddingY ?? 5}px`,
    '--btn-sm-px': `${t.btnSmPaddingX ?? 12}px`,
    '--btn-sm-font': `${t.btnSmFontSize ?? 10}px`,
    '--btn-sm-icon': `${t.btnSmIconSize ?? 12}px`,
    '--btn-md-py': `${t.btnMdPaddingY ?? 8}px`,
    '--btn-md-px': `${t.btnMdPaddingX ?? 18}px`,
    '--btn-md-font': `${t.btnMdFontSize ?? 12}px`,
    '--btn-md-icon': `${t.btnMdIconSize ?? 14}px`,
    '--btn-lg-py': `${t.btnLgPaddingY ?? 11}px`,
    '--btn-lg-px': `${t.btnLgPaddingX ?? 26}px`,
    '--btn-lg-font': `${t.btnLgFontSize ?? 14}px`,
    '--btn-lg-icon': `${t.btnLgIconSize ?? 16}px`,
    '--btn-primary-bg': t.btnPrimaryBg || 'var(--color-primary)',
    '--btn-primary-text': t.btnPrimaryText || '#ffffff',
    '--btn-primary-hover': t.btnPrimaryHoverBg || 'color-mix(in srgb, var(--btn-primary-bg) 85%, black)',
    '--btn-secondary-bg': t.btnSecondaryBg || 'var(--color-secondary)',
    '--btn-secondary-text': t.btnSecondaryText || '#ffffff',
    '--btn-secondary-hover': t.btnSecondaryHoverBg || 'color-mix(in srgb, var(--btn-secondary-bg) 85%, black)',
    '--btn-danger-bg': t.btnDangerBg || 'var(--color-error)',
    '--btn-danger-text': t.btnDangerText || '#ffffff',
    '--btn-danger-hover': t.btnDangerHoverBg || 'color-mix(in srgb, var(--btn-danger-bg) 85%, black)',
    '--btn-success-bg': t.btnSuccessBg || 'var(--color-success)',
    '--btn-success-text': t.btnSuccessText || '#ffffff',
    '--btn-success-hover': t.btnSuccessHoverBg || 'color-mix(in srgb, var(--btn-success-bg) 85%, black)',
  } as React.CSSProperties

  return (
    <>
      <div
        style={cssVariables}
        className="theme-provider"
      >
        {children}
      </div>

      {t.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: `:root { ${t.customCSS} }` }} />
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          .theme-provider {
            min-height: 100vh;
            background-color: var(--color-background);
            color: var(--color-text-primary);
            font-family: var(--font-body);
          }

          h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-heading);
          }

          a {
            color: var(--color-primary);
            transition-duration: var(--transition-duration);
          }

          /* Override link color inside dark containers (footer etc.) */
          footer a {
            color: inherit;
          }

          button, .btn {
            transition-duration: var(--transition-duration);
          }

          /* ── Container ── */
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

          .max-w-7xl, .max-w-6xl, .max-w-5xl {
            max-width: var(--container-width);
          }

          .max-w-4xl { max-width: min(896px, var(--container-width)) !important; }
          .max-w-3xl { max-width: min(768px, var(--container-width)) !important; }
          .max-w-2xl { max-width: min(672px, var(--container-width)) !important; }
          .max-w-xl { max-width: min(576px, var(--container-width)) !important; }
          .max-w-lg { max-width: min(512px, var(--container-width)) !important; }

          /* ── Border Radius Utilities ── */
          .rounded-lg, .rounded-xl, .rounded-2xl, .rounded-3xl {
            border-radius: var(--r-lg) !important;
          }
          .rounded-sm { border-radius: var(--r-sm) !important; }
          .rounded-md { border-radius: var(--r-md) !important; }

          /* ── Shadow Utilities ── */
          .shadow, .shadow-md { box-shadow: var(--sh-md) !important; }
          .shadow-sm { box-shadow: var(--sh-sm) !important; }
          .shadow-lg { box-shadow: var(--sh-lg) !important; }
          .shadow-xl, .shadow-2xl { box-shadow: var(--sh-xl) !important; }

          .hover\\:shadow-xl:hover, .hover\\:shadow-lg:hover, .hover\\:shadow-md:hover {
            box-shadow: var(--sh-lg) !important;
          }

          /* ── Font Scale ── */
          .theme-provider h1 { font-size: calc(2.25rem * var(--font-scale)); line-height: 1.2; }
          .theme-provider h2 { font-size: calc(1.875rem * var(--font-scale)); line-height: 1.3; }
          .theme-provider h3 { font-size: calc(1.5rem * var(--font-scale)); line-height: 1.3; }
          .theme-provider h4 { font-size: calc(1.25rem * var(--font-scale)); line-height: 1.4; }
          .theme-provider h5 { font-size: calc(1.125rem * var(--font-scale)); line-height: 1.4; }
          .theme-provider h6 { font-size: calc(1rem * var(--font-scale)); line-height: 1.5; }

          .text-xl { font-size: calc(1.25rem * var(--font-scale)) !important; }
          .text-2xl { font-size: calc(1.5rem * var(--font-scale)) !important; }
          .text-3xl { font-size: calc(1.875rem * var(--font-scale)) !important; }
          .text-4xl { font-size: calc(2.25rem * var(--font-scale)) !important; }
          .text-5xl { font-size: calc(3rem * var(--font-scale)) !important; }
          .text-6xl { font-size: calc(3.75rem * var(--font-scale)) !important; }

          /* ── Spacing Scale ── */
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

          /* ── Transitions ── */
          a, button, .btn, .card, [class*="hover:"] {
            transition-duration: var(--transition-duration);
          }

          /* ── Color Utilities ── */
          .bg-primary { background-color: var(--color-primary) !important; }
          .bg-primary-light { background-color: var(--color-primary-light) !important; }
          .bg-primary-glow { background-color: var(--color-primary-glow) !important; }
          .text-primary { color: var(--color-primary) !important; }
          .text-primary-light { color: var(--color-primary-light) !important; }
          .border-primary { border-color: var(--color-primary) !important; }

          .bg-secondary { background-color: var(--color-secondary) !important; }
          .bg-secondary-light { background-color: var(--color-secondary-light) !important; }
          .text-secondary-color { color: var(--color-secondary) !important; }
          .text-secondary-light { color: var(--color-secondary-light) !important; }
          .border-secondary { border-color: var(--color-secondary) !important; }

          .bg-surface { background-color: var(--color-surface) !important; }
          .bg-background { background-color: var(--color-background) !important; }
          .border-color { border-color: var(--color-border) !important; }

          .bg-grey-light { background-color: var(--color-grey-light) !important; }
          .bg-grey-mid { background-color: var(--color-grey-mid) !important; }
          .bg-grey-dark { background-color: var(--color-grey-dark) !important; }
          .text-grey-mid { color: var(--color-grey-mid) !important; }
          .text-grey-dark { color: var(--color-grey-dark) !important; }
          .border-grey { border-color: var(--color-border) !important; }

          .text-primary-text { color: var(--color-text-primary) !important; }
          .text-secondary-text { color: var(--color-text-secondary) !important; }
          .text-muted { color: var(--color-text-muted) !important; }

          .bg-success { background-color: var(--color-success) !important; }
          .bg-success-light { background-color: var(--color-success-light) !important; }
          .bg-success-dark { background-color: var(--color-success-dark) !important; }
          .text-success { color: var(--color-success) !important; }
          .text-success-dark { color: var(--color-success-dark) !important; }
          .border-success { border-color: var(--color-success) !important; }

          .bg-warning { background-color: var(--color-warning) !important; }
          .bg-warning-light { background-color: var(--color-warning-light) !important; }
          .bg-warning-dark { background-color: var(--color-warning-dark) !important; }
          .text-warning { color: var(--color-warning) !important; }
          .text-warning-dark { color: var(--color-warning-dark) !important; }
          .border-warning { border-color: var(--color-warning) !important; }

          .bg-error { background-color: var(--color-error) !important; }
          .bg-error-light { background-color: var(--color-error-light) !important; }
          .bg-error-dark { background-color: var(--color-error-dark) !important; }
          .text-error { color: var(--color-error) !important; }
          .text-error-dark { color: var(--color-error-dark) !important; }
          .border-error { border-color: var(--color-error) !important; }

          .bg-info { background-color: var(--color-info) !important; }
          .bg-info-light { background-color: var(--color-info-light) !important; }
          .bg-info-dark { background-color: var(--color-info-dark) !important; }
          .text-info { color: var(--color-info) !important; }
          .text-info-dark { color: var(--color-info-dark) !important; }
          .border-info { border-color: var(--color-info) !important; }

          .bg-gradient-primary { background: var(--gradient-primary) !important; }
          .bg-gradient-secondary { background: var(--gradient-secondary) !important; }
          .bg-gradient-hero { background: var(--gradient-hero) !important; }

          /* ── Button Design System ── */
          .btn {
            padding: var(--btn-md-py) var(--btn-md-px);
            border-radius: var(--btn-border-radius);
            font-family: var(--font-body);
            font-size: var(--btn-md-font);
            font-weight: var(--btn-font-weight);
            border: var(--btn-border-width) solid transparent;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: var(--btn-icon-gap);
            transition: all var(--btn-transition);
            text-decoration: none;
            white-space: nowrap;
            line-height: 1.4;
          }

          .btn:hover { transform: translateY(var(--btn-hover-y)); }
          .btn:active { transform: translateY(0); }
          .btn:disabled, .btn[disabled] {
            opacity: var(--btn-disabled-opacity);
            cursor: not-allowed;
            pointer-events: none;
          }

          .btn svg {
            width: var(--btn-md-icon);
            height: var(--btn-md-icon);
            flex-shrink: 0;
          }

          .btn-sm { padding: var(--btn-sm-py) var(--btn-sm-px); font-size: var(--btn-sm-font); }
          .btn-sm svg { width: var(--btn-sm-icon); height: var(--btn-sm-icon); }

          .btn-lg { padding: var(--btn-lg-py) var(--btn-lg-px); font-size: var(--btn-lg-font); }
          .btn-lg svg { width: var(--btn-lg-icon); height: var(--btn-lg-icon); }

          .btn-primary { background: var(--btn-primary-bg); color: var(--btn-primary-text); border-color: transparent; }
          .btn-primary:hover { background: var(--btn-primary-hover); }

          .btn-secondary { background: var(--btn-secondary-bg); color: var(--btn-secondary-text); border-color: transparent; }
          .btn-secondary:hover { background: var(--btn-secondary-hover); }

          .btn-danger { background: var(--btn-danger-bg); color: var(--btn-danger-text); border-color: transparent; }
          .btn-danger:hover { background: var(--btn-danger-hover); }

          .btn-success { background: var(--btn-success-bg); color: var(--btn-success-text); border-color: transparent; }
          .btn-success:hover { background: var(--btn-success-hover); }

          .btn-outline-primary { background: transparent; color: var(--btn-primary-bg); border-color: var(--btn-primary-bg); }
          .btn-outline-primary:hover { background: var(--btn-primary-bg); color: var(--btn-primary-text); }

          .btn-outline-neutral { background: transparent; color: var(--color-text-secondary); border-color: var(--color-border); }
          .btn-outline-neutral:hover { background: var(--color-grey-light); border-color: var(--color-grey-dark); color: var(--color-text-primary); }

          .btn-ghost { background: transparent; border-color: transparent; color: var(--btn-primary-bg); padding-left: 0; padding-right: 0; }
          .btn-ghost:hover { text-decoration: underline; transform: none; }

          .btn-group { display: inline-flex; gap: 8px; }
        `
      }} />
    </>
  )
}
