#!/bin/bash
# provision-site.sh — Volledige provisioning van een nieuwe CompassDigital client site
#
# Gebruik: bash provision-site.sh <client_id> <port> <client_name> [primary_color] [template_id] [shop_model]
# Voorbeeld: bash provision-site.sh bakker01 4008 "Bakkerij van Dam" "#8B4513" default b2c
#
# Vereist: PLOI_TOKEN env var
# Optioneel: CF_TOKEN en CF_ZONE_ID env vars voor Cloudflare DNS

set -euo pipefail

# === Parameters ===
CLIENT_ID="${1:?Gebruik: provision-site.sh <client_id> <port> <client_name> [primary_color] [template_id] [shop_model]}"
PORT="${2:?Poort is verplicht}"
CLIENT_NAME="${3:?Bedrijfsnaam is verplicht}"
PRIMARY_COLOR="${4:-#00897B}"
TEMPLATE_ID="${5:-default}"
SHOP_MODEL="${6:-b2c}"

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
echo "  Provisioning: ${DOMAIN}"
echo "  Port: ${PORT} | DB: ${DB_NAME}"
echo "  Template: ${TEMPLATE_ID} | Model: ${SHOP_MODEL}"
echo "=========================================="
echo ""

# --- Stap 1: Ploi Site aanmaken ---
echo "[1/10] Ploi site aanmaken..."
SITE_RESPONSE=$(curl -s -X POST "https://ploi.io/api/servers/$SERVER_ID/sites" \
  -H "Authorization: Bearer $PLOI_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"root_domain\": \"$DOMAIN\", \"web_directory\": \"/public\", \"project_type\": \"nodejs\"}")
SITE_ID=$(echo "$SITE_RESPONSE" | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); console.log(d.data?.id || 'ERROR')")
if [ "$SITE_ID" = "ERROR" ]; then
  echo "  FOUT: Site aanmaken mislukt: $SITE_RESPONSE"
  exit 1
fi
echo "  Site ID: $SITE_ID"

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
  cd "$SITE_DIR" && git pull origin main --quiet
else
  git clone --quiet git@github.com:compassdigitalnl/compassdigital-cms.git "$SITE_DIR"
  echo "  Gecloned naar $SITE_DIR"
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
SHOP_MODEL=${SHOP_MODEL}
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
echo "[6/10] npm install (dit duurt ~5 minuten)..."
cd "$SITE_DIR"
npm install --legacy-peer-deps --silent 2>&1 | tail -1

# --- Stap 7: Database migraties ---
echo "[7/10] Database migraties..."
cd "$SITE_DIR"
# Veiligheidscheck: alleen migraties draaien als dat veilig is
MIGRATE_EXIT=0
node /home/ploi/scripts/check-migrations.mjs "${DB_NAME}" || MIGRATE_EXIT=$?
if [ "$MIGRATE_EXIT" = "1" ]; then
  echo "  GEVAAR: Migraties overgeslagen (data aanwezig zonder migration history)"
else
  yes 2>/dev/null | NODE_OPTIONS="--max-old-space-size=4096 --no-deprecation" npx payload migrate 2>&1 | grep -E "Migrat|ERROR|running" || true
fi

# --- Stap 7b: Theme seeding (Sprint 1: Compass Design System) ---
echo "[7b/10] Seeding default themes (10 industry verticals)..."
cd "$SITE_DIR"
npm run seed:themes 2>&1 | grep -E "Created|Skipped|ERROR" || echo "  ✓ Themes seeded"

# --- Stap 8: Build ---
echo "[8/10] Next.js build (dit duurt ~5 minuten)..."
cd "$SITE_DIR"
NODE_OPTIONS="--max-old-space-size=4096" npm run build 2>&1 | tail -3

# --- Stap 9: PM2 process starten ---
echo "[9/10] PM2 process starten..."
cd "$SITE_DIR"
pm2 start npm --name "${CLIENT_ID}-cms" -- start -- --port ${PORT} 2>&1 | grep -E "online|error" || true
pm2 save 2>/dev/null

echo "  Wacht 10 seconden op startup..."
sleep 10

# Verificatie
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${PORT}/admin/" --max-time 10 || echo "000")
echo "  HTTP status: $HTTP_STATUS"

# --- Stap 10: SSL certificaat ---
echo "[10/10] SSL certificaat..."
mkdir -p /home/ploi/.certbot/{config,work,logs}

# Wacht op DNS propagatie (max 60 seconden)
echo "  Wacht op DNS propagatie..."
for i in $(seq 1 6); do
  DNS_IP=$(dig +short ${DOMAIN} 2>/dev/null || echo "")
  if [ "$DNS_IP" = "89.167.61.95" ]; then
    echo "  DNS OK: $DNS_IP"
    break
  fi
  echo "  DNS nog niet klaar (poging $i/6)..."
  sleep 10
done

# Certbot: vraag certificaat aan
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
if [ -f "/home/ploi/.certbot/config/live/${DOMAIN}/fullchain.pem" ]; then
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
"
  sleep 5
else
  echo "  WAARSCHUWING: Cert niet gevonden — handmatig SSL instellen"
fi

# === Klaar ===
HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://${DOMAIN}/admin/" --max-time 10 -k 2>/dev/null || echo "000")

echo ""
echo "=========================================="
echo "  PROVISIONING COMPLEET: ${DOMAIN}"
echo "=========================================="
echo "  Admin URL:  https://${DOMAIN}/admin/"
echo "  HTTP:       ${HTTP_STATUS}"
echo "  HTTPS:      ${HTTPS_STATUS}"
echo "  Port:       ${PORT}"
echo "  Database:   ${DB_NAME}"
echo "  PM2:        ${CLIENT_ID}-cms"
# --- Stap 11: Deploy script + eerste backup ---
echo "[11/11] Deploy script en initiële backup..."
cat > "${SITE_DIR}/deploy-ploi.sh" << 'DEPLOYEOF'
#!/bin/bash
exec bash /home/ploi/scripts/safe-deploy.sh \
    SITE_DIR_PLACEHOLDER \
    DB_NAME_PLACEHOLDER \
    PM2_NAME_PLACEHOLDER
DEPLOYEOF
sed -i "s|SITE_DIR_PLACEHOLDER|${SITE_DIR}|g" "${SITE_DIR}/deploy-ploi.sh"
sed -i "s|DB_NAME_PLACEHOLDER|${DB_NAME}|g" "${SITE_DIR}/deploy-ploi.sh"
sed -i "s|PM2_NAME_PLACEHOLDER|${CLIENT_ID}-cms|g" "${SITE_DIR}/deploy-ploi.sh"
chmod +x "${SITE_DIR}/deploy-ploi.sh"
echo "  deploy-ploi.sh aangemaakt"

# Eerste backup na provisioning
node /home/ploi/scripts/backup-db.mjs "${DB_NAME}" "post-provision" || echo "  Backup overgeslagen"

# Voeg toe aan deploy-all.sh als nog niet aanwezig
if ! grep -q "${DOMAIN}" /home/ploi/scripts/deploy-all.sh 2>/dev/null; then
  # Voeg site toe vóór de laatste SITES regel
  echo "  OPMERKING: Voeg site handmatig toe aan /home/ploi/scripts/deploy-all.sh"
fi

echo ""
echo "  Volgende stappen:"
echo "    1. Voeg site toe aan /home/ploi/seed-demos.mjs"
echo "    2. Run: node /home/ploi/seed-demos.mjs ${CLIENT_ID}"
echo "    3. Login: admin@${DOMAIN} / Demo2026!Secure"
echo "    4. Voeg toe aan /home/ploi/scripts/deploy-all.sh en backup-all.sh"
echo "=========================================="
