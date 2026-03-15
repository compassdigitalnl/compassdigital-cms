# Content Goedkeuringsworkflows

**Status:** Roadmap
**Prioriteit:** Middel
**Geschatte inspanning:** 15-20 uur (met AI-assistentie)

---

## Huidige situatie

Payload CMS heeft een ingebouwd draft/published systeem: content kan als concept opgeslagen worden en later gepubliceerd. Er is echter geen goedkeuringsproces tussen concept en publicatie. Elke gebruiker met toegang tot een collectie kan direct publiceren. Dit betekent:

- Geen review-stap voordat content live gaat
- Geen scheiding tussen auteur (schrijft) en redacteur (keurt goed)
- Geen audit trail van wie wat heeft goedgekeurd
- Geen notificaties bij content die klaarstaat voor review
- Voor publishing-klanten (tijdschriften, blogs) is dit een gemis: meerdere auteurs die zonder redactionele controle publiceren is een risico

## Wat het doet

Een configureerbaar workflow-systeem dat content door meerdere stadia laat gaan voordat het gepubliceerd wordt:

- **Workflow stadia:** Concept → In Review → Goedgekeurd → Gepubliceerd (configureerbaar per collectie)
- **Rollen:**
  - **Auteur:** Kan content aanmaken en bewerken, kan indienen voor review, kan niet zelf publiceren
  - **Redacteur:** Kan content reviewen, feedback geven, goedkeuren of afwijzen
  - **Hoofdredacteur:** Kan content definitief goedkeuren en publiceren, kan workflow-stadia overslaan
- **Review opmerkingen:** Bij elke statuswijziging een opmerking toevoegen (bijv. "Titel aanpassen" bij afwijzing)
- **Email notificaties:** Automatisch bericht bij statuswijziging: auteur krijgt mail bij afwijzing, redacteur bij nieuwe inzending
- **Audit trail:** Volledige geschiedenis van statuswijzigingen met wie, wanneer en waarom
- **Geplande publicatie:** Goedgekeurde content inplannen voor publicatie op een specifiek tijdstip

## Waarom waardevol

- **Kwaliteitsborging:** Voorkomt dat ongecontroleerde of onvolledige content live gaat, vooral belangrijk voor klanten met meerdere auteurs
- **Professioneel redactieproces:** Publishing-klanten (tijdschriften, nieuwssites) hebben een redactionele workflow nodig — dit is een standaard verwachting
- **Verantwoordelijkheid:** Duidelijk wie wat heeft geschreven, gereviewd en goedgekeurd
- **Minder fouten:** Een extra paar ogen voor publicatie vangt spelfouten, onjuistheden en stijlfouten op
- **Geschikt voor teams:** Maakt het platform bruikbaar voor organisaties met content-teams van 3+ personen

## Implementatiestappen

### Fase 1: Workflow engine (5-7 uur)
1. Nieuwe velden toevoegen aan content-collecties: `workflowStatus` (enum: draft, in_review, approved, published, rejected), `workflowAssignee` (relatie naar users)
2. Migratie schrijven voor de nieuwe kolommen
3. Workflow configuratie per collectie in admin: welke stadia actief zijn, of workflow verplicht is of optioneel
4. Payload hooks: `beforeChange` hook die workflow-regels afdwingt (bijv. auteur mag status niet naar "published" zetten)
5. Status-transitie regels definieerbaar: welke rol mag van welke status naar welke status verplaatsen
6. Workflow history collectie: `workflow_events` tabel met content ID, oude status, nieuwe status, gebruiker, timestamp, opmerking

### Fase 2: Review interface (4-6 uur)
7. Review opmerkingen component: bij statuswijziging een tekstveld tonen voor toelichting
8. Content-detail pagina uitbreiden met workflow-balk: huidige status, beschikbare acties (indienen, goedkeuren, afwijzen, publiceren)
9. Inline opmerkingen (optioneel): bij specifieke velden of tekstsecties een opmerking plaatsen
10. Review dashboard: overzicht van content die in review staat, gesorteerd op urgentie/datum
11. "Mijn taken" widget: voor redacteuren een lijst van content die op hun review wacht

### Fase 3: Notificaties (3-4 uur)
12. Email templates voor workflow-events: "Nieuw artikel ingediend voor review", "Artikel goedgekeurd", "Artikel afgewezen met opmerkingen"
13. Notificatie-voorkeuren per gebruiker: welke workflow-events een email genereren
14. In-app notificaties: badge op het menu-item met aantal openstaande reviews
15. Optioneel: Slack/Teams webhook bij statuswijzigingen (voor teams die daar werken)

### Fase 4: Geplande publicatie (2-3 uur)
16. Veld `scheduledPublishDate` toevoegen aan content-collecties
17. Cron job die elke minuut controleert of er goedgekeurde content is waarvan de publicatiedatum verstreken is
18. Bij geplande publicatie: status automatisch naar "published" zetten en `_status` naar "published" voor Payload
19. Admin UI: datum/tijd picker bij de "Goedkeuren" actie met optie "Nu publiceren" of "Inplannen"

### Fase 5: Configuratie en multi-tenant (2-3 uur)
20. Per tenant configureerbaar: workflow aan/uit, welke collecties een workflow hebben, welke stadia
21. Standaard workflow-templates: "Eenvoudig" (concept → review → gepubliceerd) en "Uitgebreid" (concept → review → hoofdredactie → gepubliceerd)
22. Rechten afstemmen op workflow: gebruikers met auteur-rol zien de "Publiceer" knop niet meer
