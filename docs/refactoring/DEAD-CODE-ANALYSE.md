# Dead Code Analyse (gecorrigeerd)

**Datum:** 2026-03-05 (gecorrigeerd na grondige verificatie)
**Scope:** `src/branches/` en `src/app/`

---

## Zeker dood — `src/branches/`

| Categorie | Pad | Bestanden | Verificatie |
|-----------|-----|-----------|-------------|
| ~~Product-types componenten~~ | ~~`ecommerce/components/product-types/`~~ | ~~123~~ | **CORRECTIE: GEEN dead code!** Zijn compleet gebouwde componenten (56 stuks, met README's + feature flags) die nog geintegreerd moeten worden in ProductTemplate4. Zie sectie "Nog te integreren" |
| ~~Product-types lib~~ | ~~`ecommerce/lib/product-types/`~~ | ~~5~~ | **CORRECTIE: GEEN dead code!** Types + feature flags voor bovenstaande componenten |
| ~~Navigatie componenten~~ | ~~`shared/components/navigation/`~~ | ~~29~~ | **VERWIJDERD op 2026-03-05.** Vervangen door `shared/components/layout/header/Header/` |
| ~~Auth componenten~~ | ~~`shared/components/auth/`~~ | ~~37~~ | **VERWIJDERD op 2026-03-05.** Vervangen door `ecommerce/components/auth/` (betere error handling, accessibility, KvkLookup, Tailwind) |
| Quote subcomponenten | `ecommerce/components/quote/` | ~13 | CompanyInfoForm, FileUploadDropzone, OfferteHero, ProductSelectionTable, ProjectInfoForm — nul imports |
| Quick-order subcomponenten | `ecommerce/components/quick-order/` (excl. QuickOrderRow) | ~13 | CSVUploadButton, ProTipBanner, QuickOrderHeader, QuickOrderTable — nul imports. QuickOrder block gebruikt inline state |
| Account settings subcomponenten | `ecommerce/components/account/settings/` | ~16 | ProfileForm, CompanyForm, PasswordForm, NotificationPreferences, DangerZone — nul imports. SettingsTemplate heeft inline implementatie |

**Totaal: ~32 bestanden zeker dood in `src/branches/`** (was ~236; product-types GEEN dead code; navigatie 29 + auth 37 + features 7 + Grid 3 bestanden verwijderd op 2026-03-05)

## Zeker dood — `src/app/`

| Route/Bestand | Verificatie |
|---------------|-------------|
| `app/(shared)/ai-playground/` | Niet gelinkt in navigatie/menus. Alleen referentie vanuit `docs/` page (ook dood) |
| `app/(shared)/docs/` | Niet gelinkt in navigatie/menus. Alleen interne links naar andere dev pages |
| `app/(shared)/overview/` | Niet gelinkt in navigatie/menus |
| `app/(shared)/setup/` | Niet gelinkt in navigatie/menus. Alleen gelinkt vanuit `docs/` en `overview/` (ook dood) |
| `app/(ecommerce)/shop-demo/` | Standalone demo pagina, niet gelinkt in navigatie/menus |

**Totaal: 5 routes zeker dood in `src/app/`**

---

## FOUT in vorige analyse — deze zijn WEL actief gebruikt

| Route | Status | Waarom actief |
|-------|--------|---------------|
| `app/tenant/` | **ACTIEF** | Middleware.ts (regel 406-408) rewritet alle client/tenant paden hierheen. Essentieel voor multi-tenant routing |
| `app/api/seed/` | **ACTIEF** | Admin panel SeedButton (`BeforeDashboard/SeedButton/index.tsx`) roept dit aan voor demo content |
| `app/api/stripe/connect/` | **ACTIEF** | Gebruikt door ProvisioningService. Routes: onboarding-link, account-status, create-account |
| `app/api/stripe/checkout/` | **ACTIEF** | Gebruikt voor checkout create-session |

## FOUT in vorige analyse — bestaan niet

| Route | Opmerking |
|-------|-----------|
| `app/api/migrate/` | Bestaat niet in codebase |
| `app/api/msp-affiliates/` | Bestaat niet in codebase |
| `app/api/external/` | Bestaat niet in codebase |
| `app/api/revalidate/` | Bestaat niet. Revalidation gaat via Next.js native `revalidatePath()`/`revalidateTag()` |

---

## Op de planning / in ontwikkeling (NIET verwijderen)

| Route/Bestand | Status |
|---------------|--------|
| `app/(ecommerce)/vendors/` | Gepland — leveranciers-functie |
| `app/(ecommerce)/workshops/` | Gepland — workshop-pagina's |
| `app/(branches)/beauty/` | Actief — beauty01 demo site |
| `app/(branches)/construction/` | Actief — construction01 demo site |
| `app/(branches)/horeca/` | Actief — horeca01 demo site |
| `app/api/webhooks/mollie/` | Gepland — Mollie betalingen |
| `app/api/account/` | In ontwikkeling (~80% klaar) |
| `src/branches/ecommerce/templates/account/` | In ontwikkeling (~80% klaar) |

## Overige twijfels — geverifieerd

| Route/Bestand | Conclusie | Toelichting |
|---------------|-----------|-------------|
| `app/(shared)/knowledge-base/` | **ACTIEF** | Pagina bestaat en is functioneel. Niet gelinkt in navigatie maar wel werkend. Gebruikt door RAGChatbotService |
| `app/api/cron/cleanup-stock-reservations/` | **ACTIEF** | Gedocumenteerd in API_DOCUMENTATION.md. Productie-ready, alleen niet gescheduled in vercel.json. Moet draaien elke 5 min |
| `app/api/preview/` | **DEELS ACTIEF** | Exit-preview route werkt. Entry-preview is disabled (.disabled suffix). Preview button in CMS genereert wel URLs |
| `app/api/webhooks/exact-online/` | **TWIJFEL** | Moet gecheckt worden of Exact Online koppeling live is bij enige klant |

---

## Aanbeveling — veilig te verwijderen

### ~~Prioriteit 1: Vervangen componenten~~ ✅ VOLTOOID

```
src/branches/shared/components/navigation/   (~29 bestanden) ✅ VERWIJDERD 2026-03-05
src/branches/shared/components/auth/         (~37 bestanden) ✅ VERWIJDERD 2026-03-05
```

### Prioriteit 2: Ongebruikte subcomponenten (~42 bestanden)

```
src/branches/ecommerce/components/quote/              (~13 bestanden)
src/branches/ecommerce/components/quick-order/         (~13 bestanden, excl. QuickOrderRow)
src/branches/ecommerce/components/account/settings/    (~16 bestanden)
```

### Prioriteit 3: Dev pages (5 routes)

```
src/app/(shared)/ai-playground/
src/app/(shared)/docs/
src/app/(shared)/overview/
src/app/(shared)/setup/
src/app/(ecommerce)/shop-demo/
```

### Nog checken

- `app/api/webhooks/exact-online/` — check of koppeling live is bij enige klant

---

## Nog te integreren: Product-Types in ProductTemplate4

**Status:** 56 componenten gebouwd, wachtend op template-integratie.

ProductTemplate4 ondersteunt momenteel slechts 3-4 van 9 product types:

| Product Type | Components klaar | In ProductTemplate4? |
|---|---|---|
| Simple | - | Ja (inline) |
| Grouped | - | Ja (StaffelCalculator + inline) |
| Variable (VP01-VP13) | 13 componenten | Alleen basis `VariantSelector` |
| Subscription | 5 componenten | Alleen basis `SubscriptionPricingTable` |
| Bundle (BB01-BB06) | 6 componenten | Nee |
| Configurator (PC01-PC08) | 8 componenten | Nee |
| Personalized (PP01-PP08) | 7 componenten | Nee |
| Bookable | 8 componenten | Nee |
| Mix & Match | 8 componenten | Gedetecteerd, maar rendert niks |

**Locaties:**
- Componenten: `src/branches/ecommerce/components/product-types/`
- Types + feature flags: `src/branches/ecommerce/lib/product-types/`
- Template: `src/branches/ecommerce/templates/products/ProductTemplate4/index.tsx`

---

## Header architectuur (ter referentie)

De actieve header (`shared/components/layout/header/Header/`) is modulair:

| Component | Regels | Functie |
|---|---|---|
| `index.tsx` | 12 | Server entry (fetch CMS globals) |
| `index.client.tsx` | 442 | Orchestrator (composeert subcomponenten) |
| `TopBar.tsx` | 206 | Info bar met berichten/links |
| `AlertBar.tsx` | 174 | Dismissible promo/alert banner |
| `NavigationBar.tsx` | 623 | Hoofd nav + mega menu |
| `MobileDrawer.tsx` | 273 | Mobiel menu |

De oude `shared/components/navigation/` (AccountSidebar, HeaderActions, Logo, MobileDrawer, Navigation, SearchBar, Topbar) zijn verlaten versies en WEL dead code.
