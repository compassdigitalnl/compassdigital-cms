import type { Product } from '@/payload-types'
import { getOrCreateIndex, INDEXES } from './client'

/**
 * Transform Payload Product to Meilisearch document
 */
export function transformProductForSearch(product: Product) {
  // Extract brand name
  const brandName = typeof product.brand === 'object' && product.brand !== null
    ? product.brand.name
    : null

  // Extract category names
  const categoryNames = product.categories && Array.isArray(product.categories)
    ? product.categories
        .map((cat) => (typeof cat === 'object' && cat !== null ? cat.name : null))
        .filter(Boolean)
    : []

  // Extract main image URL
  const imageUrl = typeof product.featuredImage === 'object' && product.featuredImage !== null
    ? product.featuredImage.url
    : null

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    brand: brandName,
    sku: product.sku || '',
    description: product.description || '',
    price: product.price || 0,
    stock: product.stock || 0,
    image: imageUrl,
    categories: categoryNames,
    tags: product.tags || [],
    status: product.status || 'draft',
    featured: product.featured || false,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }
}

/**
 * Index a single product
 */
export async function indexProduct(product: Product) {
  try {
    const index = await getOrCreateIndex(INDEXES.PRODUCTS)
    const document = transformProductForSearch(product)

    await index.addDocuments([document])

    console.log(`✅ Indexed product: ${product.title} (${product.id})`)
    return true
  } catch (error) {
    console.error(`❌ Failed to index product ${product.id}:`, error)
    return false
  }
}

/**
 * Index multiple products
 */
export async function indexProducts(products: Product[]) {
  try {
    const index = await getOrCreateIndex(INDEXES.PRODUCTS)
    const documents = products.map(transformProductForSearch)

    const task = await index.addDocuments(documents)

    console.log(`✅ Indexed ${documents.length} products (task ${task.taskUid})`)
    return true
  } catch (error) {
    console.error('❌ Failed to index products:', error)
    return false
  }
}

/**
 * Delete a product from index
 */
export async function deleteProductFromIndex(productId: string) {
  try {
    const index = await getOrCreateIndex(INDEXES.PRODUCTS)

    await index.deleteDocument(productId)

    console.log(`✅ Deleted product from index: ${productId}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to delete product ${productId}:`, error)
    return false
  }
}

/**
 * Re-index all products (full sync)
 */
export async function reindexAllProducts(payload: any) {
  try {
    console.log('🔄 Starting full product reindex...')

    // Fetch all published products
    const { docs: products } = await payload.find({
      collection: 'products',
      limit: 10000, // Adjust based on product count
      depth: 1, // Include brand and categories
    })

    console.log(`📦 Found ${products.length} products to index`)

    // Index in batches
    const batchSize = 100
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize)
      await indexProducts(batch)
      console.log(`✅ Indexed batch ${i / batchSize + 1}/${Math.ceil(products.length / batchSize)}`)
    }

    console.log('✅ Full product reindex complete!')
    return true
  } catch (error) {
    console.error('❌ Failed to reindex products:', error)
    return false
  }
}
