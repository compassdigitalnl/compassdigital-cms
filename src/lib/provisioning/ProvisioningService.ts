/**
 * Provisioning Service
 *
 * Orchestrates the complete client provisioning workflow:
 * 1. Create Vercel/Ploi project
 * 2. Deploy site code
 * 3. Configure environment variables
 * 4. Setup custom domains
 * 5. Monitor deployment
 * 6. Update client record
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
    const startTime = Date.now()
    const logs: string[] = []
    let projectId: string | undefined
    let deploymentId: string | undefined
    let databaseId: string | undefined
    let databaseUrl: string | undefined

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

      // Call user-provided callback
      if (input.onProgress) {
        await input.onProgress(progress)
      }

      // Call service-level callback
      if (this.options.onProgress) {
        await this.options.onProgress(progress)
      }
    }

    try {
      // Step 1: Provision Database (Railway)
      await reportProgress('creating_database', 'Provisioning PostgreSQL database...', 5)

      const { createRailwayDatabase } = await import('@/platform/integrations/railway')

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
        10,
        { databaseId, databaseUrl: 'postgresql://***:***@***' }, // Masked for security
      )

      // Step 2: Create project on Ploi
      await reportProgress('creating_project', 'Creating deployment project on Ploi...', 15)

      const project = await this.adapter.createProject({
        name: input.domain,
        domain: input.domain,
        region: input.region,
      })

      projectId = project.projectId
      logs.push(`Project created: ${projectId}`)

      await reportProgress(
        'creating_project',
        `Project created: ${project.projectUrl}`,
        20,
        { projectId, projectUrl: project.projectUrl },
      )

      // Step 3: Configure DNS (Cloudflare) - Do this EARLY so DNS propagates during deployment!
      await reportProgress('configuring_dns', 'Configuring DNS records...', 22)

      try {
        const dnsResult = await this.configureDNS(projectId, input.domain)
        logs.push(`DNS configured: ${dnsResult.record.name} → ${dnsResult.record.content}`)

        await reportProgress('configuring_dns', 'DNS records configured successfully', 25, {
          dnsRecord: `${dnsResult.record.name} → ${dnsResult.record.content}`,
        })
      } catch (dnsError: any) {
        // Log DNS error but don't fail the deployment
        // The site is still accessible via IP or Ploi test domain
        logs.push(`⚠️  DNS configuration failed: ${dnsError.message}`)
        console.error('DNS configuration error:', dnsError)

        await reportProgress('configuring_dns', '⚠️ DNS configuration skipped (not critical)', 25, {
          warning: 'DNS not configured - manual setup required',
        })
      }

      // Step 4: Prepare environment variables (with database URL)
      await reportProgress('configuring_env', 'Configuring environment variables...', 30)

      const environmentVariables = this.buildEnvironmentVariables(input, databaseUrl!)

      await this.adapter.updateEnvironmentVariables({
        projectId,
        variables: environmentVariables,
      })

      logs.push(`Environment variables configured: ${Object.keys(environmentVariables).length} vars`)

      await reportProgress('configuring_env', 'Environment variables configured', 35)

      // Step 5: Deploy site
      await reportProgress('deploying', 'Starting deployment...', 40)

      const deployment = await this.adapter.deploy({
        projectId,
        environmentVariables,
      })

      deploymentId = deployment.deploymentId
      logs.push(`Deployment started: ${deploymentId}`)

      await reportProgress(
        'deploying',
        'Deployment in progress...',
        50,
        { deploymentId, deploymentUrl: deployment.deploymentUrl },
      )

      // Step 6: Monitor deployment
      await reportProgress('deploying', 'Monitoring deployment status...', 60)

      const deploymentResult = await this.monitorDeployment(
        deploymentId,
        (percentage) => {
          reportProgress('deploying', `Building site... ${percentage}%`, 60 + percentage * 0.3)
        },
      )

      if (deploymentResult.status === 'error') {
        throw new Error(`Deployment failed: ${deploymentResult.error}`)
      }

      logs.push(`Deployment completed: ${deploymentResult.url}`)

      await reportProgress('deploying', 'Deployment completed successfully', 90, {
        deploymentUrl: deploymentResult.url,
      })

      // Step 7: Update client record in database
      await reportProgress('completed', 'Updating client record...', 95)

      const payload = await getPayload({ config })

      await payload.update({
        collection: 'clients',
        id: input.clientId,
        data: {
          deploymentUrl: deploymentResult.url,
          adminUrl: `${deploymentResult.url}/admin`,
          status: 'active',
          deploymentProvider: this.adapter.provider,
          deploymentProviderId: projectId,
          lastDeploymentId: deploymentId,
          lastDeployedAt: new Date().toISOString(),
          databaseUrl: databaseUrl, // ✅ Store encrypted database URL
          databaseProviderId: databaseId, // ✅ Railway service ID
        },
      })

      logs.push('Client record updated with database info')

      // Step 6: Complete!
      await reportProgress('completed', 'Provisioning completed successfully!', 100, {
        deploymentUrl: deploymentResult.url,
        adminUrl: `${deploymentResult.url}/admin`,
      })

      return {
        success: true,
        clientId: input.clientId,
        deploymentUrl: deploymentResult.url,
        adminUrl: `${deploymentResult.url}/admin`,
        providerId: projectId,
        deploymentId: deploymentId,
        status: 'completed',
        completedAt: new Date(),
        logs,
      }
    } catch (error: any) {
      logs.push(`ERROR: ${error.message}`)

      await reportProgress('failed', `Provisioning failed: ${error.message}`, 0, {
        error: error.message,
      })

      // Rollback if configured
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
   * Build environment variables for deployment
   */
  private buildEnvironmentVariables(input: ProvisioningInput, databaseUrl: string): Record<string, string> {
    const baseUrl = `https://${input.domain}.${process.env.PLATFORM_BASE_URL || 'compassdigital.nl'}`

    return {
      // Payload configuration
      PAYLOAD_SECRET: this.generateSecret(),
      DATABASE_URL: databaseUrl, // ✅ Client-specific database!
      NEXT_PUBLIC_SERVER_URL: baseUrl,
      NODE_ENV: 'production',

      // Platform configuration
      PLATFORM_BASE_URL: process.env.PLATFORM_BASE_URL || 'compassdigital.nl',
      CLIENT_ID: input.clientId,
      CLIENT_NAME: input.clientName,

      // Site configuration
      SITE_NAME: input.siteData.siteName,
      PRIMARY_COLOR: input.siteData.primaryColor || '#3B82F6',

      // Optional: User-provided variables
      ...input.environmentVariables,
    }
  }

  /**
   * Generate secure random secret
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
   * Monitor deployment until completion
   */
  private async monitorDeployment(
    deploymentId: string,
    onProgress?: (percentage: number) => void,
  ): Promise<{ status: string; url?: string; error?: string }> {
    const startTime = Date.now()
    const timeout = this.options.deploymentTimeout || 600000
    let attempts = 0
    const maxAttempts = 120 // Check every 5 seconds for 10 minutes

    while (attempts < maxAttempts) {
      // Check timeout
      if (Date.now() - startTime > timeout) {
        throw new Error('Deployment timeout exceeded')
      }

      try {
        const status = await this.adapter.getDeploymentStatus(deploymentId)

        // Calculate progress percentage
        const percentage = Math.min(95, Math.floor((attempts / maxAttempts) * 100))
        if (onProgress) {
          onProgress(percentage)
        }

        // Check status
        if (status.status === 'ready') {
          return { status: 'ready', url: status.url }
        }

        if (status.status === 'error' || status.status === 'canceled') {
          return { status: 'error', error: status.error || 'Deployment failed' }
        }

        // Still building, wait and retry
        await this.sleep(5000)
        attempts++
      } catch (error: any) {
        // Retry on error
        if (attempts >= this.options.maxRetries!) {
          throw error
        }
        await this.sleep(this.options.retryDelay!)
        attempts++
      }
    }

    throw new Error('Deployment monitoring exceeded maximum attempts')
  }

  /**
   * Configure DNS via Cloudflare
   */
  private async configureDNS(
    projectId: string,
    subdomain: string,
  ): Promise<{ success: boolean; record: { name: string; content: string } }> {
    // Check if adapter supports domain configuration
    if (!this.adapter.configureDomain) {
      throw new Error('Deployment adapter does not support domain configuration')
    }

    // Get domain configuration from adapter
    const domainConfig = await this.adapter.configureDomain({
      projectId,
      domain: `${subdomain}.${process.env.PLATFORM_BASE_URL || 'compassdigital.nl'}`,
    })

    if (!domainConfig.serverIp) {
      throw new Error('Server IP not available from deployment adapter')
    }

    // Store server IP for later use
    const serverIp = domainConfig.serverIp

    // Initialize Cloudflare service
    const { createCloudflareService } = await import('@/lib/cloudflare/CloudflareService')
    const cloudflare = createCloudflareService()

    // Construct full domain name
    const fullDomain = `${subdomain}.${process.env.PLATFORM_BASE_URL || 'compassdigital.nl'}`

    // Create or update A record pointing to server IP
    const record = await cloudflare.createOrUpdateARecord(
      fullDomain,
      serverIp,
      false, // Don't proxy through Cloudflare (for now)
    )

    // Verify DNS propagation (optional, non-blocking)
    setTimeout(async () => {
      try {
        const verified = await cloudflare.verifyDNSRecord(fullDomain, serverIp, 5)
        if (verified) {
          console.log(`✅ DNS verified for ${fullDomain}`)
        } else {
          console.warn(`⚠️  DNS not yet propagated for ${fullDomain} (this is normal, may take a few minutes)`)
        }
      } catch (error) {
        console.error('DNS verification error:', error)
      }
    }, 5000)

    return {
      success: true,
      record: {
        name: record.name,
        content: record.content,
      },
    }
  }

  /**
   * Rollback failed provisioning
   */
  private async rollback(
    projectId: string | undefined,
    databaseId: string | undefined,
    input: ProvisioningInput,
    logs: string[],
  ): Promise<void> {
    logs.push('ROLLBACK: Starting rollback...')

    try {
      // Delete Ploi project
      if (this.options.rollbackConfig?.deleteProject && projectId) {
        await this.adapter.deleteProject(projectId)
        logs.push('ROLLBACK: Deleted Ploi site')
      }

      // Delete Railway database
      if (this.options.rollbackConfig?.deleteDatabase && databaseId) {
        const { deleteRailwayDatabase } = await import('@/platform/integrations/railway')
        await deleteRailwayDatabase(databaseId)
        logs.push('ROLLBACK: Deleted Railway database')
      }

      // Delete client record
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
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

/**
 * Factory function to create ProvisioningService with specified adapter
 *
 * @param provider - Deployment provider ('vercel' or 'ploi')
 * @param options - Provisioning options
 */
export async function createProvisioningService(
  provider: 'vercel' | 'ploi' = 'vercel',
  options?: ProvisioningOptions,
): Promise<ProvisioningService> {
  // Lazy import adapter to avoid build-time initialization
  let adapter

  if (provider === 'ploi') {
    const { createPloiAdapter } = await import('./adapters/PloiAdapter')
    adapter = createPloiAdapter()
  } else {
    const { createVercelAdapter } = await import('./adapters/VercelAdapter')
    adapter = createVercelAdapter()
  }

  return new ProvisioningService(adapter, options)
}
