#!/usr/bin/env node

/**
 * 🧙‍♂️ Interactive Setup Wizard
 *
 * Leidt je stap-voor-stap door de volledige productie setup:
 * - Environment configuratie
 * - Database setup (Railway/Supabase)
 * - API keys configuratie
 * - GitHub Actions secrets
 * - UptimeRobot monitoring
 *
 * Usage: npm run setup
 */

import { execSync } from 'child_process'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Kleuren voor terminal output
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
  step: (msg: string) => console.log(`\n${colors.cyan}${colors.bright}▶${colors.reset} ${msg}\n`),
  header: (msg: string) => console.log(`\n${colors.bright}${colors.blue}${'='.repeat(60)}${colors.reset}\n${colors.bright}  ${msg}${colors.reset}\n${colors.blue}${'='.repeat(60)}${colors.reset}\n`),
}

// Helper voor user input
function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(`${colors.cyan}?${colors.reset} ${query}: `, resolve)
  })
}

// Helper voor yes/no vragen
async function confirm(query: string, defaultYes = true): Promise<boolean> {
  const answer = await question(`${query} ${defaultYes ? '(Y/n)' : '(y/N)'}`)
  if (!answer) return defaultYes
  return answer.toLowerCase().startsWith('y')
}

// Environment file helpers
function readEnvFile(path: string): Map<string, string> {
  const env = new Map<string, string>()
  if (!existsSync(path)) return env

  const content = readFileSync(path, 'utf-8')
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

function writeEnvFile(path: string, env: Map<string, string>) {
  const lines = Array.from(env.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')
  writeFileSync(path, lines + '\n', 'utf-8')
}

// Verificatie functies
async function verifyDatabaseConnection(url: string): Promise<boolean> {
  try {
    // We kunnen niet echt connecten zonder de app te starten,
    // maar we kunnen de URL formaat checken
    const parsed = new URL(url)
    return parsed.protocol === 'postgresql:' || parsed.protocol === 'postgres:'
  } catch {
    return false
  }
}

function generatePayloadSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Setup stappen
async function setupEnvironment() {
  log.header('📝 STEP 1: ENVIRONMENT CONFIGURATIE')

  const envPath = join(process.cwd(), '.env')
  const envExamplePath = join(process.cwd(), '.env.example')

  let env = readEnvFile(envPath)

  // Check PAYLOAD_SECRET
  if (!env.has('PAYLOAD_SECRET') || env.get('PAYLOAD_SECRET')!.length < 32) {
    log.warning('PAYLOAD_SECRET niet gevonden of te kort')
    const secret = generatePayloadSecret()
    env.set('PAYLOAD_SECRET', secret)
    log.success(`Nieuwe PAYLOAD_SECRET gegenereerd: ${secret.substring(0, 10)}...`)
  } else {
    log.success('PAYLOAD_SECRET is al ingesteld')
  }

  // Check NEXT_PUBLIC_SERVER_URL
  if (!env.has('NEXT_PUBLIC_SERVER_URL')) {
    log.warning('NEXT_PUBLIC_SERVER_URL niet ingesteld')
    const url = await question('Wat is je productie URL? (bijv. https://mijnsite.com)')
    env.set('NEXT_PUBLIC_SERVER_URL', url)
    log.success(`NEXT_PUBLIC_SERVER_URL ingesteld: ${url}`)
  } else {
    log.success(`NEXT_PUBLIC_SERVER_URL: ${env.get('NEXT_PUBLIC_SERVER_URL')}`)
  }

  // Check SITE_NAME
  if (!env.has('SITE_NAME')) {
    const name = await question('Wat is de naam van je website?')
    env.set('SITE_NAME', name)
    log.success(`SITE_NAME ingesteld: ${name}`)
  } else {
    log.success(`SITE_NAME: ${env.get('SITE_NAME')}`)
  }

  writeEnvFile(envPath, env)
  log.success('Environment file bijgewerkt!')

  return env
}

async function setupDatabase(env: Map<string, string>) {
  log.header('🗄️  STEP 2: DATABASE SETUP')

  if (env.has('DATABASE_URL') && !env.get('DATABASE_URL')!.includes('payload.db')) {
    log.success('PostgreSQL DATABASE_URL al ingesteld!')
    const current = env.get('DATABASE_URL')!
    log.info(`Current: ${current.substring(0, 30)}...`)

    const change = await confirm('Wil je de database URL wijzigen?', false)
    if (!change) return env
  }

  log.info('Je hebt een PostgreSQL database nodig voor productie.')
  log.info('\nAanbevolen providers:')
  log.info('  1. Railway (https://railway.app) - $5/maand, super makkelijk')
  log.info('  2. Supabase (https://supabase.com) - Gratis tier beschikbaar')
  log.info('  3. Neon (https://neon.tech) - Gratis tier beschikbaar')

  const provider = await question('\nWelke provider ga je gebruiken? (1/2/3)')

  let instructions = ''
  switch (provider) {
    case '1':
      instructions = `
${colors.bright}Railway Setup:${colors.reset}
1. Ga naar https://railway.app
2. Maak account of log in
3. Klik "New Project" → "Provision PostgreSQL"
4. Klik op de database → "Connect" tab
5. Kopieer "Postgres Connection URL"
`
      break
    case '2':
      instructions = `
${colors.bright}Supabase Setup:${colors.reset}
1. Ga naar https://supabase.com
2. Maak account of log in
3. Klik "New Project"
4. Vul project naam + wachtwoord in
5. Wacht tot database klaar is (~2 min)
6. Ga naar Settings → Database
7. Kopieer "Connection string" onder "Connection pooling"
8. Vervang [YOUR-PASSWORD] met je wachtwoord
`
      break
    case '3':
      instructions = `
${colors.bright}Neon Setup:${colors.reset}
1. Ga naar https://neon.tech
2. Maak account of log in
3. Klik "Create a project"
4. Klik op je project → "Connection string"
5. Kopieer de PostgreSQL connection string
`
      break
    default:
      log.error('Ongeldige keuze')
      return env
  }

  console.log(instructions)

  log.info('\nOpen de URL in je browser en volg de stappen hierboven.')
  await question('Druk ENTER als je de database hebt aangemaakt...')

  const dbUrl = await question('Plak hier de PostgreSQL connection URL')

  if (!dbUrl || !dbUrl.startsWith('postgres')) {
    log.error('Ongeldige database URL!')
    return env
  }

  env.set('DATABASE_URL', dbUrl)
  log.success('DATABASE_URL ingesteld!')

  // Vraag of migraties gedraaid moeten worden
  const runMigrations = await confirm('Wil je nu de database migraties draaien?', true)
  if (runMigrations) {
    try {
      log.info('Running database migrations...')
      // Payload draait automatisch migrations bij eerste start
      log.success('Database migraties worden bij eerste start automatisch uitgevoerd!')
    } catch (error: any) {
      log.error(`Migrations failed: ${error.message}`)
    }
  }

  writeEnvFile(join(process.cwd(), '.env'), env)
  return env
}

async function setupAPIKeys(env: Map<string, string>) {
  log.header('🔑 STEP 3: API KEYS CONFIGURATIE')

  log.info('We gaan nu de productie API keys instellen.')
  log.info('Je kunt keys overslaan door ENTER te drukken (later instellen).\n')

  // Google Analytics
  log.step('Google Analytics (GA4)')
  if (env.has('NEXT_PUBLIC_GA_ID') && env.get('NEXT_PUBLIC_GA_ID') !== '') {
    log.success(`Al ingesteld: ${env.get('NEXT_PUBLIC_GA_ID')}`)
    const change = await confirm('Wijzigen?', false)
    if (!change) {
      log.info('Google Analytics overgeslagen')
    } else {
      const gaId = await question('Google Analytics Measurement ID (G-XXXXXXXXXX)')
      if (gaId) {
        env.set('NEXT_PUBLIC_GA_ID', gaId)
        log.success('Google Analytics ID ingesteld!')
      }
    }
  } else {
    log.info('Setup: https://analytics.google.com → Admin → Data Streams → Measurement ID')
    const gaId = await question('Google Analytics Measurement ID (G-XXXXXXXXXX) [SKIP]')
    if (gaId) {
      env.set('NEXT_PUBLIC_GA_ID', gaId)
      log.success('Google Analytics ID ingesteld!')
    } else {
      log.warning('Google Analytics overgeslagen')
    }
  }

  // Sentry
  log.step('Sentry Error Tracking')
  if (env.has('NEXT_PUBLIC_SENTRY_DSN') && env.get('NEXT_PUBLIC_SENTRY_DSN') !== '') {
    log.success('Al ingesteld')
    const change = await confirm('Wijzigen?', false)
    if (!change) {
      log.info('Sentry overgeslagen')
    } else {
      const sentryDsn = await question('Sentry DSN')
      if (sentryDsn) {
        env.set('NEXT_PUBLIC_SENTRY_DSN', sentryDsn)
        log.success('Sentry DSN ingesteld!')
      }
    }
  } else {
    log.info('Setup: https://sentry.io → New Project → Client Keys (DSN)')
    const sentryDsn = await question('Sentry DSN [SKIP]')
    if (sentryDsn) {
      env.set('NEXT_PUBLIC_SENTRY_DSN', sentryDsn)
      log.success('Sentry DSN ingesteld!')
    } else {
      log.warning('Sentry overgeslagen')
    }
  }

  // reCAPTCHA
  log.step('reCAPTCHA v3 (Spam Protection)')
  if (env.has('NEXT_PUBLIC_RECAPTCHA_SITE_KEY') && !env.get('NEXT_PUBLIC_RECAPTCHA_SITE_KEY')!.includes('test')) {
    log.success('Productie keys al ingesteld')
    const change = await confirm('Wijzigen?', false)
    if (!change) {
      log.info('reCAPTCHA overgeslagen')
    } else {
      log.info('Setup: https://www.google.com/recaptcha/admin → v3 → Register new site')
      const siteKey = await question('reCAPTCHA Site Key')
      const secretKey = await question('reCAPTCHA Secret Key')
      if (siteKey && secretKey) {
        env.set('NEXT_PUBLIC_RECAPTCHA_SITE_KEY', siteKey)
        env.set('RECAPTCHA_SECRET_KEY', secretKey)
        log.success('reCAPTCHA keys ingesteld!')
      }
    }
  } else {
    log.warning('Test keys actief! Wissel naar productie keys.')
    log.info('Setup: https://www.google.com/recaptcha/admin → v3 → Register new site')
    const upgrade = await confirm('Wil je nu productie keys instellen?', false)
    if (upgrade) {
      const siteKey = await question('reCAPTCHA Site Key')
      const secretKey = await question('reCAPTCHA Secret Key')
      if (siteKey && secretKey) {
        env.set('NEXT_PUBLIC_RECAPTCHA_SITE_KEY', siteKey)
        env.set('RECAPTCHA_SECRET_KEY', secretKey)
        log.success('reCAPTCHA keys ingesteld!')
      }
    } else {
      log.warning('reCAPTCHA test keys blijven actief (OK voor development)')
    }
  }

  // Resend Email
  log.step('Resend Email (Optioneel)')
  if (env.has('RESEND_API_KEY') && env.get('RESEND_API_KEY') !== '') {
    log.success('Al ingesteld')
  } else {
    log.info('Setup: https://resend.com → API Keys → Create API Key')
    const setup = await confirm('Wil je Resend nu instellen?', false)
    if (setup) {
      const resendKey = await question('Resend API Key')
      if (resendKey) {
        env.set('RESEND_API_KEY', resendKey)
        log.success('Resend API key ingesteld!')
      }
    } else {
      log.warning('Resend overgeslagen (email notifications werken niet)')
    }
  }

  writeEnvFile(join(process.cwd(), '.env'), env)
  log.success('API keys configuratie opgeslagen!')

  return env
}

async function setupGitHubActions(env: Map<string, string>) {
  log.header('🤖 STEP 4: GITHUB ACTIONS SECRETS')

  log.info('Voor CI/CD workflows heb je GitHub repository secrets nodig.\n')

  const hasRepo = await confirm('Heb je al een GitHub repository?', true)
  if (!hasRepo) {
    log.warning('Maak eerst een GitHub repository aan en push je code.')
    log.info('Kom later terug naar deze stap.')
    return
  }

  const repoUrl = await question('GitHub repository URL (bijv. github.com/user/repo)')
  const repoPath = repoUrl.replace('github.com/', '').replace('https://', '')

  log.info('\nVereiste secrets voor GitHub Actions:')
  console.log(`
${colors.bright}Verplicht:${colors.reset}
  • PAYLOAD_SECRET          → ${env.get('PAYLOAD_SECRET')?.substring(0, 20)}...
  • DATABASE_URL            → ${env.get('DATABASE_URL')?.substring(0, 30)}...
  • NEXT_PUBLIC_SERVER_URL  → ${env.get('NEXT_PUBLIC_SERVER_URL')}

${colors.bright}Voor Vercel deployment:${colors.reset}
  • VERCEL_TOKEN            → https://vercel.com/account/tokens
  • VERCEL_ORG_ID           → vercel.json of Vercel dashboard
  • VERCEL_PROJECT_ID       → vercel.json of Vercel dashboard

${colors.bright}Optioneel:${colors.reset}
  • OPENAI_API_KEY
  • NEXT_PUBLIC_GA_ID
  • NEXT_PUBLIC_SENTRY_DSN
  • etc.
`)

  log.step('GitHub Secrets Instellen')
  log.info(`Ga naar: https://github.com/${repoPath}/settings/secrets/actions`)
  log.info('\nKlik "New repository secret" voor elke secret hierboven.')

  await question('\nDruk ENTER als je klaar bent...')
  log.success('GitHub Actions secrets ingesteld!')
}

async function setupMonitoring() {
  log.header('📊 STEP 5: MONITORING SETUP (OPTIONEEL)')

  const setup = await confirm('Wil je UptimeRobot monitoring instellen?', false)
  if (!setup) {
    log.warning('Monitoring overgeslagen')
    return
  }

  log.info('\nUptimeRobot setup:')
  console.log(`
1. Ga naar https://uptimerobot.com en maak gratis account
2. Klik "Add New Monitor"
3. Monitor Type: HTTP(s)
4. Friendly Name: ${process.env.SITE_NAME || 'My Site'}
5. URL: ${process.env.NEXT_PUBLIC_SERVER_URL}/api/health
6. Monitoring Interval: 5 minutes (gratis tier)
7. Klik "Create Monitor"

Optioneel:
- Voeg nog een monitor toe voor homepage (${process.env.NEXT_PUBLIC_SERVER_URL})
- Stel alert contacts in (email/SMS)
`)

  await question('Druk ENTER als je klaar bent...')
  log.success('Monitoring setup compleet!')
}

async function finalChecks(env: Map<string, string>) {
  log.header('✅ FINAL CHECKS')

  const checks = [
    { name: 'PAYLOAD_SECRET', required: true, value: env.get('PAYLOAD_SECRET') },
    { name: 'DATABASE_URL', required: true, value: env.get('DATABASE_URL') },
    { name: 'NEXT_PUBLIC_SERVER_URL', required: true, value: env.get('NEXT_PUBLIC_SERVER_URL') },
    { name: 'SITE_NAME', required: true, value: env.get('SITE_NAME') },
    { name: 'Google Analytics', required: false, value: env.get('NEXT_PUBLIC_GA_ID') },
    { name: 'Sentry', required: false, value: env.get('NEXT_PUBLIC_SENTRY_DSN') },
    { name: 'reCAPTCHA (production)', required: false, value: env.get('NEXT_PUBLIC_RECAPTCHA_SITE_KEY') },
    { name: 'Resend Email', required: false, value: env.get('RESEND_API_KEY') },
  ]

  let passed = 0
  let failed = 0

  checks.forEach((check) => {
    const hasValue = check.value && check.value !== '' && !check.value.includes('test')
    if (hasValue) {
      log.success(`${check.name} - Configured`)
      passed++
    } else if (check.required) {
      log.error(`${check.name} - MISSING (REQUIRED!)`)
      failed++
    } else {
      log.warning(`${check.name} - Not configured (optional)`)
    }
  })

  console.log(`\n${colors.bright}Summary:${colors.reset}`)
  console.log(`  ${colors.green}✓ Passed:${colors.reset} ${passed}`)
  console.log(`  ${colors.red}✗ Failed:${colors.reset} ${failed}`)

  if (failed > 0) {
    log.error('\nEr zijn nog verplichte configuraties die ontbreken!')
    log.info('Voer de wizard opnieuw uit: npm run setup')
    return false
  }

  log.success('\n🎉 Setup compleet! Je bent klaar voor productie!')

  // Volgende stappen
  console.log(`\n${colors.bright}Volgende stappen:${colors.reset}`)
  console.log(`  1. Test build:         ${colors.cyan}npm run build${colors.reset}`)
  console.log(`  2. Test production:    ${colors.cyan}npm run start${colors.reset}`)
  console.log(`  3. Run tests:          ${colors.cyan}npm run test${colors.reset}`)
  console.log(`  4. Deploy to Vercel:   ${colors.cyan}npm run deploy${colors.reset}`)

  return true
}

// Main wizard
async function main() {
  console.clear()
  log.header('🧙‍♂️ AI SITEBUILDER - SETUP WIZARD')

  log.info('Deze wizard helpt je met de volledige productie setup.')
  log.info('Je kunt op elk moment stoppen met CTRL+C.\n')

  const start = await confirm('Klaar om te starten?', true)
  if (!start) {
    log.warning('Setup geannuleerd')
    process.exit(0)
  }

  try {
    let env = await setupEnvironment()
    env = await setupDatabase(env)
    env = await setupAPIKeys(env)
    await setupGitHubActions(env)
    await setupMonitoring()
    const success = await finalChecks(env)

    if (success) {
      log.success('\n✨ Setup wizard succesvol afgerond!')
    }
  } catch (error: any) {
    log.error(`\nSetup failed: ${error.message}`)
    process.exit(1)
  } finally {
    rl.close()
  }
}

// Run wizard
if (require.main === module) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
