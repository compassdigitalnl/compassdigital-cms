# QuickOrderTable (qo02)

Multi-row data table for B2B quick order entry with product search, quantity input, and bulk add to cart functionality.

## Features

- ✅ **5-column grid:** Product | Quantity | Price | Total | Delete
- ✅ **Product autocomplete:** Search by SKU or name
- ✅ **Real-time totals:** Automatic calculation as quantities change
- ✅ **Staffel hints:** Volume discount opportunities
- ✅ **Dynamic rows:** Add/delete rows on the fly
- ✅ **Bulk add to cart:** Add all valid products at once
- ✅ **Empty state:** Shows placeholder when no products
- ✅ **Responsive:** Stacks on mobile, grid on desktop
- ✅ **Accessibility:** ARIA labels, keyboard navigation, screen reader support
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

### Basic Usage

```tsx
import { QuickOrderTable } from '@/branches/ecommerce/components/quick-order/QuickOrderTable'
import type { QuickOrderRow } from '@/branches/ecommerce/components/quick-order/QuickOrderTable'

const [rows, setRows] = useState<QuickOrderRow[]>([
  { id: '1', productQuery: '', quantity: 0, unitPrice: 0, total: 0 },
])

<QuickOrderTable
  rows={rows}
  onRowChange={(id, field, value) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r))
  }}
  onRowDelete={(id) => {
    setRows(rows.filter(r => r.id !== id))
  }}
  onRowAdd={() => {
    setRows([...rows, {
      id: Date.now().toString(),
      productQuery: '',
      quantity: 0,
      unitPrice: 0,
      total: 0,
    }])
  }}
  onBulkAddToCart={async () => {
    await addToCart(rows.filter(r => r.productId))
  }}
/>
```

### With Product Search

```tsx
const handleRowChange = async (rowId: string, field: string, value: any) => {
  if (field === 'productQuery') {
    // Debounced product search
    const results = await fetch(`/api/products/search?q=${value}`)
    const products = await results.json()
    showAutocomplete(rowId, products)
  }

  if (field === 'quantity') {
    const row = rows.find(r => r.id === rowId)
    if (row) {
      const newTotal = row.unitPrice * value
      updateRow(rowId, { quantity: value, total: newTotal })
    }
  }
}

<QuickOrderTable
  rows={rows}
  onRowChange={handleRowChange}
  // ... other props
/>
```

### With Loading State

```tsx
const [loading, setLoading] = useState(false)

<QuickOrderTable
  rows={rows}
  loading={loading}
  onBulkAddToCart={async () => {
    setLoading(true)
    try {
      await addToCart(rows.filter(r => r.productId))
      toast.success('Producten toegevoegd aan winkelwagen!')
    } finally {
      setLoading(false)
    }
  }}
  // ... other props
/>
```

### With Staffel Hints

```tsx
const rowsWithStaffel: QuickOrderRow[] = [
  {
    id: '1',
    productQuery: 'Veiligheidsnaald 21G',
    productId: 'prod_123',
    productName: 'Veiligheidsnaald 21G',
    sku: 'VN-21G',
    quantity: 7,
    unitPrice: 22.50,
    total: 157.50,
    staffelHint: {
      quantityNeeded: 3,
      nextTierPrice: 19.95,
      discount: 20,
    },
  },
]

<QuickOrderTable rows={rowsWithStaffel} {...props} />
```

## Props

| Prop               | Type                                             | Required | Default | Description                          |
| ------------------ | ------------------------------------------------ | -------- | ------- | ------------------------------------ |
| `rows`             | `QuickOrderRow[]`                                | ✅       | -       | Array of order rows                  |
| `onRowChange`      | `(rowId: string, field: string, value: any) => void` | ✅   | -       | Handler when row field changes       |
| `onRowDelete`      | `(rowId: string) => void`                        | ✅       | -       | Handler when row deleted             |
| `onRowAdd`         | `() => void`                                     | ✅       | -       | Handler when "Add row" clicked       |
| `onBulkAddToCart`  | `() => void \| Promise<void>`                    | ✅       | -       | Handler for bulk add to cart         |
| `loading`          | `boolean`                                        |          | `false` | Loading state (disables buttons)     |
| `className`        | `string`                                         |          | `''`    | Additional CSS classes               |

## Row Data Structure

```typescript
interface QuickOrderRow {
  id: string                  // Unique row identifier
  productQuery: string        // User input for product search
  productId?: string          // Selected product ID (after autocomplete)
  productName?: string        // Product name (displayed after selection)
  sku?: string                // SKU code (displayed below input)
  quantity: number            // Quantity input value
  unitPrice: number           // Price per unit (€)
  total: number               // Calculated total (quantity × unitPrice)
  staffelHint?: {             // Optional volume discount hint
    quantityNeeded: number    // Units needed for next tier
    nextTierPrice: number     // Price at next tier
    discount: number          // Discount percentage
  }
}
```

## Grid Layout

### Desktop (Default)
- **Column 1 (Product):** `1fr` - Flexible width
- **Column 2 (Quantity):** `140px` - Fixed width
- **Column 3 (Price):** `140px` - Fixed width
- **Column 4 (Total):** `180px` - Fixed width (right-aligned)
- **Column 5 (Delete):** `48px` - Fixed width (icon button)

### Tablet (1024px)
- Columns: `1fr 100px 100px 140px 40px`

### Mobile (768px)
- Stacked layout (single column)
- Header hidden
- Delete button positioned absolute (top-right)

## State Management

```typescript
// Initialize with one empty row
const [rows, setRows] = useState<QuickOrderRow[]>([
  { id: '1', productQuery: '', quantity: 0, unitPrice: 0, total: 0 },
])

// Add row
const handleAddRow = () => {
  const newRow: QuickOrderRow = {
    id: Date.now().toString(),
    productQuery: '',
    quantity: 0,
    unitPrice: 0,
    total: 0,
  }
  setRows([...rows, newRow])
}

// Delete row (maintain minimum 1 row)
const handleDeleteRow = (rowId: string) => {
  if (rows.length > 1) {
    setRows(rows.filter(r => r.id !== rowId))
  }
}

// Update row
const handleRowChange = (rowId: string, field: string, value: any) => {
  setRows(rows.map(row => {
    if (row.id === rowId) {
      const updatedRow = { ...row, [field]: value }

      // Recalculate total if quantity or price changes
      if (field === 'quantity' || field === 'unitPrice') {
        updatedRow.total = updatedRow.quantity * updatedRow.unitPrice
      }

      return updatedRow
    }
    return row
  }))
}

// Calculate totals
const totalProducts = rows.filter(r => r.productId).length
const totalAmount = rows.reduce((sum, r) => sum + r.total, 0)
```

## Product Search Integration

```typescript
import { useDebouncedCallback } from 'use-debounce'

const handleProductSearch = useDebouncedCallback(
  async (rowId: string, query: string) => {
    if (query.length < 2) return

    const response = await fetch(`/api/products/search?q=${query}`)
    const products = await response.json()

    // Show autocomplete dropdown
    setAutocompleteResults({ rowId, products })
  },
  300 // 300ms debounce
)

const handleProductSelect = (rowId: string, product: Product) => {
  setRows(rows.map(row => {
    if (row.id === rowId) {
      return {
        ...row,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        unitPrice: product.price,
        total: product.price * row.quantity,
        staffelHint: calculateStaffelHint(product, row.quantity),
      }
    }
    return row
  }))

  // Close autocomplete
  setAutocompleteResults(null)
}
```

## Theme Variables

| Element              | Color/Style                    | Usage                        |
| -------------------- | ------------------------------ | ---------------------------- |
| Container bg         | `white`                        | Table background             |
| Header/Footer bg     | `var(--grey-bg)`               | Grey background (#F5F7FA)    |
| Borders              | `var(--grey)`                  | 1px borders (#E8ECF1)        |
| Header text          | `var(--grey-dark)`             | Uppercase labels (#64748B)   |
| Product input        | `var(--navy)`                  | Input text (#0A1628)         |
| Filled input bg      | `var(--teal-bg)`               | Light teal background        |
| Filled input border  | `var(--teal)`                  | Teal border (#00897B)        |
| SKU text             | `var(--teal)`                  | Monospace SKU (#00897B)      |
| Staffel hint         | `var(--amber)`                 | Discount text (#F59E0B)      |
| Total value          | `var(--navy)`                  | Footer total (28px, 800)     |
| Add row button       | `white` + `var(--grey)` border | White bg, grey border        |
| Add row hover        | `var(--teal-bg)` + `var(--teal)` | Light teal bg, teal border |
| Bulk add button      | `var(--teal)` → `var(--teal-light)` gradient | Teal gradient    |
| Focus ring           | `var(--teal-glow)`             | 3px box-shadow               |

## Accessibility

### Semantic Structure
- Container uses `role="table"`
- Header cells use `role="columnheader"`
- Rows use `role="row"`
- Compatible with screen readers

### ARIA Attributes
- `aria-label="Quick order table"` on container
- `aria-label="Nieuwe rij toevoegen"` on add row button
- `aria-label="Toevoegen aan winkelwagen (X producten)"` on bulk add button
- `aria-live="polite"` on total value (announces changes)

### Keyboard Navigation
- Tab through inputs and buttons
- Enter key triggers button actions
- Focus visible with teal glow ring

### Form Validation
- Product required if quantity > 0
- Quantity min value = 1
- Bulk add disabled if no valid products

## Performance Optimization

```typescript
// Use React.memo for row components
const MemoizedQuickOrderRow = React.memo(QuickOrderRow)

// Virtualize rows if >50 products
import { FixedSizeList } from 'react-window'

// Debounce product search
import { useDebouncedCallback } from 'use-debounce'
const debouncedSearch = useDebouncedCallback(searchProducts, 300)
```

## Related Components

- **QO01: QuickOrderHeader** - Page header above this table
- **QO03: QuickOrderRow** - Individual row component (child of this table)
- **QO04: CSVUploadButton** - Bulk import alternative
- **QO05: ProTipBanner** - Info banner below table

## Component Location

```
src/branches/ecommerce/components/quick-order/QuickOrderTable/
├── Component.tsx
├── types.ts
├── index.ts
└── README.md
```

---

**Category:** E-commerce / B2B / Quick Order
**Complexity:** High (state management, child components, calculations)
**Priority:** 🟢 HIGH
**Last Updated:** February 25, 2026
