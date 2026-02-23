#!/usr/bin/env tsx
/**
 * CLI Script: Seed Tenant
 *
 * Seeds demo content for a specific tenant configuration
 *
 * Usage:
 * ```bash
 * # Basic usage
 * npx tsx scripts/seed-tenant.ts \
 *   --template=construction \
 *   --company="Bouwbedrijf XYZ" \
 *   --domain=bouwbedrijf-xyz.nl
 *
 * # With features
 * npx tsx scripts/seed-tenant.ts \
 *   --template=construction \
 *   --company="Bouwbedrijf XYZ" \
 *   --domain=bouwbedrijf-xyz.nl \
 *   --features='{"construction":true,"blog":true,"faq":true}'
 *
 * # Publish immediately (not draft)
 * npx tsx scripts/seed-tenant.ts \
 *   --template=construction \
 *   --company="Bouwbedrijf XYZ" \
 *   --domain=bouwbedrijf-xyz.nl \
 *   --publish
 * ```
 *
 * Environment Variables Required:
 * - DATABASE_URL: PostgreSQL connection string
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'
import { seedTenant, type SeedOptions } from '../src/endpoints/seed/seedOrchestrator'

// Parse command line arguments
function parseArgs(args: string[]): Record<string, string> {
  const result: Record<string, string> = {}

  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=')
      result[key] = value || 'true'
    }
  }

  return result
}

async function main() {
  console.log('🌱 Seed Tenant CLI')
  console.log('==================\n')

  // Parse arguments
  const args = parseArgs(process.argv.slice(2))

  // Validate required arguments
  if (!args.template) {
    console.error('❌ Error: --template is required')
    console.log('\nValid templates:')
    console.log('  - ecommerce')
    console.log('  - construction')
    console.log('  - beauty')
    console.log('  - horeca')
    console.log('  - hospitality')
    console.log('  - blog')
    console.log('  - corporate')
    process.exit(1)
  }

  if (!args.company) {
    console.error('❌ Error: --company is required')
    process.exit(1)
  }

  if (!args.domain) {
    console.error('❌ Error: --domain is required')
    process.exit(1)
  }

  // Parse features
  let features: Record<string, boolean> = {}
  if (args.features) {
    try {
      features = JSON.parse(args.features)
    } catch (error) {
      console.error('❌ Error: --features must be valid JSON')
      console.error('   Example: \'{"construction":true,"blog":true}\'')
      process.exit(1)
    }
  } else {
    // Default features based on template
    switch (args.template) {
      case 'construction':
        features = { construction: true }
        break
      case 'beauty':
        features = { beauty: true }
        break
      case 'horeca':
        features = { horeca: true }
        break
      case 'hospitality':
        features = { hospitality: true }
        break
      case 'ecommerce':
        features = { shop: true, products: true }
        break
      case 'blog':
        features = { blog: true }
        break
      default:
        features = {}
    }
  }

  // Check database connection
  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is required')
    console.error('\nExample:')
    console.error('  DATABASE_URL=postgresql://user:pass@host:5432/db npx tsx scripts/seed-tenant.ts ...')
    process.exit(1)
  }

  // Build options
  const options: SeedOptions = {
    template: args.template as SeedOptions['template'],
    features,
    companyName: args.company,
    domain: args.domain,
    draftOnly: args.publish !== 'true',
  }

  console.log('Configuration:')
  console.log('  Template:', options.template)
  console.log('  Company:', options.companyName)
  console.log('  Domain:', options.domain)
  console.log('  Features:', Object.keys(features).filter(k => features[k]).join(', ') || 'none')
  console.log('  Status:', options.draftOnly ? 'draft' : 'published')
  console.log('')

  try {
    // Initialize Payload
    console.log('📦 Initializing Payload...')
    const payload = await getPayload({ config })
    console.log('✓ Payload initialized\n')

    // Execute seeding
    console.log('🌱 Starting seeding process...\n')
    const result = await seedTenant(payload, options)

    // Show results
    console.log('\n' + '='.repeat(50))
    if (result.success) {
      console.log('✅ Seeding completed successfully!')
      console.log('')
      console.log('Summary:')
      console.log(`  Collections: ${Object.keys(result.seeded.collections).length}`)
      console.log(`  Globals: ${result.seeded.globals.length}`)
      console.log(`  Duration: ${(result.duration / 1000).toFixed(2)}s`)
      console.log('')
      console.log('Details:')
      Object.entries(result.seeded.collections).forEach(([collection, count]) => {
        console.log(`  - ${collection}: ${count} items`)
      })
      if (result.seeded.globals.length > 0) {
        console.log(`  - Globals: ${result.seeded.globals.join(', ')}`)
      }
    } else {
      console.log('❌ Seeding failed!')
      console.log('')
      console.log('Errors:')
      result.errors.forEach(error => {
        console.log(`  - ${error.type} "${error.name}": ${error.error}`)
      })
      process.exit(1)
    }
    console.log('='.repeat(50))

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run
main().catch((error) => {
  console.error('Unhandled error:', error)
  process.exit(1)
})
