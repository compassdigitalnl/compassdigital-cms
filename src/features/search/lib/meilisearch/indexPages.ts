import type { Page } from '@/payload-types'
import { getOrCreateIndex, INDEXES } from './client'
import type { Payload } from 'payload'

/**
 * Extract text content from layout blocks (recursive)
 * Pages use block-based content instead of richtext
 */
function extractTextFromBlocks(layout: any[]): string {
  if (!Array.isArray(layout)) return ''

  const texts: string[] = []

  for (const block of layout) {
    if (!block) continue

    // Common text fields across blocks
    if (block.heading) texts.push(block.heading)
    if (block.title) texts.push(block.title)
    if (block.subtitle) texts.push(block.subtitle)
    if (block.description) texts.push(block.description)
    if (block.content && typeof block.content === 'string') texts.push(block.content)
    if (block.text && typeof block.text === 'string') texts.push(block.text)
    if (block.label) texts.push(block.label)

    // Rich text fields (Lexical)
    if (block.richText && typeof block.richText === 'object') {
      texts.push(extractFromLexical(block.richText))
    }
    if (block.content && typeof block.content === 'object' && block.content?.root) {
      texts.push(extractFromLexical(block.content))
    }

    // Nested items (Features, FAQ, Services, etc.)
    if (block.items && Array.isArray(block.items)) {
      for (const item of block.items) {
        if (item.title) texts.push(item.title)
        if (item.description) texts.push(item.description)
        if (item.content && typeof item.content === 'string') texts.push(item.content)
        if (item.answer && typeof item.answer === 'string') texts.push(item.answer)
        if (item.question) texts.push(item.question)
        if (item.text && typeof item.text === 'string') texts.push(item.text)
        if (item.richText && typeof item.richText === 'object') {
          texts.push(extractFromLexical(item.richText))
        }
      }
    }

    // Features array
    if (block.features && Array.isArray(block.features)) {
      for (const feat of block.features) {
        if (feat.title) texts.push(feat.title)
        if (feat.description) texts.push(feat.description)
      }
    }

    // Columns (TwoColumn block)
    if (block.columns && Array.isArray(block.columns)) {
      for (const col of block.columns) {
        if (col.richText && typeof col.richText === 'object') {
          texts.push(extractFromLexical(col.richText))
        }
      }
    }

    // FAQ questions
    if (block.questions && Array.isArray(block.questions)) {
      for (const q of block.questions) {
        if (q.question) texts.push(q.question)
        if (q.answer) texts.push(q.answer)
      }
    }
  }

  return texts.filter(Boolean).join(' ')
}

/**
 * Extract plain text from Lexical content (recursive)
 */
function extractFromLexical(content: any): string {
  if (!content?.root?.children) return ''

  let text = ''
  function traverse(node: any) {
    if (!node) return
    if (node.text) text += node.text + ' '
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(traverse)
    }
  }
  traverse(content.root)
  return text
}

/**
 * Transform Payload Page to Meilisearch document
 */
export function transformPageForSearch(page: Page) {
  // Extract text from all layout blocks
  let contentText = ''
  if ((page as any).layout && Array.isArray((page as any).layout)) {
    contentText = extractTextFromBlocks((page as any).layout)
  }
  // Limit to 2000 chars
  if (contentText.length > 2000) {
    contentText = contentText.substring(0, 2000)
  }

  return {
    id: page.id,
    title: page.title,
    slug: (page as any).slug?.value || (page as any).slug || '',
    content: contentText,
    status: (page as any).status || 'published',
    collection: 'pages' as const,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
  }
}

/**
 * Index a single page (fire-and-forget)
 */
export async function indexPage(page: Page) {
  try {
    const index = await getOrCreateIndex(INDEXES.PAGES)
    const document = transformPageForSearch(page)
    await index.addDocuments([document])
    console.log(`✅ Indexed page: ${page.title} (${page.id})`)
    return true
  } catch (error) {
    console.error(`❌ Failed to index page ${page.id}:`, error)
    return false
  }
}

/**
 * Delete a page from index
 */
export async function deletePageFromIndex(id: number | string) {
  try {
    const index = await getOrCreateIndex(INDEXES.PAGES)
    await index.deleteDocument(id)
    console.log(`✅ Deleted page from index: ${id}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to delete page ${id}:`, error)
    return false
  }
}

/**
 * Re-index all published pages (full sync)
 */
export async function reindexAllPages(payload: Payload) {
  try {
    console.log('🔄 Starting full pages reindex...')

    const { docs: pages } = await payload.find({
      collection: 'pages',
      limit: 10000,
      depth: 1,
      where: { status: { equals: 'published' } },
    })

    console.log(`📄 Found ${pages.length} published pages to index`)

    const documents = pages.map((p) => transformPageForSearch(p as Page))

    // Index in batches
    const index = await getOrCreateIndex(INDEXES.PAGES)
    const batchSize = 100
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize)
      await index.addDocuments(batch)
      console.log(`✅ Indexed pages batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(documents.length / batchSize)}`)
    }

    console.log('✅ Full pages reindex complete!')
    return true
  } catch (error) {
    console.error('❌ Failed to reindex pages:', error)
    return false
  }
}
