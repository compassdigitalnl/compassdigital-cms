/**
 * Script to delete all pages
 * Useful for testing/development
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function deleteAllPages() {
  console.log('🗑️  Starting to delete all pages...')

  const payload = await getPayload({ config })

  // Find all pages
  const pages = await payload.find({
    collection: 'pages',
    limit: 1000,
    pagination: false,
  })

  console.log(`📄 Found ${pages.docs.length} pages to delete`)

  for (const page of pages.docs) {
    console.log(`🗑️  Deleting page: ${page.title} (slug: ${page.slug})`)

    try {
      await payload.delete({
        collection: 'pages',
        id: page.id,
      })
      console.log(`✅ Deleted: ${page.title}`)
    } catch (error) {
      console.error(`❌ Error deleting ${page.title}:`, error)
    }
  }

  console.log('🎉 All pages deleted!')
  process.exit(0)
}

deleteAllPages().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
