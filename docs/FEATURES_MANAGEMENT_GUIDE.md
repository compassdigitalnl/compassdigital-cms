# Features Management System - Complete Guide

**Last updated:** February 10, 2026
**Status:** ✅ **FULLY IMPLEMENTED** - Multi-Level Feature Toggle System
**Current approach:** Database + ENV hybrid (Phase 1 + 2 COMBINED!)

---

## 🎉 UPDATE: Multi-Level Feature Toggle System (Feb 10, 2026)

**Status:** ✅ **PRODUCTION READY**

We hebben het feature toggle systeem **volledig geïmplementeerd** met multi-level support:

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│              MULTI-LEVEL FEATURE TOGGLES                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Level 1: CLIENT-SPECIFIC (Database)                        │
│  ├─ Stored in Clients.features field                        │
│  ├─ Managed via CMS by platform admins                      │
│  └─ Highest priority                                        │
│                                                              │
│  Level 2: ENV VARIABLES (Deployment)                        │
│  ├─ Generated during provisioning from client.features      │
│  ├─ Used by client deployments                              │
│  └─ Fallback if database not available                      │
│                                                              │
│  Level 3: DEFAULTS (Code)                                   │
│  └─ Hardcoded defaults in features.ts                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### What's New?

1. **Clients.features Field** - Granular checkbox UI in Platform CMS
2. **Automatic ENV Generation** - Provisioning generates `ENABLE_*` vars from database
3. **Sync API** - Update features on existing deployments without full redeploy
4. **Route Protection** - Feature guards prevent access to disabled routes
5. **Collection Visibility** - Collections auto-hide based on client features

### Quick Start

**For New Clients:**
1. Create client in Platform CMS (`/admin`)
2. Open "Template & Functies" section
3. Select only needed features via checkboxes
4. Provision → ENV vars generated automatically
5. Clean deployment with only needed features! ✅

**For Existing Clients (like Plastimed):**
1. Open client in Platform CMS
2. Disable unwanted features (vendors, workshops, etc.)
3. Call `POST /api/platform/clients/{id}/sync-features`
4. ENV vars updated on server
5. SSH + restart PM2 → Features disabled! ✅

See `docs/PLASTIMED_FEATURE_CLEANUP.md` for detailed cleanup guide.

---

## 📋 Table of Contents

1. [The Problem](#the-problem)
2. [Solution Overview](#solution-overview)
3. [Phase 1: ENV-based Toggles (Current)](#phase-1-env-based-toggles-current)
4. [Phase 2: CMS-based Feature Management (Future)](#phase-2-cms-based-feature-management-future)
5. [Implementation Examples](#implementation-examples)
6. [Feature Categories](#feature-categories)
7. [Best Practices](#best-practices)

---

## The Problem

**Challenge:** Not all clients need all features. A simple B2B website doesn't need:
- Vendor/Marketplace functionality
- Workshops/Training modules
- Multi-language support
- Advanced e-commerce features
- Multi-tenant platform capabilities

**Issues this causes:**
- ❌ Cluttered CMS admin panel
- ❌ Confused end-users seeing irrelevant options
- ❌ Slower admin performance (more collections to load)
- ❌ Harder to maintain and test
- ❌ Difficulty in creating pricing tiers for SaaS

**Example:** A simple bedrijfswebsite needs only Pages, Media, Blog. They don't need:
- Shop, Products, ProductCategories
- Vendors, VendorReviews, Workshops
- CustomerGroups, Orders, Cart
- Platform/Multi-tenant collections

---

## Solution Overview

Implement a **Feature Toggle System** that allows enabling/disabling entire feature modules.

### Benefits

✅ **Clean CMS** - Only show features the client actually uses
✅ **No Confusion** - Users see only relevant options
✅ **Better Performance** - Fewer collections = faster admin panel
✅ **Flexible** - Easy to enable/disable features per client
✅ **Scalable** - Perfect foundation for SaaS pricing tiers
✅ **Maintainable** - Clear separation of concerns

---

## Phase 1: ENV-based Toggles (Current)

**Status:** ✅ **IMPLEMENTED (Sprint 5)**

Simple environment variable approach for quick deployment.

### Configuration

```bash
# .env - Feature Toggles
# =====================

# E-commerce Features
ENABLE_SHOP=true                    # Product catalog, shop pages
ENABLE_CART=true                    # Shopping cart functionality
ENABLE_CHECKOUT=true                # Checkout process
ENABLE_WISHLISTS=false              # Wishlists/Favorites

# Marketplace Features (Sprint 5)
ENABLE_VENDORS=false                # Multi-vendor marketplace
ENABLE_VENDOR_REVIEWS=false         # Vendor review system
ENABLE_WORKSHOPS=false              # Workshops/Training module

# Content Features
ENABLE_BLOG=true                    # Blog posts
ENABLE_FAQ=true                     # FAQ pages
ENABLE_TESTIMONIALS=true            # Customer testimonials

# Advanced Features
ENABLE_MULTI_LANGUAGE=false         # Multi-language support
ENABLE_AI_CONTENT=false             # AI content generation
ENABLE_PLATFORM=false               # Multi-tenant SaaS platform
```

### Usage in Code

**1. Helper Function:** `src/lib/features.ts`

```typescript
/**
 * Check if a feature is enabled via environment variables
 */
export function isFeatureEnabled(feature: string): boolean {
  const envVar = `ENABLE_${feature.toUpperCase()}`
  const value = process.env[envVar]

  // Default to true if not explicitly set to 'false'
  return value !== 'false'
}

// Convenience helpers for common features
export const features = {
  shop: isFeatureEnabled('shop'),
  vendors: isFeatureEnabled('vendors'),
  workshops: isFeatureEnabled('workshops'),
  blog: isFeatureEnabled('blog'),
  platform: isFeatureEnabled('platform'),
  multiLanguage: isFeatureEnabled('multi_language'),
  aiContent: isFeatureEnabled('ai_content'),
}
```

**2. Conditionally Register Collections:** `src/payload.config.ts`

```typescript
import { features } from '@/lib/features'

const collections: CollectionConfig[] = [
  // Core collections (always enabled)
  Users,
  Media,
  Pages,
  Settings,
]

// E-commerce
if (features.shop) {
  collections.push(
    Products,
    ProductCategories,
    Brands,
  )
}

if (features.vendors) {
  collections.push(
    Vendors,
    VendorReviews,
  )
}

if (features.workshops) {
  collections.push(Workshops)
}

if (features.blog) {
  collections.push(
    BlogPosts,
    BlogCategories,
  )
}

if (features.platform) {
  collections.push(
    Clients,
    ClientRequests,
    PlatformAdmins,
  )
}

export default buildConfig({
  collections,
  // ...
})
```

**3. Conditionally Show Admin Sidebar:** `src/collections/Vendors.ts`

```typescript
import { features } from '@/lib/features'

export const Vendors: CollectionConfig = {
  slug: 'vendors',
  admin: {
    group: 'Marketplace',
    // Only show in sidebar if feature is enabled
    hidden: !features.vendors,
  },
  // ...
}
```

**4. Conditionally Show Blocks:**

```typescript
// In ProductGrid block
admin: {
  // Only show this block if shop is enabled
  condition: () => features.shop,
}
```

**5. Conditionally Render Frontend:**

```typescript
// In layout.tsx or page.tsx
import { features } from '@/lib/features'

export default function Layout() {
  return (
    <>
      <Header />

      {features.shop && <ShopNav />}
      {features.vendors && <VendorNav />}

      {children}

      <Footer />
    </>
  )
}
```

### Pros & Cons

**Pros:**
- ✅ Very simple to implement
- ✅ No database changes needed
- ✅ Works immediately
- ✅ Easy to test different configurations
- ✅ Perfect for development

**Cons:**
- ⚠️ Requires server restart to change
- ⚠️ Not client-configurable (needs developer)
- ⚠️ Not suitable for SaaS with multiple tenants
- ⚠️ Can't be changed per-client in multi-tenant setup

---

## Phase 2: CMS-based Feature Management (Future)

**Status:** 🔮 **RECOMMENDED FOR FUTURE**

Allow end-users to enable/disable features via the CMS admin panel.

### Implementation: Settings Global

Add a "Features" tab to `src/globals/Settings.ts`:

```typescript
import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Settings',
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    // ... existing tabs (general, templates, etc.)

    {
      type: 'tabs',
      tabs: [
        // ... existing tabs

        {
          label: 'Features',
          description: 'Enable or disable features to keep your CMS clean and focused',
          fields: [
            {
              type: 'collapsible',
              label: 'E-commerce Features',
              admin: {
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'enableShop',
                  type: 'checkbox',
                  label: 'Enable Shop',
                  defaultValue: true,
                  admin: {
                    description: 'Product catalog, shop pages, product filters',
                  },
                },
                {
                  name: 'enableCart',
                  type: 'checkbox',
                  label: 'Enable Shopping Cart',
                  defaultValue: true,
                  admin: {
                    description: 'Add to cart, cart page, mini-cart',
                    condition: (data) => data.enableShop,
                  },
                },
                {
                  name: 'enableCheckout',
                  type: 'checkbox',
                  label: 'Enable Checkout',
                  defaultValue: true,
                  admin: {
                    description: 'Checkout flow, payment processing',
                    condition: (data) => data.enableCart,
                  },
                },
                {
                  name: 'enableWishlists',
                  type: 'checkbox',
                  label: 'Enable Wishlists/Favorites',
                  defaultValue: false,
                  admin: {
                    description: 'Allow customers to save favorite products',
                  },
                },
                {
                  name: 'enableProductReviews',
                  type: 'checkbox',
                  label: 'Enable Product Reviews',
                  defaultValue: false,
                  admin: {
                    description: 'Customer product reviews and ratings',
                  },
                },
              ],
            },

            {
              type: 'collapsible',
              label: 'Marketplace Features',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'enableVendors',
                  type: 'checkbox',
                  label: 'Enable Vendors/Suppliers',
                  defaultValue: false,
                  admin: {
                    description: 'Multi-vendor marketplace with vendor pages, vendor products',
                  },
                },
                {
                  name: 'enableVendorReviews',
                  type: 'checkbox',
                  label: 'Enable Vendor Reviews',
                  defaultValue: false,
                  admin: {
                    description: 'Customer reviews for vendors',
                    condition: (data) => data.enableVendors,
                  },
                },
                {
                  name: 'enableWorkshops',
                  type: 'checkbox',
                  label: 'Enable Workshops/Training',
                  defaultValue: false,
                  admin: {
                    description: 'Workshops, training sessions, event calendar',
                  },
                },
              ],
            },

            {
              type: 'collapsible',
              label: 'Content Features',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'enableBlog',
                  type: 'checkbox',
                  label: 'Enable Blog',
                  defaultValue: true,
                  admin: {
                    description: 'Blog posts, categories, archive pages',
                  },
                },
                {
                  name: 'enableFAQ',
                  type: 'checkbox',
                  label: 'Enable FAQ Pages',
                  defaultValue: true,
                  admin: {
                    description: 'FAQ collection and FAQ blocks',
                  },
                },
                {
                  name: 'enableTestimonials',
                  type: 'checkbox',
                  label: 'Enable Testimonials',
                  defaultValue: true,
                  admin: {
                    description: 'Customer testimonials and reviews',
                  },
                },
                {
                  name: 'enableCases',
                  type: 'checkbox',
                  label: 'Enable Case Studies',
                  defaultValue: false,
                  admin: {
                    description: 'Project showcase, portfolio, case studies',
                  },
                },
              ],
            },

            {
              type: 'collapsible',
              label: 'Advanced Features',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'enableMultiLanguage',
                  type: 'checkbox',
                  label: 'Enable Multi-language',
                  defaultValue: false,
                  admin: {
                    description: 'Multiple languages, translations, language switcher',
                  },
                },
                {
                  name: 'enableAIContent',
                  type: 'checkbox',
                  label: 'Enable AI Content Generation',
                  defaultValue: false,
                  admin: {
                    description: 'AI-powered content generation, SEO optimization',
                  },
                },
                {
                  name: 'enablePlatform',
                  type: 'checkbox',
                  label: 'Enable Platform/Multi-tenant',
                  defaultValue: false,
                  admin: {
                    description: 'For SaaS platforms managing multiple client sites',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

### Usage in Code

**Helper Function with Settings Support:**

```typescript
import { Settings } from '@/payload-types'

export async function isFeatureEnabled(
  feature: keyof Settings['features']
): Promise<boolean> {
  // Try to get from Settings global
  try {
    const settings = await payload.findGlobal({
      slug: 'settings',
    })

    if (settings?.features?.[feature] !== undefined) {
      return settings.features[feature]
    }
  } catch (e) {
    // Settings not available, fall back to ENV
  }

  // Fallback to ENV variable
  const envVar = `ENABLE_${feature.toUpperCase().replace(/([A-Z])/g, '_$1')}`
  return process.env[envVar] !== 'false'
}

// Server-side usage
const shopEnabled = await isFeatureEnabled('enableShop')

// Client-side usage (pass via props)
export async function getServerSideProps() {
  const settings = await payload.findGlobal({ slug: 'settings' })

  return {
    props: {
      features: settings.features,
    },
  }
}
```

### Dynamic Collection Registration

**Challenge:** Collections must be registered at build time, not runtime.

**Solution 1: Hybrid Approach (Recommended)**
- ENV controls which collections are registered
- Settings global controls UI visibility and blocks

```typescript
// Collections registered based on ENV (build time)
if (process.env.ENABLE_VENDORS !== 'false') {
  collections.push(Vendors)
}

// But visibility controlled by Settings (runtime)
export const Vendors: CollectionConfig = {
  admin: {
    hidden: async () => {
      const settings = await payload.findGlobal({ slug: 'settings' })
      return !settings?.features?.enableVendors
    },
  },
}
```

**Solution 2: Register All, Hide Selectively**
- Always register all collections
- Use `hidden` property to hide based on Settings

```typescript
// Always register
collections.push(Vendors, Workshops, etc.)

// Hide based on settings
export const Vendors: CollectionConfig = {
  admin: {
    hidden: async ({ user }) => {
      const settings = await payload.findGlobal({ slug: 'settings' })
      return !settings?.features?.enableVendors
    },
  },
}
```

### Pros & Cons

**Pros:**
- ✅ User-friendly (no code changes needed)
- ✅ No server restart required
- ✅ Per-client configuration in multi-tenant
- ✅ Can be part of pricing tiers
- ✅ Audit trail (who enabled what, when)

**Cons:**
- ⚠️ More complex to implement
- ⚠️ Collections still loaded (just hidden)
- ⚠️ Requires database changes
- ⚠️ Need to handle edge cases (data already exists)

---

## Implementation Examples

### Example 1: Hide Navigation Items

```typescript
// src/components/Header.tsx
import { features } from '@/lib/features'

export function Header({ settings }) {
  return (
    <nav>
      <Link href="/">Home</Link>

      {features.shop && (
        <Link href="/shop">Shop</Link>
      )}

      {features.vendors && (
        <Link href="/vendors">Leveranciers</Link>
      )}

      {features.workshops && (
        <Link href="/workshops">Workshops</Link>
      )}

      {features.blog && (
        <Link href="/blog">Blog</Link>
      )}
    </nav>
  )
}
```

### Example 2: Conditional API Routes

```typescript
// src/app/api/vendors/route.ts
import { features } from '@/lib/features'

export async function GET(req: Request) {
  // Return 404 if feature disabled
  if (!features.vendors) {
    return new Response('Not Found', { status: 404 })
  }

  // ... handle request
}
```

### Example 3: Conditional Blocks

```typescript
// src/blocks/VendorGrid/config.ts
import { features } from '@/lib/features'

export const VendorGridBlock: Block = {
  slug: 'vendorGrid',
  labels: {
    singular: 'Vendor Grid',
    plural: 'Vendor Grids',
  },
  admin: {
    // Only show this block if vendors are enabled
    condition: () => features.vendors,
  },
  fields: [
    // ...
  ],
}
```

---

## Feature Categories

### Core Features (Always Enabled)
- ✅ Pages (content management)
- ✅ Media (image/file uploads)
- ✅ Users (authentication)
- ✅ Settings (global configuration)
- ✅ Header/Footer (site structure)

### E-commerce Features
- `enableShop` - Product catalog
- `enableCart` - Shopping cart
- `enableCheckout` - Checkout process
- `enableWishlists` - Save favorites
- `enableProductReviews` - Product reviews

### Marketplace Features
- `enableVendors` - Multi-vendor marketplace
- `enableVendorReviews` - Vendor ratings
- `enableWorkshops` - Training/events

### Content Features
- `enableBlog` - Blog system
- `enableFAQ` - FAQ pages
- `enableTestimonials` - Customer reviews
- `enableCases` - Case studies/portfolio

### Advanced Features
- `enableMultiLanguage` - i18n support
- `enableAIContent` - AI generation
- `enablePlatform` - Multi-tenant SaaS

---

## Best Practices

### 1. Default Values
```typescript
// Default to enabled for backward compatibility
const defaultEnabled = true

// Default to disabled for new features
const defaultDisabled = false
```

### 2. Feature Dependencies
```typescript
// Cart requires Shop
if (features.cart && !features.shop) {
  console.warn('Cart requires Shop feature to be enabled')
  features.cart = false
}

// Vendor reviews require Vendors
if (features.vendorReviews && !features.vendors) {
  features.vendorReviews = false
}
```

### 3. Migration Path
```typescript
// When disabling a feature with existing data
if (!features.vendors && hasVendorData) {
  console.warn('Vendors feature disabled but vendor data exists')
  // Option 1: Keep collections visible
  // Option 2: Archive data
  // Option 3: Require manual data cleanup
}
```

### 4. Documentation
```typescript
// Always document why a feature exists
{
  name: 'enableVendors',
  type: 'checkbox',
  admin: {
    description: 'Multi-vendor marketplace. Adds Vendors collection, vendor pages, vendor-specific products. Used for B2B marketplaces like Plastimed.',
  },
}
```

### 5. Testing
```bash
# Test with features disabled
ENABLE_SHOP=false npm run dev

# Test with only specific features
ENABLE_VENDORS=true ENABLE_WORKSHOPS=true npm run dev
```

---

## SaaS Pricing Integration (Future)

Features can map directly to pricing tiers:

### Starter Tier ($49/month)
```typescript
{
  enableShop: false,
  enableBlog: true,
  enableFAQ: true,
  enableTestimonials: true,
  enableMultiLanguage: false,
}
```

### Professional Tier ($99/month)
```typescript
{
  enableShop: true,
  enableCart: true,
  enableCheckout: true,
  enableBlog: true,
  enableFAQ: true,
  enableTestimonials: true,
  enableMultiLanguage: false,
}
```

### Enterprise Tier ($299/month)
```typescript
{
  enableShop: true,
  enableCart: true,
  enableCheckout: true,
  enableVendors: true,
  enableWorkshops: true,
  enableBlog: true,
  enableMultiLanguage: true,
  enableAIContent: true,
}
```

---

## Migration Plan

### Phase 1: ENV-based (Current - Sprint 5)
- ✅ Implement ENV variables
- ✅ Add feature checks to collections
- ✅ Add feature checks to templates
- ✅ Document in this guide

### Phase 2: Settings Global (Q2 2026)
- Add Features tab to Settings global
- Implement hybrid ENV + Settings approach
- Migrate existing feature flags
- Update documentation

### Phase 3: SaaS Integration (Q3 2026)
- Link features to pricing tiers
- Implement feature usage tracking
- Add feature upgrade prompts
- Billing integration

---

## Conclusion

**Current Approach (Sprint 5):**
- ✅ Using ENV-based feature toggles
- ✅ Simple, fast, works immediately
- ✅ Perfect for development and initial deployment

**Future Recommendation:**
- 🔮 Implement Settings global "Features" tab
- 🔮 Allow clients to self-service feature management
- 🔮 Foundation for SaaS pricing tiers

**Next Steps:**
1. Complete Sprint 5 with ENV-based toggles
2. Gather feedback on which features are most used
3. Design Settings UI for feature management
4. Implement Phase 2 when scaling to SaaS

---

**Questions?** See `docs/DEPLOYMENT_GUIDE.md` for environment variable setup.
