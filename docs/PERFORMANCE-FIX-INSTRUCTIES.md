# INSTRUCTIES VOOR CLAUDE LOKAAL: Performance Fixes

## Context

De admin UI en frontend worden trager naarmate er meer producten worden toegevoegd. De hoofdoorzaak is `depth: 2` op listing pages (resolved ALLE relationships voor ALLE producten) en `cache: 'no-store'` op de homepage ProductGrid.

---

## FIX 1: `src/app/(app)/shop/page.tsx` — Shop listing depth verlagen + select

**Probleem:** Regel 29-35 doet `depth: 2` voor alle 50 producten. Dit resolved voor elk product: childProducts, images, categories, brand, relatedProducts, crossSells, upSells, accessories — en dan nog een niveau dieper. Bij 100+ producten = honderden extra DB queries.

**Fix:** Verlaag depth naar 1 en gebruik `select` om alleen benodigde velden op te halen:

```ts
// OUD (regel 29-35):
const { docs: products } = await payload.find({
  collection: 'products',
  where,
  depth: 2, // Resolve childProducts
  limit: 50,
  sort: '-createdAt',
})

// NIEUW:
const { docs: products } = await payload.find({
  collection: 'products',
  where,
  depth: 1, // Alleen directe relationships resolven (images, brand, categories)
  limit: 50,
  sort: '-createdAt',
  select: {
    title: true,
    slug: true,
    price: true,
    salePrice: true,
    compareAtPrice: true,
    sku: true,
    ean: true,
    stock: true,
    stockStatus: true,
    status: true,
    featured: true,
    badge: true,
    productType: true,
    images: true,
    brand: true,
    categories: true,
    shortDescription: true,
    childProducts: true,
    volumePricing: true,
  },
})
```

**Waarom:** De listing page heeft GEEN relatedProducts, crossSells, upSells, accessories, downloads, videos, specifications, meta, tags, groupPrices nodig. Door `select` te gebruiken wordt de query veel lichter.

**Let op:** `childProducts` heeft `depth: 1` nodig om de relationship te resolven. Als grouped products op de listing page de laagste prijs moeten tonen, is depth 1 voldoende (resolved de directe product relationship, maar niet diens sub-relationships).

---

## FIX 2: `src/app/(app)/shop/[slug]/page.tsx` — generateMetadata depth verlagen

**Probleem:** `generateMetadata` (regel 13-21) haalt een product op met de standaard depth. Dit is onnodig — metadata heeft alleen `title`, `meta.title`, `meta.description` en `shortDescription` nodig.

**Fix:** Voeg `depth: 0` en `select` toe:

```ts
// OUD (regel 13-21):
const { docs: products } = await payload.find({
  collection: 'products',
  where: {
    slug: {
      equals: params.slug,
    },
  },
  limit: 1,
})

// NIEUW:
const { docs: products } = await payload.find({
  collection: 'products',
  where: {
    slug: {
      equals: params.slug,
    },
  },
  depth: 0,
  limit: 1,
  select: {
    title: true,
    shortDescription: true,
    meta: true,
  },
})
```

**Let op:** De product detail page zelf (regel 46-55) mag `depth: 2` behouden — dat is slechts 1 product, dus de performance impact is minimaal.

---

## FIX 3: `src/blocks/ProductGrid/Component.tsx` — Caching toevoegen + select

**Probleem 1:** Regel 75-78 gebruikt `cache: 'no-store'` — elke pageview triggert een verse API call. Op de homepage is dit onnodig, producten veranderen niet elke seconde.

**Probleem 2:** De API call haalt het volledige product object op inclusief alle velden.

**Fix:** Vervang `cache: 'no-store'` door revalidatie en voeg `select` toe aan de API URL:

```ts
// OUD (regel 74-80):
if (apiUrl) {
  const response = await fetch(apiUrl, {
    cache: 'no-store', // Always fetch fresh data
    headers: {
      'Content-Type': 'application/json',
    },
  })

// NIEUW:
if (apiUrl) {
  // Voeg depth en select params toe aan de URL
  const separator = apiUrl.includes('?') ? '&' : '?'
  const optimizedUrl = `${apiUrl}${separator}depth=1&select[title]=true&select[slug]=true&select[price]=true&select[salePrice]=true&select[compareAtPrice]=true&select[sku]=true&select[stock]=true&select[stockStatus]=true&select[status]=true&select[badge]=true&select[productType]=true&select[images]=true&select[brand]=true&select[shortDescription]=true`

  const response = await fetch(optimizedUrl, {
    next: { revalidate: 60 }, // Cache voor 60 seconden, dan revalideren
    headers: {
      'Content-Type': 'application/json',
    },
  })
```

**Waarom:**
- `next: { revalidate: 60 }` cached de response 60 seconden. Homepage bezoekers krijgen een snelle cached response. Na 60 seconden wordt de data ververst.
- `depth=1` voorkomt dat de API alle sub-relationships resolved.
- `select` haalt alleen de velden op die de ProductGrid daadwerkelijk rendert.

---

## FIX 4: `src/blocks/CategoryGrid/Component.tsx` — Zelfde caching fix

**Probleem:** Waarschijnlijk ook `cache: 'no-store'`. Check de fetch call in dit bestand.

**Fix:** Vervang `cache: 'no-store'` door:
```ts
next: { revalidate: 300 }, // Cache categorieën 5 minuten (veranderen zelden)
```

---

## SAMENVATTING

| # | Bestand | Fix | Impact |
|---|---------|-----|--------|
| 1 | `src/app/(app)/shop/page.tsx` | `depth: 1` + `select` op listing query | HOOG — grootste bottleneck |
| 2 | `src/app/(app)/shop/[slug]/page.tsx` | `depth: 0` + `select` op generateMetadata | MEDIUM — onnodige query |
| 3 | `src/blocks/ProductGrid/Component.tsx` | `revalidate: 60` + `depth=1` + `select` params | HOOG — homepage elk request |
| 4 | `src/blocks/CategoryGrid/Component.tsx` | `revalidate: 300` i.p.v. `no-store` | MEDIUM — homepage elk request |

## Verwacht resultaat

- Shop listing page: ~70% sneller (geen onnodige relationship resolving)
- Homepage: ~90% sneller voor herhaalde bezoeken (caching)
- Product detail page: ongewijzigd (depth: 2 is OK voor 1 product)
- Admin UI: indirect sneller doordat de database minder belast wordt door frontend queries
