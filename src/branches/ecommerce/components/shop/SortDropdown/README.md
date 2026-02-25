# SortDropdown Component

**Component ID:** `c22`
**Category:** E-commerce / Shop
**Complexity:** Low

## Overview

Product sorting dropdown + grid/list view toggle for shop archives, category pages, and search results. Provides users with options to sort products by price, popularity, rating, date, etc., and toggle between grid and list views.

### Key Features

- ✅ **SortDropdown** - Custom styled select with sort options
- ✅ **ViewToggle** - Grid/List view toggle buttons
- ✅ **ShopToolbar** - Complete toolbar with result count, sort, and view toggle
- ✅ **3 sizes** - Small, Medium (default), Large
- ✅ **Disabled state** - For loading or empty states
- ✅ **Responsive** - Adapts to mobile layouts
- ✅ **100% theme variables** (NO hardcoded colors)
- ✅ **Full accessibility** (ARIA labels, keyboard navigation)

---

## Usage

### Basic SortDropdown

\`\`\`tsx
import { SortDropdown } from '@/branches/ecommerce/components/shop/SortDropdown'
import type { SortOption } from '@/branches/ecommerce/components/shop/SortDropdown'

const sortOptions: SortOption[] = [
  { value: 'relevance', label: 'Relevantie' },
  { value: 'price-asc', label: 'Prijs: laag → hoog' },
  { value: 'price-desc', label: 'Prijs: hoog → laag' },
  { value: 'newest', label: 'Nieuwste' },
  { value: 'rating', label: 'Best beoordeeld' },
  { value: 'popular', label: 'Meest verkocht' },
]

export default function ProductList() {
  const [sortBy, setSortBy] = useState('relevance')

  const handleSortChange = (value: string) => {
    setSortBy(value)
    // Fetch sorted products
    fetchProducts({ sort: value })
  }

  return (
    <SortDropdown
      value={sortBy}
      options={sortOptions}
      onChange={handleSortChange}
    />
  )
}
\`\`\`

### View Toggle

\`\`\`tsx
import { ViewToggle } from '@/branches/ecommerce/components/shop/SortDropdown'

export default function ProductList() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <ViewToggle
      view={viewMode}
      onChange={setViewMode}
    />
  )
}
\`\`\`

### Complete Shop Toolbar

\`\`\`tsx
import { ShopToolbar } from '@/branches/ecommerce/components/shop/SortDropdown'

export default function ShopPage() {
  const [sortBy, setSortBy] = useState('relevance')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="container mx-auto px-4">
      <ShopToolbar
        sortValue={sortBy}
        sortOptions={sortOptions}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewChange={setViewMode}
        resultCount={24}
        totalCount={86}
        showViewToggle={true}
      />

      <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-6' : 'space-y-4'}>
        {/* Product cards */}
      </div>
    </div>
  )
}
\`\`\`

### With URL Sync

\`\`\`tsx
'use client'

import { useSearchParams, useRouter } from 'next/navigation'

export default function ShopPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sortBy = searchParams.get('sort') || 'relevance'
  const viewMode = (searchParams.get('view') as 'grid' | 'list') || 'grid'

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', value)
    router.push(\`?$\{params.toString()}\`)
  }

  const handleViewChange = (view: 'grid' | 'list') => {
    const params = new URLSearchParams(searchParams)
    params.set('view', view)
    router.push(\`?$\{params.toString()}\`)
  }

  return (
    <ShopToolbar
      sortValue={sortBy}
      sortOptions={sortOptions}
      onSortChange={handleSortChange}
      viewMode={viewMode}
      onViewChange={handleViewChange}
      resultCount={24}
      totalCount={86}
    />
  )
}
\`\`\`

---

## API Reference

### SortDropdown Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **required** | Currently selected sort value |
| `options` | `SortOption[]` | **required** | Array of sort options |
| `onChange` | `(value: string) => void` | **required** | Callback when sort changes |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Dropdown size |
| `disabled` | `boolean` | `false` | Disable the dropdown |
| `className` | `string` | `''` | Additional CSS classes |

### ViewToggle Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `view` | `'grid' \| 'list'` | **required** | Currently active view mode |
| `onChange` | `(view: ViewMode) => void` | **required** | Callback when view changes |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disable the buttons |
| `className` | `string` | `''` | Additional CSS classes |

### ShopToolbar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sortValue` | `string` | **required** | Currently selected sort value |
| `sortOptions` | `SortOption[]` | **required** | Array of sort options |
| `onSortChange` | `(value: string) => void` | **required** | Callback when sort changes |
| `viewMode` | `'grid' \| 'list'` | `'grid'` | Currently active view mode |
| `onViewChange` | `(view: ViewMode) => void` | - | Callback when view changes |
| `resultCount` | `number` | - | Number of filtered results |
| `totalCount` | `number` | - | Total number of products |
| `showViewToggle` | `boolean` | `true` | Show the view toggle buttons |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| `className` | `string` | `''` | Additional CSS classes |

### SortOption Interface

\`\`\`typescript
interface SortOption {
  value: string    // Option value (e.g., 'price-asc', 'newest')
  label: string    // Display label (e.g., 'Prijs: laag → hoog', 'Nieuwste')
}
\`\`\`

---

## Sort Options Examples

### E-commerce Standard

\`\`\`tsx
const sortOptions: SortOption[] = [
  { value: 'relevance', label: 'Relevantie' },
  { value: 'price-asc', label: 'Prijs: laag → hoog' },
  { value: 'price-desc', label: 'Prijs: hoog → laag' },
  { value: 'newest', label: 'Nieuwste' },
  { value: 'rating', label: 'Best beoordeeld' },
  { value: 'popular', label: 'Meest verkocht' },
]
\`\`\`

### B2B Specific

\`\`\`tsx
const b2bSortOptions: SortOption[] = [
  { value: 'relevance', label: 'Relevantie' },
  { value: 'price-asc', label: 'Prijs: laag → hoog' },
  { value: 'price-desc', label: 'Prijs: hoog → laag' },
  { value: 'stock', label: 'Op voorraad' },
  { value: 'moq', label: 'Minimum afname' },
  { value: 'delivery', label: 'Levertijd' },
]
\`\`\`

### Content Archive

\`\`\`tsx
const contentSortOptions: SortOption[] = [
  { value: 'date-desc', label: 'Nieuwste eerst' },
  { value: 'date-asc', label: 'Oudste eerst' },
  { value: 'title-asc', label: 'Titel A-Z' },
  { value: 'title-desc', label: 'Titel Z-A' },
  { value: 'views', label: 'Meest gelezen' },
]
\`\`\`

---

## Styling

All styles use theme variables from `src/globals/`:

### Colors
- `bg-white` - Dropdown background
- `border-theme-border` - Border color
- `text-theme-navy` - Text color
- `text-theme-grey-mid` - Chevron icon, inactive view buttons
- `text-theme-teal` - Active view button icon
- `bg-theme-teal-glow` - Active view button background
- `bg-theme-bg` - Hover states
- `border-theme-teal` - Focus border
- `ring-theme-teal/20` - Focus ring

### Typography
- Small: `text-[12px]`
- Medium: `text-[13px]`
- Large: `text-[14px]`
- Font weight: `font-semibold` (600)

### Sizing

**SortDropdown:**
- Small: `py-2 px-3` (140px min-width)
- Medium: `py-2.5 px-3.5` (180px min-width)
- Large: `py-3 px-4` (200px min-width)

**ViewToggle:**
- Small: `w-9 h-[34px]`
- Medium: `w-10 h-[38px]`
- Large: `w-11 h-[42px]`

---

## Accessibility

### Keyboard Navigation

- **Tab**: Navigate between dropdown and view buttons
- **Arrow keys**: Navigate dropdown options (native select behavior)
- **Enter/Space**: Activate view button, open dropdown

### ARIA Attributes

- `aria-label="Sorteer producten"` on dropdown
- `aria-label="Weergave wijzigen"` on view toggle group
- `aria-label="Grid weergave"` / `aria-label="Lijst weergave"` on buttons
- `aria-pressed` on active view button
- `role="toolbar"` on ShopToolbar
- `role="group"` on ViewToggle

### Focus Management

- Visible focus rings on all interactive elements
- Focus order: Result count → Sort dropdown → View buttons
- Skip link support for keyboard-only users

---

## Best Practices

### Do's ✅

- Use "Relevantie" as default sort for search results
- Use "Nieuwste" or "Popular" as default for category pages
- Show result count when filtering is active
- Sync sort/view with URL for shareable links
- Remember user's view preference (localStorage)
- Update result count after sorting/filtering
- Disable controls during loading state
- Use semantic labels (e.g., "Prijs: laag → hoog" not just "Price ASC")

### Don'ts ❌

- Don't show view toggle on mobile (use grid only)
- Don't auto-sort without user action (preserve choice)
- Don't use technical labels (e.g., "price_asc", use "Prijs: laag → hoog")
- Don't forget to handle empty states (0 results)
- Don't add too many sort options (max 6-8)

---

## Integration with FilterSidebar

\`\`\`tsx
import { FilterSidebar, type ActiveFilter } from '@/branches/ecommerce/components/shop/FilterSidebar'
import { ShopToolbar } from '@/branches/ecommerce/components/shop/SortDropdown'

export default function ShopPage() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])
  const [sortBy, setSortBy] = useState('relevance')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    const query = buildQuery(activeFilters, sortBy)
    const response = await fetch(\`/api/products?\${query}\`)
    const data = await response.json()
    setProducts(data.products)
  }

  useEffect(() => {
    fetchProducts()
  }, [activeFilters, sortBy])

  return (
    <div className="container">
      {/* Toolbar */}
      <ShopToolbar
        sortValue={sortBy}
        sortOptions={sortOptions}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewChange={setViewMode}
        resultCount={products.length}
        totalCount={1000}
      />

      {/* Grid */}
      <div className="grid grid-cols-[280px_1fr] gap-8 mt-6">
        <FilterSidebar
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
          onResetAll={() => setActiveFilters([])}
        />

        <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-6' : 'space-y-4'}>
          {products.map(product => (
            <ProductCard key={product.id} {...product} viewMode={viewMode} />
          ))}
        </div>
      </div>
    </div>
  )
}
\`\`\`

---

## Responsive Behavior

### Desktop (≥640px)
- Horizontal toolbar layout
- Full width dropdowns and buttons
- Result count on left, controls on right

### Mobile (<640px)
- Vertical stacking
- Full width dropdown
- Hide view toggle (grid-only recommended)
- Compact result count

---

## Testing Checklist

- [ ] Sort dropdown updates product list
- [ ] View toggle switches between grid/list layouts
- [ ] Result count updates after filtering/sorting
- [ ] Disabled state prevents interaction
- [ ] Focus ring visible on all interactive elements
- [ ] Keyboard navigation works (Tab, Arrow keys, Enter)
- [ ] URL updates with sort/view params
- [ ] Back button restores previous sort/view
- [ ] Screen reader announces sort changes
- [ ] Responsive layout works on mobile

---

## Related Components

- **FilterSidebar** (c21) - Filtering controls
- **Pagination** (c20) - Page navigation
- **ProductCard** (ec01) - Product display (grid/list variants)

---

**Last Updated:** 25 February 2026
**Status:** ✅ Production Ready
**Build Status:** ✅ Passing
