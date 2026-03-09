import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "customer_metrics" (
      "id" serial PRIMARY KEY,
      "user_id" integer NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
      "total_orders" integer DEFAULT 0,
      "total_revenue" numeric DEFAULT 0,
      "avg_order_value" numeric DEFAULT 0,
      "first_order_at" timestamp(3) with time zone,
      "last_order_at" timestamp(3) with time zone,
      "days_since_last_order" integer DEFAULT 0,
      "order_frequency_days" numeric DEFAULT 0,
      "recency_score" integer DEFAULT 0,
      "frequency_score" integer DEFAULT 0,
      "monetary_score" integer DEFAULT 0,
      "rfm_segment" varchar DEFAULT 'new',
      "clv_historical" numeric DEFAULT 0,
      "clv_predicted" numeric DEFAULT 0,
      "churn_risk" numeric DEFAULT 0,
      "churn_label" varchar DEFAULT 'low',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "customer_metrics_user_idx" ON "customer_metrics" USING btree ("user_id");
    CREATE INDEX IF NOT EXISTS "customer_metrics_segment_idx" ON "customer_metrics" USING btree ("rfm_segment");
    CREATE INDEX IF NOT EXISTS "customer_metrics_churn_idx" ON "customer_metrics" USING btree ("churn_risk");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "customer_metrics"`)
}
