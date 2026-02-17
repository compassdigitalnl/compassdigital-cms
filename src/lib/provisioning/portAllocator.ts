/**
 * Port Allocator
 *
 * Assigns unique Node.js ports to client sites on the Ploi server.
 * Each client site runs a separate Node.js/PM2 process on its own port.
 * Nginx proxies port 80/443 → the assigned port.
 *
 * Port range: 4001–9999
 * Ports 3000–4000 are reserved for common services (dev server, the platform
 * CMS itself, Redis, other known processes on the server).
 */

const PORT_BASE = 4001
const PORT_MAX = 9999

/**
 * Find the next available port by querying all existing clients.
 * Picks max(used ports) + 1, starting from PORT_BASE.
 *
 * Uses dynamic import to avoid Payload build-time initialisation.
 */
export async function getNextAvailablePort(): Promise<number> {
  try {
    // Lazy-load Payload to avoid build-time issues
    const { getPayload } = await import('payload')
    const { default: config } = await import('@payload-config')

    const payload = await getPayload({ config })

    // Fetch all clients that already have a port assigned
    const result = await payload.find({
      collection: 'clients',
      where: {
        port: {
          greater_than: 0,
        },
      },
      limit: 1000,
      depth: 0,
    })

    if (result.docs.length === 0) {
      return PORT_BASE
    }

    // Find highest used port (accept any port >= 3001 so old records below new PORT_BASE are still considered)
    const usedPorts = result.docs
      .map((doc: any) => doc.port as number)
      .filter((p) => typeof p === 'number' && p >= 3001 && p <= PORT_MAX)

    if (usedPorts.length === 0) {
      return PORT_BASE
    }

    const maxPort = Math.max(...usedPorts)
    const nextPort = maxPort + 1

    if (nextPort > PORT_MAX) {
      throw new Error(`Port range exhausted (all ports ${PORT_BASE}–${PORT_MAX} are in use)`)
    }

    return nextPort
  } catch (error: any) {
    // If Payload is not available (e.g. during tests), fall back to PORT_BASE
    console.warn('[portAllocator] Could not query Payload, falling back to PORT_BASE:', error.message)
    return PORT_BASE
  }
}
