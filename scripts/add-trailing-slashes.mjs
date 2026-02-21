#!/usr/bin/env node
/**
 * Add Trailing Slashes to all href attributes
 *
 * Finds all hrefs without trailing slashes and adds them.
 * Skips:
 * - External URLs (http://, https://, //)
 * - Anchors (#)
 * - Query strings (?)
 * - File extensions (.pdf, .zip, etc.)
 * - Already has trailing slash
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const srcDir = path.join(__dirname, '..', 'src')

let filesModified = 0
let linksUpdated = 0

function shouldAddTrailingSlash(href) {
  // Skip if empty or just /
  if (!href || href === '/') return false

  // Skip if already has trailing slash
  if (href.endsWith('/')) return false

  // Skip if external URL
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) return false

  // Skip if anchor or query string
  if (href.includes('#') || href.includes('?')) return false

  // Skip if has file extension
  if (/\.\w+$/.test(href)) return false

  // Must be internal path without trailing slash
  return href.startsWith('/')
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  let modified = false
  let newContent = content

  // Pattern 1: href="/something"
  newContent = newContent.replace(/href=["']([^"']+)["']/g, (match, href) => {
    if (shouldAddTrailingSlash(href)) {
      linksUpdated++
      modified = true
      const quote = match.includes('"') ? '"' : "'"
      return `href=${quote}${href}/${quote}`
    }
    return match
  })

  if (modified) {
    fs.writeFileSync(filePath, newContent, 'utf-8')
    filesModified++
    console.log(`✅ Updated: ${filePath.replace(srcDir, 'src')}`)
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      // Skip node_modules, .next, etc.
      if (['node_modules', '.next', 'dist', 'build'].includes(file)) continue
      walkDir(filePath)
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
      processFile(filePath)
    }
  }
}

console.log('🔍 Scanning for hrefs without trailing slashes...\n')
walkDir(srcDir)

console.log('\n' + '='.repeat(60))
console.log(`✅ Done! Updated ${linksUpdated} links in ${filesModified} files`)
console.log('='.repeat(60))
