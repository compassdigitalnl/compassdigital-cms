# Sprint 9: E-commerce Cart & Checkout - Complete Implementation Plan

**Version:** 2.0 (Reconstructed)
**Date:** 22 Februari 2026
**Status:** In Progress
**Client:** Generic (Theme-based, reusable for all clients)

---

## 🎯 Project Overview

### Sprint Goal
Implement **complete cart & checkout flow** with A/B testing capabilities, theme-based styling (not Plastimed-specific), and guest checkout support.

### Key Requirements (From Discussion)
1. ✅ **Volledige scope** - Complete cart, checkout, login/register, guest checkout
2. ✅ **A/B Testing** - Test Variant A (compact table) vs Variant B (visual cards)
3. ✅ **Theme Variables** - Generic CSS variable system, NOT Plastimed-specific
4. ✅ **Guest Login** - Users can checkout without creating account

---

## 📊 Current Status - What's Already Built

### ✅ COMPLETED Infrastructure (Found in codebase)

#### 1. A/B Testing Framework (100% Complete!)
**Files Created:**
- `/src/branches/ecommerce/collections/ABTests.ts` - A/B test configuration
- `/src/branches/ecommerce/collections/ABTestResults.ts` - User assignment tracking
- `/src/app/api/ab-test/assign/route.ts` - Variant assignment API
- `/src/app/api/ab-test/convert/route.ts` - Conversion tracking API
- `/src/branches/shared/components/features/ABTest/useABTest.ts` - React hook
- `/src/branches/shared/components/features/ABTest/types.ts` - TypeScript types

**Features:**
- ✅ Multi-variant testing (not limited to 2)
- ✅ Weighted distribution (50/50, 70/30, custom)
- ✅ Session-based user assignment (cookie: `ab_session_id`)
- ✅ Conversion tracking with order value
- ✅ Auto-winner selection based on conversion rate
- ✅ Multi-tenant support (per-client isolation)

**Usage Example:**
```tsx
const { variant, trackConversion } = useABTest('cart')

if (variant === 'template1') return <CartTemplate1 />
if (variant === 'template2') return <CartTemplate2 />
```

#### 2. Cart Infrastructure
**Files:**
- `/src/branches/ecommerce/contexts/CartContext.tsx` - Cart state management
- `/src/app/(ecommerce)/cart/CartTemplate1.tsx` - Variant A (Table/Compact)
- `/src/app/(ecommerce)/cart/page.tsx` - Cart page with template switching

**What Works:**
- ✅ Add/remove/update cart items
- ✅ Cart persistence (localStorage)
- ✅ Quantity management
- ✅ Subtotal/total calculations
- ✅ Empty cart state

#### 3. Existing Checkout Components
**Files:**
- `/src/branches/ecommerce/components/checkout/CheckoutAddresses.tsx`
- `/src/branches/ecommerce/components/checkout/ConfirmOrder.tsx`
- `/src/branches/ecommerce/components/addresses/CreateAddressModal.tsx`
- `/src/branches/ecommerce/components/addresses/AddressItem.tsx`

---

## 🚧 REMAINING WORK

### Phase 1: Cart Templates (2-3 days)

#### 1.1 CartTemplate2 (Variant B - Visual) **[NEW]**
**File:** `/src/app/(ecommerce)/cart/CartTemplate2.tsx`
**Design:** Based on `plastimed-cart-variant-b.html`

**Features:**
- Product cards with large images (120px vs 50px)
- Visual progress bar for free shipping
- Step indicator (1. Cart → 2. Checkout → 3. Payment → 4. Confirmation)
- "Recently Viewed" section
- Trust badges
- Alternative checkout button (e.g., "Request Quote")

**Theme Variables to Use:**
```css
--color-primary
--color-secondary
--color-surface
--color-border
--color-text-primary
--color-text-muted
--font-heading
--font-body
--shadow
--radius
```

**NO Plastimed-specific colors!** All colors come from theme.

#### 1.2 Update Cart Page for A/B Testing **[MODIFY]**
**File:** `/src/app/(ecommerce)/cart/page.tsx`

**Change from:**
```tsx
<CartTemplate1 />
```

**To:**
```tsx
'use client'
import { useABTest } from '@/branches/shared/components/features/ABTest'

export default function CartPage() {
  const { variant, isLoading, trackConversion } = useABTest('cart')

  if (isLoading) return <CartSkeleton />

  if (variant === 'template2') {
    return <CartTemplate2 onCheckout={() => trackConversion()} />
  }

  // Default to template1
  return <CartTemplate1 onCheckout={() => trackConversion()} />
}
```

#### 1.3 Free Shipping Progress Component **[NEW]**
**File:** `/src/branches/ecommerce/components/FreeShippingProgress.tsx`

**Props:**
```ts
interface Props {
  currentTotal: number
  freeShippingThreshold: number // From Settings global
  variant?: 'bar' | 'card' // Different styles for Template1 vs Template2
}
```

**Logic:**
- Calculate progress: `(currentTotal / threshold) * 100`
- Show message: "Nog €X tot gratis verzending!" vs "Gratis verzending bereikt!"
- Visual progress bar (green gradient)
- Configurable threshold from Settings global

---

### Phase 2: Login & Registration (2-3 days)

#### 2.1 Login/Register Templates **[NEW]**
**Files:**
- `/src/app/(ecommerce)/login/page.tsx`
- `/src/app/(ecommerce)/login/LoginTemplate.tsx`
- `/src/app/(ecommerce)/register/page.tsx`
- `/src/app/(ecommerce)/register/RegisterTemplate.tsx`

**Design:** Based on `plastimed-login-registratie.html`

**Features - Login:**
- Email + password
- "Remember me" checkbox
- "Forgot password" link
- OAuth (Google) button (optional, can be disabled via feature flag)
- Tab switcher: Login | Register | Guest
- Guest checkout CTA: "Liever bestellen als gast?"

**Features - Registration:**
- First name + Last name
- Organization name
- KvK number (optional - only for B2B clients)
- Email
- Phone
- Password with strength indicator (Weak/Medium/Strong)
- Terms & conditions checkbox
- B2B notice: "Uw aanvraag wordt binnen 1 werkdag beoordeeld"

**Guest Checkout Info Box:**
- List benefits of account:
  - ✓ Persoonlijke staffelprijzen
  - ✓ Bestelhistorie inzien
  - ✓ Snelle nabestellingen
  - ✓ Bestellijsten opslaan
- CTA: "Toch liever een zakelijk account?"

**Theme Variables:**
- All colors from theme (navy, teal, coral → map to primary/secondary/accent)
- Fonts from theme
- No hardcoded Plastimed branding

#### 2.2 Guest Checkout Flow **[NEW]**
**File:** `/src/branches/ecommerce/components/GuestCheckoutForm.tsx`

**Fields:**
- Email (required) - for order confirmation
- First name + Last name
- Organization (optional)
- Phone (required)
- Terms & conditions checkbox

**Behavior:**
- No user account created
- Order linked to email only
- Session-based cart
- Post-checkout: "Create account to track your order"

#### 2.3 Auth API Routes **[VERIFY/EXTEND]**
**Check existing:**
- `/src/app/api/users/login/route.ts`
- `/src/app/api/users/register/route.ts`

**Add if missing:**
- `/src/app/api/auth/guest-session/route.ts` - Create guest session
- Password strength validation
- Email verification flow (optional)

---

### Phase 3: Checkout Flow (3-4 days)

#### 3.1 Multi-Step Checkout **[NEW]**
**File:** `/src/app/(ecommerce)/checkout/page.tsx`

**Steps:**
1. **Cart Review** (read-only summary)
2. **Shipping Address**
   - Use existing `CheckoutAddresses` component
   - Create/select address
   - Guest: inline form
3. **Shipping Method**
   - Standard (gratis vanaf €150)
   - Express (+€9.95)
4. **Payment Method**
   - iDEAL
   - Credit Card (Stripe)
   - Op rekening (B2B only)
   - PayPal (optional)
5. **Review & Confirm**
   - Use existing `ConfirmOrder` component
   - Terms acceptance
   - Final total

**Progress Indicator:**
```tsx
<div className="checkout-steps">
  <Step active>1. Gegevens</Step>
  <Step>2. Verzending</Step>
  <Step>3. Betaling</Step>
  <Step>4. Bevestiging</Step>
</div>
```

#### 3.2 Checkout Summary Sidebar **[NEW]**
**File:** `/src/branches/ecommerce/components/checkout/CheckoutSummary.tsx`

**Contents:**
- Order items (collapsed/expandable)
- Subtotal
- Discount (if coupon applied)
- Shipping cost
- VAT breakdown
- **Total** (large, bold)
- Payment method badges
- Trust badges (SSL, 30 dagen retour, etc.)

**Sticky positioning:** Sidebar stays visible on scroll (desktop only)

#### 3.3 Coupon/Discount System **[VERIFY/EXTEND]**
**Check if exists:**
- `/src/branches/ecommerce/collections/Coupons.ts`

**Add if missing:**
- Coupon code field in cart
- API: `/src/app/api/coupons/validate/route.ts`
- Discount types:
  - Percentage (15% off)
  - Fixed amount (€5 off)
  - Free shipping
  - Minimum order amount

---

### Phase 4: Database & Migrations (1 day)

#### 4.1 Required Collections (Verify Existence)

**Check payload.config.ts for:**
- `ab-tests` ✅ (Already added)
- `ab-test-results` ✅ (Already added)
- `orders` (should exist from previous sprints)
- `addresses` (should exist)
- `coupons` (verify/add)
- `shipping-methods` (verify/add)

#### 4.2 Migration Generation

**CRITICAL: Follow CLAUDE.md Database Migration Rules!**

1. **Before generating migration, enable feature flag:**
   ```bash
   ENABLE_ECOMMERCE=true
   ```

2. **Generate migration:**
   ```bash
   npx payload migrate:create sprint_9_cart_checkout_ab_testing
   ```

3. **Verify generated SQL includes:**
   - `CREATE TABLE ab_tests` (name, targetPage, status, variants, etc.)
   - `CREATE TABLE ab_test_results` (test, variant, sessionId, userId, converted, etc.)
   - `CREATE TABLE coupons` (if new)
   - `CREATE TABLE shipping_methods` (if new)
   - `CREATE INDEX` statements for performance

4. **Test on empty database:**
   ```bash
   # Create temp database
   DATABASE_URL="postgresql://...test_db" npx payload migrate

   # Verify all tables exist
   # Drop test database
   ```

5. **Validate schema:**
   ```bash
   npm run validate-schema
   ```

#### 4.3 Settings Global Extensions **[MODIFY]**
**File:** `/src/globals/Settings.ts`

**Add fields:**
```ts
{
  name: 'ecommerce',
  type: 'group',
  fields: [
    {
      name: 'freeShippingThreshold',
      type: 'number',
      defaultValue: 150,
      label: 'Gratis verzending vanaf (€)',
    },
    {
      name: 'defaultCartTemplate',
      type: 'select',
      options: [
        { label: 'Template 1 (Compact Table)', value: 'template1' },
        { label: 'Template 2 (Visual Cards)', value: 'template2' },
      ],
      defaultValue: 'template1',
      label: 'Default Cart Template',
      admin: {
        description: 'Fallback if no A/B test is running',
      },
    },
    {
      name: 'enableGuestCheckout',
      type: 'checkbox',
      defaultValue: true,
      label: 'Enable Guest Checkout',
    },
    {
      name: 'requireB2BApproval',
      type: 'checkbox',
      defaultValue: false,
      label: 'Require B2B Registration Approval',
    },
  ],
}
```

**Migration for Settings changes:**
```bash
npx payload migrate:create settings_ecommerce_fields
```

---

### Phase 5: Theme System (1-2 days)

#### 5.1 Generic Theme Variables **[CRITICAL]**

**File:** `/src/app/(app)/globals.css`

**DO NOT hardcode Plastimed colors!** Instead, use:

```css
:root {
  /* Primary Brand Colors */
  --color-primary: #00897b;          /* Teal - customizable per client */
  --color-primary-dark: #00695c;
  --color-primary-light: #26a69a;

  /* Secondary Brand Colors */
  --color-secondary: #0a2647;        /* Navy - customizable */
  --color-secondary-dark: #061a33;
  --color-secondary-light: #0d3059;

  /* Accent Colors */
  --color-accent: #e94560;           /* Coral - customizable */

  /* Neutral Colors */
  --color-surface: #f8f9fb;
  --color-border: #e2e8f0;
  --color-text-primary: #1e293b;
  --color-text-muted: #64748b;

  /* Status Colors */
  --color-success: #16a34a;
  --color-warning: #f59e0b;
  --color-error: #dc2626;
  --color-info: #3b82f6;

  /* Typography */
  --font-heading: 'DM Serif Display', Georgia, serif;
  --font-body: 'Plus Jakarta Sans', -apple-system, sans-serif;

  /* Spacing & Layout */
  --radius: 12px;
  --radius-sm: 8px;
  --radius-lg: 16px;
  --shadow: 0 4px 20px rgba(10, 38, 71, 0.08);
  --shadow-lg: 0 8px 32px rgba(10, 38, 71, 0.12);
}

/* Client-specific overrides (example for Plastimed) */
[data-client="plastimed"] {
  --color-primary: #00897b;
  --color-secondary: #0a2647;
  --color-accent: #e94560;
  --font-heading: 'DM Serif Display', Georgia, serif;
}

/* Client-specific overrides (example for Aboland) */
[data-client="aboland"] {
  --color-primary: #c8a882;
  --color-secondary: #2c1810;
  --color-accent: #d4af37;
  --font-heading: 'Playfair Display', Georgia, serif;
}
```

**How to Apply:**
```tsx
// In _app or layout
<body data-client={clientSlug}>
```

#### 5.2 Component Styling Guidelines

**ALL components must use CSS variables:**

❌ **WRONG:**
```tsx
<button style={{ background: '#00897b' }}>
```

✅ **CORRECT:**
```tsx
<button style={{ background: 'var(--color-primary)' }}>
```

**Class-based approach:**
```css
.cart-button {
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
```

---

### Phase 6: Testing & QA (2 days)

#### 6.1 A/B Test Setup (In Payload Admin)

**Create test:**
1. Go to: E-commerce → A/B Tests → Create New
2. Fill in:
   - **Name:** "Cart Template Test Q1 2026"
   - **Description:** "Testing compact table vs visual cards"
   - **Target Page:** "cart"
   - **Status:** "running"
   - **Variants:**
     - Variant 1: name=`template1`, label="Compact Table", distribution=50%
     - Variant 2: name=`template2`, label="Visual Cards", distribution=50%
   - **Auto-Winner:**
     - Enabled: ✓
     - Conversion Threshold: 100
     - Confidence Level: 95%
3. Save & Publish

**Monitor results:**
- Go to: E-commerce → A/B Test Results
- Check conversion rates per variant
- View analytics dashboard (create custom view)

#### 6.2 Test Scenarios

**User Flow 1: Guest Checkout**
1. Add products to cart
2. Go to cart → verify correct template shows
3. Click "Afrekenen"
4. Choose "Gast bestellen" tab
5. Fill in guest form
6. Complete checkout
7. Verify conversion tracked: `/api/ab-test/convert` called
8. Check database: `ab_test_results` has `converted=true`

**User Flow 2: Registered User**
1. Register new account
2. Add products to cart
3. Login
4. Go to cart
5. Click "Afrekenen"
6. Use saved address
7. Complete order
8. Verify conversion tracked

**User Flow 3: A/B Test Assignment**
1. Open Incognito window
2. Visit cart page
3. Check which variant assigned (inspect Network tab: `/api/ab-test/assign`)
4. Verify cookie `ab_session_id` set
5. Refresh page → same variant shown (persistent)
6. Open new Incognito → different variant possible

#### 6.3 Database Verification

```sql
-- Check test exists
SELECT * FROM ab_tests WHERE "targetPage" = 'cart';

-- Check variant assignments
SELECT variant, COUNT(*) as count
FROM ab_test_results
WHERE test = '<test-id>'
GROUP BY variant;

-- Check conversion rates
SELECT
  variant,
  COUNT(*) as total,
  SUM(CASE WHEN converted THEN 1 ELSE 0 END) as conversions,
  ROUND(SUM(CASE WHEN converted THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100, 2) as rate
FROM ab_test_results
WHERE test = '<test-id>'
GROUP BY variant;
```

---

## 📂 File Structure Summary

```
src/
├── app/
│   ├── (ecommerce)/
│   │   ├── cart/
│   │   │   ├── page.tsx                    ✅ EXISTS (needs A/B update)
│   │   │   ├── CartTemplate1.tsx           ✅ EXISTS
│   │   │   └── CartTemplate2.tsx           ❌ TODO
│   │   ├── checkout/
│   │   │   ├── page.tsx                    ❌ TODO (multi-step)
│   │   │   └── success/page.tsx            ❌ TODO
│   │   ├── login/
│   │   │   ├── page.tsx                    ❌ TODO
│   │   │   └── LoginTemplate.tsx           ❌ TODO
│   │   └── register/
│   │       ├── page.tsx                    ❌ TODO
│   │       └── RegisterTemplate.tsx        ❌ TODO
│   └── api/
│       ├── ab-test/
│       │   ├── assign/route.ts             ✅ COMPLETE
│       │   └── convert/route.ts            ✅ COMPLETE
│       ├── auth/
│       │   └── guest-session/route.ts      ❌ TODO
│       └── coupons/
│           └── validate/route.ts           ❌ TODO
├── branches/
│   ├── ecommerce/
│   │   ├── collections/
│   │   │   ├── ABTests.ts                  ✅ COMPLETE
│   │   │   ├── ABTestResults.ts            ✅ COMPLETE
│   │   │   ├── Coupons.ts                  ❓ VERIFY
│   │   │   └── ShippingMethods.ts          ❓ VERIFY
│   │   ├── components/
│   │   │   ├── FreeShippingProgress.tsx    ❌ TODO
│   │   │   ├── GuestCheckoutForm.tsx       ❌ TODO
│   │   │   └── checkout/
│   │   │       ├── CheckoutSummary.tsx     ❌ TODO
│   │   │       ├── CheckoutSteps.tsx       ❌ TODO
│   │   │       ├── CheckoutAddresses.tsx   ✅ EXISTS
│   │   │       └── ConfirmOrder.tsx        ✅ EXISTS
│   │   └── contexts/
│   │       └── CartContext.tsx             ✅ EXISTS
│   └── shared/
│       └── components/
│           └── features/
│               └── ABTest/
│                   ├── useABTest.ts         ✅ COMPLETE
│                   ├── types.ts             ✅ COMPLETE
│                   └── index.ts             ✅ COMPLETE
├── globals/
│   └── Settings.ts                         ⚠️  NEEDS UPDATE (add ecommerce fields)
└── migrations/
    ├── YYYYMMDD_HHMMSS_sprint_9_cart_checkout_ab_testing.ts  ❌ TODO
    └── YYYYMMDD_HHMMSS_settings_ecommerce_fields.ts          ❌ TODO
```

---

## 🎯 Implementation Checklist

### Pre-Development
- [ ] Read this entire document
- [ ] Verify all existing files work as expected
- [ ] Check database has required tables
- [ ] Backup current database

### Phase 1: Cart (2-3 days)
- [ ] Create CartTemplate2.tsx (visual variant)
- [ ] Update cart/page.tsx with A/B testing
- [ ] Create FreeShippingProgress component
- [ ] Test both variants render correctly
- [ ] Verify theme variables work

### Phase 2: Login/Register (2-3 days)
- [ ] Create login page + template
- [ ] Create register page + template
- [ ] Implement guest checkout form
- [ ] Add password strength indicator
- [ ] Test OAuth flow (optional)
- [ ] Verify tab switching works

### Phase 3: Checkout (3-4 days)
- [ ] Build multi-step checkout flow
- [ ] Create CheckoutSummary sidebar
- [ ] Implement shipping method selection
- [ ] Add payment method selection
- [ ] Create success page
- [ ] Test entire flow end-to-end

### Phase 4: Database (1 day)
- [ ] Verify all collections exist
- [ ] Generate migrations (ab-tests, ab-test-results, etc.)
- [ ] Test migrations on empty database
- [ ] Run `npm run validate-schema`
- [ ] Update Settings global (ecommerce fields)

### Phase 5: Theme (1-2 days)
- [ ] Define all CSS variables in globals.css
- [ ] Remove hardcoded Plastimed colors
- [ ] Add client-specific overrides
- [ ] Test with different clients (Plastimed, Aboland, generic)
- [ ] Verify responsive design

### Phase 6: Testing (2 days)
- [ ] Set up A/B test in admin panel
- [ ] Test guest checkout flow
- [ ] Test registered user checkout
- [ ] Verify conversion tracking works
- [ ] Check database for correct data
- [ ] Mobile responsiveness testing
- [ ] Cross-browser testing

### Phase 7: Documentation
- [ ] Write README for A/B testing system
- [ ] Document theme variable usage
- [ ] Create client setup guide
- [ ] Add JSDoc comments to new functions

---

## 🚨 Critical Rules

### Database Migrations
**ALWAYS follow CLAUDE.md protocol:**
1. Enable feature flag BEFORE generating migration
2. Verify generated SQL includes ALL new tables
3. Test on empty database FIRST
4. Run `npm run validate-schema`
5. NEVER deploy without migration

### Theme Variables
**NO hardcoded colors:**
- ❌ `background: '#00897b'`
- ✅ `background: 'var(--color-primary)'`

### A/B Testing
**Conversion tracking:**
- Call `trackConversion()` when order completes
- Include order value: `trackConversion({ conversionValue: total, orderId })`
- NEVER track conversion multiple times per session

### Guest Checkout
**Data handling:**
- Store minimal info (email, name, address)
- NO account creation
- Session-based cart (cookie)
- Clear session after order confirmation

---

## 📊 Success Metrics

### A/B Test KPIs
- **Primary:** Checkout completion rate (cart → order)
- **Secondary:** Average order value
- **Tertiary:** Time to checkout

### Performance
- Cart page load: < 1s
- Checkout step transitions: < 300ms
- A/B variant assignment: < 100ms

### User Experience
- Mobile cart usability: 95% task completion
- Guest checkout: 80% prefer over registration
- Error rate: < 5%

---

## 🔧 Troubleshooting

### "Variant not loading"
- Check A/B test status is "running"
- Verify `ab_session_id` cookie exists
- Check `/api/ab-test/assign` response in Network tab

### "Conversion not tracking"
- Verify `trackConversion()` called on checkout success
- Check `ab_test_results` table for `converted=true`
- Ensure testId passed correctly

### "Theme colors not applied"
- Check `data-client` attribute on `<body>`
- Verify CSS variables defined in globals.css
- Inspect element → check computed styles

### "Migration fails"
- Feature flag enabled? `ENABLE_ECOMMERCE=true`
- Database connection valid?
- Previous migrations applied?
- Check console for specific SQL error

---

## 🎉 Completion Criteria

Sprint 9 is COMPLETE when:
- ✅ Both cart templates render correctly
- ✅ A/B testing framework works end-to-end
- ✅ Guest checkout flow functional
- ✅ Login/register pages complete
- ✅ Multi-step checkout works
- ✅ Conversion tracking verified in database
- ✅ Theme system works for multiple clients
- ✅ All migrations applied successfully
- ✅ Documentation complete
- ✅ Zero build errors
- ✅ Zero TypeScript errors

---

**Estimated Total Time:** 10-14 days (2 weeks)
**Priority:** HIGH (Blocking client launches)
**Dependencies:** Sprint 1-8 complete (ecommerce base infrastructure)

---

## 📝 Notes From Previous Discussion

### Design Decisions
- **Variant A (Template1):** Compact table layout - best for B2B high-volume orders
- **Variant B (Template2):** Visual card layout - best for B2C emotional purchases
- **Why A/B test:** Different clients have different user personas (medical vs magazine)

### Technical Decisions
- **Session-based assignment:** Cookie `ab_session_id` (30 days)
- **Why not user-based:** Guests need testing too
- **Weighted distribution:** Allows 90/10 tests (not just 50/50)
- **Auto-winner:** Saves manual analysis time

### Future Enhancements (Post-Sprint 9)
- Multi-page A/B tests (cart + checkout combined)
- Heatmap integration (where users click)
- A/B test scheduler (auto start/stop)
- Email A/B testing (order confirmation templates)

---

**Last Updated:** 22 Feb 2026 22:00
**Author:** Claude Code (Reconstructed from codebase analysis)
**Status:** Ready for implementation ✅
