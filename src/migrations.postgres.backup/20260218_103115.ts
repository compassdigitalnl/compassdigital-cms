import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "clients" ADD COLUMN "admin_email" varchar;
  ALTER TABLE "clients" ADD COLUMN "initial_admin_password" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "clients" DROP COLUMN "admin_email";
  ALTER TABLE "clients" DROP COLUMN "initial_admin_password";`)
}
