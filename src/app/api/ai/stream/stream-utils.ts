// SSE connection utilities
// Moved from route.ts to fix Next.js type error

// Simple in-memory store for SSE connections
export const connections = new Map<string, ReadableStreamDefaultController>()
const encoders = new Map<string, TextEncoder>()

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
  }
}

// Close a specific connection
export function closeConnection(connectionId: string) {
  const controller = connections.get(connectionId)
  if (controller) {
    try {
      controller.close()
      console.log(`🔌 [SSE] Closed connection ${connectionId}`)
    } catch (error) {
      console.error('❌ [SSE] Error closing connection:', error)
    }
    connections.delete(connectionId)
    encoders.delete(connectionId)
  }
}

// Initialize encoder for a connection
export function initializeEncoder(connectionId: string) {
  encoders.set(connectionId, new TextEncoder())
}
