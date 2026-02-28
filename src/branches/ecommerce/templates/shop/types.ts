/**
 * Shop Template Types
 * Extended types for shop archive and product display
 */

import type { Product, Brand } from '@/payload-types'

// ============================================
// SPECIFICATION TYPES
// ============================================

export interface SpecificationAttribute {
  name: string
  value: string
  unit?: string | null
  id?: string | null
}

export interface SpecificationGroup {
  group: string // Note: Product uses 'group', not 'groupName'
  attributes?: SpecificationAttribute[] | null
  id?: string | null
}

// ============================================
// VOLUME PRICING TYPES
// ============================================

export interface VolumePricingTier {
  minQuantity: number
  price: number
  discount?: number
}

// ============================================
// REVIEW & RATING TYPES
// ============================================

export interface ProductReview {
  id: string
  author: string
  rating: number
  title?: string
  comment: string
  createdAt: string
  verified?: boolean
}

export interface ProductRating {
  average: number
  count: number
  distribution?: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

// ============================================
// IMAGE TYPES
// ============================================

export interface ProductImageObject {
  url: string
  alt: string
  width?: number
  height?: number
}

export interface ProductImage {
  image: ProductImageObject | string
  caption?: string
}

// ============================================
// EXTENDED PRODUCT TYPE
// ============================================

// Note: We don't override Product fields, just add optional fields
// that may or may not be present in the data
export interface ExtendedProduct extends Product {
  // specifications is already in Product with correct type
  // images is already in Product as (number | Media)[] | null
  volumePricing?: VolumePricingTier[]
  reviews?: ProductReview[]
  rating?: ProductRating
}

// ============================================
// ATTRIBUTE FIELD NAMES (Configurable for i18n)
// ============================================

export interface AttributeFieldNames {
  material: string[]  // e.g., ['materiaal', 'material']
  size: string[]      // e.g., ['maat', 'size']
  color: string[]     // e.g., ['kleur', 'color']
}

export const DEFAULT_ATTRIBUTE_NAMES: AttributeFieldNames = {
  material: ['materiaal', 'material'],
  size: ['maat', 'size', 'grootte'],
  color: ['kleur', 'color'],
}

// ============================================
// CONSTANTS
// ============================================

export const SHOP_CONSTANTS = {
  LOW_STOCK_THRESHOLD: 10,
  DEFAULT_MAX_PRICE: 1000,
  PRODUCTS_PER_PAGE: 24,
  MAX_FILTER_OPTIONS: 50,
} as const

// ============================================
// HELPER TYPES
// ============================================

export type BrandValue = string | number | Brand

// ============================================
// FILTER ATTRIBUTE EXTRACTION
// ============================================

export interface ExtractedAttributes {
  brands: string[]
  materials: string[]
  sizes: string[]
  colors: string[]
}
