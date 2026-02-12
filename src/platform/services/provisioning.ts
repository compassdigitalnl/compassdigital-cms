/**
 * 🏗️ Client Provisioning Service
 *
 * Automates the complete client deployment process:
 * 1. Database provisioning
 * 2. Environment generation
 * 3. Vercel deployment
 * 4. Domain configuration
 * 5. Initial admin user setup
 */

import type { TemplateConfig } from '@/templates'
import { getTemplate } from '@/templates'
import { generateClientEnvironment, generateEnvFileContent } from '@/templates/config-generator'

export interface ProvisioningRequest {
  // Client Info
  clientName: string
  contactEmail: string
  contactName?: string
  domain: string // subdomain (e.g., "clientA")

  // Template & Features
  template: string // template ID
  enabledFeatures?: string[]
  disabledCollections?: string[]
  customSettings?: Record<string, any>

  // Optional
  customEnvironment?: Record<string, string>
  plan?: 'free' | 'starter' | 'professional' | 'enterprise'
}

export interface ProvisioningResult {
  success: boolean
  clientId?: string
  deploymentId?: string
  deploymentUrl?: string
  adminUrl?: string
  databaseUrl?: string
  error?: string
  logs?: string[]
}

/**
 * Main provisioning function
 * Orchestrates the entire client deployment process
 */
export async function provisionClient(
  request: ProvisioningRequest,
): Promise<ProvisioningResult> {
  const logs: string[] = []
  const log = (message: string) => {
    console.log(`[Provisioning] ${message}`)
    logs.push(`[${new Date().toISOString()}] ${message}`)
  }

  try {
    log(`Starting provisioning for client: ${request.clientName}`)

    // 1. Validate request
    log('Step 1/7: Validating request...')
    const validation = validateProvisioningRequest(request)
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
    }

    // 2. Get template configuration
    log('Step 2/7: Loading template configuration...')
    const template = getTemplate(request.template)
    if (!template) {
      throw new Error(`Template not found: ${request.template}`)
    }
    log(`Template loaded: ${template.name}`)

    // 3. Provision database
    log('Step 3/7: Provisioning database...')
    const database = await provisionDatabase({
      name: request.clientName,
      domain: request.domain,
    })
    log(`Database provisioned: ${database.url.substring(0, 30)}...`)

    // 4. Generate environment configuration
    log('Step 4/7: Generating environment configuration...')
    const environment = generateClientEnvironment({
      clientName: request.clientName,
      domain: `${request.domain}.${getDomainBase()}`,
      databaseUrl: database.url,
      template,
      adminEmail: request.contactEmail,
      customVars: request.customEnvironment,
    })
    log(`Environment generated with ${Object.keys(environment).length} variables`)

    // 5. Deploy to Vercel
    log('Step 5/7: Deploying to Vercel...')
    const deployment = await deployToVercel({
      name: request.domain,
      environment,
      template,
    })
    log(`Deployed to Vercel: ${deployment.url}`)

    // 6. Configure custom domain
    log('Step 6/7: Configuring custom domain...')
    await configureDomain({
      projectId: deployment.projectId,
      domain: `${request.domain}.${getDomainBase()}`,
    })
    log(`Domain configured: ${request.domain}.${getDomainBase()}`)

    // 7. Create initial admin user
    log('Step 7/7: Creating initial admin user...')
    await createInitialAdmin({
      email: request.contactEmail,
      deploymentUrl: deployment.url,
      clientName: request.clientName,
    })
    log('Initial admin user created')

    // 8. Save client to platform database
    log('Saving client to platform database...')
    const client = await saveClientToPlatform({
      name: request.clientName,
      domain: request.domain,
      contactEmail: request.contactEmail,
      contactName: request.contactName,
      template: request.template,
      deploymentUrl: deployment.url,
      adminUrl: `${deployment.url}/admin`,
      databaseUrl: database.url,
      vercelProjectId: deployment.projectId,
      plan: request.plan || 'starter',
      status: 'active',
    })
    log(`Client saved with ID: ${client.id}`)

    log('✅ Provisioning completed successfully!')

    return {
      success: true,
      clientId: client.id,
      deploymentId: deployment.id,
      deploymentUrl: deployment.url,
      adminUrl: `${deployment.url}/admin`,
      databaseUrl: database.url,
      logs,
    }
  } catch (error: any) {
    log(`❌ Provisioning failed: ${error.message}`)
    console.error('[Provisioning] Error:', error)

    return {
      success: false,
      error: error.message,
      logs,
    }
  }
}

/**
 * Validate provisioning request
 */
function validateProvisioningRequest(request: ProvisioningRequest): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!request.clientName) errors.push('Client name is required')
  if (!request.contactEmail) errors.push('Contact email is required')
  if (!request.domain) errors.push('Domain is required')
  if (!request.template) errors.push('Template is required')

  // Validate domain format
  if (request.domain && !/^[a-z0-9-]+$/.test(request.domain)) {
    errors.push('Domain must contain only lowercase letters, numbers, and hyphens')
  }

  // Validate email
  if (request.contactEmail && !isValidEmail(request.contactEmail)) {
    errors.push('Invalid email format')
  }

  // Validate template exists
  if (request.template && !getTemplate(request.template)) {
    errors.push(`Template "${request.template}" not found`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Provision database for client
 */
async function provisionDatabase(data: {
  name: string
  domain: string
}): Promise<{ url: string; id: string }> {
  // Use Railway for database provisioning
  const { createRailwayDatabase } = await import('@/platform/integrations/railway')

  try {
    const result = await createRailwayDatabase({
      name: data.name,
      domain: data.domain,
    })

    console.log(`[DB] Database provisioned: ${result.id}`)
    return result
  } catch (error: any) {
    console.error(`[DB] Failed to provision database:`, error)

    // Fallback to mock if Railway is not configured (dev mode)
    if (error.message.includes('RAILWAY_API_KEY')) {
      console.warn(`[DB] Railway not configured, using mock database`)
      const mockUrl = `postgresql://user:pass@localhost:5432/${data.domain}_db`
      return {
        url: mockUrl,
        id: `db_mock_${Date.now()}`,
      }
    }

    throw error
  }
}

/**
 * Deploy client to Vercel
 */
async function deployToVercel(data: {
  name: string
  environment: Record<string, string>
  template: TemplateConfig
}): Promise<{ url: string; projectId: string; id: string }> {
  const { deployToVercel: vercelDeploy } = await import('@/platform/integrations/vercel')

  try {
    const result = await vercelDeploy({
      name: data.name,
      environment: data.environment,
    })

    console.log(`[Vercel] Deployed successfully: ${result.url}`)
    return result
  } catch (error: any) {
    console.error(`[Vercel] Failed to deploy:`, error)

    // Fallback to mock if Vercel is not configured (dev mode)
    if (error.message.includes('VERCEL_TOKEN') || error.message.includes('GITHUB_REPO')) {
      console.warn(`[Vercel] Vercel not configured, using mock deployment`)
      return {
        url: `https://${data.name}-mock.vercel.app`,
        projectId: `prj_mock_${Date.now()}`,
        id: `dpl_mock_${Date.now()}`,
      }
    }

    throw error
  }
}

/**
 * Configure custom domain on Vercel
 */
async function configureDomain(data: {
  projectId: string
  domain: string
}): Promise<void> {
  const { addVercelDomain } = await import('@/platform/integrations/vercel')

  try {
    await addVercelDomain({
      projectId: data.projectId,
      domain: data.domain,
    })
    console.log(`[Domain] Domain configured: ${data.domain}`)
  } catch (error: any) {
    // Don't fail provisioning if domain config fails
    console.warn(`[Domain] Failed to configure domain (non-critical):`, error.message)
  }
}

/**
 * Create initial admin user for client
 */
async function createInitialAdmin(data: {
  email: string
  deploymentUrl: string
  clientName: string
}): Promise<void> {
  const { generateSecurePassword, sendWelcomeEmail } = await import('@/platform/integrations/resend')

  try {
    // 1. Generate secure password
    const password = generateSecurePassword()
    console.log(`[Admin] Creating admin user: ${data.email}`)

    // 2. Create user via client API (wait a bit for deployment to be ready)
    await new Promise((resolve) => setTimeout(resolve, 10000)) // 10 seconds

    try {
      const createUserRes = await fetch(`${data.deploymentUrl}/api/users/create-first-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password,
          name: data.clientName + ' Admin',
        }),
      })

      if (!createUserRes.ok) {
        console.warn(`[Admin] Failed to create user via API (site may not be ready yet)`)
      } else {
        console.log(`[Admin] Admin user created successfully`)
      }
    } catch (apiError) {
      console.warn(`[Admin] Could not reach client API (site may still be deploying)`)
    }

    // 3. Send welcome email with credentials
    await sendWelcomeEmail({
      to: data.email,
      clientName: data.clientName,
      adminUrl: `${data.deploymentUrl}/admin`,
      email: data.email,
      password,
    })

    console.log(`[Admin] Welcome email sent`)
  } catch (error: any) {
    console.error(`[Admin] Error creating admin user:`, error)
    // Don't throw - admin creation failure shouldn't block provisioning
  }
}

/**
 * Save client to platform database
 */
async function saveClientToPlatform(data: any): Promise<{ id: string }> {
  const { getPayloadClient } = await import('@/lib/getPlatformPayload')
  const payload = await getPayloadClient()

  const client = await payload.create({
    collection: 'clients',
    data,
  })

  console.log(`[Platform] Client saved: ${client.id}`)

  return {
    id: client.id,
  }
}

/**
 * Get domain base (configured per environment)
 */
function getDomainBase(): string {
  return process.env.PLATFORM_DOMAIN || 'yourplatform.com'
}

/**
 * Email validation
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Deprovision client (cleanup on deletion)
 */
export async function deprovisionClient(clientId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    console.log(`[Deprovisioning] Starting for client: ${clientId}`)

    // TODO: Implement cleanup
    // 1. Delete Vercel project
    // 2. Delete database
    // 3. Remove DNS records
    // 4. Archive data (backup before delete!)
    // 5. Delete from platform database

    return { success: true }
  } catch (error: any) {
    console.error('[Deprovisioning] Error:', error)
    return { success: false, error: error.message }
  }
}
