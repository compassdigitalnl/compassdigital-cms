import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "chatbot_settings"
    ADD COLUMN IF NOT EXISTS "avatar_image_id" integer;

    DO $$ BEGIN
      ALTER TABLE "chatbot_settings"
      ADD CONSTRAINT "chatbot_settings_avatar_image_id_media_id_fk"
      FOREIGN KEY ("avatar_image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "chatbot_settings_avatar_image_idx"
    ON "chatbot_settings" USING btree ("avatar_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "chatbot_settings" DROP COLUMN IF EXISTS "avatar_image_id";
  `)
}
