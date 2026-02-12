/**
 * Server-Sent Events (SSE) for Real-time Updates
 * Allows workers to push updates to connected clients
 */

import { redis } from './redis'

interface SSEUpdate {
  type: 'progress' | 'complete' | 'error'
  message?: string
  progress?: number
  data?: any
  error?: string
  tokensUsed?: number
  fromCache?: boolean
}

// Store SSE connections in memory (could use Redis for multi-server)
const sseConnections = new Map<string, (data: SSEUpdate) => void>()

/**
 * Register SSE connection
 */
export function registerSSEConnection(
  connectionId: string,
  callback: (data: SSEUpdate) => void
) {
  sseConnections.set(connectionId, callback)
  console.log(`[SSE] Connection registered: ${connectionId}`)

  // Auto-cleanup after 5 minutes
  setTimeout(() => {
    if (sseConnections.has(connectionId)) {
      sseConnections.delete(connectionId)
      console.log(`[SSE] Connection auto-removed: ${connectionId}`)
    }
  }, 5 * 60 * 1000)
}

/**
 * Unregister SSE connection
 */
export function unregisterSSEConnection(connectionId: string) {
  sseConnections.delete(connectionId)
  console.log(`[SSE] Connection unregistered: ${connectionId}`)
}

/**
 * Send update to SSE connection
 */
export async function sendSSEUpdate(connectionId: string, update: SSEUpdate) {
  const callback = sseConnections.get(connectionId)

  if (callback) {
    callback(update)
    console.log(`[SSE] Update sent to ${connectionId}:`, update.type)
  } else {
    // If connection not in memory, try publishing to Redis (for multi-server)
    await redis.publish(`sse:${connectionId}`, JSON.stringify(update))
    console.log(`[SSE] Update published to Redis for ${connectionId}`)
  }
}

/**
 * Subscribe to SSE updates from Redis (for multi-server setup)
 */
export function subscribeToSSEUpdates() {
  const subscriber = redis.duplicate()

  subscriber.psubscribe('sse:*', (err, count) => {
    if (err) {
      console.error('[SSE] Redis subscription error:', err)
      return
    }
    console.log(`[SSE] Subscribed to ${count} Redis channels`)
  })

  subscriber.on('pmessage', (pattern, channel, message) => {
    const connectionId = channel.split(':')[1]
    const update: SSEUpdate = JSON.parse(message)

    const callback = sseConnections.get(connectionId)
    if (callback) {
      callback(update)
    }
  })

  return subscriber
}

// Start Redis subscription for multi-server support
subscribeToSSEUpdates()

/**
 * Format SSE message
 */
export function formatSSEMessage(data: SSEUpdate): string {
  return `data: ${JSON.stringify(data)}\n\n`
}

/**
 * Create SSE response headers
 */
export function getSSEHeaders() {
  return {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no', // Disable Nginx buffering
  }
}
