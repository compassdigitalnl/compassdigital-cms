#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'

console.log('🔄 Updating shared blocks/components imports to branches/shared/\n')

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
  let changes = []

  // Replace @/blocks/ with @/branches/shared/blocks/
  if (content.includes("from '@/blocks/") || content.includes('from "@/blocks/')) {
    const before = content
    content = content
      .replace(/from ['"]@\/blocks\//g, "from '@/branches/shared/blocks/")

    if (content !== before) {
      modified = true
      const count = (before.match(/from ['"]@\/blocks\//g) || []).length
      changes.push({ type: 'blocks', count })
      totalReplacements += count
    }
  }

  // Replace @/components/ with @/branches/shared/components/
  if (content.includes("from '@/components/") || content.includes('from "@/components/')) {
    const before = content
    content = content
      .replace(/from ['"]@\/components\//g, "from '@/branches/shared/components/")

    if (content !== before) {
      modified = true
      const count = (before.match(/from ['"]@\/components\//g) || []).length
      changes.push({ type: 'components', count })
      totalReplacements += count
    }
  }

  if (modified) {
    writeFileSync(file, content)
    updatedFiles++

    const blocksCount = changes.find(c => c.type === 'blocks')?.count || 0
    const componentsCount = changes.find(c => c.type === 'components')?.count || 0

    console.log(`  ✓ ${file}`)
    if (blocksCount) console.log(`    ${blocksCount}x: @/blocks/ → @/branches/shared/blocks/`)
    if (componentsCount) console.log(`    ${componentsCount}x: @/components/ → @/branches/shared/components/`)
  }
})

console.log('\n' + '='.repeat(80))
console.log(`\n✨ Updated ${updatedFiles} files`)
console.log(`   Total replacements: ${totalReplacements}\n`)
console.log('✅ All imports updated to branches/shared/\n')
