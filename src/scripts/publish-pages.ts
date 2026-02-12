/**
 * Script to publish all draft pages
 * This sets _status to 'published' for all pages
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function publishAllPages() {
  console.log('🚀 Starting to publish all pages...')

  const payload = await getPayload({ config })

  // Find all pages
  const pages = await payload.find({
    collection: 'pages',
    limit: 1000,
    pagination: false,
  })

  console.log(`📄 Found ${pages.docs.length} pages to publish`)

  for (const page of pages.docs) {
    console.log(`📝 Publishing page: ${page.title} (slug: ${page.slug})`)

    try {
      await payload.update({
        collection: 'pages',
        id: page.id,
        data: {
          // @ts-ignore - Payload's internal draft/publish status
          _status: 'published',
        },
      })
      console.log(`✅ Published: ${page.title}`)
    } catch (error) {
      console.error(`❌ Error publishing ${page.title}:`, error)
    }
  }

  console.log('🎉 All pages published!')
  process.exit(0)
}

publishAllPages().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
