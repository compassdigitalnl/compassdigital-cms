# 🚀 Server Deployment - Templates Tab Update

**Voor:** https://plastimed01.compassdigital.nl
**Datum:** 19 Februari 2026
**Status:** ⚠️ **BELANGRIJK: Server Update Nodig!**

---

## 🐛 Huidig Probleem

**Symptoom:** "Oeps! Er is iets misgegaan" error bij het bezoeken van product pages

**Oorzaak:**
- Settings.ts is recent aangepast (nieuwe "Templates" tab toegevoegd)
- Production server heeft nog oude build zonder deze wijzigingen
- Dit veroorzaakt crashes wanneer code naar `settings.defaultProductTemplate` vraagt

**Oplossing:** Server update met nieuwe build

---

## 📋 Wat Is Er Veranderd?

### Settings Reorganisatie
- **Nieuw:** Tab 5 "Templates" toegevoegd
- **Verplaatst:** `defaultProductTemplate` van E-commerce → Templates tab
- **Verplaatst:** `defaultBlogTemplate` van E-commerce → Templates tab
- **Impact:** Database schema moet updaten

---

## 🚀 Deployment Commando's

**SSH naar de server en voer deze commando's uit:**

```bash
# ═══════════════════════════════════════════════════════════
# STAP 1: Ga naar project folder
# ═══════════════════════════════════════════════════════════
cd /home/ploi/plastimed01.compassdigital.nl

# ═══════════════════════════════════════════════════════════
# STAP 2: Stop server
# ═══════════════════════════════════════════════════════════
pm2 stop all

# ═══════════════════════════════════════════════════════════
# STAP 3: Haal nieuwe code op
# ═══════════════════════════════════════════════════════════
git pull origin main

# ═══════════════════════════════════════════════════════════
# STAP 4: Installeer dependencies (als nodig)
# ═══════════════════════════════════════════════════════════
npm install

# ═══════════════════════════════════════════════════════════
# STAP 5: Regenereer Payload types (BELANGRIJK!)
# ═══════════════════════════════════════════════════════════
npm run payload generate:types

# ═══════════════════════════════════════════════════════════
# STAP 6: Build applicatie
# ═══════════════════════════════════════════════════════════
npm run build

# ═══════════════════════════════════════════════════════════
# STAP 7: Start server (database update gebeurt automatisch!)
# ═══════════════════════════════════════════════════════════
pm2 restart all
pm2 save

# ═══════════════════════════════════════════════════════════
# STAP 8: Check server logs
# ═══════════════════════════════════════════════════════════
pm2 logs --lines 50
```

---

## ✅ Verificatie

### 1. Test Product Pages

```
1. Open: https://plastimed01.compassdigital.nl/shop/curetape-kinesiotape-5-m-x-5-cm-geel
2. Moet laden zonder "Oeps!" error
3. Check badge rechtsboven (blauw = Template 1)
```

### 2. Check Settings Admin

```
1. Login: https://plastimed01.compassdigital.nl/admin
2. Settings → Templates tab (nieuw!)
3. Zie je "Standaard Product Template" dropdown?
4. Zie je "Standaard Blog Template" dropdown?
```

### 3. Test Template Switching

```
1. Settings → Templates → Kies Template 2 - Minimal
2. Save
3. Bezoek product page opnieuw
4. Badge moet GROEN zijn
```

---

## 🐛 Troubleshooting

### Error: "Oeps! Er is iets misgegaan"

**Oorzaak:** Build failed of oude cache

**Oplossing:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
pm2 restart all
```

### Settings Tab Niet Zichtbaar

**Oorzaak:** Browser cache

**Oplossing:**
```
Hard refresh: Cmd+Shift+R (Mac) of Ctrl+Shift+R (Windows)
```

### Build Faalt

**Oorzaak:** TypeScript errors

**Oplossing:**
```bash
# Check errors
npm run typecheck

# Regenerate types
npm run payload generate:types
npm run build
```

---

## 📊 Recente Commits

```bash
# Check laatste commits
git log --oneline -5

# Zou moeten tonen:
# 57a749e Fix readability issues in light mode
# 35e9a48 Redesign Payload CMS admin panel
# 39bde63 Move template selectors to new Templates tab
```

---

## 🎯 Success Checklist

- [ ] `git pull` succesvol
- [ ] `npm run payload generate:types` succesvol
- [ ] `npm run build` succesvol
- [ ] Server herstart zonder errors
- [ ] Product pages laden zonder error
- [ ] "Templates" tab zichtbaar in Settings
- [ ] Template selector werkt (badge wisselt tussen blauw/groen/oranje)

---

## 📞 Als Het Niet Werkt

**Stuur deze info:**

1. **Server logs:**
   ```bash
   pm2 logs --lines 200 > deployment-logs.txt
   ```

2. **Git status:**
   ```bash
   git log -1 --oneline
   git status
   ```

3. **Build output:**
   ```bash
   npm run build 2>&1 | tail -100
   ```

4. **Browser console:**
   - Open product page
   - F12 → Console tab
   - Screenshot van errors

---

**Geschatte deployment tijd:** 10-15 minuten
**Database migratie:** Automatisch (door Payload bij start)
**Downtime:** ~2-3 minuten (tijdens build)
