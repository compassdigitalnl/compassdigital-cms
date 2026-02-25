# TrustSignals Component (EC09)

Conversion-boosting trust badges displayed near checkout CTAs to reduce cart abandonment and increase conversions.

## Overview

**Component ID:** EC09
**Category:** E-commerce / Conversion
**Source:** `ec09-trust-signals.html`
**Priority:** CRITICAL

Trust signals are visual indicators that build customer confidence by addressing common purchase objections (payment security, return policy, shipping speed, customer support).

## Features

- Icon + text layout (16px teal icons, grey-dark text)
- Vertical list with 8px gaps (default)
- Multiple variants (default, compact, horizontal, card)
- Configurable via CMS (global settings)
- Full accessibility (semantic HTML, ARIA labels)
- Theme variable integration (NO hardcoded colors!)

## Usage

### Basic Usage

```tsx
import { TrustSignals } from '@/branches/shared/components/ui'

// Default variant (vertical, in OrderSummary)
<TrustSignals
  signals={[
    { icon: 'ShieldCheck', text: 'Veilig betalen met SSL' },
    { icon: 'RotateCcw', text: '30 dagen retourrecht' },
    { icon: 'Truck', text: 'Morgen in huis' }
  ]}
/>
```

### Variants

```tsx
// Compact variant (mini cart)
<TrustSignals variant="compact" signals={signals} />

// Horizontal variant (product page)
<TrustSignals variant="horizontal" signals={signals} />

// Card variant (standalone)
<TrustSignals variant="card" signals={signals} />
```

## Props

### TrustSignalsProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `signals` | `TrustSignal[]` | Default signals | Array of trust signals to display |
| `variant` | `'default' \| 'compact' \| 'horizontal' \| 'card'` | `'default'` | Display variant |
| `className` | `string` | `''` | Additional CSS classes |

### TrustSignal

| Property | Type | Description |
|----------|------|-------------|
| `icon` | `string` | Lucide icon name (e.g., `'ShieldCheck'`, `'Truck'`) |
| `text` | `string` | Display text for the trust signal |

## Variants

### Default
- Vertical list layout
- 20px top/bottom padding
- 1px top border (--grey)
- 8px gap between items
- **Use case:** OrderSummary sidebar, checkout page

### Compact
- Smaller text (12px vs 13px)
- Smaller icons (14px vs 16px)
- No border, no padding
- 6px gap between items
- **Use case:** Mini cart flyout, tight spaces

### Horizontal
- Row layout (flex-direction: row)
- Wraps on narrow screens
- 12px gap between items
- **Use case:** Product pages, checkout header

### Card
- White background (--white)
- Border (--grey)
- Border radius (--radius-lg)
- 16px padding
- **Use case:** Standalone sections, landing pages, footer

## Common Trust Signals

| Signal | Icon | Text Example |
|--------|------|--------------|
| SSL/Security | `ShieldCheck` | "Veilig betalen met SSL" |
| Return Policy | `RotateCcw` | "30 dagen retourrecht" |
| Fast Shipping | `Truck` | "Morgen in huis" |
| Free Shipping | `PackageCheck` | "Gratis verzending vanaf € 60" |
| Customer Service | `Phone` or `Headset` | "Klantenservice 24/7" |
| Pay Later | `CreditCard` | "Achteraf betalen mogelijk" |
| Reviews | `Star` | "4,8/5 sterren (2.400+ reviews)" |
| Certification | `Award` | "Keurmerk gecertificeerd" |

## Theme Variables Used

All styling uses theme variables from `THEME_VARIABLES_REFERENCE.md`:

- **Icon color:** `var(--teal)` (#00897B)
- **Text color:** `var(--grey-dark)` (#64748B)
- **Border:** `var(--grey)` (#E8ECF1)
- **Background (card):** `var(--white)` (#FAFBFC)
- **Border radius:** `var(--radius-lg)` (12px)

## Accessibility

### Semantic HTML
```html
<ul class="trust-signals" aria-label="Trust signals">
  <li class="trust-signals__item">
    <svg aria-hidden="true">...</svg>
    Veilig betalen met SSL
  </li>
  <!-- ... -->
</ul>
```

### ARIA Attributes
- `aria-label="Trust signals"` on `<ul>` wrapper
- `aria-hidden="true"` on decorative icons
- Semantic `<li>` elements for list items

### Screen Reader Experience
"Trust signals. List, 3 items. Veilig betalen met SSL. 30 dagen retourrecht. Morgen in huis."

### Color Contrast
- Grey-dark text on white: 4.5:1 ✓ WCAG AA
- Teal icons on white: 4.7:1 ✓ WCAG AA

## Conversion Impact

Trust signals can increase checkout conversion by **5-15%** by addressing common objections:

- "Is my payment secure?" → SSL badge
- "Can I return it?" → Return policy
- "When will it arrive?" → Shipping info
- "Can I trust this site?" → Certifications, reviews

### Best Practices

1. **Limit signals:** Max 3-4 signals (too many = diluted trust)
2. **Prioritize relevance:** Show signals most relevant to your business
3. **Be specific:** "30 dagen retourrecht" > "Gratis retour"
4. **Place strategically:** Near checkout CTAs, add-to-cart buttons
5. **Test performance:** A/B test different signals and placements

## Related Components

- **EC07: OrderSummary** — Contains this component by default
- **EC02: MiniCart Flyout** — Uses compact variant
- **C15: Footer** — May include trust signals

## Examples

### E-commerce Checkout
```tsx
// In OrderSummary component
<TrustSignals
  signals={[
    { icon: 'ShieldCheck', text: 'Veilig betalen met SSL' },
    { icon: 'RotateCcw', text: '30 dagen retourrecht' },
    { icon: 'Truck', text: 'Gratis verzending' }
  ]}
/>
```

### Product Page
```tsx
// Below "Add to Cart" button
<TrustSignals
  variant="horizontal"
  signals={[
    { icon: 'ShieldCheck', text: 'Veilig betalen' },
    { icon: 'RotateCcw', text: '30 dagen retour' },
    { icon: 'Truck', text: 'Morgen in huis' }
  ]}
/>
```

### Mini Cart
```tsx
// In cart flyout footer
<TrustSignals
  variant="compact"
  signals={defaultSignals}
/>
```

### Landing Page
```tsx
// Standalone section
<TrustSignals
  variant="card"
  signals={[
    { icon: 'PackageCheck', text: 'Gratis verzending vanaf € 60' },
    { icon: 'CreditCard', text: 'Achteraf betalen mogelijk' },
    { icon: 'Phone', text: 'Klantenservice 24/7' },
    { icon: 'Star', text: '4,8/5 sterren (2.400+ reviews)' }
  ]}
/>
```

## CMS Integration

Trust signals can be managed via Payload CMS global settings:

```typescript
// In site-settings collection
{
  name: 'trustSignals',
  type: 'array',
  fields: [
    {
      name: 'icon',
      type: 'select',
      options: [
        { label: 'SSL / Secure', value: 'ShieldCheck' },
        { label: 'Return Policy', value: 'RotateCcw' },
        { label: 'Fast Shipping', value: 'Truck' },
        { label: 'Free Shipping', value: 'PackageCheck' },
        { label: 'Customer Service', value: 'Phone' },
        { label: 'Pay Later', value: 'CreditCard' },
        { label: 'Reviews', value: 'Star' },
        { label: 'Certification', value: 'Award' }
      ]
    },
    {
      name: 'text',
      type: 'text',
      required: true
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true
    }
  ]
}
```

### Fetching from CMS

```tsx
// Server component
export async function TrustSignalsFromCMS() {
  const settings = await payload.findGlobal({
    slug: 'site-settings'
  })

  const activeSignals = settings.trustSignals
    ?.filter(s => s.isActive)
    .map(s => ({ icon: s.icon, text: s.text }))

  return <TrustSignals signals={activeSignals} />
}
```

## Testing Checklist

- [ ] Icons load correctly from Lucide
- [ ] Text is readable (4.5:1 contrast)
- [ ] All variants render correctly
- [ ] CMS signals filter by isActive
- [ ] Max 4-5 signals displayed
- [ ] Screen readers announce list
- [ ] Icons hidden from screen readers
- [ ] Responsive layout (wraps on horizontal variant)
- [ ] Theme variables applied (no hardcoded colors)

---

**Last Updated:** February 25, 2026
**Spec:** ec09-trust-signals.html
**Status:** ✅ Production Ready
