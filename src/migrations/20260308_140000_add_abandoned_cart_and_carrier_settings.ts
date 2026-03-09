import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

/**
 * Add abandoned cart detection + carrier integration settings to e_commerce_settings.
 *
 * Abandoned cart: enabled toggle + timeout hours
 * Carrier: provider (sendcloud/myparcel/none), API key/secret, webhook secret/URL
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "e_commerce_settings"
    ADD COLUMN IF NOT EXISTS "abandoned_cart_enabled" boolean DEFAULT false;

    ALTER TABLE "e_commerce_settings"
    ADD COLUMN IF NOT EXISTS "abandoned_cart_timeout_hours" numeric DEFAULT 24;

    ALTER TABLE "e_commerce_settings"
    ADD COLUMN IF NOT EXISTS "carrier_integration_provider" varchar DEFAULT 'none';

    ALTER TABLE "e_commerce_settings"
    ADD COLUMN IF NOT EXISTS "carrier_integration_api_key" varchar;

    ALTER TABLE "e_commerce_settings"
    ADD COLUMN IF NOT EXISTS "carrier_integration_api_secret" varchar;

    ALTER TABLE "e_commerce_settings"
    ADD COLUMN IF NOT EXISTS "carrier_integration_webhook_secret" varchar;

    ALTER TABLE "e_commerce_settings"
    ADD COLUMN IF NOT EXISTS "carrier_integration_webhook_url" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "e_commerce_settings"
    DROP COLUMN IF EXISTS "abandoned_cart_enabled";

    ALTER TABLE "e_commerce_settings"
    DROP COLUMN IF EXISTS "abandoned_cart_timeout_hours";

    ALTER TABLE "e_commerce_settings"
    DROP COLUMN IF EXISTS "carrier_integration_provider";

    ALTER TABLE "e_commerce_settings"
    DROP COLUMN IF EXISTS "carrier_integration_api_key";

    ALTER TABLE "e_commerce_settings"
    DROP COLUMN IF EXISTS "carrier_integration_api_secret";

    ALTER TABLE "e_commerce_settings"
    DROP COLUMN IF EXISTS "carrier_integration_webhook_secret";

    ALTER TABLE "e_commerce_settings"
    DROP COLUMN IF EXISTS "carrier_integration_webhook_url";
  `)
}
