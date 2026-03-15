# Beauty Branch — Volledige Implementatie Plan

> **Status:** In uitvoering
> **Datum:** 2026-03-13
> **Branch:** `ENABLE_BEAUTY=true`

## Context

De beauty branch moet volledig worden gebouwd naar het patroon van de construction branch. Dit omvat: blocks, components, templates, hooks, lib utilities, API routes, pre-built email templates, automation flows, en pre-built chatbot conversation flows. Alles hergebruikt bestaande unified content collections (`content-services`, `content-team`, `content-bookings`, `content-cases`, `content-reviews`) met `branch: 'beauty'`. Geen nieuwe database migraties nodig — alle beauty-specifieke velden bestaan al.

Dit plan dient als blauwdruk die hergebruikt kan worden voor toekomstige branches (horeca, hospitality, etc.).

---

## Fase 1: Foundation — Branch Metadata + Lib Utilities

### 1a. Branch metadata herschrijven
- **File:** `src/branches/beauty/index.ts` (bestaand stub → volledig herschrijven)
- Volgt exact pattern van `src/branches/construction/index.ts`
- Exporteert: `branchMetadata`, block configs, template slugs

### 1b. Lib utilities aanmaken

| File | Beschrijving |
|------|-------------|
| `src/branches/beauty/lib/analytics.ts` | `trackBeautyEvent()` — GA4 events: booking_form_start, treatment_view, etc. |
| `src/branches/beauty/lib/bookingUtils.ts` | `generateTimeSlots()`, `calculateBookingPrice()`, `formatDuration()`, `isSlotAvailable()` |
| `src/branches/beauty/lib/ical.ts` | `generateBookingICS()` — ICS/iCal string voor agenda-integratie |

---

## Fase 2: Components (8 stuks)

Alle volgen `Component.tsx` + `types.ts` + `index.ts` pattern. Geen hardcoded kleuren — alles via `var(--color-primary)`, `var(--color-secondary)`, etc.

| Component | Type | Beschrijving |
|-----------|------|-------------|
| `TreatmentCard` | Server | Service card met duur, prijs, "Boek nu" knop |
| `StylistCard` | Server | Team member met avatar, specialismen, beschikbaarheid |
| `BookingForm` | Client | 4-staps wizard: Behandeling → Specialist → Datum/Tijd → Gegevens |
| `BookingSidebar` | Client | Sticky sidebar met boekingsoverzicht + garanties |
| `PortfolioCard` | Server | Before/after vergelijkingskaart |
| `CategoryFilter` | Client | Horizontale pill-filter (Haar, Nagels, Huid, Massage, Bruidszorg) |
| `OpeningHours` | Server | Weekoverzicht openingstijden uit settings |
| `ReviewCard` | Server | Klantreview met sterren + behandelingstype |

**Pad:** `src/branches/beauty/components/<ComponentName>/`

**BookingForm** importeert `AvailabilityCalendar` van `@/branches/experiences/components/booking/AvailabilityCalendar` — NIET dupliceren.

---

## Fase 3: Blocks (3 stuks)

Alle volgen Payload Block config pattern met `Component.tsx` + `types.ts` + `index.ts`.

| Block | Velden | Beschrijving |
|-------|--------|-------------|
| `TreatmentGrid` | heading, source (auto/manual), limit, columns, categoryFilter | Grid van behandelingen, fetcht `content-services` where `branch: 'beauty'` |
| `PortfolioGrid` | heading, source, limit, columns, showBeforeAfter | Before/after galerij, fetcht `content-cases` where `branch: 'beauty'` |
| `TeamShowcase` | heading, source, limit, columns, showBookButton | Team grid, fetcht `content-team` where `branch: 'beauty'` |

**Pad:** `src/branches/beauty/blocks/<BlockName>/`

**Registratie in Pages collection:** Conditioneel via `isFeatureEnabled('beauty')` — zelfde patroon als construction blocks.

---

## Fase 4: Templates (5 pagina-templates, GEEN homepage)

| Template | Route | Beschrijving |
|----------|-------|-------------|
| `TreatmentsArchive` | `/behandelingen` | Services overzicht met CategoryFilter + TreatmentCard grid |
| `TreatmentDetail` | `/behandelingen/[slug]` | 2-kolom: content + sidebar met boek-CTA |
| `BookingWizard` | `/boeken` | BookingForm + BookingSidebar, 4-staps wizard |
| `PortfolioArchive` | `/portfolio` | Before/after galerij met filter op behandelingstype |
| `ContactTemplate` | `/contact` | Openingstijden, contactformulier, kaart, teamkaarten |

**Pad:** `src/branches/beauty/templates/<TemplateName>/`

Homepage wordt samengesteld in CMS via shared blocks (Hero, StatsCounter, Testimonials) + beauty blocks (TreatmentGrid, TeamShowcase).

---

## Fase 5: API Routes (2 endpoints)

### 5a. POST `/api/beauty/booking`
- **File:** `src/app/api/beauty/booking/route.ts`
- Accepteert: `{ serviceId, staffMemberId?, date, time, firstName, lastName, email, phone, isFirstVisit, remarks? }`
- Maakt `content-bookings` aan met `branch: 'beauty'`, `status: 'new'`
- Stuurt bevestigingsemail naar klant + notificatie naar admin
- Volgt pattern van `/api/contact/route.ts`

### 5b. GET `/api/beauty/availability`
- **File:** `src/app/api/beauty/availability/route.ts`
- Query params: `serviceId`, `staffMemberId?`, `date` (YYYY-MM)
- Berekent beschikbare tijdslots o.b.v. service duur, team beschikbaarheid, bestaande boekingen
- Returnt: `{ dates: [{ date, slots: [{ time, available }] }] }`

---

## Fase 6: Hooks (2 hooks)

### 6a. `bookingStatusHook.ts`
- **File:** `src/branches/beauty/hooks/bookingStatusHook.ts`
- `CollectionAfterChangeHook` op `content-bookings` (geregistreerd in shared collection)
- Filtert op `doc.branch === 'beauty'` — veilig voor andere branches

| Status transitie | Actie | Ontvanger |
|-----------------|-------|-----------|
| `new` → `confirmed` | Afspraak Bevestiging (Klant) | Klant |
| `new` → `confirmed` | Afspraak Bevestiging (Admin) | Admin + specialist |
| `new` → `confirmed` + `isFirstVisit` | Eerste Bezoek Welkom | Klant (extra) |
| `confirmed` → `cancelled` | Afspraak Geannuleerd (Klant) | Klant |
| `confirmed` → `cancelled` | Afspraak Geannuleerd (Admin) | Admin |
| `confirmed` → `completed` | Logt; review flow triggert later | — |
| `confirmed` → `no-show` | Intern log | Admin (console) |

### 6b. Registratie
- **File:** `src/branches/shared/collections/ContentBookings/index.ts`
- Toevoegen: `afterChange: [bookingStatusHook]`

---

## Fase 7: Pre-built Email Templates (8 templates)

Toevoegen aan `src/features/email-marketing/lib/predefined/templates.ts`:

| # | Template | Category | Subject |
|---|----------|----------|---------|
| 1 | Afspraak Bevestiging (Klant) | transactional | Afspraak bevestigd — {{ .ServiceName }} op {{ .AppointmentDate }} |
| 2 | Afspraak Bevestiging (Admin) | notification | Nieuwe afspraak: {{ .CustomerName }} — {{ .ServiceName }} |
| 3 | Afspraak Herinnering | transactional | Herinnering: {{ .ServiceName }} morgen om {{ .AppointmentTime }} |
| 4 | Afspraak Geannuleerd (Klant) | transactional | Afspraak geannuleerd — {{ .ServiceName }} |
| 5 | Afspraak Geannuleerd (Admin) | notification | Afspraak geannuleerd: {{ .CustomerName }} |
| 6 | Afspraak Verzet (Klant) | transactional | Afspraak verzet — {{ .ServiceName }} op {{ .NewDate }} |
| 7 | Eerste Bezoek Welkom | welcome | Welkom bij {{ .SalonName }}! Alles over je eerste bezoek |
| 8 | Review Verzoek (Na Behandeling) | transactional | Hoe was je {{ .ServiceName }}, {{ .CustomerName }}? |

Alle templates: `baseStyle` hergebruiken, beauty-gradient header (`#ec4899` → `#8b5cf6`), tags `['beauty', 'booking', 'predefined']`.

---

## Fase 8: Pre-built Automation Flows (3 flows)

Toevoegen aan `src/features/email-marketing/lib/predefined/flows.ts`:

### Flow 1: Afspraak Herinnering Flow
- **Trigger:** `custom.event` / `booking.confirmed`
- **Steps:** tag booking-confirmed → wait 1 day → send "Afspraak Herinnering" → tag reminder-sent → exit

### Flow 2: Na-Behandeling Review Flow
- **Trigger:** `custom.event` / `booking.completed`
- **Steps:** wait 2 dagen → send "Review Verzoek" → tag review-requested → wait 5 dagen → send herinnering → exit

### Flow 3: Eerste Bezoek Onboarding
- **Trigger:** `custom.event` / `booking.confirmed`
- **Entry condition:** `isFirstVisit = true`
- **Steps:** send "Eerste Bezoek Welkom" → tag first-visit-welcomed → exit

---

## Fase 9: Pre-built Chatbot Conversation Flows

### 9a. Predefined Flows bestand
- **File:** `src/features/ai/lib/predefined/conversationFlows.ts` (NIEUW)

### 9b. Beauty Conversation Flows (7 categories)

```
1. Afspraak boeken (type: submenu)
   ├─ Knippen & Styling
   ├─ Kleuren & Highlights
   ├─ Gezichtsbehandeling
   ├─ Nagels (manicure/pedicure)
   ├─ Massage
   └─ Bruidsverzorging

2. Behandelingen & Prijzen (type: submenu)
   ├─ Alle behandelingen bekijken
   ├─ Prijslijst
   ├─ Hoe lang duurt een behandeling?
   └─ Aanbevelingen voor mij

3. Onze Specialisten (type: direct)

4. Locatie & Openingstijden (type: submenu)
   ├─ Openingstijden
   ├─ Adres & routebeschrijving
   ├─ Parkeren
   └─ Bereikbaarheid (OV)

5. Afspraak wijzigen of annuleren (type: submenu)
   ├─ Afspraak verzetten
   ├─ Afspraak annuleren
   └─ Annuleringsbeleid

6. Cadeaubonnen & Acties (type: submenu)
   ├─ Cadeaubon kopen
   ├─ Cadeaubon inwisselen
   └─ Lopende acties

7. Overige vragen (type: input)
```

### 9c. Beauty System Prompt + Training Context + Welcome Message
Meegeleverd als pre-built teksten voor chatbot-settings global.

### 9d. Seed functie
- **File:** `src/endpoints/seed/templates/beauty.ts`
- Seeds: content-services (6), content-team (3), content-cases (2), chatbot-settings

---

## Fase 10: App Routes (refactor bestaande)

### Bestaande `(beauty)` routes updaten
| Route | File | Template |
|-------|------|----------|
| `/behandelingen` | `src/app/(beauty)/behandelingen/page.tsx` | `TreatmentsArchiveTemplate` |
| `/behandelingen/[slug]` | `src/app/(beauty)/behandelingen/[slug]/page.tsx` | `TreatmentDetailTemplate` |
| `/boeken` | `src/app/(beauty)/boeken/page.tsx` | `BookingWizardTemplate` |
| `/portfolio` | `src/app/(beauty)/portfolio/page.tsx` | `PortfolioArchiveTemplate` |
| `/contact` | `src/app/(beauty)/contact/page.tsx` | `ContactTemplate` |

### Routes te verwijderen
- `(beauty)/treatments/` → vervangen door `behandelingen/`
- `(beauty)/booking/` → vervangen door `boeken/`
- `(beauty)/salon/` → verwijderen (homepage via CMS Pages + shared blocks)

---

## Fase 11: Seed Functie Compleet

| Content | Collection | Aantal |
|---------|------------|--------|
| Behandelingen | content-services | 6 (Knippen, Kleuren, Gezichtsbehandeling, Manicure, Massage, Bruidsmake-up) |
| Specialisten | content-team | 3 (Stylist, Huidspecialist, Nagelstyliste) |
| Portfolio cases | content-cases | 2 (before/after voorbeeld) |
| Chatbot flows | chatbot-settings global | 7 flow categories + system prompt + training context |

---

## Implementatievolgorde

1. **Fase 1** — Foundation: branch metadata + lib utilities
2. **Fase 2** — Components: 8 componenten
3. **Fase 3** — Blocks: 3 blocks, registreren in Pages
4. **Fase 4** — Templates: 5 pagina-templates
5. **Fase 5** — API Routes: booking + availability endpoints
6. **Fase 6** — Hooks: bookingStatusHook + registratie
7. **Fase 7** — Email Templates: 8 pre-built templates
8. **Fase 8** — Email Flows: 3 automation flows
9. **Fase 9** — Chatbot: predefined conversation flows + seed
10. **Fase 10** — App Routes: refactor bestaande routes
11. **Fase 11** — Seed: complete seedBeauty() functie

---

## Referentiebestanden

| Bestand | Reden |
|---------|-------|
| `src/branches/construction/index.ts` | Branch metadata pattern |
| `src/branches/construction/hooks/quoteRequestHook.ts` | Hook + email pattern |
| `src/branches/experiences/components/booking/AvailabilityCalendar/` | Herbruikbare kalender |
| `src/branches/experiences/templates/ExperienceBooking/index.tsx` | Multi-step booking wizard |
| `src/features/email-marketing/lib/predefined/templates.ts` | Email template pattern |
| `src/features/email-marketing/lib/predefined/flows.ts` | Automation flow pattern |
| `src/features/ai/globals/ChatbotSettings.ts` | Chatbot global schema |
| `src/features/ai/components/chatbot/types.ts` | ConversationFlow interface |
| `src/endpoints/seed/templates/construction.ts` | Seed functie pattern |
| `src/branches/shared/collections/ContentBookings/index.ts` | Booking collection schema |

---

## Verificatie

1. `/behandelingen` toont grid van services met CategoryFilter
2. `/boeken` toont 4-staps wizard, submit maakt booking aan
3. `/portfolio` toont before/after galerij
4. Status wijziging `confirmed` stuurt bevestigingsemail
5. `POST /api/email-marketing/seed-predefined` → 8 beauty templates zichtbaar
6. Chatbot widget → 7 flow categories zichtbaar
7. seedBeauty() → 6 behandelingen, 3 specialisten, chatbot flows
8. `ENABLE_BEAUTY=true` → deploy via `deploy-ploi.sh`

---

## Geen Migraties Nodig

Alle beauty-specifieke velden bestaan al in de unified content collections:
- `content-services`: `duration`, `price`, `priceFrom`, `priceTo`, `bookable`
- `content-bookings`: `isFirstVisit`, `staffMember`, `service`
- `content-team`: `specialties`, `qualifications`, `workDays`, `bookable`
- `chatbot-settings`: `conversationFlows` array
