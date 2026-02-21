/**
 * Platform Client Deployments API
 * GET /api/platform/clients/:id/deployments - Get deployment history
 */

import { GET_ClientDeployments } from '@/branches/platform/api/clients'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return GET_ClientDeployments(params.id, request as any)
}
