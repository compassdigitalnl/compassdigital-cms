# Server Deployment - Template System

**Voor:** https://plastimed01.compassdigital.nl
**Datum:** 19 Februari 2026

---

## 🚀 Deployment Commando's

**Kopieer en plak deze commando's in de server terminal:**

```bash
# 1. Ga naar project folder
cd /path/to/payload-app

# 2. Pull laatste code
git pull origin main

# 3. Installeer dependencies (als nodig)
npm install

# 4. Regenereer Payload types (BELANGRIJK!)
npm run payload generate:types

# 5. Build applicatie
npm run build

# 6. Restart server
pm2 restart all
# OF als je systemd gebruikt:
# sudo systemctl restart payload-app
# OF als je Docker gebruikt:
# docker-compose restart
```

---

## ✅ Verificatie

**Na deployment, check dit:**

### 1. Admin Field Zichtbaar?

```
1. Open: https://plastimed01.compassdigital.nl/admin
2. Ga naar: Collections → Products
3. Edit een product
4. Kijk in SIDEBAR rechts
5. Zie je "Product Template" dropdown?
   - Ja? ✅ Perfect!
   - Nee? Hard refresh browser (Cmd+Shift+R)
```

### 2. Template Switcher Werkt?

```
1. Edit product in admin
2. Sidebar → "Product Template" → Template 2
3. Save
4. Open product page: https://plastimed01.compassdigital.nl/shop/[product-slug]
5. Zie je rechtsboven GROENE badge "🎨 Template 2 - Minimal"?
   - Ja? ✅ Perfect!
   - Nee (nog steeds blauw)? Check console (F12)
```

### 3. Console Check

```
1. Open product page
2. F12 → Console tab
3. Zie je:
   🎨 Product: [naam]
   📋 Template field: template2  ← Moet template2 zijn!
   ✅ Using template: template2
```

---

## 🐛 Troubleshooting

### Field Niet Zichtbaar in Admin

**Probleem:** "Product Template" veld staat niet in sidebar

**Oplossing:**
```bash
# Server terminal:
npm run payload generate:types
npm run build
pm2 restart all

# Browser:
Hard refresh admin: Cmd+Shift+R (Mac) of Ctrl+Shift+R (Windows)
```

### Badge Blijft Blauw (Template 1)

**Probleem:** Badge toont altijd "Template 1 - Enterprise"

**Check:**
1. Is product opgeslagen met Template 2 in admin?
2. Browser cache geleegd? (Hard refresh: Cmd+Shift+R)
3. Console errors? (F12 → Console)

**Oplossing:**
```bash
# Server terminal:
pm2 logs --lines 50
# Kijk voor errors
```

### Database Update Nodig?

**Nee!** Payload voegt automatisch nieuwe velden toe. Geen database migratie nodig.

**Maar ALS je zeker wil zijn:**
```bash
# Optioneel: Force database sync (alleen als echt nodig)
npm run payload migrate
```

---

## 📝 Na Deployment Testen

### Test Scenario 1: Simple Product

```
1. Maak/edit simple product
2. Template → Template 2
3. Save
4. Open product page
5. Badge moet GROEN zijn
6. Layout moet minimalistischer zijn
```

### Test Scenario 2: Grouped Product

```
1. Maak grouped product met 4 child products (S, M, L, XL)
2. Template → Template 1
3. Save → Zie SIZE GRID met +/- buttons

4. Edit product
5. Template → Template 2
6. Save → Zie DROPDOWN met variant selector
```

### Test Scenario 3: Volume Pricing

```
1. Product met volume pricing (4 tiers)
2. Template → Template 1
3. Save → Zie GRID (4 boxen naast elkaar)

4. Template → Template 2
5. Save → Zie LIST (4 rijen onder elkaar)
```

---

## 🎯 Verwachte Resultaten

### Template 1 (Enterprise)
- Badge: 🏢 Template 1 - Enterprise (BLAUW)
- Grouped: Size grid met kolommen
- Volume pricing: Grid met 4 boxen
- Trust signals: 4 items
- Tabs: Description, Specs, Reviews, Downloads

### Template 2 (Minimal)
- Badge: 🎨 Template 2 - Minimal (GROEN)
- Grouped: Dropdown selector
- Volume pricing: Simple lijst
- Trust badges: 2 items
- Tabs: Description, Specs

---

## 📞 Als Het Niet Werkt

**Stuur deze info:**

1. **Console output:**
   ```
   F12 → Console → Screenshot
   ```

2. **Server logs:**
   ```bash
   pm2 logs --lines 100
   ```

3. **Product data:**
   - Is product opgeslagen met template2?
   - Refresh admin en check sidebar field

4. **Git status:**
   ```bash
   git log -1 --oneline
   # Moet zijn: 2e751dd chore: Regenerate Payload types
   ```

---

## ✅ Success Criteria

- [ ] `git pull` succesvol
- [ ] `npm run payload generate:types` succesvol
- [ ] `npm run build` succesvol
- [ ] Server herstart
- [ ] Admin toont "Product Template" field in sidebar
- [ ] Template 2 selecteren werkt
- [ ] Badge wisselt tussen blauw/groen
- [ ] Templates zien er verschillend uit

**Klaar? Template System is live! 🎉**
