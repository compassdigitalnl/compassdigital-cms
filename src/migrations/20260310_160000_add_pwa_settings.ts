import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS pwa_install_prompt boolean DEFAULT false;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS pwa_push_notifications boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE settings DROP COLUMN IF EXISTS pwa_install_prompt;
    ALTER TABLE settings DROP COLUMN IF EXISTS pwa_push_notifications;
  `)
}
