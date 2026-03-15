# Verlanglijstjes Delen

**Status:** Roadmap (toekomstig)
**Prioriteit:** Laag
**Datum:** Maart 2026
**Geschatte inspanning:** 8-12 uur (met AI)

---

## Huidige Situatie

Er is al een favorites-systeem met een `FavoriteCard` component waarmee ingelogde gebruikers producten als favoriet kunnen markeren. Deze lijst is momenteel privé en alleen zichtbaar voor de eigenaar. Er is geen mogelijkheid om favorieten te delen of om anderen producten te laten kopen van iemands lijst.

## Wat het doet

- **Publieke deellinks:** Genereer een unieke URL waarmee een verlanglijstje gedeeld kan worden
- **Social sharing:** Deel verlanglijstje via WhatsApp, e-mail, Facebook, of kopieer link
- **"Koop dit voor mij":** Bezoekers kunnen producten van een verlanglijstje kopen als cadeau
- **Meerdere lijsten:** Gebruikers kunnen meerdere verlanglijstjes aanmaken (verjaardag, kerst, etc.)
- **Privacy-instellingen:** Privé, deelbaar via link, of volledig publiek
- **Cadeau-tracking:** Eigenaar ziet welke items al gekocht zijn (zonder te weten door wie)

## Waarom waardevol

- Stimuleert extra verkopen via sociaal delen en cadeau-aankopen
- Verhoogt klantbetrokkenheid en terugkeerbezoeken
- Populaire feature bij consumenten, vooral rond feestdagen
- Relatief lage inspanning door voortbouwen op bestaand favorites-systeem

## Implementatiestappen

1. **Wishlists collectie** — Nieuwe collectie: naam, eigenaar (user relatie), privacy-instelling, deelbare slug/token
2. **Wishlist items** — Relatie naar producten met optionele notitie en gewenste variant/hoeveelheid
3. **Migratie favorites** — Bestaande favorites omzetten naar een standaard-verlanglijstje per gebruiker
4. **Publieke pagina** — Frontend pagina `/verlanglijst/[slug]` met productoverzicht en "voeg toe aan winkelwagen" knoppen
5. **Cadeau-tracking** — Bijhouden welke items al besteld zijn, tonen als "al gereserveerd" zonder koper te onthullen
6. **Share UI component** — Deelknoppen (WhatsApp, e-mail, kopieer link) op de verlanglijstpagina
7. **Meerdere lijsten UI** — Account-pagina uitbreiding om lijsten te beheren (aanmaken, hernoemen, verwijderen)
8. **Privacy-instellingen UI** — Toggle per lijst: privé / deelbaar via link / publiek
9. **SEO en Open Graph** — Meta tags voor gedeelde lijsten (preview met eerste producten)
10. **E-mail notificatie** — Optionele mail naar lijsteigenaar wanneer iemand een item koopt
