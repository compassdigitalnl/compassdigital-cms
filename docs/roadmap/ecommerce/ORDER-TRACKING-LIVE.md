# Live Order Tracking

**Status:** Roadmap (toekomstig)
**Prioriteit:** Hoog
**Datum:** Maart 2026
**Geschatte inspanning:** 15-20 uur (met AI)

---

## Huidige Situatie

Er is al een `/track` route en er zijn carrier webhooks aanwezig voor het ontvangen van verzendstatusupdates. De basis-infrastructuur voor tracking staat dus. Wat ontbreekt is een real-time tracking pagina voor de klant, integratie met carrier tracking API's voor live locatiedata, en push notificaties bij statuswijzigingen.

## Wat het doet

- **Real-time tracking pagina:** Visuele tijdlijn van orderstatus (besteld → verwerkt → verzonden → bezorgd)
- **Carrier API integratie:** Live tracking data ophalen van PostNL, DHL, DPD, UPS via hun API's
- **Push notificaties:** Browser- en e-mailnotificaties bij elke statuswijziging
- **Tracking zonder account:** Tracking via ordernummer + e-mail of postcode, geen login vereist
- **Verwachte leverdatum:** Berekende en bijgewerkte verwachte bezorgdatum tonen
- **Bezorgbewijs:** Foto/handtekening van bezorging tonen indien beschikbaar via carrier

## Waarom waardevol

- Vermindert klantenservice-druk: klanten checken zelf hun bestelstatus
- Verhoogt klanttevredenheid en vertrouwen
- Professionele uitstraling vergelijkbaar met grote platforms
- Basis is al aanwezig, waardoor de investering relatief laag is
- Push notificaties houden klanten betrokken en stimuleren herhalingsaankopen

## Implementatiestappen

1. **Carrier API abstractie** — Generieke interface voor carrier tracking (vergelijkbaar met payment provider patroon)
2. **PostNL API integratie** — Tracking data ophalen, verwachte levertijd, bezorgbewijs (meest gebruikte carrier in NL)
3. **DHL API integratie** — Idem voor DHL (tweede grote carrier)
4. **Tracking pagina redesign** — Visuele tijdlijn component met stappen en actuele status, responsive design
5. **Real-time updates** — Polling of Server-Sent Events voor live statusupdates op tracking pagina
6. **Webhook verwerking uitbreiden** — Bestaande carrier webhooks uitbreiden met gestructureerde event-opslag
7. **TrackingEvents collectie** — Alle statuswijzigingen opslaan met timestamp, locatie en beschrijving
8. **Push notificaties** — Browser Push API integratie + e-mail notificaties bij statuswijzigingen
9. **Tracking zonder account** — Publieke tracking pagina met verificatie via ordernummer + e-mail/postcode
10. **Verwachte leverdatum berekening** — Op basis van carrier data en historische levertijden
11. **Admin dashboard** — Overzicht van alle actieve verzendingen, late leveringen, en carrier performance
12. **Multi-tenant configuratie** — Per tenant carrier API keys en notificatie-instellingen
