# THOR API Integratie

**Status:** Roadmap
**Prioriteit:** Middel (klant-afhankelijk)
**Geschatte effort:** 8-13 uur (met AI)

---

## Huidige situatie

Er is al een provider-abstractielaag gepland voor de digitale editie-bibliotheek. Het huidige ontwerp voorziet een `InternalProvider` die edities uit Payload CMS haalt. De architectuur is echter voorbereid op meerdere databronnen. THOR is een veelgebruikt systeem in de Nederlandse uitgeefbranche voor editiebeheer en abonneeadministratie (CRM). Diverse potentiele klanten gebruiken THOR als hun primaire systeem.

## Wat het doet

Een `ThorProvider` als tweede databron naast de bestaande `InternalProvider`, plus integratie met THOR CRM voor abonneebeheer:

- **ThorEditionProvider** — Haalt edities, pagina's en metadata op via de THOR API
- **THOR CRM sync** — Synchroniseert abonneegegevens (status, type abonnement, verloopdatum) met Payload CMS
- **Toegangscontrole** — Editie-toegang bepalen op basis van THOR-abonnementsstatus
- **Hybride modus** — Sommige edities uit THOR, andere intern beheerd (per tenant configureerbaar)
- **Webhook ontvanger** — Real-time updates bij wijzigingen in THOR (nieuwe editie, abonnementswijziging)

## Waarom waardevol

- **Marktpositie** — Veel Nederlandse uitgevers gebruiken THOR; integratie verlaagt de drempel om over te stappen
- **Geen dubbel werk** — Uitgevers hoeven edities niet handmatig te uploaden als ze al in THOR staan
- **Betrouwbare abonneedata** — THOR is het bronsysteem voor abonnementen; sync voorkomt discrepanties
- **Snellere onboarding** — Nieuwe klanten met THOR kunnen direct live met bestaande content
- **Multi-tenant** — Elke tenant kan onafhankelijk kiezen: intern, THOR, of hybride

## Implementatiestappen

1. **THOR API client library** (2-3 uur)
   - HTTP client voor THOR REST API
   - Authenticatie (API key / OAuth)
   - Rate limiting en retry logica
   - Response typing (TypeScript interfaces voor THOR-objecten)
   - Error handling en logging

2. **ThorEditionProvider** (2-3 uur)
   - Implementatie van de EditionProvider interface
   - Editie-lijst ophalen met paginering
   - Editie-detail met pagina-URLs
   - Caching laag (Redis of in-memory) om THOR API-calls te beperken
   - Fallback naar cache bij THOR-downtime

3. **THOR CRM abonnee-sync** (2-3 uur)
   - Scheduled sync job (bijv. elk uur)
   - Mapping THOR-abonnee velden naar Payload CMS subscriber collection
   - Conflict resolution (THOR als bronsysteem)
   - Sync-statusrapportage in admin dashboard

4. **Toegangscontrole integratie** (1-2 uur)
   - Middleware die abonnementsstatus checkt bij editie-toegang
   - Ondersteuning voor verschillende abonnementstypen (digitaal, print+digitaal, proef)
   - Graceful handling van verlopen abonnementen (paywall met upsell)

5. **Webhook endpoint & configuratie** (1-2 uur)
   - Webhook ontvanger voor THOR-events (nieuwe editie gepubliceerd, abonnement gewijzigd)
   - Signature verificatie voor beveiliging
   - Event processing queue (voorkom blocking)
   - Tenant-configuratie in ecommerce-settings (THOR API URL, credentials, modus)
