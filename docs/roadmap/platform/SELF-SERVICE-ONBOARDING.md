# Self-Service Onboarding

**Status:** Roadmap
**Prioriteit:** Hoog (schaalbaarheid)
**Geschatte effort:** 30-40 uur (met AI)

---

## Huidige situatie

Het aanmaken van een nieuwe tenant-site is momenteel een managed proces. Er is al een **SiteGeneratorWizard** met 10 stappen die intern gebruikt wordt voor provisioning. De wizard doorloopt template selectie, branche configuratie, feature flags, en deployment — maar wordt alleen door het platform-team bediend. Klanten kunnen niet zelfstandig een site starten.

De provisioning service, Railway/Ploi integraties en het client dashboard zijn al operationeel. De technische basis voor automatische site-creatie is aanwezig, maar het ontbreekt aan een klant-facing flow met registratie, betaling en geautomatiseerde activering.

---

## Wat het doet

Klanten kunnen via een publieke wizard zelfstandig een site aanmaken zonder tussenkomst van het platform-team:

- **Registratie & authenticatie** — Account aanmaken, e-mail verificatie, login
- **Template selectie** — Visuele keuze uit branche-templates (ecommerce, horeca, content, etc.)
- **Configuratie wizard** — Bedrijfsnaam, branding, domein, gewenste features
- **Plan & betaling** — Abonnementskeuze, betalingsintegratie (Mollie/Stripe)
- **Automatische provisioning** — Database aanmaken, site deployen, DNS configureren
- **Onboarding flow** — Guided tour door het CMS na activering

---

## Waarom waardevol

- **Schaalbaarheid** — Groei wordt niet meer beperkt door handmatige onboarding door het team
- **Lagere drempel** — Potentiele klanten kunnen direct starten zonder sales-gesprek
- **24/7 beschikbaar** — Klanten kunnen op elk moment een site starten
- **Lagere operationele kosten** — Minder tijd per nieuwe klant
- **Snellere time-to-value** — Van aanmelding tot werkende site in minuten in plaats van dagen
- **Trial mogelijkheid** — Gratis proefperiode aanbieden wordt haalbaar

---

## Implementatiestappen

### Fase 1: Publieke wizard (10-15 uur)
1. Klant-facing versie van de SiteGeneratorWizard bouwen
2. Registratie flow met e-mail verificatie
3. Template preview pagina met live voorbeelden
4. Branding configuratie (logo, kleuren, bedrijfsnaam)
5. Domein keuze (subdomein of eigen domein)

### Fase 2: Betaling & plannen (8-12 uur)
6. Abonnementsplannen definiëren en tonen
7. Betalingsintegratie (Mollie voor NL markt)
8. Trial periode logica (bijv. 14 dagen gratis)
9. Automatische facturatie na trial
10. Upgrade/downgrade flow

### Fase 3: Automatische activering (8-10 uur)
11. Provisioning service koppelen aan publieke wizard
12. Automatische database creatie en migratie
13. DNS configuratie (wildcard subdomain of custom domain flow)
14. Deployment trigger via Railway/Ploi API
15. Status feedback naar klant (progress indicators)

### Fase 4: Onboarding experience (4-5 uur)
16. Welkom e-mail met inloggegevens
17. Guided tour door het CMS (eerste content aanmaken)
18. Checklist dashboard (logo uploaden, pagina's aanmaken, domein koppelen)
19. Help-artikelen en video tutorials koppelen
