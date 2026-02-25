# Template System - Quick Reference Guide

## Template Locations

### Product Templates (3)
```
/src/branches/ecommerce/components/templates/products/
├── ProductTemplate1/          1,967 lines   Enterprise, full-featured
├── ProductTemplate2/          2,041 lines   Minimal, clean design
└── ProductTemplate3/          2,051 lines   Luxury, premium design
```

### Cart Templates (2)
```
/src/app/(ecommerce)/cart/
├── CartTemplate1.tsx           976 lines   Table layout (active)
└── CartTemplate2.tsx           568 lines   Card layout (A/B test ready)
```

### Checkout Templates (2)
```
/src/app/(ecommerce)/checkout/
├── CheckoutTemplate1.tsx       657 lines   Multi-step (active)
└── CheckoutTemplate2.tsx       530 lines   Alternative (ready)
```

### Blog Templates (3)
```
/src/app/(content)/blog/[category]/[slug]/
├── BlogTemplate1.tsx           258 lines   Magazine (2-col sidebar)
├── BlogTemplate2.tsx           135 lines   Minimal (centered)
└── BlogTemplate3.tsx           184 lines   Premium (wide)
```

### Other Templates
```
/src/app/(ecommerce)/shop/
└── ShopArchiveTemplate1.tsx    632 lines   Product grid + filters

/src/app/(ecommerce)/account/
└── MyAccountTemplate1.tsx      545 lines   Dashboard + quick stats

/src/app/(ecommerce)/auth/login/
└── AuthTemplate.tsx            876 lines   Login/Register form
```

---

## How Templates Are Selected

### 1. Settings Global
All template selections come from `/src/globals/Settings.ts` (Tab 5: Templates)

**Fields:**
- `defaultProductTemplate` - Values: template1, template2, template3
- `defaultBlogTemplate` - Values: blogtemplate1, blogtemplate2, blogtemplate3
- `defaultShopArchiveTemplate` - Values: shoparchivetemplate1
- `defaultCartTemplate` - Values: template1, template2
- `defaultCheckoutTemplate` - Values: checkouttemplate1
- `defaultMyAccountTemplate` - Values: myaccounttemplate1

### 2. A/B Testing
Currently only implemented for **Cart**:
```typescript
// In CartPageClient.tsx
const { variant } = useABTest('cart')
const templateToUse = variant || defaultTemplate
```

### 3. Template Switching Logic

**Product Page** (`/src/app/[slug]/page.tsx`):
```typescript
const TemplateComponent = 
  template === 'template3' ? ProductTemplate3
  : template === 'template2' ? ProductTemplate2
  : ProductTemplate1
return <TemplateComponent product={product} />
```

**Blog Post** (`/src/app/(content)/blog/[category]/[slug]/page.tsx`):
```typescript
const TemplateComponent =
  template === 'blogtemplate3' ? BlogTemplate3
  : template === 'blogtemplate2' ? BlogTemplate2
  : BlogTemplate1
return <TemplateComponent post={post} settings={settings} />
```

---

## Components Ready for Template Use (Phase 1)

All 15 Phase 1 components are ready and can be used to rebuild/enhance templates:

### UI Components
- ToastSystem - Notifications
- Pagination - Page navigation
- CookieBanner - GDPR consent
- TrustSignals - Trust badges

### Cart Components
- QuantityStepper - Qty +/- buttons
- CartLineItem - Cart item display
- MiniCartFlyout - Slide-in cart
- OrderSummary - Price breakdown
- FreeShippingProgress - Shipping progress
- CouponInput - Discount codes
- AddToCartToast - Add-to-cart notification

### Product Components
- ProductCard - Grid/list display
- ProductBadges - Badges (Sale, New, etc.)
- StockIndicator - Stock status
- StaffelCalculator - Volume pricing

---

## Current Issues & Tasks

### To Activate (High Priority - 15 min each)
- [ ] Enable CheckoutTemplate2 in Settings
- [ ] Enable CartTemplate2 for A/B testing
- [ ] Wire AuthTemplate in Settings

### To Create (Medium Priority - 2-3 hours each)
- [ ] MyAccountTemplate2
- [ ] ShopArchiveTemplate2
- [ ] ShopArchiveTemplate3

### To Refactor (High Value - 4-5 hours)
- [ ] Refactor ProductTemplate1/2/3 to use Phase 1 components
- [ ] Extract reusable components from templates
- [ ] Move ProductTemplates to `/src/app/(ecommerce)/product/`

---

## Template Props & Interfaces

### Product Templates
```typescript
interface ProductTemplateProps {
  product: Product
}
// Supports: Simple, Variable, Grouped, Subscription, Mix & Match
```

### Cart Templates
```typescript
interface CartTemplateProps {
  onCheckout?: () => void
}
```

### Checkout Templates
```typescript
// Template1
export default function CheckoutTemplate1()

// No props - uses context and auth
```

### Blog Templates
```typescript
interface BlogTemplateProps {
  post: BlogPost
  settings?: Settings
  related?: BlogPost[]
}
```

---

## Template Statistics

| Type | Count | Total LOC | Avg Size |
|------|-------|----------|----------|
| Product | 3 | 6,059 | 2,020 |
| Cart | 2 | 1,544 | 772 |
| Checkout | 2 | 1,187 | 594 |
| Blog | 3 | 577 | 192 |
| Shop | 1 | 632 | 632 |
| Account | 1 | 545 | 545 |
| Auth | 1 | 876 | 876 |
| **TOTAL** | **13** | **11,420** | **878** |

---

## Configuration System

### Template Provisioning (`/src/templates/`)

**Available Site Templates:**
1. Ecommerce - Full store with products, cart, checkout
2. Blog - Content publishing
3. B2B - Bulk ordering, custom pricing
4. Portfolio - Projects and services
5. Corporate - Company info and services

**Each includes:**
- Collections (Products, Pages, Users, etc.)
- Blocks (Hero, Content, ProductGrid, etc.)
- Globals (Header, Footer, Settings)
- Features (ecommerce, blog, forms, authentication, AI)
- Default settings

**Usage:**
```typescript
import { generatePayloadConfig, generateClientEnvironment } from '@/templates/config-generator'

const config = await generatePayloadConfig(ecommerceTemplate)
const env = generateClientEnvironment({
  clientName: 'Acme Inc',
  domain: 'acme.example.com',
  databaseUrl: 'postgresql://...',
  template: ecommerceTemplate
})
```

---

## Next Steps

### Sprint 1 (This week)
1. Activate CheckoutTemplate2
2. Document template patterns
3. Create template testing strategy

### Sprint 2 (Next week)
1. Create missing shop templates (2 & 3)
2. Refactor product templates for component reuse
3. Make AuthTemplate configurable

### Sprint 3+
1. Add more account page templates
2. Implement advanced A/B testing
3. Template builder UI
4. Performance optimization

---

**Last Updated:** February 25, 2026
**Status:** 13 templates ready, more planned
**See Also:** `TEMPLATE_STRUCTURE_ANALYSIS.md` for comprehensive documentation
