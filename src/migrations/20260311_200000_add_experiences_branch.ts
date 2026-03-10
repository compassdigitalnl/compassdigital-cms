import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const db = payload.db?.pool
  if (!db) return

  // ENUMs
  await db.query(`
    DO $$ BEGIN CREATE TYPE "enum_experiences_extras_price_type" AS ENUM('per-person', 'fixed', 'per-hour'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum_experiences_availability" AS ENUM('year-round', 'seasonal', 'weekends-only', 'custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum_experiences_status" AS ENUM('draft', 'published', 'archived'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum_experiences_price_type" AS ENUM('per-person', 'fixed', 'from'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum_experience_reviews_status" AS ENUM('pending', 'approved', 'rejected'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum__experiences_v_version_extras_price_type" AS ENUM('per-person', 'fixed', 'per-hour'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum__experiences_v_version_availability" AS ENUM('year-round', 'seasonal', 'weekends-only', 'custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum__experiences_v_version_status" AS ENUM('draft', 'published', 'archived'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum__experiences_v_version_price_type" AS ENUM('per-person', 'fixed', 'from'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum_pages_blocks_experience_hero_background_style" AS ENUM('gradient', 'image', 'solid'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum_pages_blocks_experience_grid_source" AS ENUM('auto', 'featured', 'manual', 'category'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum_pages_blocks_experience_grid_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum_pages_blocks_experience_category_grid_source" AS ENUM('auto', 'manual'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum_pages_blocks_experience_category_grid_columns" AS ENUM('3', '4', '6'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum_pages_blocks_experience_social_proof_layout" AS ENUM('cards', 'carousel', 'compact'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum__pages_v_blocks_experience_hero_background_style" AS ENUM('gradient', 'image', 'solid'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum__pages_v_blocks_experience_grid_source" AS ENUM('auto', 'featured', 'manual', 'category'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum__pages_v_blocks_experience_grid_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum__pages_v_blocks_experience_category_grid_source" AS ENUM('auto', 'manual'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum__pages_v_blocks_experience_category_grid_columns" AS ENUM('3', '4', '6'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "enum__pages_v_blocks_experience_social_proof_layout" AS ENUM('cards', 'carousel', 'compact'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // Experience Categories
  await db.query(`
    CREATE TABLE IF NOT EXISTS experience_categories (
      id serial PRIMARY KEY,
      name varchar NOT NULL,
      slug varchar,
      description varchar,
      icon varchar,
      image_id integer,
      sort_order numeric DEFAULT 0,
      updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
      created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_exp_cat_slug ON experience_categories(slug);
    CREATE INDEX IF NOT EXISTS idx_exp_cat_created ON experience_categories(created_at);
  `)

  // Experiences
  await db.query(`
    CREATE TABLE IF NOT EXISTS experiences (
      id serial PRIMARY KEY,
      title varchar NOT NULL,
      slug varchar,
      generate_slug boolean DEFAULT true,
      excerpt varchar,
      description jsonb,
      category_id integer,
      duration varchar,
      min_persons numeric,
      max_persons numeric,
      location varchar,
      location_details varchar,
      availability "enum_experiences_availability",
      featured boolean DEFAULT false,
      popular boolean DEFAULT false,
      status "enum_experiences_status" DEFAULT 'draft',
      price_per_person numeric,
      price_type "enum_experiences_price_type" DEFAULT 'per-person',
      price_note varchar,
      featured_image_id integer,
      meta_title varchar,
      meta_description varchar,
      meta_keywords varchar,
      _status varchar DEFAULT 'draft',
      updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
      created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_exp_slug ON experiences(slug);
    CREATE INDEX IF NOT EXISTS idx_exp_cat ON experiences(category_id);
    CREATE INDEX IF NOT EXISTS idx_exp_status ON experiences(status);
    CREATE INDEX IF NOT EXISTS idx_exp_featured ON experiences(featured);
    CREATE INDEX IF NOT EXISTS idx_exp_created ON experiences(created_at);
    CREATE INDEX IF NOT EXISTS idx_exp__status ON experiences(_status);
  `)

  // Experiences sub-tables
  await db.query(`
    CREATE TABLE IF NOT EXISTS experiences_highlights (
      _order integer NOT NULL, _parent_id integer NOT NULL, id serial PRIMARY KEY,
      label varchar NOT NULL, icon varchar
    );
    CREATE INDEX IF NOT EXISTS idx_exp_hi_parent ON experiences_highlights(_parent_id);

    CREATE TABLE IF NOT EXISTS experiences_included (
      _order integer NOT NULL, _parent_id integer NOT NULL, id serial PRIMARY KEY,
      label varchar NOT NULL, icon varchar
    );
    CREATE INDEX IF NOT EXISTS idx_exp_inc_parent ON experiences_included(_parent_id);

    CREATE TABLE IF NOT EXISTS experiences_extras (
      _order integer NOT NULL, _parent_id integer NOT NULL, id serial PRIMARY KEY,
      name varchar NOT NULL, description varchar, price numeric NOT NULL,
      price_type "enum_experiences_extras_price_type" DEFAULT 'per-person',
      popular boolean DEFAULT false
    );
    CREATE INDEX IF NOT EXISTS idx_exp_ext_parent ON experiences_extras(_parent_id);

    CREATE TABLE IF NOT EXISTS experiences_gallery (
      _order integer NOT NULL, _parent_id integer NOT NULL, id serial PRIMARY KEY,
      image_id integer, caption varchar, is_video boolean DEFAULT false
    );
    CREATE INDEX IF NOT EXISTS idx_exp_gal_parent ON experiences_gallery(_parent_id);

    CREATE TABLE IF NOT EXISTS experiences_rels (
      id serial PRIMARY KEY, "order" integer, parent_id integer NOT NULL,
      path varchar NOT NULL, experience_categories_id integer, media_id integer
    );
    CREATE INDEX IF NOT EXISTS idx_exp_rels_parent ON experiences_rels(parent_id);
  `)

  // Experiences Versions
  await db.query(`
    CREATE TABLE IF NOT EXISTS _experiences_v (
      id serial PRIMARY KEY, parent_id integer,
      version_title varchar, version_slug varchar, version_generate_slug boolean DEFAULT true,
      version_excerpt varchar, version_description jsonb, version_category_id integer,
      version_duration varchar, version_min_persons numeric, version_max_persons numeric,
      version_location varchar, version_location_details varchar,
      version_availability "enum__experiences_v_version_availability",
      version_featured boolean DEFAULT false, version_popular boolean DEFAULT false,
      version_status "enum__experiences_v_version_status" DEFAULT 'draft',
      version_price_per_person numeric,
      version_price_type "enum__experiences_v_version_price_type" DEFAULT 'per-person',
      version_price_note varchar, version_featured_image_id integer,
      version_meta_title varchar, version_meta_description varchar, version_meta_keywords varchar,
      version__status varchar DEFAULT 'draft',
      version_updated_at timestamp(3) with time zone, version_created_at timestamp(3) with time zone,
      latest boolean, autosave boolean,
      created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
      updated_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_exp_v_parent ON _experiences_v(parent_id);
    CREATE INDEX IF NOT EXISTS idx_exp_v_latest ON _experiences_v(latest);

    CREATE TABLE IF NOT EXISTS _experiences_v_version_highlights (
      _order integer NOT NULL, _parent_id integer NOT NULL, id serial PRIMARY KEY,
      label varchar, icon varchar
    );
    CREATE INDEX IF NOT EXISTS idx_exp_v_hi_parent ON _experiences_v_version_highlights(_parent_id);

    CREATE TABLE IF NOT EXISTS _experiences_v_version_included (
      _order integer NOT NULL, _parent_id integer NOT NULL, id serial PRIMARY KEY,
      label varchar, icon varchar
    );
    CREATE INDEX IF NOT EXISTS idx_exp_v_inc_parent ON _experiences_v_version_included(_parent_id);

    CREATE TABLE IF NOT EXISTS _experiences_v_version_extras (
      _order integer NOT NULL, _parent_id integer NOT NULL, id serial PRIMARY KEY,
      name varchar, description varchar, price numeric,
      price_type "enum__experiences_v_version_extras_price_type", popular boolean DEFAULT false
    );
    CREATE INDEX IF NOT EXISTS idx_exp_v_ext_parent ON _experiences_v_version_extras(_parent_id);

    CREATE TABLE IF NOT EXISTS _experiences_v_version_gallery (
      _order integer NOT NULL, _parent_id integer NOT NULL, id serial PRIMARY KEY,
      image_id integer, caption varchar, is_video boolean DEFAULT false
    );
    CREATE INDEX IF NOT EXISTS idx_exp_v_gal_parent ON _experiences_v_version_gallery(_parent_id);

    CREATE TABLE IF NOT EXISTS _experiences_v_rels (
      id serial PRIMARY KEY, "order" integer, parent_id integer NOT NULL,
      path varchar NOT NULL, experience_categories_id integer, media_id integer
    );
    CREATE INDEX IF NOT EXISTS idx_exp_v_rels_parent ON _experiences_v_rels(parent_id);
  `)

  // Experience Reviews
  await db.query(`
    CREATE TABLE IF NOT EXISTS experience_reviews (
      id serial PRIMARY KEY, experience_id integer,
      reviewer_name varchar NOT NULL, reviewer_email varchar,
      overall_rating numeric NOT NULL,
      rating_value numeric, rating_service numeric, rating_location numeric,
      rating_price numeric, rating_atmosphere numeric,
      review_text varchar,
      status "enum_experience_reviews_status" DEFAULT 'pending',
      updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
      created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_exp_rev_exp ON experience_reviews(experience_id);
    CREATE INDEX IF NOT EXISTS idx_exp_rev_status ON experience_reviews(status);
  `)

  // Pages Block Tables - Experience Hero
  await db.query(`
    CREATE TABLE IF NOT EXISTS pages_blocks_experience_hero_trust_badges (
      _order integer NOT NULL, _parent_id integer NOT NULL, id serial PRIMARY KEY,
      icon varchar, label varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_pb_exp_hero_tb_parent ON pages_blocks_experience_hero_trust_badges(_parent_id);

    CREATE TABLE IF NOT EXISTS pages_blocks_experience_hero (
      _order integer NOT NULL, _parent_id integer NOT NULL, _path text NOT NULL,
      id serial PRIMARY KEY, subtitle varchar, title varchar NOT NULL,
      description varchar, show_search_bar boolean DEFAULT true,
      show_category_pills boolean DEFAULT true, background_image_id integer,
      background_style "enum_pages_blocks_experience_hero_background_style" DEFAULT 'gradient',
      overlay_opacity numeric DEFAULT 60, block_name varchar
    );
    CREATE INDEX IF NOT EXISTS idx_pb_exp_hero_parent ON pages_blocks_experience_hero(_parent_id);
    CREATE INDEX IF NOT EXISTS idx_pb_exp_hero_path ON pages_blocks_experience_hero(_path);
  `)

  // Pages Block Tables - Experience Grid
  await db.query(`
    CREATE TABLE IF NOT EXISTS pages_blocks_experience_grid (
      _order integer NOT NULL, _parent_id integer NOT NULL, _path text NOT NULL,
      id serial PRIMARY KEY, heading_badge varchar, heading_title varchar DEFAULT 'Alle ervaringen',
      heading_description varchar,
      source "enum_pages_blocks_experience_grid_source" DEFAULT 'auto',
      experiences_id integer, category_id integer,
      show_filters boolean DEFAULT false,
      columns "enum_pages_blocks_experience_grid_columns" DEFAULT '3',
      "limit" numeric DEFAULT 12, show_pagination boolean DEFAULT true, block_name varchar
    );
    CREATE INDEX IF NOT EXISTS idx_pb_exp_grid_parent ON pages_blocks_experience_grid(_parent_id);
    CREATE INDEX IF NOT EXISTS idx_pb_exp_grid_path ON pages_blocks_experience_grid(_path);
  `)

  // Pages Block Tables - Experience Category Grid
  await db.query(`
    CREATE TABLE IF NOT EXISTS pages_blocks_experience_category_grid (
      _order integer NOT NULL, _parent_id integer NOT NULL, _path text NOT NULL,
      id serial PRIMARY KEY, heading_badge varchar, heading_title varchar DEFAULT 'Wat wil je doen?',
      heading_description varchar,
      source "enum_pages_blocks_experience_category_grid_source" DEFAULT 'auto',
      columns "enum_pages_blocks_experience_category_grid_columns" DEFAULT '4',
      "limit" numeric DEFAULT 8, show_count boolean DEFAULT true, block_name varchar
    );
    CREATE INDEX IF NOT EXISTS idx_pb_exp_cg_parent ON pages_blocks_experience_category_grid(_parent_id);
    CREATE INDEX IF NOT EXISTS idx_pb_exp_cg_path ON pages_blocks_experience_category_grid(_path);
  `)

  // Pages Block Tables - Experience Social Proof
  await db.query(`
    CREATE TABLE IF NOT EXISTS pages_blocks_experience_social_proof_stats (
      _order integer NOT NULL, _parent_id integer NOT NULL, id serial PRIMARY KEY,
      value varchar NOT NULL, label varchar NOT NULL, icon varchar
    );
    CREATE INDEX IF NOT EXISTS idx_pb_exp_sp_stats_parent ON pages_blocks_experience_social_proof_stats(_parent_id);

    CREATE TABLE IF NOT EXISTS pages_blocks_experience_social_proof_testimonials (
      _order integer NOT NULL, _parent_id integer NOT NULL, id serial PRIMARY KEY,
      quote varchar NOT NULL, author varchar NOT NULL, role varchar,
      rating numeric DEFAULT 5, avatar_id integer
    );
    CREATE INDEX IF NOT EXISTS idx_pb_exp_sp_test_parent ON pages_blocks_experience_social_proof_testimonials(_parent_id);

    CREATE TABLE IF NOT EXISTS pages_blocks_experience_social_proof (
      _order integer NOT NULL, _parent_id integer NOT NULL, _path text NOT NULL,
      id serial PRIMARY KEY, heading_badge varchar, heading_title varchar DEFAULT 'Wat anderen zeggen',
      show_activity_ticker boolean DEFAULT false,
      layout "enum_pages_blocks_experience_social_proof_layout" DEFAULT 'cards',
      block_name varchar
    );
    CREATE INDEX IF NOT EXISTS idx_pb_exp_sp_parent ON pages_blocks_experience_social_proof(_parent_id);
    CREATE INDEX IF NOT EXISTS idx_pb_exp_sp_path ON pages_blocks_experience_social_proof(_path);
  `)

  // Pages Version Block Tables
  await db.query(`
    CREATE TABLE IF NOT EXISTS _pages_v_blocks_experience_hero_trust_badges (
      _order integer NOT NULL, _parent_id integer NOT NULL, id serial PRIMARY KEY,
      icon varchar, label varchar
    );
    CREATE TABLE IF NOT EXISTS _pages_v_blocks_experience_hero (
      _order integer NOT NULL, _parent_id integer NOT NULL, _path text NOT NULL,
      id serial PRIMARY KEY, subtitle varchar, title varchar, description varchar,
      show_search_bar boolean DEFAULT true, show_category_pills boolean DEFAULT true,
      background_image_id integer,
      background_style "enum__pages_v_blocks_experience_hero_background_style" DEFAULT 'gradient',
      overlay_opacity numeric DEFAULT 60, block_name varchar
    );
    CREATE TABLE IF NOT EXISTS _pages_v_blocks_experience_grid (
      _order integer NOT NULL, _parent_id integer NOT NULL, _path text NOT NULL,
      id serial PRIMARY KEY, heading_badge varchar, heading_title varchar,
      heading_description varchar,
      source "enum__pages_v_blocks_experience_grid_source",
      experiences_id integer, category_id integer, show_filters boolean DEFAULT false,
      columns "enum__pages_v_blocks_experience_grid_columns",
      "limit" numeric, show_pagination boolean DEFAULT true, block_name varchar
    );
    CREATE TABLE IF NOT EXISTS _pages_v_blocks_experience_category_grid (
      _order integer NOT NULL, _parent_id integer NOT NULL, _path text NOT NULL,
      id serial PRIMARY KEY, heading_badge varchar, heading_title varchar,
      heading_description varchar,
      source "enum__pages_v_blocks_experience_category_grid_source",
      columns "enum__pages_v_blocks_experience_category_grid_columns",
      "limit" numeric, show_count boolean DEFAULT true, block_name varchar
    );
    CREATE TABLE IF NOT EXISTS _pages_v_blocks_experience_social_proof_stats (
      _order integer NOT NULL, _parent_id integer NOT NULL, id serial PRIMARY KEY,
      value varchar, label varchar, icon varchar
    );
    CREATE TABLE IF NOT EXISTS _pages_v_blocks_experience_social_proof_testimonials (
      _order integer NOT NULL, _parent_id integer NOT NULL, id serial PRIMARY KEY,
      quote varchar, author varchar, role varchar, rating numeric, avatar_id integer
    );
    CREATE TABLE IF NOT EXISTS _pages_v_blocks_experience_social_proof (
      _order integer NOT NULL, _parent_id integer NOT NULL, _path text NOT NULL,
      id serial PRIMARY KEY, heading_badge varchar, heading_title varchar,
      show_activity_ticker boolean DEFAULT false,
      layout "enum__pages_v_blocks_experience_social_proof_layout",
      block_name varchar
    );
  `)

  // Product review columns
  await db.query(`
    ALTER TABLE products ADD COLUMN IF NOT EXISTS review_count numeric DEFAULT 0;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS review_average numeric DEFAULT 0;
  `)

  // Rels columns for pages, pages versions, locked documents, and preferences
  const relsCollections = [
    'experiences_id',
    'experience_categories_id',
    'experience_reviews_id',
    'wishlists_id',
    'product_reviews_id',
    'content_approvals_id',
  ]
  const relsTables = [
    'pages_rels',
    '_pages_v_rels',
    'payload_locked_documents_rels',
    'payload_preferences_rels',
  ]
  for (const table of relsTables) {
    for (const col of relsCollections) {
      await db.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${col} integer`)
    }
  }

  payload.logger.info('Migration: experiences branch tables created')
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  const db = payload.db?.pool
  if (!db) return

  await db.query(`
    DROP TABLE IF EXISTS _pages_v_blocks_experience_social_proof_testimonials CASCADE;
    DROP TABLE IF EXISTS _pages_v_blocks_experience_social_proof_stats CASCADE;
    DROP TABLE IF EXISTS _pages_v_blocks_experience_social_proof CASCADE;
    DROP TABLE IF EXISTS _pages_v_blocks_experience_category_grid CASCADE;
    DROP TABLE IF EXISTS _pages_v_blocks_experience_grid CASCADE;
    DROP TABLE IF EXISTS _pages_v_blocks_experience_hero_trust_badges CASCADE;
    DROP TABLE IF EXISTS _pages_v_blocks_experience_hero CASCADE;
    DROP TABLE IF EXISTS pages_blocks_experience_social_proof_testimonials CASCADE;
    DROP TABLE IF EXISTS pages_blocks_experience_social_proof_stats CASCADE;
    DROP TABLE IF EXISTS pages_blocks_experience_social_proof CASCADE;
    DROP TABLE IF EXISTS pages_blocks_experience_category_grid CASCADE;
    DROP TABLE IF EXISTS pages_blocks_experience_grid CASCADE;
    DROP TABLE IF EXISTS pages_blocks_experience_hero_trust_badges CASCADE;
    DROP TABLE IF EXISTS pages_blocks_experience_hero CASCADE;
    DROP TABLE IF EXISTS experience_reviews CASCADE;
    DROP TABLE IF EXISTS _experiences_v_rels CASCADE;
    DROP TABLE IF EXISTS _experiences_v_version_gallery CASCADE;
    DROP TABLE IF EXISTS _experiences_v_version_extras CASCADE;
    DROP TABLE IF EXISTS _experiences_v_version_included CASCADE;
    DROP TABLE IF EXISTS _experiences_v_version_highlights CASCADE;
    DROP TABLE IF EXISTS _experiences_v CASCADE;
    DROP TABLE IF EXISTS experiences_rels CASCADE;
    DROP TABLE IF EXISTS experiences_gallery CASCADE;
    DROP TABLE IF EXISTS experiences_extras CASCADE;
    DROP TABLE IF EXISTS experiences_included CASCADE;
    DROP TABLE IF EXISTS experiences_highlights CASCADE;
    DROP TABLE IF EXISTS experiences CASCADE;
    DROP TABLE IF EXISTS experience_categories CASCADE;
    ALTER TABLE products DROP COLUMN IF EXISTS review_count;
    ALTER TABLE products DROP COLUMN IF EXISTS review_average;
  `)

  payload.logger.info('Migration: experiences branch tables dropped')
}
