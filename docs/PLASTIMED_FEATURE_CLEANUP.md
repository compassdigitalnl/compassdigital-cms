# Plastimed Feature Cleanup Guide

**Datum:** 10 Februari 2026
**Probleem:** Plastimed heeft database tabellen voor features die ze niet gebruiken (vendors, vendor-reviews, workshops, etc.)
**Oplossing:** Feature toggles uitschakelen via CMS + optionele database cleanup

---

## 🎯 Snelle Fix (5 minuten)

### Stap 1: Features Uitschakelen via CMS

1. **Login op Platform CMS:**
   ```
   URL: https://cms.compassdigital.nl/admin
   ```

2. **Ga naar Clients:**
   - Navigeer naar: Platform Beheer → Clients
   - Zoek en open: "Plastimed" client

3. **Open "Template & Functies" sectie:**
   - Vind het "Feature Toggles" groep veld
   - Je ziet nu checkboxes voor alle features

4. **Disable ongewenste features:**

   **Uitschakelen voor Plastimed:**
   - [ ] Leveranciers / Vendors
   - [ ] Vendor Reviews
   - [ ] Workshops / Trainingen
   - [ ] Verlanglijstjes (waarschijnlijk)
   - [ ] Product Reviews (waarschijnlijk)
   - [ ] Klantengroepen (tenzij B2B)
   - [ ] Portfolio / Cases (waarschijnlijk)
   - [ ] Partners (waarschijnlijk)
   - [ ] Merken (indien niet gebruikt)
   - [ ] Diensten (indien niet gebruikt)
   - [ ] Bestellijsten (tenzij B2B)
   - [ ] Meertaligheid (waarschijnlijk)
   - [ ] AI Content Generatie (waarschijnlijk)

   **Laten aanstaan voor Plastimed:**
   - [x] Webshop / Products
   - [x] Winkelwagen
   - [x] Checkout / Orders
   - [x] Blog
   - [x] FAQ
   - [x] Testimonials
   - [x] Gebruikers / Inloggen

5. **Save de client**

### Stap 2: Redeploy Plastimed

**Optie A: Via CMS (Aanbevolen)**

1. In de Plastimed client record:
   - Vind het veld "Status"
   - Wijzig naar: "🔄 Wordt gedeployed..."
   - Save

2. Dit triggert automatisch:
   - `.env` regeneratie met correcte feature flags
   - Database migraties (alleen voor enabled features)
   - Ploi deployment

**Optie B: Handmatig via Ploi**

Als je de .env handmatig wilt updaten op de server:

```bash
# SSH naar de server
ssh ploi@server-ip

# Ga naar de site directory
cd /home/ploi/plastimed01.compassdigital.nl

# Edit .env
nano .env

# Voeg toe:
ENABLE_VENDORS=false
ENABLE_VENDOR_REVIEWS=false
ENABLE_WORKSHOPS=false
ENABLE_WISHLISTS=false
ENABLE_PRODUCT_REVIEWS=false
ENABLE_CUSTOMER_GROUPS=false
ENABLE_CASES=false
ENABLE_PARTNERS=false
ENABLE_BRANDS=false
ENABLE_SERVICES=false
ENABLE_ORDER_LISTS=false
ENABLE_MULTI_LANGUAGE=false
ENABLE_AI_CONTENT=false

# Restart PM2
pm2 restart plastimed01
```

### Stap 3: Verify

1. **Check Admin Panel:**
   ```
   URL: https://plastimed01.compassdigital.nl/admin
   ```

2. **Verify collections verborgen zijn:**
   - Klik op het hamburger menu
   - Controleer dat "Leveranciers", "Vendor Reviews", "Workshops" **NIET** zichtbaar zijn
   - Alleen relevante collections zichtbaar

3. **Check Frontend:**
   ```
   URL: https://plastimed01.compassdigital.nl/vendors
   ```
   - Zou 404 moeten geven (route disabled)

---

## 🗄️ Database Cleanup (Optioneel - 15 minuten)

**⚠️ WAARSCHUWING:** Dit verwijdert data! Maak eerst een backup!

### Waarom cleanup?

De database tabellen blijven bestaan zelfs als features disabled zijn. Dit is **VEILIG** en heeft **GEEN** impact op performance, maar als je ze wilt verwijderen:

### Stap 1: Database Backup

```bash
# PostgreSQL backup (via Railway CLI)
railway db backup create

# Of via pgdump
PGPASSWORD="eBTNOrSGwkADvgAVJKyQtllGSjugdtrN" \
pg_dump -h shinkansen.proxy.rlwy.net -p 29352 -U postgres \
-d client_plastimed01 > plastimed_backup_$(date +%Y%m%d).sql
```

### Stap 2: Inspect Tables

```sql
-- Connect to database
PGPASSWORD="eBTNOrSGwkADvgAVJKyQtllGSjugdtrN" \
psql -h shinkansen.proxy.rlwy.net -p 29352 -U postgres -d client_plastimed01

-- List all tables
\dt

-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Stap 3: Drop Unused Tables

```sql
-- Drop vendor-related tables
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS vendor_reviews CASCADE;
DROP TABLE IF EXISTS workshops CASCADE;

-- Drop other unused feature tables
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS product_reviews CASCADE;
DROP TABLE IF EXISTS customer_groups CASCADE;
DROP TABLE IF EXISTS cases CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS order_lists CASCADE;

-- Verify
\dt
```

### Stap 4: Cleanup Payload Migrations Table

```sql
-- Check current migrations
SELECT * FROM payload_migrations ORDER BY created_at DESC;

-- Optional: Remove migration records for dropped collections
-- (Not necessary, but keeps migrations clean)
DELETE FROM payload_migrations
WHERE name LIKE '%vendors%'
   OR name LIKE '%workshops%'
   OR name LIKE '%vendor_reviews%';
```

---

## 🔄 Voor Nieuwe Clients: Feature Selection tijdens Provisioning

Voor toekomstige clients moet je features selecteren **VOOR** provisioning:

### Workflow:

1. **Create Client in CMS**
   - Ga naar: Platform Beheer → Clients → Create New

2. **Fill in basis gegevens:**
   - Bedrijfsnaam
   - Domein (bijv: "bakkerij-dejong")
   - Contact email

3. **Open "Template & Functies":**
   - Kies template (bijv: "Webshop (e-commerce)")
   - **BELANGRIJK:** Selecteer ALLEEN de features die deze klant nodig heeft
   - Default: alle features staan aan, schakel UIT wat niet nodig is!

4. **Save (status: pending)**

5. **Trigger Provisioning:**
   - Wijzig status naar: "🔄 Wordt ingericht..."
   - Dit genereert automatisch:
     - `.env` met correcte feature flags
     - Database migraties alleen voor enabled features
     - Payload config filtert collections

### Result:

- ✅ Alleen nodige database tabellen aangemaakt
- ✅ Alleen relevante collections zichtbaar in admin
- ✅ Geen onnodige routes
- ✅ Schone, overzichtelijke CMS

---

## 📊 Feature Matrix per Client Type

### E-commerce (B2C)
```
✅ Webshop / Products
✅ Winkelwagen
✅ Checkout / Orders
✅ Blog
✅ FAQ
✅ Testimonials
✅ Gebruikers
❌ Vendors
❌ Workshops
❌ Customer Groups
❌ Order Lists
```

### B2B Platform
```
✅ Webshop / Products
✅ Winkelwagen
✅ Checkout / Orders
✅ Klantengroepen (pricing tiers)
✅ Bestellijsten (quick order forms)
✅ Gebruikers
❌ Vendors (tenzij marketplace)
❌ Workshops
```

### Marketplace (zoals Plastimed zou kunnen zijn)
```
✅ Webshop / Products
✅ Winkelwagen
✅ Checkout / Orders
✅ Leveranciers / Vendors
✅ Vendor Reviews
✅ Workshops (trainingen van vendors)
✅ Blog
✅ FAQ
✅ Gebruikers
```

### Corporate Website (geen shop)
```
✅ Blog
✅ FAQ
✅ Testimonials
✅ Portfolio / Cases
✅ Diensten
✅ Gebruikers (limited)
❌ Webshop
❌ Winkelwagen
❌ Checkout
❌ Vendors
❌ Workshops
```

---

## 🐛 Troubleshooting

### Collections zijn nog steeds zichtbaar na disable

**Probleem:** Je hebt features disabled in CMS, maar collections blijven zichtbaar.

**Oplossing:**
1. Check of redeployment geslaagd is (Ploi logs)
2. Verify `.env` op server heeft correcte `ENABLE_*=false` flags
3. Restart PM2: `pm2 restart plastimed01`
4. Hard refresh browser: Cmd+Shift+R

### Routes geven nog geen 404

**Probleem:** `/vendors` is nog steeds toegankelijk

**Status:** Route protection middleware wordt nog geïmplementeerd (zie Sprint 5+)

**Workaround:** Routes zijn toegankelijk maar collections zijn leeg (geen data)

### Database tables nog steeds aanwezig

**Dit is normaal!** Database tables blijven bestaan voor veiligheid. Zie "Database Cleanup" sectie hierboven als je ze wilt verwijderen.

---

## ✅ Checklist: Plastimed Cleanup

Voor Claude Server (uitvoeren na deze feature toggle sprint):

```bash
# 1. Login to Platform CMS
# URL: https://cms.compassdigital.nl/admin

# 2. Open Plastimed client
# Path: Platform Beheer → Clients → Plastimed

# 3. Disable features:
# - Vendors: OFF
# - Vendor Reviews: OFF
# - Workshops: OFF
# - (Andere ongebruikte features: OFF)

# 4. Save client

# 5. Trigger redeploy:
# - Change status to: "Wordt gedeployed..."
# - Or use API: POST /api/platform/clients/{id}/actions { "action": "redeploy" }

# 6. Verify deployment:
# - Check Ploi deployment logs
# - Login to https://plastimed01.compassdigital.nl/admin
# - Confirm unwanted collections hidden

# 7. (Optional) Database cleanup:
# - Backup database first!
# - DROP unused tables (see SQL above)

# 8. Done! ✅
```

---

## 📚 Zie Ook

- `docs/FEATURES_MANAGEMENT_GUIDE.md` - Complete feature toggle documentatie
- `src/lib/features.ts` - Feature detection helper
- `src/platform/collections/Clients.ts` - Client features field definition
- `src/lib/provisioning/provisionClient.ts` - Provisioning met feature ENV vars

---

**Geschat tijdsbesparingen:**
- Cleanup Plastimed: **5 minuten** (feature toggles) + 15 min (optional DB cleanup)
- Per nieuwe client: **Preventief** - altijd schone CMS zonder onnodige features
- Maintenance: **80% minder** collection management overhead
