# Deployment Instructies - Product Template 1

**Commit:** `8c51c32` - feat(products): Add Product Template 1
**Datum:** 19 Februari 2026
**Server:** https://cms.compassdigital.nl / https://plastimed01.compassdigital.nl

---

## 📦 Wat is Nieuw

### Product Template 1 - Enterprise E-commerce Template

**3 nieuwe/gewijzigde bestanden:**
1. ✅ `src/app/(app)/shop/[slug]/ProductTemplate1.tsx` (NEW - 1500 lines)
2. ✅ `src/app/(app)/shop/[slug]/page.tsx` (UPDATED - simplified)
3. ✅ `docs/PRODUCT_TEMPLATE_1.md` (NEW - 800 lines docs)

**Totale wijzigingen:** +2367 lines, -646 lines

---

## 🚀 Deployment Stappen voor Server

### Stap 1: Pull Laatste Code

```bash
# SSH naar server
ssh user@compassdigital.nl

# Ga naar project directory
cd /path/to/payload-app

# Pull laatste wijzigingen
git pull origin main

# Verify je op de juiste commit staat
git log -1 --oneline
# Moet tonen: 8c51c32 feat(products): Add Product Template 1
```

### Stap 2: Dependencies Controleren

```bash
# Check of alle dependencies up-to-date zijn
npm install

# Of als je pnpm gebruikt:
pnpm install
```

**Note:** Template 1 gebruikt GEEN nieuwe dependencies, dus dit zou instant moeten zijn.

### Stap 3: TypeScript Check

```bash
# Verify dat alles compileert
npm run build

# Of voor development:
npm run dev
```

**Verwachte output:**
```
✓ Compiled successfully
✓ Ready in 8-12 seconds
```

### Stap 4: Test de Template

**Optie A: In Development**
```bash
npm run dev
# Open http://localhost:3020/shop/test-product
```

**Optie B: In Production Build**
```bash
npm run build
npm run start
# Open https://cms.compassdigital.nl/shop/test-product
```

### Stap 5: Restart Production Server

**Als je PM2 gebruikt:**
```bash
pm2 restart payload-app
pm2 logs payload-app --lines 50
```

**Als je systemd gebruikt:**
```bash
sudo systemctl restart payload-app
sudo systemctl status payload-app
```

**Als je Docker gebruikt:**
```bash
docker-compose down
docker-compose up -d --build
docker-compose logs -f payload-app
```

---

## ✅ Verificatie Checklist

Na deployment, test het volgende:

### 1. Simple Product Test

```bash
# Ga naar een bestaand simple product:
https://plastimed01.compassdigital.nl/shop/[een-simple-product]

# Check:
□ Product laadt correct
□ Images tonen
□ Prijs klopt
□ "Toevoegen aan winkelwagen" button werkt
□ Tabs systeem werkt (Description, Specs, Downloads)
□ Gerelateerde producten tonen (indien ingesteld)
```

### 2. Grouped Product Test

```bash
# Ga naar een grouped product:
https://plastimed01.compassdigital.nl/shop/[een-grouped-product]

# Check:
□ Size selector grid toont (S/M/L/XL kolommen)
□ Quantity inputs werken (+/- buttons)
□ Totaal berekent correct (onderaan grid)
□ Staffelprijzen worden toegepast op totaal
□ "Toevoegen aan winkelwagen" button disabled als qty = 0
□ Alle varianten worden toegevoegd aan cart
```

### 3. Theme Integration Test

```bash
# Ga naar Theme Global in admin:
https://plastimed01.compassdigital.nl/admin/globals/theme

# Verander Primary Color (bijv. van teal naar blauw)
# Refresh product page
# Check:
□ Buttons hebben nieuwe kleur
□ Badges hebben nieuwe kleur
□ Links hebben nieuwe kleur
□ Icons hebben nieuwe kleur
□ Staffelprijs grid highlights hebben nieuwe kleur
```

### 4. Conditional Rendering Test

**Test dat elementen ALLEEN tonen als data bestaat:**

```
Product ZONDER brand → Brand badge NIET zichtbaar
Product ZONDER salePrice → Sale badge NIET zichtbaar
Product ZONDER volumePricing → Staffelprijs grid NIET zichtbaar
Simple product → Size selector NIET zichtbaar
Product ZONDER specifications → Specs tab NIET zichtbaar
Product ZONDER downloads → Downloads tab NIET zichtbaar
Product ZONDER relatedProducts → Related section NIET zichtbaar
```

### 5. Cart Integration Test

```bash
# Test grouped product toevoegen:
1. Selecteer maten: 2x S, 5x M, 3x L = 10 totaal
2. Klik "Toevoegen aan winkelwagen"
3. Ga naar cart (https://plastimed01.compassdigital.nl/cart)

# Check:
□ Alle 3 varianten staan in cart (S, M, L)
□ Quantities kloppen (2, 5, 3)
□ Ze zijn gegroepeerd onder parent product
□ Staffelprijs is toegepast (bijv. tier 3: 10-24 stuks)
□ Totaalprijs klopt
```

---

## 🎨 Theme Global Setup (BELANGRIJK!)

**Product Template 1 is 100% afhankelijk van Theme Global!**

### Minimaal Vereiste Theme Instellingen

Ga naar: `https://plastimed01.compassdigital.nl/admin/globals/theme`

**Vul in:**

#### Colors Tab
```
Primary Color: #00897B (teal) of jouw merkkleur
Secondary Color: #0A1628 (navy) of jouw secondary
Text Primary: #0A1628 (donker grijs/navy)
Text Secondary: #64748B (medium grijs)
Text Muted: #94A3B8 (licht grijs)
Background: #F5F7FA (licht grijs)
Surface: #FFFFFF (wit)
Border: #E8ECF1 (lichte border)
```

#### Typography Tab
```
Heading Font: Plus Jakarta Sans (of jouw heading font)
Body Font: DM Sans (of jouw body font)
Font Scale: md (medium)
```

#### Layout Tab
```
Border Radius: lg (12px) of xl (16px)
Container Width: 7xl (1280px) of full (1792px)
```

**Zonder deze instellingen zal Template 1 fallback kleuren gebruiken!**

---

## 🔧 Troubleshooting

### Issue 1: Template Toont Niet

**Symptoom:** Product page is leeg of toont oude template

**Oplossing:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
npm run start
```

### Issue 2: Size Selector Niet Zichtbaar

**Symptoom:** Grouped product toont geen size grid

**Check:**
1. Is `product.productType === 'grouped'`?
2. Zijn er `childProducts` gekoppeld?
3. Zijn childProducts `published`?

**Query in admin:**
```javascript
// In browser console op product edit page:
console.log('Product Type:', product.productType)
console.log('Child Products:', product.childProducts)
```

### Issue 3: Theme Kleuren Werken Niet

**Symptoom:** Alle buttons zijn grijs, geen branded kleuren

**Check:**
1. Is Theme Global ingevuld? (`/admin/globals/theme`)
2. Is ThemeProvider actief in layout?
3. Browser cache geleegd?

**Fix:**
```bash
# Hard refresh in browser:
Cmd+Shift+R (Mac) of Ctrl+Shift+R (Windows)

# Of clear browser cache volledig
```

### Issue 4: Staffelprijzen Niet Zichtbaar

**Symptoom:** Volume pricing grid toont niet

**Check:**
```javascript
// In admin, check product:
console.log('Volume Pricing:', product.volumePricing)
// Moet array zijn met minimaal 1 tier
```

**Fix:**
Voeg volume pricing toe in admin:
```
Tier 1: 1-4 stuks, -0%
Tier 2: 5-9 stuks, -8%
Tier 3: 10-24 stuks, -15%
Tier 4: 25+ stuks, -22%
```

### Issue 5: Build Errors

**Symptoom:** `npm run build` faalt

**Check errors:**
```bash
npm run build 2>&1 | tee build.log
cat build.log
```

**Mogelijke oorzaken:**
1. TypeScript errors → Fix type issues
2. Missing imports → Check ProductTemplate1.tsx imports
3. Out of memory → Increase Node memory:
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

---

## 📊 Performance Check

Na deployment, check performance:

### Lighthouse Score

```bash
# Run Lighthouse in Chrome DevTools
# Of via CLI:
npx lighthouse https://plastimed01.compassdigital.nl/shop/test-product --view

# Target scores:
Performance: > 85
Accessibility: > 95
Best Practices: > 90
SEO: > 95
```

### Server Metrics

```bash
# Check server load:
top
htop

# Check memory:
free -h

# Check disk space:
df -h

# Check logs for errors:
pm2 logs payload-app --lines 100 --err
```

---

## 🎯 Testing Scenarios

### Test Case 1: Plastimed Product (Medical Gloves)

**Setup:**
1. Maak grouped product: "Peha-soft Nitrile Handschoenen"
2. Voeg 4 child products toe:
   - Size S (324 op voorraad)
   - Size M (512 op voorraad)
   - Size L (287 op voorraad)
   - Size XL (148 op voorraad)
3. Voeg volume pricing toe:
   - 1-4 dozen: €8,95
   - 5-9 dozen: €8,25 (-8%)
   - 10-24 dozen: €7,65 (-15%)
   - 25+ dozen: €6,95 (-22%)

**Test:**
1. Ga naar product page
2. Selecteer: 0x S, 5x M, 3x L, 0x XL = 8 totaal
3. Check totaal: 8 × €8,25 = €66,00 (tier 2 pricing!)
4. Voeg toe aan cart
5. Check cart: 2 items (M + L), correct gegroepeerd

**Verwacht:**
✅ Size grid toont 4 kolommen
✅ Totaal toont "8 dozen totaal · staffelprijs van toepassing"
✅ Prijs: €66,00
✅ Tier 2 highlighted in volume pricing grid
✅ Cart toont parent "Peha-soft Nitrile Handschoenen" met 2 varianten

### Test Case 2: Simple Product (No Grouping)

**Setup:**
1. Maak simple product: "Handschoenendispenser RVS"
2. Prijs: €34,50
3. Stock: 148
4. Voeg brand toe: "Clinhand"
5. Voeg 3 gerelateerde producten toe

**Test:**
1. Ga naar product page
2. Check: GEEN size selector (want simple)
3. Check: Gerelateerde producten tonen (4-column grid)
4. Klik "Toevoegen aan winkelwagen"
5. Check cart: 1 item, qty 1

**Verwacht:**
✅ Geen size selector grid
✅ Standaard "Toevoegen aan winkelwagen" button
✅ Gerelateerde producten section toont
✅ Cart krijgt 1 item met qty 1

---

## 🔐 Security Check

Na deployment, verify:

### 1. No Sensitive Data Exposed

```bash
# Check dat product data correct gefilterd is:
curl https://plastimed01.compassdigital.nl/api/products

# Verify geen interne velden gelekt worden:
- ✅ Geen internal IDs
- ✅ Geen admin-only fields
- ✅ Geen draft products
```

### 2. CORS Headers

```bash
# Check CORS:
curl -I https://plastimed01.compassdigital.nl/shop/test

# Moet bevatten:
Access-Control-Allow-Origin: [correct domains]
```

### 3. Rate Limiting

```bash
# Test rate limiting (als ingeschakeld):
for i in {1..100}; do
  curl https://plastimed01.compassdigital.nl/shop/test
done

# Verwacht: 429 Too Many Requests na X requests
```

---

## 📈 Monitoring

### Setup Alerts

**Sentry (Error Tracking):**
```javascript
// Verify Sentry initialized:
console.log(Sentry.getCurrentHub())
```

**Uptime Monitoring:**
```bash
# Voeg toe aan UptimeRobot:
URL: https://plastimed01.compassdigital.nl/shop/test-product
Interval: 5 minuten
Alert contacts: [jouw email]
```

**Performance Monitoring:**
```javascript
// Google Analytics event:
ga('send', 'pageview', '/shop/[product-slug]')

// Check in GA dashboard:
Real-Time > Overview > Active Page
```

---

## 🎓 Training voor Team

### Voor Contentbeheerders

**Product Template 1 Gebruiken:**

1. **Grouped Product Aanmaken:**
   ```
   1. Ga naar /admin/collections/products/create
   2. Selecteer "Product Type: Grouped"
   3. Vul titel, prijs, beschrijving in
   4. Scroll naar "Child Products"
   5. Klik "+ Add Child Product"
   6. Selecteer bestaande simple products (S, M, L, XL)
   7. Publish
   ```

2. **Volume Pricing Toevoegen:**
   ```
   1. Open product in admin
   2. Scroll naar "Volume Pricing"
   3. Klik "+ Add Volume Pricing"
   4. Tier 1: Min 1, Discount 0%
   5. Tier 2: Min 5, Discount 8%
   6. Tier 3: Min 10, Discount 15%
   7. Tier 4: Min 25, Discount 22%
   8. Save
   ```

3. **Gerelateerde Producten Toevoegen:**
   ```
   1. Open product in admin
   2. Scroll naar "Related Products"
   3. Klik "+ Add Related Product"
   4. Selecteer 4 producten
   5. Save
   ```

**Result:** Size selector grid + volume pricing + related products!

### Voor Developers

**Template Aanpassen:**

File: `src/app/(app)/shop/[slug]/ProductTemplate1.tsx`

**Kleuren aanpassen:**
```tsx
// NIET hardcoden:
style={{ color: '#00897B' }} ❌

// WEL via Theme:
style={{ color: 'var(--color-primary)' }} ✅
```

**Nieuwe sectie toevoegen:**
```tsx
// Altijd conditioneel:
{product.newField && (
  <div className="new-section">
    {/* Content */}
  </div>
)}
```

**Nieuwe template maken (Template 2):**
```bash
# Kopieer Template 1:
cp src/app/(app)/shop/[slug]/ProductTemplate1.tsx \
   src/app/(app)/shop/[slug]/ProductTemplate2.tsx

# Pas design aan naar jouw wensen
# Update page.tsx om template te selecteren op basis van setting
```

---

## 🚨 Rollback Plan

**Als er iets misgaat:**

### Rollback naar Vorige Versie

```bash
# Check laatste werkende commit:
git log --oneline -5

# Rollback naar commit voor Template 1:
git reset --hard 1b342cd

# Force push (LET OP: alleen doen als nodig!):
git push origin main --force

# Rebuild:
npm run build
pm2 restart payload-app
```

### Partial Rollback (Alleen Template 1 Disablen)

```bash
# Edit page.tsx om oude implementatie terug te zetten:
git checkout 1b342cd -- src/app/\(app\)/shop/\[slug\]/page.tsx

# Commit en push:
git add src/app/\(app\)/shop/\[slug\]/page.tsx
git commit -m "revert: Temporarily disable Product Template 1"
git push origin main

# Rebuild:
npm run build
pm2 restart payload-app
```

---

## 📞 Support

**Bij problemen:**

1. **Check Logs:**
   ```bash
   pm2 logs payload-app --lines 100
   ```

2. **Check Build Logs:**
   ```bash
   cat .next/build.log
   ```

3. **Check Browser Console:**
   ```
   F12 → Console tab
   Kijk naar errors
   ```

4. **Contact:**
   - GitHub Issues: https://github.com/compassdigitalnl/compassdigital-cms/issues
   - Team Slack: #cms-support
   - Email: dev@compassdigital.nl

---

## ✅ Post-Deployment Checklist

```
□ Code gepulled naar server
□ Dependencies geïnstalleerd (npm install)
□ Build succesvol (npm run build)
□ Server herstart (pm2 restart)
□ Simple product test PASS
□ Grouped product test PASS
□ Theme integration test PASS
□ Cart integration test PASS
□ Performance check PASS (Lighthouse > 85)
□ Error monitoring actief (Sentry)
□ Uptime monitoring actief (UptimeRobot)
□ Team getraind op nieuwe template
□ Documentation beschikbaar (PRODUCT_TEMPLATE_1.md)
□ Rollback plan bekend bij team
```

---

## 🎉 Klaar!

**Product Template 1 is nu live!**

**Volgende stappen:**
1. Test grondig op staging/productie
2. Maak testdata (grouped products) in admin
3. Train contentbeheerders
4. Monitor performance eerste dagen
5. Verzamel feedback
6. Plan Template 2/3 (minimaal/luxury designs)

**Veel succes! 🚀**

---

**Built with ❤️ for Compass Digital**
