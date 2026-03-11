import type { ProfessionalCase } from '@/payload-types'
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
 * Transform Payload ProfessionalCase to Meilisearch document
 */
export function transformCaseForSearch(project: ProfessionalCase) {
  const texts: string[] = []

  // Short description as main content
  if (project.shortDescription) texts.push(project.shortDescription)

  // Client, industry, duration, result
  if (project.client) texts.push(project.client)
  if (project.industry) texts.push(project.industry)
  if (project.duration) texts.push(project.duration)
  if (project.result) texts.push(project.result)

  // Category title (if populated as object)
  if (project.category && typeof project.category === 'object' && 'title' in project.category) {
    texts.push(project.category.title)
  }

  // Testimonial quote
  if (project.testimonial?.quote) {
    texts.push(project.testimonial.quote)
  }

  // Lexical rich text fields
  if (project.longDescription) {
    texts.push(extractFromLexical(project.longDescription))
  }
  if (project.challenge) {
    texts.push(extractFromLexical(project.challenge))
  }
  if (project.solution) {
    texts.push(extractFromLexical(project.solution))
  }
  if (project.resultDescription) {
    texts.push(extractFromLexical(project.resultDescription))
  }

  let contentText = texts.filter(Boolean).join(' ')

  // Limit to 2000 chars
  if (contentText.length > 2000) {
    contentText = contentText.substring(0, 2000)
  }

  return {
    id: project.id,
    title: project.title,
    slug: project.slug || '',
    content: contentText,
    status: project.status || 'published',
    collection: 'professional-cases' as const,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }
}

/**
 * Index a single professional case (fire-and-forget)
 */
export async function indexProfessionalCase(project: ProfessionalCase) {
  try {
    const index = await getOrCreateIndex(INDEXES.PROFESSIONAL_CASES)
    const document = transformCaseForSearch(project)
    await index.addDocuments([document])
    console.log(`✅ Indexed professional case: ${project.title} (${project.id})`)
    return true
  } catch (error) {
    console.error(`❌ Failed to index professional case ${project.id}:`, error)
    return false
  }
}

/**
 * Delete a professional case from index
 */
export async function deleteProfessionalCaseFromIndex(id: number | string) {
  try {
    const index = await getOrCreateIndex(INDEXES.PROFESSIONAL_CASES)
    await index.deleteDocument(id)
    console.log(`✅ Deleted professional case from index: ${id}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to delete professional case ${id}:`, error)
    return false
  }
}

/**
 * Re-index all published professional cases (full sync)
 */
export async function reindexAllProfessionalCases(payload: Payload) {
  try {
    console.log('🔄 Starting full professional cases reindex...')

    const { docs: cases } = await payload.find({
      collection: 'professional-cases',
      limit: 10000,
      depth: 1,
      where: { status: { equals: 'published' } },
    })

    console.log(`📄 Found ${cases.length} published professional cases to index`)

    const documents = cases.map((p) => transformCaseForSearch(p as ProfessionalCase))

    // Index in batches
    const index = await getOrCreateIndex(INDEXES.PROFESSIONAL_CASES)
    const batchSize = 100
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize)
      await index.addDocuments(batch)
      console.log(`✅ Indexed professional cases batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(documents.length / batchSize)}`)
    }

    console.log('✅ Full professional cases reindex complete!')
    return true
  } catch (error) {
    console.error('❌ Failed to reindex professional cases:', error)
    return false
  }
}
