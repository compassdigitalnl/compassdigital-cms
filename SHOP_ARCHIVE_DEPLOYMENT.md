# 🚀 Server Deployment - Shop Archive Template System

**Voor:** https://plastimed01.compassdigital.nl
**Datum:** 19 Februari 2026
**Status:** ⚠️ **BELANGRIJK: Server Update Nodig!**

---

## 📋 Wat Is Er Nieuw?

### 1. Shop Archive Template System ✅
- **Nieuw:** Shop Archive Template 1 - Enterprise
- **Template switcher** in Settings > Templates tab
- **Meest volledig** template met alle enterprise features

### 2. Enterprise Features ✅
- **Category Hero** - Statistieken (86 producten, 12 merken, 94% op voorraad)
- **Sidebar Filters** - Merk, Materiaal, Beschikbaarheid
- **Grid/List Toggle** - 3-kolom grid of full-width list view
- **Sort Options** - Relevantie, prijs, nieuwste, best beoordeeld
- **Quick-Add** - Quantity stepper + add to cart button per product
- **Volume Pricing** - Staffelprijzen badge indicator
- **Stock Status** - Kleur-gecodeerde badges (groen/oranje/rood)
- **Active Filters** - Removable filter chips
- **Pagination** - Ready voor grote catalogi

### 3. Settings Update ✅
- **Nieuw veld:** `defaultShopArchiveTemplate` in Templates tab
- **Default:** 'shoparchivetemplate1'
- **Toekomstig:** Template 2 & 3 later toevoegen

---

## 🎨 Template 1 Features (Enterprise)

### Category Hero
```
┌─────────────────────────────────────────────────────┐
│ Deep Navy Gradient Background                       │
│ ┌─────────────┐                                     │
│ │ 📦 Categorie │                                    │
│ └─────────────┘                                     │
│                                                      │
│ Handschoenen (H1, 36px, bold)                      │
│ Onderzoekshandschoenen, operatiehandschoenen...     │
│                                                      │
│ [86 Producten] [12 Merken] [94% Op voorraad]       │
└─────────────────────────────────────────────────────┘
```

### Sidebar Filters
```
┌─────────────────┐
│ 🏆 Merk         │
│ ☑ Hartmann (24)│
│ ☐ Medline (18) │
│ ☐ Ansell (14)  │
├─────────────────┤
│ 📐 Materiaal    │
│ ☑ Nitrile (34) │
│ ☐ Latex (18)   │
├─────────────────┤
│ 📦 Beschikbaar  │
│ ☑ Op voorraad  │
│   (81 stuks)   │
└─────────────────┘
```

### Product Cards (Grid View)
```
┌─────────────────────────┐
│ 🖼️ Product Image       │
│ [❤️] [👁️] (hover)     │
├─────────────────────────┤
│ HARTMANN (brand badge)  │
│ Peha-soft Nitrile Fino  │
│ Art. 942210             │
│ €8,95 excl. BTW        │
│ 📊 Staffelprijzen       │
│ [- 1 +] [🛒]           │
│ ─────────────────────   │
│ ● Op voorraad          │
└─────────────────────────┘
```

### Toolbar
```
[24 van 86 producten]  [Filters: Hartmann ×] [Nitrile ×] [Maat S-M ×]
                       [Sort: Relevantie ▼] [Grid ⚏] [List ≡]
```

---

## ⚠️ BELANGRIJK: Database Migratie

**Dit deployment vereist een database migratie!**

### Wat Gebeurt Er?

**Settings Update:**
- Field toegevoegd: `defaultShopArchiveTemplate`
- Type: select (dropdown)
- Default value: 'shoparchivetemplate1'
- Opties: Shop Archive Template 1 - Enterprise (meer later)

**Bestaande Data:**
- Settings global wordt bijgewerkt met nieuw veld
- Automatisch bij server start (Payload migratie)
- Geen data verlies

---

## 🚀 Deployment Commando's

**SSH naar de server en voer deze commando's uit:**

```bash
# ═══════════════════════════════════════════════════════════
# STAP 1: Ga naar project folder
# ═══════════════════════════════════════════════════════════
cd /home/ploi/plastimed01.compassdigital.nl

# ═══════════════════════════════════════════════════════════
# STAP 2: Stop server (belangrijk voor database migratie!)
# ═══════════════════════════════════════════════════════════
pm2 stop all

# ═══════════════════════════════════════════════════════════
# STAP 3: Backup database (veiligheid!)
# ═══════════════════════════════════════════════════════════
# Voor PostgreSQL:
PGPASSWORD="eBTNOrSGwkADvgAVJKyQtllGSjugdtrN" pg_dump \
  -h shinkansen.proxy.rlwy.net \
  -p 29352 \
  -U postgres \
  -d railway \
  > backup_$(date +%Y%m%d_%H%M%S).sql

# Voor SQLite:
# cp payload.db payload.db.backup

# ═══════════════════════════════════════════════════════════
# STAP 4: Haal nieuwe code op
# ═══════════════════════════════════════════════════════════
git pull origin main

# ═══════════════════════════════════════════════════════════
# STAP 5: Installeer dependencies (als nodig)
# ═══════════════════════════════════════════════════════════
npm install

# ═══════════════════════════════════════════════════════════
# STAP 6: Regenereer Payload types (BELANGRIJK!)
# ═══════════════════════════════════════════════════════════
npm run payload generate:types

# ═══════════════════════════════════════════════════════════
# STAP 7: Build applicatie
# ═══════════════════════════════════════════════════════════
npm run build

# ═══════════════════════════════════════════════════════════
# STAP 8: Start server (auto-migratie gebeurt nu!)
# ═══════════════════════════════════════════════════════════
pm2 restart all
pm2 save

# ═══════════════════════════════════════════════════════════
# STAP 9: Check server logs voor migratie
# ═══════════════════════════════════════════════════════════
pm2 logs --lines 50
# Kijk voor: Settings migration successful
```

---

## ✅ Verificatie

### 1. Is Shop Archive Template Zichtbaar?

```
1. Open: https://plastimed01.compassdigital.nl/admin
2. Settings → Templates tab
3. Zie je "Standaard Shop Archive Template" dropdown?
   ✅ Ja? Perfect! Settings migratie geslaagd!
   ❌ Nee? Check server logs: pm2 logs --lines 100
```

### 2. Test Shop Archive Page

```
1. Bezoek: https://plastimed01.compassdigital.nl/shop
2. Zie je:
   - Category hero met stats? (producten, merken, % op voorraad)
   - Sidebar filters? (Merk, Materiaal, Beschikbaarheid)
   - Product grid met 3 kolommen?
   - Toolbar met sort dropdown?
   - Grid/List toggle buttons?
3. Badge rechtsboven moet BLAUW zijn:
   "🏢 Shop Archive Template 1 - Enterprise"
   ✅ Blauw? Template werkt!
   ❌ Geen badge? Check console logs
```

### 3. Test Template Features

```
✅ Category Hero:
   - Zie je statistieken? (86 producten, 12 merken, 94%)
   - Gradient achtergrond (deep navy)?

✅ Sidebar Filters:
   - Merk filter met checkboxes?
   - Materiaal filter?
   - Beschikbaarheid filter?

✅ Product Cards:
   - Product images laden?
   - Brand badge (uppercase, blauw)?
   - SKU/Art. nummer (monospace)?
   - Prijs correct?
   - "Staffelprijzen" badge zichtbaar (als van toepassing)?
   - Quick-add: [- 1 +] [cart button]?
   - Stock status: groen/oranje dot + tekst?

✅ Toolbar:
   - Result count: "24 van 86 producten"?
   - Sort dropdown werkt?
   - Grid/List toggle werkt?
     - Grid: 3 kolommen
     - List: full-width, image links

✅ Interactivity:
   - Quantity stepper werkt? (+ / -)
   - Add to cart button werkt?
   - Filter checkboxes klikbaar?
   - View toggle switcht layout?
```

---

## 🐛 Troubleshooting

### Shop Page Crasht

**Probleem:** /shop toont "Oeps!" error

**Oplossing:**
```bash
# Check server logs
pm2 logs --lines 200 | grep -i error

# Waarschijnlijk Settings fetch error
# Check of Settings global bestaat:
PGPASSWORD="..." psql -h ... -U postgres -d railway -c "SELECT * FROM settings LIMIT 1;"

# Als geen settings, rebuild:
npm run payload generate:types
npm run build
pm2 restart all
```

### Template Selector Niet Zichtbaar

**Probleem:** Settings > Templates tab toont geen "Shop Archive Template"

**Oplossing:**
```bash
# Check server logs voor migratie errors
pm2 logs --lines 100 | grep -i settings

# Hard refresh browser:
# Cmd+Shift+R (Mac) of Ctrl+Shift+R (Windows)

# Als dat niet werkt, rebuild:
npm run payload generate:types
npm run build
pm2 restart all
```

### Build Faalt

**Probleem:** `npm run build` geeft TypeScript errors

**Oplossing:**
```bash
# Check welke errors:
npm run typecheck

# Als ShopArchiveTemplate1 errors:
npm run payload generate:types
npm run build

# Check specifieke errors:
grep -n "ShopArchiveTemplate" src/app/\(app\)/shop/*.tsx
```

### Products Niet Zichtbaar

**Probleem:** Shop page toont geen producten

**Check:**
```bash
# Database heeft producten?
PGPASSWORD="..." psql -h ... -U postgres -d railway -c "SELECT COUNT(*) FROM products WHERE status='published';"

# Als geen producten, seed database:
npm run seed:products

# Check product images:
PGPASSWORD="..." psql -h ... -U postgres -d railway -c "SELECT id, title, status, stock FROM products LIMIT 10;"
```

---

## 📊 Wat Is Er Veranderd?

### Nieuwe Files
```
✅ src/app/(app)/shop/ShopArchiveTemplate1.tsx (enterprise template - 660 lines)
✅ docs/design/plastimed-shop-archive.html (design reference)
✅ SHOP_ARCHIVE_DEPLOYMENT.md (deze guide)
```

### Aangepaste Files
```
✅ src/app/(app)/shop/page.tsx (template switcher + Settings integration)
✅ src/globals/Settings.ts (defaultShopArchiveTemplate field toegevoegd)
✅ src/payload-types.ts (geregenereerd met nieuwe Settings schema)
```

### Database Changes
```
⚠️ Settings global update:
   - Field: defaultShopArchiveTemplate
   - Type: select
   - Default: 'shoparchivetemplate1'
   - Options: ['shoparchivetemplate1'] (meer later)
```

---

## 🎯 Na Deployment Taken

### 1. Selecteer Template in Admin (1 min)

```
1. Admin → Settings → Templates tab
2. Zie "Standaard Shop Archive Template"
3. Default is al: "Shop Archive Template 1 - Enterprise"
4. Save (als nodig)
```

### 2. Test Shop Page (3 min)

```
1. Bezoek: /shop
2. Check category hero (stats kloppen?)
3. Test filters (checkboxes werken?)
4. Test view toggle (grid ⇄ list)
5. Test sort dropdown
6. Test quick-add to cart:
   - Click [+] button → quantity verhoogt
   - Click [cart] button → product toegevoegd aan cart
7. Check stock badges (groen/oranje correct?)
8. Check staffelprijzen badge (als producten volume pricing hebben)
```

### 3. Template 2 & 3 Voorbereiden (toekomstig)

```
Later kunnen we toevoegen:
- Shop Archive Template 2 - Minimal
  - Single column, centered
  - Minimal filters
  - Clean, modern design

- Shop Archive Template 3 - Luxury
  - Large product cards
  - Minimal UI
  - Premium feel
```

---

## ✅ Success Checklist

- [ ] `git pull` succesvol
- [ ] Database backup gemaakt
- [ ] `npm install` succesvol
- [ ] `npm run payload generate:types` succesvol
- [ ] `npm run build` succesvol
- [ ] Server herstart zonder errors
- [ ] "Standaard Shop Archive Template" zichtbaar in Settings
- [ ] /shop page laadt zonder errors
- [ ] Category hero toont stats
- [ ] Sidebar filters zichtbaar
- [ ] Product grid toont 3 kolommen
- [ ] Grid/List toggle werkt
- [ ] Sort dropdown werkt
- [ ] Quick-add to cart werkt
- [ ] Stock badges tonen correct (groen/oranje)
- [ ] Staffelprijzen badge zichtbaar (als van toepassing)
- [ ] Badge rechtsboven toont: "Shop Archive Template 1 - Enterprise" (blauw)

---

## 🎨 Design Features Overzicht

### Category Hero
- **Gradient:** Deep Navy (#1A1F36) → Navy Light (#232942)
- **Badge:** Blue glow, rounded pill, uppercase
- **Stats:** 3 kolommen (producten, merken, % voorraad)
- **Typography:** 36px bold heading, 16px description

### Sidebar Filters
- **Card Style:** White bg, 1px border, 16px radius
- **Icons:** Lucide React (Award, Layers, PackageCheck)
- **Checkboxes:** 18px, 5px radius, blue check on select
- **Counts:** Gray text, right-aligned

### Product Cards
- **Layout:**
  - Grid: 3 kolommen, 20px gap
  - List: full-width, image left (200px), info right
- **Image:** Aspect square (grid), contain (list)
- **Brand:** Uppercase, 11px, blue color, bold
- **Title:** 14px, 600 weight, 2-line clamp
- **SKU:** Monospace font, 11px, gray
- **Price:** 20px, 800 weight, heading font
- **Quick-Add:**
  - Quantity: 3 buttons (-, input, +), monospace
  - Cart button: 42px, blue, white icon, shadow
- **Stock:** Colored dot (6px circle) + text

### Toolbar
- **Result Count:** "24 van 86 producten", 14px
- **Active Filters:** Chips met X icon, blue bg, removable
- **Sort:** Dropdown, 13px, rounded, chevron icon
- **View Toggle:** 2 buttons, grid/list icons, active state blue

### Pagination
- **Buttons:** 42px squares, rounded, blue active state
- **Icons:** Chevron left/right
- **Numbers:** 1, 2, 3, ..., 8
- **Disabled:** 30% opacity

---

## 📞 Als Het Niet Werkt

**Stuur deze info:**

1. **Server logs:**
   ```bash
   pm2 logs --lines 300 > shop-archive-deployment-logs.txt
   ```

2. **Database check:**
   ```bash
   # PostgreSQL:
   PGPASSWORD="..." psql -h ... -U postgres -d railway -c "SELECT * FROM settings LIMIT 1;" > settings-check.txt
   ```

3. **Git status:**
   ```bash
   git log -1 --oneline
   # Moet tonen: 4ce362b Feature: Add Shop Archive Template System
   ```

4. **Build output:**
   ```bash
   npm run build 2>&1 | tail -200 > build-output.txt
   ```

5. **Screenshots:**
   - Admin → Settings → Templates tab
   - /shop page (category hero)
   - /shop page (product grid)
   - Browser console (F12 → Console tab)
   - Badge rechtsboven (template indicator)

---

## 🎉 Klaar!

**Je hebt nu:**
- ✅ Shop Archive Template System
- ✅ Template 1 - Enterprise (meest volledig)
- ✅ Template switcher in Settings
- ✅ Category hero met statistieken
- ✅ Advanced filters sidebar
- ✅ Grid/List view toggle
- ✅ Sort opties
- ✅ Quick-add to cart
- ✅ Volume pricing indicators
- ✅ Stock status badges
- ✅ Pagination ready

**Gebruik:**
1. Admin → Settings → Templates → "Standaard Shop Archive Template"
2. Selecteer: Shop Archive Template 1 - Enterprise
3. Bezoek: /shop
4. Geniet van je enterprise shop! 🛒✨

**Later toevoegen:**
- Template 2 - Minimal (clean, modern)
- Template 3 - Luxury (premium feel)

---

**Geschatte deployment tijd:** 15-20 minuten
**Database migratie:** Automatisch (door Payload bij start)
**Handmatige stappen:** Settings template selecteren + testen
**Downtime:** ~2-3 minuten (tijdens build)

**Commit:** 4ce362b - Feature: Add Shop Archive Template System (Template 1 - Enterprise)
**Datum:** 19 Februari 2026, 21:15
