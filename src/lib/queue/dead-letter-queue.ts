/**
 * Dead Letter Queue (DLQ)
 *
 * Handles failed jobs that cannot be retried
 * Provides monitoring, analysis, and manual retry capabilities
 */

import { Queue, QueueEvents, Job } from 'bullmq'
import { getRedisClient } from './redis'
import type { Payload } from 'payload'

/**
 * Dead letter queue entry
 */
export interface DeadLetterEntry {
  jobId: string
  jobName: string
  queue: string
  data: any
  error: {
    message: string
    stack?: string
    type?: string
  }
  attemptsMade: number
  timestamp: Date
  tenantId?: string
  retryable: boolean
}

/**
 * Dead Letter Queue Manager
 */
export class DeadLetterQueueManager {
  private payload: Payload
  private redis: ReturnType<typeof getRedisClient>

  constructor(payload: Payload) {
    this.payload = payload
    this.redis = getRedisClient()
  }

  /**
   * Move job to dead letter queue
   *
   * @param job - Failed job
   * @param error - Error that caused failure
   * @param retryable - Whether this job could potentially be retried manually
   */
  async moveToDeadLetterQueue(
    job: Job,
    error: Error,
    retryable: boolean = false,
  ): Promise<void> {
    try {
      const entry: DeadLetterEntry = {
        jobId: job.id!,
        jobName: job.name,
        queue: job.queueName,
        data: job.data,
        error: {
          message: error.message,
          stack: error.stack,
          type: (error as any).type,
        },
        attemptsMade: job.attemptsMade,
        timestamp: new Date(),
        tenantId: job.data.tenantId,
        retryable,
      }

      // Store in database for persistence and UI access
      await this.payload.create({
        collection: 'email-events',
        data: {
          type: 'job_failed',
          tenant: job.data.tenantId,
          metadata: {
            dlqEntry: entry,
          },
          createdAt: new Date().toISOString(),
        },
      })

      console.error('[DLQ] Job moved to dead letter queue', {
        jobId: job.id,
        jobName: job.name,
        error: error.message,
        retryable,
      })

      // Optionally notify admin via webhook or email
      await this.notifyAdmin(entry)
    } catch (dlqError) {
      console.error('[DLQ] Failed to move job to dead letter queue:', dlqError)
      // Don't throw - we don't want to crash the worker
    }
  }

  /**
   * Get all dead letter entries
   */
  async getDeadLetterEntries(
    filters?: {
      tenantId?: string
      queue?: string
      jobName?: string
      retryable?: boolean
      startDate?: Date
      endDate?: Date
    },
  ): Promise<DeadLetterEntry[]> {
    const where: any = {
      type: { equals: 'job_failed' },
    }

    if (filters?.tenantId) {
      where.tenant = { equals: filters.tenantId }
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {}
      if (filters.startDate) {
        where.createdAt.greater_than_equal = filters.startDate.toISOString()
      }
      if (filters.endDate) {
        where.createdAt.less_than_equal = filters.endDate.toISOString()
      }
    }

    const result = await this.payload.find({
      collection: 'email-events',
      where,
      limit: 100,
      sort: '-createdAt',
    })

    return result.docs
      .map((doc) => doc.metadata?.dlqEntry as DeadLetterEntry)
      .filter((entry) => {
        if (!entry) return false
        if (filters?.queue && entry.queue !== filters.queue) return false
        if (filters?.jobName && entry.jobName !== filters.jobName) return false
        if (filters?.retryable !== undefined && entry.retryable !== filters.retryable) return false
        return true
      })
  }

  /**
   * Retry a failed job manually
   *
   * @param jobId - Original job ID from DLQ
   * @param modifications - Optional modifications to job data
   */
  async retryFailedJob(
    jobId: string,
    modifications?: Record<string, any>,
  ): Promise<void> {
    // Find the DLQ entry
    const entries = await this.getDeadLetterEntries()
    const entry = entries.find((e) => e.jobId === jobId)

    if (!entry) {
      throw new Error(`Job ${jobId} not found in dead letter queue`)
    }

    if (!entry.retryable) {
      throw new Error(`Job ${jobId} is not retryable (permanent error)`)
    }

    // Create a new job in the original queue
    const redis = getRedisClient()
    const queue = new Queue(entry.queue, { connection: redis })

    await queue.add(
      entry.jobName,
      {
        ...entry.data,
        ...modifications,
        _retriedFromDLQ: true,
        _originalJobId: jobId,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    )

    console.log('[DLQ] Job manually retried from dead letter queue', {
      originalJobId: jobId,
      queue: entry.queue,
      jobName: entry.jobName,
    })

    // Mark as retried in the event
    await this.payload.update({
      collection: 'email-events',
      where: {
        AND: [
          { type: { equals: 'job_failed' } },
          { 'metadata.dlqEntry.jobId': { equals: jobId } },
        ],
      },
      data: {
        metadata: {
          dlqEntry: {
            ...entry,
            retriedAt: new Date(),
          },
        },
      },
    })
  }

  /**
   * Bulk retry failed jobs
   *
   * @param filters - Filter criteria
   * @param maxJobs - Maximum number of jobs to retry (default: 10)
   */
  async bulkRetryFailedJobs(
    filters?: {
      tenantId?: string
      queue?: string
      jobName?: string
    },
    maxJobs: number = 10,
  ): Promise<{ succeeded: number; failed: number }> {
    const entries = await this.getDeadLetterEntries({
      ...filters,
      retryable: true,
    })

    const toRetry = entries.slice(0, maxJobs)
    let succeeded = 0
    let failed = 0

    for (const entry of toRetry) {
      try {
        await this.retryFailedJob(entry.jobId)
        succeeded++
      } catch (error) {
        console.error(`[DLQ] Failed to retry job ${entry.jobId}:`, error)
        failed++
      }
    }

    return { succeeded, failed }
  }

  /**
   * Get DLQ statistics
   */
  async getStats(tenantId?: string): Promise<{
    total: number
    retryable: number
    nonRetryable: number
    byQueue: Record<string, number>
    byErrorType: Record<string, number>
    last24Hours: number
  }> {
    const allEntries = await this.getDeadLetterEntries({ tenantId })
    const last24HoursEntries = await this.getDeadLetterEntries({
      tenantId,
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    })

    const byQueue: Record<string, number> = {}
    const byErrorType: Record<string, number> = {}
    let retryable = 0
    let nonRetryable = 0

    for (const entry of allEntries) {
      // Count by queue
      byQueue[entry.queue] = (byQueue[entry.queue] || 0) + 1

      // Count by error type
      const errorType = entry.error.type || 'unknown'
      byErrorType[errorType] = (byErrorType[errorType] || 0) + 1

      // Count retryable/non-retryable
      if (entry.retryable) {
        retryable++
      } else {
        nonRetryable++
      }
    }

    return {
      total: allEntries.length,
      retryable,
      nonRetryable,
      byQueue,
      byErrorType,
      last24Hours: last24HoursEntries.length,
    }
  }

  /**
   * Clean up old DLQ entries
   *
   * @param olderThanDays - Delete entries older than this many days (default: 30)
   */
  async cleanup(olderThanDays: number = 30): Promise<number> {
    const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000)

    const result = await this.payload.delete({
      collection: 'email-events',
      where: {
        AND: [
          { type: { equals: 'job_failed' } },
          { createdAt: { less_than: cutoffDate.toISOString() } },
        ],
      },
    })

    console.log(`[DLQ] Cleaned up ${result.docs.length} old entries`)
    return result.docs.length
  }

  /**
   * Notify admin about failed job
   * (Placeholder - implement webhook/email notification)
   */
  private async notifyAdmin(entry: DeadLetterEntry): Promise<void> {
    // Only notify for critical failures or high-value operations
    const criticalJobs = ['send-campaign', 'start-flow']
    if (!criticalJobs.includes(entry.jobName)) {
      return
    }

    // TODO: Implement webhook notification
    console.warn('[DLQ] CRITICAL: Failed job requires attention', {
      jobId: entry.jobId,
      jobName: entry.jobName,
      tenantId: entry.tenantId,
      error: entry.error.message,
    })

    // Example webhook notification (uncomment when ready):
    /*
    const webhookUrl = process.env.DLQ_WEBHOOK_URL
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'job_failed',
          job: entry,
          timestamp: new Date().toISOString(),
        }),
      })
    }
    */
  }
}

/**
 * Setup dead letter queue monitoring
 * Listens for failed events from all queues
 */
export async function setupDeadLetterQueueMonitoring(
  payload: Payload,
  queueNames: string[],
): Promise<void> {
  const dlqManager = new DeadLetterQueueManager(payload)
  const redis = getRedisClient()

  for (const queueName of queueNames) {
    const events = new QueueEvents(queueName, { connection: redis })

    events.on('failed', async ({ jobId, failedReason }) => {
      try {
        // Get the failed job
        const queue = new Queue(queueName, { connection: redis })
        const job = await queue.getJob(jobId)

        if (!job) {
          console.error(`[DLQ] Failed job ${jobId} not found in queue ${queueName}`)
          return
        }

        // Check if job has exceeded max retries
        const maxAttempts = job.opts.attempts || 3
        if (job.attemptsMade >= maxAttempts) {
          await dlqManager.moveToDeadLetterQueue(
            job,
            new Error(failedReason),
            true, // Retryable by default
          )
        }
      } catch (error) {
        console.error('[DLQ] Error handling failed job:', error)
      }
    })
  }

  console.log(`[DLQ] Monitoring setup for queues: ${queueNames.join(', ')}`)
}
