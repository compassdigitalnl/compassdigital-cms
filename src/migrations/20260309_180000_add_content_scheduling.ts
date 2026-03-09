import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add publishAt and unpublishAt to pages
  await db.execute(sql`
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "publish_at" timestamp(3) with time zone;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "unpublish_at" timestamp(3) with time zone;
    CREATE INDEX IF NOT EXISTS "pages_publish_at_idx" ON "pages" USING btree ("publish_at");
    CREATE INDEX IF NOT EXISTS "pages_unpublish_at_idx" ON "pages" USING btree ("unpublish_at");
  `)

  // Add publishAt and unpublishAt to blog_posts
  await db.execute(sql`
    ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "publish_at" timestamp(3) with time zone;
    ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "unpublish_at" timestamp(3) with time zone;
    CREATE INDEX IF NOT EXISTS "blog_posts_publish_at_idx" ON "blog_posts" USING btree ("publish_at");
    CREATE INDEX IF NOT EXISTS "blog_posts_unpublish_at_idx" ON "blog_posts" USING btree ("unpublish_at");
  `)

  // Add publishAt and unpublishAt to products
  await db.execute(sql`
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "publish_at" timestamp(3) with time zone;
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "unpublish_at" timestamp(3) with time zone;
    CREATE INDEX IF NOT EXISTS "products_publish_at_idx" ON "products" USING btree ("publish_at");
    CREATE INDEX IF NOT EXISTS "products_unpublish_at_idx" ON "products" USING btree ("unpublish_at");
  `)

  // Add timezone to settings (global)
  await db.execute(sql`
    ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "timezone" varchar DEFAULT 'Europe/Amsterdam';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "publish_at";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "unpublish_at";
    ALTER TABLE "blog_posts" DROP COLUMN IF EXISTS "publish_at";
    ALTER TABLE "blog_posts" DROP COLUMN IF EXISTS "unpublish_at";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "publish_at";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "unpublish_at";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "timezone";
  `)
}
