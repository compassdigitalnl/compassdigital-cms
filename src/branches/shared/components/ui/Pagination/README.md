# Pagination Component

**Component ID:** C20 - Pagination
**Category:** Utility / Navigation
**Complexity:** Low (numbered buttons, active state, disabled state)

## Overview

Page navigation component for long lists of content (product archives, search results, blog posts). Allows users to navigate between pages with numbered buttons, previous/next arrows, and ellipsis for skipped pages.

## Features

- ✅ **Numbered page buttons** (42px × 42px, responsive to 38px on mobile)
- ✅ **Active page indicator** (teal background)
- ✅ **Previous/Next arrow buttons** (chevron icons)
- ✅ **Disabled state** for first/last page (opacity 0.3, no pointer events)
- ✅ **Smart ellipsis** (…) for skipped pages
- ✅ **Hover states** (teal border + background)
- ✅ **3 variants:** Default, With count text, Compact (mobile)
- ✅ **Keyboard navigation** (arrow keys)
- ✅ **Screen reader announcements** (page changes)
- ✅ **SEO-friendly** (optional href support for crawlable links)
- ✅ **Theme variables** (no hardcoded colors)
- ✅ **Responsive** (smaller buttons on mobile <640px)
- ✅ **Accessibility** (ARIA labels, keyboard support, focus management)

## Usage

### Basic Example

```tsx
import { Pagination } from '@/branches/shared/components/ui'

export function ProductArchive() {
  const [currentPage, setCurrentPage] = React.useState(1)

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={8}
      onPageChange={setCurrentPage}
    />
  )
}
```

### With Result Count (Variant 2)

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={8}
  totalItems={186}
  itemsPerPage={24}
  variant="with-count"
  showCount={true}
  onPageChange={setCurrentPage}
/>
// Displays: "Resultaten 1-24 van 186"
```

### Compact Variant (Mobile-Friendly)

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={8}
  variant="compact"
  onPageChange={setCurrentPage}
/>
// Shows: "← Vorige | Pagina 1 van 8 | Volgende →"
```

### With URL Sync (Next.js)

```tsx
import { useRouter, useSearchParams } from 'next/navigation'

export function ProductArchive() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1')

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={8}
      onPageChange={handlePageChange}
      variant="with-count"
      totalItems={186}
    />
  )
}
```

### SEO-Friendly Links

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={8}
  onPageChange={handlePageChange}
  getPageUrl={(page) => `/shop?page=${page}&sort=${currentSort}`}
/>
// Renders <a> tags instead of buttons for better SEO
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | *required* | Current active page (1-indexed) |
| `totalPages` | `number` | *required* | Total number of pages |
| `totalItems` | `number` | `undefined` | Total number of items (for count display) |
| `itemsPerPage` | `number` | `24` | Items shown per page |
| `maxVisiblePages` | `number` | `7` | Maximum visible page buttons (including current) |
| `variant` | `'default' \| 'with-count' \| 'compact'` | `'default'` | Pagination style variant |
| `showArrows` | `boolean` | `true` | Show previous/next arrow buttons |
| `showEllipsis` | `boolean` | `true` | Show ellipsis (…) for gaps |
| `showCount` | `boolean` | `false` | Show result count (e.g., "Resultaten 1-24 van 186") |
| `onPageChange` | `(page: number) => void` | *required* | Callback when page changes |
| `getPageUrl` | `(page: number) => string` | `undefined` | Function to generate URLs for SEO (renders `<a>` tags) |
| `className` | `string` | `undefined` | Additional CSS classes |

## Variants

### 1. Default (Centered)
- Centered pagination with numbered buttons
- Shows: `[<] 1 2 3 … 8 [>]`
- Best for: General use cases

### 2. With Count (Space-Between)
- Shows result count on left side
- Shows: `"Resultaten 1-24 van 186" | [<] 1 2 3 … 8 [>]`
- Best for: Product archives, search results

### 3. Compact (Mobile-Friendly)
- Only previous/next buttons with page info
- Shows: `[← Vorige] | Pagina 1 van 8 | [Volgende →]`
- Best for: Mobile views, narrow containers

## Smart Ellipsis Logic

The component automatically determines which page numbers to show:

```
Current = 1:  [<] 1 2 3 … 8 [>]         (near start)
Current = 4:  [<] 1 … 3 4 5 … 8 [>]     (middle)
Current = 8:  [<] 1 … 6 7 8 [>]         (near end)
```

**Rules:**
- Always shows: first page, last page, current page
- Shows current ± 2 pages when in middle
- Uses ellipsis (…) for gaps > 1 page
- Max 7 visible page buttons (excluding arrows)

## Keyboard Navigation

The Pagination component supports keyboard navigation:

- **Arrow Left (←)**: Go to previous page
- **Arrow Right (→)**: Go to next page
- **Enter/Space**: Activate focused button
- **Tab**: Navigate between buttons

## Accessibility

### ARIA Labels
```tsx
// Previous button
<button aria-label="Vorige pagina" aria-disabled="true">

// Current page
<button aria-current="page" aria-label="Pagina 1, huidige pagina">1</button>

// Other pages
<button aria-label="Ga naar pagina 2">2</button>

// Ellipsis
<span aria-hidden="true">…</span>
```

### Screen Reader Announcements
When a page changes, the component announces:
```
"Pagina 2 van 8 geladen. Toont resultaten 25 tot 48."
```

### Focus Management
- Disabled buttons are not focusable (`tabIndex={-1}`)
- Focus ring uses theme teal color
- Keyboard navigation works globally (arrow keys)

## Theme Variables

The component uses ONLY theme variables (no hardcoded colors):

```css
/* Default state */
background: white
border: 1.5px solid var(--grey)
color: var(--text)

/* Hover state */
border-color: var(--teal)
background: var(--bg)
color: var(--teal)

/* Active state */
background: var(--teal)
border-color: var(--teal)
color: var(--white)

/* Disabled state */
opacity: 0.3
color: var(--grey-mid)

/* Ellipsis */
color: var(--grey-mid)
```

## Best Practices

### ✅ DO
- Show 24-48 items per page (B2B best practice)
- Preserve filters/sorting in URLs (`?page=2&sort=price`)
- Update URL on page change (SEO + back button)
- Scroll to top on page change
- Use compact variant on mobile (<640px)
- Show result count for better UX
- Disable prev/next on first/last page

### ❌ DON'T
- Don't use infinite scroll for B2B (harder to find items)
- Don't show >100 items per page (performance)
- Don't forget to update URL (back button breaks)
- Don't skip scroll-to-top (confusing UX)

## Responsive Design

```css
/* Desktop (default) */
.page-btn: 42px × 42px
gap: 6px

/* Mobile (<640px) */
.page-btn: 38px × 38px
gap: 4px

/* Recommended: Use compact variant on mobile */
@media (max-width: 640px) {
  variant="compact"
}
```

## Performance Notes

- Use URL params for pagination state (`?page=2`)
- Preload next/prev pages for faster navigation
- Server-side pagination for large datasets (>1000 items)
- Consider infinite scroll for B2C, pagination for B2B

## Integration Examples

### With Payload CMS

```tsx
import { Pagination } from '@/branches/shared/components/ui'

export async function ProductArchive({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = parseInt(searchParams.page || '1')
  const limit = 24

  const { docs, totalDocs } = await payload.find({
    collection: 'products',
    limit,
    page: currentPage,
  })

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        {docs.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalDocs / limit)}
        totalItems={totalDocs}
        itemsPerPage={limit}
        variant="with-count"
        onPageChange={(page) => {
          router.push(`/shop?page=${page}`)
        }}
      />
    </>
  )
}
```

### With React Query

```tsx
import { useQuery } from '@tanstack/react-query'
import { Pagination } from '@/branches/shared/components/ui'

export function ProductArchive() {
  const [page, setPage] = React.useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['products', page],
    queryFn: () => fetchProducts({ page, limit: 24 }),
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={data.totalPages}
        totalItems={data.totalItems}
        onPageChange={setPage}
        variant="with-count"
      />
    </>
  )
}
```

## Related Components

- **C21 FilterSidebar** - Often used together on archive pages
- **C22 SortDropdown** - Sorting + pagination
- **LoadMoreButton** - Alternative to pagination (infinite scroll)

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## File Structure

```
Pagination/
├── Component.tsx          # Main pagination component
├── PaginationButton.tsx   # Individual page button
├── index.ts              # Exports
├── types.ts              # TypeScript interfaces
└── README.md             # This file
```

## Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from './Pagination'

test('renders all page buttons', () => {
  const onPageChange = jest.fn()
  render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />)

  expect(screen.getByText('1')).toBeInTheDocument()
  expect(screen.getByText('5')).toBeInTheDocument()
})

test('calls onPageChange when clicking page 2', () => {
  const onPageChange = jest.fn()
  render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />)

  fireEvent.click(screen.getByText('2'))
  expect(onPageChange).toHaveBeenCalledWith(2)
})

test('disables previous button on first page', () => {
  const onPageChange = jest.fn()
  render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />)

  const prevButton = screen.getByLabelText('Vorige pagina')
  expect(prevButton).toBeDisabled()
})
```

## Migration from Old Pagination

If you're migrating from an old pagination component:

```tsx
// Old (hardcoded colors)
<div className="bg-blue-500">
  <button onClick={() => setPage(2)}>2</button>
</div>

// New (theme variables)
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

## Version History

- **v1.0.0** (2026-02-25) - Initial implementation
  - 3 variants (default, with-count, compact)
  - Smart ellipsis logic
  - Keyboard navigation
  - Screen reader support
  - SEO-friendly links
  - Theme variable integration
