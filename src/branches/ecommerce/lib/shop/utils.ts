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
 * Determine stock status category
 */
export function getStockStatus(stock: number | null | undefined): 'in-stock' | 'low' | 'out' {
  const stockNum = stock ?? 0

  if (stockNum === 0) return 'out'
  if (stockNum < 10) return 'low'
  return 'in-stock'
}

// ============================================
// PRICE CALCULATIONS
// ============================================

/**
 * Get effective price (considering sale price)
 */
export function getEffectivePrice(product: Product | ExtendedProduct): number {
  return product.salePrice || product.price
}

/**
 * Get compare at price (original price if on sale)
 */
export function getCompareAtPrice(product: Product | ExtendedProduct): number | undefined {
  return product.salePrice ? product.price : undefined
}

/**
 * Calculate price range from products
 */
export function getPriceRange(products: (Product | ExtendedProduct)[]): { min: number; max: number } {
  if (products.length === 0) {
    return { min: 0, max: 1000 }
  }

  const prices = products.map(p => p.price)
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
