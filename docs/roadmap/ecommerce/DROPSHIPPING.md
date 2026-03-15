# Dropshipping Ondersteuning

**Status:** Roadmap (toekomstig)
**Prioriteit:** Middel
**Datum:** Maart 2026
**Geschatte inspanning:** 25-35 uur (met AI)

---

## Huidige Situatie

Het platform heeft een volledig orderverwerkingssysteem met orders, facturen, verzendingen en carrier webhooks. Producten worden beheerd in een eigen voorraad. Er is nog geen mogelijkheid om producten rechtstreeks door een leverancier te laten verzenden zonder tussenkomst van de winkelier.

## Wat het doet

- **Leverancier-koppeling:** Koppel producten aan externe leveranciers met hun eigen voorraad en prijzen
- **Automatische orderverwerking:** Bij bestelling wordt automatisch een inkooporder naar de leverancier gestuurd
- **Margeberekening:** Automatisch verschil tussen inkoopprijs (leverancier) en verkoopprijs berekenen
- **Leverancier dashboard:** Overzicht van alle leveranciers, hun producten, levertijden en betrouwbaarheid
- **Statusupdates:** Leverancier kan orderstatus bijwerken via API of portaal
- **Multi-supplier orders:** Eén klantorder kan automatisch gesplitst worden over meerdere leveranciers

## Waarom waardevol

- Klanten kunnen hun assortiment uitbreiden zonder eigen voorraadrisico
- Lagere opstartkosten voor nieuwe productcategorieën
- Populair model bij B2B-klanten die als tussenhandel opereren
- Onderscheidend ten opzichte van standaard e-commerce platforms die dit niet out-of-the-box bieden

## Implementatiestappen

1. **Suppliers collectie** — Nieuwe collectie met leveranciersgegevens (naam, contactinfo, API-endpoint, credentials, levertijd, betalingsvoorwaarden)
2. **Product-leverancier koppeling** — Relatie op productniveau: welke leverancier, inkoopprijs, leverancier-SKU, levertijd
3. **Purchase Orders collectie** — Automatische inkooporders genereren bij binnenkomende klantbestellingen
4. **Order splitting logica** — Klantorder splitsen wanneer producten van verschillende leveranciers komen
5. **Leverancier notificatie** — E-mail en/of API-koppeling om leverancier automatisch te informeren over nieuwe orders
6. **Leverancier portaal** — Eenvoudige interface waar leveranciers orders kunnen inzien en status bijwerken
7. **Marge-rapportage** — Dashboard met marge per product, per leverancier, per periode
8. **Voorraad sync** — Optionele feed/API om leveranciersvoorraad te synchroniseren
9. **Retourflow** — Retouren doorsturen naar juiste leverancier
10. **Documentatie en configuratie** — Per-tenant instelling om dropshipping aan/uit te zetten
