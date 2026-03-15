# E-mail Templates — Overzicht & Preview

> Bijgewerkt: 2026-03-08
> Bron: `src/features/email-marketing/lib/EmailService.ts`

## Alle Transactionele E-mails

Open de `.html` bestanden in je browser om het design te bekijken.

| # | Template | Bestand | Trigger | Gradient |
|---|----------|---------|---------|----------|
| 1 | **Orderbevestiging** | [01-orderbevestiging.html](./01-orderbevestiging.html) | Order betaald (`paid`) | Paars (#667eea → #764ba2) |
| 2 | **Verzendbevestiging** | [02-verzendbevestiging.html](./02-verzendbevestiging.html) | Order verzonden (`shipped`) | Paars (#667eea → #764ba2) |
| 3 | **Afleverbevestiging** | [03-afleverbevestiging.html](./03-afleverbevestiging.html) | Order afgeleverd (`delivered`) | Groen (#28a745 → #20c997) |
| 4 | **Annulering** | [04-annulering.html](./04-annulering.html) | Order geannuleerd (`cancelled`) | Rood (#dc3545 → #c82333) |
| 5 | **Terugbetaling** | [05-terugbetaling.html](./05-terugbetaling.html) | Order terugbetaald (`refunded`) | Paars (#8B5CF6 → #7C3AED) |
| 6 | **Retour aanvraag** | [06-retour-aanvraag.html](./06-retour-aanvraag.html) | Retour ingediend | Oranje (#fd7e14 → #ffc107) |
| 7 | **Retour goedgekeurd** | [07-retour-goedgekeurd.html](./07-retour-goedgekeurd.html) | Retour approved | Groen (#28a745 → #20c997) |
| 8 | **Retour afgekeurd** | [08-retour-afgekeurd.html](./08-retour-afgekeurd.html) | Retour rejected | Rood (#dc3545 → #c82333) |
| 9 | **Retourlabel** | [09-retourlabel.html](./09-retourlabel.html) | Label gegenereerd | Paars (#667eea → #764ba2) |
| 10 | **Contactformulier** | [10-contactformulier.html](./10-contactformulier.html) | Formulier ingediend | Paars (#667eea → #764ba2) |
| 11 | **Nieuwe editie** | [11-nieuwe-editie.html](./11-nieuwe-editie.html) | Magazine editie gepubliceerd | Groen (brand color) |

## Design Systeem

Alle e-mails volgen dezelfde design-principes:

- **Max breedte:** 600px (e-mail standaard)
- **Font:** System font stack (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, etc.)
- **Taal:** Nederlands (nl-NL)
- **Kleur per type:** Groen = succes, Rood = fout/annulering, Oranje = wachtend, Paars = primair/info
- **Layout:** Gradient header → witte content → grijze footer
- **CTA buttons:** Rounded (8px), kleur passend bij context
- **Responsive:** Inline styles voor maximale compatibiliteit

## Technische Details

- **Verzending:** Resend API
- **Hook:** `orderStatusHook.ts` triggert automatisch bij statuswijziging
- **PDF bijlage:** Factuur-PDF bij orderbevestiging (optioneel, via E-commerce Settings)
- **Tracking link:** Optioneel, via E-commerce Settings → Publieke Order Tracking
- **XSS preventie:** Alle gebruikersinput wordt escaped via `escapeHtml()`

## Bestanden

- Templates in code: `src/features/email-marketing/lib/EmailService.ts`
- Order hook: `src/branches/ecommerce/hooks/orderStatusHook.ts`
- Editie notificatie: `src/branches/ecommerce/hooks/notifyEditionSubscribers.ts`
- PDF factuur: `src/branches/ecommerce/components/pdf/InvoiceDocument.tsx`
