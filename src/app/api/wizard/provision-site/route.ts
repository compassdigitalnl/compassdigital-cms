/**
 * CMS Builder Provisioning API Endpoint
 *
 * Complete workflow:
 * 1. Bereken CMS-configuratie op basis van wizard-antwoorden (CMSConfigService)
 * 2. Maak Client record aan in Payload (met juiste template + disabledCollections)
 * 3. Start Ploi-provisioning (ProvisioningService)
 * 4. Geef real-time progress via SSE
 * 5. Return live adminUrl + credentials
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendProgress } from '@/app/api/ai/stream/[connectionId]/route'
import { WizardState } from '@/lib/siteGenerator/types'
import { computeCMSConfig } from '@/lib/provisioning/CMSConfigService'
import type { ProvisioningProgress } from '@/lib/provisioning/types'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes for full provisioning

interface ProvisionSiteRequest {
  wizardData: WizardState
  clientId?: string // Optioneel — wordt aangemaakt als niet opgegeven
  sseConnectionId: string
}

/**
 * Complete provisioning workflow
 */
async function provisionClientSite(
  wizardData: WizardState,
  clientIdInput: string | undefined,
  sseConnectionId: string,
) {
  console.log('[Provisioning] provisionClientSite started', {
    sseConnectionId,
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

    // ===== STAP 0: Bereken CMS-configuratie op basis van wizard-antwoorden =====
    await sendProgressUpdate(2, 'CMS-configuratie bepalen...')
    const cmsConfig = computeCMSConfig(wizardData)
    console.log(`[Provisioning] CMS Config: ${cmsConfig.summary}`)
    console.log(`[Provisioning] Disabled collections: ${cmsConfig.disabledCollections.join(', ') || 'geen'}`)
    await sendProgressUpdate(4, `CMS-configuratie: ${cmsConfig.summary}`)

    // ===== STAP 1: Maak Client record aan (of gebruik bestaande) =====
    let clientId = clientIdInput
    if (!clientId) {
      await sendProgressUpdate(5, 'Client aanmaken...')

      const clientDomain = wizardData.companyInfo.name
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

      const newClient = await payload.create({
        collection: 'clients',
        data: {
          name: wizardData.companyInfo.name,
          domain: clientDomain,
          contactEmail: wizardData.companyInfo.contactInfo?.email || 'info@example.com',
          contactName: wizardData.companyInfo.name,
          template: cmsConfig.templateId as any,
          status: 'pending',
          // Sla CMS-configuratie op in het client record
          disabledCollections: cmsConfig.disabledCollections as any,
          customSettings: {
            primaryColor: wizardData.design?.colorScheme?.primary || '#3B82F6',
            siteGoal: wizardData.siteGoal,
            cmsConfigSummary: cmsConfig.summary,
          },
          customEnvironment: cmsConfig.envVars,
        },
        overrideAccess: true,
        context: { skipProvisioningHook: true }, // Wij starten provisioning zelf
      } as any)

      clientId = String(newClient.id)
      await sendProgressUpdate(8, `Client aangemaakt: ${newClient.name}`)
    }

    // ===== STAP 2: Start Provisioning via Ploi =====
    await sendProgressUpdate(10, 'Deployment starten via Ploi...')

    const { createProvisioningService } = await import('@/lib/provisioning/ProvisioningService')

    const provisioningService = await createProvisioningService('ploi', {
      onProgress: async (provProgress: ProvisioningProgress) => {
        // Provisioning neemt 10-100% van de totale progress
        const totalProgress = 10 + (provProgress.percentage * 0.9)
        await sendProgressUpdate(
          Math.min(Math.round(totalProgress), 99),
          provProgress.message,
          provProgress.metadata,
        )
      },
    })

    // Haal client op voor provisioning
    const client = await payload.findByID({
      collection: 'clients',
      id: clientId,
      overrideAccess: true,
    })

    // ===== STAP 3: Provision & Deploy =====
    const provisioningResult = await provisioningService.provision({
      clientId: String(clientId),
      clientName: client.name,
      domain: client.domain,
      contactEmail: (client as any).contactEmail,
      siteData: {
        siteName: wizardData.companyInfo.name,
        industry: wizardData.companyInfo.industry,
        primaryColor: wizardData.design?.colorScheme?.primary || '#3B82F6',
      },
      provider: 'ploi',
      // Geef CMS env vars mee — DISABLED_COLLECTIONS wordt hiermee gezet op de Ploi-site
      environmentVariables: cmsConfig.envVars,
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
        cmsConfig: {
          template: cmsConfig.templateId,
          summary: cmsConfig.summary,
          enabledCollections: cmsConfig.enabledCollections,
        },
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
      hasClientId: !!body.clientId,
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
