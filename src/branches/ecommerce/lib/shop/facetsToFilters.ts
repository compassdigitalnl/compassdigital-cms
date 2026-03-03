/**
 * Convert Meilisearch facets to FilterGroup[] for the FilterSidebar.
 * Splits brands by level (0=manufacturer, 1=product line),
 * and creates individual specification filter groups.
 */

import type { FilterGroup, ActiveFilter } from '@/branches/ecommerce/components/shop/FilterSidebar/types'
import type { ShopFacets, ShopSearchState } from '@/branches/ecommerce/hooks/useShopSearch'

/**
 * Build filter groups from Meilisearch facet data
 */
export function facetsToFilterGroups(facets: ShopFacets | null, state: ShopSearchState): FilterGroup[] {
  if (!facets) return []

  const groups: FilterGroup[] = []

  // ── Brand (Manufacturers, level 0) ──────────────────────
  const brandEntries = Object.entries(facets.brands || {}).filter(([, count]) => count > 0)
  if (brandEntries.length > 0) {
    groups.push({
      id: 'brands',
      label: 'Merk',
      icon: 'award',
      type: 'checkbox',
      defaultOpen: true,
      options: brandEntries
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({
          value: name,
          label: name,
          count,
        })),
    })
  }

  // ── Stock Status ──────────────────────
  const stockEntries = Object.entries(facets.stockStatus || {}).filter(([, count]) => count > 0)
  if (stockEntries.length > 0) {
    const stockLabels: Record<string, string> = {
      'in-stock': 'Op voorraad',
      'low': 'Beperkte voorraad',
      'on-backorder': 'Op bestelling',
      'out': 'Niet op voorraad',
    }

    groups.push({
      id: 'stock',
      label: 'Beschikbaarheid',
      icon: 'package-check',
      type: 'checkbox',
      defaultOpen: false,
      options: stockEntries.map(([status, count]) => ({
        value: status,
        label: stockLabels[status] || status,
        count,
      })),
    })
  }

  // ── Specifications (each spec becomes its own filter group) ──────────────────────
  if (facets.specs) {
    const specEntries = Object.entries(facets.specs)
      .filter(([, values]) => Object.keys(values).length > 0)
      .sort((a, b) => a[0].localeCompare(b[0]))

    for (const [specKey, valueDistribution] of specEntries) {
      const displayName = specKey.charAt(0).toUpperCase() + specKey.slice(1).replace(/_/g, ' ')
      const options = Object.entries(valueDistribution)
        .filter(([, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([value, count]) => ({
          value,
          label: value,
          count,
        }))

      if (options.length > 0) {
        groups.push({
          id: `spec_${specKey}`,
          label: displayName,
          icon: 'list',
          type: 'checkbox',
          defaultOpen: false,
          options,
        })
      }
    }
  }

  // ── Price Range ──────────────────────
  if (facets.priceRange) {
    groups.push({
      id: 'price',
      label: 'Prijs',
      icon: 'euro',
      type: 'range',
      defaultOpen: false,
      range: {
        min: Math.floor(facets.priceRange.min),
        max: Math.ceil(facets.priceRange.max),
        step: Math.max(1, Math.round((facets.priceRange.max - facets.priceRange.min) / 20)),
      },
    })
  }

  return groups
}

/**
 * Convert ShopSearchState to ActiveFilter[] for the FilterSidebar
 */
export function searchStateToActiveFilters(state: ShopSearchState): ActiveFilter[] {
  const filters: ActiveFilter[] = []

  // Brand names are the primary brand filter (from sidebar)
  if (state.brandNames.length > 0) {
    filters.push({ groupId: 'brands', label: 'Merk', values: state.brandNames })
  }

  if (state.stockStatus.length > 0) {
    filters.push({ groupId: 'stock', label: 'Beschikbaarheid', values: state.stockStatus })
  }

  if (state.minPrice !== null && state.maxPrice !== null) {
    filters.push({ groupId: 'price', label: 'Prijs', values: [String(state.minPrice), String(state.maxPrice)] })
  }

  for (const [specKey, values] of Object.entries(state.specs)) {
    if (values.length > 0) {
      const displayName = specKey.charAt(0).toUpperCase() + specKey.slice(1).replace(/_/g, ' ')
      filters.push({ groupId: `spec_${specKey}`, label: displayName, values })
    }
  }

  return filters
}

/**
 * Convert ActiveFilter[] changes back into search state updates.
 * Maps FilterSidebar groupIds to the appropriate search state fields.
 */
export function activeFiltersToSearchUpdates(
  filters: ActiveFilter[],
  facets: ShopFacets | null,
): Partial<ShopSearchState> {
  const updates: Partial<ShopSearchState> = {
    brandNames: [],
    brandIds: [],
    stockStatus: [],
    minPrice: null,
    maxPrice: null,
    specs: {},
  }

  for (const filter of filters) {
    if (filter.groupId === 'brands') {
      // Brand filter uses names as values (from Meilisearch facets)
      updates.brandNames = filter.values
    } else if (filter.groupId === 'stock') {
      updates.stockStatus = filter.values
    } else if (filter.groupId === 'price') {
      if (filter.values.length === 2) {
        updates.minPrice = parseFloat(filter.values[0])
        updates.maxPrice = parseFloat(filter.values[1])
      }
    } else if (filter.groupId.startsWith('spec_')) {
      const specKey = filter.groupId.replace('spec_', '')
      if (!updates.specs) updates.specs = {}
      updates.specs[specKey] = filter.values
    }
  }

  return updates
}
