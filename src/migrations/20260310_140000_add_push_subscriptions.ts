import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "push_subscriptions" (
      "id" serial PRIMARY KEY,
      "user_id" integer REFERENCES "users"("id") ON DELETE SET NULL,
      "endpoint" varchar NOT NULL UNIQUE,
      "p256dh" varchar NOT NULL,
      "auth" varchar NOT NULL,
      "user_agent" varchar,
      "active" boolean DEFAULT true,
      "last_used" timestamp(3) with time zone,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "push_subscriptions_user_idx" ON "push_subscriptions" USING btree ("user_id");
    CREATE INDEX IF NOT EXISTS "push_subscriptions_active_idx" ON "push_subscriptions" USING btree ("active");

    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "push_subscriptions_id" integer;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_push_subscriptions_id_idx"
      ON "payload_locked_documents_rels" USING btree ("push_subscriptions_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "push_subscriptions"`)
}
