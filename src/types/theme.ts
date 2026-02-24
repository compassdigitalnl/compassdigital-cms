// ═══════════════════════════════════════════════════════════
// THEME TYPE DEFINITIONS
// Complete type safety for Compass Design System
// ═══════════════════════════════════════════════════════════

/**
 * Colors (16 tokens)
 * Primary, status, and neutral color palette
 */
export interface ThemeColors {
  // Primary Colors
  navy: string // #0A1628
  navyLight: string // #121F33
  teal: string // #00897B
  tealLight: string // #26A69A
  tealDark: string // #00695C

  // Status Colors
  green: string // #00C853
  coral: string // #FF6B6B
  amber: string // #F59E0B
  blue: string // #2196F3
  purple: string // #7C3AED

  // Neutral Colors
  white: string // #FAFBFC
  bg: string // #F5F7FA
  grey: string // #E8ECF1
  greyMid: string // #94A3B8
  greyDark: string // #64748B
  text: string // #1E293B
}

/**
 * Spacing (9 tokens)
 * 4px grid system - read-only tokens
 */
export interface ThemeSpacing {
  sp1: number // 4px
  sp2: number // 8px
  sp3: number // 12px
  sp4: number // 16px
  sp6: number // 24px
  sp8: number // 32px
  sp12: number // 48px
  sp16: number // 64px
  sp20: number // 80px
}

/**
 * Typography (11 tokens)
 * Font families and type scale
 */
export interface ThemeTypography {
  // Font Families
  fontBody: string // 'Plus Jakarta Sans', 'DM Sans', system-ui
  fontDisplay: string // 'DM Serif Display', Georgia, serif
  fontMono: string // 'JetBrains Mono', 'Courier New', monospace

  // Type Scale (sizes in px)
  heroSize: number // 36px
  sectionSize: number // 24px
  cardTitleSize: number // 18px
  bodyLgSize: number // 15px
  bodySize: number // 13px
  smallSize: number // 12px
  labelSize: number // 10px
  microSize: number // 8px
}

/**
 * Gradients (4 tokens)
 * CSS gradients for buttons, backgrounds, hero sections
 */
export interface ThemeGradients {
  primaryGradient: string // linear-gradient(...) - buttons, CTAs
  secondaryGradient: string // linear-gradient(...) - dark sections
  heroGradient: string // linear-gradient(...) - hero overlays
  accentGradient: string // linear-gradient(...) - promotions, badges
}

/**
 * Visual (14 tokens)
 * Border radius, shadows, z-index layering
 */
export interface ThemeVisual {
  // Border Radius (5 tokens)
  radiusSm: number // 8px
  radiusMd: number // 12px
  radiusLg: number // 16px
  radiusXl: number // 20px
  radiusFull: number // 9999px

  // Box Shadows (4 tokens)
  shadowSm: string // 0 1px 3px rgba(...)
  shadowMd: string // 0 4px 20px rgba(...)
  shadowLg: string // 0 8px 40px rgba(...)
  shadowXl: string // 0 20px 60px rgba(...)

  // Z-index Scale (5 tokens)
  zDropdown: number // 100
  zSticky: number // 200
  zOverlay: number // 300
  zModal: number // 400
  zToast: number // 500
}

/**
 * Complete Theme Global interface
 * All design tokens in one type-safe structure
 */
export interface Theme {
  id: string

  // Design Token Groups (54 tokens total)
  colors?: ThemeColors // 16 tokens
  spacing?: ThemeSpacing // 9 tokens
  typography?: ThemeTypography // 11 tokens
  gradients?: ThemeGradients // 4 tokens
  visual?: ThemeVisual // 14 tokens

  // Metadata
  updatedAt: string
  createdAt: string
}

/**
 * Multi-Tenant Theme Config (Themes collection)
 * Vertical-specific overrides for design tokens
 */
export interface ThemeConfig {
  id: string
  name: string // "Beauty / Salon", "Horeca", etc.
  slug: string // "beauty", "horeca", etc. (used in data-theme attribute)
  isDefault: boolean // Mark default vertical

  // Color Overrides
  primaryColor?: string // Override --teal
  darkSurface?: string // Override --navy

  // Typography Overrides
  bodyFont?: string // Override font family

  // Gradient Overrides
  primaryGradient?: string // Override button gradients
  heroGradient?: string // Override hero section gradients

  // Custom Colors (vertical-specific)
  customColors?: Array<{
    tokenName: string // e.g., "pink", "gold"
    tokenValue: string // hex color or CSS value
  }>

  // Metadata
  templateCount?: number // Number of vertical-specific templates
  uniqueComponentCount?: number // Number of vertical-specific components
  status?: 'active' | 'development' | 'archived'
  updatedAt: string
  createdAt: string
}
