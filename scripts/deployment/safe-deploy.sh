#!/bin/bash
# safe-deploy.sh — Veilige deployment voor Payload CMS client sites
#
# Usage: bash /home/ploi/scripts/safe-deploy.sh <site_dir> <db_name> <pm2_name>
# Voorbeeld: bash /home/ploi/scripts/safe-deploy.sh \
#   /home/ploi/plastimed01.compassdigital.nl \
#   client_plastimed01 \
#   payload-cms

set -euo pipefail

SITE_DIR="${1:?Usage: safe-deploy.sh <site_dir> <db_name> <pm2_name>}"
DB_NAME="${2:?Usage: safe-deploy.sh <site_dir> <db_name> <pm2_name>}"
PM2_NAME="${3:?Usage: safe-deploy.sh <site_dir> <db_name> <pm2_name>}"

SCRIPTS_DIR="/home/ploi/scripts"
SITE_NAME=$(basename "${SITE_DIR}")

echo "=============================================="
echo "[deploy] Veilige deploy: ${SITE_NAME}"
echo "[deploy] Database: ${DB_NAME}"
echo "[deploy] PM2: ${PM2_NAME}"
echo "[deploy] Tijd: $(date)"
echo "=============================================="

# -----------------------------------------------------------
# STAP 1: Pre-deploy backup
# -----------------------------------------------------------
echo ""
echo "[deploy] Stap 1/8: Pre-deploy backup..."
node "${SCRIPTS_DIR}/backup-db.mjs" "${DB_NAME}" "pre-deploy" || {
    echo "[deploy] FATAAL: Backup mislukt. Deploy afgebroken!"
    exit 1
}

# -----------------------------------------------------------
# STAP 2: Migration safety check (overgeslagen — push: true)
# -----------------------------------------------------------
echo ""
echo "[deploy] Stap 2/8: Migration check overgeslagen (push: true strategie)"

# -----------------------------------------------------------
# STAP 3: Git pull
# -----------------------------------------------------------
echo ""
echo "[deploy] Stap 3/8: Git pull..."
cd "${SITE_DIR}"
git pull origin main

# -----------------------------------------------------------
# STAP 4: npm install
# -----------------------------------------------------------
echo ""
echo "[deploy] Stap 4/8: npm install..."
cd "${SITE_DIR}"
npm install --legacy-peer-deps --silent

# -----------------------------------------------------------
# STAP 5: Migraties (overgeslagen — push: true in config)
# -----------------------------------------------------------
echo ""
echo "[deploy] Stap 5/8: Migraties overgeslagen (push: true synct schema automatisch)"

# -----------------------------------------------------------
# STAP 5.5: Regenerate Payload importMap
# -----------------------------------------------------------
echo ""
echo "[deploy] Stap 5.5: ImportMap regenereren..."
cd "${SITE_DIR}"
NODE_OPTIONS="--max-old-space-size=4096 --no-deprecation" npx payload generate:importmap 2>&1 || {
    echo "[deploy] WAARSCHUWING: ImportMap generatie gefaald."
}

# -----------------------------------------------------------
# STAP 6: Build (met .env geladen voor DB-aware build)
# -----------------------------------------------------------
echo ""
echo "[deploy] Stap 6/8: Next.js build..."
cd "${SITE_DIR}"
# Laad .env zodat DATABASE_URL beschikbaar is tijdens build
if [ -f "${SITE_DIR}/.env" ]; then
    set -a
    source "${SITE_DIR}/.env"
    set +a
    echo "[deploy] .env geladen voor build"
fi
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# -----------------------------------------------------------
# STAP 7: Schema sync (push database schema)
# -----------------------------------------------------------
echo ""
echo "[deploy] Stap 7/8: Schema sync..."
cd "${SITE_DIR}"
# .env is al geladen in stap 6 — DATABASE_URL is beschikbaar
NODE_OPTIONS="--max-old-space-size=4096 --no-deprecation" npx tsx src/scripts/schema-push.ts 2>&1 || {
    echo "[deploy] WAARSCHUWING: Schema sync gefaald — site start mogelijk met ontbrekende kolommen"
}

# -----------------------------------------------------------
# STAP 8: Restart PM2 (met correcte PORT uit .env)
# -----------------------------------------------------------
echo ""
echo "[deploy] Stap 8/8: PM2 herstarten..."

# Lees PORT uit .env file (fallback naar 3020)
if [ -f "${SITE_DIR}/.env" ]; then
    PORT=$(grep -E "^PORT=" "${SITE_DIR}/.env" | cut -d '=' -f2 || echo "3020")
    echo "[deploy] PORT uit .env: ${PORT}"
else
    PORT="3020"
    echo "[deploy] WAARSCHUWING: Geen .env gevonden, gebruik default port ${PORT}"
fi

# Stop en herstart PM2 met correcte port
# BELANGRIJK: pm2 restart pikt de PORT niet op uit .env, dus we moeten stoppen+starten
pm2 stop "${PM2_NAME}" 2>/dev/null || true
pm2 delete "${PM2_NAME}" 2>/dev/null || true
pm2 start npm --name "${PM2_NAME}" -- start -- --port "${PORT}"
pm2 save

# Wacht op startup
sleep 5

# Verificatie
if pm2 show "${PM2_NAME}" 2>/dev/null | grep -q "online"; then
    echo "[deploy] PM2 process ${PM2_NAME} is ONLINE op port ${PORT}"
else
    echo "[deploy] WAARSCHUWING: PM2 process draait mogelijk niet correct!"
fi

echo ""
echo "=============================================="
echo "[deploy] Deploy voltooid: ${SITE_NAME}"
echo "[deploy] Tijd: $(date)"
echo "=============================================="
