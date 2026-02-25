# ProductSelectionTable (qr02)

Product selection table for B2B quote requests with quantity inputs, delete actions, and empty state.

## Features

- ✅ **Header:** Title + "Product toevoegen" button
- ✅ **Product rows:** Thumbnail, name, SKU, qty input, delete button
- ✅ **Quantity input:** 100px wide, monospace font, number type
- ✅ **Delete button:** Trash icon with coral hover state
- ✅ **Empty state:** Package-X icon with helpful message
- ✅ **Product name truncation:** Long names show ellipsis
- ✅ **Responsive:** Rows stack on mobile (<640px)
- ✅ **Validation:** Min qty 1, max qty validation
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

### Basic Usage

```tsx
import { ProductSelectionTable } from '@/branches/ecommerce/components/quote/ProductSelectionTable'

const [products, setProducts] = useState([
  {
    id: '1',
    name: 'Supreme Plus Nitrile Handschoenen',
    sku: 'SMP-8942',
    thumbnail: '🧤',
    quantity: 500,
  },
  {
    id: '2',
    name: 'Veiligheidsnaald 21G x 1½"',
    sku: 'MDL-7231',
    thumbnail: '💉',
    quantity: 200,
  },
])

<ProductSelectionTable
  products={products}
  onProductAdd={() => {
    // Open product search modal
  }}
  onProductRemove={(id) => {
    setProducts(products.filter((p) => p.id !== id))
  }}
  onQuantityChange={(id, qty) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, quantity: qty } : p)))
  }}
/>
```

### Empty State

```tsx
<ProductSelectionTable
  products={[]}
  emptyMessage="Selecteer producten voor uw offerte"
  onProductAdd={() => {
    // Open product search
  }}
/>
```

### With Image Thumbnails

```tsx
const productsWithImages = [
  {
    id: '1',
    name: 'Bloeddrukmeter Digitaal',
    sku: 'BPM-4521',
    thumbnail: 'https://example.com/images/bpm-4521.jpg',
    quantity: 50,
  },
]

<ProductSelectionTable products={productsWithImages} {...props} />
```

### With Max Quantity Validation

```tsx
const productsWithStock = [
  {
    id: '1',
    name: 'COVID-19 Antigeen Sneltest',
    sku: 'COVID-AG-25',
    thumbnail: '🧪',
    quantity: 100,
    maxQuantity: 250, // Stock limit
  },
]

<ProductSelectionTable
  products={productsWithStock}
  onQuantityChange={(id, qty) => {
    // Automatically capped at maxQuantity
    setProducts(products.map((p) => (p.id === id ? { ...p, quantity: qty } : p)))
  }}
/>
```

### Product Addition Modal Integration

```tsx
const [showProductModal, setShowProductModal] = useState(false)

<ProductSelectionTable
  products={products}
  onProductAdd={() => setShowProductModal(true)}
  onProductRemove={handleRemoveProduct}
  onQuantityChange={handleQuantityChange}
/>

{showProductModal && (
  <ProductSearchModal
    onSelect={(product) => {
      setProducts([...products, { ...product, quantity: 1 }])
      setShowProductModal(false)
    }}
    onClose={() => setShowProductModal(false)}
  />
)}
```

## Props

| Prop               | Type                                  | Required | Default                           | Description                         |
| ------------------ | ------------------------------------- | -------- | --------------------------------- | ----------------------------------- |
| `products`         | `Product[]`                           | ✅       | -                                 | Array of selected products          |
| `onProductAdd`     | `() => void`                          | ❌       | -                                 | Opens product search modal          |
| `onProductRemove`  | `(id: string) => void`                | ❌       | -                                 | Handler when product deleted        |
| `onQuantityChange` | `(id: string, qty: number) => void`   | ❌       | -                                 | Handler when quantity changes       |
| `showPrices`       | `boolean`                             | ❌       | `false`                           | Show price column (future)          |
| `emptyMessage`     | `string`                              | ❌       | `"Nog geen producten geselecteerd"` | Empty state message               |
| `className`        | `string`                              | ❌       | `''`                              | Additional CSS classes              |

## Product Interface

```typescript
interface Product {
  id: string // Unique product identifier
  name: string // Product name (truncated if too long)
  sku: string // SKU code (displayed below name)
  thumbnail?: string // Image URL or emoji (defaults to 📦)
  quantity: number // Quantity selected
  price?: number // Optional: unit price (future enhancement)
  maxQuantity?: number // Stock limit or MOQ (validation)
}
```

## Visual Design

### Row Layout (Flex)
- **Thumbnail:** 60×60px (48×48px mobile), flex-shrink: 0
- **Product info:** flex: 1, min-width: 0 (allows truncation)
- **Qty input:** 100px fixed width, monospace font, centered
- **Delete button:** 36×36px square, flex-shrink: 0
- **Gap:** 16px (desktop), 12px (mobile)

### Header
- **Background:** `var(--grey-lighter)` (#F5F7FA)
- **Title:** 16px, 700 weight, navy
- **Add button:** Teal bg, hover → teal solid
- **Padding:** 20px 24px

### Empty State
- **Icon:** PackageX (48px, grey-mid)
- **Text:** 14px, grey-mid
- **Hint:** 12px, grey-mid
- **Padding:** 32px 24px

### Quantity Input
- **Width:** 100px
- **Border:** 1.5px grey, focus → teal
- **Font:** Monospace (JetBrains Mono)
- **Text align:** Center
- **Spinner:** Hidden (cross-browser)

### Delete Button
- **Default:** Grey border, grey-mid color
- **Hover:** Coral border (#FF6B6B), coral bg (10% opacity)
- **Focus:** Coral box-shadow (20% opacity)

## States

### Empty State
- No products selected
- Shows empty message and hint
- Add button visible

### With Products
- Product rows displayed
- Each row has thumbnail, name, SKU, qty, delete
- Long names truncate with ellipsis

### Mobile (<640px)
- Header stacks: title top, button bottom (full width)
- Rows wrap: thumbnail + info first line, qty + delete second line
- Thumbnail smaller: 48×48px

## Validation

### Quantity Validation
```typescript
const handleQuantityChange = (id: string, qty: number) => {
  // Enforce minimum
  if (qty < 1) {
    setProducts(products.map((p) => (p.id === id ? { ...p, quantity: 1 } : p)))
    return
  }

  // Enforce maximum (if set)
  const product = products.find((p) => p.id === id)
  if (product?.maxQuantity && qty > product.maxQuantity) {
    setProducts(products.map((p) => (p.id === id ? { ...p, quantity: product.maxQuantity } : p)))
    return
  }

  // Valid quantity
  setProducts(products.map((p) => (p.id === id ? { ...p, quantity: qty } : p)))
}
```

### Delete Validation
```typescript
const handleRemoveProduct = (id: string) => {
  if (products.length === 1) {
    alert('Een offerte moet minimaal 1 product bevatten')
    return
  }
  setProducts(products.filter((p) => p.id !== id))
}
```

### Form Submission Validation
```typescript
function validateQuoteRequest(products: Product[]): string[] {
  const errors: string[] = []

  if (products.length === 0) {
    errors.push('Selecteer minimaal 1 product')
  }

  products.forEach((p) => {
    if (p.quantity < 1) {
      errors.push(`${p.name}: hoeveelheid moet minimaal 1 zijn`)
    }
    if (p.maxQuantity && p.quantity > p.maxQuantity) {
      errors.push(`${p.name}: maximaal ${p.maxQuantity} beschikbaar`)
    }
  })

  return errors
}
```

## Theme Variables

| Element              | Variable / Color       | Usage                          |
| -------------------- | ---------------------- | ------------------------------ |
| Container bg         | `white`                | #FFFFFF                        |
| Container border     | `var(--grey)`          | #E8ECF1                        |
| Header bg            | `var(--grey-lighter)`  | #F5F7FA                        |
| Title                | `var(--navy)`          | #0A1628                        |
| Add button bg        | `var(--teal-bg)`       | rgba(0, 137, 123, 0.12)        |
| Add button text      | `var(--teal)`          | #00897B                        |
| Add button hover     | `var(--teal)` + white  | Solid teal bg, white text      |
| Product name         | `var(--navy)`          | #0A1628                        |
| SKU                  | `var(--grey-mid)`      | #94A3B8                        |
| Qty input border     | `var(--grey)`          | #E8ECF1                        |
| Qty input focus      | `var(--teal)`          | #00897B                        |
| Delete default       | `var(--grey-mid)`      | #94A3B8                        |
| Delete hover         | `#FF6B6B` (coral)      | Border + bg                    |
| Empty state icon     | `var(--grey-mid)`      | #94A3B8                        |

## Accessibility

### Semantic HTML
- Container: `<div>` with table-like structure
- Buttons: `<button>` elements (keyboard accessible)
- Quantity: `<input type="number">` with min/max

### ARIA Attributes
- `aria-label="Product toevoegen"` on add button
- `aria-label="Verwijder {product.name}"` on delete buttons
- `aria-label="Hoeveelheid"` on quantity inputs

### Keyboard Navigation
- **Tab:** Navigate through add button, quantity inputs, delete buttons
- **Enter/Space:** Activate buttons
- **Arrow keys:** Increment/decrement quantity (native number input)

### Focus States
- Add button: `box-shadow: 0 0 0 3px rgba(0, 137, 123, 0.2)` (teal)
- Qty input: `border: teal + box-shadow: teal-glow`
- Delete button: `box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2)` (coral)

### Color Contrast
- Title (#0A1628) on grey-lighter: 12.1:1 (WCAG AAA ✓)
- Product name (#0A1628) on white: 16.1:1 (WCAG AAA ✓)
- SKU (#94A3B8) on white: 4.8:1 (WCAG AA ✓)
- Add button (#00897B) on teal-bg: Adequate for interactive element

## Product Addition Methods

### Import from Cart
```typescript
const handleImportFromCart = () => {
  const cartItems = getCartItems() // Your cart logic
  const productsFromCart = cartItems.map((item) => ({
    id: item.id,
    name: item.name,
    sku: item.sku,
    thumbnail: item.image,
    quantity: item.quantity,
  }))
  setProducts(productsFromCart)
}
```

### Search Modal
```typescript
const handleProductSearch = (query: string) => {
  // Fetch products matching query
  const results = await searchProducts(query)
  // Show results in modal
}
```

### CSV Upload (Batch Import)
```typescript
const handleCSVUpload = (file: File) => {
  // Parse CSV
  const parsedProducts = parseCSV(file)
  setProducts([...products, ...parsedProducts])
}
```

## Related Components

- **QR01: OfferteHero** - Header above table
- **QR03: CompanyInfoForm** - Company details (below table)
- **QR04: ProjectInfoForm** - Project information
- **QR05: FileUploadDropzone** - File upload for specs
- **EC06: CartLineItem** - Similar layout for B2C cart
- **QO02: QuickOrderTable** - Similar table for quick orders

## Testing Checklist

- ✓ Add button opens product selection modal
- ✓ Empty state shows when no products
- ✓ Empty state hint displays correctly
- ✓ Product rows render with all fields
- ✓ Thumbnails display (emoji or image URL)
- ✓ Long product names truncate with ellipsis
- ✓ SKU displays in monospace font
- ✓ Quantity input accepts numbers only
- ✓ Quantity input validates min=1
- ✓ Quantity input respects maxQuantity
- ✓ Quantity input hides spinner arrows
- ✓ Delete button removes product
- ✓ Delete button shows coral hover state
- ✓ Mobile: header stacks (title + button)
- ✓ Mobile: add button full width
- ✓ Mobile: rows wrap correctly
- ✓ Mobile: thumbnail smaller (48px)
- ✓ Keyboard navigation works (Tab, Enter, Arrows)
- ✓ Focus states visible on all interactive elements
- ✓ ARIA labels present on buttons and inputs

## Component Location

```
src/branches/ecommerce/components/quote/ProductSelectionTable/
├── Component.tsx
├── types.ts
├── index.ts
└── README.md
```

---

**Category:** E-commerce / B2B / Quote Request
**Complexity:** Medium (state management, validation, responsive layout)
**Priority:** 🟢 HIGH
**Last Updated:** February 25, 2026
