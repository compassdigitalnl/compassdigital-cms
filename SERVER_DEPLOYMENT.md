# 🚀 Server Deployment - Template System

**Voor:** https://plastimed01.compassdigital.nl
**Datum:** 19 Februari 2026

---

## Wat moet er gebeuren?

De **code** staat klaar in GitHub, maar de **server** heeft de update nog niet.

Je moet de server vertellen:
1. Pak de nieuwe code
2. Bouw de applicatie opnieuw
3. Herstart de server

---

## 📋 Commando's voor de Server

**SSH naar de server en voer deze commando's uit:**

```bash
# 1. Ga naar de project folder
cd /home/ploi/plastimed01.compassdigital.nl

# 2. Stop de server tijdelijk
pm2 stop all

# 3. Haal nieuwe code op
git pull origin main

# 4. Installeer updates (als nodig)
npm install

# 5. Regenereer Payload types (BELANGRIJK!)
npm run payload generate:types

# 6. Bouw de applicatie
npm run build

# 7. Start de server weer
pm2 restart all
pm2 save
```

---

## ✅ Verificatie

**Check of het werkt:**

### 1. Is de Template Selector Zichtbaar?

```
1. Open: https://plastimed01.compassdigital.nl/admin
2. Ga naar: Settings (linkermenu)
3. Klik op: E-commerce tab
4. Zie je "Standaard Product Template" dropdown?
   ✅ Ja? Perfect!
```

### 2. Werkt Template 2?

```
1. In Settings > E-commerce:
   - Selecteer: "Template 2 - Minimal"
   - Klik: Save

2. Open een product: https://plastimed01.compassdigital.nl/shop/[product-slug]

3. Zie je rechtsboven een GROENE badge "🎨 Template 2 - Minimal"?
   ✅ Ja? Perfect! Template 2 werkt!
   ❌ Nee (nog blauw)? Zie troubleshooting hieronder
```

### 3. Wissel tussen Templates

```
1. Ga naar Settings > E-commerce
2. Verander template van 1 naar 2 (of andersom)
3. Refresh een productpagina
4. Badge moet veranderen van kleur:
   - Blauw = Template 1 (Enterprise)
   - Groen = Template 2 (Minimal)
```

---

## 🐛 Troubleshooting

### "git pull" Geeft Error

**Probleem:** Uncommitted changes op server

**Oplossing:**
```bash
# Check wat er gewijzigd is
git status

# Reset naar laatste versie (LET OP: verliest local changes!)
git reset --hard origin/main

# Probeer opnieuw
git pull origin main
```

### Badge Blijft Altijd Blauw

**Probleem:** Template setting wordt niet gelezen

**Check lijst:**
1. Heb je `npm run payload generate:types` gedraaid?
2. Heb je `npm run build` succesvol gedraaid?
3. Heb je `pm2 restart all` gedaan?
4. Is de template in Settings > E-commerce ingesteld op Template 2?

**Oplossing:**
```bash
# Doe alle stappen opnieuw:
npm run payload generate:types
npm run build
pm2 restart all

# Check server logs
pm2 logs --lines 50
```

### Build Faalt

**Probleem:** `npm run build` geeft errors

**Oplossing:**
```bash
# Check TypeScript errors
npm run typecheck

# Check logs
pm2 logs --lines 100

# Als het niet lukt, stuur error message
```

---

## 🎯 Verwachte Resultaten

### Template 1 - Enterprise (Standaard)
- **Badge:** 🏢 Template 1 - Enterprise (BLAUW)
- **Style:** Complex, B2B
- **Grouped products:** Size grid met kolommen
- **Volume pricing:** 4 boxen naast elkaar
- **Voor:** Plastimed (medisch, B2B)

### Template 2 - Minimal
- **Badge:** 🎨 Template 2 - Minimal (GROEN)
- **Style:** Clean, modern, B2C
- **Grouped products:** Dropdown selector
- **Volume pricing:** Simpele lijst
- **Voor:** Consumer brands, retail

---

## 📞 Als Het Niet Werkt

**Stuur deze info:**

1. **Server logs:**
   ```bash
   pm2 logs --lines 100
   ```

2. **Git status:**
   ```bash
   cd /home/ploi/plastimed01.compassdigital.nl
   git log -1 --oneline
   # Moet zijn: d9f9c8f fix: Template selector nu ALLEEN global
   ```

3. **Build output:**
   ```bash
   npm run build 2>&1 | tail -50
   ```

4. **Screenshot van:**
   - Settings > E-commerce (template dropdown)
   - Product pagina (badge rechtsbovenaan)
   - Browser console (F12)

---

## ✅ Success Checklist

- [ ] `git pull` succesvol
- [ ] `npm install` succesvol
- [ ] `npm run payload generate:types` succesvol
- [ ] `npm run build` succesvol
- [ ] `pm2 restart all` succesvol
- [ ] Settings > E-commerce toont "Standaard Product Template"
- [ ] Template 2 selecteren werkt
- [ ] Badge wisselt tussen blauw/groen
- [ ] Templates zien er visueel verschillend uit

---

**Klaar? Template System is live! 🎉**

*Geschatte tijd: 5-10 minuten*
