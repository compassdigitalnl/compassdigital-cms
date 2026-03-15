# AI-Verrijkte Zoekmachine

**Status:** Roadmap (toekomstig)
**Prioriteit:** Middel
**Datum:** Maart 2026

---

## Huidige Situatie

Meilisearch is al volledig geintegreerd als zoekmachine voor producten, met indexering, facetten en typo-tolerantie. De zoekfunctie werkt goed op exacte keywords, maar begrijpt geen intentie of context. Klanten die zoeken op "iets voor gevoelige huid" of "rode schoenen onder 50 euro" krijgen geen relevante resultaten.

## Wat het doet

- **Semantic search** — Begrijp de intentie achter zoekopdrachten, niet alleen exacte keywords (via embeddings)
- **"Bedoelde je...?" suggesties** — Intelligente correcties en alternatieven bij geen of weinig resultaten
- **Natural language queries** — Verwerk zoekopdrachten als "rode schoenen onder 50 euro" of "shampoo zonder sulfaten"
- **Zoeksynoniemen via AI** — Automatisch synoniemen en gerelateerde termen ontdekken en toevoegen aan Meilisearch
- **Contextbewuste ranking** — Resultaten rangschikken op basis van klantprofiel en seizoen

## Waarom waardevol

- **Hogere zoek-conversie** — Klanten vinden wat ze bedoelen, ook als ze niet de exacte productnaam kennen
- **Minder "geen resultaten" pagina's** — Elke mislukte zoekopdracht is een potentiele verloren verkoop
- **B2B voordeel** — Vakjargon en artikelnummers worden automatisch gekoppeld aan producten
- **Bouwt voort op bestaande infra** — Meilisearch en OpenAI/Groq zijn al geintegreerd, dit is een logische uitbreiding
- **Concurrentievoordeel** — De meeste MKB-webshops hebben geen semantic search

## Geschatte Inspanning

**15-25 uur** (met AI-assistentie)

## Implementatiestappen

1. **Embedding-generatie** — Genereer vectorrepresentaties van alle producten (naam, beschrijving, categorie, tags) via OpenAI embeddings API
2. **Vector opslag** — Sla embeddings op in PostgreSQL met pgvector extensie, of als aparte vector index naast Meilisearch
3. **Query-analyse** — Middleware die inkomende zoekopdrachten analyseert: is het een keyword-zoekopdracht of natural language? Extraheer filters (prijs, kleur, etc.)
4. **Hybrid search** — Combineer Meilisearch keyword-resultaten met vector-similarity scores voor optimale ranking
5. **"Bedoelde je...?" engine** — Bij weinig resultaten: genereer alternatieven via embedding-similarity en toon suggesties
6. **Synoniemen-pipeline** — Cron job die met AI synoniemen en gerelateerde termen genereert per productcategorie, en deze injecteert in Meilisearch synonyms
7. **Natural language parser** — Vertaal queries als "onder 50 euro" naar Meilisearch filters (`price < 50`)
8. **Zoekanalytics** — Log zoekopdrachten, klikresultaten en "geen resultaten" queries voor continue verbetering
9. **Feedback loop** — Gebruik klik-data om ranking te verbeteren (klant klikte op resultaat 5 → dat resultaat moet hoger)
10. **Admin inzichten** — Dashboard met top zoekopdrachten, populaire filters, en queries zonder resultaten
