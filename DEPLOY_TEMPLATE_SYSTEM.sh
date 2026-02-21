#!/bin/bash

# ============================================================================
# DEPLOYMENT SCRIPT - Template System Update
# ============================================================================
# Updates server with Template 2 + Template Selector
#
# What it does:
# 1. Pull latest code from GitHub
# 2. Install dependencies (if needed)
# 3. Regenerate Payload types
# 4. Build application
# 5. Restart server
#
# Usage:
#   bash DEPLOY_TEMPLATE_SYSTEM.sh
# ============================================================================

set -e  # Exit on error

echo "🚀 Starting Template System Deployment..."
echo ""

# ============================================================================
# STEP 1: Pull Latest Code
# ============================================================================
echo "📥 Step 1/5: Pulling latest code from GitHub..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to pull from GitHub"
    exit 1
fi

echo "✅ Code pulled successfully"
echo ""

# ============================================================================
# STEP 2: Install Dependencies
# ============================================================================
echo "📦 Step 2/5: Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# ============================================================================
# STEP 3: Regenerate Payload Types
# ============================================================================
echo "🔧 Step 3/5: Regenerating Payload types..."
npm run payload generate:types

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to regenerate types"
    exit 1
fi

echo "✅ Types regenerated"
echo ""

# ============================================================================
# STEP 4: Build Application
# ============================================================================
echo "🏗️  Step 4/5: Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed"
    exit 1
fi

echo "✅ Build successful"
echo ""

# ============================================================================
# STEP 5: Run Database Migrations
# ============================================================================
echo "🗄️  Step 5/6: Running database migrations..."
npx payload migrate

if [ $? -ne 0 ]; then
    echo "⚠️  Warning: Migration failed, continuing anyway..."
else
    echo "✅ Migrations completed"
fi

echo ""

# ============================================================================
# STEP 6: Restart Server
# ============================================================================
echo "🔄 Step 6/6: Restarting server..."

# Detect which process manager is running
if command -v pm2 &> /dev/null; then
    echo "   Using PM2..."
    pm2 restart all
    pm2 save
elif systemctl is-active --quiet payload-app; then
    echo "   Using systemd..."
    sudo systemctl restart payload-app
elif command -v docker-compose &> /dev/null; then
    echo "   Using Docker Compose..."
    docker-compose restart
else
    echo "⚠️  Warning: Could not detect process manager"
    echo "   Please restart your server manually:"
    echo "   - PM2: pm2 restart all"
    echo "   - systemd: sudo systemctl restart payload-app"
    echo "   - Docker: docker-compose restart"
fi

echo "✅ Server restarted"
echo ""

# ============================================================================
# DONE!
# ============================================================================
echo "✅ ============================================"
echo "✅  DEPLOYMENT COMPLETE!"
echo "✅ ============================================"
echo ""
echo "📋 Next Steps:"
echo "   1. Open https://plastimed01.compassdigital.nl/admin"
echo "   2. Go to Collections → Products"
echo "   3. Edit a product"
echo "   4. Check sidebar for 'Product Template' field"
echo "   5. Select Template 1 or 2"
echo "   6. Save and test!"
echo ""
echo "🎨 Template System Features:"
echo "   ✅ Template 1 - Enterprise (B2B, complex)"
echo "   ✅ Template 2 - Minimal (B2C, clean)"
echo "   ✅ Per-product template selection"
echo "   ✅ Global default in Settings"
echo ""
echo "🔍 Troubleshooting:"
echo "   - Field not visible? Hard refresh admin (Cmd+Shift+R)"
echo "   - Templates look same? Test with grouped product + volume pricing"
echo "   - Badge not changing? Check browser console (F12)"
echo ""
echo "📞 Support: Check DEPLOYMENT_PRODUCT_TEMPLATE_1.md for full guide"
echo ""
