import fs from 'fs'
import { glob } from 'glob'

console.log('🔄 Starting import migration...\n')

// Load migration map
const migrationMap = JSON.parse(
  fs.readFileSync('./migration-map.json', 'utf-8')
)

// Find all TS/TSX files
const files = await glob('src/**/*.{ts,tsx}', {
  ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**']
})

console.log(`📁 Found ${files.length} files to process\n`)

let totalChanges = 0
let filesChanged = 0

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8')
  let newContent = content
  let fileHasChanges = false

  // Replace all old imports with new ones
  for (const [oldPath, newPath] of Object.entries(migrationMap)) {
    // Create regex that matches the exact path in import statements
    const regex = new RegExp(
      `(from\\s+['"])${oldPath.replace(/\//g, '\\/')}(['"])`,
      'g'
    )

    if (regex.test(newContent)) {
      newContent = newContent.replace(regex, `$1${newPath}$2`)
      fileHasChanges = true
      totalChanges++
    }
  }

  // Only write if changed
  if (newContent !== content) {
    fs.writeFileSync(file, newContent)
    filesChanged++
    console.log(`✅ Updated: ${file}`)
  }
}

console.log(`\n🎉 Migration complete!`)
console.log(`   ${totalChanges} imports updated`)
console.log(`   ${filesChanged} files changed\n`)
