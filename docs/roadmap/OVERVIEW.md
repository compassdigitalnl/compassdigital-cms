# CompassDigital — Product Roadmap Overzicht

**Totaal: 47 roadmap items** | **Updated:** 11 maart 2026

**Voortgang: 27 afgerond, 1 deels, 19 open**

---

## Prioriteit: Hoog

| # | Categorie | Feature | Effort | Status | Toelichting |
|---|-----------|---------|--------|--------|-------------|
| 1 | AI | Product Aanbevelingen | 20-30u | ✅ Done | RecommendationService (similar/also-bought/trending/personalized) + pgvector + API |
| 2 | E-commerce | Live Order Tracking | 15-20u | ✅ Done | Track page + carrier webhooks + API + transactionele emails |
| 3 | Email Marketing | Visuele Flow Builder | 25-35u | ✅ Done | React Flow editor + 8 node types + executor + admin link |
| 4 | Email Marketing | Subscriber Import/Export | 8-12u | ✅ Done | 4-stap CSV wizard + export knop in admin list view |
| 5 | Platform | Self-Service Onboarding | 30-40u | ❌ Open | |
| 6 | Platform | Client Billing Dashboard | 20-30u | 🟡 Deels | ClientDetailsView bestaat, billing beperkt |
| 7 | Integraties | Boekhoud-koppelingen | 20-30u | ❌ Open | Exact, Moneybird, Xero |
| 8 | Integraties | Verzendproviders | 15-20u | ✅ Done | Sendcloud + MyParcel providers |
| 9 | Analytics | Conversion Funnels | 20-30u | ✅ Done | ConversionFunnel + dashboard + DefaultTemplate sidebar |
| 10 | Analytics | Revenue Dashboard | 15-25u | ✅ Done | KPI cards, charts, top products, 4 API routes + sidebar |
| 11 | Security | Two-Factor Auth (2FA) | 10-15u | ✅ Done | TOTP + backup codes + 6 API routes + UI |

**Hoog: 8/11 afgerond**

---

## Prioriteit: Hoog-Middel (Nieuw — Sprint Q1-2026)

| # | Categorie | Feature | Effort | Status | Toelichting |
|---|-----------|---------|--------|--------|-------------|
| 43 | E-commerce | Product Reviews Systeem | 15-20u | ✅ Done | ProductReviews collection + review/helpful APIs + AI moderatie + product rating aggregatie |
| 44 | E-commerce | Review Request Flow (Email) | 10-15u | ✅ Done | 7-staps flow: order → wacht 7d → review email → wacht 5d → herinnering + tags |
| 45 | Email Marketing | Voorgedefinieerde Templates | 8-12u | ✅ Done | 7 templates: review request, herinnering, welkom, herbestelling, verjaardag, win-back, abandoned cart |
| 46 | Email Marketing | Voorgedefinieerde Flows | 10-15u | ✅ Done | 4 flows: review request, welkom-serie, abandoned cart, re-engagement + seed API |
| 47 | Email Marketing | Voorgedefinieerde Segmenten | 5-8u | ✅ Done | 7 segmenten: niet-gereviewed, herhaalaankopers, inactief 90d, VIP, nieuw, churn-risico, hoge AOV |

**Hoog-Middel: 5/5 afgerond**

---

## Prioriteit: Middel

| # | Categorie | Feature | Effort | Status | Toelichting |
|---|-----------|---------|--------|--------|-------------|
| 12 | AI | Semantic Search | 15-25u | ✅ Done | Hybrid search (Meilisearch + pgvector), query analyzer |
| 13 | AI | Customer Insights | 25-35u | ✅ Done | RFM, CLV, churn predictor, InsightsDashboard + sidebar |
| 14 | E-commerce | Dropshipping | 25-35u | ❌ Open | |
| 15 | E-commerce | Multi-Warehouse | 20-30u | ❌ Open | |
| 16 | E-commerce | Geavanceerde Promoties | 15-25u | ✅ Done | 5 typen, flash sales, priority stacking, cron scheduler |
| 17 | Email Marketing | A/B Testing UI | 10-15u | ✅ Done | ABTests collection + auto-winner + useABTest hook |
| 18 | Email Marketing | Geavanceerde Segmentatie | 15-20u | ✅ Done | Visuele SegmentBuilder als custom field + condition evaluator |
| 19 | Publishing | PWA Offline Lezen | 8-12u | ❌ Open | Editie-downloads voor offline, publishing-specifiek |
| 20 | Publishing | THOR API Integratie | 8-13u | ❌ Open | |
| 21 | Publishing | Content Scheduling | 12-18u | ✅ Done | publishAt/unpublishAt + cron (elke minuut) |
| 22 | Platform | White-Label Reseller | 25-35u | ❌ Open | |
| 23 | Platform | Uptime Monitoring | 15-20u | ✅ Done | Health checks, incident detectie, alerting |
| 24 | Integraties | CRM Koppelingen | 15-25u | ❌ Open | HubSpot, Salesforce |
| 25 | Integraties | ERP Integratie | 30-50u | ❌ Open | SAP, Exact |
| 26 | Integraties | Social Commerce | 15-25u | ❌ Open | Instagram Shop, TikTok Shop |
| 27 | Mobile | PWA Algemeen | 15-25u | ✅ Done | Manifest, SW, push notificaties, offline, install + feature flags |
| 28 | Content | Goedkeuringsworkflows | 15-20u | ✅ Done | ContentApprovals collection + API (submit/approve/reject) + audit trail + auto-publish |
| 29 | Branches | Healthcare | 25-35u | ❌ Open | |

**Middel: 10/18 afgerond**

---

## Prioriteit: Laag

| # | Categorie | Feature | Effort | Status | Toelichting |
|---|-----------|---------|--------|--------|-------------|
| 30 | AI | DALL-E Beeldgeneratie | 10-15u | ✅ Done | AIImageGenerator + OpenAI images.generate |
| 31 | AI | Dynamic Pricing | 30-40u | ❌ Open | |
| 32 | AI | Review Moderatie | 10-15u | ✅ Done | ReviewModerator (Groq Llama 3.3) + sentiment/toxicity/fake detection + auto-approve/reject |
| 33 | E-commerce | POS Integratie | 30-40u | ❌ Open | |
| 34 | E-commerce | Wishlist Sharing | 8-12u | ✅ Done | Wishlists collection + share API + public wishlist page + FavoritesTemplate sharing UI |
| 35 | E-commerce | Product Configurator | 35-50u | ✅ Done | 7 componenten + ConfiguratorContainer + template integratie |
| 36 | Publishing | Native App | 80-120u | ❌ Open | |
| 37 | Publishing | Podcast Support | 15-25u | ❌ Open | |
| 38 | Analytics | Heatmaps | 15-60u | ❌ Open | |
| 39 | Security | SSO/SAML | 20-30u | ❌ Open | |
| 40 | Content | Headless API | 20-30u | ❌ Open | |
| 41 | Branches | Education (LMS) | 30-45u | ❌ Open | |
| 42 | Branches | Automotive | 20-30u | ❌ Open | |

**Laag: 4/13 afgerond**

---

## Samenvatting

| Prioriteit | Totaal | Done | Open | Voortgang |
|-----------|--------|------|------|-----------|
| Hoog | 11 | 8 | 3 | 73% |
| Hoog-Middel | 5 | 5 | 0 | 100% |
| Middel | 18 | 10 | 8 | 56% |
| Laag | 13 | 4 | 9 | 31% |
| **Totaal** | **47** | **27** | **20** | **57%** |

### Resterende effort (open items)

| Prioriteit | Items | Geschatte uren |
|-----------|-------|----------------|
| Hoog | 3 | ~80-100u |
| Hoog-Middel | 0 | 0u |
| Middel | 8 | ~155-260u |
| Laag | 9 | ~262-423u |
| **Totaal** | **20** | **~497-783u** |

---

## Per Categorie

| Categorie | Items | ✅ Done | ❌ Open |
|-----------|-------|---------|---------|
| AI | 6 | 5 | 1 |
| E-commerce | 9 | 6 | 3 |
| Email Marketing | 6 | 6 | 0 |
| Publishing | 5 | 1 | 4 |
| Platform | 4 | 1 | 3 |
| Integraties | 5 | 1 | 4 |
| Analytics | 3 | 3 | 0 |
| Security | 2 | 1 | 1 |
| Mobile | 1 | 1 | 0 |
| Content | 2 | 1 | 1 |
| Branches | 3 | 0 | 3 |

**Sterkste domeinen:** Email Marketing (6/6), Hoog-Middel (5/5), AI (5/6), Analytics (3/3), Mobile (1/1)
**Meeste werk over:** Integraties (1/5), Publishing (1/5), Branches (0/3)
