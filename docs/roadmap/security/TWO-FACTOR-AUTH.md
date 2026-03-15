# Two-Factor Authenticatie (2FA)

**Status:** Roadmap
**Prioriteit:** Hoog
**Geschatte inspanning:** 10-15 uur (met AI-assistentie)

---

## Huidige situatie

Het platform heeft basis gebruikersauthenticatie via Payload CMS (email + wachtwoord), API keys voor externe integraties, rate limiting op login-pogingen, en reCAPTCHA op formulieren. Er is echter geen tweede factor voor authenticatie. Admin accounts en klant accounts zijn enkel beschermd met een wachtwoord. Bij een gelekt of geraden wachtwoord heeft een aanvaller direct volledige toegang tot het admin panel of het klantaccount (met bestelhistorie, adresgegevens, facturen).

## Wat het doet

Twee-factor authenticatie als extra beveiligingslaag bovenop het bestaande wachtwoord:

- **TOTP (Time-based One-Time Password):** Ondersteuning voor Google Authenticator, Authy, 1Password en andere TOTP-apps. Gebruiker scant een QR-code bij setup, voert daarna bij elke login een 6-cijferige code in
- **Email codes:** Als fallback een eenmalige code per email versturen (gebruik makend van de bestaande email marketing infrastructuur)
- **SMS codes (optioneel):** Eenmalige code per SMS via een provider als Twilio of MessageBird
- **Recovery codes:** Bij setup van 2FA worden 10 eenmalige herstelcodes gegenereerd voor het geval de gebruiker zijn authenticator-app kwijtraakt
- **Afdwingbaar per rol:** Admins kunnen 2FA verplicht maken voor bepaalde rollen (bijv. verplicht voor admin, optioneel voor klanten)
- **Onthoud-apparaat:** Optie om een apparaat 30 dagen te vertrouwen, zodat niet bij elke login een code nodig is

## Waarom waardevol

- **Security best practice:** 2FA is de industriestandaard en wordt steeds vaker verwacht door klanten en bij security audits
- **Bescherming van gevoelige data:** Het admin panel bevat klantgegevens, bestellingen, financiele data en site-configuratie. Een extra beveiligingslaag is essentieel
- **Compliance:** Voor e-commerce klanten die met betaalgegevens werken kan 2FA een vereiste zijn vanuit PCI-DSS of AVG/GDPR
- **Vertrouwen:** Klanten die zien dat 2FA beschikbaar is, hebben meer vertrouwen in de beveiliging van het platform
- **Relatief lage inspanning:** Met bestaande libraries (speakeasy/otplib) is TOTP implementatie straightforward

## Implementatiestappen

### Fase 1: TOTP backend (3-4 uur)
1. NPM package installeren: `otplib` voor TOTP generatie/verificatie en `qrcode` voor QR-code generatie
2. Payload users collectie uitbreiden met velden: `twoFactorEnabled` (boolean), `twoFactorSecret` (encrypted text), `twoFactorRecoveryCodes` (encrypted JSON array)
3. Migratie schrijven voor de nieuwe database kolommen
4. API endpoint `/api/auth/2fa/setup`: genereert secret, retourneert QR-code als data URL en recovery codes
5. API endpoint `/api/auth/2fa/verify-setup`: verifieert een TOTP code om setup te bevestigen (voorkomt dat een gebruiker 2FA activeert zonder werkende app)
6. API endpoint `/api/auth/2fa/disable`: schakelt 2FA uit na verificatie van huidige code of recovery code

### Fase 2: Login flow aanpassen (3-4 uur)
7. Bestaande Payload login hook uitbreiden: na succesvolle wachtwoord-check controleren of 2FA actief is
8. Als 2FA actief: geen JWT token retourneren, maar een tijdelijk `2fa_challenge` token met korte TTL (5 minuten)
9. API endpoint `/api/auth/2fa/challenge`: accepteert het challenge token + TOTP code, retourneert het echte JWT token bij succesvolle verificatie
10. Recovery code flow: als gebruiker kiest voor recovery code, deze valideren en als gebruikt markeren (eenmalig)
11. Rate limiting op 2FA challenge: maximaal 5 pogingen per challenge token

### Fase 3: Admin UI voor setup (2-4 uur)
12. Account instellingen pagina uitbreiden met 2FA sectie
13. Setup wizard: stap 1 = QR-code tonen, stap 2 = verificatiecode invoeren, stap 3 = recovery codes tonen en laten downloaden
14. Uitschakelen van 2FA: huidige code of recovery code vereist
15. Recovery codes opnieuw genereren: oude codes invalideren, nieuwe tonen

### Fase 4: Afdwingbaarheid en beleid (2-3 uur)
16. Site-settings uitbreiden met 2FA beleid: uit / optioneel / verplicht voor admins / verplicht voor iedereen
17. Bij verplichte 2FA: gebruiker na login direct doorsturen naar 2FA setup als het nog niet geconfigureerd is
18. Admin overzicht: lijst van gebruikers met 2FA status (actief/inactief)
19. Notificatie naar admin bij uitschakelen van 2FA door een gebruiker met een gevoelige rol

### Fase 5: Email code fallback (1-2 uur)
20. Optie om bij 2FA challenge een code per email te sturen in plaats van TOTP
21. Eenmalige 6-cijferige code genereren, opslaan met TTL van 10 minuten, versturen via bestaande email service
22. Dezelfde challenge/verify flow als TOTP, maar met email code
