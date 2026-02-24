/**
 * Listmonk Sync Service
 *
 * Bidirectional synchronization between Payload CMS and Listmonk
 * Handles subscribers, lists, templates, and campaigns
 *
 * Strategy: Payload is the source of truth for structure,
 * Listmonk is the source of truth for email stats/analytics
 */

import type { Payload } from 'payload'
import { getListmonkClient, ListmonkAPIError } from './client'
import type {
  ListmonkSubscriber,
  ListmonkList,
  ListmonkTemplate,
  ListmonkCampaign,
} from '@/types/listmonk'

// ═══════════════════════════════════════════════════════════
// SYNC CONFIGURATION
// ═══════════════════════════════════════════════════════════

export interface SyncOptions {
  dryRun?: boolean
  force?: boolean
  tenantId?: string
  maxRetries?: number
  retryDelay?: number
}

export interface SyncResult {
  success: boolean
  created: number
  updated: number
  deleted: number
  errors: Array<{ item: string; error: string }>
  skipped: number
}

// ═══════════════════════════════════════════════════════════
// SUBSCRIBER SYNC
// ═══════════════════════════════════════════════════════════

export class SubscriberSync {
  constructor(
    private payload: Payload,
    private listmonk = getListmonkClient(),
  ) {}

  /**
   * Sync single subscriber from Payload to Listmonk
   */
  async syncToListmonk(subscriberId: string, options: SyncOptions = {}): Promise<void> {
    const subscriber = await this.payload.findByID({
      collection: 'email-subscribers',
      id: subscriberId,
    })

    if (!subscriber) {
      throw new Error(`Subscriber ${subscriberId} not found`)
    }

    // Check if already synced
    const listmonkId = subscriber.listmonkId as number | undefined

    const listmonkData: Omit<ListmonkSubscriber, 'id' | 'uuid' | 'created_at' | 'updated_at'> = {
      email: subscriber.email as string,
      name: subscriber.name as string || '',
      status: (subscriber.status as 'enabled' | 'disabled' | 'blocklisted') || 'enabled',
      lists: (subscriber.lists as any[])?.map(l => typeof l === 'object' ? l.listmonkId : l).filter(Boolean) || [],
      attribs: {
        tenant_id: subscriber.tenant as string,
        payload_id: subscriberId,
        ...(subscriber.customFields as Record<string, any> || {}),
      },
    }

    if (options.dryRun) {
      console.log('[DRY RUN] Would sync subscriber:', listmonkData)
      return
    }

    try {
      if (listmonkId) {
        // Update existing
        await this.listmonk.updateSubscriber(listmonkId, listmonkData)
      } else {
        // Create new
        const result = await this.listmonk.createSubscriber(listmonkData)

        // Store Listmonk ID back in Payload
        await this.payload.update({
          collection: 'email-subscribers',
          id: subscriberId,
          data: {
            listmonkId: result.data.id,
            lastSyncedAt: new Date().toISOString(),
          },
        })
      }

      // Update sync timestamp
      await this.payload.update({
        collection: 'email-subscribers',
        id: subscriberId,
        data: {
          lastSyncedAt: new Date().toISOString(),
        },
      })
    } catch (error) {
      console.error(`Failed to sync subscriber ${subscriberId}:`, error)
      throw error
    }
  }

  /**
   * Sync subscriber from Listmonk to Payload
   */
  async syncFromListmonk(listmonkId: number, options: SyncOptions = {}): Promise<void> {
    const listmonkSubscriber = await this.listmonk.getSubscriber(listmonkId)

    if (!listmonkSubscriber.data) {
      throw new Error(`Listmonk subscriber ${listmonkId} not found`)
    }

    const tenantId = listmonkSubscriber.data.attribs?.tenant_id || options.tenantId
    if (!tenantId) {
      throw new Error('Cannot sync subscriber without tenant ID')
    }

    // Find existing Payload subscriber
    const existingSubscribers = await this.payload.find({
      collection: 'email-subscribers',
      where: {
        listmonkId: { equals: listmonkId },
      },
      limit: 1,
    })

    const payloadData = {
      email: listmonkSubscriber.data.email,
      name: listmonkSubscriber.data.name,
      status: listmonkSubscriber.data.status,
      tenant: tenantId,
      listmonkId: listmonkId,
      customFields: listmonkSubscriber.data.attribs,
      lastSyncedAt: new Date().toISOString(),
    }

    if (options.dryRun) {
      console.log('[DRY RUN] Would sync from Listmonk:', payloadData)
      return
    }

    if (existingSubscribers.docs.length > 0) {
      // Update existing
      await this.payload.update({
        collection: 'email-subscribers',
        id: existingSubscribers.docs[0].id,
        data: payloadData,
      })
    } else {
      // Create new
      await this.payload.create({
        collection: 'email-subscribers',
        data: payloadData,
      })
    }
  }

  /**
   * Bulk sync all subscribers for a tenant
   */
  async syncAllForTenant(tenantId: string, options: SyncOptions = {}): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      created: 0,
      updated: 0,
      deleted: 0,
      errors: [],
      skipped: 0,
    }

    try {
      // Get all Payload subscribers for tenant
      const payloadSubscribers = await this.payload.find({
        collection: 'email-subscribers',
        where: {
          tenant: { equals: tenantId },
        },
        limit: 10000, // TODO: Handle pagination
      })

      for (const subscriber of payloadSubscribers.docs) {
        try {
          await this.syncToListmonk(subscriber.id, options)
          if (subscriber.listmonkId) {
            result.updated++
          } else {
            result.created++
          }
        } catch (error) {
          result.errors.push({
            item: `subscriber:${subscriber.id}`,
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }
    } catch (error) {
      result.success = false
      result.errors.push({
        item: 'bulk-sync',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    return result
  }
}

// ═══════════════════════════════════════════════════════════
// LIST SYNC
// ═══════════════════════════════════════════════════════════

export class ListSync {
  constructor(
    private payload: Payload,
    private listmonk = getListmonkClient(),
  ) {}

  /**
   * Sync single list from Payload to Listmonk
   */
  async syncToListmonk(listId: string, options: SyncOptions = {}): Promise<void> {
    const list = await this.payload.findByID({
      collection: 'email-lists',
      id: listId,
    })

    if (!list) {
      throw new Error(`List ${listId} not found`)
    }

    const listmonkId = list.listmonkId as number | undefined

    const listmonkData: Omit<ListmonkList, 'id' | 'uuid' | 'created_at' | 'updated_at' | 'subscriber_count'> = {
      name: list.name as string,
      type: (list.type as 'public' | 'private') || 'private',
      optin: (list.optin as 'single' | 'double') || 'single',
      tags: [
        `tenant:${list.tenant}`,
        ...(list.tags as string[] || []),
      ],
      description: list.description as string || undefined,
    }

    if (options.dryRun) {
      console.log('[DRY RUN] Would sync list:', listmonkData)
      return
    }

    try {
      if (listmonkId) {
        await this.listmonk.updateList(listmonkId, listmonkData)
      } else {
        const result = await this.listmonk.createList(listmonkData)
        await this.payload.update({
          collection: 'email-lists',
          id: listId,
          data: {
            listmonkId: result.data.id,
            lastSyncedAt: new Date().toISOString(),
          },
        })
      }

      await this.payload.update({
        collection: 'email-lists',
        id: listId,
        data: {
          lastSyncedAt: new Date().toISOString(),
        },
      })
    } catch (error) {
      console.error(`Failed to sync list ${listId}:`, error)
      throw error
    }
  }

  /**
   * Sync list stats from Listmonk to Payload
   */
  async syncStatsFromListmonk(listId: string): Promise<void> {
    const list = await this.payload.findByID({
      collection: 'email-lists',
      id: listId,
    })

    if (!list?.listmonkId) {
      throw new Error(`List ${listId} not synced with Listmonk`)
    }

    const listmonkList = await this.listmonk.getList(list.listmonkId as number)

    await this.payload.update({
      collection: 'email-lists',
      id: listId,
      data: {
        subscriberCount: listmonkList.data.subscriber_count || 0,
        lastSyncedAt: new Date().toISOString(),
      },
    })
  }
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE SYNC
// ═══════════════════════════════════════════════════════════

export class TemplateSync {
  constructor(
    private payload: Payload,
    private listmonk = getListmonkClient(),
  ) {}

  /**
   * Sync single template from Payload to Listmonk
   */
  async syncToListmonk(templateId: string, options: SyncOptions = {}): Promise<void> {
    const template = await this.payload.findByID({
      collection: 'email-templates',
      id: templateId,
    })

    if (!template) {
      throw new Error(`Template ${templateId} not found`)
    }

    const listmonkId = template.listmonkId as number | undefined

    const listmonkData: Omit<ListmonkTemplate, 'id' | 'created_at' | 'updated_at'> = {
      name: template.name as string,
      type: (template.type as number) || 0, // 0 = campaign, 1 = transactional
      subject: template.defaultSubject as string || undefined,
      body: template.html as string,
      is_default: template.isDefault as boolean || false,
    }

    if (options.dryRun) {
      console.log('[DRY RUN] Would sync template:', listmonkData)
      return
    }

    try {
      if (listmonkId) {
        await this.listmonk.updateTemplate(listmonkId, listmonkData)
      } else {
        const result = await this.listmonk.createTemplate(listmonkData)
        await this.payload.update({
          collection: 'email-templates',
          id: templateId,
          data: {
            listmonkId: result.data.id,
            lastSyncedAt: new Date().toISOString(),
          },
        })
      }

      await this.payload.update({
        collection: 'email-templates',
        id: templateId,
        data: {
          lastSyncedAt: new Date().toISOString(),
        },
      })
    } catch (error) {
      console.error(`Failed to sync template ${templateId}:`, error)
      throw error
    }
  }
}

// ═══════════════════════════════════════════════════════════
// CAMPAIGN SYNC
// ═══════════════════════════════════════════════════════════

export class CampaignSync {
  constructor(
    private payload: Payload,
    private listmonk = getListmonkClient(),
  ) {}

  /**
   * Sync campaign from Payload to Listmonk (create/update)
   */
  async syncToListmonk(campaignId: string, options: SyncOptions = {}): Promise<void> {
    const campaign = await this.payload.findByID({
      collection: 'email-campaigns',
      id: campaignId,
      depth: 2, // Load related lists and template
    })

    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`)
    }

    const listmonkCampaignId = campaign.listmonkCampaignId as number | undefined

    // Get list IDs
    const listIds = (campaign.lists as any[])
      ?.map(l => typeof l === 'object' ? l.listmonkId : null)
      .filter(Boolean) as number[] || []

    if (listIds.length === 0) {
      throw new Error(`Campaign ${campaignId} has no valid lists`)
    }

    const listmonkData: Omit<ListmonkCampaign, 'id' | 'uuid' | 'created_at' | 'updated_at' | 'sent' | 'views' | 'clicks' | 'bounces' | 'started_at' | 'to_send'> = {
      name: campaign.name as string,
      subject: campaign.subject as string,
      from_email: campaign.fromEmail as string || undefined,
      body: campaign.html as string,
      content_type: 'html',
      send_at: campaign.scheduledFor ? new Date(campaign.scheduledFor as string).toISOString() : undefined,
      status: (campaign.status as any) || 'draft',
      lists: listIds,
      tags: [`tenant:${campaign.tenant}`, ...(campaign.tags as string[] || [])],
      template_id: typeof campaign.template === 'object' ? (campaign.template.listmonkId as number) : undefined,
      type: 'regular',
    }

    if (options.dryRun) {
      console.log('[DRY RUN] Would sync campaign:', listmonkData)
      return
    }

    try {
      if (listmonkCampaignId) {
        await this.listmonk.updateCampaign(listmonkCampaignId, listmonkData)
      } else {
        const result = await this.listmonk.createCampaign(listmonkData)
        await this.payload.update({
          collection: 'email-campaigns',
          id: campaignId,
          data: {
            listmonkCampaignId: result.data.id,
            lastSyncedAt: new Date().toISOString(),
          },
        })
      }

      await this.payload.update({
        collection: 'email-campaigns',
        id: campaignId,
        data: {
          lastSyncedAt: new Date().toISOString(),
        },
      })
    } catch (error) {
      console.error(`Failed to sync campaign ${campaignId}:`, error)
      throw error
    }
  }

  /**
   * Sync campaign stats from Listmonk to Payload
   */
  async syncStatsFromListmonk(campaignId: string): Promise<void> {
    const campaign = await this.payload.findByID({
      collection: 'email-campaigns',
      id: campaignId,
    })

    if (!campaign?.listmonkCampaignId) {
      throw new Error(`Campaign ${campaignId} not synced with Listmonk`)
    }

    const listmonkCampaign = await this.listmonk.getCampaign(campaign.listmonkCampaignId as number)

    await this.payload.update({
      collection: 'email-campaigns',
      id: campaignId,
      data: {
        status: listmonkCampaign.data.status,
        stats: {
          sent: listmonkCampaign.data.sent || 0,
          delivered: (listmonkCampaign.data.sent || 0) - (listmonkCampaign.data.bounces || 0),
          bounced: listmonkCampaign.data.bounces || 0,
          opened: listmonkCampaign.data.views || 0,
          clicked: listmonkCampaign.data.clicks || 0,
          openRate: listmonkCampaign.data.sent ? (listmonkCampaign.data.views || 0) / listmonkCampaign.data.sent : 0,
          clickRate: listmonkCampaign.data.sent ? (listmonkCampaign.data.clicks || 0) / listmonkCampaign.data.sent : 0,
          bounceRate: listmonkCampaign.data.sent ? (listmonkCampaign.data.bounces || 0) / listmonkCampaign.data.sent : 0,
        },
        lastSyncedAt: new Date().toISOString(),
      },
    })
  }

  /**
   * Start campaign in Listmonk
   */
  async startCampaign(campaignId: string): Promise<void> {
    const campaign = await this.payload.findByID({
      collection: 'email-campaigns',
      id: campaignId,
    })

    if (!campaign?.listmonkCampaignId) {
      throw new Error(`Campaign ${campaignId} not synced with Listmonk`)
    }

    await this.listmonk.startCampaign(campaign.listmonkCampaignId as number)

    await this.payload.update({
      collection: 'email-campaigns',
      id: campaignId,
      data: {
        status: 'running',
        startedAt: new Date().toISOString(),
      },
    })
  }
}

// ═══════════════════════════════════════════════════════════
// MAIN SYNC SERVICE
// ═══════════════════════════════════════════════════════════

export class ListmonkSyncService {
  public subscribers: SubscriberSync
  public lists: ListSync
  public templates: TemplateSync
  public campaigns: CampaignSync

  constructor(payload: Payload) {
    const listmonk = getListmonkClient()
    this.subscribers = new SubscriberSync(payload, listmonk)
    this.lists = new ListSync(payload, listmonk)
    this.templates = new TemplateSync(payload, listmonk)
    this.campaigns = new CampaignSync(payload, listmonk)
  }

  /**
   * Health check: verify Listmonk connectivity
   */
  async healthCheck(): Promise<boolean> {
    try {
      const client = getListmonkClient()
      const result = await client.healthCheck()
      return result.status === 'ok'
    } catch (error) {
      console.error('Listmonk health check failed:', error)
      return false
    }
  }
}

// ═══════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════

let syncServiceInstance: ListmonkSyncService | null = null

/**
 * Get singleton sync service instance
 */
export function getListmonkSyncService(payload: Payload): ListmonkSyncService {
  if (!syncServiceInstance) {
    syncServiceInstance = new ListmonkSyncService(payload)
  }
  return syncServiceInstance
}
