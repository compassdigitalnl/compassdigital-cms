# Publishing Branch — Volledige Implementatie Plan

> **Status:** Gepland
> **Datum:** 2026-03-13
> **Branch:** `ENABLE_PUBLISHING=true` (voorheen `ENABLE_CONTENT`)
> **Branchenaam:** `publishing` (Display: "Publishing & Media")

## Context

De publishing branch is fundamenteel anders dan beauty/horeca/zorg. Die branches gebruiken het **content modules systeem** (services, bookings, team). Publishing heeft **eigen collecties** (BlogPosts, Magazines) en combineert content-publicatie met premium toegang en digitale distributie.

### Wat al bestaat

| Onderdeel | Status | Locatie |
|-----------|--------|---------|
| BlogPosts collectie | ✅ Volledig | `src/branches/publishing/collections/BlogPosts.ts` |
| Blog routes | ✅ Volledig | `src/app/(content)/blog/` |
| Knowledge Base | ✅ Volledig | `src/app/(content)/knowledge-base/` + components |
| Premium content / Paywall | ✅ Volledig | `BlogPostWithPaywall`, `PaywallOverlay`, `useContentAccess` |
| Magazine componenten | ✅ 10 stuks | `src/branches/publishing/components/magazines/` |
| Magazine templates | ✅ 2 stuks | Archive + Detail templates |
| Subscription templates | ✅ 2 stuks | Checkout + Pricing templates |
| Magazines collectie | ✅ In ecommerce | `src/branches/ecommerce/shared/collections/catalog/Magazines.ts` |
| Reading time util | ✅ | `src/branches/publishing/utils/calculateReadingTime.ts` |
| Content access util | ✅ | `src/branches/publishing/utils/checkContentAccess.ts` |
| Branch metadata | ⚠️ Stub | `name: 'content'` → moet `'publishing'` worden |
| Blocks voor Pages | ❌ Ontbreekt | Geen publishing blocks in Pages CMS |
| Chatbot flows | ❌ Ontbreekt | Geen publishing conversatie flows |
| Email templates | ❌ Ontbreekt | Geen publishing email templates |
| Automation flows | ❌ Ontbreekt | Geen publishing automation flows |
| Seed functie | ❌ Minimaal stub | `src/endpoints/seed/templates/content.ts` (leeg) |
| Digitale Bibliotheek | ❌ Ontbreekt | Plan bestaat (`DIGITALE-BIBLIOTHEEK-PLAN.md`), niks geïmplementeerd |
| Magazine routes | ❌ Ontbreekt | Geen `/magazines` of `/tijdschriften` routes |

### Belangrijke beslissingen

1. **Feature flag rename**: `ENABLE_CONTENT` → `ENABLE_PUBLISHING` (backwards-compatible: beide accepteren)
2. **Magazines collectie blijft in ecommerce** — het is een product met subscriptions. Publishing leest het alleen.
3. **Digitale Bibliotheek = Fase 2** — vereist `ENABLE_PUBLISHING` + `ENABLE_ECOMMERCE`. Route: `/account/bibliotheek`.
4. **Publishing gradient**: `#7c3aed` → `#2563eb` (paars → blauw, creatief/professioneel)

---

## Fase 1: Foundation — Branch Metadata + Lib + Feature Flag Fix

### 1a. Branch metadata herschrijven
- **File:** `src/branches/publishing/index.ts` (bestaande stub → volledig herschrijven)
- Rename: `name: 'content'` → `name: 'publishing'`
- Volgt exact pattern van andere branches
- Exporteert: `branchMetadata`, block configs, template slugs, components

### 1b. Feature flag fix
- **File:** `src/lib/tenant/features.ts`
- Toevoegen: `publishing?: boolean` aan ClientFeatures (naast bestaande feature flags)
- `isFeatureEnabled('publishing')` controleert `ENABLE_PUBLISHING` OF `ENABLE_CONTENT` (backwards-compatible)

### 1c. Lib utilities aanmaken

| File | Beschrijving |
|------|-------------|
| `src/branches/publishing/lib/analytics.ts` | `trackPublishingEvent()` — GA4 events: article_view, article_share, magazine_view, subscription_start, library_open, paywall_hit |

Bestaande utils (`calculateReadingTime`, `checkContentAccess`) blijven behouden.

---

## Fase 2: Components (4 nieuwe stuks)

Bestaande components (ArticleCard, BlogPostWithPaywall, PaywallOverlay, PremiumBadge, KnowledgeBase/*, magazines/*) blijven behouden. Nieuwe toevoegingen:

| Component | Type | Beschrijving |
|-----------|------|-------------|
| `ArticleGrid` | Server | Responsive grid van artikelen met categorie-filter, laadstatus |
| `CategoryNav` | Client | Horizontale categorie-navigatie met pill-buttons |
| `AuthorCard` | Server | Auteur-card met avatar, naam, bio, aantal artikelen |
| `ReadingProgress` | Client | Sticky reading progress bar bovenaan artikel (scroll-based) |

**Pad:** `src/branches/publishing/components/<ComponentName>/`

---

## Fase 3: Blocks (4 stuks)

| Block | Velden | Beschrijving |
|-------|--------|-------------|
| `LatestArticles` | heading, limit, columns, categoryFilter, showPremiumBadge | Laatste blogartikelen, fetcht `blog-posts` |
| `FeaturedArticle` | heading, article (relationship), showExcerpt, showAuthor | Uitgelicht artikel met grote afbeelding |
| `MagazineShowcase` | heading, limit, showSubscriptionCTA | Magazine overzicht, fetcht `magazines` |
| `KnowledgeBasePreview` | heading, limit, showFilters, showStats | Kennisbank preview met stats en zoekbalk |

**Pad:** `src/branches/publishing/blocks/<BlockName>/`

**Registratie:** Conditioneel via `isFeatureEnabled('publishing')` in Pages collection.

---

## Fase 4: App Routes (magazine routes + fix bestaande)

### Nieuwe magazine routes
| Route | File | Template |
|-------|------|----------|
| `/tijdschriften` | `src/app/(content)/tijdschriften/page.tsx` | `MagazineArchiveTemplate` |
| `/tijdschriften/[slug]` | `src/app/(content)/tijdschriften/[slug]/page.tsx` | `MagazineDetailTemplate` |
| `/abonnement` | `src/app/(content)/abonnement/page.tsx` | `SubscriptionPricingTemplate` |
| `/abonnement/checkout` | `src/app/(content)/abonnement/checkout/page.tsx` | `SubscriptionCheckoutTemplate` |

### Bestaande routes (behouden)
- `/blog` — Blog archive ✅
- `/blog/[category]/[slug]` — Blog detail ✅
- `/knowledge-base` — Kennisbank ✅

---

## Fase 5: Hooks (1 hook)

### 5a. `articlePublishHook.ts`
- **File:** `src/branches/publishing/hooks/articlePublishHook.ts`
- `CollectionAfterChangeHook` op `blog-posts`
- Detecteert status transitie: `draft` → `published`
- Triggert: `article.published` event (voor automation flows)
- Logt publicatie naar console

### 5b. Registratie
- Toevoegen aan BlogPosts collection `afterChange` hooks

---

## Fase 6: Pre-built Email Templates (6 templates)

Toevoegen aan `src/features/email-marketing/lib/predefined/templates.ts`:

| # | Template | Category | Subject |
|---|----------|----------|---------|
| 1 | Nieuw Artikel Gepubliceerd | newsletter | Nieuw: {{ .ArticleTitle }} |
| 2 | Wekelijkse Digest | newsletter | Deze week op {{ .SiteName }}: {{ .ArticleCount }} nieuwe artikelen |
| 3 | Premium Artikel Beschikbaar | promotional | Exclusief voor abonnees: {{ .ArticleTitle }} |
| 4 | Abonnement Welkom | welcome | Welkom bij {{ .SiteName }} Premium! |
| 5 | Abonnement Verlengd | transactional | Uw abonnement is verlengd |
| 6 | Nieuw Magazine Editie | newsletter | Nieuwe editie: {{ .MagazineTitle }} — {{ .EditionTitle }} |

Alle templates: publishing-gradient header (`#7c3aed` → `#2563eb`), tags `['publishing', 'content', 'predefined']`.

---

## Fase 7: Pre-built Automation Flows (3 flows)

### Flow 1: Nieuwe Abonnee Onboarding Flow
- **Trigger:** `custom.event` / `subscription.activated`
- **Steps:** send welkom → tag 'premium-subscriber' → wait 3 dagen → send "tips" → exit

### Flow 2: Nieuwe Editie Notificatie Flow
- **Trigger:** `custom.event` / `magazine.edition.published`
- **Steps:** send nieuwe editie → tag → exit

### Flow 3: Wekelijkse Content Digest Flow
- **Trigger:** `scheduled` / weekly (maandag 09:00)
- **Steps:** send wekelijkse digest → exit

---

## Fase 8: Pre-built Chatbot Conversation Flows

### 8a. Publishing Conversation Flows (7 categories)

```
1. Artikelen & Blog (type: submenu)
   ├─ Laatste artikelen → direct: "Welke artikelen zijn er recent gepubliceerd?"
   ├─ Artikelen zoeken → input: "Waar zoek je naar?" placeholder: "Bijv. marketing, technologie..."
   ├─ Populairste artikelen → direct: "Wat zijn de meest gelezen artikelen?"
   └─ Categorie bekijken → input: "Welke categorie?" placeholder: "Bijv. nieuws, achtergrond..."

2. Tijdschriften & Edities (type: submenu)
   ├─ Beschikbare tijdschriften → direct: "Welke tijdschriften zijn er beschikbaar?"
   ├─ Laatste editie → direct: "Wat is de nieuwste editie?"
   ├─ Archief bekijken → direct: "Kan ik oudere edities bekijken?"
   └─ Digitale bibliotheek → direct: "Hoe werkt de digitale bibliotheek?"

3. Abonnementen & Prijzen (type: submenu)
   ├─ Abonnementen bekijken → direct: "Welke abonnementen zijn er beschikbaar?"
   ├─ Prijzen vergelijken → direct: "Wat zijn de prijzen en wat zit er in elk abonnement?"
   ├─ Premium voordelen → direct: "Wat krijg ik met een premium abonnement?"
   └─ Proefabonnement → direct: "Is er een gratis proefperiode?"

4. Kennisbank (type: submenu)
   ├─ Kennisbank bekijken → direct: "Wat is de kennisbank en hoe werkt het?"
   ├─ Zoeken in kennisbank → input: "Waar zoek je naar?" placeholder: "Bijv. handleiding, how-to..."
   └─ Premium content → direct: "Welke content is exclusief voor abonnees?"

5. Mijn Account & Abonnement (type: submenu)
   ├─ Abonnement beheren → direct: "Hoe kan ik mijn abonnement beheren?"
   ├─ Abonnement opzeggen → direct: "Hoe zeg ik mijn abonnement op?"
   ├─ Facturen bekijken → direct: "Waar vind ik mijn facturen?"
   └─ Adreswijziging → direct: "Hoe wijzig ik mijn bezorgadres?"

6. Contact & Redactie (type: submenu)
   ├─ Contact met redactie → direct: "Hoe kan ik contact opnemen met de redactie?"
   ├─ Artikel insturen → direct: "Kan ik zelf een artikel insturen?"
   └─ Adverteren → direct: "Wat zijn de mogelijkheden om te adverteren?"

7. Overige vragen (type: input)
```

### 8b. System Prompt + Training Context + Welcome Message

---

## Fase 9: Seed Functie Compleet

| Content | Collection | Aantal |
|---------|------------|--------|
| Blog artikelen | blog-posts | 4 (Nieuwsartikel, Achtergrondverhaal, How-to guide, Premium exclusief) |
| Blog categorieën | blog-categories | 3 (Nieuws, Achtergrond, How-to) |
| Chatbot flows | chatbot-settings global | 7 flow categories + system prompt + training context |

NB: Magazines worden NIET geseed via publishing — die worden via ecommerce/marketplace geseed (aboland01 patroon).

---

## Fase 10: Digitale Bibliotheek (APART — Fase 2)

> **Vereist:** `ENABLE_PUBLISHING` + `ENABLE_ECOMMERCE`
> **Referentie:** `docs/design/DIGITALE-BIBLIOTHEEK-PLAN.md`

Dit is een aparte, complexe module die **na** de basis-publishing branch wordt gebouwd. Het omvat:

### Samenvatting uit bestaand plan
- **Provider pattern**: InternalEditionProvider (PDF→images) + ThorEditionProvider (externe API)
- **Magazines collectie uitbreiden**: `digitalPdf`, `isDigital`, `pageCount`, `digitalAvailableFrom` velden
- **Nieuwe collectie**: `DigitalEditionPages` (gerenderde pagina-afbeeldingen)
- **Flipbook viewer**: react-pageflip met anti-download maatregelen
- **Account routes**: `/account/bibliotheek`, `/account/bibliotheek/[magazineSlug]`, `/account/bibliotheek/[magazineSlug]/[editieNr]`
- **API endpoints**: Library, editions, pages, progress tracking
- **Security**: Auth + subscription check + watermarking + rate limiting

### Componenten (publishing/components/library/)
- `LibraryOverview` — Overzicht van beschikbare tijdschriften
- `LibraryMagazineGrid` — Grid van edities per tijdschrift
- `FlipbookViewer` — Interactieve blader-viewer
- `FlipbookToolbar` — Navigatie, zoom, volledig scherm
- `ReadingProgressBar` — Leesvoortgang indicator

### Routes (in ecommerce account)
- `/account/bibliotheek` → Library overview
- `/account/bibliotheek/[magazineSlug]` → Edities lijst
- `/account/bibliotheek/[magazineSlug]/[editieNr]` → Flipbook viewer

**Geschatte omvang:** 30-45 uur (5 fasen)
**Wordt apart geïmplementeerd na deze basis-branch.**

---

## Implementatievolgorde

1. **Fase 1** — Foundation: branch metadata fix + feature flag + analytics
2. **Fase 2** — Components: 4 nieuwe componenten
3. **Fase 3** — Blocks: 4 blocks (registratie in Pages)
4. **Fase 4** — App Routes: magazine routes + subscription routes
5. **Fase 5** — Hooks: articlePublishHook
6. **Fase 6** — Email Templates: 6 pre-built templates
7. **Fase 7** — Email Flows: 3 automation flows
8. **Fase 8** — Chatbot: predefined conversation flows + seed
9. **Fase 9** — Seed: complete seedPublishing() functie
10. **Fase 10** — Digitale Bibliotheek (APART, later)

---

## Referentiebestanden

| Bestand | Reden |
|---------|-------|
| `src/branches/publishing/index.ts` | Huidige stub, wordt herschreven |
| `src/branches/publishing/collections/BlogPosts.ts` | Bestaande blog collectie |
| `src/branches/publishing/components/magazines/` | Bestaande magazine componenten |
| `src/branches/publishing/templates/` | Bestaande templates |
| `src/branches/ecommerce/shared/collections/catalog/Magazines.ts` | Magazine collectie (in ecommerce) |
| `src/app/(content)/` | Bestaande content routes |
| `src/features/email-marketing/lib/predefined/templates.ts` | Email template pattern |
| `src/features/email-marketing/lib/predefined/flows.ts` | Automation flow pattern |
| `src/features/ai/lib/predefined/conversationFlows.ts` | Chatbot flows pattern |
| `docs/design/DIGITALE-BIBLIOTHEEK-PLAN.md` | Bibliotheek plan (Fase 10) |

---

## Verificatie

1. `/blog` toont artikelen met categorie-filter + premium badges
2. `/tijdschriften` toont magazine overzicht met covers
3. `/tijdschriften/[slug]` toont magazine detail met edities + subscription CTA
4. `/abonnement` toont pricing plans
5. `/knowledge-base` toont kennisbank met zoek + filters
6. `POST /api/email-marketing/seed-predefined` → 6 nieuwe publishing templates
7. Chatbot widget → 7 publishing flow categories
8. seedPublishing() → 4 artikelen, 3 categorieën, chatbot flows
9. `ENABLE_PUBLISHING=true` → blocks beschikbaar in Pages CMS

---

## Wat NIET verandert

- BlogPosts collectie — volledig, geen wijzigingen nodig
- KnowledgeBase components — volledig, geen wijzigingen nodig
- Premium/Paywall systeem — volledig, geen wijzigingen nodig
- Magazine componenten — volledig, geen wijzigingen nodig
- Magazine/Subscription templates — volledig, geen wijzigingen nodig
- Magazines collectie — blijft in ecommerce

## Architectuur-refactoring (LATER)

De volgende zaken worden **na alle branches** in één keer aangepakt:
- `shared/components/ui/pricing/` → mogelijk verplaatsen naar domain-specifiek
- `shared/components/ui/checkout/` → consolideren met ecommerce checkout
- Branch metadata consistentie over alle branches
- Feature flag naamgeving standaardiseren
