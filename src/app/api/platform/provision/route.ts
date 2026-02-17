/**
 * POST /api/platform/provision
 *
 * Manual trigger for client site provisioning.
 * Useful for:
 * - Re-running a failed provisioning
 * - Provisioning from external scripts / CI pipelines
 * - Testing the provisioning flow without the Payload admin UI
 *
 * Body (JSON):
 *   { "clientId": "abc123", "provider": "ploi" }
 *
 * Security:
 *   Requires admin user session (cookie) OR PLATFORM_API_KEY header.
 *
 * Response:
 *   200 { success: true, deploymentUrl, adminUrl, logs }
 *   400 { error: "Missing clientId" }
 *   401 { error: "Unauthorized" }
 *   500 { error: "...", logs }
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    // ── Auth: check Payload session OR PLATFORM_API_KEY header ────────────
    const apiKey = req.headers.get('x-platform-api-key')
    const isPlatformKey = apiKey && apiKey === process.env.PLATFORM_API_KEY

    if (!isPlatformKey) {
      // Fall back to Payload session auth
      const payload = await getPayload({ config })
      const { user } = await payload.auth({ headers: req.headers })

      if (!user || !('roles' in user) || !(user as any).roles?.includes('admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    // ── Parse body ─────────────────────────────────────────────────────────
    let body: { clientId?: string; provider?: string; extraEnv?: Record<string, string> }

    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { clientId, provider = 'ploi', extraEnv } = body

    if (!clientId) {
      return NextResponse.json({ error: 'Missing required field: clientId' }, { status: 400 })
    }

    if (provider !== 'ploi' && provider !== 'vercel') {
      return NextResponse.json({ error: 'Invalid provider. Use "ploi" or "vercel".' }, { status: 400 })
    }

    // ── Run provisioning ───────────────────────────────────────────────────
    console.log(`[API /provision] Starting provisioning for client ${clientId} via ${provider}`)

    const { provisionClient } = await import('@/lib/provisioning/provisionClient')

    const result = await provisionClient({
      clientId,
      provider: provider as 'ploi' | 'vercel',
      extraEnv: extraEnv || {},
      verbose: true,
    })

    // ── Return result ──────────────────────────────────────────────────────
    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          clientId: result.clientId,
          deploymentUrl: result.deploymentUrl,
          adminUrl: result.adminUrl,
          port: result.logs?.find((l) => l.includes('Port allocated'))?.match(/\d+/)?.[0],
          status: result.status,
          completedAt: result.completedAt,
          logs: result.logs,
        },
        { status: 200 },
      )
    } else {
      return NextResponse.json(
        {
          success: false,
          clientId: result.clientId,
          error: result.error,
          status: result.status,
          logs: result.logs,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error('[API /provision] Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 },
    )
  }
}

/**
 * GET /api/platform/provision
 * Returns status info (so you can check if the endpoint is available)
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/platform/provision',
    method: 'POST',
    description: 'Trigger full client site provisioning',
    body: {
      clientId: 'string (required) — Payload client document ID',
      provider: '"ploi" | "vercel" (default: ploi)',
      extraEnv: 'Record<string, string> (optional) — extra env vars to merge',
    },
    auth: 'Admin session cookie OR x-platform-api-key header',
  })
}
