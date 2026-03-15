# Revenue Dashboard

**Status:** Roadmap
**Prioriteit:** Hoog
**Geschatte inspanning:** 15-25 uur (met AI-assistentie)

---

## Huidige situatie

Omzetgegevens zitten verspreid in de `orders` collectie in Payload CMS. Er is geen centraal dashboard dat omzet, gemiddelde orderwaarde of klantwaarde visueel toont. Klanten moeten handmatig door bestellingen bladeren of externe tools (Google Analytics e-commerce, spreadsheets) gebruiken om omzetinzicht te krijgen. De email marketing module heeft eigen metrics, maar deze zijn niet gekoppeld aan omzetdata.

## Wat het doet

Een real-time omzet dashboard in het Payload CMS admin panel met:

- **Omzetoverzicht:** Dagelijks, wekelijks, maandelijks en jaarlijks omzetcijfer met trend-indicatoren (pijl omhoog/omlaag + percentage)
- **Gemiddelde orderwaarde (AOV):** Per periode, met trendlijn
- **Customer Lifetime Value (CLV):** Gemiddelde totale besteding per klant, gebaseerd op orderhistorie
- **Top producten:** Ranglijst van best verkopende producten op omzet en aantal
- **Top categorieën:** Omzet per productcategorie met percentage van totaal
- **Seizoenspatronen:** Maand-over-maand vergelijking die seizoenstrends zichtbaar maakt
- **Grafieken:** Lijngrafieken voor omzettrend, staafdiagrammen voor top producten/categorieën, vergelijkingsgrafieken periode-over-periode

## Waarom waardevol

- **Kernbehoefte van elke webshop:** Omzetinzicht is de #1 reden waarom webshop-eigenaren hun admin panel openen. Dit maakt het CMS onmisbaar
- **Geen externe tools nodig:** Klanten hoeven niet meer te schakelen tussen Google Analytics, hun boekhoudpakket en het CMS
- **Snellere besluitvorming:** Direct zien welke producten en categorieën presteren maakt het mogelijk om marketing en voorraad bij te sturen
- **Platform-stickiness:** Een goed dashboard maakt het CMS tot het dagelijkse startpunt voor de ondernemer
- **Seizoensinzichten:** Patronen herkennen helpt bij het plannen van campagnes en voorraad

## Implementatiestappen

### Fase 1: Data-aggregatie laag (5-8 uur)
1. API endpoint `/api/analytics/revenue` bouwen die omzetdata aggregeert uit de orders collectie
2. Queries voor: totale omzet per periode, AOV, aantal orders, unieke klanten
3. Top producten query: JOIN orders met order_items, groeperen op product, sorteren op omzet
4. Top categorieën query: producten groeperen op categorie, omzet per categorie berekenen
5. CLV berekening: totale omzet per klant / aantal unieke klanten, met cohort-analyse (optioneel)
6. Caching laag: resultaten cachen (Redis of in-memory) met TTL van 15 minuten om database-belasting te beperken

### Fase 2: Dashboard componenten (6-10 uur)
7. KPI-kaarten component: omzet, AOV, aantal orders, unieke klanten — elk met trend-indicator
8. Omzet lijngraafiek (dagelijks/wekelijks/maandelijks) met Chart.js of Recharts
9. Top producten staafdiagram + tabel met product naam, aantal verkocht, omzet, percentage van totaal
10. Top categorieën donut-diagram met legenda
11. Periode-selector: vandaag, 7 dagen, 30 dagen, dit kwartaal, dit jaar, aangepast bereik
12. Vergelijkingsmodus: geselecteerde periode vs. vorige periode overlay in grafieken

### Fase 3: Integratie in Payload admin (3-5 uur)
13. Custom Payload CMS admin view registreren onder `/admin/analytics/revenue`
14. Navigatie-item toevoegen aan het admin menu
15. Rechten: dashboard alleen tonen aan gebruikers met admin- of analytics-rol
16. Multi-tenant: data automatisch filteren op de actieve tenant/klant

### Fase 4: Export en notificaties (2-4 uur)
17. CSV/PDF export van alle dashboard-data
18. Optionele wekelijkse omzet-samenvatting per email (koppeling met bestaande email marketing module)
19. Drempelwaarschuwingen: notificatie bij ongebruikelijk lage omzet (bijv. <50% van gemiddelde)
