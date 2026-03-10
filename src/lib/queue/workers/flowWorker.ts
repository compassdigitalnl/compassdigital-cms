/**
 * Flow Worker
 *
 * BullMQ worker that executes flow steps
 */

import { Worker, Job, WorkerOptions } from 'bullmq'
import { redis } from '../redis'
import { baseWorkerConfig } from '../config'
import { executeFlowStep } from '@/features/email-marketing/lib/flows/executor'
import {
  classifyError,
  shouldRetry,
  moveToDLQ,
  reportError,
} from '../errors'

interface FlowStepJob {
  instanceId: string
  stepIndex: number
}

export const flowWorker = new Worker(
  'email-flows',
  async (job: Job<FlowStepJob>) => {
    const { instanceId, stepIndex } = job.data
    const attemptsMade = job.attemptsMade

    console.log(
      `[Flow Worker] Processing step ${stepIndex} for instance: ${instanceId} (attempt ${attemptsMade + 1})`
    )

    try {
      const result = await executeFlowStep(instanceId, stepIndex)

      if (result.success) {
        console.log(`[Flow Worker] ✅ Step completed successfully`)

        if (result.completed) {
          console.log(`[Flow Worker] 🎉 Flow completed!`)
        } else if (result.nextStepIndex !== undefined) {
          console.log(`[Flow Worker] ➡️ Moving to next step: ${result.nextStepIndex}`)
        }
      } else {
        console.error(`[Flow Worker] ❌ Step execution failed: ${result.error}`)
        throw new Error(result.error)
      }

      return {
        success: true,
        instanceId,
        stepIndex,
        completed: result.completed,
      }
    } catch (error: unknown) {
      // Classify error
      const classifiedError = classifyError(error)
      reportError('flow-step', classifiedError, {
        jobId: job.id,
        instanceId,
        stepIndex,
        attemptsMade,
      })

      // Determine if should retry
      const retryDecision = shouldRetry(error, attemptsMade)

      if (!retryDecision.shouldRetry) {
        console.error(
          `[Flow Worker] ❌ Step permanently failed: ${retryDecision.reason}`
        )

        // Move to DLQ
        await moveToDLQ('flow-step', job.data, classifiedError, attemptsMade)

        // Throw to mark as failed
        throw new Error(`Permanent failure: ${retryDecision.reason}`)
      }

      console.warn(
        `[Flow Worker] ⚠️ Step will retry: ${retryDecision.reason} (delay: ${retryDecision.delay}ms)`
      )

      // Re-throw for BullMQ retry
      throw error
    }
  },
  {
    ...baseWorkerConfig,
    concurrency: 3, // Process 3 flow steps concurrently
  } as WorkerOptions
)

flowWorker.on('completed', (job) => {
  console.log(`[Flow Worker] Job completed: ${job.id}`)
})

flowWorker.on('failed', (job, error) => {
  console.error(`[Flow Worker] Job failed: ${job?.id}`, error)
})

flowWorker.on('error', (error) => {
  console.error('[Flow Worker] Worker error:', error)
})

console.log('✅ Flow Worker registered')
