/**
 * Email Marketing Reconciliation Service
 *
 * Maintains data consistency between Payload CMS and Listmonk
 *
 * Features:
 * - Syncs subscribers, lists, and campaigns
 * - Detects orphaned records
 * - Fixes data inconsistencies
 * - Scheduled reconciliation via BullMQ
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { ListmonkClient } from '@/features/email-marketing/lib/listmonk/client'
import type { Payload } from 'payload'

// ═══════════════════════════════════════════════════════════
// RECONCILIATION RESULT TYPES
// ═══════════════════════════════════════════════════════════

export interface ReconciliationResult {
  startTime: Date
  endTime: Date
  duration: number
  success: boolean
  errors: ReconciliationError[]
  subscribers: SubscriberReconciliation
  lists: ListReconciliation
  campaigns: CampaignReconciliation
  summary: ReconciliationSummary
}

export interface ReconciliationError {
  type: 'subscriber' | 'list' | 'campaign'
  operation: string
  id: string | number
  error: string
}

export interface SubscriberReconciliation {
  totalPayload: number
  totalListmonk: number
  synced: number
  created: number
  updated: number
  orphanedPayload: number
  orphanedListmonk: number
  errors: number
}

export interface ListReconciliation {
  totalPayload: number
  totalListmonk: number
  synced: number
  created: number
  updated: number
  orphanedPayload: number
  orphanedListmonk: number
  errors: number
}

export interface CampaignReconciliation {
  totalPayload: number
  totalListmonk: number
  synced: number
  statusUpdated: number
  statsUpdated: number
  orphanedPayload: number
  errors: number
}

export interface ReconciliationSummary {
  totalOperations: number
  successfulOperations: number
  failedOperations: number
  dataConsistency: number // percentage
}

// ═══════════════════════════════════════════════════════════
// RECONCILER CLASS
// ═══════════════════════════════════════════════════════════

export class EmailReconciler {
  private payload: Payload | null = null
  private listmonk: ListmonkClient | null = null

  /**
   * Get or initialize Payload instance
   */
  private async getPayload(): Promise<Payload> {
    if (!this.payload) {
      this.payload = await getPayload({ config })
    }
    return this.payload
  }

  /**
   * Get or initialize Listmonk client
   */
  private getListmonk(): ListmonkClient {
    if (!this.listmonk) {
      const baseUrl = process.env.LISTMONK_API_URL || process.env.LISTMONK_URL
      const username = process.env.LISTMONK_USERNAME || process.env.LISTMONK_API_USER
      const password = process.env.LISTMONK_PASSWORD || process.env.LISTMONK_API_PASS

      this.listmonk = new ListmonkClient({
        baseUrl,
        username,
        password,
      })
    }
    return this.listmonk
  }

  /**
   * Run full reconciliation
   */
  async reconcile(tenantId?: string): Promise<ReconciliationResult> {
    const startTime = new Date()
    const errors: ReconciliationError[] = []

    console.log(`[Reconciliation] Starting at ${startTime.toISOString()}${tenantId ? ` for tenant ${tenantId}` : ' (all tenants)'}`)

    let subscriberResult: SubscriberReconciliation
    let listResult: ListReconciliation
    let campaignResult: CampaignReconciliation

    try {
      // Step 1: Reconcile subscribers
      console.log('[Reconciliation] Step 1/3: Reconciling subscribers...')
      const subscriberDetails = await this.reconcileSubscribers(tenantId)
      subscriberResult = subscriberDetails
      if (subscriberDetails.errorMessages) {
        errors.push(...subscriberDetails.errorMessages.map((e: string) => ({ type: 'subscriber' as const, operation: 'sync', id: 'unknown', error: e })))
      }

      // Step 2: Reconcile lists
      console.log('[Reconciliation] Step 2/3: Reconciling lists...')
      const listDetails = await this.reconcileLists(tenantId)
      listResult = listDetails
      if (listDetails.errorMessages) {
        errors.push(...listDetails.errorMessages.map((e: string) => ({ type: 'list' as const, operation: 'sync', id: 'unknown', error: e })))
      }

      // Step 3: Reconcile campaigns
      console.log('[Reconciliation] Step 3/3: Reconciling campaigns...')
      const campaignDetails = await this.reconcileCampaigns(tenantId)
      campaignResult = campaignDetails
      if (campaignDetails.errorMessages) {
        errors.push(...campaignDetails.errorMessages.map((e: string) => ({ type: 'campaign' as const, operation: 'sync', id: 'unknown', error: e })))
      }

      const endTime = new Date()
      const duration = endTime.getTime() - startTime.getTime()

      // Calculate summary
      const totalOperations =
        subscriberResult.synced + subscriberResult.created + subscriberResult.updated +
        listResult.synced + listResult.created + listResult.updated +
        campaignResult.synced + campaignResult.statusUpdated + campaignResult.statsUpdated

      const failedOperations =
        subscriberResult.errors + listResult.errors + campaignResult.errors

      const successfulOperations = totalOperations - failedOperations

      const dataConsistency = totalOperations > 0
        ? Math.round((successfulOperations / totalOperations) * 100)
        : 100

      const summary: ReconciliationSummary = {
        totalOperations,
        successfulOperations,
        failedOperations,
        dataConsistency,
      }

      console.log('[Reconciliation] ✅ Completed successfully')
      console.log(`[Reconciliation] Duration: ${duration}ms`)
      console.log(`[Reconciliation] Data consistency: ${dataConsistency}%`)
      console.log(`[Reconciliation] Subscribers: ${subscriberResult.synced} synced, ${subscriberResult.created} created, ${subscriberResult.updated} updated`)
      console.log(`[Reconciliation] Lists: ${listResult.synced} synced, ${listResult.created} created, ${listResult.updated} updated`)
      console.log(`[Reconciliation] Campaigns: ${campaignResult.synced} synced, ${campaignResult.statusUpdated} status updated`)

      return {
        startTime,
        endTime,
        duration,
        success: errors.length === 0,
        errors,
        subscribers: subscriberResult,
        lists: listResult,
        campaigns: campaignResult,
        summary,
      }
    } catch (error: any) {
      console.error('[Reconciliation] ❌ Fatal error:', error)
      throw error
    }
  }

  /**
   * Reconcile subscribers between Payload and Listmonk
   */
  private async reconcileSubscribers(tenantId?: string): Promise<SubscriberReconciliation & { errorMessages?: string[] }> {
    const payload = await this.getPayload()
    const listmonk = this.getListmonk()
    const errors: string[] = []

    let synced = 0
    let created = 0
    let updated = 0
    let orphanedPayload = 0
    let orphanedListmonk = 0

    try {
      // Get all subscribers from Payload
      const where: any = { listmonkId: { exists: true } }
      if (tenantId) {
        where.tenant = { equals: tenantId }
      }

      const payloadSubscribers = await payload.find({
        collection: 'email-subscribers',
        where,
        limit: 10000,
      })

      console.log(`[Reconciliation] Found ${payloadSubscribers.docs.length} subscribers in Payload`)

      // Get all subscribers from Listmonk
      const listmonkResponse = await listmonk.getSubscribers({ per_page: 10000 })
      const listmonkSubscribers = listmonkResponse.data.results || []

      console.log(`[Reconciliation] Found ${listmonkSubscribers.length} subscribers in Listmonk`)

      // Create lookup map for Listmonk subscribers
      const listmonkMap = new Map(
        listmonkSubscribers.map((sub: any) => [sub.id, sub])
      )

      // Reconcile each Payload subscriber
      for (const payloadSub of payloadSubscribers.docs) {
        try {
          const listmonkSub = listmonkMap.get(payloadSub.listmonkId)

          if (!listmonkSub) {
            // Orphaned in Payload (exists in Payload but not in Listmonk)
            orphanedPayload++
            console.warn(`[Reconciliation] Orphaned subscriber in Payload: ${payloadSub.email} (Listmonk ID: ${payloadSub.listmonkId})`)

            // Option 1: Re-create in Listmonk (uncomment if needed)
            // const newSub = await listmonk.createSubscriber({ ... })
            // updated++

            // Option 2: Clear Listmonk ID in Payload (current approach)
            await payload.update({
              collection: 'email-subscribers',
              id: payloadSub.id,
              data: {
                listmonkId: null as any,
                syncStatus: 'pending',
              },
            })
            continue
          }

          // Check if data matches
          const needsUpdate =
            payloadSub.email !== listmonkSub.email ||
            payloadSub.name !== listmonkSub.name ||
            payloadSub.status !== listmonkSub.status

          if (needsUpdate) {
            // Update Listmonk to match Payload
            if (payloadSub.listmonkId) {
              await listmonk.updateSubscriber(payloadSub.listmonkId, {
                email: payloadSub.email,
                name: payloadSub.name || '',
                status: payloadSub.status,
              })
              updated++
              console.log(`[Reconciliation] Updated subscriber: ${payloadSub.email}`)
            }
          } else {
            synced++
          }

          // Remove from map (to detect orphaned Listmonk subscribers)
          listmonkMap.delete(payloadSub.listmonkId)
        } catch (error: any) {
          errors.push(`Failed to reconcile subscriber ${payloadSub.email}: ${error.message}`)
          console.error(`[Reconciliation] Error reconciling ${payloadSub.email}:`, error)
        }
      }

      // Remaining in map are orphaned in Listmonk
      orphanedListmonk = listmonkMap.size
      if (orphanedListmonk > 0) {
        console.warn(`[Reconciliation] Found ${orphanedListmonk} orphaned subscribers in Listmonk (not in Payload)`)
        // Option: Import into Payload or delete from Listmonk
      }

      return {
        totalPayload: payloadSubscribers.docs.length,
        totalListmonk: listmonkSubscribers.length,
        synced,
        created,
        updated,
        orphanedPayload,
        orphanedListmonk,
        errors: errors.length,
        errorMessages: errors,
      }
    } catch (error: any) {
      errors.push(`Fatal error in subscriber reconciliation: ${error.message}`)
      throw error
    }
  }

  /**
   * Reconcile lists between Payload and Listmonk
   */
  private async reconcileLists(tenantId?: string): Promise<ListReconciliation & { errorMessages?: string[] }> {
    const payload = await this.getPayload()
    const listmonk = this.getListmonk()
    const errors: string[] = []

    let synced = 0
    let created = 0
    let updated = 0
    let orphanedPayload = 0
    let orphanedListmonk = 0

    try {
      // Get all lists from Payload
      const where: any = { listmonkId: { exists: true } }
      if (tenantId) {
        where.tenant = { equals: tenantId }
      }

      const payloadLists = await payload.find({
        collection: 'email-lists',
        where,
        limit: 1000,
      })

      console.log(`[Reconciliation] Found ${payloadLists.docs.length} lists in Payload`)

      // Get all lists from Listmonk
      const listmonkResponse = await listmonk.getLists()
      const listmonkLists = listmonkResponse.data || []

      console.log(`[Reconciliation] Found ${listmonkLists.length} lists in Listmonk`)

      // Create lookup map
      const listmonkMap = new Map(
        listmonkLists.map((list: any) => [list.id, list])
      )

      // Reconcile each Payload list
      for (const payloadList of payloadLists.docs) {
        try {
          const listmonkList = listmonkMap.get(payloadList.listmonkId)

          if (!listmonkList) {
            // Orphaned in Payload
            orphanedPayload++
            console.warn(`[Reconciliation] Orphaned list in Payload: ${payloadList.name} (Listmonk ID: ${payloadList.listmonkId})`)

            // Clear Listmonk ID
            await payload.update({
              collection: 'email-lists',
              id: payloadList.id,
              data: {
                listmonkId: null as any,
                syncStatus: 'pending',
              },
            })
            continue
          }

          // Check if data matches
          const needsUpdate =
            payloadList.name !== listmonkList.name ||
            payloadList.description !== listmonkList.description

          if (needsUpdate) {
            // Update Listmonk to match Payload
            if (payloadList.listmonkId) {
              await listmonk.updateList(payloadList.listmonkId, {
                name: payloadList.name,
                type: 'public',
                optin: 'double',
                description: payloadList.description || '',
              })
              updated++
              console.log(`[Reconciliation] Updated list: ${payloadList.name}`)
            }
          } else {
            synced++
          }

          if (payloadList.listmonkId) {
            listmonkMap.delete(payloadList.listmonkId)
          }
        } catch (error: any) {
          errors.push(`Failed to reconcile list ${payloadList.name}: ${error.message}`)
          console.error(`[Reconciliation] Error reconciling ${payloadList.name}:`, error)
        }
      }

      orphanedListmonk = listmonkMap.size
      if (orphanedListmonk > 0) {
        console.warn(`[Reconciliation] Found ${orphanedListmonk} orphaned lists in Listmonk`)
      }

      return {
        totalPayload: payloadLists.docs.length,
        totalListmonk: listmonkLists.length,
        synced,
        created,
        updated,
        orphanedPayload,
        orphanedListmonk,
        errors: errors.length,
        errorMessages: errors,
      }
    } catch (error: any) {
      errors.push(`Fatal error in list reconciliation: ${error.message}`)
      throw error
    }
  }

  /**
   * Reconcile campaigns between Payload and Listmonk
   */
  private async reconcileCampaigns(tenantId?: string): Promise<CampaignReconciliation & { errorMessages?: string[] }> {
    const payload = await this.getPayload()
    const listmonk = this.getListmonk()
    const errors: string[] = []

    let synced = 0
    let statusUpdated = 0
    let statsUpdated = 0
    let orphanedPayload = 0

    try {
      // Get all campaigns from Payload
      const where: any = { listmonkCampaignId: { exists: true } }
      if (tenantId) {
        where.tenant = { equals: tenantId }
      }

      const payloadCampaigns = await payload.find({
        collection: 'email-campaigns',
        where,
        limit: 1000,
      })

      console.log(`[Reconciliation] Found ${payloadCampaigns.docs.length} campaigns in Payload`)

      let listmonkCampaigns: any[] = []
      try {
        const listmonkResponse = await listmonk.getCampaigns()
        // Handle both array response and object with results property
        if (Array.isArray(listmonkResponse.data)) {
          listmonkCampaigns = listmonkResponse.data
        } else if (listmonkResponse.data && Array.isArray(listmonkResponse.data.results)) {
          listmonkCampaigns = listmonkResponse.data.results
        }
        console.log(`[Reconciliation] Found ${listmonkCampaigns.length} campaigns in Listmonk`)
      } catch (error: any) {
        console.warn(`[Reconciliation] Failed to fetch campaigns from Listmonk: ${error.message}`)
      }

      // Create lookup map
      const listmonkMap = new Map(
        listmonkCampaigns.map((campaign: any) => [campaign.id, campaign])
      )

      // Reconcile each Payload campaign
      for (const payloadCampaign of payloadCampaigns.docs) {
        try {
          const listmonkCampaign = listmonkMap.get(payloadCampaign.listmonkCampaignId)

          if (!listmonkCampaign) {
            // Orphaned in Payload
            orphanedPayload++
            console.warn(`[Reconciliation] Orphaned campaign in Payload: ${payloadCampaign.name} (Listmonk ID: ${payloadCampaign.listmonkCampaignId})`)

            // Clear Listmonk ID
            await payload.update({
              collection: 'email-campaigns',
              id: payloadCampaign.id,
              data: {
                listmonkCampaignId: null as any,
                syncStatus: 'pending',
              },
            })
            continue
          }

          // Check if status needs update
          if (payloadCampaign.status !== listmonkCampaign.status) {
            await payload.update({
              collection: 'email-campaigns',
              id: payloadCampaign.id,
              data: {
                status: listmonkCampaign.status,
              },
            })
            statusUpdated++
            console.log(`[Reconciliation] Updated campaign status: ${payloadCampaign.name} (${listmonkCampaign.status})`)
          }

          // Update stats from Listmonk
          const sent = listmonkCampaign.sent || 0
          const delivered = sent - (listmonkCampaign.bounces || 0)
          const opened = listmonkCampaign.views || 0
          const clicked = listmonkCampaign.clicks || 0
          const bounced = listmonkCampaign.bounces || 0

          const openRate = sent > 0 ? (opened / sent) * 100 : 0
          const clickRate = sent > 0 ? (clicked / sent) * 100 : 0
          const bounceRate = sent > 0 ? (bounced / sent) * 100 : 0

          await payload.update({
            collection: 'email-campaigns',
            id: payloadCampaign.id,
            data: {
              stats: {
                sent,
                delivered,
                bounced,
                opened,
                clicked,
                openRate: Math.round(openRate * 100) / 100,
                clickRate: Math.round(clickRate * 100) / 100,
                bounceRate: Math.round(bounceRate * 100) / 100,
                unsubscribed: 0,
              },
            } as any,
          })
          statsUpdated++

          synced++
        } catch (error: any) {
          errors.push(`Failed to reconcile campaign ${payloadCampaign.name}: ${error.message}`)
          console.error(`[Reconciliation] Error reconciling ${payloadCampaign.name}:`, error)
        }
      }

      return {
        totalPayload: payloadCampaigns.docs.length,
        totalListmonk: listmonkCampaigns.length,
        synced,
        statusUpdated,
        statsUpdated,
        orphanedPayload,
        errors: errors.length,
        errorMessages: errors,
      }
    } catch (error: any) {
      errors.push(`Fatal error in campaign reconciliation: ${error.message}`)
      throw error
    }
  }
}

// ═══════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════

let reconcilerInstance: EmailReconciler | null = null

export function getReconciler(): EmailReconciler {
  if (!reconcilerInstance) {
    reconcilerInstance = new EmailReconciler()
  }
  return reconcilerInstance
}
