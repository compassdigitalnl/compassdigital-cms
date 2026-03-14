/**
 * Data Consistency Checks
 *
 * Cross-entity reconciliation between Hub and child webshops.
 * Detects orphaned records, missing sync entries, and data drift.
 *
 * Used by the reconciliation scheduler and admin UI.
 */

import type { Payload } from 'payload'
import { getResilientClient } from './resilient-client'
import type { PayloadAPIListResponse } from './types'

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface ConsistencyIssue {
  type: 'orphaned-product' | 'orphaned-order' | 'missing-on-child' | 'missing-on-hub' | 'data-drift'
  severity: 'warning' | 'error'
  entityType: 'product' | 'order'
  entityId: number | string
  siteId?: number
  siteName?: string
  description: string
}

export interface ReconciliationReport {
  timestamp: string
  duration: number
  sitesChecked: number
  productsChecked: number
  ordersChecked: number
  issues: ConsistencyIssue[]
  summary: {
    totalIssues: number
    warnings: number
    errors: number
  }
}

// ═══════════════════════════════════════════════════════════
// PRODUCT RECONCILIATION
// ═══════════════════════════════════════════════════════════

/**
 * Check product consistency between Hub and a child site.
 * Detects:
 * - Products distributed but missing on child
 * - Products on child with hubProductId that don't exist on Hub
 */
async function reconcileProducts(
  payload: Payload,
  site: any,
): Promise<ConsistencyIssue[]> {
  const issues: ConsistencyIssue[] = []

  const client = getResilientClient(site.id, {
    apiUrl: site.apiUrl,
    apiKey: site.apiKey,
    webhookSecret: site.webhookSecret,
    siteName: site.name,
  })

  // Get Hub products distributed to this site
  const hubProducts = await payload.find({
    collection: 'products',
    where: { multistoreSyncEnabled: { equals: true } },
    limit: 10000,
    depth: 0,
    overrideAccess: true,
  })

  const distributedProductIds = new Set<number>()

  for (const product of hubProducts.docs) {
    const distributedTo = (product as any).distributedTo as any[] | undefined
    if (!distributedTo) continue

    const entry = distributedTo.find((e: any) => {
      const sid = typeof e.site === 'object' ? e.site?.id : e.site
      return sid === site.id
    })

    if (!entry) continue

    distributedProductIds.add(product.id as number)

    if (!entry.remoteProductId) {
      issues.push({
        type: 'missing-on-child',
        severity: 'warning',
        entityType: 'product',
        entityId: product.id,
        siteId: site.id,
        siteName: site.name,
        description: `Product "${product.title}" (${product.id}) is gedistribueerd naar ${site.name} maar heeft geen remoteProductId`,
      })
    }
  }

  // Check child side: products with hubProductId that don't match Hub
  try {
    const childProducts = await client.execute<PayloadAPIListResponse>(
      (c) => c.getProducts({
        where: { hubProductId: { exists: true } },
        limit: 10000,
      }),
      'get child hub products',
    )

    for (const childProduct of childProducts.docs) {
      const hubProductId = (childProduct as any).hubProductId
      if (hubProductId && !distributedProductIds.has(hubProductId)) {
        issues.push({
          type: 'orphaned-product',
          severity: 'warning',
          entityType: 'product',
          entityId: (childProduct as any).id,
          siteId: site.id,
          siteName: site.name,
          description: `Product op ${site.name} verwijst naar Hub product ${hubProductId} dat niet meer gedistribueerd is`,
        })
      }
    }
  } catch (error) {
    issues.push({
      type: 'data-drift',
      severity: 'error',
      entityType: 'product',
      entityId: 'all',
      siteId: site.id,
      siteName: site.name,
      description: `Kan producten op ${site.name} niet ophalen: ${error instanceof Error ? error.message : String(error)}`,
    })
  }

  return issues
}

// ═══════════════════════════════════════════════════════════
// ORDER RECONCILIATION
// ═══════════════════════════════════════════════════════════

/**
 * Check order consistency between Hub and a child site.
 * Detects:
 * - Hub orders with sourceSite that have no matching order on child
 * - Orders on child that were never received by Hub
 */
async function reconcileOrders(
  payload: Payload,
  site: any,
): Promise<ConsistencyIssue[]> {
  const issues: ConsistencyIssue[] = []

  // Get Hub orders from this site
  const hubOrders = await payload.find({
    collection: 'orders',
    where: { sourceSite: { equals: site.id } },
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  })

  // Check for orders without remoteOrderId
  for (const order of hubOrders.docs) {
    if (!(order as any).remoteOrderId) {
      issues.push({
        type: 'data-drift',
        severity: 'warning',
        entityType: 'order',
        entityId: order.id,
        siteId: site.id,
        siteName: site.name,
        description: `Hub order ${(order as any).orderNumber} heeft geen remoteOrderId — kan niet terug gekoppeld worden aan ${site.name}`,
      })
    }
  }

  // Check recent orders on child that might not have arrived
  try {
    const client = getResilientClient(site.id, {
      apiUrl: site.apiUrl,
      apiKey: site.apiKey,
      webhookSecret: site.webhookSecret,
      siteName: site.name,
    })

    // Get last 100 orders from child
    const childOrders = await client.execute<PayloadAPIListResponse>(
      (c) => c.getOrders({ limit: 100, sort: '-createdAt' }),
      'get recent child orders',
    )

    const hubRemoteIds = new Set(
      hubOrders.docs
        .map((o: any) => o.remoteOrderId)
        .filter(Boolean),
    )

    for (const childOrder of childOrders.docs) {
      const childId = (childOrder as any).id
      if (!hubRemoteIds.has(childId)) {
        // Could be a very recent order — only flag if older than 10 minutes
        const createdAt = new Date((childOrder as any).createdAt).getTime()
        const tenMinutesAgo = Date.now() - 10 * 60 * 1000
        if (createdAt < tenMinutesAgo) {
          issues.push({
            type: 'missing-on-hub',
            severity: 'error',
            entityType: 'order',
            entityId: childId,
            siteId: site.id,
            siteName: site.name,
            description: `Order ${(childOrder as any).orderNumber || childId} op ${site.name} is niet ontvangen op de Hub`,
          })
        }
      }
    }
  } catch (error) {
    issues.push({
      type: 'data-drift',
      severity: 'error',
      entityType: 'order',
      entityId: 'all',
      siteId: site.id,
      siteName: site.name,
      description: `Kan orders op ${site.name} niet ophalen: ${error instanceof Error ? error.message : String(error)}`,
    })
  }

  return issues
}

// ═══════════════════════════════════════════════════════════
// FULL RECONCILIATION
// ═══════════════════════════════════════════════════════════

/**
 * Run a complete data consistency check across all active sites
 */
export async function runFullReconciliation(
  payload: Payload,
  options?: { siteId?: number },
): Promise<ReconciliationReport> {
  const start = Date.now()
  const allIssues: ConsistencyIssue[] = []

  // Get sites to check
  let sites: any[]
  if (options?.siteId) {
    const site = await payload.findByID({
      collection: 'multistore-sites' as any,
      id: options.siteId,
      depth: 0,
    })
    sites = site ? [site] : []
  } else {
    const result = await payload.find({
      collection: 'multistore-sites' as any,
      where: { status: { equals: 'active' } },
      limit: 100,
      depth: 0,
      overrideAccess: true,
    })
    sites = result.docs
  }

  let productsChecked = 0
  let ordersChecked = 0

  for (const site of sites) {
    // Product reconciliation
    const productIssues = await reconcileProducts(payload, site)
    allIssues.push(...productIssues)
    productsChecked += productIssues.length

    // Order reconciliation
    const orderIssues = await reconcileOrders(payload, site)
    allIssues.push(...orderIssues)
    ordersChecked += orderIssues.length
  }

  const warnings = allIssues.filter((i) => i.severity === 'warning').length
  const errors = allIssues.filter((i) => i.severity === 'error').length

  return {
    timestamp: new Date().toISOString(),
    duration: Date.now() - start,
    sitesChecked: sites.length,
    productsChecked,
    ordersChecked,
    issues: allIssues,
    summary: {
      totalIssues: allIssues.length,
      warnings,
      errors,
    },
  }
}
