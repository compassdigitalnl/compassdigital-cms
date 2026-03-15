# Geavanceerde Segmentatie UI

**Status:** Roadmap
**Prioriteit:** Middel
**Geschatte effort:** 15-20 uur (met AI)

---

## Huidige situatie

Er is al automation condition logic aanwezig in het email marketing systeem waarmee subscribers gefilterd kunnen worden op basis van attributen en gedrag. Deze logica is echter niet beschikbaar als zelfstandige segmentatie-tool. Segmenten worden nu impliciet aangemaakt binnen automation flows, maar er is geen visuele segment builder waarmee marketeers herbruikbare segmenten kunnen definieren en beheren.

## Wat het doet

Een visuele segment builder waarmee marketeers geavanceerde doelgroepen samenstellen op basis van condities:

- **Visuele segment builder** — Condities toevoegen, combineren en groeperen via een intuïtieve UI
- **AND/OR logica** — Condities combineren met en/of operatoren en geneste groepen
- **RFM analyse** — Segmenten op basis van Recency (laatste aankoop), Frequency (aankoopfrequentie) en Monetary (bestedingsbedrag)
- **Gedragssegmenten** — Segmenteren op email-interactie (geopend, geklikt, niet geopend)
- **Dynamische segmenten** — Segmenten die automatisch bijwerken wanneer subscriberdata verandert
- **Segment grootte preview** — Direct zien hoeveel contacts in een segment vallen

## Waarom waardevol

- **Relevantie** — Gerichtere emails leiden tot hogere engagement en lagere uitschrijfpercentages
- **RFM waarde** — E-commerce klanten segmenteren op koopgedrag is bewezen effectief
- **Herbruikbaarheid** — Eenmaal gebouwde segmenten zijn bruikbaar in campaigns, flows en rapportages
- **Gebruiksvriendelijkheid** — Visuele builder maakt complexe segmentatie toegankelijk
- **Multi-tenant** — Elke tenant bouwt eigen segmenten op basis van hun specifieke klantdata

## Implementatiestappen

1. **Segment builder UI** (4-6 uur)
   - Visuele conditie-builder component (rij-gebaseerd)
   - Conditie toevoegen: veld kiezen, operator selecteren, waarde invoeren
   - AND/OR groepering met geneste niveaus
   - Drag-and-drop herordenen van condities
   - Segment opslaan met naam en beschrijving

2. **Conditie types** (3-4 uur)
   - Subscriber attributen (naam, email, tags, custom velden)
   - Email interactie (geopend/niet geopend in laatste X dagen, geklikt op link)
   - E-commerce gedrag (bestelling geplaatst, product gekocht, bedrag besteed)
   - Datum condities (aangemeld voor/na, laatste activiteit)
   - Lijst-lidmaatschap (wel/niet op specifieke lijst)
   - Operator types per veldtype (is, bevat, groter dan, tussen, is leeg)

3. **RFM analyse module** (3-4 uur)
   - RFM score berekening per subscriber (op basis van bestelhistorie)
   - Recency: dagen sinds laatste bestelling
   - Frequency: aantal bestellingen in periode
   - Monetary: totaal besteed in periode
   - Voorgedefinieerde RFM segmenten (Champions, Loyal, At Risk, Lost)
   - Visuele RFM matrix (heatmap)

4. **Real-time segment preview** (2-3 uur)
   - Segment grootte indicator die live bijwerkt bij conditie-wijzigingen
   - Voorbeeld-subscribers tonen die in het segment vallen
   - Venn-diagram bij gecombineerde segmenten
   - Performance-optimalisatie voor grote lijsten (debounce, caching)

5. **Segment management** (2-3 uur)
   - Overzicht van alle segmenten met grootte en laatste update
   - Segment dupliceren en aanpassen
   - Segment gebruiken in campaigns en automation flows
   - Statisch vs. dynamisch segment (snapshot vs. live)
   - Segment exporteren (CSV met contacts die erin vallen)
   - Segment verwijder-beveiliging (waarschuwing als in gebruik)
