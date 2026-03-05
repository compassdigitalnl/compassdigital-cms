/**
 * Platform Client Health API
 * GET /api/platform/clients/:id/health - Check client health
 */

import { GET_ClientHealth } from '@/features/platform/api/clients'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return GET_ClientHealth(id)
}
