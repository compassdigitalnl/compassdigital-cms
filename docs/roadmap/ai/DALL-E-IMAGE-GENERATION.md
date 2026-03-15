# DALL-E AI Beeldgeneratie

**Status:** Roadmap (toekomstig)
**Prioriteit:** Laag
**Datum:** Maart 2026

---

## Huidige Situatie

De `imageGenerator.ts` service bestaat al in `/src/features/ai/lib/services/imageGenerator.ts` en is gekoppeld aan OpenAI DALL-E 3. De technische basis is aanwezig maar de feature is nog niet actief als apart product.

## Wat het doet

- Genereer afbeeldingen op basis van tekstbeschrijvingen
- Gebruik: blog headers, productfoto's, social media visuals
- Model: DALL-E 3 (OpenAI)
- Kosten: ~€0,04-0,08 per afbeelding

## Besluit

DALL-E is voor de meeste klanten niet essentieel — zij uploaden eigen foto's. Daarom:

- **Niet opnemen** in de standaard AI Content add-on
- **Later** als aparte feature of opt-in binnen AI Content aanbieden
- Pas activeren wanneer er concrete klantvraag naar is

## Mogelijke Toekomstige Pricing

| Optie | Model |
|-------|-------|
| Pay-per-use | €0,10/afbeelding (marge op €0,04-0,08 inkoop) |
| Bundel in AI Content Pro+ | Inclusief 50 afbeeldingen/mo |
| Standalone add-on | €19/mo voor 100 afbeeldingen |

## Benodigde Stappen (wanneer opgepakt)

1. UI component voor beeldgeneratie in admin panel
2. Gallery/history van gegenereerde afbeeldingen
3. Usage tracking + limieten per tenant
4. Integratie met Media collectie (direct opslaan)
5. Prompt templates per branche (product, blog, social)
