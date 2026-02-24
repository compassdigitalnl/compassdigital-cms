/**
 * Flow Worker
 *
 * BullMQ worker that executes flow steps
 */

import { Worker, Job } from 'bullmq'
import { redis } from '../redis'
import { baseWorkerConfig } from '../config'
import { executeFlowStep } from '@/lib/email/flows/executor'

interface FlowStepJob {
  instanceId: string
  stepIndex: number
}

export const flowWorker = new Worker(
  'email-flows',
  async (job: Job<FlowStepJob>) => {
    const { instanceId, stepIndex } = job.data

    console.log(`[Flow Worker] Processing step ${stepIndex} for instance: ${instanceId}`)

    try {
      const result = await executeFlowStep(instanceId, stepIndex)

      if (result.success) {
        console.log(`[Flow Worker] Step completed successfully`)

        if (result.completed) {
          console.log(`[Flow Worker] Flow completed!`)
        } else if (result.nextStepIndex !== undefined) {
          console.log(`[Flow Worker] Moving to next step: ${result.nextStepIndex}`)
        }
      } else {
        console.error(`[Flow Worker] Step execution failed: ${result.error}`)
        throw new Error(result.error)
      }

      return {
        success: true,
        instanceId,
        stepIndex,
        completed: result.completed,
      }
    } catch (error: any) {
      console.error(`[Flow Worker] Error executing flow step:`, error)
      throw error // Re-throw for BullMQ retry logic
    }
  },
  {
    ...baseWorkerConfig,
    connection: redis,
    concurrency: 3, // Process 3 flow steps concurrently
  }
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
