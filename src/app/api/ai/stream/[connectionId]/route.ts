import { NextRequest } from 'next/server'

// Simple in-memory store for SSE connections
const connections = new Map<string, ReadableStreamDefaultController>()
const encoders = new Map<string, TextEncoder>()

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Send progress update to a specific connection
export async function sendProgress(
  connectionId: string,
  data: { type: string; progress?: number; message?: string; data?: any; error?: string },
) {
  const controller = connections.get(connectionId)
  const encoder = encoders.get(connectionId)

  if (controller && encoder) {
    try {
      console.log(`📡 [SSE] Sending to ${connectionId}:`, data.type, data.progress)
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
    } catch (error) {
      console.error('❌ [SSE] Error sending message:', error)
      connections.delete(connectionId)
      encoders.delete(connectionId)
    }
  } else {
    console.warn(`⚠️  [SSE] No connection found for ${connectionId}`)
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ connectionId: string }> },
) {
  const { connectionId } = await params
  const encoder = new TextEncoder()

  console.log(`🔌 [SSE] New connection: ${connectionId}`)

  const stream = new ReadableStream({
    start(controller) {
      // Store the controller and encoder
      connections.set(connectionId, controller)
      encoders.set(connectionId, encoder)

      console.log(`✅ [SSE] Connection stored for ${connectionId}`)

      // Send initial connection message
      try {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`))
        console.log(`📡 [SSE] Sent 'connected' message to ${connectionId}`)
      } catch (error) {
        console.error('❌ [SSE] Error sending initial message:', error)
      }

      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        try {
          if (connections.has(connectionId)) {
            controller.enqueue(encoder.encode(': heartbeat\n\n'))
          } else {
            clearInterval(heartbeat)
          }
        } catch (error) {
          console.error('Error sending heartbeat:', error)
          clearInterval(heartbeat)
          connections.delete(connectionId)
          encoders.delete(connectionId)
        }
      }, 15000)

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat)
        connections.delete(connectionId)
        encoders.delete(connectionId)
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

// Export the sendProgress function for use in other modules
export { connections }
