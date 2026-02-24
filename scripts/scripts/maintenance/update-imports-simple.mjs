#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'

const DRY_RUN = process.argv.includes('--dry-run')

// Import path replacements
const replacements = [
  // Collections
  ['@/collections/Pages', '@/branches/shared/collections/Pages'],
  ['@/collections/Users', '@/branches/shared/collections/Users'],
  ['@/collections/shop/ProductCategories', '@/branches/ecommerce/collections/ProductCategories'],
  ['@/collections/shop/CustomerGroups', '@/branches/ecommerce/collections/CustomerGroups'],

  // Blocks
  ['@/blocks/CategoryGrid', '@/branches/ecommerce/blocks/CategoryGrid'],
  ['@/blocks/ProductGrid', '@/branches/ecommerce/blocks/ProductGrid'],
  ['@/blocks/ProductFilters', '@/branches/ecommerce/blocks/ProductFilters'],
  ['@/blocks/ProductEmbed', '@/branches/ecommerce/blocks/ProductEmbed'],
  ['@/blocks/SearchBar', '@/branches/ecommerce/blocks/SearchBar'],
  ['@/blocks/QuickOrder', '@/branches/ecommerce/blocks/QuickOrder'],
  ['@/blocks/TopBar', '@/branches/ecommerce/blocks/TopBar'],
  ['@/blocks/ComparisonTable', '@/branches/ecommerce/blocks/ComparisonTable'],

  // Components
  ['@/components/AddToCartButton', '@/branches/ecommerce/components/AddToCartButton'],
  ['@/components/ProductBadges', '@/branches/ecommerce/components/ProductBadges'],
  ['@/components/ProductDetailPage', '@/branches/ecommerce/components/ProductDetailPage'],
  ['@/components/ProductDetailWrapper', '@/branches/ecommerce/components/ProductDetailWrapper'],
  ['@/components/OrderStatus', '@/branches/ecommerce/components/OrderStatus'],
  ['@/components/CategoryPage', '@/branches/ecommerce/components/CategoryPage'],
  ['@/components/checkout', '@/branches/ecommerce/components/checkout'],
  ['@/components/addresses', '@/branches/ecommerce/components/addresses'],
  ['@/components/platform/', '@/branches/platform/components/'],

  // Contexts
  ['@/contexts/CartContext', '@/branches/ecommerce/contexts/CartContext'],

  // Platform
  ['@/platform/api/', '@/branches/platform/api/'],
  ['@/platform/integrations/', '@/branches/platform/integrations/'],
  ['@/platform/services/', '@/branches/platform/services/'],
  ['@/platform/components/', '@/branches/platform/components/'],
]

console.log('🔄 Updating import paths...\n')

if (DRY_RUN) {
  console.log('🔍 DRY RUN - No files will be modified\n')
}

// Find all TS/TSX files
const files = execSync('find src -type f \\( -name "*.ts" -o -name "*.tsx" \\)', { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(Boolean)

console.log(`Found ${files.length} files\n`)

let updatedFiles = 0
let totalReplacements = 0

files.forEach((file) => {
  let content = readFileSync(file, 'utf-8')
  let modified = false
  let replacementCount = 0

  replacements.forEach(([from, to]) => {
    if (content.includes(from)) {
      const before = content
      content = content.replaceAll(from, to)

      if (content !== before) {
        modified = true
        const count = (before.match(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
        replacementCount += count
        totalReplacements += count

        console.log(`  ✓ ${file}`)
        console.log(`    ${count}x: ${from} → ${to}`)
      }
    }
  })

  if (modified) {
    if (!DRY_RUN) {
      writeFileSync(file, content)
    }
    updatedFiles++
  }
})

console.log('\n' + '='.repeat(80))
console.log(`\n✨ ${DRY_RUN ? 'Would update' : 'Updated'} ${updatedFiles} files`)
console.log(`   Total replacements: ${totalReplacements}\n`)

if (DRY_RUN) {
  console.log('Run without --dry-run to apply changes\n')
} else {
  console.log('✅ Changes applied!\n')
  console.log('Next steps:')
  console.log('  1. npm run build')
  console.log('  2. Test the application')
  console.log('  3. Commit changes\n')
}
