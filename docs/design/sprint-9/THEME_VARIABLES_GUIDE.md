# E-Commerce Theme Variables System

**Version:** 1.0
**Last Updated:** February 2026
**Sprint:** 9 - E-commerce Cart & Checkout

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Available Variables](#available-variables)
4. [Client-Specific Themes](#client-specific-themes)
5. [Usage Examples](#usage-examples)
6. [Best Practices](#best-practices)
7. [Adding New Clients](#adding-new-clients)
8. [Troubleshooting](#troubleshooting)

---

## Overview

### What is this?

A **generic CSS variable system** that allows complete theme customization for multi-tenant e-commerce applications. Each client can have their own brand colors, fonts, and styling without modifying component code.

### Key Features

✅ **Multi-tenant Support** - Multiple clients with unique branding
✅ **Zero Hardcoded Colors** - All components use CSS variables
✅ **Easy Client Setup** - Just add `data-client` attribute
✅ **Comprehensive Coverage** - Colors, fonts, spacing, shadows, transitions
✅ **Dark Mode Ready** - Built-in dark theme support
✅ **Fallback Values** - Default theme if no client specified

### Architecture

```
:root (default theme)
  ├── Base variables (all clients)
  └── Default colors (teal + navy)

[data-client="plastimed"]
  └── Override with Plastimed branding

[data-client="aboland"]
  └── Override with Aboland branding
```

---

## Quick Start

### 1. Set Client Attribute

Add `data-client` attribute to your layout:

```tsx
// src/app/(ecommerce)/layout.tsx
export default function EcommerceLayout({ children }: { children: React.ReactNode }) {
  const client = 'plastimed' // Get from database or env

  return (
    <html lang="nl">
      <body data-client={client}>
        {children}
      </body>
    </html>
  )
}
```

### 2. Use CSS Variables

In your components, always use CSS variables:

```tsx
// ✅ CORRECT - Uses CSS variable with fallback
<button
  style={{
    background: 'var(--color-primary, #00897b)',
    color: 'white',
  }}
>
  Checkout
</button>

// ❌ WRONG - Hardcoded color
<button style={{ background: '#00897b' }}>
  Checkout
</button>
```

### 3. That's It!

Your components will automatically use the client's theme. No code changes needed.

---

## Available Variables

### Brand Colors

| Variable | Default | Description |
|----------|---------|-------------|
| `--color-primary` | `#00897b` | Main brand color (buttons, links) |
| `--color-primary-hover` | `#00695c` | Hover state for primary |
| `--color-primary-bg` | `#e0f2f1` | Light background for primary |
| `--color-secondary` | `#0a2647` | Secondary brand color (headers) |
| `--color-secondary-hover` | `#051526` | Hover state for secondary |
| `--color-accent` | `#ff6b35` | Accent color (badges, highlights) |

### Text Colors

| Variable | Default | Description |
|----------|---------|-------------|
| `--color-text-primary` | `#1e293b` | Main text (headings, body) |
| `--color-text-secondary` | `#334155` | Subheadings |
| `--color-text-muted` | `#64748b` | Labels, hints |
| `--color-text-disabled` | `#94a3b8` | Disabled state |

### Semantic Colors

| Variable | Default | Description |
|----------|---------|-------------|
| `--color-success` | `#16a34a` | Success messages |
| `--color-success-bg` | `#f0fdf4` | Success background |
| `--color-error` | `#dc2626` | Error messages |
| `--color-error-bg` | `#fef2f2` | Error background |
| `--color-warning` | `#f59e0b` | Warnings |
| `--color-warning-bg` | `#fffbeb` | Warning background |
| `--color-info` | `#3b82f6` | Info messages |
| `--color-info-bg` | `#eff6ff` | Info background |

### Surface Colors

| Variable | Default | Description |
|----------|---------|-------------|
| `--color-surface` | `#f1f5f9` | Cards, inputs |
| `--color-surface-hover` | `#e2e8f0` | Hover state |
| `--color-border` | `#e2e8f0` | Border color |
| `--color-divider` | `#cbd5e1` | Divider lines |

### Typography

| Variable | Default | Description |
|----------|---------|-------------|
| `--font-heading` | `'Plus Jakarta Sans'` | Headings font |
| `--font-body` | `-apple-system` | Body text font |
| `--font-mono` | `'Consolas'` | Code/mono font |

### Spacing

| Variable | Value | Usage |
|----------|-------|-------|
| `--spacing-xs` | `4px` | Tiny gaps |
| `--spacing-sm` | `8px` | Small gaps |
| `--spacing-md` | `16px` | Medium gaps |
| `--spacing-lg` | `24px` | Large gaps |
| `--spacing-xl` | `32px` | Extra large |
| `--spacing-2xl` | `48px` | Huge gaps |

### Border Radius

| Variable | Value | Usage |
|----------|-------|-------|
| `--radius-sm` | `8px` | Small corners |
| `--radius-md` | `12px` | Medium corners |
| `--radius-lg` | `16px` | Large corners |
| `--radius-xl` | `24px` | Extra large |
| `--radius-full` | `9999px` | Pills/circles |

### Shadows

| Variable | Value |
|----------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` |
| `--shadow-lg` | `0 8px 16px rgba(0,0,0,0.1)` |
| `--shadow-xl` | `0 12px 32px rgba(0,0,0,0.12)` |

### Transitions

| Variable | Value | Usage |
|----------|-------|-------|
| `--transition-fast` | `150ms ease` | Quick animations |
| `--transition-normal` | `300ms ease` | Standard animations |
| `--transition-slow` | `500ms ease` | Slow animations |

### E-commerce Specific

| Variable | Default | Description |
|----------|---------|-------------|
| `--color-price` | `#1e293b` | Price text |
| `--color-price-old` | `#94a3b8` | Strikethrough old price |
| `--color-badge` | `#ff6b35` | Sale/discount badges |
| `--color-stock-high` | `#16a34a` | In stock (green) |
| `--color-stock-low` | `#f59e0b` | Low stock (amber) |
| `--color-stock-out` | `#dc2626` | Out of stock (red) |
| `--color-rating` | `#fbbf24` | Star ratings (yellow) |

---

## Client-Specific Themes

### Current Clients

#### Plastimed (Medical Equipment)

**Brand Colors:**
- Primary: Teal (`#00897b`)
- Secondary: Navy (`#0a2647`)
- Accent: Orange (`#ff6b35`)

**Usage:**
```tsx
<body data-client="plastimed">
```

#### Aboland (Construction & Industrial)

**Brand Colors:**
- Primary: Blue (`#1e40af`)
- Secondary: Dark Gray (`#374151`)
- Accent: Amber (`#f59e0b`)

**Usage:**
```tsx
<body data-client="aboland">
```

---

## Usage Examples

### Example 1: Button Component

```tsx
export function PrimaryButton({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 rounded-xl font-bold transition-all hover:opacity-90"
      style={{
        background: 'var(--color-primary, #00897b)',
        color: 'white',
        borderRadius: 'var(--radius-md, 12px)',
        transition: 'var(--transition-normal, 300ms ease)',
      }}
    >
      {children}
    </button>
  )
}
```

**Result:**
- Plastimed: Teal button
- Aboland: Blue button
- Default: Teal button (fallback)

### Example 2: Card Component

```tsx
export function ProductCard({ product }: CardProps) {
  return (
    <div
      className="p-6 rounded-xl border transition-all hover:shadow-lg"
      style={{
        background: 'white',
        borderColor: 'var(--color-border, #e2e8f0)',
        borderRadius: 'var(--radius-lg, 16px)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <h3
        className="text-xl font-bold mb-2"
        style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text-primary, #1e293b)',
        }}
      >
        {product.title}
      </h3>

      <p
        className="text-sm mb-4"
        style={{ color: 'var(--color-text-muted, #64748b)' }}
      >
        {product.description}
      </p>

      <div
        className="text-2xl font-bold"
        style={{ color: 'var(--color-price, #1e293b)' }}
      >
        €{product.price.toFixed(2)}
      </div>
    </div>
  )
}
```

### Example 3: Status Badge

```tsx
export function StockBadge({ stock }: { stock: number }) {
  const getStockColor = () => {
    if (stock === 0) return 'var(--color-stock-out, #dc2626)'
    if (stock < 5) return 'var(--color-stock-low, #f59e0b)'
    return 'var(--color-stock-high, #16a34a)'
  }

  const getStockBg = () => {
    if (stock === 0) return 'var(--color-error-bg, #fef2f2)'
    if (stock < 5) return 'var(--color-warning-bg, #fffbeb)'
    return 'var(--color-success-bg, #f0fdf4)'
  }

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-bold"
      style={{
        background: getStockBg(),
        color: getStockColor(),
      }}
    >
      {stock === 0 ? 'Niet op voorraad' : `${stock} op voorraad`}
    </span>
  )
}
```

### Example 4: Dynamic Client Selection

```tsx
// src/app/(ecommerce)/layout.tsx
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function EcommerceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get client from subdomain, database, or env
  const payload = await getPayload({ config })

  // Option 1: From subdomain
  const hostname = headers().get('host') || ''
  const subdomain = hostname.split('.')[0]
  const clientSlug = subdomain === 'plastimed' ? 'plastimed' : 'aboland'

  // Option 2: From database
  const settings = await payload.findGlobal({ slug: 'settings' })
  const clientSlug = settings.clientSlug || 'default'

  // Option 3: From environment
  const clientSlug = process.env.CLIENT_SLUG || 'default'

  return (
    <html lang="nl">
      <body data-client={clientSlug}>
        {children}
      </body>
    </html>
  )
}
```

---

## Best Practices

### ✅ DO

1. **Always use CSS variables with fallbacks:**
   ```tsx
   style={{ color: 'var(--color-primary, #00897b)' }}
   ```

2. **Use semantic variable names:**
   ```tsx
   // Good
   background: 'var(--color-success-bg)'

   // Bad
   background: '#f0fdf4'
   ```

3. **Group related styles:**
   ```tsx
   const buttonStyles = {
     background: 'var(--color-primary)',
     color: 'white',
     borderRadius: 'var(--radius-md)',
     padding: 'var(--spacing-md) var(--spacing-lg)',
   }
   ```

4. **Document custom overrides:**
   ```tsx
   // Custom override for special case
   style={{
     background: 'var(--color-primary)',
     // 10% opacity for hover state
     opacity: isHovered ? 0.9 : 1,
   }}
   ```

### ❌ DON'T

1. **Hardcode colors:**
   ```tsx
   // Bad
   <div style={{ background: '#00897b' }}>
   ```

2. **Mix variable systems:**
   ```tsx
   // Bad - mixing Tailwind classes with custom variables
   <div className="bg-teal-600" style={{ color: 'var(--color-primary)' }}>
   ```

3. **Override variables inline:**
   ```tsx
   // Bad
   <div style={{ '--color-primary': '#ff0000' }}>
   ```

4. **Use client-specific logic in components:**
   ```tsx
   // Bad
   const color = client === 'plastimed' ? '#00897b' : '#1e40af'

   // Good
   const color = 'var(--color-primary)'
   ```

---

## Adding New Clients

### Step 1: Define Theme in globals.css

```css
/* src/app/globals.css */

[data-client='newclient'] {
  /* Brand Colors */
  --color-primary: #your-primary-color;
  --color-primary-hover: #darker-primary;
  --color-primary-bg: #light-primary;
  --color-secondary: #your-secondary-color;
  --color-secondary-hover: #darker-secondary;
  --color-accent: #your-accent-color;

  /* Typography (optional) */
  --font-heading: 'Your Heading Font', sans-serif;
  --font-body: 'Your Body Font', sans-serif;

  /* E-commerce Specific (optional) */
  --color-badge: #your-badge-color;
  --color-rating: #your-rating-color;
}
```

### Step 2: Apply Client Attribute

```tsx
// In your layout or root component
<body data-client="newclient">
  {children}
</body>
```

### Step 3: Test All Components

Verify that all components look correct with the new theme:
- Cart pages
- Checkout flow
- Login/Register
- Product cards
- Buttons and forms

### Step 4: Document

Add the new client to this guide's "Current Clients" section.

---

## Troubleshooting

### Problem: Colors not changing

**Cause:** `data-client` attribute not applied correctly

**Solution:**
```tsx
// Check that attribute is on <body> tag
console.log(document.body.getAttribute('data-client'))

// Should output: "plastimed" or "aboland"
```

### Problem: Fallback colors showing

**Cause:** CSS variable not defined or typo

**Solution:**
```tsx
// Check variable name spelling
❌ var(--color-primry)    // Typo!
✅ var(--color-primary)

// Check that variable exists in globals.css
```

### Problem: Font not loading

**Cause:** Font family not imported

**Solution:**
```tsx
// Add font import to layout.tsx
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'

const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

// Apply to body
<body className={plusJakarta.className} data-client="plastimed">
```

### Problem: Dark mode conflicts

**Cause:** `data-theme` and `data-client` both applied

**Solution:**
```tsx
// Both attributes can coexist
<body data-theme="dark" data-client="plastimed">

// CSS specificity handles both:
[data-theme='dark'] { /* Dark mode */ }
[data-client='plastimed'] { /* Client branding */ }
```

### Problem: Styles not consistent across pages

**Cause:** `data-client` only applied to some layouts

**Solution:**
```tsx
// Apply to root layout, not individual pages
// src/app/layout.tsx (ROOT)
<body data-client={clientSlug}>
  {children}
</body>
```

---

## Performance Notes

### CSS Variable Performance

CSS variables are **highly performant**:
- ✅ No JavaScript runtime cost
- ✅ Browser-native feature
- ✅ Hardware accelerated
- ✅ Minimal paint/layout impact

### Best Practices for Performance

1. **Define variables at root level** (not per-component)
2. **Use inheritance** (variables cascade down)
3. **Avoid inline style tags** when possible (prefer CSS classes)
4. **Cache client slug** (don't recalculate on every render)

---

## Migration Guide

### From Hardcoded Colors

**Before:**
```tsx
<button style={{ background: '#00897b', color: 'white' }}>
  Checkout
</button>
```

**After:**
```tsx
<button
  style={{
    background: 'var(--color-primary, #00897b)',
    color: 'white',
  }}
>
  Checkout
</button>
```

### From Tailwind Classes

**Before:**
```tsx
<div className="bg-teal-600 text-white">
```

**After:**
```tsx
<div
  className="text-white"
  style={{ background: 'var(--color-primary)' }}
>
```

**Or use Tailwind arbitrary values:**
```tsx
<div className="bg-[var(--color-primary)] text-white">
```

---

## Summary

✅ **Generic theme system** for multi-tenant e-commerce
✅ **Zero hardcoded colors** - all components use CSS variables
✅ **Easy client setup** - just add `data-client` attribute
✅ **100+ variables** covering colors, fonts, spacing, shadows
✅ **Client-specific overrides** for Plastimed, Aboland, and more
✅ **Dark mode compatible**
✅ **Performance optimized** - browser-native CSS variables

**Next Steps:**
1. Apply `data-client` to your layout
2. Verify all components use CSS variables
3. Test with different client themes
4. Add new clients as needed

---

**Questions?** Check the troubleshooting section or review component examples in:
- `src/app/(ecommerce)/cart/CartTemplate2.tsx`
- `src/branches/ecommerce/components/checkout/CheckoutSummary.tsx`
- `src/app/(ecommerce)/login/AuthTemplate.tsx`
