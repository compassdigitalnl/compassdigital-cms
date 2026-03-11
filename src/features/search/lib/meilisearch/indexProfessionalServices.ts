import type { ProfessionalService } from '@/payload-types'
import { getOrCreateIndex, INDEXES } from './client'
import type { Payload } from 'payload'

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
 * Transform Payload ProfessionalService to Meilisearch document
 */
export function transformServiceForSearch(service: ProfessionalService) {
  const texts: string[] = []

  // Short description as main content
  if (service.shortDescription) texts.push(service.shortDescription)

  // Long description (Lexical)
  if (service.longDescription) {
    texts.push(extractFromLexical(service.longDescription))
  }

  // Features array — join feature texts
  if (service.features && Array.isArray(service.features)) {
    for (const f of service.features) {
      if (f.feature) texts.push(f.feature)
    }
  }

  // Service types array — join names
  if (service.serviceTypes && Array.isArray(service.serviceTypes)) {
    for (const st of service.serviceTypes) {
      if (st.name) texts.push(st.name)
      if (st.description) texts.push(st.description)
    }
  }

  // FAQ — join questions and answers
  if (service.faq && Array.isArray(service.faq)) {
    for (const item of service.faq) {
      if (item.question) texts.push(item.question)
      if (item.answer) texts.push(item.answer)
    }
  }

  let contentText = texts.filter(Boolean).join(' ')

  // Limit to 2000 chars
  if (contentText.length > 2000) {
    contentText = contentText.substring(0, 2000)
  }

  return {
    id: service.id,
    title: service.title,
    slug: service.slug || '',
    content: contentText,
    status: service.status || 'published',
    collection: 'professional-services' as const,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  }
}

/**
 * Index a single professional service (fire-and-forget)
 */
export async function indexProfessionalService(service: ProfessionalService) {
  try {
    const index = await getOrCreateIndex(INDEXES.PROFESSIONAL_SERVICES)
    const document = transformServiceForSearch(service)
    await index.addDocuments([document])
    console.log(`✅ Indexed professional service: ${service.title} (${service.id})`)
    return true
  } catch (error) {
    console.error(`❌ Failed to index professional service ${service.id}:`, error)
    return false
  }
}

/**
 * Delete a professional service from index
 */
export async function deleteProfessionalServiceFromIndex(id: number | string) {
  try {
    const index = await getOrCreateIndex(INDEXES.PROFESSIONAL_SERVICES)
    await index.deleteDocument(id)
    console.log(`✅ Deleted professional service from index: ${id}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to delete professional service ${id}:`, error)
    return false
  }
}

/**
 * Re-index all published professional services (full sync)
 */
export async function reindexAllProfessionalServices(payload: Payload) {
  try {
    console.log('🔄 Starting full professional services reindex...')

    const { docs: services } = await payload.find({
      collection: 'professional-services',
      limit: 10000,
      depth: 1,
      where: { status: { equals: 'published' } },
    })

    console.log(`📄 Found ${services.length} published professional services to index`)

    const documents = services.map((s) => transformServiceForSearch(s as ProfessionalService))

    // Index in batches
    const index = await getOrCreateIndex(INDEXES.PROFESSIONAL_SERVICES)
    const batchSize = 100
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize)
      await index.addDocuments(batch)
      console.log(`✅ Indexed professional services batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(documents.length / batchSize)}`)
    }

    console.log('✅ Full professional services reindex complete!')
    return true
  } catch (error) {
    console.error('❌ Failed to reindex professional services:', error)
    return false
  }
}
