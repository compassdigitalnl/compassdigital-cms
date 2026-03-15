# Single Sign-On (SSO / SAML)

**Status:** Roadmap
**Prioriteit:** Laag
**Geschatte inspanning:** 20-30 uur (met AI-assistentie)

---

## Huidige situatie

Alle gebruikers loggen in met een email/wachtwoord combinatie die beheerd wordt binnen Payload CMS. Er is geen koppeling met externe identity providers. Dit betekent dat:

- Enterprise klanten hun medewerkers apart moeten beheren in het CMS, los van hun bedrijfs-IT
- Gebruikers een apart wachtwoord moeten onthouden voor het CMS
- Er geen centrale controle is over toegang wanneer een medewerker het bedrijf verlaat (account moet handmatig gedeactiveerd worden)
- Grote organisaties met tientallen gebruikers geen geautomatiseerd gebruikersbeheer hebben

## Wat het doet

Single Sign-On integratie waarmee gebruikers kunnen inloggen met hun bestaande bedrijfsaccount:

- **SAML 2.0:** Ondersteuning voor SAML-gebaseerde identity providers (standaard in enterprise IT). Het CMS fungeert als Service Provider (SP)
- **OAuth2 / OpenID Connect:** Inloggen via Google Workspace, Microsoft Azure AD, of andere OAuth2 providers
- **Automatische gebruikersaanmaak (JIT provisioning):** Bij eerste login via SSO wordt automatisch een CMS-account aangemaakt met de juiste rol op basis van claims/attributen van de identity provider
- **Rolmapping:** SAML attributen of OAuth claims mappen naar CMS-rollen (bijv. AD-groep "CMS Admins" → admin rol, "Marketing" → redacteur rol)
- **Multi-provider:** Per tenant een andere SSO provider configureerbaar (klant A gebruikt Azure AD, klant B gebruikt Google Workspace)
- **Fallback:** Email/wachtwoord login blijft beschikbaar als fallback of voor accounts zonder SSO

## Waarom waardevol

- **Enterprise vereiste:** Grotere organisaties verwachten SSO als standaard. Zonder SSO is het platform minder aantrekkelijk voor enterprise klanten met 10+ gebruikers
- **Beveiliging:** Centraal toegangsbeheer via de identity provider betekent dat bij vertrek van een medewerker de toegang automatisch vervalt
- **Gebruiksgemak:** Geen apart wachtwoord onthouden, geen aparte registratie. Eén klik inloggen via het bekende bedrijfsaccount
- **Compliance:** Veel organisaties hebben beleid dat alle applicaties via SSO ontsloten moeten worden
- **Schaalbaarheid:** Bij tientallen gebruikers is handmatig accountbeheer niet houdbaar

De prioriteit is laag omdat het huidige klantenbestand voornamelijk MKB is met 1-3 CMS-gebruikers per tenant. SSO wordt pas relevant bij grotere organisaties.

## Implementatiestappen

### Fase 1: OAuth2 / Google & Microsoft login (8-10 uur)
1. NPM packages: `passport`, `passport-google-oauth20`, `passport-azure-ad` (of `openid-client` als lichtgewicht alternatief)
2. OAuth2 configuratie in site-settings: client ID, client secret, tenant ID (voor Azure), toegestane domeinen
3. Login pagina uitbreiden met "Inloggen met Google" en "Inloggen met Microsoft" knoppen
4. OAuth2 callback endpoint: `/api/auth/sso/callback` die het OAuth token valideert en een CMS-sessie aanmaakt
5. JIT provisioning: bij eerste login automatisch een gebruiker aanmaken met naam en email uit het OAuth profiel
6. Rolmapping configuratie: welke email-domeinen of OAuth claims welke CMS-rol krijgen

### Fase 2: SAML 2.0 ondersteuning (6-8 uur)
7. NPM package: `@node-saml/passport-saml` voor SAML 2.0 Service Provider functionaliteit
8. SAML configuratie per tenant: Identity Provider metadata URL, Entity ID, certificaat, attribuut-mapping
9. SAML metadata endpoint: `/api/auth/saml/metadata` die SP metadata retourneert voor configuratie aan de IdP-kant
10. SAML login flow: redirect naar IdP → authenticatie → SAML response → validatie → CMS-sessie
11. SAML attribuut-mapping: configureerbare mapping van SAML attributen naar CMS-velden (naam, email, rol, afdeling)
12. Signed/encrypted assertions ondersteuning voor enterprise-grade beveiliging

### Fase 3: Multi-tenant SSO configuratie (3-5 uur)
13. Per-tenant SSO configuratie scherm in Payload admin
14. SSO type selector: Geen / Google OAuth / Microsoft Azure AD / SAML 2.0 / Custom OAuth2
15. Test-functie: "Test SSO configuratie" knop die een proef-login uitvoert en het resultaat toont
16. Tenant-specifieke login pagina: automatisch de juiste SSO knoppen tonen op basis van tenant configuratie
17. Domein-gebaseerde routing: op basis van email-domein automatisch de juiste SSO provider selecteren

### Fase 4: Gebruikersbeheer en provisioning (3-5 uur)
18. Automatische deactivering: optie om gebruikers die X dagen niet via SSO ingelogd hebben te deactiveren
19. Groepssynchronisatie: bij elke SSO login de rol bijwerken op basis van de huidige claims (zodat rolwijzigingen in de IdP direct doorwerken)
20. Admin overzicht: lijst van SSO-gekoppelde gebruikers met laatste login, provider, en sync-status
21. Audit log: loggen van alle SSO logins en provisioning-acties
22. SCIM endpoint (optioneel, toekomstig): voor geautomatiseerd gebruikersbeheer vanuit de IdP
