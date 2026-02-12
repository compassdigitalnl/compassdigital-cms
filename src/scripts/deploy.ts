/**
 * Production Deployment Script
 *
 * Automated deployment with:
 * - Pre-deploy validation
 * - Build verification
 * - Health checks
 * - Post-deploy verification
 * - Rollback capability
 *
 * Usage:
 *   npm run deploy              # Deploy to production
 *   npm run deploy:staging      # Deploy to staging
 *   npm run deploy:verify       # Verify deployment only
 */

import 'dotenv/config'
import { execSync } from 'child_process'
import { existsSync } from 'fs'
import path from 'path'

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
  production: {
    url: process.env.NEXT_PUBLIC_SERVER_URL || process.env.PRODUCTION_URL || '',
    vercel: {
      projectId: process.env.VERCEL_PROJECT_ID,
      orgId: process.env.VERCEL_ORG_ID,
      token: process.env.VERCEL_TOKEN,
    },
  },
  staging: {
    url: process.env.STAGING_URL || '',
    vercel: {
      projectId: process.env.VERCEL_PROJECT_ID,
      orgId: process.env.VERCEL_ORG_ID,
      token: process.env.VERCEL_TOKEN,
    },
  },
  healthcheck: {
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 5000, // 5 seconds
  },
}

// ============================================================================
// Types
// ============================================================================

type Environment = 'production' | 'staging'

type DeployResult = {
  success: boolean
  message: string
  url?: string
  error?: string
  rollback?: () => Promise<void>
}

type HealthCheckResult = {
  healthy: boolean
  status: number
  latency: number
  checks?: any
}

// ============================================================================
// Utilities
// ============================================================================

function log(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m',   // Red
    reset: '\x1b[0m',
  }

  const icons = {
    info: 'ℹ',
    success: '✓',
    warning: '⚠',
    error: '✗',
  }

  console.log(`${colors[type]}${icons[type]} ${message}${colors.reset}`)
}

function separator() {
  console.log('\n' + '='.repeat(80) + '\n')
}

function execCommand(command: string, silent = false): string {
  try {
    return execSync(command, {
      stdio: silent ? 'pipe' : 'inherit',
      encoding: 'utf-8',
    })
  } catch (error: any) {
    throw new Error(`Command failed: ${command}\n${error.message}`)
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ============================================================================
// Validation Checks
// ============================================================================

async function runPreDeployChecks(): Promise<boolean> {
  separator()
  log('PRE-DEPLOY VALIDATION', 'info')
  separator()

  let allPassed = true

  // 1. Environment Variables
  log('Checking environment variables...', 'info')
  const requiredVars = [
    'PAYLOAD_SECRET',
    'DATABASE_URL',
    'NEXT_PUBLIC_SERVER_URL',
  ]

  const missing = requiredVars.filter(v => !process.env[v])
  if (missing.length > 0) {
    log(`Missing variables: ${missing.join(', ')}`, 'error')
    allPassed = false
  } else {
    log('Environment variables OK', 'success')
  }

  // 2. Git Status
  log('Checking git status...', 'info')
  try {
    const status = execCommand('git status --porcelain', true).trim()
    if (status) {
      log('Uncommitted changes detected', 'warning')
      log('Commit or stash changes before deploying', 'warning')
      allPassed = false
    } else {
      log('Working directory clean', 'success')
    }

    // Check if on correct branch
    const branch = execCommand('git branch --show-current', true).trim()
    if (branch !== 'main' && branch !== 'master') {
      log(`Current branch: ${branch} (expected: main/master)`, 'warning')
    }
  } catch (error) {
    log('Not a git repository or git not available', 'warning')
  }

  // 3. Dependencies
  log('Checking dependencies...', 'info')
  if (!existsSync(path.join(process.cwd(), 'node_modules'))) {
    log('Dependencies not installed', 'error')
    allPassed = false
  } else {
    log('Dependencies installed', 'success')
  }

  // 4. TypeScript
  log('Running TypeScript check...', 'info')
  try {
    execCommand('npx tsc --noEmit --skipLibCheck', true)
    log('TypeScript check passed', 'success')
  } catch (error) {
    log('TypeScript errors detected', 'error')
    allPassed = false
  }

  // 5. Linting
  log('Running ESLint...', 'info')
  try {
    execCommand('npm run lint', true)
    log('Linting passed', 'success')
  } catch (error) {
    log('Linting errors detected', 'warning')
    // Don't fail on linting errors, just warn
  }

  // 6. Build Test
  log('Testing production build...', 'info')
  try {
    execCommand('npm run build', false)
    log('Build successful', 'success')
  } catch (error) {
    log('Build failed', 'error')
    allPassed = false
  }

  separator()
  if (allPassed) {
    log('ALL PRE-DEPLOY CHECKS PASSED ✓', 'success')
  } else {
    log('SOME CHECKS FAILED - DEPLOYMENT ABORTED ✗', 'error')
  }
  separator()

  return allPassed
}

// ============================================================================
// Health Checks
// ============================================================================

async function checkHealth(url: string): Promise<HealthCheckResult> {
  const startTime = Date.now()

  try {
    const response = await fetch(`${url}/api/health`, {
      method: 'GET',
      headers: { 'User-Agent': 'Deploy-Script/1.0' },
    })

    const latency = Date.now() - startTime
    const data = response.ok ? await response.json() : null

    return {
      healthy: response.ok && response.status === 200,
      status: response.status,
      latency,
      checks: data?.checks,
    }
  } catch (error) {
    return {
      healthy: false,
      status: 0,
      latency: Date.now() - startTime,
    }
  }
}

async function waitForHealthy(url: string): Promise<boolean> {
  const { timeout, retries, retryDelay } = CONFIG.healthcheck

  log(`Waiting for ${url} to become healthy...`, 'info')

  for (let i = 1; i <= retries; i++) {
    log(`Health check attempt ${i}/${retries}...`, 'info')

    const result = await checkHealth(url)

    if (result.healthy) {
      log(`Service healthy! (latency: ${result.latency}ms)`, 'success')
      if (result.checks) {
        log(`Database: ${result.checks.database?.status}`, 'info')
        log(`Memory: ${result.checks.memory?.percentage}%`, 'info')
      }
      return true
    }

    if (i < retries) {
      log(`Not healthy yet (status: ${result.status}), retrying...`, 'warning')
      await sleep(retryDelay)
    }
  }

  log('Service failed health checks', 'error')
  return false
}

// ============================================================================
// Deployment Functions
// ============================================================================

async function deployToVercel(env: Environment): Promise<DeployResult> {
  separator()
  log(`DEPLOYING TO ${env.toUpperCase()}`, 'info')
  separator()

  const config = CONFIG[env]

  // Check Vercel configuration
  if (!config.vercel.token) {
    return {
      success: false,
      message: 'Vercel token not configured',
      error: 'Set VERCEL_TOKEN environment variable',
    }
  }

  try {
    log('Deploying to Vercel...', 'info')

    // Build deploy command
    const prodFlag = env === 'production' ? '--prod' : ''
    const command = `vercel ${prodFlag} --token=${config.vercel.token} --yes`

    // Execute deployment
    const output = execCommand(command, false)

    // Extract deployment URL from output
    const urlMatch = output.match(/https:\/\/[^\s]+/)
    const deployUrl = urlMatch ? urlMatch[0] : config.url

    log(`Deployed to: ${deployUrl}`, 'success')

    return {
      success: true,
      message: 'Deployment successful',
      url: deployUrl,
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Deployment failed',
      error: error.message,
    }
  }
}

async function verifyDeployment(url: string): Promise<boolean> {
  separator()
  log('POST-DEPLOY VERIFICATION', 'info')
  separator()

  // 1. Health Check
  log('Checking service health...', 'info')
  const healthy = await waitForHealthy(url)
  if (!healthy) {
    log('Health check failed', 'error')
    return false
  }

  // 2. Homepage Check
  log('Checking homepage...', 'info')
  try {
    const response = await fetch(url)
    if (response.ok) {
      log('Homepage accessible', 'success')
    } else {
      log(`Homepage returned ${response.status}`, 'error')
      return false
    }
  } catch (error) {
    log('Homepage not accessible', 'error')
    return false
  }

  // 3. API Check
  log('Checking API endpoints...', 'info')
  try {
    const ogResponse = await fetch(`${url}/api/og?title=Test`)
    if (ogResponse.ok) {
      log('OG image API working', 'success')
    } else {
      log('OG image API not working', 'warning')
    }
  } catch (error) {
    log('API check failed', 'warning')
  }

  separator()
  log('DEPLOYMENT VERIFIED ✓', 'success')
  separator()

  return true
}

// ============================================================================
// Main Deployment Flow
// ============================================================================

async function deploy(env: Environment = 'production') {
  console.clear()

  separator()
  log('🚀 PRODUCTION DEPLOYMENT SCRIPT', 'info')
  log(`Environment: ${env.toUpperCase()}`, 'info')
  log(`Time: ${new Date().toISOString()}`, 'info')
  separator()

  // Step 1: Pre-deploy validation
  log('STEP 1: Pre-deploy validation', 'info')
  const validationPassed = await runPreDeployChecks()

  if (!validationPassed) {
    log('Validation failed. Fix errors and try again.', 'error')
    process.exit(1)
  }

  // Step 2: Confirm deployment
  if (process.env.CI !== 'true') {
    log('Ready to deploy. Continue? (Ctrl+C to cancel)', 'warning')
    await sleep(3000)
  }

  // Step 3: Deploy
  log('STEP 2: Deployment', 'info')
  const deployResult = await deployToVercel(env)

  if (!deployResult.success) {
    log(`Deployment failed: ${deployResult.error}`, 'error')
    process.exit(1)
  }

  // Step 4: Verify deployment
  log('STEP 3: Post-deploy verification', 'info')
  const verifySuccess = await verifyDeployment(deployResult.url!)

  if (!verifySuccess) {
    log('Verification failed!', 'error')
    log('Consider rolling back the deployment', 'warning')
    process.exit(1)
  }

  // Success!
  separator()
  log('🎉 DEPLOYMENT SUCCESSFUL!', 'success')
  log(`URL: ${deployResult.url}`, 'success')
  log(`Time: ${new Date().toISOString()}`, 'info')
  separator()

  // Post-deploy reminders
  log('Post-deploy checklist:', 'info')
  log('  [ ] Verify website in browser', 'info')
  log('  [ ] Check admin panel login', 'info')
  log('  [ ] Test contact form', 'info')
  log('  [ ] Verify UptimeRobot is monitoring', 'info')
  log('  [ ] Check error tracking (Sentry)', 'info')
  separator()
}

// ============================================================================
// Verify Only Mode
// ============================================================================

async function verifyOnly() {
  const url = process.env.NEXT_PUBLIC_SERVER_URL || process.env.PRODUCTION_URL

  if (!url) {
    log('No URL configured for verification', 'error')
    process.exit(1)
  }

  separator()
  log('DEPLOYMENT VERIFICATION', 'info')
  log(`URL: ${url}`, 'info')
  separator()

  const success = await verifyDeployment(url)

  if (success) {
    log('Verification passed ✓', 'success')
    process.exit(0)
  } else {
    log('Verification failed ✗', 'error')
    process.exit(1)
  }
}

// ============================================================================
// CLI
// ============================================================================

const args = process.argv.slice(2)
const command = args[0] || 'production'

async function main() {
  try {
    switch (command) {
      case 'production':
      case 'prod':
        await deploy('production')
        break

      case 'staging':
        await deploy('staging')
        break

      case 'verify':
        await verifyOnly()
        break

      default:
        console.log('Usage:')
        console.log('  npm run deploy              # Deploy to production')
        console.log('  npm run deploy:staging      # Deploy to staging')
        console.log('  npm run deploy:verify       # Verify deployment')
        process.exit(1)
    }
  } catch (error: any) {
    separator()
    log('DEPLOYMENT FAILED', 'error')
    log(error.message, 'error')
    separator()
    process.exit(1)
  }
}

// Run
main()
