# Boekhoudkoppelingen

**Status:** Roadmap
**Prioriteit:** Hoog (veel gevraagd door MKB)
**Geschatte effort:** 20-30 uur per koppeling (met AI)

---

## Huidige situatie

Het platform genereert orders en facturen via de ecommerce branch, maar er is geen automatische koppeling met boekhoudsoftware. Klanten moeten facturen handmatig invoeren in hun boekhoudsysteem, wat tijdrovend en foutgevoelig is.

De meeste MKB-klanten in Nederland gebruiken boekhoudsoftware zoals Exact Online, Moneybird, e-Boekhouden of Twinfield. Een directe koppeling is een van de meest gevraagde features door bestaande en potentiele klanten.

---

## Wat het doet

Automatische integraties met populaire Nederlandse boekhoudsoftware:

- **Exact Online** — Marktleider MKB boekhouden, vooral bij accountants
- **Twinfield (Wolters Kluwer)** — Veel gebruikt bij grotere MKB en accountantskantoren
- **Moneybird** — Populair bij ZZP en klein MKB, moderne API
- **e-Boekhouden** — Budgetvriendelijk, groot marktaandeel klein MKB

Per koppeling:
- **Factuur sync** — Automatisch facturen aanmaken in boekhoudsoftware bij nieuwe order
- **Klant sync** — Klantgegevens synchroniseren (debiteuren)
- **BTW verwerking** — Correcte BTW codes en tarieven meesturen
- **Betaalstatus sync** — Betalingsstatussen terugkoppelen
- **Grootboekrekeningen** — Omzet verdelen over juiste grootboekrekeningen

---

## Waarom waardevol

- **Tijdsbesparing** — Geen handmatige factuurinvoer meer, uren per week bespaard
- **Foutreductie** — Geen typefouten, geen gemiste facturen
- **Real-time inzicht** — Boekhouding is altijd up-to-date
- **MKB verwachting** — Nederlandse MKB klanten verwachten dit als standaard
- **Concurrentievoordeel** — Veel concurrerende platforms bieden dit niet native
- **Accountant-vriendelijk** — Accountants kunnen direct in hun eigen systeem werken

---

## Implementatiestappen

### Fase 1: Abstractielaag (5-8 uur, eenmalig)
1. Generieke accounting integration interface definiëren
2. Credential opslag per tenant (OAuth tokens, API keys)
3. Sync queue systeem (retry bij failures, logging)
4. Mapping configuratie (grootboekrekeningen, BTW codes per tenant)
5. Sync status dashboard in admin panel

### Fase 2: Moneybird koppeling — pilot (8-10 uur)
6. Moneybird OAuth2 flow implementeren
7. Contact/debiteur sync (klant aanmaken/updaten)
8. Factuur aanmaken bij order bevestiging
9. Factuurregel mapping (producten, verzendkosten, kortingen)
10. BTW tarief mapping (hoog, laag, vrijgesteld, verlegd)
11. Betaalstatus webhook ontvangen
12. Credit nota bij retour/annulering

### Fase 3: Exact Online koppeling (10-12 uur)
13. Exact Online OAuth2 flow (complexere authenticatie)
14. Divisie selectie (Exact Online werkt met administraties)
15. Debiteur sync met relatiecodes
16. Verkoopfactuur aanmaken via API
17. Grootboekrekening mapping per productcategorie
18. Betaalstatus synchronisatie
19. XML/JSON response handling en error recovery

### Fase 4: Overige koppelingen (per koppeling 8-10 uur)
20. Twinfield koppeling (SOAP/REST API, sessie-authenticatie)
21. e-Boekhouden koppeling (SOAP API)
22. Configuratie UI per koppeling in tenant admin
23. Test mode per koppeling (dry-run zonder daadwerkelijke sync)
24. Documentatie en troubleshooting guide per provider
