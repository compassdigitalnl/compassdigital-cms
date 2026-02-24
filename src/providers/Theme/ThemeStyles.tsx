import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Theme } from '@/types/theme'

/**
 * ThemeStyles Server Component
 *
 * Fetches theme data from Payload and generates CSS custom properties
 * for all 54 design tokens (Colors, Spacing, Typography, Gradients, Visual).
 *
 * Usage: Include in root layout <head>
 */
export async function ThemeStyles() {
  let theme: Theme | null = null

  try {
    const payload = await getPayload({ config: configPromise })

    // Fetch theme global
    theme = (await payload.findGlobal({
      slug: 'theme',
    })) as Theme
  } catch (error) {
    console.error('[ThemeStyles] Failed to fetch theme:', error)
    // Continue with fallback values
  }

  // ═══════════════════════════════════════════════════════════
  // Generate CSS Variables (54 total)
  // ═══════════════════════════════════════════════════════════

  // 1. Colors (16 variables)
  const colors = theme?.colors || {}
  const colorVars = `
    --navy: ${colors.navy || '#0A1628'};
    --navy-light: ${colors.navyLight || '#121F33'};
    --teal: ${colors.teal || '#00897B'};
    --teal-light: ${colors.tealLight || '#26A69A'};
    --teal-dark: ${colors.tealDark || '#00695C'};
    --green: ${colors.green || '#00C853'};
    --coral: ${colors.coral || '#FF6B6B'};
    --amber: ${colors.amber || '#F59E0B'};
    --blue: ${colors.blue || '#2196F3'};
    --purple: ${colors.purple || '#7C3AED'};
    --white: ${colors.white || '#FAFBFC'};
    --bg: ${colors.bg || '#F5F7FA'};
    --grey: ${colors.grey || '#E8ECF1'};
    --grey-mid: ${colors.greyMid || '#94A3B8'};
    --grey-dark: ${colors.greyDark || '#64748B'};
    --text: ${colors.text || '#1E293B'};
  `

  // 2. Spacing (9 variables - 4px grid system)
  const spacing = theme?.spacing || {}
  const spacingVars = `
    --sp-1: ${spacing.sp1 || 4}px;
    --sp-2: ${spacing.sp2 || 8}px;
    --sp-3: ${spacing.sp3 || 12}px;
    --sp-4: ${spacing.sp4 || 16}px;
    --sp-6: ${spacing.sp6 || 24}px;
    --sp-8: ${spacing.sp8 || 32}px;
    --sp-12: ${spacing.sp12 || 48}px;
    --sp-16: ${spacing.sp16 || 64}px;
    --sp-20: ${spacing.sp20 || 80}px;
  `

  // 3. Typography (11 variables)
  const typography = theme?.typography || {}
  const typographyVars = `
    --font: ${typography.fontBody || "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif"};
    --font-display: ${typography.fontDisplay || "'DM Serif Display', Georgia, serif"};
    --font-mono: ${typography.fontMono || "'JetBrains Mono', 'Courier New', monospace"};
    --text-hero: ${typography.heroSize || 36}px;
    --text-section: ${typography.sectionSize || 24}px;
    --text-card-title: ${typography.cardTitleSize || 18}px;
    --text-body-lg: ${typography.bodyLgSize || 15}px;
    --text-body: ${typography.bodySize || 13}px;
    --text-small: ${typography.smallSize || 12}px;
    --text-label: ${typography.labelSize || 10}px;
    --text-micro: ${typography.microSize || 8}px;
  `

  // 4. Gradients (4 variables - MULTI-TENANT MUST-HAVE)
  const gradients = theme?.gradients || {}
  const gradientVars = `
    --gradient-primary: ${gradients.primaryGradient || 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)'};
    --gradient-secondary: ${gradients.secondaryGradient || 'linear-gradient(135deg, #0A1628 0%, #1B2B45 100%)'};
    --gradient-hero: ${gradients.heroGradient || 'linear-gradient(135deg, rgba(0,137,123,0.08) 0%, rgba(38,166,154,0.12) 100%)'};
    --gradient-accent: ${gradients.accentGradient || 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)'};
  `

  // 5. Visual (14 variables - radius, shadows, z-index)
  const visual = theme?.visual || {}
  const visualVars = `
    --r-sm: ${visual.radiusSm || 8}px;
    --r-md: ${visual.radiusMd || 12}px;
    --r-lg: ${visual.radiusLg || 16}px;
    --r-xl: ${visual.radiusXl || 20}px;
    --r-full: ${visual.radiusFull || 9999}px;
    --sh-sm: ${visual.shadowSm || '0 1px 3px rgba(10, 22, 40, 0.06)'};
    --sh-md: ${visual.shadowMd || '0 4px 20px rgba(10, 22, 40, 0.08)'};
    --sh-lg: ${visual.shadowLg || '0 8px 40px rgba(10, 22, 40, 0.12)'};
    --sh-xl: ${visual.shadowXl || '0 20px 60px rgba(10, 22, 40, 0.16)'};
    --z-dropdown: ${visual.zDropdown || 100};
    --z-sticky: ${visual.zSticky || 200};
    --z-overlay: ${visual.zOverlay || 300};
    --z-modal: ${visual.zModal || 400};
    --z-toast: ${visual.zToast || 500};
  `

  // Combine all CSS variables
  const allVars = `${colorVars}${spacingVars}${typographyVars}${gradientVars}${visualVars}`

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `:root { ${allVars} }`,
      }}
      id="compass-design-tokens"
    />
  )
}
