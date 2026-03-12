import { getOrCreateIndex, INDEXES } from './client'
import type { Payload } from 'payload'

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

export function transformProjectForSearch(project: any) {
  const texts: string[] = []

  if (project.shortDescription) texts.push(project.shortDescription)
  if (project.client) texts.push(project.client)
  if (project.industry) texts.push(project.industry)
  if (project.location) texts.push(project.location)
  if (project.year) texts.push(String(project.year))
  if (project.duration) texts.push(project.duration)
  if (project.resultHighlight) texts.push(project.resultHighlight)
  if (project.testimonial?.quote) texts.push(project.testimonial.quote)
  if (project.longDescription) texts.push(extractFromLexical(project.longDescription))
  if (project.challenge) texts.push(extractFromLexical(project.challenge))
  if (project.solution) texts.push(extractFromLexical(project.solution))
  if (project.resultDescription) texts.push(extractFromLexical(project.resultDescription))

  let contentText = texts.filter(Boolean).join(' ')
  if (contentText.length > 2000) contentText = contentText.substring(0, 2000)

  return {
    id: project.id,
    title: project.title,
    slug: project.slug || '',
    branch: project.branch || '',
    content: contentText,
    status: project.status || 'published',
    collection: 'projects' as const,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }
}

export async function indexProject(project: any) {
  try {
    const index = await getOrCreateIndex(INDEXES.PROJECTS || 'projects-portfolio')
    await index.addDocuments([transformProjectForSearch(project)])
    return true
  } catch (error) {
    console.error(`[Projects] Index error for ${project.id}:`, error)
    return false
  }
}

export async function deleteProjectFromIndex(id: number | string) {
  try {
    const index = await getOrCreateIndex(INDEXES.PROJECTS || 'projects-portfolio')
    await index.deleteDocument(id)
    return true
  } catch (error) {
    console.error(`[Projects] Delete error for ${id}:`, error)
    return false
  }
}

export async function reindexAllProjects(payload: Payload) {
  try {
    const { docs } = await payload.find({
      collection: 'projects',
      limit: 10000,
      depth: 1,
      where: { status: { equals: 'published' } },
    })
    const documents = docs.map(transformProjectForSearch)
    const index = await getOrCreateIndex(INDEXES.PROJECTS || 'projects-portfolio')
    const batchSize = 100
    for (let i = 0; i < documents.length; i += batchSize) {
      await index.addDocuments(documents.slice(i, i + batchSize))
    }
    return true
  } catch (error) {
    console.error('[Projects] Reindex error:', error)
    return false
  }
}
