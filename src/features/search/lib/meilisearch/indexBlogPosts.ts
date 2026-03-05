import type { BlogPost } from '@/payload-types'
import { getOrCreateIndex, INDEXES } from './client'
import { shouldExcludeDocument, getMeilisearchSettings, mergeSettings } from './settings'
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
 * Transform Payload BlogPost to Meilisearch document
 */
export function transformBlogPostForSearch(post: BlogPost) {
  // Extract category names
  const categories: string[] = []
  if (post.categories && Array.isArray(post.categories)) {
    for (const cat of post.categories) {
      if (typeof cat === 'object' && cat !== null && (cat as any).name) {
        categories.push((cat as any).name)
      }
    }
  }

  // Extract tags
  const tags: string[] = []
  if (post.tags && Array.isArray(post.tags)) {
    for (const t of post.tags) {
      if (typeof t === 'object' && t !== null && (t as any).tag) {
        tags.push((t as any).tag)
      }
    }
  }

  // Extract featured image URL
  let featuredImage: string | null = null
  if (typeof post.featuredImage === 'object' && post.featuredImage !== null && 'url' in post.featuredImage) {
    featuredImage = (post.featuredImage as any).url
  }

  // Extract content text from Lexical
  let contentText = ''
  if (post.content && typeof post.content === 'object') {
    contentText = extractFromLexical(post.content)
  }
  // Limit to 2000 chars
  if (contentText.length > 2000) {
    contentText = contentText.substring(0, 2000)
  }

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content: contentText,
    categories,
    tags,
    featuredImage,
    featuredImageEmoji: (post as any).featuredImageEmoji || null,
    publishedAt: (post as any).publishedAt || null,
    status: post.status || 'draft',
    collection: 'blog-posts' as const,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }
}

/**
 * Index a single blog post (fire-and-forget)
 */
export async function indexBlogPost(post: BlogPost) {
  try {
    const index = await getOrCreateIndex(INDEXES.BLOG_POSTS)
    const document = transformBlogPostForSearch(post)
    await index.addDocuments([document])
    console.log(`✅ Indexed blog post: ${post.title} (${post.id})`)
    return true
  } catch (error) {
    console.error(`❌ Failed to index blog post ${post.id}:`, error)
    return false
  }
}

/**
 * Delete a blog post from index
 */
export async function deleteBlogPostFromIndex(id: number | string) {
  try {
    const index = await getOrCreateIndex(INDEXES.BLOG_POSTS)
    await index.deleteDocument(id)
    console.log(`✅ Deleted blog post from index: ${id}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to delete blog post ${id}:`, error)
    return false
  }
}

/**
 * Re-index all published blog posts (full sync)
 */
export async function reindexAllBlogPosts(payload: Payload) {
  try {
    console.log('🔄 Starting full blog post reindex...')

    const { docs: posts } = await payload.find({
      collection: 'blog-posts',
      limit: 10000,
      depth: 1,
      where: { status: { equals: 'published' } },
    })

    console.log(`📝 Found ${posts.length} published blog posts to index`)

    const documents = posts.map((p) => transformBlogPostForSearch(p as BlogPost))

    // Index in batches
    const index = await getOrCreateIndex(INDEXES.BLOG_POSTS)
    const batchSize = 100
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize)
      await index.addDocuments(batch)
      console.log(`✅ Indexed blog batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(documents.length / batchSize)}`)
    }

    console.log('✅ Full blog post reindex complete!')
    return true
  } catch (error) {
    console.error('❌ Failed to reindex blog posts:', error)
    return false
  }
}
