import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ─── CompanyAccounts ───
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "company_accounts" (
      "id" serial PRIMARY KEY,
      "company_name" varchar NOT NULL,
      "kvk_number" varchar,
      "vat_number" varchar,
      "owner_id" integer NOT NULL REFERENCES "users"("id") ON DELETE SET NULL,
      "status" varchar DEFAULT 'active',
      "monthly_budget" numeric,
      "quarterly_budget" numeric,
      "approval_threshold" numeric,
      "credit_limit" numeric,
      "credit_used" numeric DEFAULT 0,
      "payment_terms" varchar DEFAULT '30',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "company_accounts_owner_idx" ON "company_accounts" USING btree ("owner_id");
    CREATE INDEX IF NOT EXISTS "company_accounts_created_at_idx" ON "company_accounts" USING btree ("created_at");
  `)

  // CompanyAccounts approval_roles (hasMany select → separate table)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "company_accounts_approval_roles" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL REFERENCES "company_accounts"("id") ON DELETE CASCADE,
      "value" varchar,
      "id" serial PRIMARY KEY
    );
    CREATE INDEX IF NOT EXISTS "company_accounts_approval_roles_order_idx" ON "company_accounts_approval_roles" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "company_accounts_approval_roles_parent_id_idx" ON "company_accounts_approval_roles" USING btree ("parent_id");
  `)

  // ─── CompanyInvites ───
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "company_invites" (
      "id" serial PRIMARY KEY,
      "company_id" integer NOT NULL REFERENCES "company_accounts"("id") ON DELETE CASCADE,
      "email" varchar NOT NULL,
      "role" varchar NOT NULL,
      "status" varchar DEFAULT 'pending',
      "token" varchar NOT NULL,
      "expires_at" timestamp(3) with time zone NOT NULL,
      "invited_by_id" integer REFERENCES "users"("id") ON DELETE SET NULL,
      "message" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "company_invites_company_idx" ON "company_invites" USING btree ("company_id");
    CREATE INDEX IF NOT EXISTS "company_invites_token_idx" ON "company_invites" USING btree ("token");
    CREATE INDEX IF NOT EXISTS "company_invites_created_at_idx" ON "company_invites" USING btree ("created_at");
  `)

  // ─── Users uitbreiden met company relatie + rol ───
  await db.execute(sql`
    ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "company_account_id" integer REFERENCES "company_accounts"("id") ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS "company_role" varchar DEFAULT 'viewer';
    CREATE INDEX IF NOT EXISTS "users_company_account_idx" ON "users" USING btree ("company_account_id");
  `)

  // ─── Users: monthly budget limit per user ───
  await db.execute(sql`
    ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "monthly_budget_limit" numeric;
  `)

  // ─── Payload internal rels tables: add FK columns for new collections ───
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "company_accounts_id" integer,
      ADD COLUMN IF NOT EXISTS "company_invites_id" integer;
    ALTER TABLE "payload_preferences_rels"
      ADD COLUMN IF NOT EXISTS "company_accounts_id" integer,
      ADD COLUMN IF NOT EXISTS "company_invites_id" integer;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" DROP COLUMN IF EXISTS "monthly_budget_limit";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "company_role";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "company_account_id";
    DROP TABLE IF EXISTS "company_invites";
    DROP TABLE IF EXISTS "company_accounts_approval_roles";
    DROP TABLE IF EXISTS "company_accounts";
  `)
}
