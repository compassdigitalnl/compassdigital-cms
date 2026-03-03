# Sendcloud Integration — Design Document

> Status: **Concept** | Prioriteit: Sprint 3+ | Auteur: Claude | Datum: 2026-03-04

## Overzicht

Sendcloud is de grootste verzendplatform in de Benelux. Integratie maakt het mogelijk om vanuit het CMS automatisch verzendlabels te genereren, tracking te volgen, en retourlabels aan te bieden.

**Waarom Sendcloud?**
- Marktleider NL/BE met 100+ carriers (PostNL, DHL, DPD, UPS, etc.)
- Goede API + webhooks
- Multi-carrier prijsvergelijking
- Retourportaal inbegrepen
- ~€45/maand (Essential plan) + per-label kosten

## Architectuur

```
┌─────────────────┐     ┌──────────────┐     ┌───────────┐
│  Order Created   │────▶│  Sendcloud   │────▶│  Carrier  │
│  (Payload hook)  │     │  API         │     │  (PostNL) │
└─────────────────┘     └──────┬───────┘     └───────────┘
                               │
                    Webhook ◀──┘
                               │
                    ┌──────────▼───────┐
                    │  Order updated   │
                    │  (tracking info) │
                    └──────────────────┘
```

### Bestanden

| Bestand | Beschrijving |
|---------|-------------|
| `src/lib/sendcloud/client.ts` | Sendcloud REST API client |
| `src/lib/sendcloud/types.ts` | TypeScript types voor Sendcloud API |
| `src/lib/sendcloud/webhook.ts` | Webhook signature verificatie |
| `src/app/api/sendcloud/webhook/route.ts` | Webhook endpoint voor tracking updates |
| `src/hooks/orders/afterCreate-sendcloud.ts` | Order hook: parcel creation |

## API Flow

### 1. Order -> Parcel Creation

Na `orders.afterChange` (status = 'confirmed'):

```typescript
// POST https://panel.sendcloud.sc/api/v2/parcels
{
  "parcel": {
    "name": "Jan de Vries",
    "address": "Hoofdstraat 123",
    "city": "Amsterdam",
    "postal_code": "1012AB",
    "country": "NL",
    "email": "jan@example.nl",
    "order_number": "ORD-2026-0042",
    "weight": "2.500",  // kg
    "shipment": {
      "id": 8  // Sendcloud shipping method ID
    }
  }
}
```

Response bevat:
- `parcel.id` — Sendcloud parcel ID
- `parcel.tracking_number` — Carrier tracking code
- `parcel.label.normal_printer` — PDF label URL

### 2. Label PDF ophalen

```typescript
// GET label URL from parcel response
// Opslaan als media attachment bij de order
```

### 3. Tracking Webhook

Sendcloud stuurt status updates via webhook:

```typescript
// POST /api/sendcloud/webhook
{
  "action": "parcel_status_changed",
  "parcel": {
    "id": 12345,
    "tracking_number": "3SXXXX...",
    "status": {
      "id": 11,
      "message": "Delivered"
    }
  }
}
```

Status mapping naar order:
| Sendcloud Status | Order Status |
|-----------------|-------------|
| 1 (Announced) | processing |
| 3 (En route) | shipped |
| 4 (Delivered) | delivered |
| 5 (Delivery attempt) | shipped |
| 8 (Returned) | returned |

### 4. Webhook Security

```typescript
import crypto from 'crypto'

function verifyWebhook(body: string, signature: string, secret: string): boolean {
  const hash = crypto.createHmac('sha256', secret).update(body).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature))
}
```

## Environment Variables

```env
SENDCLOUD_API_KEY=...        # Sendcloud API key
SENDCLOUD_API_SECRET=...     # Sendcloud API secret
SENDCLOUD_WEBHOOK_SECRET=... # Webhook verification secret
```

## Multi-Tenant

Elke tenant heeft zijn eigen Sendcloud account (eigen contract, eigen carriers).

**Optie A: Env vars per tenant** (simpelst)
- `SENDCLOUD_API_KEY` per PM2 process / .env file
- Werkt direct met huidige architectuur

**Optie B: Settings global** (schaalbaarder)
- Sendcloud credentials opslaan in Settings global (encrypted)
- Voordeel: wijzigbaar via /admin zonder restart
- Nadeel: vereist encryptie layer

**Aanbeveling:** Start met Optie A, migreer naar Optie B wanneer >5 tenants Sendcloud gebruiken.

## Shipping Methods Mapping

De `ShippingMethods` CMS collectie moet gemapped worden naar Sendcloud shipping method IDs:

```typescript
// Optioneel veld toevoegen aan ShippingMethods collectie:
{
  name: 'sendcloudMethodId',
  type: 'number',
  label: 'Sendcloud Method ID',
  admin: {
    position: 'sidebar',
    description: 'Koppeling met Sendcloud verzendmethode',
    condition: (data) => !!process.env.SENDCLOUD_API_KEY,
  },
}
```

## Implementatie Volgorde

1. **Fase 1:** `src/lib/sendcloud/client.ts` + types
2. **Fase 2:** Webhook endpoint + signature verificatie
3. **Fase 3:** Order hook (afterChange) voor automatische parcel creation
4. **Fase 4:** Label PDF opslag + download in admin
5. **Fase 5:** Tracking pagina voor klanten (`/order/{id}/tracking`)
6. **Fase 6:** Retourportaal integratie

## Referenties

- Sendcloud API Docs: https://docs.sendcloud.sc/api/v2/
- Sendcloud Webhooks: https://docs.sendcloud.sc/api/v2/webhooks/
- Sendcloud Pricing: https://www.sendcloud.nl/prijzen/
