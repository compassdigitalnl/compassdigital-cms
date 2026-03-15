# Progressive Web App (PWA) - Algemeen

**Status:** Roadmap
**Prioriteit:** Middel
**Geschatte inspanning:** 15-25 uur (met AI-assistentie)

---

## Huidige situatie

De websites die het platform genereert zijn responsive en werken goed op mobiele apparaten, maar het zijn traditionele websites zonder PWA-functionaliteit. Er is geen service worker, geen web app manifest, geen offline ondersteuning en geen push notificaties. De publishing branche heeft al plannen voor PWA, maar er is nog geen platform-brede PWA-basis die alle branches kunnen gebruiken.

## Wat het doet

Een PWA-laag die beschikbaar is voor alle branches (e-commerce, publishing, horeca, hospitality, etc.):

- **Installeerbaar:** "Toevoegen aan startscherm" op mobiel en desktop. De website gedraagt zich als een native app met eigen icoon, splash screen en zonder browser-chrome
- **Offline basis:** Statische assets (CSS, JS, afbeeldingen) worden gecached zodat eerder bezochte pagina's ook zonder internet beschikbaar zijn. Bij geen verbinding wordt een offline-pagina getoond
- **Push notificaties:** Web push notificaties voor orderupdates (e-commerce), nieuwe content (publishing), reserveringsbevestigingen (horeca/hospitality)
- **App-achtige ervaring:** Vloeiende navigatie, geen page reloads (Next.js doet dit al grotendeels), native-achtige animaties en transities
- **Achtergrond synchronisatie:** Formulierinzendingen en winkelwagen-wijzigingen die offline gedaan worden, synchroniseren zodra er weer verbinding is

## Waarom waardevol

- **Hogere engagement:** PWA's tonen 2-3x hogere engagement dan reguliere mobiele websites door push notificaties en het "app-gevoel"
- **Geen app store nodig:** Klanten hebben een app-achtige ervaring zonder de kosten en complexiteit van een native app (Apple/Google review proces, twee codebases)
- **Snellere ervaring:** Gecachte assets laden instant, wat de perceived performance sterk verbetert
- **Herbezoeken stimuleren:** Het icoon op het startscherm en push notificaties brengen bezoekers terug
- **Alle branches profiteren:** Dit is geen e-commerce-specifieke feature maar een platformverbetering die elke klant direct kan gebruiken
- **SEO voordeel:** Google waardeert PWA-kenmerken (snelheid, mobiele ervaring) in de zoekresultaten

## Implementatiestappen

### Fase 1: Web App Manifest en installatie (3-4 uur)
1. Dynamisch `manifest.json` genereren op basis van tenant-instellingen (naam, kleuren, iconen)
2. Manifest velden: `name`, `short_name`, `theme_color`, `background_color`, `display: standalone`, `icons` in meerdere formaten
3. Admin UI: velden toevoegen aan site-settings voor PWA-naam, icoon upload (512x512), themakleur
4. Automatisch genereren van icon-formaten (192x192, 384x384, 512x512) via sharp
5. Meta tags toevoegen: `<link rel="manifest">`, Apple-specifieke meta tags voor iOS ondersteuning

### Fase 2: Service Worker en caching (4-6 uur)
6. Service worker registratie in de Next.js app (`next-pwa` package of handmatige implementatie met Workbox)
7. Caching strategie per resource type:
   - Statische assets (JS/CSS): cache-first (lange TTL)
   - Afbeeldingen: cache-first met size limit
   - API responses: network-first met cache fallback
   - HTML pagina's: network-first, cache recente pagina's
8. Offline fallback pagina: gestylede pagina met boodschap en optie om eerder bezochte pagina's te bekijken
9. Cache management: automatisch opschonen van oude caches bij nieuwe deployments
10. Per-branch caching configuratie: e-commerce cachet productpagina's agressiever, publishing cachet artikelen

### Fase 3: Push notificaties (5-8 uur)
11. Web Push setup: VAPID keys genereren en opslaan in environment variables
12. Frontend: push notificatie toestemming vragen (op het juiste moment, niet direct bij eerste bezoek)
13. Subscription opslaan: push subscription endpoint en keys opslaan in de database per gebruiker
14. Backend push service: functie om push notificaties te versturen via `web-push` NPM package
15. Triggers per branche:
    - E-commerce: orderstatus wijziging, verlaten winkelwagen herinnering, prijsdaling op favorieten
    - Publishing: nieuw artikel in gevolgde categorie
    - Horeca: reserveringsbevestiging, menu-update
    - Algemeen: custom notificatie vanuit admin panel
16. Admin UI: notificatie versturen naar alle subscribers of een segment, met titel, bericht en URL
17. Notificatie voorkeuren: gebruikers kunnen per type notificatie aan/uit zetten

### Fase 4: Achtergrond sync en optimalisatie (3-5 uur)
18. Background Sync API: offline formulierinzendingen en winkelwagen-wijzigingen queuen
19. Bij herverbinding: gequeude acties automatisch uitvoeren en gebruiker notificeren
20. App-update flow: bij nieuwe deployment gebruiker subtiel notificeren dat er een update beschikbaar is ("Ververs voor de nieuwste versie")
21. Performance audit: Lighthouse PWA score naar 100 brengen
22. Documentatie voor klanten: hoe de PWA te installeren, wat het doet, privacy-informatie over push notificaties
