# Implementatieplan: Email Marketing Engine voor Payload CMS Multi-Tenant Platform

## Inhoudsopgave

1. [Overzicht & Doelstelling](#1-overzicht--doelstelling)
2. [Architectuur](#2-architectuur)
3. [Technische Stack & Vereisten](#3-technische-stack--vereisten)
4. [Listmonk Setup & Multi-Tenancy](#4-listmonk-setup--multi-tenancy)
5. [Payload CMS Collections & Schema's](#5-payload-cms-collections--schemas)
6. [Database Schema & Migraties](#6-database-schema--migraties)
7. [BullMQ Job Architectuur](#7-bullmq-job-architectuur)
8. [Listmonk API Integratie Service](#8-listmonk-api-integratie-service)
9. [Event Systeem & Triggers](#9-event-systeem--triggers)
10. [Automation Rules Engine](#10-automation-rules-engine)
11. [GrapesJS Visuele Template Editor](#11-grapesjs-visuele-template-editor)
12. [E-mail Template Systeem](#12-e-mail-template-systeem)
13. [Analytics & Reporting](#13-analytics--reporting)
14. [Deliverability & Reputatiemanagement](#14-deliverability--reputatiemanagement)
15. [Pricing & Staffelprijzen](#15-pricing--staffelprijzen)
16. [Aandachtspunten & Valkuilen](#16-aandachtspunten--valkuilen)
17. [Fasering & Roadmap](#17-fasering--roadmap)
18. [Monitoring & Onderhoud](#18-monitoring--onderhoud)

---

## 1. Overzicht & Doelstelling

### Wat bouwen we?

Een event-driven e-mail marketing engine, ingebouwd in het bestaande Payload CMS multi-tenant platform. Klanten kunnen vanuit hun eigen tenant:

- **Campagnes** versturen naar segmenten van hun abonnees
- **Automation rules** instellen die reageren op events (nieuwe editie gepubliceerd, prijsverlaging, nieuw product, inactiviteit, etc.)
- **Templates** visueel ontwerpen met drag-and-drop (GrapesJS) in hun eigen branding
- **Resultaten** inzien (opens, clicks, bounces)

### Kernprincipe

Payload CMS = admin UI voor klanten. Listmonk = headless e-mail engine. BullMQ = flow- en scheduling-logica. GrapesJS = visuele template builder. De klant ziet nooit Listmonk.

### Use cases

| Use case | Trigger | Segment | Timing |
|----------|---------|---------|--------|
| Nieuwe editie tijdschrift | `edition.published` | Kopers van dat tijdschrift | Direct |
| Prijsverlaging in categorie | `product.priceDropped` | Klanten met interesse in categorie | Direct of batch (dagelijks) |
| Nieuw product in categorie | `product.added` | Klanten met interesse in categorie | Direct of batch |
| Welkomstreeks | `subscriber.created` | Nieuwe subscriber | Direct + delays |
| Verlaten winkelwagen | `cart.abandoned` | Specifieke klant | Na 1 uur + 24 uur |
| Post-purchase review | `order.delivered` | Specifieke klant | Na 7 dagen |
| Win-back | `customer.inactive` | Inactieve klanten (cron) | Periodiek |
| Back in stock | `product.backInStock` | Klanten met interest in product | Direct |
| Herbestelling | `order.reorderDue` | Klanten met verbruiksproducten (cron) | Periodiek |

---

## 2. Architectuur

### High-level overzicht

```
┌──────────────────────────────────────────────────────────┐
│                      PAYLOAD CMS                          │
│                (Multi-Tenant Admin UI)                     │
│                                                            │
│  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌────────┐       │
│  │Campaigns│ │Automation│ │ GrapesJS  │ │Segments│       │
│  │   UI    │ │ Rules UI │ │ Template  │ │   UI   │       │
│  │         │ │          │ │  Editor   │ │        │       │
│  └────┬────┘ └────┬─────┘ └─────┬─────┘ └───┬────┘       │
│       │           │             │            │             │
│  ┌────▼───────────▼─────────────▼────────────▼──────────┐ │
│  │            Listmonk Service Layer                     │ │
│  │       (abstraction over Listmonk REST API)            │ │
│  └──────────────────────┬───────────────────────────────┘ │
└─────────────────────────┼─────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
     ┌────▼────┐   ┌──────▼──────┐  ┌────▼─────┐
     │ Listmonk│   │   BullMQ    │  │ Postgres │
     │ (engine)│   │  (scheduler │  │ (Payload │
     │         │   │   & flows)  │  │   DB)    │
     └────┬────┘   └──────┬──────┘  └──────────┘
          │               │
     ┌────▼────┐   ┌──────▼──────┐
     │Listmonk │   │   Redis     │
     │Postgres │   │  (queues)   │
     └─────────┘   └─────────────┘
          │
     ┌────▼─────────────────┐
     │    SMTP Provider      │
     │  (Dedicated IP Pool)  │
     │  Mailcow / Amazon SES │
     └───────────────────────┘
```

### Dataflow: Campagne versturen

```
1. Klant ontwerpt template in GrapesJS (drag-and-drop)
2. GrapesJS exporteert geïnlinde HTML (email-safe)
3. Klant maakt campagne in Payload UI, koppelt template
4. Payload slaat campagne op in eigen DB
5. Bij "versturen" → Payload roept ListmonkService aan
6. ListmonkService:
   a. Synct template naar Listmonk (POST /api/templates)
   b. Synct subscribers/segment (POST /api/subscribers)
   c. Maakt campagne aan (POST /api/campaigns)
   d. Start campagne (PUT /api/campaigns/:id/status)
7. Listmonk verstuurt via SMTP (met rate limiting + warmup respect)
8. Webhook callback → Payload updatet status + analytics
```

### Dataflow: Automation Rule (event-driven)

```
1. Extern systeem stuurt event webhook naar Payload
   POST /api/webhooks/events { type: "edition.published", data: {...} }
2. Payload EventRouter matcht event tegen actieve AutomationRules
3. Per match → BullMQ job aangemaakt
   - Direct: job wordt meteen verwerkt
   - Met delay: job wordt ingepland
   - Batch: job wordt toegevoegd aan dagelijkse batch queue
4. BullMQ worker pikt job op
5. Worker roept ListmonkService.sendTransactional() aan
6. Listmonk verstuurt e-mail
7. Analytics worden teruggeschreven
```

### Dataflow: Lineaire flow (welkomstreeks)

```
1. Trigger: subscriber.created
2. BullMQ job: send-flow-step
   { flowId, subscriberId, step: 0 }
3. Worker verwerkt stap 0 → stuurt welkomstmail
4. Worker plant volgende job in met delay:
   { flowId, subscriberId, step: 1, delay: 86400000 } (24h)
5. Na 24h: Worker verwerkt stap 1 → stuurt mail 2
6. Worker plant stap 2 in met delay: 72h
7. Etc. tot flow compleet is
```

---

## 3. Technische Stack & Vereisten

### Bestaande stack (niet wijzigen)

| Component | Versie | Rol |
|-----------|--------|-----|
| Payload CMS | 3.x | Admin UI + API |
| Next.js | 15.x | Frontend |
| PostgreSQL | 16.x | Payload database |
| Redis | 7.x | Caching + queues |
| BullMQ | latest | Job scheduling |
| Hetzner | - | Hosting |
| Ploi | - | Server management |

### Toevoegen

| Component | Versie | Rol | Deployment |
|-----------|--------|-----|------------|
| Listmonk | 3.x | E-mail engine | Docker container op zelfde Hetzner VPS |
| PostgreSQL (Listmonk) | 16.x | Listmonk data store | Aparte database, zelfde PG cluster |
| GrapesJS | latest | Visuele template editor | NPM package, embedded in Payload UI |
| grapesjs-preset-newsletter | latest | Email-specifieke blocks & inlining | NPM plugin voor GrapesJS |
| @grapesjs/react | latest | React wrapper voor Payload integratie | NPM package |
| Mailcow of Amazon SES | - | SMTP delivery | Bestaande Mailcow of nieuw SES account |

### Systeemvereisten Listmonk

- RAM: ~128MB per instance (zeer lightweight)
- Disk: minimaal, afhankelijk van media uploads
- Poort: 9000 (intern, niet publiek exposed)
- Database: eigen PostgreSQL database (niet delen met Payload)

### Docker Compose toevoeging

```yaml
# Toevoegen aan bestaande docker-compose of apart bestand
services:
  listmonk:
    image: listmonk/listmonk:latest
    container_name: listmonk
    restart: unless-stopped
    ports:
      - "127.0.0.1:9000:9000"  # Alleen intern bereikbaar
    environment:
      - LISTMONK_app__address=0.0.0.0:9000
      - LISTMONK_app__admin_username=${LISTMONK_ADMIN_USER}
      - LISTMONK_app__admin_password=${LISTMONK_ADMIN_PASS}
      - LISTMONK_db__host=host.docker.internal  # Of je PG host
      - LISTMONK_db__port=5432
      - LISTMONK_db__user=listmonk
      - LISTMONK_db__password=${LISTMONK_DB_PASS}
      - LISTMONK_db__database=listmonk
    command: >
      sh -c "./listmonk --install --idempotent --yes && ./listmonk"
    networks:
      - internal

  # Als je een aparte PG wilt voor Listmonk:
  listmonk-db:
    image: postgres:16-alpine
    container_name: listmonk-db
    restart: unless-stopped
    environment:
      - POSTGRES_USER=listmonk
      - POSTGRES_PASSWORD=${LISTMONK_DB_PASS}
      - POSTGRES_DB=listmonk
    volumes:
      - listmonk-db-data:/var/lib/postgresql/data
    networks:
      - internal

volumes:
  listmonk-db-data:

networks:
  internal:
    driver: bridge
```

### Environment variabelen

```env
# .env toevoegingen
LISTMONK_URL=http://localhost:9000
LISTMONK_ADMIN_USER=admin
LISTMONK_ADMIN_PASS=<sterk-wachtwoord>
LISTMONK_API_USER=admin
LISTMONK_API_PASS=<sterk-wachtwoord>
LISTMONK_DB_PASS=<sterk-wachtwoord>

# SMTP configuratie (in Listmonk admin of via env)
SMTP_HOST=mail.jouwdomein.nl      # Mailcow
SMTP_PORT=587
SMTP_USER=noreply@jouwdomein.nl
SMTP_PASS=<smtp-wachtwoord>
SMTP_AUTH=login
SMTP_TLS=starttls

# Of voor Amazon SES:
# SMTP_HOST=email-smtp.eu-west-1.amazonaws.com
# SMTP_PORT=587
# SMTP_USER=<ses-access-key>
# SMTP_PASS=<ses-secret-key>
```

---

## 4. Listmonk Setup & Multi-Tenancy

### Multi-tenancy strategie

Listmonk heeft geen native multi-tenancy. Er zijn drie strategieën:

#### Optie A: Lijst-per-tenant (aanbevolen)

Elke tenant krijgt een of meer lijsten in dezelfde Listmonk-instance. Tenant-scheiding via lijstnaam-conventie en subscriber-attributen.

```
Lijst: tenant_abc_customers
Lijst: tenant_abc_leads
Lijst: tenant_abc_newsletter
Lijst: tenant_xyz_customers
Lijst: tenant_xyz_newsletter
```

**Voordelen:** één instance, weinig overhead, makkelijk te beheren.
**Nadelen:** geen harde isolatie, fout in code kan cross-tenant data lekken.
**Mitigatie:** altijd tenant-filter in ListmonkService, nooit directe API calls.

#### Optie B: Instance-per-tenant

Elke tenant een eigen Listmonk Docker container + database.

**Voordelen:** volledige isolatie, onafhankelijke configuratie.
**Nadelen:** meer resources, complexer beheer, meer containers.
**Wanneer:** als je >50 tenants verwacht of strenge data-isolatie nodig hebt.

#### Optie C: Hybride

Één gedeelde instance voor kleine tenants, dedicated instances voor premium tenants.

### Aanbeveling

Start met **Optie A** (lijst-per-tenant). Je kunt later migreren naar B als de behoefte ontstaat. De ListmonkService abstractie die we bouwen maakt het makkelijk om later te switchen.

### Listmonk initiële configuratie

Na installatie moet je via de API de basis configureren:

```typescript
// scripts/setup-listmonk.ts
// Eenmalig runnen na installatie

import { ListmonkClient } from '../src/services/listmonk/client';

async function setup() {
  const client = new ListmonkClient();

  // SMTP configuratie (kan ook via Listmonk admin UI)
  // Dit doe je handmatig via localhost:9000/admin

  // Standaard template verwijderen
  // Standaard lijst hernoemen of verwijderen
  // Bounce-handling instellen
  // Webhook URL configureren voor events
}
```

### Webhook configuratie

Listmonk kan webhooks sturen bij campaign events. Configureer in Listmonk admin:

```
Webhook URL: https://jouwplatform.nl/api/webhooks/listmonk
Events: campaign.sent, campaign.bounced, subscriber.optin
```

---

## 5. Payload CMS Collections & Schema's

### Overzicht van collections

```
email/
├── collections/
│   ├── EmailSubscribers.ts       # Abonnees per tenant
│   ├── EmailLists.ts             # Lijsten/segmenten per tenant
│   ├── EmailTemplates.ts         # E-mail templates per tenant (incl. GrapesJS data)
│   ├── EmailCampaigns.ts         # Campagnes per tenant
│   ├── AutomationRules.ts        # Event-driven automation regels
│   ├── AutomationFlows.ts        # Lineaire flow definities
│   ├── EmailEvents.ts            # Event log (opens, clicks, bounces)
│   └── WebhookEvents.ts          # Inkomende webhook events
├── components/
│   └── GrapesEmailEditor/        # GrapesJS React component voor Payload
│       ├── index.tsx             # Hoofd editor component
│       ├── config.ts             # GrapesJS configuratie + custom blocks
│       ├── plugins.ts            # Tenant-specifieke plugins (branding blocks)
│       └── styles.css            # Editor styling
├── services/
│   ├── listmonk/
│   │   ├── client.ts             # Listmonk REST API client
│   │   ├── sync.ts               # Sync logica Payload ↔ Listmonk
│   │   └── types.ts              # TypeScript types voor Listmonk API
│   ├── automation/
│   │   ├── engine.ts             # Automation rule matcher
│   │   ├── triggers.ts           # Event type definities
│   │   └── conditions.ts         # Condition evaluator
│   ├── deliverability/
│   │   ├── warmup.ts             # IP/domein warmup scheduler
│   │   ├── reputation.ts         # Reputatie monitoring
│   │   └── dns-validator.ts      # SPF/DKIM/DMARC validator per tenant
│   └── flows/
│       ├── executor.ts           # Flow step executor
│       └── scheduler.ts          # BullMQ flow scheduling
├── queues/
│   ├── email.queue.ts            # BullMQ queue definities
│   └── email.worker.ts           # BullMQ workers
├── hooks/
│   ├── afterCampaignCreate.ts    # Sync campaign naar Listmonk
│   ├── afterSubscriberChange.ts  # Sync subscriber naar Listmonk
│   └── afterTemplateChange.ts    # Sync template naar Listmonk
└── endpoints/
    ├── webhookEvents.ts          # POST /api/webhooks/events
    └── webhookListmonk.ts        # POST /api/webhooks/listmonk
```

### Collection: EmailSubscribers

```typescript
// collections/EmailSubscribers.ts
import { CollectionConfig } from 'payload';

export const EmailSubscribers: CollectionConfig = {
  slug: 'email-subscribers',
  admin: {
    useAsTitle: 'email',
    group: 'Email Marketing',
    defaultColumns: ['email', 'name', 'status', 'lists', 'createdAt'],
  },
  access: {
    // Tenant-scoped access control
    read: ({ req: { user } }) => {
      if (!user) return false;
      return { tenant: { equals: user.tenant } };
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => {
      if (!user) return false;
      return { tenant: { equals: user.tenant } };
    },
    delete: ({ req: { user } }) => {
      if (!user) return false;
      return { tenant: { equals: user.tenant } };
    },
  },
  hooks: {
    afterChange: [
      // Sync naar Listmonk bij create/update
      async ({ doc, operation, req }) => {
        const { syncSubscriberToListmonk } = await import(
          '../services/listmonk/sync'
        );
        await syncSubscriberToListmonk(doc, operation, req);
        return doc;
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const { deleteSubscriberFromListmonk } = await import(
          '../services/listmonk/sync'
        );
        await deleteSubscriberFromListmonk(doc, req);
      },
    ],
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      index: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'enabled',
      options: [
        { label: 'Actief', value: 'enabled' },
        { label: 'Uitgeschreven', value: 'unsubscribed' },
        { label: 'Geblokkeerd', value: 'blocklisted' },
      ],
      index: true,
    },
    {
      name: 'lists',
      type: 'relationship',
      relationTo: 'email-lists',
      hasMany: true,
    },
    {
      name: 'attributes',
      type: 'json',
      admin: {
        description:
          'Extra attributen (bv. klantnummer, aankoopgeschiedenis, interesses)',
      },
    },
    {
      // Listmonk interne ID — niet tonen aan klant
      name: 'listmonkId',
      type: 'number',
      admin: { hidden: true },
      index: true,
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Handmatig', value: 'manual' },
        { label: 'Import', value: 'import' },
        { label: 'Formulier', value: 'form' },
        { label: 'API', value: 'api' },
        { label: 'Webhook', value: 'webhook' },
      ],
    },
  ],
  indexes: [
    {
      // Uniek per tenant + email
      fields: { tenant: 1, email: 1 },
      options: { unique: true },
    },
  ],
};
```

### Collection: EmailLists

```typescript
// collections/EmailLists.ts
import { CollectionConfig } from 'payload';

export const EmailLists: CollectionConfig = {
  slug: 'email-lists',
  admin: {
    useAsTitle: 'name',
    group: 'Email Marketing',
  },
  access: {
    // Zelfde tenant-scoped access als EmailSubscribers
    read: ({ req: { user } }) => {
      if (!user) return false;
      return { tenant: { equals: user.tenant } };
    },
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        const { syncListToListmonk } = await import(
          '../services/listmonk/sync'
        );
        await syncListToListmonk(doc, operation, req);
        return doc;
      },
    ],
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'public',
      options: [
        { label: 'Publiek (opt-in)', value: 'public' },
        { label: 'Privé (handmatig)', value: 'private' },
      ],
    },
    {
      name: 'optin',
      type: 'select',
      defaultValue: 'double',
      options: [
        { label: 'Double opt-in', value: 'double' },
        { label: 'Single opt-in', value: 'single' },
      ],
    },
    {
      name: 'subscriberCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'listmonkId',
      type: 'number',
      admin: { hidden: true },
      index: true,
    },
  ],
};
```

### Collection: EmailTemplates (met GrapesJS)

```typescript
// collections/EmailTemplates.ts
import { CollectionConfig } from 'payload';

export const EmailTemplates: CollectionConfig = {
  slug: 'email-templates',
  admin: {
    useAsTitle: 'name',
    group: 'Email Marketing',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      return { tenant: { equals: user.tenant } };
    },
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        const { syncTemplateToListmonk } = await import(
          '../services/listmonk/sync'
        );
        await syncTemplateToListmonk(doc, operation, req);
        return doc;
      },
    ],
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      admin: {
        description: 'Onderwerpregel. Gebruik {{.Subscriber.Name}} voor personalisatie.',
      },
    },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'campaign',
      options: [
        { label: 'Campagne', value: 'campaign' },
        { label: 'Transactioneel', value: 'transactional' },
        { label: 'Automation', value: 'automation' },
      ],
    },
    {
      name: 'editorMode',
      type: 'select',
      defaultValue: 'visual',
      options: [
        { label: 'Visueel (GrapesJS)', value: 'visual' },
        { label: 'HTML code', value: 'html' },
        { label: 'MJML', value: 'mjml' },
      ],
      admin: {
        description: 'Kies de editor modus. Visueel = drag-and-drop, HTML = raw code.',
      },
    },
    {
      // GrapesJS project data (JSON) — bevat components, styles, assets
      name: 'grapesData',
      type: 'json',
      admin: {
        condition: (data) => data?.editorMode === 'visual',
        description: 'GrapesJS editor state (automatisch opgeslagen).',
      },
    },
    {
      // Geëxporteerde HTML — dit gaat naar Listmonk
      name: 'body',
      type: 'code',
      required: true,
      admin: {
        language: 'html',
        description:
          'Geëxporteerde e-mail HTML. Bij visuele modus automatisch gegenereerd door GrapesJS.',
        condition: (data) => data?.editorMode !== 'visual',
      },
    },
    {
      // Altijd opgeslagen: de uiteindelijke HTML die naar Listmonk gaat
      name: 'compiledHtml',
      type: 'textarea',
      admin: { hidden: true },
    },
    {
      name: 'previewText',
      type: 'text',
      admin: {
        description: 'Preview tekst die in de inbox wordt getoond.',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'listmonkId',
      type: 'number',
      admin: { hidden: true },
      index: true,
    },
  ],
};
```

### Collection: EmailCampaigns

```typescript
// collections/EmailCampaigns.ts
import { CollectionConfig } from 'payload';

export const EmailCampaigns: CollectionConfig = {
  slug: 'email-campaigns',
  admin: {
    useAsTitle: 'name',
    group: 'Email Marketing',
    defaultColumns: ['name', 'status', 'sendAt', 'sent', 'opens', 'clicks'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      return { tenant: { equals: user.tenant } };
    },
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Concept', value: 'draft' },
        { label: 'Ingepland', value: 'scheduled' },
        { label: 'Wordt verstuurd', value: 'running' },
        { label: 'Gepauzeerd', value: 'paused' },
        { label: 'Voltooid', value: 'finished' },
        { label: 'Geannuleerd', value: 'cancelled' },
      ],
      index: true,
    },
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'email-templates',
      required: true,
    },
    {
      name: 'lists',
      type: 'relationship',
      relationTo: 'email-lists',
      hasMany: true,
      required: true,
    },
    {
      name: 'fromEmail',
      type: 'email',
      admin: {
        description: 'Laat leeg voor standaard afzender van de tenant.',
      },
    },
    {
      name: 'fromName',
      type: 'text',
    },
    {
      name: 'sendAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Laat leeg om direct te versturen.',
      },
    },
    // Analytics (read-only, bijgewerkt via webhooks)
    {
      name: 'analytics',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        { name: 'sent', type: 'number', defaultValue: 0 },
        { name: 'opens', type: 'number', defaultValue: 0 },
        { name: 'uniqueOpens', type: 'number', defaultValue: 0 },
        { name: 'clicks', type: 'number', defaultValue: 0 },
        { name: 'uniqueClicks', type: 'number', defaultValue: 0 },
        { name: 'bounces', type: 'number', defaultValue: 0 },
        { name: 'unsubscribes', type: 'number', defaultValue: 0 },
      ],
    },
    {
      name: 'listmonkCampaignId',
      type: 'number',
      admin: { hidden: true },
      index: true,
    },
  ],
};
```

### Collection: AutomationRules

```typescript
// collections/AutomationRules.ts
import { CollectionConfig } from 'payload';

export const AutomationRules: CollectionConfig = {
  slug: 'automation-rules',
  admin: {
    useAsTitle: 'name',
    group: 'Email Marketing',
    defaultColumns: ['name', 'trigger', 'active', 'lastTriggered'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      return { tenant: { equals: user.tenant } };
    },
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'trigger',
      type: 'select',
      required: true,
      options: [
        { label: 'Nieuw product toegevoegd', value: 'product.added' },
        { label: 'Product afgeprijsd', value: 'product.priceDropped' },
        { label: 'Product weer op voorraad', value: 'product.backInStock' },
        { label: 'Nieuwe editie gepubliceerd', value: 'edition.published' },
        { label: 'Nieuw artikel gepubliceerd', value: 'content.published' },
        { label: 'Bestelling afgeleverd', value: 'order.delivered' },
        { label: 'Winkelwagen verlaten', value: 'cart.abandoned' },
        { label: 'Nieuwe subscriber', value: 'subscriber.created' },
        { label: 'Klant inactief', value: 'customer.inactive' },
        { label: 'Herbestelling gepland', value: 'order.reorderDue' },
      ],
      index: true,
    },
    {
      name: 'conditions',
      type: 'array',
      admin: {
        description:
          'Optionele voorwaarden waaraan het event moet voldoen.',
      },
      fields: [
        {
          name: 'field',
          type: 'text',
          required: true,
          admin: {
            description:
              'Event data veld, bv. "category", "price", "product_type"',
          },
        },
        {
          name: 'operator',
          type: 'select',
          required: true,
          options: [
            { label: 'Is gelijk aan', value: 'equals' },
            { label: 'Is niet gelijk aan', value: 'not_equals' },
            { label: 'Bevat', value: 'contains' },
            { label: 'Groter dan', value: 'greater_than' },
            { label: 'Kleiner dan', value: 'less_than' },
            { label: 'In lijst', value: 'in' },
          ],
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description:
              'Waarde om mee te vergelijken. Voor "in": komma-gescheiden.',
          },
        },
      ],
    },
    {
      name: 'action',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'send_campaign',
          options: [
            { label: 'Stuur campagne naar segment', value: 'send_campaign' },
            {
              label: 'Stuur transactionele mail naar individu',
              value: 'send_transactional',
            },
            { label: 'Start flow', value: 'start_flow' },
          ],
        },
        {
          name: 'template',
          type: 'relationship',
          relationTo: 'email-templates',
          required: true,
        },
        {
          name: 'targetList',
          type: 'relationship',
          relationTo: 'email-lists',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.type === 'send_campaign',
            description: 'Lijst om de campagne naar te sturen.',
          },
        },
        {
          name: 'flow',
          type: 'relationship',
          relationTo: 'automation-flows',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.type === 'start_flow',
          },
        },
        {
          name: 'delay',
          type: 'group',
          admin: {
            description: 'Optionele vertraging voor de actie.',
          },
          fields: [
            {
              name: 'amount',
              type: 'number',
              defaultValue: 0,
              min: 0,
            },
            {
              name: 'unit',
              type: 'select',
              defaultValue: 'minutes',
              options: [
                { label: 'Minuten', value: 'minutes' },
                { label: 'Uren', value: 'hours' },
                { label: 'Dagen', value: 'days' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'scheduling',
      type: 'group',
      admin: {
        description: 'Optioneel: batch events in plaats van direct versturen.',
      },
      fields: [
        {
          name: 'mode',
          type: 'select',
          defaultValue: 'immediate',
          options: [
            { label: 'Direct', value: 'immediate' },
            { label: 'Dagelijkse batch', value: 'daily_batch' },
            { label: 'Wekelijkse batch', value: 'weekly_batch' },
          ],
        },
        {
          name: 'batchTime',
          type: 'text',
          admin: {
            description: 'Tijdstip voor batch verzending, bv. "09:00"',
            condition: (data, siblingData) =>
              siblingData?.mode !== 'immediate',
          },
        },
      ],
    },
    {
      name: 'lastTriggered',
      type: 'date',
      admin: { readOnly: true },
    },
    {
      name: 'triggerCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
  ],
};
```

### Collection: AutomationFlows

```typescript
// collections/AutomationFlows.ts
import { CollectionConfig } from 'payload';

export const AutomationFlows: CollectionConfig = {
  slug: 'automation-flows',
  admin: {
    useAsTitle: 'name',
    group: 'Email Marketing',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      return { tenant: { equals: user.tenant } };
    },
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'order',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Verstuur e-mail', value: 'send_email' },
            { label: 'Wacht', value: 'delay' },
          ],
        },
        {
          name: 'template',
          type: 'relationship',
          relationTo: 'email-templates',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.type === 'send_email',
          },
        },
        {
          name: 'delay',
          type: 'group',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.type === 'delay',
          },
          fields: [
            {
              name: 'amount',
              type: 'number',
              required: true,
              min: 1,
            },
            {
              name: 'unit',
              type: 'select',
              required: true,
              options: [
                { label: 'Minuten', value: 'minutes' },
                { label: 'Uren', value: 'hours' },
                { label: 'Dagen', value: 'days' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'stats',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        { name: 'activeSubscribers', type: 'number', defaultValue: 0 },
        { name: 'completedSubscribers', type: 'number', defaultValue: 0 },
      ],
    },
  ],
};
```

### Collection: EmailEvents (Analytics Log)

```typescript
// collections/EmailEvents.ts
import { CollectionConfig } from 'payload';

export const EmailEvents: CollectionConfig = {
  slug: 'email-events',
  admin: {
    group: 'Email Marketing',
    defaultColumns: ['type', 'campaign', 'subscriber', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      return { tenant: { equals: user.tenant } };
    },
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Verstuurd', value: 'sent' },
        { label: 'Geopend', value: 'opened' },
        { label: 'Geklikt', value: 'clicked' },
        { label: 'Bounce', value: 'bounced' },
        { label: 'Uitgeschreven', value: 'unsubscribed' },
        { label: 'Klacht', value: 'complained' },
      ],
      index: true,
    },
    {
      name: 'campaign',
      type: 'relationship',
      relationTo: 'email-campaigns',
      index: true,
    },
    {
      name: 'subscriber',
      type: 'relationship',
      relationTo: 'email-subscribers',
      index: true,
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Extra data: URL bij click, bounce-reden, etc.',
      },
    },
  ],
};
```

---

## 6. Database Schema & Migraties

### Payload migraties

Payload 3.x beheert migraties automatisch op basis van collection-wijzigingen. Bij het toevoegen van de collections hierboven worden de volgende tabellen automatisch aangemaakt.

```bash
# Na het toevoegen van de collections:
pnpm payload migrate:create add-email-marketing-collections
pnpm payload migrate
```

### Verwachte database tabellen (Payload/Postgres)

```sql
-- Automatisch gegenereerd door Payload, maar ter referentie:

-- email_subscribers
-- email_subscribers_rels (relaties naar tenants, email_lists)
-- email_lists
-- email_lists_rels
-- email_templates (nu met grapesData JSON kolom)
-- email_templates_rels
-- email_campaigns
-- email_campaigns_rels
-- automation_rules
-- automation_rules_conditions (array sub-tabel)
-- automation_rules_rels
-- automation_flows
-- automation_flows_steps (array sub-tabel)
-- automation_flows_rels
-- email_events
-- email_events_rels
```

### Handmatige indexen (toevoegen via migratie)

```sql
-- Migratie: add-email-marketing-indexes

-- Snelle subscriber lookup per tenant + email
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_subscribers_tenant_email
  ON email_subscribers (tenant, email);

-- Snelle automation rule matching
CREATE INDEX IF NOT EXISTS idx_automation_rules_trigger_active
  ON automation_rules (trigger, active)
  WHERE active = true;

-- Email events tijdlijn per campagne
CREATE INDEX IF NOT EXISTS idx_email_events_campaign_type
  ON email_events (campaign, type, created_at DESC);

-- Email events per subscriber
CREATE INDEX IF NOT EXISTS idx_email_events_subscriber
  ON email_events (subscriber, created_at DESC);

-- Campagnes per tenant + status
CREATE INDEX IF NOT EXISTS idx_email_campaigns_tenant_status
  ON email_campaigns (tenant, status);
```

### Listmonk database

Listmonk beheert zijn eigen database volledig. Hier niet aan zitten. De Listmonk PostgreSQL database bevat:

- `subscribers` — alle subscribers
- `lists` — mailinglijsten
- `campaigns` — campagnes
- `templates` — templates
- `campaign_views` — open tracking
- `link_clicks` — click tracking
- `bounces` — bounce log
- `settings` — configuratie

Let op: de Payload database en de Listmonk database moeten gescheiden blijven. Geen cross-database queries.

### Data-integriteit waarborgen

```typescript
// Belangrijk: Listmonk IDs bijhouden in Payload

// Bij elke sync-operatie:
// 1. Maak aan in Listmonk → krijg Listmonk ID terug
// 2. Sla Listmonk ID op in Payload record (listmonkId veld)
// 3. Bij updates: gebruik listmonkId om juiste record te updaten

// Voorbeeld: subscriber sync
async function syncSubscriberToListmonk(doc, operation) {
  if (operation === 'create') {
    const result = await listmonk.createSubscriber({
      email: doc.email,
      name: doc.name,
      status: doc.status,
      lists: [doc.listmonkListId],
      attribs: {
        tenant_id: doc.tenant,
        ...doc.attributes,
      },
    });

    // KRITIEK: sla Listmonk ID op
    await payload.update({
      collection: 'email-subscribers',
      id: doc.id,
      data: { listmonkId: result.data.id },
    });
  }
}
```

---

## 7. BullMQ Job Architectuur

### Queue definities

```typescript
// queues/email.queue.ts
import { Queue } from 'bullmq';
import { redis } from '../lib/redis';

// Hoofd-queue voor alle email jobs
export const emailQueue = new Queue('email', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000, // 5s, 25s, 125s
    },
    removeOnComplete: {
      age: 7 * 24 * 3600, // Bewaar 7 dagen
      count: 10000,
    },
    removeOnFail: {
      age: 30 * 24 * 3600, // Bewaar fails 30 dagen
    },
  },
});

// Aparte queue voor scheduled/delayed jobs
export const scheduledEmailQueue = new Queue('email-scheduled', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 10000,
    },
  },
});

// Queue voor batch processing (dagelijkse/wekelijkse digests)
export const batchEmailQueue = new Queue('email-batch', {
  connection: redis,
});
```

### Job types

```typescript
// queues/types.ts

export interface SendCampaignJob {
  type: 'send_campaign';
  tenantId: string;
  campaignId: string;
}

export interface SendTransactionalJob {
  type: 'send_transactional';
  tenantId: string;
  subscriberId: string;
  templateId: string;
  variables?: Record<string, any>;
}

export interface ProcessAutomationJob {
  type: 'process_automation';
  tenantId: string;
  ruleId: string;
  eventData: Record<string, any>;
}

export interface FlowStepJob {
  type: 'flow_step';
  tenantId: string;
  flowId: string;
  subscriberId: string;
  stepIndex: number;
  flowRunId: string;
}

export interface SyncAnalyticsJob {
  type: 'sync_analytics';
  tenantId: string;
  campaignId: string;
  listmonkCampaignId: number;
}

export interface BatchDigestJob {
  type: 'batch_digest';
  tenantId: string;
  ruleId: string;
  events: Record<string, any>[];
}

export type EmailJob =
  | SendCampaignJob
  | SendTransactionalJob
  | ProcessAutomationJob
  | FlowStepJob
  | SyncAnalyticsJob
  | BatchDigestJob;
```

### Workers

```typescript
// queues/email.worker.ts
import { Worker, Job } from 'bullmq';
import { redis } from '../lib/redis';
import { EmailJob } from './types';
import { ListmonkService } from '../services/listmonk/client';
import { getPayload } from 'payload';

const worker = new Worker<EmailJob>(
  'email',
  async (job: Job<EmailJob>) => {
    const payload = await getPayload({ config: payloadConfig });
    const listmonk = new ListmonkService();

    switch (job.data.type) {
      case 'send_campaign':
        return handleSendCampaign(job.data, payload, listmonk);
      case 'send_transactional':
        return handleSendTransactional(job.data, payload, listmonk);
      case 'process_automation':
        return handleProcessAutomation(job.data, payload, listmonk);
      case 'flow_step':
        return handleFlowStep(job.data, payload, listmonk);
      case 'sync_analytics':
        return handleSyncAnalytics(job.data, payload, listmonk);
      default:
        throw new Error(`Unknown job type: ${(job.data as any).type}`);
    }
  },
  {
    connection: redis,
    concurrency: 5,
    limiter: {
      max: 10,     // Max 10 jobs
      duration: 1000, // Per seconde (rate limiting)
    },
  }
);

// === Job handlers ===

async function handleSendCampaign(
  data: SendCampaignJob,
  payload: any,
  listmonk: ListmonkService
) {
  const campaign = await payload.findByID({
    collection: 'email-campaigns',
    id: data.campaignId,
    depth: 2,
  });

  const listmonkTemplateId = await listmonk.ensureTemplate(campaign.template);
  const listmonkListIds = await Promise.all(
    campaign.lists.map((list: any) => listmonk.ensureList(list))
  );

  // Gebruik compiledHtml (GrapesJS output) of body (raw HTML)
  const emailBody = campaign.template.compiledHtml || campaign.template.body;

  const listmonkCampaign = await listmonk.createCampaign({
    name: `${data.tenantId}_${campaign.name}_${Date.now()}`,
    subject: campaign.template.subject,
    lists: listmonkListIds,
    template_id: listmonkTemplateId,
    from_email: campaign.fromEmail || undefined,
    content_type: 'html',
    body: emailBody,
  });

  await payload.update({
    collection: 'email-campaigns',
    id: data.campaignId,
    data: {
      listmonkCampaignId: listmonkCampaign.data.id,
      status: 'running',
    },
  });

  await listmonk.startCampaign(listmonkCampaign.data.id);

  // Plan analytics sync over 5 minuten
  await emailQueue.add(
    'sync-analytics',
    {
      type: 'sync_analytics',
      tenantId: data.tenantId,
      campaignId: data.campaignId,
      listmonkCampaignId: listmonkCampaign.data.id,
    },
    { delay: 5 * 60 * 1000 }
  );
}

async function handleFlowStep(
  data: FlowStepJob,
  payload: any,
  listmonk: ListmonkService
) {
  const flow = await payload.findByID({
    collection: 'automation-flows',
    id: data.flowId,
    depth: 2,
  });

  if (!flow.active) return;

  const step = flow.steps.find((s: any) => s.order === data.stepIndex);
  if (!step) return;

  if (step.type === 'send_email') {
    const subscriber = await payload.findByID({
      collection: 'email-subscribers',
      id: data.subscriberId,
    });

    if (subscriber.status !== 'enabled') return;

    await listmonk.sendTransactional({
      subscriber_email: subscriber.email,
      template_id: step.template.listmonkId,
    });
  }

  const nextStep = flow.steps.find(
    (s: any) => s.order === data.stepIndex + 1
  );

  if (!nextStep) return;

  let delay = 0;
  if (nextStep.type === 'delay') {
    const multipliers = {
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
    };
    delay =
      nextStep.delay.amount *
      multipliers[nextStep.delay.unit as keyof typeof multipliers];

    const stepAfterDelay = flow.steps.find(
      (s: any) => s.order === nextStep.order + 1
    );
    if (stepAfterDelay) {
      await emailQueue.add(
        `flow-${data.flowRunId}-step-${stepAfterDelay.order}`,
        {
          type: 'flow_step',
          tenantId: data.tenantId,
          flowId: data.flowId,
          subscriberId: data.subscriberId,
          stepIndex: stepAfterDelay.order,
          flowRunId: data.flowRunId,
        },
        { delay }
      );
    }
  } else {
    await emailQueue.add(
      `flow-${data.flowRunId}-step-${nextStep.order}`,
      {
        type: 'flow_step',
        tenantId: data.tenantId,
        flowId: data.flowId,
        subscriberId: data.subscriberId,
        stepIndex: nextStep.order,
        flowRunId: data.flowRunId,
      }
    );
  }
}

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} (${job?.data.type}) failed:`, err.message);
});

worker.on('error', (err) => {
  console.error('Worker error:', err);
});

export default worker;
```

### Cron jobs voor tijdgebaseerde triggers

```typescript
// queues/cron.ts
import { Queue } from 'bullmq';
import { redis } from '../lib/redis';

export function setupCronJobs(emailQueue: Queue) {
  // Dagelijkse check voor inactieve klanten
  emailQueue.add(
    'cron-inactive-customers',
    { type: 'cron_check', checkType: 'customer.inactive' },
    { repeat: { pattern: '0 9 * * *' } } // Elke dag om 09:00
  );

  // Dagelijkse check voor herbestellingen
  emailQueue.add(
    'cron-reorder-check',
    { type: 'cron_check', checkType: 'order.reorderDue' },
    { repeat: { pattern: '0 10 * * *' } }
  );

  // Batch digest verzending
  emailQueue.add(
    'cron-batch-digest',
    { type: 'cron_check', checkType: 'batch.process' },
    { repeat: { pattern: '0 8 * * *' } }
  );

  // Analytics sync elke 15 minuten voor actieve campagnes
  emailQueue.add(
    'cron-analytics-sync',
    { type: 'cron_check', checkType: 'analytics.sync' },
    { repeat: { pattern: '*/15 * * * *' } }
  );
}
```

---

## 8. Listmonk API Integratie Service

### Client

```typescript
// services/listmonk/client.ts

interface ListmonkConfig {
  baseUrl: string;
  username: string;
  password: string;
}

export class ListmonkService {
  private config: ListmonkConfig;
  private authHeader: string;

  constructor() {
    this.config = {
      baseUrl: process.env.LISTMONK_URL || 'http://localhost:9000',
      username: process.env.LISTMONK_API_USER || 'admin',
      password: process.env.LISTMONK_API_PASS || '',
    };
    this.authHeader =
      'Basic ' +
      Buffer.from(
        `${this.config.username}:${this.config.password}`
      ).toString('base64');
  }

  private async request<T>(
    method: string,
    path: string,
    body?: any
  ): Promise<T> {
    const url = `${this.config.baseUrl}/api${path}`;
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: this.authHeader,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Listmonk API error ${response.status}: ${error}`);
    }

    return response.json();
  }

  // === Subscribers ===
  async createSubscriber(data: {
    email: string; name?: string; status?: string;
    lists?: number[]; attribs?: Record<string, any>;
  }) {
    return this.request<any>('POST', '/subscribers', data);
  }

  async updateSubscriber(id: number, data: Partial<{
    email: string; name: string; status: string;
    lists: number[]; attribs: Record<string, any>;
  }>) {
    return this.request<any>('PUT', `/subscribers/${id}`, data);
  }

  async deleteSubscriber(id: number) {
    return this.request<any>('DELETE', `/subscribers/${id}`);
  }

  // === Lists ===
  async createList(data: {
    name: string; type: 'public' | 'private';
    optin: 'single' | 'double'; description?: string;
  }) {
    return this.request<any>('POST', '/lists', data);
  }

  async updateList(id: number, data: Partial<{
    name: string; type: string; optin: string;
  }>) {
    return this.request<any>('PUT', `/lists/${id}`, data);
  }

  // === Templates ===
  async createTemplate(data: {
    name: string; body: string;
    type: 'campaign' | 'tx'; is_default?: boolean;
  }) {
    return this.request<any>('POST', '/templates', data);
  }

  async updateTemplate(id: number, data: Partial<{
    name: string; body: string;
  }>) {
    return this.request<any>('PUT', `/templates/${id}`, data);
  }

  // === Campaigns ===
  async createCampaign(data: {
    name: string; subject: string; lists: number[];
    template_id: number; from_email?: string;
    content_type: 'html' | 'markdown' | 'plain'; body: string;
  }) {
    return this.request<any>('POST', '/campaigns', data);
  }

  async startCampaign(id: number) {
    return this.request<any>('PUT', `/campaigns/${id}/status`, { status: 'running' });
  }

  async getCampaignStats(id: number) {
    return this.request<any>('GET', `/campaigns/${id}`);
  }

  // === Transactional ===
  async sendTransactional(data: {
    subscriber_email?: string; subscriber_id?: number;
    template_id: number; data?: Record<string, any>;
    content_type?: string; from_email?: string;
  }) {
    return this.request<any>('POST', '/tx', data);
  }

  // === Helpers ===
  async ensureTemplate(payloadTemplate: any): Promise<number> {
    // Gebruik compiledHtml (GrapesJS) als beschikbaar, anders body
    const templateBody = payloadTemplate.compiledHtml || payloadTemplate.body;

    if (payloadTemplate.listmonkId) {
      await this.updateTemplate(payloadTemplate.listmonkId, {
        name: payloadTemplate.name,
        body: templateBody,
      });
      return payloadTemplate.listmonkId;
    }

    const result = await this.createTemplate({
      name: `tenant_${payloadTemplate.tenant}_${payloadTemplate.name}`,
      body: templateBody,
      type: payloadTemplate.type === 'transactional' ? 'tx' : 'campaign',
    });

    return result.data.id;
  }

  async ensureList(payloadList: any): Promise<number> {
    if (payloadList.listmonkId) return payloadList.listmonkId;

    const result = await this.createList({
      name: `tenant_${payloadList.tenant}_${payloadList.name}`,
      type: payloadList.type === 'public' ? 'public' : 'private',
      optin: payloadList.optin === 'double' ? 'double' : 'single',
      description: payloadList.description,
    });

    return result.data.id;
  }
}
```

### Sync service

```typescript
// services/listmonk/sync.ts
import { ListmonkService } from './client';

const listmonk = new ListmonkService();

export async function syncSubscriberToListmonk(
  doc: any, operation: 'create' | 'update', req: any
) {
  try {
    if (operation === 'create') {
      const listmonkListIds = await getListmonkListIds(doc.lists, req.payload);
      const result = await listmonk.createSubscriber({
        email: doc.email,
        name: doc.name || '',
        status: doc.status || 'enabled',
        lists: listmonkListIds,
        attribs: { tenant_id: doc.tenant, payload_id: doc.id, ...doc.attributes },
      });

      await req.payload.update({
        collection: 'email-subscribers',
        id: doc.id,
        data: { listmonkId: result.data.id },
        context: { skipListmonkSync: true },
      });
    }

    if (operation === 'update' && doc.listmonkId) {
      if (req.context?.skipListmonkSync) return;
      const listmonkListIds = await getListmonkListIds(doc.lists, req.payload);
      await listmonk.updateSubscriber(doc.listmonkId, {
        email: doc.email,
        name: doc.name || '',
        status: doc.status,
        lists: listmonkListIds,
        attribs: { tenant_id: doc.tenant, payload_id: doc.id, ...doc.attributes },
      });
    }
  } catch (error) {
    console.error(`Failed to sync subscriber ${doc.id} to Listmonk:`, error);
  }
}

export async function deleteSubscriberFromListmonk(doc: any, req: any) {
  try {
    if (doc.listmonkId) {
      await listmonk.deleteSubscriber(doc.listmonkId);
    }
  } catch (error) {
    console.error(`Failed to delete subscriber ${doc.id} from Listmonk:`, error);
  }
}

async function getListmonkListIds(lists: any[], payload: any): Promise<number[]> {
  if (!lists || lists.length === 0) return [];
  const resolved = await Promise.all(
    lists.map(async (list: any) => {
      const listId = typeof list === 'string' ? list : list.id;
      const fullList = await payload.findByID({ collection: 'email-lists', id: listId });
      return fullList.listmonkId;
    })
  );
  return resolved.filter(Boolean) as number[];
}
```

---

## 9. Event Systeem & Triggers

### Webhook endpoint voor externe events

```typescript
// endpoints/webhookEvents.ts
import { Endpoint } from 'payload';
import { emailQueue } from '../queues/email.queue';

export const webhookEventsEndpoint: Endpoint = {
  path: '/webhooks/events',
  method: 'post',
  handler: async (req) => {
    const { type, tenantId, data } = req.body as {
      type: string; tenantId: string; data: Record<string, any>;
    };

    if (!type || !tenantId) {
      return Response.json({ error: 'Missing type or tenantId' }, { status: 400 });
    }

    const apiKey = req.headers.get('x-api-key');
    // ... valideer API key tegen tenant

    const rules = await req.payload.find({
      collection: 'automation-rules',
      where: {
        tenant: { equals: tenantId },
        trigger: { equals: type },
        active: { equals: true },
      },
    });

    for (const rule of rules.docs) {
      await emailQueue.add(
        `automation-${rule.id}-${Date.now()}`,
        { type: 'process_automation', tenantId, ruleId: rule.id, eventData: data }
      );
    }

    return Response.json({ ok: true, matched: rules.docs.length });
  },
};
```

### Webhook endpoint voor Listmonk callbacks

```typescript
// endpoints/webhookListmonk.ts
import { Endpoint } from 'payload';

export const webhookListmonkEndpoint: Endpoint = {
  path: '/webhooks/listmonk',
  method: 'post',
  handler: async (req) => {
    const event = req.body as any;

    try {
      switch (event.type) {
        case 'campaign.sent':
        case 'campaign.opened':
        case 'campaign.clicked':
        case 'campaign.bounced':
          await handleCampaignEvent(event, req.payload);
          break;
        case 'subscriber.optin':
        case 'subscriber.unsubscribe':
          await handleSubscriberEvent(event, req.payload);
          break;
      }
    } catch (error) {
      console.error('Listmonk webhook error:', error);
    }

    return Response.json({ ok: true });
  },
};

async function handleCampaignEvent(event: any, payload: any) {
  const campaigns = await payload.find({
    collection: 'email-campaigns',
    where: { listmonkCampaignId: { equals: event.campaign_id } },
    limit: 1,
  });

  if (campaigns.docs.length === 0) return;
  const campaign = campaigns.docs[0];

  await payload.create({
    collection: 'email-events',
    data: {
      tenant: campaign.tenant,
      type: mapListmonkEventType(event.type),
      campaign: campaign.id,
      metadata: event.data || {},
    },
  });
}

function mapListmonkEventType(listmonkType: string): string {
  const map: Record<string, string> = {
    'campaign.sent': 'sent',
    'campaign.opened': 'opened',
    'campaign.clicked': 'clicked',
    'campaign.bounced': 'bounced',
    'subscriber.unsubscribe': 'unsubscribed',
  };
  return map[listmonkType] || listmonkType;
}
```

---

## 10. Automation Rules Engine

### Condition evaluator

```typescript
// services/automation/conditions.ts

interface Condition {
  field: string;
  operator: string;
  value: string;
}

export function evaluateConditions(
  conditions: Condition[],
  eventData: Record<string, any>
): boolean {
  if (!conditions || conditions.length === 0) return true;

  return conditions.every((condition) => {
    const actualValue = getNestedValue(eventData, condition.field);

    switch (condition.operator) {
      case 'equals':
        return String(actualValue) === condition.value;
      case 'not_equals':
        return String(actualValue) !== condition.value;
      case 'contains':
        return String(actualValue).toLowerCase().includes(condition.value.toLowerCase());
      case 'greater_than':
        return Number(actualValue) > Number(condition.value);
      case 'less_than':
        return Number(actualValue) < Number(condition.value);
      case 'in':
        const allowedValues = condition.value.split(',').map((v) => v.trim());
        return allowedValues.includes(String(actualValue));
      default:
        return false;
    }
  });
}

function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce(
    (acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj
  );
}
```

### Automation handler

```typescript
// services/automation/engine.ts
import { evaluateConditions } from './conditions';
import { ListmonkService } from '../listmonk/client';
import { emailQueue } from '../../queues/email.queue';
import { v4 as uuidv4 } from 'uuid';

export async function handleAutomationRule(
  ruleId: string,
  eventData: Record<string, any>,
  payload: any,
  listmonk: ListmonkService
) {
  const rule = await payload.findByID({
    collection: 'automation-rules', id: ruleId, depth: 2,
  });

  if (!rule.active) return;

  const conditionsMet = evaluateConditions(rule.conditions, eventData);
  if (!conditionsMet) return;

  const delay = calculateDelay(rule.action.delay);

  switch (rule.action.type) {
    case 'send_campaign':
      await handleSendCampaignAction(rule, eventData, delay, payload, listmonk);
      break;
    case 'send_transactional':
      await handleSendTransactionalAction(rule, eventData, delay, payload, listmonk);
      break;
    case 'start_flow':
      await handleStartFlowAction(rule, eventData, delay, payload);
      break;
  }

  await payload.update({
    collection: 'automation-rules',
    id: ruleId,
    data: {
      lastTriggered: new Date().toISOString(),
      triggerCount: (rule.triggerCount || 0) + 1,
    },
  });
}

function calculateDelay(delay?: { amount: number; unit: string }): number {
  if (!delay || !delay.amount) return 0;
  const multipliers: Record<string, number> = {
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
  };
  return delay.amount * (multipliers[delay.unit] || 0);
}
```

---

## 11. GrapesJS Visuele Template Editor

### Waarom GrapesJS?

GrapesJS is een open-source (MIT), framework-agnostisch drag-and-drop builder framework met 20.000+ GitHub stars. Voor de Email Marketing Engine kiezen we GrapesJS omdat:

- **Open-source & gratis** — geen licentiekosten, geen vendor lock-in
- **Newsletter preset** — `grapesjs-preset-newsletter` levert email-specifieke blocks die correct renderen in alle grote e-mailclients (Gmail, Outlook, Apple Mail)
- **React wrapper** — `@grapesjs/react` integreert naadloos in Payload CMS (Next.js)
- **Inline CSS export** — email-clients ondersteunen geen `<style>` blocks; GrapesJS exporteert automatisch geïnlinde HTML
- **Table-based layout** — genereert Outlook-compatibele table-based layouts
- **Customizable blocks** — je kunt tenant-specifieke blocks toevoegen (logo, branding, product cards)
- **Lightweight** — core ~250KB gzipped + preset ~60KB

### NPM packages installeren

```bash
pnpm add grapesjs @grapesjs/react grapesjs-preset-newsletter
```

### GrapesJS React component voor Payload

```typescript
// components/GrapesEmailEditor/index.tsx
'use client';

import React, { useCallback, useRef } from 'react';
import grapesjs, { Editor } from 'grapesjs';
import GjsEditor from '@grapesjs/react';
import newsletterPreset from 'grapesjs-preset-newsletter';
import { getEditorConfig } from './config';
import './styles.css';

interface GrapesEmailEditorProps {
  initialData?: any;         // GrapesJS project JSON (opgeslagen in grapesData veld)
  initialHtml?: string;      // Fallback HTML als er geen project data is
  onSave: (data: {
    grapesData: any;          // GrapesJS project state (voor opslaan)
    compiledHtml: string;     // Geïnlinde HTML (voor Listmonk)
  }) => void;
  tenantBranding?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
  };
}

export default function GrapesEmailEditor({
  initialData,
  initialHtml,
  onSave,
  tenantBranding,
}: GrapesEmailEditorProps) {
  const editorRef = useRef<Editor | null>(null);

  const onEditorInit = useCallback((editor: Editor) => {
    editorRef.current = editor;

    // Laad opgeslagen project data als beschikbaar
    if (initialData) {
      editor.loadProjectData(initialData);
    } else if (initialHtml) {
      editor.setComponents(initialHtml);
    }

    // Registreer tenant-specifieke blocks als branding beschikbaar is
    if (tenantBranding) {
      registerTenantBlocks(editor, tenantBranding);
    }

    // Registreer Listmonk template variabelen als custom blocks
    registerListmonkVariableBlocks(editor);

    // Auto-save bij elke wijziging (debounced)
    let saveTimeout: NodeJS.Timeout;
    editor.on('change:changesCount', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        handleSave(editor);
      }, 2000); // 2 seconden debounce
    });
  }, [initialData, initialHtml, tenantBranding]);

  const handleSave = useCallback((editor: Editor) => {
    // Exporteer geïnlinde HTML (email-safe)
    const compiledHtml = editor.runCommand('gjs-get-inlined-html') as string;

    // Sla project data op voor later bewerken
    const grapesData = editor.getProjectData();

    onSave({ grapesData, compiledHtml });
  }, [onSave]);

  return (
    <div className="grapes-email-editor-wrapper">
      <GjsEditor
        grapesjs={grapesjs}
        grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
        onEditor={onEditorInit}
        options={getEditorConfig()}
        plugins={[newsletterPreset]}
        pluginsOpts={{
          [newsletterPreset as any]: {
            inlineCss: true,       // Verplicht voor e-mailclients
            tableLayout: true,     // Outlook-compatibele table layouts
            cellStyle: {
              'font-family': tenantBranding?.fontFamily || 'Arial, sans-serif',
              'font-size': '14px',
              'color': '#333333',
            },
          },
        }}
      />

      <div className="editor-actions">
        <button
          className="btn-save"
          onClick={() => editorRef.current && handleSave(editorRef.current)}
        >
          Opslaan
        </button>
        <button
          className="btn-preview"
          onClick={() => {
            if (editorRef.current) {
              const html = editorRef.current.runCommand('gjs-get-inlined-html');
              const win = window.open('', '_blank');
              win?.document.write(html as string);
            }
          }}
        >
          Preview
        </button>
      </div>
    </div>
  );
}

// === Tenant-specifieke blocks ===

function registerTenantBlocks(editor: Editor, branding: any) {
  const blockManager = editor.BlockManager;

  // Logo header block
  if (branding.logo) {
    blockManager.add('tenant-logo', {
      label: 'Logo Header',
      category: 'Branding',
      content: `
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${branding.primaryColor || '#ffffff'};">
          <tr>
            <td align="center" style="padding: 20px;">
              <img src="${branding.logo}" alt="Logo" style="max-width: 200px; height: auto;" />
            </td>
          </tr>
        </table>
      `,
    });
  }

  // Branded button block
  blockManager.add('tenant-button', {
    label: 'Branded Button',
    category: 'Branding',
    content: `
      <table cellpadding="0" cellspacing="0" style="margin: 20px auto;">
        <tr>
          <td align="center" style="
            background-color: ${branding.primaryColor || '#2E75B6'};
            border-radius: 4px;
            padding: 12px 24px;
          ">
            <a href="#" style="
              color: #ffffff;
              text-decoration: none;
              font-family: ${branding.fontFamily || 'Arial, sans-serif'};
              font-size: 16px;
              font-weight: bold;
            ">Klik hier</a>
          </td>
        </tr>
      </table>
    `,
  });

  // Branded footer block
  blockManager.add('tenant-footer', {
    label: 'Branded Footer',
    category: 'Branding',
    content: `
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; margin-top: 20px;">
        <tr>
          <td align="center" style="padding: 20px; font-size: 12px; color: #999; font-family: ${branding.fontFamily || 'Arial, sans-serif'};">
            <a href="{{ .UnsubscribeURL }}" style="color: #999;">Uitschrijven</a> |
            <a href="#" style="color: #999;">Voorkeuren wijzigen</a>
          </td>
        </tr>
      </table>
    `,
  });
}

// === Listmonk variabele blocks ===

function registerListmonkVariableBlocks(editor: Editor) {
  const blockManager = editor.BlockManager;

  blockManager.add('var-subscriber-name', {
    label: 'Naam subscriber',
    category: 'Personalisatie',
    content: '<span data-variable="subscriber-name">{{ .Subscriber.Name }}</span>',
  });

  blockManager.add('var-subscriber-email', {
    label: 'E-mail subscriber',
    category: 'Personalisatie',
    content: '<span data-variable="subscriber-email">{{ .Subscriber.Email }}</span>',
  });

  blockManager.add('var-unsubscribe', {
    label: 'Uitschrijflink',
    category: 'Personalisatie',
    content: '<a href="{{ .UnsubscribeURL }}" style="color: #999; font-size: 12px;">Uitschrijven</a>',
  });

  blockManager.add('var-tracking-link', {
    label: 'Tracked Link',
    category: 'Personalisatie',
    content: '<a href=\'{{ TrackLink "https://jouwsite.nl" }}\' style="color: #2E75B6;">Bezoek onze site</a>',
  });
}
```

### GrapesJS configuratie

```typescript
// components/GrapesEmailEditor/config.ts

export function getEditorConfig() {
  return {
    height: '700px',
    storageManager: false, // We doen eigen opslag via Payload
    canvas: {
      styles: [
        // Reset CSS voor email-achtige rendering in canvas
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
      ],
    },
    deviceManager: {
      devices: [
        { name: 'Desktop', width: '600px' },  // Standaard email breedte
        { name: 'Mobiel', width: '320px', widthMedia: '480px' },
      ],
    },
    panels: {
      defaults: [
        {
          id: 'devices',
          el: '.panel__devices',
          buttons: [
            { id: 'device-desktop', label: '💻', command: 'set-device-desktop', active: true },
            { id: 'device-mobile', label: '📱', command: 'set-device-mobile' },
          ],
        },
      ],
    },
    // Beperk beschikbare CSS properties voor email-compatibiliteit
    styleManager: {
      sectors: [
        {
          name: 'Typografie',
          properties: [
            'font-family', 'font-size', 'font-weight',
            'color', 'line-height', 'text-align', 'text-decoration',
          ],
        },
        {
          name: 'Ruimte',
          properties: ['padding', 'margin'],
        },
        {
          name: 'Achtergrond',
          properties: ['background-color'],
        },
        {
          name: 'Borders',
          properties: ['border-radius', 'border'],
        },
      ],
    },
  };
}
```

### Integratie in Payload EmailTemplates admin UI

```typescript
// Payload custom component voor het template edit formulier
// Dit vervangt het standaard code-veld met GrapesJS wanneer editorMode = 'visual'

// In je Payload config, voeg een custom component toe aan EmailTemplates:
// admin.components.edit.GrapesEditor

import React, { useCallback } from 'react';
import { useField } from 'payload/components/forms';
import GrapesEmailEditor from './GrapesEmailEditor';

export const GrapesEditorField: React.FC = () => {
  const { value: grapesData, setValue: setGrapesData } = useField<any>({
    path: 'grapesData',
  });
  const { value: compiledHtml, setValue: setCompiledHtml } = useField<string>({
    path: 'compiledHtml',
  });
  const { value: editorMode } = useField<string>({ path: 'editorMode' });

  const handleSave = useCallback((data: {
    grapesData: any;
    compiledHtml: string;
  }) => {
    setGrapesData(data.grapesData);
    setCompiledHtml(data.compiledHtml);
  }, [setGrapesData, setCompiledHtml]);

  if (editorMode !== 'visual') return null;

  return (
    <div style={{ marginTop: '20px' }}>
      <h4>Visuele Email Editor</h4>
      <GrapesEmailEditor
        initialData={grapesData}
        onSave={handleSave}
      />
    </div>
  );
};
```

### Email-client compatibiliteit

GrapesJS met de newsletter preset genereert automatisch:

| Feature | Ondersteuning |
|---------|--------------|
| Table-based layout | Outlook, Gmail, Yahoo, Apple Mail |
| Inline CSS | Alle clients (geen `<style>` block nodig) |
| Responsive (media queries) | Gmail app, Apple Mail, Outlook app |
| Outlook conditional comments | `<!--[if mso]>` fallbacks |
| Image ALT tekst | Alle clients |
| Retina images | Apple Mail, Gmail |
| Dark mode support | Beperkt (via `prefers-color-scheme`) |

### Custom email blocks library

Naast de standaard GrapesJS newsletter blocks, voegen we een library toe van veelgebruikte e-commerce blocks:

```typescript
// components/GrapesEmailEditor/ecommerce-blocks.ts

export function registerEcommerceBlocks(editor: Editor) {
  const bm = editor.BlockManager;

  // Product card block
  bm.add('product-card', {
    label: 'Product Card',
    category: 'E-commerce',
    content: `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
        <tr>
          <td width="200" style="padding: 10px;">
            <img src="https://via.placeholder.com/180x180" alt="Product" style="width: 180px; height: auto;" />
          </td>
          <td style="padding: 10px; vertical-align: top;">
            <h3 style="margin: 0 0 8px; font-size: 18px; color: #333;">Productnaam</h3>
            <p style="margin: 0 0 8px; font-size: 14px; color: #666;">Korte beschrijving van het product.</p>
            <p style="margin: 0 0 12px; font-size: 20px; font-weight: bold; color: #333;">€29,95</p>
            <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #2E75B6; color: #fff; text-decoration: none; border-radius: 4px;">Bekijk product</a>
          </td>
        </tr>
      </table>
    `,
  });

  // Price drop block
  bm.add('price-drop', {
    label: 'Prijsverlaging',
    category: 'E-commerce',
    content: `
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFF3E0; padding: 15px; margin-bottom: 20px;">
        <tr>
          <td style="padding: 10px;">
            <span style="font-size: 12px; color: #E65100; font-weight: bold; text-transform: uppercase;">Prijsverlaging!</span>
            <h3 style="margin: 5px 0; font-size: 18px; color: #333;">Productnaam</h3>
            <p style="margin: 0;">
              <span style="text-decoration: line-through; color: #999; font-size: 16px;">€29,95</span>
              <span style="font-size: 22px; font-weight: bold; color: #E65100; margin-left: 10px;">€19,95</span>
            </p>
          </td>
        </tr>
      </table>
    `,
  });

  // Two-column product grid
  bm.add('product-grid-2col', {
    label: '2-kolom Product Grid',
    category: 'E-commerce',
    content: `
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="50%" style="padding: 10px; text-align: center; vertical-align: top;">
            <img src="https://via.placeholder.com/250x250" alt="Product 1" style="width: 100%; max-width: 250px;" />
            <h4 style="margin: 10px 0 5px;">Product 1</h4>
            <p style="font-size: 18px; font-weight: bold; color: #333;">€19,95</p>
          </td>
          <td width="50%" style="padding: 10px; text-align: center; vertical-align: top;">
            <img src="https://via.placeholder.com/250x250" alt="Product 2" style="width: 100%; max-width: 250px;" />
            <h4 style="margin: 10px 0 5px;">Product 2</h4>
            <p style="font-size: 18px; font-weight: bold; color: #333;">€24,95</p>
          </td>
        </tr>
      </table>
    `,
  });
}
```

---

## 12. E-mail Template Systeem

### Template variabelen

Listmonk gebruikt Go templating. Standaard beschikbare variabelen:

```
{{ .Subscriber.Email }}
{{ .Subscriber.Name }}
{{ .Subscriber.Attribs.custom_field }}
{{ .Campaign.Name }}
{{ .Campaign.Subject }}
{{ .UnsubscribeURL }}
{{ .TrackLink "https://voorbeeld.nl" }}
```

### Custom variabelen via transactionele mails

```typescript
await listmonk.sendTransactional({
  subscriber_email: 'klant@voorbeeld.nl',
  template_id: 5,
  data: {
    edition_title: 'Vogue Januari 2026',
    edition_url: 'https://shop.nl/vogue-jan-2026',
    product_name: 'Medische Handschoenen XL',
    old_price: '€29,95',
    new_price: '€19,95',
    discount_percent: '33%',
  },
});
```

In het template (of in GrapesJS als custom variabele block):

```html
<h1>Nieuwe editie: {{ .Tx.Data.edition_title }}</h1>
<a href="{{ .Tx.Data.edition_url }}">Bestel nu</a>

<!-- Of voor prijsverlaging: -->
<p>
  {{ .Tx.Data.product_name }} is afgeprijsd van
  {{ .Tx.Data.old_price }} naar
  <strong>{{ .Tx.Data.new_price }}</strong>!
</p>
```

### Template flow: GrapesJS → Listmonk

```
1. Klant opent template in Payload admin
2. editorMode = 'visual' → GrapesJS editor laadt
3. Klant bouwt email met drag-and-drop
4. Bij opslaan:
   a. GrapesJS project data → grapesData veld (JSON, voor later bewerken)
   b. GrapesJS exporteert geïnlinde HTML → compiledHtml veld
5. Payload afterChange hook:
   a. Leest compiledHtml (of body bij HTML modus)
   b. Synct naar Listmonk via syncTemplateToListmonk()
6. Bij campagne versturen: Listmonk gebruikt de HTML uit stap 5
```

---

## 13. Analytics & Reporting

### Analytics sync strategie

#### Optie A: Periodieke sync (aanbevolen)

```typescript
async function syncCampaignAnalytics(payload: any, listmonk: ListmonkService) {
  const campaigns = await payload.find({
    collection: 'email-campaigns',
    where: {
      status: { in: ['running', 'finished'] },
      listmonkCampaignId: { exists: true },
    },
    limit: 100,
  });

  for (const campaign of campaigns.docs) {
    try {
      const stats = await listmonk.getCampaignStats(campaign.listmonkCampaignId);
      await payload.update({
        collection: 'email-campaigns',
        id: campaign.id,
        data: {
          analytics: {
            sent: stats.data.sent || 0,
            opens: stats.data.opens || 0,
            uniqueOpens: stats.data.unique_opens || 0,
            clicks: stats.data.clicks || 0,
            uniqueClicks: stats.data.unique_clicks || 0,
            bounces: stats.data.bounces || 0,
          },
          status: stats.data.status === 'finished' ? 'finished' : campaign.status,
        },
      });
    } catch (error) {
      console.error(`Analytics sync failed for campaign ${campaign.id}:`, error);
    }
  }
}
```

#### Optie B: Webhook-driven (aanvullend)

Via de Listmonk webhook endpoint (zie sectie 9) worden individuele events real-time gelogd in de `email-events` collection.

### Dashboard queries

```typescript
async function getCampaignPerformance(tenantId: string, payload: any) {
  const campaigns = await payload.find({
    collection: 'email-campaigns',
    where: {
      tenant: { equals: tenantId },
      status: { in: ['finished', 'running'] },
    },
    sort: '-createdAt',
    limit: 20,
  });

  return campaigns.docs.map((c: any) => ({
    name: c.name,
    sent: c.analytics?.sent || 0,
    openRate: c.analytics?.sent
      ? ((c.analytics.uniqueOpens / c.analytics.sent) * 100).toFixed(1)
      : '0',
    clickRate: c.analytics?.sent
      ? ((c.analytics.uniqueClicks / c.analytics.sent) * 100).toFixed(1)
      : '0',
    bounceRate: c.analytics?.sent
      ? ((c.analytics.bounces / c.analytics.sent) * 100).toFixed(1)
      : '0',
  }));
}
```

---

## 14. Deliverability & Reputatiemanagement

### Waarom dit cruciaal is

In 2025/2026 hebben Google, Yahoo en Microsoft strenge bulk-sender requirements ingevoerd. Domeinen met volledige authenticatie (SPF+DKIM+DMARC) bereiken tot 2,7x vaker de inbox dan niet-geauthenticeerde afzenders. Het verschil tussen goed en slecht geconfigureerde deliverability is letterlijk het verschil tussen 85-95% inbox placement en <50%.

### DNS Authenticatie per tenant

Elke tenant die e-mail verstuurt via het platform moet de volgende DNS records correct configureren op hun eigen domein.

#### SPF (Sender Policy Framework)

```
v=spf1 include:_spf.jouwplatform.nl ~all
```

Beperkingen en best practices:

- Maximaal 10 DNS lookups per SPF record (inclusief `include` chains)
- Gebruik één SPF record per domein (meerdere = fout)
- Gebruik `~all` (softfail) tijdens setup, migreer naar `-all` (hardfail) na verificatie
- Test met `dig TXT tenantdomein.nl` of online tools

#### DKIM (DomainKeys Identified Mail)

```
# Selector: platform._domainkey.tenantdomein.nl
v=DKIM1; k=rsa; p=MIIBIjANBgkq...
```

Best practices:

- Gebruik 2048-bit keys (standaard bij Mailcow)
- Gebruik een dedicated selector per platform (bv. `platform._domainkey`)
- Roteer keys jaarlijks
- Zorg dat het DKIM signing domain aligned is met het From-domein

#### DMARC (Domain-based Message Authentication, Reporting & Conformance)

Gefaseerde uitrol per tenant:

```
# Fase 1: Monitor (eerste 30 dagen)
v=DMARC1; p=none; rua=mailto:dmarc@jouwplatform.nl; ruf=mailto:dmarc@jouwplatform.nl;

# Fase 2: Quarantine (na 30 dagen, als rapportages clean zijn)
v=DMARC1; p=quarantine; pct=25; rua=mailto:dmarc@jouwplatform.nl;

# Fase 3: Reject (na 60 dagen, als alles aligned is)
v=DMARC1; p=reject; rua=mailto:dmarc@jouwplatform.nl;
```

### DNS Validator Service

```typescript
// services/deliverability/dns-validator.ts
import dns from 'dns/promises';

interface DnsValidationResult {
  spf: { valid: boolean; record?: string; issues: string[] };
  dkim: { valid: boolean; record?: string; issues: string[] };
  dmarc: { valid: boolean; record?: string; policy?: string; issues: string[] };
  overallScore: number; // 0-100
}

export async function validateTenantDns(domain: string): Promise<DnsValidationResult> {
  const result: DnsValidationResult = {
    spf: { valid: false, issues: [] },
    dkim: { valid: false, issues: [] },
    dmarc: { valid: false, issues: [] },
    overallScore: 0,
  };

  // === SPF Check ===
  try {
    const txtRecords = await dns.resolveTxt(domain);
    const spfRecord = txtRecords.flat().find(r => r.startsWith('v=spf1'));

    if (!spfRecord) {
      result.spf.issues.push('Geen SPF record gevonden');
    } else {
      result.spf.record = spfRecord;
      result.spf.valid = true;

      // Check op veelvoorkomende problemen
      if (spfRecord.includes('+all')) {
        result.spf.issues.push('SPF staat +all toe — iedereen kan mailen namens dit domein');
        result.spf.valid = false;
      }
      if (spfRecord.split('include:').length - 1 > 8) {
        result.spf.issues.push('Te veel SPF includes (risico op >10 DNS lookups)');
      }
    }
  } catch (error) {
    result.spf.issues.push(`DNS lookup mislukt: ${error}`);
  }

  // === DKIM Check ===
  try {
    const selectors = ['platform', 'default', 'dkim', 'mail'];
    for (const selector of selectors) {
      try {
        const records = await dns.resolveTxt(`${selector}._domainkey.${domain}`);
        const dkimRecord = records.flat().join('');
        if (dkimRecord.includes('v=DKIM1')) {
          result.dkim.record = dkimRecord;
          result.dkim.valid = true;

          // Check key lengte
          if (dkimRecord.includes('k=rsa') && dkimRecord.length < 300) {
            result.dkim.issues.push('DKIM key lijkt te kort — gebruik 2048-bit');
          }
          break;
        }
      } catch { /* selector niet gevonden, probeer volgende */ }
    }

    if (!result.dkim.valid) {
      result.dkim.issues.push('Geen DKIM record gevonden op bekende selectors');
    }
  } catch (error) {
    result.dkim.issues.push(`DKIM lookup mislukt: ${error}`);
  }

  // === DMARC Check ===
  try {
    const records = await dns.resolveTxt(`_dmarc.${domain}`);
    const dmarcRecord = records.flat().find(r => r.startsWith('v=DMARC1'));

    if (!dmarcRecord) {
      result.dmarc.issues.push('Geen DMARC record gevonden');
    } else {
      result.dmarc.record = dmarcRecord;
      result.dmarc.valid = true;

      // Parse policy
      const policyMatch = dmarcRecord.match(/p=(\w+)/);
      result.dmarc.policy = policyMatch?.[1] || 'none';

      if (result.dmarc.policy === 'none') {
        result.dmarc.issues.push('DMARC op monitor-modus — geen enforcement');
      }

      // Check voor rua (reporting)
      if (!dmarcRecord.includes('rua=')) {
        result.dmarc.issues.push('Geen DMARC rapportage-adres (rua) geconfigureerd');
      }
    }
  } catch (error) {
    result.dmarc.issues.push(`DMARC lookup mislukt: ${error}`);
  }

  // === Score berekenen ===
  let score = 0;
  if (result.spf.valid) score += 30;
  if (result.dkim.valid) score += 35;
  if (result.dmarc.valid) {
    score += 15;
    if (result.dmarc.policy === 'quarantine') score += 10;
    if (result.dmarc.policy === 'reject') score += 10;
  }
  result.overallScore = score;

  return result;
}
```

### IP/Domein Warmup Strategie

Nieuwe domeinen en IP-adressen moeten geleidelijk opgebouwd worden. ISPs (Gmail, Microsoft, Yahoo) wantrouwen nieuwe afzenders.

#### Warmup schema

```typescript
// services/deliverability/warmup.ts

interface WarmupSchedule {
  day: number;
  maxEmails: number;
  focus: string;
}

export const DEFAULT_WARMUP_SCHEDULE: WarmupSchedule[] = [
  // Week 1: Foundation — alleen bestaande contacten
  { day: 1, maxEmails: 20, focus: 'Meest engaged subscribers' },
  { day: 2, maxEmails: 30, focus: 'Meest engaged subscribers' },
  { day: 3, maxEmails: 40, focus: 'Meest engaged subscribers' },
  { day: 4, maxEmails: 50, focus: 'Actieve klanten' },
  { day: 5, maxEmails: 75, focus: 'Actieve klanten' },

  // Week 2: Gradual expansion
  { day: 8, maxEmails: 100, focus: 'Brede subscriber base' },
  { day: 9, maxEmails: 150, focus: 'Brede subscriber base' },
  { day: 10, maxEmails: 200, focus: 'Brede subscriber base' },
  { day: 11, maxEmails: 300, focus: 'Brede subscriber base' },
  { day: 12, maxEmails: 400, focus: 'Brede subscriber base' },

  // Week 3: Scaling
  { day: 15, maxEmails: 600, focus: 'Volledige lijsten' },
  { day: 16, maxEmails: 800, focus: 'Volledige lijsten' },
  { day: 17, maxEmails: 1000, focus: 'Volledige lijsten' },
  { day: 18, maxEmails: 1500, focus: 'Volledige lijsten' },
  { day: 19, maxEmails: 2000, focus: 'Volledige lijsten' },

  // Week 4+: Full operation
  { day: 22, maxEmails: 3000, focus: 'Normaal volume' },
  { day: 25, maxEmails: 5000, focus: 'Normaal volume' },
  { day: 28, maxEmails: 10000, focus: 'Normaal volume' },
  { day: 30, maxEmails: -1, focus: 'Geen limiet (monitor wel bounce rates)' },
];

export class WarmupManager {
  async getMaxEmailsForTenant(tenantId: string, payload: any): Promise<number> {
    // Haal tenant warmup status op
    const tenant = await payload.findByID({
      collection: 'tenants',
      id: tenantId,
    });

    const warmupStartDate = tenant.emailWarmupStartDate;
    if (!warmupStartDate) return 50; // Default: conservatief

    const daysSinceStart = Math.floor(
      (Date.now() - new Date(warmupStartDate).getTime()) / (24 * 60 * 60 * 1000)
    );

    // Zoek het juiste warmup level
    const schedule = DEFAULT_WARMUP_SCHEDULE.filter(s => s.day <= daysSinceStart);
    const currentLevel = schedule[schedule.length - 1];

    return currentLevel?.maxEmails === -1 ? Infinity : (currentLevel?.maxEmails || 50);
  }

  async checkWarmupHealth(tenantId: string, payload: any): Promise<{
    healthy: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];

    // Check bounce rate laatste 24 uur
    const recentEvents = await payload.find({
      collection: 'email-events',
      where: {
        tenant: { equals: tenantId },
        createdAt: { greater_than: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      },
    });

    const bounces = recentEvents.docs.filter((e: any) => e.type === 'bounced').length;
    const total = recentEvents.docs.filter((e: any) => e.type === 'sent').length;

    if (total > 0) {
      const bounceRate = (bounces / total) * 100;
      if (bounceRate > 5) {
        issues.push(`Hoge bounce rate: ${bounceRate.toFixed(1)}% (max 5%)`);
      }
      if (bounceRate > 2) {
        issues.push(`Bounce rate boven 2%: ${bounceRate.toFixed(1)}% — opschonen aanbevolen`);
      }
    }

    // Check spam complaints
    const complaints = recentEvents.docs.filter((e: any) => e.type === 'complained').length;
    if (total > 0 && (complaints / total) * 100 > 0.1) {
      issues.push(`Spam klachten boven 0.1% — dringend actie vereist`);
    }

    return { healthy: issues.length === 0, issues };
  }
}
```

### E-mail Headers & Compliance

Elke e-mail die via het platform verstuurd wordt, moet de volgende headers bevatten:

```typescript
// Configureer in Listmonk of via template
const requiredHeaders = {
  // RFC 8058 — One-click unsubscribe (vereist door Google/Yahoo)
  'List-Unsubscribe': '<{{ .UnsubscribeURL }}>',
  'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',

  // Identificatie
  'X-Mailer': 'EmailEngine/1.0',
  'Precedence': 'bulk', // Voorkomt auto-replies

  // Feedback loops
  'Feedback-ID': '{{ .Campaign.UUID }}:{{ .Subscriber.UUID }}:jouwplatform',
};
```

### Bounce Handling & Lijsthygiëne

```typescript
// services/deliverability/reputation.ts

export class ReputationManager {
  // Automatische acties bij bounce events
  async handleBounce(subscriberId: string, bounceType: string, payload: any) {
    const subscriber = await payload.findByID({
      collection: 'email-subscribers',
      id: subscriberId,
    });

    if (bounceType === 'hard') {
      // Hard bounce: onmiddellijk blokkeren
      await payload.update({
        collection: 'email-subscribers',
        id: subscriberId,
        data: { status: 'blocklisted' },
      });
    }

    if (bounceType === 'soft') {
      // Soft bounce: tel op, blokkeer na 3x
      const softBounceCount = (subscriber.attributes?.softBounceCount || 0) + 1;

      if (softBounceCount >= 3) {
        await payload.update({
          collection: 'email-subscribers',
          id: subscriberId,
          data: { status: 'blocklisted' },
        });
      } else {
        await payload.update({
          collection: 'email-subscribers',
          id: subscriberId,
          data: {
            attributes: {
              ...subscriber.attributes,
              softBounceCount,
              lastSoftBounce: new Date().toISOString(),
            },
          },
        });
      }
    }
  }

  // Maandelijkse lijsthygiëne
  async cleanInactiveSubscribers(tenantId: string, payload: any) {
    const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString();

    // Vind subscribers die 6+ maanden geen email geopend hebben
    // Dit vereist een query op email_events
    const inactiveSubscribers = await payload.find({
      collection: 'email-subscribers',
      where: {
        tenant: { equals: tenantId },
        status: { equals: 'enabled' },
        updatedAt: { less_than: sixMonthsAgo },
      },
      limit: 1000,
    });

    // Markeer als inactief (niet verwijderen — kans op re-engagement)
    for (const sub of inactiveSubscribers.docs) {
      await payload.update({
        collection: 'email-subscribers',
        id: sub.id,
        data: {
          attributes: {
            ...sub.attributes,
            inactive: true,
            inactiveSince: new Date().toISOString(),
          },
        },
      });
    }

    return { processed: inactiveSubscribers.docs.length };
  }
}
```

### Deliverability Dashboard voor Tenants

In Payload admin toon je per tenant een deliverability score:

```typescript
// Endpoint: /api/deliverability/score/:tenantId
async function getDeliverabilityScore(tenantId: string, payload: any) {
  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const events = await payload.find({
    collection: 'email-events',
    where: {
      tenant: { equals: tenantId },
      createdAt: { greater_than: last30Days },
    },
    limit: 10000,
  });

  const sent = events.docs.filter((e: any) => e.type === 'sent').length;
  const opens = events.docs.filter((e: any) => e.type === 'opened').length;
  const bounces = events.docs.filter((e: any) => e.type === 'bounced').length;
  const complaints = events.docs.filter((e: any) => e.type === 'complained').length;
  const unsubscribes = events.docs.filter((e: any) => e.type === 'unsubscribed').length;

  return {
    period: '30 dagen',
    metrics: {
      sent,
      openRate: sent ? ((opens / sent) * 100).toFixed(1) + '%' : 'N/A',
      bounceRate: sent ? ((bounces / sent) * 100).toFixed(1) + '%' : 'N/A',
      complaintRate: sent ? ((complaints / sent) * 100).toFixed(3) + '%' : 'N/A',
      unsubscribeRate: sent ? ((unsubscribes / sent) * 100).toFixed(1) + '%' : 'N/A',
    },
    health: {
      bounceRate: sent && (bounces / sent) < 0.02 ? 'goed' : 'actie vereist',
      complaintRate: sent && (complaints / sent) < 0.001 ? 'goed' : 'kritiek',
      overallStatus: sent && (bounces / sent) < 0.05 && (complaints / sent) < 0.003
        ? 'gezond' : 'aandacht nodig',
    },
    thresholds: {
      bounceRate: '< 2% (Google-eis: < 5%)',
      complaintRate: '< 0.1% (Google-eis: < 0.3%)',
      unsubscribeRate: '< 0.5% (benchmark)',
    },
  };
}
```

### Onboarding checklist per tenant

Bij het activeren van de email module voor een nieuwe tenant:

```
□ 1. DNS Authenticatie
  □ SPF record toevoegen (include jouwplatform.nl)
  □ DKIM key genereren en publiceren
  □ DMARC starten op p=none met rapportage
  □ Validatie draaien via dns-validator

□ 2. Domein configuratie
  □ From-adres instellen (noreply@tenantdomein.nl)
  □ Return-path configureren
  □ Custom tracking domein instellen (track.tenantdomein.nl CNAME)

□ 3. Warmup starten
  □ Warmup startdatum registreren
  □ Eerste campagne naar meest engaged segment
  □ Dagelijks bounce rate monitoren
  □ Na 7 dagen: volume opschalen

□ 4. Compliance
  □ List-Unsubscribe header actief
  □ Uitschrijflink in elke template (GrapesJS footer block)
  □ Fysiek adres in footer
  □ Double opt-in ingesteld
  □ Privacy policy link in aanmeldformulier

□ 5. Monitoring
  □ DMARC rapportage analyseren (na 7 dagen)
  □ Gmail Postmaster Tools inrichten (indien Gmail doelgroep)
  □ Bounce rate alerts instellen (>2% = waarschuwing, >5% = pauzeer)
  □ Spam complaint alerts instellen (>0.1% = pauzeer)
```

---

## 15. Pricing & Staffelprijzen

### Pricing filosofie

De Email Marketing Engine wordt aangeboden als add-on module bij het bestaande multi-tenant platform. Het kernprincipe: **40-60% goedkoper dan Mailchimp/Klaviyo** bij vergelijkbaar volume, maar volledig geïntegreerd in het platform. De lage infrastructuurkosten (self-hosted Listmonk + SES) maken dit mogelijk met gezonde marges.

Pricing is gebaseerd op een eenvoudig tier-model met vaste bedragen per contactniveau. Elke tier bevat een ruim inclusief mailvolume. Dit is het makkelijkst te communiceren en te factureren.

### Jouw kosten (intern)

```
Vaste kosten:
├── Listmonk: €0 (open source)
├── Hetzner VPS (extra resources): ~€5-10/maand
├── PostgreSQL (Listmonk DB): €0 (zelfde server)
├── Redis (BullMQ): €0 (heb je al)
└── Subtotaal vast: ~€5-10/maand

Variabele kosten (Amazon SES):
└── ~€1,15 per 10.000 mails (€0,10/1.000 + ~15% overhead)

Kosten per typische klant (2.500 contacten, ~12.500 mails/maand):
├── SES: €1,44/maand
├── Server (gedeeld): ~€1,00/maand
└── Totaal: ~€2,50/maand per klant
```

### Staffelprijzen per tier

| Tier | Contacten | Incl. mails/maand | Prijs/maand | Jouw kosten | Marge |
|------|-----------|-------------------|-------------|-------------|-------|
| Starter | t/m 1.000 | 5.000 | **€19** | ~€1,00 | 95% |
| Basis | t/m 2.500 | 15.000 | **€39** | ~€2,50 | 94% |
| Groei | t/m 5.000 | 30.000 | **€69** | ~€4,50 | 93% |
| Pro | t/m 10.000 | 60.000 | **€99** | ~€8,00 | 92% |
| Business | t/m 25.000 | 150.000 | **€179** | ~€19,00 | 89% |

### Extra mails bovenop inclusief volume

Bij overschrijding van het inclusieve mailvolume geldt een staffelprijs per 1.000 mails:

| Tier | Extra per 1.000 mails |
|------|-----------------------|
| Starter | €1,00 |
| Basis | €0,80 |
| Groei | €0,60 |
| Pro | €0,40 |
| Business | €0,30 |

### Vergelijking met de concurrentie

| Provider | Prijs bij 2.500 contacten | Verschil |
|----------|--------------------------|----------|
| Mailchimp Standard | €60/maand | — |
| Klaviyo | ~€60/maand | — |
| ActiveCampaign | ~€50/maand | — |
| Brevo | ~€25/maand | — |
| **Jouw platform** | **€39/maand** | **35-50% goedkoper** |

### Feature matrix per tier

| Feature | Starter | Basis | Groei | Pro | Business |
|---------|---------|-------|-------|-----|----------|
| Campagnes versturen | ✓ | ✓ | ✓ | ✓ | ✓ |
| GrapesJS template editor | ✓ | ✓ | ✓ | ✓ | ✓ |
| Basis analytics | ✓ | ✓ | ✓ | ✓ | ✓ |
| Automation rules (max 3) | ✓ | ✓ | ✓ | ✓ | ✓ |
| Automation rules (onbeperkt) | — | ✓ | ✓ | ✓ | ✓ |
| Automation flows | — | — | ✓ | ✓ | ✓ |
| Geavanceerde segmentatie | — | — | ✓ | ✓ | ✓ |
| A/B testing | — | — | — | ✓ | ✓ |
| API toegang | — | — | — | ✓ | ✓ |
| Custom template blocks | — | — | — | ✓ | ✓ |
| Dedicated IP | — | — | — | — | ✓ |
| Prioriteit support | — | — | — | — | ✓ |

### Concurrentievoordelen benadrukken

```
1. Geïntegreerd — geen apart Mailchimp account nodig
2. EU data — alles op Hetzner in Duitsland, AVG-compliant
3. 40-60% goedkoper dan Mailchimp/Klaviyo bij vergelijkbaar volume
4. Geen verrassingen — geen extra kosten voor uitgeschreven contacten
5. Native e-commerce triggers — automatisch mails bij nieuwe edities,
   prijsverlagingen, back in stock, etc.
6. Visuele editor — GrapesJS drag-and-drop, geen HTML kennis nodig
7. Data eigenaarschap — klantdata blijft op jouw server
```

### Financiële projectie

```
Scenario: 15 klanten na 6 maanden
├── 3× Starter (€19)  = €57
├── 6× Basis (€39)    = €234
├── 4× Groei (€69)    = €276
├── 2× Pro (€99)      = €198
├── Totaal omzet       = €765/maand
├── Jouw kosten        = -€22/maand
└── Netto marge        = €743/maand (97%)

Scenario: 30 klanten na 12 maanden
├── 5× Starter (€19)  = €95
├── 10× Basis (€39)   = €390
├── 8× Groei (€69)    = €552
├── 5× Pro (€99)      = €495
├── 2× Business (€179)= €358
├── Totaal omzet       = €1.890/maand
├── Jouw kosten        = -€50/maand
└── Netto marge        = €1.840/maand (97%)
    → ~€22.000 extra jaaromzet bij marginale kosten
```

### SMTP provider keuze

```
< 50.000 mails/maand totaal: gebruik Mailcow (gratis, heb je al)
> 50.000 mails/maand totaal: schakel over naar Amazon SES
Hybride optie: Mailcow voor transactionele mails, SES voor campagnes
```

### Implementatie van usage tracking

```typescript
// services/billing/usage-tracker.ts

interface TenantUsage {
  tenantId: string;
  period: string; // YYYY-MM
  subscriberCount: number;
  emailsSent: number;
  currentTier: string;
  includedEmails: number;
  extraEmails: number;
  extraCost: number;
}

export class UsageTracker {
  async getMonthlyUsage(tenantId: string, payload: any): Promise<TenantUsage> {
    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Tel actieve subscribers
    const subscribers = await payload.count({
      collection: 'email-subscribers',
      where: {
        tenant: { equals: tenantId },
        status: { equals: 'enabled' },
      },
    });

    // Tel verstuurde emails deze maand
    const sentEvents = await payload.count({
      collection: 'email-events',
      where: {
        tenant: { equals: tenantId },
        type: { equals: 'sent' },
        createdAt: { greater_than: monthStart },
      },
    });

    const tier = this.determineTier(subscribers.totalDocs);
    const includedEmails = this.getIncludedEmails(tier);
    const extraEmails = Math.max(0, sentEvents.totalDocs - includedEmails);
    const extraCost = this.calculateExtraCost(tier, extraEmails);

    return {
      tenantId,
      period,
      subscriberCount: subscribers.totalDocs,
      emailsSent: sentEvents.totalDocs,
      currentTier: tier,
      includedEmails,
      extraEmails,
      extraCost,
    };
  }

  private determineTier(subscriberCount: number): string {
    if (subscriberCount <= 1000) return 'starter';
    if (subscriberCount <= 2500) return 'basis';
    if (subscriberCount <= 5000) return 'groei';
    if (subscriberCount <= 10000) return 'pro';
    if (subscriberCount <= 25000) return 'business';
    return 'enterprise';
  }

  private getIncludedEmails(tier: string): number {
    const included: Record<string, number> = {
      starter: 5000,
      basis: 15000,
      groei: 30000,
      pro: 60000,
      business: 150000,
      enterprise: 500000,
    };
    return included[tier] || 5000;
  }

  private calculateExtraCost(tier: string, extraEmails: number): number {
    const ratePerThousand: Record<string, number> = {
      starter: 1.00,
      basis: 0.80,
      groei: 0.60,
      pro: 0.40,
      business: 0.30,
      enterprise: 0.20,
    };
    const rate = ratePerThousand[tier] || 1.00;
    return (extraEmails / 1000) * rate;
  }
}
```

### Rate limiting op basis van tier

```typescript
// In BullMQ worker: respecteer tier-limieten
async function checkTierLimits(tenantId: string, payload: any): Promise<boolean> {
  const tracker = new UsageTracker();
  const usage = await tracker.getMonthlyUsage(tenantId, payload);

  // Hard limit: 2x het inclusieve volume (voorkom onverwachte kosten)
  const hardLimit = usage.includedEmails * 2;
  if (usage.emailsSent >= hardLimit) {
    console.warn(`Tenant ${tenantId} heeft hard limit bereikt: ${usage.emailsSent}/${hardLimit}`);
    // Stuur notificatie naar tenant admin
    return false;
  }

  return true;
}
```

---

## 16. Aandachtspunten & Valkuilen

### Kritieke aandachtspunten

#### 1. Oneindige hook loops

Het grootste risico: Payload hooks triggeren Listmonk syncs, die Payload updaten, die weer hooks triggeren.

```typescript
// OPLOSSING: context flag meegeven
await payload.update({
  collection: 'email-subscribers',
  id: doc.id,
  data: { listmonkId: result.data.id },
  context: { skipListmonkSync: true },
});

// In de hook:
afterChange: [async ({ doc, req, context }) => {
  if (context?.skipListmonkSync) return doc;
  // ... sync logica
}]
```

#### 2. Listmonk en Payload uit sync

```
Oplossingen:
- Maak alle sync operaties idempotent
- Bouw een reconciliation cron job die dagelijks vergelijkt
- Log alle sync fouten naar een aparte collection
- Bouw een "force sync" knop in de admin UI
```

#### 3. BullMQ job verlies bij Redis crash

```
Oplossingen:
- Gebruik Redis persistence (AOF + RDB)
- Stel Redis maxmemory-policy in op noeviction
- Monitor Redis geheugengebruik
- Overweeg Redis Sentinel voor HA
```

#### 4. SMTP rate limiting

```
Oplossingen:
- BullMQ limiter configureren (zie worker config)
- Voor SES: start met sandbox, vraag production access aan
- Monitor bounce rates — >5% is een rode vlag
- Implementeer exponential backoff bij SMTP fouten
- Respecteer warmup schema (zie sectie 14)
```

#### 5. E-mail deliverability

```
Checklist:
- SPF record correct configureren per tenant-domein
- DKIM signing inrichten (Mailcow doet dit automatisch)
- DMARC policy instellen (start met p=none)
- Dedicated IP overwegen bij hoog volume (Business+ tier)
- Bounce handling automatiseren (Listmonk + ReputationManager)
- Unsubscribe link altijd aanwezig (GrapesJS footer block)
- List-Unsubscribe header instellen (RFC 8058)
- One-click unsubscribe implementeren (Google/Yahoo vereiste)
- Gmail Postmaster Tools monitoring
- Spam complaint rate < 0.1% houden
```

#### 6. Multi-tenant data isolatie

```
Risico: Tenant A ziet data van Tenant B

Mitigaties:
- ALTIJD tenant filter in Payload access control
- NOOIT directe Listmonk API calls vanuit frontend
- Listmonk lijst-namen prefixen met tenant ID
- API key validatie per tenant op webhook endpoints
- Audit log voor cross-tenant access attempts
```

#### 7. GrapesJS specifieke aandachtspunten

```
- GrapesJS project data (JSON) kan groot worden bij complexe templates
  → Sla op in apart veld, niet inline in het formulier
- Template variabelen ({{.Subscriber.Name}}) mogen niet
  door GrapesJS geparsed worden als HTML
  → Registreer als non-editable text components
- Dark mode rendering verschilt per emailclient
  → Test altijd in Litmus of Email on Acid
- Inline CSS export kan traag zijn bij grote templates
  → Cache compiledHtml, hercompileer alleen bij wijziging
```

#### 8. Memory leaks in BullMQ workers

```
Oplossingen:
- Limiteer concurrency (max 5-10 per worker)
- Gebruik removeOnComplete met max age/count
- Monitor Node.js heap size
- Restart workers periodiek via PM2/Docker
```

### Performance overwegingen

```
- Subscriber sync: batch imports i.p.v. één voor één
  → Listmonk heeft een bulk import endpoint

- Analytics queries: gebruik materialized views of
  cache layer voor dashboard data

- Event processing: gebruik BullMQ bulk add voor
  meerdere automation matches

- Template rendering: cache gecompileerde templates
  in Redis (compiledHtml veld)

- GrapesJS: laad editor lazy (dynamic import) om
  initiale paginalading niet te vertragen

- Webhook endpoint: antwoord direct met 200 en
  verwerk async via BullMQ (voorkom timeouts)
```

---

## 17. Fasering & Roadmap

### Fase 1: Fundament (2-3 weken)

```
□ Listmonk deployen op Hetzner (Docker)
□ SMTP configureren (Mailcow of SES)
□ ListmonkService class bouwen + testen
□ Basis collections aanmaken:
  - EmailSubscribers
  - EmailLists
  - EmailTemplates
□ Sync hooks implementeren (Payload → Listmonk)
□ DNS validator service bouwen
□ Handmatige test: subscriber aanmaken in Payload → verschijnt in Listmonk
```

### Fase 2: GrapesJS Template Editor (1-2 weken)

```
□ GrapesJS + newsletter preset installeren
□ React wrapper component bouwen
□ Integratie in EmailTemplates collection (custom field)
□ Tenant branding blocks registreren
□ Listmonk variabele blocks toevoegen
□ E-commerce blocks library bouwen (product card, price drop, grid)
□ Export flow: GrapesJS → inline HTML → compiledHtml veld
□ Test: template ontwerpen in GrapesJS → correct renderen in Gmail/Outlook
```

### Fase 3: Campagnes (1-2 weken)

```
□ EmailCampaigns collection
□ Campaign aanmaak flow (Payload → Listmonk)
□ Campaign verstuur functionaliteit (met compiledHtml van GrapesJS)
□ Analytics sync (periodiek + webhook)
□ Basis dashboard (sent, opens, clicks per campagne)
□ Test: complete campagne flow van template ontwerp → verstuurd → analytics
```

### Fase 4: Deliverability & Warmup (1 week)

```
□ DNS validator per tenant implementeren
□ Warmup manager bouwen
□ Bounce handler implementeren (hard/soft bounce logic)
□ Reputation monitoring service
□ Email headers configureren (List-Unsubscribe, RFC 8058)
□ Deliverability dashboard per tenant
□ Tenant onboarding checklist in admin UI
□ Test: DNS validatie + warmup schema + bounce handling
```

### Fase 5: Automation Rules (2-3 weken)

```
□ AutomationRules collection
□ Webhook endpoint voor externe events
□ Condition evaluator
□ Automation engine (event → match → actie)
□ BullMQ queue + worker setup
□ Delay/scheduling logica
□ Test: event webhook → automation rule match → mail verstuurd
```

### Fase 6: Flows (1-2 weken)

```
□ AutomationFlows collection
□ Flow executor (step-by-step via BullMQ)
□ Delay stappen
□ Flow status tracking
□ Test: welkomstreeks van 3 mails met delays
```

### Fase 7: Billing & Usage Tracking (1 week)

```
□ UsageTracker service implementeren
□ Tier-bepaling op basis van subscriber count (Starter/Basis/Groei/Pro/Business)
□ Email volume tracking per maand
□ Rate limiting op basis van tier
□ Usage overzicht in tenant admin
□ Extra kosten berekening voor overschrijding inclusief volume
□ Alerts bij naderen van tier-limieten
```

### Fase 8: Productie-klaar (1-2 weken)

```
□ Error handling & retry logica robuust maken
□ Reconciliation cron job (Payload ↔ Listmonk sync check)
□ Rate limiting op webhook endpoints
□ API key management per tenant
□ Monitoring & alerting opzetten
□ Bounce handling testen
□ SPF/DKIM/DMARC documentatie per tenant
□ Klant-documentatie schrijven
□ GrapesJS gebruikersdocumentatie
```

### Fase 9: Uitbreidingen (doorlopend)

```
□ Batch/digest mode voor automation rules
□ A/B testing voor subject lines
□ Subscriber import (CSV upload)
□ Geavanceerde segmentatie (op basis van engagement)
□ Cron-based triggers (inactieve klanten, herbestellingen)
□ BIMI (Brand Indicators for Message Identification) support
□ Gmail Postmaster Tools integratie
□ Custom GrapesJS plugins per verticaal
```

**Totale geschatte doorlooptijd: 10-16 weken**

---

## 18. Monitoring & Onderhoud

### Health checks

```typescript
// endpoints/healthEmail.ts
export const emailHealthEndpoint: Endpoint = {
  path: '/health/email',
  method: 'get',
  handler: async (req) => {
    const checks: Record<string, any> = {};

    // 1. Listmonk bereikbaar?
    try {
      const response = await fetch(`${process.env.LISTMONK_URL}/api/health`);
      checks.listmonk = response.ok ? 'ok' : 'error';
    } catch {
      checks.listmonk = 'unreachable';
    }

    // 2. Redis bereikbaar?
    try {
      await redis.ping();
      checks.redis = 'ok';
    } catch {
      checks.redis = 'unreachable';
    }

    // 3. BullMQ queue status
    const waiting = await emailQueue.getWaitingCount();
    const active = await emailQueue.getActiveCount();
    const failed = await emailQueue.getFailedCount();
    checks.queue = { waiting, active, failed };

    // 4. Failed jobs alert
    if (failed > 50) {
      checks.alert = 'High number of failed jobs';
    }

    const allOk =
      checks.listmonk === 'ok' &&
      checks.redis === 'ok' &&
      failed < 50;

    return Response.json(
      { status: allOk ? 'healthy' : 'degraded', checks },
      { status: allOk ? 200 : 503 }
    );
  },
};
```

### Monitoring checklist

```
Dagelijks:
- BullMQ failed jobs count
- Listmonk bounce rate per tenant
- SMTP queue status
- Spam complaint rate (moet < 0.1%)

Wekelijks:
- Payload ↔ Listmonk sync discrepanties
- Subscriber groei per tenant
- Disk usage Listmonk database
- Redis memory usage
- Warmup voortgang nieuwe tenants
- Deliverability score per tenant

Maandelijks:
- Deliverability audit per tenant
- SPF/DKIM/DMARC check (dns-validator)
- DMARC rapportages analyseren
- Listmonk software updates
- Database vacuum/maintenance
- Inactieve subscribers opschonen
- Tier/usage review per tenant
```

### Backup strategie

```
Listmonk PostgreSQL:
- Dagelijkse pg_dump naar S3/backup storage
- WAL archiving voor point-in-time recovery
- Test restore maandelijks

Redis:
- AOF persistence inschakelen
- Dagelijkse RDB snapshot
- Bij verlies: BullMQ jobs zijn verloren maar
  kunnen via reconciliation hersteld worden

GrapesJS template data:
- Opgeslagen in Payload DB (grapesData JSON veld)
- Meegenomen in standaard Payload database backup
- compiledHtml kan altijd opnieuw gegenereerd worden
```

---

## Samenvatting

Dit implementatieplan beschrijft een pragmatische, event-driven e-mail marketing engine die:

- Past binnen de bestaande Payload CMS multi-tenant architectuur
- Listmonk gebruikt als headless engine (niet als UI)
- **GrapesJS** biedt als visuele drag-and-drop template editor met email-specifieke blocks, tenant branding en Listmonk variabelen
- BullMQ inzet voor scheduling en flow-logica
- **Optimale deliverability** garandeert via DNS authenticatie (SPF/DKIM/DMARC), warmup management, bounce handling en reputatie monitoring
- **Staffelprijzen** hanteert van €19 (Starter, 1.000 contacten) tot €179 (Business, 25.000 contacten) — 40-60% goedkoper dan Mailchimp/Klaviyo met marges van 89-95%
- 90% van de MKB e-commerce use cases dekt
- Geen complexe flow builder nodig heeft
- In ~10-16 weken volledig operationeel kan zijn
- Schaalbaar is naar meer tenants en meer complexiteit

De kernkracht zit in de eenvoud: **event → match → stuur mail**. Gecombineerd met een professionele visuele editor (GrapesJS), enterprise-grade deliverability, en een agressief pricing model dat 40-60% goedkoper is dan Mailchimp/Klaviyo — terwijl alles geïntegreerd, AVG-compliant en self-hosted is.
