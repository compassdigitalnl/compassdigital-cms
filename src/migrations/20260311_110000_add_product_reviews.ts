import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/**
 * Migration: Add product_reviews table
 *
 * Creates the product-reviews collection table with AI moderation fields.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const db = payload.db?.pool
  if (!db) return

  await db.query(`
    -- Create product_reviews table
    CREATE TABLE IF NOT EXISTS product_reviews (
      id serial PRIMARY KEY,
      product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      title character varying,
      rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment text NOT NULL,
      user_id integer REFERENCES users(id) ON DELETE SET NULL,
      author_name character varying NOT NULL,
      author_email character varying,
      author_initials character varying,
      status character varying DEFAULT 'pending' NOT NULL,
      is_verified_purchase boolean DEFAULT false,
      moderation_notes text,

      -- AI Analysis (group: ai)
      ai_moderated boolean DEFAULT false,
      ai_score integer,
      ai_sentiment character varying,
      ai_topics jsonb,
      ai_toxicity integer,
      ai_is_fake boolean DEFAULT false,
      ai_summary character varying,

      -- Engagement
      helpful_yes integer DEFAULT 0,
      helpful_no integer DEFAULT 0,

      -- Seller Response (group: response)
      response_text text,
      response_responded_at timestamp(3) with time zone,

      updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
      created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    -- Index for querying by product
    CREATE INDEX IF NOT EXISTS product_reviews_product_idx ON product_reviews(product_id);

    -- Index for filtering by status
    CREATE INDEX IF NOT EXISTS product_reviews_status_idx ON product_reviews(status);

    -- Index for querying by user
    CREATE INDEX IF NOT EXISTS product_reviews_user_idx ON product_reviews(user_id);

    -- Index for sorting by created_at
    CREATE INDEX IF NOT EXISTS product_reviews_created_at_idx ON product_reviews(created_at);

    -- Index for sorting by helpful votes
    CREATE INDEX IF NOT EXISTS product_reviews_helpful_idx ON product_reviews(helpful_yes DESC);

    -- Composite index for common query: approved reviews for a product
    CREATE INDEX IF NOT EXISTS product_reviews_product_status_idx
      ON product_reviews(product_id, status);

    -- Unique constraint: one review per user per product
    CREATE UNIQUE INDEX IF NOT EXISTS product_reviews_user_product_unique
      ON product_reviews(user_id, product_id) WHERE user_id IS NOT NULL;

    -- Add reviewCount and reviewAverage to products table if not exists
    ALTER TABLE products ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS review_average numeric DEFAULT 0;
  `)

  payload.logger.info('Migration: product_reviews table created')
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  const db = payload.db?.pool
  if (!db) return

  await db.query(`
    ALTER TABLE products DROP COLUMN IF EXISTS review_count;
    ALTER TABLE products DROP COLUMN IF EXISTS review_average;
    DROP TABLE IF EXISTS product_reviews CASCADE;
  `)

  payload.logger.info('Migration: product_reviews table dropped')
}
