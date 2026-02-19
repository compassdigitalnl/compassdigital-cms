# 🚀 Server Deployment - Blog System Complete

**Voor:** https://plastimed01.compassdigital.nl
**Datum:** 19 Februari 2026
**Status:** ⚠️ **BELANGRIJK: Database Migratie Nodig!**

---

## 📋 Wat Is Er Nieuw?

### 1. Blog Categories Collectie ✅
- **Nieuwe collectie:** `blog-categories`
- **Aparte categorieën** voor blog posts (niet meer product-categories)
- **Fields:** name, slug, description, color, image
- **⚠️ Database:** Nieuwe tabel wordt automatisch aangemaakt

### 2. Blog Templates (3x) ✅
- **Blog Template 1 - Magazine:** 2-kolom met sidebar, gerelateerde posts
- **Blog Template 2 - Minimal:** Single column, centered, clean
- **Blog Template 3 - Premium:** Wide layout, grote typography, elegant

### 3. Blog Post Detail Page ✅
- **Nieuw:** `/blog/[slug]/page.tsx`
- **Template switcher:** Via Settings > E-commerce
- **Badge indicator:** Blauw (Magazine), Groen (Minimal), Oranje (Premium)

### 4. Settings Update ✅
- **Nieuw veld:** `defaultBlogTemplate` in E-commerce tab
- **Keuze:** Template 1, 2, of 3 voor alle blog posts

---

## ⚠️ BELANGRIJK: Database Migratie

**Dit deployment vereist een database migratie!**

### Wat Gebeurt Er?

**Nieuwe Collectie:** `blog-categories`
- PostgreSQL: Nieuwe tabel `blog_categories` wordt aangemaakt
- SQLite: Nieuwe tabel wordt aangemaakt

**Bestaande Data:**
- **BlogPosts** collectie is geüpdatet: `categories` relationTo is veranderd van `product-categories` → `blog-categories`
- ⚠️ **Bestaande blog posts met categorieën** zullen hun categorie-koppeling kwijtraken
- ✅ **Oplossing:** Na deployment nieuwe blog categorieën aanmaken en opnieuw toewijzen

### Database Type Check

```bash
# Check welke database je gebruikt:
cat .env | grep DATABASE_URL

# SQLite (lokaal):
DATABASE_URL=file:./payload.db

# PostgreSQL (productie):
DATABASE_URL=postgresql://...
```

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
# STAP 5: Installeer dependencies
# ═══════════════════════════════════════════════════════════
npm install

# ═══════════════════════════════════════════════════════════
# STAP 6: Regenereer Payload types (BELANGRIJK!)
# ═══════════════════════════════════════════════════════════
npm run payload generate:types

# ═══════════════════════════════════════════════════════════
# STAP 7: Database Migratie (Automatisch!)
# ═══════════════════════════════════════════════════════════
# Payload zal automatisch de nieuwe blog-categories tabel aanmaken
# bij de volgende start. Geen handmatige migratie nodig!

# ═══════════════════════════════════════════════════════════
# STAP 8: Build applicatie
# ═══════════════════════════════════════════════════════════
npm run build

# ═══════════════════════════════════════════════════════════
# STAP 9: Start server (migratie gebeurt nu!)
# ═══════════════════════════════════════════════════════════
pm2 restart all
pm2 save

# ═══════════════════════════════════════════════════════════
# STAP 10: Check server logs voor migratie
# ═══════════════════════════════════════════════════════════
pm2 logs --lines 50
# Kijk voor: "Created table: blog_categories" of similar
```

---

## ✅ Verificatie

### 1. Is Blog Categories Collectie Zichtbaar?

```
1. Open: https://plastimed01.compassdigital.nl/admin
2. Linkermenu → Collections
3. Zie je "Blog Categorieën"?
   ✅ Ja? Perfect! Database migratie geslaagd!
   ❌ Nee? Check server logs: pm2 logs --lines 100
```

### 2. Maak Test Blog Categorie

```
1. Admin → Blog Categorieën → Create New
2. Naam: "Nieuws"
3. Slug: "nieuws" (auto-gegenereerd)
4. Kleur: Blauw
5. Save
6. ✅ Succesvol opgeslagen? Database werkt!
```

### 3. Check Blog Post Categorieën

```
1. Admin → Blog Posts → Edit een post
2. Sidebar → Categorieën
3. Zie je nu "Blog Categorieën" (niet Product Categorieën)?
   ✅ Ja? Perfect!
   ❌ Nee (nog Product Categorieën)? Hard refresh (Cmd+Shift+R)
```

### 4. Test Blog Template Selector

```
1. Admin → Settings → E-commerce tab
2. Zie je "Standaard Blog Template"?
   ✅ Ja? Perfect!
3. Selecteer: Blog Template 2 - Minimal
4. Save
5. Open een blog post: /blog/[slug]
6. Badge rechtsboven moet GROEN zijn!
   ✅ Groen? Template 2 werkt!
   ❌ Blauw? Check console logs
```

### 5. Wissel tussen Blog Templates

```
1. Settings → E-commerce
2. Verander template van 1 → 2 → 3
3. Refresh blog post pagina
4. Badge moet veranderen:
   - 📰 Blauw = Template 1 (Magazine)
   - 📄 Groen = Template 2 (Minimal)
   - ✨ Oranje = Template 3 (Premium)
```

---

## 🐛 Troubleshooting

### "Blog Categories" Collectie Niet Zichtbaar

**Probleem:** Nieuwe collectie verschijnt niet in admin

**Oplossing:**
```bash
# Check server logs
pm2 logs --lines 100

# Kijk voor database errors
# Als geen errors, probeer hard refresh browser:
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

# Als BlogPost type errors:
npm run payload generate:types
npm run build
```

### Database Migratie Errors

**Probleem:** Server start niet, database errors in logs

**Check logs:**
```bash
pm2 logs --lines 200 | grep -i error
```

**Mogelijke oorzaken:**
1. Database connection issues → Check DATABASE_URL
2. Permission issues → Check database user permissions
3. Table exists → Payload zal niet overschrijven

**Restore backup als nodig:**
```bash
# PostgreSQL:
PGPASSWORD="..." psql -h ... -U postgres -d railway < backup_XXXXXX.sql

# SQLite:
# cp payload.db.backup payload.db
```

### Bestaande Blog Posts Hebben Geen Categorieën Meer

**Probleem:** Na migratie tonen oude posts geen categorieën

**Dit is verwacht!** De relatie is veranderd van `product-categories` → `blog-categories`

**Oplossing:**
```
1. Maak nieuwe blog categorieën aan (Nieuws, Tips, Tutorials, etc.)
2. Edit oude blog posts
3. Wijs nieuwe blog categorieën toe
4. Save
```

---

## 📊 Wat Is Er Veranderd?

### Nieuwe Files
```
✅ src/collections/BlogCategories.ts (nieuwe collectie)
✅ src/app/(app)/blog/[slug]/page.tsx (blog detail page)
✅ src/app/(app)/blog/[slug]/BlogTemplate1.tsx (Magazine)
✅ src/app/(app)/blog/[slug]/BlogTemplate2.tsx (Minimal)
✅ src/app/(app)/blog/[slug]/BlogTemplate3.tsx (Premium)
✅ BLOG_DEPLOYMENT.md (deze guide)
```

### Aangepaste Files
```
✅ src/collections/BlogPosts.ts (categories → blog-categories)
✅ src/payload.config.ts (BlogCategories geregistreerd)
✅ src/globals/Settings.ts (defaultBlogTemplate toegevoegd)
✅ src/payload-types.ts (geregenereerd)
```

### Database Changes
```
⚠️ Nieuwe tabel: blog_categories
   - id (primary key)
   - name (text)
   - slug (text, unique)
   - description (text, nullable)
   - color (text)
   - image (relation naar media, nullable)
   - updated_at, created_at

⚠️ BlogPosts.categories relatie gewijzigd:
   - OUD: relationTo: 'product-categories'
   - NIEUW: relationTo: 'blog-categories'
```

---

## 🎯 Na Deployment Taken

### 1. Maak Blog Categorieën (5 min)

```
Aanbevolen categorieën:
1. Nieuws (Blauw)
2. Tips & Tricks (Groen)
3. Tutorials (Paars)
4. Updates (Oranje)
5. Achtergrond (Grijs)
```

### 2. Update Bestaande Blog Posts (10 min)

```
Voor elk bestaand blog post:
1. Edit post
2. Sidebar → Categorieën
3. Selecteer nieuwe blog categorie
4. Save
```

### 3. Test Alle 3 Templates (5 min)

```
1. Settings → E-commerce → Template 1
   - Open blog post → Badge moet BLAUW zijn
   - Layout: 2-kolom met sidebar

2. Settings → E-commerce → Template 2
   - Refresh blog post → Badge moet GROEN zijn
   - Layout: Centered, clean

3. Settings → E-commerce → Template 3
   - Refresh blog post → Badge moet ORANJE zijn
   - Layout: Wide, premium
```

---

## ✅ Success Checklist

- [ ] `git pull` succesvol
- [ ] Database backup gemaakt
- [ ] `npm install` succesvol
- [ ] `npm run payload generate:types` succesvol
- [ ] `npm run build` succesvol
- [ ] Server herstart zonder errors
- [ ] "Blog Categorieën" zichtbaar in admin
- [ ] Test blog categorie aangemaakt
- [ ] Settings toont "Standaard Blog Template"
- [ ] Blog post detail page werkt (`/blog/[slug]`)
- [ ] Badge wisselt tussen blauw/groen/oranje
- [ ] Alle 3 templates zien er verschillend uit
- [ ] Bestaande blog posts ge-update met nieuwe categorieën

---

## 🎨 Blog Template Vergelijking

| Kenmerk | Template 1 (Magazine) | Template 2 (Minimal) | Template 3 (Premium) |
|---------|---------------------|-------------------|-------------------|
| **Layout** | 2-kolom + sidebar | Single column, centered | Wide layout |
| **Max Width** | 100% | 720px | 1200px |
| **Sidebar** | ✅ Ja (related posts) | ❌ Nee | ❌ Nee |
| **Image Aspect** | 16:9 | 16:9 | 21:9 (wide) |
| **Title Size** | 48px | 42px | 64px |
| **Content Font** | 17px | 18px | 19px |
| **Excerpt Style** | Quote box (links border) | Italic, centered | Large quote, gradient bg |
| **Badge** | 📰 Blauw | 📄 Groen | ✨ Oranje |
| **Best Voor** | News sites, magazines | Personal blogs, portfolios | Premium content, stories |

---

## 📞 Als Het Niet Werkt

**Stuur deze info:**

1. **Server logs:**
   ```bash
   pm2 logs --lines 200
   ```

2. **Database check:**
   ```bash
   # PostgreSQL:
   PGPASSWORD="..." psql -h ... -U postgres -d railway -c "\dt"
   # Zie je blog_categories tabel?
   ```

3. **Git status:**
   ```bash
   git log -1 --oneline
   # Moet recente blog commit zijn
   ```

4. **Build output:**
   ```bash
   npm run build 2>&1 | tail -100
   ```

5. **Screenshots:**
   - Admin → Blog Categorieën collectie
   - Admin → Settings → E-commerce (blog template dropdown)
   - Blog post pagina met badge
   - Browser console (F12)

---

## 🎉 Klaar!

**Je hebt nu:**
- ✅ Blog Categories collectie (aparte categorieën voor blog)
- ✅ 3 Blog Templates (Magazine, Minimal, Premium)
- ✅ Blog post detail pages (`/blog/[slug]`)
- ✅ Template switcher in Settings
- ✅ Database migratie compleet

**Gebruik:**
1. Maak blog categorieën aan
2. Schrijf blog posts
3. Kies template in Settings > E-commerce
4. Geniet van je mooie blog! 📝✨

---

**Geschatte deployment tijd:** 15-20 minuten
**Database migratie:** Automatisch (door Payload)
**Handmatige stappen:** Blog categorieën aanmaken + oude posts updaten
