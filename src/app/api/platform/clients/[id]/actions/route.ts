/**
 * Platform Client Actions API
 * POST /api/platform/clients/:id/actions - Execute client actions (suspend, activate, redeploy)
 */

import {
  POST_SuspendClient,
  POST_ActivateClient,
  POST_RedeployClient,
} from '@/branches/platform/api/clients'
import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const action = body.action

  switch (action) {
    case 'suspend':
      return POST_SuspendClient(id)
    case 'activate':
      return POST_ActivateClient(id)
    case 'redeploy':
      return POST_RedeployClient(id)
    default:
      return NextResponse.json(
        { success: false, error: `Unknown action: ${action}` },
        { status: 400 },
      )
  }
}
