# Abandoned Cart Detection — Design Specification

**Feature:** Automatische detectie van verlaten winkelwagens + trigger voor herinnerings-e-mails
**Prioriteit:** Hoog
**Geschatte effort:** Klein (bestaande automation engine hergebruiken)
**Created:** 2026-03-08
**Status:** GEIMPLEMENTEERD (2026-03-08)

---

## Overview

Het automation systeem (AutomationRules, AutomationFlows, BullMQ workers, Listmonk) bestaat al volledig. Het `cart.abandoned` event type is gedefinieerd met correcte payload interface. Wat ontbrak was de **trigger** — een cron job die inactieve carts detecteert en het event afvuurt.

---

## Bestaande Infrastructuur (HERGEBRUIKT)

| Component | Pad | Status |
|-----------|-----|--------|
| Carts collection | `packages/modules/cart/collections/Carts.ts` | Klaar — status: active/completed/abandoned/saved/quote |
| CartContext + useCart() | `src/branches/ecommerce/contexts/CartContext.tsx` | Klaar — localStorage persistence |
| AutomationRules | `src/features/email-marketing/collections/AutomationRules.ts` | Klaar — triggers op event types |
| AutomationFlows | `src/features/email-marketing/collections/AutomationFlows.ts` | Klaar — multi-step email flows |
| Automation Engine | `src/features/email-marketing/lib/automation/engine.ts` | Klaar — processEvent() |
| cart.abandoned event type | `src/features/email-marketing/lib/automation/types.ts` | Klaar — CartEventPayload interface |
| automationWorker | `src/lib/queue/workers/automationWorker.ts` | Klaar — executes send_email, add_to_list etc. |
| flowWorker | `src/lib/queue/workers/flowWorker.ts` | Klaar — executes multi-step flows |
| Listmonk client | `src/features/email-marketing/lib/listmonk/client.ts` | Klaar — sendTransactional, subscribers, lists |

---

## Wat Is Gebouwd

### 1. Cron Endpoint

**Bestand:** `src/app/api/cron/detect-abandoned-carts/route.ts` (NIEUW)

```
GET /api/cron/detect-abandoned-carts?secret=CRON_SECRET
```

Flow:
```
Cron (elke 30-60 min)
    ↓
GET /api/cron/detect-abandoned-carts
    ↓
Query: carts WHERE status='active' AND updatedAt < (now - timeoutHours)
    ↓
Per cart:
    ├─ Update status → 'abandoned'
    ├─ Resolve customer email
    └─ processEvent({ eventType: 'cart.abandoned', ... })
        ├─ Matching AutomationRules → BullMQ queue
        └─ Matching AutomationFlows → BullMQ queue
            └─ Listmonk → send email
```

### 2. Admin Instellingen

**Bestand:** `src/branches/ecommerce/collections/ecommerce-settings/index.ts` (UITGEBREID)

Nieuwe tab: **Abandoned Cart**
- `abandonedCart.enabled` (checkbox, default: false) — Activeer/deactiveer detectie
- `abandonedCart.timeoutHours` (number, default: 24, min: 1, max: 168) — Na hoeveel uur inactiviteit

### 3. Migration

**Bestand:** `src/migrations/20260308_140000_add_abandoned_cart_and_carrier_settings.ts`

Kolommen:
- `abandoned_cart_enabled` (boolean, default: false)
- `abandoned_cart_timeout_hours` (numeric, default: 24)

---

## Gebruik

### Cron instellen (systemd/crontab)

```bash
# Elke 30 minuten
*/30 * * * * curl -s "https://jouw-domein.nl/api/cron/detect-abandoned-carts?secret=$CRON_SECRET" > /dev/null
```

### Automation Rule aanmaken (in admin)

1. Ga naar E-commerce → Automation Rules
2. Maak nieuwe rule:
   - Trigger: `cart.abandoned`
   - Condition: `total > 0` (optioneel)
   - Action: `send_email` → selecteer template
   - Timing: delay 4 uur (optioneel, voor tweede herinnering)

### Automation Flow aanmaken (voor multi-step)

1. Ga naar E-commerce → Automation Flows
2. Entry trigger: `cart.abandoned`
3. Steps:
   - Step 1: send_email → "Je bent iets vergeten!" template
   - Step 2: wait → 24 uur
   - Step 3: condition → total > 100 → ifTrue: step 4, ifFalse: step 5
   - Step 4: send_email → "10% korting op je winkelwagen" template
   - Step 5: send_email → "Laatste herinnering" template

---

## Verificatie

1. E-commerce Settings → Abandoned Cart → toggle AAN, timeout 1 uur (voor test)
2. Maak cart aan, wacht 1+ uur
3. Call cron endpoint → cart status = 'abandoned'
4. Automation rule/flow getriggerd → e-mail verstuurd via Listmonk
5. Toggle UIT → cron skipped
