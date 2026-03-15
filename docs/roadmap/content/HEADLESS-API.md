# Headless CMS API

**Status:** Roadmap
**Prioriteit:** Laag
**Geschatte inspanning:** 20-30 uur (met AI-assistentie)

---

## Huidige situatie

Payload CMS biedt standaard een REST API voor alle collecties (bijv. `/api/pages`, `/api/products`). Deze API is functioneel maar niet geoptimaliseerd voor extern gebruik door derden:

- Geen publieke API documentatie
- Geen versioning (v1/v2)
- Geen specifieke rate limiting per API-consument
- Geen API keys voor externe partijen (huidige API keys zijn voor interne integraties)
- Geen GraphQL endpoint (Payload ondersteunt dit wel maar het is niet geconfigureerd)
- Response formaat bevat interne Payload structuren die voor externe developers verwarrend zijn
- Geen webhook systeem voor real-time data push

## Wat het doet

Een gepolijste, gedocumenteerde headless CMS API die externe developers en systemen kunnen gebruiken:

- **REST API (v1):** Nette, voorspelbare endpoints met consistente response structuur, paginatie, filtering en sortering
- **GraphQL API:** Flexibele queries voor developers die alleen specifieke velden nodig hebben (minder data over de lijn)
- **API documentatie:** Automatisch gegenereerde OpenAPI/Swagger documentatie, interactief te verkennen
- **API keys voor derden:** Zelfservice API key management in het admin panel, met scopes (read-only, specifieke collecties)
- **Webhooks:** Bij content-wijzigingen automatisch een POST request naar een geconfigureerde URL sturen
- **Rate limiting per key:** Verschillende limieten per API key (gratis tier vs. premium)
- **Response transformatie:** Schone JSON responses zonder interne Payload velden, met consistente error handling

## Waarom waardevol

- **Nieuwe use cases:** Klanten kunnen hun CMS-data gebruiken in mobiele apps, digital signage, externe websites, of koppelen met ERP/PIM systemen
- **Platform als data-hub:** Het CMS wordt de single source of truth voor content, bruikbaar vanuit meerdere kanalen (headless/omnichannel)
- **Developer ecosysteem:** Een goede API trekt developers aan die integraties bouwen, wat het platform waardevoller maakt
- **Toekomstbestendig:** De trend naar headless CMS en composable architecture maakt een goede API steeds belangrijker
- **Extra inkomstenbron:** API-toegang kan als premium feature aangeboden worden

De prioriteit is laag omdat de huidige klanten het CMS voornamelijk als monoliet gebruiken (Next.js frontend + Payload backend). De API wordt relevant zodra klanten met externe systemen willen integreren.

## Implementatiestappen

### Fase 1: REST API opschonen en versioning (6-8 uur)
1. API versioning implementeren: `/api/v1/` prefix voor alle publieke endpoints
2. Response transformer middleware: interne Payload velden verwijderen (`_status`, `createdAt` hernoemen, relaties normaliseren)
3. Consistente error responses: `{ error: { code, message, details } }` formaat voor alle endpoints
4. Paginatie standaardiseren: `page`, `limit`, `totalDocs`, `totalPages` in elke lijst-response
5. Filtering syntax documenteren en uitbreiden: `?where[field][operator]=value` met ondersteuning voor `equals`, `contains`, `gt`, `lt`, `in`
6. Velden selectie: `?fields=title,slug,image` om alleen specifieke velden op te vragen
7. Populate controle: `?depth=0` voor geen relaties, `?depth=1` voor directe relaties, etc.

### Fase 2: GraphQL endpoint (4-6 uur)
8. Payload GraphQL plugin activeren en configureren
9. Schema optimaliseren: alleen publieke collecties en velden exposen
10. Query complexity limiting: voorkom te diepe of te brede queries die de database belasten
11. GraphQL Playground beschikbaar maken op `/api/graphql` (alleen in development of met API key)
12. Persisted queries ondersteuning voor productie-performance

### Fase 3: API key management (4-6 uur)
13. Nieuwe collectie: `api-keys` met velden: naam, key (gegenereerd), scopes (array van collectie + read/write), rate limit tier, actief/inactief
14. API key authenticatie middleware: key uit `Authorization: Bearer <key>` header lezen, valideren, scopes controleren
15. Rate limiting per key: in-memory of Redis-based counter, configureerbare limieten per tier
16. Admin UI: API keys aanmaken, scopes instellen, key tonen (eenmalig bij aanmaak), intrekken
17. Gebruiksstatistieken per key: aantal requests, laatste gebruik, populairste endpoints

### Fase 4: Webhooks (3-5 uur)
18. Webhook configuratie in admin: URL, geheime sleutel (voor signature verificatie), trigger events (create/update/delete per collectie)
19. Payload afterChange/afterDelete hooks die webhook dispatchen
20. Async webhook delivery: queue-based met retry (3 pogingen met exponential backoff)
21. Webhook log: per webhook de laatste 50 deliveries met status code, response time, eventuele foutmelding
22. Signature: HMAC-SHA256 van de payload met de geheime sleutel in `X-Webhook-Signature` header

### Fase 5: Documentatie (3-5 uur)
23. OpenAPI/Swagger spec automatisch genereren uit Payload collectie-definities
24. Swagger UI hosten op `/api/docs` met interactieve try-it-out functionaliteit
25. Getting started guide: authenticatie, eerste request, paginatie, filtering
26. Code voorbeelden in JavaScript, Python, PHP en cURL
27. Changelog: bij elke API wijziging documenteren wat er veranderd is
