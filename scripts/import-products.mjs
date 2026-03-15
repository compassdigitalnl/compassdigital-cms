/**
 * Plastimed WooCommerce → Payload CMS Product Import
 *
 * Imports products from pre-processed CSV files:
 * - Fase 1: Standalone simple products (3,773)
 * - Fase 2: Grouped products (305 parents + 1,467 children)
 *
 * Also imports categories from the hierarchical strings in the CSV.
 *
 * Usage:
 *   node scripts/import-products.mjs                   # full import
 *   node scripts/import-products.mjs --dry-run         # preview only
 *   node scripts/import-products.mjs --fase=1          # fase 1 only
 *   node scripts/import-products.mjs --fase=2          # fase 2 only
 *   node scripts/import-products.mjs --categories-only # only import categories
 */
import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'csv-parse/sync'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMPORT_DIR = path.join(__dirname, '../docs/clients/plastimed/import')
const DB_URL = 'postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/client_plastimed01'

const DRY_RUN = process.argv.includes('--dry-run')
const FASE = process.argv.find(a => a.startsWith('--fase='))?.split('=')[1]
const CATS_ONLY = process.argv.includes('--categories-only')

// ============================================================================
// Utilities
// ============================================================================

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Parse Dutch price format: "144,94" → 144.94 */
function parsePrice(val) {
  if (!val || val.trim() === '') return null
  return parseFloat(val.replace('.', '').replace(',', '.'))
}

/** Parse stock: "1" → true, "0"/empty → false, number string → number */
function parseStock(val) {
  if (!val || val.trim() === '') return 0
  return parseInt(val) || 0
}

/** Strip HTML tags for short description fallback */
function stripHtml(html) {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Convert HTML to minimal Lexical JSON (paragraphs only) */
function htmlToLexical(html) {
  if (!html || html.trim() === '') return null

  // Split on double newlines or block-level tags
  const text = stripHtml(html)
  if (!text) return null

  // Split into paragraphs
  const paragraphs = text.split(/\n\n|\n/).map(p => p.trim()).filter(Boolean)
  if (paragraphs.length === 0) return null

  const children = paragraphs.map(p => ({
    type: 'paragraph',
    version: 1,
    children: [{ type: 'text', text: p, version: 1, detail: 0, format: 0, mode: 'normal', style: '' }],
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    textStyle: '',
  }))

  return { root: { type: 'root', version: 1, children, direction: 'ltr', format: '', indent: 0 } }
}

/** Map WooCommerce tax class to Payload enum */
function mapTaxClass(val) {
  if (!val) return 'standard'
  if (val === 'hoog' || val === 'standard') return 'standard'  // 21%
  if (val === 'laag' || val === 'reduced') return 'reduced'    // 9%
  if (val === 'nul' || val === 'zero') return 'zero'
  return 'standard'
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  if (DRY_RUN) console.log('[DRY RUN] No changes will be made.\n')

  const pool = new pg.Pool({ connectionString: DB_URL, max: 5 })

  try {
    // ========================================================================
    // STEP 1: Load existing data
    // ========================================================================
    console.log('=== Loading existing data ===')

    const existingBrands = await pool.query('SELECT id, name FROM brands')
    const brandByName = new Map()
    existingBrands.rows.forEach(b => brandByName.set(b.name.toLowerCase(), b.id))
    console.log(`Brands: ${existingBrands.rows.length}`)

    const existingCats = await pool.query('SELECT id, name, slug, parent_id FROM product_categories')
    const catBySlug = new Map()
    existingCats.rows.forEach(c => catBySlug.set(c.slug, c.id))
    const catSlugs = new Set(existingCats.rows.map(c => c.slug))
    console.log(`Categories: ${existingCats.rows.length}`)

    const existingProducts = await pool.query('SELECT id, sku, slug FROM products')
    const productBySku = new Map()
    const productSlugs = new Set()
    existingProducts.rows.forEach(p => {
      if (p.sku) productBySku.set(p.sku, p.id)
      if (p.slug) productSlugs.add(p.slug)
    })
    console.log(`Products: ${existingProducts.rows.length}`)

    // ========================================================================
    // STEP 2: Parse CSVs
    // ========================================================================
    console.log('\n=== Parsing CSVs ===')
    const fase1Csv = fs.readFileSync(path.join(IMPORT_DIR, 'fase1-standalone-simple-products.csv'), 'utf8')
    const fase1Rows = parse(fase1Csv, { columns: true, skip_empty_lines: true, relax_column_count: true })
    console.log(`Fase 1 (simple): ${fase1Rows.length} rows`)

    const fase2ParentsCsv = fs.readFileSync(path.join(IMPORT_DIR, 'fase2-grouped-products-parents.csv'), 'utf8')
    const fase2Parents = parse(fase2ParentsCsv, { columns: true, skip_empty_lines: true, relax_column_count: true })
    console.log(`Fase 2 parents (grouped): ${fase2Parents.length} rows`)

    const fase2ChildrenCsv = fs.readFileSync(path.join(IMPORT_DIR, 'fase2-grouped-products-children.csv'), 'utf8')
    const fase2Children = parse(fase2ChildrenCsv, { columns: true, skip_empty_lines: true, relax_column_count: true })
    console.log(`Fase 2 children (simple): ${fase2Children.length} rows`)

    // ========================================================================
    // STEP 3: Import categories
    // ========================================================================
    console.log('\n=== Importing Categories ===')

    // Collect all unique category paths from all CSVs
    const allCatPaths = new Set()
    const allRows = [...fase1Rows, ...fase2Parents, ...fase2Children]
    for (const row of allRows) {
      const catStr = row['Categorieën'] || ''
      catStr.split(',').map(c => c.trim()).filter(Boolean).forEach(c => {
        // Add every intermediate level too
        const parts = c.split(' > ').map(p => p.trim())
        for (let i = 0; i < parts.length; i++) {
          allCatPaths.add(parts.slice(0, i + 1).join(' > '))
        }
      })
    }
    console.log(`Unique category nodes to create: ${allCatPaths.size}`)

    // Sort by depth (parents first)
    const sortedPaths = [...allCatPaths].sort((a, b) => {
      const da = a.split(' > ').length
      const db = b.split(' > ').length
      return da - db || a.localeCompare(b)
    })

    // catPathToId maps "Injectiemateriaal > Naalden > Poortnaalden" → DB id
    const catPathToId = new Map()

    // Pre-populate with existing categories (match by slug for root categories)
    existingCats.rows.forEach(c => {
      if (!c.parent_id) {
        // Root category - match by name via slug
        const matchingPath = sortedPaths.find(p => !p.includes(' > ') && slugify(p) === c.slug)
        if (matchingPath) catPathToId.set(matchingPath, c.id)
      }
    })

    let catsCreated = 0
    let catsSkipped = 0
    const now = new Date().toISOString()

    function uniqueCatSlug(base) {
      let slug = slugify(base)
      if (!catSlugs.has(slug)) { catSlugs.add(slug); return slug }
      let i = 2
      while (catSlugs.has(`${slug}-${i}`)) i++
      slug = `${slug}-${i}`
      catSlugs.add(slug)
      return slug
    }

    for (const fullPath of sortedPaths) {
      if (catPathToId.has(fullPath)) { catsSkipped++; continue }
      if (fullPath === 'Uncategorized') { catsSkipped++; continue }

      const parts = fullPath.split(' > ').map(p => p.trim())
      const name = parts[parts.length - 1]
      const parentPath = parts.length > 1 ? parts.slice(0, -1).join(' > ') : null
      const parentId = parentPath ? catPathToId.get(parentPath) : null
      const level = parts.length - 1
      const slug = uniqueCatSlug(name)

      if (DRY_RUN) {
        catPathToId.set(fullPath, -catsCreated - 1000) // fake ID
        catsCreated++
        continue
      }

      const result = await pool.query(
        `INSERT INTO product_categories (name, slug, parent_id, level, visible, "order", updated_at, created_at)
         VALUES ($1, $2, $3, $4, true, 0, $5, $5) RETURNING id`,
        [name, slug, parentId, level, now]
      )
      catPathToId.set(fullPath, result.rows[0].id)
      catBySlug.set(slug, result.rows[0].id)
      catsCreated++
    }
    console.log(`Categories: ${catsCreated} created, ${catsSkipped} skipped`)

    if (CATS_ONLY) {
      console.log('\n--categories-only flag set, stopping here.')
      await pool.end()
      return
    }

    // ========================================================================
    // Helper: resolve brand name → ID
    // ========================================================================
    function resolveBrandId(merkenStr) {
      if (!merkenStr) return null
      // Brand field can be: "B.Braun, B.Braun > B.Braun Surecan"
      // We want the most specific (deepest) brand
      const entries = merkenStr.split(',').map(s => s.trim()).filter(Boolean)
      let bestId = null
      for (const entry of entries) {
        const parts = entry.split(' > ').map(p => p.trim())
        // Try the deepest level first, then parent
        for (let i = parts.length - 1; i >= 0; i--) {
          const name = parts[i].toLowerCase()
          if (brandByName.has(name)) {
            bestId = brandByName.get(name)
            break
          }
        }
        if (bestId) break
      }
      return bestId
    }

    // ========================================================================
    // Helper: resolve category paths → IDs
    // ========================================================================
    function resolveCategoryIds(catStr) {
      if (!catStr) return []
      const ids = new Set()
      const paths = catStr.split(',').map(c => c.trim()).filter(Boolean)
      for (const p of paths) {
        if (p === 'Uncategorized') continue
        // Try exact match first
        if (catPathToId.has(p)) {
          ids.add(catPathToId.get(p))
        } else {
          // Try matching the leaf name by slug
          const parts = p.split(' > ')
          const leaf = parts[parts.length - 1].trim()
          const slug = slugify(leaf)
          if (catBySlug.has(slug)) ids.add(catBySlug.get(slug))
        }
      }
      return [...ids]
    }

    // ========================================================================
    // Helper: unique product slug
    // ========================================================================
    function uniqueProductSlug(base) {
      let slug = slugify(base)
      if (!slug) slug = 'product'
      if (!productSlugs.has(slug)) { productSlugs.add(slug); return slug }
      let i = 2
      while (productSlugs.has(`${slug}-${i}`)) i++
      slug = `${slug}-${i}`
      productSlugs.add(slug)
      return slug
    }

    // ========================================================================
    // Helper: extract specifications from attributes
    // ========================================================================
    function extractSpecs(row) {
      const specs = []
      for (let i = 1; i <= 6; i++) {
        const name = row[`Attribuut ${i} naam`]
        const values = row[`Attribuut ${i} waarde(n)`]
        if (name && values) {
          specs.push({ name: name.trim(), value: values.trim() })
        }
      }
      return specs
    }

    // ========================================================================
    // Helper: insert a product + relationships
    // ========================================================================
    async function insertProduct(row, productType = 'simple') {
      const sku = (row.SKU || '').trim()
      if (!sku) return null
      if (productBySku.has(sku)) return productBySku.get(sku) // skip existing

      const title = (row.Naam || '').trim()
      if (!title) return null

      const slug = uniqueProductSlug(row['Custom URI'] || title)

      const price = parsePrice(row['Reguliere prijs'])
      const salePrice = parsePrice(row['Actieprijs'])
      const stock = parseStock(row['Voorraad'])
      const inStock = row['Op voorraad?'] === '1'
      const backorders = row['Nabestellingen toestaan?'] === 'notify' || row['Nabestellingen toestaan?'] === 'yes'
      const brandId = resolveBrandId(row.Merken)
      const categoryIds = resolveCategoryIds(row['Categorieën'])
      const ean = (row['GTIN, UPC, EAN of ISBN'] || '').trim() || null
      const shortDesc = stripHtml(row['Korte beschrijving'] || '').substring(0, 5000)
      const description = htmlToLexical(row.Beschrijving || '')
      const taxClass = mapTaxClass(row.Belastingklasse)
      const published = row.Gepubliceerd === '1'
      const imageUrl = (row.Afbeeldingen || '').trim() || null
      const specs = extractSpecs(row)

      // Determine stock status
      let stockStatus = 'in-stock'
      if (!inStock && stock <= 0) {
        stockStatus = backorders ? 'on-backorder' : 'out-of-stock'
      }

      const status = published ? 'published' : 'draft'

      if (DRY_RUN) {
        productBySku.set(sku, -productBySku.size - 1000)
        return productBySku.get(sku)
      }

      // Insert main product
      const result = await pool.query(
        `INSERT INTO products (
          title, slug, sku, ean, price, sale_price, stock, stock_status,
          track_stock, backorders_allowed, brand_id, short_description,
          description, tax_class, product_type, status, _status,
          featured, badge, condition, includes_tax,
          updated_at, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          true, $9, $10, $11,
          $12, $13, $14, $15, $16,
          false, 'none', 'new', false,
          $17, $17
        ) RETURNING id`,
        [
          title, slug, sku, ean, price, salePrice, stock, stockStatus,
          backorders, brandId, shortDesc,
          description ? JSON.stringify(description) : null,
          taxClass, productType, status, status === 'published' ? 'published' : 'draft',
          now,
        ]
      )
      const productId = result.rows[0].id
      productBySku.set(sku, productId)

      // Insert category relationships
      for (let i = 0; i < categoryIds.length; i++) {
        await pool.query(
          `INSERT INTO products_rels (parent_id, path, product_categories_id, "order")
           VALUES ($1, 'categories', $2, $3)`,
          [productId, categoryIds[i], i + 1]
        )
      }

      // Insert specifications
      if (specs.length > 0) {
        // Create one spec group "Specificaties"
        const specGroup = await pool.query(
          `INSERT INTO products_specifications (_order, _parent_id, id, "group")
           VALUES (1, $1, gen_random_uuid(), 'Specificaties') RETURNING id`,
          [productId]
        )
        for (let i = 0; i < specs.length; i++) {
          await pool.query(
            `INSERT INTO products_specifications_attributes (_order, _parent_id, id, name, value)
             VALUES ($1, $2, gen_random_uuid(), $3, $4)`,
            [i + 1, specGroup.rows[0].id, specs[i].name, specs[i].value]
          )
        }
      }

      // Store image URL as a tag for later processing (we don't download images now)
      if (imageUrl) {
        await pool.query(
          `INSERT INTO products_tags (_order, _parent_id, id, tag)
           VALUES (1, $1, gen_random_uuid(), $2)`,
          [productId, 'img:' + imageUrl]
        )
      }

      return productId
    }

    // ========================================================================
    // FASE 1: Simple standalone products
    // ========================================================================
    if (!FASE || FASE === '1') {
      console.log('\n=== Fase 1: Simple Products ===')
      let created = 0, skipped = 0, errors = 0
      const total = fase1Rows.length

      for (let i = 0; i < total; i++) {
        try {
          const id = await insertProduct(fase1Rows[i])
          if (id && !productBySku.has(fase1Rows[i].SKU?.trim())) {
            created++
          } else if (id) {
            created++
          } else {
            skipped++
          }
        } catch (err) {
          errors++
          if (errors <= 5) console.error(`  Error row ${i}: ${err.message}`)
        }

        if ((i + 1) % 500 === 0) {
          console.log(`  Progress: ${i + 1}/${total}`)
        }
      }
      // Recount
      const newCount = await pool.query('SELECT count(*) as c FROM products')
      console.log(`Fase 1 done. Products in DB: ${newCount.rows[0].c} (errors: ${errors})`)
    }

    // ========================================================================
    // FASE 2: Grouped products
    // ========================================================================
    if (!FASE || FASE === '2') {
      console.log('\n=== Fase 2: Grouped Product Children ===')

      // First import all children as simple products
      let childCreated = 0, childSkipped = 0, childErrors = 0
      for (let i = 0; i < fase2Children.length; i++) {
        try {
          const id = await insertProduct(fase2Children[i])
          if (id) childCreated++; else childSkipped++
        } catch (err) {
          childErrors++
          if (childErrors <= 5) console.error(`  Child error ${i}: ${err.message}`)
        }
        if ((i + 1) % 500 === 0) console.log(`  Children progress: ${i + 1}/${fase2Children.length}`)
      }
      console.log(`Children: ${childCreated} created/existing, ${childSkipped} skipped, ${childErrors} errors`)

      console.log('\n=== Fase 2: Grouped Parents ===')
      let parentCreated = 0, parentSkipped = 0, parentErrors = 0

      for (const parentRow of fase2Parents) {
        try {
          const parentId = await insertProduct(parentRow, 'grouped')
          if (!parentId) { parentSkipped++; continue }

          // Link child products via products_child_products table
          const childSkuField = parentRow['Gegroepeerde producten'] || ''
          const childSkus = childSkuField.split(',').map(s => s.trim()).filter(Boolean)

          if (!DRY_RUN && childSkus.length > 0) {
            for (let i = 0; i < childSkus.length; i++) {
              const childId = productBySku.get(childSkus[i])
              if (childId && childId > 0) {
                await pool.query(
                  `INSERT INTO products_child_products (_order, _parent_id, id, product_id, sort_order, is_default)
                   VALUES ($1, $2, gen_random_uuid(), $3, $4, $5)
                   ON CONFLICT DO NOTHING`,
                  [i + 1, parentId, childId, i, i === 0]
                )
              }
            }
          }
          parentCreated++
        } catch (err) {
          parentErrors++
          if (parentErrors <= 5) console.error(`  Parent error: ${err.message}`)
        }
      }
      console.log(`Parents: ${parentCreated} created, ${parentSkipped} skipped, ${parentErrors} errors`)
    }

    // ========================================================================
    // Summary
    // ========================================================================
    console.log('\n=== Final Summary ===')
    if (!DRY_RUN) {
      const totals = await pool.query(`
        SELECT
          count(*) as total,
          count(CASE WHEN product_type = 'simple' THEN 1 END) as simple,
          count(CASE WHEN product_type = 'grouped' THEN 1 END) as grouped,
          count(CASE WHEN status = 'published' THEN 1 END) as published
        FROM products
      `)
      const catCount = await pool.query('SELECT count(*) as c FROM product_categories')
      console.log(`Products: ${totals.rows[0].total} total (${totals.rows[0].simple} simple, ${totals.rows[0].grouped} grouped)`)
      console.log(`Published: ${totals.rows[0].published}`)
      console.log(`Categories: ${catCount.rows[0].c}`)
    } else {
      console.log('[DRY RUN] No changes made.')
    }

  } finally {
    await pool.end()
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
