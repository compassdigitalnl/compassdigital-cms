/**
 * useProductFilters Hook
 * Manages product filtering, sorting, and attribute extraction
 */

import { useMemo } from 'react'
import type { Product } from '@/payload-types'
import type { ExtendedProduct, AttributeFieldNames, ExtractedAttributes } from './types'
import type { ActiveFilter } from '@/branches/ecommerce/components/shop/FilterSidebar/types'
import {
  getBrandName,
  extractAttributeValues,
  hasAttributeValue,
  getStockStatus,
} from './utils'

interface UseProductFiltersProps {
  products: (Product | ExtendedProduct)[]
  activeFilters: ActiveFilter[]
  sortBy: string
  attributeNames: AttributeFieldNames
}

interface UseProductFiltersReturn {
  filteredProducts: (Product | ExtendedProduct)[]
  extractedAttributes: ExtractedAttributes
  filterCounts: {
    inStock: number
    lowStock: number
    outOfStock: number
  }
}

export function useProductFilters({
  products,
  activeFilters,
  sortBy,
  attributeNames,
}: UseProductFiltersProps): UseProductFiltersReturn {
  // ============================================
  // EXTRACT UNIQUE ATTRIBUTES (Memoized)
  // ============================================

  const extractedAttributes = useMemo<ExtractedAttributes>(() => {
    const brands = new Set<string>()
    const materials = new Set<string>()
    const sizes = new Set<string>()
    const colors = new Set<string>()

    products.forEach(product => {
      // Extract brand
      const brandName = getBrandName(product.brand)
      if (brandName) brands.add(brandName)

      // Extract specifications
      const extProduct = product as ExtendedProduct
      if (extProduct.specifications) {
        // Materials
        extractAttributeValues(extProduct.specifications, attributeNames.material).forEach(v =>
          materials.add(v),
        )

        // Sizes
        extractAttributeValues(extProduct.specifications, attributeNames.size).forEach(v =>
          sizes.add(v),
        )

        // Colors
        extractAttributeValues(extProduct.specifications, attributeNames.color).forEach(v =>
          colors.add(v),
        )
      }
    })

    return {
      brands: Array.from(brands).sort(),
      materials: Array.from(materials).sort(),
      sizes: Array.from(sizes).sort(),
      colors: Array.from(colors).sort(),
    }
  }, [products, attributeNames])

  // ============================================
  // FILTER COUNTS (Memoized)
  // ============================================

  const filterCounts = useMemo(() => {
    let inStock = 0
    let lowStock = 0
    let outOfStock = 0

    products.forEach(product => {
      const status = getStockStatus(product.stock)
      if (status === 'in-stock') inStock++
      else if (status === 'low') lowStock++
      else outOfStock++
    })

    return { inStock, lowStock, outOfStock }
  }, [products])

  // ============================================
  // FILTERING & SORTING (Memoized)
  // ============================================

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Apply active filters
    for (const filter of activeFilters) {
      switch (filter.groupId) {
        case 'brands':
          result = result.filter(p => filter.values.includes(getBrandName(p.brand) || ''))
          break

        case 'materials':
          result = result.filter(p =>
            hasAttributeValue(
              (p as ExtendedProduct).specifications,
              attributeNames.material,
              filter.values[0], // At least one value matches
            ),
          )
          break

        case 'sizes':
          result = result.filter(p =>
            filter.values.some(value =>
              hasAttributeValue(
                (p as ExtendedProduct).specifications,
                attributeNames.size,
                value,
              ),
            ),
          )
          break

        case 'colors':
          result = result.filter(p =>
            filter.values.some(value =>
              hasAttributeValue(
                (p as ExtendedProduct).specifications,
                attributeNames.color,
                value,
              ),
            ),
          )
          break

        case 'stock':
          result = result.filter(p => {
            const status = getStockStatus(p.stock)
            return (
              (filter.values.includes('in-stock') && status === 'in-stock') ||
              (filter.values.includes('low') && status === 'low') ||
              (filter.values.includes('out') && status === 'out')
            )
          })
          break

        case 'price':
          if (filter.values.length === 2) {
            const min = parseFloat(filter.values[0])
            const max = parseFloat(filter.values[1])
            result = result.filter(p => p.price >= min && p.price <= max)
          }
          break
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break

      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break

      case 'newest':
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        break

      case 'rating':
        result.sort((a, b) => {
          const aRating = (a as ExtendedProduct).rating?.average || 0
          const bRating = (b as ExtendedProduct).rating?.average || 0
          return bRating - aRating
        })
        break

      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break

      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title))
        break

      default:
        // 'relevance' — keep original order
        break
    }

    return result
  }, [products, activeFilters, sortBy, attributeNames])

  return {
    filteredProducts,
    extractedAttributes,
    filterCounts,
  }
}
