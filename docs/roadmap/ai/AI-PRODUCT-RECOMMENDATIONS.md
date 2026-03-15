# AI Productaanbevelingen

**Status:** Roadmap (toekomstig)
**Prioriteit:** Hoog
**Datum:** Maart 2026

---

## Huidige Situatie

Het e-commerce systeem toont producten op basis van categorie en handmatige "gerelateerde producten" koppelingen. Er is geen intelligente, geautomatiseerde aanbevelingslogica. Klanten moeten zelf zoeken naar relevante producten, wat leidt tot gemiste cross-sell en upsell kansen.

## Wat het doet

- **"Klanten die dit kochten, kochten ook..."** — Collaborative filtering op basis van orderhistorie
- **"Aanbevolen voor jou"** — Gepersonaliseerde suggesties op basis van browse- en koopgedrag per klant
- **"Vaak samen gekocht"** — Productbundeling-suggesties op de productpagina en in de winkelwagen
- **Trending producten** — Automatisch bijgewerkte lijsten op basis van recente populariteit
- Twee algoritmen: collaborative filtering (gedrag van vergelijkbare klanten) + content-based (producteigenschappen zoals categorie, prijs, merk)

## Waarom waardevol

- **Direct omzet-verhogend** — Aanbevelingen verhogen gemiddelde orderwaarde met 10-30% in de e-commerce
- **Hogere conversie** — Klanten vinden sneller wat ze zoeken of ontdekken producten die ze anders gemist hadden
- **Minder handwerk** — Geen handmatige "gerelateerde producten" meer nodig per product
- **B2B voordeel** — Herhalingsbestellingen worden eenvoudiger door relevante suggesties op basis van bestelhistorie
- **Schaalt per tenant** — Elk tenant bouwt automatisch een eigen aanbevelingsmodel op

## Geschatte Inspanning

**20-30 uur** (met AI-assistentie)

## Implementatiestappen

1. **Data-laag opzetten** — Event tracking voor productweergaven, winkelwagen-toevoegingen en aankopen (PostgreSQL tabel `product_events`)
2. **Collaborative filtering engine** — Algoritme dat kooppatronen analyseert en vergelijkbare klantprofielen matcht (Python microservice of Node.js met ml-libraries)
3. **Content-based filtering** — Productgelijkenis berekenen op basis van categorie, merk, prijsklasse en tags via vectorrepresentatie
4. **Hybrid scorer** — Combineer collaborative + content-based scores met configureerbare weging per tenant
5. **API endpoints** — `/api/recommendations/product/:id` (gerelateerd), `/api/recommendations/user/:id` (persoonlijk), `/api/recommendations/trending`
6. **Frontend componenten** — `ProductRecommendations` component met varianten: "Klanten kochten ook", "Aanbevolen voor jou", "Trending"
7. **Winkelwagen-integratie** — "Vaak samen gekocht" suggesties in de cart sidebar
8. **Cron job** — Nachtelijke herberekening van aanbevelingsmodellen per tenant
9. **A/B testing** — Meet conversie-impact van aanbevelingen vs. geen aanbevelingen
10. **Admin dashboard** — Inzicht in welke aanbevelingen het meest converteren, met override-mogelijkheid per product
