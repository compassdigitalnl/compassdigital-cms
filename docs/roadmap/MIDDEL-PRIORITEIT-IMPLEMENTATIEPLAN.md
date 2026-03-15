# Implementatieplan — Middel-Prioriteit Must-Haves

**7 features | ~110-165 uur | 4 fases**
**Created:** 2026-03-09

---

## Fase 1: Quick Wins (~25-35u)

### 1A. Content Scheduling (#21) — 12-18u

**Bestaand:** Pages heeft `publishedOn` + `status` (draft/published). Email campaigns heeft `scheduledFor` met timezone.

#### Stap 1: Scheduling velden toevoegen (2u)
Voeg `publishAt` en `unpublishAt` datumvelden toe aan Pages, BlogPosts, Products.

```
WIJZIG:
  src/branches/shared/collections/Pages/index.ts          → publishAt + unpublishAt velden
  src/branches/shared/collections/BlogCategories.ts        → publishAt + unpublishAt velden (of BlogPosts)
  src/branches/ecommerce/shared/collections/products/index.ts → publishAt + unpublishAt velden

NIEUW:
  src/migrations/YYYYMMDD_HHMMSS_add_content_scheduling.ts
```

#### Stap 2: Scheduling cron job (3u)
Cron die elke minuut draait: `publishAt <= now AND status=draft` → published.

```
NIEUW:
  src/scripts/cron/content-scheduling.ts
  src/app/api/platform/cron/content-scheduling/route.ts
```

#### Stap 3: Unpublish cron (1u)
Zelfde cron voor `unpublishAt <= now AND status=published` → archived.

```
WIJZIG:
  src/scripts/cron/content-scheduling.ts                   → unpublish logica toevoegen
```

#### Stap 4: Editoriale kalender admin UI (4-6u)
Custom Payload admin view met maand/week/dag weergave.

```
NIEUW:
  src/features/scheduling/
  ├── index.ts
  ├── components/
  │   ├── SchedulingCalendar/
  │   │   ├── Component.tsx
  │   │   ├── index.ts
  │   │   └── types.ts
  │   ├── CalendarDayCell/
  │   │   ├── Component.tsx
  │   │   ├── index.ts
  │   │   └── types.ts
  │   ├── CalendarEventCard/
  │   │   ├── Component.tsx
  │   │   ├── index.ts
  │   │   └── types.ts
  │   └── SchedulingToolbar/
  │       ├── Component.tsx
  │       ├── index.ts
  │       └── types.ts
  └── lib/
      └── scheduling-service.ts
```

#### Stap 5: Notificaties (2-3u)
"Je artikel is gepubliceerd" via bestaand Notifications systeem.

```
WIJZIG:
  src/scripts/cron/content-scheduling.ts                   → notificatie na publish
```

#### Stap 6: Timezone per tenant (1-2u)
Hergebruik timezone-logica uit email campaigns.

```
WIJZIG:
  src/branches/shared/globals/Settings.ts                  → timezone veld (als nog niet aanwezig)
```

---

### 1B. Uptime Monitoring (#23) — 13-17u

**Bestaand:** `/api/health` endpoint, `cron/health-monitoring.ts`, Sentry integratie, email marketing monitoring infra (HealthChecker, AlertManager, MetricsCollector).

#### Stap 1: Health check service (3u)
HTTP check per tenant-site elke 60s. Hergebruik patroon uit `src/features/email-marketing/lib/monitoring/`.

```
NIEUW:
  src/features/platform/monitoring/
  ├── UptimeChecker/
  │   ├── Component.tsx          (niet van toepassing — pure server-side)
  │   ├── index.ts
  │   └── types.ts
  ├── lib/
  │   ├── uptime-checker.ts
  │   ├── incident-detector.ts
  │   └── uptime-alerter.ts
  └── collections/
      └── UptimeIncidents.ts
```

#### Stap 2: Incident detectie (2u)
3 opeenvolgende failures = incident record aanmaken.

```
WIJZIG:
  src/features/platform/monitoring/lib/incident-detector.ts
  src/payload.config.ts                                    → UptimeIncidents collection registreren
```

Migration:
```
NIEUW:
  src/migrations/YYYYMMDD_HHMMSS_add_uptime_incidents.ts
```

#### Stap 3: Alert systeem (2-3u)
Email + optioneel Slack webhook bij downtime.

```
WIJZIG:
  src/features/platform/monitoring/lib/uptime-alerter.ts
```

#### Stap 4: Platform admin dashboard (4-6u)
Overzicht alle sites met status, uptime %, response times. Alleen zichtbaar op `/platform/monitoring`.

```
NIEUW:
  src/features/platform/monitoring/components/
  ├── UptimeDashboard/
  │   ├── Component.tsx
  │   ├── index.ts
  │   └── types.ts
  ├── SiteStatusCard/
  │   ├── Component.tsx
  │   ├── index.ts
  │   └── types.ts
  ├── UptimeGraph/
  │   ├── Component.tsx
  │   ├── index.ts
  │   └── types.ts
  └── IncidentTimeline/
      ├── Component.tsx
      ├── index.ts
      └── types.ts

WIJZIG:
  src/app/(platform)/platform/monitoring/page.tsx          → UptimeDashboard integreren
```

#### Stap 5: Uptime history (2-3u)
30-dagen grafiek per site.

```
NIEUW:
  src/app/api/platform/monitoring/
  ├── route.ts                                             → GET uptime data
  └── [siteId]/
      └── route.ts                                         → GET history per site
```

---

## Fase 2: Zoeken & AI (~40-60u)

### 2A. Semantic Search (#12) — 15-25u

**Bestaand:** Meilisearch volledig draaiend met 3 indexes (products, blog-posts, pages), typo tolerance, faceted search, <50ms response. Geen vector/embeddings.

#### Stap 1: Embedding generatie (3u)
OpenAI `text-embedding-3-small` voor productnaam + beschrijving.

```
NIEUW:
  src/features/search/lib/embeddings/
  ├── embedding-service.ts                                 → OpenAI embedding API wrapper
  ├── product-embedder.ts                                  → batch embed products
  └── types.ts

WIJZIG:
  src/features/search/lib/meilisearch/indexProducts.ts     → embeddings meesturen bij index
```

#### Stap 2: Vector opslag (2u)
pgvector extensie in PostgreSQL.

```
NIEUW:
  src/migrations/YYYYMMDD_HHMMSS_add_pgvector_embeddings.ts  → CREATE EXTENSION pgvector + embeddings tabel
  src/features/search/lib/embeddings/vector-store.ts          → CRUD voor embeddings
```

#### Stap 3: Hybrid search (4-6u)
Combineer Meilisearch keyword score + vector similarity score.

```
NIEUW:
  src/features/search/lib/hybrid/
  ├── hybrid-search.ts                                     → merge + rank resultaten
  ├── score-combiner.ts                                    → gewogen score berekening
  └── types.ts

WIJZIG:
  src/app/api/search/route.ts                              → hybrid search integreren
```

#### Stap 4: Query analyse (2-3u)
Detecteer "natuurlijke taal" vs keyword query.

```
NIEUW:
  src/features/search/lib/query/
  ├── query-analyzer.ts                                    → NLP detectie + filter extractie
  └── types.ts
```

#### Stap 5: Synoniemen pipeline (2-3u)
AI-gegenereerde synoniemen per categorie → Meilisearch.

```
NIEUW:
  src/features/search/lib/synonyms/
  ├── synonym-generator.ts                                 → OpenAI synonym generatie
  └── sync-to-meilisearch.ts
  src/scripts/cron/search-synonyms.ts
```

#### Stap 6: "Bedoelde je...?" (2-3u)
Suggesties bij weinig/geen resultaten.

```
NIEUW:
  src/features/search/components/DidYouMean/
  ├── Component.tsx
  ├── index.ts
  └── types.ts

WIJZIG:
  src/features/search/components/InstantSearch.tsx          → DidYouMean integreren
```

#### Stap 7: Search analytics (2-4u)
Top queries, zero-result queries, click-through logging.

```
NIEUW:
  src/features/search/lib/analytics/
  ├── search-logger.ts
  ├── search-analytics.ts
  └── types.ts
  src/features/search/components/SearchInsights/
  ├── Component.tsx
  ├── index.ts
  └── types.ts
  src/migrations/YYYYMMDD_HHMMSS_add_search_analytics.ts
```

---

### 2B. Customer Insights (#13) — 25-35u

**Bestaand:** Orders, Users, Carts data. Groq/OpenAI al geintegreerd. Geen analytics engine.

#### Stap 1: Data aggregatie (4u)

```
NIEUW:
  src/features/analytics/customer-insights/
  ├── index.ts
  ├── lib/
  │   ├── data-aggregator.ts                               → normaliseer klantdata
  │   ├── types.ts
  │   └── constants.ts
  └── collections/
      └── CustomerMetrics.ts                               → cache tabel voor berekende metrics

  src/migrations/YYYYMMDD_HHMMSS_add_customer_metrics.ts

WIJZIG:
  src/payload.config.ts                                    → CustomerMetrics registreren
```

#### Stap 2: RFM analyse engine (4u)

```
NIEUW:
  src/features/analytics/customer-insights/lib/
  ├── rfm-calculator.ts                                    → Recency/Frequency/Monetary scores
  └── rfm-types.ts
```

#### Stap 3: Auto-segmentatie (3u)

```
NIEUW:
  src/features/analytics/customer-insights/lib/
  ├── segment-engine.ts                                    → VIP/trouw/at-risk/nieuw/slapend/verloren
  └── segment-rules.ts                                     → configureerbare drempelwaarden
```

#### Stap 4: Churn predictie (3-4u)

```
NIEUW:
  src/features/analytics/customer-insights/lib/
  └── churn-predictor.ts                                   → predictie op basis van bestelpatronen
```

#### Stap 5: CLV berekening (2-3u)

```
NIEUW:
  src/features/analytics/customer-insights/lib/
  └── clv-calculator.ts                                    → historisch + voorspeld
```

#### Stap 6: Insights dashboard (5-8u)

```
NIEUW:
  src/features/analytics/customer-insights/components/
  ├── InsightsDashboard/
  │   ├── Component.tsx
  │   ├── index.ts
  │   └── types.ts
  ├── SegmentDistribution/
  │   ├── Component.tsx
  │   ├── index.ts
  │   └── types.ts
  ├── ChurnRiskTable/
  │   ├── Component.tsx
  │   ├── index.ts
  │   └── types.ts
  ├── CLVChart/
  │   ├── Component.tsx
  │   ├── index.ts
  │   └── types.ts
  ├── RFMHeatmap/
  │   ├── Component.tsx
  │   ├── index.ts
  │   └── types.ts
  └── KPICards/
      ├── Component.tsx
      ├── index.ts
      └── types.ts

  src/app/api/analytics/customer-insights/route.ts         → GET dashboard data
  src/app/(platform)/platform/insights/page.tsx            → of admin-only pagina
```

#### Stap 7: Automatische alerts (2-3u)

```
NIEUW:
  src/features/analytics/customer-insights/lib/
  └── insight-alerts.ts

  src/scripts/cron/customer-insights.ts                    → dagelijkse herberekening + alerts
```

#### Stap 8: Email marketing sync (2-3u)

```
NIEUW:
  src/features/analytics/customer-insights/lib/
  └── listmonk-segment-sync.ts                             → segmenten als Listmonk lijsten
```

---

## Fase 3: E-commerce & Marketing (~30-45u)

### 3A. Geavanceerde Promoties (#16) — 15-25u

**Bestaand:** DiscountCodes collection, staffelprijzen, bundle product type, pricing engine.

#### Stap 1: Promotions collection (3u)

```
NIEUW:
  src/branches/ecommerce/shared/collections/marketing/Promotions.ts
  src/migrations/YYYYMMDD_HHMMSS_add_promotions.ts

WIJZIG:
  src/payload.config.ts                                    → Promotions registreren
```

#### Stap 2: Flash sale engine (3-4u)

```
NIEUW:
  src/features/promotions/
  ├── index.ts
  ├── lib/
  │   ├── promotion-engine.ts                              → evalueer actieve promoties
  │   ├── flash-sale-scheduler.ts                          → cron auto-activatie
  │   └── types.ts
  └── components/
      └── CountdownTimer/
          ├── Component.tsx
          ├── index.ts
          └── types.ts

  src/scripts/cron/promotion-scheduler.ts
```

#### Stap 3: Bundle builder admin (2-3u)

```
NIEUW:
  src/features/promotions/components/
  └── BundleBuilder/
      ├── Component.tsx                                    → admin drag-and-drop UI
      ├── index.ts
      └── types.ts
```

#### Stap 4: Bundle display frontend (2u)

```
NIEUW:
  src/branches/ecommerce/shared/components/shop/BundleDeal/
  ├── Component.tsx
  ├── index.ts
  └── types.ts
```

#### Stap 5: Cart integratie (3-4u)

```
WIJZIG:
  src/branches/ecommerce/shared/lib/pricing/               → promotion rules toevoegen
  packages/modules/cart/                                    → auto-apply promoties

NIEUW:
  src/features/promotions/lib/
  └── cart-promotion-resolver.ts                           → match cart items tegen actieve promoties
```

#### Stap 6: Promotion banner (2-3u)

```
NIEUW:
  src/branches/ecommerce/shared/components/shop/PromotionBanner/
  ├── Component.tsx
  ├── index.ts
  └── types.ts
```

#### Stap 7: Analytics (2-3u)

```
NIEUW:
  src/features/promotions/lib/
  └── promotion-analytics.ts

  src/features/promotions/components/
  └── PromotionStats/
      ├── Component.tsx
      ├── index.ts
      └── types.ts
```

---

### 3B. Geavanceerde Segmentatie (#18) — 15-20u

**Bestaand:** EmailLists, EmailSubscribers, Listmonk sync, campaigns met SQL-based segmentatie.

#### Stap 1: Visuele segment builder UI (4-5u)

```
NIEUW:
  src/features/email-marketing/components/SegmentBuilder/
  ├── Component.tsx                                        → hoofd container
  ├── index.ts
  └── types.ts
  src/features/email-marketing/components/SegmentConditionRow/
  ├── Component.tsx                                        → AND/OR rij
  ├── index.ts
  └── types.ts
  src/features/email-marketing/components/SegmentGroupBlock/
  ├── Component.tsx                                        → geneste groep
  ├── index.ts
  └── types.ts
  src/features/email-marketing/components/ConditionValuePicker/
  ├── Component.tsx                                        → waarde invoer per type
  ├── index.ts
  └── types.ts
```

#### Stap 2: Conditie types (3-4u)

```
NIEUW:
  src/features/email-marketing/lib/segmentation/
  ├── condition-types.ts                                   → alle beschikbare condities
  ├── condition-evaluator.ts                               → vertaal UI → SQL WHERE
  ├── operators.ts                                         → equals, contains, gt, lt, between, etc.
  └── types.ts
```

#### Stap 3: RFM module (2u)
Hergebruik van Customer Insights (#13).

```
NIEUW:
  src/features/email-marketing/lib/segmentation/
  └── rfm-conditions.ts                                    → RFM score als conditie type

WIJZIG:
  src/features/email-marketing/lib/segmentation/condition-types.ts → RFM toevoegen
```

#### Stap 4: Live preview (2-3u)

```
NIEUW:
  src/features/email-marketing/components/SegmentPreview/
  ├── Component.tsx                                        → "~342 subscribers" live indicator
  ├── index.ts
  └── types.ts

  src/app/api/email-marketing/segments/preview/route.ts    → POST condities → count
```

#### Stap 5: Segment management (3-4u)

```
NIEUW:
  src/features/email-marketing/components/SegmentList/
  ├── Component.tsx                                        → overzicht, dupliceren, verwijderen
  ├── index.ts
  └── types.ts
  src/features/email-marketing/components/SegmentCard/
  ├── Component.tsx
  ├── index.ts
  └── types.ts

  src/features/email-marketing/collections/EmailSegments.ts → opgeslagen segmenten
  src/migrations/YYYYMMDD_HHMMSS_add_email_segments.ts

WIJZIG:
  src/payload.config.ts                                    → EmailSegments registreren
  src/features/email-marketing/collections/EmailCampaigns.ts → segment selectie ipv raw SQL
```

---

## Fase 4: PWA (~15-25u)

### 4A. PWA Algemeen (#27) — 15-25u

**Bestaand:** Niets. Vanaf scratch.

#### Stap 1: Dynamic manifest (3u)

```
NIEUW:
  src/features/pwa/
  ├── index.ts
  ├── lib/
  │   ├── manifest-generator.ts                            → genereer manifest.json uit tenant Settings
  │   ├── icon-generator.ts                                → sharp: 512x512 → alle formaten
  │   └── types.ts
  └── components/
      └── PWAHead/
          ├── Component.tsx                                → <link rel="manifest"> + Apple meta tags
          ├── index.ts
          └── types.ts

  src/app/manifest.json/route.ts                           → dynamic manifest endpoint
  src/app/api/pwa/icons/route.ts                           → on-the-fly icon resize
```

#### Stap 2: Icoon generatie (2u)

```
WIJZIG:
  src/features/pwa/lib/icon-generator.ts                   → 192x192, 384x384, 512x512 + maskable
```

#### Stap 3: Service worker (4-6u)

```
NIEUW:
  public/sw.js                                             → of gegenereerd via next build
  src/features/pwa/lib/
  ├── sw-registration.ts                                   → register service worker in layout
  ├── cache-strategies.ts                                  → per resource type
  └── offline-handler.ts

  src/features/pwa/components/
  └── ServiceWorkerRegistration/
      ├── Component.tsx
      ├── index.ts
      └── types.ts

WIJZIG:
  src/app/layout.tsx                                       → ServiceWorkerRegistration toevoegen
```

#### Stap 4: Offline fallback (2u)

```
NIEUW:
  src/app/offline/page.tsx                                 → "Je bent offline" pagina
  src/features/pwa/components/
  └── OfflineFallback/
      ├── Component.tsx
      ├── index.ts
      └── types.ts
```

#### Stap 5: Install prompt (2-3u)

```
NIEUW:
  src/features/pwa/components/
  └── InstallPrompt/
      ├── Component.tsx                                    → "Voeg toe aan startscherm" banner
      ├── index.ts
      └── types.ts

WIJZIG:
  src/app/layout.tsx                                       → InstallPrompt toevoegen
```

#### Stap 6: Push notifications (3-5u)

```
NIEUW:
  src/features/pwa/lib/
  ├── push-service.ts                                      → web-push + VAPID keys
  └── push-types.ts

  src/features/pwa/components/
  └── PushPermissionBanner/
      ├── Component.tsx
      ├── index.ts
      └── types.ts

  src/app/api/pwa/
  ├── subscribe/route.ts                                   → POST push subscription
  └── send/route.ts                                        → POST push notification (admin)

  src/features/pwa/collections/
  └── PushSubscriptions.ts

  src/migrations/YYYYMMDD_HHMMSS_add_push_subscriptions.ts

WIJZIG:
  src/payload.config.ts                                    → PushSubscriptions registreren
```

#### Stap 7: Lighthouse optimalisatie (2u)

```
WIJZIG:
  Diverse bestanden voor performance tuning (lazy loading, prefetch, etc.)
```

---

## Overzicht: Alle nieuwe bestanden per fase

| Fase | Nieuwe bestanden | Nieuwe componenten | Nieuwe migrations | Nieuwe collections |
|------|------------------|--------------------|-------------------|--------------------|
| 1A Content Scheduling | ~15 | 4 | 1 | 0 |
| 1B Uptime Monitoring | ~18 | 4 | 1 | 1 (UptimeIncidents) |
| 2A Semantic Search | ~20 | 2 | 2 | 0 |
| 2B Customer Insights | ~25 | 6 | 1 | 1 (CustomerMetrics) |
| 3A Promoties | ~20 | 5 | 1 | 1 (Promotions) |
| 3B Segmentatie | ~20 | 5 | 1 | 1 (EmailSegments) |
| 4 PWA | ~22 | 5 | 1 | 1 (PushSubscriptions) |
| **Totaal** | **~140** | **31** | **8** | **5** |

---

## Afhankelijkheden

```
Fase 1A (Scheduling) ──────────────────────────────► onafhankelijk
Fase 1B (Uptime) ──────────────────────────────────► onafhankelijk
Fase 2A (Semantic Search) ─────────────────────────► vereist: pgvector extensie
Fase 2B (Customer Insights) ───────────────────────► vereist: voldoende orderdata
Fase 3A (Promoties) ───────────────────────────────► onafhankelijk
Fase 3B (Segmentatie) ────► vereist: Fase 2B (RFM)  + bestaand email marketing
Fase 4  (PWA) ─────────────────────────────────────► onafhankelijk
```

Aanbevolen volgorde: **1A → 1B → 2A → 2B → 3A → 3B → 4**
Parallelliseerbaar: 1A+1B samen, 2A+3A samen, 4 op elk moment.

---

## Tijdlijn

| Fase | Features | Geschatte uren | Cumulatief |
|------|----------|---------------|------------|
| 1 | Content Scheduling + Uptime Monitoring | 25-35u | 25-35u |
| 2 | Semantic Search + Customer Insights | 40-60u | 65-95u |
| 3 | Promoties + Segmentatie | 30-45u | 95-140u |
| 4 | PWA | 15-25u | 110-165u |

---

## Componentpatroon (voor alle nieuwe componenten)

Elke component volgt het standaard patroon:

```
ComponentName/
├── Component.tsx     ← React component ('use client' waar nodig)
├── index.ts          ← barrel export: export { ComponentName } from './Component'
└── types.ts          ← props interface + lokale types
```

Gedeelde types per feature module staan in `lib/types.ts` op moduleniveau.
