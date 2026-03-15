# Transactionele E-mails — Design Specification

**Feature:** Automatische e-mails bij order lifecycle events
**Prioriteit:** Hoog
**Geschatte effort:** Klein (bestaande EmailService hergebruiken)
**Created:** 2026-03-07
**Status:** GEIMPLEMENTEERD (2026-03-08)

---

## Overview

Klanten ontvangen momenteel GEEN e-mail na een bestelling. Dit is het eerste dat gefixt moet worden. De infrastructure bestaat al — `EmailService` class met Resend API + HTML templates. Wat ontbreekt is de **trigger** vanuit de order lifecycle.

---

## Bestaande Infrastructuur (HERGEBRUIKEN)

| Component | Pad | Status |
|-----------|-----|--------|
| `EmailService` class | `src/features/email-marketing/lib/EmailService.ts` | Klaar — bevat `sendOrderConfirmation()`, `sendShippingConfirmation()`, `sendDeliveryConfirmation()`, `sendReturnConfirmation()`, etc. |
| Resend API | `package.json` → `resend: ^6.9.1` | Geinstalleerd |
| E-mail config | `.env` → `RESEND_API_KEY`, `EMAIL_FROM`, `COMPANY_NAME` | Per tenant configureerbaar |
| BullMQ worker | `src/lib/queue/workers/emailMarketingWorker.ts` | Pattern voor async sending |
| Orders collectie | `src/branches/ecommerce/collections/orders/Orders.ts` | 7 statussen: pending, paid, processing, shipped, delivered, cancelled, refunded |

---

## Wat Moet Gebouwd Worden

### 1. Order Lifecycle Hook

**Bestand:** `src/branches/ecommerce/hooks/orderStatusHook.ts` (NIEUW)

Payload CMS `afterChange` hook op de Orders collection die bij statuswijziging de juiste e-mail triggert:

```
Order aangemaakt (status: pending)     → Geen e-mail (wacht op betaling)
Status → paid                          → sendOrderConfirmation()
Status → processing                    → Geen e-mail
Status → shipped                       → sendShippingConfirmation()
Status → delivered                     → sendDeliveryConfirmation()
Status → cancelled                     → sendOrderCancellation()   ← NIEUW
Status → refunded                      → sendRefundConfirmation()  ← NIEUW
```

Flow:
```
┌──────────────┐    afterChange     ┌──────────────────┐    async    ┌──────────────┐
│ Order status │ ──────────────────→ │ orderStatusHook  │ ─────────→ │ EmailService │
│ wijzigt      │                    │ (detecteert diff) │           │ .send()      │
└──────────────┘                    └──────────────────┘           └──────────────┘
```

### 2. Twee Nieuwe E-mail Methodes op EmailService

**Bestand:** `src/features/email-marketing/lib/EmailService.ts` (BESTAAND — uitbreiden)

| Methode | Trigger | Inhoud |
|---------|---------|--------|
| `sendOrderCancellation()` | status → cancelled | Ordernummer, reden, refund-info |
| `sendRefundConfirmation()` | status → refunded | Ordernummer, bedrag, verwachte terugbetaaltermijn |

### 3. Hook Registreren op Orders Collection

**Bestand:** `src/branches/ecommerce/collections/orders/Orders.ts` (BESTAAND — hook toevoegen)

```typescript
hooks: {
  afterChange: [orderStatusHook],
}
```

---

## E-mail Templates (bestaand in EmailService)

Alle templates zijn inline HTML met CSS. Bestaande structuur:

```
┌──────────────────────────────────────────┐
│ Logo (COMPANY_NAME)                       │
├──────────────────────────────────────────┤
│ Titel: "Bedankt voor je bestelling!"      │
│ Ordernummer: #ORD-2026-00123              │
│                                          │
│ ┌─────────────────────────────────────┐  │
│ │ Product    │ Aantal │ Prijs         │  │
│ │ Widget X   │ 2      │ € 49,90      │  │
│ │ Widget Y   │ 1      │ € 24,95      │  │
│ ├─────────────────────────────────────┤  │
│ │ Subtotaal          │ € 124,75      │  │
│ │ Verzending         │ Gratis        │  │
│ │ BTW (21%)          │ € 26,20       │  │
│ │ TOTAAL             │ € 150,95      │  │
│ └─────────────────────────────────────┘  │
│                                          │
│ Verzendadres:                            │
│ Jan de Vries, Keizersgracht 123, ...     │
│                                          │
│ [Bekijk je bestelling]                   │
├──────────────────────────────────────────┤
│ Footer: support-email, bedrijfsgegevens   │
└──────────────────────────────────────────┘
```

---

## Bestanden Overzicht

| Bestand | Actie | Beschrijving |
|---------|-------|-------------|
| `src/branches/ecommerce/hooks/orderStatusHook.ts` | NIEUW | afterChange hook die e-mails triggert |
| `src/features/email-marketing/lib/EmailService.ts` | UITBREIDEN | +2 methodes: cancellation, refund |
| `src/branches/ecommerce/collections/orders/Orders.ts` | WIJZIGEN | Hook registreren |

**Geen nieuwe dependencies. Geen migratie. Geen nieuwe componenten.**

### Implementatie Details (2026-03-08)

- `orderStatusHook.ts`: detecteert statuswijziging via `previousDoc.status !== doc.status`, resolved email via customerEmail/guestEmail/user relationship
- `EmailService.ts`: +`sendOrderCancellation()` met rode gradient header + refund-info, +`sendRefundConfirmation()` met paarse gradient + bedragweergave
- `Orders.ts`: `afterChange: [orderStatusHook]` toegevoegd aan hooks
- Build succesvol, TypeScript clean
- E-commerce Settings uitgebreid met tab "E-mail & Notificaties" (2 toggles: PDF attachment + tracking link)
- EmailService `.send()` uitgebreid met `attachments` parameter voor Resend API
- Alle order e-mail methodes accepteren nu `EmailOptions` (trackingLink, pdfAttachment)
- Migration: `20260308_120000_add_email_notification_settings`

---

## Verificatie

1. Maak testbestelling → status naar `paid` → controleer inbox
2. Wijzig status naar `shipped` met tracking code → controleer inbox
3. Wijzig status naar `delivered` → controleer inbox
4. Wijzig status naar `cancelled` → controleer inbox
5. Controleer dat `pending` → geen e-mail stuurt
