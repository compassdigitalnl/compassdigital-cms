# Database Migration Guide - SQLite naar PostgreSQL

Complete handleiding voor het migreren van development SQLite naar production PostgreSQL.

## 🎯 Waarom PostgreSQL?

**SQLite is perfect voor development:**
- ✅ Zero config
- ✅ File-based (geen server nodig)
- ✅ Fast voor kleine datasets
- ✅ Perfect voor local testing

**PostgreSQL is essentieel voor production:**
- 🚀 **Concurrent writes** - meerdere users tegelijk
- 💪 **Betere performance** bij grote datasets
- 🔒 **ACID compliance** - data integrity guaranteed
- 📊 **Advanced queries** - complexere data operations
- 💾 **Built-in backups** - point-in-time recovery
- 🌐 **Hosting support** - alle platforms ondersteunen PostgreSQL

---

## 📋 Pre-Migration Checklist

- [ ] Backup van huidige SQLite database maken
- [ ] PostgreSQL database provisioned (Railway/Supabase/Vercel)
- [ ] DATABASE_URL van PostgreSQL provider verkregen
- [ ] @payloadcms/db-postgres package geïnstalleerd (✅ done)
- [ ] payload.config.ts updated (✅ done)

---

## 🚀 Migration Opties

### Optie 1: Railway (Aanbevolen voor starters)

**Waarom Railway?**
- Simpelste setup (3 minuten)
- $5 gratis credit/maand
- Automatische backups
- Managed service (zero maintenance)

**Setup Steps:**

1. **Account aanmaken:**
   ```
   https://railway.app/
   → Sign up with GitHub
   ```

2. **PostgreSQL database provisionen:**
   ```
   Dashboard → New Project → Provision PostgreSQL
   ```

3. **DATABASE_URL ophalen:**
   ```
   PostgreSQL service → Variables tab
   → Copy "DATABASE_URL" (postgres://...)
   ```

4. **Lokaal testen:**
   ```bash
   # .env (lokaal)
   DATABASE_URL=postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
   ```

5. **Database initialiseren:**
   ```bash
   npm run dev
   # Payload zal automatisch schema aanmaken in PostgreSQL
   ```

6. **Verifieer:**
   ```bash
   # Check dat PostgreSQL werkt:
   # - Open http://localhost:3015/admin
   # - Login met admin account
   # - Check of collections laden
   ```

**Pricing:**
- **Gratis tier:** $5 credit/maand
- **Developer:** $5/maand (500MB storage)
- **Team:** $10/maand (1GB storage)

---

### Optie 2: Supabase (Aanbevolen voor scale)

**Waarom Supabase?**
- Generous free tier (500MB gratis)
- Built-in auth (toekomstige integratie mogelijk)
- Realtime capabilities
- Better for scaling (100+ users)

**Setup Steps:**

1. **Account aanmaken:**
   ```
   https://supabase.com/
   → Start your project
   ```

2. **Nieuw project:**
   ```
   Organization → New project
   Name: siteforge-prod
   Database Password: [SAVE THIS!]
   Region: Europe (West) - Netherlands
   ```

3. **DATABASE_URL ophalen:**
   ```
   Project Settings → Database → Connection String
   → Kopieer "Connection pooling" URI (port 6543)
   → Replace [YOUR-PASSWORD] met je database password
   ```

4. **Lokaal testen:**
   ```bash
   # .env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.yourproject.supabase.co:6543/postgres?pgbouncer=true
   ```

5. **Database initialiseren:**
   ```bash
   npm run dev
   ```

**Pricing:**
- **Free:** 500MB database, 2GB file storage
- **Pro:** $25/maand (8GB database, 100GB storage)

---

### Optie 3: Vercel Postgres (Als je Vercel gebruikt voor hosting)

**Waarom Vercel Postgres?**
- Seamless integration met Vercel deployment
- Zero-config op Vercel platform
- Good for Vercel-centric setup

**Setup Steps:**

1. **Vercel Dashboard:**
   ```
   Your Project → Storage → Create Database → Postgres
   ```

2. **DATABASE_URL:**
   ```
   Automatisch beschikbaar als environment variable in Vercel
   Lokaal: kopier uit Vercel dashboard
   ```

**Pricing:**
- **Hobby:** $20/maand compute + $0.25/GB storage
- **Pro:** More expensive maar better performance

---

## 🔄 Data Migratie (SQLite → PostgreSQL)

**Optie A: Fresh start (Aanbevolen voor nieuwe projecten)**

Als je database alleen test data bevat:

```bash
# 1. Update DATABASE_URL naar PostgreSQL
# 2. Start server
npm run dev

# 3. Payload maakt automatisch schema aan
# 4. Maak nieuwe admin user via /admin/register
# 5. Voeg nieuwe content toe
```

**Optie B: Data export/import (Voor productie data)**

1. **Export SQLite data:**
   ```bash
   # Payload heeft geen built-in export (yet)
   # Manual export via admin panel of API:

   # Via API (alle pages):
   curl http://localhost:3015/api/pages?depth=2&limit=1000 > pages.json
   curl http://localhost:3015/api/blog-posts?depth=2&limit=1000 > blog-posts.json
   curl http://localhost:3015/api/media?depth=2&limit=1000 > media.json
   ```

2. **Switch naar PostgreSQL:**
   ```bash
   # Update .env
   DATABASE_URL=postgresql://...

   # Start server (schema wordt aangemaakt)
   npm run dev
   ```

3. **Import data:**
   ```bash
   # Manual import via API of admin panel
   # Of gebruik custom migration script (zie hieronder)
   ```

**Optie C: Custom migration script (Advanced)**

```typescript
// scripts/migrate-sqlite-to-postgres.ts
import { getPayload } from 'payload'
import config from '@payload-config'

async function migrate() {
  // 1. Connect to SQLite
  process.env.DATABASE_URL = 'file:./payload.db'
  const sqlitePayload = await getPayload({ config })

  // 2. Export all data
  const pages = await sqlitePayload.find({ collection: 'pages', limit: 1000 })
  const posts = await sqlitePayload.find({ collection: 'blog-posts', limit: 1000 })

  // 3. Switch to PostgreSQL
  process.env.DATABASE_URL = 'postgresql://...'
  const postgresPayload = await getPayload({ config })

  // 4. Import data
  for (const page of pages.docs) {
    await postgresPayload.create({ collection: 'pages', data: page })
  }

  console.log('Migration complete!')
}

migrate()
```

---

## ✅ Post-Migration Checklist

- [ ] **Test alle collections:**
  - [ ] Pages laden correct
  - [ ] Blog posts laden correct
  - [ ] Media/images laden correct
  - [ ] Users kunnen inloggen
  - [ ] Form submissions werken

- [ ] **Test CRUD operaties:**
  - [ ] Create nieuwe page
  - [ ] Update bestaande page
  - [ ] Delete test page
  - [ ] Publish/unpublish werkt

- [ ] **Performance check:**
  - [ ] Admin panel laadt snel (<2s)
  - [ ] API responses < 500ms
  - [ ] No database connection errors

- [ ] **Backup configureren:**
  - [ ] Railway: Backups zijn automatic (daily)
  - [ ] Supabase: Backups zijn automatic (point-in-time)
  - [ ] Custom: Setup cron job (zie DEPLOYMENT.md)

- [ ] **Environment variables (production):**
  - [ ] Vercel/Netlify/Platform: Add DATABASE_URL
  - [ ] Test deployment werkt met PostgreSQL
  - [ ] Monitor for errors (Sentry)

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

**Oorzaak:** Verkeerde DATABASE_URL of database is niet accessible

**Oplossingen:**
```bash
# 1. Check DATABASE_URL format
echo $DATABASE_URL
# Moet beginnen met postgresql:// of postgres://

# 2. Test connection met psql
psql $DATABASE_URL
# Als dit werkt, is connection OK

# 3. Check firewall/IP whitelist
# Railway/Supabase: Allow all IPs in dashboard

# 4. Check credentials
# Username, password, host, port, database name
```

### Error: "SSL required" of "SCRAM authentication failed"

**Oplossing:**
```bash
# Voeg SSL parameter toe:
DATABASE_URL=postgresql://...?sslmode=require

# Of voor Supabase met pgbouncer:
DATABASE_URL=postgresql://...?pgbouncer=true&sslmode=require
```

### Error: "Too many connections"

**Oorzaak:** Connection pool limit bereikt

**Oplossing:**
```typescript
// payload.config.ts - configureer pool size
postgresAdapter({
  pool: {
    connectionString: databaseURL,
    max: 20, // Maximum connections
    min: 2,  // Minimum connections
    idleTimeoutMillis: 30000,
  },
})
```

### Database is slow (>1s queries)

**Oplossingen:**
1. **Enable connection pooling:**
   - Supabase: Use port 6543 (pgbouncer)
   - Railway: Built-in pooling

2. **Upgrade database plan:**
   - More CPU/RAM = faster queries

3. **Add indexes** (advanced):
   ```sql
   CREATE INDEX idx_pages_slug ON pages(slug);
   CREATE INDEX idx_pages_status ON pages(_status);
   ```

---

## 📊 Database Comparison

| Feature | SQLite | PostgreSQL |
|---------|--------|------------|
| **Setup** | Zero config | 5 min setup |
| **Cost** | Free | $5-25/maand |
| **Performance** | Fast (<100 users) | Fast (unlimited) |
| **Concurrent writes** | ❌ No | ✅ Yes |
| **Backups** | Manual | Automatic |
| **Hosting** | Limited | Universal |
| **Best for** | Development | Production |

---

## 🎯 Recommendation

**Development (lokaal):**
```bash
# .env
DATABASE_URL=file:./payload.db
```

**Production (small):**
```bash
# Railway ($5/maand)
DATABASE_URL=postgresql://postgres:xxx@containers-us-west-123.railway.app:5432/railway
```

**Production (scale):**
```bash
# Supabase ($25/maand)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.yourproject.supabase.co:6543/postgres?pgbouncer=true
```

---

## 📚 Resources

- [Railway Docs](https://docs.railway.app/databases/postgresql)
- [Supabase Docs](https://supabase.com/docs/guides/database)
- [Payload Database Docs](https://payloadcms.com/docs/database/overview)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don%27t_Do_This)

---

## 🆘 Support

**Issues with migration?**
1. Check logs: `npm run dev` (kijk naar database connection errors)
2. Test DATABASE_URL: `psql $DATABASE_URL`
3. Check INTEGRATIONS_ROADMAP.md voor more details
4. Join Payload Discord: https://discord.com/invite/payload

---

**✅ Migration complete? Mark PostgreSQL todo as done!**

Laatst bijgewerkt: Februari 2026
