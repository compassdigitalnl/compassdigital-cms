# Social Commerce Integraties

**Status:** Roadmap
**Prioriteit:** Middel
**Geschatte effort:** 15-25 uur (met AI)

---

## Huidige situatie

Het platform heeft een volledig productcatalogus systeem met afbeeldingen, prijzen, categorieën en varianten. Er is echter geen koppeling met social media platformen voor het verkopen van producten. Klanten die hun producten willen tonen op Instagram, Facebook of Google Shopping moeten dit handmatig of via losse tools regelen.

Product feeds worden niet automatisch gegenereerd, en orders die via social kanalen binnenkomen worden niet automatisch verwerkt in het CMS.

---

## Wat het doet

Integraties met de belangrijkste social commerce kanalen:

- **Instagram Shopping** — Producten taggen in posts en stories, in-app checkout
- **Facebook Shop** — Productcatalogus in Facebook, shop tab op bedrijfspagina
- **Google Shopping** — Product listings in Google zoekresultaten en Shopping tab

Per kanaal:
- **Product feed generatie** — Automatische XML/JSON feed met alle productgegevens
- **Catalogus sync** — Producten, prijzen, voorraad automatisch bijwerken
- **Order import** — Orders uit social kanalen importeren in CMS
- **Performance tracking** — Verkopen per kanaal meten en rapporteren
- **Content koppeling** — Producten koppelen aan social media content

---

## Waarom waardevol

- **Groter bereik** — Producten tonen waar klanten al zijn (social media, Google)
- **Extra verkoopkanaal** — Omzet genereren buiten de eigen webshop
- **Lagere acquisitiekosten** — Organisch bereik via social commerce
- **Gemak** — Een keer product invoeren, overal verkopen
- **Actuele data** — Prijzen en voorraad altijd gesynchroniseerd
- **Meetbaar** — Per kanaal zien wat het oplevert

---

## Implementatiestappen

### Fase 1: Product feed engine (5-8 uur, eenmalig)
1. Product feed generator bouwen (ondersteunt XML, JSON, CSV formaten)
2. Feed template systeem (Google Merchant, Facebook Catalog, custom)
3. Automatische feed regeneratie bij product wijzigingen
4. Feed URL per tenant met authenticatie
5. Feed validatie en error rapportage
6. Configuratie UI: welke producten in welke feed, veld mapping

### Fase 2: Google Shopping / Merchant Center (5-7 uur)
7. Google Merchant Center API authenticatie
8. Product feed in Google Shopping formaat (titel, prijs, beschikbaarheid, GTIN, afbeeldingen)
9. Automatische feed upload naar Merchant Center
10. Product status monitoring (goedgekeurd, afgekeurd, waarschuwing)
11. Google Shopping performance data ophalen
12. Structured data (schema.org) op productpagina's voor gratis listings

### Fase 3: Facebook & Instagram Shopping (5-8 uur)
13. Facebook Business API authenticatie (Commerce Manager)
14. Productcatalogus aanmaken en synchroniseren
15. Voorraad en prijs updates via batch API
16. Instagram Shopping product tags koppelen
17. Facebook Shop configuratie per tenant
18. Order import vanuit Facebook/Instagram checkout
19. Pixel integratie voor conversion tracking

### Fase 4: Analytics & optimalisatie (3-4 uur)
20. Verkoop per kanaal dashboard (webshop vs Google vs Facebook vs Instagram)
21. Product performance per kanaal (views, clicks, conversies)
22. Feed optimalisatie suggesties (ontbrekende velden, kwaliteitsscore)
23. A/B test ondersteuning voor producttitels en afbeeldingen
24. Geautomatiseerde rapportage per e-mail
