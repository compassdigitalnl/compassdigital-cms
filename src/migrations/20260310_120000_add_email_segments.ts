import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "email_segments" (
      "id" serial PRIMARY KEY,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL UNIQUE,
      "description" varchar,
      "conditions" jsonb NOT NULL DEFAULT '[]',
      "condition_logic" varchar DEFAULT 'and',
      "subscriber_count" integer DEFAULT 0,
      "last_calculated_at" timestamp(3) with time zone,
      "auto_sync" boolean DEFAULT false,
      "listmonk_list_id" integer,
      "status" varchar DEFAULT 'active',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "email_segments_slug_idx" ON "email_segments" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "email_segments_status_idx" ON "email_segments" USING btree ("status");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "email_segments"`)
}
