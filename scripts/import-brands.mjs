/**
 * Import brands with hierarchy from WooCommerce export analysis
 *
 * Reads merken-hierarchie-overzicht.csv and creates:
 * - Manufacturers (level 0, no parent)
 * - Product lines (level 1, with parent_id)
 *
 * Idempotent: skips brands that already exist (matched by name).
 *
 * Usage: node scripts/import-brands.mjs [--dry-run]
 */
import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_URL = 'postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/client_plastimed01'
const CSV_PATH = path.join(__dirname, '../docs/clients/plastimed/import/merken-hierarchie-overzicht.csv')
const DRY_RUN = process.argv.includes('--dry-run')

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function main() {
  if (DRY_RUN) console.log('[DRY RUN] No changes will be made.\n')

  // Parse CSV
  const csv = fs.readFileSync(CSV_PATH, 'utf8')
  const lines = csv.trim().split('\n').slice(1) // skip header

  // Build hierarchy map: manufacturer -> [product lines]
  const manufacturers = new Map() // name -> { productLines: [{name, products}] }
  for (const line of lines) {
    // CSV format: Fabrikant,Productlijn,Aantal producten
    const match = line.match(/^([^,]+),([^,]+),(\d+)$/)
    if (!match) continue
    const [, fab, pl, count] = match

    if (!manufacturers.has(fab)) {
      manufacturers.set(fab, { productLines: [] })
    }
    if (pl !== '(geen productlijn)') {
      manufacturers.get(fab).productLines.push({ name: pl, products: parseInt(count) })
    }
  }

  console.log(`Parsed: ${manufacturers.size} manufacturers, ${[...manufacturers.values()].reduce((s, m) => s + m.productLines.length, 0)} product lines\n`)

  const pool = new pg.Pool({ connectionString: DB_URL })

  try {
    // Get existing brands
    const existing = await pool.query('SELECT id, name, slug FROM brands')
    const existingByName = new Map(existing.rows.map(r => [r.name.toLowerCase(), r]))
    const existingBySlugs = new Set(existing.rows.map(r => r.slug))
    console.log(`Existing brands in DB: ${existing.rows.length}\n`)

    let created = 0
    let skipped = 0
    const now = new Date().toISOString()

    // Ensure unique slugs
    function uniqueSlug(base) {
      let slug = slugify(base)
      if (!existingBySlugs.has(slug)) {
        existingBySlugs.add(slug)
        return slug
      }
      let i = 2
      while (existingBySlugs.has(`${slug}-${i}`)) i++
      slug = `${slug}-${i}`
      existingBySlugs.add(slug)
      return slug
    }

    // Phase 1: Create manufacturers (level 0)
    console.log('--- Phase 1: Manufacturers (level 0) ---')
    const manufacturerIds = new Map() // name -> id

    for (const [name] of manufacturers) {
      const key = name.toLowerCase()
      if (existingByName.has(key)) {
        const existing = existingByName.get(key)
        manufacturerIds.set(name, existing.id)
        // Update existing brand to level 0 if needed
        if (!DRY_RUN) {
          await pool.query('UPDATE brands SET level = 0, visible = true WHERE id = $1 AND (level IS NULL OR level != 0)', [existing.id])
        }
        skipped++
        continue
      }

      const slug = uniqueSlug(name)

      if (DRY_RUN) {
        console.log(`  [CREATE] ${name} (slug: ${slug})`)
        manufacturerIds.set(name, -1)
      } else {
        const result = await pool.query(
          `INSERT INTO brands (name, slug, level, visible, featured, "order", updated_at, created_at)
           VALUES ($1, $2, 0, true, false, 0, $3, $3)
           RETURNING id`,
          [name, slug, now]
        )
        manufacturerIds.set(name, result.rows[0].id)
        existingByName.set(key, { id: result.rows[0].id, name, slug })
      }
      created++
    }
    console.log(`  Manufacturers: ${created} created, ${skipped} skipped\n`)

    // Phase 2: Create product lines (level 1)
    console.log('--- Phase 2: Product Lines (level 1) ---')
    let plCreated = 0
    let plSkipped = 0

    for (const [fabName, data] of manufacturers) {
      const parentId = manufacturerIds.get(fabName)

      for (const pl of data.productLines) {
        const key = pl.name.toLowerCase()
        if (existingByName.has(key)) {
          const existing = existingByName.get(key)
          // Update existing to set parent and level if needed
          if (!DRY_RUN && parentId > 0) {
            await pool.query(
              'UPDATE brands SET parent_id = $1, level = 1, visible = true WHERE id = $2 AND parent_id IS NULL',
              [parentId, existing.id]
            )
          }
          plSkipped++
          continue
        }

        const slug = uniqueSlug(pl.name)

        if (DRY_RUN) {
          console.log(`  [CREATE] ${pl.name} → parent: ${fabName} (${pl.products} products)`)
        } else {
          const result = await pool.query(
            `INSERT INTO brands (name, slug, parent_id, level, visible, featured, "order", updated_at, created_at)
             VALUES ($1, $2, $3, 1, true, false, 0, $4, $4)
             RETURNING id`,
            [pl.name, slug, parentId, now]
          )
          existingByName.set(key, { id: result.rows[0].id, name: pl.name, slug })
        }
        plCreated++
      }
    }
    console.log(`  Product lines: ${plCreated} created, ${plSkipped} skipped\n`)

    // Summary
    const total = await pool.query('SELECT count(*) as total, count(parent_id) as with_parent FROM brands')
    console.log('=== Summary ===')
    console.log(`Created: ${created + plCreated} (${created} manufacturers + ${plCreated} product lines)`)
    console.log(`Skipped: ${skipped + plSkipped}`)
    if (!DRY_RUN) {
      console.log(`Total brands in DB: ${total.rows[0].total} (${total.rows[0].with_parent} with parent)`)
    }
  } finally {
    await pool.end()
  }
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
