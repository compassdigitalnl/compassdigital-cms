# PWA Offline Reading

**Status:** Roadmap
**Prioriteit:** Middel
**Geschatte effort:** 8-12 uur (met AI) — bovenop digitale bibliotheek

---

## Huidige situatie

Er is al een digitale bibliotheek gepland met een flipbook viewer voor het online lezen van edities. Momenteel is er echter geen offline-functionaliteit: wanneer een gebruiker geen internetverbinding heeft, zijn edities niet beschikbaar. De huidige webapplicatie functioneert uitsluitend als online platform.

## Wat het doet

Progressive Web App (PWA) functionaliteit waarmee lezers digitale edities offline kunnen lezen op hun telefoon, tablet of laptop. De oplossing omvat:

- **Service Worker** die edities cached voor offline toegang
- **Cache strategy** (cache-first voor reeds gelezen edities, network-first voor nieuwe content)
- **Install prompt** zodat gebruikers de app op hun homescreen kunnen installeren
- **Offline indicator** die aangeeft welke edities beschikbaar zijn zonder internet
- **Background sync** voor het automatisch downloaden van nieuwe edities wanneer weer online

## Waarom waardevol

- **Gebruikerservaring** — Lezers in de trein, het vliegtuig of op locaties met slecht bereik kunnen gewoon doorlezen
- **Engagement** — Homescreen-icoon zorgt voor hogere terugkeerfrequentie
- **Kostenbesparing** — PWA is aanzienlijk goedkoper dan een native app, maar biedt vergelijkbare offline-ervaring
- **Multi-tenant** — Elke tenant krijgt automatisch een eigen PWA met eigen branding (naam, icoon, thema)
- **Brug naar native** — PWA valideert de behoefte voordat wordt geinvesteerd in een volledige native app

## Implementatiestappen

1. **Service Worker registratie** (1-2 uur)
   - Service Worker setup in Next.js (next-pwa of handmatig)
   - Lifecycle management (install, activate, fetch)
   - Per-tenant manifest.json generatie (naam, kleuren, iconen)

2. **Cache strategy implementatie** (2-3 uur)
   - Workbox integratie voor caching strategies
   - Cache-first voor reeds geopende edities (pagina-afbeeldingen, metadata)
   - Network-first voor editie-overzicht en nieuwe content
   - Stale-while-revalidate voor statische assets (CSS, JS, fonts)
   - Cache size limits per tenant (bijv. max 500MB)

3. **Offline editie-download** (2-3 uur)
   - "Download voor offline" knop per editie
   - Download-voortgangsindicator
   - Opslag in Cache Storage of IndexedDB
   - Overzicht van gedownloade edities met verwijderoptie

4. **Install prompt & PWA manifest** (1-2 uur)
   - Dynamisch manifest.json per tenant (naam, start_url, theme_color)
   - Custom install banner op geschikt moment tonen
   - Instructies voor iOS (Add to Home Screen)

5. **Offline UI & status** (1-2 uur)
   - Offline indicator in de header
   - Visuele markering welke edities offline beschikbaar zijn
   - Graceful fallback wanneer content niet gecached is
   - Background sync voor het ophalen van nieuwe edities bij herverbinding
