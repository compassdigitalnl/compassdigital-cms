# Education Branche (Onderwijs)

**Status:** Roadmap
**Prioriteit:** Laag
**Geschatte inspanning:** 30-45 uur (met AI-assistentie)

---

## Huidige situatie

Het platform heeft geen onderwijs-specifieke functionaliteit. Er is geen cursusstructuur, geen leerlingbeheer, geen voortgangsregistratie en geen certificaatsysteem. De publishing-branche kan tekst-content tonen, maar mist interactieve leerelementen, quizzen en voortgangstracking.

Potentiële klanten: opleidingsinstituten, bijlesbureaus, trainers/coaches, taalscholen, e-learning aanbieders, branche-opleidingen, en bedrijven met interne trainingen.

## Wat het doet

Een lichte LMS (Learning Management System) branche die het mogelijk maakt om online cursussen aan te bieden:

- **Cursusstructuur:** Cursussen met modules en lessen, in een logische volgorde. Elke les bevat content (tekst, video, afbeeldingen), oefeningen en optioneel een quiz
- **Leerlingbeheer:** Registratie, inschrijving voor cursussen, voortgangsbijhouding per leerling
- **Voortgangsregistratie:** Welke lessen zijn afgerond, quiz-scores, totale voortgang per cursus (percentage)
- **Quizzen en toetsen:** Meerkeuze, open vragen, waar/niet-waar. Automatische beoordeling voor gesloten vragen
- **Certificaten:** Automatisch gegenereerd certificaat (PDF) bij afronding van een cursus, met naam, datum, cursustitel en uniek verificatienummer
- **Cursusdashboard:** Voor de leerling: overzicht van ingeschreven cursussen, voortgang, volgende les
- **Docenten portal:** Voor de docent: overzicht van cursussen, leerling-voortgang, quiz-resultaten, cursus-statistieken

## Waarom waardevol

- **Groeiende markt:** Online leren groeit sterk, versneld door COVID. Veel kleine opleidingsinstituten zoeken een betaalbaar platform
- **Hoge retentie:** Een LMS is diep geïntegreerd in de bedrijfsvoering van een opleidingsinstituut — overstappen kost veel moeite
- **Premium pricing:** LMS-functionaliteit rechtvaardigt een hogere abonnementsprijs dan een standaard website
- **Cross-sell met e-commerce:** Cursussen verkopen via de bestaande e-commerce module (betaalde cursussen, abonnementen)
- **Content hergebruik:** Lessen zijn in feite rich-text content — de bestaande block-editor en media-library kunnen hergebruikt worden

De prioriteit is laag omdat het een significant nieuwe feature set is met relatief weinig overlap met bestaande branches.

## Implementatiestappen

### Fase 1: Cursus datamodel (6-8 uur)
1. Collectie `courses`: titel, beschrijving, thumbnail, categorie, niveau (beginner/gevorderd/expert), duur, prijs (0 = gratis), docent(en), status (concept/gepubliceerd/gearchiveerd)
2. Collectie `course-modules`: cursus (relatie), titel, beschrijving, volgorde, verplicht (boolean)
3. Collectie `lessons`: module (relatie), titel, content (rich text met blocks), video URL, bijlagen, volgorde, geschatte duur
4. Collectie `quizzes`: les (relatie), titel, vragen (array: vraagtype, vraagtekst, opties, correct antwoord, uitleg), minimale score voor slagen
5. Collectie `enrollments`: leerling (relatie), cursus (relatie), inschrijfdatum, status (actief/voltooid/gepauzeerd), voortgangspercentage
6. Collectie `lesson-progress`: enrollment (relatie), les (relatie), status (niet gestart/bezig/afgerond), quiz-score, afronddatum
7. Migraties schrijven en registreren

### Fase 2: Cursus content en weergave (6-8 uur)
8. Cursus overzichtspagina: grid van cursussen met thumbnail, titel, niveau, duur, prijs, docent
9. Cursus detail pagina: beschrijving, leerdoelen, curriculum (modules + lessen), docent info, reviews, "Inschrijven" knop
10. Les weergave: content met navigatie (vorige/volgende les), voortgangsbalk, zijbalk met curriculum-overzicht
11. Video player integratie: ondersteuning voor YouTube, Vimeo en zelf-gehoste video's
12. Custom blocks voor lessen: code-blok (met syntax highlighting), tip/waarschuwing blok, interactief voorbeeld
13. Bijlagen: downloadbare bestanden per les (PDF, slides, werkbladen)

### Fase 3: Quizzen en beoordeling (5-7 uur)
14. Quiz component: vragen één voor één tonen, antwoorden opslaan, directe feedback bij gesloten vragen
15. Vraagtypes: meerkeuze (single/multi select), waar/niet-waar, open tekst, vul-in
16. Automatische beoordeling voor gesloten vragen, handmatige beoordeling voor open vragen
17. Quiz resultaat pagina: score, per vraag of het goed/fout was met uitleg, optie om opnieuw te proberen
18. Score opslaan in `lesson-progress` en voortgangspercentage herberekenen
19. Minimale score afdwingbaar: les pas als "afgerond" markeren als quiz-score boven drempel is

### Fase 4: Leerling dashboard en voortgang (4-6 uur)
20. Leerling dashboard: ingeschreven cursussen met voortgangsbalk, volgende les, recent afgeronde lessen
21. Cursus voortgangspagina: per module en les de status (afgerond/bezig/niet gestart), quiz-scores
22. Voortgangsnotificaties: email bij 25%/50%/75%/100% voortgang (motiverend)
23. Streak tracking: aantal opeenvolgende dagen dat de leerling een les heeft afgerond (gamification)

### Fase 5: Certificaten (3-5 uur)
24. Certificaat template: configureerbaar PDF-sjabloon met logo, naam, cursustitel, datum, handtekening, uniek verificatienummer
25. Automatische generatie bij 100% cursusvoortgang (en alle quizzen voldoende)
26. Verificatie pagina: publieke URL waar het certificaat geverifieerd kan worden met het unieke nummer
27. Certificaat downloaden en delen (LinkedIn-compatibele afbeelding)

### Fase 6: Docenten portal en statistieken (4-6 uur)
28. Docent dashboard: overzicht van eigen cursussen, totaal aantal leerlingen, gemiddelde voortgang
29. Per cursus: leerling-lijst met voortgang, quiz-scores, laatste activiteit
30. Cursus statistieken: populairste lessen, moeilijkste quiz-vragen (laagste scores), drop-off per module
31. Open vragen beoordelen: wachtrij van open antwoorden die handmatige beoordeling vereisen
32. Bulk acties: alle leerlingen mailen, cursus archiveren, certificaten opnieuw genereren

### Fase 7: E-commerce integratie (3-5 uur)
33. Betaalde cursussen: koppeling met e-commerce checkout voor eenmalige aankoop
34. Abonnementen: toegang tot alle cursussen via een maandelijks/jaarlijks abonnement
35. Kortingscodes: bestaande e-commerce kortingscode-systeem hergebruiken voor cursussen
36. Factuurhistorie in leerling dashboard
