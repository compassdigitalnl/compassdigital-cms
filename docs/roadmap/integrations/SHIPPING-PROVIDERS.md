# Shipping Provider Integraties

**Status:** Roadmap
**Prioriteit:** Hoog
**Geschatte effort:** 15-20 uur per provider (met AI)

---

## Huidige situatie

Het platform heeft al een carrier webhook mechanisme voor verzendintegraties. Orders worden verwerkt via de ecommerce branch met verzendopties en tracking mogelijkheden. Er is echter nog geen directe integratie met specifieke verzendproviders voor label generatie, tracking updates en retourafhandeling.

Klanten moeten momenteel handmatig verzendlabels aanmaken in de portals van hun verzendprovider en tracking codes handmatig invoeren in het CMS.

---

## Wat het doet

Directe integraties met de belangrijkste verzendproviders in de Benelux:

- **PostNL** — Marktleider pakketbezorging Nederland
- **DHL Parcel** — Tweede grote speler, sterk in Duitsland/Europa
- **DPD** — Sterke positie in B2B verzending
- **UPS** — Internationaal, vooral voor grotere pakketten
- **Sendcloud** — Aggregator die meerdere vervoerders bundelt

Per provider:
- **Label generatie** — Verzendlabel aanmaken direct vanuit order overzicht
- **Tracking** — Real-time tracking updates ontvangen via webhooks
- **Retourlabels** — Retourlabel genereren en meesturen of op verzoek
- **Verzendopties** — Servicepunten, tijdvakken, avondlevering tonen in checkout
- **Tariefberekening** — Live verzendkosten berekenen op basis van gewicht/afmeting

---

## Waarom waardevol

- **Tijdsbesparing** — Labels genereren met een klik in plaats van apart portaal
- **Betere klantervaring** — Automatische tracking updates naar eindklant
- **Minder fouten** — Adresgegevens worden automatisch overgenomen
- **Flexibiliteit** — Klanten kiezen hun eigen verzendprovider(s)
- **Professioneel** — Track & trace pagina met eigen branding
- **Retourproces** — Gestroomlijnd retourproces verhoogt klanttevredenheid

---

## Implementatiestappen

### Fase 1: Shipping abstractielaag (5-7 uur, eenmalig)
1. Generieke shipping provider interface definiëren (createLabel, getTracking, createReturn)
2. Shipping provider configuratie per tenant (credentials, standaard opties)
3. Webhook endpoint voor tracking updates van providers
4. Verzendlabel opslag (PDF) gekoppeld aan orders
5. Shipping status model (label_created, in_transit, delivered, returned)

### Fase 2: Sendcloud integratie — pilot (6-8 uur)
6. Sendcloud API authenticatie (API key + secret)
7. Parcel aanmaken met ordergegevens
8. Label genereren en PDF opslaan
9. Servicepunt selectie in checkout (kaart integratie)
10. Tracking webhook ontvangen en order status updaten
11. Retourlabel aanmaken
12. Verzendmethoden ophalen voor checkout

### Fase 3: PostNL directe integratie (6-8 uur)
13. PostNL API authenticatie en sandbox omgeving
14. Barcode generatie en label aanmaken
15. Verzendopties: standaard, avondlevering, pakketpunt
16. Track & trace API polling of webhook
17. Retour aanmelden en label genereren
18. Adresvalidatie via PostNL API

### Fase 4: DHL, DPD, UPS (per provider 5-7 uur)
19. DHL Parcel API integratie (labels, tracking, servicepunten)
20. DPD API integratie (Predict, Pickup, Returns)
21. UPS API integratie (shipping, tracking, rates)
22. Multi-carrier checkout: klant kiest provider en methode
23. Bulk label generatie voor meerdere orders tegelijk
24. Verzendkostenregels configuratie (gratis vanaf bedrag, gewicht staffels)
