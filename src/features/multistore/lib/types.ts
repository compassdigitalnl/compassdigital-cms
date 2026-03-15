/**
 * Multistore Hub — Shared TypeScript Types
 *
 * Type definitions for inter-site communication, sync jobs, and data mapping.
 */

// ═══════════════════════════════════════════════════════════
// CLIENT OPTIONS
// ═══════════════════════════════════════════════════════════

export interface MultistoreClientOptions {
  apiUrl: string
  apiKey: string
  timeout?: number
  webhookSecret?: string
}

// ═══════════════════════════════════════════════════════════
// SITE STATUS
// ═══════════════════════════════════════════════════════════

export type SiteStatus = 'active' | 'paused' | 'disconnected' | 'error'
export type HealthStatus = 'healthy' | 'degraded' | 'down' | 'unknown'
export type SyncStatus = 'synced' | 'outdated' | 'error' | 'pending' | 'local-only'
export type SyncDirection = 'hub-to-child' | 'child-to-hub'
export type SyncOperation = 'create' | 'update' | 'delete'

// ═══════════════════════════════════════════════════════════
// SYNC LOG
// ═══════════════════════════════════════════════════════════

export type SyncEntityType = 'product' | 'order' | 'inventory' | 'fulfillment'

export interface SyncLogEntry {
  site: number | string
  direction: SyncDirection
  entityType: SyncEntityType
  entityId: string
  operation: SyncOperation
  status: 'success' | 'failed' | 'skipped'
  duration?: number
  error?: string
  requestPayload?: Record<string, unknown>
  responsePayload?: Record<string, unknown>
}

// ═══════════════════════════════════════════════════════════
// WORKER JOB TYPES (Discriminated Union)
// ═══════════════════════════════════════════════════════════

export type MultistoreSyncJob =
  | { type: 'sync-product'; data: { productId: number; siteId: number; operation: SyncOperation } }
  | { type: 'sync-product-delete'; data: { productId: number; siteId: number; hubProductId: number } }
  | { type: 'sync-order'; data: { orderId: number; siteId: number; direction: SyncDirection } }
  | { type: 'sync-inventory'; data: { productId: number; siteIds: number[]; stock: number; stockStatus: string } }
  | { type: 'sync-fulfillment'; data: { orderId: number; siteId: number; fulfillmentStatus: string; trackingCode?: string } }
  | { type: 'bulk-product-sync'; data: { siteId: number; productIds?: number[] } }
  | { type: 'bulk-order-fetch'; data: { siteId: number; since?: string } }
  | { type: 'health-check'; data: { siteId: number } }
  | { type: 'reconcile'; data: { siteId?: number; entityType: SyncEntityType } }

// ═══════════════════════════════════════════════════════════
// PAYLOAD API RESPONSE TYPES
// ═══════════════════════════════════════════════════════════

export interface PayloadAPIResponse<T = unknown> {
  doc: T
  message: string
}

export interface PayloadAPIListResponse<T = unknown> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export interface PayloadAPIErrorResponse {
  errors: Array<{
    message: string
    data?: unknown
  }>
}

// ═══════════════════════════════════════════════════════════
// PRODUCT DISTRIBUTION
// ═══════════════════════════════════════════════════════════

export type ProductSyncMode = 'full' | 'operational-only'

/** Fields that are ALWAYS synced regardless of syncMode */
export const OPERATIONAL_FIELDS = [
  'price', 'salePrice', 'stock', 'stockStatus', 'status', 'sku', 'ean', 'weight',
  'hubProductId', 'hubMasterSku', 'syncStatus', 'syncSource', 'lastSyncedAt',
] as const

/** Fields that are only synced in 'full' mode (child controls these in 'operational-only') */
export const CONTENT_FIELDS = [
  'title', 'slug', 'description', 'productType',
  // SEO, images, categories are also content but handled by spread — these are the explicit ones
] as const

export interface ProductDistribution {
  site: number | string
  remoteProductId?: number
  syncStatus: SyncStatus
  lastSyncedAt?: string
  priceOverride?: number
  syncMode?: ProductSyncMode
}

// ═══════════════════════════════════════════════════════════
// ORDER MAPPING (child → hub)
// ═══════════════════════════════════════════════════════════

export interface MappedOrder {
  remoteOrderId: number
  remoteOrderNumber: string
  sourceSiteId: number
  items: Array<{
    hubProductId?: number
    title: string
    sku?: string
    quantity: number
    price: number
    subtotal: number
  }>
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  total: number
  customerEmail?: string
  shippingAddress?: Record<string, unknown>
  billingAddress?: Record<string, unknown>
  status: string
  paymentMethod?: string
  paymentStatus?: string
  notes?: string
}

// ═══════════════════════════════════════════════════════════
// INVENTORY UPDATE
// ═══════════════════════════════════════════════════════════

export interface StockUpdate {
  productId: number
  stock: number
  stockStatus?: string
}

export interface BulkStockUpdate {
  updates: StockUpdate[]
}

// ═══════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════

export interface HealthCheckResult {
  status: 'ok' | 'error'
  message?: string
  responseTime?: number
  version?: string
}
