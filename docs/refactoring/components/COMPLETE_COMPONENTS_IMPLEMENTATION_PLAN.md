# COMPLETE COMPONENTS IMPLEMENTATION PLAN
# All UI, Marketing, Layout, Account & Ecommerce Components

**Document Created:** 25 February 2026  
**Status:** 🚧 IN PROGRESS  
**Implementation Strategy:** Following Sprint 7 Protocol (Documentation → Implementation → Testing)  
**Total Components:** 60 components across 5 categories

---

## 📋 EXECUTIVE SUMMARY

This document outlines the complete implementation of **60 components** across 5 major categories:
- **UI Components** (7): Toast, Pagination, Progress Steps, Cookie Banner, Trust Signals, etc.
- **Marketing Components** (1): Newsletter  
- **Layout Components** (1): Footer  
- **Account Components** (4): Sidebar, Notification Center, Address Book, Recently Viewed  
- **Ecommerce Components** (47): Cart, Checkout, Orders, Products, Quick Order, Quote, Shop

**Goal:** Create a complete, production-ready component library that is:
- 100% CMS-configurable
- Theme variable compliant (NO hardcoded colors)
- Responsive (mobile-first)
- Accessible (WCAG 2.1 AA)
- Type-safe (full TypeScript)

**Database:** PostgreSQL (NOT SQLite!)
- All migrations use `@payloadcms/db-postgres`
- Use `db.execute()` (NOT `db.run()`)
- Use double quotes `"` for identifiers (NOT backticks `` ` ``)
- All new collections/fields require migration

---

## 🗄️ DATABASE SCHEMA REQUIREMENTS

### Collections Needing Database Tables

Several components require new collections/tables:

1. **Notification Center** (`notifications` collection)
   - User notifications (order updates, stock alerts, etc.)
   - Fields: user, type, title, message, read, createdAt

2. **Recently Viewed** (`recently-viewed` collection)
   - Track user product viewing history
   - Fields: user, product, viewedAt

3. **Back in Stock Alerts** (`stock-alerts` collection)
   - Email notifications when products back in stock
   - Fields: email, product, variant, notified, createdAt

4. **Product Comparisons** (`comparisons` collection)
   - User product comparison lists
   - Fields: user, products (array), createdAt

5. **Cookie Consents** (`cookie-consents` collection)
   - GDPR cookie consent tracking
   - Fields: sessionId, necessary, analytics, marketing, consentedAt

6. **Quotes** (`quotes` collection) - B2B offerte aanvragen
   - Fields: user, company, project, items (array), status, total

### Existing Collections (No Migration Needed)

These collections likely already exist:
- `reviews` - Product reviews
- `addresses` - User addresses (part of Users)
- `newsletter-subscriptions` - Email signups
- `coupons` - Discount codes

### PostgreSQL Migration Strategy

**CRITICAL RULES:**
```typescript
// ✅ CORRECT - PostgreSQL
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "notifications" (
      "id" serial PRIMARY KEY,
      "user_id" integer REFERENCES "users"("id"),
      "type" varchar NOT NULL,
      "title" varchar NOT NULL,
      "message" text,
      "read" boolean DEFAULT false,
      "created_at" timestamp DEFAULT now()
    )
  `)
}

// ❌ WRONG - SQLite
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite' // WRONG!
await db.run(sql`CREATE TABLE \`notifications\` ...`) // WRONG!
```

**Migration will be generated AFTER all collections are defined.**

---

## 🎯 COMPONENT BREAKDOWN BY CATEGORY

### 1. UI Components (7 total)

| Component | File | Complexity | Priority | Status |
|-----------|------|------------|----------|--------|
| **Toast System** | c17-toast-system.html | Medium | High | ⏳ TODO |
| **Pagination** | c20-pagination.html | Low | High | ⏳ TODO |
| **Progress Steps** | c25-progress-steps.html | Low | Medium | ⏳ TODO |
| **Cookie Banner** | c7-cookie-banner.html | Medium | High | ⏳ TODO |
| **Trust Signals** | ec09-trust-signals.html | Low | Medium | ⏳ TODO |
| **Did You Mean** | sr02-did-you-mean-banner.html | Low | Low | ⏳ TODO |

**Target Location:** `src/branches/shared/components/ui/`

---

### 2. Marketing Components (1 total)

| Component | File | Complexity | Priority | Status |
|-----------|------|------------|----------|--------|
| **Newsletter** | c16-newsletter.html | Medium | High | ⏳ TODO |

**Target Location:** `src/branches/shared/components/marketing/`

---

### 3. Layout Components (1 total)

| Component | File | Complexity | Priority | Status |
|-----------|------|------------|----------|--------|
| **Footer** | c15-footer.html | Medium | High | ✅ DONE (already implemented) |

**Target Location:** `src/branches/shared/components/layout/`  
**Note:** Footer already implemented in navigation sprint

---

### 4. Account Components (4 total)

| Component | File | Complexity | Priority | Status |
|-----------|------|------------|----------|--------|
| **Account Sidebar** | c24-account-sidebar.html | Medium | High | ✅ DONE (already implemented) |
| **Notification Center** | c11-notification-center.html | High | Medium | ⏳ TODO |
| **Address Book** | c12-address-book.html | Medium | High | ⏳ TODO |
| **Recently Viewed** | c13-recently-viewed.html | Low | Low | ⏳ TODO |

**Target Location:** `src/branches/shared/components/account/`

---

### 5. Ecommerce Components (47 total)

#### 5.1 Cart Components (7)

| Component | File | Complexity | Priority | Status |
|-----------|------|------------|----------|--------|
| **MiniCart Flyout** | c2-minicart-flyout.html | High | High | ⏳ TODO |
| **Quantity Stepper** | c23-quantity-stepper.html | Low | High | ⏳ TODO |
| **Add to Cart Toast** | c3-addtocart-toast.html | Medium | High | ⏳ TODO |
| **Free Shipping Progress** | ec05-free-shipping-progress.html | Low | Medium | ⏳ TODO |
| **Cart Line Item** | ec06-cart-line-item.html | Medium | High | ⏳ TODO |
| **Order Summary** | ec07-order-summary.html | Medium | High | ⏳ TODO |
| **Coupon Input** | ec08-coupon-input.html | Low | Medium | ⏳ TODO |

**Target Location:** `src/branches/ecommerce/components/cart/`

---

#### 5.2 Checkout Components (5)

| Component | File | Complexity | Priority | Status |
|-----------|------|------------|----------|--------|
| **Shipping Method Card** | ec11-shipping-method-card.html | Medium | High | ⏳ TODO |
| **Payment Method Card** | ec12-payment-method-card.html | Medium | High | ⏳ TODO |
| **Checkout Progress** | ec13-checkout-progress-stepper.html | Low | High | ⏳ TODO |
| **Address Form** | ec14-address-form.html | High | High | ⏳ TODO |
| **PO Number Input** | ec15-po-number-input.html | Low | Medium | ⏳ TODO |

**Target Location:** `src/branches/ecommerce/components/checkout/`

---

#### 5.3 Orders Components (5)

| Component | File | Complexity | Priority | Status |
|-----------|------|------------|----------|--------|
| **Success Hero** | oc01-success-hero.html | Low | High | ⏳ TODO |
| **Order Details Card** | oc02-order-details-card.html | Medium | High | ⏳ TODO |
| **Order Items Summary** | oc03-order-items-summary.html | Medium | High | ⏳ TODO |
| **Next Steps CTA** | oc04-next-steps-cta.html | Low | Medium | ⏳ TODO |
| **Email Confirmation** | oc05-email-confirmation-banner.html | Low | Medium | ⏳ TODO |

**Target Location:** `src/branches/ecommerce/components/orders/`

---

#### 5.4 Product Components (10)

| Component | File | Complexity | Priority | Status |
|-----------|------|------------|----------|--------|
| **Review Widget** | c10-review-widget.html | High | Medium | ⏳ TODO |
| **Promo Card** | c14-promo-card.html | Low | Medium | ⏳ TODO |
| **Product Badges** | c18-product-badges.html | Low | High | ⏳ TODO |
| **Staffel Calculator** | c4-staffel-calculator.html | High | High | ⏳ TODO |
| **QuickView Modal** | c5-quickview-modal.html | High | Medium | ⏳ TODO |
| **Sticky Bar** | c6-sticky-bar.html | Medium | Medium | ⏳ TODO |
| **Back in Stock** | c8-backinstock.html | Medium | Low | ⏳ TODO |
| **Compare Bar** | c9-compare-bar.html | Medium | Low | ⏳ TODO |
| **Product Card** | ec01-product-card.html | High | High | ⏳ TODO |
| **Category Hero** | ec02-category-hero.html | Medium | High | ⏳ TODO |
| **Stock Indicator** | ec04-stock-indicator.html | Low | High | ⏳ TODO |
| **Staffel Hint** | ec10-staffel-hint-banner.html | Low | Medium | ⏳ TODO |

**Target Location:** `src/branches/ecommerce/components/products/`

---

#### 5.5 Quick Order Components (5)

| Component | File | Complexity | Priority | Status |
|-----------|------|------------|----------|--------|
| **Quick Order Header** | qo01-quick-order-header.html | Low | Medium | ⏳ TODO |
| **Quick Order Table** | qo02-quick-order-table.html | High | Medium | ⏳ TODO |
| **Quick Order Row** | qo03-quick-order-row.html | Medium | Medium | ⏳ TODO |
| **CSV Upload** | qo04-csv-upload-button.html | High | Low | ⏳ TODO |
| **Pro Tip Banner** | qo05-pro-tip-banner.html | Low | Low | ⏳ TODO |

**Target Location:** `src/branches/ecommerce/components/quick-order/`

---

#### 5.6 Quote/Offerte Components (5)

| Component | File | Complexity | Priority | Status |
|-----------|------|------------|----------|--------|
| **Offerte Hero** | qr01-offerte-hero.html | Low | Medium | ⏳ TODO |
| **Product Selection Table** | qr02-product-selection-table.html | High | Medium | ⏳ TODO |
| **Company Info Form** | qr03-company-info-form.html | Medium | Medium | ⏳ TODO |
| **Project Info Form** | qr04-project-info-form.html | Medium | Medium | ⏳ TODO |
| **File Upload Dropzone** | qr05-file-upload-dropzone.html | High | Medium | ⏳ TODO |

**Target Location:** `src/branches/ecommerce/components/quote/`

---

#### 5.7 Shop/Search Components (8)

| Component | File | Complexity | Priority | Status |
|-----------|------|------------|----------|--------|
| **Instant Search** | c1-instant-search.html | High | High | ⏳ TODO |
| **Filter Sidebar** | c21-filter-sidebar.html | High | High | ⏳ TODO |
| **Sort Dropdown** | c22-sort-dropdown.html | Low | High | ⏳ TODO |
| **Subcategory Chips** | ec03-subcategory-chips.html | Low | High | ✅ DONE (already implemented) |
| **Search Query Header** | sr01-search-query-header.html | Low | Medium | ⏳ TODO |
| **Category Match Card** | sr03-category-match-card.html | Medium | Low | ⏳ TODO |
| **Recent Searches** | sr04-recent-searches-sidebar.html | Medium | Low | ⏳ TODO |
| **Popular Search Tags** | sr05-popular-search-tags.html | Low | Low | ⏳ TODO |

**Target Location:** `src/branches/ecommerce/components/shop/`

---

## 🏗️ IMPLEMENTATION STRATEGY

### Phase 1: High Priority UI & Cart (Priority: CRITICAL)
**Goal:** Get core shopping experience working  
**Duration:** 4-6 hours  
**Components:** 15 components

1. **UI Foundations** (4 components - 1 hour)
   - Toast System (c17) → Needed for cart notifications
   - Pagination (c20) → Needed for product lists
   - Cookie Banner (c7) → Legal requirement
   - Trust Signals (ec09) → Conversion optimization

2. **Cart System** (7 components - 2-3 hours)
   - Quantity Stepper (c23) → Core interaction
   - Add to Cart Toast (c3) → Feedback
   - Cart Line Item (ec06) → Display cart items
   - MiniCart Flyout (c2) → Quick checkout
   - Order Summary (ec07) → Totals display
   - Free Shipping Progress (ec05) → Upsell
   - Coupon Input (ec08) → Discounts

3. **Product Display** (4 components - 1-2 hours)
   - Product Card (ec01) → Product grid
   - Product Badges (c18) → "New", "Sale" tags
   - Stock Indicator (ec04) → Availability
   - Staffel Calculator (c4) → Bulk pricing

---

### Phase 2: Checkout & Orders (Priority: HIGH)
**Goal:** Complete purchase flow  
**Duration:** 3-4 hours  
**Components:** 10 components

4. **Checkout Flow** (5 components - 2 hours)
   - Checkout Progress (ec13) → Step indicator
   - Shipping Method Card (ec11) → Delivery options
   - Payment Method Card (ec12) → Payment options
   - Address Form (ec14) → Shipping/billing
   - PO Number Input (ec15) → B2B purchases

5. **Order Confirmation** (5 components - 1-2 hours)
   - Success Hero (oc01) → Thank you page
   - Order Details Card (oc02) → Order summary
   - Order Items Summary (oc03) → What was ordered
   - Email Confirmation (oc05) → Confirmation notice
   - Next Steps CTA (oc04) → What's next

---

### Phase 3: Shop & Discovery (Priority: HIGH)
**Goal:** Product finding & filtering  
**Duration:** 3-4 hours  
**Components:** 6 components

6. **Search & Filter** (4 components - 2-3 hours)
   - Instant Search (c1) → Live search
   - Filter Sidebar (c21) → Product filtering
   - Sort Dropdown (c22) → Sorting options
   - Search Query Header (sr01) → Search results header

7. **Product Discovery** (2 components - 1 hour)
   - Category Hero (ec02) → Category landing
   - Promo Card (c14) → Featured products

---

### Phase 4: Account & Marketing (Priority: MEDIUM)
**Goal:** User engagement & retention  
**Duration:** 2-3 hours  
**Components:** 5 components

8. **Account Management** (3 components - 1.5 hours)
   - Notification Center (c11) → User notifications
   - Address Book (c12) → Saved addresses
   - Recently Viewed (c13) → Product history

9. **Marketing** (2 components - 1 hour)
   - Newsletter (c16) → Email capture
   - Progress Steps (c25) → Multi-step forms

---

### Phase 5: Advanced Features (Priority: LOW)
**Goal:** B2B & specialized workflows  
**Duration:** 4-5 hours  
**Components:** 18 components

10. **Product Features** (5 components - 2 hours)
    - QuickView Modal (c5)
    - Sticky Bar (c6)
    - Review Widget (c10)
    - Back in Stock (c8)
    - Compare Bar (c9)
    - Staffel Hint (ec10)

11. **Quick Order** (5 components - 1-2 hours)
    - Quick Order Header (qo01)
    - Quick Order Table (qo02)
    - Quick Order Row (qo03)
    - CSV Upload (qo04)
    - Pro Tip Banner (qo05)

12. **Quote/Offerte** (5 components - 1-2 hours)
    - Offerte Hero (qr01)
    - Product Selection Table (qr02)
    - Company Info Form (qr03)
    - Project Info Form (qr04)
    - File Upload Dropzone (qr05)

13. **Search Enhancements** (3 components - 1 hour)
    - Did You Mean (sr02)
    - Category Match Card (sr03)
    - Recent Searches (sr04)
    - Popular Search Tags (sr05)

---

## ✅ IMPLEMENTATION CHECKLIST

### Overall Progress: 3/60 components ✅ (5%)

- [x] Footer (c15) - Already implemented ✅
- [x] Account Sidebar (c24) - Already implemented ✅
- [x] Subcategory Chips (ec03) - Already implemented ✅
- [ ] 57 components remaining ⏳

### Phase 1: High Priority UI & Cart (0/15) ⏳

#### UI Foundations (0/4)
- [ ] Toast System (c17)
- [ ] Pagination (c20)
- [ ] Cookie Banner (c7)
- [ ] Trust Signals (ec09)

#### Cart System (0/7)
- [ ] Quantity Stepper (c23)
- [ ] Add to Cart Toast (c3)
- [ ] Cart Line Item (ec06)
- [ ] MiniCart Flyout (c2)
- [ ] Order Summary (ec07)
- [ ] Free Shipping Progress (ec05)
- [ ] Coupon Input (ec08)

#### Product Display (0/4)
- [ ] Product Card (ec01)
- [ ] Product Badges (c18)
- [ ] Stock Indicator (ec04)
- [ ] Staffel Calculator (c4)

---

## 📝 IMPLEMENTATION NOTES

### Component Structure Template

Every component follows this structure:

```
src/branches/[branch]/components/[category]/[ComponentName]/
├── Component.tsx          # Main component
├── index.ts              # Export barrel
├── types.ts              # TypeScript interfaces (if needed)
└── [SubComponent].tsx    # Sub-components (if complex)
```

### Theme Variable Compliance

**CRITICAL:** ALL components MUST use theme variables, NO hardcoded colors!

```tsx
// ❌ BAD
<div className="bg-blue-500 text-white border-gray-300">

// ✅ GOOD
<div className="bg-theme-primary text-theme-on-primary border-theme-border">
```

### Responsive Design

All components must support 3 breakpoints:
- **Mobile:** 0-767px
- **Tablet:** 768-1023px
- **Desktop:** 1024+px

### Accessibility Requirements

- ARIA labels for all interactive elements
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Color contrast WCAG 2.1 AA compliant

---

## 🎯 SUCCESS CRITERIA

**Implementation is successful when:**

✅ All 60 components implemented and working  
✅ 100% TypeScript type-safe  
✅ 0 hardcoded colors (theme variables only)  
✅ Responsive design working on all breakpoints  
✅ Accessible (WCAG 2.1 AA)  
✅ Build passes without errors  
✅ All components exported from branch index  
✅ Documentation complete  

---

## 📊 ESTIMATED TIMELINE

| Phase | Components | Duration | Status |
|-------|------------|----------|--------|
| Phase 1: UI & Cart | 15 | 4-6 hours | ⏳ TODO |
| Phase 2: Checkout & Orders | 10 | 3-4 hours | ⏳ TODO |
| Phase 3: Shop & Discovery | 6 | 3-4 hours | ⏳ TODO |
| Phase 4: Account & Marketing | 5 | 2-3 hours | ⏳ TODO |
| Phase 5: Advanced Features | 18 | 4-5 hours | ⏳ TODO |
| **Testing & Documentation** | - | 2-3 hours | ⏳ TODO |
| **TOTAL** | **57** | **20-27 hours** | **5% Complete** |

---

**Next Action:** Begin Phase 1 - High Priority UI & Cart Components

