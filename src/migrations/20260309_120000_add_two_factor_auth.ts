import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

/**
 * Add Two-Factor Authentication fields to users table.
 * - two_factor_enabled: whether 2FA is active
 * - two_factor_secret: encrypted TOTP secret
 * - two_factor_backup_codes: array of hashed backup codes (JSON)
 * - two_factor_pending_secret: temporary secret during setup (before verification)
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "two_factor_enabled" boolean DEFAULT false;

    ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "two_factor_secret" varchar;

    ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "two_factor_backup_codes" jsonb DEFAULT '[]'::jsonb;

    ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "two_factor_pending_secret" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users"
    DROP COLUMN IF EXISTS "two_factor_enabled";

    ALTER TABLE "users"
    DROP COLUMN IF EXISTS "two_factor_secret";

    ALTER TABLE "users"
    DROP COLUMN IF EXISTS "two_factor_backup_codes";

    ALTER TABLE "users"
    DROP COLUMN IF EXISTS "two_factor_pending_secret";
  `)
}
