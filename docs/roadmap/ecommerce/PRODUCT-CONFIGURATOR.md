# Visuele Product Configurator

**Status:** Roadmap (toekomstig)
**Prioriteit:** Laag (niche)
**Datum:** Maart 2026
**Geschatte inspanning:** 35-50 uur (met AI)

---

## Huidige Situatie

Het platform ondersteunt al variabele producten (kleur, maat, etc.) via het bestaande variantensysteem. Er is echter geen visuele configurator waarbij de klant stap voor stap een product samenstelt en een live preview ziet van het eindresultaat. Complexe samenstellingen met afhankelijkheden tussen opties (bijv. bepaalde kleuren alleen bij bepaalde materialen) zijn niet mogelijk.

## Wat het doet

- **Stapsgewijze configuratie:** Klant doorloopt stappen om product samen te stellen (materiaal → kleur → afmeting → afwerking)
- **Visuele preview:** Real-time productvisualisatie die meebeweegt met gekozen opties
- **Dynamische prijsberekening:** Prijs past zich aan bij elke keuze, met duidelijk overzicht van toeslagen
- **Afhankelijkheden:** Regels tussen opties (materiaal X is alleen beschikbaar in kleuren A en B)
- **Samenvattingspagina:** Overzicht van alle gekozen opties voor toevoeging aan winkelwagen
- **Configuratie opslaan:** Klant kan configuratie opslaan en later terugkeren
- **Admin configuratie-editor:** Visuele editor voor het opzetten van configuratiestappen en regels

## Waarom waardevol

- Niche maar hoge waarde voor klanten in meubel-, interieur-, drukwerk-, of maatwerkbranches
- Verlaagt foutpercentage bij maatwerkbestellingen (klant ziet precies wat hij bestelt)
- Hogere gemiddelde orderwaarde door upselling van premium opties
- Onderscheidende feature ten opzichte van standaard webshopplatforms
- Vermindert offertetrajecten: klant configureert en bestelt direct

## Implementatiestappen

1. **ConfiguratorTemplate collectie** — Configuratieblauwdruk: stappen, opties per stap, prijsregels, afhankelijkheden
2. **ConfiguratorOption collectie** — Individuele opties: naam, afbeelding, toeslag, beschikbaarheid, afhankelijkheden
3. **Afhankelijkheidslogica** — Rule engine: welke opties beschikbaar zijn op basis van eerdere keuzes
4. **Prijsberekening engine** — Basisprijs + toeslagen per optie, met ondersteuning voor percentuele en vaste toeslagen
5. **Stapsgewijze UI component** — Frontend wizard met stappen-indicator, optiekeuze en navigatie
6. **Visuele preview component** — Canvas/image-layer systeem dat opties visueel combineert tot preview
7. **Product-configurator koppeling** — Bestaande producten koppelen aan een configurator-template
8. **Winkelwagen integratie** — Geconfigureerd product toevoegen aan winkelwagen met alle opties en berekende prijs
9. **Configuratie opslaan/laden** — Opslaan als draft voor ingelogde gebruikers, delen via link
10. **Admin configuratie-editor** — Drag & drop editor voor stappen, opties en afhankelijkheden
11. **Order-integratie** — Configuratiedetails meesturen in order en op factuur/pakbon
12. **Afbeelding-uploads per optie** — Per optie een preview-afbeelding of layer uploaden
13. **PDF export** — Configuratie-samenvatting als PDF voor offerte of bevestiging
