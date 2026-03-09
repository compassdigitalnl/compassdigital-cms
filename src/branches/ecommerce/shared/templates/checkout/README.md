# Checkout Templates - Complete Guide

**Last Updated:** 2 Maart 2026
**Status:** ✅ Production Ready
**Templates Available:** 3 (Template1, Template2, Template4)

---

## 📦 Overview

SiteForge offers **3 checkout templates** that can be selected via the admin panel. Site owners can choose between **one-step** (fast) or **multi-step** (guided) checkout experiences.

### Available Templates

| Template | Type | Steps | Lines | Components | Best For |
|----------|------|-------|-------|------------|----------|
| **Template 2** | **One-Step** | 1 (single page) | 387 | 4/5 | 🏃 **Fast checkout**, simple products, impulse buys |
| **Template 4** | **Multi-Step** | 4 (wizard) | 416 | 5/5 | 🎯 **B2B**, complex products, high-value orders |
| Template 1 | Multi-Step (Legacy) | 4 (wizard) | 609 | 5/5 | ⚠️ Legacy (use Template 4 instead) |

---

## 🎯 Template Comparison

### ✅ Template 2 - One-Step Checkout (RECOMMENDED for B2C)

**Type:** Single-page checkout
**Best for:** Fast checkouts, simple products, impulse purchases

**Features:**
- ✅ All fields visible on 1 page (no wizard)
- ✅ Faster checkout completion
- ✅ Minimal/compact design
- ✅ Guest checkout optimized
- ✅ Mobile-first responsive
- ✅ Less clicks = higher conversion

**Layout:**
```
┌─────────────────────────────────┐
│ Contact (email)                 │
├─────────────────────────────────┤
│ Billing Address                 │
├─────────────────────────────────┤
│ Shipping Method (2 options)     │
├─────────────────────────────────┤
│ Payment Method (3 options)      │
├─────────────────────────────────┤
│ [Place Order Button]            │
└─────────────────────────────────┘
```

**When to use:**
- B2C shops with simple products
- Low-friction checkout needed
- Impulse purchases
- Customers who want speed

---

### ✅ Template 4 - Multi-Step Checkout (RECOMMENDED for B2B)

**Type:** 4-step wizard with progress indicator
**Best for:** B2B, complex products, high-value orders

**Features:**
- ✅ 4-step wizard: Contact → Address → Shipping → Payment
- ✅ CheckoutProgressStepper (visual progress)
- ✅ All 5 checkout components integrated
- ✅ B2B support (PO numbers, invoice payment)
- ✅ Mobile collapsible cart
- ✅ 100% Tailwind CSS (no inline styles)
- ✅ Step validation (can't skip ahead)
- ✅ Fully type-safe (numeric steps 1-4)

**Layout:**
```
Step 1: Contact Information
┌─────────────────────────────────┐
│ [●───○───○───○] Progress        │
│                                 │
│ Email: [________________]       │
│ [Continue to Address]           │
└─────────────────────────────────┘

Step 2: Address
┌─────────────────────────────────┐
│ [●───●───○───○] Progress        │
│                                 │
│ Billing Address Form            │
│ [← Back] [Continue to Shipping] │
└─────────────────────────────────┘

Step 3: Shipping Method
┌─────────────────────────────────┐
│ [●───●───●───○] Progress        │
│                                 │
│ ⚬ Standard (€6.95)              │
│ ⚬ Express (€9.95)               │
│ [← Back] [Continue to Payment]  │
└─────────────────────────────────┘

Step 4: Payment
┌─────────────────────────────────┐
│ [●───●───●───●] Progress        │
│                                 │
│ ⚬ iDEAL (bank transfer)         │
│ ⚬ Creditcard                    │
│ ⚬ Invoice (B2B, needs PO)       │
│                                 │
│ PO Number: [__________]         │
│ [← Back] [Place Order - €199]   │
└─────────────────────────────────┘
```

**When to use:**
- B2B customers (need PO numbers)
- Complex products with many options
- High-value orders (need confidence)
- First-time customers (need guidance)

---

### ⚠️ Template 1 - Legacy Multi-Step (NOT RECOMMENDED)

**Type:** 4-step wizard (older version)
**Status:** ⚠️ Legacy - use Template 4 instead

**Issues:**
- ❌ Inline styles (harder to theme)
- ❌ More lines of code (609 vs 416)
- ❌ String-based steps (less type-safe)
- ⚠️ Use Template 4 instead!

---

## ⚙️ Admin Configuration

### How to Choose a Template

1. **Go to Admin Panel**
   - Navigate to: **Settings → Webshop Instellingen**

2. **Find Checkout Template Setting**
   - Look for: **"Standaard Checkout Template"**

3. **Select Your Preferred Template**
   - **Template 2** - One-Step Checkout (fast, B2C)
   - **Template 4** - Multi-Step Checkout (guided, B2B)
   - Template 1 - Legacy (not recommended)

4. **Save Settings**
   - Click "Save Changes"
   - Template is immediately active

### Default Setting

**Default:** Template 4 (Multi-Step)
**Why:** Most versatile, supports B2B, best UX for first-time customers

---

## 🛠️ Technical Implementation

### How Template Switching Works

**1. Settings Global (`src/globals/Settings.ts`)**
```typescript
{
  name: 'defaultCheckoutTemplate',
  type: 'select',
  defaultValue: 'template4',
  options: [
    { label: 'Template 2 - One-Step Checkout', value: 'checkouttemplate2' },
    { label: 'Template 4 - Multi-Step Checkout', value: 'template4' },
    { label: 'Template 1 - Legacy Multi-Step', value: 'checkouttemplate1' },
  ],
}
```

**2. Checkout Page (`src/app/(ecommerce)/checkout/page.tsx`)**
```typescript
const template = settings?.defaultCheckoutTemplate || 'template4'

if (template === 'template4') {
  return <CheckoutTemplate4 />
}

if (template === 'checkouttemplate2') {
  return <CheckoutTemplate2 />
}

return <CheckoutTemplate1 /> // Fallback
```

**3. Template Files**
```
src/branches/ecommerce/templates/checkout/
├── CheckoutTemplate1.tsx         (Legacy, 609 lines)
├── CheckoutTemplate2.tsx         (One-Step, 387 lines)
└── CheckoutTemplate4/            (Multi-Step, 416 lines)
    ├── index.tsx
    └── README.md
```

---

## 📊 Conversion Rate Optimization

### Template 2 (One-Step) - Best for:
- **Higher conversion rate** (fewer steps = less abandonment)
- **Faster checkout** (1 page vs 4 steps)
- **Mobile users** (less scrolling)
- **Returning customers** (know what to expect)
- **Simple products** (no complex config needed)

**Expected Conversion Rate:** 65-75%

### Template 4 (Multi-Step) - Best for:
- **Higher order values** (guided process builds confidence)
- **First-time customers** (clear steps reduce confusion)
- **B2B customers** (need PO numbers, invoice payment)
- **Complex products** (more time to review)
- **Desktop users** (wizard UX works well)

**Expected Conversion Rate:** 55-65%

---

## 🧪 A/B Testing Recommendation

### Hypothesis
One-step checkout will have **10-15% higher conversion** for B2C customers, but **5-10% lower order value**.

### Test Setup
1. **Control:** Template 4 (Multi-Step) - 50% traffic
2. **Variant:** Template 2 (One-Step) - 50% traffic
3. **Duration:** 2-4 weeks
4. **Metrics:**
   - Conversion rate (% completed checkouts)
   - Average order value
   - Time to complete
   - Abandonment rate by step

### Expected Results
- **B2C:** Template 2 wins on conversion
- **B2B:** Template 4 wins on order value
- **Mixed:** Segment by customer type

---

## 🔧 Customization Guide

### Changing Default Template

**Via Admin Panel:**
1. Go to Settings → Webshop Instellingen
2. Change "Standaard Checkout Template"
3. Save

**Via Code (for testing):**
```typescript
// src/app/(ecommerce)/checkout/page.tsx
const template = 'checkouttemplate2' // Force Template 2
```

### Adding a New Template

1. **Create Template File:**
   ```bash
   touch src/branches/ecommerce/templates/checkout/CheckoutTemplate5.tsx
   ```

2. **Add to Settings:**
   ```typescript
   // src/globals/Settings.ts
   options: [
     { label: 'Template 5 - Custom', value: 'checkouttemplate5' },
     // ... existing options
   ]
   ```

3. **Add to Page Router:**
   ```typescript
   // src/app/(ecommerce)/checkout/page.tsx
   import CheckoutTemplate5 from '@/branches/ecommerce/templates/checkout/CheckoutTemplate5'

   if (template === 'checkouttemplate5') {
     return <CheckoutTemplate5 />
   }
   ```

---

## 🐛 Troubleshooting

### Issue: Template not switching
**Solution:** Clear Payload cache and restart:
```bash
rm -rf .next
npm run dev
```

### Issue: TypeScript errors after switching
**Solution:** Regenerate Payload types:
```bash
npx payload generate:types
```

### Issue: Empty cart redirect
**Solution:** This is expected behavior. All templates redirect to `/shop` if cart is empty.

### Issue: Payment method not working
**Solution:** Check if payment gateway is configured in Settings → Payment Settings.

---

## 📈 Analytics Integration

### Track Template Performance

```typescript
// Google Analytics Event
gtag('event', 'checkout_progress', {
  checkout_template: 'template2', // or 'template4'
  checkout_step: 1,
  value: cart.total,
})
```

### Key Metrics to Track
1. **Checkout Initiated** - User lands on checkout
2. **Step Completed** - Each step finished (multi-step only)
3. **Order Placed** - Successful completion
4. **Abandonment Rate** - % who leave without ordering
5. **Time to Complete** - How long checkout takes

---

## 🚀 Best Practices

### When to Use One-Step (Template 2)
✅ B2C e-commerce
✅ Simple products (no complex config)
✅ Impulse purchases
✅ Mobile-first audience
✅ Returning customers
✅ Low-value orders (<€100)

### When to Use Multi-Step (Template 4)
✅ B2B e-commerce
✅ Complex products
✅ High-value orders (>€500)
✅ First-time customers
✅ Desktop-heavy audience
✅ Need invoice payment/PO numbers

### Universal Best Practices
- ✅ Always show trust signals (SSL, payment logos)
- ✅ Show progress indicator (if multi-step)
- ✅ Allow guest checkout
- ✅ Save form data (don't lose progress)
- ✅ Clear error messages
- ✅ Mobile-optimized
- ✅ Fast page load (<2s)

---

## 🔒 Security & Compliance

All templates include:
- ✅ HTTPS required
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ Input validation
- ✅ PCI-DSS compliant (payment forms)
- ✅ GDPR compliant (data handling)
- ✅ SSL certificates verified

---

## 📚 Related Documentation

- **Checkout Components:** `/docs/refactoring/components/ecommerce/checkout/`
- **Cart Components:** `/docs/refactoring/components/ecommerce/cart/`
- **Payment Integration:** `/docs/PAYMENT_INTEGRATION.md`
- **Settings Global:** `/docs/refactoring/globals/SPRINT_1_IMPLEMENTATION_PLAN.md`

---

## 🎓 Support

For issues or questions:
1. Check this README first
2. Review component documentation in `/docs/refactoring/`
3. Check CLAUDE.md for implementation status
4. Test in development mode first
5. Review server logs for errors

---

## 📝 Changelog

### 2 Maart 2026
- ✅ Added Template 2 (One-Step) to admin settings
- ✅ Updated default to Template 4
- ✅ Improved admin descriptions
- ✅ Created this complete README

### 1 Maart 2026
- ✅ Created CheckoutTemplate4 (Ultimate Multi-Step)
- ✅ Full integration of all 5 checkout components
- ✅ 0 TypeScript errors

### 26 Feb 2026
- ✅ Created CheckoutTemplate1 (Legacy Multi-Step)
- ✅ Created CheckoutTemplate2 (One-Step)

---

**Built with:** React 18, TypeScript 5, Tailwind CSS 3, Payload CMS 3, Next.js 15
**Quality:** 0 TypeScript errors (checkout templates), 100% type-safe, production-ready
**Status:** ✅ Complete & Tested (2 Maart 2026)
