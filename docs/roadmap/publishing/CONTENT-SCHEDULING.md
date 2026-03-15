# Content Planning & Scheduling

**Status:** Roadmap
**Prioriteit:** Middel
**Geschatte effort:** 12-18 uur (met AI)

---

## Huidige situatie

Content wordt momenteel handmatig gepubliceerd door de status te wijzigen naar "gepubliceerd" in Payload CMS. Er is geen mogelijkheid om publicatie vooruit te plannen, geen redactiekalender en geen formeel goedkeuringsproces. Redacteuren moeten op het juiste moment inloggen om content live te zetten. Bij meerdere auteurs is er geen overzicht van wie wat wanneer publiceert.

## Wat het doet

Een compleet content planning en scheduling systeem voor redactieteams:

- **Redactiekalender** — Visueel overzicht van geplande, in-review en gepubliceerde content
- **Publicatie planning** — Datum en tijd instellen waarop content automatisch live gaat
- **Embargo's** — Content klaarzetten die pas op een specifiek moment zichtbaar wordt
- **Workflow** — Concept, review, goedkeuring en publicatie als formele stappen
- **Depublicatie** — Automatisch content offline halen na een einddatum
- **Notificaties** — Alerts voor reviewers, goedkeurders en bij publicatie

## Waarom waardevol

- **Efficientie** — Redacteuren kunnen content vooruit plannen zonder op het publicatiemoment aanwezig te zijn
- **Kwaliteit** — Formeel reviewproces voorkomt fouten en incomplete publicaties
- **Overzicht** — Kalenderweergave geeft inzicht in contentplanning voor het hele team
- **Embargo's** — Essentieel voor persberichten, productlanceringen en geplande aankondigingen
- **Multi-tenant** — Elke tenant kan eigen workflows en rollen configureren
- **Compliance** — Audit trail van wie wat wanneer heeft goedgekeurd

## Implementatiestappen

1. **Scheduling engine** (3-4 uur)
   - `publishDate` en `unpublishDate` velden toevoegen aan content collections
   - Cron job (of Payload CMS hook) die elke minuut checkt op geplande publicaties
   - Automatisch status wijzigen van "gepland" naar "gepubliceerd" op het juiste moment
   - Automatisch depubliceren na einddatum
   - Tijdzone-ondersteuning per tenant

2. **Workflow systeem** (3-5 uur)
   - Workflow statussen: concept, in-review, goedgekeurd, gepland, gepubliceerd, gearchiveerd
   - Rollen: auteur, reviewer, eindredacteur, beheerder
   - Overgangsregels (wie mag van welke status naar welke)
   - Verplichte velden per status (bijv. afbeelding verplicht bij "goedgekeurd")
   - Opmerkingen/feedback bij statuswijzigingen

3. **Redactiekalender UI** (3-5 uur)
   - Maand-, week- en dagweergave
   - Drag-and-drop om publicatiedatum te wijzigen
   - Kleurcodering per status en contenttype
   - Filters op auteur, categorie, status
   - Integratie in Payload CMS admin (custom view)

4. **Notificatiesysteem** (2-3 uur)
   - Email notificaties bij statuswijzigingen
   - In-app notificaties in de admin omgeving
   - Configureerbaar per gebruiker (welke notificaties ontvangen)
   - Dagelijkse samenvatting van geplande publicaties

5. **Embargo functionaliteit** (1-2 uur)
   - Embargo-vlag op content items
   - Content is niet zichtbaar via API/frontend tot embargo verloopt
   - Preview-link voor geautoriseerde gebruikers (bijv. persredactie)
   - Automatische opheffing op ingesteld tijdstip
