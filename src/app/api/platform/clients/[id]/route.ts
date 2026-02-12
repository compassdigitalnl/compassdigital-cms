/**
 * Platform Client by ID API
 * GET /api/platform/clients/:id - Get client details
 * PATCH /api/platform/clients/:id - Update client
 * DELETE /api/platform/clients/:id - Delete client
 */

import { GET_ClientById, PATCH_Client, DELETE_Client } from '@/platform/api/clients'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return GET_ClientById(params.id)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  return PATCH_Client(params.id, request as any)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return DELETE_Client(params.id)
}
