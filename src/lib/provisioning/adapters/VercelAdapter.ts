/**
 * Vercel Deployment Adapter
 *
 * Implements DeploymentAdapter interface for Vercel platform
 * Uses VercelService for API interactions
 */

import type {
  DeploymentAdapter,
  DeploymentProvider,
} from '../types'

// Lazy load VercelService to avoid build-time initialization
let VercelService: any

async function getVercelService() {
  if (!VercelService) {
    const module = await import('@/lib/vercel/VercelService')
    VercelService = module.VercelService
  }
  return VercelService
}

export class VercelAdapter implements DeploymentAdapter {
  readonly provider: DeploymentProvider = 'vercel'
  private vercelService: any

  constructor(private config: {
    apiToken: string
    orgId?: string
    teamId?: string
  }) {}

  /**
   * Initialize VercelService (lazy loaded)
   */
  private async getService() {
    if (!this.vercelService) {
      const VercelServiceClass = await getVercelService()
      this.vercelService = new VercelServiceClass({
        apiToken: this.config.apiToken,
        orgId: this.config.orgId,
        teamId: this.config.teamId,
      })
    }
    return this.vercelService
  }

  /**
   * Create a new Vercel project
   */
  async createProject(input: {
    name: string
    domain: string
    environmentVariables?: Record<string, string>
    region?: string
  }) {
    const service = await this.getService()

    // Create Vercel project
    const project = await service.createProject({
      name: input.name,
      framework: 'nextjs',
      environmentVariables: input.environmentVariables
        ? Object.entries(input.environmentVariables).map(([key, value]) => ({
            key,
            value,
            target: ['production', 'preview', 'development'],
          }))
        : undefined,
    })

    return {
      projectId: project.id,
      projectUrl: `https://${project.name}.vercel.app`,
    }
  }

  /**
   * Deploy site to Vercel
   */
  async deploy(input: {
    projectId: string
    gitUrl?: string
    buildCommand?: string
    environmentVariables?: Record<string, string>
  }) {
    const service = await this.getService()

    // For now, we trigger a redeploy of the latest deployment
    // In production, this would deploy from a Git repository
    const deployment = await service.redeploy(input.projectId)

    return {
      deploymentId: deployment.uid,
      deploymentUrl: `https://${deployment.url}`,
      status: deployment.state === 'READY' ? 'ready' : 'building' as any,
    }
  }

  /**
   * Check deployment status
   */
  async getDeploymentStatus(deploymentId: string) {
    const service = await this.getService()
    const deployment = await service.getDeployment(deploymentId)

    const statusMap: Record<string, any> = {
      'BUILDING': 'building',
      'ERROR': 'error',
      'INITIALIZING': 'building',
      'QUEUED': 'queued',
      'READY': 'ready',
      'CANCELED': 'canceled',
    }

    return {
      status: statusMap[deployment.state] || 'building',
      url: deployment.state === 'READY' ? `https://${deployment.url}` : undefined,
      error: deployment.state === 'ERROR' ? 'Deployment failed' : undefined,
    }
  }

  /**
   * Configure custom domain
   */
  async configureDomain(input: { projectId: string; domain: string }) {
    const service = await this.getService()

    try {
      await service.addDomain(input.projectId, input.domain)

      return {
        domain: input.domain,
        configured: true,
        dnsRecords: [
          {
            type: 'CNAME',
            name: input.domain,
            value: 'cname.vercel-dns.com',
          },
        ],
      }
    } catch (error: any) {
      // Domain might already be added
      if (error.message?.includes('already exists')) {
        return {
          domain: input.domain,
          configured: true,
        }
      }
      throw error
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

    await service.setEnvironmentVariables(
      input.projectId,
      Object.entries(input.variables).map(([key, value]) => ({
        key,
        value,
        target: ['production', 'preview', 'development'],
      })),
    )
  }

  /**
   * Delete project (rollback)
   */
  async deleteProject(projectId: string) {
    const service = await this.getService()
    await service.deleteProject(projectId)
  }

  /**
   * Get project details
   */
  async getProject(projectId: string) {
    const service = await this.getService()
    const project = await service.getProject(projectId)

    return {
      id: project.id,
      name: project.name,
      url: `https://${project.name}.vercel.app`,
      status: 'active',
    }
  }
}

/**
 * Factory function to create VercelAdapter
 */
export function createVercelAdapter(config?: {
  apiToken?: string
  orgId?: string
  teamId?: string
}) {
  const apiToken = config?.apiToken || process.env.VERCEL_API_TOKEN
  if (!apiToken) {
    throw new Error('Vercel API token not configured')
  }

  return new VercelAdapter({
    apiToken,
    orgId: config?.orgId || process.env.VERCEL_ORG_ID,
    teamId: config?.teamId || process.env.VERCEL_TEAM_ID,
  })
}
