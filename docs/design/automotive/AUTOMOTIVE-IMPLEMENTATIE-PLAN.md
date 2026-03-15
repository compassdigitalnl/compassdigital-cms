# Automotive Branch — Volledige Implementatie Plan

> **Status:** Gepland
> **Datum:** 2026-03-14
> **Branch:** `ENABLE_AUTOMOTIVE=true`
> **Branchenaam:** `automotive` (Display: "Automotive & Voertuigen")

## Context

De automotive branch biedt een complete oplossing voor autobedrijven, garages, dealers en verhuurbedrijven. Anders dan beauty/horeca/zorg die volledig op unified content collections draaien, heeft automotive **eigen collecties** nodig: `vehicles` en `vehicle-brands`. Deze passen niet in `content-services` omdat voertuigen tientallen unieke attributen hebben (kenteken, bouwjaar, kilometerstand, brandstof, APK, etc.).

De werkplaats-module hergebruikt wél unified collections:
- `content-services` met `branch: 'automotive'` → APK, onderhoud, bandenwissel, etc.
- `content-bookings` met `branch: 'automotive'` → werkplaatsafspraken
- `content-team` met `branch: 'automotive'` → monteurs/medewerkers
- `content-reviews` met `branch: 'automotive'` → klantreviews

Automotive-specifieke velden in ContentBookings: `licensePlate` (kenteken), `vehicleBrand`, `vehicleModel`.
Automotive-specifieke velden in ContentServices: `vehicleType` (auto/motor/scooter/camper/alle).

Content module defaults (Settings > siteBranch = 'automotive'):
- services: label "Werkplaatsdiensten", routeSlug "werkplaats", defaultEnabled: **true**
- bookings: label "Werkplaatsafspraken", routeSlug "afspraak-maken", defaultEnabled: **true**
- team: label "Team", routeSlug "team", defaultEnabled: **true**
- reviews: label "Reviews", defaultEnabled: **true**
- cases: label "Portfolio", routeSlug "portfolio", defaultEnabled: **false**
- activities: label "Evenementen", routeSlug "evenementen", defaultEnabled: **false**
- inquiries: label "Inruil-aanvraag", routeSlug "inruilen", defaultEnabled: **true**

Automotive gradient: `#FF5722` → `#E65100` (deep orange → dark orange, krachtig/automotief).

---

## Fase 1: Foundation — Collections + Branch Metadata + Content Modules

### 1a. Vehicles collectie (NIEUW)
- **File:** `src/branches/automotive/collections/Vehicles.ts`
- Slug: `vehicles`
- Admin group: "Automotive"

**Tabs:**
- **Algemeen**: title, slug, status (beschikbaar/gereserveerd/verkocht), featured, vehicleType (auto/motor/scooter/camper/caravan)
- **Specificaties**: licensePlate, brand (rel → vehicle-brands), model, variant, bodyType (sedan/hatchback/suv/stationwagon/cabrio/coupé/bus/bestel), year, mileage, fuelType (benzine/diesel/elektrisch/hybride-benzine/hybride-diesel/lpg), transmission (handgeschakeld/automaat), power (pk), powerKw, engineCapacity (cc), color, doors, seats, weight
- **Prijzen**: price, salePrice, priceType (btw-marge/btw-auto/ex-btw), monthlyPrice (financieringsvoorbeeld)
- **Registratie**: firstRegistration (date), apkExpiry (date), numberOfOwners, napCheck (checkbox)
- **Media**: images (array of uploads), videoUrl, panoramaUrl
- **Extra's**: features (array met categorie: comfort/veiligheid/exterieur/audio/overig + naam)
- **Beschrijving**: shortDescription, description (richText)

### 1b. VehicleBrands collectie (NIEUW)
- **File:** `src/branches/automotive/collections/VehicleBrands.ts`
- Slug: `vehicle-brands`
- Fields: name, slug, logo (upload), popularModels (array of text), order

### 1c. Branch metadata
- **File:** `src/branches/automotive/index.ts`
- Exporteert: branchMetadata, blocks, templates, collecties

### 1d. Content module defaults toevoegen
- **File:** `src/lib/tenant/contentModules.ts`
- Toevoegen: `'automotive'` aan BranchType union
- Toevoegen: automotive defaults object

### 1e. Feature flag toevoegen
- **File:** `src/lib/tenant/features.ts`
- Toevoegen: `automotive?: boolean` aan ClientFeatures

### 1f. Branch option toevoegen aan unified collections
- **File:** `src/branches/shared/collections/ContentServices/index.ts`
- Toevoegen: `{ label: 'Automotive', value: 'automotive' }` aan branchOptions

### 1g. Automotive-specifieke velden in unified collections
- **ContentBookings**: `licensePlate` (text), `vehicleBrand` (text), `vehicleModel` (text) — conditional op `branch: 'automotive'`
- **ContentServices**: `vehicleType` (select: auto/motor/scooter/camper/alle) — conditional op `branch: 'automotive'`

### 1h. Lib utilities

| File | Beschrijving |
|------|-------------|
| `src/branches/automotive/lib/analytics.ts` | `trackAutomotiveEvent()` — GA4 events: vehicle_view, vehicle_compare, test_drive_request, trade_in_start, workshop_booking, financing_calculator |
| `src/branches/automotive/lib/vehicleUtils.ts` | `formatPrice()`, `formatMileage()`, `formatFuelType()`, `formatTransmission()`, `formatBodyType()`, `calculateMonthlyPayment()`, `formatApkStatus()` |

---

## Fase 2: Components (10 stuks)

| Component | Type | Beschrijving |
|-----------|------|-------------|
| `VehicleCard` | Server | Voertuig-card met foto, merk/model, prijs, bouwjaar, km-stand, brandstof, transmissie |
| `VehicleFilters` | Client | Uitgebreide filters: merk, model, prijs-range (slider), bouwjaar, km-stand, brandstof, transmissie, kleur, carrosserie |
| `VehicleGallery` | Client | Fotogalerij met lightbox, thumbnails, video-embed |
| `VehicleSpecs` | Server | Specificatie-tabel: 2-kolom layout met alle technische gegevens |
| `FinancingCalculator` | Client | Interactieve calculator: aankoopprijs, aanbetaling, looptijd, rente → maandbedrag |
| `TestDriveForm` | Client | Proefrit aanvraagformulier: voertuig (auto-ingevuld), naam, email, telefoon, voorkeursdatum |
| `TradeInForm` | Client | Inruilformulier: kenteken (met RDW lookup), km-stand, staat, opmerkingen |
| `WorkshopBookingForm` | Client | Werkplaatsafspraak: dienst, kenteken, datum/tijd, gegevens |
| `ApkBadge` | Server | APK-status badge: geldig (groen), bijna verlopen (oranje), verlopen (rood) |
| `VehicleCompare` | Client | Vergelijkingsview: 2-3 voertuigen naast elkaar op alle specificaties |

**Pad:** `src/branches/automotive/components/<ComponentName>/`

---

## Fase 3: Blocks (4 stuks)

| Block | Velden | Beschrijving |
|-------|--------|-------------|
| `VehicleGrid` | heading, limit, columns, fuelFilter, bodyTypeFilter, showPrice | Grid van voertuigen, fetcht `vehicles` where `status: 'beschikbaar'` |
| `FeaturedVehicles` | heading, limit, layout (grid/carousel) | Uitgelichte voertuigen |
| `WorkshopServices` | heading, limit, showPrices | Werkplaatsdiensten grid, fetcht `content-services` where `branch: 'automotive'` |
| `TradeInCTA` | heading, description, showCalculator | Inruil CTA-sectie met optionele calculator |

**Pad:** `src/branches/automotive/blocks/<BlockName>/`

**Registratie:** Conditioneel via `isFeatureEnabled('automotive')` in Pages collection.

---

## Fase 4: Templates (6 pagina-templates)

| Template | Route | Beschrijving |
|----------|-------|-------------|
| `VehiclesArchive` | `/occasions` | Voertuig overzicht met uitgebreide filters, grid/lijst toggle |
| `VehicleDetail` | `/occasions/[slug]` | 2-kolom: galerij + specs + sidebar met prijs, financiering, proefrit CTA |
| `WorkshopArchive` | `/werkplaats` | Werkplaatsdiensten overzicht met prijzen + "Afspraak maken" CTA |
| `WorkshopBooking` | `/afspraak-maken` | Werkplaatsafspraak wizard met RDW kenteken-lookup |
| `TradeInPage` | `/inruilen` | Inruilformulier met kenteken-lookup + indicatieve waarde |
| `ContactTemplate` | `/contact` | Contactformulier, openingstijden, kaart, team |

**Pad:** `src/branches/automotive/templates/<TemplateName>/`

---

## Fase 5: API Routes (4 endpoints)

### 5a. GET `/api/automotive/rdw-lookup`
- **File:** `src/app/api/automotive/rdw-lookup/route.ts`
- Query param: `kenteken` (XX-XXX-X format, stripped of dashes)
- Haalt voertuigdata op via RDW Open Data API: `https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=XXXXX`
- Mapt RDW data naar: merk, model, bouwjaar, brandstof, transmissie, gewicht, cilinderinhoud, vermogen, kleur, carrosserie, APK-vervaldatum
- 1 dag server-side caching
- Returnt: `{ success: true, vehicle: { ... } }` of `{ error: 'Kenteken niet gevonden' }`

### 5b. POST `/api/automotive/test-drive`
- **File:** `src/app/api/automotive/test-drive/route.ts`
- Body: `{ vehicleId, firstName, lastName, email, phone, preferredDate, preferredTime, remarks }`
- Maakt lead aan (of stuurt email notificatie)

### 5c. POST `/api/automotive/trade-in`
- **File:** `src/app/api/automotive/trade-in/route.ts`
- Body: `{ licensePlate, mileage, condition, remarks, firstName, lastName, email, phone }`
- Maakt inruil-aanvraag aan (via `content-inquiries` of direct email)

### 5d. POST `/api/automotive/workshop-booking`
- **File:** `src/app/api/automotive/workshop-booking/route.ts`
- Body: `{ serviceId, licensePlate, vehicleBrand, vehicleModel, date, time, firstName, lastName, email, phone, remarks }`
- Maakt `content-bookings` aan met `branch: 'automotive'`

---

## Fase 6: Hooks (1 hook)

### 6a. `workshopBookingHook.ts`
- **File:** `src/branches/automotive/hooks/workshopBookingHook.ts`
- `CollectionAfterChangeHook` op `content-bookings`
- Filtert op `doc.branch === 'automotive'`

| Status transitie | Actie | Ontvanger |
|-----------------|-------|-----------|
| `new` → `confirmed` | Afspraak Bevestigd (Klant) | Klant |
| `new` → `confirmed` | Afspraak Bevestigd (Werkplaats) | Admin |
| `confirmed` → `cancelled` | Afspraak Geannuleerd (Klant) | Klant |
| `confirmed` → `completed` | Log; review flow | — |

### 6b. Registratie
- Toevoegen aan `content-bookings` afterChange hooks

---

## Fase 7: Pre-built Email Templates (8 templates)

| # | Template | Category | Subject |
|---|----------|----------|---------|
| 1 | Werkplaatsafspraak Bevestigd (Klant) | transactional | Afspraak bevestigd — {{ .ServiceName }} op {{ .Date }} |
| 2 | Werkplaatsafspraak Bevestigd (Werkplaats) | notification | Nieuwe afspraak: {{ .CustomerName }} — {{ .ServiceName }} |
| 3 | Werkplaatsafspraak Herinnering | transactional | Herinnering: afspraak morgen om {{ .Time }} |
| 4 | Werkplaatsafspraak Geannuleerd (Klant) | transactional | Afspraak geannuleerd — {{ .ServiceName }} |
| 5 | Proefrit Aanvraag Ontvangen | transactional | Uw proefrit-aanvraag is ontvangen — {{ .VehicleName }} |
| 6 | Proefrit Aanvraag (Dealer) | notification | Nieuwe proefrit-aanvraag: {{ .CustomerName }} — {{ .VehicleName }} |
| 7 | Inruil Aanvraag Ontvangen | transactional | Uw inruil-aanvraag is ontvangen |
| 8 | APK Herinnering | transactional | APK verlopen of bijna verlopen — {{ .VehicleName }} |

Alle templates: automotive-gradient header (`#FF5722` → `#E65100`), tags `['automotive', 'workshop', 'predefined']`.

---

## Fase 8: Pre-built Automation Flows (3 flows)

### Flow 1: Werkplaats Afspraak Herinnering Flow
- **Trigger:** `custom.event` / `workshop.booking.confirmed`
- **Steps:** tag → wait 1 day → send herinnering → exit

### Flow 2: Na-Bezoek Review Flow
- **Trigger:** `custom.event` / `workshop.booking.completed`
- **Steps:** wait 2 dagen → send review verzoek → wait 5 dagen → send herinnering → exit

### Flow 3: Proefrit Follow-up Flow
- **Trigger:** `custom.event` / `test.drive.requested`
- **Steps:** send proefrit aanvraag bevestiging → tag → exit

---

## Fase 9: Pre-built Chatbot Conversation Flows

### 9a. Automotive Conversation Flows (7 categories)

```
1. Occasions bekijken (type: submenu)
   ├─ Beschikbare auto's → direct: "Welke occasions zijn er op dit moment beschikbaar?"
   ├─ Zoeken op merk/model → input: "Welk merk of model?" placeholder: "Bijv. Volkswagen Golf, BMW 3-serie..."
   ├─ Zoeken op budget → input: "Wat is uw budget?" placeholder: "Bijv. €10.000 - €20.000"
   └─ Elektrische/hybride auto's → direct: "Hebben jullie elektrische of hybride auto's?"

2. Proefrit aanvragen (type: submenu)
   ├─ Proefrit plannen → direct: "Ik wil een proefrit maken"
   ├─ Beschikbaarheid → direct: "Wanneer kan ik langskomen voor een proefrit?"
   └─ Wat meenemen → direct: "Wat moet ik meenemen voor een proefrit?"

3. Werkplaats & Onderhoud (type: submenu)
   ├─ Werkplaatsdiensten → direct: "Welke werkplaatsdiensten bieden jullie aan?"
   ├─ Afspraak maken → direct: "Ik wil een werkplaatsafspraak maken"
   ├─ APK-keuring → direct: "Wat kost een APK-keuring en kan ik direct terecht?"
   ├─ Onderhoud / servicebeurt → direct: "Mijn auto moet op onderhoud. Wat zijn de kosten?"
   └─ Bandenwissel → direct: "Ik wil mijn banden laten wisselen"

4. Inruilen & Financiering (type: submenu)
   ├─ Auto inruilen → direct: "Ik wil mijn auto inruilen. Hoe werkt dat?"
   ├─ Inruilwaarde berekenen → input: "Voer uw kenteken in" placeholder: "Bijv. AB-123-CD"
   ├─ Financieringsmogelijkheden → direct: "Welke financieringsmogelijkheden zijn er?"
   └─ Private lease → direct: "Bieden jullie private lease aan?"

5. Locatie & Openingstijden (type: submenu)
   ├─ Openingstijden → direct: "Wat zijn jullie openingstijden?"
   ├─ Adres & routebeschrijving → direct: "Waar zijn jullie gevestigd?"
   └─ Parkeren → direct: "Is er parkeergelegenheid?"

6. Garantie & Service (type: submenu)
   ├─ Garantie → direct: "Welke garantie zit er op jullie occasions?"
   ├─ BOVAG garantie → direct: "Zijn jullie aangesloten bij BOVAG?"
   ├─ NAP-check → direct: "Hebben jullie voertuigen een NAP-controle?"
   └─ Pechhulp → direct: "Bieden jullie pechhulpdienst aan?"

7. Overige vragen (type: input)
```

### 9b. System Prompt + Training Context + Welcome Message

---

## Fase 10: App Routes

### Nieuwe `(automotive)` routes
| Route | File | Template |
|-------|------|----------|
| `/occasions` | `src/app/(automotive)/occasions/page.tsx` | `VehiclesArchiveTemplate` |
| `/occasions/[slug]` | `src/app/(automotive)/occasions/[slug]/page.tsx` | `VehicleDetailTemplate` |
| `/werkplaats` | `src/app/(automotive)/werkplaats/page.tsx` | `WorkshopArchiveTemplate` |
| `/afspraak-maken` | `src/app/(automotive)/afspraak-maken/page.tsx` | `WorkshopBookingTemplate` |
| `/inruilen` | `src/app/(automotive)/inruilen/page.tsx` | `TradeInTemplate` |
| `/contact` | `src/app/(automotive)/contact/page.tsx` | `ContactTemplate` |

### Layout
- `src/app/(automotive)/layout.tsx` — Feature gate op `ENABLE_AUTOMOTIVE`

---

## Fase 11: Seed Functie

| Content | Collection | Aantal |
|---------|------------|--------|
| Merken | vehicle-brands | 5 (Volkswagen, BMW, Toyota, Renault, Kia) |
| Voertuigen | vehicles | 6 (diverse occasions) |
| Werkplaatsdiensten | content-services | 5 (APK, Kleine beurt, Grote beurt, Bandenwissel, Airco service) |
| Team | content-team | 2 (Hoofdmonteur, Verkoopadviseur) |
| Chatbot flows | chatbot-settings global | 7 flow categories + system prompt + training context |

---

## Implementatievolgorde

1. **Fase 1** — Foundation: collections, branch metadata, content modules, feature flag, lib utilities
2. **Fase 2** — Components: 10 componenten
3. **Fase 3** — Blocks: 4 blocks (registratie in Pages)
4. **Fase 4** — Templates: 6 pagina-templates
5. **Fase 5** — API Routes: RDW lookup, proefrit, inruil, werkplaats booking
6. **Fase 6** — Hooks: workshopBookingHook + registratie
7. **Fase 7** — Email Templates: 8 pre-built templates
8. **Fase 8** — Email Flows: 3 automation flows
9. **Fase 9** — Chatbot: predefined conversation flows + seed
10. **Fase 10** — App Routes: nieuwe routes
11. **Fase 11** — Seed: complete seedAutomotive() functie

---

## Referentiebestanden

| Bestand | Reden |
|---------|-------|
| `src/branches/horeca/index.ts` | Branch metadata pattern |
| `src/branches/beauty/hooks/bookingStatusHook.ts` | Hook + email pattern |
| `src/branches/zorg/components/AppointmentForm/Component.tsx` | Multi-step form wizard |
| `src/features/email-marketing/lib/predefined/templates.ts` | Email template pattern |
| `src/features/email-marketing/lib/predefined/flows.ts` | Automation flow pattern |
| `src/features/ai/lib/predefined/conversationFlows.ts` | Chatbot flows pattern |
| `src/endpoints/seed/templates/zorg.ts` | Seed functie pattern |
| `src/branches/shared/collections/ContentBookings/index.ts` | Booking schema |
| `src/branches/shared/collections/ContentServices/index.ts` | Services schema |
| `docs/design/automotive/` | 4 HTML designs (occasions, detail, inruil, werkplaats) |
| `docs/roadmap/branches/AUTOMOTIVE.md` | Oorspronkelijke roadmap |

---

## Verificatie

1. `/occasions` toont voertuigen met filters op merk, prijs, brandstof, etc.
2. `/occasions/[slug]` toont voertuig detail met galerij, specs, financieringsvoorbeeld
3. `/werkplaats` toont diensten met prijzen
4. `/afspraak-maken` toont werkplaatsafspraak-wizard met kenteken-lookup
5. `/inruilen` toont inruilformulier met RDW kenteken-lookup
6. `GET /api/automotive/rdw-lookup?kenteken=XXXXX` haalt voertuigdata op
7. Status wijziging `confirmed` stuurt bevestigingsemail
8. `POST /api/email-marketing/seed-predefined` → 8 nieuwe automotive templates
9. Chatbot widget → 7 flow categories
10. seedAutomotive() → 5 merken, 6 voertuigen, 5 diensten, 2 teamleden
11. `ENABLE_AUTOMOTIVE=true` → deploy

---

## Migratie

Omdat automotive **eigen collecties** introduceert (vehicles, vehicle-brands), wordt `schema-push.ts` bij deploy automatisch de tabellen aanmaken. Geen handmatige migratie nodig.

Nieuwe velden in unified collections (licensePlate, vehicleBrand, vehicleModel, vehicleType) worden eveneens automatisch toegevoegd via schema-push.

---

## Uniek voor Automotive

### RDW Kenteken Lookup
De RDW Open Data API (`opendata.rdw.nl`) biedt gratis voertuigdata:
- Endpoint: `https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=XXXXX`
- Returnt: merk, handelsbenaming, bouwjaar, brandstof, inrichting, massa, cilinderinhalt, etc.
- Extra endpoint voor APK: `https://opendata.rdw.nl/resource/sgfe-77wx.json?kenteken=XXXXX`
- Rate limit: geen expliciete limiet, maar respectvolle caching (1 dag) is gewenst

### Financieringscalculator
Eenvoudige annuïteitenberekening:
```
maandbedrag = (bedrag × maandrente × (1 + maandrente)^looptijd) / ((1 + maandrente)^looptijd - 1)
```
Met inputs: aankoopprijs, aanbetaling, looptijd (12-72 maanden), rente (1-15%).
