# RecentlyViewed (c13)

Horizontal scrolling carousel showing recently viewed products with timestamps, favorites, and quick add-to-cart. Tracks user browsing history for personalized recommendations.

## Features

- ✅ **Horizontal scroll container:** Overflow-x auto, scroll-snap-type (smooth scrolling)
- ✅ **Navigation buttons:** Left/right chevrons (hidden on mobile ≤640px)
- ✅ **Product cards:** 180px width, image (120px height), brand, name (2-line clamp)
- ✅ **Relative timestamps:** "10 min", "1 uur", "Gisteren" (Clock icon badge)
- ✅ **Favorite button:** Hover reveal (opacity 0 → 1), Heart icon
- ✅ **Quick add-to-cart:** ShoppingCart button, teal bg → navy hover
- ✅ **Clear history link:** Trash2 icon, confirmation dialog
- ✅ **Image optimization:** Next.js Image component
- ✅ **Price formatting:** € XX,XX (Dutch locale)
- ✅ **Responsive:** Scroll navigation hidden on mobile
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

```tsx
import { RecentlyViewed } from '@/branches/ecommerce/components/account/RecentlyViewed'

<RecentlyViewed
  products={[
    {
      id: 'prod-1',
      name: 'Peha-soft Nitrile Fino — M',
      brand: 'Hartmann',
      price: 825, // In cents (€8,25)
      imageUrl: '/images/products/peha-soft.jpg',
      viewedAt: '2026-02-25T14:20:00Z',
      slug: 'peha-soft-nitrile-fino-m',
    },
  ]}
  onAddToCart={async (productId) => {
    await fetch('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity: 1 }),
    })
    toast.success('Product toegevoegd aan winkelwagen!')
  }}
  onAddToFavorites={(productId) => {
    mutate('/api/favorites', { productId })
    toast.success('Toegevoegd aan favorieten!')
  }}
  onClearHistory={async () => {
    await fetch('/api/recently-viewed/clear', { method: 'DELETE' })
  }}
/>
```

## Props

| Prop                | Type                                  | Required | Default | Description                          |
| ------------------- | ------------------------------------- | -------- | ------- | ------------------------------------ |
| `products`          | `RecentlyViewedProduct[]`             | ✅       | -       | Array of recently viewed products    |
| `onProductClick`    | `(product) => void`                   |          | -       | Handler for product card click       |
| `onAddToCart`       | `(productId) => void \| Promise<void>`|          | -       | Handler for add-to-cart button       |
| `onAddToFavorites`  | `(productId) => void \| Promise<void>`|          | -       | Handler for favorite button          |
| `onClearHistory`    | `() => void \| Promise<void>`         |          | -       | Handler for clear history link       |
| `maxProducts`       | `number`                              |          | `20`    | Max products to display              |
| `className`         | `string`                              |          | `''`    | Additional CSS classes               |

### RecentlyViewedProduct Type

```typescript
interface RecentlyViewedProduct {
  id: string
  name: string
  brand?: string
  price: number // In cents
  imageUrl?: string
  imagePlaceholder?: string // Emoji fallback
  viewedAt: string // ISO 8601 timestamp
  slug: string
}
```

## Theme Variables

| Element | Color/Spacing | Usage |
|---------|---------------|-------|
| Card border | `var(--grey)` | Default |
| Card hover | `translateY(-2px)` + shadow | Hover effect |
| Image bg | `var(--grey-light)` | Empty state |
| Brand text | `var(--teal)` | Brand label color |
| Cart button | `var(--teal)` → `var(--navy)` | Background |
| Favorite hover | `var(--coral)` | Icon color |
| Clear link | `var(--grey-mid)` → `var(--coral)` | Text color |

## Component Location

```
src/branches/ecommerce/components/account/RecentlyViewed/
├── Component.tsx
├── types.ts
├── index.ts
└── README.md
```

---

**Category:** E-commerce / Account / Personalization
**Complexity:** Medium (horizontal scroll, timestamps)
**Priority:** 🟡 MEDIUM (UX improvement, not essential)
**Last Updated:** February 25, 2026
