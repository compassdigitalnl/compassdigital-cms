# Automated Backup Strategy Guide

## 📋 Overview

This guide outlines the backup strategy for the SiteForge Payload CMS application, covering database backups, file storage, automated scheduling, and disaster recovery procedures.

---

## 🎯 What Needs to Be Backed Up

### 1. **Database** (Critical)
   - **PostgreSQL/SQLite**: All CMS content, pages, blocks, users, settings
   - **Backup Frequency**: Daily (automated)
   - **Retention**: 30 days of daily backups, 12 months of monthly snapshots

### 2. **Uploaded Files** (Critical)
   - **Media**: Images, documents, assets uploaded via Payload CMS
   - **Location**: `public/media/` directory (if using local storage)
   - **Backup Frequency**: Daily (automated)
   - **Retention**: 30 days

### 3. **Environment Configuration** (Important)
   - **Files**: `.env`, `payload.config.ts`, custom configs
   - **Backup Frequency**: Manual (on changes)
   - **Storage**: Secure vault (1Password, AWS Secrets Manager, etc.)

### 4. **Redis Cache** (Optional)
   - **Data**: Job queue state, cache data
   - **Backup Frequency**: Not required (ephemeral data)
   - **Note**: Redis data is regeneratable

---

## 🚀 Platform-Specific Backup Solutions

### Option 1: Railway (Recommended for This Project)

Railway provides automatic daily backups for PostgreSQL databases.

#### Database Backups
```bash
# Automatic daily backups (included with Railway PostgreSQL)
# Backups are retained for 7 days on Starter plan
# Backups are retained for 30 days on Pro plan

# Manual backup via Railway CLI
railway pg:backup create

# List backups
railway pg:backup list

# Restore from backup
railway pg:backup restore <backup-id>
```

#### File Backups
Railway doesn't persist files, so use **S3-compatible storage**:

1. **Setup AWS S3 / Cloudflare R2**:
   ```bash
   npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
   ```

2. **Configure Payload Storage** (see `payload.config.ts`):
   ```typescript
   import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3'

   export default buildConfig({
     plugins: [
       cloudStorage({
         collections: {
           media: {
             adapter: s3Adapter({
               config: {
                 region: process.env.S3_REGION,
                 credentials: {
                   accessKeyId: process.env.S3_ACCESS_KEY_ID,
                   secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
                 },
               },
               bucket: process.env.S3_BUCKET,
             }),
           },
         },
       }),
     ],
   })
   ```

### Option 2: Vercel + Vercel Postgres

#### Database Backups
```bash
# Vercel Postgres has automatic backups
# Hobby: 7-day retention
# Pro: 30-day retention

# Manual backup via Vercel CLI
vercel postgres backup create

# Restore from backup
vercel postgres backup restore <backup-id>
```

#### File Storage
Use **Vercel Blob Storage** (automatically backed up):
```bash
npm install @vercel/blob
```

### Option 3: Self-Hosted (VPS/Docker)

#### Database Backups
Create automated backup script:

**File**: `scripts/backup-database.sh`
```bash
#!/bin/bash
# PostgreSQL backup script

BACKUP_DIR="/backups/database"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
DATABASE_URL="${DATABASE_URL}"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
pg_dump $DATABASE_URL > "$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Compress backup
gzip "$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$TIMESTAMP.sql.gz"
```

**Make executable**:
```bash
chmod +x scripts/backup-database.sh
```

**Add cron job** (daily at 2 AM):
```bash
crontab -e
# Add this line:
0 2 * * * /path/to/payload-app/scripts/backup-database.sh
```

#### File Backups
**File**: `scripts/backup-files.sh`
```bash
#!/bin/bash
# File backup script

BACKUP_DIR="/backups/files"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
SOURCE_DIR="./public/media"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup files with rsync
tar -czf "$BACKUP_DIR/media_$TIMESTAMP.tar.gz" -C ./public media

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "File backup completed: media_$TIMESTAMP.tar.gz"
```

**Add cron job** (daily at 3 AM):
```bash
crontab -e
# Add this line:
0 3 * * * /path/to/payload-app/scripts/backup-files.sh
```

---

## 🛡️ Offsite Backup Storage

### Option 1: AWS S3 (Recommended)

**Setup**:
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS credentials
aws configure
```

**Upload backups to S3**:
```bash
#!/bin/bash
# Upload to S3 after backup

aws s3 sync /backups/database s3://your-bucket/backups/database/
aws s3 sync /backups/files s3://your-bucket/backups/files/
```

**S3 Lifecycle Policy** (automatic cleanup):
```json
{
  "Rules": [
    {
      "Id": "DeleteOldBackups",
      "Status": "Enabled",
      "ExpirationInDays": 90,
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "GLACIER"
        }
      ]
    }
  ]
}
```

### Option 2: Cloudflare R2 (S3-Compatible, No Egress Fees)

**Setup**:
```bash
# Use S3 CLI with R2 endpoint
aws s3 sync /backups s3://your-bucket/backups \
  --endpoint-url https://[account-id].r2.cloudflarestorage.com
```

### Option 3: Backblaze B2 (Affordable)

**Setup**:
```bash
# Install B2 CLI
pip install b2

# Authenticate
b2 authorize-account <applicationKeyId> <applicationKey>

# Sync backups
b2 sync /backups b2://your-bucket/backups
```

---

## 📝 Backup Verification

### Database Backup Verification
```bash
#!/bin/bash
# Test database restore

# Restore to test database
psql $TEST_DATABASE_URL < backup.sql

# Verify data integrity
psql $TEST_DATABASE_URL -c "SELECT COUNT(*) FROM pages;"
psql $TEST_DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

### File Backup Verification
```bash
#!/bin/bash
# Verify file backup integrity

# Extract backup to temp directory
tar -xzf media_backup.tar.gz -C /tmp/restore_test

# Compare file counts
ORIGINAL_COUNT=$(find ./public/media -type f | wc -l)
BACKUP_COUNT=$(find /tmp/restore_test/media -type f | wc -l)

if [ "$ORIGINAL_COUNT" -eq "$BACKUP_COUNT" ]; then
  echo "✅ Backup verification successful"
else
  echo "❌ Backup verification failed: file count mismatch"
fi
```

---

## 🔄 Restore Procedures

### Database Restore

#### PostgreSQL
```bash
# Stop the application
pm2 stop payload-app

# Restore from backup
gunzip -c backup_2024-01-15.sql.gz | psql $DATABASE_URL

# Restart the application
pm2 start payload-app
```

#### SQLite
```bash
# Stop the application
pm2 stop payload-app

# Restore database file
cp payload.db payload.db.backup
cp backups/payload_2024-01-15.db payload.db

# Restart the application
pm2 start payload-app
```

### File Restore

```bash
# Stop the application
pm2 stop payload-app

# Backup current files
mv public/media public/media.backup

# Restore from backup
tar -xzf media_2024-01-15.tar.gz -C public/

# Restart the application
pm2 start payload-app
```

### S3 Restore (if using cloud storage)

```bash
# Files are automatically available from S3
# No restore needed - just ensure S3 credentials are correct
```

---

## ⏰ Recommended Backup Schedule

| Item | Frequency | Retention | Method |
|------|-----------|-----------|--------|
| **Database** | Daily at 2 AM | 30 days daily, 12 months monthly | Automated (pg_dump/Railway) |
| **Files (local)** | Daily at 3 AM | 30 days | Automated (tar/rsync) |
| **Files (S3)** | Real-time | Indefinite | Automatic (S3 plugin) |
| **Config files** | On change | Indefinite | Manual (secure vault) |
| **Full system** | Weekly | 4 weeks | Automated (snapshot) |

---

## 🚨 Disaster Recovery Plan

### Scenario 1: Database Corruption

1. **Stop application**:
   ```bash
   pm2 stop payload-app
   ```

2. **Restore latest backup**:
   ```bash
   gunzip -c /backups/database/latest.sql.gz | psql $DATABASE_URL
   ```

3. **Verify data integrity**:
   ```bash
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM pages;"
   ```

4. **Restart application**:
   ```bash
   pm2 start payload-app
   ```

5. **Test functionality**: Browse site, check admin panel

### Scenario 2: Server Failure

1. **Provision new server**: Same specs as original
2. **Deploy application**: Use Git to clone repository
3. **Restore database**: From latest S3/Railway backup
4. **Restore files**: From S3 or latest tar.gz backup
5. **Update DNS**: Point domain to new server
6. **Verify**: Test all functionality

### Scenario 3: Accidental Data Deletion

1. **Identify deletion time**: Check Sentry/logs
2. **Find backup before deletion**: Use timestamp
3. **Restore specific tables** (PostgreSQL):
   ```bash
   # Restore only specific table
   pg_restore -t pages -d $DATABASE_URL backup.sql
   ```
4. **Verify restored data**: Check admin panel

---

## 📊 Monitoring Backup Health

### Backup Monitoring Script

**File**: `scripts/monitor-backups.sh`
```bash
#!/bin/bash
# Monitor backup health

BACKUP_DIR="/backups/database"
LATEST_BACKUP=$(ls -t $BACKUP_DIR/*.sql.gz | head -1)
BACKUP_AGE=$(( ( $(date +%s) - $(stat -f%m "$LATEST_BACKUP") ) / 86400 ))

if [ "$BACKUP_AGE" -gt 1 ]; then
  echo "❌ WARNING: Latest backup is $BACKUP_AGE days old"
  # Send alert (email, Slack, etc.)
  curl -X POST https://hooks.slack.com/... -d '{"text":"Backup is outdated!"}'
else
  echo "✅ Backups are up to date"
fi
```

### Integrate with Monitoring

Add to **Sentry/monitoring service**:
```typescript
// src/lib/monitoring/backupCheck.ts
import * as Sentry from '@sentry/nextjs'

export async function checkBackupHealth() {
  const lastBackup = await getLastBackupTimestamp()
  const age = Date.now() - lastBackup

  if (age > 24 * 60 * 60 * 1000) {
    Sentry.captureMessage('Backup is outdated', {
      level: 'warning',
      extra: { lastBackup, age },
    })
  }
}
```

---

## 🔐 Security Best Practices

1. **Encrypt backups at rest**: Use AES-256 encryption
   ```bash
   # Encrypt backup
   openssl enc -aes-256-cbc -salt -in backup.sql -out backup.sql.enc

   # Decrypt backup
   openssl enc -d -aes-256-cbc -in backup.sql.enc -out backup.sql
   ```

2. **Encrypt backups in transit**: Use HTTPS/TLS for transfers

3. **Restrict access**: Use IAM policies, least privilege

4. **Test restores regularly**: Monthly restore drills

5. **Document procedures**: Keep this guide updated

6. **Version backups**: Never overwrite existing backups

---

## ✅ Backup Checklist

### Initial Setup
- [ ] Choose backup platform (Railway/Vercel/Self-hosted)
- [ ] Configure database backups
- [ ] Configure file storage (S3/Blob/local)
- [ ] Set up offsite storage (S3/R2/B2)
- [ ] Create backup scripts
- [ ] Schedule automated backups (cron/CI)
- [ ] Set up backup monitoring
- [ ] Document restore procedures
- [ ] Test restore process
- [ ] Configure alerting

### Monthly Maintenance
- [ ] Verify backups are running
- [ ] Test restore process
- [ ] Check backup sizes
- [ ] Review retention policies
- [ ] Update documentation
- [ ] Audit access logs

### Quarterly Review
- [ ] Review disaster recovery plan
- [ ] Update recovery time objectives (RTO)
- [ ] Update recovery point objectives (RPO)
- [ ] Conduct full restore drill
- [ ] Review costs and optimize

---

## 📚 Additional Resources

- **PostgreSQL Backup**: https://www.postgresql.org/docs/current/backup.html
- **Railway Backups**: https://docs.railway.app/databases/postgresql#backups
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres
- **AWS S3 Lifecycle**: https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html
- **Payload Cloud Storage**: https://payloadcms.com/docs/plugins/cloud-storage

---

**Status**: ✅ Documentation Complete
**Next Step**: Implement chosen backup strategy based on your deployment platform
