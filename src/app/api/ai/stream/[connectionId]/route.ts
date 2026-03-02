import { NextRequest } from 'next/server'
import { connections, initializeEncoder, closeConnection } from '../stream-utils'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
      initializeEncoder(connectionId)

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
          closeConnection(connectionId)
        }
      }, 15000)

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat)
        closeConnection(connectionId)
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
