/**
 * Platform Client by ID API
 * GET /api/platform/clients/:id - Get client details
 * PATCH /api/platform/clients/:id - Update client
 * DELETE /api/platform/clients/:id - Delete client
 */

import { GET_ClientById, PATCH_Client, DELETE_Client } from '@/branches/platform/api/clients'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return GET_ClientById(id)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return PATCH_Client(id, request as any)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return DELETE_Client(id)
}
