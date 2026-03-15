/**
 * Platform Clients API
 * GET /api/platform/clients - List all clients
 * POST /api/platform/clients - Create new client
 *
 * Requires admin authentication.
 */

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { GET_Clients, POST_Clients } from '@/features/platform/api/clients'

async function requireAdmin(request: Request): Promise<{ authorized: true } | { authorized: false; response: NextResponse }> {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user || !('roles' in user) || !user.roles?.includes('admin')) {
    return { authorized: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { authorized: true }
}

export async function GET(request: Request) {
  const auth = await requireAdmin(request)
  if (!auth.authorized) return auth.response
  return GET_Clients(request as any)
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request)
  if (!auth.authorized) return auth.response
  return POST_Clients(request as any)
}
