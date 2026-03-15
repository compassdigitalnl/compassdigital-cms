# Abonnementenland — Eisenpakket Publishing Platform

> Dit document bevat alle functionele eisen vanuit Abonnementenland, gestructureerd per domein. Doel: beoordelen in hoeverre het huidige platform (Payload CMS / Next.js / Meilisearch) deze eisen al dekt.

---

## 1. THOR-koppeling (Abonnementenbeheer)

### 1.1 API-integratie
- Bidirectionele koppeling met THOR (het abonnementen-managementsysteem van Abonnementenland)
- Ophalen van actuele abonnementsstatus uit THOR
- Wegschrijven van nieuwe abonnementen naar THOR bij afsluiting via het platform
- Directe server-side push naar THOR (geen WordPress-plugin meer; uitgevers updaten plugins niet, wat storingen veroorzaakt)

### 1.2 Abonnementstiers
Vier abonnementsvormen die in THOR vastgelegd moeten worden:

| Tier | Omschrijving |
|------|-------------|
| **Gratis account** | Toegang tot website, ingekorte artikelen, artikelen opslaan, notificaties bij nieuwe content |
| **Premium account** | Online toegang tot volledige artikelen en edities, volledig archief |
| **Fysiek abonnement** | Edities per post thuisbezorgd |
| **Compleet abonnement** | Fysieke levering + premium online toegang |

### 1.3 Upgrade / Downgrade
- Gebruikers kunnen binnen hun account wisselen tussen tiers
- Elke wijziging moet direct in THOR worden vastgelegd (i.v.m. facturatie)
- Facturatie/incasso verloopt via THOR (maandelijks)

### 1.4 Vervanging WordPress-plugin
- Huidige situatie: WordPress-plugin voor formulieren/abonnementen die afhankelijk is van updates door uitgevers
- Gewenste situatie: platform handelt de koppeling volledig server-side af, onafhankelijk van de uitgever-website
- Bij storing bij Abonnementenland moeten de formulieren op de website blijven functioneren (decoupled)

---

## 2. Content & Paywall

### 2.1 Content-inlees (Import)
- Artikelen worden ingelezen vanuit een extern programma (formaat nog te bepalen)
- Ongeveer 50% van de beschikbare content wordt ingelezen
- Elke maand worden ~10 nieuwe artikelen aan het archief toegevoegd
- Elke week verschijnen 2 nieuwe ingekorte artikelen op de website

### 2.2 Artikelstructuur
- Elk artikel bestaat uit twee versies:
  - **Ingekort** — gratis leesbaar, wordt ook op social media gepubliceerd
  - **Volledig** — alleen toegankelijk voor premium/betaalde abonnees
- Tags/labels op artikelen voor categorisatie en doorzoekbaarheid

### 2.3 Paywall-model
- **Gratis bezoekers:** zien alleen ingekorte versies (eerste paar zinnen)
- **Gratis account:** mogelijk 3 volledige artikelen gratis per maand (metered paywall als trigger voor accountaanmaak)
- **Premium/betaald:** volledige artikelen en edities, volledig archief
- Paywall-status wordt bepaald op basis van THOR-abonnementsstatus

### 2.4 Archief
- Groeiend archief van artikelen (voorbeeld: 1.000+ artikelen)
- Doorzoekbaar op tags, onderwerp, auteur, etc.
- Oude edities moeten doorzoekbaar en leesbaar zijn

---

## 3. Zoekfunctie ("Netflix-model")

### 3.1 Per uitgever (eigen website)
- Full-text zoekfunctie op alle artikelen van die uitgever
- Filteren op tags, edities, onderwerpen
- Voorbeeld: zoek "Picasso" → alle artikelen waar Picasso in voorkomt

### 3.2 Cross-tenant (Aboland.nl)
- Aboland.nl als centraal platform met content van ALLE aangesloten uitgevers/merken
- Eén zoekomgeving over alle titels heen
- Netflix-model: abonnee betaalt €24,99/maand voor toegang tot alles
- Verrekensleutel: 50% inkomsten naar uitgevers, 50% naar Aboland (op basis van gelezen artikelen)

---

## 4. Digitaal Lezen

### 4.1 Artikelen lezen
- Reader-omgeving voor losse artikelen
- Optimale leeservaring op telefoon, tablet en desktop/laptop
- Voorleesfunctie (text-to-speech) bij artikelen en edities

### 4.2 Edities lezen
- Digitale reader voor volledige edities (vervanging van Bladenbox-app)
- Per website alleen de artikelen/edities van die specifieke uitgever/merk
- Op Aboland.nl: alle edities van alle uitgevers

### 4.3 Toegangsbeheer
- Lezen alleen mogelijk na inloggen
- Toegangsniveau bepaald door abonnementsstatus in THOR

---

## 5. E-mailcampagnes & Automations

### 5.1 Geautomatiseerde triggers
- Abonnement loopt af → herinneringsmail
- Abonnement is afgelopen → win-back campagne
- Upsell naar hogere abonnementsvorm
- Ex-abonnee mailings (abonnementen afgelopen in afgelopen jaar)
- Thema-mailingen met kortingsacties

### 5.2 Segmentatie
- Segmentatie op basis van THOR-data (abonnementsstatus, type, verloopdatum)
- Per titel/uitgever aparte mailinglijsten en campagnes
- Mogelijkheid om vanuit Aboland.nl per titel mails te versturen (als uitgever geen eigen website heeft)

### 5.3 Content-triggers
- Notificaties bij nieuw geplaatste content (voor accounthouders)
- Ingekorte artikelen als trigger voor social media en e-mail

---

## 6. Accounts & Gebruikersbeheer

### 6.1 Accountaanmaak
- Gratis account aanmaken op de website van de uitgever
- Account nodig voor: artikelen opslaan, notificaties ontvangen, beperkte gratis artikelen lezen
- Accounts worden (ook gratis) in THOR vastgelegd

### 6.2 Account-functionaliteit
- Artikelen opslaan / favorieten
- Upgrade/downgrade abonnementsvorm
- Leesgeschiedenis
- Notificatie-instellingen

### 6.3 Verdienmodel op accounts
- Abonnementenland berekent een klein bedrag per account per maand (voorbeeld: €0,03/account)
- Geldt voor zowel gratis als betaalde accounts
- Gratis accounts zijn vaak permanent → terugkerend inkomstenmodel
- Gratis accounts dienen als bron voor werving betaalde abonnementen

---

## 7. Abonneeservice (Aboland.nl)

### 7.1 Centraal serviceportaal
- Aboland.nl (of Abonnementenland.nl) als centraal punt voor alle abonnees
- Service verlenen ongeacht of uitgever eigen website heeft
- Inloggen met bestaand account

### 7.2 Twee scenario's per uitgever

**Uitgever MET eigen website:**
- Digitaal lezen via eigen website
- Service via eigen website
- Accountbeheer via eigen website
- Archief met leesmogelijkheden
- THOR API-koppeling
- Upgrade/downgrade via eigen website

**Uitgever ZONDER eigen website:**
- Digitaal lezen van edities via Aboland.nl
- Geen losse artikelen (alleen edities)
- Service via Aboland.nl
- Upgrade/downgrade via Aboland.nl
- Mailingen via Aboland.nl per titel

---

## 8. Advertenties

- Advertentieruimte ingebouwd in het platform
- Per uitgever/website configureerbaar
- Snelle pagina's = meer paginaweergaven = hogere advertentie-inkomsten

---

## 9. Social Media Publishing

- Ingekorte artikelversies worden gepubliceerd op social media kanalen
- Doel: publiek aantrekken naar de website en accountaanmaak triggeren
- Wekelijks 2 nieuwe artikelen naar socials

---

## 10. Chatbot

- Wordt als grote kans gezien, vooral in combinatie met accounts
- Moet nog volledig uitgewerkt worden
- Mogelijk ingezet voor service, content-aanbevelingen, of abonnementsbeheer

---

## 11. Leesgedrag-tracking (voor verrekensleutel)

- Tracking van gelezen artikelen per gebruiker per uitgever
- Nodig voor de 50/50 verrekensleutel van Aboland.nl
- Moet betrouwbaar genoeg zijn voor financiële afrekening
- Rapportage per uitgever over leesgedrag

---

## 12. Kostenbesparingen t.o.v. huidige situatie

De volgende kosten kunnen (deels) wegvallen voor uitgevers bij overstap:
- Digitale uitgave (nu ~€50 per editie)
- Extern e-mailprogramma
- Hosting
- Onderhoud
- Chatbot-kosten
- Plugin-licenties
- Externe IT-kosten
- Zoekmachine (bijv. Doofinder)
- Webshop-integratie

---

## Samenvatting: Beoordelingscriteria voor Claude Code

Beoordeel het huidige platform op de volgende hoofdvragen:

1. **THOR-koppeling:** Is er een bidirectionele API-koppeling met ondersteuning voor de vier abonnementstiers en upgrade/downgrade?
2. **Paywall:** Ondersteunt het platform een metered paywall (X gratis artikelen) en content-gating op basis van abonnementsstatus?
3. **Content import:** Is er een mechanisme om artikelen vanuit externe bronnen in te lezen?
4. **Zoekfunctie:** Ondersteunt Meilisearch full-text search met tags, en is er cross-tenant zoeken voor een Aboland-achtig portaal?
5. **Digitaal lezen:** Is er een reader-component voor zowel losse artikelen als volledige edities? Is er een voorleesfunctie?
6. **E-mail automations:** Zijn er geautomatiseerde e-mailflows op basis van abonnementsstatus/triggers?
7. **Accountbeheer:** Kunnen gebruikers een account aanmaken, artikelen opslaan, en hun abonnement beheren?
8. **Advertenties:** Zijn advertentieposities configureerbaar per tenant?
9. **Social media:** Is er een publishing-flow naar social media kanalen?
10. **Leesgedrag-tracking:** Wordt leesgedrag per gebruiker per artikel per uitgever bijgehouden?
11. **Multi-tenant:** Ondersteunt het platform zowel individuele uitgever-websites als een centraal Aboland-portaal?
