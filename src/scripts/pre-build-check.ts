/**
 * Pre-Build Validation Script
 *
 * Runs before `npm run build` to catch issues early.
 * Prevents broken builds from being deployed.
 *
 * Checks:
 * 1. Environment variables validation
 * 2. TypeScript compilation check
 * 3. Critical file existence
 * 4. Import statement validation
 */

import 'dotenv/config'
import { execSync } from 'child_process'
import { existsSync } from 'fs'
import path from 'path'

type CheckResult = {
  passed: boolean
  message: string
  details?: string[]
}

const CRITICAL_FILES = [
  'src/app/(app)/layout.tsx',
  'src/app/(app)/page.tsx',
  'src/payload.config.ts',
  'next.config.js',
  'package.json',
]

const CRITICAL_ENV_VARS = [
  'PAYLOAD_SECRET',
  'DATABASE_URL',
  'NEXT_PUBLIC_SERVER_URL',
]

/**
 * Check 1: Environment Variables
 */
function checkEnvironment(): CheckResult {
  const missing: string[] = []

  for (const envVar of CRITICAL_ENV_VARS) {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  }

  if (missing.length > 0) {
    return {
      passed: false,
      message: '❌ Missing critical environment variables',
      details: missing.map(v => `  - ${v}`),
    }
  }

  // Check for dummy/test values in production
  if (process.env.NODE_ENV === 'production') {
    const warnings: string[] = []

    if (process.env.PAYLOAD_SECRET?.includes('dummy') ||
        process.env.PAYLOAD_SECRET?.includes('test')) {
      warnings.push('  - PAYLOAD_SECRET contains "dummy" or "test"')
    }

    if (process.env.DATABASE_URL?.includes('file:')) {
      warnings.push('  - DATABASE_URL is SQLite (use PostgreSQL for production)')
    }

    if (warnings.length > 0) {
      console.warn('⚠️  Warning: Production environment with test values:')
      warnings.forEach(w => console.warn(w))
    }
  }

  return {
    passed: true,
    message: '✅ Environment variables validated',
  }
}

/**
 * Check 2: TypeScript Compilation
 */
function checkTypeScript(): CheckResult {
  console.log('🔍 Running TypeScript compiler check...')

  try {
    execSync('npx tsc --noEmit --skipLibCheck', {
      stdio: 'pipe',
      encoding: 'utf-8',
    })

    return {
      passed: true,
      message: '✅ TypeScript compilation successful',
    }
  } catch (error: any) {
    const output = error.stdout || error.stderr || ''
    const lines = output.split('\n').filter((l: string) => l.trim())
    const errorLines = lines.slice(0, 10) // Show first 10 errors

    return {
      passed: false,
      message: '❌ TypeScript compilation errors',
      details: errorLines.length > 0 ? errorLines : ['See logs above for details'],
    }
  }
}

/**
 * Check 3: Critical Files Exist
 */
function checkCriticalFiles(): CheckResult {
  const missing: string[] = []

  for (const file of CRITICAL_FILES) {
    const fullPath = path.join(process.cwd(), file)
    if (!existsSync(fullPath)) {
      missing.push(file)
    }
  }

  if (missing.length > 0) {
    return {
      passed: false,
      message: '❌ Missing critical files',
      details: missing.map(f => `  - ${f}`),
    }
  }

  return {
    passed: true,
    message: '✅ All critical files present',
  }
}

/**
 * Check 4: ESLint Check (Quick)
 */
function checkESLint(): CheckResult {
  console.log('🔍 Running ESLint check...')

  try {
    execSync('npm run lint', {
      stdio: 'pipe',
      encoding: 'utf-8',
    })

    return {
      passed: true,
      message: '✅ ESLint check passed',
    }
  } catch (error: any) {
    const output = error.stdout || error.stderr || ''
    const lines = output.split('\n').filter((l: string) => l.trim() && !l.includes('npm'))
    const errorLines = lines.slice(0, 5) // Show first 5 errors

    return {
      passed: false,
      message: '❌ ESLint errors found',
      details: errorLines.length > 0 ? errorLines : ['Run `npm run lint` for details'],
    }
  }
}

/**
 * Check 5: Package.json Validation
 */
function checkPackageJson(): CheckResult {
  try {
    const pkgPath = path.join(process.cwd(), 'package.json')
    const pkg = require(pkgPath)

    const issues: string[] = []

    // Check required scripts
    const requiredScripts = ['build', 'dev', 'start', 'lint']
    for (const script of requiredScripts) {
      if (!pkg.scripts || !pkg.scripts[script]) {
        issues.push(`  - Missing script: ${script}`)
      }
    }

    // Check critical dependencies
    const requiredDeps = ['next', 'react', 'payload']
    for (const dep of requiredDeps) {
      if (!pkg.dependencies || !pkg.dependencies[dep]) {
        issues.push(`  - Missing dependency: ${dep}`)
      }
    }

    if (issues.length > 0) {
      return {
        passed: false,
        message: '❌ package.json validation failed',
        details: issues,
      }
    }

    return {
      passed: true,
      message: '✅ package.json validated',
    }
  } catch (error: any) {
    return {
      passed: false,
      message: '❌ Failed to read package.json',
      details: [error.message],
    }
  }
}

/**
 * Main Pre-Build Check
 */
async function runPreBuildChecks() {
  console.log('\n' + '='.repeat(80))
  console.log('🔍 PRE-BUILD VALIDATION')
  console.log('='.repeat(80) + '\n')

  const checks = [
    { name: 'Environment Variables', fn: checkEnvironment },
    { name: 'Critical Files', fn: checkCriticalFiles },
    { name: 'Package.json', fn: checkPackageJson },
    { name: 'ESLint', fn: checkESLint },
    { name: 'TypeScript', fn: checkTypeScript },
  ]

  const results: Array<{ name: string; result: CheckResult }> = []

  for (const check of checks) {
    console.log(`Running: ${check.name}...`)
    const result = check.fn()
    results.push({ name: check.name, result })

    console.log(result.message)
    if (result.details && result.details.length > 0) {
      result.details.forEach(d => console.log(d))
    }
    console.log()
  }

  // Summary
  console.log('='.repeat(80))
  console.log('SUMMARY')
  console.log('='.repeat(80) + '\n')

  const failed = results.filter(r => !r.result.passed)
  const passed = results.filter(r => r.result.passed)

  console.log(`✅ Passed: ${passed.length}/${results.length}`)
  console.log(`❌ Failed: ${failed.length}/${results.length}\n`)

  if (failed.length > 0) {
    console.log('Failed checks:')
    failed.forEach(f => {
      console.log(`  - ${f.name}`)
    })
    console.log()
  }

  console.log('='.repeat(80) + '\n')

  if (failed.length > 0) {
    console.error('❌ PRE-BUILD VALIDATION FAILED!')
    console.error('Fix the errors above before building.')
    console.error()
    process.exit(1)
  }

  console.log('✅ PRE-BUILD VALIDATION PASSED!')
  console.log('Proceeding with build...\n')
}

// Run checks
runPreBuildChecks().catch(error => {
  console.error('❌ Pre-build check failed:', error)
  process.exit(1)
})
