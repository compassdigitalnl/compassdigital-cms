# Multi-Warehouse Voorraadbeheer

**Status:** Roadmap (toekomstig)
**Prioriteit:** Middel
**Datum:** Maart 2026
**Geschatte inspanning:** 20-30 uur (met AI)

---

## Huidige Situatie

Er is al basis stockbeheer via de `StockReservations` collectie. Voorraad wordt bijgehouden op productniveau maar zonder onderscheid tussen locaties. Bij meerdere magazijnen of winkelpunten is er geen inzicht in waar de voorraad zich bevindt.

## Wat het doet

- **Meerdere magazijnlocaties:** Definieer warehouses met adres, capaciteit en prioriteit
- **Per-locatie voorraad:** Voorraadhoeveelheden per product per warehouse bijhouden
- **Transfer orders:** Voorraad verplaatsen tussen locaties met tracking
- **Locatie-gebaseerde verzending:** Automatisch verzenden vanuit het dichtstbijzijnde of meest geschikte magazijn
- **Consolidatie-overzicht:** Totaalvoorraad over alle locaties heen in één dashboard
- **Low-stock alerts per locatie:** Meldingen wanneer specifieke locaties onder minimum komen

## Waarom waardevol

- Essentieel voor klanten met meerdere fysieke locaties of winkels
- Snellere levering door verzending vanuit dichtstbijzijnde magazijn
- Beter voorraadbeheer: voorkom overschot op één locatie en tekort op een andere
- Noodzakelijke basis voor POS-integratie en dropshipping

## Implementatiestappen

1. **Warehouses collectie** — Nieuwe collectie: naam, adres, coördinaten, capaciteit, prioriteit, actief/inactief
2. **StockLocations collectie** — Voorraad per product per warehouse (vervangt/breidt huidige StockReservations uit)
3. **Voorraad-aggregatie** — Totaalvoorraad berekenen over alle locaties, beschikbaarheid per locatie tonen
4. **Transfer Orders collectie** — Verplaatsingen tussen magazijnen: bron, bestemming, producten, hoeveelheden, status
5. **Warehouse-selectie bij orders** — Logica om optimaal magazijn te kiezen op basis van voorraad, afstand tot klant, en prioriteit
6. **Admin UI uitbreiding** — Voorraadoverzicht per locatie in admin panel, bulk voorraad aanpassen per warehouse
7. **Low-stock configuratie** — Minimum voorraadinstellingen per product per locatie, automatische alerts
8. **Rapportage** — Voorraadwaarde per locatie, omloopsnelheid per warehouse, transfer-historie
9. **API endpoints** — REST endpoints voor externe systemen om voorraad per locatie op te vragen/bij te werken
10. **Migratie bestaande data** — Huidige voorraadstanden toewijzen aan een standaard-warehouse
