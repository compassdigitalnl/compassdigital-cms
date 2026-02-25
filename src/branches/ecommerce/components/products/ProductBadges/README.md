# ProductBadge (c18)

Comprehensive badge system for product cards with 8 semantic variants, 3 sizes, and support for both pill (standalone) and positioned (on image) styles.

## Features

- ✅ **8 semantic variants:** Bestseller, Nieuw, Uitverkocht, Staffel, Eco, Aanbieding, Exclusief, B2B
- ✅ **3 sizes:** Small (10px), Medium (12px), Large (13px)
- ✅ **2 styles:** Pill (standalone) or Positioned (on product image)
- ✅ **3 positions:** Top-left, Top-right, Ribbon
- ✅ **Icon support:** Lucide icons for each variant
- ✅ **Animated option:** Pulsing effect for highlighting
- ✅ **Clickable badges:** For filters and interactions
- ✅ **Theme variables only:** NO hardcoded colors!
- ✅ **Fully accessible:** WCAG 2.1 AA compliant

## Usage

### Basic Pill Badge

```tsx
import { ProductBadge } from '@/branches/ecommerce/components/products/ProductBadges'

<ProductBadge variant="bestseller" />
```

### Custom Label

```tsx
<ProductBadge variant="aanbieding" label="-15%" />
```

### Size Variants

```tsx
<ProductBadge variant="nieuw" size="sm" />   {/* Small */}
<ProductBadge variant="nieuw" />             {/* Medium (default) */}
<ProductBadge variant="nieuw" size="lg" />   {/* Large */}
```

### Positioned Badge (On Product Image)

```tsx
<div style={{ position: 'relative' }}>
  <img src="/product.jpg" alt="Product" />
  <ProductBadge
    variant="bestseller"
    style="positioned"
    position="top-left"
  />
</div>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `BadgeVariant` | ✓ | - | Badge type (bestseller/nieuw/etc.) |
| `label` | `string` |  | Auto | Custom label text |
| `showIcon` | `boolean` |  | `true` (pill) | Show icon |
| `size` | `'sm' \| 'md' \| 'lg'` |  | `'md'` | Badge size |
| `style` | `'pill' \| 'positioned'` |  | `'pill'` | Badge style |
| `position` | `'top-left' \| 'top-right' \| 'ribbon'` |  | `'top-left'` | Position on image |
| `onClick` | `() => void` |  | - | Click handler (makes badge clickable) |
| `animated` | `boolean` |  | `false` | Pulsing animation |
| `decorative` | `boolean` |  | `false` | Hide from screen readers |
| `className` | `string` |  | `''` | Additional CSS classes |

## Badge Variants

### Bestseller (Amber)
```tsx
<ProductBadge variant="bestseller" />
```
- **Icon:** Flame
- **Background:** #FFF8E1 (amber-light)
- **Text:** #F59E0B (amber)
- **Use for:** Top-selling products

### Nieuw (Blue)
```tsx
<ProductBadge variant="nieuw" />
```
- **Icon:** Sparkles
- **Background:** #E3F2FD (blue-light)
- **Text:** #2196F3 (blue)
- **Use for:** New arrivals, recently added

### Uitverkocht (Coral)
```tsx
<ProductBadge variant="uitverkocht" />
```
- **Icon:** Clock
- **Background:** #FFF0F0 (coral-light)
- **Text:** #FF6B6B (coral)
- **Use for:** Out of stock products

### Staffel (Green)
```tsx
<ProductBadge variant="staffel" label="Staffelkorting" />
```
- **Icon:** Layers
- **Background:** #E8F5E9 (green-light)
- **Text:** #00C853 (green)
- **Use for:** Products with volume pricing

### Eco (Dark Green)
```tsx
<ProductBadge variant="eco" label="Duurzaam" />
```
- **Icon:** Leaf
- **Background:** #E8F5E9
- **Text:** #2E7D32
- **Use for:** Eco-friendly, sustainable products

### Aanbieding (Coral)
```tsx
<ProductBadge variant="aanbieding" label="-15%" />
```
- **Icon:** Percent
- **Background:** #FFF0F0
- **Text:** #FF6B6B (coral)
- **Use for:** Sales, discounts, promotions

### Exclusief (Navy Gradient)
```tsx
<ProductBadge variant="exclusief" />
```
- **Icon:** Crown
- **Background:** Gradient (navy → navy-light)
- **Text:** White
- **Use for:** Exclusive, limited edition products

### B2B (Teal)
```tsx
<ProductBadge variant="b2b" label="Alleen B2B" />
```
- **Icon:** Building2
- **Background:** rgba(0, 137, 123, 0.12) (teal-glow)
- **Text:** #00897B (teal)
- **Use for:** B2B-only products

## Styles & Positions

### Pill Style (Default)

Standalone badges for product grids, filters, and tags:

```tsx
<ProductBadge variant="bestseller" style="pill" />
```

**Features:**
- Pill shape (100px border-radius)
- Icon + text with 5px gap
- Inline-flex layout
- No positioning required

### Positioned Style

Absolute-positioned badges on product images:

```tsx
<div style={{ position: 'relative' }}>
  <img src="/product.jpg" alt="Product" />
  <ProductBadge
    variant="bestseller"
    style="positioned"
    position="top-left"
  />
</div>
```

**Positions:**

#### Top-Left
```tsx
<ProductBadge variant="bestseller" style="positioned" position="top-left" />
```
- Coordinates: top: 8px, left: 8px
- Border radius: 6px
- Good for: Primary badge

#### Top-Right
```tsx
<ProductBadge variant="nieuw" style="positioned" position="top-right" />
```
- Coordinates: top: 0, right: 0
- Border radius: 0 14px 0 10px (follows card corner)
- Good for: Secondary badge

#### Ribbon
```tsx
<ProductBadge variant="aanbieding" style="positioned" position="ribbon" />
```
- Coordinates: top: 12px, left: -4px
- Border radius: 0 4px 4px 0
- Shadow: 0 2px 4px rgba(0,0,0,0.1)
- Good for: Prominent promotions

## Real-World Integration

### With ProductCard

```tsx
import { ProductCard } from '@/branches/ecommerce/components/products/ProductCard'
import { ProductBadge } from '@/branches/ecommerce/components/products/ProductBadges'

export function ProductGrid({ products }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          badges={[
            product.isBestseller && { type: 'bestseller' },
            product.isNew && { type: 'nieuw' },
            product.discount > 0 && { type: 'aanbieding', label: `-${product.discount}%` },
          ].filter(Boolean)}
        />
      ))}
    </div>
  )
}
```

### Dynamic Badge Rendering

```tsx
function renderBadges(product: Product) {
  const badges: JSX.Element[] = []

  if (product.isNew) {
    badges.push(<ProductBadge key="new" variant="nieuw" />)
  }

  if (product.isBestseller) {
    badges.push(<ProductBadge key="bestseller" variant="bestseller" animated />)
  }

  if (product.stock === 0) {
    badges.push(<ProductBadge key="out" variant="uitverkocht" />)
  }

  if (product.discount > 0) {
    badges.push(<ProductBadge key="sale" variant="aanbieding" label={`-${product.discount}%`} />)
  }

  if (product.volumePricing) {
    badges.push(<ProductBadge key="volume" variant="staffel" />)
  }

  return badges
}
```

### Prioritized Badge System

Limit badges per product (avoid clutter):

```tsx
const BADGE_PRIORITY = {
  uitverkocht: 1,
  aanbieding: 2,
  bestseller: 3,
  nieuw: 4,
  staffel: 5,
  eco: 6,
  exclusief: 7,
  b2b: 8,
}

function getTopBadges(product: Product, maxBadges = 2) {
  const badges: { variant: BadgeVariant; label?: string; priority: number }[] = []

  if (product.stock === 0) {
    badges.push({ variant: 'uitverkocht', priority: BADGE_PRIORITY.uitverkocht })
  }

  if (product.discount > 0) {
    badges.push({
      variant: 'aanbieding',
      label: `-${product.discount}%`,
      priority: BADGE_PRIORITY.aanbieding,
    })
  }

  if (product.isBestseller) {
    badges.push({ variant: 'bestseller', priority: BADGE_PRIORITY.bestseller })
  }

  if (product.isNew) {
    badges.push({ variant: 'nieuw', priority: BADGE_PRIORITY.nieuw })
  }

  // Sort by priority and limit
  return badges.sort((a, b) => a.priority - b.priority).slice(0, maxBadges)
}
```

### Clickable Filter Badges

```tsx
'use client'

import { useState } from 'react'
import { ProductBadge } from '@/branches/ecommerce/components/products/ProductBadges'

export function ProductFilters() {
  const [filters, setFilters] = useState<Set<BadgeVariant>>(new Set())

  const toggleFilter = (variant: BadgeVariant) => {
    setFilters((prev) => {
      const next = new Set(prev)
      if (next.has(variant)) {
        next.delete(variant)
      } else {
        next.add(variant)
      }
      return next
    })
  }

  return (
    <div className="filter-badges">
      <ProductBadge
        variant="bestseller"
        onClick={() => toggleFilter('bestseller')}
        className={filters.has('bestseller') ? 'active' : ''}
      />
      <ProductBadge
        variant="nieuw"
        onClick={() => toggleFilter('nieuw')}
        className={filters.has('nieuw') ? 'active' : ''}
      />
      <ProductBadge
        variant="eco"
        onClick={() => toggleFilter('eco')}
        className={filters.has('eco') ? 'active' : ''}
      />
    </div>
  )
}
```

### Positioned on Product Image

```tsx
<div className="product-card">
  <div className="product-image-wrapper" style={{ position: 'relative' }}>
    <Image src={product.image} alt={product.name} fill />

    {/* Top-left: Out of stock (highest priority) */}
    {product.stock === 0 && (
      <ProductBadge
        variant="uitverkocht"
        style="positioned"
        position="top-left"
      />
    )}

    {/* Top-right: New product */}
    {product.isNew && (
      <ProductBadge
        variant="nieuw"
        style="positioned"
        position="top-right"
      />
    )}

    {/* Ribbon: Sale discount */}
    {product.discount > 0 && (
      <ProductBadge
        variant="aanbieding"
        label={`-${product.discount}%`}
        style="positioned"
        position="ribbon"
      />
    )}
  </div>
  {/* Rest of product card */}
</div>
```

## Size Variants

### Small (sm)
```tsx
<ProductBadge variant="bestseller" size="sm" />
```
- **Padding:** 3px 8px
- **Font size:** 10px
- **Icon size:** 11px
- **Use for:** Compact spaces, mobile views

### Medium (md) - Default
```tsx
<ProductBadge variant="bestseller" />
```
- **Padding:** 5px 12px
- **Font size:** 12px
- **Icon size:** 13px
- **Use for:** Standard product cards

### Large (lg)
```tsx
<ProductBadge variant="bestseller" size="lg" />
```
- **Padding:** 6px 14px
- **Font size:** 13px
- **Icon size:** 15px
- **Use for:** Featured products, hero sections

## Advanced Features

### Animated Badges (Pulsing Effect)

```tsx
<ProductBadge variant="bestseller" animated />
```

Adds subtle pulsing animation (2s cycle, scale 1.0 → 1.05 → 1.0):
- Use for: Highlighting special promotions
- Avoid: Too many animated badges (creates distraction)

### Without Icons

```tsx
<ProductBadge variant="bestseller" showIcon={false} label="Top 10" />
```

### Decorative Badges

Hidden from screen readers (already in product title):

```tsx
<ProductBadge variant="bestseller" decorative />
```

## Theme Variables Used

### Colors (Pill Style)
- Bestseller: `--amber-light` (background), `--amber` (text)
- Nieuw: `--blue-light` (background), `--blue` (text)
- Uitverkocht: `--coral-light` (background), `--coral` (text)
- Staffel: `--green-light` (background), `--green` (text)
- Eco: #E8F5E9 (background), #2E7D32 (text)
- Aanbieding: #FFF0F0 (background), `--coral` (text)
- Exclusief: `--navy` gradient (background), white (text)
- B2B: `--teal-glow` (background), `--teal` (text)

### Typography
- `--font-primary` (DM Sans) - Badge text
- Font weight: 700 (bold)

### Spacing & Animation
- `--transition` (0.2s cubic-bezier) - Hover transitions
- Border radius: 100px (pill), 6px (positioned top-left)

## Accessibility

### ARIA Attributes
```tsx
<ProductBadge
  variant="bestseller"
  // Automatically adds:
  // role="status"
  // aria-label="Bestseller product"
/>

<ProductBadge
  variant="bestseller"
  decorative // aria-hidden="true"
/>
```

### Screen Reader Support
- Pill badges: Announced as "Bestseller product" (status)
- Icons: `aria-hidden="true"` (text provides context)
- Positioned badges: Can be decorative (set `decorative={true}`)

### Keyboard Support
- Clickable badges: Focusable with 3px teal outline
- Space/Enter: Activate button

## Best Practices

### Badge Limit

Limit to 2-3 badges per product to avoid visual clutter:

```tsx
const maxBadges = 2
const topBadges = getTopBadges(product, maxBadges)
```

### Priority Order

Recommended priority (highest to lowest):
1. **Uitverkocht** (out of stock) - Most critical
2. **Aanbieding** (sale) - High urgency
3. **Bestseller** - Social proof
4. **Nieuw** (new) - Recency
5. **Staffel** (volume discount) - Feature
6. **Eco** (sustainable) - Feature
7. **Exclusief** (exclusive) - Feature
8. **B2B** (business only) - Restriction

### Positioning Strategy

- **Single badge:** Top-left (primary)
- **Two badges:** Top-left (primary) + Top-right (secondary)
- **Three badges:** Top-left + Top-right + Ribbon (rare, avoid if possible)

### Animation Use

- ✅ Bestseller badge on homepage
- ✅ Limited-time offers
- ❌ All badges (too distracting)
- ❌ More than 1 animated badge per page

## Integration with Other Components

- **ProductCard (ec01):** Displays badges on product cards
- **FilterSidebar (c21):** Clickable badges as filter chips
- **StaffelCalculator (c4):** "Staffel" badge indicates volume pricing available
- **StickyBar (c6):** Show badges in sticky product bar

## Component Location

```
src/branches/ecommerce/components/products/ProductBadges/
├── Component.tsx    # Main component
├── types.ts         # TypeScript interfaces
├── index.ts         # Exports
└── README.md        # This file
```

---

**Category:** E-commerce / Products
**Priority:** HIGH (visual indicators improve UX)
**Last Updated:** February 25, 2026
