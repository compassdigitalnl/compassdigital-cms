/**
 * Migration Script: Vertical Slice Architecture
 *
 * This script migrates the codebase from flat structure to vertical slices:
 * - src/collections/* → src/branches/{branch}/collections/*
 * - Creates backward-compatible symlinks
 * - Updates imports across the codebase
 *
 * Usage:
 *   npx tsx src/scripts/migrate-to-branches.ts --dry-run      # Preview changes
 *   npx tsx src/scripts/migrate-to-branches.ts --collection products  # Migrate single collection
 *   npx tsx src/scripts/migrate-to-branches.ts --branch ecommerce     # Migrate entire branch
 *   npx tsx src/scripts/migrate-to-branches.ts --all                  # Migrate everything
 *   npx tsx src/scripts/migrate-to-branches.ts --rollback             # Rollback migration
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

// ES module compatibility
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
}

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  step: (msg: string) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}`),
}

// Branch mapping - defines which collections belong to which branch
const BRANCH_MAPPINGS = {
  ecommerce: {
    collections: [
      'Products',
      'ProductCategories',
      'Orders',
      'Carts',
      'CustomerGroups',
      'Brands',
      'Invoices',
      'RecentlyViewed',
      'Returns',
      'RecurringOrders',
      'OrderLists',
      'SubscriptionPlans',
      'UserSubscriptions',
      'PaymentMethods',
      'GiftVouchers',
      'Licenses',
      'LicenseActivations',
      'LoyaltyTiers',
      'LoyaltyRewards',
      'LoyaltyPoints',
      'LoyaltyRedemptions',
      'LoyaltyTransactions',
    ],
  },
  marketplace: {
    collections: ['Vendors', 'VendorReviews', 'Workshops'],
  },
  content: {
    collections: ['BlogPosts', 'BlogCategories', 'FAQs', 'Testimonials', 'Cases'],
  },
  shared: {
    collections: ['Pages', 'Media', 'Users', 'Partners', 'ServicesCollection', 'Notifications', 'FormSubmissions'],
  },
  platform: {
    collections: ['Clients', 'ClientRequests', 'PlatformAdmins'],
    skipMigration: true, // Platform collections stay in platform/collections
  },
} as const

type Branch = keyof typeof BRANCH_MAPPINGS

interface MigrationOptions {
  dryRun: boolean
  collection?: string
  branch?: Branch
  all: boolean
  rollback: boolean
}

interface MigrationLog {
  timestamp: string
  actions: Array<{
    type: 'move' | 'symlink' | 'mkdir' | 'update'
    source?: string
    target?: string
    description: string
  }>
}

const PROJECT_ROOT = path.resolve(__dirname, '../..')
const MIGRATION_LOG_FILE = path.join(PROJECT_ROOT, '.migration-log.json')

class BranchMigrator {
  private options: MigrationOptions
  private log: MigrationLog

  constructor(options: MigrationOptions) {
    this.options = options
    this.log = {
      timestamp: new Date().toISOString(),
      actions: [],
    }
  }

  async migrate() {
    if (this.options.rollback) {
      return this.rollback()
    }

    log.step('🚀 Starting Branch Migration')
    log.info(`Mode: ${this.options.dryRun ? 'DRY RUN (no changes)' : 'LIVE'}`)

    // Determine what to migrate
    if (this.options.collection) {
      await this.migrateCollection(this.options.collection)
    } else if (this.options.branch) {
      await this.migrateBranch(this.options.branch)
    } else if (this.options.all) {
      await this.migrateAll()
    } else {
      log.error('No migration target specified. Use --collection, --branch, or --all')
      process.exit(1)
    }

    // Save migration log
    if (!this.options.dryRun) {
      this.saveMigrationLog()
      log.success('Migration log saved to .migration-log.json')
    }

    log.step('✨ Migration complete!')
    log.info('Next steps:')
    log.info('  1. Review changes with: git status')
    log.info('  2. Update payload.config.ts imports')
    log.info('  3. Run: npm run typecheck')
    log.info('  4. Run: npm run build')
    log.info('  5. If issues occur, rollback with: npm run migrate:rollback')
  }

  private async migrateAll() {
    for (const branch of Object.keys(BRANCH_MAPPINGS) as Branch[]) {
      const config = BRANCH_MAPPINGS[branch]
      if (config.skipMigration) {
        log.warning(`Skipping ${branch} (stays in current location)`)
        continue
      }
      await this.migrateBranch(branch)
    }
  }

  private async migrateBranch(branch: Branch) {
    log.step(`📦 Migrating ${branch} branch`)

    const config = BRANCH_MAPPINGS[branch]
    if (config.skipMigration) {
      log.warning(`Skipping ${branch} (configured to stay in place)`)
      return
    }

    // Create branch directory structure
    await this.createBranchStructure(branch)

    // Migrate each collection in the branch
    for (const collection of config.collections) {
      await this.migrateCollection(collection, branch)
    }
  }

  private async createBranchStructure(branch: Branch) {
    const branchDir = path.join(PROJECT_ROOT, 'src/branches', branch)
    const dirs = [
      branchDir,
      path.join(branchDir, 'collections'),
      path.join(branchDir, 'components'),
      path.join(branchDir, 'lib'),
    ]

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        log.info(`Creating directory: ${path.relative(PROJECT_ROOT, dir)}`)
        if (!this.options.dryRun) {
          fs.mkdirSync(dir, { recursive: true })
        }
        this.log.actions.push({
          type: 'mkdir',
          target: dir,
          description: `Created directory: ${path.relative(PROJECT_ROOT, dir)}`,
        })
      }
    }

    // Create index.ts for the branch
    const indexPath = path.join(branchDir, 'index.ts')
    if (!fs.existsSync(indexPath)) {
      const indexContent = this.generateBranchIndex(branch)
      log.info(`Creating index: ${path.relative(PROJECT_ROOT, indexPath)}`)
      if (!this.options.dryRun) {
        fs.writeFileSync(indexPath, indexContent)
      }
      this.log.actions.push({
        type: 'mkdir',
        target: indexPath,
        description: `Created branch index: ${path.relative(PROJECT_ROOT, indexPath)}`,
      })
    }
  }

  private async migrateCollection(collectionName: string, forceBranch?: Branch) {
    // Find which branch this collection belongs to
    const branch =
      forceBranch || this.findBranchForCollection(collectionName)

    if (!branch) {
      log.error(`Collection "${collectionName}" not found in any branch mapping`)
      return
    }

    const config = BRANCH_MAPPINGS[branch]
    if (config.skipMigration) {
      log.warning(`Skipping ${collectionName} (${branch} stays in place)`)
      return
    }

    log.info(`Migrating ${collectionName} → ${branch}/collections/`)

    const sourcePath = path.join(PROJECT_ROOT, 'src/collections', `${collectionName}.ts`)
    const targetDir = path.join(PROJECT_ROOT, 'src/branches', branch, 'collections')
    const targetPath = path.join(targetDir, `${collectionName}.ts`)
    const symlinkPath = sourcePath

    // Check if source exists
    if (!fs.existsSync(sourcePath)) {
      log.warning(`Source not found: ${collectionName}.ts - skipping`)
      return
    }

    // Ensure target directory exists
    if (!fs.existsSync(targetDir)) {
      log.info(`Creating directory: ${path.relative(PROJECT_ROOT, targetDir)}`)
      if (!this.options.dryRun) {
        fs.mkdirSync(targetDir, { recursive: true })
      }
      this.log.actions.push({
        type: 'mkdir',
        target: targetDir,
        description: `Created directory: ${path.relative(PROJECT_ROOT, targetDir)}`,
      })
    }

    // Move the file
    if (!this.options.dryRun) {
      fs.renameSync(sourcePath, targetPath)
      log.success(`Moved: ${collectionName}.ts`)
    } else {
      log.info(`[DRY RUN] Would move: ${collectionName}.ts → ${branch}/collections/`)
    }

    this.log.actions.push({
      type: 'move',
      source: sourcePath,
      target: targetPath,
      description: `Moved ${collectionName}.ts to ${branch}/collections/`,
    })

    // Create symlink for backward compatibility
    if (!this.options.dryRun) {
      const relativeTarget = path.relative(path.dirname(symlinkPath), targetPath)
      fs.symlinkSync(relativeTarget, symlinkPath)
      log.success(`Created symlink: ${collectionName}.ts → ${relativeTarget}`)
    } else {
      log.info(`[DRY RUN] Would create symlink: ${collectionName}.ts`)
    }

    this.log.actions.push({
      type: 'symlink',
      source: symlinkPath,
      target: targetPath,
      description: `Created backward-compatible symlink for ${collectionName}.ts`,
    })
  }

  private findBranchForCollection(collectionName: string): Branch | null {
    for (const [branch, config] of Object.entries(BRANCH_MAPPINGS)) {
      if (config.collections.includes(collectionName)) {
        return branch as Branch
      }
    }
    return null
  }

  private generateBranchIndex(branch: Branch): string {
    const config = BRANCH_MAPPINGS[branch]
    const collections = config.collections || []

    return `/**
 * ${branch.charAt(0).toUpperCase() + branch.slice(1)} Branch
 *
 * Vertical slice containing all ${branch}-related collections, components, and logic.
 *
 * Collections: ${collections.join(', ')}
 */

// Export all collections
${collections.map((c) => `export { default as ${c} } from './collections/${c}'`).join('\n')}

// Export branch metadata
export const branchMetadata = {
  name: '${branch}',
  collections: ${JSON.stringify(collections, null, 2)},
  featureFlag: 'ENABLE_${branch.toUpperCase()}',
} as const

// Export branch routes (to be implemented)
// export { routes } from './routes'
`
  }

  private saveMigrationLog() {
    fs.writeFileSync(MIGRATION_LOG_FILE, JSON.stringify(this.log, null, 2))
  }

  private async rollback() {
    log.step('🔙 Rolling back migration')

    if (!fs.existsSync(MIGRATION_LOG_FILE)) {
      log.error('No migration log found. Cannot rollback.')
      log.info('Migration log expected at: .migration-log.json')
      process.exit(1)
    }

    const migrationLog: MigrationLog = JSON.parse(
      fs.readFileSync(MIGRATION_LOG_FILE, 'utf-8'),
    )

    log.info(`Rollback log from: ${migrationLog.timestamp}`)
    log.info(`Total actions to reverse: ${migrationLog.actions.length}`)

    // Reverse all actions
    for (const action of migrationLog.actions.reverse()) {
      switch (action.type) {
        case 'symlink':
          if (action.source && fs.existsSync(action.source)) {
            fs.unlinkSync(action.source)
            log.success(`Removed symlink: ${action.source}`)
          }
          break

        case 'move':
          if (action.source && action.target && fs.existsSync(action.target)) {
            fs.renameSync(action.target, action.source)
            log.success(`Moved back: ${path.basename(action.source)}`)
          }
          break

        case 'mkdir':
          // Don't remove directories in rollback (might contain other files)
          log.info(`Skipping directory removal: ${action.target}`)
          break
      }
    }

    // Remove migration log
    fs.unlinkSync(MIGRATION_LOG_FILE)
    log.success('Migration log removed')

    log.step('✨ Rollback complete!')
    log.warning('Note: Empty directories were not removed. Clean them manually if needed.')
  }
}

// Parse CLI arguments
function parseArgs(): MigrationOptions {
  const args = process.argv.slice(2)

  return {
    dryRun: args.includes('--dry-run'),
    collection: args.find((arg) => arg.startsWith('--collection='))?.split('=')[1],
    branch: args.find((arg) => arg.startsWith('--branch='))?.split('=')[1] as Branch | undefined,
    all: args.includes('--all'),
    rollback: args.includes('--rollback'),
  }
}

// Main execution
async function main() {
  const options = parseArgs()

  // Show help if no args
  if (process.argv.length === 2) {
    console.log(`
${colors.bright}Vertical Slice Migration Tool${colors.reset}

${colors.cyan}Usage:${colors.reset}
  npx tsx src/scripts/migrate-to-branches.ts [options]

${colors.cyan}Options:${colors.reset}
  --dry-run                Preview changes without executing
  --collection=NAME        Migrate single collection (e.g., --collection=Products)
  --branch=NAME            Migrate entire branch (e.g., --branch=ecommerce)
  --all                    Migrate all branches
  --rollback               Rollback last migration

${colors.cyan}Examples:${colors.reset}
  ${colors.green}# Preview migration${colors.reset}
  npx tsx src/scripts/migrate-to-branches.ts --dry-run --all

  ${colors.green}# Test on single collection${colors.reset}
  npx tsx src/scripts/migrate-to-branches.ts --collection=Products

  ${colors.green}# Migrate entire ecommerce branch${colors.reset}
  npx tsx src/scripts/migrate-to-branches.ts --branch=ecommerce

  ${colors.green}# Migrate everything${colors.reset}
  npx tsx src/scripts/migrate-to-branches.ts --all

  ${colors.green}# Rollback if something went wrong${colors.reset}
  npx tsx src/scripts/migrate-to-branches.ts --rollback

${colors.cyan}Branches:${colors.reset}
  ${Object.keys(BRANCH_MAPPINGS).join(', ')}
`)
    process.exit(0)
  }

  const migrator = new BranchMigrator(options)
  await migrator.migrate()
}

main().catch((error) => {
  log.error(`Migration failed: ${error.message}`)
  console.error(error)
  process.exit(1)
})
