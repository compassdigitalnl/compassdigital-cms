import fs from 'fs'
import { glob } from 'glob'

console.log('✅ Verifying imports...\n')

// Old patterns that should NOT exist anymore
const oldPatterns = [
  /@\/branches\/shared\/components\/Header[^/]/,
  /@\/branches\/shared\/components\/AlertBar(?!\.)/,
  /@\/branches\/shared\/components\/DynamicHeader/,
  /@\/branches\/shared\/components\/NavBar/,
  /@\/branches\/shared\/components\/MegaMenu/,
  /@\/branches\/shared\/components\/DynamicNav/,
  /@\/branches\/shared\/components\/Account[^/]/,
  /@\/branches\/shared\/components\/AccountNav[^/]/,
  /@\/branches\/shared\/components\/AI[^/]/,
  /@\/branches\/shared\/components\/Analytics[^/]/,
  /@\/branches\/shared\/components\/CategoryTabs/,
  /@\/branches\/shared\/components\/Price(?!\.)/,
  /@\/branches\/shared\/components\/BarcodeScanner/,
  /@\/branches\/shared\/components\/Newsletter[^/]/,
  /@\/branches\/shared\/components\/SiteGenerator[^/]/,
  /@\/branches\/shared\/components\/AdminBar[^/]/,
  /@\/branches\/shared\/components\/AdminLogo/,
  /@\/branches\/shared\/components\/BeforeDashboard/,
  /@\/branches\/shared\/components\/BeforeLogin/,
  /@\/branches\/shared\/components\/IconPicker(?!Field)/,
  /@\/branches\/shared\/components\/IconPickerField/,
  /@\/branches\/shared\/components\/SectionLabel/,
  /@\/branches\/shared\/components\/CollectionArchive/,
  /@\/branches\/shared\/components\/Icon(?!\.)/,
  /@\/branches\/shared\/components\/Link[^/]/,
  /@\/branches\/shared\/components\/Logo[^/]/,
  /@\/branches\/shared\/components\/Media[^/]/,
  /@\/branches\/shared\/components\/Message[^/]/,
  /@\/branches\/shared\/components\/RichText/,
  /@\/branches\/shared\/components\/LoadingSpinner/,
  /@\/branches\/shared\/components\/ErrorBoundary/,
  /@\/branches\/shared\/components\/LivePreviewListener/,
  /@\/branches\/shared\/components\/OptimizedImage/,
  /@\/branches\/shared\/components\/RenderParams/,
  /@\/branches\/shared\/components\/ThemeProvider/,
]

const files = await glob('src/**/*.{ts,tsx}', {
  ignore: ['**/node_modules/**', '**/.next/**']
})

let foundOldImports = false
const problemFiles = []

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8')

  for (const pattern of oldPatterns) {
    if (pattern.test(content)) {
      if (!problemFiles.includes(file)) {
        problemFiles.push(file)
      }
      foundOldImports = true
    }
  }
}

if (!foundOldImports) {
  console.log('✅ All imports migrated successfully!')
  console.log(`   Checked ${files.length} files\n`)
  process.exit(0)
} else {
  console.log('❌ Found old imports in the following files:\n')
  problemFiles.forEach(file => console.log(`   - ${file}`))
  console.log('\n⚠️  Run migration script again to fix these.\n')
  process.exit(1)
}
