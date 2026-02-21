/**
 * Provisioning Service
 *
 * Orchestrates the complete client provisioning workflow:
 * 1. Allocate unique server port
 * 2. Provision Railway PostgreSQL database
 * 3. Create Ploi site (with git repo + deploy script)
 * 4. Configure DNS (Cloudflare A-record) — early, so propagation starts
 * 5. Set environment variables (with DATABASE_URL + PORT)
 * 6. Trigger first deployment
 * 7. Monitor deployment
 * 8. Wait for DNS propagation, then request SSL certificate
 * 9. Update client record
 *
 * Supports multiple deployment providers via adapter pattern
 */

import type {
  DeploymentAdapter,
  ProvisioningInput,
  ProvisioningResult,
  ProvisioningStatus,
  ProvisioningProgress,
  ProvisioningOptions,
  ProgressCallback,
} from './types'

import { getPayload } from 'payload'
import config from '@payload-config'

export class ProvisioningService {
  private adapter: DeploymentAdapter
  private options: ProvisioningOptions

  constructor(adapter: DeploymentAdapter, options: ProvisioningOptions = {}) {
    this.adapter = adapter
    this.options = {
      maxRetries: options.maxRetries || 3,
      retryDelay: options.retryDelay || 5000,
      deploymentTimeout: options.deploymentTimeout || 600000, // 10 minutes
      rollbackOnError: options.rollbackOnError ?? true,
      rollbackConfig: options.rollbackConfig || {
        deleteProject: true,
        deleteDatabase: false,
        deleteClient: false,
        notifyUser: true,
      },
      onProgress: options.onProgress,
    }
  }

  /**
   * Main provisioning workflow
   */
  async provision(input: ProvisioningInput): Promise<ProvisioningResult> {
    const logs: string[] = []
    let projectId: string | undefined
    let deploymentId: string | undefined
    let databaseId: string | undefined
    let databaseUrl: string | undefined
    let assignedPort: number | undefined

    // Progress callback helper
    const reportProgress = async (
      status: ProvisioningStatus,
      message: string,
      percentage: number,
      metadata?: any,
    ) => {
      const progress: ProvisioningProgress = {
        status,
        message,
        percentage,
        timestamp: new Date(),
        metadata,
      }

      logs.push(`[${status}] ${message}`)

      if (input.onProgress) {
        await input.onProgress(progress)
      }

      if (this.options.onProgress) {
        await this.options.onProgress(progress)
      }
    }

    try {
      // ── Step 1: Allocate unique port ──────────────────────────────────────
      await reportProgress('creating_project', 'Allocating unique server port...', 3)

      const { getNextAvailablePort } = await import('./portAllocator')
      assignedPort = await getNextAvailablePort()
      logs.push(`Port allocated: ${assignedPort}`)
      console.log(`[ProvisioningService] Assigned port: ${assignedPort}`)

      await reportProgress('creating_project', `Port ${assignedPort} allocated`, 5, { port: assignedPort })

      // ── Step 2: Provision Railway PostgreSQL database ─────────────────────
      await reportProgress('creating_database', 'Provisioning PostgreSQL database on Railway...', 7)

      const { createRailwayDatabase } = await import('@/branches/platform/integrations/railway')

      const dbResult = await createRailwayDatabase({
        name: input.clientName,
        domain: input.domain,
      })

      databaseId = dbResult.id
      databaseUrl = dbResult.url
      logs.push(`Database provisioned: ${databaseId}`)

      await reportProgress(
        'creating_database',
        'Database provisioned successfully',
        12,
        { databaseId, databaseUrl: 'postgresql://***:***@***' },
      )

      // ── Step 3: Build environment variables (needed before site creation) ─
      const environmentVariables = this.buildEnvironmentVariables(input, databaseUrl!, assignedPort)

      // ── Step 4: Create Ploi site (with repo + deploy script + env vars) ───
      await reportProgress('creating_project', 'Creating site on Ploi...', 15)

      const project = await this.adapter.createProject({
        name: input.domain,
        domain: `${input.domain}.${process.env.PLATFORM_BASE_URL || 'compassdigital.nl'}`,
        region: input.region,
        port: assignedPort,
        environmentVariables,
        // gitRepo / gitBranch come from env vars in PloiAdapter
      } as any)

      projectId = project.projectId
      logs.push(`Project created: ${projectId}`)

      await reportProgress(
        'creating_project',
        `Site created: ${project.projectUrl}`,
        22,
        { projectId, projectUrl: project.projectUrl },
      )

      // ── Step 5: Configure Cloudflare DNS — early, so it propagates ────────
      await reportProgress('configuring_dns', 'Configuring Cloudflare DNS A-record...', 25)

      let serverIp: string | undefined

      try {
        const dnsResult = await this.configureDNS(projectId, input.domain)
        serverIp = dnsResult.serverIp
        logs.push(`DNS configured: ${dnsResult.record.name} → ${dnsResult.record.content}`)

        await reportProgress('configuring_dns', `DNS A-record created: ${dnsResult.record.name}`, 30, {
          dnsRecord: `${dnsResult.record.name} → ${dnsResult.record.content}`,
        })
      } catch (dnsError: any) {
        logs.push(`⚠️ DNS configuration failed: ${dnsError.message}`)
        console.error('[ProvisioningService] DNS error:', dnsError)

        await reportProgress('configuring_dns', '⚠️ DNS configuration skipped (manual setup required)', 30, {
          warning: dnsError.message,
        })
      }

      // ── Step 6: Trigger deployment ────────────────────────────────────────
      await reportProgress('deploying', 'Triggering first deployment...', 35)

      const deployment = await this.adapter.deploy({ projectId })

      deploymentId = deployment.deploymentId
      logs.push(`Deployment started: ${deploymentId}`)

      await reportProgress(
        'deploying',
        'Deployment in progress (this can take 5-15 minutes)...',
        40,
        { deploymentId, deploymentUrl: deployment.deploymentUrl },
      )

      // ── Step 7: Monitor deployment ────────────────────────────────────────
      await reportProgress('deploying', 'Monitoring build & deployment status...', 50)

      const deploymentResult = await this.monitorDeployment(
        deploymentId,
        (percentage) => {
          reportProgress('deploying', `Building... ${percentage}%`, 50 + percentage * 0.3)
        },
      )

      if (deploymentResult.status === 'error') {
        throw new Error(`Deployment failed: ${deploymentResult.error}`)
      }

      logs.push(`Deployment completed: ${deploymentResult.url}`)

      await reportProgress('deploying', 'Deployment completed successfully', 80, {
        deploymentUrl: deploymentResult.url,
      })

      // ── Step 7b: Create first admin user in client CMS ────────────────────
      // After deployment the Payload app boots — we create the first user via REST API
      // (Payload allows unauthenticated first-user creation when no users exist yet)
      await reportProgress('deploying', 'Creating admin user for client CMS...', 81)

      let adminEmail: string | undefined
      let initialAdminPassword: string | undefined

      try {
        // Determine clientType from environment variables built earlier
        const isWebshop = environmentVariables.ECOMMERCE_ENABLED === 'true'

        const adminResult = await this.createClientAdminUser(
          deploymentResult.url || `https://${fullDomain}`,
          input.contactEmail || `admin@${input.domain}.${process.env.PLATFORM_BASE_URL || 'compassdigital.nl'}`,
          input.clientName,
          isWebshop ? 'webshop' : 'website',
        )
        adminEmail = adminResult.email
        initialAdminPassword = adminResult.password
        logs.push(`Admin user created: ${adminEmail}`)

        await reportProgress('deploying', `Admin user created: ${adminEmail}`, 82, {
          adminEmail,
        })
      } catch (adminError: any) {
        logs.push(`⚠️ Admin user creation failed: ${adminError.message}`)
        console.warn('[ProvisioningService] Admin user creation warning:', adminError.message)
        // Non-fatal: admin can still log in via Payload's create-first-user flow
      }

      // ── Step 8: Wait for DNS propagation, then request SSL ────────────────
      // DNS propagation takes 1-5 minutes after record creation.
      // We do this AFTER deployment finishes so time has passed already.
      await reportProgress('configuring_domains', 'Waiting for DNS propagation before requesting SSL...', 82)

      const fullDomain = `${input.domain}.${process.env.PLATFORM_BASE_URL || 'compassdigital.nl'}`
      await this.waitForDNSAndRequestSSL(projectId, fullDomain, serverIp, logs, reportProgress)

      // ── Step 9: Save port + URLs to client record ─────────────────────────
      await reportProgress('completed', 'Updating client record in database...', 95)

      const payload = await getPayload({ config })

      await payload.update({
        collection: 'clients',
        id: input.clientId,
        data: {
          deploymentUrl: deploymentResult.url || `https://${fullDomain}`,
          adminUrl: `${deploymentResult.url || `https://${fullDomain}`}/admin`,
          status: 'active',
          deploymentProvider: this.adapter.provider,
          deploymentProviderId: projectId,
          lastDeploymentId: deploymentId,
          lastDeployedAt: new Date().toISOString(),
          databaseUrl: databaseUrl,
          databaseProviderId: databaseId,
          port: assignedPort,
          // Admin credentials (created automatically during provisioning)
          ...(adminEmail ? { adminEmail } : {}),
          ...(initialAdminPassword ? { initialAdminPassword } : {}),
        },
      })

      logs.push('Client record updated')

      await reportProgress('completed', 'Provisioning completed successfully!', 100, {
        deploymentUrl: deploymentResult.url,
        adminUrl: `${deploymentResult.url}/admin`,
        port: assignedPort,
      })

      return {
        success: true,
        clientId: input.clientId,
        deploymentUrl: deploymentResult.url || `https://${fullDomain}`,
        adminUrl: `${deploymentResult.url || `https://${fullDomain}`}/admin`,
        providerId: projectId,
        deploymentId,
        status: 'completed',
        completedAt: new Date(),
        logs,
      }
    } catch (error: any) {
      logs.push(`ERROR: ${error.message}`)

      await reportProgress('failed', `Provisioning failed: ${error.message}`, 0, {
        error: error.message,
      })

      // Update client record to 'failed' status
      try {
        const payload = await getPayload({ config })
        await payload.update({
          collection: 'clients',
          id: input.clientId,
          data: { status: 'failed' },
        })
      } catch (_) { /* ignore */ }

      if (this.options.rollbackOnError) {
        await this.rollback(projectId, databaseId, input, logs)
      }

      return {
        success: false,
        clientId: input.clientId,
        status: 'failed',
        error: error.message,
        logs,
      }
    }
  }

  /**
   * Build environment variables for the client site deployment
   */
  private buildEnvironmentVariables(
    input: ProvisioningInput,
    databaseUrl: string,
    port: number,
  ): Record<string, string> {
    const baseDomain = process.env.PLATFORM_BASE_URL || 'compassdigital.nl'
    const baseUrl = `https://${input.domain}.${baseDomain}`

    // Collect platform-level shared env vars (keys needed at build time and runtime)
    const platformEnv: Record<string, string> = {}

    // Stripe — needed at module load time in /api/stripe/webhooks/route.ts
    if (process.env.STRIPE_SECRET_KEY) platformEnv.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) platformEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (process.env.STRIPE_WEBHOOKS_SIGNING_SECRET) platformEnv.STRIPE_WEBHOOKS_SIGNING_SECRET = process.env.STRIPE_WEBHOOKS_SIGNING_SECRET

    // AI APIs — needed if AI routes do SSG or early initialization
    if (process.env.OPENAI_API_KEY) platformEnv.OPENAI_API_KEY = process.env.OPENAI_API_KEY

    // Email
    if (process.env.RESEND_API_KEY) platformEnv.RESEND_API_KEY = process.env.RESEND_API_KEY

    return {
      // Core Payload / Next.js
      PAYLOAD_SECRET: this.generateSecret(),
      DATABASE_URL: databaseUrl,
      NEXT_PUBLIC_SERVER_URL: baseUrl,
      NODE_ENV: 'production',
      PORT: String(port),
      NEXT_TELEMETRY_DISABLED: '1',

      // Platform metadata
      PLATFORM_BASE_URL: baseDomain,
      CLIENT_ID: input.clientId,
      // NEXT_PUBLIC_CLIENT_ID is inlined at build time → works in Edge + Node.js middleware
      NEXT_PUBLIC_CLIENT_ID: input.clientId,
      CLIENT_NAME: input.clientName,

      // Site configuration
      SITE_NAME: input.siteData.siteName,
      PRIMARY_COLOR: input.siteData.primaryColor || '#3B82F6',

      // Platform-level shared keys (Stripe, OpenAI, etc.)
      ...platformEnv,

      // Optional: user-provided overrides (applied last, highest priority)
      ...input.environmentVariables,
    }
  }

  /**
   * Generate a secure random 32-char secret
   */
  private generateSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let secret = ''
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return secret
  }

  /**
   * Configure DNS via Cloudflare
   * Returns the server IP and the created record details
   */
  private async configureDNS(
    projectId: string,
    subdomain: string,
  ): Promise<{ success: boolean; serverIp: string; record: { name: string; content: string } }> {
    if (!this.adapter.configureDomain) {
      throw new Error('Deployment adapter does not support domain configuration')
    }

    const baseDomain = process.env.PLATFORM_BASE_URL || 'compassdigital.nl'
    const fullDomain = `${subdomain}.${baseDomain}`

    // Get server IP from Ploi adapter
    const domainConfig = await this.adapter.configureDomain({
      projectId,
      domain: fullDomain,
    })

    if (!domainConfig.serverIp) {
      throw new Error('Server IP not available from deployment adapter')
    }

    const serverIp = domainConfig.serverIp

    // Create/update Cloudflare A record
    const { createCloudflareService } = await import('@/lib/cloudflare/CloudflareService')
    const cloudflare = createCloudflareService()

    const record = await cloudflare.createOrUpdateARecord(
      fullDomain,
      serverIp,
      false, // Don't proxy through Cloudflare (required for Let's Encrypt)
    )

    return {
      success: true,
      serverIp,
      record: {
        name: record.name,
        content: record.content,
      },
    }
  }

  /**
   * Wait for DNS to propagate, then request SSL certificate.
   * Uses active DNS polling — max 10 minutes wait.
   */
  private async waitForDNSAndRequestSSL(
    projectId: string,
    fullDomain: string,
    serverIp: string | undefined,
    logs: string[],
    reportProgress: (status: ProvisioningStatus, message: string, pct: number, meta?: any) => Promise<void>,
  ): Promise<void> {
    if (!serverIp) {
      logs.push('⚠️ Skipping SSL: server IP unknown (DNS was not configured)')
      return
    }

    const { createCloudflareService } = await import('@/lib/cloudflare/CloudflareService')
    const cloudflare = createCloudflareService()

    const MAX_WAIT_MS = 10 * 60 * 1000 // 10 minutes
    const POLL_INTERVAL_MS = 30 * 1000  // check every 30 seconds
    const startTime = Date.now()
    let dnsVerified = false

    console.log(`[ProvisioningService] Waiting for DNS propagation: ${fullDomain} → ${serverIp}`)

    while (Date.now() - startTime < MAX_WAIT_MS) {
      const elapsed = Math.round((Date.now() - startTime) / 1000)

      await reportProgress(
        'configuring_domains',
        `Waiting for DNS propagation... (${elapsed}s elapsed)`,
        84,
      )

      try {
        dnsVerified = await cloudflare.verifyDNSRecord(fullDomain, serverIp, 1)
      } catch (_) {
        dnsVerified = false
      }

      if (dnsVerified) {
        logs.push(`DNS propagated for ${fullDomain} after ~${elapsed}s`)
        console.log(`[ProvisioningService] DNS verified for ${fullDomain} after ${elapsed}s`)
        break
      }

      await this.sleep(POLL_INTERVAL_MS)
    }

    if (!dnsVerified) {
      logs.push(`⚠️ DNS not verified after 10 minutes for ${fullDomain} — skipping SSL`)
      await reportProgress('configuring_domains', '⚠️ DNS propagation timed out — SSL skipped', 88, {
        warning: 'SSL certificate not provisioned. Request it manually once DNS is working.',
      })
      return
    }

    // Request Let's Encrypt SSL via Ploi
    await reportProgress('configuring_domains', 'Requesting Let\'s Encrypt SSL certificate...', 88)

    try {
      const { serverId, siteId } = this.parsePloiProjectId(projectId)

      // We need to call Ploi's certificate endpoint directly
      const PloiServiceModule = await import('@/lib/ploi/PloiService')
      const PloiServiceClass = PloiServiceModule.PloiService

      const ploiService = new PloiServiceClass({
        apiToken: process.env.PLOI_API_TOKEN!,
      })

      // Ploi requires { type: 'letsencrypt', certificate: 'domain.com' }
      await ploiService.createCertificate(serverId, siteId, { certificate: fullDomain })
      logs.push(`SSL certificate requested for ${fullDomain}`)

      await reportProgress('configuring_domains', 'SSL certificate requested (Let\'s Encrypt)', 92, {
        domain: fullDomain,
        ssl: true,
      })
    } catch (sslError: any) {
      logs.push(`⚠️ SSL request failed: ${sslError.message}`)
      console.error('[ProvisioningService] SSL error:', sslError)

      await reportProgress('configuring_domains', `⚠️ SSL failed: ${sslError.message}`, 90, {
        warning: sslError.message,
      })
    }
  }

  /**
   * Parse Ploi composite project ID (serverId-siteId)
   */
  private parsePloiProjectId(projectId: string): { serverId: number; siteId: number } {
    const parts = projectId.split('-')
    return {
      serverId: parseInt(parts[0]),
      siteId: parseInt(parts[1]),
    }
  }

  /**
   * Monitor deployment until completion or timeout
   */
  private async monitorDeployment(
    deploymentId: string,
    onProgress?: (percentage: number) => void,
  ): Promise<{ status: string; url?: string; error?: string }> {
    const startTime = Date.now()
    const timeout = this.options.deploymentTimeout || 600000
    let attempts = 0
    const maxAttempts = 120 // check every 5s for 10 min

    while (attempts < maxAttempts) {
      if (Date.now() - startTime > timeout) {
        throw new Error('Deployment timeout exceeded')
      }

      try {
        const status = await this.adapter.getDeploymentStatus(deploymentId)

        const percentage = Math.min(95, Math.floor((attempts / maxAttempts) * 100))
        if (onProgress) {
          onProgress(percentage)
        }

        if (status.status === 'ready') {
          return { status: 'ready', url: status.url }
        }

        if (status.status === 'error' || status.status === 'canceled') {
          return { status: 'error', error: status.error || 'Deployment failed' }
        }

        await this.sleep(5000)
        attempts++
      } catch (error: any) {
        if (attempts >= (this.options.maxRetries || 3)) {
          throw error
        }
        await this.sleep(this.options.retryDelay || 5000)
        attempts++
      }
    }

    throw new Error('Deployment monitoring exceeded maximum attempts')
  }

  /**
   * Rollback a failed provisioning
   */
  private async rollback(
    projectId: string | undefined,
    databaseId: string | undefined,
    input: ProvisioningInput,
    logs: string[],
  ): Promise<void> {
    logs.push('ROLLBACK: Starting rollback...')

    try {
      if (this.options.rollbackConfig?.deleteProject && projectId) {
        await this.adapter.deleteProject(projectId)
        logs.push('ROLLBACK: Deleted Ploi site')
      }

      if (this.options.rollbackConfig?.deleteDatabase && databaseId) {
        const { deleteRailwayDatabase } = await import('@/branches/platform/integrations/railway')
        await deleteRailwayDatabase(databaseId)
        logs.push('ROLLBACK: Deleted Railway database')
      }

      if (this.options.rollbackConfig?.deleteClient) {
        const payload = await getPayload({ config })
        await payload.delete({
          collection: 'clients',
          id: input.clientId,
        })
        logs.push('ROLLBACK: Deleted client record')
      }

      logs.push('ROLLBACK: Completed successfully')
    } catch (error: any) {
      logs.push(`ROLLBACK ERROR: ${error.message}`)
    }
  }

  /**
   * Create the first admin user in a freshly deployed client CMS.
   *
   * Payload CMS allows unauthenticated creation of the FIRST user via POST /api/users.
   * This endpoint is only open when no users exist yet — perfect for provisioning.
   *
   * We retry up to 8 times with 15-second delays because the PM2 process may
   * need a moment to fully boot after deployment completes.
   */
  private async createClientAdminUser(
    siteUrl: string,
    email: string,
    name: string,
    clientType?: 'website' | 'webshop',
  ): Promise<{ email: string; password: string }> {
    const password = this.generateAdminPassword()
    const MAX_ATTEMPTS = 8
    const RETRY_DELAY_MS = 15_000

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        console.log(`[ProvisioningService] Creating admin user (attempt ${attempt}/${MAX_ATTEMPTS})...`)

        const res = await fetch(`${siteUrl}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            name,
            ...(clientType ? { clientType } : {}),
          }),
        })

        if (res.ok) {
          console.log(`[ProvisioningService] Admin user created: ${email}`)
          return { email, password }
        }

        const body = await res.json().catch(() => ({}))

        // If users already exist, Payload returns 403 — no point retrying
        if (res.status === 403) {
          throw new Error(`Admin user already exists or endpoint requires auth (403)`)
        }

        console.warn(`[ProvisioningService] Attempt ${attempt} failed: HTTP ${res.status}`, body)
      } catch (err: any) {
        // Network errors (site not yet up) — retry
        if (attempt === MAX_ATTEMPTS) throw err
        console.warn(`[ProvisioningService] Attempt ${attempt} error: ${err.message} — retrying in ${RETRY_DELAY_MS / 1000}s`)
      }

      if (attempt < MAX_ATTEMPTS) {
        await this.sleep(RETRY_DELAY_MS)
      }
    }

    throw new Error(`Failed to create admin user after ${MAX_ATTEMPTS} attempts`)
  }

  /**
   * Generate a readable random password (16 chars, no ambiguous chars)
   */
  private generateAdminPassword(): string {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$'
    let password = ''
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

/**
 * Factory function to create ProvisioningService with specified adapter
 */
export async function createProvisioningService(
  provider: 'ploi' = 'ploi',
  options?: ProvisioningOptions,
): Promise<ProvisioningService> {
  const { createPloiAdapter } = await import('./adapters/PloiAdapter')
  const adapter = createPloiAdapter()

  return new ProvisioningService(adapter, options)
}
