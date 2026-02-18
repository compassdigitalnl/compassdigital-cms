/**
 * provisionClient
 *
 * Central orchestration function for provisioning a client site.
 * Reads the client document from Payload, builds the ProvisioningInput,
 * and runs the full ProvisioningService workflow.
 *
 * Called from:
 * - Clients afterChange hook (when status changes to 'provisioning')
 * - API route /api/platform/provision (manual trigger)
 * - Scripts (e.g. provision-plastimed.ts)
 *
 * Usage:
 *   import { provisionClient } from '@/lib/provisioning/provisionClient'
 *   await provisionClient({ clientId: 'abc123' })
 */

import type { ProvisioningResult } from './types'

export interface ProvisionClientOptions {
  /** Payload document ID of the client to provision */
  clientId: string

  /** Optional: override deployment provider (default: 'ploi') */
  provider?: 'ploi' | 'vercel'

  /** Optional: extra env vars to merge (on top of auto-generated ones) */
  extraEnv?: Record<string, string>

  /** Optional: log every progress step to console */
  verbose?: boolean
}

/**
 * Provision a client site end-to-end.
 *
 * This function:
 * 1. Fetches the client record from Payload
 * 2. Validates required fields
 * 3. Updates client status to 'provisioning'
 * 4. Runs ProvisioningService.provision()
 * 5. Returns the full result (status, URLs, logs)
 *
 * The ProvisioningService itself updates the client status to 'active' or 'failed'.
 */
export async function provisionClient(opts: ProvisionClientOptions): Promise<ProvisioningResult> {
  const { clientId, provider = 'ploi', extraEnv = {}, verbose = false } = opts

  const log = (...args: any[]) => {
    if (verbose) console.log('[provisionClient]', ...args)
  }

  // ── Load Payload ─────────────────────────────────────────────────────────
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config })

  // ── Fetch client document ─────────────────────────────────────────────────
  log(`Fetching client ${clientId}...`)
  const client = await payload.findByID({
    collection: 'clients',
    id: clientId,
    depth: 0,
  })

  if (!client) {
    throw new Error(`Client not found: ${clientId}`)
  }

  // ── Validate required fields ──────────────────────────────────────────────
  if (!client.name) throw new Error(`Client ${clientId} is missing 'name'`)
  if (!client.domain) throw new Error(`Client ${clientId} is missing 'domain'`)

  log(`Provisioning client: ${client.name} (${client.domain})`)

  // ── Mark as 'provisioning' ────────────────────────────────────────────────
  // Pass context: { skipProvisioningHook: true } so the afterChange hook
  // does NOT fire again and start a second parallel provisioning run.
  if (client.status !== 'provisioning') {
    await payload.update({
      collection: 'clients',
      id: clientId,
      data: { status: 'provisioning' },
      context: { skipProvisioningHook: true },
    } as any)
  }

  // ── Build ProvisioningInput ───────────────────────────────────────────────
  const customEnv: Record<string, string> = {}

  // Merge client's customEnvironment JSON field
  if (client.customEnvironment && typeof client.customEnvironment === 'object') {
    Object.entries(client.customEnvironment as Record<string, unknown>).forEach(([k, v]) => {
      if (typeof v === 'string') customEnv[k] = v
    })
  }

  // Merge caller-provided overrides
  Object.assign(customEnv, extraEnv)

  const provisioningInput = {
    clientId,
    clientName: client.name,
    domain: client.domain,
    contactEmail: (client as any).contactEmail || undefined,

    siteData: {
      siteName: client.name,
      industry: undefined, // Could be derived from template
      primaryColor: (client.customSettings as any)?.primaryColor || '#3B82F6',
    },

    provider,
    environmentVariables: customEnv,

    onProgress: verbose
      ? (progress: any) => {
          console.log(
            `[provisionClient] [${progress.percentage}%] [${progress.status}] ${progress.message}`,
          )
        }
      : undefined,
  }

  // ── Run ProvisioningService ───────────────────────────────────────────────
  const { createProvisioningService } = await import('./ProvisioningService')

  const service = await createProvisioningService(provider, {
    rollbackOnError: false, // Don't auto-delete on failure — let user inspect
    rollbackConfig: {
      deleteProject: false,
      deleteDatabase: false,
      deleteClient: false,
    },
    deploymentTimeout: 15 * 60 * 1000, // 15 minutes for full build
  })

  log('Starting provisioning workflow...')
  const result = await service.provision(provisioningInput)

  if (result.success) {
    log(`Provisioning completed! URL: ${result.deploymentUrl}`)
  } else {
    log(`Provisioning failed: ${result.error}`)
  }

  return result
}
