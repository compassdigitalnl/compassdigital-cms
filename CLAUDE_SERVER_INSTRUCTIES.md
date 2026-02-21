# 🚀 Claude Server Instructies - Railway Provisioning Fix

**Datum:** 21 februari 2026
**Sprint:** Automatische Provisioning Fixen
**Status:** ✅ Code compleet - Cleanup + Testing nodig

**GitHub Commits:**
- `f35b7fb` - Railway API authentication fixes
- `59b760c` - Shared database mode
- `5700d1e` - Cleanup script voor duplicates

---

## 📋 Samenvatting Probleem & Oplossing

### ❌ Probleem

Bij provisioning van client "Aboland" en status wijzigen naar "🔄 Wordt ingericht...":
1. Port 4002 wordt toegewezen ✅
2. Railway database aanmaken **faalde**
3. Error: "RAILWAY_API_KEY not configured" (misleidend!)

**Echte oorzaak:** Railway API maakte WEL projecten aan, maar er ontstonden **6+ duplicates** van "client-plastimed01" (zie screenshot in repo).

### ✅ Oplossing

**Shared Database Mode** geïmplementeerd:
- **VOOR:** Elke client krijgt eigen Railway project (€5/month × N clients)
- **NA:** Alle clients delen 1 Railway PostgreSQL met aparte databases (€5/month fixed)
- **Resultaat:** Geen duplicates meer + lagere kosten

---

## 🎯 Wat Moet Je Doen?

### STAP 1: Pull Laatste Code van GitHub ⚡ BELANGRIJK

```bash
cd /Users/markkokkelkoren/Projects/ai-sitebuilder/payload-app

# Pull laatste commits (f35b7fb, 59b760c, 5700d1e)
git pull origin main

# Verify je hebt de laatste code
git log --oneline -3
# Zou moeten tonen:
# 5700d1e feat: add Railway duplicate projects cleanup script
# 59b760c feat: add shared database mode to fix Railway duplicate projects
# f35b7fb fix: Railway API authentication - improved error handling and diagnostics
```

### STAP 2: Check .env Configuratie ✅

**Verify deze variabelen staan in `.env`:**

```bash
# Check of deze er zijn:
grep "RAILWAY_USE_SHARED_DATABASE" .env
grep "PLATFORM_DATABASE_URL" .env

# Verwachte output:
# RAILWAY_USE_SHARED_DATABASE=true
# PLATFORM_DATABASE_URL=postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/railway
```

**Als `RAILWAY_USE_SHARED_DATABASE` er NIET staat, voeg toe:**

```bash
echo "" >> .env
echo "# Use shared database instead of creating separate Railway projects per client" >> .env
echo "# Set to 'true' to avoid creating 6+ duplicate projects!" >> .env
echo "RAILWAY_USE_SHARED_DATABASE=true" >> .env
```

### STAP 3: Test Shared Database Connectivity 🧪

```bash
# Test of shared database provisioning werkt
node test-shared-database.mjs
```

**Verwachte output:**

```
🗄️  Shared Database Test
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ Checking configuration...
✅ PLATFORM_DATABASE_URL configured
✅ RAILWAY_USE_SHARED_DATABASE=true

2️⃣ Connecting to shared PostgreSQL...
✅ Connected to PostgreSQL admin database

3️⃣ Testing database creation: client_test_aboland...
   Creating database 'client_test_aboland'...
   ✅ Created successfully
   ✅ Verified database exists

4️⃣ Testing connection to new database...
   ✅ Connected to client_test_aboland
   ✅ PostgreSQL version: PostgreSQL 17.7 (Debian...)

5️⃣ Cleanup: Dropping test database...
   ✅ Dropped client_test_aboland

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Shared Database Test PASSED!
```

**Als dit FAALT:**
- Check of `PLATFORM_DATABASE_URL` klopt in `.env`
- Test Railway verbinding: `PGPASSWORD="eBTNOrSGwkADvgAVJKyQtllGSjugdtrN" psql -h shinkansen.proxy.rlwy.net -p 29352 -U postgres -d railway`

### STAP 4: Cleanup Railway Duplicates 🧹

**Probleem:** Er staan nog 6x "client-plastimed01" duplicate projecten op Railway.app

**Oplossing:** Run cleanup script (eenmalig!)

```bash
node cleanup-railway-duplicates.mjs
```

**Je zult zien:**

```
🧹 Railway Duplicate Projects Cleanup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ Fetching all Railway projects...
✅ Found 9 total Railway projects

2️⃣ Found 6x "client-plastimed01" projects

📋 Project breakdown:

   ✅ KEEP (newest):
      • ID: proj_...
      • Created: 2026-02-21T12:00:00Z

   ❌ DELETE (duplicates):
      1. ID: proj_... (Created: 2026-02-21T11:55:00Z)
      2. ID: proj_... (Created: 2026-02-21T11:50:00Z)
      3. ID: proj_... (Created: 2026-02-21T11:45:00Z)
      4. ID: proj_... (Created: 2026-02-21T11:40:00Z)
      5. ID: proj_... (Created: 2026-02-21T11:35:00Z)

   Total to delete: 5 projects

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  Are you sure you want to DELETE 5 duplicate projects? (yes/no):
```

**Type: `yes`** en druk op Enter.

**Script zal:**
- 5 oude "client-plastimed01" projects verwijderen
- 1 nieuwste project behouden
- Totale tijd: ~5 seconden

**Verify op Railway.app:**
1. Ga naar https://railway.app/dashboard
2. Refresh pagina (F5 of Cmd+R)
3. Check: Zou nu **1x** "client-plastimed01" moeten zijn (geen 6x!)

### STAP 5: Test Aboland Provisioning 🚀

Nu alles klaar is, test de volledige provisioning flow:

```bash
# 1. Start development server
npm run dev

# Wacht tot je ziet:
# ✓ Ready in 2.5s
# ○ Local: http://localhost:3020
```

**Dan in browser:**

1. Open **http://localhost:3020/admin**
2. Login met platform admin credentials
3. Navigeer naar **Collections → Clients**
4. Open client **"Aboland"**
5. Wijzig **Status** naar: **"🔄 Wordt ingericht..."**
6. Klik **Save**

**Monitor de console output** - je zou moeten zien:

```bash
[Platform] Provisioning gestart voor: Aboland (aboland) — ID: xxx
[ProvisioningService] Starting provisioning for client: aboland
[ProvisioningService] Allocated port: 4002

# ⚡ BELANGRIJK: Check deze regel!
[Railway] RAILWAY_USE_SHARED_DATABASE=true - Using shared database mode

[Railway] Creating database 'client_aboland' on shared PostgreSQL server...
[Railway] Database 'client_aboland' created on shared server ✅

# Database URL returned (masked):
[ProvisioningService] Database provisioned: postgresql://postgres:***@railway/client_aboland

[PloiAdapter] Creating site: aboland.compassdigital.nl (port 4002)
[PloiAdapter] Site created: 123456
[PloiAdapter] Installing repository: compassdigitalnl/compassdigital-cms (main)
[PloiAdapter] Deployment script configured
[PloiAdapter] Environment variables set (15 vars)
[PloiAdapter] Triggering deployment...

[ProvisioningService] Deployment started: dep_abc123
[ProvisioningService] Monitoring deployment... (timeout: 10 minutes)

# ... deployment logs ...

[ProvisioningService] ✅ Deployment successful!
[ProvisioningService] Creating admin user: info@aboland.nl
[ProvisioningService] ✅ Admin user created

[ProvisioningService] Configuring DNS: aboland.compassdigital.nl → 123.45.67.89
[CloudflareService] A-record created successfully

[ProvisioningService] Requesting SSL certificate...
[PloiAdapter] SSL certificate issued by Let's Encrypt

[Platform] ✅ Provisioning voltooid voor Aboland: https://aboland.compassdigital.nl
```

**Succescriteria:**

✅ **Database:**
- `[Railway] RAILWAY_USE_SHARED_DATABASE=true` - Gebruikt shared mode
- `[Railway] Database 'client_aboland' created` - Database aangemaakt
- **GEEN** "Creating project: client-aboland" regel (zou nieuw Railway project zijn)

✅ **Ploi Site:**
- Site aangemaakt op https://aboland.compassdigital.nl
- Port 4002 toegewezen
- Git repository gekoppeld

✅ **DNS & SSL:**
- Cloudflare A-record aangemaakt
- SSL certificaat via Let's Encrypt

✅ **Admin Access:**
- Admin user aangemaakt: info@aboland.nl
- Wachtwoord in console logs (tijdelijk)

### STAP 6: Verify op Railway.app 🔍

**Check dat er GEEN nieuw "client-aboland" project is:**

1. Ga naar https://railway.app/dashboard
2. Check projects list
3. **Verwacht:** GEEN "client-aboland" project
4. **Verwacht:** WEL een nieuwe database in het shared project

**Hoe check je de nieuwe database?**

1. Open project: **compassdigital-cms-payload-db** (of je platform project)
2. Ga naar **Databases** tab
3. Kijk of je database `client_aboland` ziet

**OF via CLI:**

```bash
PGPASSWORD="eBTNOrSGwkADvgAVJKyQtllGSjugdtrN" psql \
  -h shinkansen.proxy.rlwy.net \
  -p 29352 \
  -U postgres \
  -d postgres \
  -c "SELECT datname FROM pg_database WHERE datname LIKE 'client_%' ORDER BY datname;"
```

**Expected output:**

```
      datname
--------------------
 client_aboland
 client_plastimed01
(2 rows)
```

### STAP 7: Test Aboland Site 🌐

**Test de gedeployde site:**

1. **Wacht ~5-10 minuten** voor eerste deployment (build time)
2. **Check site URL:** https://aboland.compassdigital.nl
3. **Check admin panel:** https://aboland.compassdigital.nl/admin

**Expected result:**
- Homepage toont Payload template
- Admin panel is bereikbaar
- Login werkt met credentials uit console

**Als site niet bereikbaar is:**
- Check Ploi deployment logs (zie Stap 8)
- Verify DNS propagation: `nslookup aboland.compassdigital.nl`
- Check Nginx config op Ploi

### STAP 8: Debug als Iets Faalt 🔧

#### Error: "RAILWAY_API_KEY not configured"

**Oorzaak:** `RAILWAY_USE_SHARED_DATABASE` is niet op `true` gezet

**Fix:**
```bash
echo "RAILWAY_USE_SHARED_DATABASE=true" >> .env
npm run dev  # Restart server
```

#### Error: "PLATFORM_DATABASE_URL not configured"

**Oorzaak:** Shared database URL ontbreekt

**Fix:**
```bash
# Check of het er is:
grep PLATFORM_DATABASE_URL .env

# Als niet, voeg toe:
echo "PLATFORM_DATABASE_URL=postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/railway" >> .env
```

#### Error: "Database already exists"

**Dit is GEEN error** - betekent dat de database al eerder is aangemaakt.

**Verify:**
```bash
PGPASSWORD="eBTNOrSGwkADvgAVJKyQtllGSjugdtrN" psql \
  -h shinkansen.proxy.rlwy.net -p 29352 -U postgres -d client_aboland -c "SELECT version();"
```

#### Ploi Deployment Faalt

**Check Ploi logs:**

1. Ga naar https://ploi.io/servers/108942
2. Zoek site "aboland.compassdigital.nl"
3. Klik op site
4. Ga naar **Deployments** tab
5. Klik op laatste deployment
6. Check deployment logs

**Common issues:**
- Build errors (npm install / npm run build faalt)
- Environment variables ontbreken
- Port conflict (4002 al in gebruik)

**Fix:**
```bash
# Re-trigger deployment via Ploi API:
curl -X POST "https://ploi.io/api/servers/108942/sites/{SITE_ID}/deployments" \
  -H "Authorization: Bearer $PLOI_API_TOKEN" \
  -H "Accept: application/json"
```

---

## 📊 Verwachte Database Structuur

**Na Aboland provisioning:**

```
Railway Project: compassdigital-cms-payload-db
├── Database: railway (platform CMS - localhost:3020)
├── Database: client_plastimed01 (plastimed01.compassdigital.nl)
└── Database: client_aboland (aboland.compassdigital.nl) ← NIEUW!
```

**Check via SQL:**

```sql
-- List all client databases
SELECT
  datname,
  pg_size_pretty(pg_database_size(datname)) as size
FROM pg_database
WHERE datname LIKE 'client_%'
ORDER BY datname;

-- Expected output:
--       datname       | size
-- --------------------+-------
--  client_aboland     | 8 MB
--  client_plastimed01 | 12 MB
```

---

## 📚 Referentie Documentatie

**Alle guides zijn in de repo:**

1. **`docs/RAILWAY_API_FIX_GUIDE.md`**
   - Complete Railway API troubleshooting
   - Root cause analysis van het duplicate probleem
   - Token generatie instructies

2. **`.env.example`**
   - Volledige environment variable documentatie
   - `RAILWAY_USE_SHARED_DATABASE` uitleg (lines 161-186)
   - `PLATFORM_DATABASE_URL` requirements

3. **Test Scripts:**
   - `test-railway-api.mjs` - Test Railway API token
   - `test-shared-database.mjs` - Test shared DB provisioning
   - `cleanup-railway-duplicates.mjs` - Cleanup duplicate projects

---

## ✅ Checklist

Vink af wat je hebt gedaan:

### Pre-provisioning Setup
- [ ] Git pull latest code (commits f35b7fb, 59b760c, 5700d1e)
- [ ] Verify `.env` has `RAILWAY_USE_SHARED_DATABASE=true`
- [ ] Verify `.env` has `PLATFORM_DATABASE_URL=postgresql://...`
- [ ] Run `node test-shared-database.mjs` → ✅ PASSED

### Cleanup (Eenmalig)
- [ ] Run `node cleanup-railway-duplicates.mjs`
- [ ] Type "yes" bij confirmation
- [ ] Verify Railway.app: 1x "client-plastimed01" (geen 6x!)

### Aboland Provisioning
- [ ] Start `npm run dev`
- [ ] Open http://localhost:3020/admin
- [ ] Clients → Aboland → Status: "🔄 Wordt ingericht..." → Save
- [ ] Console toont: `[Railway] RAILWAY_USE_SHARED_DATABASE=true`
- [ ] Console toont: `Database 'client_aboland' created`
- [ ] Console toont: `Provisioning voltooid`

### Verification
- [ ] Railway.app: GEEN "client-aboland" project (gebruikt shared DB!)
- [ ] Railway.app: Database `client_aboland` bestaat in shared project
- [ ] Ploi: Site "aboland.compassdigital.nl" aangemaakt
- [ ] DNS: `nslookup aboland.compassdigital.nl` → IP adres
- [ ] Site: https://aboland.compassdigital.nl bereikbaar (na 5-10 min)
- [ ] Admin: https://aboland.compassdigital.nl/admin bereikbaar

---

## 🎓 Wat Is Er Veranderd?

### Code Changes (3 Commits)

**1. `f35b7fb` - Railway API Error Handling**
- Betere error messages bij auth failures
- Duidelijke instructies voor token generatie
- Test script voor Railway API validation

**2. `59b760c` - Shared Database Mode**
- `RAILWAY_USE_SHARED_DATABASE` environment variable
- Shared database provisioning (1 Railway project, N databases)
- Voorkomt duplicate project creation
- Test script voor shared database

**3. `5700d1e` - Cleanup Script**
- Tool om oude duplicate projects te verwijderen
- Interactive (vraagt bevestiging)
- Safe (houdt nieuwste project)

### Environment Variables

**NIEUW in `.env`:**
```bash
RAILWAY_USE_SHARED_DATABASE=true
```

**Al bestaand (nu belangrijk):**
```bash
PLATFORM_DATABASE_URL=postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/railway
```

### Provisioning Flow

**VOOR:**
```
Client provisioning →
  Railway API: Create project "client-aboland" →
  Railway API: Create PostgreSQL service →
  Wait for DATABASE_URL →
  Continue with Ploi...

PROBLEEM: Elke run maakte NIEUW project (6+ duplicates)
```

**NA:**
```
Client provisioning →
  Check: RAILWAY_USE_SHARED_DATABASE=true? →
  Connect to PLATFORM_DATABASE_URL →
  Create database "client_aboland" (if not exists) →
  Return connection string →
  Continue with Ploi...

OPLOSSING: Gebruikt shared DB, geen duplicate projects!
```

---

## 💰 Kosten Impact

**VOOR (Per-Client Mode):**
- 6x "client-plastimed01" projects = €30/month
- 1x "client-aboland" project = €5/month
- **Totaal:** €35/month (en groeiend!)

**NA (Shared Mode):**
- 1x shared PostgreSQL project = €5/month
- Unlimited databases in dat project = €0 extra
- **Totaal:** €5/month (fixed!)

**Besparing:** €30/month (86% goedkoper!)

---

## 🚨 Belangrijke Notities

1. **Cleanup script is eenmalig**
   - Run het 1x om oude duplicates te verwijderen
   - Na cleanup blijft 1x "client-plastimed01" over
   - Toekomstige provisioning maakt GEEN nieuwe projects

2. **Shared mode is nu default**
   - `RAILWAY_USE_SHARED_DATABASE=true` in `.env`
   - Alle nieuwe clients gebruiken shared database
   - Kostenefficiënt en geen duplicates

3. **Database isolatie blijft bestaan**
   - Elke client krijgt eigen database: `client_[domain]`
   - Volledige data isolatie per client
   - Alleen infrastructuur is shared (het Railway project)

4. **Railway API token**
   - Token in `.env` werkt mogelijk niet voor GraphQL queries
   - MAAR dat maakt niet meer uit - we gebruiken shared mode!
   - Token is alleen nodig voor cleanup script (eenmalig)

---

## 📞 Support

**Als er problemen zijn:**

1. **Check logs:**
   ```bash
   # Development server logs
   npm run dev

   # Look for [Railway], [ProvisioningService], [PloiAdapter] prefixes
   ```

2. **Run diagnostics:**
   ```bash
   # Test shared database
   node test-shared-database.mjs

   # Test Railway API (optional)
   node test-railway-api.mjs
   ```

3. **Check Railway dashboard:**
   - https://railway.app/dashboard
   - Verify geen duplicate projects
   - Check database exists in shared project

4. **Check Ploi dashboard:**
   - https://ploi.io/servers/108942
   - Verify site is created
   - Check deployment logs

5. **Documentatie:**
   - `docs/RAILWAY_API_FIX_GUIDE.md` - Complete troubleshooting
   - `.env.example` - Environment variables reference

---

**Succes met provisioning! 🚀**

**Verwachte resultaat:**
- ✅ Aboland site live op https://aboland.compassdigital.nl
- ✅ GEEN duplicate Railway projects
- ✅ Kostenefficiënte shared database setup
- ✅ Schaalbaar voor toekomstige clients
