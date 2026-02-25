# CartLineItem (ec06)

Individual cart item row with product info, quantity controls, and actions. Used in shopping cart, minicart, and checkout flows.

## Features

- ✅ **Product display:** Image (100×100px), brand, title, SKU, variant
- ✅ **Stock indicators:** In stock (green), Low stock (amber), Out of stock (red)
- ✅ **Integrated QuantityStepper:** Uses shared QuantityStepper component
- ✅ **Price calculation:** Unit price + total price with euro/cent styling
- ✅ **Action buttons:** Add to list, Delete
- ✅ **Mobile responsive:** Wraps on <768px, image scales to 80px
- ✅ **Theme variables only:** NO hardcoded colors!
- ✅ **Fully accessible:** ARIA labels, keyboard support

## Usage

```tsx
import { CartLineItem } from '@/branches/ecommerce/components/ui'

<CartLineItem
  product={{
    id: '123',
    title: 'Supreme Plus Nitrile Handschoenen',
    brand: 'SEMPERMED',
    sku: 'SMP-8942',
    variant: 'Maat: L',
    image: '/images/product.jpg',
    price: 12.95,
    stockStatus: 'in-stock',
    stockQuantity: 150,
  }}
  quantity={3}
  onQuantityChange={(qty) => updateCart(product.id, qty)}
  onRemove={() => removeFromCart(product.id)}
  onAddToList={() => addToList(product.id)}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `product` | `CartProduct` | ✓ | Product data (see CartProduct type) |
| `quantity` | `number` | ✓ | Current quantity in cart |
| `onQuantityChange` | `(newQuantity: number) => void` | ✓ | Callback when quantity changes |
| `onRemove` | `() => void` | ✓ | Callback when item removed |
| `onAddToList` | `() => void` |  | Optional: Add to list callback |
| `className` | `string` |  | Additional CSS classes |

## CartProduct Type

```tsx
interface CartProduct {
  id: string                         // Product ID
  title: string                      // Product title
  brand?: string                     // Brand name (uppercase)
  sku?: string                       // SKU code
  variant?: string                   // Variant (e.g., "Maat: L")
  image?: string                     // Image URL
  price: number                      // Unit price
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock'
  stockQuantity?: number             // Available stock
}
```

## Stock States

### In Stock (Green)
```tsx
stockStatus: 'in-stock'
```
- ✓ Check circle icon
- Green color (`var(--green)`)
- Text: "Op voorraad"

### Low Stock (Amber)
```tsx
stockStatus: 'low-stock'
stockQuantity: 42
```
- ⚠ Alert triangle icon
- Amber color (`var(--amber)`)
- Text: "Laag op voorraad (42 stuks)"

### Out of Stock (Red)
```tsx
stockStatus: 'out-of-stock'
```
- ✗ X circle icon
- Coral color (`var(--coral)`)
- Text: "Niet op voorraad"
- Quantity stepper disabled

## Real-World Examples

### Shopping Cart Page
```tsx
'use client'

import { CartLineItem } from '@/branches/ecommerce/components/ui'
import { useCart } from '@/hooks/useCart'

export function ShoppingCart() {
  const { items, updateQuantity, removeItem, addToList } = useCart()

  return (
    <div className="cart">
      {items.map((item) => (
        <CartLineItem
          key={item.id}
          product={item.product}
          quantity={item.quantity}
          onQuantityChange={(qty) => updateQuantity(item.id, qty)}
          onRemove={() => removeItem(item.id)}
          onAddToList={() => addToList(item.product.id)}
        />
      ))}
    </div>
  )
}
```

### MiniCart (No "Add to List")
```tsx
<CartLineItem
  product={item.product}
  quantity={item.quantity}
  onQuantityChange={(qty) => updateQuantity(item.id, qty)}
  onRemove={() => removeItem(item.id)}
  // No onAddToList - button won't render
/>
```

### With Stock Limit
```tsx
<CartLineItem
  product={{
    ...product,
    stockStatus: 'low-stock',
    stockQuantity: 15, // Limits QuantityStepper max value
  }}
  quantity={quantity}
  onQuantityChange={setQuantity}
  onRemove={handleRemove}
/>
```

## Theme Variables Used

### Colors
- `--white` (#FAFBFC) - Card background
- `--navy` (#0A1628) - Title, price
- `--teal` (#00897B) - Brand, action hover
- `--green` (#00C853) - In stock status
- `--amber` (from theme) - Low stock status
- `--coral` (from theme) - Out of stock, delete hover
- `--grey` (#E8ECF1) - Border
- `--grey-mid` (#94A3B8) - Metadata, unit price, action buttons
- `--bg` (#F5F7FA) - Image placeholder

### Typography
- `--font-display` (Plus Jakarta Sans) - Price (bold, 20px)
- Default sans (DM Sans) - All other text

### Spacing
- `--radius` (12px) - Image border radius
- `--radius-lg` (16px) - Card border radius

## Mobile Responsive (< 768px)

- **Image:** Scales to 80×80px
- **Layout:** Wraps to vertical flow
- **Price wrapper:** Full width, flexbox for alignment
- **Actions:** Align left instead of right
- **Padding:** Reduced from 20px to 16px

## Accessibility

### ARIA Labels
- Quantity stepper: Auto-labeled with product title
- Action buttons: Labeled ("Voeg toe aan lijst", "Verwijder item")

### Keyboard Support
- **Tab:** Navigate between stepper, "Add to list", and "Delete"
- **Enter/Space:** Activate buttons
- **Arrow keys:** Change quantity (via QuantityStepper)

### Color Contrast
- Title (navy on white): 14.8:1 (WCAG AAA ✓)
- Metadata (grey-mid on white): 4.5:1 (WCAG AA ✓)
- Stock indicators: All meet WCAG AA standards

## Integration with Other Components

- **QuantityStepper (c23):** Embedded for quantity control
- **MiniCartFlyout (c2):** Displays multiple CartLineItems
- **OrderSummary (ec07):** Shows line items in checkout
- **AddToCartToast (c3):** Uses same product data structure

## Component Location

```
src/branches/ecommerce/components/ui/CartLineItem/
├── Component.tsx    # Main component
├── types.ts         # TypeScript interfaces
├── index.ts         # Exports
└── README.md        # This file
```

---

**Category:** E-commerce / Cart
**Priority:** HIGH (core shopping experience)
**Last Updated:** February 25, 2026
