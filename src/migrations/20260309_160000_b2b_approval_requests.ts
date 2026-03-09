import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "approval_requests" (
      "id" serial PRIMARY KEY,
      "company_id" integer NOT NULL REFERENCES "company_accounts"("id") ON DELETE CASCADE,
      "requested_by_id" integer NOT NULL REFERENCES "users"("id") ON DELETE SET NULL,
      "approver_id" integer REFERENCES "users"("id") ON DELETE SET NULL,
      "order_reference" varchar NOT NULL,
      "status" varchar DEFAULT 'pending',
      "total_amount" numeric NOT NULL,
      "reason" varchar,
      "items" jsonb,
      "shipping_address" jsonb,
      "note" varchar,
      "review_note" varchar,
      "reviewed_at" timestamp(3) with time zone,
      "expires_at" timestamp(3) with time zone,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "approval_requests_company_idx" ON "approval_requests" USING btree ("company_id");
    CREATE INDEX IF NOT EXISTS "approval_requests_requested_by_idx" ON "approval_requests" USING btree ("requested_by_id");
    CREATE INDEX IF NOT EXISTS "approval_requests_status_idx" ON "approval_requests" USING btree ("status");
    CREATE INDEX IF NOT EXISTS "approval_requests_created_at_idx" ON "approval_requests" USING btree ("created_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "approval_requests";
  `)
}
