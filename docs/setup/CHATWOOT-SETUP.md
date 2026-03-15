# Chatwoot Setup — Self-hosted Live Chat met AI + Human Handoff

**Geinstalleerd:** 2026-03-13
**Locatie:** `/home/ploi/chatwoot/`
**Status:** Draaiend op `http://127.0.0.1:3000`

---

## Architectuur

```
Bezoeker (website)
    │
    ▼
ChatbotWidget (bestaande RAG chatbot)
    │
    ▼
/api/chatbot/chatwoot/webhook
    │
    ├── RAGChatbotService (AI beantwoordt)
    │       │
    │       ├── Antwoord → Chatwoot → Bezoeker
    │       └── Low confidence? → Bied handoff aan
    │
    └── Handoff triggers:
            ├── Bezoeker zegt "medewerker" / "doorverbinden" / etc.
            ├── AI zegt "ik weet het niet" (low confidence)
            ├── >8 bot-beurten zonder oplossing
            └── Bot error → automatisch doorschakelen
                    │
                    ▼
            Chatwoot Agent Inbox
            (medewerker neemt over)
```

---

## Componenten

| Service | Container | Poort | Image |
|---------|-----------|-------|-------|
| Chatwoot Rails (web) | `chatwoot-rails` | 127.0.0.1:3000 | chatwoot/chatwoot:latest |
| Chatwoot Sidekiq (jobs) | `chatwoot-sidekiq` | — | chatwoot/chatwoot:latest |
| PostgreSQL + pgvector | `chatwoot-postgres` | intern | pgvector/pgvector:pg15 |
| Redis | `chatwoot-redis` | intern | redis:7-alpine |

---

## Bestanden

| Bestand | Functie |
|---------|---------|
| `/home/ploi/chatwoot/docker-compose.yml` | Docker Compose configuratie |
| `src/lib/integrations/chatwoot/ChatwootService.ts` | API client (sendMessage, handoff, labels) |
| `src/app/api/chatbot/chatwoot/webhook/route.ts` | Webhook endpoint (RAG → Chatwoot) |
| `.env` (CHATWOOT_* variabelen) | API tokens en configuratie |

---

## Credentials

| Item | Waarde |
|------|--------|
| Super Admin | `admin@compassdigital.nl` / `CompDigi2026!` |
| Account ID | `1` |
| Inbox ID | `1` (AI Chatbot) |
| Bot Token | `1VbKRdZsjG63TdDoQqyzB5wU` |
| User Token | `y8dc3eeDXn3FhM2QNFTGi8Yg` |

---

## ENV Variabelen (in .env van CMS)

```env
CHATWOOT_BASE_URL=http://127.0.0.1:3000
CHATWOOT_BOT_TOKEN=1VbKRdZsjG63TdDoQqyzB5wU
CHATWOOT_USER_TOKEN=y8dc3eeDXn3FhM2QNFTGi8Yg
CHATWOOT_ACCOUNT_ID=1
```

---

## Beheer

### Containers starten/stoppen

```bash
cd /home/ploi/chatwoot

# Status bekijken
sg docker -c "docker compose ps"

# Starten
sg docker -c "docker compose up -d"

# Stoppen
sg docker -c "docker compose down"

# Logs bekijken
sg docker -c "docker compose logs -f chatwoot-rails"
sg docker -c "docker compose logs -f chatwoot-sidekiq"

# Herstarten
sg docker -c "docker compose restart"
```

### Database backup

```bash
# Backup Chatwoot database
sg docker -c "docker exec chatwoot-postgres pg_dump -U chatwoot chatwoot" > /home/ploi/backups/chatwoot_$(date +%Y%m%d).sql

# Restore
sg docker -c "docker exec -i chatwoot-postgres psql -U chatwoot chatwoot" < backup.sql
```

### Chatwoot updaten

```bash
cd /home/ploi/chatwoot
sg docker -c "docker compose pull"
sg docker -c "docker compose run --rm chatwoot-rails bundle exec rails db:chatwoot_prepare"
sg docker -c "docker compose up -d"
```

---

## TODO: Nginx Proxy (via Ploi)

Chatwoot draait op `127.0.0.1:3000` maar medewerkers moeten er bij via browser. Configureer via Ploi:

1. **Nieuw domein aanmaken:** `chat.compassdigital.nl`
2. **SSL:** Let's Encrypt
3. **Nginx configuratie** (custom):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name chat.compassdigital.nl;

    # SSL (via Ploi)
    listen 443 ssl;
    # ... SSL config door Ploi ...

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

4. **Na configuratie:** Update `FRONTEND_URL` in docker-compose.yml als het domein anders is.

---

## TODO: SMTP Configureren

In `/home/ploi/chatwoot/docker-compose.yml`, vul de SMTP variabelen in:

```yaml
SMTP_ADDRESS: "smtp.example.com"
SMTP_PORT: "587"
SMTP_USERNAME: "your-smtp-user"
SMTP_PASSWORD: "your-smtp-password"
```

Daarna: `sg docker -c "docker compose restart"`

---

## Handoff Logic

De webhook (`/api/chatbot/chatwoot/webhook`) verwerkt inkomende berichten:

### Automatische handoff triggers:

| Trigger | Actie |
|---------|-------|
| Bezoeker zegt "medewerker", "doorverbinden", "klantenservice", etc. | Direct doorschakelen |
| AI antwoord bevat "ik weet het niet", "neem contact op", etc. | Bied handoff-keuze aan |
| >8 bot-beurten zonder oplossing | Suggestie: "wil je een medewerker?" |
| Bot error / crash | Automatisch doorschakelen |

### Labels:

Conversaties worden automatisch gelabeld:
- `ai-handled` — AI heeft de vraag beantwoord
- `handoff-requested` — Klant vroeg om medewerker
- `low-confidence` — AI was onzeker

### Conversation statussen:

| Status | Betekenis |
|--------|-----------|
| `pending` | Bot handelt af (standaard voor Agent Bot inbox) |
| `open` | Doorgeschakeld naar medewerker |
| `resolved` | Afgehandeld |

---

## Medewerker Workflow

1. **Inloggen** op `https://chat.compassdigital.nl` (zodra Nginx proxy staat)
2. **Inbox** toont alle wachtende + actieve gesprekken
3. **Notificaties** (browser + email zodra SMTP is geconfigureerd)
4. **Filters:**
   - `handoff-requested` — klanten die om medewerker vroegen
   - `low-confidence` — AI was onzeker, klant wacht mogelijk
   - `ai-handled` — afgehandeld door AI (ter review)
5. **Gesprek overnemen:** klik op conversatie → type bericht → verstuur
6. **Afsluiten:** markeer als "Resolved"

---

## Per-tenant Uitrol

Voor een nieuwe klant/uitgever die Chatwoot wil:

1. **Maak een nieuw Inbox aan** in Chatwoot voor die klant
2. **Koppel de Agent Bot** aan dat nieuwe Inbox
3. **Voeg de Chatwoot widget toe** aan de klant-site (of gebruik onze bestaande widget met Chatwoot backend)
4. **Medewerkers toevoegen** als agents in Chatwoot

De webhook URL blijft hetzelfde — Chatwoot routeert berichten per inbox.
