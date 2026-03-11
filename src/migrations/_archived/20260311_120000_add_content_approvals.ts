import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/**
 * Migration: Add content_approvals table
 *
 * Creates the content-approvals collection table for editorial workflow.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const db = payload.db?.pool
  if (!db) return

  await db.query(`
    -- Create content_approvals table
    CREATE TABLE IF NOT EXISTS content_approvals (
      id serial PRIMARY KEY,
      content_type character varying NOT NULL,
      content_id integer NOT NULL,
      title character varying NOT NULL,
      content_slug character varying,
      status character varying DEFAULT 'pending' NOT NULL,
      priority character varying DEFAULT 'normal',
      submitted_by_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      reviewer_id integer REFERENCES users(id) ON DELETE SET NULL,
      submission_note text,
      review_note text,
      submitted_at timestamp(3) with time zone DEFAULT now(),
      reviewed_at timestamp(3) with time zone,
      history jsonb,
      updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
      created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    -- Index for filtering by status
    CREATE INDEX IF NOT EXISTS content_approvals_status_idx ON content_approvals(status);

    -- Index for querying by submitter
    CREATE INDEX IF NOT EXISTS content_approvals_submitted_by_idx ON content_approvals(submitted_by_id);

    -- Index for querying by reviewer
    CREATE INDEX IF NOT EXISTS content_approvals_reviewer_idx ON content_approvals(reviewer_id);

    -- Index for content lookups
    CREATE INDEX IF NOT EXISTS content_approvals_content_idx ON content_approvals(content_type, content_id);

    -- Index for sorting
    CREATE INDEX IF NOT EXISTS content_approvals_created_at_idx ON content_approvals(created_at);

    -- Prevent duplicate pending approvals
    CREATE UNIQUE INDEX IF NOT EXISTS content_approvals_pending_unique
      ON content_approvals(content_type, content_id) WHERE status = 'pending';
  `)

  payload.logger.info('Migration: content_approvals table created')
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  const db = payload.db?.pool
  if (!db) return

  await db.query(`
    DROP TABLE IF EXISTS content_approvals CASCADE;
  `)

  payload.logger.info('Migration: content_approvals table dropped')
}
