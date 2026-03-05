/**
 * Reconciliation Service
 *
 * Ensures data consistency between Payload CMS and Listmonk
 * Detects and fixes discrepancies automatically
 *
 * Run via cron job: every 15 minutes (cron: "star/15 * * * *")
 */

import type { Payload } from 'payload'
import { ResilientListmonkClient } from '../listmonk/retry-wrapper'
import type { ListmonkSubscriber } from '@/features/email-marketing/types/listmonk'

/**
 * Reconciliation result
 */
export interface ReconciliationResult {
  startTime: Date
  endTime: Date
  duration: number // milliseconds
  tenantsProcessed: number
  discrepancies: {
    subscribersOnlyInPayload: number
    subscribersOnlyInListmonk: number
    subscribersMismatch: number
    listsOnlyInPayload: number
    listsOnlyInListmonk: number
  }
  fixes: {
    subscribersCreated: number
    subscribersUpdated: number
    subscribersDeleted: number
    listsCreated: number
    listsUpdated: number
    listsDeleted: number
  }
  errors: Array<{
    type: string
    message: string
    tenant?: string
    itemId?: string
  }>
}

/**
 * Reconciliation Service
 */
export class ReconciliationService {
  private payload: Payload
  private listmonk: ResilientListmonkClient
  private dryRun: boolean

  constructor(payload: Payload, dryRun: boolean = false) {
    this.payload = payload
    this.listmonk = new ResilientListmonkClient()
    this.dryRun = dryRun
  }

  /**
   * Run full reconciliation for all tenants
   */
  async reconcileAll(): Promise<ReconciliationResult> {
    const startTime = new Date()
    const result: ReconciliationResult = {
      startTime,
      endTime: new Date(),
      duration: 0,
      tenantsProcessed: 0,
      discrepancies: {
        subscribersOnlyInPayload: 0,
        subscribersOnlyInListmonk: 0,
        subscribersMismatch: 0,
        listsOnlyInPayload: 0,
        listsOnlyInListmonk: 0,
      },
      fixes: {
        subscribersCreated: 0,
        subscribersUpdated: 0,
        subscribersDeleted: 0,
        listsCreated: 0,
        listsUpdated: 0,
        listsDeleted: 0,
      },
      errors: [],
    }

    try {
      // Get all tenants
      const tenants = await this.payload.find({
        collection: 'clients',
        limit: 1000,
      })

      for (const tenant of tenants.docs) {
        try {
          const tenantResult = await this.reconcileTenant(String(tenant.id))

          // Aggregate results
          result.tenantsProcessed++
          result.discrepancies.subscribersOnlyInPayload += tenantResult.discrepancies.subscribersOnlyInPayload
          result.discrepancies.subscribersOnlyInListmonk += tenantResult.discrepancies.subscribersOnlyInListmonk
          result.discrepancies.subscribersMismatch += tenantResult.discrepancies.subscribersMismatch
          result.discrepancies.listsOnlyInPayload += tenantResult.discrepancies.listsOnlyInPayload
          result.discrepancies.listsOnlyInListmonk += tenantResult.discrepancies.listsOnlyInListmonk

          result.fixes.subscribersCreated += tenantResult.fixes.subscribersCreated
          result.fixes.subscribersUpdated += tenantResult.fixes.subscribersUpdated
          result.fixes.subscribersDeleted += tenantResult.fixes.subscribersDeleted
          result.fixes.listsCreated += tenantResult.fixes.listsCreated
          result.fixes.listsUpdated += tenantResult.fixes.listsUpdated
          result.fixes.listsDeleted += tenantResult.fixes.listsDeleted

          result.errors.push(...tenantResult.errors)
        } catch (error) {
          result.errors.push({
            type: 'tenant_reconciliation_failed',
            message: error instanceof Error ? error.message : String(error),
            tenant: String(tenant.id),
          })
        }
      }
    } catch (error) {
      result.errors.push({
        type: 'reconciliation_failed',
        message: error instanceof Error ? error.message : String(error),
      })
    }

    const endTime = new Date()
    result.endTime = endTime
    result.duration = endTime.getTime() - startTime.getTime()

    // Log summary
    this.logSummary(result)

    // Store reconciliation report
    await this.storeReport(result)

    return result
  }

  /**
   * Reconcile data for a specific tenant
   */
  async reconcileTenant(tenantId: string): Promise<ReconciliationResult> {
    const startTime = new Date()
    const result: ReconciliationResult = {
      startTime,
      endTime: new Date(),
      duration: 0,
      tenantsProcessed: 1,
      discrepancies: {
        subscribersOnlyInPayload: 0,
        subscribersOnlyInListmonk: 0,
        subscribersMismatch: 0,
        listsOnlyInPayload: 0,
        listsOnlyInListmonk: 0,
      },
      fixes: {
        subscribersCreated: 0,
        subscribersUpdated: 0,
        subscribersDeleted: 0,
        listsCreated: 0,
        listsUpdated: 0,
        listsDeleted: 0,
      },
      errors: [],
    }

    try {
      // Reconcile subscribers
      const subscriberResult = await this.reconcileSubscribers(tenantId)
      result.discrepancies.subscribersOnlyInPayload = subscriberResult.onlyInPayload.length
      result.discrepancies.subscribersOnlyInListmonk = subscriberResult.onlyInListmonk.length
      result.discrepancies.subscribersMismatch = subscriberResult.mismatches.length

      if (!this.dryRun) {
        // Fix discrepancies
        const fixes = await this.fixSubscriberDiscrepancies(tenantId, subscriberResult)
        result.fixes.subscribersCreated = fixes.created
        result.fixes.subscribersUpdated = fixes.updated
        result.fixes.subscribersDeleted = fixes.deleted
      }

      // Reconcile lists
      const listResult = await this.reconcileLists(tenantId)
      result.discrepancies.listsOnlyInPayload = listResult.onlyInPayload.length
      result.discrepancies.listsOnlyInListmonk = listResult.onlyInListmonk.length

      if (!this.dryRun) {
        // Fix discrepancies
        const fixes = await this.fixListDiscrepancies(tenantId, listResult)
        result.fixes.listsCreated = fixes.created
        result.fixes.listsUpdated = fixes.updated
        result.fixes.listsDeleted = fixes.deleted
      }
    } catch (error) {
      result.errors.push({
        type: 'tenant_reconciliation_failed',
        message: error instanceof Error ? error.message : String(error),
        tenant: tenantId,
      })
    }

    const endTime = new Date()
    result.endTime = endTime
    result.duration = endTime.getTime() - startTime.getTime()

    return result
  }

  /**
   * Reconcile subscribers for a tenant
   */
  private async reconcileSubscribers(tenantId: string): Promise<{
    onlyInPayload: string[]
    onlyInListmonk: number[]
    mismatches: Array<{ payloadId: string; listmonkId: number; reason: string }>
  }> {
    // Get all subscribers from Payload
    const payloadSubscribers = await this.payload.find({
      collection: 'email-subscribers',
      where: {
        tenant: { equals: tenantId },
      },
      limit: 10000,
    })

    // Get all subscribers from Listmonk (filtered by tenant attribute)
    const listmonkResponse = await this.listmonk.listSubscribers({ page: 1, per_page: 10000 })
    const listmonkSubscribers = listmonkResponse.data.results.filter(
      (sub) => sub.attribs?.tenant_id === tenantId,
    )

    // Build maps for comparison
    const payloadMap = new Map(
      payloadSubscribers.docs.map((sub) => [sub.email.toLowerCase(), sub]),
    )
    const listmonkMap = new Map(
      listmonkSubscribers.map((sub) => [sub.email.toLowerCase(), sub]),
    )

    const onlyInPayload: string[] = []
    const onlyInListmonk: number[] = []
    const mismatches: Array<{ payloadId: string; listmonkId: number; reason: string }> = []

    // Find subscribers only in Payload
    for (const [email, payloadSub] of payloadMap.entries()) {
      if (!listmonkMap.has(email)) {
        onlyInPayload.push(String(payloadSub.id))
      } else {
        // Check for mismatches
        const listmonkSub = listmonkMap.get(email)!
        if (payloadSub.name !== listmonkSub.name) {
          mismatches.push({
            payloadId: String(payloadSub.id),
            listmonkId: listmonkSub.id!,
            reason: 'name_mismatch',
          })
        }
        if (payloadSub.status !== listmonkSub.status) {
          mismatches.push({
            payloadId: String(payloadSub.id),
            listmonkId: listmonkSub.id!,
            reason: 'status_mismatch',
          })
        }
      }
    }

    // Find subscribers only in Listmonk
    for (const [email, listmonkSub] of listmonkMap.entries()) {
      if (!payloadMap.has(email)) {
        onlyInListmonk.push(listmonkSub.id!)
      }
    }

    return { onlyInPayload, onlyInListmonk, mismatches }
  }

  /**
   * Fix subscriber discrepancies
   */
  private async fixSubscriberDiscrepancies(
    tenantId: string,
    discrepancies: {
      onlyInPayload: string[]
      onlyInListmonk: number[]
      mismatches: Array<{ payloadId: string; listmonkId: number; reason: string }>
    },
  ): Promise<{ created: number; updated: number; deleted: number }> {
    let created = 0
    let updated = 0
    let deleted = 0

    // Create missing subscribers in Listmonk
    for (const payloadId of discrepancies.onlyInPayload) {
      try {
        const subscriber = await this.payload.findByID({
          collection: 'email-subscribers',
          id: payloadId,
        })

        const customFields = subscriber.customFields && typeof subscriber.customFields === 'object'
          ? subscriber.customFields
          : {}

        const listmonkSub: ListmonkSubscriber = {
          email: subscriber.email,
          name: subscriber.name,
          status: subscriber.status as 'enabled' | 'disabled' | 'blocklisted',
          lists: [], // Will be synced separately
          attribs: {
            tenant_id: tenantId,
            ...customFields,
          },
        }

        const response = await this.listmonk.createSubscriber(listmonkSub, { reconciliation: true })

        // Update Payload with Listmonk ID
        await this.payload.update({
          collection: 'email-subscribers',
          id: payloadId,
          data: {
            listmonkId: response.data.id,
            syncStatus: 'synced',
            lastSyncedAt: new Date().toISOString(),
          },
        })

        created++
      } catch (error) {
        console.error(`[Reconciliation] Failed to create subscriber ${payloadId} in Listmonk:`, error)
      }
    }

    // Delete orphaned subscribers from Listmonk
    for (const listmonkId of discrepancies.onlyInListmonk) {
      try {
        await this.listmonk.deleteSubscriber(listmonkId, { reconciliation: true })
        deleted++
      } catch (error) {
        console.error(`[Reconciliation] Failed to delete subscriber ${listmonkId} from Listmonk:`, error)
      }
    }

    // Fix mismatches (Payload is source of truth)
    for (const mismatch of discrepancies.mismatches) {
      try {
        const subscriber = await this.payload.findByID({
          collection: 'email-subscribers',
          id: mismatch.payloadId,
        })

        await this.listmonk.updateSubscriber(
          mismatch.listmonkId,
          {
            name: subscriber.name,
            status: subscriber.status as 'enabled' | 'disabled' | 'blocklisted',
          },
          { reconciliation: true },
        )

        // Update sync timestamp
        await this.payload.update({
          collection: 'email-subscribers',
          id: mismatch.payloadId,
          data: {
            syncStatus: 'synced',
            lastSyncedAt: new Date().toISOString(),
          },
        })

        updated++
      } catch (error) {
        console.error(`[Reconciliation] Failed to fix mismatch for subscriber ${mismatch.payloadId}:`, error)
      }
    }

    return { created, updated, deleted }
  }

  /**
   * Reconcile lists for a tenant
   */
  private async reconcileLists(tenantId: string): Promise<{
    onlyInPayload: string[]
    onlyInListmonk: number[]
  }> {
    // Get all lists from Payload
    const payloadLists = await this.payload.find({
      collection: 'email-lists',
      where: {
        tenant: { equals: tenantId },
      },
      limit: 1000,
    })

    // Get all lists from Listmonk (filtered by tenant tag)
    const listmonkResponse = await this.listmonk.listLists({ page: 1, per_page: 1000 })
    // Handle both array and object with results property
    const listmonkListsRaw = Array.isArray(listmonkResponse.data)
      ? listmonkResponse.data
      : (listmonkResponse.data as any).results || []
    const listmonkLists = listmonkListsRaw.filter((list: any) =>
      list.tags?.includes(`tenant:${tenantId}`),
    )

    // Build maps
    const payloadMap = new Map(payloadLists.docs.map((list: any) => [list.name, list]))
    const listmonkMap = new Map(listmonkLists.map((list: any) => [list.name, list]))

    const onlyInPayload: string[] = []
    const onlyInListmonk: number[] = []

    for (const [name, payloadList] of payloadMap.entries()) {
      if (!listmonkMap.has(name)) {
        onlyInPayload.push(String(payloadList.id))
      }
    }

    for (const [name, listmonkList] of listmonkMap.entries()) {
      if (!payloadMap.has(name)) {
        const lmList = listmonkList as any
        if (lmList.id) {
          onlyInListmonk.push(lmList.id)
        }
      }
    }

    return { onlyInPayload, onlyInListmonk }
  }

  /**
   * Fix list discrepancies
   */
  private async fixListDiscrepancies(
    tenantId: string,
    discrepancies: {
      onlyInPayload: string[]
      onlyInListmonk: number[]
    },
  ): Promise<{ created: number; updated: number; deleted: number }> {
    let created = 0
    let deleted = 0

    // Create missing lists in Listmonk
    for (const payloadId of discrepancies.onlyInPayload) {
      try {
        const list = await this.payload.findByID({
          collection: 'email-lists',
          id: payloadId,
        })

        // Convert tags to string array
        const tagList = list.tags && Array.isArray(list.tags)
          ? list.tags
              .map((t: any) => (typeof t === 'string' ? t : t?.tag))
              .filter((t: any): t is string => typeof t === 'string')
          : []

        const response = await this.listmonk.createList(
          {
            name: list.name,
            type: list.type as 'public' | 'private',
            optin: 'single',
            tags: [`tenant:${tenantId}`, ...tagList],
          },
          { reconciliation: true },
        )

        // Update Payload with Listmonk ID
        await this.payload.update({
          collection: 'email-lists',
          id: payloadId,
          data: {
            listmonkId: response.data.id,
            syncStatus: 'synced',
            lastSyncedAt: new Date().toISOString(),
          },
        })

        created++
      } catch (error) {
        console.error(`[Reconciliation] Failed to create list ${payloadId} in Listmonk:`, error)
      }
    }

    // Delete orphaned lists from Listmonk
    for (const listmonkId of discrepancies.onlyInListmonk) {
      try {
        await this.listmonk.deleteList(listmonkId, { reconciliation: true })
        deleted++
      } catch (error) {
        console.error(`[Reconciliation] Failed to delete list ${listmonkId} from Listmonk:`, error)
      }
    }

    return { created, updated: 0, deleted }
  }

  /**
   * Log reconciliation summary
   */
  private logSummary(result: ReconciliationResult): void {
    console.log('\n' + '═'.repeat(80))
    console.log('📊 RECONCILIATION SUMMARY')
    console.log('═'.repeat(80))
    console.log(`Duration: ${result.duration}ms`)
    console.log(`Tenants Processed: ${result.tenantsProcessed}`)
    console.log('\nDiscrepancies Found:')
    console.log(`  Subscribers only in Payload: ${result.discrepancies.subscribersOnlyInPayload}`)
    console.log(`  Subscribers only in Listmonk: ${result.discrepancies.subscribersOnlyInListmonk}`)
    console.log(`  Subscriber mismatches: ${result.discrepancies.subscribersMismatch}`)
    console.log(`  Lists only in Payload: ${result.discrepancies.listsOnlyInPayload}`)
    console.log(`  Lists only in Listmonk: ${result.discrepancies.listsOnlyInListmonk}`)
    console.log('\nFixes Applied:')
    console.log(`  Subscribers created: ${result.fixes.subscribersCreated}`)
    console.log(`  Subscribers updated: ${result.fixes.subscribersUpdated}`)
    console.log(`  Subscribers deleted: ${result.fixes.subscribersDeleted}`)
    console.log(`  Lists created: ${result.fixes.listsCreated}`)
    console.log(`  Lists updated: ${result.fixes.listsUpdated}`)
    console.log(`  Lists deleted: ${result.fixes.listsDeleted}`)
    console.log(`\nErrors: ${result.errors.length}`)
    if (result.errors.length > 0) {
      result.errors.forEach((error, i) => {
        console.log(`  ${i + 1}. [${error.type}] ${error.message}`)
      })
    }
    console.log('═'.repeat(80) + '\n')
  }

  /**
   * Store reconciliation report
   */
  private async storeReport(result: ReconciliationResult): Promise<void> {
    try {
      // Store report as a generic event - skip type validation
      await (this.payload.create as any)({
        collection: 'email-events',
        data: {
          type: 'sent',
          metadata: {
            reconciliation: true,
            report: result,
          } as any,
          createdAt: new Date().toISOString(),
        },
      })
    } catch (error) {
      console.error('[Reconciliation] Failed to store report:', error)
    }
  }
}
