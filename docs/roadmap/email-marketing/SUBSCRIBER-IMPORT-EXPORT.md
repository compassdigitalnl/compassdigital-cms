# Subscriber Import/Export

**Status:** Roadmap
**Prioriteit:** Hoog (dagelijkse behoefte)
**Geschatte effort:** 8-12 uur (met AI)

---

## Huidige situatie

De API voor subscriber management bestaat al: subscribers kunnen programmatisch worden aangemaakt, bijgewerkt en verwijderd. Wat ontbreekt is een gebruiksvriendelijke UI voor bulk import en export. Klanten die overstappen van een ander email marketing platform (Mailchimp, ActiveCampaign, etc.) moeten hun bestaande lijsten kunnen importeren. Daarnaast is er behoefte aan het exporteren van lijsten voor rapportage of backup.

## Wat het doet

Een complete bulk import/export functionaliteit voor subscribers met een gebruiksvriendelijke wizard:

- **CSV upload** — Bestand uploaden met subscribers via drag-and-drop
- **Mapping wizard** — CSV-kolommen koppelen aan subscriber velden (naam, email, tags, custom velden)
- **Duplicate detectie** — Bestaande subscribers herkennen en update-strategie kiezen
- **Validatie** — Email-adressen valideren, ongeldige rijen markeren
- **Tag toewijzing** — Geimporteerde subscribers automatisch taggen
- **Export** — Volledige lijst of segment exporteren als CSV
- **Import historiek** — Overzicht van alle imports met resultaten

## Waarom waardevol

- **Dagelijkse behoefte** — Klanten willen regelmatig lijsten importeren vanuit andere bronnen
- **Onboarding** — Essentieel voor klanten die overstappen van een ander platform
- **Tijdsbesparing** — Handmatig invoeren van honderden of duizenden contacts is onhaalbaar
- **Foutpreventie** — Mapping wizard en validatie voorkomen data-kwaliteitsproblemen
- **Multi-tenant** — Elke tenant importeert en exporteert onafhankelijk binnen eigen omgeving

## Implementatiestappen

1. **CSV upload & parsing** (2-3 uur)
   - Drag-and-drop upload zone in admin UI
   - CSV parsing met ondersteuning voor verschillende delimiters (komma, puntkomma, tab)
   - Encoding detectie (UTF-8, ISO-8859-1)
   - Preview van eerste 10 rijen na upload
   - Maximale bestandsgrootte configureerbaar per tenant

2. **Mapping wizard** (2-3 uur)
   - Automatische detectie van kolommen (email, naam, etc.) op basis van headers
   - Handmatige mapping: elke CSV-kolom koppelen aan een subscriber veld
   - Custom velden aanmaken vanuit de wizard als het veld nog niet bestaat
   - Mapping opslaan als template voor herhaalde imports
   - Preview van gemapte data voordat import start

3. **Duplicate detectie & update strategie** (1-2 uur)
   - Detectie op basis van email adres
   - Opties bij duplicaten: overslaan, bijwerken, samenvoegen
   - Bijwerken: alleen lege velden vullen of alles overschrijven
   - Overzicht van gevonden duplicaten voor import start
   - Optie om duplicaten apart te exporteren voor review

4. **Validatie & import verwerking** (1-2 uur)
   - Email validatie (formaat, MX record check optioneel)
   - Ongeldige rijen markeren met reden
   - Batch verwerking (chunks van 100) om geheugen te beperken
   - Voortgangsindicator tijdens import
   - Resultaat-samenvatting: aangemaakt, bijgewerkt, overgeslagen, mislukt

5. **Export functionaliteit** (1-2 uur)
   - Export van volledige lijst of geselecteerd segment
   - Kolomselectie (welke velden exporteren)
   - CSV download met juiste encoding
   - Export van subscriber activiteit (optioneel: open/click data)
   - Geplande exports (bijv. wekelijks automatisch)

6. **Import historiek & beheer** (1-2 uur)
   - Overzicht van alle uitgevoerde imports
   - Per import: datum, bestandsnaam, aantal verwerkt, resultaten
   - Mogelijkheid om een import ongedaan te maken (subscribers verwijderen die in die import zijn aangemaakt)
   - Fouten-log downloaden als CSV
   - Automatische opschoning van geuploadde bestanden na verwerking
