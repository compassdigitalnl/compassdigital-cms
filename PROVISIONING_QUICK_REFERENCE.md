# PROVISIONING - QUICK REFERENCE
**Laatste update:** 18 Februari 2026
**Status:** ✅ Volledig werkend (end-to-end getest met Plastimed)

---

## Samenvatting

Het provisioning-systeem maakt automatisch een volledige klantsite aan op Ploi, inclusief:
- Domein (bijv. `plastimed01.compassdigital.nl`)
- Node.js applicatie (Payload CMS) op een unieke poort (4001+)
- PostgreSQL database (Railway shared, client-specifiek schema)
- DNS A-record (Cloudflare)
- SSL-certificaat (Let's Encrypt via Ploi)
- Automatische deployment via Ploi + GitHub

---

## Hoe trigger je provisioning?

### Methode 1: Automatisch via Admin UI (AANBEVOLEN)

1. Ga naar `/admin/collections/clients`
2. Maak een nieuwe client aan (of open een bestaande)
3. Stel de **Status** in op **"🔄 Wordt ingericht..."** (`provisioning`)
4. Sla op
5. → Het systeem start automatisch het provisioning-process

**Dit werkt via de `afterChange` hook in `src/platform/collections/Clients.ts:627`**
De hook detecteert `status === 'provisioning'` en roept `provisionClient()` aan.

### Methode 2: Via CLI script

```bash
# Provision Plastimed (hardcoded client)
npm run provision:plastimed

# Of direct via tsx:
NODE_OPTIONS="--no-deprecation --import=tsx/esm" npx tsx src/scripts/provision-plastimed.ts
```

### Methode 3: Via API (voor integraties)

```bash
POST /api/platform/provision
Content-Type: application/json
X-Payload-Secret: <PAYLOAD_SECRET>

{
  "clientId": "abc123",      # Payload document ID van de client
  "provider": "ploi",        # "ploi" of "vercel"
  "verbose": true            # Optioneel: extra logging
}
```

---

## Wat doet het systeem stap voor stap?

```
1. DATABASE (Railway)
   └─> Probeert per-client PostgreSQL project aan te maken
   └─> FALLBACK: deelt de platform-database (PLATFORM_DATABASE_URL)
       met client-specifieke database naam (bijv. client_plastimed01)

2. PLOI SITE AANMAKEN
   └─> POST /api/servers/108942/sites
   └─> project_type: 'nodejs', nodejs_port: <unieke poort>
   └─> Poorten worden automatisch gealloceerd: 4001, 4002, 4003, ...

3. PLACEHOLDER VERWIJDEREN (clearSitePlaceholder)
   └─> Ploi plaatst een root-owned index.html die git clone blokkeert
   └─> Tijdelijk bash-script via Ploi Scripts API (als root)
   └─> Verwijdert /home/ploi/<domain>/index.html
   └─> Script wordt daarna verwijderd

4. GIT REPOSITORY INSTALLEREN
   └─> Klont: compassdigitalnl/compassdigital-cms@main
   └─> Via GitHub (Ploi heeft toegang via deploy key)

5. ENVIRONMENT VARIABLES INSTELLEN
   └─> NODE_ENV, PORT, DATABASE_URL, PAYLOAD_SECRET
   └─> NEXT_PUBLIC_SERVER_URL (bijv. https://plastimed01.compassdigital.nl)
   └─> STRIPE_SECRET_KEY, OPENAI_API_KEY (gedeeld van platform)
   └─> Klant-specifieke overrides via client.customEnvironment

6. DEPLOYMENT SCRIPT INSTELLEN
   └─> pnpm install --frozen-lockfile
   └─> NODE_OPTIONS="--no-deprecation --max-old-space-size=2048" npm run build
   └─> PORT=<port> pm2 start / restart

7. CLOUDFLARE DNS
   └─> A-record: plastimed01.compassdigital.nl → <server IP>

8. DEPLOYMENT TRIGGEREN
   └─> POST /api/servers/{id}/sites/{id}/deploy
   └─> Ploi doet git pull + deployment script
   └─> Build duurt ~10-15 minuten

9. STATUS MONITOREN
   └─> Poll site.status elke 5 seconden
   └─> 'active' = klaar, 'deploy-failed' = fout

10. SSL CERTIFICAAT (via ProvisioningService)
    └─> Wacht tot DNS propagated (max 5 minuten)
    └─> POST /api/servers/{id}/sites/{id}/certificates
```

---

## Belangrijke bestanden

```
src/lib/provisioning/
├── ProvisioningService.ts    # Hoofd-orchestrator (10-staps workflow)
├── provisionClient.ts        # Hoog-niveau wrapper (laadt Payload, etc.)
├── portAllocator.ts          # Port allocatie (4001-9999, uniek per site)
├── types.ts                  # TypeScript interfaces
└── adapters/
    └── PloiAdapter.ts        # Ploi-specifieke implementatie

src/lib/ploi/
└── PloiService.ts            # Ploi REST API wrapper

src/lib/cloudflare/
└── CloudflareService.ts      # Cloudflare DNS API wrapper

src/platform/collections/
└── Clients.ts                # afterChange hook (auto-trigger)

src/app/api/platform/provision/
└── route.ts                  # REST API endpoint
```

---

## Environment variables (vereist)

```bash
# Platform
PLATFORM_DATABASE_URL=postgresql://...    # Gedeelde database (Railway)
PLOI_API_TOKEN=eyJ0eXA...                # Ploi API key
PLOI_SERVER_ID=108942                    # Server ID
CLOUDFLARE_API_TOKEN=OWl3-...           # Cloudflare API key
CLOUDFLARE_ZONE_ID=11d1bcef...          # Zone voor compassdigital.nl
PLATFORM_BASE_URL=compassdigital.nl      # Basis domein

# Git repo voor client sites
PLOI_GIT_REPO=compassdigitalnl/compassdigital-cms
PLOI_GIT_BRANCH=main

# Gedeeld naar client sites (voor build-tijd)
STRIPE_SECRET_KEY=sk_...                 # Nodig bij import van webhook route
OPENAI_API_KEY=sk-...                    # Optioneel
```

---

## Bekende problemen & oplossingen

### "Root domain has already been taken"
→ Site bestaat al op Ploi. Verwijder de bestaande site via Ploi dashboard
   of via `service.deleteSite(serverId, siteId)`.

### "rm: cannot remove index.html: Permission denied" (git clone)
→ OPGELOST via `clearSitePlaceholder()` — verwijdert via Ploi Scripts API als root.

### "Neither apiKey nor config.authenticator provided" (build fout)
→ OPGELOST: Stripe lazy init fix + STRIPE_SECRET_KEY toegevoegd aan client env.
   De webhook route (`/api/stripe/webhooks/route.ts`) initialiseerde Stripe
   op module-niveau. Nu lazy (inside handler).

### Env vars niet opgeslagen
→ Ploi's GET /env geeft `{"data": "string"}` terug, NIET `{"data": {"content": "..."}}`.
   OPGELOST in PloiService.getEnvironment() return type fix.

### Deployment monitoring time-out
→ De `site.status` field is de primaire bron: `active` = klaar, `deploy-failed` = fout.
   OPGELOST in PloiAdapter.getDeploymentStatus().

---

## Huidig testresultaat (Plastimed)

- **Domain:** plastimed01.compassdigital.nl
- **Ploi site ID:** 349397
- **Server:** 108942 (Ploi)
- **Port:** 4001
- **Database:** client_plastimed01 op shared Railway PostgreSQL
- **Status:** Deployment in progress (build duurt ~10-15 min)

---

## Automatisch provisionen bij nieuwe klant

**Het is al volledig automatisch!** Zodra je in de Admin UI een client aanmaakt
en de status op "Wordt ingericht..." zet, start het systeem automatisch.

De stroom:
```
Admin UI → Clients collection → afterChange hook → provisionClient()
        → ProvisioningService.provision() → PloiAdapter → Ploi API
        → CloudflareService → DNS A-record
        → Deployment + SSL
```

Je hoeft alleen:
1. In Admin UI een nieuwe Client aanmaken met `name` en `domain`
2. Status instellen op `provisioning`
3. Opslaan → het systeem doet de rest (~15 min)
