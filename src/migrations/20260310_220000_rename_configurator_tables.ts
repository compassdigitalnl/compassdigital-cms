import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

/**
 * Migration: Rename configurator array tables to short dbName
 *
 * Products collection has versions enabled, which creates _products_v_version_* tables.
 * The nested configurator arrays produce table names that exceed PostgreSQL's 63-char limit:
 *   _products_v_version_configurator_config_configurator_steps_options (66 chars)
 *
 * Fix: Add dbName to configurator arrays:
 *   configuratorSteps → prod_cfg_steps
 *   options           → prod_cfg_step_opts
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Rename the nested options table first (depends on steps table)
  await db.execute(sql`
    ALTER TABLE IF EXISTS products_configurator_config_configurator_steps_options
    RENAME TO prod_cfg_step_opts;
  `)

  // Rename the steps table
  await db.execute(sql`
    ALTER TABLE IF EXISTS products_configurator_config_configurator_steps
    RENAME TO prod_cfg_steps;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS prod_cfg_steps
    RENAME TO products_configurator_config_configurator_steps;
  `)

  await db.execute(sql`
    ALTER TABLE IF EXISTS prod_cfg_step_opts
    RENAME TO products_configurator_config_configurator_steps_options;
  `)
}
