import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

/**
 * Migration: Rename deeply nested product array/enum tables to short dbName
 *
 * Products collection has versions enabled, which creates _products_v_version_* tables.
 * Several nested arrays/selects produce names exceeding PostgreSQL's 63-char limit:
 *
 * Configurator:
 *   _products_v_version_configurator_config_configurator_steps_options (66 chars)
 *
 * Subscription:
 *   enum__products_v_version_subscription_config_subscription_plans_interval (72 chars)
 *   _products_v_version_subscription_config_subscription_plans_features (67 chars)
 *
 * Fix: Add dbName/enumName to shorten table/enum names.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── Configurator tables ──
  await db.execute(sql`
    ALTER TABLE IF EXISTS products_configurator_config_configurator_steps_options
    RENAME TO prod_cfg_step_opts;
  `)
  await db.execute(sql`
    ALTER TABLE IF EXISTS products_configurator_config_configurator_steps
    RENAME TO prod_cfg_steps;
  `)

  // ── Subscription tables ──
  await db.execute(sql`
    ALTER TABLE IF EXISTS products_subscription_config_subscription_plans_features
    RENAME TO prod_sub_plan_features;
  `)
  await db.execute(sql`
    ALTER TABLE IF EXISTS products_subscription_config_subscription_plans
    RENAME TO prod_sub_plans;
  `)

  // ── Subscription enum (interval select) ──
  // Note: ALTER TYPE does not support IF EXISTS in PostgreSQL
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE enum_products_subscription_config_subscription_plans_interval
      RENAME TO prod_sub_plan_interval;
    EXCEPTION WHEN undefined_object THEN null;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // ── Configurator tables ──
  await db.execute(sql`
    ALTER TABLE IF EXISTS prod_cfg_steps
    RENAME TO products_configurator_config_configurator_steps;
  `)
  await db.execute(sql`
    ALTER TABLE IF EXISTS prod_cfg_step_opts
    RENAME TO products_configurator_config_configurator_steps_options;
  `)

  // ── Subscription tables ──
  await db.execute(sql`
    ALTER TABLE IF EXISTS prod_sub_plans
    RENAME TO products_subscription_config_subscription_plans;
  `)
  await db.execute(sql`
    ALTER TABLE IF EXISTS prod_sub_plan_features
    RENAME TO products_subscription_config_subscription_plans_features;
  `)

  // ── Subscription enum ──
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE prod_sub_plan_interval
      RENAME TO enum_products_subscription_config_subscription_plans_interval;
    EXCEPTION WHEN undefined_object THEN null;
    END $$;
  `)
}
