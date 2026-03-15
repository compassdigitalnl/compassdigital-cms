# PDF Factuur Generatie — Design Specification

**Feature:** Server-side PDF generatie voor facturen met download en e-mail attachment
**Prioriteit:** Hoog
**Geschatte effort:** Medium (nieuwe library + API route + template)
**Created:** 2026-03-07
**Status:** VOLLEDIG GEIMPLEMENTEERD (2026-03-08)

---

## Overview

De Invoices collectie bestaat, InvoiceRow component toont een "Download PDF" link, maar er is geen PDF-generatie. De `invoicePDF` upload-veld op de Invoice collectie is leeg. Dit document beschrijft hoe PDF's gegenereerd, opgeslagen en gedownload worden.

---

## Bestaande Infrastructuur (HERGEBRUIKEN)

| Component | Pad | Status |
|-----------|-----|--------|
| Invoices collectie | `src/branches/ecommerce/collections/orders/Invoices.ts` | Klaar — auto invoice numbers (F-YYYY-XXXXX), status, line items, `invoicePDF` upload veld |
| InvoiceRow component | `src/branches/ecommerce/components/account/invoices/InvoiceRow/` | Klaar — toont PDF download link (als `invoicePDF` gevuld is) |
| InvoiceStatsBar | `src/branches/ecommerce/components/account/invoices/InvoiceStatsBar/` | Klaar — totalen, openstaand, betaald |
| Orders collectie | `src/branches/ecommerce/collections/orders/Orders.ts` | Alle orderdata beschikbaar |

---

## Library Keuze: `@react-pdf/renderer`

**Waarom:** React-component gebaseerd, past bij het project (Next.js/React), goede typografie, geen headless browser nodig (lichtgewicht).

**Alternatief overwogen:**
- `puppeteer` — te zwaar voor server (500MB Chrome binary)
- `jspdf` — te low-level, geen React integratie
- `pdfkit` — goed maar geen declaratieve API

---

## Wat Moet Gebouwd Worden

### 1. PDF Template Component

**Bestand:** `src/branches/ecommerce/components/pdf/InvoiceDocument.tsx` (NIEUW)

React-PDF component die een factuur rendert:

```
┌──────────────────────────────────────────┐
│ [BEDRIJFSLOGO]           FACTUUR         │
│ Bedrijfsnaam BV                          │
│ Adres, Postcode, Plaats                  │
│ KVK: 12345678 | BTW: NL123456789B01     │
├──────────────────────────────────────────┤
│                                          │
│ Factuurnummer:  F-2026-00042             │
│ Factuurdatum:   07-03-2026              │
│ Vervaldatum:    21-03-2026              │
│ Ordernummer:    ORD-2026-00123           │
│                                          │
│ Factuuradres:          Verzendadres:     │
│ Jan de Vries           Jan de Vries      │
│ Keizersgracht 123      Keizersgracht 123 │
│ 1015 CJ Amsterdam      1015 CJ Amsterdam│
│                                          │
├──────────────────────────────────────────┤
│ Omschrijving      Aantal  Prijs   Totaal │
│ ─────────────────────────────────────── │
│ Widget X           2    € 24,95  € 49,90│
│ Widget Y           1    € 24,95  € 24,95│
│                                          │
│                    Subtotaal:   € 74,85  │
│                    Verzending:  €  0,00  │
│                    BTW 21%:    € 15,72  │
│                    ─────────────────── │
│                    TOTAAL:     € 90,57  │
│                                          │
├──────────────────────────────────────────┤
│ Betaalmethode: iDEAL                     │
│ Betaalstatus: Betaald (07-03-2026)       │
│                                          │
│ Betalingstermijn: 14 dagen               │
│ IBAN: NL00ABNA0123456789                 │
│ t.n.v. Bedrijfsnaam BV                   │
└──────────────────────────────────────────┘
```

### 2. API Route voor PDF Download

**Bestand:** `src/app/api/account/invoices/[id]/pdf/route.ts` (NIEUW)

```
GET /api/account/invoices/{id}/pdf
  → Auth check (user owns invoice)
  → Fetch invoice + order data
  → Render InvoiceDocument met @react-pdf/renderer
  → Return PDF als stream (Content-Type: application/pdf)
  → Optioneel: cache in invoicePDF upload veld
```

### 3. Auto-generatie bij Order Betaling

**Bestand:** `src/branches/ecommerce/hooks/orderStatusHook.ts` (UITBREIDEN — uit feature 01)

Bij `status → paid`:
1. Maak Invoice record aan (als die nog niet bestaat)
2. Genereer PDF → sla op in `invoicePDF` veld
3. Stuur orderbevestiging e-mail MET PDF als attachment

### 4. Dependency Installeren

```bash
npm install @react-pdf/renderer --legacy-peer-deps
```

---

## Bestanden Overzicht

| Bestand | Actie | Beschrijving |
|---------|-------|-------------|
| `src/branches/ecommerce/components/pdf/InvoiceDocument.tsx` | NIEUW | React-PDF factuur template |
| `src/app/api/account/invoices/[id]/pdf/route.ts` | NIEUW | PDF download endpoint |
| `src/branches/ecommerce/hooks/orderStatusHook.ts` | UITBREIDEN | Auto-generatie bij betaling |
| `src/features/email-marketing/lib/EmailService.ts` | UITBREIDEN | PDF als attachment meesturen |
| `package.json` | WIJZIGEN | +@react-pdf/renderer |

**Geen migratie nodig** — `invoicePDF` veld bestaat al op Invoices collectie.

### Implementatie Details (2026-03-08)

- `@react-pdf/renderer` v4.3.2 geinstalleerd
- `InvoiceDocument.tsx`: volledige A4 factuurtemplate met Helvetica, bedrijfsheader, adressen, regelitems-tabel, totalen, betaalinformatie footer. Company info uit env vars.
- `pdf/route.ts`: auth-protected GET endpoint, valideert eigenaarschap (user owns invoice of admin), rendert PDF via `renderToBuffer()`, returnt als `application/pdf` stream
- Auto-generatie Invoice bij betaling: `orderStatusHook` maakt automatisch Invoice record aan bij `status → paid`
- PDF als e-mail attachment: configureerbaar via E-commerce Settings → E-mail & Notificaties → "Factuur PDF meesturen"
- Resend `.send()` uitgebreid met `attachments` parameter

---

## Verificatie

1. Bestelling betaald → Invoice record aangemaakt met PDF
2. `/api/account/invoices/{id}/pdf` → download werkt
3. Account invoices pagina → "Download PDF" knop werkt
4. Orderbevestiging e-mail bevat PDF attachment
5. PDF bevat correct bedrijfslogo, factuurnummer, bedragen
