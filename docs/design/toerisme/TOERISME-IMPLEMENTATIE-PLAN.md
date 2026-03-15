# Toerisme Branch — Volledige Implementatie Plan

> **Status:** Gepland
> **Datum:** 2026-03-14
> **Branch:** `ENABLE_TOURISM=true`
> **Branchenaam:** `toerisme` (Display: "Toerisme & Reizen")

## Context

De toerisme branch is een complexe branch met **eigen collecties** (Tours, Destinations, Accommodations) vergelijkbaar met hoe automotive Vehicles/VehicleBrands heeft. Daarnaast hergebruikt het unified content collections voor bookings, reviews en team.

### Wat al bestaat

| Onderdeel | Status | Locatie |
|-----------|--------|---------|
| Feature flag `tourism` | ✅ In features.ts | `ENABLE_TOURISM` (regel 113, 310, 489) |
| Design mockups | ✅ 6 HTML bestanden | `docs/design/toerisme/` |
| Experiences branch (referentie) | ✅ Volledig | `src/branches/experiences/` |
| AvailabilityCalendar | ✅ Herbruikbaar | `src/branches/experiences/components/booking/AvailabilityCalendar/` |
| BookingSidebar | ✅ Herbruikbaar | `src/branches/experiences/components/booking/BookingSidebar/` |
| ImageGallery block | ✅ Herbruikbaar | `src/branches/shared/blocks/ImageGallery/` |
| ReviewsWidget block | ✅ Herbruikbaar | `src/branches/shared/blocks/ReviewsWidget/` |
| Map block | ✅ Herbruikbaar | `src/branches/shared/blocks/Map/` |
| Branch metadata | ❌ Ontbreekt | — |
| BranchType 'toerisme' | ❌ Ontbreekt in contentModules.ts | — |
| Collections | ❌ Ontbreekt | — |
| Components | ❌ Ontbreekt | — |
| Blocks | ❌ Ontbreekt | — |
| Templates | ❌ Ontbreekt | — |
| Routes | ❌ Ontbreekt | — |
| Seed functie | ❌ Ontbreekt | — |

### Belangrijke beslissingen

1. **Eigen collecties**: Tours, Destinations en Accommodations zijn te complex voor unified content-services — krijgen eigen collecties (patroon: automotive)
2. **BranchType toevoegen**: `'toerisme'` toevoegen aan contentModules.ts voor bookings/reviews/team
3. **Herbruikbare componenten**: AvailabilityCalendar, BookingSidebar, ImageGallery, ReviewsWidget, Map uit bestaande branches
4. **Toerisme gradient**: `#00BCD4` → `#0097A7` (cyan → dark cyan, water/vakantie thema)
5. **Gedeelde patronen met toekomstige vastgoed branch**: Gallery, FilterSidebar, ListingCard, Map — ontworpen met hergebruik in gedachten
6. **Accommodations = onderdeel van Tours**: Accommodaties zijn gekoppeld aan bestemmingen en kunnen los of als onderdeel van een tour bekeken worden

---

## Fase 1: Foundation — Branch Metadata + Collections + Lib

### 1a. Branch metadata
- **File:** `src/branches/toerisme/index.ts`
- Volgt exact pattern van `src/branches/automotive/index.ts`
- Exporteert: `branchMetadata`, block configs, template slugs

### 1b. BranchType toevoegen
- **File:** `src/lib/tenant/contentModules.ts`
- Toevoegen: `'toerisme'` aan `BranchType` union
- Toevoegen: `toerisme` defaults aan `branchDefaults`:
  - services: label "Arrangementen", routeSlug "arrangementen", defaultEnabled: false
  - bookings: label "Boekingen", routeSlug "boekingen", defaultEnabled: true
  - reviews: label "Reviews", routeSlug "reviews", defaultEnabled: true
  - team: label "Reisleiders", routeSlug "team", defaultEnabled: true
  - cases: label "Reisverhalen", routeSlug "reisverhalen", defaultEnabled: false
  - activities: label "Excursies", routeSlug "excursies", defaultEnabled: false
  - inquiries: label "Aanvragen", routeSlug "aanvragen", defaultEnabled: true

### 1c. Collections (3 eigen collecties)

#### `Destinations` — Bestemmingen
- **File:** `src/branches/toerisme/collections/Destinations.ts`
- **Slug:** `destinations`
- **Velden:**
  - `name` (text, required) — Naam bestemming
  - `slug` (text, unique, auto)
  - `country` (text) — Land
  - `continent` (select: europa, azie, afrika, amerika, oceanie)
  - `description` (richText) — Beschrijving
  - `coverImage` (upload, media)
  - `icon` (text) — Emoji icon
  - `featured` (checkbox) — Uitgelicht
  - `climate` (textarea) — Klimaatinfo
  - `bestSeason` (text) — Beste reisperiode
  - `meta` (SEO group via `@payloadcms/plugin-seo`)

#### `Tours` — Reizen
- **File:** `src/branches/toerisme/collections/Tours.ts`
- **Slug:** `tours`
- **Tabs:**
  1. **Algemeen**: title, slug, destination (rel), shortDescription, description (richText), coverImage, gallery (array upload)
  2. **Details**: duration (dagen), nights, category (select: bestseller/nieuw/avontuur/luxe/familie/stedentrip/strand/cultuur), highlights (array text), inclusions (array text), exclusions (array text)
  3. **Reisprogramma**: itinerary (array: dagNummer, titel, beschrijving richText, locatie)
  4. **Prijzen**: price (number, vanaf p.p.), originalPrice (doorgestreept), earlyBirdPrice, earlyBirdDeadline, childPrice, singleSupplement
  5. **Beschikbaarheid**: departureDate, returnDate, availability (select: beschikbaar/beperkt/uitverkocht), maxParticipants, currentBookings
  6. **Beoordeling**: rating (number 0-5), reviewCount, featured (checkbox)
- **Status:** `draft` / `published`
- **Admin:** defaultColumns: title, destination, price, duration, availability

#### `Accommodations` — Accommodaties
- **File:** `src/branches/toerisme/collections/Accommodations.ts`
- **Slug:** `accommodations`
- **Tabs:**
  1. **Algemeen**: name, slug, destination (rel), type (select: hotel/resort/villa/appartement/hostel/b&b/glamping), stars (number 1-5), shortDescription, description (richText), coverImage, gallery (array upload)
  2. **Locatie**: address, city, region, coordinates (point), distanceBeach, distanceCenter, distanceAirport
  3. **Kamers**: rooms (array: name, type, maxGuests, price, description, amenities array)
  4. **Faciliteiten**: facilities (select hasMany: zwembad/spa/restaurant/bar/fitness/wifi/parkeren/roomservice/airco/wasserij/kindvriendelijk/huisdieren)
  5. **Prijzen**: priceFrom (vanaf p.p.p.n.), priceTo, mealPlan (select: logies/ontbijt/halfpension/volpension/allinclusive)
  6. **Beoordeling**: rating (number 0-10), reviewCount, featured (checkbox)
- **Status:** `draft` / `published`

### 1d. Registratie in payload.config.ts
- Conditioneel registreren van Tours, Destinations, Accommodations wanneer `isFeatureEnabled('tourism')`

### 1e. ContentBookings uitbreiden
- **File:** `src/branches/shared/collections/ContentBookings/index.ts`
- Toevoegen aan `branchOptions`: `{ label: 'Toerisme', value: 'toerisme' }`
- Toevoegen toerisme-specifieke velden (conditional op `branch === 'toerisme'`):
  - `tour` (relationship to `tours`) — Gekoppelde reis
  - `accommodation` (relationship to `accommodations`) — Gekoppelde accommodatie
  - `departureDate` (date) — Vertrekdatum
  - `returnDate` (date) — Retourdatum
  - `travelers` (number, min: 1) — Aantal reizigers
  - `travelInsurance` (checkbox) — Reisverzekering

### 1f. Lib utilities
| File | Beschrijving |
|------|-------------|
| `src/branches/toerisme/lib/analytics.ts` | `trackTourismEvent()` — GA4 events: tour_view, tour_search, accommodation_view, booking_start, booking_complete, destination_view |
| `src/branches/toerisme/lib/tourUtils.ts` | `formatPrice()`, `formatDuration()`, `formatContinent()`, `formatAvailability()`, `formatMealPlan()`, `calculateTotalPrice()`, `formatStars()` |

---

## Fase 2: Components (10 stuks)

### Hergebruik van bestaande componenten
De volgende componenten worden **niet opnieuw gebouwd** maar geïmporteerd:
- `AvailabilityCalendar` → van `@/branches/experiences/components/booking/AvailabilityCalendar`
- `BookingSidebar` → van `@/branches/experiences/components/booking/BookingSidebar`
- `ImageGallery` block → van `@/branches/shared/blocks/ImageGallery`
- `ReviewsWidget` block → van `@/branches/shared/blocks/ReviewsWidget`

### Nieuwe componenten

| Component | Type | Beschrijving |
|-----------|------|-------------|
| `TourCard` | Server | Tour card met cover, duur/nachten, rating, highlights-chips, prijs vanaf p.p. |
| `AccommodationCard` | Server | Accommodatie card met cover, sterren, locatie, faciliteiten-icons, prijs p.p.p.n. |
| `DestinationCard` | Server | Bestemming card met gradient-overlay, naam, land, tour-count |
| `TourFilters` | Client | Sidebar filters: continent, prijsklasse, duur, categorie, prijs min/max |
| `AccommodationFilters` | Client | Sidebar filters: type, sterren, faciliteiten, maaltijdplan, prijs min/max |
| `SearchWidget` | Client | Hero search widget: bestemming, datum, reizigers — sticky op homepage |
| `ItineraryTimeline` | Server | Dag-voor-dag reisprogramma met timeline-visualisatie |
| `BookingForm` | Client | 3-staps wizard: Reis/Accommodatie → Reizigers & Data → Persoonsgegevens |
| `RoomCard` | Server | Kamertype card met max gasten, faciliteiten, prijs per nacht |
| `ContinentPills` | Client | Horizontale continent-filter tabs (Alles, Europa, Azië, Afrika, Amerika, Oceanië) |

**Pad:** `src/branches/toerisme/components/<ComponentName>/`

### Componenten ontworpen voor hergebruik met vastgoed
De volgende componenten zijn bewust generiek ontworpen zodat de toekomstige vastgoed/makelaar branch ze kan hergebruiken of als basis kan nemen:
- **TourFilters / AccommodationFilters** → Zelfde sidebar-filter pattern als vastgoed PropertyFilters
- **TourCard / AccommodationCard** → Zelfde card-met-specs pattern als vastgoed PropertyCard
- **SearchWidget** → Zelfde zoekwidget pattern als vastgoed PropertySearch

---

## Fase 3: Blocks (4 stuks)

| Block | Velden | Beschrijving |
|-------|--------|-------------|
| `FeaturedTours` | heading, limit, columns, continentFilter, showPrice, showRating | Uitgelichte reizen grid, fetcht `tours` where `featured: true` |
| `DestinationGrid` | heading, limit, columns, showTourCount | Bestemmingen grid met gradient-overlay cards |
| `AccommodationShowcase` | heading, limit, destinationFilter, showStars, showFacilities | Accommodatie highlights, fetcht `accommodations` |
| `TourSearchHero` | heading, subheading, showSearchWidget, backgroundStyle | Hero met geïntegreerde SearchWidget |

**Pad:** `src/branches/toerisme/blocks/<BlockName>/`

**Registratie:** Conditioneel via `isFeatureEnabled('tourism')` in Pages collection.

---

## Fase 4: Templates (6 pagina-templates)

| Template | Route | Beschrijving |
|----------|-------|-------------|
| `ToursArchive` | `/reizen` | Reizen overzicht met ContinentPills + TourFilters sidebar + TourCard grid + paginatie |
| `TourDetail` | `/reizen/[slug]` | 2-kolom: gallery, itinerary, inclusief/exclusief + sidebar met prijs, boek-CTA, garanties |
| `AccommodationsArchive` | `/accommodaties` | Accommodaties overzicht met AccommodationFilters + AccommodationCard grid |
| `AccommodationDetail` | `/accommodaties/[slug]` | Gallery, beschrijving, kamers (RoomCard), faciliteiten + sidebar met prijzen, boek-CTA |
| `BookingWizard` | `/boeken` | BookingForm 3-staps wizard + BookingSidebar |
| `ContactTemplate` | `/contact` | Contactformulier, reisadviseurs (content-team), openingstijden, locatie |

**Pad:** `src/branches/toerisme/templates/<TemplateName>/`

---

## Fase 5: API Routes (3 endpoints)

### 5a. POST `/api/toerisme/booking`
- **File:** `src/app/api/toerisme/booking/route.ts`
- Accepteert: `{ tourId?, accommodationId?, departureDate, returnDate, travelers, firstName, lastName, email, phone, travelInsurance?, remarks? }`
- Maakt `content-bookings` aan met `branch: 'toerisme'`, `status: 'new'`
- Koppelt tour/accommodatie relaties
- Valideert beschikbaarheid (maxParticipants)

### 5b. GET `/api/toerisme/search`
- **File:** `src/app/api/toerisme/search/route.ts`
- Query params: `destination?`, `departureMonth?`, `travelers?`, `minPrice?`, `maxPrice?`, `continent?`, `category?`, `duration?`
- Zoekt in `tours` collection met gecombineerde filters
- Returnt gesorteerde resultaten met paginatie

### 5c. GET `/api/toerisme/availability`
- **File:** `src/app/api/toerisme/availability/route.ts`
- Query params: `tourId` of `accommodationId`, `month` (YYYY-MM)
- Checkt beschikbaarheid o.b.v. `maxParticipants - currentBookings`
- Returnt: `{ dates: [{ date, available, spotsLeft }] }`

---

## Fase 6: Hooks (1 hook)

### 6a. `tourBookingHook.ts`
- **File:** `src/branches/toerisme/hooks/tourBookingHook.ts`
- `CollectionAfterChangeHook` op `content-bookings`
- Filtert op `doc.branch === 'toerisme'` — veilig voor andere branches
- Status transities:
  - `new` → `confirmed`: Log bevestiging, update `currentBookings` count op tour
  - `confirmed` → `cancelled`: Log annulering, decrement `currentBookings`
  - `confirmed` → `completed`: Log afronding
- Console.log based (emails via automation flows)

### 6b. Registratie
- **File:** `src/branches/shared/collections/ContentBookings/index.ts`
- Toevoegen aan `afterChange` hooks array

---

## Fase 7: Pre-built Email Templates (8 templates)

Toevoegen aan `src/features/email-marketing/lib/predefined/templates.ts`:

| # | Template | Category | Subject |
|---|----------|----------|---------|
| 1 | Boekingsbevestiging (Klant) | transactional | Uw reis is geboekt — {{ .TourName }} |
| 2 | Boekingsbevestiging (Admin) | notification | Nieuwe boeking: {{ .CustomerName }} — {{ .TourName }} |
| 3 | Boeking Geannuleerd (Klant) | transactional | Boeking geannuleerd — {{ .TourName }} |
| 4 | Reisherinnering (7 dagen) | transactional | Over 7 dagen vertrekt u! — {{ .TourName }} |
| 5 | Reisherinnering (1 dag) | transactional | Morgen is het zover! — {{ .TourName }} |
| 6 | Na-Reis Review Verzoek | transactional | Hoe was uw reis, {{ .CustomerName }}? |
| 7 | Bestemming Nieuwsbrief | newsletter | Ontdek {{ .DestinationName }}: {{ .TourCount }} nieuwe reizen |
| 8 | Vroegboekkorting Notificatie | promotional | Vroegboekkorting: bespaar op {{ .TourName }}! |

Alle templates: toerisme-gradient header (`#00BCD4` → `#0097A7`), tags `['toerisme', 'reizen', 'predefined']`.

---

## Fase 8: Pre-built Automation Flows (3 flows)

Toevoegen aan `src/features/email-marketing/lib/predefined/flows.ts`:

### Flow 1: Reis Herinnering Flow
- **Trigger:** `custom.event` / `booking.confirmed`
- **Steps:** tag booking-confirmed → wait tot 7 dagen voor vertrek → send "Reisherinnering (7 dagen)" → wait tot 1 dag voor vertrek → send "Reisherinnering (1 dag)" → exit
- **Exit:** booking.cancelled, subscriber.unsubscribed

### Flow 2: Na-Reis Review Flow
- **Trigger:** `custom.event` / `booking.completed`
- **Steps:** wait 3 dagen → send "Na-Reis Review Verzoek" → tag review-requested → exit
- **Exit:** subscriber.unsubscribed
- **Settings:** allowReentry: true, maxEntriesPerUser: 20

### Flow 3: Vroegboekkorting Notificatie Flow
- **Trigger:** `custom.event` / `tour.early_bird`
- **Steps:** send "Vroegboekkorting Notificatie" → tag early-bird-notified → exit
- **Exit:** subscriber.unsubscribed

---

## Fase 9: Pre-built Chatbot Conversation Flows

### 9a. Toerisme Conversation Flows (7 categories)

```
1. Reizen & Tours (type: submenu)
   ├─ Alle reizen bekijken → direct: "Welke reizen bieden jullie aan?"
   ├─ Reis zoeken → input: "Waar wil je naartoe?" placeholder: "Bijv. Bali, Thailand, Italië..."
   ├─ Populairste reizen → direct: "Wat zijn de meest populaire reizen?"
   ├─ Stedentrips → direct: "Welke stedentrips bieden jullie aan?"
   ├─ Avontuurlijke reizen → direct: "Welke avontuurlijke reizen hebben jullie?"
   └─ Last-minute aanbiedingen → direct: "Zijn er last-minute aanbiedingen?"
   contextPrefix: "Klant zoekt informatie over reizen:"

2. Accommodaties (type: submenu)
   ├─ Hotels bekijken → direct: "Welke hotels zijn er beschikbaar?"
   ├─ Resorts & villa's → direct: "Hebben jullie luxe resorts of villa's?"
   ├─ Budget accommodaties → direct: "Welke budget-vriendelijke accommodaties zijn er?"
   └─ Accommodatie zoeken → input: "Welke bestemming?" placeholder: "Bijv. Bali, Parijs..."
   contextPrefix: "Klant zoekt accommodatie-informatie:"

3. Bestemmingen (type: submenu)
   ├─ Europa → direct: "Welke Europese bestemmingen bieden jullie aan?"
   ├─ Azië → direct: "Welke bestemmingen in Azië hebben jullie?"
   ├─ Afrika → direct: "Welke safari's en Afrika-reizen zijn er?"
   ├─ Amerika → direct: "Welke reizen naar Amerika bieden jullie aan?"
   └─ Beste reistijd → input: "Welke bestemming?" placeholder: "Bijv. Thailand, Kenia..."
   contextPrefix: "Klant zoekt bestemming-informatie:"

4. Boeken & Prijzen (type: submenu)
   ├─ Hoe boek ik? → direct: "Hoe kan ik een reis boeken?"
   ├─ Prijzen bekijken → direct: "Wat kosten jullie reizen gemiddeld?"
   ├─ Vroegboekkorting → direct: "Zijn er vroegboekkortingen beschikbaar?"
   ├─ Kindkorting → direct: "Is er korting voor kinderen?"
   └─ Betaalmogelijkheden → direct: "Welke betaalmethoden accepteren jullie?"
   contextPrefix: "Klant heeft een vraag over boeken/prijzen:"

5. Mijn Boeking (type: submenu)
   ├─ Boeking bekijken → input: "Voer je boekingsnummer in" placeholder: "Bijv. BK-12345"
   ├─ Boeking wijzigen → direct: "Hoe kan ik mijn boeking wijzigen?"
   ├─ Boeking annuleren → direct: "Wat is het annuleringsbeleid?"
   └─ Reisverzekering → direct: "Bieden jullie een reisverzekering aan?"
   contextPrefix: "Klant wil boeking beheren:"

6. Reisadvies & Praktisch (type: submenu)
   ├─ Reisdocumenten → direct: "Welke reisdocumenten heb ik nodig?"
   ├─ Vaccinaties → direct: "Welke vaccinaties worden aanbevolen?"
   ├─ Bagage → direct: "Hoeveel bagage mag ik meenemen?"
   └─ Contact met reisleider → direct: "Hoe kan ik contact opnemen met mijn reisleider?"
   contextPrefix: "Klant heeft praktische reisvragen:"

7. Overige vragen (type: input)
   inputLabel: "Stel je vraag"
   inputPlaceholder: "Typ hier je vraag..."
   contextPrefix: "Klant heeft een algemene vraag:"
   icon: help
```

### 9b. System Prompt
```
Je bent de virtuele reisadviseur van [BEDRIJFSNAAM], een professioneel reisbureau.

Beantwoord vragen vriendelijk, enthousiast en in het Nederlands.
Je helpt reizigers met:
- Reizen en bestemmingen ontdekken
- Accommodaties vinden die bij hun wensen passen
- Informatie over prijzen, beschikbaarheid en kortingen
- Het boekingsproces uitleggen
- Praktische reisinformatie (documenten, vaccinaties, bagage)

Richtlijnen:
- Wees enthousiast en inspirerend — dit gaat over droomvakanties!
- Gebruik de kennisbank om accurate informatie te geven over reizen en bestemmingen
- Als iemand wil boeken, verwijs naar de boekingspagina (/boeken)
- Noem altijd de mogelijkheid om een persoonlijk adviesgesprek in te plannen
- Geef eerlijk advies over beste reisperiodes en klimaat
- Als je het antwoord niet weet, verwijs naar een reisadviseur
```

### 9c. Training Context + Welcome Message

---

## Fase 10: App Routes (7 routes)

### Layout
- **File:** `src/app/(toerisme)/layout.tsx`
- ThemeProvider, SearchProvider, Header, Footer

### Routes
| Route | File | Template |
|-------|------|----------|
| `/reizen` | `src/app/(toerisme)/reizen/page.tsx` | `ToursArchiveTemplate` |
| `/reizen/[slug]` | `src/app/(toerisme)/reizen/[slug]/page.tsx` | `TourDetailTemplate` |
| `/accommodaties` | `src/app/(toerisme)/accommodaties/page.tsx` | `AccommodationsArchiveTemplate` |
| `/accommodaties/[slug]` | `src/app/(toerisme)/accommodaties/[slug]/page.tsx` | `AccommodationDetailTemplate` |
| `/boeken` | `src/app/(toerisme)/boeken/page.tsx` | `BookingWizardTemplate` |
| `/contact` | `src/app/(toerisme)/contact/page.tsx` | `ContactTemplate` |

---

## Fase 11: Seed Functie

**File:** `src/endpoints/seed/templates/toerisme.ts`

| Content | Collection | Aantal |
|---------|------------|--------|
| Bestemmingen | destinations | 4 (Thailand, Frankrijk, Kenia, Italië) |
| Reizen | tours | 6 (Bali 8d, Parijs 5d, Safari Kenia 12d, Rome 6d, Japan 10d, Costa Rica 8d) |
| Accommodaties | accommodations | 4 (Resort Bali, Boutique Hotel Parijs, Safari Lodge Kenia, Villa Toscane) |
| Reisadviseurs | content-team | 2 (Reisadviseur, Bestemming-specialist) |
| Chatbot flows | chatbot-settings global | 7 flow categories + system prompt + training context |

---

## Implementatievolgorde

1. **Fase 1** — Foundation: branch metadata + 3 collections + lib + contentModules
2. **Fase 2** — Components: 10 nieuwe + hergebruik bestaande
3. **Fase 3** — Blocks: 4 blocks (registratie in Pages)
4. **Fase 4** — Templates: 6 pagina-templates
5. **Fase 5** — API Routes: 3 endpoints (booking, search, availability)
6. **Fase 6** — Hooks: tourBookingHook + registratie
7. **Fase 7** — Email Templates: 8 pre-built templates
8. **Fase 8** — Email Flows: 3 automation flows
9. **Fase 9** — Chatbot: predefined conversation flows + seed
10. **Fase 10** — App Routes: layout + 6 route files
11. **Fase 11** — Seed: complete seedToerisme() functie

---

## Hergebruik en Gedeelde Patronen

### Componenten hergebruikt van andere branches
| Component | Bron | Gebruik in toerisme |
|-----------|------|---------------------|
| AvailabilityCalendar | experiences | Datum-selectie in BookingForm |
| BookingSidebar | experiences | Boekingsoverzicht sidebar (aangepast) |
| ImageGallery block | shared | Foto galerij op detail pages |
| ReviewsWidget block | shared | Reviews op detail pages |
| Map block | shared | Locatie op accommodatie detail |
| ContactForm block | shared | Contact pagina |

### Patronen herbruikbaar voor toekomstige vastgoed branch
| Toerisme component | Vastgoed equivalent | Gedeeld patroon |
|---------------------|--------------------|-|
| TourCard | PropertyCard | Card met image, specs, prijs |
| TourFilters | PropertyFilters | Sidebar met checkboxes, prijs-range |
| AccommodationCard | PropertyCard | Card met faciliteiten-icons, rating |
| SearchWidget | PropertySearch | Hero zoekwidget met meerdere velden |
| ContinentPills | AreaPills | Horizontale locatie-filter tabs |
| RoomCard | — | Niet herbruikbaar (toerisme-specifiek) |

---

## Referentiebestanden

| Bestand | Reden |
|---------|-------|
| `src/branches/automotive/index.ts` | Branch metadata pattern (eigen collecties) |
| `src/branches/automotive/collections/Vehicles.ts` | Complexe collectie pattern (tabs) |
| `src/branches/experiences/components/booking/` | Herbruikbare booking componenten |
| `src/branches/shared/blocks/ImageGallery/` | Herbruikbare galerij |
| `src/branches/shared/blocks/ReviewsWidget/` | Herbruikbare reviews |
| `src/lib/tenant/contentModules.ts` | BranchType registratie |
| `src/lib/tenant/features.ts` | Feature flag (al aanwezig) |
| `src/features/email-marketing/lib/predefined/templates.ts` | Email template pattern |
| `src/features/email-marketing/lib/predefined/flows.ts` | Automation flow pattern |
| `src/features/ai/lib/predefined/conversationFlows.ts` | Chatbot flows pattern |
| `docs/design/toerisme/` | 6 HTML design mockups |

---

## Design Referenties (HTML Mockups)

| Mockup | Beschrijving | Implementatie |
|--------|-------------|---------------|
| `toerisme-homepage.html` | Hero + SearchWidget + TourCards + DestinationCards + CTA | Blocks: TourSearchHero, FeaturedTours, DestinationGrid |
| `toerisme-reizen-overzicht.html` | Header + ContinentPills + TourFilters + TourCards grid | Template: ToursArchive |
| `toerisme-reis-detail.html` | Gallery + Itinerary + Inclusief/Exclusief + Sidebar prijs | Template: TourDetail |
| `toerisme-accommodatie-overzicht.html` | Filters + AccommodationCards grid + Map | Template: AccommodationsArchive |
| `toerisme-accommodatie-detail.html` | Gallery + Kamers + Faciliteiten + Sidebar booking | Template: AccommodationDetail |
| `toerisme-boekingsformulier.html` | 3-staps wizard + sidebar samenvatting | Template: BookingWizard |

---

## Verificatie

1. `/reizen` toont tour overzicht met continent-tabs, sidebar filters, prijs/duur
2. `/reizen/[slug]` toont tour detail met gallery, itinerary, inclusief/exclusief, boek-CTA
3. `/accommodaties` toont accommodatie overzicht met type/sterren/faciliteiten filters
4. `/accommodaties/[slug]` toont accommodatie detail met kamers, faciliteiten, boek-CTA
5. `/boeken` toont 3-staps booking wizard met reis/accommodatie selectie
6. `POST /api/toerisme/booking` maakt booking aan in `content-bookings` met `branch: 'toerisme'`
7. `GET /api/toerisme/search` retourneert gefilterde tours
8. Email templates: `POST /api/email-marketing/seed-predefined` → 8 nieuwe toerisme templates
9. Chatbot widget → 7 toerisme flow categories
10. seedToerisme() → 4 bestemmingen, 6 reizen, 4 accommodaties, chatbot flows

---

## Wat NIET verandert

- Experiences branch — blijft apart (team building/events, niet vakanties)
- Unified content collections — geen structuurwijzigingen, alleen branch option toevoegen
- Feature flags — `tourism` bestaat al in features.ts
- Shared blocks — worden hergebruikt, niet gedupliceerd
