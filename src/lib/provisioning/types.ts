/**
 * Provisioning Types
 *
 * Defines interfaces for deployment adapters (Vercel, Ploi, etc.)
 * Allows pluggable deployment strategies for multi-provider support
 */

export type ProvisioningStatus =
  | 'pending'
  | 'creating_project'
  | 'deploying'
  | 'configuring_env'
  | 'configuring_domains'
  | 'completed'
  | 'failed'
  | 'rolling_back'

export type DeploymentProvider = 'vercel' | 'ploi' | 'custom'

/**
 * Progress callback for real-time updates
 */
export interface ProvisioningProgress {
  status: ProvisioningStatus
  message: string
  percentage: number
  timestamp: Date
  metadata?: Record<string, any>
}

export type ProgressCallback = (progress: ProvisioningProgress) => void | Promise<void>

/**
 * Input data for provisioning a new client site
 */
export interface ProvisioningInput {
  // Client Information
  clientId: string
  clientName: string
  domain: string // Subdomain (e.g., 'plastimed')

  // Site Configuration
  siteData: {
    siteName: string
    industry?: string
    primaryColor?: string
    layout?: any
    pages?: any[]
    blocks?: any[]
  }

  // Deployment Configuration
  provider: DeploymentProvider
  region?: string

  // Environment Variables
  environmentVariables?: Record<string, string>

  // Optional Callbacks
  onProgress?: ProgressCallback
}

/**
 * Result of a provisioning operation
 */
export interface ProvisioningResult {
  success: boolean
  clientId: string

  // Deployment URLs
  deploymentUrl?: string
  adminUrl?: string
  previewUrl?: string

  // Provider-specific data
  providerId?: string // Vercel project ID, Ploi site ID, etc.
  deploymentId?: string

  // Database
  databaseUrl?: string

  // Metadata
  status: ProvisioningStatus
  completedAt?: Date
  error?: string
  logs?: string[]
}

/**
 * Deployment Adapter Interface
 *
 * Each provider (Vercel, Ploi, etc.) implements this interface
 * This allows swappable deployment strategies
 */
export interface DeploymentAdapter {
  /**
   * Provider name
   */
  readonly provider: DeploymentProvider

  /**
   * Create a new project/site on the provider
   */
  createProject(input: {
    name: string
    domain: string
    environmentVariables?: Record<string, string>
    region?: string
  }): Promise<{
    projectId: string
    projectUrl: string
  }>

  /**
   * Deploy the site code
   */
  deploy(input: {
    projectId: string
    gitUrl?: string
    buildCommand?: string
    environmentVariables?: Record<string, string>
  }): Promise<{
    deploymentId: string
    deploymentUrl: string
    status: 'building' | 'ready' | 'error'
  }>

  /**
   * Check deployment status
   */
  getDeploymentStatus(deploymentId: string): Promise<{
    status: 'queued' | 'building' | 'ready' | 'error' | 'canceled'
    url?: string
    error?: string
  }>

  /**
   * Configure custom domain
   */
  configureDomain?(input: {
    projectId: string
    domain: string
  }): Promise<{
    domain: string
    configured: boolean
    dnsRecords?: Array<{ type: string; name: string; value: string }>
  }>

  /**
   * Update environment variables
   */
  updateEnvironmentVariables(input: {
    projectId: string
    variables: Record<string, string>
  }): Promise<void>

  /**
   * Delete project (rollback)
   */
  deleteProject(projectId: string): Promise<void>

  /**
   * Get project details
   */
  getProject(projectId: string): Promise<{
    id: string
    name: string
    url: string
    status: string
  }>
}

/**
 * Rollback configuration
 */
export interface RollbackConfig {
  deleteProject?: boolean
  deleteDatabase?: boolean
  deleteClient?: boolean
  notifyUser?: boolean
}

/**
 * Provisioning options
 */
export interface ProvisioningOptions {
  // Retry configuration
  maxRetries?: number
  retryDelay?: number

  // Timeout configuration
  deploymentTimeout?: number // milliseconds

  // Rollback behavior
  rollbackOnError?: boolean
  rollbackConfig?: RollbackConfig

  // Progress tracking
  onProgress?: ProgressCallback
}
