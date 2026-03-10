import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

/**
 * Migration: Remove separate Addresses collection
 *
 * Addresses are now stored inline on Users (Adressen tab).
 * The separate `addresses` collection/table is no longer needed.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Drop the addresses table and related rels table
  await db.execute(sql`DROP TABLE IF EXISTS addresses_rels CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS addresses CASCADE;`)

  // Clean up payload_locked_documents_rels references
  await db.execute(sql`
    DELETE FROM payload_locked_documents_rels
    WHERE addresses_id IS NOT NULL;
  `)

  // Drop the column from payload_locked_documents_rels if it exists
  await db.execute(sql`
    ALTER TABLE payload_locked_documents_rels
    DROP COLUMN IF EXISTS addresses_id;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Recreate addresses table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS addresses (
      id serial PRIMARY KEY,
      label varchar,
      user_id integer,
      type varchar DEFAULT 'shipping',
      company varchar,
      first_name varchar,
      last_name varchar,
      street varchar,
      house_number varchar,
      postal_code varchar,
      city varchar,
      country varchar DEFAULT 'NL',
      phone varchar,
      is_default boolean DEFAULT false,
      updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
      created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)
}
