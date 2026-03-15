# Heatmaps & Sessie Tracking

**Status:** Roadmap
**Prioriteit:** Laag
**Geschatte inspanning:** 15-20 uur (integratie met Hotjar/Clarity) of 40-60 uur (eigen oplossing)

---

## Huidige situatie

Er is geen enkele vorm van visuele gebruikersanalyse aanwezig. De huidige tracking beperkt zich tot Google Analytics pageviews en custom events via `/api/track`. Er is geen inzicht in waar gebruikers klikken op een pagina, hoe ver ze scrollen, of hoe ze door formulieren navigeren. Klanten die dit willen moeten zelf een Hotjar of Microsoft Clarity account aanmaken en het script handmatig toevoegen.

## Wat het doet

Visuele analyse van gebruikersgedrag op de website:

- **Click heatmaps:** Overlay op elke pagina die toont waar bezoekers klikken, met kleurintensiteit op basis van frequentie
- **Scroll tracking:** Percentage bezoekers dat elk deel van de pagina bereikt, weergegeven als scroll-diepte heatmap
- **Sessie opnames:** Video-achtige weergave van individuele gebruikerssessies (muisbewegingen, kliks, scrollen, pagina-overgangen)
- **Rage clicks detectie:** Automatische identificatie van plekken waar gebruikers herhaaldelijk klikken (frustratie-indicator)
- **Formulier analyse:** Per formulierveld: invultijd, drop-off, foutmeldingen

Er zijn twee implementatiepaden:
1. **Integratie:** Hotjar of Microsoft Clarity inbouwen als configureerbare module (script injection + API koppeling voor data in het dashboard)
2. **Eigen oplossing:** Zelf click/scroll/muis tracking bouwen met opslag en visualisatie

## Waarom waardevol

- **UX-optimalisatie:** Heatmaps onthullen problemen die niet uit analytics-cijfers blijken — bijv. een knop die niemand ziet, of content die niemand leest
- **Conversie-optimalisatie:** In combinatie met conversion funnels wordt duidelijk niet alleen waar klanten afhaken, maar ook waarom
- **Onderbouwing voor redesigns:** Concrete visuele data om design-beslissingen te onderbouwen richting klanten
- **Laagdrempelig inzicht:** Heatmaps zijn intuïtief — ook niet-technische klanten begrijpen direct wat ze zien

De prioriteit is laag omdat externe tools (Hotjar gratis tier, Microsoft Clarity gratis) dit al goed doen. De meerwaarde zit vooral in het integreren van deze data in het bestaande platform.

## Implementatiestappen

### Pad A: Integratie met externe tool (15-20 uur)

#### Fase 1: Configuratie module (4-6 uur)
1. Veld toevoegen aan site-settings: Hotjar Site ID of Clarity Project ID
2. Script injection component die het tracking-script conditioneel laadt (respecteert cookie consent)
3. Koppeling met bestaande cookie consent module: heatmap tracking pas activeren na toestemming voor analytics cookies

#### Fase 2: Dashboard integratie (6-8 uur)
4. API koppeling met Hotjar/Clarity API om heatmap-data op te halen
5. Dashboard widget in Payload admin die de heatmap van de huidige pagina toont
6. Lijst van sessie-opnames met filters (pagina, datum, apparaat)
7. Rage click rapport: overzicht van pagina's met de meeste frustratie-kliks

#### Fase 3: Multi-tenant en rechten (3-4 uur)
8. Per tenant een eigen Hotjar/Clarity account configureerbaar
9. Rechten: alleen admins kunnen heatmap-data inzien
10. Documentatie voor klanten: hoe ze hun eigen Hotjar/Clarity account koppelen

### Pad B: Eigen oplossing (40-60 uur)

#### Fase 1: Client-side tracking library (10-15 uur)
1. Lichtgewicht JavaScript module (<5KB) die kliks, scrollposities en muisbewegingen registreert
2. Sampling: niet elke bezoeker tracken, maar bijv. 10% om data-volume beheersbaar te houden
3. Batched verzending: events verzamelen en elke 5 seconden of bij paginaverlating versturen naar `/api/track/heatmap`
4. Privacy: geen persoonlijke data opslaan, sessie-ID's anonimiseren

#### Fase 2: Server-side opslag (8-12 uur)
5. Database tabel voor heatmap events: pagina URL, x/y coördinaten (genormaliseerd), event type, timestamp, viewport grootte
6. Aggregatie job die ruwe events omzet naar heatmap-data per pagina (grid-based density)
7. Data retentie: ruwe events na 30 dagen opschonen, geaggregeerde data bewaren
8. Sessie reconstructie: events per sessie-ID groeperen voor sessie-opname playback

#### Fase 3: Visualisatie (15-20 uur)
9. Heatmap overlay component: pagina laden in iframe, heatmap als canvas overlay tekenen
10. Scroll-diepte visualisatie: horizontale kleurband naast de pagina
11. Sessie-opname speler: events in chronologische volgorde afspelen met cursor-animatie
12. Rage click detectie: clusters van >3 kliks op dezelfde plek binnen 2 seconden markeren
13. Dashboard pagina met pagina-overzicht, filters, en drill-down naar individuele heatmaps

#### Fase 4: Formulier analyse (5-8 uur)
14. Formulierveld tracking: focus, blur, input events per veld
15. Funnel per formulier: welk percentage vult elk veld in, waar haken ze af
16. Gemiddelde invultijd per veld, foutmelding-frequentie
17. Dashboard weergave per formulier
