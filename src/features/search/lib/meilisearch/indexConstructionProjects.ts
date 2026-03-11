import type { ConstructionProject } from '@/payload-types'
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
 * Transform Payload ConstructionProject to Meilisearch document
 */
export function transformProjectForSearch(project: ConstructionProject) {
  const texts: string[] = []

  // Short description as main content
  if (project.shortDescription) texts.push(project.shortDescription)

  // Location, year, duration, size
  if (project.location) texts.push(project.location)
  if (project.year) texts.push(String(project.year))
  if (project.duration) texts.push(project.duration)
  if (project.size) texts.push(project.size)

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
  if (project.result) {
    texts.push(extractFromLexical(project.result))
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
    collection: 'construction-projects' as const,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }
}

/**
 * Index a single construction project (fire-and-forget)
 */
export async function indexConstructionProject(project: ConstructionProject) {
  try {
    const index = await getOrCreateIndex(INDEXES.CONSTRUCTION_PROJECTS)
    const document = transformProjectForSearch(project)
    await index.addDocuments([document])
    console.log(`✅ Indexed construction project: ${project.title} (${project.id})`)
    return true
  } catch (error) {
    console.error(`❌ Failed to index construction project ${project.id}:`, error)
    return false
  }
}

/**
 * Delete a construction project from index
 */
export async function deleteConstructionProjectFromIndex(id: number | string) {
  try {
    const index = await getOrCreateIndex(INDEXES.CONSTRUCTION_PROJECTS)
    await index.deleteDocument(id)
    console.log(`✅ Deleted construction project from index: ${id}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to delete construction project ${id}:`, error)
    return false
  }
}

/**
 * Re-index all published construction projects (full sync)
 */
export async function reindexAllConstructionProjects(payload: Payload) {
  try {
    console.log('🔄 Starting full construction projects reindex...')

    const { docs: projects } = await payload.find({
      collection: 'construction-projects',
      limit: 10000,
      depth: 1,
      where: { status: { equals: 'published' } },
    })

    console.log(`📄 Found ${projects.length} published construction projects to index`)

    const documents = projects.map((p) => transformProjectForSearch(p as ConstructionProject))

    // Index in batches
    const index = await getOrCreateIndex(INDEXES.CONSTRUCTION_PROJECTS)
    const batchSize = 100
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize)
      await index.addDocuments(batch)
      console.log(`✅ Indexed construction projects batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(documents.length / batchSize)}`)
    }

    console.log('✅ Full construction projects reindex complete!')
    return true
  } catch (error) {
    console.error('❌ Failed to reindex construction projects:', error)
    return false
  }
}
