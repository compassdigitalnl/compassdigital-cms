/**
 * 🔌 Client Management API
 *
 * RESTful API endpoints for managing clients in the platform.
 * Used by the Global Admin dashboard.
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { provisionClient, deprovisionClient } from '../services/provisioning'
import type { ProvisioningRequest } from '../services/provisioning'

/**
 * GET /api/platform/clients
 * List all clients with optional filtering
 */
export async function GET_Clients(request: NextRequest) {
  try {
    const { getPayloadClient } = await import('@/lib/getPlatformPayload')
    const payload = await getPayloadClient()

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const template = searchParams.get('template')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build where clause
    const where: any = {}
    if (status) where.status = { equals: status }
    if (template) where.template = { equals: template }
    if (search) {
      where.or = [
        { name: { contains: search } },
        { domain: { contains: search } },
        { contactEmail: { contains: search } },
      ]
    }

    // Query clients from Payload
    const result = await payload.find({
      collection: 'clients',
      where,
      page,
      limit,
      sort: '-createdAt',
    })

    return NextResponse.json({
      success: true,
      data: result.docs,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.totalDocs,
        totalPages: result.totalPages,
      },
    })
  } catch (error: any) {
    console.error('[API] Error fetching clients:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * POST /api/platform/clients
 * Create and provision new client
 */
export async function POST_Clients(request: NextRequest) {
  try {
    const body: ProvisioningRequest = await request.json()

    // Validate required fields
    if (!body.clientName || !body.contactEmail || !body.domain || !body.template) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: clientName, contactEmail, domain, template',
        },
        { status: 400 },
      )
    }

    // Start provisioning
    console.log('[API] Starting client provisioning:', body.clientName)
    const result = await provisionClient(body)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          logs: result.logs,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        clientId: result.clientId,
        deploymentUrl: result.deploymentUrl,
        adminUrl: result.adminUrl,
      },
      logs: result.logs,
    })
  } catch (error: any) {
    console.error('[API] Error creating client:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * GET /api/platform/clients/:id
 * Get single client details
 */
export async function GET_ClientById(clientId: string) {
  try {
    const { getPayloadClient } = await import('@/lib/getPlatformPayload')
    const payload = await getPayloadClient()

    const client = await payload.findByID({
      collection: 'clients',
      id: clientId,
    })

    return NextResponse.json({
      success: true,
      data: client,
    })
  } catch (error: any) {
    console.error('[API] Error fetching client:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * PATCH /api/platform/clients/:id
 * Update client configuration
 */
export async function PATCH_Client(clientId: string, request: NextRequest) {
  try {
    const { getPayloadClient } = await import('@/lib/getPlatformPayload')
    const payload = await getPayloadClient()
    const updates = await request.json()

    const client = await payload.update({
      collection: 'clients',
      id: clientId,
      data: updates,
    })

    return NextResponse.json({
      success: true,
      data: client,
    })
  } catch (error: any) {
    console.error('[API] Error updating client:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * DELETE /api/platform/clients/:id
 * Deprovision and delete client
 */
export async function DELETE_Client(clientId: string) {
  try {
    const { getPayloadClient } = await import('@/lib/getPlatformPayload')
    const payload = await getPayloadClient()

    // Deprovision resources
    const result = await deprovisionClient(clientId)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 },
      )
    }

    // Delete from Payload
    await payload.delete({
      collection: 'clients',
      id: clientId,
    })

    return NextResponse.json({
      success: true,
      message: 'Client deprovisioned and deleted',
    })
  } catch (error: any) {
    console.error('[API] Error deleting client:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * POST /api/platform/clients/:id/suspend
 * Suspend client (disable site but keep data)
 */
export async function POST_SuspendClient(clientId: string) {
  try {
    // TODO: Implement suspension logic
    // 1. Update client status to 'suspended'
    // 2. Disable Vercel deployment (optional)
    // 3. Send notification to client

    return NextResponse.json({
      success: true,
      message: 'Client suspended',
    })
  } catch (error: any) {
    console.error('[API] Error suspending client:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * POST /api/platform/clients/:id/activate
 * Reactivate suspended client
 */
export async function POST_ActivateClient(clientId: string) {
  try {
    // TODO: Implement activation logic
    // 1. Update client status to 'active'
    // 2. Re-enable Vercel deployment
    // 3. Send notification to client

    return NextResponse.json({
      success: true,
      message: 'Client activated',
    })
  } catch (error: any) {
    console.error('[API] Error activating client:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * GET /api/platform/clients/:id/health
 * Check client site health
 */
export async function GET_ClientHealth(clientId: string) {
  try {
    // TODO: Implement health check
    // 1. Fetch client deployment URL
    // 2. Call /api/health endpoint
    // 3. Return results

    return NextResponse.json({
      success: true,
      data: {
        status: 'healthy',
        uptime: 99.9,
        lastCheck: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error('[API] Error checking client health:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * GET /api/platform/clients/:id/deployments
 * Get deployment history for client
 */
export async function GET_ClientDeployments(clientId: string, request: NextRequest) {
  try {
    const { getPayloadClient } = await import('@/lib/getPlatformPayload')
    const payload = await getPayloadClient()
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get client details first
    const client = await payload.findByID({
      collection: 'clients',
      id: clientId,
    })

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 },
      )
    }

    let deployments: any[] = []

    // Try to fetch from Vercel if configured
    if (process.env.VERCEL_API_TOKEN) {
      try {
        const { getVercelService } = await import('@/lib/vercel/VercelService')
        const vercel = getVercelService()

        const vercelProjectName = (client as any).vercelProjectId || client.domain
        console.log('[API] Fetching deployments from Vercel for project:', vercelProjectName)

        const result = await vercel.listDeployments(vercelProjectName, limit)

        // Transform Vercel deployments to our format
        deployments = result.deployments.map((d) => ({
          id: d.uid,
          deploymentId: d.uid,
          deploymentUrl: `https://${d.url}`,
          status: d.state.toLowerCase(),
          environment: 'production',
          createdAt: new Date(d.created).toISOString(),
          state: d.state,
          alias: d.alias,
          meta: d.meta,
        }))
      } catch (vercelError: any) {
        console.warn('[API] Failed to fetch from Vercel, falling back to Payload:', vercelError.message)
      }
    }

    // If Vercel fetch failed or not configured, use Payload
    if (deployments.length === 0) {
      const result = await payload.find({
        collection: 'deployments',
        where: {
          client: { equals: clientId },
        },
        limit,
        sort: '-createdAt',
      })
      deployments = result.docs
    }

    return NextResponse.json({
      success: true,
      data: deployments,
      source: deployments.length > 0 && deployments[0].state ? 'vercel' : 'payload',
    })
  } catch (error: any) {
    console.error('[API] Error fetching deployments:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * POST /api/platform/clients/:id/redeploy
 * Trigger redeployment for client
 */
export async function POST_RedeployClient(clientId: string) {
  try {
    // 1. Get client details
    const { getPayloadClient } = await import('@/lib/getPlatformPayload')
    const payload = await getPayloadClient()

    const client = await payload.findByID({
      collection: 'clients',
      id: clientId,
    })

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 },
      )
    }

    // 2. Check if Vercel is configured
    if (!process.env.VERCEL_API_TOKEN) {
      console.warn('[API] Vercel API token not configured, returning mock deployment')
      return NextResponse.json({
        success: true,
        message: 'Redeployment triggered (mock - configure VERCEL_API_TOKEN for real deployments)',
        deploymentId: `dpl_mock_${Date.now()}`,
        deploymentUrl: `https://${client.domain}-preview.vercel.app`,
      })
    }

    // 3. Trigger Vercel deployment
    const { getVercelService } = await import('@/lib/vercel/VercelService')
    const vercel = getVercelService()

    // Get the Vercel project name (typically the domain or a variation)
    const vercelProjectName = (client as any).vercelProjectId || client.domain

    console.log('[API] Triggering redeploy for project:', vercelProjectName)
    const deployment = await vercel.redeploy(vercelProjectName)

    // 4. Create deployment record in Payload
    await payload.create({
      collection: 'deployments',
      data: {
        client: clientId,
        status: deployment.state === 'READY' ? 'success' : 'in_progress',
        deploymentId: deployment.uid,
        deploymentUrl: `https://${deployment.url}`,
        environment: 'production',
        triggeredBy: 'manual',
      },
    })

    // 5. Update client status to deploying
    await payload.update({
      collection: 'clients',
      id: clientId,
      data: {
        status: 'deploying',
        deploymentUrl: `https://${deployment.url}`,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Redeployment triggered successfully',
      deploymentId: deployment.uid,
      deploymentUrl: `https://${deployment.url}`,
      state: deployment.state,
    })
  } catch (error: any) {
    console.error('[API] Error redeploying client:', error)

    // Check if it's a Vercel API error
    if (error.message?.includes('Vercel API error')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to trigger deployment on Vercel. Please check your Vercel API configuration.',
          details: error.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * GET /api/platform/stats
 * Get platform-wide statistics
 */
export async function GET_PlatformStats() {
  try {
    const { getPayloadClient } = await import('@/lib/getPlatformPayload')
    const payload = await getPayloadClient()

    // Aggregate statistics
    const [totalClients, activeClients, suspendedClients, failedDeployments] = await Promise.all([
      payload.count({ collection: 'clients' }),
      payload.count({ collection: 'clients', where: { status: { equals: 'active' } } }),
      payload.count({ collection: 'clients', where: { status: { equals: 'suspended' } } }),
      payload.count({ collection: 'deployments', where: { status: { equals: 'failed' } } }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalClients: totalClients.totalDocs,
        activeClients: activeClients.totalDocs,
        suspendedClients: suspendedClients.totalDocs,
        failedDeployments: failedDeployments.totalDocs,
      },
    })
  } catch (error: any) {
    console.error('[API] Error fetching stats:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
