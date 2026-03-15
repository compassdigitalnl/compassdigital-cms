# A/B Testing UI

**Status:** Roadmap
**Prioriteit:** Middel
**Geschatte effort:** 10-15 uur (met AI)

---

## Huidige situatie

Het A/B testing framework bestaat al in de backend van het email marketing systeem. De logica voor het splitsen van ontvangers, het bijhouden van resultaten en het selecteren van een winnaar is aanwezig. Wat ontbreekt is een gebruiksvriendelijke UI waarmee marketeers A/B tests kunnen opzetten, monitoren en analyseren zonder technische kennis.

## Wat het doet

Een volledige UI voor het opzetten en beheren van A/B tests binnen email campaigns:

- **Test configuratie** — Visuele wizard voor het opzetten van A/B tests
- **Subject line testing** — Meerdere onderwerpregels testen tegen elkaar
- **Content variants** — Verschillende email-inhoud of templates vergelijken
- **Verzendtijd testing** — Optimale verzendtijd bepalen via A/B test
- **Auto-winner** — Automatisch de winnende variant naar de rest van de lijst sturen
- **Resultaten dashboard** — Real-time vergelijking van open rates, click rates en conversies

## Waarom waardevol

- **Hogere performance** — Data-gedreven beslissingen leiden tot betere open en click rates
- **Toegankelijkheid** — Het bestaande framework wordt bruikbaar voor niet-technische gebruikers
- **Professionalisering** — A/B testing is een verwachte feature in email marketing tools
- **ROI** — Kleine verbeteringen in open rate hebben groot effect op campagne-resultaten
- **Multi-tenant** — Elke tenant kan onafhankelijk tests uitvoeren op eigen lijsten

## Implementatiestappen

1. **Test configuratie wizard** (3-4 uur)
   - Stap-voor-stap wizard: test type kiezen, variants aanmaken, split configureren
   - Test types: subject line, afzender naam, content, verzendtijd
   - Split percentage instellen (bijv. 20% test, 80% winnaar)
   - Duur instellen voordat winnaar wordt gekozen (bijv. 4 uur)
   - Winnaar-criteria selecteren (open rate, click rate, conversie)

2. **Variant editor** (2-3 uur)
   - Side-by-side editor voor subject line variants
   - Content variant editor met visuele preview
   - Tot 5 variants per test
   - Variant labels en notities
   - Preview verzenden per variant (test-email)

3. **Real-time resultaten dashboard** (3-4 uur)
   - Live vergelijking van variants (open rate, click rate, unsubscribe rate)
   - Staafdiagrammen en lijngrafieken voor visuele vergelijking
   - Statistische significantie indicator (confidence level)
   - Automatische winnaar-markering wanneer significantie bereikt is
   - Tijdlijn van resultaten (hoe ontwikkelen de metrics zich)

4. **Auto-winner logica UI** (1-2 uur)
   - Configuratie van auto-winner criteria en wachttijd
   - Handmatige override mogelijkheid (winnaar forceren)
   - Notificatie wanneer winnaar is geselecteerd
   - Bevestigingsscherm voordat winnaar naar resterende lijst gaat

5. **Rapportage & historiek** (1-2 uur)
   - Overzicht van alle uitgevoerde A/B tests
   - Historische resultaten per campaign
   - Inzichten en trends (welke subject line patronen werken het best)
   - Export van testresultaten naar CSV
