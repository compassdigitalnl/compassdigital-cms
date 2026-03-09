import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

/**
 * Migration: Consolidate Users + Customers + CompanyAccounts → Users
 *
 * This migration:
 * 1. Adds customer-specific fields to the users table
 * 2. Adds company budget/credit fields to the users table
 * 3. Migrates data from customers → users (by email match)
 * 4. Updates carts.customer_id → carts.user_id
 * 5. Updates addresses.customer_id → addresses.user_id
 * 6. Updates company_invites.company_id → company_invites.company_owner_id
 * 7. Updates approval_requests.company_id → approval_requests.company_owner_id
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ═══════════════════════════════════════════════════════════════
  // STEP 1: Add customer fields to users table
  // ═══════════════════════════════════════════════════════════════
  await db.execute(sql`
    ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "date_of_birth" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "customer_group_id" integer,
      ADD COLUMN IF NOT EXISTS "customer_status" varchar DEFAULT 'active',
      ADD COLUMN IF NOT EXISTS "custom_pricing_role" varchar,
      ADD COLUMN IF NOT EXISTS "discount" numeric DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "credit_limit" numeric,
      ADD COLUMN IF NOT EXISTS "payment_terms" varchar DEFAULT 'immediate',
      ADD COLUMN IF NOT EXISTS "verified" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "notes" varchar,
      ADD COLUMN IF NOT EXISTS "total_orders" numeric DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "total_spent" numeric DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "average_order_value" numeric DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "last_order_date" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "language" varchar DEFAULT 'nl',
      ADD COLUMN IF NOT EXISTS "currency" varchar DEFAULT 'EUR',
      ADD COLUMN IF NOT EXISTS "newsletter" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "marketing_emails" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "order_notifications" boolean DEFAULT true;

    CREATE INDEX IF NOT EXISTS "users_customer_group_idx" ON "users" USING btree ("customer_group_id");
    CREATE INDEX IF NOT EXISTS "users_customer_status_idx" ON "users" USING btree ("customer_status");
  `)

  // ═══════════════════════════════════════════════════════════════
  // STEP 1b: Add new fields to users_addresses subtable
  // ═══════════════════════════════════════════════════════════════
  await db.execute(sql`
    ALTER TABLE "users_addresses"
      ADD COLUMN IF NOT EXISTS "label" varchar,
      ADD COLUMN IF NOT EXISTS "company_name" varchar,
      ADD COLUMN IF NOT EXISTS "state" varchar,
      ADD COLUMN IF NOT EXISTS "phone" varchar,
      ADD COLUMN IF NOT EXISTS "delivery_instructions" varchar;
  `)

  // ═══════════════════════════════════════════════════════════════
  // STEP 2: Add company budget/credit fields to users table
  // (some already exist from b2b_company_accounts migration)
  // ═══════════════════════════════════════════════════════════════
  await db.execute(sql`
    ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "company_owner_id" integer,
      ADD COLUMN IF NOT EXISTS "company_status" varchar DEFAULT 'active',
      ADD COLUMN IF NOT EXISTS "company_monthly_budget" numeric,
      ADD COLUMN IF NOT EXISTS "company_quarterly_budget" numeric,
      ADD COLUMN IF NOT EXISTS "company_approval_threshold" numeric,
      ADD COLUMN IF NOT EXISTS "company_credit_limit" numeric,
      ADD COLUMN IF NOT EXISTS "company_credit_used" numeric DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "company_payment_terms" varchar DEFAULT '30';

    CREATE INDEX IF NOT EXISTS "users_company_owner_idx" ON "users" USING btree ("company_owner_id");
  `)

  // ═══════════════════════════════════════════════════════════════
  // STEP 3: Migrate data from customers → users (merge by email)
  // ═══════════════════════════════════════════════════════════════
  // First: insert customers that DON'T already exist as users
  await db.execute(sql`
    INSERT INTO "users" (email, first_name, last_name, name, account_type,
      customer_status, discount, credit_limit, payment_terms, notes,
      customer_group_id, total_orders, total_spent, average_order_value,
      created_at, updated_at)
    SELECT c.email, c.first_name, c.last_name,
      COALESCE(c.name, CONCAT(c.first_name, ' ', c.last_name)),
      c.account_type, c.status, c.discount, c.credit_limit, c.payment_terms,
      c.notes, c.customer_group_id, c.total_orders, c.total_spent,
      c.average_order_value, c.created_at, c.updated_at
    FROM "customers" c
    WHERE c.email IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM "users" u WHERE LOWER(u.email) = LOWER(c.email))
  `)

  // Second: update existing users with customer data (merge)
  await db.execute(sql`
    UPDATE "users" u SET
      customer_status = COALESCE(c.status, 'active'),
      discount = COALESCE(c.discount, 0),
      credit_limit = c.credit_limit,
      payment_terms = COALESCE(c.payment_terms, u.payment_terms),
      customer_group_id = c.customer_group_id,
      total_orders = COALESCE(c.total_orders, 0),
      total_spent = COALESCE(c.total_spent, 0),
      average_order_value = COALESCE(c.average_order_value, 0)
    FROM "customers" c
    WHERE LOWER(u.email) = LOWER(c.email)
  `)

  // ═══════════════════════════════════════════════════════════════
  // STEP 4: Migrate company data from company_accounts → users (owner)
  // ═══════════════════════════════════════════════════════════════
  await db.execute(sql`
    UPDATE "users" u SET
      company_status = COALESCE(ca.status, 'active'),
      company_monthly_budget = ca.monthly_budget,
      company_quarterly_budget = ca.quarterly_budget,
      company_approval_threshold = ca.approval_threshold,
      company_credit_limit = ca.credit_limit,
      company_credit_used = COALESCE(ca.credit_used, 0),
      company_payment_terms = COALESCE(ca.payment_terms, '30'),
      company_role = 'owner'
    FROM "company_accounts" ca
    WHERE ca.owner_id = u.id
  `)

  // Set company_owner_id for team members
  await db.execute(sql`
    UPDATE "users" u SET
      company_owner_id = u.company_account_id
    WHERE u.company_account_id IS NOT NULL
      AND u.company_role IS NOT NULL
      AND u.company_role != 'owner'
  `)

  // ═══════════════════════════════════════════════════════════════
  // STEP 5: Update carts — customer_id → user_id
  // ═══════════════════════════════════════════════════════════════
  await db.execute(sql`
    ALTER TABLE "carts" ADD COLUMN IF NOT EXISTS "user_id" integer;

    UPDATE "carts" cart SET user_id = u.id
    FROM "customers" c
    JOIN "users" u ON LOWER(u.email) = LOWER(c.email)
    WHERE cart.customer_id = c.id
      AND cart.user_id IS NULL;
  `)

  // ═══════════════════════════════════════════════════════════════
  // STEP 6: Update addresses — customer_id → user_id
  // ═══════════════════════════════════════════════════════════════
  await db.execute(sql`
    ALTER TABLE "addresses" ADD COLUMN IF NOT EXISTS "user_id" integer;

    UPDATE "addresses" a SET user_id = u.id
    FROM "customers" c
    JOIN "users" u ON LOWER(u.email) = LOWER(c.email)
    WHERE a.customer_id = c.id
      AND a.user_id IS NULL;
  `)

  // ═══════════════════════════════════════════════════════════════
  // STEP 7: Update company_invites — company_id → company_owner_id
  // ═══════════════════════════════════════════════════════════════
  await db.execute(sql`
    ALTER TABLE "company_invites"
      ADD COLUMN IF NOT EXISTS "company_owner_id" integer;

    UPDATE "company_invites" ci SET company_owner_id = ca.owner_id
    FROM "company_accounts" ca
    WHERE ci.company_id = ca.id
      AND ci.company_owner_id IS NULL;
  `)

  // ═══════════════════════════════════════════════════════════════
  // STEP 8: Update approval_requests — company_id → company_owner_id
  // ═══════════════════════════════════════════════════════════════
  await db.execute(sql`
    ALTER TABLE "approval_requests"
      ADD COLUMN IF NOT EXISTS "company_owner_id" integer;

    UPDATE "approval_requests" ar SET company_owner_id = ca.owner_id
    FROM "company_accounts" ca
    WHERE ar.company_id = ca.id
      AND ar.company_owner_id IS NULL;
  `)

  // ═══════════════════════════════════════════════════════════════
  // STEP 9: Update Payload internal rels tables
  // ═══════════════════════════════════════════════════════════════
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "customers_id",
      DROP COLUMN IF EXISTS "company_accounts_id",
      ADD COLUMN IF NOT EXISTS "uptime_incidents_id" integer;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_uptime_incidents_id_idx"
      ON "payload_locked_documents_rels" USING btree ("uptime_incidents_id");

    ALTER TABLE "payload_preferences_rels"
      DROP COLUMN IF EXISTS "customers_id",
      DROP COLUMN IF EXISTS "company_accounts_id";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Remove new columns from users (rollback)
  await db.execute(sql`
    ALTER TABLE "users"
      DROP COLUMN IF EXISTS "date_of_birth",
      DROP COLUMN IF EXISTS "customer_group_id",
      DROP COLUMN IF EXISTS "customer_status",
      DROP COLUMN IF EXISTS "custom_pricing_role",
      DROP COLUMN IF EXISTS "discount",
      DROP COLUMN IF EXISTS "credit_limit",
      DROP COLUMN IF EXISTS "payment_terms",
      DROP COLUMN IF EXISTS "verified",
      DROP COLUMN IF EXISTS "notes",
      DROP COLUMN IF EXISTS "total_orders",
      DROP COLUMN IF EXISTS "total_spent",
      DROP COLUMN IF EXISTS "average_order_value",
      DROP COLUMN IF EXISTS "last_order_date",
      DROP COLUMN IF EXISTS "language",
      DROP COLUMN IF EXISTS "currency",
      DROP COLUMN IF EXISTS "newsletter",
      DROP COLUMN IF EXISTS "marketing_emails",
      DROP COLUMN IF EXISTS "order_notifications",
      DROP COLUMN IF EXISTS "company_owner_id",
      DROP COLUMN IF EXISTS "company_status",
      DROP COLUMN IF EXISTS "company_monthly_budget",
      DROP COLUMN IF EXISTS "company_quarterly_budget",
      DROP COLUMN IF EXISTS "company_approval_threshold",
      DROP COLUMN IF EXISTS "company_credit_limit",
      DROP COLUMN IF EXISTS "company_credit_used",
      DROP COLUMN IF EXISTS "company_payment_terms";
  `)
}
