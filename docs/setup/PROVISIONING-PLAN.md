# Compleet Provisioning Plan - CompassDigital CMS

> Versie: 1.0 — 23 februari 2026
> Dit document beschrijft het complete proces voor het aanmaken van een nieuwe client site,
> van begin tot eind. Bruikbaar voor handmatige provisioning én als basis voor de site-generator.

## Overzicht

Elke client site is een **afzonderlijke deployment** van dezelfde git repo (`compassdigitalnl/compassdigital-cms`), gedifferentieerd door:
- **`.env` bestand** — unieke poort, database, feature flags, branding
- **PostgreSQL database** — eigen database per client op Railway
- **PM2 proces** — eigen Node.js process met unieke poort
- **Nginx vhost** — reverse proxy naar de juiste poort
- **SSL certificaat** — Let's Encrypt via certbot

---

## Server-Informatie

| Item | Waarde |
|------|--------|
| Server IP | `89.167.61.95` |
| OS | Ubuntu 22.04 LTS |
| Node.js | v22.x |
| PM2 | Process manager |
| Nginx | Reverse proxy (Ploi-managed) |
| PostgreSQL | Railway (`shinkansen.proxy.rlwy.net:29352`) |
| Meilisearch | Lokaal (`http://127.0.0.1:7700`) |
| Ploi API | Server ID: `108942` |
| Git Repo | `compassdigitalnl/compassdigital-cms` (branch: `main`) |

### Huidige Port Toewijzing

| Port | Site |
|------|------|
| 4000 | cms.compassdigital.nl (Platform CMS) |
| 4001 | plastimed01.compassdigital.nl |
| 4002 | aboland01.compassdigital.nl |
| 4003 | beauty01.compassdigital.nl |
| 4004 | construction01.compassdigital.nl |
| 4005 | content01.compassdigital.nl |
| 4006 | horeca01.compassdigital.nl |
| 4007 | hospitality01.compassdigital.nl |
| 7700 | Meilisearch (intern) |

---

## Stap-voor-stap Provisioning

### FASE 1: Infrastructuur Aanmaken

#### 1.1 Site aanmaken via Ploi API

```bash
PLOI_TOKEN="<token>"
SERVER_ID="108942"
SITE_NAME="<clientid>"  # bijv. "bakker01"
DOMAIN="${SITE_NAME}.compassdigital.nl"

# Site aanmaken in Ploi
curl -X POST "https://ploi.io/api/servers/$SERVER_ID/sites" \
  -H "Authorization: Bearer $PLOI_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"root_domain\": \"$DOMAIN\",
    \"web_directory\": \"/public\",
    \"project_type\": \"nodejs\"
  }"
# Noteer de SITE_ID uit het response
```

#### 1.2 Cloudflare DNS Record

```bash
CF_TOKEN="<cloudflare_api_token>"
CF_ZONE_ID="<zone_id_voor_compassdigital.nl>"

curl -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"A\",
    \"name\": \"$SITE_NAME\",
    \"content\": \"89.167.61.95\",
    \"proxied\": false,
    \"ttl\": 1
  }"
```

> **Belangrijk:** `proxied: false` — Cloudflare proxy UIT, anders werkt SSL certificaat aanvraag niet.

#### 1.3 Database aanmaken op Railway

```bash
# Via node script (geen psql op server)
node -e "
const { Client } = require('pg');
const c = new Client({
  connectionString: 'postgresql://postgres:<password>@shinkansen.proxy.rlwy.net:29352/railway'
});
c.connect().then(async () => {
  await c.query('CREATE DATABASE client_${SITE_NAME}');
  console.log('Database client_${SITE_NAME} aangemaakt');
  await c.end();
});
"
```

---

### FASE 2: Repository & Configuratie

#### 2.1 Git Clone

```bash
cd /home/ploi
git clone git@github.com:compassdigitalnl/compassdigital-cms.git ${DOMAIN}
cd ${DOMAIN}
```

#### 2.2 .well-known Directory aanmaken (VOOR SSL!)

```bash
mkdir -p /home/ploi/${DOMAIN}/.well-known/acme-challenge
```

> **KRITIEK:** Dit MOET gebeuren VOOR de SSL certificaat aanvraag.
> Zonder deze directory faalt de ACME challenge met een 404 error.
> Oorzaak: Nginx serveert `.well-known` files vanuit de site root, maar de directory bestaat niet standaard.

#### 2.3 .env Bestand Aanmaken

```bash
cat > /home/ploi/${DOMAIN}/.env << 'ENVEOF'
# === Core ===
NODE_ENV=production
PORT=<NEXT_PORT>
PAYLOAD_SECRET=<RANDOM_SECRET>
DATABASE_URL=postgresql://postgres:<password>@shinkansen.proxy.rlwy.net:29352/client_<SITE_NAME>
NEXT_TELEMETRY_DISABLED=1

# === Client Identity ===
CLIENT_ID=<SITE_NAME>
NEXT_PUBLIC_CLIENT_ID=<SITE_NAME>
CLIENT_NAME=<BEDRIJFSNAAM>
SITE_NAME=<VOLLEDIGE_SITE_NAAM>
NEXT_PUBLIC_SERVER_URL=https://<SITE_NAME>.compassdigital.nl
PRIMARY_COLOR=<HEX_KLEUR>
TEMPLATE_ID=<TEMPLATE>
SHOP_MODEL=<b2c|b2b|hybrid>
ECOMMERCE_ENABLED=true

# === Meilisearch ===
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_MASTER_KEY=73230c8587a64d716617585c6439bafe
NEXT_PUBLIC_MEILISEARCH_KEY=cec27d7bc86e8be941027a1c78e2eeaf7b20f46581f1bbc35d23abf8a18adeab
MEILISEARCH_PRODUCTS_INDEX=<SITE_NAME>_products
MEILISEARCH_BLOG_INDEX=<SITE_NAME>_blog-posts
MEILISEARCH_PAGES_INDEX=<SITE_NAME>_pages

# === Feature Flags ===
ENABLE_PLATFORM=false
ENABLE_AI_CONTENT=false

# --- Shop Features ---
ENABLE_SHOP=true
ENABLE_CART=true
ENABLE_MINI_CART=true
ENABLE_FREE_SHIPPING_BAR=true
ENABLE_CHECKOUT=true
ENABLE_GUEST_CHECKOUT=true
ENABLE_VARIABLE_PRODUCTS=true
ENABLE_VOLUME_PRICING=false
ENABLE_COMPARE_PRODUCTS=false
ENABLE_QUICK_ORDER=false
ENABLE_RECENTLY_VIEWED=true
ENABLE_MIX_AND_MATCH=false
ENABLE_PRODUCT_REVIEWS=true
ENABLE_SEARCH=true

# --- Account Features ---
ENABLE_AUTHENTICATION=true
ENABLE_MY_ACCOUNT=true
ENABLE_ADDRESSES=true
ENABLE_INVOICES=true
ENABLE_ACCOUNT_INVOICES=true
ENABLE_ORDER_TRACKING=true
ENABLE_RETURNS=false
ENABLE_RECURRING_ORDERS=false
ENABLE_ORDER_LISTS=false
ENABLE_NOTIFICATIONS=true

# --- B2B Features ---
ENABLE_B2B=false
ENABLE_CUSTOMER_GROUPS=false
ENABLE_GROUP_PRICING=false
ENABLE_BARCODE_SCANNER=false

# --- Content Features ---
ENABLE_BLOG=true
ENABLE_FAQ=true
ENABLE_TESTIMONIALS=true
ENABLE_CASES=false
ENABLE_PARTNERS=false
ENABLE_BRANDS=true
ENABLE_SERVICES=false
ENABLE_WISHLISTS=true
ENABLE_NEWSLETTER=true

# --- Premium Features ---
ENABLE_SUBSCRIPTIONS=false
ENABLE_GIFT_VOUCHERS=false
ENABLE_LICENSES=false
ENABLE_LOYALTY=false
ENABLE_CHATBOT=false
ENABLE_MULTI_LANGUAGE=false

# --- Marketplace Features ---
ENABLE_VENDORS=false
ENABLE_VENDOR_REVIEWS=false
ENABLE_WORKSHOPS=false

# --- Industry Branches ---
ENABLE_CONSTRUCTION=false
ENABLE_HOSPITALITY=false
ENABLE_BEAUTY=false
ENVEOF
```

**Variabelen die per client MOETEN wijzigen:**

| Variabele | Voorbeeld | Toelichting |
|-----------|-----------|-------------|
| `PORT` | `4008` | Eerstvolgende vrije poort |
| `PAYLOAD_SECRET` | `<random-32-chars>` | `openssl rand -hex 32` |
| `DATABASE_URL` | `...client_bakker01` | Database naam = `client_<SITE_NAME>` |
| `CLIENT_ID` | `bakker01` | Uniek ID, lowercase, geen spaties |
| `NEXT_PUBLIC_CLIENT_ID` | `bakker01` | Zelfde als CLIENT_ID |
| `CLIENT_NAME` | `Bakkerij van Dam` | Weergavenaam |
| `SITE_NAME` | `Bakkerij van Dam` | Volledige naam |
| `NEXT_PUBLIC_SERVER_URL` | `https://bakker01.compassdigital.nl` | Publieke URL |
| `PRIMARY_COLOR` | `#8B4513` | Merk kleur (hex) |
| `TEMPLATE_ID` | `default` | Template: `default`, `beauty`, `construction`, etc. |
| `SHOP_MODEL` | `b2c` | `b2c`, `b2b`, of `hybrid` |
| `MEILISEARCH_*_INDEX` | `bakker01_products` | Prefix met SITE_NAME |
| `ENABLE_*` | `true`/`false` | Per plan/behoefte |

#### 2.4 npm Install

```bash
cd /home/ploi/${DOMAIN}
npm install --legacy-peer-deps --silent
```

> **Let op:** `--legacy-peer-deps` is vereist vanwege dependency conflicts in het project.

---

### FASE 3: Database Migratie & Build

#### 3.1 Migraties Uitvoeren

```bash
cd /home/ploi/${DOMAIN}

# Antwoord automatisch "N" op de dev-mode warning
echo "N" | npx payload migrate
```

Dit voert alle migraties uit in volgorde:
1. `baseline_schema` — Basisschema (alle tabellen, typen, relaties)
2. `sprint1_with_variable_products` — Variable products, subscriptions, blog content types
3. `add_ab_testing_collections` — AB tests, events, Meilisearch settings, branche-specifieke collecties
4. `update_settings_ecommerce_fields` — Cart template enum update, guest checkout, B2B approval
5. `fix_blogposts_duplicate_meta` — Verwijdert dubbele meta kolommen

**Verwachte output:** `Migrated: ...` voor elke migratie. Bij errors: zie [Troubleshooting](#troubleshooting).

#### 3.2 Build

```bash
cd /home/ploi/${DOMAIN}
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

> **Build duur:** 3-5 minuten. `--max-old-space-size=2048` is verplicht (server heeft beperkt geheugen).

---

### FASE 4: PM2 Process & Nginx

#### 4.1 PM2 Process Starten

```bash
# Start het process
pm2 start npm --name "${SITE_NAME}-cms" -- start \
  --cwd /home/ploi/${DOMAIN} \
  --node-args="--max-old-space-size=2048"

# Opslaan voor auto-restart bij server reboot
pm2 save

# Verifieer
pm2 list
```

#### 4.2 Nginx Configuratie

Ploi maakt automatisch een nginx vhost aan bij stap 1.1. Deze moet worden aangepast naar een reverse proxy configuratie.

De Ploi API kan nginx config updaten, of via het Ploi dashboard. De gewenste configuratie:

```nginx
location / {
    proxy_pass http://localhost:<PORT>;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

location ~ /.well-known/acme-challenge {
    allow all;
    root /home/ploi/<DOMAIN>;
}
```

---

### FASE 5: SSL Certificaat

#### 5.1 SSL Aanvragen via Certbot (Aanbevolen)

```bash
# Zorg dat .well-known directory bestaat (stap 2.2)
mkdir -p /home/ploi/${DOMAIN}/.well-known/acme-challenge

# Request certificaat (geen sudo nodig!)
certbot certonly --webroot \
  -w /home/ploi/${DOMAIN} \
  -d ${DOMAIN} \
  --non-interactive \
  --agree-tos \
  --email admin@compassdigital.nl \
  --config-dir /home/ploi/.certbot/config \
  --work-dir /home/ploi/.certbot/work \
  --logs-dir /home/ploi/.certbot/logs
```

#### 5.2 SSL Installeren via Ploi API

```bash
# Lees certificaat en key
CERT=$(cat /home/ploi/.certbot/config/live/${DOMAIN}/fullchain.pem)
KEY=$(cat /home/ploi/.certbot/config/live/${DOMAIN}/privkey.pem)

# Installeer via Ploi API (type: "custom")
node -e "
const fs = require('fs');
const https = require('https');
const cert = fs.readFileSync('/home/ploi/.certbot/config/live/${DOMAIN}/fullchain.pem', 'utf8');
const key = fs.readFileSync('/home/ploi/.certbot/config/live/${DOMAIN}/privkey.pem', 'utf8');
const data = JSON.stringify({ type: 'custom', certificate: cert, private: key });
const req = https.request({
  hostname: 'ploi.io',
  path: '/api/servers/${SERVER_ID}/sites/${SITE_ID}/certificates',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${PLOI_TOKEN}',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => { let b=''; res.on('data',d=>b+=d); res.on('end',()=>console.log(b)); });
req.write(data);
req.end();
"
```

> **Waarom niet direct via Ploi `letsencrypt` type?**
> Ploi's ingebouwde certbot gebruikt `/etc/letsencrypt/` (vereist sudo). Onze aanpak gebruikt
> `/home/ploi/.certbot/` (user-writable), verkrijgt het cert, en installeert het als custom cert via de API.

#### 5.3 SSL Certificaat Vernieuwen

Certificaten verlopen na 90 dagen. Automatische vernieuwing instellen:

```bash
# Cron job voor auto-renewal (via Ploi of handmatig)
0 3 * * * certbot renew --config-dir /home/ploi/.certbot/config --work-dir /home/ploi/.certbot/work --logs-dir /home/ploi/.certbot/logs --quiet
```

---

### FASE 6: Demo Content Seeden

#### 6.1 Seed Script Configuratie

Het seed script staat in `/home/ploi/seed-demos.mjs`. Om een nieuwe site toe te voegen, voeg een entry toe aan het `SITES` object:

```javascript
bakker01: {
  port: 4008,
  name: 'Bakkerij van Dam',
  tagline: 'Ambachtelijk brood & banket',
  description: 'Vers gebakken brood en ambachtelijk banket uit het hart van Utrecht.',
  email: 'info@bakkerijvandam.nl',
  phone: '030-1234567',
  street: 'Oudegracht 123',
  postalCode: '3511 AB',
  city: 'Utrecht',
  primaryColor: '#8B4513',
  accentColor: '#D2691E',
  categories: ['Brood', 'Banket', 'Taarten', 'Koffie & Thee'],
  products: [
    { title: 'Desem Volkoren', slug: 'desem-volkoren', sku: 'BAK-BR-001', price: 4.50, stock: 25, shortDescription: 'Ambachtelijk desembrood van 100% volkoren meel.' },
    // ... meer producten
  ],
  blogPosts: [
    { title: 'Het Geheim van Perfect Zuurdesembrood', slug: 'geheim-zuurdesembrood', excerpt: 'Leer de basis van zuurdesem bakken.', emoji: '🍞' },
  ],
  testimonials: [
    { name: 'Jan Bakker', text: 'Het beste brood van Utrecht!', role: 'Vaste klant' },
  ],
  faqs: [
    { question: 'Zijn jullie producten biologisch?', answer: 'Ja, wij gebruiken uitsluitend biologische ingrediënten.' },
  ],
  pages: {
    home: { title: 'Bakkerij van Dam - Ambachtelijk brood & banket' },
    about: { title: 'Over Ons - Bakkerij van Dam' },
    contact: { title: 'Contact - Bakkerij van Dam' }
  }
}
```

#### 6.2 Seed Uitvoeren

```bash
# Enkele site seeden
node /home/ploi/seed-demos.mjs bakker01

# Alle sites seeden
node /home/ploi/seed-demos.mjs all
```

#### 6.3 Wat het Seed Script Aanmaakt

| Stap | Actie | API Endpoint |
|------|-------|-------------|
| 1 | Admin gebruiker | `POST /api/users/first-register/` |
| 2 | Inloggen (JWT token) | `POST /api/users/login/` |
| 3 | Settings global | `POST /api/globals/settings/` |
| 4 | Theme global | `POST /api/globals/theme/` |
| 5 | Header global | `POST /api/globals/header/` |
| 6 | Footer global | `POST /api/globals/footer/` |
| 7 | Blog categorieën (4x) | `POST /api/blog-categories/` |
| 8 | Product categorieën (4x) | `POST /api/product-categories/` |
| 9 | Producten (3-6x) | `POST /api/products/` |
| 10 | Blog posts (3x) | `POST /api/blog-posts/` |
| 11 | Testimonials (2x) | `POST /api/testimonials/` |
| 12 | FAQs (2x) | `POST /api/faqs/` |
| 13 | Pagina's (Home, About, Contact) | `POST /api/pages/` |

**Admin credentials (alle demo sites):**
- Email: `admin@<SITE_NAME>.compassdigital.nl`
- Wachtwoord: `Demo2026!Secure`

---

### FASE 7: Verificatie

```bash
DOMAIN="<SITE_NAME>.compassdigital.nl"

# 1. PM2 process draait
pm2 show <SITE_NAME>-cms

# 2. HTTP response
curl -s -o /dev/null -w "%{http_code}" "http://localhost:<PORT>/admin/"
# Verwacht: 200

# 3. HTTPS werkt
curl -s -o /dev/null -w "%{http_code}" "https://${DOMAIN}/admin/"
# Verwacht: 200 of 308 (redirect naar /admin/)

# 4. Admin login werkt
curl -s -X POST "http://localhost:<PORT>/api/users/login/" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@'${DOMAIN}'","password":"Demo2026!Secure"}' | head -c 100
# Verwacht: JSON met "token"

# 5. Database migraties compleet
node -e "
const { Client } = require('pg');
const c = new Client({ connectionString: '<DATABASE_URL>' });
c.connect().then(async () => {
  const r = await c.query('SELECT name FROM payload_migrations ORDER BY created_at');
  console.log('Migraties:', r.rows.map(r => r.name).join(', '));
  await c.end();
});
"
# Verwacht: 5 migraties (baseline, sprint1, ab_testing, ecommerce, blogposts_meta)
```

---

## Compleet Provisioning Script

Onderstaand script combineert alle stappen in één uitvoerbaar script:

```bash
#!/bin/bash
# provision-site.sh — Volledige provisioning van een nieuwe CompassDigital client site
#
# Gebruik: bash provision-site.sh <client_id> <port> <client_name> <primary_color> <template_id>
# Voorbeeld: bash provision-site.sh bakker01 4008 "Bakkerij van Dam" "#8B4513" default

set -euo pipefail

# === Parameters ===
CLIENT_ID="${1:?Gebruik: provision-site.sh <client_id> <port> <client_name> <primary_color> <template_id>}"
PORT="${2:?Poort is verplicht}"
CLIENT_NAME="${3:?Bedrijfsnaam is verplicht}"
PRIMARY_COLOR="${4:-#00897B}"
TEMPLATE_ID="${5:-default}"

DOMAIN="${CLIENT_ID}.compassdigital.nl"
DB_NAME="client_${CLIENT_ID}"
DB_HOST="shinkansen.proxy.rlwy.net"
DB_PORT="29352"
DB_USER="postgres"
DB_PASS="eBTNOrSGwkADvgAVJKyQtllGSjugdtrN"
DB_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
SITE_DIR="/home/ploi/${DOMAIN}"
PLOI_TOKEN="${PLOI_TOKEN:?PLOI_TOKEN env var is verplicht}"
SERVER_ID="108942"
PAYLOAD_SECRET=$(openssl rand -hex 32)

echo "=========================================="
echo "Provisioning: ${DOMAIN}"
echo "Port: ${PORT} | DB: ${DB_NAME}"
echo "=========================================="

# --- Stap 1: Ploi Site aanmaken ---
echo "[1/10] Ploi site aanmaken..."
SITE_RESPONSE=$(curl -s -X POST "https://ploi.io/api/servers/$SERVER_ID/sites" \
  -H "Authorization: Bearer $PLOI_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"root_domain\": \"$DOMAIN\", \"web_directory\": \"/public\", \"project_type\": \"nodejs\"}")
SITE_ID=$(echo "$SITE_RESPONSE" | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); console.log(d.data?.id || 'ERROR')")
echo "  Site ID: $SITE_ID"
[ "$SITE_ID" = "ERROR" ] && echo "FOUT: Site aanmaken mislukt: $SITE_RESPONSE" && exit 1

# --- Stap 2: Cloudflare DNS ---
echo "[2/10] DNS record aanmaken..."
if [ -n "${CF_TOKEN:-}" ] && [ -n "${CF_ZONE_ID:-}" ]; then
  curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records" \
    -H "Authorization: Bearer $CF_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"type\":\"A\",\"name\":\"$CLIENT_ID\",\"content\":\"89.167.61.95\",\"proxied\":false,\"ttl\":1}" > /dev/null
  echo "  DNS A-record aangemaakt"
else
  echo "  SKIP: CF_TOKEN of CF_ZONE_ID niet gezet — handmatig DNS instellen"
fi

# --- Stap 3: Database aanmaken ---
echo "[3/10] Database aanmaken..."
node -e "
const { Client } = require('pg');
const c = new Client({ connectionString: 'postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/railway' });
c.connect().then(async () => {
  const exists = await c.query(\"SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'\");
  if (exists.rows.length === 0) {
    await c.query('CREATE DATABASE ${DB_NAME}');
    console.log('  Database ${DB_NAME} aangemaakt');
  } else {
    console.log('  Database ${DB_NAME} bestaat al');
  }
  await c.end();
}).catch(e => { console.error('  FOUT:', e.message); process.exit(1); });
"

# --- Stap 4: Git clone ---
echo "[4/10] Repository clonen..."
if [ -d "$SITE_DIR" ]; then
  echo "  Directory bestaat al, git pull..."
  cd "$SITE_DIR" && git pull origin main
else
  git clone git@github.com:compassdigitalnl/compassdigital-cms.git "$SITE_DIR"
fi

# --- Stap 5: .well-known + .env ---
echo "[5/10] Configuratie schrijven..."
mkdir -p "${SITE_DIR}/.well-known/acme-challenge"

cat > "${SITE_DIR}/.env" << ENVEOF
NODE_ENV=production
PORT=${PORT}
PAYLOAD_SECRET=${PAYLOAD_SECRET}
DATABASE_URL=${DB_URL}
NEXT_TELEMETRY_DISABLED=1

CLIENT_ID=${CLIENT_ID}
NEXT_PUBLIC_CLIENT_ID=${CLIENT_ID}
CLIENT_NAME=${CLIENT_NAME}
SITE_NAME=${CLIENT_NAME}
NEXT_PUBLIC_SERVER_URL=https://${DOMAIN}
PRIMARY_COLOR=${PRIMARY_COLOR}
TEMPLATE_ID=${TEMPLATE_ID}
SHOP_MODEL=b2c
ECOMMERCE_ENABLED=true

MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_MASTER_KEY=73230c8587a64d716617585c6439bafe
NEXT_PUBLIC_MEILISEARCH_KEY=cec27d7bc86e8be941027a1c78e2eeaf7b20f46581f1bbc35d23abf8a18adeab
MEILISEARCH_PRODUCTS_INDEX=${CLIENT_ID}_products
MEILISEARCH_BLOG_INDEX=${CLIENT_ID}_blog-posts
MEILISEARCH_PAGES_INDEX=${CLIENT_ID}_pages

ENABLE_PLATFORM=false
ENABLE_AI_CONTENT=false
ENABLE_SHOP=true
ENABLE_CART=true
ENABLE_MINI_CART=true
ENABLE_FREE_SHIPPING_BAR=true
ENABLE_CHECKOUT=true
ENABLE_GUEST_CHECKOUT=true
ENABLE_VARIABLE_PRODUCTS=true
ENABLE_VOLUME_PRICING=false
ENABLE_COMPARE_PRODUCTS=false
ENABLE_QUICK_ORDER=false
ENABLE_RECENTLY_VIEWED=true
ENABLE_MIX_AND_MATCH=false
ENABLE_PRODUCT_REVIEWS=true
ENABLE_SEARCH=true
ENABLE_AUTHENTICATION=true
ENABLE_MY_ACCOUNT=true
ENABLE_ADDRESSES=true
ENABLE_INVOICES=true
ENABLE_ACCOUNT_INVOICES=true
ENABLE_ORDER_TRACKING=true
ENABLE_RETURNS=false
ENABLE_RECURRING_ORDERS=false
ENABLE_ORDER_LISTS=false
ENABLE_NOTIFICATIONS=true
ENABLE_B2B=false
ENABLE_CUSTOMER_GROUPS=false
ENABLE_GROUP_PRICING=false
ENABLE_BARCODE_SCANNER=false
ENABLE_BLOG=true
ENABLE_FAQ=true
ENABLE_TESTIMONIALS=true
ENABLE_CASES=false
ENABLE_PARTNERS=false
ENABLE_BRANDS=true
ENABLE_SERVICES=false
ENABLE_WISHLISTS=true
ENABLE_NEWSLETTER=true
ENABLE_SUBSCRIPTIONS=false
ENABLE_GIFT_VOUCHERS=false
ENABLE_LICENSES=false
ENABLE_LOYALTY=false
ENABLE_CHATBOT=false
ENABLE_MULTI_LANGUAGE=false
ENABLE_VENDORS=false
ENABLE_VENDOR_REVIEWS=false
ENABLE_WORKSHOPS=false
ENABLE_CONSTRUCTION=false
ENABLE_HOSPITALITY=false
ENABLE_BEAUTY=false
ENVEOF
echo "  .env geschreven"

# --- Stap 6: npm install ---
echo "[6/10] npm install..."
cd "$SITE_DIR"
npm install --legacy-peer-deps --silent 2>&1 | tail -1

# --- Stap 7: Database migraties ---
echo "[7/10] Database migraties..."
cd "$SITE_DIR"
echo "N" | npx payload migrate 2>&1 | grep -E "Migrat|ERROR"

# --- Stap 8: Build ---
echo "[8/10] Next.js build..."
cd "$SITE_DIR"
NODE_OPTIONS="--max-old-space-size=2048" npm run build 2>&1 | tail -3

# --- Stap 9: PM2 process starten ---
echo "[9/10] PM2 process starten..."
pm2 start npm --name "${CLIENT_ID}-cms" -- start -- --port ${PORT} \
  2>&1 | grep -E "online|error"
pm2 save 2>/dev/null

echo "  Wacht 10 seconden op startup..."
sleep 10

# --- Stap 10: SSL certificaat ---
echo "[10/10] SSL certificaat..."
mkdir -p /home/ploi/.certbot/{config,work,logs}

# Wacht tot DNS propageert (max 60 seconden)
for i in $(seq 1 6); do
  DNS_IP=$(dig +short ${DOMAIN} 2>/dev/null)
  [ "$DNS_IP" = "89.167.61.95" ] && break
  echo "  Wacht op DNS propagatie... (poging $i/6)"
  sleep 10
done

certbot certonly --webroot \
  -w "${SITE_DIR}" \
  -d "${DOMAIN}" \
  --non-interactive \
  --agree-tos \
  --email admin@compassdigital.nl \
  --config-dir /home/ploi/.certbot/config \
  --work-dir /home/ploi/.certbot/work \
  --logs-dir /home/ploi/.certbot/logs 2>&1 | grep -E "Success|error|failed"

# Installeer cert via Ploi API
node -e "
const fs = require('fs');
const https = require('https');
try {
  const cert = fs.readFileSync('/home/ploi/.certbot/config/live/${DOMAIN}/fullchain.pem', 'utf8');
  const key = fs.readFileSync('/home/ploi/.certbot/config/live/${DOMAIN}/privkey.pem', 'utf8');
  const data = JSON.stringify({ type: 'custom', certificate: cert, private: key });
  const req = https.request({
    hostname: 'ploi.io',
    path: '/api/servers/${SERVER_ID}/sites/${SITE_ID}/certificates',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ${PLOI_TOKEN}',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  }, (res) => {
    let b = '';
    res.on('data', d => b += d);
    res.on('end', () => {
      const r = JSON.parse(b);
      console.log(r.data ? '  SSL geinstalleerd (ID: ' + r.data.id + ')' : '  SSL FOUT: ' + JSON.stringify(r));
    });
  });
  req.write(data);
  req.end();
} catch (e) {
  console.log('  SSL FOUT: ' + e.message);
}
"

sleep 5

# === Klaar ===
echo ""
echo "=========================================="
echo "PROVISIONING COMPLEET: ${DOMAIN}"
echo "=========================================="
echo "Admin URL:  https://${DOMAIN}/admin/"
echo "Port:       ${PORT}"
echo "Database:   ${DB_NAME}"
echo "PM2:        ${CLIENT_ID}-cms"
echo ""
echo "Volgende stappen:"
echo "  1. Voeg site toe aan seed-demos.mjs"
echo "  2. Run: node /home/ploi/seed-demos.mjs ${CLIENT_ID}"
echo "  3. Login: admin@${DOMAIN} / Demo2026!Secure"
echo "=========================================="
```

---

## Feature Flag Presets per Branche

### B2C Webshop (beauty, food, retail)
```env
ENABLE_SHOP=true
ENABLE_CART=true
ENABLE_CHECKOUT=true
ENABLE_B2B=false
ENABLE_LOYALTY=true
ENABLE_WISHLISTS=true
ENABLE_PRODUCT_REVIEWS=true
```

### B2B Platform (construction, wholesale)
```env
ENABLE_SHOP=true
ENABLE_CART=true
ENABLE_CHECKOUT=true
ENABLE_B2B=true
ENABLE_CUSTOMER_GROUPS=true
ENABLE_GROUP_PRICING=true
ENABLE_QUICK_ORDER=true
ENABLE_ORDER_LISTS=true
ENABLE_RECURRING_ORDERS=true
ENABLE_INVOICES=true
```

### Content Platform (magazine, kennis, blog)
```env
ENABLE_SHOP=false
ENABLE_CART=false
ENABLE_CHECKOUT=false
ENABLE_BLOG=true
ENABLE_FAQ=true
ENABLE_NEWSLETTER=true
ENABLE_SUBSCRIPTIONS=true
ENABLE_AUTHENTICATION=true
```

### Beauty / Hospitality
```env
ENABLE_SHOP=true
ENABLE_BEAUTY=true        # of ENABLE_HOSPITALITY=true
ENABLE_SERVICES=true
ENABLE_WISHLISTS=true
ENABLE_LOYALTY=true
ENABLE_PRODUCT_REVIEWS=true
```

---

## Beschikbare Homepage Blocks

De volgende blocks kunnen worden gebruikt in pagina layouts (in het `layout` array van Pages):

| Block Slug | Doel | Belangrijke Velden |
|------------|------|-------------------|
| `hero` | Hero banner bovenaan pagina | `heading`, `subheading`, `backgroundImage`, `style`, `layout` |
| `content` | Rich text content (Lexical) | `columns[].richText`, `columns[].size` |
| `features` | Feature/USP grid | `features[].title`, `features[].description`, `features[].icon`, `layout`, `style` |
| `cta` | Call-to-action blok | `heading`, `subheading`, `buttonText`, `buttonLink`, `style` |
| `faq` | FAQ sectie | `heading`, `faqs[]`, `source` (manual/collection), `category` |
| `testimonials` | Klantervaringen | `heading`, `source` (manual/collection), `layout` |
| `contactForm` | Contact formulier | `heading`, `subheading`, `fields` |
| `productGrid` | Product weergave | `heading`, `source`, `layout`, `displayMode` |
| `blog-preview` | Blog preview sectie | `heading`, `layout`, `limit` |
| `stats` | Statistieken/cijfers | `stats[].value`, `stats[].label`, `stats[].icon`, `layout` |
| `spacer` | Verticale ruimte | `height` (sm/md/lg/xl) |
| `two-column` | Twee-koloms layout | `leftContent`, `rightContent`, `ratio`, `alignment` |
| `image-gallery` | Afbeelding galerij | `images[]`, `layout`, `columns` |
| `map` | Google Maps embed | `address`, `height` |
| `video` | Video embed | `url`, `aspectRatio` |
| `logo-bar` | Logo/partner carousel | `logos[]`, `displayMode`, `layout` |

---

## Theme Variabelen

Het Theme global (`/api/globals/theme/`) bevat alle visuele instellingen:

### Kleuren
```json
{
  "primaryColor": "#00897B",
  "primaryLight": "#4db6ac",
  "primaryGlow": "rgba(0,137,123,0.15)",
  "secondaryColor": "#FF6B35",
  "secondaryLight": "#ff9a76",
  "accentColor": "#FFD700",
  "successColor": "#10B981",
  "warningColor": "#F59E0B",
  "errorColor": "#EF4444",
  "backgroundColor": "#F5F7FA",
  "surfaceColor": "#ffffff",
  "textColor": "#1a1a2e",
  "textLight": "#6B7280",
  "borderColor": "#E8ECF1",
  "greyLight": "#f3f4f6",
  "greyMid": "#9ca3af",
  "greyDark": "#374151"
}
```

### Typografie
```json
{
  "fontFamily": "Inter, sans-serif",
  "headingFont": "Inter, sans-serif",
  "fontSizeBase": "16px",
  "lineHeightBase": "1.6",
  "headingWeight": "700",
  "bodyWeight": "400"
}
```

### Layout & Effecten
```json
{
  "borderRadius": "8px",
  "borderRadiusLarge": "16px",
  "shadowSmall": "0 1px 3px rgba(0,0,0,0.1)",
  "shadowMedium": "0 4px 12px rgba(0,0,0,0.1)",
  "shadowLarge": "0 8px 30px rgba(0,0,0,0.12)",
  "transitionSpeed": "200ms",
  "containerWidth": "1280px",
  "headerHeight": "72px"
}
```

---

## Database Schema Migraties

De database wordt automatisch opgezet via Payload migraties. Huidige migraties:

| # | Naam | Beschrijving |
|---|------|-------------|
| 1 | `baseline_schema` | Alle basis tabellen: users, pages, media, products, orders, settings, header, footer, theme, etc. |
| 2 | `sprint1_with_variable_products` | Variable products, product varianten, subscriptions, blog content types, etc. |
| 3 | `add_ab_testing_collections` | AB tests, events, Meilisearch settings, branche collecties (treatments, beauty_services, menu_items, etc.) |
| 4 | `update_settings_ecommerce_fields` | Cart template enum update, guest checkout, B2B approval boolean fields |
| 5 | `fix_blogposts_duplicate_meta` | Verwijdert dubbele meta_title/meta_description kolommen uit blog_posts |

### Belangrijke Database Tabellen

| Tabel | Beschrijving |
|-------|-------------|
| `users` | Gebruikers (admin + klanten) |
| `pages` | CMS pagina's met block layouts |
| `products` | Webshop producten |
| `products_variant_options` | Productvariant opties (maat, kleur) |
| `product_categories` | Product categorieën |
| `blog_posts` | Blog artikelen |
| `blog_categories` | Blog categorieën |
| `orders` | Bestellingen |
| `settings` | Site-instellingen (global) |
| `header` | Header configuratie (global) |
| `footer` | Footer configuratie (global) |
| `theme` | Theme/visuele instellingen (global) |
| `media` | Uploads/afbeeldingen |
| `testimonials` | Klantervaringen |
| `faqs` | Veelgestelde vragen |
| `payload_migrations` | Migratie tracking |

---

## Troubleshooting

### SSL Certificaat Faalt (404 op ACME Challenge)

**Oorzaak:** De `.well-known/acme-challenge/` directory bestaat niet in de site root.

**Oplossing:**
```bash
mkdir -p /home/ploi/<DOMAIN>/.well-known/acme-challenge
```

### Migratie Faalt: "type already exists"

**Oorzaak:** Eerdere handmatige ALTER TABLE / CREATE TYPE statements conflicteren met migratie.

**Oplossing:** Reset database en hermigreer:
```bash
# Via Railway database
node -e "
const { Client } = require('pg');
const c = new Client({ connectionString: '...railway' });
c.connect().then(async () => {
  await c.query(\"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'client_<SITE>' AND pid <> pg_backend_pid()\");
  await c.query('DROP DATABASE IF EXISTS client_<SITE>');
  await c.query('CREATE DATABASE client_<SITE>');
  await c.end();
});
"

# Dan opnieuw migraties draaien
cd /home/ploi/<DOMAIN>
echo "N" | npx payload migrate
```

### Build Faalt: Out of Memory

**Oorzaak:** Server geheugen limiet.

**Oplossing:** Altijd `NODE_OPTIONS="--max-old-space-size=2048"` gebruiken. Bouw max 2-3 sites tegelijk.

### PM2 Process Crasht Herhaaldelijk

**Diagnose:**
```bash
pm2 logs <process-name> --lines 50
```

**Veelvoorkomende oorzaken:**
- Verkeerde PORT in .env (conflict met ander process)
- DATABASE_URL onjuist
- Migraties niet uitgevoerd (schema mismatch)

### Payload API Geeft 308 Redirect

**Oorzaak:** Payload vereist trailing slashes op alle API endpoints.

**Oplossing:** Altijd `/` aan het einde van API paden toevoegen:
```
/api/products/    ← correct
/api/products     ← fout (308 redirect, POST body verloren)
```

### Globals Updaten Geeft 404

**Oorzaak:** Payload globals gebruiken POST, niet PATCH.

**Oplossing:** `POST /api/globals/settings/` (niet PATCH).

---

## Deploy Workflow (Na Code Wijzigingen)

Na een git push naar main, moeten ALLE sites gedeployed worden:

```bash
# Snelle deploy voor alle sites
SITES=(
  "/home/ploi/cms.compassdigital.nl"
  "/home/ploi/plastimed01.compassdigital.nl"
  "/home/ploi/aboland01.compassdigital.nl"
  "/home/ploi/beauty01.compassdigital.nl"
  "/home/ploi/construction01.compassdigital.nl"
  "/home/ploi/content01.compassdigital.nl"
  "/home/ploi/horeca01.compassdigital.nl"
  "/home/ploi/hospitality01.compassdigital.nl"
)

# 1. Git pull op alle sites
for dir in "${SITES[@]}"; do
  echo "Pull: $dir"
  cd "$dir" && git pull origin main &
done
wait

# 2. Build alle sites (parallel, max 3 tegelijk)
for dir in "${SITES[@]}"; do
  echo "Build: $dir"
  cd "$dir" && NODE_OPTIONS="--max-old-space-size=2048" npm run build &
  # Max 3 parallel builds (geheugen limiet)
  [ $(jobs -r | wc -l) -ge 3 ] && wait -n
done
wait

# 3. Restart alle PM2 processen
pm2 restart all
```

---

## Referenties

- **Ploi API Docs:** https://developers.ploi.io
- **Payload CMS Docs:** https://payloadcms.com/docs
- **Let's Encrypt:** https://letsencrypt.org
- **Seed Script:** `/home/ploi/seed-demos.mjs`
- **Feature System:** `src/lib/features.ts`
- **Provisioning Script:** `/home/ploi/cms.compassdigital.nl/docs/setup/provision-site.sh`
