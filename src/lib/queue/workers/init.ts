/**
 * Worker Initialization
 * Call this once to start all workers
 */

let initialized = false
let initializing = false

export async function initializeWorkers() {
  if (initialized) {
    console.log('[WORKERS] Already initialized')
    return
  }

  if (initializing) {
    console.log('[WORKERS] Initialization in progress...')
    // Wait for initialization to complete
    while (initializing) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    return
  }

  initializing = true
  console.log('[WORKERS] Initializing workers...')

  try {
    // Import Redis and wait for connection
    const { redis } = await import('../redis')

    // Wait for Redis to be ready
    if (redis.status !== 'ready') {
      console.log('[WORKERS] Waiting for Redis connection...')
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Redis connection timeout'))
        }, 10000)

        redis.once('ready', () => {
          clearTimeout(timeout)
          resolve()
        })

        redis.once('error', (err) => {
          clearTimeout(timeout)
          reject(err)
        })
      })
    }

    console.log('[WORKERS] Redis connected')

    // Import and initialize content analysis worker
    await import('./contentAnalysisWorker')
    console.log('[WORKERS] Content analysis worker started')

    // Import and initialize site generator worker
    await import('./siteGeneratorWorker')
    console.log('[WORKERS] Site generator worker started')

    initialized = true
    initializing = false

    console.log('✅ [WORKERS] All workers initialized and ready!')
  } catch (error) {
    initializing = false
    console.error('❌ [WORKERS] Failed to initialize:', error)
    throw error
  }
}
