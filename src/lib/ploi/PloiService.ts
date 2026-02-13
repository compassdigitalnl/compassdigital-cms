/**
 * Ploi API Service
 *
 * Handles all interactions with Ploi's REST API for:
 * - Server management
 * - Site creation and deployment
 * - Environment variables
 * - SSL certificates
 * - Domain management
 *
 * Documentation: https://developers.ploi.io/
 */

interface PloiConfig {
  apiToken: string
  baseUrl?: string
}

interface PloiServer {
  id: number
  name: string
  ip_address: string
  status: string
}

interface PloiSite {
  id: number
  server_id: number
  domain: string
  status: string
  root_domain: string
  web_directory: string
  project_type: string
  system_user: string
  created_at: string
}

interface PloiDeployment {
  id: number
  site_id: number
  status: 'pending' | 'running' | 'success' | 'failed'
  output?: string
  created_at: string
  finished_at?: string
}

interface CreateSiteRequest {
  root_domain: string // e.g., "clientname.compassdigital.nl"
  domain?: string // Optional alias
  project_type?: 'php' | 'nodejs' | 'python' | 'static' | 'wordpress'
  web_directory?: string // e.g., "/public" or "/dist"
  system_user?: string
}

interface UpdateEnvironmentRequest {
  content: string // Full .env file content
}

export class PloiService {
  private apiToken: string
  private baseUrl: string

  constructor(config: PloiConfig) {
    this.apiToken = config.apiToken
    this.baseUrl = config.baseUrl || 'https://ploi.io'
  }

  /**
   * Make authenticated request to Ploi API
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `Ploi API error: ${response.status} ${response.statusText}`,
      )
    }

    return response.json()
  }

  // ===== Server Management =====

  /**
   * List all servers
   */
  async listServers(): Promise<{ data: PloiServer[] }> {
    return this.request('/api/servers')
  }

  /**
   * Get server by ID
   */
  async getServer(serverId: number): Promise<{ data: PloiServer }> {
    return this.request(`/api/servers/${serverId}`)
  }

  // ===== Site Management =====

  /**
   * Create a new site on a server
   */
  async createSite(
    serverId: number,
    data: CreateSiteRequest,
  ): Promise<{ data: PloiSite }> {
    return this.request(`/api/servers/${serverId}/sites`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Get site details
   */
  async getSite(serverId: number, siteId: number): Promise<{ data: PloiSite }> {
    return this.request(`/api/servers/${serverId}/sites/${siteId}`)
  }

  /**
   * List all sites on a server
   */
  async listSites(serverId: number): Promise<{ data: PloiSite[] }> {
    return this.request(`/api/servers/${serverId}/sites`)
  }

  /**
   * Delete a site
   */
  async deleteSite(serverId: number, siteId: number): Promise<void> {
    return this.request(`/api/servers/${serverId}/sites/${siteId}`, {
      method: 'DELETE',
    })
  }

  // ===== Deployment =====

  /**
   * Trigger site deployment
   */
  async deploySite(
    serverId: number,
    siteId: number,
  ): Promise<{ data: PloiDeployment }> {
    return this.request(`/api/servers/${serverId}/sites/${siteId}/deploy`, {
      method: 'POST',
    })
  }

  /**
   * Get deployment script
   */
  async getDeploymentScript(
    serverId: number,
    siteId: number,
  ): Promise<{ data: { script: string } }> {
    return this.request(`/api/servers/${serverId}/sites/${siteId}/deploy/script`)
  }

  /**
   * Update deployment script
   */
  async updateDeploymentScript(
    serverId: number,
    siteId: number,
    script: string,
  ): Promise<void> {
    return this.request(`/api/servers/${serverId}/sites/${siteId}/deploy/script`, {
      method: 'PATCH',
      body: JSON.stringify({ script }),
    })
  }

  // ===== Environment Variables =====

  /**
   * Get environment file (.env)
   */
  async getEnvironment(
    serverId: number,
    siteId: number,
  ): Promise<{ data: { content: string } }> {
    return this.request(`/api/servers/${serverId}/sites/${siteId}/env`)
  }

  /**
   * Update environment file (.env)
   */
  async updateEnvironment(
    serverId: number,
    siteId: number,
    envContent: string,
  ): Promise<void> {
    return this.request(`/api/servers/${serverId}/sites/${siteId}/env`, {
      method: 'PATCH',
      body: JSON.stringify({ content: envContent }),
    })
  }

  // ===== SSL Certificates =====

  /**
   * Create SSL certificate (Let's Encrypt)
   */
  async createCertificate(
    serverId: number,
    siteId: number,
    data?: { certificate?: string; key?: string },
  ): Promise<{ data: any }> {
    return this.request(`/api/servers/${serverId}/sites/${siteId}/certificates`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    })
  }

  /**
   * List certificates for a site
   */
  async listCertificates(serverId: number, siteId: number): Promise<{ data: any[] }> {
    return this.request(`/api/servers/${serverId}/sites/${siteId}/certificates`)
  }

  // ===== Test Domain =====

  /**
   * Enable Ploi test domain (e.g., site-123.ploi.link)
   */
  async enableTestDomain(serverId: number, siteId: number): Promise<{ data: any }> {
    return this.request(`/api/servers/${serverId}/sites/${siteId}/test-domain`, {
      method: 'POST',
    })
  }

  /**
   * Disable test domain
   */
  async disableTestDomain(serverId: number, siteId: number): Promise<void> {
    return this.request(`/api/servers/${serverId}/sites/${siteId}/test-domain`, {
      method: 'DELETE',
    })
  }

  // ===== Logs =====

  /**
   * Get site logs
   */
  async getLogs(serverId: number, siteId: number): Promise<{ data: any[] }> {
    return this.request(`/api/servers/${serverId}/sites/${siteId}/log`)
  }

  /**
   * Get specific log entry
   */
  async getLog(serverId: number, siteId: number, logId: number): Promise<{ data: any }> {
    return this.request(`/api/servers/${serverId}/sites/${siteId}/log/${logId}`)
  }

  // ===== Helper Methods =====

  /**
   * Wait for deployment to complete
   */
  async waitForDeployment(
    serverId: number,
    siteId: number,
    maxAttempts: number = 60,
    intervalMs: number = 5000,
  ): Promise<'success' | 'failed'> {
    for (let i = 0; i < maxAttempts; i++) {
      // Get latest logs to check deployment status
      const logsResponse = await this.getLogs(serverId, siteId)
      const latestLog = logsResponse.data[0]

      if (latestLog) {
        if (latestLog.description?.includes('deployed successfully')) {
          return 'success'
        }
        if (latestLog.description?.includes('failed')) {
          return 'failed'
        }
      }

      // Wait before next check
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }

    throw new Error('Deployment timeout exceeded')
  }

  /**
   * Convert environment object to .env file format
   */
  static envObjectToString(env: Record<string, string>): string {
    return Object.entries(env)
      .map(([key, value]) => {
        // Escape quotes in values
        const escapedValue = value.replace(/"/g, '\\"')
        // Wrap in quotes if contains spaces or special chars
        const needsQuotes = /[\s#]/.test(value)
        return `${key}=${needsQuotes ? `"${escapedValue}"` : escapedValue}`
      })
      .join('\n')
  }

  /**
   * Parse .env file string to object
   */
  static envStringToObject(envString: string): Record<string, string> {
    const env: Record<string, string> = {}

    envString.split('\n').forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return

      const [key, ...valueParts] = trimmed.split('=')
      if (!key) return

      let value = valueParts.join('=')

      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }

      // Unescape quotes
      value = value.replace(/\\"/g, '"')

      env[key.trim()] = value
    })

    return env
  }
}
