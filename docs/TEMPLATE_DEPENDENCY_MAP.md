# Template Dependency Map

## Template Component Usage Matrix

### Product Templates Dependencies

```
ProductTemplate1 (1,606 lines)
├── StaffelCalculator ✅
├── VariantSelector ✅
├── SubscriptionPricingTable ✅
├── RelatedProductsSection ✅
├── RichText ✅
├── ToastSystem ✅
├── GroupedProductTable (internal, 361 lines)
├── Lucide Icons (45+ icons)
└── Multiple state management hooks

ProductTemplate2 (2,041 lines)
├── VariantSelector ✅
├── SubscriptionPricingTable ✅
├── RelatedProductsSection ✅
├── RichText ✅
├── ToastSystem ✅
├── Lucide Icons
└── Simplified vs Template1

ProductTemplate3 (2,051 lines)
├── Same as Template1
├── Premium styling
└── Enhanced visuals
```

### Cart Templates Dependencies

```
CartTemplate1 (976 lines)
├── useCart context
├── CartLineItem components ✅
├── OrderSummary ✅
├── CouponInput ✅
├── QuantityStepper (within CartLineItem) ✅
├── FreeShippingProgress ✅
├── Lucide Icons (15+)
└── Toast notifications

CartTemplate2 (568 lines)
├── useCart context
├── Simplified CartLineItem ✅
├── Simpler layout
├── Modern card design
└── Fewer features than Template1
```

### Checkout Templates Dependencies

```
CheckoutTemplate1 (657 lines)
├── CheckoutForm ✅
├── CheckoutAddresses ✅
├── Address management
├── Stripe integration
├── Order summary
├── Payment processing
└── Multiple state management

CheckoutTemplate2 (530 lines)
├── Alternative checkout flow
├── Possibly single-page
└── Different address/payment UI
```

### Blog Templates Dependencies

```
BlogTemplate1 (258 lines)
├── Post metadata
├── Author info
├── Related posts
├── Sidebar (categories/tags)
├── Rich content rendering
└── Comments (optional)

BlogTemplate2 (135 lines) - MINIMAL
├── Post content
├── Minimal metadata
├── Clean typography
└── Focused layout

BlogTemplate3 (184 lines) - PREMIUM
├── Rich post display
├── Author showcase
├── Series/collections
├── Premium styling
└── Enhanced visuals
```

---

## Current Component Usage

### Phase 1 Components (15/60 = 25%)

```
Used in Product Templates:
├── ToastSystem ✅
├── QuantityStepper ✅
├── AddToCartToast ✅
├── StaffelCalculator ✅
└── Lucide Icons ✅

Used in Cart Templates:
├── QuantityStepper ✅
├── CartLineItem ✅
├── OrderSummary ✅
├── FreeShippingProgress ✅
├── CouponInput ✅
├── AddToCartToast ✅
└── Lucide Icons ✅

Used in Checkout Templates:
├── OrderSummary ✅
├── Address components ✅
├── Form components ✅
└── Stripe components (external)

Not Yet Used (But Available):
├── Pagination ✅
├── CookieBanner ✅
├── TrustSignals ✅
├── MiniCartFlyout ✅
├── ProductCard ✅
├── ProductBadges ✅
├── StockIndicator ✅
```

---

## File Structure Visualization

```
CURRENT STRUCTURE (as of Feb 25, 2026)

/src
├── /branches
│   └── /ecommerce
│       └── /components
│           └── /templates
│               └── /products
│                   ├── ProductTemplate1/
│                   │   ├── index.tsx (1,606 lines)
│                   │   └── GroupedProductTable.tsx (361 lines)
│                   ├── ProductTemplate2/
│                   │   └── index.tsx (2,041 lines)
│                   └── ProductTemplate3/
│                       └── index.tsx (2,051 lines)
│
├── /app
│   ├── /[slug]
│   │   └── page.tsx (uses ProductTemplates)
│   ├── /(ecommerce)
│   │   ├── /cart
│   │   │   ├── page.tsx
│   │   │   ├── CartPageClient.tsx (template switching)
│   │   │   ├── CartTemplate1.tsx (976 lines)
│   │   │   └── CartTemplate2.tsx (568 lines)
│   │   ├── /checkout
│   │   │   ├── page.tsx
│   │   │   ├── CheckoutTemplate1.tsx (657 lines)
│   │   │   └── CheckoutTemplate2.tsx (530 lines)
│   │   ├── /shop
│   │   │   └── ShopArchiveTemplate1.tsx (632 lines)
│   │   ├── /account
│   │   │   └── MyAccountTemplate1.tsx (545 lines)
│   │   └── /auth/login
│   │       └── AuthTemplate.tsx (876 lines)
│   └── /(content)
│       └── /blog/[category]/[slug]
│           ├── page.tsx
│           ├── BlogTemplate1.tsx (258 lines)
│           ├── BlogTemplate2.tsx (135 lines)
│           └── BlogTemplate3.tsx (184 lines)
│
├── /templates
│   ├── index.ts (318 lines) - Site template definitions
│   └── config-generator.ts (317 lines) - Config generation
│
└── /globals
    └── Settings.ts (900+ lines) - Template configuration
```

---

## Template Selection Flows

### Product Page Selection
```
[slug] page
    ↓
Get Settings.defaultProductTemplate
    ↓
Match: template1 | template2 | template3
    ↓
Import corresponding ProductTemplate
    ↓
Render with { product }
```

### Cart Page Selection
```
cart page (server)
    ↓
Get Settings.defaultCartTemplate
Pass to CartPageClient
    ↓
CartPageClient (client)
    ↓
Check A/B test variant
    ↓
Match: template1 | template2 | variant
    ↓
Render CartTemplate1 or CartTemplate2
    ↓
Track conversion
```

### Blog Post Selection
```
[category]/[slug] page
    ↓
Get Settings.defaultBlogTemplate
    ↓
Match: blogtemplate1 | blogtemplate2 | blogtemplate3
    ↓
Import corresponding BlogTemplate
    ↓
Render with { post, settings, related }
```

---

## Component Reuse Analysis

### Currently Used (Can Improve)
```
ProductTemplates (6,059 lines)
├── Direct component use: ~20%
├── Custom implementations: ~80%
└── Opportunity: Refactor to use more Phase 1 components

CartTemplates (1,544 lines)
├── Direct component use: ~50%
├── Custom implementations: ~50%
└── Already using: CartLineItem, OrderSummary, CouponInput

CheckoutTemplates (1,187 lines)
├── Direct component use: ~30%
├── Custom implementations: ~70%
└── Could use: OrderSummary, TrustSignals

BlogTemplates (577 lines)
├── Direct component use: ~10%
├── Custom implementations: ~90%
└── Opportunity: Create new components for blog features
```

### Potential Component Extraction

**From ProductTemplates (2,000+ LOC of opportunities):**
- ProductImageGallery (currently inline)
- ProductTabsContainer (currently inline)
- ProductMetadata (SKU, brand, category display)
- ProductActions (ATC, Wishlist, Share buttons)
- GroupedProductSelector (already extracted)
- VariantSelector improvements

**From CheckoutTemplates (400+ LOC of opportunities):**
- AddressSelector component
- PaymentMethodSelector component
- CheckoutSummary (can reuse OrderSummary)
- CheckoutProgressIndicator

**From BlogTemplates (200+ LOC of opportunities):**
- BlogPostHeader component
- BlogSidebar component
- RelatedPosts component
- BlogComments component

---

## Template Switching Readiness

### Ready to Activate (0 work)
```
✅ CheckoutTemplate2 (file exists, need to wire in Settings)
✅ CartTemplate2 (file exists, can enable for A/B testing)
✅ All Phase 1 components (ready to use)
```

### Ready to Create (2-3 hours each)
```
⚠️ MyAccountTemplate2
⚠️ ShopArchiveTemplate2
⚠️ ShopArchiveTemplate3
```

### Ready to Improve (1-2 hours each)
```
🔧 ProductTemplate1 (refactor to use components)
🔧 ProductTemplate2 (refactor to use components)
🔧 ProductTemplate3 (refactor to use components)
🔧 AuthTemplate (make configurable)
```

---

## Phase 2 Component Opportunities

### New Components Needed (60 total planned, 45 remaining)

```
Batch 4: Account & User (6-8 components)
├── AccountMenu - User dropdown
├── AddressForm - Shipping/billing
├── OrderHistory - Order list
├── WishlistButton - Add to wishlist
├── ComparisonTable - Product comparison
└── ReviewForm - Product review

Batch 5: Product Display (6-8 components)
├── ImageGallery - Advanced zoom
├── VariantSelector (improved)
├── ProductMetadata - SKU/brand/category
├── CrossSells - Related items
└── ProductActions - Share/compare/etc

Batch 6: Blog & Content (5-6 components)
├── BlogPostHeader - Post metadata
├── BlogSidebar - Categories/tags
├── RelatedPosts - Related articles
├── BlogComments - Comment section
└── BlogCategories - Category browser

... and 25+ more components planned
```

---

## Performance Metrics by Template

### Current Sizes
```
ProductTemplate1: 1,606 lines (could be ~1,000 with components)
ProductTemplate2: 2,041 lines (could be ~1,200 with components)
ProductTemplate3: 2,051 lines (could be ~1,200 with components)
CartTemplate1: 976 lines (optimal size)
CartTemplate2: 568 lines (well-sized)
CheckoutTemplate1: 657 lines (good size)
CheckoutTemplate2: 530 lines (good size)
BlogTemplate1: 258 lines (well-sized)
BlogTemplate2: 135 lines (minimal)
BlogTemplate3: 184 lines (well-sized)
```

### Optimization Opportunities
```
Product Templates: -1,500 LOC possible (extract to components)
Checkout Templates: -200 LOC possible (reuse OrderSummary)
Blog Templates: +300 LOC possible (enhance functionality)
Overall: Could reduce by ~1,700 LOC with smart component reuse
```

---

## Recommended Build Order

### Phase 1 (Week 1) - ACTIVATE
1. CheckoutTemplate2 in Settings (15 min)
2. CartTemplate2 for A/B test (15 min)
3. Test template switching (30 min)

### Phase 2 (Week 2) - CREATE
1. MyAccountTemplate2 (2-3 hours)
2. ShopArchiveTemplate2 (2-3 hours)
3. ShopArchiveTemplate3 (2-3 hours)

### Phase 3 (Week 3-4) - REFACTOR
1. Extract ProductImageGallery component (1 hour)
2. Extract ProductTabsContainer component (1 hour)
3. Extract ProductMetadata component (1 hour)
4. Refactor ProductTemplate1/2/3 (2-3 hours)
5. Make AuthTemplate configurable (1 hour)

### Phase 4 (Week 5+) - ENHANCE
1. Add TrustSignals to Checkout
2. Enhance Blog templates with Phase 2 components
3. Create Shop category templates
4. Advanced A/B testing framework

---

**Last Updated:** February 25, 2026
**Total Templates:** 13 active, 5+ planned
**Total LOC:** 11,420 (6,059 products + 5,361 pages)
