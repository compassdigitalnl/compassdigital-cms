/**
 * Queue Utility Functions
 * Helper functions for working with BullMQ queues
 */

import type { Queue, Job } from 'bullmq'
import { Priority } from './config'

/**
 * Add a job to a queue with priority
 */
export async function addJob<T = any>(
  queue: Queue,
  jobName: string,
  data: T,
  priority: Priority = Priority.MEDIUM,
): Promise<Job<T>> {
  return queue.add(jobName, data, {
    priority,
  })
}

/**
 * Get job by ID
 */
export async function getJob<T = any>(queue: Queue, jobId: string): Promise<Job<T> | undefined> {
  return queue.getJob(jobId) as Promise<Job<T> | undefined>
}

/**
 * Remove a job from the queue
 */
export async function removeJob(queue: Queue, jobId: string): Promise<void> {
  const job = await queue.getJob(jobId)
  if (job) {
    await job.remove()
  }
}

/**
 * Get queue metrics
 */
export async function getQueueMetrics(queue: Queue) {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount(),
  ])

  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
    total: waiting + active + completed + failed + delayed,
  }
}
