import { getPayload } from 'payload'
import configPromise from '@payload-config'
/**
 * ThemeStyles Server Component
 *
 * Fetches theme data from Payload and generates CSS custom properties
 * for all 54 design tokens (Colors, Spacing, Typography, Gradients, Visual).
 *
 * Usage: Include in root layout <head>
 */
export async function ThemeStyles() {
  let theme: Record<string, any> | null = null

  try {
    const payload = await getPayload({ config: configPromise })

    // Fetch theme global
    theme = (await payload.findGlobal({
      slug: 'theme',
    })) as Record<string, any>
  } catch (error) {
    console.error('[ThemeStyles] Failed to fetch theme:', error)
    // Continue with fallback values
  }

  // ═══════════════════════════════════════════════════════════
  // Generate CSS Variables (54 total)
  // ═══════════════════════════════════════════════════════════

  // 1. Colors (16 variables)
  const colorVars = `
    --navy: ${theme?.navy || '#0A1628'};
    --navy-light: ${theme?.navyLight || '#121F33'};
    --teal: ${theme?.teal || '#00897B'};
    --teal-light: ${theme?.tealLight || '#26A69A'};
    --teal-dark: ${theme?.tealDark || '#00695C'};
    --green: ${theme?.green || '#00C853'};
    --coral: ${theme?.coral || '#FF6B6B'};
    --amber: ${theme?.amber || '#F59E0B'};
    --blue: ${theme?.blue || '#2196F3'};
    --purple: ${theme?.purple || '#7C3AED'};
    --white: ${theme?.white || '#FAFBFC'};
    --bg: ${theme?.bg || '#F5F7FA'};
    --grey: ${theme?.grey || '#E8ECF1'};
    --grey-mid: ${theme?.greyMid || '#94A3B8'};
    --grey-dark: ${theme?.greyDark || '#64748B'};
    --text: ${theme?.text || '#1E293B'};
  `

  // 2. Spacing (9 variables - 4px grid system)
  const spacingVars = `
    --sp-1: ${theme?.sp1 || 4}px;
    --sp-2: ${theme?.sp2 || 8}px;
    --sp-3: ${theme?.sp3 || 12}px;
    --sp-4: ${theme?.sp4 || 16}px;
    --sp-6: ${theme?.sp6 || 24}px;
    --sp-8: ${theme?.sp8 || 32}px;
    --sp-12: ${theme?.sp12 || 48}px;
    --sp-16: ${theme?.sp16 || 64}px;
    --sp-20: ${theme?.sp20 || 80}px;
  `

  // 3. Typography (11 variables)
  const typographyVars = `
    --font: ${theme?.fontBody || "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif"};
    --font-display: ${theme?.fontDisplay || "'DM Serif Display', Georgia, serif"};
    --font-mono: ${theme?.fontMono || "'JetBrains Mono', 'Courier New', monospace"};
    --text-hero: ${theme?.heroSize || 36}px;
    --text-section: ${theme?.sectionSize || 24}px;
    --text-card-title: ${theme?.cardTitleSize || 18}px;
    --text-body-lg: ${theme?.bodyLgSize || 15}px;
    --text-body: ${theme?.bodySize || 13}px;
    --text-small: ${theme?.smallSize || 12}px;
    --text-label: ${theme?.labelSize || 10}px;
    --text-micro: ${theme?.microSize || 8}px;
  `

  // 4. Gradients (4 variables - MULTI-TENANT MUST-HAVE)
  const gradientVars = `
    --gradient-primary: ${theme?.primaryGradient || 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)'};
    --gradient-secondary: ${theme?.secondaryGradient || 'linear-gradient(135deg, #0A1628 0%, #1B2B45 100%)'};
    --gradient-hero: ${theme?.heroGradient || 'linear-gradient(135deg, rgba(0,137,123,0.08) 0%, rgba(38,166,154,0.12) 100%)'};
    --gradient-accent: ${theme?.accentGradient || 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)'};
  `

  // 5. Visual (14 variables - radius, shadows, z-index)
  const visualVars = `
    --r-sm: ${theme?.radiusSm || 8}px;
    --r-md: ${theme?.radiusMd || 12}px;
    --r-lg: ${theme?.radiusLg || 16}px;
    --r-xl: ${theme?.radiusXl || 20}px;
    --r-full: ${theme?.radiusFull || 9999}px;
    --sh-sm: ${theme?.shadowSm || '0 1px 3px rgba(10, 22, 40, 0.06)'};
    --sh-md: ${theme?.shadowMd || '0 4px 20px rgba(10, 22, 40, 0.08)'};
    --sh-lg: ${theme?.shadowLg || '0 8px 40px rgba(10, 22, 40, 0.12)'};
    --sh-xl: ${theme?.shadowXl || '0 20px 60px rgba(10, 22, 40, 0.16)'};
    --z-dropdown: ${theme?.zDropdown || 100};
    --z-sticky: ${theme?.zSticky || 200};
    --z-overlay: ${theme?.zOverlay || 300};
    --z-modal: ${theme?.zModal || 400};
    --z-toast: ${theme?.zToast || 500};
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
