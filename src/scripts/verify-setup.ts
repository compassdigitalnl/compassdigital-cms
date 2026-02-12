#!/usr/bin/env node

/**
 * 🔍 Verify Setup Script
 *
 * Controleert of alle vereiste configuraties correct zijn ingesteld
 * voor productie deployment.
 *
 * Usage: npm run verify-setup
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
}

const log = {
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  header: (msg: string) =>
    console.log(
      `\n${colors.bright}${colors.blue}${'='.repeat(60)}${colors.reset}\n${colors.bright}  ${msg}${colors.reset}\n${colors.blue}${'='.repeat(60)}${colors.reset}\n`,
    ),
}

interface Check {
  name: string
  required: boolean
  validator: () => { pass: boolean; message?: string; value?: string }
}

function readEnvFile(): Map<string, string> {
  const envPath = join(process.cwd(), '.env')
  const env = new Map<string, string>()

  if (!existsSync(envPath)) {
    log.error('.env file not found!')
    return env
  }

  const content = readFileSync(envPath, 'utf-8')
  content.split('\n').forEach((line) => {
    line = line.trim()
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=')
      if (key) {
        env.set(key.trim(), valueParts.join('=').trim())
      }
    }
  })

  return env
}

function verifyPayloadSecret(env: Map<string, string>) {
  const secret = env.get('PAYLOAD_SECRET')
  if (!secret) {
    return { pass: false, message: 'Not set' }
  }
  if (secret.length < 32) {
    return { pass: false, message: `Too short (${secret.length} chars, need 32+)` }
  }
  return { pass: true, message: `${secret.substring(0, 10)}... (${secret.length} chars)` }
}

function verifyDatabaseUrl(env: Map<string, string>) {
  const url = env.get('DATABASE_URL')
  if (!url) {
    return { pass: false, message: 'Not set' }
  }
  if (url.includes('payload.db')) {
    return {
      pass: false,
      message: 'Using SQLite (OK for dev, use PostgreSQL for production)',
    }
  }
  if (!url.startsWith('postgres')) {
    return { pass: false, message: 'Invalid format (must start with postgres://)' }
  }
  return { pass: true, message: `${url.substring(0, 30)}...` }
}

function verifyServerUrl(env: Map<string, string>) {
  const url = env.get('NEXT_PUBLIC_SERVER_URL')
  if (!url) {
    return { pass: false, message: 'Not set' }
  }
  if (url.includes('localhost')) {
    return { pass: false, message: 'Still pointing to localhost (use production URL)' }
  }
  if (!url.startsWith('http')) {
    return { pass: false, message: 'Invalid URL format' }
  }
  return { pass: true, value: url }
}

function verifySiteName(env: Map<string, string>) {
  const name = env.get('SITE_NAME')
  if (!name) {
    return { pass: false, message: 'Not set' }
  }
  return { pass: true, value: name }
}

function verifyGoogleAnalytics(env: Map<string, string>) {
  const gaId = env.get('NEXT_PUBLIC_GA_ID')
  if (!gaId || gaId === '') {
    return { pass: false, message: 'Not configured' }
  }
  if (!gaId.startsWith('G-')) {
    return { pass: false, message: 'Invalid format (should start with G-)' }
  }
  return { pass: true, value: gaId }
}

function verifySentry(env: Map<string, string>) {
  const dsn = env.get('NEXT_PUBLIC_SENTRY_DSN')
  if (!dsn || dsn === '') {
    return { pass: false, message: 'Not configured' }
  }
  if (!dsn.startsWith('http')) {
    return { pass: false, message: 'Invalid DSN format' }
  }
  return { pass: true, message: 'Configured' }
}

function verifyRecaptcha(env: Map<string, string>) {
  const siteKey = env.get('NEXT_PUBLIC_RECAPTCHA_SITE_KEY')
  const secretKey = env.get('RECAPTCHA_SECRET_KEY')

  if (!siteKey || !secretKey) {
    return { pass: false, message: 'Not configured' }
  }

  if (siteKey.includes('test') || secretKey.includes('test')) {
    return {
      pass: false,
      message: 'Using test keys (replace with production keys from Google reCAPTCHA)',
    }
  }

  return { pass: true, message: 'Production keys configured' }
}

function verifyResend(env: Map<string, string>) {
  const apiKey = env.get('RESEND_API_KEY')
  if (!apiKey || apiKey === '') {
    return { pass: false, message: 'Not configured (email notifications disabled)' }
  }
  if (!apiKey.startsWith('re_')) {
    return { pass: false, message: 'Invalid API key format' }
  }
  return { pass: true, message: 'Configured' }
}

function verifyOpenAI(env: Map<string, string>) {
  const apiKey = env.get('OPENAI_API_KEY')
  if (!apiKey || apiKey === '') {
    return { pass: false, message: 'Not configured (AI features disabled)' }
  }
  if (!apiKey.startsWith('sk-')) {
    return { pass: false, message: 'Invalid API key format' }
  }
  return { pass: true, message: `${apiKey.substring(0, 10)}...` }
}

function verifyFiles() {
  const requiredFiles = [
    { name: 'package.json', path: 'package.json' },
    { name: 'next.config', path: ['next.config.ts', 'next.config.mjs', 'next.config.js'] },
    { name: 'payload.config', path: ['payload.config.ts', 'src/payload.config.ts'] },
    { name: 'tsconfig.json', path: 'tsconfig.json' },
    { name: '.env', path: '.env' },
  ]

  const results: { file: string; exists: boolean }[] = []

  requiredFiles.forEach((file) => {
    const paths = Array.isArray(file.path) ? file.path : [file.path]
    const exists = paths.some((p) => existsSync(join(process.cwd(), p)))
    results.push({ file: file.name, exists })
  })

  return results
}

async function main() {
  console.clear()
  log.header('🔍 SETUP VERIFICATION')

  const env = readEnvFile()

  if (env.size === 0) {
    log.error('Failed to read .env file!')
    log.info('Run: npm run setup')
    process.exit(1)
  }

  // File checks
  log.header('📁 FILE CHECKS')
  const files = verifyFiles()
  let filesPass = true
  files.forEach(({ file, exists }) => {
    if (exists) {
      log.success(`${file} - Found`)
    } else {
      log.error(`${file} - Missing!`)
      filesPass = false
    }
  })

  // Required checks
  log.header('✅ REQUIRED CONFIGURATION')

  const requiredChecks: Check[] = [
    { name: 'PAYLOAD_SECRET', required: true, validator: () => verifyPayloadSecret(env) },
    { name: 'DATABASE_URL', required: true, validator: () => verifyDatabaseUrl(env) },
    {
      name: 'NEXT_PUBLIC_SERVER_URL',
      required: true,
      validator: () => verifyServerUrl(env),
    },
    { name: 'SITE_NAME', required: true, validator: () => verifySiteName(env) },
  ]

  let requiredPass = 0
  let requiredFail = 0

  requiredChecks.forEach((check) => {
    const result = check.validator()
    if (result.pass) {
      log.success(
        `${check.name} - ${result.value || result.message || 'OK'}`,
      )
      requiredPass++
    } else {
      log.error(`${check.name} - ${result.message || 'FAILED'}`)
      requiredFail++
    }
  })

  // Optional checks
  log.header('⚙️  OPTIONAL CONFIGURATION')

  const optionalChecks: Check[] = [
    { name: 'Google Analytics', required: false, validator: () => verifyGoogleAnalytics(env) },
    { name: 'Sentry Error Tracking', required: false, validator: () => verifySentry(env) },
    { name: 'reCAPTCHA (Production)', required: false, validator: () => verifyRecaptcha(env) },
    { name: 'Resend Email', required: false, validator: () => verifyResend(env) },
    { name: 'OpenAI API', required: false, validator: () => verifyOpenAI(env) },
  ]

  let optionalPass = 0
  let optionalSkip = 0

  optionalChecks.forEach((check) => {
    const result = check.validator()
    if (result.pass) {
      log.success(`${check.name} - ${result.value || result.message || 'OK'}`)
      optionalPass++
    } else {
      log.warning(`${check.name} - ${result.message || 'Not configured'}`)
      optionalSkip++
    }
  })

  // Summary
  log.header('📊 SUMMARY')

  const totalRequired = requiredChecks.length
  const totalOptional = optionalChecks.length
  const requiredPercentage = Math.round((requiredPass / totalRequired) * 100)
  const optionalPercentage = Math.round((optionalPass / totalOptional) * 100)

  console.log(`${colors.bright}Files:${colors.reset}`)
  console.log(`  ${filesPass ? colors.green + '✓' : colors.red + '✗'} ${files.filter((f) => f.exists).length}/${files.length} files found${colors.reset}`)

  console.log(`\n${colors.bright}Required Configuration:${colors.reset}`)
  console.log(`  ${requiredFail === 0 ? colors.green + '✓' : colors.red + '✗'} ${requiredPass}/${totalRequired} checks passed (${requiredPercentage}%)${colors.reset}`)

  console.log(`\n${colors.bright}Optional Configuration:${colors.reset}`)
  console.log(`  ${colors.yellow}○${colors.reset} ${optionalPass}/${totalOptional} configured (${optionalPercentage}%)`)

  // Status
  console.log(`\n${colors.bright}Overall Status:${colors.reset}`)
  if (requiredFail === 0 && filesPass) {
    log.success('✅ PRODUCTION READY!')
    console.log(`\n${colors.bright}Next steps:${colors.reset}`)
    console.log(`  1. Run build:      ${colors.cyan}npm run build${colors.reset}`)
    console.log(`  2. Run tests:      ${colors.cyan}npm run test${colors.reset}`)
    console.log(`  3. Deploy:         ${colors.cyan}npm run deploy${colors.reset}`)
  } else {
    log.error('❌ NOT READY - Fix required items above')
    console.log(`\n${colors.bright}Fix issues:${colors.reset}`)
    console.log(`  Run setup wizard:  ${colors.cyan}npm run setup${colors.reset}`)
    process.exit(1)
  }

  if (optionalSkip > 0) {
    console.log(`\n${colors.yellow}Note:${colors.reset} ${optionalSkip} optional features not configured`)
    console.log(`Run ${colors.cyan}npm run setup${colors.reset} to enable them`)
  }
}

main().catch((error) => {
  log.error(`Verification failed: ${error.message}`)
  process.exit(1)
})
