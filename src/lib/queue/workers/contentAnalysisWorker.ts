/**
 * Content Analysis Worker
 * Processes content analysis jobs in background with caching
 */

import { Worker, Job } from 'bullmq'
import { redis, getCached, generateContentHash } from '../redis'
import { QUEUE_NAMES, ContentAnalysisJob, baseWorkerConfig } from '../config'
import { contentAnalyzer } from '@/lib/ai'
import { sendSSEUpdate } from '../sse'

// Create worker
export const contentAnalysisWorker = new Worker(
  QUEUE_NAMES.CONTENT_ANALYSIS,
  async (job: Job<ContentAnalysisJob>) => {
    const { content, contentHash, language, includeGrammarCheck, cacheKey, sseConnectionId } = job.data

    console.log(`[WORKER] Processing content analysis: ${job.id}`)

    try {
      // Send initial progress update
      if (sseConnectionId) {
        await sendSSEUpdate(sseConnectionId, {
          type: 'progress',
          message: 'Analyzing content...',
          progress: 10,
        })
      }

      // Check cache first
      const cached = await redis.get(cacheKey)
      if (cached) {
        console.log(`[WORKER] Cache hit for ${cacheKey}`)
        const result = JSON.parse(cached)

        if (sseConnectionId) {
          await sendSSEUpdate(sseConnectionId, {
            type: 'complete',
            data: result,
            progress: 100,
            fromCache: true,
          })
        }

        return result
      }

      // Cache miss - execute analysis
      console.log(`[WORKER] Cache miss for ${cacheKey}, analyzing...`)

      // Send progress updates
      if (sseConnectionId) {
        await sendSSEUpdate(sseConnectionId, {
          type: 'progress',
          message: 'Running readability analysis...',
          progress: 20,
        })
      }

      // Perform analysis (this calls OpenAI)
      const result = await contentAnalyzer.analyzeContent(content, {
        language,
        includeGrammarCheck,
      })

      if (!result.success) {
        throw new Error(result.error || 'Analysis failed')
      }

      // Update progress
      if (sseConnectionId) {
        await sendSSEUpdate(sseConnectionId, {
          type: 'progress',
          message: 'Analysis complete!',
          progress: 90,
        })
      }

      // Cache the result (1 hour TTL for content analysis)
      await redis.setex(cacheKey, 60 * 60, JSON.stringify(result.data))

      // Send final result
      if (sseConnectionId) {
        await sendSSEUpdate(sseConnectionId, {
          type: 'complete',
          data: result.data,
          progress: 100,
          tokensUsed: result.tokensUsed,
          fromCache: false,
        })
      }

      console.log(`[WORKER] Content analysis complete: ${job.id}`)

      return result.data
    } catch (error) {
      console.error(`[WORKER] Content analysis failed: ${job.id}`, error)

      // Send error via SSE
      if (sseConnectionId) {
        await sendSSEUpdate(sseConnectionId, {
          type: 'error',
          error: error instanceof Error ? error.message : 'Analysis failed',
        })
      }

      throw error
    }
  },
  {
    ...baseWorkerConfig,
    concurrency: 3, // Max 3 concurrent content analyses
  }
)

// Worker event handlers
contentAnalysisWorker.on('completed', (job) => {
  console.log(`✅ [WORKER] Content analysis completed: ${job.id}`)
})

contentAnalysisWorker.on('failed', (job, err) => {
  console.error(`❌ [WORKER] Content analysis failed: ${job?.id}`, err)
})

contentAnalysisWorker.on('error', (err) => {
  console.error('❌ [WORKER] Content analysis worker error:', err)
})

console.log('✅ Content Analysis Worker started')
