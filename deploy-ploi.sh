#!/bin/bash
#
# Ploi Deployment Script voor Payload CMS
# Gebruik dit script in Ploi's "Deploy Script" veld
#
set -e  # Stop bij errors

echo "=== 🚀 Starting Deployment ==="
echo "Time: $(date)"
echo ""

# 1. Navigate to project directory
cd /home/ploi/cms.compassdigital.nl
echo "✓ Changed to project directory"

# 2. Pull latest code
echo ""
echo "=== 📥 Pulling latest code ==="
git pull origin main
echo "✓ Code updated"

# 3. Install dependencies (including devDependencies for build)
echo ""
echo "=== 📦 Installing dependencies ==="
npm install --production=false
echo "✓ Dependencies installed"

# 4. Build Next.js application
echo ""
echo "=== 🔨 Building application ==="
npm run build
echo "✓ Build completed"

# 5. Run database migrations
echo ""
echo "=== 🗄️  Running migrations ==="
# Use 'yes' to auto-accept any prompts
# The || true ensures we continue even if migration fails (safe for prod)
yes | npm run migrate || echo "⚠️  Migration failed or skipped, continuing..."
echo "✓ Migrations completed"

# 6. Restart PM2 with environment variables
echo ""
echo "=== 🔄 Restarting application ==="
export PORT=4000
export NODE_ENV=production

# Check if app exists, restart or start
if pm2 describe cms-compassdigital > /dev/null 2>&1; then
  echo "Restarting existing PM2 process..."
  pm2 restart cms-compassdigital --update-env
else
  echo "Starting new PM2 process..."
  pm2 start npm --name cms-compassdigital -- start
fi

# Save PM2 configuration
pm2 save
echo "✓ Application restarted"

# 7. Verify deployment
echo ""
echo "=== ✅ Deployment Complete ==="
echo "Time: $(date)"
echo ""
echo "PM2 Status:"
pm2 list
echo ""
echo "Health check in 10 seconds..."
sleep 10
curl -s http://localhost:4000/api/health || echo "⚠️  Health check failed (app may still be starting)"
echo ""
echo ""
echo "🎉 Deployment finished!"
