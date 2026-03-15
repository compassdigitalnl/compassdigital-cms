/**
 * Platform Client by ID API
 * GET /api/platform/clients/:id - Get client details
 * PATCH /api/platform/clients/:id - Update client
 * DELETE /api/platform/clients/:id - Delete client
 *
 * Requires admin authentication.
 */

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { GET_ClientById, PATCH_Client, DELETE_Client } from '@/features/platform/api/clients'

async function requireAdmin(request: Request): Promise<{ authorized: true } | { authorized: false; response: NextResponse }> {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user || !('roles' in user) || !user.roles?.includes('admin')) {
    return { authorized: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { authorized: true }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  return GET_ClientById(id)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  return PATCH_Client(id, request as any)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  return DELETE_Client(id)
}
