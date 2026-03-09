import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Search analytics table — always create (no pgvector dependency)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "search_analytics" (
      "id" serial PRIMARY KEY,
      "query" varchar NOT NULL,
      "query_type" varchar DEFAULT 'keyword',
      "results_count" integer DEFAULT 0,
      "clicked_id" integer,
      "clicked_collection" varchar,
      "clicked_position" integer,
      "session_id" varchar,
      "user_id" integer,
      "response_time_ms" integer,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "search_analytics_query_idx" ON "search_analytics" USING btree ("query");
    CREATE INDEX IF NOT EXISTS "search_analytics_created_at_idx" ON "search_analytics" USING btree ("created_at");
  `)

  // Try pgvector — use SAVEPOINT so a failure doesn't abort the transaction
  try {
    await db.execute(sql`SAVEPOINT pgvector_check`)
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector`)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "content_embeddings" (
        "id" serial PRIMARY KEY,
        "collection_type" varchar NOT NULL,
        "doc_id" integer NOT NULL,
        "embedding" vector(1536) NOT NULL,
        "text_hash" varchar,
        "metadata" jsonb,
        "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        UNIQUE("collection_type", "doc_id")
      );
      CREATE INDEX IF NOT EXISTS "embeddings_collection_idx" ON "content_embeddings" USING btree ("collection_type");
      CREATE INDEX IF NOT EXISTS "embeddings_vector_idx" ON "content_embeddings" USING ivfflat ("embedding" vector_cosine_ops) WITH (lists = 100);
    `)
    await db.execute(sql`RELEASE SAVEPOINT pgvector_check`)
  } catch {
    await db.execute(sql`ROLLBACK TO SAVEPOINT pgvector_check`)
    console.warn('[Migration] pgvector not available — skipping embeddings table. Semantic search disabled.')
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "search_analytics";
    DROP TABLE IF EXISTS "content_embeddings";
  `)
}
