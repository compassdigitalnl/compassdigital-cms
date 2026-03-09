# Openstaande Punten — E-commerce Platform Roadmap

> Bijgewerkt: 2026-03-08
> Zie ook: [ECOMMERCE-REORGANISATION-PLAN.md](./ECOMMERCE-REORGANISATION-PLAN.md)

---

## Overzicht: Wat Is Klaar

### Fase 1 — Shared Foundation (COMPLEET)
- [x] Transactionele e-mails (orderStatusHook, EmailService)
- [x] PDF factuur generatie (@react-pdf/renderer, InvoiceDocument.tsx)
- [x] Publieke order tracking (/track + /api/track)

### Fase 2 — Automation & Carrier (COMPLEET)
- [x] Abandoned cart detectie (cron job + automation engine)
- [x] Carrier webhook integratie (Sendcloud + MyParcel)
- [x] E-commerce Settings uitgebreid (abandoned cart + carrier tabs)

### Fase 3 — B2B Foundation (COMPLEET)
- [x] Offerte → Order conversie (lijst, detail, accept/reject, auto-order)
- [x] Klantspecifieke prijzen (calculatePrice.ts, CustomerGroups, StaffelCalculator)
- [x] "Opnieuw bestellen" knop (handleReorder in order detail)
- [x] Quote pages gerefactord naar component/template patroon

### Overige Klaar
- [x] Volledige checkout flow (multi-step, adres, verzending, betaling)
- [x] MultiSafepay integratie (payments + webhooks + affiliates)
- [x] Loyaliteitsprogramma (punten, tiers, beloningen, transacties)
- [x] Cadeaubonnen (GiftVouchers, redemption, saldo)
- [x] Abonnementen (plans, user subscriptions, checkout)
- [x] Licenties (activatie, beheer, deactivatie)
- [x] Retouren (aanvraag, statusflow, reden)
- [x] Terugkerende bestellingen (RecurringOrders)
- [x] Bestellijsten (OrderLists voor herhaald bestellen)
- [x] 8 producttypen (variable, bundle, configurator, personalized, subscription, bookable, mix-match, standard)
- [x] A/B Testing framework
- [x] Stock reservations + cleanup cron
- [x] Magazines + editie-notificaties
- [x] Volledige account dashboard (15+ secties)

---

## Openstaande Punten per Fase

### Fase 4 — Codebase Reorganisatie (COMPLEET)

Verplaatst op 2026-03-09. Resultaat:
- [x] 4.1 Shared verplaatst — ~557 bestanden naar `ecommerce/shared/`
- [x] 4.2 B2B verplaatst — ~101 bestanden naar `ecommerce/b2b/`
- [x] 4.3 B2C verplaatst — ~46 bestanden naar `ecommerce/b2c/`
- [x] 4.4 Import-paden bulk-update — 246 bestanden + packages/modules/cart/Carts.ts
- [x] 4.5 Build + Runtime geslaagd — payloadInitError opgelost (QuickOrder block config import)
- [ ] 4.6 **Deploy naar alle sites** — nog uit te voeren

---

### Fase 5 — B2B Uitbreiding (HOOG PRIORITEIT)

| # | Feature | Prioriteit | Status | Effort | Toelichting |
|---|---------|-----------|--------|--------|-------------|
| 5.1 | **Multi-user bedrijfsaccounts** | Hoog | Ontbreekt | Groot | `CompanyAccount` collectie, gebruikersrollen (inkoper/manager/financieel), user-invite flow. Prerequisite voor 5.2. |
| 5.2 | **Goedkeuringsworkflow** | Hoog | Ontbreekt | Groot | Manager keurt bestelling goed vóór plaatsing. `ApprovalQueue`, `ApprovalRequestCard`, `ApprovalModal` components. Vereist 5.1. |
| 5.3 | **Budgetlimieten** | Middel | Ontbreekt | Middel | Max bestedingsbedrag per user/bedrijf per periode. Check in checkout flow. Vereist 5.1. |
| 5.4 | **Kredietlimiet** | Middel | Ontbreekt | Klein | Kredietlimiet veld op Customers, check bij bestellen-op-rekening in `checkout/create-order`. |
| 5.5 | **Punchout / EDI** | Laag | Ontbreekt | Groot | cXML/OCI integratie met ERP-systemen. Enterprise feature, niet urgent voor MKB. |

**Logische volgorde:** 5.1 → 5.2 → 5.3 (sequentieel). 5.4 is onafhankelijk. 5.5 is toekomstig.

---

### Fase 6 — B2C Verrijking (MIDDEL PRIORITEIT)

| # | Feature | Prioriteit | Status | Effort | Toelichting |
|---|---------|-----------|--------|--------|-------------|
| 6.1 | **Product Q&A** | Middel | Ontbreekt | Middel | `ProductQuestions` collectie, `QuestionForm` + `QuestionList` components. Moderatie in admin. |
| 6.2 | **Flash sales / countdown timer** | Middel | Ontbreekt | Klein | Start/einddatum op `DiscountCodes`, `FlashSaleBanner` component met afteller. |
| 6.3 | **Maattabel / Size guide** | Middel | Ontbreekt | Klein | `SizeGuide` component, rich text veld op product collectie. Relevant voor fashion/beauty. |
| 6.4 | **Wachtlijst voltooien** | Laag | Deels | Klein | `BackInStockNotifier` UI bestaat. Ontbreekt: `Waitlist` collectie + e-mail bij voorraad-update. |
| 6.5 | **Social sharing knoppen** | Laag | Ontbreekt | Klein | WhatsApp, Facebook, e-mail, link kopiëren op productpagina. ~1 component. |
| 6.6 | **Referral programma voltooien** | Laag | Deels | Middel | `ReferralSection` UI bestaat. Ontbreekt: referral codes genereren, tracking, beloningen uitkeren. |
| 6.7 | **Cadeauverpakking** | Laag | Ontbreekt | Klein | Checkbox + bericht bij checkout. Veld in order collectie. |

**Geen onderlinge afhankelijkheden** — elk punt is onafhankelijk.

---

### Fase 7 — Platform / Shared Verbeteringen (LAAG-MIDDEL)

| # | Feature | Prioriteit | Status | Effort | Toelichting |
|---|---------|-----------|--------|--------|-------------|
| 7.1 | **Retourlabel generatie** | Middel | Ontbreekt | Middel | PostNL/DHL API integratie voor automatische retourlabels. Carrier webhook infra kan hergebruikt worden. |
| 7.2 | **Voorraad per locatie** | Middel | Ontbreekt | Middel | Stock per `Branch`. Relevant voor multi-branch B2B. Branches collectie bestaat al. |
| 7.3 | **Multi-currency** | Laag | Ontbreekt | Groot | Valuta-selectie, conversie, prijzen per valuta. Pas relevant bij internationalisatie. |
| 7.4 | **Multi-language producten** | Laag | Ontbreekt | Groot | Payload CMS localization activeren op producten-collectie. Content per taal. |

---

### Fase 8 — Theme Admin Redesign (TECHNISCHE SCHULD — BLOKKEREND)

Zie plan: `/home/ploi/.claude/plans/sequential-spinning-sloth.md`

**Let op:** Theme velden zijn al toegevoegd in code (commits `aebf921`, `176d512`) maar de migratie ontbreekt. Dit veroorzaakt SQL-errors bij runtime (`column "btn_font_weight" does not exist`). De ThemeProvider vangt dit op met fallback-defaults, maar de foutmeldingen vullen de logs.

| # | Taak | Status | Toelichting |
|---|------|--------|-------------|
| 8.1 | **ColorPicker admin component** | Deels | Code bestaat, maar custom Payload field component mist |
| 8.2 | **Colors tab fixen** | Klaar | Veldnamen matchen nu met DB kolommen |
| 8.3 | **Typography tab fixen** | Deels | Veldnamen gefixed, type scale velden toegevoegd maar geen DB-kolommen |
| 8.4 | **Visual tab uitbreiden** | Deels | Individuele radius/shadow/z-index tokens in code, geen DB-kolommen |
| 8.5 | **Spacing tab verwijderen** | Ontbreekt | Read-only velden die nergens aan gekoppeld zijn |
| 8.6 | **ThemeProvider updaten** | Deels | Nieuwe CSS variables aanwezig maar DB-kolommen ontbreken |
| 8.7 | **Migration** | **KRITIEK** | Nieuwe kolommen voor buttons, typography + visual tokens. **Zonder migratie werkt niets.** |

---

## Aanbevolen Fasering

```
Nu uitvoeren (volgende sprint):
├── Fase 4: Codebase Reorganisatie (structureel, geen feature-impact)
│   └── 4.1 → 4.2 → 4.3 → 4.4 → 4.5 (sequentieel, ~2.5 uur)
│
├── Fase 8: Theme Admin Redesign (tech debt, admin werkt niet goed)
│   └── 8.1 → 8.2 → 8.3 → 8.4 → 8.5 → 8.6 → 8.7 (sequentieel, ~3 uur)

Daarna (prioriteit op basis van klantbehoefte):
├── Fase 5: B2B Uitbreiding
│   ├── 5.1 Multi-user accounts (prerequisite voor 5.2 + 5.3)
│   ├── 5.2 Goedkeuringsworkflow
│   ├── 5.3 Budgetlimieten
│   └── 5.4 Kredietlimiet (onafhankelijk)
│
├── Fase 6: B2C Verrijking (cherry-pick per klant)
│   ├── 6.2 Flash sales (quick win)
│   ├── 6.1 Product Q&A
│   ├── 6.3 Maattabel
│   └── 6.4-6.7 (laag prioriteit)

Toekomstig:
├── Fase 7: Platform verbeteringen
│   ├── 7.1 Retourlabels
│   ├── 7.2 Voorraad per locatie
│   └── 7.3-7.4 (internationalisatie)
│
└── Fase 5.5: Punchout/EDI (enterprise)
```

---

## Samenvatting Tellingen

| Status | Aantal items |
|--------|-------------|
| **Klaar** | 25+ features volledig gebouwd |
| **Deels klaar** | 2 (wachtlijst, referral) |
| **Openstaand** | 20 items verdeeld over 5 fasen |
| **Hoog prioriteit open** | 3 (multi-user, goedkeuring, theme fix) |
| **Middel prioriteit open** | 8 |
| **Laag prioriteit open** | 9 |
