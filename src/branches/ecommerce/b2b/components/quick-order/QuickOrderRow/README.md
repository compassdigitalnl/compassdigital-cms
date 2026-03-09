# QuickOrderRow (qo03)

Individual table row for quick order entry with product search autocomplete, quantity input, price display, and delete action.

## Features

- ✅ **Product autocomplete:** Search by SKU or name with debounced results
- ✅ **SKU display:** Monospace teal text below input (after selection)
- ✅ **Staffel hints:** Amber text showing volume discount opportunities
- ✅ **Quantity input:** Number input with monospace font, centered
- ✅ **Price display:** Read-only unit price (monospace)
- ✅ **Total calculation:** Auto-calculated (quantity × price)
- ✅ **Delete button:** 40×40px icon button (hidden on empty rows)
- ✅ **4 states:** Empty, Searching, Filled, With Staffel
- ✅ **Keyboard navigation:** Tab, Enter, Escape, Arrow keys
- ✅ **Responsive:** Stacks on mobile, grid on desktop
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

### Basic Usage

```tsx
import { QuickOrderRow } from '@/branches/ecommerce/components/quick-order/QuickOrderRow'

<QuickOrderRow
  row={{
    id: '1',
    productQuery: '',
    quantity: 0,
    unitPrice: 0,
    total: 0,
  }}
  onUpdate={(id, updates) => {
    setRows(rows.map(r => r.id === id ? { ...r, ...updates } : r))
  }}
  onDelete={(id) => {
    setRows(rows.filter(r => r.id !== id))
  }}
/>
```

### With Product Search

```tsx
import { useDebouncedCallback } from 'use-debounce'

const [showAutocomplete, setShowAutocomplete] = useState<string | null>(null)
const [autocompleteResults, setAutocompleteResults] = useState([])

const handleProductSearch = useDebouncedCallback(
  async (rowId: string, query: string) => {
    if (query.length < 2) {
      setShowAutocomplete(null)
      return
    }

    const response = await fetch(`/api/products/search?q=${query}`)
    const products = await response.json()

    setAutocompleteResults(products)
    setShowAutocomplete(rowId)
  },
  300
)

const handleAutocompleteSelect = (rowId: string, product: Product) => {
  setRows(rows.map(row => {
    if (row.id === rowId) {
      return {
        ...row,
        productId: product.id,
        productName: product.name,
        productQuery: product.name,
        sku: product.sku,
        unitPrice: product.price,
        total: product.price * row.quantity,
      }
    }
    return row
  }))

  setShowAutocomplete(null)
}

<QuickOrderRow
  row={row}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
  onProductSearch={handleProductSearch}
  showAutocomplete={showAutocomplete === row.id}
  autocompleteResults={autocompleteResults}
  onAutocompleteSelect={handleAutocompleteSelect}
/>
```

### With Staffel Hints

```tsx
const rowWithStaffel = {
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
}

<QuickOrderRow row={rowWithStaffel} {...props} />
```

### Empty Row

```tsx
const emptyRow = {
  id: '1',
  productQuery: '',
  quantity: 0,
  unitPrice: 0,
  total: 0,
}

<QuickOrderRow row={emptyRow} {...props} />
// Delete button will be hidden
// Price shows "—" instead of "€ 0,00"
```

## Props

| Prop                   | Type                                                  | Required | Default | Description                          |
| ---------------------- | ----------------------------------------------------- | -------- | ------- | ------------------------------------ |
| `row`                  | `QuickOrderRowData`                                   | ✅       | -       | Row data object                      |
| `onUpdate`             | `(rowId: string, updates: Partial<QuickOrderRowData>) => void` | ✅ | - | Handler when row fields change       |
| `onDelete`             | `(rowId: string) => void`                             | ✅       | -       | Handler when row deleted             |
| `onProductSearch`      | `(rowId: string, query: string) => void`              |          | -       | Handler for product search           |
| `showAutocomplete`     | `boolean`                                             |          | `false` | Show autocomplete dropdown           |
| `autocompleteResults`  | `Product[]`                                           |          | `[]`    | Autocomplete search results          |
| `onAutocompleteSelect` | `(rowId: string, product: Product) => void`           |          | -       | Handler when autocomplete item clicked |
| `className`            | `string`                                              |          | `''`    | Additional CSS classes               |

## Row Data Structure

```typescript
interface QuickOrderRowData {
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

## States

### Empty State
- No product selected
- Price shows "—"
- Total shows "€ 0,00" (grey text)
- Delete button hidden (`visibility: hidden`)

### Searching State
- Product input focused
- Teal border + light teal background
- Autocomplete dropdown visible (if results)
- Teal glow ring (3px box-shadow)

### Filled State
- Product selected
- Teal input background
- SKU displayed below input (monospace teal)
- Total calculated and displayed
- Delete button visible

### With Staffel Hint State
- Filled state +
- Amber text below input: "Nog X voor €Y (−Z%)"
- TrendingDown icon (12×12px, amber)

## Grid Layout

### Desktop (Default)
- **Column 1 (Product):** `1fr` - Flexible width
- **Column 2 (Quantity):** `140px` - Fixed width
- **Column 3 (Price):** `140px` - Fixed width
- **Column 4 (Total):** `180px` - Fixed width (right-aligned)
- **Column 5 (Delete):** `48px` - Fixed width (icon button)

### Mobile (768px)
- Stacked layout (single column)
- Delete button positioned absolute (top-right)
- Total font size reduced to 16px

## Autocomplete Dropdown

### Features
- Positioned absolutely below product input
- Max height: 280px with vertical scroll
- Teal border (1.5px)
- Box shadow: `0 8px 24px rgba(10, 22, 40, 0.12)`
- Z-index: 100

### Item Structure
```tsx
<div className="autocomplete-item">
  <div className="name">Supreme Plus Nitrile Handschoenen</div>
  <div className="meta">
    <span className="sku">SKU: SMP-8942</span>
    <span className="price">€ 12,95</span>
  </div>
</div>
```

### Keyboard Navigation
- **Arrow Up/Down:** Navigate items
- **Enter:** Select highlighted item
- **Escape:** Close dropdown
- **Tab:** Move to next field (closes dropdown)

## Quantity Input

### Features
- Number input with min="1"
- Monospace font (JetBrains Mono)
- Centered text
- Hide spinner arrows (cross-browser)

### Validation
- Min value: 1
- Auto-calculates total on change
- Updates staffel hints if applicable

## Theme Variables

| Element              | Color/Style                    | Usage                        |
| -------------------- | ------------------------------ | ---------------------------- |
| Input border         | `var(--grey)`                  | Default border (1.5px)       |
| Input border (focus) | `var(--teal)`                  | Focused/filled state         |
| Input bg (filled)    | `var(--teal-bg)`               | Light teal background        |
| SKU text             | `var(--teal)`                  | Monospace teal (#00897B)     |
| Staffel hint         | `var(--amber)`                 | Discount text (#F59E0B)      |
| Price/Total          | `var(--navy)`                  | Main text (#0A1628)          |
| Empty state          | `var(--grey-mid)`              | Placeholder text (#94A3B8)   |
| Delete hover         | `#FF6B6B` (coral)              | Hover border + bg            |
| Focus ring           | `var(--teal-glow)`             | 3px box-shadow               |
| Autocomplete border  | `var(--teal)`                  | Dropdown border (1.5px)      |

## Accessibility

### Semantic HTML
- Container uses `role="row"`
- Each column uses `role="cell"`
- Number input for quantity (native validation)

### ARIA Attributes
- `aria-label="Verwijder product"` on delete button
- `aria-label="Aantal"` on quantity input
- `aria-controls="autocomplete-{rowId}"` on product input (when open)
- `aria-expanded="true/false"` on product input
- `role="listbox"` on autocomplete dropdown
- `role="option"` on each autocomplete item

### Keyboard Navigation
- **Tab:** Product → Quantity → Delete → Next row
- **Enter (in product input):** Select autocomplete item
- **Escape:** Close autocomplete
- **Arrow Up/Down:** Navigate autocomplete
- **Delete/Backspace (in quantity):** Clear value

### Focus States
- Product input: Teal border + teal glow ring (3px)
- Quantity input: Teal border + teal glow ring
- Delete button: Coral glow ring (rgba(255, 107, 107, 0.15))
- Autocomplete items: Light teal background on hover/focus

## Performance Optimization

```typescript
// Use React.memo to prevent re-renders
export const QuickOrderRow = React.memo(QuickOrderRowComponent)

// Debounce product search (300ms)
import { useDebouncedCallback } from 'use-debounce'
const debouncedSearch = useDebouncedCallback(searchProducts, 300)

// Close autocomplete on click outside
useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (!inputRef.current?.contains(e.target as Node)) {
      closeAutocomplete()
    }
  }

  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [])
```

## Related Components

- **QO02: QuickOrderTable** - Parent table component (renders multiple rows)
- **C1: InstantSearch** - Similar autocomplete pattern for global search
- **C4: StaffelCalculator** - Visual staffel pricing calculator
- **C23: QuantityStepper** - Alternative quantity input with +/− buttons

## Testing Checklist

- ✓ Typing in product input triggers search after 300ms
- ✓ Autocomplete dropdown shows results
- ✓ Selecting autocomplete item fills SKU, price, total
- ✓ Changing quantity recalculates total
- ✓ Staffel hint appears when applicable
- ✓ Delete button removes row
- ✓ Empty row shows grey placeholders
- ✓ Delete button hidden on empty rows
- ✓ Focus states visible on all inputs
- ✓ Keyboard navigation works (Tab, Enter, Escape, Arrows)
- ✓ Mobile layout stacks correctly (<768px)

## Component Location

```
src/branches/ecommerce/components/quick-order/QuickOrderRow/
├── Component.tsx
├── types.ts
├── index.ts
└── README.md
```

---

**Category:** E-commerce / B2B / Quick Order
**Complexity:** High (autocomplete, state management, calculations)
**Priority:** 🟢 HIGH
**Last Updated:** February 25, 2026
