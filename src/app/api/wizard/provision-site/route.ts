/**
 * 1-Click Client Provisioning API Endpoint
 *
 * Complete workflow:
 * 1. Generate site content with AI (SiteGeneratorService)
 * 2. Provision deployment (ProvisioningService)
 * 3. Deploy to Vercel/Ploi
 * 4. Configure environment & domains
 * 5. Monitor deployment
 * 6. Return live site URL
 *
 * Uses SSE for real-time progress updates
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendProgress } from '@/app/api/ai/stream/[connectionId]/route'
import { WizardState } from '@/lib/siteGenerator/types'
import type { ProvisioningProgress } from '@/lib/provisioning/types'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes for full provisioning

interface ProvisionSiteRequest {
  wizardData: WizardState
  clientId?: string // Optional - will be created if not provided
  sseConnectionId: string
  deploymentProvider?: 'vercel' | 'ploi'
}

/**
 * Complete provisioning workflow
 */
async function provisionClientSite(
  wizardData: WizardState,
  clientIdInput: string | undefined,
  sseConnectionId: string,
  deploymentProvider: 'vercel' | 'ploi' = 'vercel',
) {
  console.log('🎬 [Provisioning] provisionClientSite started', {
    sseConnectionId,
    deploymentProvider,
    hasClientId: !!clientIdInput,
  })

  try {
    console.log('🔌 [Provisioning] Getting Payload instance...')
    const payload = await getPayload({ config })
    console.log('✅ [Provisioning] Payload instance ready')

    // Progress callback for SSE updates
    const sendProgressUpdate = async (progress: number, message: string, data?: any) => {
      console.log(`📊 [Provisioning] Progress ${progress}%: ${message}`)
      await sendProgress(sseConnectionId, {
        type: 'progress',
        progress,
        message,
        data,
      })
    }

    // ===== STEP 0: Create Client record if not provided =====
    let clientId = clientIdInput
    console.log('👤 [Provisioning] Client ID check:', clientId ? 'Using existing' : 'Creating new')

    if (!clientId) {
      console.log('📝 [Provisioning] Creating new client...')
      await sendProgressUpdate(2, '📝 Creating client record...')

      const clientDomain = wizardData.companyInfo.name
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-') // Replace non-alphanumeric (except hyphens) with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens

      console.log('🔍 [Provisioning] Generated domain:', clientDomain, 'from name:', wizardData.companyInfo.name)

      // Create client with overrideAccess to bypass authentication
      const newClient = await payload.create({
        collection: 'clients',
        data: {
          name: wizardData.companyInfo.name,
          domain: clientDomain,
          contactEmail: wizardData.companyInfo.contactInfo?.email || 'info@example.com',
          contactName: wizardData.companyInfo.name,
          template: 'corporate' as const,
          status: 'pending',
        },
        overrideAccess: true, // Bypass access control for system operation
      })

      clientId = String(newClient.id)
      await sendProgressUpdate(3, `✅ Client created: ${newClient.name}`)
    }

    // ===== STEP 1: Generate Site Content with AI =====
    await sendProgressUpdate(5, '🎨 Generating site content with AI...')

    const { SiteGeneratorService } = await import('@/lib/siteGenerator/SiteGeneratorService')

    const onAIProgress = async (progress: number, message: string) => {
      // AI generation takes 5-50% of total progress
      const totalProgress = 5 + (progress * 0.45)
      await sendProgressUpdate(totalProgress, `🎨 ${message}`)
    }

    const generator = new SiteGeneratorService(onAIProgress)
    const siteResult = await generator.generateSite(wizardData)

    await sendProgressUpdate(50, `✅ Site generated: ${siteResult.pages.length} pages created`)

    // ===== STEP 2: Start Provisioning =====
    await sendProgressUpdate(55, '🚀 Starting deployment provisioning...')

    const { createProvisioningService } = await import('@/lib/provisioning/ProvisioningService')

    // Create provisioning service with specified provider
    const provisioningService = await createProvisioningService(
      deploymentProvider, // 'vercel' or 'ploi'
      {
        onProgress: async (provProgress: ProvisioningProgress) => {
          // Provisioning takes 55-100% of total progress
          const totalProgress = 55 + (provProgress.percentage * 0.45)
          await sendProgressUpdate(
            totalProgress,
            `🚀 ${provProgress.message}`,
            provProgress.metadata,
          )
        },
      },
    )

    // Get client details (with overrideAccess for system operation)
    const client = await payload.findByID({
      collection: 'clients',
      id: clientId,
      overrideAccess: true,
    })

    // ===== STEP 3: Provision & Deploy =====
    const provisioningResult = await provisioningService.provision({
      clientId: String(clientId),
      clientName: client.name,
      domain: client.domain,
      siteData: {
        siteName: wizardData.companyInfo.name,
        industry: wizardData.companyInfo.industry,
        primaryColor: wizardData.design?.colorScheme?.primary || '#3B82F6',
        pages: siteResult.pages,
      },
      provider: deploymentProvider,
      region: 'iad1', // US East (default)
    })

    // ===== STEP 4: Handle Result =====
    if (!provisioningResult.success) {
      throw new Error(provisioningResult.error || 'Provisioning failed')
    }

    // ===== STEP 5: Success! =====
    await sendProgress(sseConnectionId, {
      type: 'complete',
      data: {
        deploymentUrl: provisioningResult.deploymentUrl,
        adminUrl: provisioningResult.adminUrl,
        previewUrl: provisioningResult.deploymentUrl,
        pages: siteResult.pages.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
        })),
        provisioningLogs: provisioningResult.logs,
      },
    })

    return provisioningResult
  } catch (error: any) {
    console.error('[Provisioning] Error:', error)

    // Send error to client via SSE
    await sendProgress(sseConnectionId, {
      type: 'error',
      error: error.message || 'Provisioning failed',
    })

    throw error
  }
}

/**
 * POST /api/wizard/provision-site
 *
 * Accepts wizard data, client ID, and SSE connection ID
 * Returns immediately, provisioning happens in background
 */
export async function POST(request: NextRequest) {
  console.log('🚀 [Provisioning API] POST handler called')

  try {
    console.log('📦 [Provisioning API] Parsing request body...')
    const body: ProvisionSiteRequest = await request.json()

    console.log('📋 [Provisioning API] Body:', {
      hasWizardData: !!body.wizardData,
      hasSseConnectionId: !!body.sseConnectionId,
      sseConnectionId: body.sseConnectionId,
      deploymentProvider: body.deploymentProvider,
    })

    if (!body.wizardData || !body.sseConnectionId) {
      console.error('❌ [Provisioning API] Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields: wizardData, sseConnectionId' },
        { status: 400 },
      )
    }

    console.log('✅ [Provisioning API] Starting provisioning in background...')

    // Start provisioning in background (fire and forget)
    // clientId is optional - will be created if not provided
    provisionClientSite(
      body.wizardData,
      body.clientId, // Can be undefined
      body.sseConnectionId,
      body.deploymentProvider || 'ploi', // Default to Ploi!
    ).catch((error) => {
      console.error('[Provisioning] Background error:', error)
    })

    console.log('✅ [Provisioning API] Returning success response')

    // Return immediately with job accepted
    return NextResponse.json({
      success: true,
      message: 'Provisioning started',
      sseConnectionId: body.sseConnectionId,
    })
  } catch (error: any) {
    console.error('[Provisioning API] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to start provisioning' },
      { status: 500 },
    )
  }
}

/**
 * GET /api/wizard/provision-site/status/:clientId
 *
 * Check provisioning status for a client
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const clientId = url.searchParams.get('clientId')

    if (!clientId) {
      return NextResponse.json({ error: 'Missing clientId parameter' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const client = await payload.findByID({
      collection: 'clients',
      id: clientId,
    })

    return NextResponse.json({
      success: true,
      client: {
        id: client.id,
        name: client.name,
        domain: client.domain,
        status: client.status,
        deploymentUrl: client.deploymentUrl,
        adminUrl: client.adminUrl,
        lastDeployedAt: client.lastDeployedAt,
      },
    })
  } catch (error: any) {
    console.error('[Provisioning Status] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
