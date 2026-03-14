/**
 * Worker Manager
 * Starts all BullMQ workers
 * Run this in a separate process: node dist/lib/queue/workers/index.js
 */

import { contentAnalysisWorker } from './contentAnalysisWorker'
import { emailMarketingWorker } from './emailMarketingWorker'
import { automationWorker } from './automationWorker'
import { flowWorker } from './flowWorker'
import { reconciliationWorker } from './reconciliationWorker'
import { emailMarketingFeatures, multistoreFeatures } from '@/lib/tenant/features'

const workers: any[] = []

console.log('🚀 Starting all workers...')

// Always start content analysis worker
workers.push(contentAnalysisWorker)
console.log('✅ Content Analysis Worker: Running')

// Start email marketing workers if feature is enabled
if (emailMarketingFeatures.campaigns()) {
  workers.push(emailMarketingWorker)
  workers.push(automationWorker)
  workers.push(flowWorker)
  workers.push(reconciliationWorker)
  console.log('✅ Email Marketing Worker: Running')
  console.log('✅ Automation Worker: Running')
  console.log('✅ Flow Worker: Running')
  console.log('✅ Reconciliation Worker: Running')
} else {
  console.log('⏸️  Email Marketing Worker: Disabled (feature flag off)')
  console.log('⏸️  Automation Worker: Disabled (feature flag off)')
  console.log('⏸️  Flow Worker: Disabled (feature flag off)')
  console.log('⏸️  Reconciliation Worker: Disabled (feature flag off)')
}

// Start multistore workers if Hub feature is enabled
if (multistoreFeatures.isHub()) {
  import('@/features/multistore/workers/multistoreSyncWorker').then(({ multistoreSyncWorker }) => {
    workers.push(multistoreSyncWorker)
    console.log('✅ Multistore Sync Worker: Running')

    // Start scheduler
    import('@/features/multistore/workers/multistoreScheduler').then(({ startMultistoreScheduler }) => {
      startMultistoreScheduler().catch((err) =>
        console.error('❌ Multistore Scheduler failed to start:', err),
      )
      console.log('✅ Multistore Scheduler: Running')
    })

    // Start reconciliation scheduler if reports feature is enabled
    if (multistoreFeatures.reports()) {
      import('@/features/multistore/workers/multistoreReconciliationScheduler').then(({ startReconciliationScheduler }) => {
        startReconciliationScheduler(6).catch((err) =>
          console.error('❌ Multistore Reconciliation Scheduler failed to start:', err),
        )
        console.log('✅ Multistore Reconciliation Scheduler: Running (every 6h)')
      })
    }
  }).catch((err) => {
    console.error('❌ Multistore Sync Worker failed to load:', err)
  })
} else {
  console.log('⏸️  Multistore Sync Worker: Disabled (feature flag off)')
}

console.log('')
console.log('Workers are ready to process jobs!')
console.log('Press Ctrl+C to stop')

// Handle graceful shutdown
async function shutdown() {
  console.log('\n⏳ Shutting down workers...')

  await Promise.all(workers.map(worker => worker.close()))

  console.log('✅ Workers stopped')
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
