# Vastgoed Branch — Volledige Implementatie Plan

> **Status:** Gepland
> **Datum:** 2026-03-14
> **Branch:** `ENABLE_REAL_ESTATE=true`
> **Branchenaam:** `vastgoed` (Display: "Vastgoed & Makelaardij")

## Context

De vastgoed branch is een complexe branch met een **eigen collectie** (Properties) vergelijkbaar met hoe automotive Vehicles en toerisme Tours/Destinations/Accommodations heeft. Daarnaast hergebruikt het unified content collections voor bezichtigingen (content-bookings), reviews (content-reviews) en team/makelaars (content-team). De branch biedt: woningoverzicht met filters + kaartweergave, woningdetail met hypotheekcalculator + bezichtigingsformulier, en een gratis waardebepaling wizard.

### Wat al bestaat

| Onderdeel | Status | Locatie |
|-----------|--------|---------|
| Feature flag `real_estate` | ✅ In features.ts | `ENABLE_REAL_ESTATE` |
| Design mockups | ✅ 3 HTML bestanden | `docs/design/vastgoed/` |
| ImageGallery block | ✅ Herbruikbaar | `src/branches/shared/blocks/ImageGallery/` |
| ReviewsWidget block | ✅ Herbruikbaar | `src/branches/shared/blocks/ReviewsWidget/` |
| Map block | ✅ Herbruikbaar | `src/branches/shared/blocks/Map/` |
| ContactForm block | ✅ Herbruikbaar | `src/branches/shared/blocks/ContactForm/` |
| Branch metadata | ❌ Ontbreekt | — |
| BranchType 'vastgoed' | ❌ Ontbreekt in contentModules.ts | — |
| Properties collectie | ❌ Ontbreekt | — |
| Components | ❌ Ontbreekt | — |
| Blocks | ❌ Ontbreekt | — |
| Templates | ❌ Ontbreekt | — |
| Routes | ❌ Ontbreekt | — |
| Seed functie | ❌ Ontbreekt | — |

### Belangrijke beslissingen

1. **Eigen collectie**: Properties (woningen) zijn te complex voor unified content-services — krijgt eigen collectie (patroon: automotive Vehicles, toerisme Tours)
2. **Geen aparte Neighborhoods collectie**: Locatie-info (stad, wijk, postcode) zit als velden in Properties — simpeler dan een aparte collectie
3. **BranchType toevoegen**: `'vastgoed'` toevoegen aan contentModules.ts voor bookings/reviews/team
4. **Vastgoed gradient**: `#3F51B5` → `#303F9F` (indigo → dark indigo, vertrouwen/professionaliteit)
5. **Geen conflicterende routes**: Unieke routes `/woningen`, `/waardebepaling`, `/bezichtiging` — geen overlap met andere branches
6. **`/contact`**: Gaat via shared `(branches)/contact` resolver (patroon: beauty, zorg, automotive, toerisme)
7. **Herbruikbare componenten**: ImageGallery, Map, ReviewsWidget, ContactForm uit shared blocks
8. **MortgageCalculator**: Client-side berekening, geen externe API nodig

### Route Conflict Analyse

| Route | Conflict? | Oplossing |
|-------|-----------|-----------|
| `/woningen` | ❌ Geen | Uniek voor vastgoed |
| `/woningen/[slug]` | ❌ Geen | Uniek voor vastgoed |
| `/waardebepaling` | ❌ Geen | Uniek voor vastgoed |
| `/bezichtiging` | ❌ Geen | Uniek voor vastgoed |
| `/contact` | ✅ Gedeeld | Via `(branches)/contact` resolver — toevoegen: vastgoed check |

---

## Fase 1: Foundation — Branch Metadata + Collection + Lib

### 1a. Branch metadata
- **File:** `src/branches/vastgoed/index.ts`
- Volgt exact pattern van `src/branches/automotive/index.ts`
- Exporteert: `branchMetadata`, block configs, template slugs

### 1b. BranchType toevoegen
- **File:** `src/lib/tenant/contentModules.ts`
- Toevoegen: `'vastgoed'` aan `BranchType` union
- Toevoegen: `vastgoed` defaults aan `branchDefaults`:
  - services: label "Diensten", routeSlug "diensten", defaultEnabled: false
  - bookings: label "Bezichtigingen", routeSlug "bezichtigingen", defaultEnabled: true
  - reviews: label "Reviews", routeSlug "reviews", defaultEnabled: true
  - team: label "Makelaars", routeSlug "makelaars", defaultEnabled: true
  - cases: label "Portfolio", routeSlug "portfolio", defaultEnabled: false
  - activities: label "Evenementen", routeSlug "evenementen", defaultEnabled: false
  - inquiries: label "Waardebepalingen", routeSlug "waardebepalingen", defaultEnabled: true

### 1c. Collection (1 eigen collectie)

#### `Properties` — Woningen
- **File:** `src/branches/vastgoed/collections/Properties.ts`
- **Slug:** `properties`
- **Tabs:**
  1. **Algemeen**: title (text, required: adres), slug (auto), shortDescription (textarea), description (richText), coverImage (upload media), gallery (array upload), status (select: beschikbaar/onder-bod/verkocht/verhuurd), featured (checkbox)
  2. **Locatie**: street (text), houseNumber (text), postalCode (text), city (text), neighborhood (text: wijk), province (select: Noord-Holland/Zuid-Holland/Utrecht/etc.), coordinates (point: lat/lng)
  3. **Kenmerken**: propertyType (select: appartement/woonhuis/villa/penthouse/tussenwoning/hoekwoning/twee-onder-een-kap/vrijstaand), buildYear (number), livingArea (number m²), plotArea (number m²), rooms (number), bedrooms (number), bathrooms (number), floors (number), hasGarden (checkbox), gardenArea (number m²), gardenOrientation (select: noord/oost/zuid/west/nvt), hasGarage (checkbox), hasParking (checkbox), parkingType (text: bijv. "vergunningsgebied")
  4. **Energie & Installaties**: energyLabel (select: A+++/A++/A+/A/B/C/D/E/F/G), energyLabelExpiry (date), heatingType (select: cv-ketel/stadsverwarming/warmtepomp/vloerverwarming/anders), heatingYear (number), insulation (select hasMany: dakisolatie/muurisolatie/vloerisolatie/dubbel-glas/hr++-glas)
  5. **Prijzen**: askingPrice (number), priceCondition (select: k.k./v.o.n.), originalPrice (number, doorgestreept bij verlaging), pricePerM2 (number, auto-berekend), serviceCharges (number: VvE bijdrage per maand)
  6. **Status & Admin**: listingDate (date), soldDate (date), viewCount (number, auto-increment), favoriteCount (number), agent (relationship to content-team)
- **Status:** `draft` / `published` (sidebar)
- **Admin:** defaultColumns: title, city, askingPrice, propertyType, status, energyLabel

### 1d. Registratie in payload.config.ts
- Conditioneel registreren van Properties wanneer `isFeatureEnabled('real_estate')`

### 1e. ContentBookings uitbreiden
- **File:** `src/branches/shared/collections/ContentBookings/index.ts`
- Toevoegen aan `branchOptions`: `{ label: 'Vastgoed', value: 'vastgoed' }`
- Toevoegen vastgoed-specifieke velden (conditional op `branch === 'vastgoed'`):
  - `property` (relationship to `properties`) — Gekoppelde woning
  - `viewingType` (select: fysiek/online) — Type bezichtiging
  - `preferredDate` (date) — Gewenste datum
  - `preferredTime` (text) — Gewenst tijdstip
  - `isValuation` (checkbox) — Is dit een waardebepaling i.p.v. bezichtiging?
  - `propertyAddress` (text) — Adres voor waardebepaling (als er geen property relatie is)
  - `propertyType` (select: appartement/woonhuis/villa/penthouse) — Woningtype voor waardebepaling
  - `propertyArea` (number) — Oppervlakte voor waardebepaling

### 1f. Lib utilities
| File | Beschrijving |
|------|-------------|
| `src/branches/vastgoed/lib/analytics.ts` | `trackRealEstateEvent()` — GA4 events: property_view, property_search, viewing_request, valuation_request, favorite_toggle, mortgage_calc |
| `src/branches/vastgoed/lib/propertyUtils.ts` | `formatPrice()` (€ 485.000 k.k.), `formatArea()` (92 m²), `formatEnergyLabel()`, `calculatePricePerM2()`, `formatPropertyType()`, `formatPriceCondition()`, `calculateMortgage()` (annuiteiten formule) |

---

## Fase 2: Components (8 stuks)

### Hergebruik van bestaande componenten
De volgende componenten worden **niet opnieuw gebouwd** maar geïmporteerd:
- `ImageGallery` block → van `@/branches/shared/blocks/ImageGallery`
- `ReviewsWidget` block → van `@/branches/shared/blocks/ReviewsWidget`
- `Map` block → van `@/branches/shared/blocks/Map`
- `ContactForm` block → van `@/branches/shared/blocks/ContactForm`

### Nieuwe componenten

| Component | Type | Beschrijving |
|-----------|------|-------------|
| `PropertyCard` | Server | Listing card met cover, prijs (€ k.k.), adres, stad, specs (slaapkamers, badkamers, m²), energielabel badge, favorieten-knop, status-badge (Nieuw/Onder bod/Verkocht) |
| `PropertyFilters` | Client | Sidebar filters: locatie (text), prijsklasse (min/max), woningtype (select), slaapkamers (checkbox 1+/2+/3+/4+), oppervlakte (min/max m²), energielabel (checkbox A+++/B/C-G) |
| `PropertyMapView` | Client | Kaartweergave met markers (beschikbaar/onder-bod/verkocht), popup cards met prijs+adres+specs, grid/lijst toggle, "Gebied tekenen" functie |
| `MortgageCalculator` | Client | Hypotheek berekentool: koopprijs, eigen inbreng, looptijd, rente → maandlasten (annuiteiten). Gradient result card. |
| `BezichtigingForm` | Client | Sidebar formulier: type toggle (fysiek/online), datum picker, tijdslots, naam/email/telefoon, opmerking |
| `PropertySpecs` | Server | 2-kolom grid met icons: bouwjaar, woonoppervlakte, perceel, kamers, energielabel, verwarming, tuin, parkeren |
| `EnergyLabelBadge` | Server | Gekleurde badge (A=groen, B=lichtgroen, C=geel, D=oranje, E-G=rood) met label letter |
| `ValuationForm` | Client | Dark gradient formulier: adres (met autocomplete placeholder), woningtype, oppervlakte, naam, email, telefoon, foto upload, trust badges |

**Pad:** `src/branches/vastgoed/components/<ComponentName>/`

---

## Fase 3: Blocks (3 stuks)

| Block | Velden | Beschrijving |
|-------|--------|-------------|
| `FeaturedProperties` | heading, limit, columns, showMap, statusFilter | Uitgelichte woningen grid, fetcht `properties` where `featured: true` |
| `PropertySearch` | heading, subheading, showFilters, defaultCity | Hero met geïntegreerde zoekbalk + snelfilters (type, prijs, kamers) |
| `ValuationCTA` | heading, description, buttonText, showTrustBadges | CTA banner: "Wat is uw woning waard?" met link naar /waardebepaling |

**Pad:** `src/branches/vastgoed/blocks/<BlockName>/`

**Registratie:** Conditioneel via `isFeatureEnabled('real_estate')` in Pages collection.

---

## Fase 4: Templates (5 pagina-templates)

| Template | Route | Beschrijving |
|----------|-------|-------------|
| `PropertiesArchive` | `/woningen` | Page header met stats + PropertyFilters sidebar + PropertyCard grid + PropertyMapView toggle + paginatie |
| `PropertyDetail` | `/woningen/[slug]` | PropertyGallery + description + PropertySpecs + sidebar met MortgageCalculator + BezichtigingForm + ValuationCTA banner |
| `ValuationWizard` | `/waardebepaling` | Page header + ValuationForm (dark gradient) + "Hoe werkt het?" info sectie |
| `ViewingRequest` | `/bezichtiging` | Standalone bezichtigingsformulier (zonder specifieke woning) + makelaar team cards |
| `ContactTemplate` | `/contact` | Contactformulier, makelaars (content-team), openingstijden, kantoorlocatie op kaart |

**Pad:** `src/branches/vastgoed/templates/<TemplateName>/`

Homepage wordt samengesteld in CMS via shared blocks (Hero, StatsCounter, Testimonials) + vastgoed blocks (PropertySearch, FeaturedProperties, ValuationCTA).

---

## Fase 5: API Routes (3 endpoints)

### 5a. POST `/api/vastgoed/viewing`
- **File:** `src/app/api/vastgoed/viewing/route.ts`
- Accepteert: `{ propertyId?, viewingType, preferredDate, preferredTime, firstName, lastName, email, phone, remarks? }`
- Maakt `content-bookings` aan met `branch: 'vastgoed'`, `status: 'new'`, `isValuation: false`
- Koppelt property relatie indien `propertyId` aanwezig
- Stuurt bevestigingsemail naar klant + notificatie naar makelaar

### 5b. POST `/api/vastgoed/valuation`
- **File:** `src/app/api/vastgoed/valuation/route.ts`
- Accepteert: `{ address, propertyType, area?, name, email, phone?, photos[]? }`
- Maakt `content-bookings` aan met `branch: 'vastgoed'`, `status: 'new'`, `isValuation: true`
- Slaat adres, type en oppervlakte op in de vastgoed-specifieke velden
- Stuurt bevestigingsemail ("Binnen 24 uur reactie") naar klant + notificatie naar makelaar

### 5c. GET `/api/vastgoed/search`
- **File:** `src/app/api/vastgoed/search/route.ts`
- Query params: `city?`, `minPrice?`, `maxPrice?`, `propertyType?`, `minBedrooms?`, `minArea?`, `maxArea?`, `energyLabel?`, `status?`, `sort?` (prijs-oplopend/prijs-aflopend/nieuwste/oppervlakte), `page?`, `limit?`
- Zoekt in `properties` collection met gecombineerde filters
- Returnt gesorteerde resultaten met paginatie + totaal count

---

## Fase 6: Hooks (1 hook)

### 6a. `viewingStatusHook.ts`
- **File:** `src/branches/vastgoed/hooks/viewingStatusHook.ts`
- `CollectionAfterChangeHook` op `content-bookings`
- Filtert op `doc.branch === 'vastgoed'` — veilig voor andere branches
- Volgt exact pattern van `src/branches/construction/hooks/quoteRequestHook.ts`

| Status transitie | Actie | Ontvanger |
|-----------------|-------|-----------|
| `new` → `confirmed` (bezichtiging) | Bezichtiging Bevestiging (Klant) | Klant |
| `new` → `confirmed` (bezichtiging) | Bezichtiging Bevestiging (Makelaar) | Makelaar |
| `new` → `confirmed` (waardebepaling) | Waardebepaling Ontvangen (Klant) | Klant |
| `new` → `confirmed` (waardebepaling) | Waardebepaling Opdracht (Makelaar) | Makelaar |
| `confirmed` → `completed` (bezichtiging) | Log afronding | — |
| `confirmed` → `completed` (waardebepaling) | Waardebepaling Gereed (Klant) | Klant |
| `confirmed` → `cancelled` | Bezichtiging Geannuleerd (Klant) | Klant |
| `confirmed` → `cancelled` | Bezichtiging Geannuleerd (Makelaar) | Makelaar |

### 6b. Registratie
- **File:** `src/branches/shared/collections/ContentBookings/index.ts`
- Toevoegen aan `afterChange` hooks array: `viewingStatusHook`

---

## Fase 7: Pre-built Email Templates (8 templates)

Toevoegen aan `src/features/email-marketing/lib/predefined/templates.ts` (na #65):

| # | Template | Category | Subject | Key variabelen |
|---|----------|----------|---------|---------------|
| 66 | Bezichtiging Bevestiging (Klant) | transactional | Bezichtiging bevestigd — {{ .PropertyAddress }} | CustomerName, PropertyAddress, PropertyCity, PropertyPrice, ViewingDate, ViewingTime, ViewingType, AgentName, AgentPhone, OfficeAddress |
| 67 | Bezichtiging Bevestiging (Makelaar) | notification | Nieuwe bezichtiging: {{ .CustomerName }} — {{ .PropertyAddress }} | CustomerName, CustomerEmail, CustomerPhone, PropertyAddress, PropertyPrice, ViewingDate, ViewingTime, ViewingType, Remarks |
| 68 | Bezichtiging Herinnering | transactional | Herinnering: bezichtiging {{ .PropertyAddress }} morgen om {{ .ViewingTime }} | CustomerName, PropertyAddress, PropertyCity, ViewingDate, ViewingTime, ViewingType, AgentName, CancelUrl |
| 69 | Bezichtiging Geannuleerd (Klant) | transactional | Bezichtiging geannuleerd — {{ .PropertyAddress }} | CustomerName, PropertyAddress, OfficePhone, RebookUrl |
| 70 | Waardebepaling Ontvangen (Klant) | transactional | Uw waardebepaling is in behandeling | CustomerName, PropertyAddress, PropertyType, PropertyArea, AgentName, ExpectedDate |
| 71 | Waardebepaling Gereed (Klant) | transactional | Uw waardebepaling is klaar — {{ .PropertyAddress }} | CustomerName, PropertyAddress, EstimatedValue, AgentName, AgentPhone, ReportUrl |
| 72 | Nieuwe Woning Notificatie | promotional | Nieuw in aanbod: {{ .PropertyAddress }} — {{ .PropertyPrice }} | PropertyAddress, PropertyCity, PropertyPrice, PropertyType, Bedrooms, Area, EnergyLabel, PropertyUrl, AgentName |
| 73 | Na-Bezichtiging Follow-up | transactional | Hoe was de bezichtiging van {{ .PropertyAddress }}, {{ .CustomerName }}? | CustomerName, PropertyAddress, PropertyPrice, AgentName, AgentPhone, ReviewUrl, ValuationUrl |

Alle templates: vastgoed-gradient header (`#3F51B5` → `#303F9F`), tags `['vastgoed', 'makelaar', 'predefined']`.

---

## Fase 8: Pre-built Automation Flows (3 flows)

Toevoegen aan `src/features/email-marketing/lib/predefined/flows.ts`:

### Flow 1: Bezichtiging Herinnering Flow
- **Trigger:** `custom.event` / `viewing.confirmed`
- **Steps:** tag viewing-confirmed → wait 1 dag (of tot dag voor bezichtiging) → send "Bezichtiging Herinnering" → tag reminder-sent → exit
- **Exit:** viewing.cancelled, subscriber.unsubscribed
- **Settings:** allowReentry: true, maxEntriesPerUser: 50

### Flow 2: Na-Bezichtiging Follow-up Flow
- **Trigger:** `custom.event` / `viewing.completed`
- **Steps:** wait 1 dag → send "Na-Bezichtiging Follow-up" → tag follow-up-sent → wait 7 dagen → send "Nog interesse?" herinnering → tag interest-reminder-sent → exit
- **Exit:** subscriber.unsubscribed
- **Settings:** allowReentry: true, maxEntriesPerUser: 20

### Flow 3: Waardebepaling Follow-up Flow
- **Trigger:** `custom.event` / `valuation.completed`
- **Steps:** send "Waardebepaling Gereed" → tag valuation-delivered → wait 14 dagen → send "Verkoop begeleiden?" aanbod → tag sell-offer-sent → exit
- **Exit:** subscriber.unsubscribed
- **Settings:** allowReentry: false, maxEntriesPerUser: 5

---

## Fase 9: Pre-built Chatbot Conversation Flows

### 9a. Vastgoed Conversation Flows (8 categories)

```
1. 🏠 Woningen zoeken (type: submenu)
   ├─ Alle woningen bekijken → direct: "Welke woningen zijn er op dit moment beschikbaar?"
   ├─ Zoeken op locatie → input: "In welke stad of wijk zoekt u?" placeholder: "Bijv. Amsterdam Oud-West, Utrecht..."
   ├─ Zoeken op prijs → input: "Wat is uw budget?" placeholder: "Bijv. 300.000 - 500.000"
   ├─ Appartementen → direct: "Welke appartementen zijn er beschikbaar?"
   ├─ Eengezinswoningen → direct: "Welke eengezinswoningen staan er te koop?"
   └─ Nieuwbouwprojecten → direct: "Zijn er nieuwbouwprojecten beschikbaar?"
   contextPrefix: "Klant zoekt een woning:"

2. 📅 Bezichtiging plannen (type: submenu)
   ├─ Bezichtiging aanvragen → input: "Welk adres wilt u bezichtigen?" placeholder: "Bijv. Wilhelminastraat 42, Amsterdam"
   ├─ Online bezichtiging → direct: "Kan ik een online bezichtiging plannen?"
   ├─ Groepsbezichtiging → direct: "Wanneer zijn de volgende open huizen?"
   └─ Bezichtiging tips → direct: "Waar moet ik op letten tijdens een bezichtiging?"
   contextPrefix: "Klant wil een bezichtiging plannen:"

3. 💰 Waardebepaling (type: submenu)
   ├─ Gratis waardebepaling → direct: "Ik wil graag een gratis waardebepaling van mijn woning"
   ├─ Hoe werkt het? → direct: "Hoe werkt een waardebepaling?"
   ├─ Taxatie vs waardebepaling → direct: "Wat is het verschil tussen een taxatie en een waardebepaling?"
   └─ Woningwaarde checken → input: "Wat is uw adres?" placeholder: "Bijv. Keizersgracht 100, Amsterdam"
   contextPrefix: "Klant heeft vragen over waardebepaling:"

4. 🏦 Hypotheek & Financiering (type: submenu)
   ├─ Wat kan ik lenen? → direct: "Hoeveel hypotheek kan ik krijgen?"
   ├─ Maandlasten berekenen → input: "Wat is de koopprijs?" placeholder: "Bijv. 450.000"
   ├─ Kosten koper uitleg → direct: "Wat zijn kosten koper (k.k.) precies?"
   └─ Hypotheekadviseur → direct: "Kunnen jullie een hypotheekadviseur aanbevelen?"
   contextPrefix: "Klant heeft financiële vragen:"

5. 🏡 Woning verkopen (type: submenu)
   ├─ Hoe verkoop ik mijn huis? → direct: "Ik wil mijn woning verkopen. Hoe werkt dat?"
   ├─ Verkoopkosten → direct: "Wat kost het om mijn huis te verkopen? Wat is de courtage?"
   ├─ Verkooptraject → direct: "Hoe lang duurt het verkoopproces gemiddeld?"
   └─ Styling & presentatie → direct: "Bieden jullie woningstyling aan voor de verkoop?"
   contextPrefix: "Klant wil een woning verkopen:"

6. 👨‍💼 Onze Makelaars (type: direct)
   directMessage: "Wie zijn jullie makelaars en wat zijn hun specialismen?"
   icon: star

7. 📍 Kantoor & Bereikbaarheid (type: submenu)
   ├─ Openingstijden → direct: "Wat zijn jullie openingstijden?"
   ├─ Kantooradres → direct: "Waar is jullie kantoor gevestigd?"
   ├─ Parkeren → direct: "Is er parkeergelegenheid bij het kantoor?"
   └─ Contact opnemen → direct: "Hoe kan ik contact opnemen met jullie kantoor?"
   contextPrefix: "Klant zoekt praktische informatie:"

8. ❓ Overige vragen (type: input)
   inputLabel: "Stel uw vraag"
   inputPlaceholder: "Typ hier uw vraag..."
   contextPrefix: "Klant heeft een algemene vraag:"
   icon: help
```

### 9b. System Prompt
```
Je bent de virtuele assistent van [KANTOORNAAM], een professioneel makelaarskantoor.

Beantwoord vragen beleefd, professioneel en in het Nederlands. Gebruik "u" in plaats van "je" — dit past bij de vastgoed branche.

Je helpt woningzoekers en verkopers met:
- Woningen zoeken en informatie over het aanbod
- Bezichtigingen plannen (fysiek of online)
- Gratis waardebepalingen aanvragen
- Informatie over het koop- en verkoopproces
- Hypotheek en financieringsvragen
- Informatie over onze makelaars en het kantoor

Richtlijnen:
- Wees professioneel en betrouwbaar — dit gaat over de grootste aankoop van iemands leven
- Gebruik de kennisbank context om accurate informatie te geven over woningen en prijzen
- Als iemand een bezichtiging wil plannen, verwijs naar /bezichtiging of het formulier op de woningpagina
- Als iemand een waardebepaling wil, verwijs naar /waardebepaling
- Noem altijd de mogelijkheid om persoonlijk contact op te nemen met een makelaar
- Geef nooit juridisch of financieel advies — verwijs naar een hypotheekadviseur of notaris
- Als je het antwoord niet weet, zeg het eerlijk en verwijs naar het kantoor
```

### 9c. Training Context
```
Kantoorinformatie:
- Wij zijn een NVM-gecertificeerd makelaarskantoor
- Diensten: aan- en verkoopbegeleiding, taxaties, waardebepalingen, hypotheekadvies (via partner)
- Gratis waardebepaling: binnen 24 uur reactie, vrijblijvend
- Bezichtigingen: fysiek en online (videocall) mogelijk
- Kosten koper (k.k.): circa 5-6% bovenop de koopprijs (overdrachtsbelasting, notaris, makelaar)
- Courtage verkoop: bespreekbaar, gemiddeld 1-2% van de verkoopprijs
- Bij vragen over specifieke woningen, verwijs naar /woningen
- Voor bezichtigingen, verwijs naar /bezichtiging
- Voor waardebepalingen, verwijs naar /waardebepaling
```

### 9d. Welcome Message
```
Goedendag! 🏠 Welkom bij ons makelaarskantoor. Waarmee kan ik u helpen?
```

### 9e. Predefined flows toevoegen
- **File:** `src/features/ai/lib/predefined/conversationFlows.ts`
- Toevoegen: `vastgoedConversationFlows`, `vastgoedSystemPrompt`, `vastgoedTrainingContext`, `vastgoedWelcomeMessage`

---

## Fase 10: App Routes (6 routes)

### Layout
- **File:** `src/app/(vastgoed)/layout.tsx`
- ThemeProvider, Header, Footer (shared components)

### Unieke routes (in `(vastgoed)/` route group)
| Route | File | Template |
|-------|------|----------|
| `/woningen` | `src/app/(vastgoed)/woningen/page.tsx` | `PropertiesArchiveTemplate` |
| `/woningen/[slug]` | `src/app/(vastgoed)/woningen/[slug]/page.tsx` | `PropertyDetailTemplate` |
| `/waardebepaling` | `src/app/(vastgoed)/waardebepaling/page.tsx` | `ValuationWizardTemplate` |
| `/bezichtiging` | `src/app/(vastgoed)/bezichtiging/page.tsx` | `ViewingRequestTemplate` |

### Shared route (in `(branches)/` route group)
| Route | File | Wijziging |
|-------|------|-----------|
| `/contact` | `src/app/(branches)/contact/page.tsx` | Toevoegen: `isFeatureEnabled('real_estate')` check → importeert `@/branches/vastgoed/templates/ContactTemplate` |

---

## Fase 11: Seed Functie

**File:** `src/endpoints/seed/templates/vastgoed.ts`

| Content | Collection | Aantal |
|---------|------------|--------|
| Woningen | properties | 6 (Appartement Oud-West €485k, Grachtenpand €625k, Penthouse IJburg €395k, Villa Blaricum €725k, Tussenwoning Haarlem €435k, Nieuwbouw IJburg €550k) |
| Makelaars | content-team | 2 (Woningmakelaar, Senior makelaar/taxateur) |
| Reviews | content-reviews | 2 (koper-review, verkoper-review) |
| Chatbot flows | chatbot-settings global | 8 flow categories + system prompt + training context + welcome message |

---

## Implementatievolgorde

1. **Fase 1** — Foundation: branch metadata + Properties collectie + lib + contentModules
2. **Fase 2** — Components: 8 nieuwe + hergebruik bestaande shared
3. **Fase 3** — Blocks: 3 blocks (registratie in Pages)
4. **Fase 4** — Templates: 5 pagina-templates
5. **Fase 5** — API Routes: 3 endpoints (viewing, valuation, search)
6. **Fase 6** — Hooks: viewingStatusHook + registratie
7. **Fase 7** — Email Templates: 8 pre-built templates (#66-#73)
8. **Fase 8** — Email Flows: 3 automation flows
9. **Fase 9** — Chatbot: predefined conversation flows + system prompt + seed
10. **Fase 10** — App Routes: layout + 4 unieke + 1 shared update
11. **Fase 11** — Seed: complete seedVastgoed() functie

---

## Hergebruik en Gedeelde Patronen

### Componenten hergebruikt van andere branches
| Component | Bron | Gebruik in vastgoed |
|-----------|------|---------------------|
| ImageGallery block | shared | Foto galerij op PropertyDetail |
| ReviewsWidget block | shared | Reviews op PropertyDetail en ContactTemplate |
| Map block | shared | Kantoorlocatie op contact, woninglocatie op detail |
| ContactForm block | shared | Contact pagina |

### Patronen gedeeld met toerisme branch
| Vastgoed component | Toerisme equivalent | Gedeeld patroon |
|--------------------|---------------------|----------------|
| PropertyCard | TourCard / AccommodationCard | Card met image, specs, prijs |
| PropertyFilters | TourFilters / AccommodationFilters | Sidebar met checkboxes, prijs-range, select |
| PropertyMapView | — (nieuw voor vastgoed) | Kaart met markers, popup cards |
| MortgageCalculator | — (uniek voor vastgoed) | Client-side calculator |
| BezichtigingForm | BookingForm | Datum + tijd + contactgegevens |
| ValuationForm | — (uniek voor vastgoed) | Dark gradient form met file upload |
| EnergyLabelBadge | — (uniek voor vastgoed) | Gekleurde badge per energielabel |

---

## Referentiebestanden

| Bestand | Reden |
|---------|-------|
| `src/branches/automotive/index.ts` | Branch metadata pattern (eigen collecties) |
| `src/branches/automotive/collections/Vehicles.ts` | Complexe collectie pattern (tabs) |
| `src/branches/toerisme/collections/Tours.ts` | Complexe collectie met tabs + status |
| `src/branches/shared/blocks/ImageGallery/` | Herbruikbare galerij |
| `src/branches/shared/blocks/Map/` | Herbruikbare kaart |
| `src/lib/tenant/contentModules.ts` | BranchType registratie |
| `src/lib/tenant/features.ts` | Feature flag (al aanwezig) |
| `src/features/email-marketing/lib/predefined/templates.ts` | Email template pattern |
| `src/features/email-marketing/lib/predefined/flows.ts` | Automation flow pattern |
| `src/features/ai/lib/predefined/conversationFlows.ts` | Chatbot flows pattern |

---

## Design Referenties (HTML Mockups)

| Mockup | Beschrijving | Implementatie |
|--------|-------------|---------------|
| `makelaar-woningen.html` | Page header stats + FilterSidebar + MapView + PropertyCards grid + paginatie | Template: PropertiesArchive |
| `makelaar-woning-detail.html` | PropertyHeader + Gallery + Description + PropertySpecs + MortgageCalc sidebar + BezichtigingForm sidebar + ValuationCTA banner | Template: PropertyDetail |
| `makelaar-waardebepaling.html` | Page header + dark gradient ValuationForm + "Hoe werkt het?" info sectie + success state | Template: ValuationWizard |

---

## Verificatie

1. `/woningen` toont property overzicht met filters, kaart, grid/lijst toggle
2. `/woningen/[slug]` toont property detail met gallery, specs, hypotheekcalculator, bezichtigingsformulier
3. `/waardebepaling` toont dark gradient formulier met file upload en trust badges
4. `/bezichtiging` toont standalone bezichtigingsformulier met makelaar team cards
5. `POST /api/vastgoed/viewing` maakt bezichtiging aan in `content-bookings` met `branch: 'vastgoed'`
6. `POST /api/vastgoed/valuation` maakt waardebepaling aan met `isValuation: true`
7. `GET /api/vastgoed/search` retourneert gefilterde properties met paginatie
8. Status wijziging `confirmed` stuurt bevestigingsemail naar klant + makelaar
9. Email templates: `POST /api/email-marketing/seed-predefined` → 8 nieuwe vastgoed templates (#66-#73)
10. Chatbot widget → 8 vastgoed flow categories
11. seedVastgoed() → 6 woningen, 2 makelaars, 2 reviews, chatbot flows

---

## Wat NIET verandert

- Toerisme branch — blijft apart (reizen, niet woningen)
- Automotive branch — blijft apart (voertuigen, niet vastgoed)
- Unified content collections — geen structuurwijzigingen, alleen branch option + conditionele velden toevoegen
- Feature flags — `real_estate` bestaat al in features.ts
- Shared blocks — worden hergebruikt, niet gedupliceerd
- `(branches)/contact` resolver — alleen een extra `isFeatureEnabled('real_estate')` check toevoegen
