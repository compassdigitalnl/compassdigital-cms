# Email Marketing Engine — Architectuur & Roadmap

**Project:** Multi-tenant Payload CMS Platform
**Status:** Operationeel — Fasen 1-8 afgerond
**Laatst bijgewerkt:** 14 maart 2026

---

## 1. Huidige Architectuur

### Overzicht

De email marketing module is een volledig geïntegreerd subsysteem binnen het Payload CMS platform. Het bestaat uit drie hoofdcomponenten die samenwerken:

```
┌─────────────────────────────────────────────────────────────┐
│                     PAYLOAD CMS                              │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Collections  │  │  GrapesJS    │  │  Automation       │  │
│  │  (11 stuks)   │  │  Editor      │  │  Engine           │  │
│  │              │  │              │  │                    │  │
│  │ Subscribers  │  │ 16 custom    │  │ Event processor   │  │
│  │ Lists        │  │ blocks       │  │ Flow executor     │  │
│  │ Templates    │  │ Tenant       │  │ Condition eval    │  │
│  │ Campaigns    │  │ branding     │  │ BullMQ queues     │  │
│  │ Flows        │  │ E-commerce   │  │                    │  │
│  │ Segments     │  │ blocks       │  │ Predefined:       │  │
│  │ Events       │  │ Listmonk     │  │ - Templates       │  │
│  │ FlowStates   │  │ variables    │  │ - Flows           │  │
│  │ Rules        │  │              │  │ - Segments (RFM)  │  │
│  │ ApiKeys      │  └──────┬───────┘  └────────┬──────────┘  │
│  └──────┬───────┘         │                    │             │
│         │                 │                    │             │
│  ┌──────▼─────────────────▼────────────────────▼──────────┐  │
│  │              Service Layer                              │  │
│  │                                                          │  │
│  │  ListmonkClient ─── sync.ts ─── retry-wrapper.ts        │  │
│  │  EmailService (Resend) ─── usage-tracker.ts              │  │
│  │  ReconciliationService ─── HealthChecker                 │  │
│  └──────────────────────┬───────────────────────────────────┘  │
└─────────────────────────┼──────────────────────────────────────┘
                          │
              ┌───────────▼───────────┐
              │      LISTMONK         │
              │   (Docker container)  │
              │                       │
              │  • Subscriber store   │
              │  • Send engine        │
              │  • SMTP relay         │
              │  • Tracking (opens,   │
              │    clicks, bounces)   │
              │  • Webhook events     │
              └───────────────────────┘
```

### Componentrollen

| Component | Rol | Wat het NIET doet |
|---|---|---|
| **GrapesJS** | Visuele template editor (drag-and-drop, blocks, branding) | Stuurt geen emails, kent Listmonk niet |
| **Listmonk** | Verzend-engine (subscribers, lists, SMTP, tracking) | Geen template design, geen automations, geen segmentatie |
| **Automation Engine** | Event-driven flows (triggers, waits, conditions, actions) | Geen direct email verzenden (delegeert naar Listmonk) |
| **Service Layer** | API client, sync, retry, rate limiting | Geen UI, geen business logic |
| **Collections** | Data opslag, validatie, access control, multi-tenancy | Geen operationele verwerking |

### Collections

| Collection | Slug | Records | Functie |
|---|---|---|---|
| EmailSubscribers | `email-subscribers` | Per tenant | Contactdata, status, custom fields, Listmonk ID |
| EmailLists | `email-lists` | Per tenant | Audience lijsten, subscriber count |
| EmailTemplates | `email-templates` | Per tenant | GrapesJS JSON + compiled HTML, variabelen |
| EmailCampaigns | `email-campaigns` | Per tenant | Metadata, planning, status, analytics |
| AutomationFlows | `automation-flows` | Per tenant | Multi-step workflows (trigger → steps → exit) |
| AutomationRules | `automation-rules` | Per tenant | Legacy single trigger+action (wordt uitgefaseerd) |
| FlowInstances | `flow-instances` | Per tenant | State tracking per subscriber per flow |
| EmailEvents | `email-events` | Per tenant | Audit log (opens, clicks, bounces, sends) |
| EmailSegments | `email-segments` | Per tenant | RFM segmentatie, doelgroepregels |
| EmailApiKeys | `email-api-keys` | Per tenant | SHA-256 hashed API keys, scopes, rate limits |

> **Multi-tenancy:** Alle collections filteren op `tenant` (relationship naar `clients` collection). Strikte isolatie via access control hooks.

### GrapesJS Editor

16 custom blocks, georganiseerd in categorieën:

| Categorie | Blocks | Functie |
|---|---|---|
| Tenant Branding | Logo, Brand Colors, Fonts | Automatisch uit tenant settings |
| Listmonk Variables | Subscriber Name, Email, Unsubscribe URL | Template variabelen voor personalisatie |
| RTE Variables | Rich text met variabele insertie | Tekst blokken met dynamische data |
| Utility | Spacer, Social Icons, Video, Countdown | Visuele elementen |
| E-commerce | Product Card (statisch) | Handmatig product invoegen |
| E-commerce Live | Product Card (dynamisch) | Real-time data uit catalogus |
| Product Picker | Product selectie UI | Koppeling met product collectie |

**Data flow:**
1. Marketeer ontwerpt template in GrapesJS (drag-and-drop)
2. GrapesJS slaat `visual_json` (editor state) + `visual_html` (output) op
3. Bij campaign send: HTML wordt via `juice` library ge-inlined (CSS → inline styles)
4. Listmonk ontvangt de ge-inlinede HTML + vervangt variabelen ({{ .Subscriber.Name }})
5. Listmonk stuurt email via SMTP

### Automation Engine

**Event types (20+):**
- User: `signup`, `updated`, `login`
- Subscriber: `added`, `confirmed`, `unsubscribed`, `list_changed`
- Order: `placed`, `completed`, `cancelled`
- Cart: `abandoned`
- Email: `opened`, `clicked`, `bounced`
- Campaign: `completed`
- Custom: `custom.event`

**Flow step types:**
- `send_email` — Verstuur email via Listmonk transactional API
- `wait` — Wacht X dagen/uren/minuten
- `condition` — If/else vertakking op basis van subscriber data
- `add_tag` / `remove_tag` — Labels beheren
- `add_to_list` / `remove_from_list` — Lijstlidmaatschap
- `exit` — Flow beëindigen

**Execution:** BullMQ (Redis-backed) voor async job processing met retry logic.

### API Endpoints (20+)

| Groep | Endpoints | Functie |
|---|---|---|
| Campaigns | start, pause, cancel, test, stats | Campaign lifecycle |
| Subscribers | import, export | Bulk operaties |
| Segments | CRUD, preview | Doelgroep beheer |
| Health | health, ready, alive | Monitoring |
| Metrics | usage, metrics | Analytics + billing |
| Webhooks | listmonk-bounce | Event ingestion |
| Admin | seed-predefined, reconciliation | Beheer |

### Billing & Usage

6-tier staffelmodel:

| Tier | Subscribers | Emails/mo | Prijs |
|---|---|---|---|
| Starter | 1.000 | 5.000 | €29/mo |
| Groei | 5.000 | 30.000 | €79/mo |
| Pro | 10.000 | 100.000 | €149/mo |
| Business | 25.000 | 500.000 | €299/mo |
| Enterprise | Onbeperkt | Onbeperkt | Op maat |

Usage tracking per tenant via `usage-tracker.ts`. Alerts bij 50%, 75%, 90%, 100% van limiet. Hard limit bij 2x overschrijding.

---

## 2. Sterke punten huidige architectuur

1. **Clean service layer** — Alle Listmonk communicatie via `ListmonkClient` + `sync.ts`. Geen directe API calls vanuit collections of hooks.
2. **Multi-tenancy first** — Tenant isolatie in elke collection, elk endpoint, elke sync operatie.
3. **GrapesJS loskoppeling** — Editor kent Listmonk niet. Output is puur HTML. Compilatie en verzending zijn gescheiden stappen.
4. **Predefined content** — Templates, flows en segments voorgedefinieerd en seedbaar per tenant. Onboarding van nieuwe klanten is snel.
5. **Monitoring** — Health checks, metrics, alerting, Sentry integratie, webhook signature verificatie.
6. **Retry & error handling** — 10 error types geclassificeerd, exponential backoff met jitter, dead letter queue voor permanent gefaalde jobs.

---

## 3. Bekende issues & technische schuld

### 3.1 AutomationRules (legacy)

`AutomationRules` collection is een vereenvoudigde versie van `AutomationFlows` (single trigger + single action). Moet worden uitgefaseerd:
- Bestaande rules migreren naar flows
- Collection op `hidden: true` zetten
- Na 3 maanden verwijderen

### 3.2 Dual email service

Twee email verzendmethoden bestaan naast elkaar:
- **Listmonk** — voor marketing emails (campaigns, automation flows)
- **Resend** (`EmailService.ts`) — voor transactionele emails (contact forms, order confirmations)

Dit is architectureel correct (marketing vs transactioneel gescheiden), maar de naamgeving is verwarrend. `EmailService.ts` zou beter `TransactionalEmailService.ts` heten.

### 3.3 Template compilatie timing

Het refactoringplan stelde terecht: "compileer vlak voor verzending, niet bij opslaan". Dit is momenteel niet gegarandeerd — de `visual_html` wordt bij template save gecompileerd. Als subscriber data verandert na save maar voor send, is de personalisatie verouderd.

**Fix:** Listmonk lost dit op via z'n eigen template rendering ({{ .Subscriber.Name }} wordt at-send-time vervangen). Maar custom variabelen die niet via Listmonk syntax gaan, moeten bij campaign trigger opnieuw gecompileerd worden.

### 3.4 Flow builder serialisatie

`FlowBuilder` component gebruikt React Flow (XYFlow) met custom serialisatie (`stepsToGraph()` / `graphToSteps()`). Dit is fragiel — wijzigingen in React Flow's API kunnen de serialisatie breken.

**Mitigatie:** Pinned React Flow versie + serialisatie unit tests.

---

## 4. Architectuurbeslissingen (ADRs)

### ADR-1: Waarom GrapesJS + Listmonk (en niet X)?

**Beslissing:** GrapesJS voor template editing, Listmonk voor sending.

**Overwogen alternatieven:**
- **Listmonk's eigen editor** — Te basic (plain HTML textarea). Niet bruikbaar voor non-technische marketeers.
- **MJML** — Goede email markup taal, maar geen visuele editor. Zou als compilatie-stap tussen GrapesJS en Listmonk kunnen zitten, maar voegt complexiteit toe zonder duidelijke meerwaarde.
- **Unlayer/Stripo** — Commerciële editors. Duur bij multi-tenant (per-tenant licentie). GrapesJS is open source.

**Conclusie:** GrapesJS = beste open-source optie voor visuele email editing. Listmonk = beste self-hosted optie voor email sending.

### ADR-2: Waarom geen N8N voor automations?

**Beslissing:** Custom automation engine in plaats van N8N.

**Overwogen:**
- N8N heeft een krachtige visuele workflow builder met 400+ integraties
- Zou de custom engine (engine.ts, executor.ts, FlowBuilder) vervangen

**Afgewezen omdat:**
1. **Multi-tenancy** — N8N heeft geen native tenant isolatie. Elke tenant zou eigen instance nodig hebben of custom isolatie.
2. **Extra service** — Nog een Docker container + database naast Listmonk, Chatwoot, Meilisearch, Redis, PostgreSQL. Meer onderhoud, meer geheugen.
3. **De engine werkt al** — 300+ regels automation code, functioneel, met BullMQ queues.
4. **Tight CMS integratie** — Flows refereren direct naar CMS collections (templates, segments, subscribers). N8N zou dit via API moeten doen.

**Heroverweging:** N8N wordt interessant als orchestratie-laag voor cross-system integraties (THOR ↔ Listmonk ↔ CMS ↔ externe APIs) in een latere fase. Niet voor de core email automations.

### ADR-3: Waarom geen aparte mailing service (nog)?

**Beslissing:** Service layer binnen Payload CMS process, geen apart Node.js process.

**Het oorspronkelijke refactoringplan stelde voor:**
```
mailing-service/    ← apart process
├── api/
├── workers/
├── adapters/
└── queue/
```

**Niet geïmplementeerd omdat:**
1. **Schaal past** — Bij <100K subscribers per tenant is de overhead van een apart process niet gerechtvaardigd.
2. **Service layer volstaat** — `ListmonkClient` + `sync.ts` + `retry-wrapper.ts` vormen al een clean abstraction boundary.
3. **Operationele complexiteit** — Extra process = extra deploy, extra monitoring, extra failure modes.

**Wanneer WEL extraheren:**
- Bij 1M+ profielen (Aboland subscriber lifecycle) → dedicated Listmonk + dedicated worker
- Bij 50+ actieve tenants met concurrent campaigns
- Bij >1M emails/maand over alle tenants

---

## 5. Roadmap: High-Volume Subscriber Email

### Context

Aboland heeft ~1M subscriber profielen voor abonnementslifecycle emails (verlengingen, herinneringen, opzeggingen). Dit volume past niet in de standaard CMS-geïntegreerde Listmonk. Hier is de aparte service wél gerechtvaardigd.

### Doelarchitectuur

```
┌─────────────────────────────────────┐
│         PAYLOAD CMS                  │
│   (Aboland + Magvilla instances)     │
│                                      │
│   E-commerce email (≤25K subs)       │
│   via geïntegreerde Listmonk         │
└──────────────┬───────────────────────┘
               │ API calls (sync triggers, reporting)
               │
┌──────────────▼───────────────────────┐
│   DEDICATED SUBSCRIBER SERVICE        │
│   (apart Docker process)              │
│                                       │
│   ┌─────────────────────────────┐    │
│   │  Dedicated Listmonk          │    │
│   │  • 1M+ profielen             │    │
│   │  • Eigen PostgreSQL          │    │
│   │  • Lifecycle templates       │    │
│   │  • SMTP via Amazon SES       │    │
│   └─────────────────────────────┘    │
│                                       │
│   ┌─────────────────────────────┐    │
│   │  THOR Sync Worker            │    │
│   │  • Profiel sync (THOR → LM)  │    │
│   │  • Status updates            │    │
│   │  • Segmentatie               │    │
│   │  • Rate limited              │    │
│   └─────────────────────────────┘    │
│                                       │
│   ┌─────────────────────────────┐    │
│   │  Flow Engine                 │    │
│   │  • Lifecycle triggers        │    │
│   │  • "Abonnement loopt af"     │    │
│   │  • "Verleng nu"              │    │
│   │  • Herinneringen             │    │
│   │  • BullMQ queues             │    │
│   └─────────────────────────────┘    │
└───────────────────────────────────────┘
```

### Waarom gescheiden?

| Aspect | CMS Listmonk (e-commerce) | Dedicated Listmonk (subscribers) |
|---|---|---|
| Volume | ≤25K contacten per site | ~1M profielen |
| Data bron | CMS (users collection) | THOR API |
| Templates | GrapesJS (marketeer beheert) | Lifecycle templates (vaste structuur) |
| Triggers | E-commerce events (order, cart) | Abonnements-events (verlenging, opzegging) |
| SMTP | Gedeelde SMTP | Dedicated Amazon SES |
| Downtime impact | Webshop email stopt | Lifecycle email stopt |
| Database | Gedeeld met CMS | Eigen PostgreSQL |

Scheiding voorkomt dat 1M subscriber syncs de CMS Listmonk instance vertragen.

### Implementatieplan

**Fase 1: Dedicated Listmonk (week 1)**
- [ ] Docker Compose voor dedicated Listmonk + PostgreSQL
- [ ] Eigen SMTP configuratie (Amazon SES)
- [ ] DNS setup (SPF, DKIM, DMARC voor subscriber domein)
- [ ] Health monitoring

**Fase 2: THOR Sync Worker (week 1-2)**
- [ ] THOR API client (profiel ophalen, status checks)
- [ ] Sync worker: THOR profielen → Listmonk subscribers
- [ ] Incremental sync (alleen gewijzigde profielen)
- [ ] Rate limiting (THOR API limits respecteren)
- [ ] Error handling + retry logic
- [ ] Audit logging

**Fase 3: Template Migratie (week 2-3)**
- [ ] Copernica templates analyseren
- [ ] Vertalen naar Listmonk templates (HTML + Go template syntax)
- [ ] Variabelen mappen (Copernica velden → Listmonk attribs)
- [ ] Test emails voor elke template
- [ ] A/B test: Copernica vs Listmonk rendering

**Fase 4: Flow Migratie (week 3-4)**
- [ ] Copernica automatische flows documenteren
- [ ] Vertalen naar Listmonk campaign triggers + BullMQ flows
- [ ] "Abonnement loopt af" flow
- [ ] "Verleng nu" herinneringsreeks
- [ ] "Welkom nieuwe abonnee" flow
- [ ] "Opzegging bevestiging" flow
- [ ] Timing en condities valideren

**Fase 5: Data Migratie (week 4)**
- [ ] Export Copernica profielen (1M records)
- [ ] Data cleaning + deduplicatie
- [ ] Import in dedicated Listmonk
- [ ] Validatie: vergelijk record counts + steekproef
- [ ] Parallelle run: Copernica + Listmonk tegelijk (1 week)

**Fase 6: Go Live (week 5)**
- [ ] Copernica uitschakelen
- [ ] Monitoring intensiveren (bounce rates, delivery rates)
- [ ] Snelle rollback procedure klaarzetten (Copernica weer aan)

### Docker Compose (dedicated instance)

```yaml
# /home/ploi/listmonk-subscribers/docker-compose.yml
services:
  listmonk-subs:
    image: listmonk/listmonk:latest
    ports:
      - "127.0.0.1:9100:9000"
    environment:
      TZ: Europe/Amsterdam
    volumes:
      - ./config.toml:/listmonk/config.toml
    depends_on:
      - listmonk-subs-db
    restart: unless-stopped

  listmonk-subs-db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: listmonk_subscribers
      POSTGRES_USER: listmonk
      POSTGRES_PASSWORD: ${LISTMONK_SUBS_DB_PASS}
    volumes:
      - listmonk_subs_data:/var/lib/postgresql/data
    restart: unless-stopped

  thor-sync-worker:
    build: ./worker
    environment:
      THOR_API_URL: ${THOR_API_URL}
      THOR_API_KEY: ${THOR_API_KEY}
      LISTMONK_URL: http://listmonk-subs:9000
      LISTMONK_API_USER: admin
      LISTMONK_API_PASS: ${LISTMONK_SUBS_API_PASS}
      REDIS_URL: redis://redis:6379
    depends_on:
      - listmonk-subs
    restart: unless-stopped

volumes:
  listmonk_subs_data:
```

### Kostenraming

| Component | Maandelijks |
|---|---|
| Server resources (2 vCPU, 4GB RAM dedicated) | ~€20/mo |
| Amazon SES (2-4M emails/mo) | ~€200-400/mo |
| PostgreSQL storage (1M records) | ~€5/mo |
| Monitoring (Sentry, uptime) | ~€10/mo |
| **Infra totaal** | **~€235-435/mo** |
| **Marge + support → klantprijs** | **€899/mo** |

---

## 6. Vuistregels

| Als het gaat over... | Hoort in... |
|---|---|
| Wie is de klant, wat mag hij | Payload CMS |
| Wat is de content, wat is de template | Payload CMS (GrapesJS) |
| Wanneer wordt de campagne verstuurd | Payload CMS (planning) |
| Hoe wordt de campagne verstuurd | Listmonk (SMTP engine) |
| Aan wie wordt verstuurd (subscriber state) | Listmonk (subscriber store) |
| Wat gebeurde er na versturen (events) | Listmonk → Payload (webhook sync) |
| Wat zag de klant op hoofdlijnen (stats) | Payload CMS (aggregated dashboard) |
| 1M+ subscriber lifecycle | Dedicated Listmonk instance |
| Debugging, raw logs, resync | Listmonk admin UI |

---

## 7. Risico's & mitigaties

| Risico | Impact | Mitigatie |
|---|---|---|
| Listmonk upgrade breekt API | Hoog | Pin Listmonk versie, test upgrades in staging |
| GrapesJS HTML niet email-compatible | Medium | `juice` CSS inlining + Litmus/Email on Acid testing |
| BullMQ Redis memory overflow | Medium | Max queue size limits, monitoring, Redis maxmemory policy |
| THOR API downtime blokkeert sync | Hoog | Retry queue, stale data detection, fallback naar laatste bekende state |
| Copernica → Listmonk data loss | Kritiek | Parallelle run (1 week), volledige data validatie, rollback procedure |
| Multi-tenant data leak | Kritiek | Tenant ID in elke query, access control tests, penetration testing |
