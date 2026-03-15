# Healthcare Branche (Zorg)

**Status:** Roadmap
**Prioriteit:** Middel
**Geschatte inspanning:** 25-35 uur (met AI-assistentie)

---

## Huidige situatie

Het platform heeft branches voor e-commerce, publishing, horeca, hospitality, beauty en construction. Er is geen zorg-specifieke branche. De beauty-branche komt het dichtst in de buurt (behandelaars, afspraken), maar mist zorg-specifieke functionaliteit zoals patiëntportaal, medische specialisaties, verwijzingen en AVG/GDPR-compliant gegevensverwerking op zorgniveau.

Potentiële klanten: huisartsenpraktijken, fysiotherapiepraktijken, tandartspraktijken, psychologen, paramedici, klinieken, en andere eerstelijnszorg aanbieders.

## Wat het doet

Een complete branche voor zorgaanbieders met:

- **Praktijk presentatie:** Overzichtspagina met praktijkinformatie, openingstijden, bereikbaarheid, parkeren, toegankelijkheid
- **Behandelaars profiel:** Per behandelaar: foto, specialisaties, BIG-registratie, werkdagen, biografie
- **Behandelingen/diensten:** Catalogus van behandelingen met beschrijving, duur, kosten (indien van toepassing), vergoeding door zorgverzekeraar
- **Online afspraken:** Afspraak boeken bij een specifieke behandelaar of voor een specifieke behandeling, met beschikbaarheidskalender
- **Patiëntportaal:** Inlog voor patiënten met overzicht van afspraken, documenten, en persoonlijke gegevens
- **Locaties:** Multi-locatie ondersteuning voor praktijken met meerdere vestigingen
- **Wachttijden:** Actuele wachttijden per behandelaar/behandeling (handmatig of via koppeling)
- **Zorgverzekering informatie:** Per behandeling aangeven welke zorgverzekeraars vergoeden en hoeveel

## Waarom waardevol

- **Grote markt:** Duizenden zorgpraktijken in Nederland hebben een website nodig, vaak verouderd of via dure gespecialiseerde pakketten
- **Herkenbaar patroon:** De structuur lijkt op beauty/hospitality (behandelaars, afspraken, locaties) dus veel code kan hergebruikt worden
- **Terugkerende inkomsten:** Zorgpraktijken zijn stabiele, langlopende klanten die zelden van platform wisselen
- **Maatschappelijke waarde:** Betere online aanwezigheid van zorgaanbieders helpt patiënten bij het vinden van de juiste zorg
- **Upsell mogelijkheden:** Patiëntportaal, online afspraken, en zorgverzekering-check zijn premium features

## Implementatiestappen

### Fase 1: Collecties en datamodel (6-8 uur)
1. Collectie `practitioners`: naam, foto, functie, specialisaties (tags), BIG-nummer, biografie, werkdagen/tijden, locatie(s), actief
2. Collectie `treatments`: naam, beschrijving, categorie, duur, prijs, vergoeding-info, benodigde specialisatie, behandelaar(s)
3. Collectie `healthcare-locations`: naam, adres, telefoon, email, openingstijden, faciliteiten, routebeschrijving, foto's
4. Collectie `appointments`: patiënt (relatie), behandelaar (relatie), behandeling (relatie), datum/tijd, status (gepland/bevestigd/geannuleerd/voltooid), notities
5. Collectie `insurance-info`: zorgverzekeraar, behandeling, vergoedingspercentage, eigen risico van toepassing, toelichting
6. Migraties schrijven en registreren voor alle nieuwe tabellen

### Fase 2: Praktijk website templates (5-7 uur)
7. Homepage template: hero met praktijkfoto, kernwaarden, team-overzicht, populaire behandelingen, openingstijden
8. Team pagina: grid van behandelaars met foto, naam, specialisatie, link naar profielpagina
9. Behandelaar detail pagina: uitgebreid profiel, werkdagen, behandelingen die deze persoon uitvoert, "Maak afspraak" knop
10. Behandelingen overzicht: categorieën met behandelingen, zoek/filter functionaliteit
11. Behandeling detail pagina: beschrijving, duur, kosten, vergoeding, welke behandelaars dit doen
12. Locatie pagina(s): adres, kaart, openingstijden, foto's, bereikbaarheid
13. Contact pagina: formulier, telefoonnummers, spoedlijn, routeplanner

### Fase 3: Online afspraken (6-8 uur)
14. Beschikbaarheidskalender: per behandelaar de beschikbare tijdslots berekenen op basis van werkdagen, bestaande afspraken en blokkades
15. Afspraak boekingsflow: kies behandeling → kies behandelaar (of eerste beschikbare) → kies datum/tijd → vul gegevens in → bevestig
16. Bevestigingsemail met afspraakdetails en optie om te annuleren/verzetten
17. Herinneringsemail: 24 uur voor de afspraak automatisch herinnering sturen
18. iCal export: afspraak toevoegen aan agenda (Google Calendar, Outlook, Apple Calendar)
19. Admin overzicht: dag/week/maand kalenderweergave van alle afspraken per behandelaar

### Fase 4: Patiëntportaal (5-7 uur)
20. Registratie en login voor patiënten (hergebruik bestaande auth + eventueel 2FA)
21. Dashboard: komende afspraken, afspraakhistorie, persoonlijke gegevens bewerken
22. Afspraak beheer: bestaande afspraak annuleren of verzetten (binnen configureerbare termijn)
23. Documenten sectie: praktijk kan documenten delen met specifieke patiënten (bijv. oefenschema, verwijsbrief)
24. Berichten (optioneel): beveiligd berichtensysteem tussen patiënt en praktijk

### Fase 5: Zorg-specifieke features (3-5 uur)
25. Wachttijden widget: handmatig in te stellen per behandeling, toont op website en in portaal
26. Zorgverzekering checker: patiënt voert verzekeraar in, ziet per behandeling wat vergoed wordt
27. BIG-register koppeling: link naar BIG-register verificatie per behandelaar
28. Spoedcontact component: prominent telefoonnummer voor spoedgevallen, buiten openingstijden doorverwijzing
29. Toegankelijkheid: WCAG 2.1 AA compliance (extra belangrijk voor zorgwebsites)
