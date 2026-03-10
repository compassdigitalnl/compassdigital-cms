/**
 * Email Marketing Worker
 *
 * Processes email marketing jobs in background:
 * - sync-campaign: Create/update campaigns in Listmonk
 * - delete-campaign: Delete campaigns from Listmonk
 * - start-campaign: Start scheduled campaigns
 * - sync-stats: Sync campaign statistics from Listmonk
 * - test-campaign: Send test emails
 */

import { Worker, Job } from 'bullmq'
import { redis } from '../redis'
import { baseWorkerConfig } from '../config'
import { ListmonkClient } from '@/features/email-marketing/lib/listmonk/client'
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getUsageTracker } from '@/features/email-marketing/lib/billing/usage-tracker'
import {
  classifyError,
  shouldRetry,
  moveToDLQ,
  reportError,
  CircuitBreaker,
} from '../errors'

// ═══════════════════════════════════════════════════════════
// JOB TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════

interface SyncCampaignJob {
  campaignId: string | number
  operation: 'create' | 'update'
  tenantId: string | number
}

interface DeleteCampaignJob {
  listmonkId: number
  tenantId: string | number
}

interface StartCampaignJob {
  campaignId: string | number
  tenantId: string | number
}

interface SyncStatsJob {
  campaignId: string | number
  listmonkId: number
  tenantId: string | number
}

interface TestCampaignJob {
  campaignId: string | number
  emails: string[]
  tenantId: string | number
}

type EmailMarketingJob =
  | { type: 'sync-campaign'; data: SyncCampaignJob }
  | { type: 'delete-campaign'; data: DeleteCampaignJob }
  | { type: 'start-campaign'; data: StartCampaignJob }
  | { type: 'sync-stats'; data: SyncStatsJob }
  | { type: 'test-campaign'; data: TestCampaignJob }

// ═══════════════════════════════════════════════════════════
// PAYLOAD & LISTMONK SETUP
// ═══════════════════════════════════════════════════════════

let payload: Payload | null = null
let listmonkClient: ListmonkClient | null = null

// Circuit breakers for external services
const listmonkCircuitBreaker = new CircuitBreaker('listmonk', 5, 60000) // 5 failures, 60s timeout
const payloadCircuitBreaker = new CircuitBreaker('payload', 10, 30000) // 10 failures, 30s timeout

async function getPayloadInstance(): Promise<Payload> {
  if (!payload) {
    payload = await getPayload({ config })
  }
  return payload
}

function getListmonkClient(): ListmonkClient {
  if (!listmonkClient) {
    const baseUrl = process.env.LISTMONK_API_URL
    const username = process.env.LISTMONK_USERNAME
    const password = process.env.LISTMONK_PASSWORD

    if (!baseUrl || !username || !password) {
      throw new Error('Listmonk credentials not configured')
    }

    listmonkClient = new ListmonkClient({ baseUrl, username, password })
  }
  return listmonkClient
}

// ═══════════════════════════════════════════════════════════
// JOB PROCESSORS
// ═══════════════════════════════════════════════════════════

/**
 * Sync campaign to Listmonk (create or update)
 */
async function processSyncCampaign(job: Job<SyncCampaignJob>): Promise<void> {
  const { campaignId, operation, tenantId } = job.data
  console.log(`[EmailWorker] Syncing campaign ${campaignId} (${operation})`)

  const payload = await getPayloadInstance()
  const listmonk = getListmonkClient()

  // Fetch campaign from Payload
  const campaign = await payload.findByID({
    collection: 'email-campaigns',
    id: campaignId,
    depth: 2, // Include relationships (template, lists)
  })

  if (!campaign) {
    throw new Error(`Campaign ${campaignId} not found`)
  }

  try {
    // Prepare campaign data for Listmonk
    const listmonkCampaign: any = {
      name: campaign.name,
      subject: campaign.subject,
      lists: Array.isArray(campaign.lists)
        ? campaign.lists.map((list: any) => typeof list === 'object' ? list.listmonkListId : list).filter(Boolean)
        : [],
      from_email: campaign.fromEmail || process.env.SMTP_FROM_EMAIL,
      type: 'regular',
      content_type: 'html',
      messenger: 'email',
      tags: campaign.tags?.map((t: any) => t.tag) || [],
    }

    // Add template body
    if (campaign.contentType === 'template' && campaign.template) {
      const template = typeof campaign.template === 'object' ? campaign.template : null
      if (template?.html) {
        listmonkCampaign.body = template.html
      } else if ((template as any)?.visual_html) {
        listmonkCampaign.body = (template as any).visual_html
      } else {
        throw new Error('Template has no HTML content')
      }
    } else if (campaign.contentType === 'custom' && campaign.html) {
      listmonkCampaign.body = campaign.html
    } else {
      throw new Error('Campaign has no content')
    }

    // Create or update in Listmonk
    let listmonkResponse

    if (campaign.listmonkCampaignId && operation === 'update') {
      // Update existing campaign
      listmonkResponse = await listmonk.updateCampaign(campaign.listmonkCampaignId, listmonkCampaign)
    } else {
      // Create new campaign
      listmonkResponse = await listmonk.createCampaign(listmonkCampaign)
    }

    // Update Payload with Listmonk ID and sync status
    await payload.update({
      collection: 'email-campaigns',
      id: campaignId,
      data: {
        listmonkCampaignId: listmonkResponse.data.id,
        syncStatus: 'synced',
        lastSyncedAt: new Date().toISOString(),
        syncError: null,
      },
    })

    console.log(`[EmailWorker] Campaign ${campaignId} synced successfully (Listmonk ID: ${listmonkResponse.data.id})`)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[EmailWorker] Failed to sync campaign ${campaignId}:`, error)

    // Update sync status with error
    await payload.update({
      collection: 'email-campaigns',
      id: campaignId,
      data: {
        syncStatus: 'error',
        syncError: message,
        lastSyncedAt: new Date().toISOString(),
      },
    })

    throw error
  }
}

/**
 * Delete campaign from Listmonk
 */
async function processDeleteCampaign(job: Job<DeleteCampaignJob>): Promise<void> {
  const { listmonkId, tenantId } = job.data
  console.log(`[EmailWorker] Deleting campaign ${listmonkId} from Listmonk`)

  if (!listmonkId) {
    console.log(`[EmailWorker] No Listmonk ID, skipping delete`)
    return
  }

  const listmonk = getListmonkClient()

  try {
    await listmonk.deleteCampaign(listmonkId)
    console.log(`[EmailWorker] Campaign ${listmonkId} deleted from Listmonk`)
  } catch (error: unknown) {
    // Ignore 404 errors (already deleted)
    if ((error as Record<string, any>).response?.status === 404) {
      console.log(`[EmailWorker] Campaign ${listmonkId} not found in Listmonk (already deleted)`)
      return
    }
    throw error
  }
}

/**
 * Start a campaign in Listmonk
 */
async function processStartCampaign(job: Job<StartCampaignJob>): Promise<void> {
  const { campaignId, tenantId } = job.data
  console.log(`[EmailWorker] Starting campaign ${campaignId}`)

  const payload = await getPayloadInstance()
  const listmonk = getListmonkClient()
  const usageTracker = getUsageTracker()

  // Fetch campaign
  const campaign = await payload.findByID({
    collection: 'email-campaigns',
    id: campaignId,
  })

  if (!campaign) {
    throw new Error(`Campaign ${campaignId} not found`)
  }

  if (!campaign.listmonkCampaignId) {
    throw new Error(`Campaign ${campaignId} not synced to Listmonk`)
  }

  // ✅ RATE LIMITING CHECK
  const usageCheck = await usageTracker.canSendEmail(String(tenantId))
  if (!usageCheck.allowed) {
    console.error(`[EmailWorker] Rate limit reached for tenant ${tenantId}: ${usageCheck.reason}`)

    // Update campaign status
    await payload.update({
      collection: 'email-campaigns',
      id: campaignId,
      data: {
        status: 'paused',
        syncError: `Rate limit reached: ${usageCheck.reason}`,
      },
    })

    throw new Error(`Rate limit reached: ${usageCheck.reason}`)
  }

  // Log usage warning if approaching limit
  if (usageCheck.usage && usageCheck.usage.usagePercentage >= 80) {
    console.warn(
      `[EmailWorker] Tenant ${tenantId} at ${usageCheck.usage.usagePercentage}% of email quota (${usageCheck.usage.emailsSent}/${usageCheck.usage.includedEmails})`
    )
  }

  try {
    // Start campaign in Listmonk
    const response = await listmonk.startCampaign(campaign.listmonkCampaignId)

    // Update status in Payload
    await payload.update({
      collection: 'email-campaigns',
      id: campaignId,
      data: {
        status: 'running',
        startedAt: new Date().toISOString(),
      },
    })

    console.log(`[EmailWorker] Campaign ${campaignId} started successfully`)

    // Queue stats sync job (check stats in 5 minutes)
    const { Queue } = await import('bullmq')
    const queue = new Queue('email-marketing', { connection: redis.options })
    await queue.add(
      'sync-stats',
      {
        campaignId,
        listmonkId: campaign.listmonkCampaignId,
        tenantId,
      },
      { delay: 5 * 60 * 1000 } // 5 minutes
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[EmailWorker] Failed to start campaign ${campaignId}:`, error)

    // Update status with error
    await payload.update({
      collection: 'email-campaigns',
      id: campaignId,
      data: {
        status: 'draft',
        syncError: `Failed to start: ${message}`,
      },
    })

    throw error
  }
}

/**
 * Sync campaign statistics from Listmonk to Payload
 */
async function processSyncStats(job: Job<SyncStatsJob>): Promise<void> {
  const { campaignId, listmonkId, tenantId } = job.data
  console.log(`[EmailWorker] Syncing stats for campaign ${campaignId}`)

  const payload = await getPayloadInstance()
  const listmonk = getListmonkClient()

  try {
    // Get campaign details (includes stats)
    const campaignResponse = await listmonk.getCampaign(listmonkId)
    const campaign = campaignResponse.data

    // Calculate rates
    const sent = campaign.sent || 0
    const delivered = sent - (campaign.bounces || 0)
    const opened = campaign.views || 0
    const clicked = campaign.clicks || 0
    const bounced = campaign.bounces || 0

    const openRate = sent > 0 ? (opened / sent) * 100 : 0
    const clickRate = sent > 0 ? (clicked / sent) * 100 : 0
    const bounceRate = sent > 0 ? (bounced / sent) * 100 : 0

    // Update stats in Payload
    await payload.update({
      collection: 'email-campaigns',
      id: campaignId,
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
          unsubscribed: 0, // TODO: Get from Listmonk if available
        },
        // Update status if completed
        status: campaign.status === 'finished' ? 'finished' : undefined,
        completedAt: campaign.status === 'finished' ? new Date().toISOString() : undefined,
      } as any,
    })

    console.log(`[EmailWorker] Stats synced for campaign ${campaignId}: ${sent} sent, ${opened} opened, ${clicked} clicked`)

    // If campaign is still running, queue another sync in 5 minutes
    if (campaign.status === 'running') {
      const { Queue } = await import('bullmq')
      const queue = new Queue('email-marketing', { connection: redis.options })
      await queue.add(
        'sync-stats',
        { campaignId, listmonkId, tenantId },
        { delay: 5 * 60 * 1000 } // 5 minutes
      )
    }
  } catch (error: unknown) {
    console.error(`[EmailWorker] Failed to sync stats for campaign ${campaignId}:`, error)
    throw error
  }
}

/**
 * Send test campaign
 */
async function processTestCampaign(job: Job<TestCampaignJob>): Promise<void> {
  const { campaignId, emails, tenantId } = job.data
  console.log(`[EmailWorker] Sending test campaign ${campaignId} to ${emails.join(', ')}`)

  const payload = await getPayloadInstance()
  const listmonk = getListmonkClient()

  // Fetch campaign
  const campaign = await payload.findByID({
    collection: 'email-campaigns',
    id: campaignId,
  })

  if (!campaign) {
    throw new Error(`Campaign ${campaignId} not found`)
  }

  if (!campaign.listmonkCampaignId) {
    throw new Error(`Campaign ${campaignId} not synced to Listmonk`)
  }

  try {
    await listmonk.testCampaign(campaign.listmonkCampaignId, emails)
    console.log(`[EmailWorker] Test campaign sent successfully`)
  } catch (error: unknown) {
    console.error(`[EmailWorker] Failed to send test campaign:`, error)
    throw error
  }
}

// ═══════════════════════════════════════════════════════════
// WORKER INSTANCE
// ═══════════════════════════════════════════════════════════

export const emailMarketingWorker = new Worker(
  'email-marketing',
  async (job: Job) => {
    const jobName = job.name
    const attemptsMade = job.attemptsMade
    console.log(`[EmailWorker] Processing job: ${jobName} (${job.id}, attempt ${attemptsMade + 1})`)

    try {
      switch (jobName) {
        case 'sync-campaign':
          await processSyncCampaign(job as Job<SyncCampaignJob>)
          break

        case 'delete-campaign':
          await processDeleteCampaign(job as Job<DeleteCampaignJob>)
          break

        case 'start-campaign':
          await processStartCampaign(job as Job<StartCampaignJob>)
          break

        case 'sync-stats':
          await processSyncStats(job as Job<SyncStatsJob>)
          break

        case 'test-campaign':
          await processTestCampaign(job as Job<TestCampaignJob>)
          break

        default:
          console.warn(`[EmailWorker] Unknown job type: ${jobName}`)
      }

      console.log(`[EmailWorker] ✅ Job ${jobName} completed successfully`)
    } catch (error: unknown) {
      // Classify error
      const classifiedError = classifyError(error)
      reportError(jobName, classifiedError, {
        jobId: job.id,
        jobData: job.data,
        attemptsMade,
      })

      // Determine if should retry
      const retryDecision = shouldRetry(error, attemptsMade)

      if (!retryDecision.shouldRetry) {
        console.error(
          `[EmailWorker] ❌ Job ${jobName} permanently failed: ${retryDecision.reason}`
        )

        // Move to dead letter queue
        await moveToDLQ(jobName, job.data, classifiedError, attemptsMade)

        // Throw to mark job as failed
        throw new Error(`Permanent failure: ${retryDecision.reason}`)
      }

      console.warn(
        `[EmailWorker] ⚠️ Job ${jobName} will retry: ${retryDecision.reason} (delay: ${retryDecision.delay}ms)`
      )

      // Throw to trigger BullMQ retry
      throw error
    }
  },
  {
    ...baseWorkerConfig,
    connection: redis.options,
    concurrency: 2, // Process 2 jobs at a time
  }
)

// Worker event handlers
emailMarketingWorker.on('completed', (job) => {
  console.log(`[EmailWorker] ✅ Job ${job.id} completed`)
})

emailMarketingWorker.on('failed', (job, error) => {
  console.error(`[EmailWorker] ❌ Job ${job?.id} failed:`, error)
})

emailMarketingWorker.on('error', (error) => {
  console.error('[EmailWorker] Worker error:', error)
})

console.log('[EmailWorker] 🚀 Email marketing worker started')
