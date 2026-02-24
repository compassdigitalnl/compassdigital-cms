#!/usr/bin/env node

/**
 * Import Path Update Script
 *
 * Automatically updates import paths after migrating files to the vertical slice architecture.
 *
 * This script handles:
 * - Collection imports (moved from src/collections/ to src/branches/*/collections/)
 * - Block imports (moved from src/blocks/ to src/branches/*/blocks/)
 * - Component imports (moved from src/components/ to src/branches/*/components/)
 * - Context imports (moved from src/contexts/ to src/branches/*/contexts/)
 * - Platform imports (moved from src/platform/ to src/branches/platform/)
 *
 * Usage: node scripts/update-imports.mjs [--dry-run]
 */

import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'

const DRY_RUN = process.argv.includes('--dry-run')

// Import path mappings (from → to)
const replacements = [
  // ─────────────────────────────────────────────────────────────────────────
  // Collections
  // ─────────────────────────────────────────────────────────────────────────
  {
    from: '@/collections/Pages',
    to: '@/branches/shared/collections/Pages',
    description: 'Pages collection → shared',
  },
  {
    from: '@/collections/Users',
    to: '@/branches/shared/collections/Users',
    description: 'Users collection → shared',
  },
  {
    from: '@/collections/shop/ProductCategories',
    to: '@/branches/ecommerce/collections/ProductCategories',
    description: 'ProductCategories → ecommerce',
  },
  {
    from: '@/collections/shop/CustomerGroups',
    to: '@/branches/ecommerce/collections/CustomerGroups',
    description: 'CustomerGroups → ecommerce',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Blocks (Ecommerce-specific)
  // ─────────────────────────────────────────────────────────────────────────
  {
    from: '@/blocks/CategoryGrid',
    to: '@/branches/ecommerce/blocks/CategoryGrid',
    description: 'CategoryGrid block → ecommerce',
  },
  {
    from: '@/blocks/ProductGrid',
    to: '@/branches/ecommerce/blocks/ProductGrid',
    description: 'ProductGrid block → ecommerce',
  },
  {
    from: '@/blocks/ProductFilters',
    to: '@/branches/ecommerce/blocks/ProductFilters',
    description: 'ProductFilters block → ecommerce',
  },
  {
    from: '@/blocks/ProductEmbed',
    to: '@/branches/ecommerce/blocks/ProductEmbed',
    description: 'ProductEmbed block → ecommerce',
  },
  {
    from: '@/blocks/SearchBar',
    to: '@/branches/ecommerce/blocks/SearchBar',
    description: 'SearchBar block → ecommerce',
  },
  {
    from: '@/blocks/QuickOrder',
    to: '@/branches/ecommerce/blocks/QuickOrder',
    description: 'QuickOrder block → ecommerce',
  },
  {
    from: '@/blocks/TopBar',
    to: '@/branches/ecommerce/blocks/TopBar',
    description: 'TopBar block → ecommerce',
  },
  {
    from: '@/blocks/ComparisonTable',
    to: '@/branches/ecommerce/blocks/ComparisonTable',
    description: 'ComparisonTable block → ecommerce',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Components (Ecommerce-specific)
  // ─────────────────────────────────────────────────────────────────────────
  {
    from: '@/components/AddToCartButton',
    to: '@/branches/ecommerce/components/AddToCartButton',
    description: 'AddToCartButton → ecommerce',
  },
  {
    from: '@/components/ProductBadges',
    to: '@/branches/ecommerce/components/ProductBadges',
    description: 'ProductBadges → ecommerce',
  },
  {
    from: '@/components/ProductDetailPage',
    to: '@/branches/ecommerce/components/ProductDetailPage',
    description: 'ProductDetailPage → ecommerce',
  },
  {
    from: '@/components/ProductDetailWrapper',
    to: '@/branches/ecommerce/components/ProductDetailWrapper',
    description: 'ProductDetailWrapper → ecommerce',
  },
  {
    from: '@/components/OrderStatus',
    to: '@/branches/ecommerce/components/OrderStatus',
    description: 'OrderStatus → ecommerce',
  },
  {
    from: '@/components/CategoryPage',
    to: '@/branches/ecommerce/components/CategoryPage',
    description: 'CategoryPage → ecommerce',
  },
  {
    from: '@/components/checkout',
    to: '@/branches/ecommerce/components/checkout',
    description: 'checkout components → ecommerce',
  },
  {
    from: '@/components/addresses',
    to: '@/branches/ecommerce/components/addresses',
    description: 'addresses components → ecommerce',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Components (Platform-specific)
  // ─────────────────────────────────────────────────────────────────────────
  {
    from: '@/components/platform/',
    to: '@/branches/platform/components/',
    description: 'platform components → platform branch',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Contexts
  // ─────────────────────────────────────────────────────────────────────────
  {
    from: '@/contexts/CartContext',
    to: '@/branches/ecommerce/contexts/CartContext',
    description: 'CartContext → ecommerce',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Platform (moved to branches/platform/)
  // ─────────────────────────────────────────────────────────────────────────
  {
    from: '@/platform/api/',
    to: '@/branches/platform/api/',
    description: 'platform API → platform branch',
  },
  {
    from: '@/platform/integrations/',
    to: '@/branches/platform/integrations/',
    description: 'platform integrations → platform branch',
  },
  {
    from: '@/platform/services/',
    to: '@/branches/platform/services/',
    description: 'platform services → platform branch',
  },
  {
    from: '@/platform/components/',
    to: '@/branches/platform/components/',
    description: 'platform components → platform branch',
  },
]

console.log('🔄 Import Path Update Script\n')
console.log('=' .repeat(80))

if (DRY_RUN) {
  console.log('🔍 DRY RUN MODE - No files will be modified\n')
}

console.log(`Found ${replacements.length} import path mappings\n`)

// Find all TypeScript/TSX files
console.log('📁 Finding all TypeScript files...')
const files = execSync('find src -type f \\( -name "*.ts" -o -name "*.tsx" \\) ! -path "*/node_modules/*"', {
  encoding: 'utf-8',
})
  .trim()
  .split('\n')
  .filter((f) => f.length > 0)

console.log(`   Found ${files.length} files\n`)

let totalUpdatedFiles = 0
let totalReplacements = 0
const fileChanges = []

files.forEach((file) => {
  let content = readFileSync(file, 'utf-8')
  let modified = false
  const changes = []

  replacements.forEach(({ from, to, description }) => {
    // Escape special regex characters
    const escapedFrom = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escapedFrom, 'g')

    if (content.includes(from)) {
      const matches = content.match(regex)
      if (matches) {
        content = content.replace(regex, to)
        modified = true
        changes.push({
          from,
          to,
          count: matches.length,
          description,
        })
        totalReplacements += matches.length
      }
    }
  })

  if (modified) {
    if (!DRY_RUN) {
      writeFileSync(file, content)
    }
    totalUpdatedFiles++
    fileChanges.push({ file, changes })
  }
})

// Print detailed results
console.log('📝 Changes Summary:\n')

if (fileChanges.length === 0) {
  console.log('   ✨ No changes needed - all imports are already up to date!\n')
} else {
  fileChanges.forEach(({ file, changes }) => {
    console.log(`   📄 ${file}`)
    changes.forEach(({ from, to, count, description }) => {
      console.log(`      ${count}x: ${description}`)
      console.log(`          ${from}`)
      console.log(`       → ${to}`)
    })
    console.log('')
  })

  console.log('=' .repeat(80))
  console.log(`\n✨ ${DRY_RUN ? 'Would update' : 'Updated'} ${totalUpdatedFiles} file${totalUpdatedFiles !== 1 ? 's' : ''}`)
  console.log(`   Total replacements: ${totalReplacements}\n`)

  if (DRY_RUN) {
    console.log('   Run without --dry-run to apply changes\n')
  } else {
    console.log('   ✅ Changes applied successfully!\n')
    console.log('   Next steps:')
    console.log('   1. Run: npm run typecheck')
    console.log('   2. Run: npm run build')
    console.log('   3. Test the application')
    console.log('   4. Commit changes\n')
  }
}

// Check for any remaining old imports
if (!DRY_RUN && totalUpdatedFiles > 0) {
  console.log('🔍 Checking for any remaining old imports...\n')

  const oldPatterns = [
    '@/collections/Pages',
    '@/collections/Users',
    '@/collections/shop/',
    '@/contexts/CartContext',
    '@/platform/',
  ]

  let remainingIssues = false

  oldPatterns.forEach((pattern) => {
    try {
      const escapedPattern = pattern.replace(/\//g, '\\/')
      const cmd = `grep -r "${escapedPattern}" src/ --include="*.ts" --include="*.tsx" 2>/dev/null || true`
      const result = execSync(cmd, { encoding: 'utf-8' }).trim()

      if (result) {
        console.log(`   ⚠️  Found remaining references to: ${pattern}`)
        console.log(result)
        console.log('')
        remainingIssues = true
      }
    } catch (e) {
      // Ignore errors
    }
  })

  if (!remainingIssues) {
    console.log('   ✅ No remaining old imports found!\n')
  } else {
    console.log('   ⚠️  Some old imports still exist. Manual review recommended.\n')
  }
}

console.log('=' .repeat(80))
console.log('\n✅ Import update complete!\n')
