# ProductCard (ec01)

Product card component with two layout variants (Grid and List). Displays product information including image, brand, title, SKU, pricing (regular + sale + volume discounts), star rating, stock status, and add-to-cart button.

## Features

- ✅ **Two variants:** Grid (vertical) and List (horizontal) layouts
- ✅ **Product badges:** 4 types (Sale/Nieuw/Pro/Popular) with color coding
- ✅ **Pricing display:** Current price + old price (sale) + unit text + volume discount hints
- ✅ **Star rating:** 5-star visual rating + review count
- ✅ **Stock indicators:** 3 states (in-stock/low/out) with colored dots
- ✅ **Hover effect:** Elevation animation (translateY + shadow + border color)
- ✅ **Add-to-cart CTA:** Circular button with teal background
- ✅ **Theme variables only:** NO hardcoded colors!
- ✅ **Mobile responsive:** List variant becomes vertical on mobile
- ✅ **Fully accessible:** WCAG 2.1 AA compliant

## Usage

```tsx
import { ProductCard } from '@/branches/ecommerce/components/products/ProductCard'

<ProductCard
  id="prod-123"
  name="Supreme Plus Nitrile Handschoenen"
  slug="supreme-plus-nitrile"
  sku="SMP-8942"
  brand={{ name: 'SEMPERMED', slug: 'sempermed' }}
  image={{ url: '/images/product.jpg', alt: 'Product image' }}
  price={12.95}
  compareAtPrice={15.99}
  unit="per 100 stuks"
  volumePricing={[
    { minQty: 500, price: 10.95, discountPercent: 15 }
  ]}
  rating={4.2}
  reviewCount={42}
  stock={2400}
  stockStatus="in-stock"
  badges={[{ type: 'sale' }]}
  variant="grid"
  onAddToCart={(id) => console.log('Added:', id)}
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `id` | `string` | ✓ | - | Product ID |
| `name` | `string` | ✓ | - | Product name/title |
| `slug` | `string` | ✓ | - | Product slug for URL |
| `sku` | `string` | ✓ | - | SKU code |
| `brand` | `Brand` | ✓ | - | Brand information (name + slug) |
| `image` | `ProductImage` |  | - | Product image (url + alt) |
| `price` | `number` | ✓ | - | Current price |
| `compareAtPrice` | `number` |  | - | Original price before sale |
| `unit` | `string` |  | - | Unit text (e.g., "per 100 stuks") |
| `volumePricing` | `VolumePricingTier[]` |  | - | Volume pricing tiers |
| `rating` | `number` |  | - | Average rating (0-5) |
| `reviewCount` | `number` |  | `0` | Number of reviews |
| `stock` | `number` | ✓ | - | Available stock quantity |
| `stockStatus` | `StockStatus` | ✓ | - | Stock status (in-stock/low/out) |
| `stockText` | `string` |  | - | Custom stock message |
| `badges` | `ProductBadge[]` |  | - | Product badges (Sale/Nieuw/Pro/Popular) |
| `variant` | `'grid' \| 'list'` |  | `'grid'` | Layout variant |
| `onAddToCart` | `(productId: string) => void` |  | - | Add-to-cart callback |
| `href` | `string` |  | `/products/[slug]` | Product detail page URL |
| `currencySymbol` | `string` |  | `'€'` | Currency symbol |
| `locale` | `string` |  | `'nl-NL'` | Locale for number formatting |
| `className` | `string` |  | `''` | Additional CSS class names |

## Types

```tsx
interface VolumePricingTier {
  minQty: number            // Minimum quantity for this tier
  price: number             // Price at this tier
  discountPercent: number   // Discount percentage
}

type BadgeType = 'sale' | 'new' | 'pro' | 'popular'

interface ProductBadge {
  type: BadgeType           // Badge type (determines color)
  label?: string            // Custom label (defaults to type)
}

type StockStatus = 'in-stock' | 'low' | 'out'

interface Brand {
  name: string              // Brand name
  slug: string              // Brand slug for URL
}

interface ProductImage {
  url: string               // Image URL
  alt: string               // Alt text for accessibility
}
```

## Variants

### Grid Variant (Default)

Vertical card layout for 3-column product grids:

```tsx
<ProductCard
  {...productData}
  variant="grid"
/>
```

**Layout:**
- **Image:** 200px fixed height, 100% width
- **Body:** 18px padding, flex-grow to fill space
- **Footer:** Pushed to bottom with `margin-top: auto`
- **Stock:** Below footer with top border

**Use cases:**
- Shop archive pages
- Category pages
- Search results
- Product grids

### List Variant

Horizontal card layout for list view:

```tsx
<ProductCard
  {...productData}
  variant="list"
/>
```

**Layout:**
- **Image:** 180px fixed width, auto height
- **Body:** Horizontal row with 24px gap
- **Info section:** Takes available space
- **Footer:** Column layout, aligned right, min-width 180px
- **Stock:** Next to add-to-cart button (no border)

**Use cases:**
- List view toggle
- Product comparison
- Admin panels
- Detailed product listings

**Mobile behavior:** List variant automatically becomes vertical on mobile (<768px)

## Badge Types

### Sale Badge
```tsx
badges={[{ type: 'sale' }]}
// or custom label
badges={[{ type: 'sale', label: '-20%' }]}
```
- Background: `var(--coral)` (#FF6B6B)
- Use for: Products on sale

### New Badge
```tsx
badges={[{ type: 'new' }]}
```
- Background: `var(--teal)` (#00897B)
- Use for: New products

### Pro Badge
```tsx
badges={[{ type: 'pro' }]}
```
- Background: `var(--amber)` (#F59E0B)
- Use for: Professional-grade products

### Popular Badge
```tsx
badges={[{ type: 'popular' }]}
```
- Background: `var(--green)` (#00C853)
- Use for: Best-sellers, popular items

**Note:** If multiple badges are provided, only the first badge is displayed.

## Stock Status

### In Stock (Green)
```tsx
stock={2400}
stockStatus="in-stock"
```
- Dot color: `var(--green)` (#00C853)
- Default text: "Op voorraad (X stuks)"

### Low Stock (Amber)
```tsx
stock={48}
stockStatus="low"
```
- Dot color: `var(--amber)` (#F59E0B)
- Default text: "Laag op voorraad (X stuks)"

### Out of Stock (Coral)
```tsx
stock={0}
stockStatus="out"
```
- Dot color: `var(--coral)` (#FF6B6B)
- Default text: "Tijdelijk uitverkocht"
- Add-to-cart button: disabled

**Custom stock text:**
```tsx
stockText="Verwacht over 2 weken"
```

## Volume Pricing (Staffel)

Volume pricing tiers show bulk discount hints:

```tsx
volumePricing={[
  { minQty: 500, price: 10.95, discountPercent: 15 },
  { minQty: 1000, price: 9.95, discountPercent: 25 },
]}
```

**Display:** Shows lowest tier (first in array) as hint:
```
Vanaf 500 stuks: € 10,95 (−15%)
```

**Icon:** `TrendingDown` (12px, teal)

## Real-World Integration

### With Product Grid

```tsx
'use client'

import { ProductCard } from '@/branches/ecommerce/components/products/ProductCard'
import { useCart } from '@/providers/CartProvider'

export function ProductGrid({ products }) {
  const { addItem } = useCart()

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          variant="grid"
          onAddToCart={addItem}
        />
      ))}
    </div>
  )
}

// Styles
<style jsx>{`
  .product-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media (max-width: 1023px) {
    .product-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 767px) {
    .product-grid {
      grid-template-columns: 1fr;
    }
  }
`}</style>
```

### With Grid/List Toggle

```tsx
'use client'

import { useState } from 'react'
import { ProductCard } from '@/branches/ecommerce/components/products/ProductCard'
import { Grid, List } from 'lucide-react'

export function ProductArchive({ products }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <>
      <div className="view-toggle">
        <button onClick={() => setViewMode('grid')}>
          <Grid size={20} />
        </button>
        <button onClick={() => setViewMode('list')}>
          <List size={20} />
        </button>
      </div>

      <div className={viewMode === 'grid' ? 'product-grid' : 'product-list'}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            variant={viewMode}
          />
        ))}
      </div>
    </>
  )
}
```

### With Toast Notification

```tsx
import { ProductCard } from '@/branches/ecommerce/components/products/ProductCard'
import { useAddToCartToast } from '@/branches/ecommerce/components/ui/AddToCartToast'

export function ProductDisplay({ product }) {
  const { showToast } = useAddToCartToast()

  const handleAddToCart = (productId: string) => {
    // Add to cart logic
    addToCart(productId)

    // Show toast
    showToast({
      id: product.id,
      name: product.name,
      image: product.image?.url,
      price: product.price,
      quantity: 1,
    })
  }

  return (
    <ProductCard
      {...product}
      onAddToCart={handleAddToCart}
    />
  )
}
```

## Theme Variables Used

### Colors
- `--white` (#FAFBFC) - Card background
- `--grey` (#E8ECF1) - Card border, separator
- `--navy` (#0A1628) - Product title, price
- `--teal` (#00897B) - Brand, New badge, staffel hint
- `--teal-dark` (#00695C) - Add-to-cart button hover
- `--teal-glow` (rgba(0, 137, 123, 0.12)) - Focus state
- `--grey-mid` (#94A3B8) - SKU, unit, review count, old price
- `--coral` (#FF6B6B) - Sale badge, out of stock
- `--amber` (#F59E0B) - Pro badge, low stock, star rating
- `--green` (#00C853) - Popular badge, in stock
- `--bg` (#F5F7FA) - Image placeholder

### Typography
- `--font-heading` (Plus Jakarta Sans) - Price
- `--font-primary` (DM Sans) - Brand, title, unit, stock
- `--font-mono` (JetBrains Mono) - SKU

### Spacing & Animation
- `--transition` (0.35s cubic-bezier) - Hover transitions
- Border radius: 16px (card), 6px (badge), 10px (button)
- Shadow (hover): 0 12px 40px rgba(10, 22, 40, 0.08)

## Mobile Responsive (< 768px)

- **Grid variant:** Remains vertical (no changes)
- **List variant:** Switches to vertical layout
  - Image: 100% width, 200px height (same as grid)
  - Body: Column layout, 18px padding
  - Footer: Row layout (price left, button right)
  - Stock: Returns to border-top separator

## Accessibility

### ARIA Attributes
- Card wrapper: `aria-label` with product summary
- Badge: `aria-label` with badge type
- Rating: `role="img"`, `aria-label` with star count
- Stock: `role="status"`, `aria-live="polite"`
- Add-to-cart: `aria-label` with product name

### Keyboard Support
- **Tab:** Focus entire card (navigates to product page)
- **Shift+Tab:** Focus add-to-cart button (separate action)
- **Enter/Space:** Activate focused element
- **Focus indicators:** 3px teal outline

### Screen Reader Support
- Badge announces: "Sale product", "New product", etc.
- Rating announces: "4 van 5 sterren, 42 reviews"
- Stock status announced on change (aria-live)
- Add-to-cart button clearly labeled

### Color Contrast
- Title (navy on white): 14.8:1 (WCAG AAA ✓)
- Brand (teal on white): 4.5:1 (WCAG AA ✓)
- Stock indicators use both color + text (not color alone)

## Best Practices

### Image Optimization
- Use Next.js `Image` component with `fill` + `objectFit: 'contain'`
- Provide proper alt text for accessibility
- Consider placeholder image while loading

### Stock Status Calculation
Auto-calculate `stockStatus` in Payload beforeChange hook:
```ts
// In Products collection
hooks: {
  beforeChange: [
    ({ data }) => {
      if (typeof data.stock === 'number') {
        if (data.stock === 0) {
          data.stockStatus = 'out'
        } else if (data.stock < 100) {
          data.stockStatus = 'low'
        } else {
          data.stockStatus = 'in-stock'
        }
      }
      return data
    }
  ]
}
```

### Add-to-Cart Handling
- Use `e.preventDefault()` to prevent card navigation
- Use `e.stopPropagation()` to prevent event bubbling
- Disable button when `stockStatus === 'out'`
- Show toast notification after successful add

### Volume Pricing
- Sort tiers by `minQty` ascending (show lowest tier first)
- Calculate discount percentage from regular price
- Show hint only when volume pricing exists

## Integration with Other Components

- **ProductBadges (c18):** Standalone badge component (can replace inline badges)
- **StockIndicator (ec04):** Standalone stock status component
- **StaffelCalculator (c4):** Full volume pricing calculator (product detail page)
- **AddToCartToast (c3):** Toast notification triggered by add-to-cart
- **MiniCartFlyout (c2):** Slide-out cart panel
- **RecentlyViewed (c13):** Uses ProductCard in horizontal carousel

## Component Location

```
src/branches/ecommerce/components/products/ProductCard/
├── Component.tsx    # Main component
├── types.ts         # TypeScript interfaces
├── index.ts         # Exports
└── README.md        # This file
```

---

**Category:** E-commerce / Products
**Priority:** CRITICAL (foundation for shop)
**Last Updated:** February 25, 2026
