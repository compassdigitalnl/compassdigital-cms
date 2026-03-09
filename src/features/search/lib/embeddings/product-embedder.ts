/**
 * Product Embedder
 * Batch-embeds all products for semantic search
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { generateEmbedding, generateEmbeddings } from './embedding-service'
import { upsertEmbedding } from './vector-store'
import { EMBEDDING_CONFIG } from './types'

/**
 * Build a combined text string from product fields for embedding
 * Includes title, brand, description, and category information
 */
export function buildEmbeddingText(product: any): string {
  const parts: string[] = []

  if (product.title) parts.push(product.title)

  // Brand — may be a string or a relationship object
  if (product.brand) {
    const brandName =
      typeof product.brand === 'object' ? product.brand.title || product.brand.name : product.brand
    if (brandName) parts.push(brandName)
  }

  // Description — strip HTML tags if present
  if (product.description) {
    const plainText = product.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    if (plainText) parts.push(plainText)
  }

  // Short description
  if (product.shortDescription) {
    const plainText = product.shortDescription.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    if (plainText) parts.push(plainText)
  }

  // Categories — may be array of strings or objects
  if (product.categories && Array.isArray(product.categories)) {
    const categoryNames = product.categories
      .map((cat: any) => (typeof cat === 'object' ? cat.title || cat.name : cat))
      .filter(Boolean)
    if (categoryNames.length > 0) parts.push(categoryNames.join(', '))
  }

  // SKU
  if (product.sku) parts.push(`SKU: ${product.sku}`)

  return parts.join(' | ')
}

/**
 * Embed a single product
 */
export async function embedProduct(product: any): Promise<void> {
  const text = buildEmbeddingText(product)
  if (!text.trim()) return

  const embedding = await generateEmbedding(text)

  await upsertEmbedding('products', product.id, embedding, {
    title: product.title || '',
    slug: product.slug || '',
  })
}

/**
 * Embed all published products in batches
 * Returns the count of successfully embedded products and errors
 */
export async function embedAllProducts(): Promise<{ embedded: number; errors: number }> {
  const payload = await getPayload({ config })

  let embedded = 0
  let errors = 0
  let page = 1
  const pageSize = EMBEDDING_CONFIG.batchSize
  let hasMore = true

  while (hasMore) {
    const result = await payload.find({
      collection: 'products',
      where: { _status: { equals: 'published' } },
      limit: pageSize,
      page,
      depth: 1, // Resolve brand/category relationships
    })

    if (!result.docs || result.docs.length === 0) {
      hasMore = false
      break
    }

    // Build texts for the batch
    const texts = result.docs.map((product: any) => buildEmbeddingText(product))
    const validDocs = result.docs.filter((_: any, i: number) => texts[i].trim().length > 0)
    const validTexts = texts.filter((t: string) => t.trim().length > 0)

    if (validTexts.length > 0) {
      try {
        const embeddings = await generateEmbeddings(validTexts)

        // Store each embedding
        for (let i = 0; i < validDocs.length; i++) {
          try {
            await upsertEmbedding('products', validDocs[i].id, embeddings[i], {
              title: validDocs[i].title || '',
              slug: validDocs[i].slug || '',
            })
            embedded++
          } catch (err) {
            console.error(`Failed to store embedding for product ${validDocs[i].id}:`, err)
            errors++
          }
        }
      } catch (err) {
        console.error(`Failed to generate embeddings for batch (page ${page}):`, err)
        errors += validDocs.length
      }
    }

    hasMore = result.hasNextPage === true
    page++
  }

  console.log(`Embedding complete: ${embedded} products embedded, ${errors} errors`)
  return { embedded, errors }
}
