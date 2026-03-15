# Publieke Order Tracking — Design Specification

**Feature:** Track & trace pagina die werkt zonder inloggen (ordernummer + e-mail)
**Prioriteit:** Middel
**Geschatte effort:** Klein (bestaande componenten hergebruiken)
**Created:** 2026-03-07
**Status:** GEIMPLEMENTEERD (2026-03-08)

---

## Overview

Het OrderTimeline component en de Orders collectie (met trackingCode, trackingUrl, shippingProvider, timeline[]) bestaan al. De `/orders/find` pagina bestaat ook. Wat ontbreekt is een **publieke tracking pagina** die werkt met ordernummer + e-mail (zonder account).

---

## Bestaande Infrastructuur (HERGEBRUIKEN)

| Component | Pad | Status |
|-----------|-----|--------|
| OrderTimeline | `src/branches/ecommerce/components/orders/OrderTimeline/` | Klaar — verticale timeline met statussen, iconen, timestamps, locaties, verwachte leverdatum |
| OrderDetailsCard | `src/branches/ecommerce/components/orders/OrderDetailsCard/` | Klaar — orderinfo weergave |
| OrderAddresses | `src/branches/ecommerce/components/orders/OrderAddresses/` | Klaar — verzend/factuuradres |
| OrderItemsSummary | `src/branches/ecommerce/components/orders/OrderItemsSummary/` | Klaar — productlijst |
| Orders collectie | `src/branches/ecommerce/collections/orders/Orders.ts` | Klaar — trackingCode, trackingUrl, shippingProvider, timeline[], expectedDeliveryDate |
| FindOrderForm | `src/app/(ecommerce)/orders/find/page.tsx` | Klaar — zoek order op e-mail |
| buildOrderTimeline | `src/branches/ecommerce/lib/buildOrderTimeline.ts` | Klaar — bouwt timeline data op |
| formatOrderStatus | `src/branches/ecommerce/lib/formatOrderStatus.ts` | Klaar — status labels |

---

## Wat Moet Gebouwd Worden

### 1. Tracking Pagina

**Bestand:** `src/app/(ecommerce)/track/page.tsx` (NIEUW)

Publieke pagina op `/track` met twee modes:

**Mode 1: Zoekformulier** (geen params)
```
┌──────────────────────────────────────────┐
│           Bestelling volgen              │
│                                          │
│ Ordernummer:  [ORD-2026-_____]          │
│ E-mailadres:  [jouw@email.nl___]        │
│                                          │
│ [Bestelling zoeken]                      │
│                                          │
│ Heb je een account?                      │
│ Log in voor een volledig overzicht →     │
└──────────────────────────────────────────┘
```

**Mode 2: Tracking weergave** (`/track?order=ORD-2026-00123&email=jan@...`)
```
┌──────────────────────────────────────────┐
│ Bestelling ORD-2026-00123                │
│ Status: Onderweg                         │
│                                          │
│ ┌── OrderTimeline ─────────────────────┐ │
│ │ ✓ Bestelling ontvangen  07-03 09:15  │ │
│ │ ✓ Betaling ontvangen    07-03 09:16  │ │
│ │ ✓ In behandeling        07-03 10:30  │ │
│ │ ● Verzonden             07-03 14:22  │ │
│ │   → PostNL: 3STEST123456789          │ │
│ │   → Verwacht: 08-03-2026            │ │
│ │ ○ Afgeleverd                         │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ ┌── Verzendgegevens ──────────────────┐  │
│ │ Jan de Vries                        │  │
│ │ Keizersgracht 123                   │  │
│ │ 1015 CJ Amsterdam                   │  │
│ └─────────────────────────────────────┘  │
│                                          │
│ ┌── Producten ────────────────────────┐  │
│ │ 2x Widget X         € 49,90        │  │
│ │ 1x Widget Y         € 24,95        │  │
│ │                Totaal: € 90,57      │  │
│ └─────────────────────────────────────┘  │
│                                          │
│ [Volg bij PostNL →]    [Contact opnemen] │
└──────────────────────────────────────────┘
```

### 2. API Route voor Publieke Tracking

**Bestand:** `src/app/api/track/route.ts` (NIEUW)

```
GET /api/track?order=ORD-2026-00123&email=jan@example.com
  → Zoek order op orderNumber + (guestEmail of user.email)
  → Geen auth check (publiek)
  → Return: beperkte orderdata (geen prijzen, alleen tracking-relevante info)
  → Rate limiting: max 10 requests per IP per minuut
```

**Response bevat:**
- Ordernummer, status, statusLabel
- Timeline events
- Tracking code + URL + carrier
- Verwachte leverdatum
- Verzendadres (alleen stad + postcode, GEEN straat — privacy)
- Productnamen + aantal (GEEN prijzen — privacy)

### 3. Tracking Link in E-mails

**Bestand:** `src/features/email-marketing/lib/EmailService.ts` (UITBREIDEN)

Alle transactionele e-mails bevatten een "Volg je bestelling" knop die linkt naar:
```
https://{SITE_URL}/track?order={orderNumber}&email={email}
```

---

## Bestanden Overzicht

| Bestand | Actie | Beschrijving |
|---------|-------|-------------|
| `src/app/(ecommerce)/track/page.tsx` | NIEUW | Publieke tracking pagina (client component) |
| `src/app/api/track/route.ts` | NIEUW | Publieke tracking API (rate limited) |
| `src/features/email-marketing/lib/EmailService.ts` | UITBREIDEN | Tracking link toevoegen aan alle e-mails |

**Geen nieuwe dependencies. Geen migratie.**

### Implementatie Details (2026-03-08)

- `track/route.ts`: publieke API met in-memory rate limiter (10 req/IP/min), valideert order+email match, returned beperkte data (geen prijzen, adres alleen stad+postcode), beschermt tegen email-enumeratie (zelfde 404 bij foute email)
- `track/page.tsx`: client component met zoekformulier + tracking resultaten. Toont order header met statusbadge, timeline met event-iconen, tracking info met carrier link, verzendgegevens (beperkt), producten (geen prijzen). URL params voor deelbaarheid.
- Tracking link in e-mails: configureerbaar via E-commerce Settings → E-mail & Notificaties → "Tracking link in e-mails"
- Alle transactionele e-mails krijgen een "Volg je bestelling" knop als deze instelling actief is
- `/track` pagina + `/api/track` API route zijn togglebaar via E-commerce Settings → E-mail & Notificaties → "Publieke order tracking (/track)"
- Als toggle UIT: `/track` toont "niet beschikbaar" + login link, API returned 404
- Migration: `email_notifications_enable_public_tracking` boolean kolom (default: false)

---

## Privacy & Security

- Geen auth nodig, maar order+email combinatie vereist
- Geen prijzen tonen op publieke tracking (privacy)
- Verzendadres alleen stad+postcode (geen straat)
- Rate limiting op API route (IP-based)
- Geen gevoelige orderdata in response

---

## Verificatie

1. `/track` → toont zoekformulier
2. Ordernummer + e-mail invullen → toont tracking met timeline
3. Foute e-mail → "Bestelling niet gevonden"
4. E-mail na verzending bevat werkende tracking link
5. Tracking pagina toont carrier link (bijv. "Volg bij PostNL")
6. Geen prijzen zichtbaar op publieke pagina
