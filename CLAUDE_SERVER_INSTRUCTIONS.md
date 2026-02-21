# 🤖 Instructies voor Claude Server: Plastimed Feature Cleanup

**Datum:** 10 Februari 2026
**Actie:** Disable ongebruikte features voor Plastimed deployment
**Tijd:** ~5-10 minuten

---

## ✅ Wat moet je doen?

Plastimed gebruikt momenteel veel features die ze niet nodig hebben. Deze moeten uitgeschakeld worden via het CMS, zodat:
- Admin panel overzichtelijker wordt (geen onnodige collections)
- Routes voor disabled features 404 geven
- Database optioneel opgeschoond kan worden

---

## 📋 Stap-voor-stap Actieplan

### Stap 1: Login op Platform CMS

```
URL: https://cms.compassdigital.nl/admin
Email: [jouw admin email]
Password: [jouw admin password]
```

### Stap 2: Open Plastimed Client

1. Klik in sidebar: **Platform Beheer** → **Clients**
2. Zoek en open: **"Plastimed"** client record
3. Je ziet nu het Plastimed client formulier

### Stap 3: Features Aanpassen

1. **Scroll naar sectie:** "Template & Functies"
2. **Klik op de sectie** om deze uit te klappen
3. **Vind het veld:** "Feature Toggles"
4. **Je ziet nu 20+ checkboxes** gegroepeerd per categorie

### Stap 4: Disable Ongebruikte Features

**❌ UITVINKEN (DISABLE):**

**Marketplace Features:**
- [ ] Leveranciers / Vendors
- [ ] Vendor Reviews
- [ ] Workshops / Trainingen

**Content Features:**
- [ ] Verlanglijstjes
- [ ] Portfolio / Cases
- [ ] Partners
- [ ] Diensten

**Advanced Features:**
- [ ] AI Content Generatie

**✅ AANGEVINKT LATEN (ENABLED):**

**E-commerce Features:**
- [x] Webshop / Products
- [x] Winkelwagen
- [x] Checkout / Orders
- [x] Product Reviews
- [x] Klantengroepen (B2B)

**Content Features:**
- [x] Blog
- [x] FAQ
- [x] Testimonials
- [x] Merken

**Advanced Features:**
- [x] Bestellijsten
- [x] Meertaligheid
- [x] Gebruikers / Inloggen

### Stap 5: Save Client

1. **Scroll naar beneden**
2. **Klik op:** "Save" button (rechtsboven of onderaan)
3. Wacht tot save compleet is

### Stap 6: Trigger Deployment

**Optie A: Via CMS (Aanbevolen)**

1. Scroll terug naar boven van het formulier
2. Vind het veld: **"Status"** (sidebar)
3. **Wijzig naar:** "🔄 Wordt gedeployed..."
4. **Klik:** "Save"
5. **Wacht:** 5-10 minuten tot deployment compleet is

**Dit triggert automatisch:**
- Git pull latest code
- ENV regeneratie met nieuwe feature flags
- Database migraties
- PM2 restart
- SSL certificaat check

**Optie B: Via Sync API (Sneller - geen rebuild)**

```bash
# Get Plastimed client ID
PLASTIMED_ID=$(curl -s https://cms.compassdigital.nl/api/platform/clients \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" | jq -r '.docs[] | select(.name == "Plastimed") | .id')

# Sync features to deployment
curl -X POST https://cms.compassdigital.nl/api/platform/clients/${PLASTIMED_ID}/sync-features \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"

# SSH to server and restart PM2
ssh ploi@[server-ip]
cd /home/ploi/plastimed01.compassdigital.nl
pm2 restart plastimed01
```

### Stap 7: Verify Changes

1. **Open Plastimed Admin:**
   ```
   URL: https://plastimed01.compassdigital.nl/admin
   ```

2. **Check Collections Menu:**
   - Klik op hamburger menu (linksboven)
   - **Controleer dat NIET zichtbaar zijn:**
     - ❌ Leveranciers
     - ❌ Vendor Reviews
     - ❌ Workshops
     - ❌ Verlanglijstjes
     - ❌ Cases
     - ❌ Partners
     - ❌ Diensten
   - **Controleer dat WEL zichtbaar zijn:**
     - ✅ Producten
     - ✅ Productcategorieën
     - ✅ Blog Posts
     - ✅ FAQ
     - ✅ Testimonials
     - ✅ Merken
     - ✅ Klantengroepen
     - ✅ Bestellijsten

3. **Test Disabled Routes (should return 404):**
   ```
   https://plastimed01.compassdigital.nl/vendors → 404 ✅
   https://plastimed01.compassdigital.nl/workshops → 404 ✅
   ```

4. **Test Enabled Routes (should work):**
   ```
   https://plastimed01.compassdigital.nl/shop → Works ✅
   https://plastimed01.compassdigital.nl/blog → Works ✅
   ```

---

## 🗄️ Database Cleanup (Optioneel - 15 min extra)

**⚠️ WAARSCHUWING:** Dit verwijdert data permanent! Maak eerst backup!

**Vraag:** Wil je ook de database tables verwijderen voor disabled features?

**Antwoord:**
- **JA** → Volg stappen hieronder
- **NEE** → Skip dit! Tables blijven bestaan maar hebben geen impact

### Als JA - Database Cleanup:

```bash
# 1. Backup database EERST!
PGPASSWORD="eBTNOrSGwkADvgAVJKyQtllGSjugdtrN" \
pg_dump -h shinkansen.proxy.rlwy.net -p 29352 -U postgres \
-d client_plastimed01 > plastimed_backup_$(date +%Y%m%d).sql

# 2. Connect to database
PGPASSWORD="eBTNOrSGwkADvgAVJKyQtllGSjugdtrN" \
psql -h shinkansen.proxy.rlwy.net -p 29352 -U postgres -d client_plastimed01

# 3. Drop ALLEEN disabled feature tables
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS vendor_reviews CASCADE;
DROP TABLE IF EXISTS workshops CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS cases CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS services CASCADE;

# 4. NIET droppen (features blijven actief):
# - product_reviews
# - customer_groups
# - brands
# - order_lists

# 5. Verify
\dt

# 6. Exit
\q
```

---

## ✅ Checklist - Confirm Completion

- [ ] Login op CMS succesvol
- [ ] Plastimed client geopend
- [ ] Features disabled (8 features UIT)
- [ ] Features enabled (12 features AAN blijven)
- [ ] Client opgeslagen
- [ ] Deployment getriggerd
- [ ] Deployment succesvol (check Ploi logs)
- [ ] Plastimed admin panel gecontroleerd
- [ ] Collections correct verborgen
- [ ] Routes geven 404 voor disabled features
- [ ] (Optioneel) Database cleanup uitgevoerd

---

## 🐛 Troubleshooting

### Collections blijven zichtbaar na deployment

**Check:**
```bash
# SSH to server
ssh ploi@[server-ip]
cd /home/ploi/plastimed01.compassdigital.nl

# Check .env file
grep "ENABLE_" .env

# Should show:
# ENABLE_VENDORS=false
# ENABLE_WORKSHOPS=false
# etc.

# If wrong, restart PM2
pm2 restart plastimed01

# Hard refresh browser
# Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

### Deployment failed

**Check Ploi logs:**
1. Login to Ploi dashboard
2. Navigate to server → plastimed01 site
3. Click "Deployments" tab
4. Check latest deployment log for errors

**Common fixes:**
- Re-trigger deployment via CMS
- Check ENV vars are correct
- Verify git repo is accessible

### Routes geven GEEN 404

**Mogelijk:**
- Feature guards not yet implemented for all routes
- Browser cache (hard refresh: Cmd+Shift+R)
- PM2 not restarted

---

## 📊 Expected Result

### Before:
- ❌ 30+ collections in admin panel
- ❌ Confusing UI met onnodige features
- ❌ Database heeft 15+ unused tables

### After:
- ✅ ~15 relevante collections (50% reduction!)
- ✅ Clean, focused admin interface
- ✅ Disabled features return 404
- ✅ (Optional) Database cleaned up

---

## 📚 Referenties

- **Complete Guide:** `docs/PLASTIMED_FEATURE_CLEANUP.md`
- **Feature System:** `docs/FEATURES_MANAGEMENT_GUIDE.md`
- **Code:** `src/lib/features.ts`, `src/platform/collections/Clients.ts`

---

## ⏱️ Geschatte Tijd

- CMS changes: **3 minuten**
- Deployment: **5-10 minuten**
- Verification: **2 minuten**
- (Optional) DB cleanup: **15 minuten**

**Total:** 10-30 minuten (afhankelijk van DB cleanup)

---

## ✅ Success Criteria

Je bent klaar als:
1. Plastimed admin panel toont alleen relevante collections ✅
2. `/vendors` en `/workshops` routes geven 404 ✅
3. Shop, blog, product reviews werken nog steeds ✅
4. Deployment logs tonen success ✅

---

**Klaar? Report back met screenshots van:**
1. CMS feature toggles (saved state)
2. Plastimed admin menu (collections list)
3. 404 page voor `/vendors` route

**Vragen?** Zie `docs/PLASTIMED_FEATURE_CLEANUP.md` voor uitgebreide troubleshooting!

---

🤖 **Generated by Claude Code** - Feature Toggle System Implementation
