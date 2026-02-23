#!/bin/bash
# Deploy Script voor cms.compassdigital.nl (platform CMS)
# Updated: 2026-02-23
set -e

cd /home/ploi/cms.compassdigital.nl

echo "[deploy] Starting deployment cms.compassdigital.nl..."

# Stap 1: Backup (als DATABASE_URL is geconfigureerd)
if grep -q "^DATABASE_URL=postgres" .env 2>/dev/null; then
    DB_NAME=$(grep "^DATABASE_URL=" .env | sed 's/.*\///')
    echo "[deploy] Pre-deploy backup: ${DB_NAME}..."
    node /home/ploi/scripts/backup-db.mjs "${DB_NAME}" "pre-deploy" || {
        echo "[deploy] WAARSCHUWING: Backup mislukt, maar deploy gaat door"
    }
fi

echo "[deploy] Git pull..."
git pull origin main

echo "[deploy] npm install..."
npm install --legacy-peer-deps --silent

echo "[deploy] Building Next.js..."
NODE_OPTIONS="--max-old-space-size=2048" npm run build

echo "[deploy] Restarting PM2..."
pm2 restart cms-compassdigital --update-env

echo "[deploy] Done!"
pm2 list
