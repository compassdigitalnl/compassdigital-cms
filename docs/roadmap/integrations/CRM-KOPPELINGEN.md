# CRM Koppelingen

**Status:** Roadmap
**Prioriteit:** Middel
**Geschatte effort:** 15-25 uur per koppeling (met AI)

---

## Huidige situatie

Het platform heeft klantgegevens in de ecommerce branch (accounts, orders, contactformulieren) en een email marketing module. Er is echter geen koppeling met externe CRM-systemen. Klantinteracties op de website (formulieren, orders, chatbot gesprekken) worden niet automatisch vastgelegd in het CRM van de klant.

Verkoopteams van klanten missen hierdoor inzicht in het online gedrag van hun leads en klanten. Handmatig overzetten van leads kost tijd en leidt tot gemiste kansen.

---

## Wat het doet

Integraties met de populairste CRM-systemen:

- **HubSpot** — Populair bij MKB, sterke marketing automation
- **Salesforce** — Enterprise standaard, uitgebreid ecosysteem
- **Pipedrive** — Gebruiksvriendelijk, populair bij sales teams

Per koppeling:
- **Contact sync** — Website bezoekers en klanten automatisch als contact in CRM
- **Deal/opportunity tracking** — Orders en offertes als deals in CRM
- **Lead scoring** — Website activiteit meewegen in lead score
- **Formulier integratie** — Contactformulieren direct als lead in CRM
- **Activiteit logging** — Pageviews, downloads, chatbot interacties loggen
- **Segmentatie** — CRM segmenten gebruiken voor website personalisatie

---

## Waarom waardevol

- **Sales efficientie** — Verkoopteam ziet alle klantinteracties op een plek
- **Geen gemiste leads** — Elk formulier en elke interactie wordt automatisch vastgelegd
- **Betere opvolging** — Lead scoring helpt prioriteren welke leads het warmst zijn
- **360-graden klantbeeld** — Online en offline interacties gecombineerd
- **Marketing alignment** — Website data verrijkt marketing campagnes
- **Rapportage** — ROI van website meten in termen van deals en omzet

---

## Implementatiestappen

### Fase 1: CRM abstractielaag (4-6 uur, eenmalig)
1. Generieke CRM connector interface (contact, deal, activity, lead)
2. Event systeem: website events die CRM sync triggeren
3. Credential opslag per tenant (OAuth tokens)
4. Field mapping configuratie UI
5. Sync queue met retry en error logging

### Fase 2: HubSpot integratie — pilot (6-8 uur)
6. HubSpot OAuth2 authenticatie flow
7. Contact aanmaken/updaten bij registratie of checkout
8. Deal aanmaken bij nieuwe order
9. Formulier submissions als leads doorsturen
10. Activiteit timeline: pageviews, product views, cart events
11. HubSpot lists gebruiken voor website personalisatie
12. Lifecycle stage mapping (subscriber → lead → customer)

### Fase 3: Salesforce integratie (8-10 uur)
13. Salesforce OAuth2 met Connected App
14. Lead en Contact object sync
15. Opportunity aanmaken bij order
16. Custom object mapping voor productspecifieke data
17. Salesforce Flow triggers bij website events
18. Bulk sync voor bestaande klantdata

### Fase 4: Pipedrive integratie (5-7 uur)
19. Pipedrive API authenticatie
20. Person en Organization sync
21. Deal aanmaken in juiste pipeline en stage
22. Activity logging (notities, e-mails, website events)
23. Webhook ontvangen voor deal stage wijzigingen
24. Admin UI voor pipeline en stage mapping configuratie
