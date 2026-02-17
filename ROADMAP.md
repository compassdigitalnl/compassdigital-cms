# Contyzr Platform — Implementatie Roadmap

**Bijgewerkt:** Februari 2026
**Doel:** Multi-tenant SaaS-platform voor website- en webshopbouw

---

## Overzicht

Het platform groeit in drie fasen:

| Fase | Naam | Doel | Status |
|------|------|------|--------|
| 1 | Dagelijks gebruik | Handmatig klantbeheer voor CompassDigital | **Nu — bezig** |
| 2 | Deployment automatisering | Klanten deployen via Ploi met één druk op de knop | Gepland |
| 3 | SaaS-platform | Zelfbediening, billing, licenties | Toekomst |

---

## Fase 1 — Dagelijks gebruik (NU)

**Doel:** Het platform bruikbaar maken voor je eigen dagelijkse werk bij CompassDigital.

### Wat is al klaar
- [x] Payload CMS v3 opgezet op `cms.compassdigital.nl` (Ploi VPS)
- [x] PostgreSQL database (Railway)
- [x] Collections: Pages, BlogPosts, Media, Testimonials, Cases, Services, Partners, FAQs, Products
- [x] Blocks systeem (Hero, Text, Accordion, CTA, etc.)
- [x] Globals: Header, Footer, Settings, Theme
- [x] Clients collection (klantbeheer — vereenvoudigd formulier)
- [x] Deployments collection (deployment history — read-only velden)
- [x] Formulier vereenvoudigd: Dutch labels, alles ingeklapt, toekomstige velden gemarkeerd

### Wat nog moet (Fase 1)
- [ ] **Eerste echte klant aanmaken** — maak een klant aan in het admin panel, vul naam/domein/e-mail in
- [ ] **Eerste website bouwen** — maak een Pages-document, voeg blokken toe, publiceer
- [ ] **Kennismaken met het blokken-systeem** — Hero → Text → CTA → Footer opzetten voor een echte klant
- [ ] **Gebruikers aanmaken** — eventueel een editor-account per klant zodat zij zelf content kunnen beheren
- [ ] **Custom domain instellen** — DNS-records instellen voor klantdomein, via Ploi of Cloudflare

### Hoe blokken werken
Blokken zijn NIET aparte menu-items in de sidebar. Ze werken als volgt:
1. Ga naar **Pages** → **Nieuw document aanmaken**
2. Scroll naar het veld **Layout** (of **Inhoud**)
3. Klik **"Add Block"** → kies een bloktype (Hero, Text, Accordion, etc.)
4. Vul het blok in → Sla op

---

## Fase 2 — Deployment automatisering (6–12 maanden)

**Doel:** Klanten deployen via Ploi met één druk op de knop vanuit het admin panel.

### Architectuur
```
Admin panel (Payload CMS)
    ↓  "Deploy" knop
Payload API endpoint (/api/deploy)
    ↓  Ploi API call
Ploi VPS: nieuwe site aanmaken, Git repo klonen, ENV instellen
    ↓
Klantsite live op [klant].compassdigital.nl
    ↓  of
Klantsite live op eigen domein (CNAME naar Ploi)
```

### Vereisten voor Fase 2

**Backend — deployment API:**
- [ ] `src/app/api/deploy/route.ts` — POST endpoint dat Ploi API aanroept
- [ ] `src/platform/services/ploi.ts` — Ploi API-client (sites aanmaken, ENV instellen, deploy triggeren)
- [ ] `src/platform/services/deployment.ts` — deployment orchestratie (aanmaken → deployen → health check)
- [ ] Webhook ontvanger voor Ploi deploy-events (`/api/webhooks/ploi`)

**Admin panel — UX:**
- [ ] "Deploy" knop op Clients detail-pagina (custom Payload component)
- [ ] Live deployment logs in admin (polling of WebSocket)
- [ ] Status-updates in Deployments collection (automatisch via webhook)

**Infrastructuur:**
- [ ] Git repository template per site-type (website, webshop)
  - Optie A: Monorepo met multi-tenant routing
  - Optie B: Aparte repo per klant (simpeler, duurder qua beheer)
- [ ] ENV-templating systeem (per klant eigen DATABASE_URL, PAYLOAD_SECRET, etc.)
- [ ] Ploi: automatisch site aanmaken, Nginx config, SSL via Let's Encrypt

**Technologiën:**
- Ploi API: `https://ploi.io/api` (al beschikbaar, token geconfigureerd)
- Node.js `undici` of `fetch` voor API calls
- Payload custom components voor de "Deploy" knop

### Database schema-uitbreidingen (Fase 2)
Geen wijzigingen aan de Clients/Deployments collection — alle velden zijn al aanwezig:
- `deployment_provider`, `deployment_provider_id`, `deployment_url`, `admin_url`
- `last_deployment_id`, `last_deployed_at`
- `database_url`, `database_provider_id`
- `custom_environment` (JSON voor klantspecifieke ENV vars)

### Schatting
- Development: 40–80 uur
- Complexiteit: Gemiddeld (Ploi API is goed gedocumenteerd)
- Risico: Database-provisioning per klant (Railway heeft limieten op gratis tier)

---

## Fase 3 — SaaS-platform (12–24 maanden)

**Doel:** Klanten kopen zelf een licentie, alles wordt automatisch ingericht. "Shopify voor websites."

### Architectuur
```
Klant bezoekt compassdigital.nl/pricing
    ↓  kiest plan, betaalt via Stripe
Automatische provisioning:
    - Database aanmaken (Railway/Neon)
    - Ploi site deployen
    - Admin-account aanmaken
    - Welkomstmail sturen
    ↓
Klant logt in op [klant].compassdigital.nl/admin
    ↓
Klant beheert eigen content, ziet eigen data
```

### Vereisten voor Fase 3

**Billing & Subscriptions (Stripe):**
- [ ] Stripe Connect: betalingen per klant verwerken
- [ ] Stripe Billing: maandelijkse abonnementen (Starter, Pro, Enterprise)
- [ ] Webhook-handlers voor: `invoice.paid`, `customer.subscription.deleted`
- [ ] Billing-portal: klant kan zelf abonnement aanpassen/opzeggen
- [ ] Automatisch account pauzeren bij niet-betaling (`status: suspended`)

**Zelfbediening onboarding:**
- [ ] Aanmeldformulier op compassdigital.nl (naam, domein, e-mail, plan)
- [ ] Automatische welkomstmail (Resend) met inloggegevens
- [ ] Onboarding-wizard in admin panel (eerste keer inloggen → guided setup)
- [ ] Domein-verificatie flow (DNS-check + automatisch SSL)

**Multi-tenant isolatie:**
- [ ] Payload access control: klanten zien alleen hun eigen data
- [ ] Aparte database per klant (Neon/Railway database per project)
  - Alternatief: gedeelde database met tenant-ID filter (simpeler, minder veilig)
- [ ] Media-isolatie: bestanden in klantspecifieke map/bucket (S3 of Cloudflare R2)

**Licenties & Functies:**
- [ ] Feature flags per plan (Starter: geen e-commerce, Pro: webshop, Enterprise: alles)
- [ ] Gebruik-limieten (aantal pagina's, gebruikers, media GB)
- [ ] API rate limiting per tenant

**MultiSafePay integratie (optioneel — voor webshops):**
- [ ] MultiSafePay affiliate-account aanmaken per klant
- [ ] Betalingen via klantspecifiek MSP-account
- [ ] Revenue sharing: percentage naar CompassDigital

**Beheerders-dashboard:**
- [ ] Overzicht: actieve klanten, MRR, uptime, storage
- [ ] Inkomsten-dashboard (Stripe MRR, churn, lifetime value)
- [ ] Automatische alerts bij problemen (health check mislukt, betaling mislukt)

### Schattingen
- Development: 200–400 uur
- Externe kosten: Stripe (2.9% + €0.25/transactie), Railway/Neon ($0.01/GB/uur), Resend ($0.001/mail)
- Break-even: ~15–20 klanten op Starter-plan (€49/mnd)

### Aanbevolen volgorde binnen Fase 3
1. Stripe Billing integratie (MRR genereren)
2. Zelfservice onboarding (schaalbaarheid)
3. Multi-tenant isolatie (veiligheid/compliance)
4. MultiSafePay / betalingsverwerking voor klanten
5. Beheerders-dashboard
6. Feature flags & limieten

---

## Technische beslissingen

### Database per klant vs. gedeeld
| | Aparte DB per klant | Gedeelde DB + tenant-ID |
|---|---|---|
| **Veiligheid** | Volledig geïsoleerd | Data-leaks mogelijk bij bug |
| **Kosten** | Hoger (Railway ~$5/mnd per DB) | Goedkoper |
| **Beheer** | Complexer (migraties per klant) | Simpeler |
| **Aanbeveling** | Fase 3 (100+ klanten) | Begin Fase 2 |

**Aanbeveling:** Begin met gedeelde DB + tenant-ID filter, migreer naar aparte DB's als GDPR/compliance dit vereist.

### Hosting per klant
| | Subdomain op Ploi | Eigen domein via CNAME |
|---|---|---|
| **Setup** | Volledig automatisch | Klant moet DNS instellen |
| **SSL** | Automatisch (Let's Encrypt) | Automatisch na DNS-verificatie |
| **Aanbeveling** | Standaard | Op verzoek |

### Git repository strategie
| | Monorepo | Repo per klant |
|---|---|---|
| **Updates uitrollen** | Eén push, alle klanten | Per klant aparte push |
| **Klantaanpassingen** | Lastig | Eenvoudig |
| **Schaalbaarheid** | Tot ~50 klanten goed | Onbeperkt |
| **Aanbeveling** | Fase 1–2 | Fase 3 (100+ klanten) |

---

## Referentie-architectuur

```
cms.compassdigital.nl (Payload CMS — platform admin)
    ├── /admin                    Platform management
    ├── /api/deploy               Deployment API
    ├── /api/webhooks/ploi        Ploi status updates
    └── /api/health               Health monitoring

[klant].compassdigital.nl (per klant — Ploi VPS)
    ├── /admin                    Klant's eigen CMS
    ├── /                         Klant's website
    └── /api                      Klant's API

Externe services:
    ├── Railway/Neon              Database per klant
    ├── Ploi                      Server/site beheer
    ├── Stripe                    Billing & subscriptions
    ├── Resend                    Transactionele e-mails
    ├── Cloudflare R2             Media opslag
    └── MultiSafePay              Betalingsverwerking (webshops)
```

---

## Prioriteiten samenvatting

**Doe nu (Fase 1):**
1. Gebruik het platform voor je eerste echte klantproject
2. Leer de blocks werken (Hero, Text, CTA)
3. Breng de eerste klantsite live (handmatig via Ploi)

**Plan voor later (Fase 2, ~6 mnd):**
1. Ploi API integratie (deploy met één druk op de knop)
2. "Deploy" knop in admin panel
3. Automatische ENV-setup per klant

**Visie (Fase 3, ~12–18 mnd):**
1. Stripe Billing (maandelijkse abonnementen)
2. Zelfservice onboarding
3. Volledig multi-tenant SaaS

---

*Dit document bijwerken als fasen worden afgerond of als architectuurkeuzes wijzigen.*
