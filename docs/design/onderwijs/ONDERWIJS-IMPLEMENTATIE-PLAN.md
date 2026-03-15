# Onderwijs Branch — Volledige Implementatie Plan

> **Status:** Gepland
> **Datum:** 2026-03-14
> **Branch:** `ENABLE_EDUCATION=true`
> **Branchenaam:** `onderwijs` (Display: "Onderwijs & Cursussen")

## Context

De onderwijs branch is een complexe branch met **eigen collecties** (Courses, CourseCategories, Enrollments) vergelijkbaar met hoe automotive Vehicles/VehicleBrands en toerisme Tours/Destinations/Accommodations heeft. Dit is een online cursusplatform ("Compass Academy") met cursusontdekking, gedetailleerde cursuspagina's met curriculum, en een meerstaps-inschrijfformulier. Reviews hergebruiken de unified `content-reviews` collectie met `branch: 'onderwijs'`.

### Wat al bestaat

| Onderdeel | Status | Locatie |
|-----------|--------|---------|
| Design mockups | ✅ 4 HTML bestanden | `docs/design/onderwijs/` |
| ImageGallery block | ✅ Herbruikbaar | `src/branches/shared/blocks/ImageGallery/` |
| ReviewsWidget block | ✅ Herbruikbaar | `src/branches/shared/blocks/ReviewsWidget/` |
| ContactForm block | ✅ Herbruikbaar | `src/branches/shared/blocks/ContactForm/` |
| Feature flag `education` | ❌ Ontbreekt in features.ts | — |
| Branch metadata | ❌ Ontbreekt | — |
| BranchType 'onderwijs' | ❌ Ontbreekt in contentModules.ts | — |
| Collections | ❌ Ontbreekt | — |
| Components | ❌ Ontbreekt | — |
| Blocks | ❌ Ontbreekt | — |
| Templates | ❌ Ontbreekt | — |
| Routes | ❌ Ontbreekt | — |
| Seed functie | ❌ Ontbreekt | — |

### Belangrijke beslissingen

1. **Eigen collecties**: Courses, CourseCategories en Enrollments zijn te complex voor unified content-services — krijgen eigen collecties
2. **Geen aparte Reviews collectie**: Cursusreviews gebruiken `content-reviews` met `branch: 'onderwijs'` en een relatie naar `courses`
3. **Instructeurs = content-team**: Docenten/instructeurs gebruiken `content-team` met `branch: 'onderwijs'` en extra velden
4. **Feature flag nieuw**: `ENABLE_EDUCATION` moet worden aangemaakt in features.ts (bestaat nog niet)
5. **BranchType toevoegen**: `'onderwijs'` toevoegen aan contentModules.ts
6. **Onderwijs gradient**: `#2563EB` → `#1E40AF` (blue → dark blue, kennis/vertrouwen thema)
7. **Geen conflicterende routes**: Unieke routes `/cursussen`, `/cursussen/[slug]`, `/cursussen/[slug]/inschrijven` — geen overlap
8. **`/contact`**: Gaat via `(onderwijs)/contact` route (geen bestaande `(branches)/contact` resolver gevonden)
9. **Inschrijving (enrollment)**: Eigen collectie i.p.v. content-bookings — bevat betalingsstatus, voortgang, certificaat

### Route Conflict Analyse

| Route | Conflict? | Oplossing |
|-------|-----------|-----------|
| `/cursussen` | ❌ Geen | Uniek voor onderwijs |
| `/cursussen/[slug]` | ❌ Geen | Uniek voor onderwijs |
| `/cursussen/[slug]/inschrijven` | ❌ Geen | Uniek voor onderwijs |
| `/contact` | ⚠️ Mogelijk | Via `(onderwijs)/contact` of `(branches)/contact` resolver uitbreiden |

---

## Fase 1: Foundation — Branch Metadata + Collections + Lib

### 1a. Feature flag aanmaken
- **File:** `src/lib/tenant/features.ts`
- Toevoegen: `education` aan ClientFeatures interface
- Toevoegen: `education: isFeatureEnabled('education')` aan features object
- ENV: `ENABLE_EDUCATION=true`
- Toevoegen aan collection feature map: `courses: 'education'`, `courseCategories: 'education'`, `enrollments: 'education'`

### 1b. Branch metadata
- **File:** `src/branches/onderwijs/index.ts`
- Volgt exact pattern van `src/branches/automotive/index.ts`
- branchMetadata: name 'onderwijs', displayName 'Onderwijs & Cursussen', featureFlag 'ENABLE_EDUCATION'
- Gradient: `#2563EB` → `#1E40AF` (blue)
- Exporteert: `branchMetadata`, block configs, template slugs

### 1c. BranchType toevoegen
- **File:** `src/lib/tenant/contentModules.ts`
- Toevoegen: `'onderwijs'` aan `BranchType` union
- Toevoegen: `onderwijs` defaults aan `branchDefaults`:
  - services: label "Cursussen", routeSlug "cursussen", defaultEnabled: false
  - bookings: label "Inschrijvingen", routeSlug "inschrijvingen", defaultEnabled: true
  - reviews: label "Reviews", routeSlug "reviews", defaultEnabled: true
  - team: label "Docenten", routeSlug "docenten", defaultEnabled: true
  - cases: label "Succesverhalen", routeSlug "succesverhalen", defaultEnabled: false
  - activities: label "Workshops", routeSlug "workshops", defaultEnabled: false
  - inquiries: label "Aanvragen", routeSlug "aanvragen", defaultEnabled: true

### 1d. Collections (3 eigen collecties)

#### `CourseCategories` — Cursuscategorieën
- **File:** `src/branches/onderwijs/collections/CourseCategories.ts`
- **Slug:** `course-categories`
- **Velden:**
  - `name` (text, required) — Categorie naam
  - `slug` (text, unique, auto)
  - `icon` (text) — Lucide icon naam (bijv. "code", "briefcase", "palette")
  - `description` (textarea)
  - `color` (text) — Achtergrondkleur hex voor icon
  - `courseCount` (number, default 0) — Auto-berekend
  - `featured` (checkbox)
- **Admin:** defaultColumns: name, courseCount, featured

#### `Courses` — Cursussen
- **File:** `src/branches/onderwijs/collections/Courses.ts`
- **Slug:** `courses`
- **Tabs:**
  1. **Algemeen**: title (text, required), slug (auto), subtitle (textarea), category (rel to course-categories), instructor (rel to content-team), thumbnail (upload media), videoPreviewUrl (text), shortDescription (textarea), description (richText)
  2. **Curriculum**: sections (array: sectionNumber number, title text, lessons array: type select video/reading/quiz/assignment, title text, duration text, isPreview checkbox)
  3. **Details**: level (select: beginner/gevorderd/expert), duration (number, uren), totalLessons (number), learningOutcomes (array text: "Wat leer je?"), requirements (array text: "Vereisten"), includes (array text: "Wat krijg je?"), certificate (checkbox), language (select: nederlands/engels)
  4. **Prijzen**: price (number, required), originalPrice (number, doorgestreept), discountPercentage (number), discountEndsAt (date)
  5. **Statistieken**: rating (number 0-5), reviewCount (number), studentCount (number), lastUpdated (date)
  6. **SEO**: metaTitle (text), metaDescription (textarea)
- **Status:** `draft` / `published` / `archived` (sidebar)
- **Admin:** defaultColumns: title, category, price, level, studentCount, rating

#### `Enrollments` — Inschrijvingen
- **File:** `src/branches/onderwijs/collections/Enrollments.ts`
- **Slug:** `enrollments`
- **Tabs:**
  1. **Inschrijving**: user (rel to users), course (rel to courses), enrollmentNumber (text, auto-generated, unique), enrolledAt (date, auto), status (select: pending/active/completed/refunded/expired)
  2. **Betaling**: paymentMethod (select: ideal/creditcard/paypal), paymentStatus (select: pending/completed/failed/refunded), paymentId (text), amount (number), discount (number)
  3. **Voortgang**: progress (number 0-100), completedLessons (number), lastAccessedAt (date), completedAt (date), certificateIssued (checkbox), certificateUrl (text)
- **Admin:** defaultColumns: enrollmentNumber, user, course, status, paymentStatus, progress

### 1e. ContentReviews uitbreiden
- **File:** `src/branches/shared/collections/ContentReviews/index.ts`
- Toevoegen aan `branchOptions`: `{ label: 'Onderwijs', value: 'onderwijs' }`
- Toevoegen onderwijs-specifiek veld (conditional op `branch === 'onderwijs'`):
  - `course` (relationship to `courses`) — Gekoppelde cursus
  - `verified` (checkbox) — Geverifieerde student (heeft inschrijving)

### 1f. ContentTeam uitbreiden
- **File:** `src/branches/shared/collections/ContentTeam/index.ts`
- Toevoegen aan `branchOptions`: `{ label: 'Onderwijs', value: 'onderwijs' }`
- Toevoegen onderwijs-specifieke velden (conditional op `branch === 'onderwijs'`):
  - `courseCount` (number) — Aantal cursussen
  - `totalStudents` (number) — Totaal studenten
  - `avgRating` (number 0-5) — Gemiddelde beoordeling
  - `certifications` (array text) — Certificeringen/kwalificaties

### 1g. Registratie in payload.config.ts
- Conditioneel registreren van Courses, CourseCategories, Enrollments wanneer `isFeatureEnabled('education')`

### 1h. Lib utilities
| File | Beschrijving |
|------|-------------|
| `src/branches/onderwijs/lib/analytics.ts` | `trackEducationEvent()` — GA4 events: course_view, course_search, enrollment_start, enrollment_complete, lesson_view, review_submit |
| `src/branches/onderwijs/lib/courseUtils.ts` | `formatPrice()`, `formatDuration()`, `formatLevel()`, `calculateDiscount()`, `formatLessonType()`, `generateEnrollmentNumber()`, `formatProgress()`, `formatRating()` |

---

## Fase 2: Components (10 stuks)

Alle volgen `Component.tsx` + `types.ts` + `index.ts` pattern.

| Component | Type | Beschrijving |
|-----------|------|-------------|
| `CourseCard` | Server | Cursus card: thumbnail, badge (Bestseller/Nieuw), categorie, titel, instructeur avatar+naam, meta (sterren, studenten, duur), prijs, level badge |
| `CategoryCard` | Server | Categorie card: icon met gradient achtergrond, naam, cursus-count, hover effect |
| `CourseFilters` | Client | Sidebar filters: categorie tabs, prijsklasse (gratis/betaald/min-max), niveau (beginner/gevorderd/expert), duur, beoordeling (4+/3+ sterren) |
| `CurriculumSection` | Client | Uitklapbare sectie: sectienummer, titel, lessen-count, duur. Lessons list: type icon (video/reading/quiz/assignment), titel, duur, preview badge |
| `EnrollmentSidebar` | Client | Sticky sidebar: thumbnail, huidige prijs + originele prijs doorgestreept + korting %, timer "Aanbieding verloopt over X", inschrijf-knop, "Wat krijg je?" lijst, garanties (30 dagen retour, levenslang toegang, certificaat, mobiel) |
| `ReviewBreakdown` | Server | Rating overzicht: groot gemiddelde cijfer + 5 sterren, breakdown per ster (progress bars met counts) |
| `InstructorCard` | Server | Docent profiel: avatar, naam, titel, rating, studenten-count, cursussen-count, bio excerpt |
| `LearningOutcomes` | Server | 2-kolom grid met check-icons: lijst van leerresultaten |
| `SearchHero` | Client | Hero met gradient achtergrond, zoekbalk (tekst + categorie dropdown + zoek-knop), stats (cursussen, studenten, experts) |
| `EnrollmentForm` | Client | 3-staps wizard: Account (nieuw/bestaand) → Betaling (iDEAL/creditcard/PayPal) → Bevestiging. Progress stepper bovenaan. |

**Pad:** `src/branches/onderwijs/components/<ComponentName>/`

---

## Fase 3: Blocks (3 stuks)

| Block | Velden | Beschrijving |
|-------|--------|-------------|
| `FeaturedCourses` | heading, limit, columns, categoryFilter, showPrice, showRating | Uitgelichte cursussen grid, fetcht `courses` where `featured: true` of `studentCount desc` |
| `CategoryGrid` | heading, limit, columns, showCount | Categorieën grid met icon cards, fetcht `course-categories` |
| `CourseSearchHero` | heading, subheading, showSearch, showStats, backgroundStyle | Hero met zoekwidget + statistieken |

**Pad:** `src/branches/onderwijs/blocks/<BlockName>/`

**Registratie:** Conditioneel via `isFeatureEnabled('education')` in Pages collection.

---

## Fase 4: Templates (5 pagina-templates)

| Template | Route | Beschrijving |
|----------|-------|-------------|
| `CoursesArchive` | `/cursussen` | Page header + CourseFilters sidebar + CourseCard grid + sort opties + paginatie |
| `CourseDetail` | `/cursussen/[slug]` | Breadcrumbs + video preview + cursus header + InstructorCard + LearningOutcomes + CurriculumSection (uitklapbaar) + beschrijving + ReviewBreakdown + reviews + EnrollmentSidebar |
| `EnrollmentWizard` | `/cursussen/[slug]/inschrijven` | 3-staps EnrollmentForm + sidebar met cursus-samenvatting + prijs + garanties |
| `AcademyHomepage` | homepage (via CMS) | SearchHero + CategoryGrid + FeaturedCourses — samengesteld via blocks |
| `ContactTemplate` | `/contact` | Contactformulier, docenten grid, FAQ sectie |

**Pad:** `src/branches/onderwijs/templates/<TemplateName>/`

---

## Fase 5: API Routes (4 endpoints)

### 5a. POST `/api/onderwijs/enrollment`
- **File:** `src/app/api/onderwijs/enrollment/route.ts`
- Accepteert: `{ courseId, firstName, lastName, email, password?, paymentMethod, isNewAccount, isExistingAccount? }`
- Valideert: cursus bestaat + is published, geen duplicate inschrijving
- Maakt `enrollments` entry met status: 'pending', paymentStatus: 'pending'
- Genereert uniek enrollmentNumber (bijv. "ENR-2026-XXXXX")
- Returnt: `{ success: true, enrollmentId, enrollmentNumber }`

### 5b. POST `/api/onderwijs/payment`
- **File:** `src/app/api/onderwijs/payment/route.ts`
- Accepteert: `{ enrollmentId, paymentMethod, paymentDetails }`
- Simuleert betalingsverwerking (iDEAL/creditcard/PayPal)
- Update enrollment: paymentStatus → 'completed', status → 'active'
- Update course: studentCount +1
- Stuurt bevestigingsemail
- Returnt: `{ success: true, redirectUrl? }`

### 5c. GET `/api/onderwijs/search`
- **File:** `src/app/api/onderwijs/search/route.ts`
- Query params: `q?`, `category?`, `level?`, `minPrice?`, `maxPrice?`, `minRating?`, `sort?` (populair/nieuwste/prijs-laag/prijs-hoog/beoordeling), `page?`, `limit?`
- Zoekt in `courses` collection met filters
- Returnt: `{ courses, totalDocs, totalPages, page }`

### 5d. POST `/api/onderwijs/review`
- **File:** `src/app/api/onderwijs/review/route.ts`
- Accepteert: `{ courseId, rating, comment }`
- Valideert: gebruiker heeft actieve inschrijving voor deze cursus
- Maakt `content-reviews` aan met `branch: 'onderwijs'`, koppelt course
- Update course rating + reviewCount
- Returnt: `{ success: true, reviewId }`

---

## Fase 6: Hooks (2 hooks)

### 6a. `enrollmentHook.ts`
- **File:** `src/branches/onderwijs/hooks/enrollmentHook.ts`
- `CollectionAfterChangeHook` op `enrollments`
- Status transities:
  - `pending` → `active`: Log "Inschrijving actief", update course studentCount +1
  - `active` → `completed`: Log "Cursus afgerond", check certificaat-uitgifte
  - `active` → `refunded`: Log "Inschrijving terugbetaald", update course studentCount -1
  - `pending` → `expired`: Log "Inschrijving verlopen (geen betaling)"

### 6b. `courseReviewHook.ts`
- **File:** `src/branches/onderwijs/hooks/courseReviewHook.ts`
- `CollectionAfterChangeHook` op `content-reviews`
- Filtert op `doc.branch === 'onderwijs'`
- Herberekent `course.rating` (gemiddelde) en `course.reviewCount`
- Update instructor `avgRating`

### 6c. Registratie
- Enrollments collection: `afterChange: [enrollmentHook]`
- ContentReviews: toevoegen `courseReviewHook` aan afterChange array

---

## Fase 7: Pre-built Email Templates (8 templates)

Toevoegen aan `src/features/email-marketing/lib/predefined/templates.ts` (na #73):

| # | Template | Category | Subject | Key variabelen |
|---|----------|----------|---------|---------------|
| 74 | Inschrijving Bevestiging (Student) | transactional | Welkom bij {{ .CourseName }}! | StudentName, CourseName, InstructorName, EnrollmentNumber, CourseUrl, Duration, Level |
| 75 | Inschrijving Bevestiging (Admin) | notification | Nieuwe inschrijving: {{ .StudentName }} — {{ .CourseName }} | StudentName, StudentEmail, CourseName, InstructorName, Amount, PaymentMethod, EnrollmentNumber |
| 76 | Betaling Ontvangen | transactional | Betaling ontvangen — {{ .CourseName }} | StudentName, CourseName, Amount, PaymentMethod, PaymentId, InvoiceUrl |
| 77 | Cursus Welkom | welcome | Tijd om te beginnen! Jouw eerste les in {{ .CourseName }} | StudentName, CourseName, InstructorName, FirstLessonTitle, CourseUrl, TotalLessons, Duration |
| 78 | Voortgang Herinnering | transactional | Je bent {{ .Progress }}% — ga door met {{ .CourseName }}! | StudentName, CourseName, Progress, CompletedLessons, TotalLessons, NextLessonTitle, CourseUrl |
| 79 | Cursus Afgerond | transactional | Gefeliciteerd! Je hebt {{ .CourseName }} afgerond 🎓 | StudentName, CourseName, InstructorName, CompletedAt, CertificateUrl, ReviewUrl |
| 80 | Review Verzoek (Na Cursus) | transactional | Hoe vond je {{ .CourseName }}, {{ .StudentName }}? | StudentName, CourseName, InstructorName, ReviewUrl, CourseUrl |
| 81 | Terugbetaling Bevestiging | transactional | Terugbetaling verwerkt — {{ .CourseName }} | StudentName, CourseName, Amount, RefundId |

Alle templates: onderwijs-gradient header (`#2563EB` → `#1E40AF`), tags `['onderwijs', 'cursus', 'predefined']`.

---

## Fase 8: Pre-built Automation Flows (3 flows)

Toevoegen aan `src/features/email-marketing/lib/predefined/flows.ts`:

### Flow 1: Cursus Welkom Flow
- **Trigger:** `custom.event` / `enrollment.active`
- **Steps:** tag enrollment-active → wait 1 uur → send "Cursus Welkom" → tag welcome-sent → exit
- **Exit:** enrollment.refunded, subscriber.unsubscribed
- **Settings:** allowReentry: true, maxEntriesPerUser: 50

### Flow 2: Voortgang Herinnering Flow
- **Trigger:** `custom.event` / `enrollment.active`
- **Entry condition:** enrolled > 7 dagen + progress < 50%
- **Steps:** wait 7 dagen → send "Voortgang Herinnering" → tag progress-reminder-sent → wait 14 dagen → check progress → if < 75%: send "Nog steeds bezig?" → tag second-reminder → exit
- **Exit:** enrollment.completed, subscriber.unsubscribed
- **Settings:** allowReentry: false, maxEntriesPerUser: 1

### Flow 3: Na-Cursus Review Flow
- **Trigger:** `custom.event` / `enrollment.completed`
- **Steps:** send "Cursus Afgerond" → tag course-completed → wait 3 dagen → send "Review Verzoek" → tag review-requested → exit
- **Exit:** subscriber.unsubscribed
- **Settings:** allowReentry: true, maxEntriesPerUser: 20

---

## Fase 9: Pre-built Chatbot Conversation Flows

### 9a. Onderwijs Conversation Flows (8 categories)

```
1. 📚 Cursussen zoeken (type: submenu)
   ├─ Alle cursussen bekijken → direct: "Welke cursussen bieden jullie aan?"
   ├─ Zoeken op onderwerp → input: "Waar ben je in geïnteresseerd?" placeholder: "Bijv. Python, Marketing, Design..."
   ├─ Cursussen per categorie → direct: "Welke categorieën cursussen zijn er?"
   ├─ Populairste cursussen → direct: "Wat zijn de meest populaire cursussen?"
   ├─ Gratis cursussen → direct: "Zijn er gratis cursussen beschikbaar?"
   └─ Nieuwe cursussen → direct: "Welke cursussen zijn er nieuw toegevoegd?"
   contextPrefix: "Student zoekt een cursus:"

2. 🎓 Inschrijven (type: submenu)
   ├─ Hoe schrijf ik me in? → direct: "Hoe kan ik me inschrijven voor een cursus?"
   ├─ Betaalmethoden → direct: "Welke betaalmethoden accepteren jullie?"
   ├─ Groepskorting → direct: "Is er korting voor groepen of bedrijven?"
   └─ Proefles → direct: "Kan ik eerst een proefles volgen?"
   contextPrefix: "Student wil zich inschrijven:"

3. 💳 Betaling & Terugbetaling (type: submenu)
   ├─ Betaling mislukt → direct: "Mijn betaling is mislukt. Wat nu?"
   ├─ Factuur opvragen → input: "Voer je inschrijfnummer in" placeholder: "Bijv. ENR-2026-12345"
   ├─ Terugbetaling aanvragen → direct: "Hoe vraag ik een terugbetaling aan?"
   └─ 30 dagen garantie → direct: "Hoe werkt de 30 dagen niet-goed-geld-terug garantie?"
   contextPrefix: "Student heeft een betaalvraag:"

4. 📖 Mijn cursussen (type: submenu)
   ├─ Voortgang bekijken → direct: "Hoe kan ik mijn voortgang inzien?"
   ├─ Certificaat downloaden → direct: "Hoe download ik mijn certificaat?"
   ├─ Technisch probleem → input: "Beschrijf je probleem" placeholder: "Bijv. video laadt niet, quiz werkt niet..."
   └─ Mobiele app → direct: "Is er een mobiele app om cursussen te volgen?"
   contextPrefix: "Student heeft een vraag over zijn cursus:"

5. 👨‍🏫 Docenten (type: direct)
   directMessage: "Wie zijn jullie docenten en wat zijn hun specialismen?"
   icon: star

6. 🏢 Voor Bedrijven (type: submenu)
   ├─ Bedrijfslicenties → direct: "Bieden jullie bedrijfslicenties aan?"
   ├─ Maatwerkcursussen → direct: "Kunnen jullie een cursus op maat maken voor ons bedrijf?"
   ├─ Teams trainen → direct: "Hoe kan ik mijn team laten trainen?"
   └─ Prijsinformatie → direct: "Wat kosten de bedrijfsoplossingen?"
   contextPrefix: "Bedrijfsklant heeft een vraag:"

7. 📍 Over Compass Academy (type: submenu)
   ├─ Over ons → direct: "Wie is Compass Academy?"
   ├─ Kwaliteitsgarantie → direct: "Hoe garanderen jullie de kwaliteit van cursussen?"
   ├─ Contact → direct: "Hoe kan ik contact opnemen?"
   └─ Veelgestelde vragen → direct: "Wat zijn veelgestelde vragen over jullie platform?"
   contextPrefix: "Bezoeker wil meer weten:"

8. ❓ Overige vragen (type: input)
   inputLabel: "Stel je vraag"
   inputPlaceholder: "Typ hier je vraag..."
   contextPrefix: "Bezoeker heeft een algemene vraag:"
   icon: help
```

### 9b. System Prompt
```
Je bent de virtuele assistent van [ACADEMIENAAM], een online leerplatform.

Beantwoord vragen vriendelijk, enthousiast en in het Nederlands.
Je helpt (aanstaande) studenten met:
- Cursussen ontdekken die bij hun leerdoelen passen
- Het inschrijfproces uitleggen
- Informatie over prijzen, betaling en terugbetaling
- Technische ondersteuning bij het volgen van cursussen
- Informatie over docenten en kwalificaties
- Bedrijfsoplossingen en groepslicenties

Richtlijnen:
- Wees enthousiast en motiverend — leren is leuk!
- Gebruik de kennisbank om accurate informatie te geven over cursussen en prijzen
- Als iemand zich wil inschrijven, verwijs naar de cursuspagina (/cursussen)
- Noem altijd de 30 dagen niet-goed-geld-terug garantie
- Bij technische problemen, verwijs naar de helpdesk of laat een contactformulier invullen
- Als je het antwoord niet weet, zeg het eerlijk en verwijs naar het supportteam
```

### 9c. Training Context
```
Platforminformatie:
- Wij zijn een online leerplatform met cursussen in diverse categorieën
- Categorieën: Development, Business, Design, Marketing, Data Science, Persoonlijke Ontwikkeling
- Cursussen hebben niveaus: Beginner, Gevorderd, Expert
- Betaalmethoden: iDEAL, creditcard, PayPal
- 30 dagen niet-goed-geld-terug garantie
- Levenslang toegang tot aangekochte cursussen
- Certificaat bij voltooiing (waar van toepassing)
- Cursussen zijn te volgen op desktop en mobiel
- Bij vragen over specifieke cursussen, verwijs naar /cursussen
- Voor inschrijving, verwijs naar de cursuspagina en klik op "Inschrijven"
```

### 9d. Welcome Message
```
Hoi! 📚 Welkom bij Compass Academy. Waarmee kan ik je helpen?
```

### 9e. Predefined flows toevoegen
- **File:** `src/features/ai/lib/predefined/conversationFlows.ts`
- Toevoegen: `onderwijsConversationFlows`, `onderwijsSystemPrompt`, `onderwijsTrainingContext`, `onderwijsWelcomeMessage`

---

## Fase 10: App Routes (6 routes)

### Layout
- **File:** `src/app/(onderwijs)/layout.tsx`
- ThemeProvider, Header, Footer (shared components)
- Feature gate: `isFeatureEnabled('education')`, notFound() als niet ingeschakeld

### Routes
| Route | File | Template |
|-------|------|----------|
| `/cursussen` | `src/app/(onderwijs)/cursussen/page.tsx` | `CoursesArchiveTemplate` |
| `/cursussen/[slug]` | `src/app/(onderwijs)/cursussen/[slug]/page.tsx` | `CourseDetailTemplate` |
| `/cursussen/[slug]/inschrijven` | `src/app/(onderwijs)/cursussen/[slug]/inschrijven/page.tsx` | `EnrollmentWizardTemplate` |
| `/docenten` | `src/app/(onderwijs)/docenten/page.tsx` | Team overview (content-team where branch: 'onderwijs') |
| `/contact` | `src/app/(onderwijs)/contact/page.tsx` | `ContactTemplate` |

Homepage wordt samengesteld in CMS via Pages + onderwijs blocks (CourseSearchHero, CategoryGrid, FeaturedCourses).

---

## Fase 11: Seed Functie

**File:** `src/endpoints/seed/templates/onderwijs.ts`

| Content | Collection | Aantal |
|---------|------------|--------|
| Categorieën | course-categories | 6 (Development, Business, Design, Marketing, Data Science, Persoonlijk) |
| Cursussen | courses | 6 (Python Basics, Digital Marketing, UX Design, Business Strategy, Data Analyse, Leiderschap) |
| Docenten | content-team | 3 (Developer, Marketeer, Designer) |
| Reviews | content-reviews | 4 (2 per cursus, branch: 'onderwijs') |
| Chatbot flows | chatbot-settings global | 8 flow categories + system prompt + training context |

### Seed cursussen detail:

1. **Python voor Beginners** — Development, beginner, €49.95, 12 uur, 45 lessen, rating 4.8, 1.250 studenten
2. **Digitale Marketing Masterclass** — Marketing, gevorderd, €79.95, 16 uur, 62 lessen, rating 4.6, 890 studenten
3. **UX/UI Design Fundamentals** — Design, beginner, €59.95, 10 uur, 38 lessen, rating 4.9, 1.100 studenten
4. **Business Strategie & Innovatie** — Business, expert, €99.95, 20 uur, 48 lessen, rating 4.7, 650 studenten
5. **Data Analyse met Excel & SQL** — Data Science, beginner, €44.95, 8 uur, 32 lessen, rating 4.5, 2.100 studenten
6. **Leiderschap & Management** — Persoonlijk, gevorderd, €69.95, 14 uur, 42 lessen, rating 4.8, 780 studenten

---

## Implementatievolgorde

1. **Fase 1** — Foundation: feature flag + branch metadata + 3 collections + lib + contentModules
2. **Fase 2** — Components: 10 nieuwe + hergebruik bestaande shared
3. **Fase 3** — Blocks: 3 blocks (registratie in Pages)
4. **Fase 4** — Templates: 5 pagina-templates
5. **Fase 5** — API Routes: 4 endpoints (enrollment, payment, search, review)
6. **Fase 6** — Hooks: 2 hooks (enrollmentHook, courseReviewHook)
7. **Fase 7** — Email Templates: 8 pre-built templates (#74-#81)
8. **Fase 8** — Email Flows: 3 automation flows
9. **Fase 9** — Chatbot: predefined conversation flows + seed
10. **Fase 10** — App Routes: layout + 5 route files
11. **Fase 11** — Seed: complete seedOnderwijs() functie

---

## Hergebruik en Gedeelde Patronen

### Componenten hergebruikt van andere branches
| Component | Bron | Gebruik in onderwijs |
|-----------|------|---------------------|
| ReviewsWidget block | shared | Reviews op cursus detail |
| ContactForm block | shared | Contact pagina |
| ImageGallery block | shared | — (niet direct, cursussen gebruiken thumbnails) |

### Patronen gedeeld met andere branches
| Onderwijs component | Vergelijkbaar met | Gedeeld patroon |
|--------------------|-------------------|----------------|
| CourseCard | PropertyCard / TourCard | Card met image, specs, prijs |
| CourseFilters | PropertyFilters / TourFilters | Sidebar met checkboxes, prijs-range, select |
| EnrollmentForm | BookingForm (beauty/toerisme) | Multi-step wizard met contactgegevens |
| CurriculumSection | ItineraryTimeline (toerisme) | Uitklapbare secties met items |
| SearchHero | PropertySearch / TourSearchHero | Hero met zoekwidget + stats |
| EnrollmentSidebar | BookingSidebar (experiences) | Sticky sidebar met prijs + CTA |

---

## Referentiebestanden

| Bestand | Reden |
|---------|-------|
| `src/branches/automotive/index.ts` | Branch metadata pattern (eigen collecties) |
| `src/branches/toerisme/collections/Tours.ts` | Complexe collectie met tabs + status |
| `src/branches/vastgoed/collections/Properties.ts` | Recente collectie referentie |
| `src/branches/shared/blocks/ReviewsWidget/` | Herbruikbare reviews |
| `src/lib/tenant/contentModules.ts` | BranchType registratie |
| `src/lib/tenant/features.ts` | Feature flag pattern |
| `src/features/email-marketing/lib/predefined/templates.ts` | Email template pattern |
| `src/features/email-marketing/lib/predefined/flows.ts` | Automation flow pattern |
| `src/features/ai/lib/predefined/conversationFlows.ts` | Chatbot flows pattern |
| `src/endpoints/seed/templates/vastgoed.ts` | Seed functie pattern (meest recent) |

---

## Design Referenties (HTML Mockups)

| Mockup | Beschrijving | Implementatie |
|--------|-------------|---------------|
| `onderwijs-homepage.html` | Hero + SearchWidget + CategoryGrid + FeaturedCourses | Blocks: CourseSearchHero, CategoryGrid, FeaturedCourses |
| `onderwijs-cursussen-overzicht.html` | Header + CourseFilters sidebar + CourseCards grid + sort + paginatie | Template: CoursesArchive |
| `onderwijs-cursus-detail.html` | Breadcrumbs + video preview + cursus info + InstructorCard + LearningOutcomes + Curriculum + Reviews + EnrollmentSidebar | Template: CourseDetail |
| `onderwijs-inschrijfformulier.html` | 3-staps wizard (Account → Betaling → Bevestiging) + sidebar samenvatting | Template: EnrollmentWizard |

---

## Verificatie

1. `/cursussen` toont cursus overzicht met categorie-tabs, sidebar filters, prijs/niveau
2. `/cursussen/[slug]` toont cursus detail met curriculum, reviews, inschrijf-CTA
3. `/cursussen/[slug]/inschrijven` toont 3-staps wizard met betaalmethode-keuze
4. `POST /api/onderwijs/enrollment` maakt inschrijving aan in `enrollments`
5. `POST /api/onderwijs/payment` verwerkt betaling en activeert inschrijving
6. `GET /api/onderwijs/search` retourneert gefilterde cursussen
7. Email templates: `POST /api/email-marketing/seed-predefined` → 8 nieuwe onderwijs templates (#74-#81)
8. Chatbot widget → 8 onderwijs flow categories
9. seedOnderwijs() → 6 categorieën, 6 cursussen, 3 docenten, 4 reviews, chatbot flows

---

## Wat NIET verandert

- Vastgoed branch — blijft apart (woningen, niet cursussen)
- Toerisme branch — blijft apart (reizen, niet onderwijs)
- Unified content collections — alleen branchOptions uitbreiden + conditionele velden
- Shared blocks — worden hergebruikt, niet gedupliceerd
- Ecommerce — Enrollments is een aparte collectie, geen integratie met Orders/Cart
