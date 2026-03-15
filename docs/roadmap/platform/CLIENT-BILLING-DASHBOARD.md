# Client Billing Dashboard

**Status:** Roadmap
**Prioriteit:** Hoog
**Geschatte effort:** 20-30 uur (met AI)

---

## Huidige situatie

Er is al een client dashboard binnen het platform waar klanten hun site kunnen beheren. Facturatie en abonnementsbeheer gebeurt echter buiten het platform om — handmatig of via losse tooling. Klanten hebben geen inzicht in hun factuurhistorie, verbruik of abonnementsdetails vanuit het CMS.

Het platform heeft al multi-tenant management, feature flags en provisioning. Wat ontbreekt is een geintegreerd billing dashboard waar klanten zelf hun financiele zaken kunnen inzien en beheren.

---

## Wat het doet

Een klant-facing billing dashboard geintegreerd in het bestaande client dashboard:

- **Factuurhistorie** — Overzicht van alle facturen met download (PDF)
- **Usage overzicht** — Verbruik van opslag, bandbreedte, API calls per maand
- **Plan details** — Huidig abonnement, features, limieten
- **Plan wijzigingen** — Upgraden, downgraden of opzeggen van abonnement
- **Betaalmethode beheer** — Creditcard, iDEAL, SEPA incasso toevoegen/wijzigen
- **Betalingsherinneringen** — Automatische notificaties bij openstaande facturen

---

## Waarom waardevol

- **Minder support tickets** — Klanten vinden zelf antwoorden op factuurvragen
- **Professionele uitstraling** — Volledig geintegreerde ervaring in plaats van losse systemen
- **Snellere betalingen** — Klanten kunnen direct betalen vanuit het dashboard
- **Self-service upgrades** — Klanten upgraden zelf, geen sales-interactie nodig
- **Transparantie** — Klanten zien precies waarvoor ze betalen
- **Compliance** — Gestructureerde factuurhistorie voor boekhouding

---

## Implementatiestappen

### Fase 1: Factuurhistorie & plan overzicht (6-8 uur)
1. Billing collection aanmaken (invoices, subscriptions, payment methods)
2. Factuur overzichtspagina in client dashboard
3. PDF factuur generatie met bedrijfsgegevens
4. Huidig plan weergave met feature overzicht
5. Factuurregel details (basis, extra's, kortingen)

### Fase 2: Betalingsintegratie (6-10 uur)
6. Mollie integratie voor iDEAL, creditcard, SEPA incasso
7. Betaalmethode toevoegen en wijzigen
8. Automatische incasso instellen
9. Betalingsstatus tracking (betaald, openstaand, mislukt)
10. Retry logica voor mislukte betalingen

### Fase 3: Plan management (4-6 uur)
11. Plan vergelijkingspagina
12. Upgrade flow met pro-rata berekening
13. Downgrade flow met feature impact waarschuwing
14. Opzegflow met retentie-aanbiedingen
15. Plan wijziging bevestiging per e-mail

### Fase 4: Usage tracking & notificaties (4-6 uur)
16. Verbruiksmeters per resource (opslag, bandbreedte, producten, orders)
17. Usage grafieken per maand
18. Limiet waarschuwingen (80%, 90%, 100% van plan)
19. Betalingsherinnering e-mails (3 dagen voor, op de dag, 3 dagen na)
20. Overzichts-e-mail met maandelijks verbruik
