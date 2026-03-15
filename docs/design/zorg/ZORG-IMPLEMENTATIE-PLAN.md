# Zorg & Praktijk Branch — Volledige Implementatie Plan

> **Status:** Gepland
> **Datum:** 2026-03-13
> **Branch:** `ENABLE_ZORG=true`
> **Branchenaam:** `zorg` (Display: "Zorg & Praktijk")

## Naamkeuze

De naam **`zorg`** is gekozen omdat:
- Het een herkenbare Nederlandse sectorterm is (net als "horeca")
- Het breed genoeg is voor: fysiotherapeuten, tandartsen, huisartsen, psychologen, osteopaten, logopedisten, diëtisten, podologen, etc.
- De content module defaults al staan onder `zorg` in `contentModules.ts`
- De unified collections al zorg-specifieke velden hebben (`insurance`, `birthDate`, `insuranceProvider`, `complaint`, `hasReferral`, `successRate`)

## Context

De zorg branch (`ENABLE_ZORG=true`) wordt volledig gebouwd naar het patroon van de beauty en horeca branches. Dit omvat: blocks, components, templates, hooks, lib utilities, API routes, pre-built email templates, automation flows, en pre-built chatbot conversation flows. Alles hergebruikt bestaande unified content collections met `branch: 'zorg'`. Geen nieuwe database migraties nodig — alle zorg-specifieke velden bestaan al.

Zorg-specifieke velden in ContentServices: `insurance` (covered/partial/not-covered), `successRate` (0-100%).
Zorg-specifieke velden in ContentBookings: `birthDate`, `insuranceProvider` (7 verzekeraars), `complaint` (klacht/reden), `hasReferral` (geen/huisarts/specialist).

Content module defaults (Settings > siteBranch = 'zorg'):
- services: label "Behandelingen", routeSlug "behandelingen", defaultEnabled: **true**
- bookings: label "Afspraken", routeSlug "afspraak-maken", defaultEnabled: **true**
- team: label "Behandelaars", routeSlug "team", defaultEnabled: **true**
- reviews: label "Reviews", defaultEnabled: **true**
- cases: label "Resultaten", routeSlug "resultaten", defaultEnabled: **false**
- activities: label "Workshops", routeSlug "workshops", defaultEnabled: **false**
- inquiries: label "Intake-aanvraag", routeSlug "intake", defaultEnabled: **false**

---

## Fase 1: Foundation — Branch Metadata + Lib Utilities

### 1a. Branch metadata herschrijven
- **File:** `src/branches/zorg/index.ts` (nieuw)
- Volgt exact pattern van `src/branches/horeca/index.ts`
- Exporteert: `branchMetadata`, block configs, template slugs

### 1b. Lib utilities aanmaken

| File | Beschrijving |
|------|-------------|
| `src/branches/zorg/lib/analytics.ts` | `trackZorgEvent()` — GA4 events: appointment_form_start, treatment_view, referral_check, etc. |
| `src/branches/zorg/lib/appointmentUtils.ts` | `generateTimeSlots()`, `formatDuration()`, `formatInsurance()`, `formatReferral()`, `getInsuranceLabel()` |

---

## Fase 2: Components (8 stuks)

Alle volgen `Component.tsx` + `types.ts` + `index.ts` pattern. Geen hardcoded kleuren.

| Component | Type | Beschrijving |
|-----------|------|-------------|
| `TreatmentCard` | Server | Behandeling-card met duur, prijs, verzekeringsstatus, "Afspraak maken" knop |
| `PractitionerCard` | Server | Behandelaar met avatar, specialisatie, BIG-registratie, beschikbaarheid |
| `AppointmentForm` | Client | 3-staps wizard: Behandeling/Behandelaar → Datum/Tijd → Gegevens (incl. geboortedatum, verzekeraar, klacht, verwijzing) |
| `AppointmentSidebar` | Client | Sticky sidebar met afspraak-overzicht + verzekeringsinformatie |
| `InsuranceBadge` | Server | Badge voor verzekeringsstatus (vergoed/gedeeltelijk/niet vergoed) + tooltip |
| `ReferralNotice` | Server | Informatiebox over verwijzing (huisarts/specialist) met instructies |
| `OpeningHours` | Server | Weekoverzicht spreekuren met ochtend/middag kolommen |
| `ReviewCard` | Server | Patiëntreview met sterren + behandelingstype |

**Pad:** `src/branches/zorg/components/<ComponentName>/`

---

## Fase 3: Blocks (3 stuks)

| Block | Velden | Beschrijving |
|-------|--------|-------------|
| `TreatmentGrid` | heading, source (auto/manual), limit, columns, showInsurance | Grid van behandelingen, fetcht `content-services` where `branch: 'zorg'` |
| `ZorgTeamShowcase` | heading, source, limit, columns, showSpecialties | Team grid, fetcht `content-team` where `branch: 'zorg'` |
| `PatientReviews` | heading, source, limit, showTreatmentType | Reviews grid, fetcht `content-reviews` where `branch: 'zorg'` |

**Pad:** `src/branches/zorg/blocks/<BlockName>/`

**Registratie:** Conditioneel via `isFeatureEnabled('zorg')` in Pages collection.

---

## Fase 4: Templates (5 pagina-templates, GEEN homepage)

| Template | Route | Beschrijving |
|----------|-------|-------------|
| `TreatmentsArchive` | `/behandelingen` | Behandelingen overzicht met verzekeringsstatus-filter + specialisatie-filter |
| `TreatmentDetail` | `/behandelingen/[slug]` | 2-kolom: behandeling-info + sidebar met verzekering, "Afspraak maken" CTA |
| `AppointmentWizard` | `/afspraak-maken` | AppointmentForm + AppointmentSidebar, 3-staps wizard |
| `TeamArchive` | `/team` | Behandelaars overzicht met specialisatie + beschikbaarheid |
| `ContactTemplate` | `/contact` | Spreekuren, contactformulier, kaart, spoedinfo |

**Pad:** `src/branches/zorg/templates/<TemplateName>/`

Homepage via CMS Pages + shared blocks (Hero, Features, StatsCounter) + zorg blocks (TreatmentGrid, ZorgTeamShowcase).

---

## Fase 5: API Routes (2 endpoints)

### 5a. POST `/api/zorg/appointment`
- **File:** `src/app/api/zorg/appointment/route.ts`
- Accepteert: `{ serviceId, staffMemberId?, date, time, firstName, lastName, email, phone, birthDate?, insuranceProvider?, complaint?, hasReferral?, remarks? }`
- Maakt `content-bookings` aan met `branch: 'zorg'`, `status: 'new'`
- Stuurt bevestigingsemail naar patiënt + notificatie naar praktijk

### 5b. GET `/api/zorg/availability`
- **File:** `src/app/api/zorg/availability/route.ts`
- Query params: `serviceId`, `staffMemberId?`, `date` (YYYY-MM)
- Berekent beschikbare tijdslots (ochtend 08:00-12:00, middag 13:00-17:00)
- Weekenden gesloten, houdt rekening met behandelingsduur
- Returnt: `{ dates: [{ date, slots: [{ time, available }] }] }`

---

## Fase 6: Hooks (1 hook)

### 6a. `appointmentStatusHook.ts`
- **File:** `src/branches/zorg/hooks/appointmentStatusHook.ts`
- `CollectionAfterChangeHook` op `content-bookings` (geregistreerd naast bestaande hooks)
- Filtert op `doc.branch === 'zorg'`

| Status transitie | Actie | Ontvanger |
|-----------------|-------|-----------|
| `new` → `confirmed` | Afspraak Bevestigd (Patiënt) | Patiënt |
| `new` → `confirmed` | Afspraak Bevestigd (Praktijk) | Praktijk (admin) |
| `confirmed` → `cancelled` | Afspraak Geannuleerd (Patiënt) | Patiënt |
| `confirmed` → `cancelled` | Afspraak Geannuleerd (Praktijk) | Praktijk (admin) |
| `confirmed` → `completed` | Log; review flow triggert later | — |
| `confirmed` → `no-show` | No-show registratie | Praktijk (admin, console) |

### 6b. Registratie
- **File:** `src/branches/shared/collections/ContentBookings/index.ts`
- Toevoegen: `appointmentStatusHook` naast bestaande `bookingStatusHook` en `reservationStatusHook`

---

## Fase 7: Pre-built Email Templates (8 templates)

Toevoegen aan `src/features/email-marketing/lib/predefined/templates.ts`:

| # | Template | Category | Subject |
|---|----------|----------|---------|
| 1 | Afspraak Bevestigd (Patiënt) | transactional | Afspraak bevestigd — {{ .TreatmentName }} op {{ .Date }} |
| 2 | Afspraak Bevestigd (Praktijk) | notification | Nieuwe afspraak: {{ .PatientName }} — {{ .TreatmentName }} |
| 3 | Afspraak Herinnering | transactional | Herinnering: afspraak morgen om {{ .Time }} |
| 4 | Afspraak Geannuleerd (Patiënt) | transactional | Afspraak geannuleerd — {{ .TreatmentName }} |
| 5 | Afspraak Geannuleerd (Praktijk) | notification | Afspraak geannuleerd: {{ .PatientName }} |
| 6 | Afspraak Verzet (Patiënt) | transactional | Afspraak verzet — {{ .TreatmentName }} op {{ .NewDate }} |
| 7 | Intake Formulier Ontvangen | transactional | Uw intake-aanvraag is ontvangen |
| 8 | Review Verzoek (Na Behandeling) | transactional | Hoe was uw behandeling, {{ .PatientName }}? |

Alle templates: zorg-gradient header (`#059669` → `#0891b2`), tags `['zorg', 'appointment', 'predefined']`.

---

## Fase 8: Pre-built Automation Flows (3 flows)

### Flow 1: Afspraak Herinnering Flow
- **Trigger:** `custom.event` / `appointment.confirmed`
- **Steps:** tag → wait 1 day → send herinnering → exit

### Flow 2: Na-Behandeling Review Flow
- **Trigger:** `custom.event` / `appointment.completed`
- **Steps:** wait 2 dagen → send review verzoek → wait 5 dagen → send herinnering → exit

### Flow 3: Intake Follow-up Flow
- **Trigger:** `custom.event` / `appointment.confirmed`
- **Entry condition:** `hasReferral !== 'no'`
- **Steps:** send intake formulier details → tag → exit

---

## Fase 9: Pre-built Chatbot Conversation Flows

### 9a. Zorg Conversation Flows (7 categories)

```
1. Afspraak maken (type: submenu)
   ├─ Afspraak plannen → direct: "Ik wil een afspraak maken"
   ├─ Eerste consult / intake → direct: "Ik wil een eerste consult of intake plannen"
   ├─ Vervolg afspraak → direct: "Ik wil een vervolgafspraak maken"
   └─ Spoedafspraak → direct: "Ik heb een spoedvraag en wil zo snel mogelijk terecht"

2. Behandelingen & Tarieven (type: submenu)
   ├─ Alle behandelingen bekijken → direct: "Welke behandelingen bieden jullie aan?"
   ├─ Tarieven & vergoedingen → direct: "Wat zijn jullie tarieven en wat wordt vergoed?"
   ├─ Wordt mijn behandeling vergoed? → input: "Welke behandeling?" placeholder: "Bijv. fysiotherapie, manuele therapie..."
   └─ Hoe lang duurt een behandeling? → input: "Welke behandeling?" placeholder: "Bijv. intake, controle..."

3. Verwijzing & Verzekering (type: submenu)
   ├─ Heb ik een verwijzing nodig? → direct: "Heb ik een verwijzing van de huisarts nodig?"
   ├─ Welke verzekeraars werken jullie mee? → direct: "Met welke zorgverzekeraars werken jullie samen?"
   └─ Declaratie indienen → direct: "Hoe kan ik mijn behandeling declareren?"

4. Onze Behandelaars (type: submenu)
   ├─ Team bekijken → direct: "Wie zijn jullie behandelaars en wat zijn hun specialisaties?"
   ├─ Specifieke behandelaar → input: "Welke behandelaar?" placeholder: "Bijv. naam of specialisatie..."
   └─ BIG-registratie → direct: "Zijn jullie behandelaars BIG-geregistreerd?"

5. Locatie & Spreekuren (type: submenu)
   ├─ Spreekuren → direct: "Wat zijn jullie spreekuren?"
   ├─ Adres & routebeschrijving → direct: "Waar is de praktijk gevestigd?"
   ├─ Parkeren → direct: "Is er parkeergelegenheid bij de praktijk?"
   └─ Bereikbaarheid (OV) → direct: "Hoe kom ik er met het OV?"

6. Afspraak wijzigen of annuleren (type: submenu)
   ├─ Afspraak verzetten → input: "Voer je afspraaknummer in" placeholder: "Bijv. AF-12345"
   ├─ Afspraak annuleren → input: "Voer je afspraaknummer in" placeholder: "Bijv. AF-12345"
   └─ Annuleringsbeleid → direct: "Wat is jullie annuleringsbeleid?"

7. Overige vragen (type: input)
```

### 9b. Zorg System Prompt + Training Context + Welcome Message

---

## Fase 10: App Routes (nieuw)

### Nieuwe `(zorg)` routes
| Route | File | Template |
|-------|------|----------|
| `/behandelingen` | `src/app/(zorg)/behandelingen/page.tsx` | `TreatmentsArchiveTemplate` |
| `/behandelingen/[slug]` | `src/app/(zorg)/behandelingen/[slug]/page.tsx` | `TreatmentDetailTemplate` |
| `/afspraak-maken` | `src/app/(zorg)/afspraak-maken/page.tsx` | `AppointmentWizardTemplate` |
| `/team` | `src/app/(zorg)/team/page.tsx` | `TeamArchiveTemplate` |
| `/contact` | `src/app/(zorg)/contact/page.tsx` | `ContactTemplate` |

### Layout
- `src/app/(zorg)/layout.tsx` — Feature gate op `ENABLE_ZORG`

---

## Fase 11: Seed Functie Compleet

| Content | Collection | Aantal |
|---------|------------|--------|
| Behandelingen | content-services | 6 (Fysiotherapie, Manuele therapie, Sportfysiotherapie, Dry needling, Echografie, Kinderfysiotherapie) |
| Behandelaars | content-team | 3 (Fysiotherapeut, Manueel therapeut, Sportfysiotherapeut) |
| Chatbot flows | chatbot-settings global | 7 flow categories + system prompt + training context |

---

## Implementatievolgorde

1. **Fase 1** — Foundation: branch metadata + lib utilities
2. **Fase 2** — Components: 8 componenten
3. **Fase 3** — Blocks: 3 blocks (registratie in Pages)
4. **Fase 4** — Templates: 5 pagina-templates
5. **Fase 5** — API Routes: appointment + availability endpoints
6. **Fase 6** — Hooks: appointmentStatusHook + registratie
7. **Fase 7** — Email Templates: 8 pre-built templates
8. **Fase 8** — Email Flows: 3 automation flows
9. **Fase 9** — Chatbot: predefined conversation flows + seed
10. **Fase 10** — App Routes: nieuwe routes
11. **Fase 11** — Seed: complete seedZorg() functie

---

## Referentiebestanden

| Bestand | Reden |
|---------|-------|
| `src/branches/horeca/index.ts` | Branch metadata pattern |
| `src/branches/beauty/hooks/bookingStatusHook.ts` | Hook + email pattern |
| `src/branches/beauty/components/BookingForm/Component.tsx` | Multi-step form wizard |
| `src/branches/beauty/components/BookingSidebar/Component.tsx` | Sidebar pattern |
| `src/features/email-marketing/lib/predefined/templates.ts` | Email template pattern |
| `src/features/email-marketing/lib/predefined/flows.ts` | Automation flow pattern |
| `src/features/ai/lib/predefined/conversationFlows.ts` | Chatbot flows pattern |
| `src/endpoints/seed/templates/beauty.ts` | Seed functie pattern |
| `src/branches/shared/collections/ContentBookings/index.ts` | Booking schema met zorg velden |
| `src/branches/shared/collections/ContentServices/index.ts` | Services schema met zorg velden |

---

## Verificatie

1. `/behandelingen` toont behandelingen met verzekeringsstatus
2. `/afspraak-maken` toont 3-staps wizard, submit maakt afspraak in content-bookings
3. `/team` toont behandelaars met specialisaties
4. Status wijziging `confirmed` stuurt bevestigingsemail
5. `POST /api/email-marketing/seed-predefined` → 8 nieuwe zorg templates
6. Chatbot widget → 7 flow categories
7. seedZorg() → 6 behandelingen, 3 behandelaars, chatbot flows
8. `ENABLE_ZORG=true` in zorg01 `.env` → deploy via `deploy-ploi.sh`

---

## Geen Migraties Nodig

Alle zorg-specifieke velden bestaan al:
- `content-services`: `insurance` (covered/partial/not-covered), `successRate` (0-100%) (conditional op `branch: 'zorg'`)
- `content-services`: `duration`, `price`, `priceFrom`, `priceTo`, `bookable` (conditional op `['beauty', 'zorg']`)
- `content-bookings`: `birthDate`, `insuranceProvider` (7 verzekeraars), `complaint`, `hasReferral` (conditional op `branch: 'zorg'`)
- `chatbot-settings`: `conversationFlows` array (reeds gemigreerd)
