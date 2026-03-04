import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Rename legacy value to new key
  await db.execute(sql`
    UPDATE "settings"
    SET "default_my_account_template" = 'enterprise'
    WHERE "default_my_account_template" = 'myaccounttemplate1';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "settings"
    SET "default_my_account_template" = 'myaccounttemplate1'
    WHERE "default_my_account_template" = 'enterprise';
  `)
}
