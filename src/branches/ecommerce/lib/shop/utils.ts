/**
 * Shop Template Utilities
 * Helper functions for product data extraction and manipulation
 */

import type { Product } from '@/payload-types'
import type {
  ExtendedProduct,
  BrandValue,
  ProductImageObject,
  SpecificationGroup,
  AttributeFieldNames,
  DEFAULT_ATTRIBUTE_NAMES,
} from './types'

// ============================================
// BRAND EXTRACTION
// ============================================

/**
 * Safely extract brand name from various brand formats
 */
export function getBrandName(brand: BrandValue | undefined | null): string | null {
  if (!brand) return null
  if (typeof brand === 'string') return brand
  if (typeof brand === 'number') return null // Brand ID without populated data
  if (typeof brand === 'object' && 'name' in brand) return brand.name
  return null
}

// ============================================
// IMAGE EXTRACTION
// ============================================

/**
 * Safely extract product image with proper type handling
 * Handles Product.images format: (number | Media)[] | null
 */
export function extractProductImage(
  product: Product | ExtendedProduct,
): ProductImageObject | undefined {
  if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
    return undefined
  }

  const firstImage = product.images[0]

  // If it's just a number (unpopulated relation), we can't get the image
  if (typeof firstImage === 'number') {
    return undefined
  }

  // It should be a Media object at this point
  if (!firstImage || typeof firstImage !== 'object') {
    return undefined
  }

  // Media object should have url field
  const media = firstImage as any // Media type from Payload
  if (!media.url) {
    return undefined
  }

  return {
    url: media.url,
    alt: media.alt || product.title,
    width: media.width,
    height: media.height,
  }
}

// ============================================
// SPECIFICATION EXTRACTION
// ============================================

/**
 * Extract attribute values from specifications by field names
 * Supports multiple field name variations (e.g., 'maat', 'size')
 */
export function extractAttributeValues(
  specifications: SpecificationGroup[] | null | undefined,
  fieldNames: string[],
): string[] {
  if (!Array.isArray(specifications)) return []

  const normalizedFieldNames = fieldNames.map(name => name.toLowerCase())

  const values = specifications.flatMap(group =>
    (group.attributes || [])
      .filter(attr =>
        attr.name && normalizedFieldNames.includes(attr.name.toLowerCase())
      )
      .map(attr => attr.value)
      .filter(Boolean)
  )

  return Array.from(new Set(values))
}

/**
 * Check if product has attribute value
 */
export function hasAttributeValue(
  specifications: SpecificationGroup[] | null | undefined,
  fieldNames: string[],
  value: string,
): boolean {
  if (!Array.isArray(specifications)) return false

  const normalizedFieldNames = fieldNames.map(name => name.toLowerCase())

  return specifications.some(group =>
    (group.attributes || []).some(
      attr =>
        attr.name &&
        normalizedFieldNames.includes(attr.name.toLowerCase()) &&
        attr.value === value,
    ),
  )
}

// ============================================
// STOCK STATUS
// ============================================

/**
 * Determine stock status category (backorder-aware)
 */
export type FullStockStatus = 'in-stock' | 'low' | 'out' | 'on-backorder'

export function getStockStatus(
  stock: number | null | undefined,
  options?: { backordersAllowed?: boolean | null; stockStatus?: string | null },
): FullStockStatus {
  // Explicit backorder state
  if (options?.stockStatus === 'on-backorder' || (options?.backordersAllowed && (stock ?? 0) <= 0)) {
    return 'on-backorder'
  }

  const stockNum = stock ?? 0
  if (stockNum === 0) return 'out'
  if (stockNum < 10) return 'low'
  return 'in-stock'
}

// ============================================
// PRICE CALCULATIONS
// ============================================

/**
 * Get effective price (considering sale price). Returns null if no price available.
 */
export function getEffectivePrice(product: Product | ExtendedProduct): number | null {
  return product.salePrice || product.price || null
}

/**
 * Get compare at price (original price if on sale)
 */
export function getCompareAtPrice(product: Product | ExtendedProduct): number | null {
  return product.salePrice ? (product.price || null) : null
}

/**
 * Null-safe price formatter: returns "€12,34" or fallback string
 */
export function formatPrice(price: number | null | undefined, fallback = 'Prijs op aanvraag'): string {
  if (price == null) return fallback
  return `€${price.toFixed(2).replace('.', ',')}`
}

/**
 * Get the minimum child-product price for a grouped product.
 * Returns null if no children have prices.
 */
export function getGroupedMinPrice(product: Product | ExtendedProduct): number | null {
  if (product.productType !== 'grouped' || !product.childProducts) return null

  const prices: number[] = []
  for (const child of product.childProducts) {
    const p = typeof child.product === 'object' ? child.product : null
    if (p && p.price != null && p.status === 'published') {
      prices.push(p.salePrice || p.price)
    }
  }

  return prices.length > 0 ? Math.min(...prices) : null
}

/**
 * Get display price info for any product type.
 * Returns { label, price } where label may be "Vanaf" for grouped products.
 */
export function getDisplayPrice(product: Product | ExtendedProduct): {
  price: number | null
  label: string | null
} {
  if (product.productType === 'grouped') {
    const minPrice = getGroupedMinPrice(product)
    return { price: minPrice, label: minPrice != null ? 'Vanaf' : null }
  }
  return { price: getEffectivePrice(product), label: null }
}

/**
 * Calculate price range from products (null-safe)
 */
export function getPriceRange(products: (Product | ExtendedProduct)[]): { min: number; max: number } {
  if (products.length === 0) {
    return { min: 0, max: 1000 }
  }

  const prices = products.map(p => p.price).filter((p): p is number => p != null)
  if (prices.length === 0) return { min: 0, max: 1000 }
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}

// ============================================
// URL QUERY PARAMS
// ============================================

/**
 * Build URL with preserved query params
 */
export function buildUrlWithParams(
  basePath: string,
  params: Record<string, string | string[] | undefined>,
): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return

    if (Array.isArray(value)) {
      value.forEach(v => searchParams.append(key, v))
    } else {
      searchParams.set(key, value)
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `${basePath}?${queryString}` : basePath
}

/**
 * Parse filter values from URL params
 */
export function parseFilterFromUrl(searchParams: URLSearchParams, key: string): string[] {
  const values = searchParams.getAll(key)
  return values.filter(Boolean)
}
