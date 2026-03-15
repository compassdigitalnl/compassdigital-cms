# Offerte → Order Conversie — Design Specification

**Feature:** Digitaal offertes bekijken, accepteren en omzetten naar bestelling
**Prioriteit:** Hoog
**Geschatte effort:** Middel
**Created:** 2026-03-08
**Status:** GEIMPLEMENTEERD (2026-03-08)

---

## Overview

Het offerte-aanvraagsysteem bestond al (formulier + Quotes collectie + admin). Wat ontbrak was de klant-kant: offertes bekijken, accepteren/afwijzen, en automatische conversie naar een bestelling.

---

## Flow

```
Klant                                 Admin                              Systeem
  │                                     │                                   │
  ├─ /account/quotes/new ──────────────→│                                   │
  │  (producten selecteren,             │                                   │
  │   bedrijfsinfo invullen)            │                                   │
  │                                     │                                   │
  │                                     ├─ Status → 'processing'           │
  │                                     ├─ Stuksprijzen invullen            │
  │                                     ├─ Totaalprijs + geldig-tot        │
  │                                     ├─ Status → 'quoted'               │
  │                                     │                                   │
  ├─ /account/quotes ─────────────────→ │  (lijst met statusbadges)        │
  ├─ /account/quotes/[id] ───────────→  │  (detail + accepteren/afwijzen)  │
  │                                     │                                   │
  │  [Accepteren] ─────────────────────────────────────────────────────────→│
  │                                     │                    Maak order aan │
  │                                     │                    Status → accepted
  │                                     │                    Link quote→order
  │  ← Redirect naar /account/orders/X ←──────────────────────────────────│
  │                                     │                                   │
  │  [Afwijzen] ──────────────────────────────────────────────────────────→│
  │  (+ optionele reden)                │                    Status → rejected
  │                                     │                                   │
```

---

## Wat Is Gebouwd

### 1. Quotes Collectie Uitgebreid

**Bestand:** `src/branches/ecommerce/collections/orders/Quotes.ts`

Nieuwe velden:
- `products[].quotedUnitPrice` — Stuksprijs per product (admin vult in)
- `convertedToOrder` — Relationship naar orders (auto-ingevuld bij acceptatie)
- `acceptedAt` — Datum van acceptatie
- `rejectedAt` — Datum van afwijzing
- `rejectionReason` — Optionele reden van afwijzing

Access control bijgewerkt:
- Admin/editor: volledige read + update rechten
- Klant: alleen eigen offertes lezen + aanmaken

### 2. Account Pagina's (Page → Template → Component patroon)

**Pages** (data-fetching + routing):

| Route | Bestand | Template |
|-------|---------|----------|
| `/account/quotes` | `app/(ecommerce)/account/quotes/page.tsx` | `QuotesListTemplate` |
| `/account/quotes/new` | `app/(ecommerce)/account/quotes/new/page.tsx` | `QuotesTemplate` (bestaand) |
| `/account/quotes/[id]` | `app/(ecommerce)/account/quotes/[id]/page.tsx` | `QuoteDetailTemplate` |

**Templates** (`templates/account/AccountTemplate1/`):

| Template | Functie |
|----------|---------|
| `QuotesTemplate/` | Offerte-aanvraagformulier (bestaand) |
| `QuotesListTemplate/` | Offertes overzicht met cards + lege staat |
| `QuoteDetailTemplate/` | Detail met status, producten, acties, contactinfo |

**Components** (`components/account/quotes/`):

| Component | Functie |
|-----------|---------|
| `QuoteCard/` | Offerte kaart voor de lijst (status, prijs, product-preview) |
| `QuoteDetailHeader/` | Status badge, datum, geldigheid, order-link, accept/reject knoppen |
| `QuoteProductsDetail/` | Read-only producttabel met stuksprijzen en totalen |
| `QuoteActions/` | Afwijzingsformulier met reden-textarea |
| `QuoteContactInfo/` | Bedrijfs- en contactgegevens kaart |
| `QuoteProductTable/` | Product-zoeker + tabel voor aanvraagformulier (bestaand) |
| `QuoteForm/` | Bedrijfsinfo + leveringsformulier (bestaand) |
| `QuoteSteps/` | "Hoe werkt het" stappen-sidebar (bestaand) |

### 3. API Routes

| Endpoint | Methode | Functie |
|----------|---------|---------|
| `/api/account/quotes` | GET | Lijst eigen offertes (bestaand) |
| `/api/account/quotes` | POST | Nieuwe offerte aanvragen (bestaand) |
| `/api/account/quotes/[id]` | GET | Enkele offerte ophalen |
| `/api/account/quotes/[id]/accept` | POST | Accepteer + maak order aan |
| `/api/account/quotes/[id]/reject` | POST | Afwijzen + optionele reden |

### 4. Account Sidebar

"Offertes" link met FileCheck icoon toegevoegd aan account navigatie (na "Bestellingen").

### 5. Migration

**Bestand:** `src/migrations/20260308_160000_extend_quotes_for_conversion.ts`

Kolommen:
- `quotes_products.quoted_unit_price` (numeric)
- `quotes.converted_to_order_id` (integer + FK → orders)
- `quotes.accepted_at` (timestamp)
- `quotes.rejected_at` (timestamp)
- `quotes.rejection_reason` (varchar)

---

## Acceptatie-logica

Bij het accepteren van een offerte:
1. Valideer: status = 'quoted', niet verlopen
2. Bouw order items vanuit quote producten (met geoffreerde stuksprijzen)
3. Genereer ordernummer (ORD-YYYYMMDD-XXXXX)
4. Maak order aan (status: pending, paymentStatus: pending)
5. Voeg timeline event toe: "Bestelling geplaatst vanuit offerte Q-XXXXX"
6. Update quote: status → 'accepted', acceptedAt, convertedToOrder → order ID
7. Redirect klant naar `/account/orders/[orderId]`

---

## Verificatie

1. `/account/quotes` → toont lege staat + "Nieuwe offerte" knop
2. `/account/quotes/new` → offerte aanvragen met producten
3. Admin: status → 'quoted', stuksprijzen + totaalprijs invullen
4. `/account/quotes/[id]` → toont producttabel met prijzen, "Accepteren" knop
5. Accepteren → order aangemaakt, redirect naar order detail
6. Afwijzen → status 'rejected', optionele reden opgeslagen
7. Verlopen offerte → melding + link naar nieuwe aanvraag
