import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "meta_canonical_url" varchar;
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "hide_from_catalog" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "products" DROP COLUMN IF EXISTS "meta_canonical_url";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "hide_from_catalog";
  `)
}
