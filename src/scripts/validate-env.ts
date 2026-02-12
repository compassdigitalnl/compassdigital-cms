/**
 * Environment Variables Validation Script
 *
 * Validates that all required environment variables are properly configured.
 * Run before deployment to catch configuration issues early.
 *
 * Usage:
 * npm run validate-env
 * or
 * NODE_OPTIONS="--no-deprecation --import=tsx/esm" tsx src/scripts/validate-env.ts
 */

import 'dotenv/config'

type ValidationResult = {
  valid: boolean
  errors: string[]
  warnings: string[]
  info: string[]
}

type EnvCheck = {
  name: string
  required: boolean
  validate?: (value: string) => boolean | string
  description: string
}

const checks: EnvCheck[] = [
  // ============================================================================
  // CORE - REQUIRED
  // ============================================================================
  {
    name: 'PAYLOAD_SECRET',
    required: true,
    validate: (val) => val.length >= 32 || 'Should be at least 32 characters',
    description: 'Payload CMS secret key for encryption',
  },
  {
    name: 'DATABASE_URL',
    required: true,
    validate: (val) => {
      if (val.startsWith('file:')) {
        return 'Using SQLite (file-based). OK for development, but PostgreSQL is REQUIRED for production!'
      }
      if (!val.startsWith('postgresql://') && !val.startsWith('postgres://')) {
        return 'Must start with postgresql:// or postgres://'
      }
      return true
    },
    description: 'Database connection string',
  },
  {
    name: 'NEXT_PUBLIC_SERVER_URL',
    required: true,
    validate: (val) => {
      if (!val.startsWith('http://') && !val.startsWith('https://')) {
        return 'Must be a valid URL starting with http:// or https://'
      }
      if (val.endsWith('/')) {
        return 'Should not end with a trailing slash'
      }
      return true
    },
    description: 'Public server URL',
  },
  {
    name: 'PREVIEW_SECRET',
    required: true,
    validate: (val) => val.length >= 16 || 'Should be at least 16 characters',
    description: 'Secret for draft preview mode',
  },

  // ============================================================================
  // INTEGRATIONS - RECOMMENDED
  // ============================================================================
  {
    name: 'NEXT_PUBLIC_GA_ID',
    required: false,
    validate: (val) => val.startsWith('G-') || 'Should start with G- (e.g., G-XXXXXXXXXX)',
    description: 'Google Analytics 4 Measurement ID',
  },
  {
    name: 'NEXT_PUBLIC_SENTRY_DSN',
    required: false,
    validate: (val) =>
      val.startsWith('https://') && val.includes('ingest.sentry.io') ||
      'Should be a valid Sentry DSN URL',
    description: 'Sentry error tracking DSN',
  },
  {
    name: 'RESEND_API_KEY',
    required: false,
    validate: (val) => val.startsWith('re_') || 'Should start with re_',
    description: 'Resend email service API key',
  },
  {
    name: 'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
    required: false,
    description: 'reCAPTCHA v3 site key (public)',
  },
  {
    name: 'RECAPTCHA_SECRET_KEY',
    required: false,
    description: 'reCAPTCHA v3 secret key (private)',
  },

  // ============================================================================
  // AI CONFIGURATION
  // ============================================================================
  {
    name: 'OPENAI_API_KEY',
    required: false,
    validate: (val) => val.startsWith('sk-') || 'Should start with sk-',
    description: 'OpenAI API key for AI features',
  },

  // ============================================================================
  // REDIS
  // ============================================================================
  {
    name: 'REDIS_HOST',
    required: false,
    description: 'Redis host for caching',
  },
  {
    name: 'REDIS_PORT',
    required: false,
    validate: (val) => !isNaN(Number(val)) || 'Must be a valid port number',
    description: 'Redis port',
  },

  // ============================================================================
  // STRIPE (Optional)
  // ============================================================================
  {
    name: 'STRIPE_SECRET_KEY',
    required: false,
    validate: (val) => {
      if (val === 'sk_test_' || val === 'sk_live_') {
        return 'Incomplete Stripe key (just prefix, no actual key)'
      }
      if (!val.startsWith('sk_test_') && !val.startsWith('sk_live_')) {
        return 'Should start with sk_test_ or sk_live_'
      }
      return true
    },
    description: 'Stripe secret key for payments',
  },
]

function validateEnvironment(): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: [],
  }

  console.log('\n🔍 Validating environment variables...\n')

  for (const check of checks) {
    const value = process.env[check.name]

    // Check if required variable is missing
    if (check.required && !value) {
      result.valid = false
      result.errors.push(`❌ ${check.name} is REQUIRED but not set`)
      console.log(`❌ ${check.name}`)
      console.log(`   Required: YES`)
      console.log(`   Status: MISSING`)
      console.log(`   Description: ${check.description}`)
      console.log()
      continue
    }

    // If optional and not set, skip
    if (!check.required && !value) {
      result.info.push(`ℹ️  ${check.name} is not set (optional)`)
      console.log(`⚪ ${check.name}`)
      console.log(`   Required: NO`)
      console.log(`   Status: Not configured`)
      console.log(`   Description: ${check.description}`)
      console.log()
      continue
    }

    // Run custom validation if provided
    if (value && check.validate) {
      const validationResult = check.validate(value)

      if (validationResult === true) {
        result.info.push(`✅ ${check.name} is configured correctly`)
        console.log(`✅ ${check.name}`)
        console.log(`   Status: Valid`)
        console.log(`   Value: ${value.substring(0, 20)}${value.length > 20 ? '...' : ''}`)
        console.log()
      } else if (typeof validationResult === 'string') {
        // Validation returned a warning/error message
        const isError = check.required
        if (isError) {
          result.valid = false
          result.errors.push(`❌ ${check.name}: ${validationResult}`)
          console.log(`❌ ${check.name}`)
          console.log(`   Status: INVALID`)
          console.log(`   Error: ${validationResult}`)
        } else {
          result.warnings.push(`⚠️  ${check.name}: ${validationResult}`)
          console.log(`⚠️  ${check.name}`)
          console.log(`   Status: Warning`)
          console.log(`   Message: ${validationResult}`)
        }
        console.log(`   Value: ${value.substring(0, 20)}${value.length > 20 ? '...' : ''}`)
        console.log()
      }
    } else if (value) {
      result.info.push(`✅ ${check.name} is set`)
      console.log(`✅ ${check.name}`)
      console.log(`   Status: Configured`)
      console.log(`   Value: ${value.substring(0, 20)}${value.length > 20 ? '...' : ''}`)
      console.log()
    }
  }

  return result
}

function printSummary(result: ValidationResult) {
  console.log('\n' + '='.repeat(80))
  console.log('VALIDATION SUMMARY')
  console.log('='.repeat(80) + '\n')

  if (result.errors.length > 0) {
    console.log('❌ ERRORS:')
    result.errors.forEach((error) => console.log(`   ${error}`))
    console.log()
  }

  if (result.warnings.length > 0) {
    console.log('⚠️  WARNINGS:')
    result.warnings.forEach((warning) => console.log(`   ${warning}`))
    console.log()
  }

  console.log(`ℹ️  INFO: ${result.info.length} variables configured`)
  console.log()

  if (result.valid) {
    console.log('✅ VALIDATION PASSED!')
    console.log()
    console.log('All required environment variables are properly configured.')
    console.log('You can proceed with deployment.')
  } else {
    console.log('❌ VALIDATION FAILED!')
    console.log()
    console.log('Please fix the errors above before deploying to production.')
    console.log('See .env.example for configuration examples.')
  }

  console.log('\n' + '='.repeat(80) + '\n')
}

function printEnvironmentInfo() {
  console.log('\n📊 Environment Information:\n')
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`)
  console.log(`   Node Version: ${process.version}`)
  console.log(`   Platform: ${process.platform}`)
  console.log()
}

// Run validation
const result = validateEnvironment()
printEnvironmentInfo()
printSummary(result)

// Exit with error code if validation failed
if (!result.valid) {
  process.exit(1)
}
