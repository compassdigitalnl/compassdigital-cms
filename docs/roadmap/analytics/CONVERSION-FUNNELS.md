# Conversion Funnels

**Status:** Roadmap
**Prioriteit:** Hoog
**Geschatte inspanning:** 20-30 uur (met AI-assistentie)

---

## Huidige situatie

Er is een basis Google Analytics integratie en een event tracking API (`/api/track`) aanwezig. Events worden gelogd (page views, add-to-cart, checkout stappen), maar er is geen visuele weergave van de klantreis. Er zijn geen funnel-dashboards, geen drop-off analyses en geen inzicht in waar klanten afhaken in het bestelproces.

## Wat het doet

Visuele conversion funnels die de volledige klantreis in kaart brengen:

- **Standaard e-commerce funnel:** Homepage → Categorie/Zoeken → Productpagina → Winkelwagen → Checkout → Bestelling → Betaling voltooid
- **Drop-off analyse:** Per stap het percentage bezoekers dat afhaakt, met vergelijking over tijdsperiodes
- **Bottleneck identificatie:** Automatische detectie van stappen met ongebruikelijk hoge uitval
- **Segmentatie:** Funnels filteren op apparaat (mobiel/desktop), verkeersbron, klantsegment (nieuw/terugkerend)
- **A/B test integratie:** Funnel prestaties koppelen aan lopende A/B tests

Het dashboard toont per stap het aantal bezoekers, het conversiepercentage naar de volgende stap, en de totale funnel conversie. Visueel weergegeven als een trechterdiagram met absolute en relatieve cijfers.

## Waarom waardevol

- **Directe omzetimpact:** Inzicht in waar klanten afhaken leidt tot gerichte verbeteringen die de conversie verhogen. Een verbetering van 1% in checkout-conversie kan duizenden euro's per maand opleveren
- **Onderbouwde beslissingen:** Klanten kunnen op basis van data beslissen welke pagina's prioriteit krijgen voor optimalisatie, in plaats van op gevoel
- **Concurrentievoordeel:** De meeste MKB-webshops hebben geen funnel-analyse — dit is een duidelijke meerwaarde ten opzichte van standaard Shopify/WooCommerce
- **Klantretentie voor het platform:** E-commerce klanten die inzicht krijgen in hun conversie blijven langer op het platform

## Implementatiestappen

### Fase 1: Event-tracking uitbreiden (6-8 uur)
1. Bestaande `/api/track` endpoint uitbreiden met gestandaardiseerde funnel-events (`funnel_step_viewed`, `funnel_step_completed`)
2. Funnel-stappen definieerbaar maken per branch/klant in de ecommerce-settings collectie
3. Server-side event opslag in een `analytics_events` tabel (of bestaande tabel uitbreiden) met sessie-ID, stap, timestamp, metadata
4. Client-side tracking hooks bouwen die automatisch funnel-events versturen bij paginabezoek en acties

### Fase 2: Aggregatie en berekeningen (5-8 uur)
5. Cron job of on-demand aggregatie die dagelijks funnel-statistieken berekent per stap
6. Drop-off percentages berekenen: `(bezoekers_stap_N - bezoekers_stap_N+1) / bezoekers_stap_N * 100`
7. Vergelijkingslogica: huidige periode vs. vorige periode, trendberekening
8. Segmentatie-filters implementeren (apparaat, bron, klanttype)

### Fase 3: Dashboard UI (8-12 uur)
9. React component voor trechterdiagram met animaties en hover-details
10. Tijdsperiode selector (vandaag, 7 dagen, 30 dagen, aangepast)
11. Vergelijkingsmodus: twee periodes naast elkaar tonen
12. Bottleneck-alerts: visuele markering bij stappen met >X% hogere uitval dan gemiddeld
13. Exportfunctie: funnel-data als CSV/PDF downloaden

### Fase 4: Configuratie en multi-tenant (2-4 uur)
14. Admin UI voor het definiëren van custom funnels per klant (niet alleen de standaard e-commerce funnel)
15. Funnel-templates per branche (e-commerce, publishing, horeca) met voorgedefinieerde stappen
16. Rechten: alleen admins en eigenaren kunnen funnel-data inzien
