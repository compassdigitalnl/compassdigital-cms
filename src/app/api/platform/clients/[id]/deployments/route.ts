/**
 * Platform Client Deployments API
 * GET /api/platform/clients/:id/deployments - Get deployment history
 */

import { GET_ClientDeployments } from '@/branches/platform/api/clients'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return GET_ClientDeployments(id, request as any)
}
