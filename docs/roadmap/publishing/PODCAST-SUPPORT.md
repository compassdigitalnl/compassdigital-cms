# Podcast / Audio Content Ondersteuning

**Status:** Roadmap
**Prioriteit:** Laag
**Geschatte effort:** 15-25 uur (met AI)

---

## Huidige situatie

Het platform ondersteunt momenteel tekstuele en visuele content (artikelen, pagina's, digitale edities). Er is geen ondersteuning voor audio-content zoals podcasts. Veel uitgevers breiden hun aanbod uit met podcasts als aanvulling op hun geschreven content. De publishing branch in het platform is een natuurlijke plek om podcast-functionaliteit aan toe te voegen.

## Wat het doet

Volledige podcast- en audio-content ondersteuning binnen de publishing branch:

- **Podcast collection** in Payload CMS voor shows en episodes
- **Audio player component** met afspeelbesturing, snelheidsregeling en hoofdstuknavigatie
- **RSS feed generatie** die voldoet aan Apple Podcasts en Spotify specificaties
- **Episode management** met concepten, planning en publicatie
- **Show notes** met rich text, links en gerelateerde artikelen
- **Statistieken** voor downloads en luisterduur per episode
- **Multi-tenant** — elke tenant kan eigen podcasts beheren met eigen branding in de feed

## Waarom waardevol

- **Content diversificatie** — Uitgevers kunnen hun bereik vergroten via audio naast tekst
- **Platformcompleetheid** — Een alles-in-een publishing platform is aantrekkelijker dan meerdere losse tools
- **Engagement** — Podcasts bereiken een ander publiek en op andere momenten (onderweg, sport)
- **Advertentie-inkomsten** — Pre-roll en mid-roll advertenties als extra omzetbron
- **SEO** — Show notes en transcripties verbeteren vindbaarheid
- **Abonnee-retentie** — Exclusieve podcast-content als premium feature voor abonnees

## Implementatiestappen

1. **Payload CMS collections** (3-4 uur)
   - `podcast-shows` collection (titel, beschrijving, cover art, categorie, taal, auteur)
   - `podcast-episodes` collection (titel, audio bestand, duur, show notes, seizoen/nummer)
   - Relatie tussen shows en episodes
   - Relatie tussen episodes en artikelen (gerelateerde content)
   - Media upload configuratie voor audiobestanden (MP3, M4A)

2. **RSS feed generatie** (3-4 uur)
   - Dynamische RSS feed per show (`/podcast/[show-slug]/feed.xml`)
   - Apple Podcasts specificatie (iTunes namespace)
   - Spotify compatibiliteit
   - Enclosure tags met juiste MIME types en bestandsgrootte
   - Per-tenant feed URL's
   - Feed validatie tegen podcast standaarden

3. **Audio player component** (4-6 uur)
   - Custom audio player met Payload CMS design systeem
   - Play/pause, seek bar, volume, afspeelsnelheid (0.5x - 2x)
   - Hoofdstuknavigatie (chapters)
   - Mini-player die zichtbaar blijft tijdens scrollen
   - Luistervoortgang onthouden (localStorage of account-gebonden)
   - Responsive ontwerp (mobiel-vriendelijk)

4. **Podcast overzichtspagina's** (2-4 uur)
   - Show-overzicht met covers en beschrijvingen
   - Episode-lijst per show met filter en zoeken
   - Episode-detailpagina met player, show notes en gerelateerde artikelen
   - Abonneer-knoppen (Apple Podcasts, Spotify, RSS)

5. **Statistieken & analytics** (2-4 uur)
   - Download tracking per episode (IAB 2.1 compliant)
   - Luisterduur tracking via player events
   - Dashboard in admin met grafieken (downloads per episode, trends)
   - Export naar CSV

6. **Integratie met bestaande features** (1-3 uur)
   - Podcast-episodes tonen in nieuwsbrieven (email marketing integratie)
   - Podcast-widget als block voor pagina's en artikelen
   - Zoekintegratie (episodes doorzoekbaar via bestaande zoekmachine)
   - Toegangscontrole: gratis vs. premium episodes (abonnee-only)
