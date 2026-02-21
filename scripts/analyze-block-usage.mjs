#!/usr/bin/env node

/**
 * Block Usage Analysis Script
 *
 * Analyzes the usage of all blocks in the codebase to help identify:
 * - Unused blocks (can be removed)
 * - Rarely used blocks (evaluate if needed)
 * - Actively used blocks (keep)
 *
 * Usage: node scripts/analyze-block-usage.mjs
 */

import { execSync } from 'child_process'
import { existsSync, readdirSync } from 'fs'
import { join } from 'path'

const BLOCKS_DIR = 'src/blocks'

console.log('🔍 Block Usage Analysis\n')
console.log('=' .repeat(80))

// Get all block directories
const blockDirs = readdirSync(BLOCKS_DIR, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)

console.log(`Found ${blockDirs.length} blocks in ${BLOCKS_DIR}/\n`)

const results = []

blockDirs.forEach((blockName) => {
  try {
    // Search for blockType references (most common pattern)
    const blockTypePattern = `blockType.*${blockName.charAt(0).toLowerCase() + blockName.slice(1)}`
    const cmd = `grep -r "${blockTypePattern}" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l`
    const blockTypeCount = parseInt(execSync(cmd, { encoding: 'utf-8' }).trim())

    // Also search for direct imports
    const importPattern = `from.*blocks/${blockName}`
    const importCmd = `grep -r "${importPattern}" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l`
    const importCount = parseInt(execSync(importCmd, { encoding: 'utf-8' }).trim())

    const totalUsage = blockTypeCount + importCount

    let status = '✅ Active'
    let recommendation = 'Keep'

    if (totalUsage === 0) {
      status = '❌ Unused'
      recommendation = 'REMOVE'
    } else if (totalUsage <= 2) {
      status = '⚠️  Rarely used'
      recommendation = 'Evaluate'
    } else if (totalUsage >= 10) {
      status = '🔥 Heavily used'
      recommendation = 'Keep (critical)'
    }

    // Check block size
    let lineCount = 0
    const componentPath = join(BLOCKS_DIR, blockName, 'Component.tsx')
    if (existsSync(componentPath)) {
      const wcCmd = `wc -l ${componentPath} 2>/dev/null | awk '{print $1}'`
      lineCount = parseInt(execSync(wcCmd, { encoding: 'utf-8' }).trim()) || 0
    }

    results.push({
      block: blockName,
      usage: totalUsage,
      lines: lineCount,
      status,
      recommendation,
    })
  } catch (e) {
    results.push({
      block: blockName,
      usage: 0,
      lines: 0,
      status: '❓ Error',
      recommendation: 'Check manually',
    })
  }
})

// Sort by usage count (descending)
results.sort((a, b) => b.usage - a.usage)

// Print table
console.log('Block Name              | Usage | Lines | Status          | Recommendation')
console.log('------------------------|-------|-------|-----------------|------------------')

results.forEach(({ block, usage, lines, status, recommendation }) => {
  const paddedBlock = block.padEnd(23)
  const paddedUsage = usage.toString().padEnd(5)
  const paddedLines = lines.toString().padEnd(5)
  const paddedStatus = status.padEnd(15)
  console.log(`${paddedBlock} | ${paddedUsage} | ${paddedLines} | ${paddedStatus} | ${recommendation}`)
})

// Summary
console.log('\n' + '='.repeat(80))
console.log('\n📊 Summary:\n')

const unused = results.filter((r) => r.usage === 0)
const rarely = results.filter((r) => r.usage > 0 && r.usage <= 2)
const active = results.filter((r) => r.usage > 2 && r.usage < 10)
const heavy = results.filter((r) => r.usage >= 10)

console.log(`  🔥 Heavily used:  ${heavy.length} blocks (>= 10 usages)`)
console.log(`  ✅ Active:        ${active.length} blocks (3-9 usages)`)
console.log(`  ⚠️  Rarely used:  ${rarely.length} blocks (1-2 usages)`)
console.log(`  ❌ Unused:        ${unused.length} blocks (0 usages)`)

console.log(`\n  Total blocks:    ${results.length}`)
const totalLines = results.reduce((sum, r) => sum + r.lines, 0)
console.log(`  Total lines:     ${totalLines.toLocaleString()}`)

// Recommendations
console.log('\n📋 Recommendations:\n')

if (unused.length > 0) {
  console.log(`  ❌ REMOVE (${unused.length} blocks):`)
  unused.forEach(({ block, lines }) => {
    console.log(`     - ${block} (${lines} lines)`)
  })
  const unusedLines = unused.reduce((sum, r) => sum + r.lines, 0)
  console.log(`     → Potential savings: ${unusedLines} lines\n`)
}

if (rarely.length > 0) {
  console.log(`  ⚠️  EVALUATE (${rarely.length} blocks):`)
  rarely.forEach(({ block, usage, lines }) => {
    console.log(`     - ${block} (${usage} usage${usage !== 1 ? 's' : ''}, ${lines} lines)`)
  })
  console.log(`     → Check if these are truly needed\n`)
}

console.log(`  ✅ KEEP (${active.length + heavy.length} blocks):`)
console.log(`     → Actively used blocks should remain\n`)

// Ecommerce-specific blocks
const ecommerceBlocks = [
  'ProductGrid',
  'ProductFilters',
  'SearchBar',
  'QuickOrder',
  'CategoryGrid',
  'ProductEmbed',
  'TopBar',
  'ComparisonTable',
]

const foundEcommerceBlocks = results.filter((r) => ecommerceBlocks.includes(r.block))

if (foundEcommerceBlocks.length > 0) {
  console.log('🔵 ECOMMERCE BLOCKS (move to branches/ecommerce/blocks/):\n')
  foundEcommerceBlocks.forEach(({ block, usage, lines }) => {
    console.log(`   - ${block} (${usage} usage${usage !== 1 ? 's' : ''}, ${lines} lines)`)
  })
  const ecommerceLines = foundEcommerceBlocks.reduce((sum, r) => sum + r.lines, 0)
  console.log(`   → Total: ${foundEcommerceBlocks.length} blocks, ${ecommerceLines} lines\n`)
}

console.log('=' .repeat(80))
console.log('\n✨ Analysis complete!\n')
console.log('Next steps:')
console.log('  1. Review unused blocks and remove them')
console.log('  2. Evaluate rarely used blocks')
console.log('  3. Move ecommerce blocks to branches/ecommerce/blocks/')
console.log('  4. Update imports after moving blocks')
console.log('\nSee: docs/SRC-CLEANUP-MASTER-PLAN.md for detailed migration plan\n')
