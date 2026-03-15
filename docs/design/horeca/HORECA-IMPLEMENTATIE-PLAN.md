# Horeca Branch — Volledige Implementatie Plan

> **Status:** In uitvoering
> **Datum:** 2026-03-13
> **Branch:** `ENABLE_HORECA=true`

## Context

De horeca branch (`ENABLE_HORECA=true`) moet volledig worden gebouwd naar het patroon van de beauty branch. Dit omvat: blocks, components, templates, hooks, lib utilities, API routes, pre-built email templates, automation flows, en pre-built chatbot conversation flows. Alles hergebruikt bestaande unified content collections met `branch: 'horeca'`. Geen nieuwe database migraties nodig — alle horeca-specifieke velden bestaan al.

Horeca-specifieke velden in ContentBookings: `guests` (1-20), `preferences` (window/terrace/inside/quiet/bar), `occasion` (birthday/anniversary/business/romantic/group/other), `assignedTable`.

Content module defaults (Settings > siteBranch = 'horeca'):
- services: label "Services", routeSlug "services", defaultEnabled: **false** (menu items via content-services)
- bookings: label "Reserveringen", routeSlug "reserveren", defaultEnabled: **true**
- team: label "Team", routeSlug "team", defaultEnabled: **true**
- activities: label "Evenementen", routeSlug "evenementen", defaultEnabled: **true**
- reviews: label "Reviews", defaultEnabled: **true**
- cases/portfolio: defaultEnabled: **false**
- inquiries: label "Groepsaanvraag", routeSlug "groepsaanvraag", defaultEnabled: **false**

---

## Fase 1: Foundation — Branch Metadata + Lib Utilities

### 1a. Branch metadata herschrijven
- **File:** `src/branches/horeca/index.ts` (bestaand stub → volledig herschrijven)
- Volgt exact pattern van `src/branches/beauty/index.ts`
- Exporteert: `branchMetadata`, block configs, template slugs

### 1b. Lib utilities aanmaken

| File | Beschrijving |
|------|-------------|
| `src/branches/horeca/lib/analytics.ts` | `trackHorecaEvent()` — GA4 events: reservation_form_start, menu_item_view, etc. |
| `src/branches/horeca/lib/reservationUtils.ts` | `generateTimeSlots()`, `formatGuests()`, `formatOccasion()`, `getPreferenceLabel()` |

---

## Fase 2: Components (8 stuks)

Alle volgen `Component.tsx` + `types.ts` + `index.ts` pattern. Geen hardcoded kleuren.

| Component | Type | Beschrijving |
|-----------|------|-------------|
| `MenuItemCard` | Server | Gerecht-card met prijs, allergenen, categorie |
| `EventCard` | Server | Evenement-card met datum, tijd, beschrijving |
| `ReservationForm` | Client | 3-staps wizard: Datum/Gasten → Voorkeuren → Gegevens |
| `ReservationSidebar` | Client | Sticky sidebar met reserveringsoverzicht |
| `ChefCard` | Server | Team member met avatar, rol (chef, sommelier, etc.) |
| `AllergenBadge` | Server | Kleine badge voor allergenen (gluten, noten, etc.) |
| `OpeningHours` | Server | Weekoverzicht openingstijden (hergebruik pattern beauty) |
| `ReviewCard` | Server | Klantreview met sterren + gelegenheidtype |

**Pad:** `src/branches/horeca/components/<ComponentName>/`

---

## Fase 3: Blocks (3 stuks)

| Block | Velden | Beschrijving |
|-------|--------|-------------|
| `MenuGrid` | heading, source (auto/manual), limit, columns, categoryFilter | Grid van gerechten, fetcht `content-services` where `branch: 'horeca'` |
| `EventsGrid` | heading, source, limit, columns | Evenementen grid, fetcht `content-activities` where `branch: 'horeca'` |
| `TeamShowcase` | heading, source, limit, columns | Team grid, fetcht `content-team` where `branch: 'horeca'` |

**Pad:** `src/branches/horeca/blocks/<BlockName>/`

**NB:** Het bestaande `ReservationForm` block blijft behouden — dat gebruikt FormBuilder.

**Registratie:** Beauty blocks pattern → conditioneel via `isFeatureEnabled('horeca')` (al gedaan).

---

## Fase 4: Templates (5 pagina-templates, GEEN homepage)

| Template | Route | Beschrijving |
|----------|-------|-------------|
| `MenuArchive` | `/menukaart` | Menukaart met categoriegroepering + AllergenBadge |
| `MenuItemDetail` | `/menukaart/[slug]` | 2-kolom: content + sidebar met bestel-info |
| `ReservationWizard` | `/reserveren` | ReservationForm + ReservationSidebar, 3-staps wizard |
| `EventsArchive` | `/evenementen` | Aankomende evenementen overzicht |
| `ContactTemplate` | `/contact` | Openingstijden, contactformulier, kaart, teamkaarten |

**Pad:** `src/branches/horeca/templates/<TemplateName>/`

Homepage via CMS Pages + shared blocks (Hero, StatsCounter) + horeca blocks (MenuGrid, EventsGrid).

---

## Fase 5: API Routes (2 endpoints)

### 5a. POST `/api/horeca/reservation`
- **File:** `src/app/api/horeca/reservation/route.ts`
- Accepteert: `{ date, time, guests, firstName, lastName, email, phone, occasion?, preferences?, remarks? }`
- Maakt `content-bookings` aan met `branch: 'horeca'`, `status: 'new'`
- Stuurt bevestigingsemail naar klant + notificatie naar admin

### 5b. GET `/api/horeca/availability`
- **File:** `src/app/api/horeca/availability/route.ts`
- Query params: `date` (YYYY-MM), `guests`
- Berekent beschikbare tijdslots (lunch 11:30-14:00, diner 17:00-22:00)
- Returnt: `{ dates: [{ date, slots: [{ time, available }] }] }`

---

## Fase 6: Hooks (1 hook)

### 6a. `reservationStatusHook.ts`
- **File:** `src/branches/horeca/hooks/reservationStatusHook.ts`
- `CollectionAfterChangeHook` op `content-bookings` (al geregistreerd via beauty hook patroon)
- Filtert op `doc.branch === 'horeca'`

| Status transitie | Actie | Ontvanger |
|-----------------|-------|-----------|
| `new` → `confirmed` | Reservering Bevestigd (Klant) | Klant |
| `new` → `confirmed` | Reservering Bevestigd (Admin) | Admin |
| `confirmed` → `cancelled` | Reservering Geannuleerd (Klant) | Klant |
| `confirmed` → `cancelled` | Reservering Geannuleerd (Admin) | Admin |
| `confirmed` → `completed` | Log; review flow triggert later | — |
| `confirmed` → `no-show` | Intern log | Admin (console) |

### 6b. Registratie
- **File:** `src/branches/shared/collections/ContentBookings/index.ts`
- Toevoegen: `reservationStatusHook` naast bestaande `bookingStatusHook`

---

## Fase 7: Pre-built Email Templates (8 templates)

Toevoegen aan `src/features/email-marketing/lib/predefined/templates.ts`:

| # | Template | Category | Subject |
|---|----------|----------|---------|
| 1 | Reservering Bevestigd (Klant) | transactional | Reservering bevestigd — {{ .Date }} om {{ .Time }} |
| 2 | Reservering Bevestigd (Admin) | notification | Nieuwe reservering: {{ .CustomerName }} — {{ .Guests }} gasten |
| 3 | Reservering Herinnering | transactional | Herinnering: reservering morgen om {{ .Time }} |
| 4 | Reservering Geannuleerd (Klant) | transactional | Reservering geannuleerd — {{ .Date }} |
| 5 | Reservering Geannuleerd (Admin) | notification | Reservering geannuleerd: {{ .CustomerName }} |
| 6 | Reservering Gewijzigd (Klant) | transactional | Reservering gewijzigd — {{ .NewDate }} om {{ .NewTime }} |
| 7 | Groepsreservering Ontvangen | transactional | Uw groepsaanvraag is ontvangen |
| 8 | Review Verzoek (Na Bezoek) | transactional | Hoe was uw bezoek, {{ .CustomerName }}? |

Alle templates: horeca-gradient header (`#f97316` → `#dc2626`), tags `['horeca', 'reservation', 'predefined']`.

---

## Fase 8: Pre-built Automation Flows (3 flows)

### Flow 1: Reservering Herinnering Flow
- **Trigger:** `custom.event` / `reservation.confirmed`
- **Steps:** tag → wait 1 day → send herinnering → exit

### Flow 2: Na-Bezoek Review Flow
- **Trigger:** `custom.event` / `reservation.completed`
- **Steps:** wait 1 dag → send review verzoek → wait 5 dagen → send herinnering → exit

### Flow 3: Groepsreservering Follow-up
- **Trigger:** `custom.event` / `reservation.confirmed`
- **Entry condition:** `guests >= 8`
- **Steps:** send groepsreservering details → tag → exit

---

## Fase 9: Pre-built Chatbot Conversation Flows

### 9a. Horeca Conversation Flows (7 categories)

```
1. Reserveren (type: submenu)
   ├─ Tafel reserveren → direct: "Ik wil een tafel reserveren"
   ├─ Groepsreservering → input: "Hoeveel gasten?" placeholder: "Bijv. 12 personen"
   ├─ Privé-dining → direct: "Hebben jullie mogelijkheden voor privé-dining?"
   └─ Terras reserveren → direct: "Kan ik een tafel op het terras reserveren?"

2. Menukaart & Gerechten (type: submenu)
   ├─ Menukaart bekijken → direct: "Kan ik de menukaart bekijken?"
   ├─ Dagmenu / Chef's specials → direct: "Wat is het dagmenu of de chef's special?"
   ├─ Allergenen & dieetwensen → input: "Welke allergie/dieetwens?" placeholder: "Bijv. glutenvrij, vegetarisch..."
   └─ Wijnkaart → direct: "Hebben jullie een wijnkaart?"

3. Evenementen & Feesten (type: submenu)
   ├─ Aankomende evenementen → direct: "Welke evenementen staan er gepland?"
   ├─ Feest of event organiseren → input: "Wat voor event?" placeholder: "Bijv. verjaardag, bedrijfsfeest..."
   └─ Live muziek → direct: "Is er live muziek deze week?"

4. Locatie & Openingstijden (type: submenu)
   ├─ Openingstijden → direct: "Wat zijn jullie openingstijden?"
   ├─ Adres & routebeschrijving → direct: "Waar zijn jullie gevestigd?"
   ├─ Parkeren → direct: "Is er parkeergelegenheid?"
   └─ Bereikbaarheid (OV) → direct: "Hoe kom ik er met het OV?"

5. Reservering wijzigen of annuleren (type: submenu)
   ├─ Reservering wijzigen → input: "Voer je reserveringsnummer in" placeholder: "Bijv. RES-12345"
   ├─ Reservering annuleren → input: "Voer je reserveringsnummer in" placeholder: "Bijv. RES-12345"
   └─ Annuleringsbeleid → direct: "Wat is jullie annuleringsbeleid?"

6. Cadeaubonnen & Acties (type: submenu)
   ├─ Cadeaubon kopen → direct: "Ik wil een cadeaubon kopen"
   ├─ Cadeaubon inwisselen → input: "Voer je cadeauboncode in" placeholder: "Bijv. GIFT-XXXX"
   └─ Lopende acties → direct: "Zijn er speciale aanbiedingen?"

7. Overige vragen (type: input)
```

### 9b. Horeca System Prompt + Training Context + Welcome Message

---

## Fase 10: App Routes (refactor bestaande)

### Nieuwe `(horeca)` routes
| Route | File | Template |
|-------|------|----------|
| `/menukaart` | `src/app/(horeca)/menukaart/page.tsx` | `MenuArchiveTemplate` |
| `/menukaart/[slug]` | `src/app/(horeca)/menukaart/[slug]/page.tsx` | `MenuItemDetailTemplate` |
| `/reserveren` | `src/app/(horeca)/reserveren/page.tsx` | `ReservationWizardTemplate` |
| `/evenementen` | `src/app/(horeca)/evenementen/page.tsx` | `EventsArchiveTemplate` |
| `/contact` | `src/app/(horeca)/contact/page.tsx` | `ContactTemplate` |

### Routes te verwijderen
- `(horeca)/restaurant/` → verwijderen (homepage via CMS Pages)
- `(horeca)/menu/` → vervangen door `/menukaart`
- `(horeca)/reservations/` → vervangen door `/reserveren`

---

## Fase 11: Seed Functie Compleet

| Content | Collection | Aantal |
|---------|------------|--------|
| Gerechten | content-services | 8 (Carpaccio, Soep, Steak, Risotto, Vis, Dessert, Kindermenu, Chef's Special) |
| Evenementen | content-activities | 3 (Live Jazz Avond, Wijnproeverij, Kookworkshop) |
| Team | content-team | 3 (Chef-kok, Sommelier, Gastheer/vrouw) |
| Chatbot flows | chatbot-settings global | 7 flow categories + system prompt + training context |

---

## Implementatievolgorde

1. **Fase 1** — Foundation: branch metadata + lib utilities
2. **Fase 2** — Components: 8 componenten
3. **Fase 3** — Blocks: 3 blocks (+ bestaande ReservationForm)
4. **Fase 4** — Templates: 5 pagina-templates
5. **Fase 5** — API Routes: reservation + availability endpoints
6. **Fase 6** — Hooks: reservationStatusHook + registratie
7. **Fase 7** — Email Templates: 8 pre-built templates
8. **Fase 8** — Email Flows: 3 automation flows
9. **Fase 9** — Chatbot: predefined conversation flows + seed
10. **Fase 10** — App Routes: refactor bestaande routes
11. **Fase 11** — Seed: complete seedHoreca() functie

---

## Referentiebestanden

| Bestand | Reden |
|---------|-------|
| `src/branches/beauty/index.ts` | Branch metadata pattern |
| `src/branches/beauty/hooks/bookingStatusHook.ts` | Hook + email pattern |
| `src/branches/beauty/components/BookingForm/Component.tsx` | Multi-step form wizard |
| `src/branches/beauty/components/BookingSidebar/Component.tsx` | Sidebar pattern |
| `src/features/email-marketing/lib/predefined/templates.ts` | Email template pattern |
| `src/features/email-marketing/lib/predefined/flows.ts` | Automation flow pattern |
| `src/features/ai/lib/predefined/conversationFlows.ts` | Chatbot flows pattern |
| `src/endpoints/seed/templates/beauty.ts` | Seed functie pattern |
| `src/branches/shared/collections/ContentBookings/index.ts` | Booking schema met horeca velden |
| `src/branches/shared/collections/ContentActivities/index.ts` | Activities/events schema |

---

## Verificatie

1. `/menukaart` toont gerechten per categorie met allergenen
2. `/reserveren` toont 3-staps wizard, submit maakt reservering in content-bookings
3. `/evenementen` toont aankomende evenementen
4. Status wijziging `confirmed` stuurt bevestigingsemail
5. `POST /api/email-marketing/seed-predefined` → 8 nieuwe horeca templates
6. Chatbot widget → 7 flow categories
7. seedHoreca() → 8 gerechten, 3 events, 3 teamleden, chatbot flows
8. `ENABLE_HORECA=true` in horeca01 `.env` → deploy via `deploy-ploi.sh`

---

## Geen Migraties Nodig

Alle horeca-specifieke velden bestaan al:
- `content-bookings`: `guests`, `preferences`, `occasion`, `assignedTable` (conditional op `branch: 'horeca'`)
- `content-services`: `duration`, `price` (conditional op horeca-compatible branches)
- `content-activities`: `type`, `startDate`, `endDate`, `price`, `maxParticipants`
- `chatbot-settings`: `conversationFlows` array (reeds gemigreerd)
