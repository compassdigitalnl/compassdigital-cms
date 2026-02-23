#!/bin/bash
# backup-all.sh — Backup alle client databases
# Usage: bash /home/ploi/scripts/backup-all.sh [reden]

REASON="${1:-scheduled}"
SCRIPTS_DIR="/home/ploi/scripts"

DATABASES=(
    client_plastimed01
    client_aboland01
    client_beauty01
    client_construction01
    client_content01
    client_horeca01
    client_hospitality01
)

echo "[backup-all] Start backup van ${#DATABASES[@]} databases (reden: ${REASON})..."
echo ""

FAILED=0
for DB in "${DATABASES[@]}"; do
    node "${SCRIPTS_DIR}/backup-db.mjs" "${DB}" "${REASON}" || {
        echo "[backup-all] MISLUKT: ${DB}"
        FAILED=$((FAILED + 1))
    }
    echo ""
done

if [ $FAILED -gt 0 ]; then
    echo "[backup-all] WAARSCHUWING: ${FAILED} backup(s) mislukt!"
    exit 1
fi

echo "[backup-all] Alle ${#DATABASES[@]} databases gebackupt."
du -sh /home/ploi/backups/ 2>/dev/null || true
