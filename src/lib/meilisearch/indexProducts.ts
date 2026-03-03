import type { Product } from '@/payload-types'
import { getOrCreateIndex, INDEXES, meilisearchClient } from './client'

/**
 * Split comma-separated spec values into individual values
 * e.g. "L, M, S, XL" → ["L", "M", "S", "XL"]
 */
function splitSpecValues(value: string): string[] {
  return value.split(/[,;]+/).map(v => v.trim()).filter(Boolean)
}

/**
 * Transform Payload Product to Meilisearch document
 * Includes full data for faceted search in shop filters
 */
export function transformProductForSearch(product: Product) {
  // Extract brand info
  const brandObj = typeof product.brand === 'object' && product.brand !== null ? product.brand : null
  const brandName = brandObj?.name || null
  const brandId = brandObj?.id || (typeof product.brand === 'number' ? product.brand : null)
  const brandLevel = (brandObj as any)?.level ?? 0

  // Extract category names and IDs
  const categories: string[] = []
  const categoryIds: number[] = []
  if (product.categories && Array.isArray(product.categories)) {
    for (const cat of product.categories) {
      if (typeof cat === 'object' && cat !== null) {
        if (cat.name) categories.push(cat.name)
        if (cat.id) categoryIds.push(cat.id)
      } else if (typeof cat === 'number') {
        categoryIds.push(cat)
      }
    }
  }

  // Extract main image URL
  const firstImage =
    Array.isArray(product.images) && product.images[0] && typeof product.images[0] === 'object'
      ? product.images[0]
      : null
  const imageUrl = firstImage && typeof firstImage === 'object' && 'url' in firstImage
    ? firstImage.url
    : null

  // Extract specifications as flat facets (split comma-separated values)
  const specs: Record<string, string[]> = {}
  const specsFlatSearch: string[] = []
  if ((product as any).specifications && Array.isArray((product as any).specifications)) {
    for (const group of (product as any).specifications) {
      if (group.attributes && Array.isArray(group.attributes)) {
        for (const attr of group.attributes) {
          if (attr.name && attr.value) {
            const key = attr.name.toLowerCase().replace(/\s+/g, '_')
            const values = splitSpecValues(attr.value)
            if (!specs[key]) specs[key] = []
            specs[key].push(...values)
            specsFlatSearch.push(...values)
          }
        }
      }
    }
  }

  // Effective price for sorting/filtering (sale price takes priority)
  const effectivePrice = product.salePrice || product.price || null

  // Build flat spec fields for Meilisearch faceting (spec_kleur, spec_maat, etc.)
  const flatSpecs: Record<string, string[]> = {}
  for (const [key, values] of Object.entries(specs)) {
    flatSpecs[`spec_${key}`] = values
  }

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    brand: brandName,
    brandId,
    brandLevel,
    sku: product.sku || '',
    ean: product.ean || '',
    description: product.description || '',
    shortDescription: (product as any).shortDescription || '',
    price: product.price ?? null,
    salePrice: product.salePrice ?? null,
    effectivePrice,
    compareAtPrice: product.compareAtPrice ?? null,
    stock: product.stock ?? 0,
    stockStatus: product.stockStatus || (product.stock && product.stock > 0 ? 'in-stock' : 'out'),
    backordersAllowed: product.backordersAllowed || false,
    trackStock: product.trackStock || false,
    image: imageUrl,
    categories,
    categoryIds,
    productType: product.productType || 'simple',
    badge: product.badge || null,
    tags: product.tags || [],
    status: product.status || 'draft',
    featured: product.featured || false,
    specs,
    specsFlatSearch,
    ...flatSpecs, // Flat spec fields for Meilisearch faceting
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
      limit: 10000,
      depth: 1,
    })

    console.log(`📦 Found ${products.length} products to index`)

    // Transform and collect all spec keys (prefixed with spec_ for flat faceting)
    const allSpecKeys = new Set<string>()
    const allDocuments = products.map((p: Product) => {
      const doc = transformProductForSearch(p)
      Object.keys(doc.specs).forEach(key => allSpecKeys.add(`spec_${key}`))
      return doc
    })

    // Index in batches
    const index = await getOrCreateIndex(INDEXES.PRODUCTS)
    const batchSize = 100
    for (let i = 0; i < allDocuments.length; i += batchSize) {
      const batch = allDocuments.slice(i, i + batchSize)
      await index.addDocuments(batch)
      console.log(`✅ Indexed batch ${i / batchSize + 1}/${Math.ceil(allDocuments.length / batchSize)}`)
    }

    // Update filterableAttributes to include dynamic spec keys (flat: spec_kleur, spec_maat, etc.)
    if (allSpecKeys.size > 0) {
      const specPaths = Array.from(allSpecKeys)
      console.log(`🔧 Adding ${specPaths.length} spec keys to filterableAttributes: ${specPaths.slice(0, 5).join(', ')}...`)

      const currentSettings = await index.getSettings()
      const currentFilterable = currentSettings.filterableAttributes || []

      // Merge: keep existing + add new spec paths
      const merged = new Set([...currentFilterable, ...specPaths])
      await index.updateSettings({ filterableAttributes: Array.from(merged) })
      console.log(`✅ Updated filterableAttributes (${merged.size} total)`)
    }

    console.log('✅ Full product reindex complete!')
    return true
  } catch (error) {
    console.error('❌ Failed to reindex products:', error)
    return false
  }
}
