import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "settings"
    ADD COLUMN IF NOT EXISTS "default_header_template" varchar DEFAULT 'headertemplate1';
  `)
  await db.execute(sql`
    ALTER TABLE "settings"
    ADD COLUMN IF NOT EXISTS "default_branches_template" varchar DEFAULT 'branchestemplate1';
  `)
  await db.execute(sql`
    ALTER TABLE "settings"
    ADD COLUMN IF NOT EXISTS "default_login_template" varchar DEFAULT 'logintemplate1';
  `)
  await db.execute(sql`
    ALTER TABLE "settings"
    ADD COLUMN IF NOT EXISTS "default_register_template" varchar DEFAULT 'registertemplate1';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "settings"
    DROP COLUMN IF EXISTS "default_header_template";
  `)
  await db.execute(sql`
    ALTER TABLE "settings"
    DROP COLUMN IF EXISTS "default_branches_template";
  `)
  await db.execute(sql`
    ALTER TABLE "settings"
    DROP COLUMN IF EXISTS "default_login_template";
  `)
  await db.execute(sql`
    ALTER TABLE "settings"
    DROP COLUMN IF EXISTS "default_register_template";
  `)
}
