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
    port?: number // Assigned Node.js port (unique per site on the server)
    gitRepo?: string // e.g. "org/repo"
    gitBranch?: string // default "main"
  }) {
    const service = await this.getService()
    const port = input.port || 3000
    const gitRepo = input.gitRepo || process.env.PLOI_GIT_REPO || 'compassdigitalnl/compassdigital-cms'
    const gitBranch = input.gitBranch || process.env.PLOI_GIT_BRANCH || 'main'

    // Create site on Ploi
    const siteResponse = await service.createSite(this.serverId, {
      root_domain: input.domain,
      project_type: 'nodejs', // Payload CMS runs on Node.js
      web_directory: '/', // '/' prevents Ploi from creating a /public dir that blocks git clone
      nodejs_port: port, // Tell Ploi which port Nginx should proxy to
    })

    const site = siteResponse.data
    console.log(`[PloiAdapter] Site created: ${site.id} (${site.domain}) on port ${port}`)

    // Remove Ploi's root-owned placeholder file so git clone can succeed
    await this.clearSitePlaceholder(site.domain)

    // Defensief: controleer en corrigeer Nginx-config (proxy_pass poort + ACME webroot).
    // Ploi honoreert nodejs_port niet altijd, en de ACME webroot klopt standaard niet.
    await this.ensureNginxPort(site.id, port, site.domain)

    // Install git repository
    try {
      await service.installRepository(this.serverId, site.id, {
        provider: 'github',
        branch: gitBranch,
        name: gitRepo,
      })
      console.log(`[PloiAdapter] Repository installed: ${gitRepo}@${gitBranch}`)
    } catch (repoError: any) {
      console.warn(`[PloiAdapter] Repository installation warning: ${repoError.message}`)
      // Non-fatal: site may already have a repo, or user can set it manually
    }

    // Setup environment variables if provided
    if (input.environmentVariables) {
      const envContent = PloiService.envObjectToString(input.environmentVariables)
      await service.updateEnvironment(this.serverId, site.id, envContent)
    }

    // Setup deployment script for Payload CMS (using the assigned port)
    const deploymentScript = this.generateDeploymentScript(port)
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
    // Note: Ploi API returns {"message":"..."} not {"data":{"id":...}}
    await service.deploySite(serverId, siteId)

    // Get site info for URL
    const siteResponse = await service.getSite(serverId, siteId)
    const site = siteResponse.data

    return {
      deploymentId: `${serverId}-${siteId}`, // Use composite ID for monitoring
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
      // Primary check: site.status from Ploi tells us if deployment succeeded
      // Ploi sets status='active' when the site is up, 'deploy-failed' on failure
      const siteResponse = await service.getSite(serverId, siteId)
      const site = siteResponse.data
      const siteStatus = site.status?.toLowerCase() || ''

      if (siteStatus === 'active') {
        return {
          status: 'ready' as const,
          url: `https://${site.domain}`,
          error: undefined,
        }
      }

      if (siteStatus === 'deploy-failed') {
        // Try to get failure details from latest log
        try {
          const logsResponse = await service.getLogs(serverId, siteId)
          const latestLog = logsResponse.data[0]
          const description = latestLog?.description || 'Deploy failed'
          return {
            status: 'error' as const,
            url: undefined,
            error: description,
          }
        } catch {
          return { status: 'error' as const, url: undefined, error: 'deploy-failed' }
        }
      }

      // Fallback: check log descriptions for explicit success/failure keywords
      // (covers edge cases where site.status may not update immediately)
      const logsResponse = await service.getLogs(serverId, siteId)
      const latestLog = logsResponse.data[0]
      const description = latestLog?.description?.toLowerCase() || ''

      if (description.includes('deployed successfully') || description.includes('deployment successful')) {
        return {
          status: 'ready' as const,
          url: `https://${site.domain}`,
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

      // Still building / installing
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
   * Get server IP for DNS configuration.
   * NOTE: SSL certificate is NOT requested here — the ProvisioningService
   * handles SSL separately after verifying DNS propagation.
   */
  async configureDomain(input: { projectId: string; domain: string }) {
    const service = await this.getService()
    const { serverId } = this.parseProjectId(input.projectId)

    // Get server details to retrieve IP address
    const serverResponse = await service.getServer(serverId)
    const serverIp = serverResponse.data.ip_address

    return {
      domain: input.domain,
      configured: true,
      serverIp, // Return server IP for DNS A-record creation
      dnsRecords: [
        {
          type: 'A',
          name: input.domain,
          value: serverIp,
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
    // Ploi returns { data: "env-string" } — data is directly the string content
    const envResponse = await service.getEnvironment(serverId, siteId)
    const existingEnv = PloiService.envStringToObject(envResponse.data as string)

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
   * Remove the root-owned placeholder file Ploi creates when a site is provisioned.
   *
   * When Ploi creates a Node.js site it drops a root-owned `index.html` in the
   * site's home directory. This causes `git clone` to fail with:
   *   "rm: cannot remove '.../index.html': Permission denied"
   *
   * We work around it by creating a one-shot Ploi Script that runs as root,
   * executing it on our server, waiting briefly, then deleting the script.
   */
  private async clearSitePlaceholder(domain: string): Promise<void> {
    const service = await this.getService()
    const siteDir = `/home/ploi/${domain}`
    const scriptLabel = `clear-placeholder-${domain}-${Date.now()}`
    const scriptContent = `#!/bin/bash
# Remove root-owned placeholder files created by Ploi so git clone can succeed
rm -f "${siteDir}/index.html"
rm -f "${siteDir}/index.php"
echo "Placeholder files removed from ${siteDir}"`

    let scriptId: number | null = null

    try {
      const created = await service.createScript({
        label: scriptLabel,
        content: scriptContent,
        user: 'root',
      })
      scriptId = created.data.id
      console.log(`[PloiAdapter] Created placeholder-removal script: ${scriptId}`)

      await service.runScript(scriptId, [this.serverId])
      console.log(`[PloiAdapter] Running placeholder-removal script on server ${this.serverId}`)

      // Give Ploi ~5 seconds to execute the script before we proceed
      await new Promise((resolve) => setTimeout(resolve, 5000))
    } catch (err: any) {
      console.warn(`[PloiAdapter] clearSitePlaceholder warning: ${err.message}`)
      // Non-fatal: if it fails we still attempt the clone
    } finally {
      // Always clean up the temporary script
      if (scriptId) {
        try {
          await service.deleteScript(scriptId)
          console.log(`[PloiAdapter] Deleted placeholder-removal script: ${scriptId}`)
        } catch {
          // Ignore cleanup errors
        }
      }
    }
  }

  /**
   * Verify and correct the Nginx configuration after site creation.
   *
   * Fixes two known Ploi issues:
   * 1. proxy_pass port: Ploi may default to 3000 instead of the assigned port.
   * 2. ACME challenge webroot: Ploi sets root to /var/www/html, but certbot writes
   *    challenge files to the site directory (/home/ploi/{domain}). This mismatch
   *    causes Let's Encrypt SSL validation to always fail with a 404.
   */
  private async ensureNginxPort(siteId: number, expectedPort: number, domain?: string): Promise<void> {
    const service = await this.getService()

    try {
      const configRes = await service.getNginxConfiguration(this.serverId, siteId)
      // Ploi returns { nginx_config: "..." }
      const currentConfig: string = configRes?.nginx_config || (configRes as any)?.content || ''

      if (!currentConfig) {
        console.warn(`[PloiAdapter] ensureNginxPort: could not read Nginx config for site ${siteId}`)
        return
      }

      let fixedConfig = currentConfig
      let changed = false

      // Fix 1: proxy_pass port
      const expectedProxy = `proxy_pass http://localhost:${expectedPort}`
      if (!currentConfig.includes(expectedProxy)) {
        fixedConfig = fixedConfig.replace(
          /proxy_pass http:\/\/localhost:\d+;/g,
          `proxy_pass http://localhost:${expectedPort};`,
        )
        if (fixedConfig !== currentConfig) {
          changed = true
          console.log(`[PloiAdapter] Nginx proxy_pass corrected to port ${expectedPort} ✓`)
        } else {
          console.warn(`[PloiAdapter] ensureNginxPort: proxy_pass not found in Nginx config for site ${siteId}`)
        }
      }

      // Fix 2: ACME challenge webroot
      // Ploi uses /var/www/html as webroot, but certbot writes challenge files to the site dir.
      // Without this fix, Let's Encrypt SSL validation always fails with 404.
      if (domain && fixedConfig.includes('root /var/www/html')) {
        const siteDir = `/home/ploi/${domain}`
        fixedConfig = fixedConfig.replace(/root \/var\/www\/html;/g, `root ${siteDir};`)
        changed = true
        console.log(`[PloiAdapter] ACME challenge webroot corrected to ${siteDir} ✓`)
      }

      if (!changed) {
        console.log(`[PloiAdapter] Nginx config already correct for site ${siteId} ✓`)
        return
      }

      await service.updateNginxConfiguration(this.serverId, siteId, fixedConfig)
      await service.restartService(this.serverId, 'nginx')
      console.log(`[PloiAdapter] Nginx config updated and restarted for site ${siteId} ✓`)
    } catch (err: any) {
      // Non-fatal: Nginx may need a moment to be ready after site creation
      console.warn(`[PloiAdapter] ensureNginxPort warning: ${err.message}`)
    }
  }

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
   * @param port - The unique Node.js port assigned to this site
   *
   * NOTE: Ploi automatically does `git clone` (first time) or `git pull` (subsequent)
   * BEFORE running this script. Do NOT include git operations here.
   */
  private generateDeploymentScript(port: number): string {
    return `#!/bin/bash
set -e

echo "Starting Payload CMS deployment (port ${port})..."

# Install dependencies (pnpm preferred, npm fallback)
echo "Installing dependencies..."
if command -v pnpm &>/dev/null; then
  pnpm install --frozen-lockfile
else
  npm ci --production=false
fi

# Build application
echo "Building application..."
NODE_OPTIONS="--no-deprecation --max-old-space-size=2048" npm run build

# Restart application via PM2 on the assigned port
echo "Restarting application on port ${port}..."

if pm2 describe payload-cms &>/dev/null; then
  PORT=${port} pm2 restart payload-cms --update-env
else
  PORT=${port} pm2 start npm --name "payload-cms" -- start
  pm2 save
fi

echo "Deployment completed on port ${port}!"
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
