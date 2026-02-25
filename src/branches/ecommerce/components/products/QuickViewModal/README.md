# QuickViewModal Component

**Component ID:** C5
**Category:** E-commerce / Product Preview
**Complexity:** High

---

## Overview

The **QuickViewModal** component is a full-screen modal overlay that provides a quick product preview from shop or archive pages. It allows users to view core product information, select variants, adjust quantity, and add items to cart without leaving the current page, significantly reducing friction in the purchasing flow.

### Key Features

- **Full-screen overlay** with backdrop blur and dark overlay
- **2-column responsive layout** (image + details)
- **Product image display** with optional badge overlay
- **Complete product information** (brand, name, SKU, stock status, price)
- **Volume pricing hints** (staffel korting)
- **Variant selection** (sizes, colors, etc.) with visual feedback
- **Quantity stepper** with increase/decrease controls
- **Add-to-cart functionality** with disabled states
- **"View full product" link** for detailed pages
- **Accessibility features**:
  - ESC key to close
  - Focus trap (focus on close button on open)
  - Screen reader announcements
  - ARIA labels and roles
  - Backdrop click to close
- **Body scroll prevention** when modal is open
- **Scale-up animation** (0.95 → 1.0) for smooth entry
- **Responsive design** (stacks vertically on mobile)

---

## Usage

### Basic Example

```tsx
'use client'

import { useState } from 'react'
import { QuickViewModal } from '@/branches/ecommerce/components/products'
import type { QuickViewProduct } from '@/branches/ecommerce/components/products'

export default function ProductGrid() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<QuickViewProduct | null>(null)

  const product: QuickViewProduct = {
    id: '123',
    name: 'Peha-soft Nitrile Fino',
    brand: 'Hartmann',
    sku: '942210',
    image: '/images/products/peha-soft.jpg',
    imageAlt: 'Peha-soft Nitrile Fino handschoenen',
    badge: 'Staffelkorting',
    badgeColor: 'amber',
    stock: {
      status: 'in_stock',
      quantity: 512,
    },
    price: 8.25,
    unit: 'per doos',
    staffelHint: 'Vanaf 5 dozen: €7,50 · Vanaf 10: €6,95',
    variants: [
      { id: 'xs', name: 'XS', available: true },
      { id: 's', name: 'S', available: true },
      { id: 'm', name: 'M', available: true, default: true },
      { id: 'l', name: 'L', available: true },
      { id: 'xl', name: 'XL', available: false },
    ],
    slug: 'peha-soft-nitrile-fino',
  }

  const handleAddToCart = (productId: string, variantId: string | null, quantity: number) => {
    console.log('Add to cart:', { productId, variantId, quantity })
    // Add your cart logic here
    // Optionally show toast notification
  }

  const handleViewFull = (productId: string) => {
    window.location.href = `/products/${product.slug}`
  }

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Quick View</button>

      <QuickViewModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
        onViewFull={handleViewFull}
      />
    </>
  )
}
```

### With ProductCard Integration

```tsx
'use client'

import { useState } from 'react'
import { ProductCard, QuickViewModal } from '@/branches/ecommerce/components/products'
import type { QuickViewProduct } from '@/branches/ecommerce/components/products'

export default function ProductArchive({ products }: { products: QuickViewProduct[] }) {
  const [quickViewProduct, setQuickViewProduct] = useState<QuickViewProduct | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard {...product} />
            <button
              onClick={() => setQuickViewProduct(product)}
              className="mt-2 text-sm text-theme-teal hover:underline"
            >
              Snelle weergave
            </button>
          </div>
        ))}
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={(productId, variantId, quantity) => {
            // Add to cart logic
            console.log('Added:', { productId, variantId, quantity })
            setQuickViewProduct(null) // Close modal
          }}
        />
      )}
    </>
  )
}
```

### Different Stock Statuses

```tsx
// In stock with quantity
const inStockProduct = {
  // ... other fields
  stock: { status: 'in_stock', quantity: 512 },
}

// Low stock
const lowStockProduct = {
  // ... other fields
  stock: { status: 'low_stock', quantity: 3 },
}

// Out of stock (add to cart button disabled)
const outOfStockProduct = {
  // ... other fields
  stock: { status: 'out_of_stock' },
}

// Pre-order
const preOrderProduct = {
  // ... other fields
  stock: { status: 'pre_order', message: 'Verwacht op 15 maart' },
}

// Custom stock message
const customStockProduct = {
  // ... other fields
  stock: { status: 'in_stock', message: 'Beschikbaar in ons magazijn in Utrecht' },
}
```

### Without Variants

```tsx
const simpleProduct: QuickViewProduct = {
  id: '456',
  name: 'Disposable Face Masks',
  image: '/images/masks.jpg',
  price: 12.5,
  stock: { status: 'in_stock' },
  // No variants field - variant selector will not be shown
}
```

### Custom Badge Colors

```tsx
const products = [
  {
    // ... other fields
    badge: 'Nieuw',
    badgeColor: 'teal', // Teal badge
  },
  {
    // ... other fields
    badge: 'Sale',
    badgeColor: 'coral', // Coral/red badge
  },
  {
    // ... other fields
    badge: 'Bestseller',
    badgeColor: 'green', // Green badge
  },
  {
    // ... other fields
    badge: 'Staffelkorting',
    badgeColor: 'amber', // Amber/orange badge (default)
  },
]
```

---

## API Reference

### QuickViewModalProps

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `product` | `QuickViewProduct` | Yes | - | Product data to display |
| `isOpen` | `boolean` | Yes | - | Whether modal is visible |
| `onClose` | `() => void` | Yes | - | Callback when modal closes |
| `onAddToCart` | `(productId: string, variantId: string \| null, quantity: number) => void` | No | - | Add to cart callback |
| `onViewFull` | `(productId: string) => void` | No | - | View full product callback |
| `addToCartText` | `string` | No | `"In winkelwagen"` | Add to cart button text |
| `viewFullText` | `string` | No | `"Bekijk volledige productpagina"` | View full link text |
| `showViewFullLink` | `boolean` | No | `true` | Show/hide view full link |
| `className` | `string` | No | `''` | Additional CSS classes |

### QuickViewProduct

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | Yes | Unique product ID |
| `name` | `string` | Yes | Product name |
| `image` | `string` | Yes | Product image URL |
| `price` | `number` | Yes | Product price (number) |
| `stock` | `ProductStock` | Yes | Stock status object |
| `brand` | `string` | No | Brand name |
| `sku` | `string` | No | SKU/article number |
| `imageAlt` | `string` | No | Image alt text (defaults to product name) |
| `badge` | `string` | No | Badge text (e.g., "Staffelkorting") |
| `badgeColor` | `'amber' \| 'teal' \| 'green' \| 'coral'` | No | Badge color variant |
| `unit` | `string` | No | Price unit (e.g., "per doos") |
| `staffelHint` | `string` | No | Volume pricing hint |
| `variants` | `ProductVariant[]` | No | Product variants (sizes, colors) |
| `slug` | `string` | No | Product URL slug |

### ProductStock

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `status` | `'in_stock' \| 'low_stock' \| 'out_of_stock' \| 'pre_order'` | Yes | Stock status |
| `quantity` | `number` | No | Available quantity |
| `message` | `string` | No | Custom stock message (overrides default) |

### ProductVariant

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | Yes | Variant ID |
| `name` | `string` | Yes | Variant name (e.g., "XS", "Blue") |
| `available` | `boolean` | Yes | Whether variant is available |
| `default` | `boolean` | No | Whether this is the default variant |

---

## Styling & Customization

### Theme Variables Used

This component uses **100% theme variables** (no hardcoded colors):

```css
/* Colors */
--theme-navy           /* Modal text, titles */
--theme-teal           /* Brand text, active states, links */
--theme-teal-glow      /* Active variant background */
--theme-grey           /* Borders */
--theme-grey-light     /* Image background, close button */
--theme-grey-mid       /* SKU, unit text */
--theme-green          /* In stock indicator */
--theme-amber          /* Low stock, default badge */
--theme-coral          /* Out of stock */

/* Backdrop */
rgba(10, 22, 40, 0.5)  /* Dark navy overlay */
backdrop-blur(4px)     /* Backdrop blur */

/* Shadows */
0 16px 48px rgba(10, 22, 40, 0.12)  /* Modal shadow */
0 4px 16px rgba(0, 137, 123, 0.3)   /* Add button shadow */
```

### Custom Styling

```tsx
<QuickViewModal
  product={product}
  isOpen={isOpen}
  onClose={onClose}
  className="custom-modal-class"
/>
```

### Responsive Breakpoints

- **Desktop (≥768px):** 2-column grid (image left, details right)
- **Mobile (<768px):** Single column (image top, details bottom)
- **Modal width:** 820px max (92vw on small screens)
- **Modal height:** 90vh max (95vh on mobile)

---

## Accessibility

### WCAG 2.1 AA Compliance

✅ **Keyboard Navigation:**
- ESC key closes modal
- TAB navigation through interactive elements
- Auto-focus close button on open
- Proper focus trap (stays within modal)

✅ **Screen Readers:**
- `role="dialog"` and `aria-modal="true"` on overlay
- `aria-labelledby` points to product title
- `aria-label` on close button ("Sluit quick view")
- `aria-label` on variant buttons
- `aria-label` on quantity controls
- `aria-pressed` on selected variant
- Live region announcement: "Product quick view geopend"

✅ **Visual:**
- High contrast text (navy on white)
- Clear stock status indicators with color + text
- Disabled state for out-of-stock products
- Large touch targets (44px min height)

### Testing Checklist

```bash
# Keyboard
□ Press ESC to close modal
□ TAB through all interactive elements
□ Verify focus returns to trigger button on close
□ Ensure focus doesn't escape modal when open

# Screen Reader (VoiceOver/NVDA)
□ Announce "Product quick view geopend" on open
□ Read product title correctly
□ Announce variant selection changes
□ Read stock status accurately
□ Announce quantity changes

# Visual
□ Verify stock indicator is visible (dot + text)
□ Check disabled state for out-of-stock
□ Verify badge contrast (white text on colored bg)
```

---

## Performance & Best Practices

### 1. Conditional Rendering

The modal only renders when `isOpen={true}`, reducing DOM overhead:

```tsx
if (!isOpen) return null
```

### 2. Body Scroll Lock

Automatically prevents background scrolling:

```tsx
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
  return () => { document.body.style.overflow = '' }
}, [isOpen])
```

### 3. Focus Management

Auto-focuses close button for immediate keyboard accessibility:

```tsx
setTimeout(() => {
  closeButtonRef.current?.focus()
}, 100)
```

### 4. Default Variant Selection

Automatically selects the default variant or first available:

```tsx
useEffect(() => {
  if (product.variants) {
    const defaultVariant = product.variants.find(v => v.default && v.available) ||
                          product.variants.find(v => v.available)
    setSelectedVariant(defaultVariant || null)
  }
}, [product])
```

### 5. State Reset on Close

Quantity resets to 1 when modal closes:

```tsx
useEffect(() => {
  if (!isOpen) {
    setQuantity(1)
  }
}, [isOpen])
```

---

## Integration Examples

### With Toast Notifications

```tsx
import { QuickViewModal } from '@/branches/ecommerce/components/products'
import { toast } from 'react-hot-toast' // Or your toast library

const handleAddToCart = (productId: string, variantId: string | null, quantity: number) => {
  // Add to cart logic
  addToCart({ productId, variantId, quantity })

  // Show success toast
  toast.success(`${quantity}× ${product.name} toegevoegd aan winkelwagen!`)
}
```

### With MiniCart Drawer

```tsx
const [showMiniCart, setShowMiniCart] = useState(false)

const handleAddToCart = (productId: string, variantId: string | null, quantity: number) => {
  addToCart({ productId, variantId, quantity })

  // Close quick view
  setIsModalOpen(false)

  // Open minicart
  setTimeout(() => {
    setShowMiniCart(true)
  }, 300) // Wait for quick view to close
}
```

### With Payload CMS

```tsx
import { QuickViewModal } from '@/branches/ecommerce/components/products'
import type { QuickViewProduct } from '@/branches/ecommerce/components/products'
import type { Product } from '@/payload-types'

// Transform Payload product to QuickViewProduct
function transformProduct(payloadProduct: Product): QuickViewProduct {
  return {
    id: payloadProduct.id,
    name: payloadProduct.title,
    brand: payloadProduct.brand?.name,
    sku: payloadProduct.sku,
    image: typeof payloadProduct.images?.[0] === 'object'
      ? payloadProduct.images[0].url
      : '',
    price: payloadProduct.price,
    unit: payloadProduct.priceUnit,
    stock: {
      status: payloadProduct.stock > 0 ? 'in_stock' : 'out_of_stock',
      quantity: payloadProduct.stock,
    },
    variants: payloadProduct.variants?.map(v => ({
      id: v.id,
      name: v.name,
      available: v.stock > 0,
      default: v.isDefault,
    })),
    slug: payloadProduct.slug,
  }
}
```

---

## Related Components

- **ProductCard (EC01)** - Trigger QuickView from product cards
- **MiniCart (C2)** - Open after adding product to cart
- **AddToCartToast (C3)** - Show success notification
- **ProductBadge** - Badge displayed on product image
- **StockIndicator** - Stock status display

---

## Common Issues & Solutions

### Issue: Modal not closing on backdrop click

**Solution:** Ensure backdrop has `onClick={onClose}`:

```tsx
<div className="qv-backdrop" onClick={onClose} />
```

### Issue: Body still scrollable when modal open

**Solution:** Component handles this automatically via `useEffect`. If still occurring, check for CSS conflicts:

```css
/* Global CSS */
body.modal-open {
  overflow: hidden !important;
}
```

### Issue: Focus escapes modal

**Solution:** Add focus trap library like `react-focus-lock`:

```tsx
import FocusLock from 'react-focus-lock'

<FocusLock>
  <div className="qv-modal">
    {/* ... */}
  </div>
</FocusLock>
```

### Issue: Animation not smooth

**Solution:** Ensure proper CSS transitions:

```css
.qv-overlay {
  transition: opacity 0.25s, visibility 0.25s;
}

.qv-modal {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Changelog

### Version 1.0.0 (Initial Release)
- Full-screen modal overlay with backdrop blur
- 2-column responsive layout (image + details)
- Product info display (brand, name, SKU, stock, price)
- Volume pricing hints (staffel korting)
- Variant selection with visual feedback
- Quantity stepper
- Add-to-cart functionality
- "View full product" link
- Complete accessibility (ESC, focus trap, ARIA, screen reader announcements)
- Body scroll lock
- Scale-up animation
- Mobile-responsive design
- TypeScript type safety

---

## License

Part of the Payload CMS E-commerce Component Library.
See project LICENSE for details.
