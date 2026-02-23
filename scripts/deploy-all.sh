#!/bin/bash
# deploy-all.sh — Deploy alle client sites (sequentieel, met backup en safety check)
# Usage: bash /home/ploi/scripts/deploy-all.sh

set -euo pipefail

SCRIPTS_DIR="/home/ploi/scripts"

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
echo "[deploy-all] Deploy van ${#SITES[@]} sites"
echo "[deploy-all] Tijd: $(date)"
echo "=============================================="

FAILED=0
for SITE_ARGS in "${SITES[@]}"; do
    read -r SITE_DIR DB_NAME PM2_NAME <<< "${SITE_ARGS}"
    SITE_NAME=$(basename "${SITE_DIR}")
    echo ""
    echo "----------------------------------------------"
    echo "[deploy-all] Deploying: ${SITE_NAME}"
    echo "----------------------------------------------"

    bash "${SCRIPTS_DIR}/safe-deploy.sh" "${SITE_DIR}" "${DB_NAME}" "${PM2_NAME}" || {
        echo "[deploy-all] MISLUKT: ${SITE_NAME}"
        FAILED=$((FAILED + 1))
        continue
    }
done

echo ""
echo "=============================================="
if [ $FAILED -gt 0 ]; then
    echo "[deploy-all] VOLTOOID MET ${FAILED} FOUT(EN)"
else
    echo "[deploy-all] ALLE SITES SUCCESVOL GEDEPLOYED"
fi
echo "=============================================="
pm2 list
