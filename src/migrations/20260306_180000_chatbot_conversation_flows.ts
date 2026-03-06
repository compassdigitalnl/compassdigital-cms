import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "chatbot_settings_conversation_flows" (
      "id" serial PRIMARY KEY,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "label" varchar NOT NULL,
      "icon" varchar,
      "type" varchar DEFAULT 'direct',
      "context_prefix" varchar,
      "direct_message" varchar,
      "input_label" varchar,
      "input_placeholder" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "chatbot_settings_conversation_flows"
      ADD CONSTRAINT "chatbot_settings_conversation_flows_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "chatbot_settings"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "chatbot_settings_conversation_flows_order_idx"
    ON "chatbot_settings_conversation_flows" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "chatbot_settings_conversation_flows_parent_id_idx"
    ON "chatbot_settings_conversation_flows" USING btree ("_parent_id");

    CREATE TABLE IF NOT EXISTS "chatbot_settings_conversation_flows_sub_options" (
      "id" serial PRIMARY KEY,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "label" varchar NOT NULL,
      "type" varchar DEFAULT 'direct',
      "direct_message" varchar,
      "input_label" varchar,
      "input_placeholder" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "chatbot_settings_conversation_flows_sub_options"
      ADD CONSTRAINT "chatbot_settings_cf_sub_options_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "chatbot_settings_conversation_flows"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "chatbot_settings_cf_sub_options_order_idx"
    ON "chatbot_settings_conversation_flows_sub_options" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "chatbot_settings_cf_sub_options_parent_id_idx"
    ON "chatbot_settings_conversation_flows_sub_options" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "chatbot_settings_conversation_flows_sub_options";
    DROP TABLE IF EXISTS "chatbot_settings_conversation_flows";
  `)
}
