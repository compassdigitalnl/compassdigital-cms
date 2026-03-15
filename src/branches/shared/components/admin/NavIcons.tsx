'use client'

/**
 * NavIcons — Injects Lucide icons into Payload CMS sidebar nav links
 *
 * Uses CSS mask-image with data URIs so icons automatically inherit
 * the nav link's text color (gray idle, blue active).
 *
 * Added to beforeNavLinks in payload.config.ts.
 */

// ═══════════════════════════════════════════════════════════
// SVG HELPER
// ═══════════════════════════════════════════════════════════

/** Build a mask-compatible SVG data URI from Lucide icon paths */
function icon(paths: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>${paths}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

/** Same as icon() but with fill on specific elements */
function iconFill(paths: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>${paths}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

// ═══════════════════════════════════════════════════════════
// LUCIDE ICON PATHS (from lucide.dev)
// ═══════════════════════════════════════════════════════════

const COLLECTION_ICONS: Record<string, string> = {
  // E-commerce
  products: icon(
    '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  ),
  orders: icon(
    '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  ),
  'product-categories': icon(
    '<path d="M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z"/><path d="M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.88-.55H13a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1Z"/><path d="M3 5a2 2 0 0 0 2 2h3"/><path d="M3 3v13a2 2 0 0 0 2 2h3"/>',
  ),
  brands: icon(
    '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
  ),
  coupons: icon(
    '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>',
  ),
  promotions: icon(
    '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  ),
  wishlists: icon(
    '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  ),
  'product-reviews': icon(
    '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  ),
  'shipping-methods': icon(
    '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  ),
  returns: icon(
    '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  ),
  'recurring-orders': icon(
    '<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>',
  ),
  'order-lists': icon(
    '<path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="m19 10-4 4"/><path d="m15 10 4 4"/>',
  ),
  'gift-vouchers': icon(
    '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
  ),
  licenses: icon(
    '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
  ),
  notifications: icon(
    '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  ),
  'subscription-plans': icon(
    '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  ),
  'loyalty-tiers': icon(
    '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 .798.543l5.508.442a.5.5 0 0 1 .29.872l-4.2 3.544a1 1 0 0 0-.312.96l1.218 5.328a.5.5 0 0 1-.744.545l-4.73-2.81a1 1 0 0 0-1.036 0l-4.73 2.81a.5.5 0 0 1-.744-.546l1.218-5.328a1 1 0 0 0-.312-.959l-4.2-3.544a.5.5 0 0 1 .29-.872l5.508-.442a1 1 0 0 0 .798-.544z"/>',
  ),

  // Content
  pages: icon(
    '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  ),
  'blog-posts': icon(
    '<path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>',
  ),
  media: icon(
    '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  ),
  forms: icon(
    '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
  ),
  'form-submissions': icon(
    '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  ),
  redirects: icon(
    '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  ),

  // Users
  users: icon(
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  ),
  'customer-groups': icon(
    '<path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>',
  ),

  // Multistore
  'multistore-sites': icon(
    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  ),
  'multistore-sync-log': icon(
    '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
  ),

  // Branch-specific
  'content-bookings': icon(
    '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/>',
  ),
  'content-services': icon(
    '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
  ),
  'content-reviews': icon(
    '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  ),
  'content-team': icon(
    '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  ),
  'vendor-applications': icon(
    '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  ),

  // Platform
  clients: icon(
    '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>',
  ),
}

const GLOBAL_ICONS: Record<string, string> = {
  settings: icon(
    '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  ),
  'e-commerce-settings': icon(
    '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  ),
  header: icon(
    '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/>',
  ),
  footer: icon(
    '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 15h18"/>',
  ),
  theme: icon(
    '<circle cx="13.5" cy="6.5" r=".5" fill="black"/><circle cx="17.5" cy="10.5" r=".5" fill="black"/><circle cx="8.5" cy="7.5" r=".5" fill="black"/><circle cx="6.5" cy="12.5" r=".5" fill="black"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
  ),
  'chatbot-settings': icon(
    '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>',
  ),
  'meilisearch-settings': icon(
    '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  ),
}

// ═══════════════════════════════════════════════════════════
// DEFAULT FALLBACK ICON (small dot)
// ═══════════════════════════════════════════════════════════

const DEFAULT_ICON = icon('<circle cx="12" cy="12" r="2"/>')

// ═══════════════════════════════════════════════════════════
// CSS GENERATION
// ═══════════════════════════════════════════════════════════

function generateCSS(): string {
  const rules: string[] = []

  // Base: make nav links flex and add icon pseudo-element
  // NOTE: No !important on display — HideCollections uses display:none !important
  // to hide disabled collections. If we use !important here, our higher specificity
  // (.nav a.nav__link) wins over HideCollections' (a[href="..."]) and breaks hiding.
  rules.push(`
    .nav a.nav__link {
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }
    .nav a.nav__link::before {
      content: '';
      width: 18px;
      height: 18px;
      min-width: 18px;
      flex-shrink: 0;
      background-color: currentColor;
      -webkit-mask-image: ${DEFAULT_ICON};
      mask-image: ${DEFAULT_ICON};
      -webkit-mask-size: contain;
      mask-size: contain;
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
      -webkit-mask-position: center;
      mask-position: center;
      opacity: 0.65;
      transition: opacity 120ms ease;
    }
    .nav a.nav__link:hover::before,
    .nav a.nav__link.active::before {
      opacity: 1;
    }
  `)

  // Collection icons
  for (const [slug, maskUrl] of Object.entries(COLLECTION_ICONS)) {
    rules.push(`
      .nav a[href="/admin/collections/${slug}"]::before,
      .nav a[href="/admin/collections/${slug}/"]::before {
        -webkit-mask-image: ${maskUrl};
        mask-image: ${maskUrl};
      }
    `)
  }

  // Global icons
  for (const [slug, maskUrl] of Object.entries(GLOBAL_ICONS)) {
    rules.push(`
      .nav a[href="/admin/globals/${slug}"]::before,
      .nav a[href="/admin/globals/${slug}/"]::before {
        -webkit-mask-image: ${maskUrl};
        mask-image: ${maskUrl};
      }
    `)
  }

  return rules.join('\n')
}

const navIconCSS = generateCSS()

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export function NavIcons() {
  return <style dangerouslySetInnerHTML={{ __html: navIconCSS }} />
}
