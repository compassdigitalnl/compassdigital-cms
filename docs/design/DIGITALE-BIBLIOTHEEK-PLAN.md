# Digitale Bibliotheek — Implementatieplan

> **Status:** Planning
> **Datum:** 2026-03-08
> **Doel:** Abonnees toegang geven tot digitale tijdschriftedities via een beveiligde flipbook-viewer

---

## 1. Samenvatting

Abonnees op een digitaal tijdschriftabonnement krijgen toegang tot een "Mijn Bibliotheek" omgeving binnen hun account. Hier kunnen zij edities van hun tijdschrift(en) bekijken via een fraaie flipbook-interface met realistische bladeren-animatie. PDF's worden **niet** ter download aangeboden — pagina's worden server-side gerenderd als images met watermark.

### Twee Databronnen (Provider Architectuur)

| Route | Databron | Klanttype |
|-------|----------|-----------|
| **Interne Provider** | Payload CMS uploads + eigen PDF→image pipeline | Standaard publishing klanten |
| **THOR Provider** | THOR API voor edities, THOR CRM voor abonnees | Publishing klanten met THOR integratie |

De frontend (bibliotheek + viewer) is identiek voor beide — alleen de databron verschilt per tenant.

---

## 2. Architectuur

```
┌─────────────────────────────────────────────┐
│          Flipbook Viewer + Bibliotheek      │
│          (identieke UI voor beide)          │
└──────────────────┬──────────────────────────┘
                   │
         ┌─────────▼─────────┐
         │  Edition Provider  │
         │  (abstractielaag)  │
         └────┬──────────┬────┘
              │          │
     ┌────────▼──┐  ┌────▼────────┐
     │  Interne  │  │  THOR API   │
     │  Provider │  │  Provider   │
     │           │  │             │
     │ Payload   │  │ Edities via │
     │ uploads + │  │ THOR API    │
     │ PDF→image │  │ Abonnees    │
     │ pipeline  │  │ via THOR    │
     │           │  │ CRM         │
     └───────────┘  └─────────────┘
```

### Provider Interface

```typescript
interface EditionProvider {
  // Bibliotheek
  getSubscriptions(userId: string): Promise<DigitalSubscription[]>
  getAvailableMagazines(userId: string): Promise<MagazineSummary[]>
  getEditions(magazineId: string): Promise<Edition[]>

  // Viewer
  getPageCount(editionId: string): Promise<number>
  getPageImage(editionId: string, page: number, userId: string): Promise<ImageResponse>
  getTableOfContents(editionId: string): Promise<TOCEntry[]>

  // Voortgang
  saveReadingProgress(userId: string, editionId: string, page: number): Promise<void>
  getReadingProgress(userId: string, editionId: string): Promise<number | null>
  getRecentlyRead(userId: string): Promise<RecentRead[]>
}
```

### Provider Selectie

Per tenant geconfigureerd via `EcommerceSettings`:

```typescript
// Nieuw veld in EcommerceSettings
{
  digitalLibrary: {
    provider: 'internal' | 'thor',  // welke provider actief is
    thor: {
      apiUrl: string,               // THOR API endpoint
      apiKey: string,               // THOR API key
    }
  }
}
```

De API endpoints resolven automatisch de juiste provider op basis van de tenant-config.

---

## 3. Fasering

### Fase 1: Backend — Collection Uitbreiding + Provider Interface

#### 1.1 Magazines Collection Uitbreiden

Nieuwe velden toevoegen aan de `editions` array in `Magazines.ts`:

| Veld | Type | Doel |
|------|------|------|
| `digitalPdf` | upload (media) | De PDF van de editie (alleen bij interne provider) |
| `isDigital` | checkbox | Editie beschikbaar als digitaal |
| `pageCount` | number | Aantal pagina's (auto-berekend of via THOR) |
| `digitalAvailableFrom` | date | Wanneer digitaal beschikbaar |

**Migratie:** `ALTER TABLE magazines` — nieuwe kolommen in editions JSON array.

#### 1.2 Nieuwe Collection: `DigitalEditionPages` (Interne Provider)

Pre-rendered pagina-images per editie:

| Veld | Type | Doel |
|------|------|------|
| `magazine` | relationship → Magazines | Koppeling naar tijdschrift |
| `editionIndex` | number | Index in editions array |
| `pageNumber` | number | Paginanummer |
| `pageImage` | upload (media) | Gerenderde pagina als WebP |
| `thumbnail` | upload (media) | Thumbnail versie (voor overzicht) |
| `width` | number | Breedte in pixels |
| `height` | number | Hoogte in pixels |

#### 1.3 PDF Processing Pipeline (Interne Provider)

Payload `afterChange` hook op Magazines collectie:

1. Detecteer nieuwe/gewijzigde `digitalPdf` upload in een editie
2. Render elke PDF-pagina naar WebP via `pdf-lib` + `sharp`
3. Genereer thumbnails (300px breed)
4. Maak `DigitalEditionPages` records aan
5. Update `pageCount` op de editie

#### 1.4 SubscriptionPlans Uitbreiden

| Veld | Type | Doel |
|------|------|------|
| `type` | select | `print` / `digital` / `print_digital` |
| `allowsDigitalEditions` | checkbox | Toegang tot digitale bibliotheek |
| `digitalMagazines` | relationship → Magazines[] | Welke tijdschriften toegankelijk |

#### 1.5 Beveiligde API Endpoints

| Endpoint | Methode | Doel |
|----------|---------|------|
| `GET /api/library` | Auth | Overzicht: abonnementen + beschikbare tijdschriften |
| `GET /api/library/[magazineSlug]/editions` | Auth | Edities van een tijdschrift |
| `GET /api/library/[magazineSlug]/[editionNr]/pages` | Auth | Paginalijst (thumbnails) |
| `GET /api/library/[magazineSlug]/[editionNr]/page/[num]` | Auth | Enkele pagina-image (watermarked) |
| `POST /api/library/progress` | Auth | Leesvoortgang opslaan |
| `GET /api/library/recently-read` | Auth | Recent gelezen edities |

**Beveiligingslagen op elk endpoint:**

1. Authenticatie (session/JWT check)
2. Actief digitaal abonnement check (via provider)
3. Toegang tot specifiek tijdschrift check
4. Rate limiting (max 60 pagina-requests/minuut)
5. `Cache-Control: no-store, no-cache` headers

---

### Fase 2: Frontend — Flipbook Viewer

#### 2.1 Technologie

**`react-pageflip`** — lightweight React wrapper voor StPageFlip:
- Realistische pagina-omslaganimatie (CSS3 + Canvas)
- Touch/swipe support
- Responsive (single page mobiel, double page desktop)
- MIT licensed, ~15KB gzipped

#### 2.2 Viewer Component

```
┌──────────────────────────────────────────────────┐
│  ← Terug    Tijdschrift Naam — Editie #12    ⛶  │
│  ┌────────────────────┬────────────────────┐     │
│  │                    │                    │     │
│  │                    │                    │     │
│  │     Pagina 4       │     Pagina 5       │     │
│  │                    │                    │     │
│  │                    │                    │     │
│  │                    │                    │     │
│  └────────────────────┴────────────────────┘     │
│                                                   │
│  ◄ Vorige    ●●●○○○○○○○○○  4/48    Volgende ►   │
│                                                   │
│  [☰ Inhoud]  [🔖 Bladwijzer]  [⊕ Zoom]          │
└──────────────────────────────────────────────────┘
```

**Features:**
- Dubbele pagina weergave (desktop), enkele pagina (mobiel)
- Swipe-gestures op touch devices
- Toetsenbord navigatie (← → pijltjes)
- Pinch-to-zoom (mobiel) + scroll-zoom (desktop)
- Inhoudsopgave sidebar (indien beschikbaar)
- Bladwijzers (lokaal opgeslagen + server sync)
- Volledig scherm modus
- Lazy loading (volgende 2-4 pagina's prefetchen)
- Leesvoortgang auto-save (elke 10 seconden)

#### 2.3 Anti-Download Maatregelen

| Maatregel | Implementatie |
|-----------|---------------|
| **Geen PDF op client** | PDF wordt nooit naar browser gestuurd |
| **Image-only rendering** | Pagina's als WebP images via Canvas |
| **Server-side watermark** | Gebruikersnaam + e-mail subtiel in pagina-image gebakken (via Sharp) |
| **CSS bescherming** | `user-select: none`, `pointer-events` controle |
| **Context menu blokkade** | Rechtermuisklik uitgeschakeld op viewer area |
| **Drag prevention** | `draggable="false"` op alle images |
| **Canvas rendering** | Images gerenderd via `<canvas>` i.p.v. `<img>` (moeilijker te extracten) |
| **No-cache headers** | Pagina-images niet gecached door browser |

> **Noot:** 100% bescherming tegen screenshots is onmogelijk. Deze maatregelen maken het onpraktisch genoeg — vergelijkbaar met Issuu, Readly, Blendle en soortgelijke platforms.

---

### Fase 3: Mijn Bibliotheek UI

#### 3.1 Routes

| Route | Component | Doel |
|-------|-----------|------|
| `/account/bibliotheek` | `LibraryOverview` | Overzicht alle tijdschriften + recent gelezen |
| `/account/bibliotheek/[magazineSlug]` | `LibraryMagazine` | Edities van één tijdschrift |
| `/account/bibliotheek/[magazineSlug]/[editieNr]` | `FlipbookViewer` | De viewer |

#### 3.2 Bibliotheek Overzicht

```
┌─────────────────────────────────────────────────┐
│  Mijn Digitale Bibliotheek                      │
│                                                  │
│  ── Verder lezen ──                              │
│  ┌──────────────────────────────────────┐       │
│  │ [Cover]  Tijdschrift X — Editie #12  │       │
│  │          Pagina 23 van 48            │       │
│  │          [Verder lezen →]            │       │
│  └──────────────────────────────────────┘       │
│                                                  │
│  ── Mijn Tijdschriften ──                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Cover   │  │  Cover   │  │  Cover   │     │
│  │          │  │          │  │          │     │
│  │ Titel A  │  │ Titel B  │  │ Titel C  │     │
│  │ 12 ed.   │  │  8 ed.   │  │  4 ed.   │     │
│  │ [Bekijk] │  │ [Bekijk] │  │ [Bekijk] │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                  │
│  ── Nieuwste Edities ──                         │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│  │#12 │ │#11 │ │ #8 │ │#10 │ │ #7 │ │ #4 │   │
│  │ A  │ │ A  │ │ B  │ │ A  │ │ B  │ │ C  │   │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘   │
└─────────────────────────────────────────────────┘
```

#### 3.3 Editie Overzicht (per tijdschrift)

```
┌─────────────────────────────────────────────────┐
│  ← Bibliotheek    Tijdschrift Naam              │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Cover   │  │  Cover   │  │  Cover   │     │
│  │          │  │          │  │          │     │
│  │ #12      │  │ #11      │  │ #10      │     │
│  │ Mrt 2026 │  │ Feb 2026 │  │ Jan 2026 │     │
│  │ [Lezen]  │  │ [Lezen]  │  │ [Lezen]  │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ #9       │  │ #8       │  │ #7       │     │
│  │ Dec 2025 │  │ Nov 2025 │  │ Okt 2025 │     │
│  │ [Lezen]  │  │ [Lezen]  │  │ [Lezen]  │     │
│  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────┘
```

#### 3.4 Geen Abonnement — Upsell

Gebruikers zonder digitaal abonnement zien:

```
┌─────────────────────────────────────────────────┐
│  Digitale Bibliotheek                           │
│                                                  │
│  ┌───────────────────────────────────────┐      │
│  │  Je hebt nog geen digitaal abonnement │      │
│  │                                       │      │
│  │  Met een digitaal abonnement lees je  │      │
│  │  je favoriete tijdschriften overal    │      │
│  │  en altijd op je telefoon, tablet     │      │
│  │  of computer.                         │      │
│  │                                       │      │
│  │  [Bekijk abonnementen →]             │      │
│  └───────────────────────────────────────┘      │
└─────────────────────────────────────────────────┘
```

---

### Fase 4: Subscription Integratie

#### 4.1 Access Control Flow

```
Gebruiker opent /account/bibliotheek
  │
  ├─ Niet ingelogd → redirect /inloggen?redirect=/account/bibliotheek
  │
  ├─ Provider = 'internal'
  │   └─ Check UserSubscriptions
  │       ├─ Actief + allowsDigitalEditions → toon bibliotheek
  │       └─ Geen/inactief → toon upsell
  │
  └─ Provider = 'thor'
      └─ Check THOR CRM API
          ├─ Actief digitaal abonnement → toon edities van THOR
          └─ Geen/inactief → toon upsell
```

#### 4.2 THOR Provider Specifiek

| Aspect | Implementatie |
|--------|---------------|
| **Abonnement check** | THOR CRM API: ophalen actieve abonnementen voor gebruiker |
| **Tijdschriften** | THOR API: lijst van tijdschriften waar gebruiker toegang toe heeft |
| **Edities** | THOR API: edities per tijdschrift (met cover, metadata) |
| **Pagina-images** | THOR API levert PDF → eigen server rendert naar WebP + watermark |
| **Caching** | Gerenderde pagina-images cachen op server (Redis of filesystem) |
| **Sync** | Gebruiker-koppeling: Payload user → THOR abonnee-ID |

#### 4.3 Gebruiker-Koppeling (THOR)

Nieuw veld op Users collectie:

| Veld | Type | Doel |
|------|------|------|
| `thorSubscriberId` | text | THOR CRM abonnee-ID |

Koppeling kan via:
- Handmatig in admin panel
- Automatisch bij eerste login (e-mail match)
- Import script

---

### Fase 5: PWA (Progressive Web App) — Toekomstig

Na de webversie kan de bibliotheek als PWA installeerbaar worden gemaakt:

| Onderdeel | Implementatie |
|-----------|---------------|
| **Web App Manifest** | `manifest.json` met app naam, iconen, kleuren |
| **Service Worker** | Cache eerder gelezen edities voor offline gebruik |
| **Install prompt** | "Voeg toe aan beginscherm" banner |
| **Offline mode** | Eerder bekeken pagina's beschikbaar zonder internet |
| **Push notificaties** | Melding bij nieuwe editie beschikbaar |

---

## 4. Bestandsstructuur

```
src/
├── branches/
│   └── publishing/
│       ├── collections/
│       │   └── DigitalEditionPages.ts          ← NIEUW
│       ├── components/
│       │   └── library/
│       │       ├── LibraryOverview.tsx          ← NIEUW
│       │       ├── LibraryMagazineGrid.tsx      ← NIEUW
│       │       ├── LibraryEditionCard.tsx       ← NIEUW
│       │       ├── FlipbookViewer.tsx           ← NIEUW
│       │       ├── FlipbookToolbar.tsx          ← NIEUW
│       │       ├── FlipbookTableOfContents.tsx  ← NIEUW
│       │       ├── NoSubscriptionUpsell.tsx     ← NIEUW
│       │       └── RecentlyReadBanner.tsx       ← NIEUW
│       ├── providers/
│       │   ├── EditionProvider.ts               ← NIEUW (interface)
│       │   ├── InternalEditionProvider.ts       ← NIEUW
│       │   └── ThorEditionProvider.ts           ← NIEUW
│       ├── hooks/
│       │   ├── useLibrary.ts                    ← NIEUW
│       │   ├── useFlipbook.ts                   ← NIEUW
│       │   └── useReadingProgress.ts            ← NIEUW
│       └── utils/
│           ├── pdfToImages.ts                   ← NIEUW
│           └── watermark.ts                     ← NIEUW
│
├── app/
│   ├── (ecommerce)/
│   │   └── account/
│   │       └── bibliotheek/
│   │           ├── page.tsx                     ← NIEUW
│   │           ├── [magazineSlug]/
│   │           │   ├── page.tsx                 ← NIEUW
│   │           │   └── [editieNr]/
│   │           │       └── page.tsx             ← NIEUW (viewer)
│   └── api/
│       └── library/
│           ├── route.ts                         ← NIEUW
│           ├── [magazineSlug]/
│           │   └── editions/
│           │       └── route.ts                 ← NIEUW
│           ├── page-image/
│           │   └── route.ts                     ← NIEUW
│           └── progress/
│               └── route.ts                     ← NIEUW
│
└── migrations/
    └── 2026XXXX_add_digital_library.ts          ← NIEUW
```

---

## 5. Dependencies

| Package | Doel | Grootte |
|---------|------|---------|
| `react-pageflip` | Flipbook component met page-turn animatie | ~15KB |
| `pdf-lib` | PDF parsing (pagina-extractie) | ~200KB (server-only) |
| `sharp` | Image processing + watermark | Al geïnstalleerd |

---

## 6. Investering

> **Uurtarief:** € 100,- (excl. BTW) — gezamenlijke effort met AI
>
> **Noot:** De digitale bibliotheek is onderdeel van het all-inclusive Publishing pakket (€79/mo).
> De investering hieronder betreft de eenmalige **bouwkosten** om deze feature in het platform te realiseren.

### Fase 1-4: Webversie (excl. THOR)

| Fase | Onderdeel | Uren | Investering |
|------|-----------|------|-------------|
| **1** | Magazines collection uitbreiden + migratie | 2-3 | € 200 - € 300 |
| **1** | DigitalEditionPages collection + migratie | 1-2 | € 100 - € 200 |
| **1** | Provider interface (abstractielaag) | 2-3 | € 200 - € 300 |
| **1** | InternalProvider + PDF→image pipeline | 4-6 | € 400 - € 600 |
| **1** | Beveiligde API endpoints + watermark | 3-4 | € 300 - € 400 |
| **2** | FlipbookViewer component (react-pageflip) | 4-6 | € 400 - € 600 |
| **2** | Anti-download maatregelen | 2-3 | € 200 - € 300 |
| **2** | Responsive design (desktop + mobiel + touch) | 2-3 | € 200 - € 300 |
| **3** | Bibliotheek overzicht pagina | 2-3 | € 200 - € 300 |
| **3** | Editie overzicht per tijdschrift | 1-2 | € 100 - € 200 |
| **3** | Leesvoortgang + bladwijzers | 2-3 | € 200 - € 300 |
| **3** | Upsell component (geen abonnement) | 1 | € 100 |
| **4** | SubscriptionPlans uitbreiding + migratie | 2-3 | € 200 - € 300 |
| **4** | Access control integratie | 2-3 | € 200 - € 300 |
| **—** | Testing, bugfixes, deploy | 4-6 | € 400 - € 600 |
| | **Subtotaal webversie** | **~30-45 uur** | **€ 3.000 - € 4.500** |

### Fase 5: PWA (optioneel)

| Onderdeel | Uren | Investering |
|-----------|------|-------------|
| PWA (manifest + service worker + offline) | 8-12 | € 800 - € 1.200 |
| **Totaal incl. PWA** | **~38-57 uur** | **€ 3.800 - € 5.700** |

### Later: THOR API Integratie

| Onderdeel | Uren | Investering |
|-----------|------|-------------|
| ThorProvider (THOR API integratie) | 6-10 | € 600 - € 1.000 |
| THOR CRM gebruiker-koppeling | 2-3 | € 200 - € 300 |
| **Subtotaal THOR** | **~8-13 uur** | **€ 800 - € 1.300** |

> THOR integratie wordt op een later moment opgepakt wanneer de API specs beschikbaar zijn.

### Samenvatting

| Scope | Uren | Investering |
|-------|------|-------------|
| Webversie (Fase 1-4) | 30-45 uur | **€ 3.000 - € 4.500** |
| + PWA (Fase 5) | 38-57 uur | **€ 3.800 - € 5.700** |
| + THOR (later) | 46-70 uur | **€ 4.600 - € 7.000** |

### Klant-perspectief (Publishing pakket)

| | Prijs |
|---|---|
| **Setup** (eenmalig, incl. bibliotheek) | €3.000 - €5.000 |
| **Licentie** (maandelijks, all-inclusive) | €79/mo |
| **Jaar 1 totaal** | €3.948 - €5.948 |
| **Jaar 2+** | €948/jaar |

---

## 7. App (Roadmap)

### Optie A: PWA — Aanbevolen als eerste stap

- +8-12 uur bovenop de webversie (Fase 5)
- Installeerbaar op telefoon via "Voeg toe aan beginscherm"
- Offline lezen van eerder bekeken edities
- Push notificaties bij nieuwe editie
- Geen App Store nodig

### Optie B: Native App (React Native / Expo) — Later op roadmap

- +80-120 uur (met AI) — apart project
- App Store aanwezigheid (iOS + Android)
- Betere offline support + native gestures
- Communiceert met dezelfde Payload CMS REST API (multi-tenant compatible)
- Apple/Google review proces
- Apart onderhoud + updates

**Aanbeveling:** Start met PWA. De API-laag die voor de webversie wordt gebouwd is 1-op-1 herbruikbaar voor een native app. Pas overwegen als App Store aanwezigheid commercieel belangrijk wordt.

---

## 8. Risico's & Aandachtspunten

| Risico | Mitigatie |
|--------|-----------|
| THOR API documentatie onbekend | Vroeg in Fase 1b API specs opvragen |
| PDF rendering performance | Server-side pre-rendering + caching |
| Grote PDF's (100+ pagina's) | Lazy loading, pagina's on-demand renderen |
| Storage kosten (images) | WebP compressie, thumbnails apart, cleanup policy |
| Screenshot-sharing | Watermark met gebruikersinfo (ontmoedigend, niet blokkerend) |
| THOR CRM gebruiker-matching | Fallback op e-mail match + handmatige koppeling in admin |
