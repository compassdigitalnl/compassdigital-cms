# White-Label Reseller Programma

**Status:** Roadmap
**Prioriteit:** Middel
**Geschatte effort:** 25-35 uur (met AI)

---

## Huidige situatie

Het platform draait als multi-tenant systeem met per-client configuratie, feature flags (70+) en branche-templates. Elke tenant heeft een eigen database, domein en PM2 process. Er is echter geen mogelijkheid voor partners of bureaus om het platform onder eigen merk door te verkopen. Alle sites worden direct door CompassDigital beheerd.

Er is geen partner portal, geen commissie tracking, en geen white-label branding laag. Bureaus die het platform willen aanbieden aan hun klanten moeten dit via CompassDigital regelen.

---

## Wat het doet

Partners en bureaus kunnen het CMS-platform doorverkopen onder hun eigen merk:

- **White-label branding** — Eigen logo, kleuren, domeinnaam voor het admin panel
- **Partner portal** — Dashboard voor partners om hun klanten te beheren
- **Eigen pricing** — Partners bepalen hun eigen prijzen, marge bovenop platformkosten
- **Commissie tracking** — Automatisch bijhouden van partner-inkomsten en uitbetalingen
- **Klant management** — Partners kunnen zelf klant-sites aanmaken en configureren
- **Support tiers** — Partners leveren eerstelijns support, platform levert tweedelijns

---

## Waarom waardevol

- **Schaalbaar distributiemodel** — Groei via partners zonder eigen salesteam uit te breiden
- **Hogere marktpenetratie** — Bereik klanten via bestaande bureau-relaties
- **Recurring revenue** — Maandelijkse inkomsten per partner-klant
- **Lagere acquisitiekosten** — Partners doen de sales, platform levert de technologie
- **Sterkere lock-in** — Partners bouwen hun business op het platform

---

## Implementatiestappen

### Fase 1: Partner registratie & portal (8-10 uur)
1. Partner collection aanmaken in Payload CMS (bedrijfsgegevens, contract, commissie %)
2. Partner registratie en goedkeuringsflow
3. Partner dashboard met overzicht van eigen klanten
4. Gescheiden permissies: partner ziet alleen eigen klanten
5. Partner API keys voor programmatische toegang

### Fase 2: White-label branding (6-8 uur)
6. Branding configuratie per partner (logo, kleuren, favicon)
7. Custom login pagina per partner
8. E-mail templates met partner branding
9. Custom domein voor partner admin panel
10. "Powered by" toggle (optioneel verbergen)

### Fase 3: Pricing & commissie (6-10 uur)
11. Partner pricing model definiëren (marge of vaste commissie)
12. Eigen plannen en prijzen per partner
13. Commissie berekening en rapportage
14. Maandelijkse afrekeningsoverzichten
15. Uitbetalingsintegratie (bankoverschrijving of payment provider)

### Fase 4: Klant lifecycle management (5-7 uur)
16. Partner kan klant-sites aanmaken via eigen wizard
17. Partner kan feature flags per klant beheren
18. Support ticket routing (partner first, platform second)
19. Klant overdracht tussen partners
20. Partner performance analytics (churn, groei, revenue)
