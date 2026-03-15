# Point of Sale Integratie

**Status:** Roadmap (toekomstig)
**Prioriteit:** Laag
**Datum:** Maart 2026
**Geschatte inspanning:** 30-40 uur (met AI)

---

## Huidige Situatie

Het platform is volledig gericht op online verkoop. Er is geen koppeling met kassasystemen voor fysieke winkels. Klanten met zowel een webshop als fysieke winkel(s) moeten voorraad en orders handmatig synchroniseren tussen systemen.

## Wat het doet

- **Kassa-koppeling:** Integratie met populaire POS-systemen (Lightspeed, Square, Zettle)
- **Voorraad sync:** Real-time voorraadsynchronisatie tussen online shop en fysieke kassa
- **Unified orders:** Alle verkopen (online + offline) in één overzicht
- **Klantherkenning:** Klantaccount koppelen aan fysieke aankopen (loyalty, orderhistorie)
- **Omnichannel functies:** Click & collect, in-store returns van online orders
- **Unified rapportage:** Gecombineerde omzet- en voorraadrapportages over alle kanalen

## Waarom waardevol

- Groeiend aantal klanten heeft zowel webshop als fysieke winkel(s)
- Voorkomt dubbele voorraadadministratie en overselling
- Klanten verwachten een naadloze ervaring tussen online en offline
- Loyalty-programma en klantenaccount werken over alle kanalen

## Implementatiestappen

1. **POS Provider abstractie** — Generieke interface voor POS-koppelingen (vergelijkbaar met bestaande payment provider abstractie)
2. **Lightspeed integratie** — Eerste POS-koppeling: productsync, voorraadsync, ordersync (populairste in NL/BE)
3. **Voorraad sync engine** — Bidirectionele real-time sync van voorraadhoeveelheden tussen POS en webshop
4. **Unified Orders** — Offline verkopen importeren als orders in het platform, inclusief betaalstatus
5. **Klant-matching** — Klanten uit POS koppelen aan online accounts op basis van e-mail of klantnummer
6. **Click & Collect flow** — Online bestellen, ophalen in winkel: notificatie naar winkel, ophaalstatus
7. **In-store retouren** — Online bestelling retourneren in fysieke winkel, status sync
8. **Loyalty integratie** — Punten sparen en inwisselen zowel online als offline
9. **Rapportage dashboard** — Gecombineerd overzicht: omzet per kanaal, voorraadwaarde, klantgedrag
10. **Webhook handlers** — POS events verwerken (verkoop, retouren, voorraadbewegingen)
11. **Foutafhandeling en conflict resolution** — Omgaan met sync-conflicten, offline modus, retry-logica
12. **Multi-tenant configuratie** — Per-tenant POS-provider selectie en credentials opslag
