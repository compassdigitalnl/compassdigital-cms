# Geavanceerde Promoties & Acties

**Status:** Roadmap (toekomstig)
**Prioriteit:** Middel
**Datum:** Maart 2026
**Geschatte inspanning:** 15-25 uur (met AI)

---

## Huidige Situatie

Het platform heeft al een werkend kortingssysteem met `DiscountCodes` (percentagekorting, vast bedrag, gratis verzending) en `Mix&Match` bundels. Er is nog geen ondersteuning voor tijdgebonden flash sales met visuele countdown, een grafische bundle builder, of een UI voor staffelkortingen.

## Wat het doet

- **Flash sales:** Tijdgebonden aanbiedingen met automatische start/stop en countdown timer op productpagina en overzichten
- **Countdown timers:** Visuele urgentie-elementen op product, categorie en homepage
- **Bundle deals builder:** Admin-interface om samengestelde aanbiedingen te maken (koop 3 betaal 2, combinatiekorting)
- **Staffelkortingen UI:** Visuele prijstabel op productpagina die automatisch de juiste prijs toont per hoeveelheid
- **Automatische promotie-banners:** Actieve acties automatisch tonen in header of op relevante pagina's
- **Promotie-kalender:** Overzicht van geplande, actieve en verlopen acties in admin

## Waarom waardevol

- Urgentie-elementen (countdown, "nog X beschikbaar") verhogen conversie aantoonbaar
- Klanten vragen regelmatig om geavanceerde actietools
- Vermindert handmatig werk: geen handmatige prijsaanpassingen meer bij start/stop van acties
- Bundel-aanbiedingen verhogen gemiddelde orderwaarde
- Bouwt voort op bestaande kortingsinfrastructuur

## Implementatiestappen

1. **Promotions collectie** — Nieuwe collectie: type (flash sale, bundle, staffel), start/einddatum, betrokken producten, kortingsregels, status
2. **Flash sale engine** — Automatisch activeren/deactiveren op basis van datum/tijd, cron-job voor statusupdates
3. **Countdown timer component** — Frontend component met real-time aftellen, herbruikbaar op product/categorie/homepage
4. **Bundle builder UI (admin)** — Drag & drop interface om producten te combineren tot een bundel met gecombineerde prijs
5. **Bundle weergave (frontend)** — Bundel-productpagina met alle items, samengestelde prijs, en "voeg bundel toe aan winkelwagen"
6. **Staffelkortingen configuratie** — Per product: prijsschalen definiëren (1-9: €10, 10-49: €8, 50+: €6)
7. **Staffelkortingen UI component** — Prijstabel op productpagina, automatische update van prijs bij hoeveelheidswijziging in winkelwagen
8. **Promotie-banner systeem** — Automatische banner generatie voor actieve promoties, plaatsing in header/sidebar
9. **Promotie-kalender (admin)** — Kalenderweergave van alle promoties: gepland, actief, verlopen
10. **Cart-integratie** — Automatisch promotiekortingen toepassen in winkelwagen zonder handmatige code-invoer
11. **Analytics** — Conversie en omzet per promotie, vergelijking met reguliere verkoop
