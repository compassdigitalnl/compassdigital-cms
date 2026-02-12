#!/bin/bash
# Migrate Payload CMS database schema to PostgreSQL

echo "🗄️  Starting Payload database migration..."
echo ""
echo "Target: Railway PostgreSQL"
echo "Database: postgresql://...railway.net:29352/railway"
echo ""

# Run migrations
echo "Running: npx payload migrate"
echo ""
npx payload migrate

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migrations completed successfully!"
  echo ""
  echo "🎉 Your database now has all the tables!"
  echo ""
  echo "Next steps:"
  echo "1. Test Vercel: https://cms.compassdigital.nl"
  echo "2. Go to admin: https://cms.compassdigital.nl/admin"
  echo "3. Create your first admin user"
  echo ""
else
  echo ""
  echo "❌ Migration failed!"
  echo ""
  echo "Troubleshooting:"
  echo "1. Check DATABASE_URL in .env"
  echo "2. Verify database is accessible"
  echo "3. Check Railway database is not sleeping"
  echo ""
fi
