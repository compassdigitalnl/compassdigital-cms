# Admin Backend — Master Implementatieplan
**Versie:** 1.0 — 17 Februari 2026
**Status:** Fase 1 & 2 voltooid. Fase 3+ gepland.

---

## Overzicht

Dit document beschrijft het volledige gefaseerde plan voor de `/admin` omgeving van het SiteForge platform. Het platform is een multi-tenant CMS waarbij CompassDigital (admin) klant-sites beheert en klanten (editors) hun eigen omgeving zelfstandig kunnen beheren.

### Architectuurkeuze (belangrijk)
De huidige opzet is één gedeelde Payload CMS instantie voor alle clients. De toekomst is **multi-tenant**: elke klant krijgt een eigen geïsoleerde Payload instantie. De toegangscontrole is nu al ingericht op wat logisch is in die toekomstige situatie.

---

## Rolverdeling (definitief)

| Actie | Admin (CompassDigital) | Editor (Klant) |
|---|---|---|
| **Pages** aanmaken | ✅ | ✅ |
| **Pages** bewerken | ✅ | ✅ |
| **Pages** verwijderen | ✅ | ✅ |
| **Blog Posts** beheren (full) | ✅ | ✅ |
| **Media** uploaden/verwijderen | ✅ | ✅ |
| **FAQs** beheren (full) | ✅ | ✅ |
| **Cases** beheren (full) | ✅ | ✅ |
| **Testimonials** beheren (full) | ✅ | ✅ |
| **Services** beheren (full) | ✅ | ✅ |
| **Partners** beheren (full) | ✅ | ✅ |
| **Producten** beheren (full) | ✅ | ✅ |
| **Product Categorieën** beheren | ✅ | ✅ |
| **Merken** beheren | ✅ | ✅ |
| **Klantengroepen** beheren | ✅ | ✅ |
| **Orders** bekijken | ✅ (alles) | Eigen orders |
| **Footer** bewerken | ✅ | ✅ |
| **Theme/Design** bewerken | ✅ | ✅ |
| **Settings** (Inhoud/Contactinfo) | ✅ | ✅ |
| **Settings** (Branding/SEO/Tracking) | ✅ | ✗ |
| **Header** bewerken | ✅ | ✗ |
| **Form Submissions** bekijken | ✅ | ✗ |
| **Users** beheren | ✅ | ✗ |
| **Clients** (platform) | ✅ | **NOOIT** (verborgen) |
| **Deployments** (platform) | ✅ | **NOOIT** (verborgen) |

---

## Fase 1 — Veiligheidsfixes (VOLTOOID ✅)
**Commit:** `df728df` — 17 Feb 2026

### Wat is gedaan
- `clients` en `deployments` beperkt tot admin-only + verborgen in sidebar voor editors
- `media`, `products`, `brands`, `customer-groups`, `product-categories` kregen ontbrekende access-regels
- `theme` global kreeg een `update`-regel

### Verificatie
```bash
# Maak een test-account aan met rol 'editor'
# Log in als editor via /admin
# Controleer: Platform Management is NIET zichtbaar in sidebar
# Controleer: geen directe URL /admin/collections/clients geeft 403
```

---

## Fase 2 — Editor Volledige Rechten (VOLTOOID ✅)
**Commit:** `9e747f0` — 17 Feb 2026

### Wat is gedaan
Editors kunnen nu alles beheren wat veilig is in hun eigen omgeving:
- Pages: aanmaken + verwijderen
- Blog Posts: verwijderen
- Cases, Testimonials, Services, Partners, FAQs: verwijderen
- Media: verwijderen

### Verificatie
```bash
# Log in als editor
# Ga naar /admin/collections/pages
# Klik op "Nieuw" → pagina aanmaken moet werken
# Verwijder een pagina → moet werken
# Ga naar /admin/collections/users → moet 403 geven of leeg zijn
# Ga naar /admin/collections/form-submissions → mag NIET zichtbaar zijn
```

---

## Fase 3 — Dashboard UX per Rol (gepland)
**Prioriteit:** Hoog
**Geschatte tijd:** 1-2 dagen
**TypeScript risico:** Laag

### Doel
Klanten zien een overzichtelijk, relevant dashboard. Geen technische rommel. Snelkoppelingen naar de meest gebruikte functies.

### Implementatie

**Stap 1: BeforeDashboard component uitbreiden**

Bestand: `src/components/BeforeDashboard/index.tsx`

```tsx
// Huidige implementatie toont een generiek welkomstscherm
// Uitbreiden met rol-specifieke content:

'use client'
import { useAuth } from '@payloadcms/ui'

export function BeforeDashboard() {
  const { user } = useAuth()
  const isAdmin = user?.roles?.includes('admin')

  if (isAdmin) {
    return <AdminDashboard />  // Overzicht klanten, deployments, revenue
  }
  return <EditorDashboard />   // Snelkoppelingen: pagina's, blog, media
}
```

**Stap 2: EditorDashboard — snelkoppelingen**
- "Pagina bewerken" — link naar meest recent bewerkte pagina
- "Nieuw blog bericht" — directe link
- "Media uploaden" — directe link
- "Bestellingen bekijken" (als e-commerce)

**Stap 3: AdminDashboard — platform overzicht**
- Aantal actieve klanten
- Recente deployments
- Systeem health status
- Snelle links naar clients/deployments

### Build-controle
```bash
npm run build
# Let op: custom React components in Payload 3.x moeten 'use client' hebben
# als ze hooks gebruiken (useAuth, useState, etc.)
# Server components kunnen GEEN hooks gebruiken
```

### TypeScript-check
```bash
npx tsc --noEmit
# Zorg dat useAuth correct getypeerd is via @payloadcms/ui types
```

---

## Fase 4 — Sidebar Cleanup per Rol (gepland)
**Prioriteit:** Hoog
**Geschatte tijd:** 4-8 uur
**TypeScript risico:** Laag

### Doel
Editors zien alleen relevante collecties in de sidebar. Geen verwarrende technische items.

### Implementatie

Gebruik `admin.hidden` per collectie (al gedaan voor clients/deployments). Verberg ook:

```typescript
// FormSubmissions.ts — verberg voor editors
admin: {
  hidden: ({ user }) => !checkRole(['admin'], user),
}

// Users/index.ts — al admin-only, maar ook verbergen
admin: {
  hidden: ({ user }) => !checkRole(['admin'], user),
}
```

**Sidebar groepen hernoemen voor editors:**

In `payload.config.ts` is de admin sidebar configureerbaar. Overweeg een klant-vriendelijkere naam dan technische termen.

### Verificatie
```bash
# Log in als editor
# Sidebar moet tonen: Website, Marketing, E-commerce, Ontwerp
# Sidebar moet NIET tonen: Platform Management, Systeem, Formulieren
```

---

## Fase 5 — Header/Navigation Beheer voor Editors (gepland)
**Prioriteit:** Middel
**Geschatte tijd:** 1 dag
**TypeScript risico:** Laag

### Huidig probleem
Header is admin-only (`checkRole(['admin'], user)`). Klanten kunnen hun eigen navigatie niet aanpassen.

### Beslissing vereist
Moet de klant hun header (navigatie) zelf kunnen beheren?

**Optie A:** Header read-only voor editors (huidig — veilig maar beperkt)
**Optie B:** Header bewerkbaar voor editors (meer vrijheid, meer risico op kapotte navigatie)

**Aanbeveling:** Optie B, maar met beperkte velden:
```typescript
// Header.ts
access: {
  read: () => true,
  update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
}
// Specifieke velden (zoals domein-configuratie) admin-only via field-level access
```

### Implementatie
```typescript
// src/globals/Header.ts
import { checkRole } from '../access/utilities'

update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
```

### Verificatie + Build
```bash
npm run build
npx tsc --noEmit
# Test: kan editor navigatie-items toevoegen/verwijderen?
# Test: worden wijzigingen zichtbaar op de frontend na revalidate?
```

---

## Fase 6 — Page Builder Verbetering (gepland)
**Prioriteit:** Middel
**Geschatte tijd:** 2-3 dagen
**TypeScript risico:** Middel

### Huidig probleem
De Pages collectie heeft 36 blokken beschikbaar. Dat is overweldigend voor klanten die niet weten wat "ProductFilters", "Breadcrumb" of "QuickOrder" zijn.

### Implementatie

**Stap 1: Blokken filteren per template/context**

In `src/collections/Pages/index.ts` is de layout builder gedefinieerd. Blokken kunnen per rol gefilterd worden via `admin.condition`.

```typescript
// Voorbeeld: verberg technische e-commerce blokken als editor geen e-commerce heeft
{
  name: 'layout',
  type: 'blocks',
  blocks: [
    Hero,
    Content,
    TwoColumn,
    CTA,
    FAQ,
    TestimonialsBlock,
    CasesBlock,
    LogoBar,
    Stats,
    Team,
    ContactFormBlock,
    ImageGallery,
    Video,
    Accordion,
    BlogPreview,
    Spacer,
    // E-commerce blokken via condition:
    ProductGrid,    // alleen als client e-commerce heeft
    CategoryGrid,
    SearchBar,
    QuickOrder,
    TopBar,
    Breadcrumb,
    ProductFilters,
  ],
}
```

**Stap 2: Blok-labels verbeteren**

Elk blok heeft een `labels` property. Zorg dat ze Nederlandstalig en begrijpelijk zijn voor klanten zonder technische achtergrond.

**Stap 3: Live Preview**

Live preview is al geconfigureerd. Zorg dat het correct werkt voor editors:
```bash
# Test: open een pagina in de admin
# Klik op "Live Preview"
# Controleer dat de preview-URL correct is
# Controleer dat wijzigingen direct zichtbaar zijn
```

### TypeScript-check
```bash
npx tsc --noEmit
# Blok-configuraties zijn sterk getypeerd in Payload 3.x
# Elk nieuw blok moet BlockConfig implementeren
```

### Build-controle
```bash
npm run build 2>&1 | grep -E "error|warning"
# Verwacht: 0 errors, maximaal enkele deprecation warnings (acceptabel)
```

---

## Fase 7 — Template Beheer (gepland)
**Prioriteit:** Laag
**Geschatte tijd:** 3-5 dagen
**TypeScript risico:** Hoog

### Huidig probleem
Templates (`src/templates/index.ts`) zijn statische code-configuraties. Er is geen UI om:
- Van template te wisselen
- Een template te bekijken/previewen
- Templates te beheren

### Huidige templates
| Template | Beschrijving | Blokken |
|---|---|---|
| `ecommerce` | E-commerce Store | + ProductGrid, CategoryGrid, SearchBar, QuickOrder |
| `blog` | Blog & Magazine | Basis blokken |
| `b2b` | B2B Platform | + ProductGrid, QuickOrder |
| `portfolio` | Portfolio & Agency | + Cases, Services |
| `corporate` | Corporate Website | Basis blokken + Cases, Services |

### Implementatie plan

**Stap 1: Templates als Payload Global opslaan**

Maak een `ActiveTemplate` global die opslaat welk template actief is:
```typescript
// src/globals/ActiveTemplate.ts
export const ActiveTemplate: GlobalConfig = {
  slug: 'active-template',
  access: {
    read: () => true,
    update: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [{
    name: 'template',
    type: 'select',
    options: ['ecommerce', 'blog', 'b2b', 'portfolio', 'corporate'],
  }]
}
```

**Stap 2: Template-switcher UI**

Custom React component in de admin sidebar of dashboard die de actieve template toont en (voor admin) een knop biedt om te wisselen.

**Stap 3: Blokken dynamisch filteren op template**

Gebruik de actieve template om blokken in de Pages layout builder te filteren.

### TypeScript-controle
```bash
npx tsc --noEmit
# GlobalConfig type uit 'payload' moet correct gebruikt worden
# CustomServerComponent types voor admin UI componenten vereisen zorgvuldigheid
```

### Build-controle
```bash
npm run build
# Let op parse-errors in nieuwe Global configuraties
# Payload valideert het schema bij startup — fouten zijn direct zichtbaar
```

---

## Fase 8 — Multi-Tenant Architectuur (toekomst)
**Prioriteit:** Laag (maar strategisch cruciaal)
**Geschatte tijd:** 2-4 weken
**TypeScript risico:** Hoog

### Doel
Elke klant krijgt een volledig geïsoleerde Payload CMS instantie met eigen database, eigen admin URL en eigen gebruikers.

### Architectuur
```
CompassDigital Platform
├── Platform CMS (cms.compassdigital.nl)
│   ├── Clients collectie — beheert alle klant-instanties
│   └── Deployments collectie — deployment historie
│
├── Klant A (klant-a.compassdigital.nl/admin)
│   ├── Eigen Payload instantie
│   ├── Eigen PostgreSQL database
│   └── Eigen users (admin-rol voor klant A)
│
└── Klant B (klant-b.compassdigital.nl/admin)
    ├── Eigen Payload instantie
    └── ...
```

### Wat dit vereist
1. **Provisioning** — al geïmplementeerd (Ploi + Railway)
2. **Template seeding** — site generator doet dit al
3. **Per-klant auth** — elke instantie heeft eigen users tabel
4. **Monitoring** — health checks per instantie

### Build/TS overwegingen
- Payload 3.x ondersteunt multi-tenant via separate instanties (geen native multi-tenant)
- Elke klant-instantie is een zelfstandige Next.js/Payload deploy
- Geen cross-instantie TypeScript types nodig

---

## Lopende Technische Schuld

| Item | Risico | Fix |
|---|---|---|
| `Orders.ts` gebruikt inline `user?.roles?.includes('admin')` i.p.v. `checkRole()` | Laag (functioneel correct) | Refactor naar `checkRole(['admin'], user)` voor consistentie |
| `adminOrPublishedStatus` access-functie is gedefinieerd maar niet gebruikt | Laag | Verwijder of gebruik voor blog-posts |
| `.bak` bestanden in `src/lib/siteGenerator/` | Geen risico | Verwijder: `rm src/lib/siteGenerator/*.bak*` |
| Backup screenshots in root-directory | Geen risico | Verwijder en voeg toe aan `.gitignore` |

### Fix voor Orders.ts (optioneel, nu uitvoerbaar)
```typescript
// src/collections/Orders.ts
import { checkRole } from '../access/utilities'

// Vervang:
update: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
// Met:
update: ({ req: { user } }) => checkRole(['admin'], user),
```

---

## Verifiëren na elke fase

### Standaard verificatieroutine
```bash
# 1. TypeScript check (geen compilatiefouten)
npx tsc --noEmit

# 2. Lint check
npm run lint

# 3. Build check
npm run build

# 4. Start productie build lokaal
PORT=3020 npm run start

# 5. Handmatige tests
# - Log in als admin → controleer alles zichtbaar
# - Log in als editor → controleer alleen eigen content zichtbaar
# - Test API endpoints: GET /api/pages, GET /api/clients (moet 403 geven voor anoniem)
```

### Veelgemaakte fouten bij Payload 3.x development

**Fout 1: 'use client' vergeten**
```
Error: useState can only be used in a Client Component
```
Fix: voeg `'use client'` toe bovenaan je React component.

**Fout 2: Access-functie returnt altijd false**
```
// FOUT - user kan undefined zijn
read: ({ req: { user } }) => user.roles.includes('admin')

// GOED - gebruik checkRole die null-safe is
read: ({ req: { user } }) => checkRole(['admin'], user)
```

**Fout 3: Import pad verkeerd**
```
// FOUT
import { checkRole } from '@/access/utilities'  // werkt alleen in /src/collections/

// GOED voor /src/platform/collections/
import { checkRole } from '../../access/utilities'
```

**Fout 4: Payload schema-validatie bij start**
```
Error: Required field "slug" is missing
```
Fix: controleer het collection-config object volledig. Payload valideert bij server start.

**Fout 5: Database migratie niet bijgewerkt na schema-wijziging**
```bash
# Na toevoegen van een nieuw veld aan een collectie:
npx payload migrate:create
npx payload migrate
```

---

## Bestandsoverzicht

### Access Control (volledig in orde)
```
src/access/
├── utilities.ts          ← checkRole() helper (gebruik altijd dit)
├── adminOnly.ts          ← shorthand voor admin-only
├── adminOnlyFieldAccess.ts
├── adminOrPublishedStatus.ts  ← NIET IN GEBRUIK (kan verwijderd)
├── adminOrSelf.ts        ← voor users eigen profiel
├── isAdmin.ts
├── isDocumentOwner.ts    ← voor orders
└── publicAccess.ts
```

### Collections — compleet overzicht rollen
```
src/collections/
├── Pages/index.ts         admin+editor: full CRUD ✅
├── BlogPosts.ts           admin+editor: full CRUD ✅
├── FAQs.ts                admin+editor: full CRUD ✅
├── Media.ts               admin+editor: full CRUD ✅
├── Cases.ts               admin+editor: full CRUD ✅
├── Testimonials.ts        admin+editor: full CRUD ✅
├── ServicesCollection.ts  admin+editor: full CRUD ✅
├── Partners.ts            admin+editor: full CRUD ✅
├── Products.ts            admin+editor: CRU + admin: D ✅
├── Brands.ts              admin+editor: CRU + admin: D ✅
├── shop/
│   ├── ProductCategories.ts  admin+editor: full CRUD ✅
│   └── CustomerGroups.ts     admin+editor: full CRUD ✅
├── OrderLists.ts          users: eigen orders ✅
├── Orders.ts              users: eigen orders ✅
├── FormSubmissions.ts     admin only ✅
└── Users/index.ts         admin only + self ✅

src/platform/collections/
├── Clients.ts             admin only + verborgen voor editors ✅
└── Deployments.ts         admin only + verborgen voor editors ✅
```

### Globals — compleet overzicht rollen
```
src/globals/
├── Settings.ts    read: public | update: editor (meeste tabs) + admin (branding/seo/tracking) ✅
├── Theme.ts       read: public | update: admin+editor ✅
├── Header.ts      read: public | update: admin only ⚠️ (Fase 5: overweeg editor toegang)
└── Footer.ts      read: public | update: admin+editor ✅
```

---

## Prioriteiten samenvatting

| Fase | Onderwerp | Status | Impact | Tijd |
|---|---|---|---|---|
| 1 | Access control fixes | ✅ DONE | Kritiek | 2u |
| 2 | Editor volledige rechten | ✅ DONE | Hoog | 1u |
| 3 | Dashboard UX per rol | Gepland | Hoog | 1-2d |
| 4 | Sidebar cleanup per rol | Gepland | Hoog | 4-8u |
| 5 | Header beheer voor editors | Gepland | Middel | 4u |
| 6 | Page builder verbetering | Gepland | Middel | 2-3d |
| 7 | Template beheer UI | Gepland | Laag | 3-5d |
| 8 | Multi-tenant architectuur | Toekomst | Strategisch | 2-4w |

---

*Aangemaakt: 17 Februari 2026 — CompasDigital Admin Implementatieplan*
