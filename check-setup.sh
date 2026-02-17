#!/bin/bash
echo "🔍 CHECKING DEPLOYMENT SETUP..."
echo ""

# Check .env
echo "1. Environment Variables:"
if grep -q "PLOI_API_TOKEN=" .env && [ -n "$(grep PLOI_API_TOKEN= .env | cut -d'=' -f2)" ]; then
    echo "   ✅ PLOI_API_TOKEN configured"
else
    echo "   ❌ PLOI_API_TOKEN missing or empty"
fi

if grep -q "PLOI_SERVER_ID=" .env && [ -n "$(grep PLOI_SERVER_ID= .env | cut -d'=' -f2)" ]; then
    echo "   ✅ PLOI_SERVER_ID configured"
else
    echo "   ❌ PLOI_SERVER_ID missing or empty"
fi

if grep -q "OPENAI_API_KEY=" .env && [ -n "$(grep OPENAI_API_KEY= .env | cut -d'=' -f2)" ]; then
    echo "   ✅ OPENAI_API_KEY configured"
else
    echo "   ❌ OPENAI_API_KEY missing"
fi

if grep -q "DATABASE_URL=" .env && [ -n "$(grep DATABASE_URL= .env | cut -d'=' -f2)" ]; then
    echo "   ✅ DATABASE_URL configured"
else
    echo "   ❌ DATABASE_URL missing"
fi

echo ""
echo "2. Default Provider:"
PROVIDER=$(grep "DEFAULT_DEPLOYMENT_PROVIDER=" .env | cut -d'=' -f2)
echo "   📍 Provider: $PROVIDER"

echo ""
echo "3. Platform Base URL:"
BASE_URL=$(grep "PLATFORM_BASE_URL=" .env | cut -d'=' -f2)
echo "   🌍 Base: $BASE_URL"

echo ""
echo "✅ Setup check complete!"
