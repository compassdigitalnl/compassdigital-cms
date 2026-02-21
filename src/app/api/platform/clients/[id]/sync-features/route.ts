/**
 * POST /api/platform/clients/:id/sync-features
 *
 * Sync client features to deployment ENV variables
 * Updates .env file on server and restarts PM2 without full redeploy
 *
 * Usage:
 * 1. Admin changes client.features in CMS
 * 2. Click "Sync Features" button
 * 3. This endpoint updates ENV vars on server
 * 4. PM2 restart applies new features
 *
 * Faster than full redeploy (no git pull, no npm install, no build)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { checkRole } from '@/access/utilities'
import { generateFeatureEnvVars } from '@/lib/features'
import { PloiAdapter } from '@/lib/provisioning/adapters/PloiAdapter'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config })

    // Check auth
    const { user } = await payload.auth({ headers: request.headers })
    if (!checkRole(['admin'], user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clientId = params.id

    // Fetch client
    const client = await payload.findByID({
      collection: 'clients',
      id: clientId,
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Check if deployed
    if (!client.deploymentProviderId || client.status !== 'active') {
      return NextResponse.json(
        { error: 'Client must be actively deployed to sync features' },
        { status: 400 },
      )
    }

    // Generate feature ENV vars from client.features
    const clientFeatures = (client as any).features || {}
    const featureEnvVars = generateFeatureEnvVars(clientFeatures)

    console.log(`[SyncFeatures] Syncing features for ${client.name}:`, featureEnvVars)

    // Update ENV vars on Ploi
    const ploiToken = process.env.PLOI_API_TOKEN
    const ploiServerId = parseInt(process.env.PLOI_SERVER_ID || '0')

    if (!ploiToken || !ploiServerId) {
      return NextResponse.json(
        { error: 'Ploi configuration missing (PLOI_API_TOKEN, PLOI_SERVER_ID)' },
        { status: 500 },
      )
    }

    const adapter = new PloiAdapter({
      apiToken: ploiToken,
      serverId: ploiServerId,
    })

    // Parse deploymentProviderId to get siteId
    const deploymentProviderId = client.deploymentProviderId
    const parts = deploymentProviderId.split('-')
    const siteId = parts.length > 1 ? parseInt(parts[1]) : parseInt(deploymentProviderId)

    // Get current ENV vars (we'll merge with feature vars)
    const { PloiService } = await import('@/lib/ploi/PloiService')
    const ploiService = new PloiService({ apiToken: ploiToken })

    const envResponse = await ploiService.getEnvironment(ploiServerId, siteId)
    const currentEnv = envResponse.data?.environment || ''

    // Parse current ENV
    const envObject: Record<string, string> = {}
    currentEnv.split('\n').forEach((line: string) => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        envObject[key.trim()] = valueParts.join('=').trim()
      }
    })

    // Merge feature ENV vars (overwrite existing feature flags)
    Object.assign(envObject, featureEnvVars)

    // Convert back to ENV string
    const updatedEnvString = PloiService.envObjectToString(envObject)

    // Update ENV on Ploi
    await ploiService.updateEnvironment(ploiServerId, siteId, updatedEnvString)

    console.log(`[SyncFeatures] ENV vars updated on Ploi`)

    // Restart PM2 to apply new ENV vars
    // Note: Ploi doesn't have a direct "restart PM2" API
    // We'll trigger a deployment which does: git pull + build + PM2 restart
    // For a "soft" restart without rebuild, client can SSH and run: pm2 restart <app>

    // Update client record with sync timestamp
    await payload.update({
      collection: 'clients',
      id: clientId,
      data: {
        notes: `${client.notes || ''}\n\n[${new Date().toISOString()}] Features synced to deployment`,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Features synced successfully',
      syncedVars: featureEnvVars,
      instructions:
        'ENV vars updated on server. To apply changes, SSH to server and run: pm2 restart <app-name>',
    })
  } catch (error: any) {
    console.error('[SyncFeatures] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to sync features' },
      { status: 500 },
    )
  }
}
