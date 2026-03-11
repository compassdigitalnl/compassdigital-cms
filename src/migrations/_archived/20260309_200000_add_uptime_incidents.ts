import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Uptime incidents table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "uptime_incidents" (
      "id" serial PRIMARY KEY,
      "client_id" varchar NOT NULL,
      "client_name" varchar NOT NULL,
      "deployment_url" varchar,
      "status" varchar DEFAULT 'ongoing',
      "severity" varchar DEFAULT 'warning',
      "started_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "resolved_at" timestamp(3) with time zone,
      "duration_minutes" integer,
      "failure_count" integer DEFAULT 0,
      "last_error" varchar,
      "last_status_code" integer,
      "alert_sent" boolean DEFAULT false,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "uptime_incidents_client_id_idx" ON "uptime_incidents" USING btree ("client_id");
    CREATE INDEX IF NOT EXISTS "uptime_incidents_status_idx" ON "uptime_incidents" USING btree ("status");
    CREATE INDEX IF NOT EXISTS "uptime_incidents_started_at_idx" ON "uptime_incidents" USING btree ("started_at");
  `)

  // Health check log for uptime calculation
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "uptime_checks" (
      "id" serial PRIMARY KEY,
      "client_id" varchar NOT NULL,
      "status" varchar NOT NULL,
      "response_time" integer,
      "status_code" integer,
      "error" varchar,
      "checked_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "uptime_checks_client_id_idx" ON "uptime_checks" USING btree ("client_id");
    CREATE INDEX IF NOT EXISTS "uptime_checks_checked_at_idx" ON "uptime_checks" USING btree ("checked_at");
    CREATE INDEX IF NOT EXISTS "uptime_checks_client_checked_idx" ON "uptime_checks" USING btree ("client_id", "checked_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "uptime_checks";
    DROP TABLE IF EXISTS "uptime_incidents";
  `)
}
