/**
 * Platform Client Health API
 * GET /api/platform/clients/:id/health - Check client health
 */

import { GET_ClientHealth } from '@/platform/api/clients'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return GET_ClientHealth(params.id)
}
