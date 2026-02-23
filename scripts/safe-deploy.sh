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
echo "[deploy] Stap 1/7: Pre-deploy backup..."
node "${SCRIPTS_DIR}/backup-db.mjs" "${DB_NAME}" "pre-deploy" || {
    echo "[deploy] FATAAL: Backup mislukt. Deploy afgebroken!"
    exit 1
}

# -----------------------------------------------------------
# STAP 2: Migration safety check
# -----------------------------------------------------------
echo ""
echo "[deploy] Stap 2/7: Migration veiligheidscheck..."
MIGRATE_EXIT=0
node "${SCRIPTS_DIR}/check-migrations.mjs" "${DB_NAME}" || MIGRATE_EXIT=$?

case $MIGRATE_EXIT in
    0)
        echo "[deploy] Check: VEILIG — migraties mogen draaien"
        RUN_MIGRATIONS=true
        ;;
    1)
        echo "[deploy] Check: GEVAAR — migraties worden OVERGESLAGEN!"
        echo "[deploy] Handmatige interventie nodig voordat migraties kunnen draaien."
        RUN_MIGRATIONS=false
        ;;
    2)
        echo "[deploy] Check: LEGE database — initieel setup wordt uitgevoerd"
        RUN_MIGRATIONS=true
        ;;
    *)
        echo "[deploy] Check: FOUT — migraties worden voor veiligheid overgeslagen"
        RUN_MIGRATIONS=false
        ;;
esac

# -----------------------------------------------------------
# STAP 3: Git pull
# -----------------------------------------------------------
echo ""
echo "[deploy] Stap 3/7: Git pull..."
cd "${SITE_DIR}"
git pull origin main

# -----------------------------------------------------------
# STAP 4: npm install
# -----------------------------------------------------------
echo ""
echo "[deploy] Stap 4/7: npm install..."
cd "${SITE_DIR}"
npm install --legacy-peer-deps --silent

# -----------------------------------------------------------
# STAP 5: Migraties uitvoeren (als veilig)
# -----------------------------------------------------------
echo ""
echo "[deploy] Stap 5/7: Migraties..."
if [ "${RUN_MIGRATIONS}" = true ]; then
    echo "[deploy] Migraties worden uitgevoerd..."
    cd "${SITE_DIR}"
    # Gebruik 'yes' om eventuele prompts automatisch te beantwoorden
    # maar NOOIT migrate:fresh (dat dropt alles!)
    yes 2>/dev/null | NODE_OPTIONS="--max-old-space-size=2048 --no-deprecation" npx payload migrate 2>&1 || {
        echo "[deploy] WAARSCHUWING: Migratie had problemen. Check logs."
        echo "[deploy] Post-migratie backup voor veiligheid..."
        node "${SCRIPTS_DIR}/backup-db.mjs" "${DB_NAME}" "post-migrate-error" || true
    }
else
    echo "[deploy] Migraties OVERGESLAGEN (veiligheidscheck gefaald)"
fi

# -----------------------------------------------------------
# STAP 6: Build
# -----------------------------------------------------------
echo ""
echo "[deploy] Stap 6/7: Next.js build..."
cd "${SITE_DIR}"
NODE_OPTIONS="--max-old-space-size=2048" npm run build

# -----------------------------------------------------------
# STAP 7: Restart PM2
# -----------------------------------------------------------
echo ""
echo "[deploy] Stap 7/7: PM2 herstarten..."
pm2 restart "${PM2_NAME}" --update-env

# Wacht op startup
sleep 5

# Verificatie
if pm2 show "${PM2_NAME}" 2>/dev/null | grep -q "online"; then
    echo "[deploy] PM2 process ${PM2_NAME} is ONLINE"
else
    echo "[deploy] WAARSCHUWING: PM2 process draait mogelijk niet correct!"
fi

echo ""
echo "=============================================="
echo "[deploy] Deploy voltooid: ${SITE_NAME}"
echo "[deploy] Tijd: $(date)"
echo "=============================================="
