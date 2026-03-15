# AI Review Moderatie & Analyse

**Status:** Roadmap (toekomstig)
**Prioriteit:** Laag
**Datum:** Maart 2026

---

## Huidige Situatie

Er is nog geen product review systeem actief in het platform. Wanneer reviews worden toegevoegd, moet moderatie handmatig plaatsvinden. Dit schaalt niet bij groeiende aantallen reviews en mist inzichten die uit reviewteksten gehaald kunnen worden.

## Wat het doet

- **Automatische moderatie** — AI beoordeelt nieuwe reviews op taal, relevantie en beleid voordat ze gepubliceerd worden
- **Sentiment analyse** — Bepaal automatisch of een review positief, neutraal of negatief is, en extraheer specifieke onderwerpen (levering, kwaliteit, prijs)
- **Fake review detectie** — Herken verdachte patronen: herhaalde tekst, onnatuurlijk taalgebruik, bulk-reviews vanaf zelfde IP/account
- **Auto-approve/flag workflow** — Reviews met hoge betrouwbaarheid automatisch goedkeuren, verdachte reviews flaggen voor handmatige controle
- **Review samenvatting** — Genereer per product een AI-samenvatting van alle reviews ("Klanten waarderen de kwaliteit, maar vinden de levertijd te lang")

## Waarom waardevol

- **Tijdsbesparing** — Handmatige moderatie kost uren per week bij honderden reviews; AI doet het in seconden
- **Kwaliteitsgarantie** — Voorkom spam, beledigingen en fake reviews zonder alles handmatig te checken
- **Klantinzichten** — Sentiment analyse per product/categorie geeft direct inzicht in klanttevredenheid
- **Conversie-verhogend** — Betrouwbare reviews verhogen koopintentie; een AI-samenvatting helpt klanten sneller beslissen
- **Schaalbaar** — Werkt voor elke tenant ongeacht het volume reviews

## Geschatte Inspanning

**10-15 uur** (met AI-assistentie)

## Implementatiestappen

1. **Review collectie** — Payload CMS collectie `product-reviews` met velden: klant, product, rating, tekst, status (pending/approved/rejected/flagged)
2. **Moderatie pipeline** — Bij nieuwe review: stuur tekst naar AI (Groq/OpenAI) voor analyse op beleid, taal en relevantie
3. **Sentiment analyse** — Classificeer review als positief/neutraal/negatief + extraheer topics (kwaliteit, prijs, levering, service)
4. **Fake detectie regels** — Check op: duplicaat-tekst, onnatuurlijk taalgebruik, verdacht account-gedrag (nieuwe account + direct review), bulk-patronen
5. **Workflow engine** — Configureerbare regels per tenant: score > 0.8 = auto-approve, score < 0.4 = auto-reject, daartussen = flag voor moderator
6. **Moderatie dashboard** — Admin pagina met geflagde reviews, bulk-approve/reject, en filteropties per product/status/sentiment
7. **Review samenvatting** — Cron job die per product een AI-samenvatting genereert van alle goedgekeurde reviews, getoond op de productpagina
8. **Frontend componenten** — Review-formulier, sterren-weergave, review-lijst met sentiment-indicatie en AI-samenvatting
9. **Notificaties** — Email naar klant bij goedkeuring, email naar moderator bij geflagde review
10. **Analytics** — Overzicht per tenant: gemiddelde rating, sentiment-trend, moderatie-statistieken (auto-approved vs. flagged vs. rejected)
