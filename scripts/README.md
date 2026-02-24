# Scripts Directory

Centralized location for all deployment, provisioning, database, and maintenance scripts.

## 📁 Directory Structure

```
scripts/
├── deployment/           # Deployment scripts (production, staging)
│   ├── deploy-all.sh    # Multi-site parallel deployment
│   └── safe-deploy.sh   # Single-site safe deployment with backup
├── provisioning/        # Tenant provisioning scripts
│   └── provision-site.sh # Complete site provisioning (legacy, for reference)
├── database/            # Database management
│   ├── backup-db.mjs    # Database backup utility
│   ├── backup-all.sh    # Backup all tenant databases
│   ├── restore-db.mjs   # Database restore utility
│   └── check-migrations.mjs # Migration safety validator
├── maintenance/         # Code maintenance utilities
│   ├── migrate-imports.mjs
│   ├── update-imports.mjs
│   └── add-trailing-slashes.mjs
├── seeding/            # Data seeding scripts
│   └── seed-tenant.ts  # Tenant demo content seeding
└── archived/           # Deprecated/old scripts
    └── README.md       # Documentation of archived scripts
```

## 🚀 Primary Scripts

### Deployment Scripts

#### `deployment/deploy-all.sh`
**Purpose:** Deploy all tenant sites in parallel batches
**Usage:** `bash scripts/deployment/deploy-all.sh`
**Features:**
- Parallel builds (3 at a time)
- Pre-deploy backups
- Migration safety checks
- PM2 restarts
- Success/failure reporting

**Performance:** ~4-5 minutes for 7 sites (vs 10 min sequential)

#### `deployment/safe-deploy.sh`
**Purpose:** Safe deployment for a single tenant site
**Usage:** `bash scripts/deployment/safe-deploy.sh <site_dir> <db_name> <pm2_name>`
**Features:**
- Pre-deploy backup (FATAL if fails)
- Migration safety check
- Build verification
- PM2 restart
- Health check verification

**Example:**
```bash
bash scripts/deployment/safe-deploy.sh \
    /home/ploi/plastimed01.compassdigital.nl \
    client_plastimed01 \
    plastimed01-cms
```

### Database Scripts

#### `database/backup-db.mjs`
**Purpose:** Backup a tenant database
**Usage:** `node scripts/database/backup-db.mjs <db_name> [label]`
**Output:** `/home/ploi/backups/<db_name>-<timestamp>-<label>.sql`

#### `database/backup-all.sh`
**Purpose:** Backup all tenant databases
**Usage:** `bash scripts/database/backup-all.sh`

#### `database/restore-db.mjs`
**Purpose:** Restore a database from backup
**Usage:** `node scripts/database/restore-db.mjs <backup_file> <db_name>`

#### `database/check-migrations.mjs`
**Purpose:** Verify if it's safe to run migrations
**Usage:** `node scripts/database/check-migrations.mjs <db_name>`
**Exit Codes:**
- `0`: Safe - migrations can run
- `1`: Danger - data exists without migration history
- `2`: Empty - initial setup

### Provisioning Scripts

#### `provisioning/provision-site.sh` (Legacy - Reference Only)
**Purpose:** Complete tenant site provisioning (Bash)
**Status:** Legacy - TypeScript version preferred (see `src/lib/provisioning/`)
**Use Case:** Server-side manual provisioning, reference implementation

**Modern Alternative:**
- TypeScript: `src/lib/provisioning/ProvisioningService.ts`
- API Endpoint: `POST /api/platform/provision`
- Function: `provisionClient({ clientId })`

### Seeding Scripts

#### `seeding/seed-tenant.ts`
**Purpose:** Seed demo content for a tenant
**Usage:** `npx tsx scripts/seeding/seed-tenant.ts <clientId>`

## 📋 TypeScript Scripts Location

Modern TypeScript scripts are in `src/scripts/`:

- `src/scripts/deploy.ts` - Production deployment (Vercel)
- `src/scripts/validate-env.ts` - Environment validation
- `src/scripts/pre-build-check.ts` - Pre-build validation

**Usage:**
```bash
npm run deploy              # Deploy to production
npm run deploy:staging      # Deploy to staging
npm run deploy:verify       # Verify deployment
npm run validate-env        # Check environment variables
```

## 🔄 Migration Best Practices

### Before Running Migrations

1. **Always backup first:**
   ```bash
   node scripts/database/backup-db.mjs client_<name> pre-migrate
   ```

2. **Check migration safety:**
   ```bash
   node scripts/database/check-migrations.mjs client_<name>
   ```

3. **Run migrations:**
   ```bash
   cd /home/ploi/<domain>
   npx payload migrate
   ```

4. **Verify application:**
   ```bash
   curl http://localhost:<port>/api/health
   ```

### If Migrations Fail

1. **Check logs:**
   ```bash
   pm2 logs <pm2_name> --lines 100
   ```

2. **Restore backup:**
   ```bash
   node scripts/database/restore-db.mjs \
       /home/ploi/backups/<backup_file> \
       client_<name>
   ```

3. **Restart PM2:**
   ```bash
   pm2 restart <pm2_name>
   ```

## 🏗️ Provisioning a New Tenant (Manual)

### Quick Start (Using TypeScript Service)

```bash
# Via API (recommended)
curl -X POST https://cms.compassdigital.nl/api/platform/provision \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -d '{"clientId": "abc123"}'

# Via Node.js script
node -e "
    const { provisionClient } = require('./dist/lib/provisioning/provisionClient');
    provisionClient({ clientId: 'abc123', verbose: true });
"
```

### Manual (Using Bash Script - Legacy)

```bash
bash scripts/provisioning/provision-site.sh \
    bakker01 \                        # client ID
    4008 \                            # port
    "Bakkerij van Dam" \              # client name
    "#8B4513" \                       # primary color (optional)
    default \                         # template ID (optional)
    b2c                               # shop model (optional)
```

## 🧹 Maintenance

### Update Imports

```bash
node scripts/maintenance/update-imports.mjs
```

### Migrate Import Paths

```bash
node scripts/maintenance/migrate-imports.mjs
```

## 📦 Archived Scripts

Deprecated scripts are in `scripts/archived/`:

- `add-auto-slug.sh` - Replaced by Payload hooks
- `pre-flight-check.sh` - Replaced by `src/scripts/pre-build-check.ts`
- `emergency-rollback.sh` - Replaced by safe-deploy.sh backup mechanism

See `scripts/archived/README.md` for details.

## 🔗 Related Documentation

- `docs/DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `docs/DATABASE_MIGRATION_GUIDE.md` - Migration procedures
- `src/lib/provisioning/README.md` - TypeScript provisioning docs

## 🚨 Emergency Procedures

### Site Down

1. Check PM2 status:
   ```bash
   pm2 list
   pm2 logs <pm2_name>
   ```

2. Restart PM2:
   ```bash
   pm2 restart <pm2_name>
   ```

3. Check health:
   ```bash
   curl http://localhost:<port>/api/health
   ```

### Database Corruption

1. Stop PM2:
   ```bash
   pm2 stop <pm2_name>
   ```

2. Restore latest backup:
   ```bash
   ls -lt /home/ploi/backups/<db_name>-* | head -1
   node scripts/database/restore-db.mjs <backup_file> <db_name>
   ```

3. Restart PM2:
   ```bash
   pm2 restart <pm2_name>
   ```

### Failed Deployment

1. **Don't panic** - pre-deploy backup exists
2. Check backup location:
   ```bash
   ls -lt /home/ploi/backups/ | head -5
   ```

3. Restore if needed:
   ```bash
   node scripts/database/restore-db.mjs <backup_file> <db_name>
   ```

4. Redeploy from last known good commit:
   ```bash
   cd /home/ploi/<domain>
   git reset --hard <good_commit_hash>
   bash scripts/deployment/safe-deploy.sh <site_dir> <db_name> <pm2_name>
   ```

## 📞 Support

For issues or questions:
1. Check logs: `pm2 logs <pm2_name>`
2. Review recent backups: `ls -lt /home/ploi/backups/`
3. Consult deployment guide: `docs/DEPLOYMENT_GUIDE.md`
