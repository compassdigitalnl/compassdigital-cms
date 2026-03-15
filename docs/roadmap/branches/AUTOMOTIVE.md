# Automotive Branche

**Status:** Roadmap
**Prioriteit:** Laag
**Geschatte inspanning:** 20-30 uur (met AI-assistentie)

---

## Huidige situatie

Het platform heeft geen automotive-specifieke functionaliteit. Er is geen voertuigbeheer, geen occasionpagina, geen werkplaatsplanning en geen koppeling met het RDW (Rijksdienst voor het Wegverkeer). Autobedrijven die het platform willen gebruiken moeten voertuigen als "producten" in de e-commerce module zetten, wat niet ideaal is: auto's hebben specifieke attributen (kenteken, bouwjaar, kilometerstand, brandstof) die niet in een generiek product passen.

Potentiële klanten: autobedrijven, garagebedrijven, autoverhuurbedrijven, scooterwinkels, camper/caravan dealers, en motorwinkels.

## Wat het doet

Een complete branche voor automotive bedrijven met:

- **Voertuigbeheer:** Collectie voor voertuigen met uitgebreide specificaties: merk, model, type, bouwjaar, kilometerstand, brandstof, transmissie, vermogen, kleur, carrosserie, aantal deuren, APK-datum, prijs, status (beschikbaar/verkocht/gereserveerd)
- **Occasion overzicht:** Filterpagina met alle beschikbare voertuigen, zoeken en filteren op merk, model, prijs, bouwjaar, brandstof, kilometerstand
- **Voertuig detail pagina:** Uitgebreide specificaties, fotogalerij, video, 360-graden weergave, prijsinformatie, financieringsvoorbeeld, contact/proefrit formulier
- **Kenteken-lookup (RDW API):** Kenteken invoeren en automatisch voertuiggegevens ophalen (merk, model, bouwjaar, brandstof, APK-verval, gewicht, etc.)
- **Werkplaats module:** Afspraak boeken voor onderhoud/reparatie, APK-herinnering, onderhoudshistorie
- **Inruil calculator:** Bezoekers kunnen hun huidige auto opgeven voor een indicatieve inruilwaarde
- **Vergelijken:** Twee of meer voertuigen naast elkaar vergelijken op specificaties

## Waarom waardevol

- **Grote markt:** Nederland heeft duizenden autobedrijven, de meeste met verouderde websites of dure dealer management systemen
- **RDW koppeling is uniek:** Automatisch voertuigdata ophalen bespaart enorm veel tijd bij het invoeren van occasions
- **Hoge gemiddelde orderwaarde:** Autobedrijven hebben budget voor een goed platform en waarderen kwaliteit
- **Beperkte concurrentie:** Er zijn weinig moderne, betaalbare CMS-oplossingen specifiek voor de automotive sector in Nederland
- **Hergebruik van patterns:** Veel functionaliteit lijkt op e-commerce (catalogus, filters, detail pagina's) en kan hergebruikt worden

De prioriteit is laag omdat het een niche markt is en andere branches (healthcare, meer e-commerce features) waarschijnlijk sneller ROI opleveren.

## Implementatiestappen

### Fase 1: Voertuig datamodel (5-7 uur)
1. Collectie `vehicles`: kenteken, merk, model, type/uitvoering, bouwjaar, kilometerstand, brandstoftype (benzine/diesel/elektrisch/hybride/LPG), transmissie (handgeschakeld/automaat), vermogen (pk/kW), kleur, carrosserie, aantal deuren, gewicht, cilinderinhoud
2. Aanvullende velden: prijs, actieprijs, BTW-marge/BTW-auto, status (beschikbaar/gereserveerd/verkocht), APK-vervaldatum, eerste registratiedatum, aantal eigenaren
3. Media: fotogalerij (meerdere afbeeldingen), video URL, 360-graden foto URL
4. Extra's en opties: array van features (airco, navigatie, parkeersensoren, etc.) met categorisering
5. Collectie `vehicle-brands`: merk naam, logo, populaire modellen (voor filter-UI)
6. Migraties schrijven en registreren

### Fase 2: RDW API koppeling (3-4 uur)
7. RDW Open Data API integratie: kenteken als input, voertuiggegevens ophalen via `https://opendata.rdw.nl/resource/m9d7-ebf2.json`
8. API endpoint `/api/vehicles/rdw-lookup?kenteken=XX-XXX-X` die RDW data ophaalt en mapt naar het voertuig datamodel
9. Admin UI: knop "Ophalen via kenteken" bij het aanmaken van een voertuig, vult automatisch de bekende velden in
10. Caching: RDW responses cachen (1 dag TTL) om rate limits te respecteren
11. APK-check: bij lookup ook de APK-status ophalen en tonen

### Fase 3: Website templates (5-7 uur)
12. Occasion overzichtspagina: grid/lijst weergave van voertuigen met foto, merk/model, prijs, bouwjaar, km-stand, brandstof
13. Uitgebreide filters: merk, model, prijsrange (slider), bouwjaar range, km-stand range, brandstof, transmissie, kleur, carrosserie
14. Sorteren: prijs (laag-hoog, hoog-laag), bouwjaar, km-stand, nieuwste toevoegingen
15. Voertuig detail pagina: grote fotogalerij met lightbox, specificatie-tabel, extra's lijst, beschrijving
16. Financieringsvoorbeeld: eenvoudige calculator (aankoopprijs, aanbetaling, looptijd, rente → maandbedrag)
17. Proefrit aanvraag formulier: voertuig automatisch ingevuld, datum/tijd voorkeur, contactgegevens
18. Vergelijkingsfunctie: tot 3 voertuigen selecteren en naast elkaar vergelijken op alle specificaties

### Fase 4: Werkplaats module (4-6 uur)
19. Diensten collectie: APK-keuring, onderhoudsbeurt (klein/groot), bandenwissel, airco service, reparatie, etc. met prijs-indicatie
20. Online afspraak boeken: kies dienst → voer kenteken in (RDW lookup voor voertuiginfo) → kies datum/tijd → bevestig
21. APK-herinnering service: klanten kunnen kenteken registreren, ontvangen automatisch email X weken voor APK-vervaldatum
22. Beschikbaarheidskalender: werkplaatscapaciteit per dag, automatisch beschikbare tijdslots berekenen
23. Afspraak bevestiging en herinnering per email

### Fase 5: Bedrijfspagina's en extra's (3-5 uur)
24. "Over ons" template: bedrijfsverhaal, team, certificeringen (RDW erkend, BOVAG lid), foto's van het bedrijf
25. Nieuws/blog: voor het delen van automotive tips, nieuwe occasions, acties
26. Google Rich Snippets: Vehicle structured data (schema.org/Vehicle) voor betere zoekresultaten
27. Social media integratie: voertuig delen op Facebook/Instagram met aantrekkelijke preview
28. Multi-vestiging: meerdere locaties met elk eigen voorraad en werkplaats

### Fase 6: Inruil en lead management (2-4 uur)
29. Inruil formulier: kenteken invoeren (RDW lookup), km-stand, staat, foto's uploaden → indicatieve inruilwaarde (handmatig door dealer te bepalen) of automatisch via koppeling
30. Lead management: alle contactformulieren, proefrit aanvragen en inruil verzoeken in een overzicht voor de dealer
31. Lead status: nieuw → in behandeling → afgehandeld, met notities per lead
32. Email notificatie bij nieuwe lead, dagelijks overzicht van openstaande leads
