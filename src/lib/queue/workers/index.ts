/**
 * Worker Manager
 * Starts all BullMQ workers
 * Run this in a separate process: node dist/lib/queue/workers/index.js
 */

import { contentAnalysisWorker } from './contentAnalysisWorker'

console.log('🚀 Starting all workers...')
console.log('✅ Content Analysis Worker: Running')
console.log('')
console.log('Workers are ready to process jobs!')
console.log('Press Ctrl+C to stop')

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('\n⏳ Shutting down workers...')
  await contentAnalysisWorker.close()
  console.log('✅ Workers stopped')
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('\n⏳ Shutting down workers...')
  await contentAnalysisWorker.close()
  console.log('✅ Workers stopped')
  process.exit(0)
})
