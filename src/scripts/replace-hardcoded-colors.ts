#!/usr/bin/env tsx
/**
 * Script to replace hardcoded hex colors with CSS variables in template files
 *
 * Color mapping:
 * - #F5F7FA, #F9FAFB → var(--color-surface)
 * - #E8ECF1 → var(--color-border)
 * - #00897B, #26A69A → var(--color-primary)
 * - #0A1628 → var(--color-text-primary)
 * - #94A3B8 → var(--color-text-muted)
 * - #64748B → var(--color-text-secondary)
 * - #00C853 → var(--color-success)
 * - #2196F3 → var(--color-info)
 * - #F59E0B → var(--color-warning)
 * - #EF4444 → var(--color-error)
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const COLOR_MAPPINGS: Record<string, string> = {
  // Backgrounds
  '#F5F7FA': 'var(--color-surface)',
  '#F9FAFB': 'var(--color-surface)',
  '#E8ECF1': 'var(--color-border)',

  // Primary colors
  '#00897B': 'var(--color-primary)',
  '#26A69A': 'var(--color-primary)',

  // Text colors
  '#0A1628': 'var(--color-text-primary)',
  '#94A3B8': 'var(--color-text-muted)',
  '#64748B': 'var(--color-text-secondary)',

  // Semantic colors
  '#00C853': 'var(--color-success)',
  '#E8F5E9': 'var(--color-success-bg)',
  '#2196F3': 'var(--color-info)',
  '#E3F2FD': 'var(--color-info-bg)',
  '#F59E0B': 'var(--color-warning)',
  '#FFF8E1': 'var(--color-warning-bg)',
  '#EF4444': 'var(--color-error)',
  '#FEE2E2': 'var(--color-error-bg)',

  // Additional colors
  '#90CAF9': 'rgba(33, 150, 243, 0.4)',
  '#A5D6A7': 'rgba(0, 200, 83, 0.4)',
  '#FFE082': 'rgba(245, 158, 11, 0.4)',
}

// Fonts to replace
const FONT_MAPPINGS: Record<string, string> = {
  'Plus Jakarta Sans, sans-serif': 'var(--font-heading)',
  'DM Sans, sans-serif': 'var(--font-body)',
}

// Special patterns (gradients, rgba, etc)
const SPECIAL_PATTERNS = [
  {
    pattern: /linear-gradient\(135deg,\s*#00897B,\s*#26A69A\)/gi,
    replacement: 'var(--color-primary)',
  },
  {
    pattern: /linear-gradient\(90deg,\s*#00897B,\s*#26A69A\)/gi,
    replacement: 'var(--color-primary)',
  },
  {
    pattern: /rgba\(0,\s*137,\s*123,\s*0\.\d+\)/gi,
    replacement: (match: string) => {
      const opacity = match.match(/0\.\d+/)?.[0] || '0.1'
      return `color-mix(in srgb, var(--color-primary) ${parseFloat(opacity) * 100}%, transparent)`
    },
  },
  {
    pattern: /'0\s+4px\s+20px\s+rgba\(0,\s*137,\s*123,\s*0\.\d+\)'/gi,
    replacement: 'var(--shadow)',
  },
]

function replaceColorsInFile(filePath: string): void {
  console.log(`\n📝 Processing: ${path.basename(filePath)}`)

  let content = fs.readFileSync(filePath, 'utf-8')
  let replacements = 0

  // Replace special patterns first
  for (const { pattern, replacement } of SPECIAL_PATTERNS) {
    const matches = content.match(pattern)
    if (matches) {
      if (typeof replacement === 'function') {
        content = content.replace(pattern, replacement as any)
      } else {
        content = content.replace(pattern, replacement)
      }
      replacements += matches.length
      console.log(`  ✓ Replaced ${matches.length} special pattern(s)`)
    }
  }

  // Replace hex colors
  for (const [hex, cssVar] of Object.entries(COLOR_MAPPINGS)) {
    const regex = new RegExp(hex, 'gi')
    const matches = content.match(regex)
    if (matches) {
      content = content.replace(regex, cssVar)
      replacements += matches.length
      console.log(`  ✓ Replaced ${matches.length}x ${hex} → ${cssVar}`)
    }
  }

  // Replace fonts
  for (const [font, cssVar] of Object.entries(FONT_MAPPINGS)) {
    const regex = new RegExp(font.replace(/[()]/g, '\\$&'), 'gi')
    const matches = content.match(regex)
    if (matches) {
      content = content.replace(regex, cssVar)
      replacements += matches.length
      console.log(`  ✓ Replaced ${matches.length}x font → ${cssVar}`)
    }
  }

  // Write back
  if (replacements > 0) {
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`✅ Total replacements: ${replacements}`)
  } else {
    console.log(`⏭️  No replacements needed`)
  }
}

function main() {
  const templatesDir = path.join(__dirname, '../app/(app)')

  const files = [
    // Cart
    path.join(templatesDir, 'cart/CartTemplate1.tsx'),

    // Products
    path.join(templatesDir, 'shop/[slug]/ProductTemplate1.tsx'),
    path.join(templatesDir, 'shop/[slug]/ProductTemplate2.tsx'),
    path.join(templatesDir, 'shop/[slug]/ProductTemplate3.tsx'),

    // Shop Archive
    path.join(templatesDir, 'shop/ShopArchiveTemplate1.tsx'),

    // Checkout
    path.join(templatesDir, 'checkout/CheckoutTemplate1.tsx'),

    // My Account
    path.join(templatesDir, 'my-account/MyAccountTemplate1.tsx'),

    // Blog
    path.join(templatesDir, 'blog/[category]/[slug]/BlogTemplate1.tsx'),
    path.join(templatesDir, 'blog/[category]/[slug]/BlogTemplate2.tsx'),
    path.join(templatesDir, 'blog/[category]/[slug]/BlogTemplate3.tsx'),
  ]

  console.log('🎨 Replacing hardcoded colors with CSS variables...\n')
  console.log(`📂 Processing ${files.length} template files\n`)

  let totalReplacements = 0

  for (const file of files) {
    if (fs.existsSync(file)) {
      replaceColorsInFile(file)
    } else {
      console.log(`⚠️  File not found: ${path.basename(file)}`)
    }
  }

  console.log('\n✨ Done! All hardcoded colors have been replaced with CSS variables.')
}

main()
