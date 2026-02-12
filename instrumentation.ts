/**
 * Next.js Instrumentation Hook
 * This runs once when the server starts
 * Perfect for initializing workers and background services
 */

import * as Sentry from '@sentry/nextjs'

export async function register() {
  // Initialize Sentry for error tracking
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }

  // Only run worker init on server-side
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('🚀 Initializing server instrumentation...')

    try {
      // Import and initialize Redis connection
      console.log('[INSTRUMENTATION] Importing Redis...')
      const { redis } = await import('./src/lib/queue/redis')
      console.log('[INSTRUMENTATION] Redis imported, status:', redis.status)

      // Wait for Redis to be ready
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Redis connection timeout'))
        }, 10000) // 10 second timeout

        if (redis.status === 'ready') {
          clearTimeout(timeout)
          resolve(true)
        } else {
          redis.once('ready', () => {
            clearTimeout(timeout)
            resolve(true)
          })
          redis.once('error', (err) => {
            clearTimeout(timeout)
            reject(err)
          })
        }
      })

      console.log('✅ Redis ready for workers')

      // Import and start workers
      console.log('[INSTRUMENTATION] Starting content analysis worker...')
      const workerModule = await import('./src/lib/queue/workers/contentAnalysisWorker')
      console.log('[INSTRUMENTATION] Worker module imported:', !!workerModule.contentAnalysisWorker)

      console.log('✅ All workers initialized')
      console.log('🎉 Background services ready!')
    } catch (error) {
      console.error('❌ Failed to initialize background services:')
      console.error(error)
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Stack trace:', error.stack)
      }
    }
  } else {
    console.log('[INSTRUMENTATION] Skipping worker initialization (not Node.js runtime)')
  }
}

/**
 * onRequestError Hook - Capture errors from nested React Server Components
 * Required for proper Sentry error reporting in Next.js App Router
 */
export function onRequestError(
  err: Error,
  request: {
    path: string
    method: string
    headers: Record<string, string | string[] | undefined>
  },
  context: {
    routerKind: 'Pages Router' | 'App Router'
    routePath: string
    routeType: 'render' | 'route' | 'middleware'
  }
) {
  Sentry.captureRequestError(err, request, context)
}
