# ERP Integratie

**Status:** Roadmap
**Prioriteit:** Middel (enterprise klanten)
**Geschatte effort:** 30-50 uur per koppeling (met AI)

---

## Huidige situatie

Het platform heeft ecommerce functionaliteit met producten, orders en voorraadbeheer, maar er is geen koppeling met ERP-systemen. Grotere klanten beheren hun producten, voorraad en orderverwerking in een ERP-systeem en willen dit gesynchroniseerd hebben met hun webshop.

Handmatige synchronisatie tussen ERP en webshop leidt tot verouderde productinformatie, voorraadverschillen en dubbele orderinvoer. Dit is een blocker voor enterprise klanten die het platform willen gebruiken.

---

## Wat het doet

Bidirectionele integraties met veelgebruikte ERP-systemen in de Benelux:

- **SAP Business One** — Veel gebruikt bij middelgroot tot groot MKB
- **Microsoft Dynamics 365 Business Central** — Populair bij MKB, sterke Microsoft ecosysteem integratie
- **AFAS Software** — Nederlands ERP systeem, sterk in HR en finance
- **Unit4** — Nederlands ERP, vooral bij overheid en non-profit

Per koppeling:
- **Product sync** — Productgegevens, prijzen, afbeeldingen van ERP naar webshop
- **Voorraad sync** — Real-time voorraadstanden synchroniseren
- **Order sync** — Webshop orders automatisch in ERP als verkooporder
- **Klant sync** — Klantgegevens bidirectioneel synchroniseren
- **Prijs sync** — Klantspecifieke prijzen en staffelprijzen uit ERP

---

## Waarom waardevol

- **Enterprise-ready** — Noodzakelijk om grotere klanten te bedienen
- **Single source of truth** — ERP als leidend systeem, webshop altijd actueel
- **Operationele efficientie** — Geen dubbele invoer, geen handmatige sync
- **Accurate voorraad** — Voorkom overselling door real-time voorraad
- **Hogere ARPU** — Enterprise klanten betalen meer en blijven langer
- **Concurrentiepositie** — Vergelijkbaar met Shopify Plus, Magento Enterprise

---

## Implementatiestappen

### Fase 1: ERP Integration Framework (10-15 uur, eenmalig)
1. Generieke ERP connector interface definiëren (product, order, inventory, customer)
2. Sync engine bouwen (polling + webhook, bidirectioneel)
3. Conflict resolution strategie (ERP-wins, webshop-wins, merge)
4. Data mapping configuratie per tenant (veldmapping, waarde transformaties)
5. Sync logging en monitoring dashboard
6. Error handling en retry mechanisme met dead letter queue
7. Rate limiting en batch processing voor grote datasets

### Fase 2: Microsoft Dynamics 365 — pilot (12-18 uur)
8. OAuth2 authenticatie met Azure AD
9. OData API client voor Business Central
10. Product sync: artikelen, varianten, eenheden, afbeeldingen
11. Prijslijst sync: standaardprijzen, klantprijzen, staffelprijzen
12. Voorraad sync: beschikbare voorraad per locatie
13. Order sync: webshop order → verkooporder in BC
14. Klant sync: nieuwe klanten aanmaken, bestaande koppelen

### Fase 3: AFAS koppeling (12-15 uur)
15. AFAS Profit REST API authenticatie (token-based)
16. Artikelstam synchronisatie
17. Voorraad ophalen uit AFAS magazijnen
18. Verkooporder aanmaken in AFAS
19. Debiteur koppeling en sync

### Fase 4: SAP Business One & Unit4 (per koppeling 15-20 uur)
20. SAP Service Layer / OData integratie
21. Unit4 REST API integratie
22. Specifieke veldmappings per ERP systeem
23. Bulk import tool voor initiele synchronisatie
24. Monitoring alerts bij sync failures
25. Admin UI voor sync configuratie en handmatige triggers
