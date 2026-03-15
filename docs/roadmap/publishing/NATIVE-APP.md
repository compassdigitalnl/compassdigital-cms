# Native App (iOS & Android)

**Status:** Roadmap
**Prioriteit:** Laag (pas na PWA)
**Geschatte effort:** 80-120 uur (met AI)

---

## Huidige situatie

Het platform heeft momenteel alleen een webinterface. Er is geen native mobiele app beschikbaar. De PWA-roadmap (zie PWA-OFFLINE-READING.md) biedt een eerste stap richting mobiele offline-ervaring, maar voor geavanceerde functionaliteiten zoals push notificaties (iOS), native gestures en App Store-aanwezigheid is een volwaardige native app nodig.

## Wat het doet

Een React Native / Expo app voor iOS en Android die communiceert met de Payload CMS REST API. De app is multi-tenant compatible: een enkele codebase die per tenant geconfigureerd wordt met eigen branding, content en instellingen. Kernfunctionaliteiten:

- **Editie-lezer** met native swipe gestures en pinch-to-zoom
- **Offline lezen** via lokale opslag van gedownloade edities
- **Push notificaties** bij nieuwe edities, breaking news of abonnementswijzigingen
- **In-app aankopen** voor losse edities of abonnementen (App Store / Google Play)
- **Multi-tenant configuratie** via API: elke tenant krijgt een eigen branded app-ervaring
- **Deeplink support** voor het delen van artikelen

## Waarom waardevol

- **App Store aanwezigheid** — Vergroot zichtbaarheid en vertrouwen bij eindgebruikers
- **Push notificaties** — Directe communicatie met lezers (vooral waardevol op iOS waar web push beperkt is)
- **Native ervaring** — Vloeiendere animaties, gestures en betere integratie met het besturingssysteem
- **Monetisatie** — In-app aankopen en abonnementen via Apple/Google billing
- **Multi-tenant schaalbaar** — Een codebase, meerdere branded apps (white-label)
- **Concurrentievoordeel** — Veel uitgevers bieden nog geen eigen app; dit onderscheidt het platform

## Implementatiestappen

1. **Project setup & architectuur** (8-12 uur)
   - Expo / React Native project initialisatie
   - Navigatiestructuur (React Navigation)
   - API client library voor Payload CMS REST API
   - Authenticatie flow (login, registratie, token management)
   - Multi-tenant configuratie systeem (tenant ID bij app-start)

2. **Editie-overzicht & bibliotheek** (10-15 uur)
   - Editie-grid met covers (vergelijkbaar met webversie)
   - Filter op categorie, datum, zoeken
   - Download-management (opslaan voor offline)
   - Opslagbeheer (ruimte-indicator, edities verwijderen)

3. **Editie-lezer** (15-20 uur)
   - Pagina-viewer met native gestures (swipe, pinch-to-zoom)
   - Vloeiende pagina-transities
   - Bladwijzers en leesvoortgang
   - Artikel-modus (tekst-only weergave)
   - Inhoudsopgave navigatie

4. **Push notificaties** (8-12 uur)
   - Expo Notifications setup (iOS + Android)
   - Backend: push token registratie in Payload CMS
   - Notificatie-types: nieuwe editie, breaking news, abonnement
   - Notificatie-voorkeuren per gebruiker
   - Deep linking vanuit notificaties naar specifieke editie/artikel

5. **Offline functionaliteit** (10-15 uur)
   - SQLite of AsyncStorage voor metadata
   - Bestandssysteem opslag voor editie-content
   - Synchronisatie-logica (delta updates)
   - Offline-first architectuur met conflict resolution
   - Achtergrond-downloads

6. **In-app aankopen** (10-15 uur)
   - RevenueCat of native IAP integratie
   - Abonnementsmodellen (maand, jaar)
   - Losse editie-aankopen
   - Restore purchases functionaliteit
   - Receipt validatie via backend

7. **Branding & white-label** (8-12 uur)
   - Dynamisch thema systeem (kleuren, fonts, logo)
   - Per-tenant app-icoon en splash screen
   - Build-configuratie voor meerdere app-varianten
   - App Store / Google Play asset generatie

8. **Testing & deployment** (10-15 uur)
   - Unit tests en integration tests
   - TestFlight (iOS) en Internal Testing (Android) distributie
   - App Store review proces en compliance
   - CI/CD pipeline (EAS Build)
   - Monitoring en crash reporting (Sentry)
