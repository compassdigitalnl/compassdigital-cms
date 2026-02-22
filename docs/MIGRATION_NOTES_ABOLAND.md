# Database Migration Notes - Aboland Magazine Features

**Date:** February 22, 2026
**Feature:** Aboland Magazine Features (subscription products, edition notifications)

---

## ⚠️ Migration Generation Failed

Automatic migration generation failed due to Payload 3 / drizzle-kit version incompatibility with PostgreSQL adapter.

**Error:** `Invalid literal value, expected "6"` - drizzle-kit version mismatch

---

## 📝 Manual Migration Required

When deploying to production (PostgreSQL), manually create the following tables and columns:

### 1. New Collection: `edition_notifications`

```sql
CREATE TABLE IF NOT EXISTS "public"."edition_notifications" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL,
  "user_id" INTEGER REFERENCES "public"."users"("id") ON DELETE SET NULL,
  "magazine_title" VARCHAR(255) NOT NULL,
  "product_id" INTEGER REFERENCES "public"."products"("id") ON DELETE CASCADE,
  "active" BOOLEAN DEFAULT true,
  "last_notified" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "edition_notifications_email_idx" ON "public"."edition_notifications"("email");
CREATE INDEX IF NOT EXISTS "edition_notifications_magazine_title_idx" ON "public"."edition_notifications"("magazine_title");
CREATE INDEX IF NOT EXISTS "edition_notifications_active_idx" ON "public"."edition_notifications"("active");
```

### 2. Add Fields to `products` Table

```sql
-- Add magazineTitle field
ALTER TABLE "public"."products"
ADD COLUMN IF NOT EXISTS "magazine_title" VARCHAR(255);

-- Add isSubscription field
ALTER TABLE "public"."products"
ADD COLUMN IF NOT EXISTS "is_subscription" BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS "products_magazine_title_idx" ON "public"."products"("magazine_title");
```

### 3. Add Fields to `products_variant_options_values` Table

```sql
-- Add subscription-specific fields
ALTER TABLE "public"."products_variant_options_values"
ADD COLUMN IF NOT EXISTS "subscription_type" VARCHAR(50),
ADD COLUMN IF NOT EXISTS "issues" INTEGER,
ADD COLUMN IF NOT EXISTS "discount_percentage" INTEGER,
ADD COLUMN IF NOT EXISTS "auto_renew" BOOLEAN DEFAULT false;
```

---

## ✅ Verification Steps (After Manual Migration)

1. Connect to production database
2. Run the SQL statements above
3. Verify tables and columns exist:
   ```sql
   -- Check edition_notifications table
   SELECT * FROM information_schema.tables
   WHERE table_name = 'edition_notifications';

   -- Check products columns
   SELECT column_name FROM information_schema.columns
   WHERE table_name = 'products'
   AND column_name IN ('magazine_title', 'is_subscription');

   -- Check variant values columns
   SELECT column_name FROM information_schema.columns
   WHERE table_name = 'products_variant_options_values'
   AND column_name IN ('subscription_type', 'issues', 'discount_percentage', 'auto_renew');
   ```

4. Restart the application
5. Test:
   - Create a variable product with isSubscription = true
   - Add magazineTitle to a product
   - Subscribe to edition notifications
   - Publish a new product with same magazineTitle
   - Verify email notification is sent

---

## 🔄 Alternative: Auto-Migration on First Run

If you prefer automatic migration, the application will auto-generate these tables on first run when using **SQLite** (development mode).

For production PostgreSQL, you can temporarily enable auto-migration by adding to `.env`:

```bash
# WARNING: Only use in controlled environments!
PAYLOAD_DATABASE_MIGRATIONS_DISABLE=true
```

This will make Payload auto-sync the schema on startup. **Remove this flag** after the first successful deployment.

---

## 📌 Related Files

**Collections:**
- `src/branches/ecommerce/collections/EditionNotifications.ts`
- `src/branches/ecommerce/collections/Products.ts` (modified)

**Hooks:**
- `src/branches/ecommerce/hooks/notifyEditionSubscribers.ts`

**Config:**
- `src/payload.config.ts` (EditionNotifications registered)

---

## 🐛 Migration Generation Issue

The automatic migration failed with:

```
Error: Invalid literal value, expected "6" (drizzle-kit version)
Error: Invalid enum value. Expected 'sqlite', received 'postgresql'
```

This is a known issue with Payload 3.0 and drizzle-kit 0.30+ when using PostgreSQL adapter.

**Workaround:** Manual SQL migration (as documented above)

**Tracking Issue:** https://github.com/payloadcms/payload/issues/...

---

**Status:** ⚠️ Migration pending - manual SQL required for PostgreSQL
**Local Development:** ✅ Works with SQLite (auto-migration)
