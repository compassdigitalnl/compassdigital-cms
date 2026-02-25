#!/bin/bash
# deploy-all.sh — Deploy alle client sites (parallel builds, ~50% sneller)
# Usage: bash /home/ploi/scripts/deploy-all.sh
#
# STRATEGIE:
# 1. Sequentieel: git pull + npm install (snel, ~5-10 sec per site)
# 2. Sequentieel: migraties (database writes, moet sequentieel)
# 3. Parallel (batches van 3): Next.js builds (bottleneck: ~53 sec per site)
# 4. Sequentieel: PM2 restarts
#
# PERFORMANCE:
# - Voor: ~10 min (7 sites × 80 sec sequentieel)
# - Na: ~4-5 min (git/npm: 1 min, migraties: 1 min, 3 parallel builds: 2.5 min, restarts: 30 sec)

set -euo pipefail

SCRIPTS_DIR="/home/ploi/scripts"
BATCH_SIZE=3  # Max 3 parallel builds (elke build ~2GB RAM)

SITES=(
    "/home/ploi/plastimed01.compassdigital.nl client_plastimed01 payload-cms"
    "/home/ploi/aboland01.compassdigital.nl client_aboland01 aboland01-cms"
    "/home/ploi/beauty01.compassdigital.nl client_beauty01 beauty01-cms"
    "/home/ploi/construction01.compassdigital.nl client_construction01 construction01-cms"
    "/home/ploi/content01.compassdigital.nl client_content01 content01-cms"
    "/home/ploi/horeca01.compassdigital.nl client_horeca01 horeca01-cms"
    "/home/ploi/hospitality01.compassdigital.nl client_hospitality01 hospitality01-cms"
)

echo "=============================================="
echo "[deploy-all] Parallel deploy van ${#SITES[@]} sites"
echo "[deploy-all] Batch size: ${BATCH_SIZE} parallel builds"
echo "[deploy-all] Start: $(date)"
echo "=============================================="

# Arrays om site status bij te houden
declare -A SITE_MIGRATIONS  # true/false per site
declare -A SITE_STATUS      # success/failed per site

# ============================================================================
# FASE 1: Git Pull + NPM Install (sequentieel, snel)
# ============================================================================
echo ""
echo "=============================================="
echo "FASE 1/4: Git pull + npm install"
echo "=============================================="

for SITE_ARGS in "${SITES[@]}"; do
    read -r SITE_DIR DB_NAME PM2_NAME <<< "${SITE_ARGS}"
    SITE_NAME=$(basename "${SITE_DIR}")

    echo ""
    echo "→ ${SITE_NAME}: git pull + npm install..."

    cd "${SITE_DIR}"
    if ! git pull origin main; then
        echo "  ✗ Git pull failed!"
        SITE_STATUS["${SITE_NAME}"]="failed"
        continue
    fi

    if ! npm install --legacy-peer-deps --silent; then
        echo "  ✗ npm install failed!"
        SITE_STATUS["${SITE_NAME}"]="failed"
        continue
    fi

    echo "  ✓ Done"
    SITE_STATUS["${SITE_NAME}"]="pending"
done

# ============================================================================
# FASE 2: Migraties (sequentieel, database writes)
# ============================================================================
echo ""
echo "=============================================="
echo "FASE 2/4: Database migraties"
echo "=============================================="

for SITE_ARGS in "${SITES[@]}"; do
    read -r SITE_DIR DB_NAME PM2_NAME <<< "${SITE_ARGS}"
    SITE_NAME=$(basename "${SITE_DIR}")

    # Skip als fase 1 faalde
    if [ "${SITE_STATUS[${SITE_NAME}]}" = "failed" ]; then
        echo "→ ${SITE_NAME}: OVERGESLAGEN (vorige fase gefaald)"
        SITE_MIGRATIONS["${SITE_NAME}"]="skipped"
        continue
    fi

    echo ""
    echo "→ ${SITE_NAME}: checking migraties..."

    # Backup
    if ! node "${SCRIPTS_DIR}/backup-db.mjs" "${DB_NAME}" "pre-deploy" 2>/dev/null; then
        echo "  ✗ Backup failed!"
        SITE_STATUS["${SITE_NAME}"]="failed"
        SITE_MIGRATIONS["${SITE_NAME}"]="skipped"
        continue
    fi

    # Migration safety check
    MIGRATE_EXIT=0
    node "${SCRIPTS_DIR}/check-migrations.mjs" "${DB_NAME}" 2>/dev/null || MIGRATE_EXIT=$?

    case $MIGRATE_EXIT in
        0|2)  # Veilig of lege database
            echo "  → Migraties uitvoeren..."
            cd "${SITE_DIR}"
            if yes 2>/dev/null | NODE_OPTIONS="--max-old-space-size=4096 --no-deprecation" npx payload migrate 2>&1; then
                echo "  ✓ Migraties succesvol"
                SITE_MIGRATIONS["${SITE_NAME}"]="success"
            else
                echo "  ⚠ Migraties hadden problemen"
                SITE_MIGRATIONS["${SITE_NAME}"]="warning"
            fi
            ;;
        *)
            echo "  ⊗ Migraties overgeslagen (safety check)"
            SITE_MIGRATIONS["${SITE_NAME}"]="skipped"
            ;;
    esac
done

# ============================================================================
# FASE 3: Parallel Builds (in batches van 3)
# ============================================================================
echo ""
echo "=============================================="
echo "FASE 3/4: Next.js builds (parallel, batches van ${BATCH_SIZE})"
echo "=============================================="

BATCH_NUM=0
for SITE_ARGS in "${SITES[@]}"; do
    read -r SITE_DIR DB_NAME PM2_NAME <<< "${SITE_ARGS}"
    SITE_NAME=$(basename "${SITE_DIR}")

    # Skip als vorige fases faalden
    if [ "${SITE_STATUS[${SITE_NAME}]}" = "failed" ]; then
        echo "→ ${SITE_NAME}: OVERGESLAGEN"
        continue
    fi

    # Start build in background
    echo "→ ${SITE_NAME}: build starten..."
    (
        cd "${SITE_DIR}"
        if NODE_OPTIONS="--max-old-space-size=4096" npm run build 2>&1 | sed "s/^/  [${SITE_NAME}] /"; then
            echo "  ✓ ${SITE_NAME}: build succesvol"
            echo "success" > "/tmp/deploy-${SITE_NAME}.status"
        else
            echo "  ✗ ${SITE_NAME}: build GEFAALD!"
            echo "failed" > "/tmp/deploy-${SITE_NAME}.status"
        fi
    ) &

    BATCH_NUM=$((BATCH_NUM + 1))

    # Wacht op batch completion
    if [ $((BATCH_NUM % BATCH_SIZE)) -eq 0 ]; then
        echo ""
        echo "  ⏳ Wachten op batch ${BATCH_NUM}/${#SITES[@]}..."
        wait
        echo "  ✓ Batch compleet"
        echo ""
    fi
done

# Wacht op laatste batch
if [ $((BATCH_NUM % BATCH_SIZE)) -ne 0 ]; then
    echo ""
    echo "  ⏳ Wachten op laatste batch..."
    wait
    echo "  ✓ Alle builds compleet"
fi

# Check build results
echo ""
for SITE_ARGS in "${SITES[@]}"; do
    read -r SITE_DIR DB_NAME PM2_NAME <<< "${SITE_ARGS}"
    SITE_NAME=$(basename "${SITE_DIR}")

    if [ -f "/tmp/deploy-${SITE_NAME}.status" ]; then
        STATUS=$(cat "/tmp/deploy-${SITE_NAME}.status")
        SITE_STATUS["${SITE_NAME}"]="${STATUS}"
        rm -f "/tmp/deploy-${SITE_NAME}.status"
    fi
done

# ============================================================================
# FASE 4: PM2 Restarts (sequentieel)
# ============================================================================
echo ""
echo "=============================================="
echo "FASE 4/4: PM2 restarts"
echo "=============================================="

for SITE_ARGS in "${SITES[@]}"; do
    read -r SITE_DIR DB_NAME PM2_NAME <<< "${SITE_ARGS}"
    SITE_NAME=$(basename "${SITE_DIR}")

    # Skip als build faalde
    if [ "${SITE_STATUS[${SITE_NAME}]}" != "success" ]; then
        echo "→ ${SITE_NAME}: NIET HERSTART (build gefaald)"
        continue
    fi

    echo "→ ${SITE_NAME}: PM2 herstarten..."

    # Lees PORT uit .env file (fallback naar 3020)
    if [ -f "${SITE_DIR}/.env" ]; then
        PORT=$(grep -E "^PORT=" "${SITE_DIR}/.env" | cut -d '=' -f2 || echo "3020")
    else
        PORT="3020"
    fi

    # Stop en herstart PM2 met correcte port (pm2 restart pikt PORT niet op!)
    if pm2 stop "${PM2_NAME}" 2>/dev/null && \
       pm2 delete "${PM2_NAME}" 2>/dev/null && \
       pm2 start npm --name "${PM2_NAME}" -- start -- --port "${PORT}" 2>/dev/null; then
        echo "  ✓ Herstart succesvol (port ${PORT})"
    else
        echo "  ✗ Herstart gefaald!"
        SITE_STATUS["${SITE_NAME}"]="failed"
    fi
done

# Wacht op alle processen
sleep 5

# Save PM2 process list
pm2 save 2>/dev/null

# ============================================================================
# RAPPORT
# ============================================================================
echo ""
echo "=============================================="
echo "DEPLOYMENT RAPPORT"
echo "=============================================="

SUCCESS_COUNT=0
FAILED_COUNT=0

for SITE_ARGS in "${SITES[@]}"; do
    read -r SITE_DIR DB_NAME PM2_NAME <<< "${SITE_ARGS}"
    SITE_NAME=$(basename "${SITE_DIR}")

    STATUS="${SITE_STATUS[${SITE_NAME}]}"
    MIGRATE="${SITE_MIGRATIONS[${SITE_NAME}]:-unknown}"

    if [ "${STATUS}" = "success" ]; then
        echo "✓ ${SITE_NAME}: SUCCESS (migraties: ${MIGRATE})"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo "✗ ${SITE_NAME}: FAILED (status: ${STATUS})"
        FAILED_COUNT=$((FAILED_COUNT + 1))
    fi
done

echo ""
echo "Succesvol: ${SUCCESS_COUNT}/${#SITES[@]}"
echo "Gefaald: ${FAILED_COUNT}/${#SITES[@]}"
echo ""
echo "Einde: $(date)"
echo "=============================================="

pm2 list

exit $([ $FAILED_COUNT -eq 0 ] && echo 0 || echo 1)
