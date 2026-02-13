/**
 * Vercel API Service
 *
 * Handles all interactions with Vercel's REST API for:
 * - Project creation and management
 * - Deployments
 * - Domain management
 * - Environment variables
 *
 * Documentation: https://vercel.com/docs/rest-api
 */

interface VercelConfig {
  apiToken: string
  orgId?: string
  teamId?: string
}

interface VercelProject {
  id: string
  name: string
  framework?: string
  link?: {
    type: string
    repo: string
    repoId: number
    org?: string
  }
  createdAt: number
}

interface VercelDeployment {
  uid: string
  name: string
  url: string
  state: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED'
  type: 'LAMBDAS'
  created: number
  createdAt: number
  buildingAt?: number
  ready?: number
  alias?: string[]
  meta?: Record<string, any>
}

interface CreateProjectRequest {
  name: string
  framework?: string
  buildCommand?: string
  outputDirectory?: string
  installCommand?: string
  rootDirectory?: string
  environmentVariables?: Array<{
    key: string
    value: string
    type: 'plain' | 'encrypted' | 'secret'
    target: ('production' | 'preview' | 'development')[]
  }>
  gitRepository?: {
    type: 'github' | 'gitlab' | 'bitbucket'
    repo: string
  }
}

interface CreateDeploymentRequest {
  name: string
  project?: string
  target?: 'production' | 'staging'
  gitSource?: {
    type: 'github' | 'gitlab' | 'bitbucket'
    ref: string
    repoId: string | number
  }
}

export class VercelService {
  private apiToken: string
  private orgId?: string
  private teamId?: string
  private baseUrl = 'https://api.vercel.com'

  constructor(config: VercelConfig) {
    if (!config.apiToken) {
      throw new Error('Vercel API token is required')
    }
    this.apiToken = config.apiToken
    this.orgId = config.orgId
    this.teamId = config.teamId
  }

  /**
   * Make authenticated request to Vercel API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    }

    // Add team ID to query params if provided
    const urlObj = new URL(url)
    if (this.teamId) {
      urlObj.searchParams.set('teamId', this.teamId)
    }

    const response = await fetch(urlObj.toString(), {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Vercel API error (${response.status}): ${error}`)
    }

    return response.json()
  }

  /**
   * List all projects
   */
  async listProjects(): Promise<{ projects: VercelProject[] }> {
    return this.request('/v9/projects')
  }

  /**
   * Get a specific project
   */
  async getProject(projectIdOrName: string): Promise<VercelProject> {
    return this.request(`/v9/projects/${projectIdOrName}`)
  }

  /**
   * Create a new project
   */
  async createProject(data: CreateProjectRequest): Promise<VercelProject> {
    return this.request('/v9/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Delete a project
   */
  async deleteProject(projectIdOrName: string): Promise<void> {
    await this.request(`/v9/projects/${projectIdOrName}`, {
      method: 'DELETE',
    })
  }

  /**
   * List deployments for a project
   */
  async listDeployments(
    projectId?: string,
    limit: number = 20,
  ): Promise<{ deployments: VercelDeployment[] }> {
    const params = new URLSearchParams({
      limit: limit.toString(),
    })
    if (projectId) {
      params.set('projectId', projectId)
    }

    return this.request(`/v6/deployments?${params.toString()}`)
  }

  /**
   * Get a specific deployment
   */
  async getDeployment(deploymentId: string): Promise<VercelDeployment> {
    return this.request(`/v13/deployments/${deploymentId}`)
  }

  /**
   * Create a new deployment
   */
  async createDeployment(data: CreateDeploymentRequest): Promise<VercelDeployment> {
    return this.request('/v13/deployments', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Trigger a redeploy (creates new deployment from latest commit)
   */
  async redeploy(projectIdOrName: string): Promise<VercelDeployment> {
    // First, get the project to find the latest deployment
    const project = await this.getProject(projectIdOrName)

    // Get latest production deployment
    const { deployments } = await this.listDeployments(project.id, 1)

    if (!deployments || deployments.length === 0) {
      throw new Error('No deployments found for this project')
    }

    const latestDeployment = deployments[0]

    // Create new deployment with same configuration
    return this.createDeployment({
      name: project.name,
      project: project.id,
      target: 'production',
      gitSource: latestDeployment.meta?.gitSource || undefined,
    })
  }

  /**
   * Cancel a deployment
   */
  async cancelDeployment(deploymentId: string): Promise<void> {
    await this.request(`/v12/deployments/${deploymentId}/cancel`, {
      method: 'PATCH',
    })
  }

  /**
   * Add a domain to a project
   */
  async addDomain(
    projectIdOrName: string,
    domain: string,
  ): Promise<{ name: string; verified: boolean }> {
    return this.request(`/v9/projects/${projectIdOrName}/domains`, {
      method: 'POST',
      body: JSON.stringify({ name: domain }),
    })
  }

  /**
   * Remove a domain from a project
   */
  async removeDomain(projectIdOrName: string, domain: string): Promise<void> {
    await this.request(`/v9/projects/${projectIdOrName}/domains/${domain}`, {
      method: 'DELETE',
    })
  }

  /**
   * Set environment variables for a project
   */
  async setEnvironmentVariables(
    projectIdOrName: string,
    variables: Array<{
      key: string
      value: string
      type?: 'plain' | 'encrypted' | 'secret'
      target?: ('production' | 'preview' | 'development')[]
    }>,
  ): Promise<void> {
    for (const variable of variables) {
      await this.request(`/v9/projects/${projectIdOrName}/env`, {
        method: 'POST',
        body: JSON.stringify({
          key: variable.key,
          value: variable.value,
          type: variable.type || 'plain',
          target: variable.target || ['production', 'preview', 'development'],
        }),
      })
    }
  }

  /**
   * Get project environment variables
   */
  async getEnvironmentVariables(
    projectIdOrName: string,
  ): Promise<{
    envs: Array<{
      key: string
      value?: string
      type: string
      target: string[]
      id: string
    }>
  }> {
    return this.request(`/v9/projects/${projectIdOrName}/env`)
  }
}

/**
 * Create Vercel service instance from environment variables
 */
export function createVercelService(): VercelService {
  const apiToken = process.env.VERCEL_API_TOKEN
  const teamId = process.env.VERCEL_TEAM_ID
  const orgId = process.env.VERCEL_ORG_ID

  if (!apiToken) {
    throw new Error(
      'VERCEL_API_TOKEN environment variable is required. Get your token at https://vercel.com/account/tokens',
    )
  }

  return new VercelService({
    apiToken,
    teamId,
    orgId,
  })
}

/**
 * Get Vercel service instance (lazy initialization)
 */
let vercelServiceInstance: VercelService | null = null

export function getVercelService(): VercelService {
  if (!vercelServiceInstance) {
    vercelServiceInstance = createVercelService()
  }
  return vercelServiceInstance
}
