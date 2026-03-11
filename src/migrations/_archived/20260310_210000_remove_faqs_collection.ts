import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

/**
 * Migration: Remove FAQs collection
 *
 * FAQs are now handled via the FAQ block on pages (inline content).
 * The separate faqs collection/table is no longer needed.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS faqs_rels CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS faqs CASCADE;`)

  await db.execute(sql`
    DELETE FROM payload_locked_documents_rels
    WHERE faqs_id IS NOT NULL;
  `)

  await db.execute(sql`
    ALTER TABLE payload_locked_documents_rels
    DROP COLUMN IF EXISTS faqs_id;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS faqs (
      id serial PRIMARY KEY,
      question varchar NOT NULL,
      answer jsonb,
      category varchar DEFAULT 'algemeen',
      featured boolean DEFAULT false,
      "order" integer DEFAULT 0,
      status varchar DEFAULT 'published',
      updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
      created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)
}
