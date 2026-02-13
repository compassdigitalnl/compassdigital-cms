/**
 * Ploi Deployment Adapter
 *
 * Implements DeploymentAdapter interface for Ploi platform
 * Uses PloiService for API interactions
 *
 * Ploi workflow:
 * 1. Create site on server
 * 2. Setup environment variables
 * 3. Setup deployment script
 * 4. Trigger deployment
 * 5. Enable SSL (Let's Encrypt)
 * 6. Monitor deployment logs
 */

import type {
  DeploymentAdapter,
  DeploymentProvider,
} from '../types'

// Lazy load PloiService to avoid build-time initialization
let PloiService: any

async function getPloiService() {
  if (!PloiService) {
    const module = await import('@/lib/ploi/PloiService')
    PloiService = module.PloiService
  }
  return PloiService
}

export class PloiAdapter implements DeploymentAdapter {
  readonly provider: DeploymentProvider = 'ploi'
  private ploiService: any
  private serverId: number

  constructor(private config: {
    apiToken: string
    serverId: number // Default server ID for deployments
    baseUrl?: string
  }) {
    this.serverId = config.serverId
  }

  /**
   * Initialize PloiService (lazy loaded)
   */
  private async getService() {
    if (!this.ploiService) {
      const PloiServiceClass = await getPloiService()
      this.ploiService = new PloiServiceClass({
        apiToken: this.config.apiToken,
        baseUrl: this.config.baseUrl,
      })
    }
    return this.ploiService
  }

  /**
   * Create a new site on Ploi server
   */
  async createProject(input: {
    name: string
    domain: string
    environmentVariables?: Record<string, string>
    region?: string
  }) {
    const service = await this.getService()

    // Create site on Ploi
    const siteResponse = await service.createSite(this.serverId, {
      root_domain: input.domain,
      project_type: 'nodejs', // Default to Node.js for Payload CMS
      web_directory: '/public', // Standard Payload public directory
    })

    const site = siteResponse.data

    // Setup environment variables if provided
    if (input.environmentVariables) {
      const envContent = PloiService.envObjectToString(input.environmentVariables)
      await service.updateEnvironment(this.serverId, site.id, envContent)
    }

    // Setup deployment script for Payload CMS
    const deploymentScript = this.generateDeploymentScript(input.environmentVariables || {})
    await service.updateDeploymentScript(this.serverId, site.id, deploymentScript)

    return {
      projectId: `${this.serverId}-${site.id}`, // Composite ID
      projectUrl: `https://${site.domain}`,
    }
  }

  /**
   * Deploy site on Ploi
   */
  async deploy(input: {
    projectId: string
    gitUrl?: string
    buildCommand?: string
    environmentVariables?: Record<string, string>
  }) {
    const service = await this.getService()
    const { serverId, siteId } = this.parseProjectId(input.projectId)

    // Update environment variables if provided
    if (input.environmentVariables) {
      const envContent = PloiService.envObjectToString(input.environmentVariables)
      await service.updateEnvironment(serverId, siteId, envContent)
    }

    // Trigger deployment
    const deploymentResponse = await service.deploySite(serverId, siteId)

    // Get site info for URL
    const siteResponse = await service.getSite(serverId, siteId)
    const site = siteResponse.data

    return {
      deploymentId: `${deploymentResponse.data.id}`,
      deploymentUrl: `https://${site.domain}`,
      status: 'building' as const,
    }
  }

  /**
   * Check deployment status
   */
  async getDeploymentStatus(deploymentId: string) {
    const service = await this.getService()

    // Parse deployment ID to get server and site IDs
    // For Ploi, we use the site's latest deployment log
    // deploymentId format: "serverId-siteId-logId" or just use site ID
    const parts = deploymentId.split('-')
    const serverId = parseInt(parts[0])
    const siteId = parseInt(parts[1])

    try {
      // Get latest logs
      const logsResponse = await service.getLogs(serverId, siteId)
      const latestLog = logsResponse.data[0]

      if (!latestLog) {
        return {
          status: 'queued' as const,
          url: undefined,
          error: undefined,
        }
      }

      // Check log description for deployment status
      const description = latestLog.description?.toLowerCase() || ''

      if (description.includes('deployed successfully') || description.includes('deployment successful')) {
        const siteResponse = await service.getSite(serverId, siteId)
        return {
          status: 'ready' as const,
          url: `https://${siteResponse.data.domain}`,
          error: undefined,
        }
      }

      if (description.includes('failed') || description.includes('error')) {
        return {
          status: 'error' as const,
          url: undefined,
          error: description,
        }
      }

      // Still building
      return {
        status: 'building' as const,
        url: undefined,
        error: undefined,
      }
    } catch (error: any) {
      return {
        status: 'error' as const,
        url: undefined,
        error: error.message,
      }
    }
  }

  /**
   * Configure custom domain and SSL
   */
  async configureDomain(input: { projectId: string; domain: string }) {
    const service = await this.getService()
    const { serverId, siteId } = this.parseProjectId(input.projectId)

    // Create SSL certificate (Let's Encrypt)
    await service.createCertificate(serverId, siteId)

    return {
      domain: input.domain,
      configured: true,
      dnsRecords: [
        {
          type: 'A',
          name: input.domain,
          value: 'Your server IP', // Would need to get from server details
        },
      ],
    }
  }

  /**
   * Update environment variables
   */
  async updateEnvironmentVariables(input: {
    projectId: string
    variables: Record<string, string>
  }) {
    const service = await this.getService()
    const { serverId, siteId } = this.parseProjectId(input.projectId)

    // Get existing env content
    const envResponse = await service.getEnvironment(serverId, siteId)
    const existingEnv = PloiService.envStringToObject(envResponse.data.content)

    // Merge with new variables
    const mergedEnv = { ...existingEnv, ...input.variables }

    // Update environment file
    const envContent = PloiService.envObjectToString(mergedEnv)
    await service.updateEnvironment(serverId, siteId, envContent)
  }

  /**
   * Delete site (rollback)
   */
  async deleteProject(projectId: string) {
    const service = await this.getService()
    const { serverId, siteId } = this.parseProjectId(projectId)

    await service.deleteSite(serverId, siteId)
  }

  /**
   * Get site details
   */
  async getProject(projectId: string) {
    const service = await this.getService()
    const { serverId, siteId } = this.parseProjectId(projectId)

    const siteResponse = await service.getSite(serverId, siteId)
    const site = siteResponse.data

    return {
      id: projectId,
      name: site.domain,
      url: `https://${site.domain}`,
      status: site.status,
    }
  }

  // ===== Helper Methods =====

  /**
   * Parse composite project ID (serverId-siteId)
   */
  private parseProjectId(projectId: string): { serverId: number; siteId: number } {
    const parts = projectId.split('-')
    return {
      serverId: parseInt(parts[0]),
      siteId: parseInt(parts[1]),
    }
  }

  /**
   * Generate deployment script for Payload CMS
   */
  private generateDeploymentScript(env: Record<string, string>): string {
    return `#!/bin/bash
set -e

echo "🚀 Starting Payload CMS deployment..."

# Pull latest code from Git
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Build application
echo "🔨 Building application..."
npm run build

# Restart application (using PM2)
echo "🔄 Restarting application..."
pm2 restart payload-cms || pm2 start ecosystem.config.js --env production

echo "✅ Deployment completed successfully!"
`
  }
}

/**
 * Factory function to create PloiAdapter
 */
export function createPloiAdapter(config?: {
  apiToken?: string
  serverId?: number
  baseUrl?: string
}) {
  const apiToken = config?.apiToken || process.env.PLOI_API_TOKEN
  const serverId = config?.serverId || parseInt(process.env.PLOI_SERVER_ID || '0')

  if (!apiToken) {
    throw new Error('Ploi API token not configured. Set PLOI_API_TOKEN environment variable.')
  }

  if (!serverId) {
    throw new Error('Ploi server ID not configured. Set PLOI_SERVER_ID environment variable.')
  }

  return new PloiAdapter({
    apiToken,
    serverId,
    baseUrl: config?.baseUrl,
  })
}
