/**
 * Inventory Reconciliation Logic
 *
 * Compares stock levels between Hub and child webshops.
 * Detects discrepancies and generates correction actions.
 *
 * Used by the reconciliation scheduler and the manual reconciliation UI.
 */

import type { Payload } from 'payload'
import { getResilientClient } from './resilient-client'
import type { PayloadAPIListResponse, PayloadAPIResponse } from './types'

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface StockDiscrepancy {
  productId: number
  hubMasterSku: string
  productTitle: string
  siteId: number
  siteName: string
  remoteProductId: number
  hubStock: number
  childStock: number
  difference: number
  hubStockStatus: string
  childStockStatus: string
}

export interface ReconciliationResult {
  siteId: number
  siteName: string
  totalProducts: number
  inSync: number
  outOfSync: number
  discrepancies: StockDiscrepancy[]
  errors: string[]
  duration: number
}

export interface InventorySnapshot {
  productId: number
  title: string
  sku: string
  hubMasterSku: string
  hubStock: number
  hubStockStatus: string
  sites: Array<{
    siteId: number
    siteName: string
    remoteProductId: number
    stock: number
    stockStatus: string
    inSync: boolean
  }>
}

// ═══════════════════════════════════════════════════════════
// RECONCILIATION
// ═══════════════════════════════════════════════════════════

/**
 * Compare stock levels for a single site against the Hub
 */
export async function reconcileSiteInventory(
  payload: Payload,
  siteId: number,
): Promise<ReconciliationResult> {
  const start = Date.now()
  const errors: string[] = []

  // Get site config
  const site = await payload.findByID({
    collection: 'multistore-sites' as any,
    id: siteId,
    depth: 0,
  })

  if (!site || (site as any).status !== 'active') {
    return {
      siteId,
      siteName: (site as any)?.name || 'Unknown',
      totalProducts: 0,
      inSync: 0,
      outOfSync: 0,
      discrepancies: [],
      errors: ['Site not found or not active'],
      duration: Date.now() - start,
    }
  }

  const client = getResilientClient(siteId, {
    apiUrl: (site as any).apiUrl,
    apiKey: (site as any).apiKey,
    webhookSecret: (site as any).webhookSecret,
    siteName: (site as any).name,
  })

  // Get all products distributed to this site
  const hubProducts = await payload.find({
    collection: 'products',
    where: {
      and: [
        { multistoreSyncEnabled: { equals: true } },
        { trackStock: { equals: true } },
      ],
    },
    limit: 10000,
    depth: 0,
    overrideAccess: true,
  })

  const discrepancies: StockDiscrepancy[] = []
  let inSync = 0
  let totalProducts = 0

  for (const product of hubProducts.docs) {
    const distributedTo = (product as any).distributedTo as any[] | undefined
    if (!distributedTo) continue

    const siteEntry = distributedTo.find((e: any) => {
      const sid = typeof e.site === 'object' ? e.site?.id : e.site
      return sid === siteId
    })

    if (!siteEntry?.remoteProductId) continue

    totalProducts++

    try {
      // Fetch the product from the child site
      const remoteProduct = await client.execute<PayloadAPIResponse>(
        (c) => c.getProduct(siteEntry.remoteProductId),
        `get product ${siteEntry.remoteProductId}`,
      )

      const remoteDoc = remoteProduct.doc as any
      const hubStock = (product as any).stock ?? 0
      const childStock = remoteDoc?.stock ?? 0
      const hubStockStatus = (product as any).stockStatus || 'in-stock'
      const childStockStatus = remoteDoc?.stockStatus || 'in-stock'

      if (hubStock === childStock && hubStockStatus === childStockStatus) {
        inSync++
      } else {
        discrepancies.push({
          productId: product.id as number,
          hubMasterSku: (product as any).hubMasterSku || product.sku || '',
          productTitle: product.title || 'Unknown',
          siteId,
          siteName: (site as any).name,
          remoteProductId: siteEntry.remoteProductId,
          hubStock,
          childStock,
          difference: hubStock - childStock,
          hubStockStatus,
          childStockStatus,
        })
      }
    } catch (error) {
      errors.push(
        `Failed to check product ${product.id} on ${(site as any).name}: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  return {
    siteId,
    siteName: (site as any).name,
    totalProducts,
    inSync,
    outOfSync: discrepancies.length,
    discrepancies,
    errors,
    duration: Date.now() - start,
  }
}

/**
 * Fix discrepancies by pushing Hub stock to children
 * (Hub = authoritative for stock levels)
 */
export async function fixDiscrepancies(
  payload: Payload,
  discrepancies: StockDiscrepancy[],
): Promise<{ fixed: number; failed: number; errors: string[] }> {
  let fixed = 0
  let failed = 0
  const errors: string[] = []

  // Group by site for efficient client reuse
  const bySite = new Map<number, StockDiscrepancy[]>()
  for (const d of discrepancies) {
    const list = bySite.get(d.siteId) || []
    list.push(d)
    bySite.set(d.siteId, list)
  }

  for (const [siteId, siteDiscrepancies] of bySite) {
    const site = await payload.findByID({
      collection: 'multistore-sites' as any,
      id: siteId,
      depth: 0,
    })

    if (!site) {
      errors.push(`Site ${siteId} not found`)
      failed += siteDiscrepancies.length
      continue
    }

    const client = getResilientClient(siteId, {
      apiUrl: (site as any).apiUrl,
      apiKey: (site as any).apiKey,
      webhookSecret: (site as any).webhookSecret,
      siteName: (site as any).name,
    })

    for (const d of siteDiscrepancies) {
      try {
        await client.execute(
          (c) => c.updateStock(d.remoteProductId, d.hubStock, d.hubStockStatus),
          `fix stock ${d.remoteProductId}`,
        )
        fixed++

        // Log the fix
        await payload.create({
          collection: 'multistore-sync-log' as any,
          data: {
            site: siteId,
            direction: 'hub-to-child',
            entityType: 'inventory',
            entityId: String(d.productId),
            operation: 'update',
            status: 'success',
            requestPayload: {
              action: 'reconciliation-fix',
              hubStock: d.hubStock,
              childStock: d.childStock,
              hubStockStatus: d.hubStockStatus,
            },
          },
          overrideAccess: true,
        }).catch(() => {})
      } catch (error) {
        failed++
        errors.push(
          `Failed to fix product ${d.productId} on site ${d.siteName}: ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    }
  }

  return { fixed, failed, errors }
}

/**
 * Build a full inventory snapshot across all sites (for the admin UI matrix)
 */
export async function buildInventorySnapshot(
  payload: Payload,
): Promise<InventorySnapshot[]> {
  // Get all active sites
  const sitesResult = await payload.find({
    collection: 'multistore-sites' as any,
    where: { status: { equals: 'active' } },
    limit: 100,
    depth: 0,
    overrideAccess: true,
  })
  const sites = sitesResult.docs

  // Get all sync-enabled products with stock tracking
  const productsResult = await payload.find({
    collection: 'products',
    where: {
      and: [
        { multistoreSyncEnabled: { equals: true } },
        { trackStock: { equals: true } },
      ],
    },
    limit: 500,
    depth: 0,
    overrideAccess: true,
  })

  const snapshots: InventorySnapshot[] = []

  for (const product of productsResult.docs) {
    const distributedTo = (product as any).distributedTo as any[] | undefined
    const hubStock = (product as any).stock ?? 0
    const hubStockStatus = (product as any).stockStatus || 'in-stock'

    const siteData: InventorySnapshot['sites'] = []

    for (const site of sites) {
      const entry = distributedTo?.find((e: any) => {
        const sid = typeof e.site === 'object' ? e.site?.id : e.site
        return sid === (site as any).id
      })

      if (entry?.remoteProductId) {
        // We use the last known sync status — real-time fetch is done by reconciliation
        siteData.push({
          siteId: (site as any).id,
          siteName: (site as any).name,
          remoteProductId: entry.remoteProductId,
          stock: hubStock, // Assume in-sync unless reconciliation says otherwise
          stockStatus: hubStockStatus,
          inSync: entry.syncStatus === 'synced',
        })
      }
    }

    snapshots.push({
      productId: product.id as number,
      title: product.title || 'Unknown',
      sku: product.sku || '',
      hubMasterSku: (product as any).hubMasterSku || product.sku || '',
      hubStock,
      hubStockStatus,
      sites: siteData,
    })
  }

  return snapshots
}
