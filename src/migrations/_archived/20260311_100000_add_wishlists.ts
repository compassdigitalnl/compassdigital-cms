import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/**
 * Migration: Add wishlists table
 *
 * Creates the wishlists collection table for user favorites with sharing capability.
 * Includes unique constraint on (user_id, product_id) to prevent duplicates.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const db = payload.db?.pool
  if (!db) return

  await db.query(`
    -- Create wishlists table
    CREATE TABLE IF NOT EXISTS wishlists (
      id serial PRIMARY KEY,
      user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      is_public boolean DEFAULT false,
      share_token character varying UNIQUE,
      notes character varying,
      updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
      created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    -- Unique constraint: one product per user
    CREATE UNIQUE INDEX IF NOT EXISTS wishlists_user_product_unique
      ON wishlists(user_id, product_id);

    -- Index for querying by user
    CREATE INDEX IF NOT EXISTS wishlists_user_idx ON wishlists(user_id);

    -- Index for querying by share token (public wishlists)
    CREATE INDEX IF NOT EXISTS wishlists_share_token_idx ON wishlists(share_token);

    -- Index for querying public items
    CREATE INDEX IF NOT EXISTS wishlists_is_public_idx ON wishlists(is_public) WHERE is_public = true;

    -- Index for created_at sorting
    CREATE INDEX IF NOT EXISTS wishlists_created_at_idx ON wishlists(created_at);
  `)

  payload.logger.info('Migration: wishlists table created')
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  const db = payload.db?.pool
  if (!db) return

  await db.query(`
    DROP TABLE IF EXISTS wishlists CASCADE;
  `)

  payload.logger.info('Migration: wishlists table dropped')
}
