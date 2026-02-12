/**
 * BullMQ Queue Configuration
 * Centralized queue setup with priority levels and retry strategies
 */

import { Queue, Worker, Job, QueueOptions, WorkerOptions } from 'bullmq'
import { redis } from './redis'

// Queue names
export const QUEUE_NAMES = {
  CONTENT_ANALYSIS: 'content-analysis',
  SEO_ANALYSIS: 'seo-analysis',
  TRANSLATION: 'translation',
  BLOCK_GENERATION: 'block-generation',
  PAGE_GENERATION: 'page-generation',
  SITE_GENERATION: 'site-generation',
} as const

// Priority levels (lower number = higher priority)
export enum Priority {
  CRITICAL = 1,  // Live user requests
  HIGH = 2,      // Interactive operations
  MEDIUM = 3,    // Background analyses
  LOW = 4,       // Batch operations
}

// Base queue configuration
const baseQueueConfig: QueueOptions = {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000, // 2s → 4s → 8s
    },
    removeOnComplete: {
      age: 24 * 60 * 60, // Keep completed jobs for 24h
      count: 1000,        // Keep max 1000 jobs
    },
    removeOnFail: {
      age: 7 * 24 * 60 * 60, // Keep failed jobs for 7 days
    },
  },
}

// Base worker configuration
export const baseWorkerConfig: Partial<WorkerOptions> = {
  connection: redis,
  concurrency: 5, // Process 5 jobs at once per worker
  limiter: {
    max: 50,      // Max 50 jobs
    duration: 60000, // per minute
  },
}

// Create queues
export const queues = {
  contentAnalysis: new Queue(QUEUE_NAMES.CONTENT_ANALYSIS, baseQueueConfig),
  seoAnalysis: new Queue(QUEUE_NAMES.SEO_ANALYSIS, baseQueueConfig),
  translation: new Queue(QUEUE_NAMES.TRANSLATION, baseQueueConfig),
  blockGeneration: new Queue(QUEUE_NAMES.BLOCK_GENERATION, baseQueueConfig),
  pageGeneration: new Queue(QUEUE_NAMES.PAGE_GENERATION, baseQueueConfig),
  siteGeneration: new Queue(QUEUE_NAMES.SITE_GENERATION, baseQueueConfig),
}

// Job data types
export interface ContentAnalysisJob {
  content: string
  contentHash: string
  language: string
  includeGrammarCheck: boolean
  userId?: string
  cacheKey: string
  sseConnectionId?: string
}

export interface SEOAnalysisJob {
  content: string
  contentHash: string
  title?: string
  targetKeywords?: string[]
  userId?: string
  cacheKey: string
  sseConnectionId?: string
}

export interface TranslationJob {
  content: string
  contentHash: string
  targetLanguage: string
  sourceLanguage?: string
  userId?: string
  cacheKey: string
  sseConnectionId?: string
}

// Helper: Add job with priority
export async function addJob<T>(
  queue: Queue,
  name: string,
  data: T,
  priority: Priority = Priority.MEDIUM
): Promise<Job<T>> {
  return queue.add(name, data, {
    priority,
    jobId: `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  })
}

// Helper: Get queue stats
export async function getQueueStats(queueName: string) {
  const queue = Object.values(queues).find(q => q.name === queueName)
  if (!queue) return null

  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount(),
  ])

  return {
    queueName,
    waiting,
    active,
    completed,
    failed,
    delayed,
    total: waiting + active + completed + failed + delayed,
  }
}

// Helper: Get all queue stats
export async function getAllQueueStats() {
  const stats = await Promise.all(
    Object.values(QUEUE_NAMES).map(name => getQueueStats(name))
  )
  return stats.filter(Boolean)
}

// Graceful shutdown
export async function closeQueues() {
  console.log('Closing queues...')
  await Promise.all(Object.values(queues).map(q => q.close()))
  await redis.quit()
  console.log('✅ Queues closed')
}

// Monitor queue events
Object.values(queues).forEach(queue => {
  queue.on('error', (err) => {
    console.error(`[QUEUE ERROR] ${queue.name}:`, err)
  })

  queue.on('waiting', (job) => {
    console.log(`[QUEUE] ${queue.name}: Job ${job.id} waiting`)
  })

  queue.on('active', (job) => {
    console.log(`[QUEUE] ${queue.name}: Job ${job.id} started`)
  })

  queue.on('completed', (job) => {
    console.log(`[QUEUE] ${queue.name}: Job ${job.id} completed`)
  })

  queue.on('failed', (job, err) => {
    console.error(`[QUEUE] ${queue.name}: Job ${job?.id} failed:`, err)
  })
})

// Handle process termination
process.on('SIGTERM', closeQueues)
process.on('SIGINT', closeQueues)
