/**
 * Product Types
 * Enterprise-level product types with 63+ fields support
 */

import type { CustomPricingRole } from './wizard'

/**
 * Product - Enterprise Template with 63+ fields
 * Supports B2C, B2B, and Hybrid pricing strategies
 */
export interface Product {
  // === BASIC INFO (20 fields) ===
  id: string
  sku: string
  ean?: string
  upc?: string
  mpn?: string // Manufacturer Part Number
  name: string
  slug: string
  shortDescription?: string
  description: string
  brand?: string
  manufacturer?: string
  model?: string
  categories: string[] // Category IDs
  tags?: string[]
  status: 'draft' | 'active' | 'archived' | 'out-of-stock'
  featured?: boolean
  condition?: 'new' | 'refurbished' | 'used'
  warranty?: string
  releaseDate?: Date
  endOfLife?: Date

  // === PRICING (Dynamic 8-28 fields based on roles) ===
  pricing: {
    // Base pricing (B2C)
    basePrice: number
    salePrice?: number
    costPrice?: number
    msrp?: number // Manufacturer's Suggested Retail Price

    // Tax configuration
    taxClass?: string
    taxRate?: number
    includesTax?: boolean

    // Role-based pricing (B2B/Hybrid)
    rolePrices?: Array<{
      roleId: string
      roleName: string
      price: number
      minQuantity?: number
      maxQuantity?: number
    }>

    // Volume pricing tiers
    volumePricing?: Array<{
      minQuantity: number
      maxQuantity?: number
      price: number
      discountPercentage?: number
    }>

    // Currency support
    currency: string
    alternativeCurrencies?: Array<{
      currency: string
      price: number
    }>
  }

  // === INVENTORY (6 fields) ===
  inventory: {
    trackStock: boolean
    stockQuantity?: number
    lowStockThreshold?: number
    backordersAllowed?: boolean
    stockStatus: 'in-stock' | 'out-of-stock' | 'on-backorder' | 'discontinued'
    availabilityDate?: Date
  }

  // === SHIPPING (5 fields) ===
  shipping: {
    weight?: number
    weightUnit?: 'kg' | 'g' | 'lb' | 'oz'
    dimensions?: {
      length: number
      width: number
      height: number
      unit: 'cm' | 'm' | 'in' | 'ft'
    }
    shippingClass?: string
    freeShipping?: boolean
    handlingTime?: number // Days
  }

  // === MEDIA (5 fields) ===
  media: {
    images: Array<{
      id: string
      url: string
      alt: string
      position: number
      thumbnail?: string
    }>
    videos?: Array<{
      id: string
      url: string
      thumbnail?: string
      platform?: 'youtube' | 'vimeo' | 'custom'
    }>
    documents?: Array<{
      id: string
      url: string
      title: string
      type: 'manual' | 'datasheet' | 'certificate' | 'other'
    }>
    featured_image?: string
    gallery?: string[]
  }

  // === VARIANTS (8 fields) ===
  variants?: {
    hasVariants: boolean
    variantType?: 'single' | 'matrix' // single = dropdown, matrix = grid
    attributes: Array<{
      name: string // e.g., "Color", "Size", "Material"
      slug: string
      values: Array<{
        label: string
        value: string
      }>
      visible?: boolean
      variation?: boolean // Used for variations?
    }>
    combinations: Array<{
      id: string
      sku: string
      attributes: Record<string, string> // e.g., { color: "red", size: "M" }
      price?: number
      stockQuantity?: number
      image?: string
      enabled: boolean
    }>
  }

  // === SEO & MARKETING (4 fields) ===
  seo: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
    canonicalUrl?: string
  }

  // === SPECIFICATIONS (Dynamic 4+ fields) ===
  specifications?: Array<{
    group: string // e.g., "Technical", "Dimensions", "Features"
    attributes: Array<{
      name: string
      value: string
      unit?: string
    }>
  }>

  // === B2B SPECIFIC ===
  b2b?: {
    minOrderQuantity?: number
    maxOrderQuantity?: number
    orderMultiple?: number // Must order in multiples of X
    leadTime?: number // Days
    customizable?: boolean
    quotationRequired?: boolean
    contractPricing?: boolean
  }

  // === CROSS-SELL & UPSELL ===
  related?: {
    crossSells?: string[] // Product IDs
    upSells?: string[] // Product IDs
    accessories?: string[] // Product IDs
    bundles?: Array<{
      id: string
      products: string[]
      discount: number
    }>
  }

  // === METADATA ===
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  updatedBy?: string
  publishedAt?: Date
  views?: number
  sales?: number
}

/**
 * Product Category
 */
export interface ProductCategory {
  id: string
  name: string
  slug: string
  description?: string
  parent?: string // Parent category ID
  image?: string
  level: number // Hierarchy level (0 = root)
  order: number
  visible: boolean
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
  createdAt: Date
  updatedAt: Date
}

/**
 * Product Collection/Group
 */
export interface ProductCollection {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  products: string[] // Product IDs
  rules?: {
    // Auto-include products matching criteria
    categories?: string[]
    tags?: string[]
    brands?: string[]
    priceRange?: {
      min?: number
      max?: number
    }
  }
  featured?: boolean
  visible: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Product Review
 */
export interface ProductReview {
  id: string
  productId: string
  userId?: string
  author: string
  email?: string
  rating: number // 1-5
  title?: string
  content: string
  verified?: boolean // Verified purchase
  helpful?: number // Helpful votes
  status: 'pending' | 'approved' | 'rejected' | 'spam'
  createdAt: Date
  updatedAt: Date
}

/**
 * CSV Import Mapping
 * Maps CSV columns to Product fields (63+ columns)
 */
export interface ProductImportMapping {
  templateType: 'basis' | 'advanced' | 'enterprise'
  columns: Array<{
    csvColumn: string // CSV header name
    productField: string // Dot notation: "pricing.basePrice", "inventory.stockQuantity"
    transform?: 'string' | 'number' | 'boolean' | 'date' | 'json' | 'array'
    required: boolean
    defaultValue?: any
  }>
  options: {
    skipFirstRow: boolean
    delimiter: ',' | ';' | '\t'
    encoding: 'utf-8' | 'latin1'
    updateExisting: boolean // Update by SKU if exists
    createCategories: boolean // Auto-create categories
    createBrands: boolean // Auto-create brands
  }
}
