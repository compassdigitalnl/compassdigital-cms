# Carrier API Integratie — Design Specification

**Feature:** Automatische T&T updates via Sendcloud/MyParcel webhooks
**Prioriteit:** Middel
**Geschatte effort:** Middel
**Created:** 2026-03-08
**Status:** GEIMPLEMENTEERD (2026-03-08)

---

## Overview

Orders hebben al velden voor trackingCode, trackingUrl, shippingProvider en timeline[]. Tot nu toe werden deze handmatig ingevuld. Met carrier integratie worden tracking updates automatisch ontvangen via webhooks van Sendcloud of MyParcel, waardoor:
- Order status automatisch bijgewerkt wordt (shipped → delivered)
- Timeline events automatisch toegevoegd worden
- Tracking URL automatisch ingevuld wordt
- Klanten real-time updates zien op de /track pagina

---

## Architectuur

```
Sendcloud/MyParcel
        ↓ webhook POST
POST /api/webhooks/carrier
        ↓
Verify signature (HMAC-SHA256)
        ↓
Parse carrier-specifiek payload
        ↓
Map carrier status → order status + timeline event
        ↓
Find order by trackingCode
        ↓
Update order: status, timeline[], trackingUrl
        ↓
orderStatusHook fires → transactionele e-mail (als status changed)
```

---

## Wat Is Gebouwd

### 1. Carrier Webhook Endpoint

**Bestand:** `src/app/api/webhooks/carrier/route.ts` (NIEUW)

```
POST /api/webhooks/carrier
```

**Security:**
- Rate limiting: 30 req/IP/minuut
- HMAC-SHA256 signature verificatie per carrier
- Carrier provider check via E-commerce Settings

**Sendcloud Handler:**
- Parst `parcel_status_changed` events
- Mapt Sendcloud status IDs naar order statussen:
  - 3 (verzonden) → `shipped`
  - 4-9 (in transit varianten) → timeline event `in_transit`
  - 11 (afgeleverd) → `delivered`
  - 12 (geannuleerd) → `cancelled`
  - 80-91 (retour) → timeline events
- Signature via `sendcloud-signature` header

**MyParcel Handler:**
- Parst `shipment_status_change` hooks
- Mapt MyParcel status IDs naar order statussen:
  - 3 (verzonden) → `shipped`
  - 4-6 (sortering/distributie/douane) → `in_transit`
  - 7 (afgeleverd) → `delivered`
  - 32-33 (retour) → timeline events
  - 36 (geannuleerd) → `cancelled`
- Signature via `x-myparcel-authorization` header

**Duplicate Prevention:**
- Timeline events met hetzelfde event type binnen 5 minuten worden geskipt
- Status gaat alleen vooruit (shipped → delivered), nooit terug

### 2. Admin Instellingen

**Bestand:** `src/branches/ecommerce/collections/ecommerce-settings/index.ts` (UITGEBREID)

Nieuwe tab: **Carrier Integratie**
- `carrierIntegration.provider` (select: none/sendcloud/myparcel) — Welke provider
- `carrierIntegration.apiKey` (text) — API key
- `carrierIntegration.apiSecret` (text) — API secret
- `carrierIntegration.webhookSecret` (text) — Voor signature verificatie
- `carrierIntegration.webhookUrl` (text, read-only) — Auto-gegenereerde URL om te kopiëren

### 3. Migration

**Bestand:** `src/migrations/20260308_140000_add_abandoned_cart_and_carrier_settings.ts`

Kolommen:
- `carrier_integration_provider` (varchar, default: 'none')
- `carrier_integration_api_key` (varchar)
- `carrier_integration_api_secret` (varchar)
- `carrier_integration_webhook_secret` (varchar)
- `carrier_integration_webhook_url` (varchar)

---

## Sendcloud Setup Instructies

1. **E-commerce Settings → Carrier Integratie:**
   - Provider: Sendcloud
   - API Key + Secret: uit Sendcloud dashboard → Settings → Integrations
   - Webhook Secret: zelf kiezen of genereren

2. **Sendcloud Dashboard → Settings → Webhooks:**
   - URL: kopieer uit E-commerce Settings → Webhook URL
   - Event: `parcel_status_changed`
   - Secret: zelfde als in stap 1

3. **Test:** Maak verzendlabel aan in Sendcloud → tracking code komt automatisch in order

---

## MyParcel Setup Instructies

1. **E-commerce Settings → Carrier Integratie:**
   - Provider: MyParcel
   - API Key: uit MyParcel backoffice
   - Webhook Secret: zelf kiezen

2. **MyParcel Backoffice → Instellingen → Webhooks:**
   - URL: kopieer uit E-commerce Settings
   - Event: `shipment_status_change`

3. **Test:** Maak zending aan → status updates komen automatisch binnen

---

## Toekomstige Uitbreidingen

| Feature | Beschrijving | Prioriteit |
|---------|-------------|------------|
| Label generatie | Verzendlabel aanmaken vanuit order detail in admin | Hoog |
| Auto tracking code | Bij label aanmaak automatisch trackingCode invullen op order | Hoog |
| Retour labels | Retourlabel genereren en e-mailen naar klant | Middel |
| Tarieven API | Verzendkosten ophalen per pakket (gewicht/afmetingen) | Laag |
| Multi-carrier | Meerdere carriers tegelijk (bijv. PostNL binnenland + DHL internationaal) | Laag |

---

## Verificatie

1. E-commerce Settings → Carrier Integratie → Sendcloud/MyParcel selecteren + keys invullen
2. Webhook URL kopiëren naar carrier dashboard
3. Testpakket aanmaken bij carrier → webhook ontvangen
4. Order status automatisch bijgewerkt
5. Timeline event zichtbaar in admin + op /track pagina
6. Transactionele e-mail verstuurd bij statuswijziging (via orderStatusHook)
