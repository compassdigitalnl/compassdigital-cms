import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "theme" ADD COLUMN "success_color" varchar DEFAULT '#00C853';
  ALTER TABLE "theme" ADD COLUMN "success_light" varchar DEFAULT '#E8F5E9';
  ALTER TABLE "theme" ADD COLUMN "success_dark" varchar DEFAULT '#1B5E20';
  ALTER TABLE "theme" ADD COLUMN "warning_color" varchar DEFAULT '#F59E0B';
  ALTER TABLE "theme" ADD COLUMN "warning_light" varchar DEFAULT '#FFF8E1';
  ALTER TABLE "theme" ADD COLUMN "warning_dark" varchar DEFAULT '#92400E';
  ALTER TABLE "theme" ADD COLUMN "error_color" varchar DEFAULT '#EF4444';
  ALTER TABLE "theme" ADD COLUMN "error_light" varchar DEFAULT '#FFF0F0';
  ALTER TABLE "theme" ADD COLUMN "error_dark" varchar DEFAULT '#991B1B';
  ALTER TABLE "theme" ADD COLUMN "info_color" varchar DEFAULT '#00897B';
  ALTER TABLE "theme" ADD COLUMN "info_light" varchar DEFAULT 'rgba(0,137,123,0.12)';
  ALTER TABLE "theme" ADD COLUMN "info_dark" varchar DEFAULT '#004D40';
  ALTER TABLE "theme" ADD COLUMN "primary_gradient" varchar DEFAULT 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)';
  ALTER TABLE "theme" ADD COLUMN "secondary_gradient" varchar DEFAULT 'linear-gradient(135deg, #0A1628 0%, #1a2847 100%)';
  ALTER TABLE "theme" ADD COLUMN "hero_gradient" varchar DEFAULT 'linear-gradient(135deg, rgba(0,137,123,0.1) 0%, rgba(38,166,154,0.1) 100%)';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "theme" DROP COLUMN "success_color";
  ALTER TABLE "theme" DROP COLUMN "success_light";
  ALTER TABLE "theme" DROP COLUMN "success_dark";
  ALTER TABLE "theme" DROP COLUMN "warning_color";
  ALTER TABLE "theme" DROP COLUMN "warning_light";
  ALTER TABLE "theme" DROP COLUMN "warning_dark";
  ALTER TABLE "theme" DROP COLUMN "error_color";
  ALTER TABLE "theme" DROP COLUMN "error_light";
  ALTER TABLE "theme" DROP COLUMN "error_dark";
  ALTER TABLE "theme" DROP COLUMN "info_color";
  ALTER TABLE "theme" DROP COLUMN "info_light";
  ALTER TABLE "theme" DROP COLUMN "info_dark";
  ALTER TABLE "theme" DROP COLUMN "primary_gradient";
  ALTER TABLE "theme" DROP COLUMN "secondary_gradient";
  ALTER TABLE "theme" DROP COLUMN "hero_gradient";`)
}
