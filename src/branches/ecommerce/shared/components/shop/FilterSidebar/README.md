# FilterSidebar Component

**Component ID:** `c21`
**Category:** E-commerce / Shop
**Complexity:** High

## Overview

Comprehensive filtering system for product category pages, search results, and archives. Allows users to narrow down large product catalogs using multiple criteria (brand, size, price range, material, rating, availability).

### Key Features

- ✅ **Collapsible filter cards** with smooth expand/collapse animations
- ✅ **Checkbox filters** with item counts (grey badges)
- ✅ **Dual-handle price range slider** with min/max inputs
- ✅ **Star rating filter** (5-star, 4+ stars, 3+ stars)
- ✅ **Active filter chips** (removable tags with X icon)
- ✅ **Reset all filters** link
- ✅ **Sticky positioning** (follows scroll on desktop)
- ✅ **Icon-enriched section headers** (Lucide icons in teal)
- ✅ **Responsive** - Adapts to mobile layouts
- ✅ **100% theme variables** (NO hardcoded colors)
- ✅ **Full accessibility** (ARIA, keyboard navigation, screen readers)

---

## Usage

### Basic Example

\`\`\`tsx
import { FilterSidebar } from '@/branches/ecommerce/components/shop/FilterSidebar'
import type { FilterGroup, ActiveFilter } from '@/branches/ecommerce/components/shop/FilterSidebar'

const filters: FilterGroup[] = [
  {
    id: 'brand',
    label: 'Merk',
    icon: 'award',
    type: 'checkbox',
    defaultOpen: true,
    options: [
      { value: 'hartmann', label: 'Hartmann', count: 24 },
      { value: 'medline', label: 'Medline', count: 18 },
      { value: 'ansell', label: 'Ansell', count: 14 },
    ],
  },
  {
    id: 'size',
    label: 'Maat',
    icon: 'ruler',
    type: 'checkbox',
    defaultOpen: true,
    options: [
      { value: 'xs', label: 'XS', count: 42 },
      { value: 's', label: 'S', count: 68 },
      { value: 'm', label: 'M', count: 72 },
      { value: 'l', label: 'L', count: 70 },
      { value: 'xl', label: 'XL', count: 58 },
    ],
  },
  {
    id: 'price',
    label: 'Prijs',
    icon: 'euro',
    type: 'range',
    defaultOpen: true,
    range: { min: 0, max: 100, step: 0.5 },
  },
  {
    id: 'rating',
    label: 'Beoordeling',
    icon: 'star',
    type: 'rating',
    options: [
      { value: '5', label: '5 sterren', count: 12 },
      { value: '4+', label: '4+ sterren', count: 38 },
      { value: '3+', label: '3+ sterren', count: 52 },
    ],
  },
]

export default function ShopPage() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])

  const handleFilterChange = (filters: ActiveFilter[]) => {
    setActiveFilters(filters)
    // Trigger API call to fetch filtered products
    fetchProducts(filters)
  }

  const handleResetAll = () => {
    setActiveFilters([])
    fetchProducts([])
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-[280px_1fr] gap-8">
        <FilterSidebar
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onResetAll={handleResetAll}
          sticky={true}
          stickyTop={90}
        />

        <div className="product-grid">
          {/* Product cards */}
        </div>
      </div>
    </div>
  )
}
\`\`\`

### With URL Sync

\`\`\`tsx
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ShopPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])

  // Load filters from URL on mount
  useEffect(() => {
    const filters = parseFiltersFromURL(searchParams)
    setActiveFilters(filters)
  }, [searchParams])

  const handleFilterChange = (filters: ActiveFilter[]) => {
    setActiveFilters(filters)

    // Update URL
    const params = buildURLFromFilters(filters)
    router.push(\`/products?\${params}\`, { shallow: true })

    // Fetch products
    fetchProducts(filters)
  }

  return (
    <FilterSidebar
      filters={filters}
      activeFilters={activeFilters}
      onFilterChange={handleFilterChange}
      onResetAll={() => handleFilterChange([])}
    />
  )
}

function parseFiltersFromURL(params: URLSearchParams): ActiveFilter[] {
  const filters: ActiveFilter[] = []

  const brand = params.get('brand')
  if (brand) {
    filters.push({
      groupId: 'brand',
      label: brand,
      values: brand.split(','),
    })
  }

  const minPrice = params.get('price_min')
  const maxPrice = params.get('price_max')
  if (minPrice && maxPrice) {
    filters.push({
      groupId: 'price',
      label: \`€\${minPrice} - €\${maxPrice}\`,
      values: [minPrice, maxPrice],
    })
  }

  return filters
}

function buildURLFromFilters(filters: ActiveFilter[]): string {
  const params = new URLSearchParams()

  filters.forEach(filter => {
    if (filter.groupId === 'price') {
      params.set('price_min', filter.values[0])
      params.set('price_max', filter.values[1])
    } else {
      params.set(filter.groupId, filter.values.join(','))
    }
  })

  return params.toString()
}
\`\`\`

### With LocalStorage Persistence

\`\`\`tsx
useEffect(() => {
  // Load saved filters from localStorage
  const saved = localStorage.getItem('shop-filters')
  if (saved) {
    const timestamp = localStorage.getItem('shop-filters-timestamp')
    const age = Date.now() - parseInt(timestamp || '0')

    // Clear filters after 24 hours
    if (age < 86400000) {
      setActiveFilters(JSON.parse(saved))
    } else {
      localStorage.removeItem('shop-filters')
      localStorage.removeItem('shop-filters-timestamp')
    }
  }
}, [])

const handleFilterChange = (filters: ActiveFilter[]) => {
  setActiveFilters(filters)
  localStorage.setItem('shop-filters', JSON.stringify(filters))
  localStorage.setItem('shop-filters-timestamp', Date.now().toString())
  fetchProducts(filters)
}
\`\`\`

---

## API Reference

### FilterSidebar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filters` | `FilterGroup[]` | **required** | Array of filter categories to display |
| `activeFilters` | `ActiveFilter[]` | **required** | Currently selected filters |
| `onFilterChange` | `(filters: ActiveFilter[]) => void` | **required** | Callback when filters change |
| `onResetAll` | `() => void` | **required** | Callback when reset all is clicked |
| `sticky` | `boolean` | `true` | Enable sticky positioning |
| `stickyTop` | `number` | `90` | Pixels from top when sticky |
| `defaultOpen` | `string[]` | `[]` | Filter IDs to open by default |
| `className` | `string` | `''` | Additional CSS classes |

### FilterGroup Interface

\`\`\`typescript
interface FilterGroup {
  id: string                       // Unique identifier (e.g., 'brand', 'size', 'price')
  label: string                    // Display name (e.g., 'Merk', 'Maat')
  icon: string                     // Lucide icon name (kebab-case, e.g., 'award', 'ruler')
  type: 'checkbox' | 'range' | 'rating'
  options?: FilterOption[]         // For checkbox/rating filters
  range?: PriceRange              // For price slider
  defaultOpen?: boolean           // Open by default
}
\`\`\`

### FilterOption Interface

\`\`\`typescript
interface FilterOption {
  value: string    // Option value (e.g., 'hartmann', 's', '4+')
  label: string    // Display label (e.g., 'Hartmann', 'S', '4+ sterren')
  count: number    // Product count for this option
}
\`\`\`

### ActiveFilter Interface

\`\`\`typescript
interface ActiveFilter {
  groupId: string    // Filter group ID (e.g., 'brand', 'size')
  label: string      // Display label for chip (e.g., 'Hartmann', 'Maat: S, M')
  values: string[]   // Selected values (e.g., ['hartmann'], ['s', 'm'])
}
\`\`\`

---

## Filter Types

### Checkbox Filter

\`\`\`tsx
{
  id: 'brand',
  label: 'Merk',
  icon: 'award',
  type: 'checkbox',
  defaultOpen: true,
  options: [
    { value: 'hartmann', label: 'Hartmann', count: 24 },
    { value: 'medline', label: 'Medline', count: 18 },
  ]
}
\`\`\`

### Price Range Filter

\`\`\`tsx
{
  id: 'price',
  label: 'Prijs',
  icon: 'euro',
  type: 'range',
  defaultOpen: true,
  range: { min: 0, max: 100, step: 0.50 }
}
\`\`\`

### Rating Filter

\`\`\`tsx
{
  id: 'rating',
  label: 'Beoordeling',
  icon: 'star',
  type: 'rating',
  options: [
    { value: '5', label: '5 sterren', count: 12 },
    { value: '4+', label: '4+ sterren', count: 38 },
    { value: '3+', label: '3+ sterren', count: 52 },
  ]
}
\`\`\`

---

## Styling

All styles use theme variables from `src/globals/`:

### Colors
- `bg-theme-teal` - Active checkboxes, slider fill
- `text-theme-teal` - Icons, hover states
- `bg-theme-teal-glow` - Active filter chip background
- `border-theme-border` - Card borders, inputs
- `text-theme-navy` - Primary text
- `text-theme-grey-mid` - Counts, secondary text
- `bg-theme-coral-light` / `text-theme-coral` - Reset hover, chip remove
- `fill-theme-amber` / `text-theme-amber` - Star ratings

### Typography
- Headers: `text-[14px] font-bold`
- Options: `text-[13px]`
- Counts: `text-[12px]`
- Price inputs: `font-mono`

### Spacing
- Card gap: `mb-3` (12px)
- Section padding: `px-4 py-3.5` (header), `px-4 pb-4` (body)
- Checkbox size: `w-[18px] h-[18px]`
- Icon size: `w-4 h-4` (headers), `w-3.5 h-3.5` (reset)

---

## Accessibility

### Keyboard Navigation

- **Tab**: Navigate between filter headers, checkboxes, slider thumbs, reset button
- **Enter/Space**: Toggle filter collapse, check/uncheck options
- **Arrow keys**: Adjust price slider (managed by browser)
- **Escape**: Clear focus (managed by browser)

### ARIA Attributes

- `role="complementary"` on sidebar
- `aria-expanded` on filter headers
- `aria-controls` linking headers to bodies
- `aria-label` on interactive elements
- `aria-valuemin/max/now` on price slider thumbs
- Screen reader announcements for filter changes

### Focus Management

- Visible focus rings on all interactive elements
- Focus moves to next chip when removing active filter
- Custom scrollbar for better usability

---

## Best Practices

### Do's ✅

- Show max 6-8 filter categories (avoid overwhelming users)
- Always display item counts (shows availability before filtering)
- Start with most-used filters open (brand, price, size)
- Update URL with filter params for shareable links
- Show active filters as removable chips above product grid
- Preserve filters when navigating back (localStorage/URL)
- Show "No results" state when filters return 0 products
- Auto-apply checkbox filters (no "Apply" button needed)
- Require "Apply" button for price slider (prevents excessive API calls)

### Don'ts ❌

- Don't use for catalogs with <20 items (not worth filtering)
- Don't show 0-count options (confuses users)
- Don't forget to update filter counts after applying filters
- Don't use without pagination for large result sets
- Don't make all filters open by default (too much scrolling)

---

## Integration Example

### Complete Shop Page

\`\`\`tsx
<div className="shop-page">
  {/* Active Filters */}
  <ActiveFilterChips
    filters={activeFilters}
    onRemove={removeFilter}
    onReset={resetAll}
  />

  {/* Toolbar with Sort */}
  <div className="shop-toolbar flex justify-between items-center mb-6">
    <div className="result-count text-sm text-theme-grey-mid">
      <strong className="text-theme-navy">{filteredCount}</strong> van {totalCount} producten
    </div>
    <SortDropdown value={sortBy} onChange={setSortBy} />
  </div>

  {/* Main Grid */}
  <div className="grid grid-cols-[280px_1fr] gap-8">
    <FilterSidebar
      filters={filters}
      activeFilters={activeFilters}
      onFilterChange={applyFilters}
      sticky={true}
    />

    <div className="product-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  </div>

  {/* Pagination */}
  <Pagination
    currentPage={page}
    totalPages={totalPages}
    onPageChange={setPage}
  />
</div>
\`\`\`

---

## Performance Optimization

### Debounce Price Slider

\`\`\`tsx
import { useDebouncedCallback } from 'use-debounce'

const debouncedFetch = useDebouncedCallback((filters) => {
  fetchProducts(filters)
}, 300)
\`\`\`

### Virtual Scrolling for Long Lists

\`\`\`tsx
import { FixedSizeList } from 'react-window'

{/* For >50 options */}
<FixedSizeList
  height={300}
  itemCount={options.length}
  itemSize={40}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <CheckboxOption option={options[index]} />
    </div>
  )}
</FixedSizeList>
\`\`\`

---

## Responsive Behavior

### Desktop (≥768px)
- Sidebar: 280px fixed width, sticky positioning
- Filter cards: vertically stacked
- Custom scrollbar: 6px width

### Mobile (<768px)
- Recommended: Replace with modal/drawer filter panel
- Alternative: Horizontal scroll container (see HTML reference)
- Sticky behavior disabled
- Compact active filter chips

---

## Testing Checklist

- [ ] Filter collapse/expand animation works smoothly
- [ ] Checkbox filters update product count immediately
- [ ] Price slider thumbs don't overlap (min stays left of max)
- [ ] Active filter chips are removable with keyboard
- [ ] Reset all filters clears all selections and chips
- [ ] Sticky positioning works on scroll (desktop only)
- [ ] URL updates with filter params (shareable links)
- [ ] Back button restores previous filter state
- [ ] Screen reader announces filter changes
- [ ] Focus ring visible on all interactive elements
- [ ] Filter counts update after applying filters

---

## Related Components

- **SortDropdown** (c22) - Sort controls that work alongside filters
- **Pagination** (c20) - Page navigation for filtered results
- **ProductCard** (ec01) - The items being filtered
- **ActiveFilterChips** - Extracted as standalone component

---

**Last Updated:** 25 February 2026
**Status:** ✅ Production Ready
**Build Status:** ✅ Passing
