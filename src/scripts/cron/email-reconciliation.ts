/**
 * Email Reconciliation Cron Job
 *
 * Runs reconciliation between Payload CMS and Listmonk
 * Detects and fixes data discrepancies automatically
 *
 * Usage:
 *   npx tsx src/scripts/cron/email-reconciliation.ts [--dry-run] [--tenant=TENANT_ID]
 *
 * Crontab:
 *   # Run every 15 minutes
 *   *!/15 * * * * cd /path/to/app && npx tsx src/scripts/cron/email-reconciliation.ts >> /var/log/email-reconciliation.log 2>&1
 *
 *   # Run daily at 3am
 *   0 3 * * * cd /path/to/app && npx tsx src/scripts/cron/email-reconciliation.ts >> /var/log/email-reconciliation.log 2>&1
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ReconciliationService } from '@/lib/email/reconciliation/ReconciliationService'
import { emailMarketingFeatures } from '@/lib/features'

async function main() {
  // Parse arguments
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const tenantArg = args.find((arg) => arg.startsWith('--tenant='))
  const tenantId = tenantArg ? tenantArg.split('=')[1] : null

  console.log('\n' + '═'.repeat(80))
  console.log('🔄 EMAIL RECONCILIATION CRON JOB')
  console.log('═'.repeat(80))
  console.log(`Started: ${new Date().toISOString()}`)
  console.log(`Mode: ${dryRun ? 'DRY RUN (no changes will be made)' : 'LIVE'}`)
  if (tenantId) {
    console.log(`Tenant: ${tenantId}`)
  } else {
    console.log('Tenant: ALL')
  }
  console.log('═'.repeat(80) + '\n')

  // Check feature flag
  if (!emailMarketingFeatures.isEnabled()) {
    console.log('⚠️  Email marketing feature is disabled. Exiting.')
    process.exit(0)
  }

  try {
    // Initialize Payload
    const payload = await getPayload({ config })

    // Create reconciliation service
    const reconciliationService = new ReconciliationService(payload, dryRun)

    // Run reconciliation
    let result
    if (tenantId) {
      result = await reconciliationService.reconcileTenant(tenantId)
    } else {
      result = await reconciliationService.reconcileAll()
    }

    // Check for errors
    if (result.errors.length > 0) {
      console.error('\n⚠️  Reconciliation completed with errors')
      process.exit(1)
    }

    // Check if any fixes were needed
    const totalFixes =
      result.fixes.subscribersCreated +
      result.fixes.subscribersUpdated +
      result.fixes.subscribersDeleted +
      result.fixes.listsCreated +
      result.fixes.listsUpdated +
      result.fixes.listsDeleted

    if (totalFixes > 0) {
      console.log('\n✅ Reconciliation completed successfully with fixes applied')
    } else {
      console.log('\n✅ Reconciliation completed - no discrepancies found')
    }

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Reconciliation failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}
