/**
 * Site Generator Worker
 * Background worker that processes complete site generation jobs
 */

import { Worker, Job } from 'bullmq'
import { redis } from '../redis'
import { QUEUE_NAMES, baseWorkerConfig } from '../config'
import { sendSSEUpdate } from '../sse'
import { SiteGeneratorService } from '@/lib/siteGenerator/SiteGeneratorService'
import type { WizardState } from '@/lib/siteGenerator/types'

interface SiteGenerationJob {
  jobId: string
  wizardData: WizardState
  sseConnectionId?: string
  startedAt: string
}

/**
 * Create and export the site generator worker
 */
export const siteGeneratorWorker = new Worker(
  QUEUE_NAMES.SITE_GENERATION,
  async (job: Job<SiteGenerationJob>) => {
    const { jobId, wizardData, sseConnectionId } = job.data

    console.log(`[SiteGeneratorWorker] Starting site generation job: ${jobId}`)
    console.log(`[SiteGeneratorWorker] Company: ${wizardData.companyInfo.name}`)
    console.log(`[SiteGeneratorWorker] Pages: ${wizardData.content.pages.join(', ')}`)

    try {
      // Create progress callback
      const onProgress = async (progress: number, message: string) => {
        console.log(`[SiteGeneratorWorker] Progress: ${progress}% - ${message}`)

        // Send SSE update if connection ID provided
        if (sseConnectionId) {
          await sendSSEUpdate(sseConnectionId, {
            type: 'progress',
            progress,
            message,
          })
        }

        // Update job progress
        await job.updateProgress(progress)
      }

      // Create site generator service
      const generator = new SiteGeneratorService(onProgress)

      // Generate the site
      const result = await generator.generateSite(wizardData)

      console.log(`[SiteGeneratorWorker] Site generation completed: ${jobId}`)
      console.log(`[SiteGeneratorWorker] Generated ${result.pages.length} pages`)

      // Send completion notification
      if (sseConnectionId) {
        await sendSSEUpdate(sseConnectionId, {
          type: 'complete',
          message: 'Site generation completed!',
          progress: 100,
          data: result,
        })
      }

      return result
    } catch (error: any) {
      console.error(`[SiteGeneratorWorker] Error in job ${jobId}:`, error)

      // Send error notification
      if (sseConnectionId) {
        await sendSSEUpdate(sseConnectionId, {
          type: 'error',
          error: error.message || 'Site generation failed',
          message: 'Er is een fout opgetreden bij het genereren van de site',
        })
      }

      throw error
    }
  },
  {
    ...baseWorkerConfig,
    concurrency: 1, // Only 1 site generation at a time (resource intensive)
  },
)

// Worker event handlers
siteGeneratorWorker.on('completed', (job) => {
  console.log(`[SiteGeneratorWorker] ✓ Job ${job.id} completed`)
})

siteGeneratorWorker.on('failed', (job, err) => {
  console.error(`[SiteGeneratorWorker] ✗ Job ${job?.id} failed:`, err.message)
})

siteGeneratorWorker.on('active', (job) => {
  console.log(`[SiteGeneratorWorker] ▶ Job ${job.id} started processing`)
})

console.log('[SiteGeneratorWorker] Worker initialized and ready')
