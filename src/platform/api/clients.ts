/**
 * 🔌 Client Management API
 *
 * RESTful API endpoints for managing clients in the platform.
 * Used by the Global Admin dashboard.
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
/** Shape expected by POST /api/platform/clients */
interface ProvisioningRequest {
  clientName: string
  contactEmail: string
  domain: string
  template: string
  plan?: string
  extraEnv?: Record<string, string>
}

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

    // Create client record in Payload
    console.log('[API] Creating client record:', body.clientName)
    const { getPayloadClient } = await import('@/lib/getPlatformPayload')
    const payload = await getPayloadClient()

    const newClient = await payload.create({
      collection: 'clients',
      data: {
        name: body.clientName,
        domain: body.domain,
        contactEmail: body.contactEmail,
        template: body.template as any,
        plan: (body.plan || 'starter') as any,
        status: 'pending',
        customEnvironment: body.extraEnv || {},
      },
      overrideAccess: true,
      context: { skipProvisioningHook: true },
    } as any)

    // Provision via Ploi in background
    console.log('[API] Starting client provisioning:', body.clientName)
    const { provisionClient } = await import('@/lib/provisioning/provisionClient')

    const result = await provisionClient({
      clientId: String(newClient.id),
      provider: 'ploi',
      extraEnv: body.extraEnv || {},
      verbose: true,
    })

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

    // Mark as archived before deleting (so webhooks/hooks know this is intentional)
    await payload.update({
      collection: 'clients',
      id: clientId,
      data: { status: 'archived' },
      context: { skipProvisioningHook: true },
    } as any)

    // TODO: Add Ploi site cleanup here when needed (delete site + database via Ploi API)

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

    // Fetch deployments from Payload
    const result = await payload.find({
      collection: 'deployments',
      where: {
        client: { equals: clientId },
      },
      limit,
      sort: '-createdAt',
    })
    const deployments = result.docs

    return NextResponse.json({
      success: true,
      data: deployments,
      source: 'payload',
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

    // 2. Trigger Ploi re-provisioning
    console.log(`[API] Triggering re-provisioning for client ${client.name} via Ploi`)
    const { provisionClient } = await import('@/lib/provisioning/provisionClient')

    // Fire and forget — update status first so the admin sees progress
    await payload.update({
      collection: 'clients',
      id: clientId,
      data: { status: 'provisioning' },
      context: { skipProvisioningHook: true },
    } as any)

    // Run provisioning in background
    provisionClient({
      clientId,
      provider: 'ploi',
      verbose: true,
    }).catch((err: any) => {
      console.error(`[API] Re-provisioning failed for ${client.name}:`, err)
    })

    return NextResponse.json({
      success: true,
      message: 'Re-provisioning gestart via Ploi',
      clientId,
      status: 'provisioning',
    })
  } catch (error: any) {
    console.error('[API] Error redeploying client:', error)
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
