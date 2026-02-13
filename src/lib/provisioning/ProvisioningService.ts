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
      // Step 1: Create project
      await reportProgress('creating_project', 'Creating deployment project...', 10)

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

      // Step 2: Prepare environment variables
      await reportProgress('configuring_env', 'Configuring environment variables...', 30)

      const environmentVariables = this.buildEnvironmentVariables(input)

      await this.adapter.updateEnvironmentVariables({
        projectId,
        variables: environmentVariables,
      })

      logs.push(`Environment variables configured: ${Object.keys(environmentVariables).length} vars`)

      await reportProgress('configuring_env', 'Environment variables configured', 40)

      // Step 3: Deploy site
      await reportProgress('deploying', 'Starting deployment...', 50)

      const deployment = await this.adapter.deploy({
        projectId,
        environmentVariables,
      })

      deploymentId = deployment.deploymentId
      logs.push(`Deployment started: ${deploymentId}`)

      await reportProgress(
        'deploying',
        'Deployment in progress...',
        60,
        { deploymentId, deploymentUrl: deployment.deploymentUrl },
      )

      // Step 4: Monitor deployment
      await reportProgress('deploying', 'Monitoring deployment status...', 70)

      const deploymentResult = await this.monitorDeployment(
        deploymentId,
        (percentage) => {
          reportProgress('deploying', `Building site... ${percentage}%`, 70 + percentage * 0.2)
        },
      )

      if (deploymentResult.status === 'error') {
        throw new Error(`Deployment failed: ${deploymentResult.error}`)
      }

      logs.push(`Deployment completed: ${deploymentResult.url}`)

      await reportProgress('deploying', 'Deployment completed successfully', 90, {
        deploymentUrl: deploymentResult.url,
      })

      // Step 5: Update client record in database
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
        },
      })

      logs.push('Client record updated')

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
      if (this.options.rollbackOnError && projectId) {
        await this.rollback(projectId, input, logs)
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
  private buildEnvironmentVariables(input: ProvisioningInput): Record<string, string> {
    const baseUrl = `https://${input.domain}.${process.env.PLATFORM_BASE_URL || 'compassdigital.nl'}`

    return {
      // Payload configuration
      PAYLOAD_SECRET: this.generateSecret(),
      DATABASE_URL: process.env.DATABASE_URL || '',
      NEXT_PUBLIC_SERVER_URL: baseUrl,

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
   * Rollback failed provisioning
   */
  private async rollback(
    projectId: string,
    input: ProvisioningInput,
    logs: string[],
  ): Promise<void> {
    logs.push('ROLLBACK: Starting rollback...')

    try {
      if (this.options.rollbackConfig?.deleteProject) {
        await this.adapter.deleteProject(projectId)
        logs.push('ROLLBACK: Deleted deployment project')
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
