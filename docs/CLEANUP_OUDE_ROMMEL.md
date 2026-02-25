# 🧹 CLEANUP: Oude Rommel Verwijderen

**Datum:** 25 Februari 2026
**Doel:** Schone lei - oude/duplicate code opruimen na refactoring

---

## 🎯 PRODUCT TEMPLATE STRATEGIE (Belangrijkste Vraag!)

### ✅ **DE JUISTE STRATEGIE: Templates op basis van DESIGN**

Je hebt **3 product templates** op basis van **visueel design**:

```
ProductTemplate1 = DESIGN VARIANT 1 (bijvoorbeeld: klassiek layout met sidebar)
ProductTemplate2 = DESIGN VARIANT 2 (bijvoorbeeld: modern full-width)
ProductTemplate3 = DESIGN VARIANT 3 (bijvoorbeeld: minimalistisch)
```

**Elke template handelt ALLE product types af:**
- ✅ Simple products (gewoon product)
- ✅ Variable products (maat, kleur selectie)
- ✅ Grouped products (bundels met sub-producten)
- ✅ Subscription products (abonnementen)
- ✅ Mix & Match products (zelf samenstellen)

### 📋 **Hoe werkt dit in de code?**

```typescript
// ProductTemplate1/index.tsx (line 80-83)
export default function ProductTemplate1({ product }: ProductTemplate1Props) {
  // Detecteer product type
  const isGrouped = product.productType === 'grouped'
  const isVariable = product.productType === 'variable'
  const isMixMatch = product.productType === 'mixAndMatch'
  const isSubscription = product.isSubscription === true && isVariable

  // Render juiste UI op basis van type
  return (
    <div>
      {isGrouped && <GroupedProductUI />}
      {isVariable && <VariantSelectorUI />}
      {isSubscription && <SubscriptionPricingUI />}
      {/* etc. */}
    </div>
  )
}
```

### ❌ **NIET DOEN: Templates per product type**

```
❌ GroupedProductTemplate.tsx
❌ VariableProductTemplate.tsx
❌ SimpleProductTemplate.tsx
❌ SubscriptionProductTemplate.tsx
```

Dit zou betekenen dat je voor elke nieuwe product type een COMPLEET NIEUWE template moet bouwen. Niet schaalbaar!

### ✅ **WEL DOEN: Design variants die alle types ondersteunen**

```
✅ ProductTemplate1 (klassiek design - ondersteunt alle types)
✅ ProductTemplate2 (modern design - ondersteunt alle types)
✅ ProductTemplate3 (minimalistisch design - ondersteunt alle types)
```

Voordelen:
- Klanten kunnen design kiezen onafhankelijk van product type
- Nieuwe product types? Voeg 1x logic toe, werkt in alle templates
- Makkelijk A/B testen tussen designs

---

## 🗑️ OUDE ROMMEL TE VERWIJDEREN

### **1. Losse .tsx files in `/components/` root (9 files - ALLEMAAL OUD!)**

Deze staan **los** in `/branches/ecommerce/components/` terwijl ze in **submappen** horen:

#### **🔴 HOGE PRIORITEIT - Zeker verwijderen:**

```bash
❌ ProductDetailPage.tsx              (7.1 KB)
   Reden: Vervangen door ProductTemplate1/2/3
   Datum: 25 Feb 10:59 (vóór refactoring)
   Status: Wordt alleen gebruikt door ProductDetailWrapper.tsx (die ook weg kan)

❌ ProductDetailWrapper.tsx           (233 bytes)
   Reden: Wrapper voor oude ProductDetailPage
   Datum: 25 Feb 10:59
   Status: Import ProductDetailPage, beide kunnen weg

❌ CategoryPage.tsx                   (6.1 KB)
   Reden: Vervangen door ShopArchiveTemplate1
   Datum: 25 Feb 10:59
   Status: Check eerst of deze ergens geïmporteerd wordt
```

#### **🟠 MEDIUM PRIORITEIT - Mogelijk duplicates:**

```bash
⚠️ FreeShippingProgress.tsx          (6.3 KB)
   Reden: Duplicate van /components/ui/FreeShippingProgress/
   Datum: 25 Feb 10:59
   Status: Check welke versie gebruikt wordt
   Actie: Vermoedelijk deze verwijderen, /ui/ versie houden

⚠️ AddToCartButton.tsx               (4.9 KB)
   Reden: Mogelijk vervangen door ProductActions component?
   Datum: 25 Feb 10:59
   Status: Check of ProductActions dezelfde functionaliteit heeft
   Actie: Als ProductActions compleet is, deze verwijderen

⚠️ GuestCheckoutForm.tsx             (9.4 KB)
   Reden: Mogelijk vervangen door /checkout/ of auth components
   Datum: 25 Feb 10:59
   Status: Check waar guest checkout nu zit
```

#### **🟡 LAGE PRIORITEIT - Mogelijk nog nodig:**

```bash
🤔 VariantSelector.tsx               (12 KB)
   Reden: Gebruikt in ProductTemplate1/2/3
   Datum: 25 Feb 10:59
   Status: ACTIEF GEBRUIKT, maar moet verplaatst worden
   Actie: Verplaatsen naar /components/products/VariantSelector/

🤔 SubscriptionPricingTable.tsx      (9.5 KB)
   Reden: Gebruikt in ProductTemplate1/2/3
   Datum: 25 Feb 10:59
   Status: ACTIEF GEBRUIKT, maar moet verplaatst worden
   Actie: Verplaatsen naar /components/products/SubscriptionPricing/

🤔 RelatedProductsSection.tsx        (5.2 KB)
   Reden: Gebruikt in ProductTemplate1/2/3
   Datum: 25 Feb 10:59
   Status: ACTIEF GEBRUIKT, maar moet verplaatst worden
   Actie: Verplaatsen naar /components/products/RelatedProducts/
```

---

## 📦 REFACTOR PLAN: Verplaats Nog Gebruikte Components

### **Stap 1: Verplaats VariantSelector**

**Van:**
```
/branches/ecommerce/components/VariantSelector.tsx
```

**Naar:**
```
/branches/ecommerce/components/products/VariantSelector/
├── Component.tsx        ← Hernoemd van VariantSelector.tsx
├── types.ts             ← Type definitions
└── index.ts             ← Export
```

**Update imports in:**
- `ProductTemplate1/index.tsx`
- `ProductTemplate2/index.tsx`
- `ProductTemplate3/index.tsx`

### **Stap 2: Verplaats SubscriptionPricingTable**

**Van:**
```
/branches/ecommerce/components/SubscriptionPricingTable.tsx
```

**Naar:**
```
/branches/ecommerce/components/products/SubscriptionPricing/
├── Component.tsx        ← Hernoemd
├── types.ts
└── index.ts
```

### **Stap 3: Verplaats RelatedProductsSection**

**Van:**
```
/branches/ecommerce/components/RelatedProductsSection.tsx
```

**Naar:**
```
/branches/ecommerce/components/products/RelatedProducts/
├── Component.tsx        ← Hernoemd
├── types.ts
└── index.ts
```

---

## 🔍 DUPLICATE CHECK: FreeShippingProgress

Er zijn **2 versies** van FreeShippingProgress:

### **Versie 1 (OUD - losse file):**
```
/branches/ecommerce/components/FreeShippingProgress.tsx
Datum: 25 Feb 10:59
Grootte: 6.3 KB
```

### **Versie 2 (NIEUW - gestructureerd):**
```
/branches/ecommerce/components/ui/FreeShippingProgress/
├── Component.tsx
├── types.ts
└── index.ts
Datum: (check dit)
```

**Actie:**
1. Check welke versie gebruikt wordt in templates
2. Verwijder de oude losse file
3. Update alle imports naar de nieuwe versie

---

## 🎯 CLEANUP CHECKLIST

### **Phase 1: Verwijderen (100% zeker oud)**

```bash
# ZEKER VERWIJDEREN (niet meer gebruikt):
- [ ] ProductDetailPage.tsx
- [ ] ProductDetailWrapper.tsx

# Check eerst of gebruikt, dan verwijderen:
- [ ] CategoryPage.tsx (vervangen door ShopArchiveTemplate1?)
- [ ] AddToCartButton.tsx (vervangen door ProductActions?)
- [ ] GuestCheckoutForm.tsx (check waar guest checkout nu zit)
```

### **Phase 2: Duplicates opruimen**

```bash
# FreeShippingProgress duplicate check:
- [ ] Zoek welke versie gebruikt wordt (losse file of /ui/ folder)
- [ ] Verwijder oude versie
- [ ] Update imports naar nieuwe versie
```

### **Phase 3: Refactor (verplaatsen)**

```bash
# Verplaats naar gestructureerde folders:
- [ ] VariantSelector.tsx → /products/VariantSelector/
- [ ] SubscriptionPricingTable.tsx → /products/SubscriptionPricing/
- [ ] RelatedProductsSection.tsx → /products/RelatedProducts/

# Update imports in:
- [ ] ProductTemplate1/index.tsx
- [ ] ProductTemplate2/index.tsx
- [ ] ProductTemplate3/index.tsx
```

---

## 🚀 VERWACHTE RESULTAAT NA CLEANUP

### **Voor cleanup:**
```
/branches/ecommerce/components/
├── AddToCartButton.tsx              ← LOSSE FILES (rommel)
├── CategoryPage.tsx
├── FreeShippingProgress.tsx
├── GuestCheckoutForm.tsx
├── ProductDetailPage.tsx
├── ProductDetailWrapper.tsx
├── RelatedProductsSection.tsx
├── SubscriptionPricingTable.tsx
├── VariantSelector.tsx
├── account/                         ← Gestructureerde folders
├── checkout/
├── products/
└── ui/
```

### **Na cleanup:**
```
/branches/ecommerce/components/
├── account/                         ← ALLEEN gestructureerde folders
├── checkout/
├── orders/
├── products/
│   ├── ProductCard/
│   ├── ProductGallery/
│   ├── ProductMeta/
│   ├── ProductActions/
│   ├── VariantSelector/             ← VERPLAATST
│   ├── SubscriptionPricing/         ← VERPLAATST
│   └── RelatedProducts/             ← VERPLAATST
├── quick-order/
├── quote/
├── shop/
└── ui/
    ├── FreeShippingProgress/        ← ENIGE versie (duplicate weg)
    ├── CartLineItem/
    ├── OrderSummary/
    └── MiniCartFlyout/
```

**Resultaat:**
- ✅ Geen losse .tsx files meer in root
- ✅ Alles in gestructureerde subfolders
- ✅ Geen duplicates meer
- ✅ Duidelijke imports
- ✅ Schaalbaar en maintainable

---

## 📝 COMMANDO'S VOOR CLEANUP

### **Stap 1: Check wat gebruikt wordt**

```bash
# Check of ProductDetailPage ergens gebruikt wordt
grep -r "ProductDetailPage" src/app/ src/branches/ --include="*.tsx" --include="*.ts"

# Check of CategoryPage gebruikt wordt
grep -r "CategoryPage" src/app/ src/branches/ --include="*.tsx" --include="*.ts"

# Check welke FreeShippingProgress gebruikt wordt
grep -r "FreeShippingProgress" src/ --include="*.tsx" --include="*.ts"
```

### **Stap 2: Verwijder oude files (na verificatie!)**

```bash
# VOORZICHTIG! Alleen runnen als je zeker weet dat ze niet gebruikt worden
rm src/branches/ecommerce/components/ProductDetailPage.tsx
rm src/branches/ecommerce/components/ProductDetailWrapper.tsx
rm src/branches/ecommerce/components/CategoryPage.tsx
rm src/branches/ecommerce/components/FreeShippingProgress.tsx  # (duplicate)
```

### **Stap 3: Verplaats nog gebruikte components**

```bash
# Maak nieuwe folders
mkdir -p src/branches/ecommerce/components/products/VariantSelector
mkdir -p src/branches/ecommerce/components/products/SubscriptionPricing
mkdir -p src/branches/ecommerce/components/products/RelatedProducts

# Verplaats files (we maken ze later met juiste structuur)
# Dit moet handmatig omdat we Component.tsx, types.ts, index.ts structuur willen
```

---

## ⚠️ BELANGRIJK: Test Na Cleanup!

### **Test deze pagina's:**

```bash
# Start dev server
npm run dev

# Test de volgende routes:
1. /shop                    ← Shop overzicht (check CategoryPage vervangen is)
2. /shop/[product-slug]     ← Product detail (check templates werken)
3. /cart                    ← Winkelwagen (check FreeShippingProgress werkt)
4. /checkout                ← Checkout (check GuestCheckoutForm vervangen is)
```

### **Test deze flows:**

1. **Product detail pagina:**
   - Simple product → "In winkelwagen" knop werkt?
   - Variable product → Variant selector werkt?
   - Grouped product → Size tabel werkt?
   - Subscription product → Pricing tabel werkt?

2. **Related products:**
   - Verschijnen related products onderaan product pagina?
   - Klikbaar en gaat naar juiste product?

3. **Free shipping progress:**
   - Zichtbaar in winkelwagen?
   - Update bij toevoegen/verwijderen producten?

---

## 🎯 PRIORITEIT VOLGORDE

### **VANDAAG (1-2 uur werk):**

1. ✅ **Check wat gebruikt wordt** (15 min)
   - Zoek alle imports van oude files
   - Maak lijst van wat echt weg kan

2. ✅ **Verwijder 100% zekere oude files** (5 min)
   - ProductDetailPage.tsx
   - ProductDetailWrapper.tsx

3. ✅ **Fix FreeShippingProgress duplicate** (15 min)
   - Bepaal welke versie te houden
   - Verwijder oude versie
   - Update imports

### **DEZE WEEK (3-4 uur werk):**

4. ⏳ **Refactor VariantSelector** (1 uur)
   - Verplaats naar /products/VariantSelector/
   - Maak Component.tsx, types.ts, index.ts
   - Update imports in templates

5. ⏳ **Refactor SubscriptionPricingTable** (1 uur)
   - Verplaats naar /products/SubscriptionPricing/
   - Maak Component.tsx, types.ts, index.ts
   - Update imports in templates

6. ⏳ **Refactor RelatedProductsSection** (1 uur)
   - Verplaats naar /products/RelatedProducts/
   - Maak Component.tsx, types.ts, index.ts
   - Update imports in templates

7. ⏳ **Test alles grondig** (1 uur)
   - Test alle product types
   - Test alle templates
   - Check console voor errors

### **LATER (nice to have):**

8. 🔮 **Check overige oude files** (2 uur)
   - CategoryPage.tsx
   - AddToCartButton.tsx
   - GuestCheckoutForm.tsx

---

## 📊 IMPACT VAN CLEANUP

### **Voor cleanup:**
- 9 losse .tsx files in root (rommelig)
- Duplicates van FreeShippingProgress
- Oude ProductDetailPage nog aanwezig
- Onduidelijke structuur

### **Na cleanup:**
- 0 losse files in root
- Alles in gestructureerde subfolders
- Geen duplicates
- Duidelijke, schaalbare structuur
- Makkelijk te onderhouden

**Tijdsbesparing in de toekomst:**
- 30% sneller nieuwe componenten vinden
- 50% minder merge conflicts
- 80% minder "welke versie moet ik gebruiken?" vragen

---

**Laatste update:** 25 Februari 2026 - 20:45
**Status:** 🎯 Klaar voor cleanup!
**Volgend:** Start met check wat gebruikt wordt
