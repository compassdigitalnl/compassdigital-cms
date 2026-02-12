# 🗄️ DATABASE MIGRATION GUIDE - PostgreSQL Setup

## 🎯 PROBLEEM

De Vercel deployment crasht met:
```
❌ error: relation "products" does not exist
❌ error: relation "pages" does not exist
❌ error: relation "footer" does not exist
```

**Root Cause:** Railway PostgreSQL database is leeg - geen tabellen!

---

## ✅ OPLOSSING: RUN MIGRATIONS

Er zijn 2 methoden om de database schema aan te maken:

---

## 📋 METHODE 1: LOKAAL MIGREREN (Aanbevolen - 5 min)

### Stap 1: Update .env om PostgreSQL te gebruiken

**Edit je lokale `.env` file:**

Je `.env` heeft al de correcte DATABASE_URL! ✅
```bash
DATABASE_URL=postgresql://postgres:...@shinkansen.proxy.rlwy.net:29352/railway
```

### Stap 2: Run Payload Migrations

```bash
# In je payload-app directory:
cd /Users/markkokkelkoren/Projects/ai-sitebuilder/payload-app

# Run migrations (creates all tables):
npm run payload migrate

# Of als dat niet werkt:
npx payload migrate
```

**Verwachte output:**
```
✓ Connected to database
✓ Running migrations...
✓ Created table: users
✓ Created table: pages
✓ Created table: products
✓ Created table: blog_posts
✓ Created table: media
✓ Created table: footer
✓ Created table: header
✓ Created table: settings
✓ Created table: theme
... (etc)
✓ Migrations complete!
```

### Stap 3: Seed Database (Optional - Add Sample Data)

```bash
# Optionally seed with sample data:
npm run payload seed

# Or specific seed script if you have one
# npm run seed
```

### Stap 4: Verify Locally

```bash
# Start dev server with PostgreSQL:
npm run dev

# Test in browser:
# http://localhost:3020
# http://localhost:3020/admin
```

### Stap 5: Vercel Will Work Automatically

Zodra de database tabellen er zijn, werkt Vercel automatisch!

```bash
# No need to redeploy - just test:
https://cms.compassdigital.nl
https://cms.compassdigital.nl/admin
```

---

## 📋 METHODE 2: VIA VERCEL BUILD (Automatisch - Maar Riskanter)

**Voeg environment variable toe in Vercel:**

```
https://vercel.com/compass-digital-50e6916c/compassdigital-cms/settings/environment-variables

Key:   PAYLOAD_MIGRATE
Value: true
Environments: Production, Preview, Development
```

**Dan redeploy:**
```bash
git commit --allow-empty -m "Enable auto-migrations"
git push
```

**⚠️ Waarschuwing:**
- Migrations draaien tijdens build
- Als migration faalt, faalt hele build
- Beter om lokaal te doen eerst!

---

## 📋 METHODE 3: HANDMATIG VIA PSQL (Advanced)

**Als je direct SQL wilt draaien:**

```bash
# Connect to Railway database:
psql "postgresql://postgres:eBTN...@shinkansen.proxy.rlwy.net:29352/railway"

# Check if tables exist:
\dt

# Expected: Empty or "Did not find any relations"

# Exit:
\q
```

**Dan gebruik Methode 1 om Payload migrations te draaien.**

---

## 🔍 VERIFY MIGRATIONS SUCCEEDED

### Via Terminal:

```bash
# Connect to database:
psql "postgresql://postgres:...@shinkansen.proxy.rlwy.net:29352/railway"

# List all tables:
\dt

# Expected output:
# List of relations
#  Schema |          Name           | Type  |  Owner
# --------+-------------------------+-------+----------
#  public | blog_posts              | table | postgres
#  public | footer                  | table | postgres
#  public | header                  | table | postgres
#  public | media                   | table | postgres
#  public | pages                   | table | postgres
#  public | products                | table | postgres
#  public | users                   | table | postgres
#  (and many more...)

# Count records in pages:
SELECT COUNT(*) FROM pages;

# Exit:
\q
```

### Via Railway Dashboard:

```
1. Go to: https://railway.app/dashboard
2. Click on your PostgreSQL database
3. Click: "Data" tab
4. See list of tables (should show ~30+ tables)
```

---

## 🚨 TROUBLESHOOTING

### ❌ "npm run payload migrate" not found

**Fix: Run directly with npx:**
```bash
npx payload migrate
```

**Or check package.json:**
```json
{
  "scripts": {
    "payload": "payload",
    "migrate": "payload migrate"
  }
}
```

### ❌ "Cannot connect to database"

**Check DATABASE_URL:**
```bash
# Print DATABASE_URL (check if correct):
grep DATABASE_URL .env

# Test connection:
psql "$(grep DATABASE_URL .env | cut -d= -f2)"
```

**Common issues:**
- Wrong password
- Wrong host/port
- Database not accessible from your IP
- Railway database is paused (free tier)

### ❌ "Migration failed: Table already exists"

**Meaning:** Tabellen bestaan al deels, migration conflict

**Fix:**
```bash
# Reset database (CAREFUL - deletes all data!):
npx payload migrate:reset

# Then run migrations again:
npx payload migrate
```

### ❌ Railway Database "Sleeping"

**Railway free tier databases can sleep after inactivity:**

**Fix:**
1. Go to Railway dashboard
2. Click database
3. Click "Wake up" or trigger a query
4. Wait 30 seconds
5. Try migration again

---

## 📊 EXPECTED TABLES

**Payload will create these tables (and more):**

**Collections:**
- `users`
- `pages`
- `blog_posts`
- `products`
- `media`
- `testimonials`
- `partners`
- `brands`
- `cases`
- `faqs`
- `services`
- `orders`
- `order_lists`
- `product_categories`
- `customer_groups`

**Globals:**
- `header`
- `footer`
- `settings`
- `theme`

**Payload System Tables:**
- `payload_preferences`
- `payload_migrations`
- `_pages_v` (versions)
- `_blog_posts_v` (versions)
- ... (etc)

**Multi-Tenant:**
- `tenants`
- `platform_admins`
- `audit_log`
- `deployments`

**Total:** ~50-60 tables

---

## ✅ SUCCESS CRITERIA

**After migrations, you should have:**

1. **~50+ database tables** (check with `\dt` in psql)
2. **Vercel site loads:** https://cms.compassdigital.nl ✅
3. **Admin panel works:** https://cms.compassdigital.nl/admin ✅
4. **No 500 errors** ✅
5. **Can create pages/posts in admin** ✅

---

## 🎯 RECOMMENDED APPROACH

**Best order to follow:**

1. ✅ **Run migrations locally** (Methode 1)
   ```bash
   npx payload migrate
   ```

2. ✅ **Verify tables exist**
   ```bash
   psql "..." -c "\dt"
   ```

3. ✅ **Test Vercel** (should work now!)
   ```
   https://cms.compassdigital.nl
   ```

4. ✅ **Create admin user** (if needed)
   ```bash
   npm run dev
   # Go to /admin
   # Create first user
   ```

5. ✅ **Seed data** (optional)
   ```bash
   npm run seed  # If you have seed script
   ```

---

## 🚀 NEXT STEPS AFTER MIGRATION

**Once database is set up:**

1. **Create Admin User:**
   - Go to: https://cms.compassdigital.nl/admin
   - Sign up with email/password
   - This creates first admin user

2. **Create Homepage:**
   - In admin: Collections → Pages
   - Create page with slug: `home`
   - Publish

3. **Configure Globals:**
   - Header: Add logo, navigation
   - Footer: Add links, text
   - Settings: Site name, SEO defaults
   - Theme: Colors, fonts

4. **Add Content:**
   - Create pages
   - Add blog posts
   - Upload media
   - Create products (if e-commerce)

---

**Last Updated:** February 12, 2026
