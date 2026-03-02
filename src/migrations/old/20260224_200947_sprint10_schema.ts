import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN CREATE TYPE "public"."chatbot_kb_search_collections" AS ENUM('blog-posts', 'pages', 'faqs', 'products', 'cases'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_users_addresses_type" AS ENUM('shipping', 'billing', 'both'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_users_client_type" AS ENUM('website', 'webshop'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_banner_variant" AS ENUM('announcement', 'promo', 'warning'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_spacer_size" AS ENUM('sm', 'md', 'lg', 'xl'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_hero_buttons_style" AS ENUM('primary', 'secondary', 'ghost'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_hero_variant" AS ENUM('default', 'split', 'centered'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_hero_background_style" AS ENUM('gradient', 'image', 'solid'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_hero_background_color" AS ENUM('navy', 'white', 'bg', 'teal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_content_max_width" AS ENUM('narrow', 'wide', 'full'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_media_block_buttons_variant" AS ENUM('primary', 'secondary', 'outline', 'success', 'danger'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_media_block_media_type" AS ENUM('image', 'video'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_media_block_media_position" AS ENUM('left', 'right'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_media_block_split" AS ENUM('50-50', '60-40', '40-60'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_media_block_background_color" AS ENUM('white', 'bg', 'grey', 'tealLight', 'tealGlow', 'navy', 'navyLight'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_two_column_split" AS ENUM('50-50', '60-40', '40-60'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_product_grid_source" AS ENUM('manual', 'featured', 'latest', 'category', 'brand'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_product_grid_display_mode" AS ENUM('grid', 'carousel'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_product_grid_layout" AS ENUM('grid-2', 'grid-3', 'grid-4', 'grid-5'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_category_grid_source" AS ENUM('auto', 'manual'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_category_grid_layout" AS ENUM('grid-2', 'grid-3', 'grid-4', 'grid-5', 'grid-6'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_quick_order_input_mode" AS ENUM('textarea', 'single', 'both'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_cta_buttons_style" AS ENUM('primary', 'secondary', 'ghost'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_cta_variant" AS ENUM('centered', 'split', 'full-width'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_cta_style" AS ENUM('dark', 'light', 'gradient'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_calltoaction_background_color" AS ENUM('white', 'grey', 'teal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_newsletter_background_color" AS ENUM('white', 'grey', 'teal', 'navy'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_features_variant" AS ENUM('grid-3', 'grid-4', 'list'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_features_icon_style" AS ENUM('glow', 'solid', 'outlined'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_features_alignment" AS ENUM('center', 'left'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_services_services_icon_color" AS ENUM('teal', 'blue', 'green', 'purple', 'amber', 'coral'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_services_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_testimonials_variant" AS ENUM('grid', 'carousel', 'featured'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_cases_source" AS ENUM('featured', 'manual', 'latest'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_cases_layout" AS ENUM('grid-2', 'grid-3', 'grid-4'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_logo_bar_variant" AS ENUM('light', 'white', 'dark'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_stats_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_stats_background_color" AS ENUM('white', 'grey', 'tealGradient', 'navyGradient'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_faq_variant" AS ENUM('single-column', 'two-column'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_team_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_team_photo_style" AS ENUM('square', 'circle'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_team_background_color" AS ENUM('white', 'bg', 'grey'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_blog_preview_columns" AS ENUM('2', '3'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_comparison_rows_values_type" AS ENUM('check', 'x', 'text'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_infobox_variant" AS ENUM('info', 'success', 'warning', 'error'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_infobox_max_width" AS ENUM('narrow', 'wide', 'full'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_infobox_margin_top" AS ENUM('none', 'sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_infobox_margin_bottom" AS ENUM('none', 'sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_image_gallery_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_image_gallery_aspect_ratio" AS ENUM('16-9', '4-3', '1-1', 'auto'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_video_source" AS ENUM('youtube', 'vimeo', 'upload'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_video_aspect_ratio" AS ENUM('16-9', '4-3', '1-1', '21-9'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_code_language" AS ENUM('typescript', 'javascript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css', 'sql', 'bash', 'json', 'yaml', 'markdown', 'plaintext'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_map_height" AS ENUM('small', 'medium', 'large'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_construction_hero_avatars_color" AS ENUM('teal', 'blue', 'purple', 'amber'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_construction_hero_floating_badges_color" AS ENUM('green', 'amber', 'blue', 'teal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_construction_hero_floating_badges_position" AS ENUM('bottom-left', 'top-right'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_services_grid_services_source" AS ENUM('auto', 'manual'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_services_grid_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_projects_grid_projects_source" AS ENUM('auto', 'featured', 'manual', 'category'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_projects_grid_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_reviews_grid_reviews_source" AS ENUM('featured', 'auto', 'manual'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_reviews_grid_columns" AS ENUM('2', '3'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_reviews_grid_layout" AS ENUM('cards', 'quotes', 'compact'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_reviews_grid_average_rating_position" AS ENUM('top', 'left'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_stats_bar_stats_icon" AS ENUM('none', 'construction', 'star', 'users', 'trophy', 'chart', 'check', 'target', 'briefcase'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_stats_bar_style" AS ENUM('default', 'accent', 'dark', 'transparent'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_stats_bar_layout" AS ENUM('horizontal', 'grid'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_cta_banner_buttons_variant" AS ENUM('primary', 'secondary', 'white'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_cta_banner_trust_elements_items_icon" AS ENUM('check', 'star', 'trophy', 'lock', 'lightning'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_cta_banner_style" AS ENUM('gradient', 'solid', 'outlined', 'image'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_cta_banner_alignment" AS ENUM('left', 'center'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_cta_banner_size" AS ENUM('small', 'medium', 'large'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_banner_variant" AS ENUM('announcement', 'promo', 'warning'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_spacer_size" AS ENUM('sm', 'md', 'lg', 'xl'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_hero_buttons_style" AS ENUM('primary', 'secondary', 'ghost'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_hero_variant" AS ENUM('default', 'split', 'centered'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_hero_background_style" AS ENUM('gradient', 'image', 'solid'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_hero_background_color" AS ENUM('navy', 'white', 'bg', 'teal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_content_max_width" AS ENUM('narrow', 'wide', 'full'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_media_block_buttons_variant" AS ENUM('primary', 'secondary', 'outline', 'success', 'danger'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_media_block_media_type" AS ENUM('image', 'video'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_media_block_media_position" AS ENUM('left', 'right'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_media_block_split" AS ENUM('50-50', '60-40', '40-60'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_media_block_background_color" AS ENUM('white', 'bg', 'grey', 'tealLight', 'tealGlow', 'navy', 'navyLight'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_two_column_split" AS ENUM('50-50', '60-40', '40-60'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_product_grid_source" AS ENUM('manual', 'featured', 'latest', 'category', 'brand'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_product_grid_display_mode" AS ENUM('grid', 'carousel'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_product_grid_layout" AS ENUM('grid-2', 'grid-3', 'grid-4', 'grid-5'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_category_grid_source" AS ENUM('auto', 'manual'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_category_grid_layout" AS ENUM('grid-2', 'grid-3', 'grid-4', 'grid-5', 'grid-6'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_quick_order_input_mode" AS ENUM('textarea', 'single', 'both'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_cta_buttons_style" AS ENUM('primary', 'secondary', 'ghost'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_cta_variant" AS ENUM('centered', 'split', 'full-width'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_cta_style" AS ENUM('dark', 'light', 'gradient'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_calltoaction_background_color" AS ENUM('white', 'grey', 'teal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_newsletter_background_color" AS ENUM('white', 'grey', 'teal', 'navy'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_features_variant" AS ENUM('grid-3', 'grid-4', 'list'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_features_icon_style" AS ENUM('glow', 'solid', 'outlined'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_features_alignment" AS ENUM('center', 'left'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_services_services_icon_color" AS ENUM('teal', 'blue', 'green', 'purple', 'amber', 'coral'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_services_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_testimonials_variant" AS ENUM('grid', 'carousel', 'featured'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_cases_source" AS ENUM('featured', 'manual', 'latest'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_cases_layout" AS ENUM('grid-2', 'grid-3', 'grid-4'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_logo_bar_variant" AS ENUM('light', 'white', 'dark'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_stats_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_stats_background_color" AS ENUM('white', 'grey', 'tealGradient', 'navyGradient'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_faq_variant" AS ENUM('single-column', 'two-column'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_team_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_team_photo_style" AS ENUM('square', 'circle'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_team_background_color" AS ENUM('white', 'bg', 'grey'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_blog_preview_columns" AS ENUM('2', '3'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_comparison_rows_values_type" AS ENUM('check', 'x', 'text'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_infobox_variant" AS ENUM('info', 'success', 'warning', 'error'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_infobox_max_width" AS ENUM('narrow', 'wide', 'full'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_infobox_margin_top" AS ENUM('none', 'sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_infobox_margin_bottom" AS ENUM('none', 'sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_image_gallery_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_image_gallery_aspect_ratio" AS ENUM('16-9', '4-3', '1-1', 'auto'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_video_source" AS ENUM('youtube', 'vimeo', 'upload'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_video_aspect_ratio" AS ENUM('16-9', '4-3', '1-1', '21-9'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_code_language" AS ENUM('typescript', 'javascript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css', 'sql', 'bash', 'json', 'yaml', 'markdown', 'plaintext'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_map_height" AS ENUM('small', 'medium', 'large'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_construction_hero_avatars_color" AS ENUM('teal', 'blue', 'purple', 'amber'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_construction_hero_floating_badges_color" AS ENUM('green', 'amber', 'blue', 'teal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_construction_hero_floating_badges_position" AS ENUM('bottom-left', 'top-right'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_services_grid_services_source" AS ENUM('auto', 'manual'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_services_grid_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_projects_grid_projects_source" AS ENUM('auto', 'featured', 'manual', 'category'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_projects_grid_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_reviews_grid_reviews_source" AS ENUM('featured', 'auto', 'manual'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_reviews_grid_columns" AS ENUM('2', '3'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_reviews_grid_layout" AS ENUM('cards', 'quotes', 'compact'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_reviews_grid_average_rating_position" AS ENUM('top', 'left'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_stats_bar_stats_icon" AS ENUM('none', 'construction', 'star', 'users', 'trophy', 'chart', 'check', 'target', 'briefcase'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_stats_bar_style" AS ENUM('default', 'accent', 'dark', 'transparent'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_stats_bar_layout" AS ENUM('horizontal', 'grid'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_buttons_variant" AS ENUM('primary', 'secondary', 'white'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_trust_elements_items_icon" AS ENUM('check', 'star', 'trophy', 'lock', 'lightning'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_style" AS ENUM('gradient', 'solid', 'outlined', 'image'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_alignment" AS ENUM('left', 'center'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_size" AS ENUM('small', 'medium', 'large'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_partners_category" AS ENUM('klant', 'partner', 'leverancier', 'certificering', 'media'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_partners_status" AS ENUM('published', 'draft'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_services_icon_type" AS ENUM('lucide', 'upload'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_services_category" AS ENUM('algemeen', 'technisch', 'marketing', 'support', 'consulting', 'training', 'usps'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_services_status" AS ENUM('published', 'draft'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_notifications_type" AS ENUM('order_shipped', 'order_delivered', 'order_cancelled', 'invoice_available', 'invoice_overdue', 'payment_reminder', 'stock_alert', 'price_change', 'recurring_order_reminder', 'recurring_order_processed', 'return_approved', 'return_rejected', 'return_received', 'refund_processed', 'system', 'account_update'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_notifications_category" AS ENUM('all', 'orders', 'stock', 'system'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_notifications_icon" AS ENUM('bell', 'truck', 'check-circle', 'package', 'file-text', 'repeat', 'rotate-ccw', 'banknote', 'alert-circle', 'settings', 'user'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_notifications_icon_color" AS ENUM('green', 'teal', 'blue', 'amber', 'coral', 'grey'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_notifications_priority" AS ENUM('low', 'normal', 'high', 'urgent'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_themes_status" AS ENUM('active', 'development', 'archived'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_products_videos_platform" AS ENUM('youtube', 'vimeo', 'custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_products_variant_options_values_subscription_type" AS ENUM('personal', 'gift', 'trial'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_products_variant_options_display_type" AS ENUM('colorSwatch', 'sizeRadio', 'dropdown', 'imageRadio', 'checkbox', 'textInput'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_products_product_type" AS ENUM('simple', 'grouped', 'variable', 'mixAndMatch'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published', 'sold-out', 'archived'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_products_condition" AS ENUM('new', 'refurbished', 'used'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_products_badge" AS ENUM('none', 'new', 'sale', 'popular', 'sold-out'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_products_tax_class" AS ENUM('standard', 'reduced', 'zero'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_products_stock_status" AS ENUM('in-stock', 'out-of-stock', 'on-backorder', 'discontinued'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_products_weight_unit" AS ENUM('kg', 'g'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_recently_viewed_source" AS ENUM('direct', 'search', 'category', 'related', 'recently_viewed', 'recommendations', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_recently_viewed_device" AS ENUM('desktop', 'mobile', 'tablet'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_customer_groups_type" AS ENUM('b2c', 'b2b'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_orders_timeline_event" AS ENUM('order_placed', 'payment_received', 'processing', 'invoice_generated', 'shipped', 'in_transit', 'delivered', 'cancelled', 'return_requested', 'refunded', 'note_added'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_orders_status" AS ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_orders_payment_method" AS ENUM('ideal', 'invoice', 'creditcard', 'banktransfer'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_orders_payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_orders_shipping_provider" AS ENUM('postnl', 'dhl', 'dpd', 'ups', 'transmission', 'own', 'pickup'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_orders_shipping_method" AS ENUM('standard', 'express', 'same_day', 'pickup'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_order_lists_icon" AS ENUM('clipboard-list', 'repeat', 'stethoscope', 'flask-conical', 'plus-circle', 'building-2', 'package'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_order_lists_color" AS ENUM('teal', 'blue', 'amber', 'green'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_recurring_orders_status" AS ENUM('active', 'paused', 'cancelled', 'expired'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_recurring_orders_frequency_unit" AS ENUM('days', 'weeks', 'months'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_recurring_orders_payment_method" AS ENUM('ideal', 'invoice', 'creditcard', 'direct_debit'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_invoices_status" AS ENUM('open', 'paid', 'overdue', 'cancelled', 'credit_note'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_invoices_payment_method" AS ENUM('ideal', 'invoice', 'creditcard', 'banktransfer', 'direct_debit'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_returns_status" AS ENUM('pending', 'approved', 'rejected', 'label_sent', 'received', 'inspecting', 'refunded', 'replaced', 'completed', 'cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_returns_return_reason" AS ENUM('wrong_product', 'wrong_size', 'damaged', 'not_expected', 'duplicate', 'other'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_returns_product_condition" AS ENUM('unopened', 'opened', 'damaged'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_returns_preferred_resolution" AS ENUM('replacement', 'refund', 'store_credit', 'exchange'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_returns_refund_method" AS ENUM('original', 'bank_transfer', 'store_credit'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_subscription_plans_billing_interval" AS ENUM('monthly', 'yearly', 'lifetime'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_subscription_plans_tier" AS ENUM('free', 'pro', 'enterprise'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_user_subscriptions_status" AS ENUM('active', 'trialing', 'past_due', 'canceled', 'unpaid'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_payment_methods_type" AS ENUM('sepa', 'card', 'paypal', 'ideal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_payment_methods_card_brand" AS ENUM('visa', 'mastercard', 'amex'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_gift_vouchers_status" AS ENUM('active', 'spent', 'expired', 'canceled'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_gift_vouchers_occasion" AS ENUM('birthday', 'christmas', 'graduation', 'business', 'love', 'thanks', 'newhome', 'universal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_gift_vouchers_delivery_method" AS ENUM('email', 'print', 'post'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_licenses_type" AS ENUM('personal', 'professional', 'enterprise', 'lifetime', 'yearly', 'ebook', 'templates'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_licenses_status" AS ENUM('active', 'expired', 'revoked', 'pending_renewal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_license_activations_status" AS ENUM('active', 'deactivated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_loyalty_rewards_type" AS ENUM('discount', 'shipping', 'gift', 'upgrade', 'event', 'merchandise'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_loyalty_transactions_type" AS ENUM('earned_purchase', 'earned_review', 'earned_referral', 'earned_birthday', 'earned_bonus', 'spent_reward', 'expired', 'adjustment'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_loyalty_redemptions_status" AS ENUM('available', 'used', 'expired', 'canceled'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_ab_tests_target_page" AS ENUM('cart', 'checkout', 'login', 'registration', 'product', 'homepage'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_ab_tests_status" AS ENUM('draft', 'running', 'paused', 'completed'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_blog_posts_featured_tag" AS ENUM('none', 'guide', 'new', 'featured', 'tip', 'news'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_blog_posts_template" AS ENUM('blogtemplate1', 'blogtemplate2', 'blogtemplate3'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_blog_posts_content_type" AS ENUM('article', 'guide', 'elearning', 'download', 'video'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_blog_posts_content_access_access_level" AS ENUM('free', 'premium'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_blog_posts_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_version_featured_tag" AS ENUM('none', 'guide', 'new', 'featured', 'tip', 'news'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_version_template" AS ENUM('blogtemplate1', 'blogtemplate2', 'blogtemplate3'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_version_content_type" AS ENUM('article', 'guide', 'elearning', 'download', 'video'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_version_content_access_access_level" AS ENUM('free', 'premium'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_version_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_blog_categories_icon" AS ENUM('BookOpen', 'Lightbulb', 'Sparkles', 'Stethoscope', 'ShieldCheck', 'Newspaper', 'GraduationCap', 'Microscope', 'Settings', 'TrendingUp', 'Target', 'Wrench'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_blog_categories_color" AS ENUM('teal', 'blue', 'green', 'coral', 'purple', 'amber', 'pink'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_faqs_category" AS ENUM('algemeen', 'producten', 'verzending', 'retourneren', 'betaling', 'account', 'support', 'overig'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_faqs_status" AS ENUM('published', 'draft'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_cases_status" AS ENUM('published', 'draft'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_testimonials_status" AS ENUM('published', 'draft'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_vendors_certifications_icon" AS ENUM('shield-check', 'award', 'leaf', 'star', 'check-circle'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_workshops_target_audience" AS ENUM('nurses', 'doctors', 'care-workers', 'pharmacists', 'management'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_workshops_location_type" AS ENUM('physical', 'online', 'hybrid'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_workshops_category" AS ENUM('wondverzorging', 'handygiene', 'diagnostiek', 'sterilisatie', 'product-training', 'algemeen'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_workshops_level" AS ENUM('beginner', 'intermediate', 'advanced', 'expert'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_workshops_status" AS ENUM('upcoming', 'open', 'almost-full', 'full', 'completed', 'cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_construction_services_color" AS ENUM('teal', 'blue', 'green', 'purple', 'amber', 'coral'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_construction_services_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_construction_projects_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_construction_reviews_client_color" AS ENUM('teal', 'blue', 'green', 'purple', 'amber', 'coral'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_construction_reviews_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_quote_requests_project_type" AS ENUM('nieuwbouw', 'renovatie', 'verduurzaming', 'aanbouw', 'utiliteitsbouw', 'herstelwerk'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_quote_requests_budget" AS ENUM('< 50k', '50k-100k', '100k-250k', '250k-500k', '> 500k', 'unknown'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_quote_requests_timeline" AS ENUM('asap', '3months', '6months', 'thisyear', 'nextyear', 'unknown'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_quote_requests_status" AS ENUM('new', 'contacted', 'quoted', 'won', 'lost'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_treatments_category" AS ENUM('fysiotherapie', 'manuele-therapie', 'sportfysiotherapie', 'kinderfysiotherapie', 'psychosomatisch', 'revalidatie', 'dry-needling', 'shockwave'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_treatments_insurance" AS ENUM('covered', 'partial', 'not-covered'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_treatments_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__treatments_v_version_category" AS ENUM('fysiotherapie', 'manuele-therapie', 'sportfysiotherapie', 'kinderfysiotherapie', 'psychosomatisch', 'revalidatie', 'dry-needling', 'shockwave'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__treatments_v_version_insurance" AS ENUM('covered', 'partial', 'not-covered'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__treatments_v_version_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_practitioners_work_days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_practitioners_role" AS ENUM('owner', 'physio', 'manual', 'specialist'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_practitioners_availability" AS ENUM('available', 'limited', 'unavailable'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_practitioners_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__practitioners_v_version_work_days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__practitioners_v_version_role" AS ENUM('owner', 'physio', 'manual', 'specialist'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__practitioners_v_version_availability" AS ENUM('available', 'limited', 'unavailable'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__practitioners_v_version_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_appointments_preferred_time" AS ENUM('morning', 'afternoon', 'evening', 'saturday'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_appointments_insurance" AS ENUM('zilveren-kruis', 'cz', 'vgz', 'menzis', 'onvz', 'dsw', 'asr', 'other'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_appointments_treatment" AS ENUM('unknown', 'manuele-therapie', 'sportfysiotherapie', 'kinderfysiotherapie', 'psychosomatisch', 'dry-needling', 'revalidatie'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_appointments_has_referral" AS ENUM('no', 'gp', 'specialist'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_appointments_type" AS ENUM('new', 'follow-up', 'question'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_appointments_status" AS ENUM('new', 'confirmed', 'completed', 'cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_beauty_services_tags" AS ENUM('popular', 'new', 'promo', 'specialist', 'bestseller'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_beauty_services_category" AS ENUM('hair', 'beauty', 'wellness', 'nails', 'bridal', 'color'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_beauty_services_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__beauty_services_v_version_tags" AS ENUM('popular', 'new', 'promo', 'specialist', 'bestseller'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__beauty_services_v_version_category" AS ENUM('hair', 'beauty', 'wellness', 'nails', 'bridal', 'color'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__beauty_services_v_version_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_stylists_work_days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_stylists_role" AS ENUM('stylist', 'color-specialist', 'beauty-specialist', 'nail-artist', 'massage-therapist', 'bridal-specialist', 'owner'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_stylists_availability" AS ENUM('available', 'limited', 'booked', 'unavailable'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_stylists_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__stylists_v_version_work_days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__stylists_v_version_role" AS ENUM('stylist', 'color-specialist', 'beauty-specialist', 'nail-artist', 'massage-therapist', 'bridal-specialist', 'owner'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__stylists_v_version_availability" AS ENUM('available', 'limited', 'booked', 'unavailable'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__stylists_v_version_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_beauty_bookings_preferred_time_slots" AS ENUM('morning', 'afternoon', 'evening'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_beauty_bookings_status" AS ENUM('new', 'confirmed', 'completed', 'cancelled', 'no-show'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_menu_items_allergens_allergen" AS ENUM('gluten', 'crustaceans', 'eggs', 'fish', 'peanuts', 'soy', 'milk', 'nuts', 'celery', 'mustard', 'sesame', 'lupin', 'molluscs'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_menu_items_category" AS ENUM('starters', 'mains', 'desserts', 'drinks', 'wines', 'lunch', 'specials'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_menu_items_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__menu_items_v_version_allergens_allergen" AS ENUM('gluten', 'crustaceans', 'eggs', 'fish', 'peanuts', 'soy', 'milk', 'nuts', 'celery', 'mustard', 'sesame', 'lupin', 'molluscs'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__menu_items_v_version_category" AS ENUM('starters', 'mains', 'desserts', 'drinks', 'wines', 'lunch', 'specials'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__menu_items_v_version_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_reservations_preferences" AS ENUM('window', 'terrace', 'inside', 'quiet', 'bar'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_reservations_occasion" AS ENUM('regular', 'birthday', 'anniversary', 'business', 'romantic', 'group', 'other'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_reservations_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no-show'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_events_event_type" AS ENUM('live-music', 'wine-tasting', 'chefs-table', 'private-dinner', 'holiday-special', 'workshop', 'themed-night', 'beer-spirits'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__events_v_version_event_type" AS ENUM('live-music', 'wine-tasting', 'chefs-table', 'private-dinner', 'holiday-special', 'workshop', 'themed-night', 'beer-spirits'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_client_requests_website_pages" AS ENUM('home', 'about', 'services', 'portfolio', 'blog', 'faq', 'contact'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_client_requests_payment_methods" AS ENUM('ideal', 'creditcard', 'invoice', 'banktransfer', 'paypal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_client_requests_status" AS ENUM('pending', 'reviewing', 'approved', 'rejected'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_client_requests_site_type" AS ENUM('website', 'webshop'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_client_requests_expected_products" AS ENUM('small', 'medium', 'large'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_clients_status" AS ENUM('pending', 'provisioning', 'deploying', 'active', 'failed', 'suspended', 'archived'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_clients_plan" AS ENUM('free', 'starter', 'professional', 'enterprise'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_clients_template" AS ENUM('ecommerce', 'blog', 'b2b', 'portfolio', 'corporate'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_clients_deployment_provider" AS ENUM('ploi', 'custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_clients_billing_status" AS ENUM('active', 'past_due', 'cancelled', 'trial'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_clients_stripe_account_status" AS ENUM('not_started', 'pending', 'enabled', 'rejected', 'restricted'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_clients_payment_pricing_tier" AS ENUM('standard', 'professional', 'enterprise', 'custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_clients_multi_safepay_account_status" AS ENUM('not_started', 'pending', 'active', 'suspended', 'rejected'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_clients_multi_safepay_pricing_tier" AS ENUM('standard', 'professional', 'enterprise', 'custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_clients_health_status" AS ENUM('healthy', 'warning', 'critical', 'unknown'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_deployments_status" AS ENUM('pending', 'in_progress', 'success', 'failed', 'rolled_back', 'cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_deployments_environment" AS ENUM('production', 'staging', 'development'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_deployments_type" AS ENUM('initial', 'update', 'hotfix', 'rollback', 'migration'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_settings_hours_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_settings_default_product_template" AS ENUM('template1', 'template2', 'template3'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_settings_default_blog_template" AS ENUM('blogtemplate1', 'blogtemplate2', 'blogtemplate3'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_settings_default_shop_archive_template" AS ENUM('shoparchivetemplate1'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_settings_default_cart_template" AS ENUM('template1', 'template2'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_settings_default_checkout_template" AS ENUM('checkouttemplate1'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_settings_default_my_account_template" AS ENUM('myaccounttemplate1'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_header_top_bar_left_messages_icon" AS ENUM('', 'BadgeCheck', 'Truck', 'Shield', 'Award', 'Phone', 'Mail', 'Clock', 'MapPin', 'CheckCircle', 'CreditCard', 'Lock', 'Zap', 'Gift', 'RefreshCw', 'Users'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_header_custom_buttons_icon" AS ENUM('', 'Phone', 'Mail', 'MapPin', 'ShoppingCart', 'User', 'Clipboard', 'CreditCard', 'Search'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_header_custom_buttons_style" AS ENUM('default', 'primary', 'secondary'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_header_navigation_special_items_icon" AS ENUM('', 'Flame', 'Star', 'Gift', 'Sparkles', 'Package', 'Tag', 'Truck', 'Zap'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_header_navigation_special_items_position" AS ENUM('start', 'end'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_header_navigation_items_icon" AS ENUM('', 'Package', 'Building2', 'Users', 'Award', 'FileText', 'ShoppingCart', 'Mail', 'Phone', 'Home'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_header_navigation_items_type" AS ENUM('page', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_header_alert_bar_type" AS ENUM('info', 'success', 'warning', 'error', 'promo'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_header_alert_bar_icon" AS ENUM('', 'BadgeCheck', 'Truck', 'Award', 'Gift', 'Zap', 'AlertCircle', 'Info', 'CheckCircle', 'Bell', 'Megaphone'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_header_navigation_mode" AS ENUM('manual', 'categories', 'hybrid'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_header_navigation_category_settings_mega_menu_style" AS ENUM('subcategories', 'with-products', 'full'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_footer_columns_links_type" AS ENUM('page', 'external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_meilisearch_settings_indexed_collections_collection" AS ENUM('products', 'blog-posts', 'pages', 'cases', 'faqs', 'testimonials', 'services'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_meilisearch_settings_searchable_fields_products_field" AS ENUM('title', 'sku', 'ean', 'brand', 'description', 'shortDescription', 'categories', 'tags'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_meilisearch_settings_searchable_fields_blog_posts_field" AS ENUM('title', 'excerpt', 'content', 'categories', 'tags', 'author'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_meilisearch_settings_searchable_fields_pages_field" AS ENUM('title', 'metaDescription', 'content'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_meilisearch_settings_filterable_fields_products_field" AS ENUM('brand', 'categories', 'price', 'stock', 'status', 'featured', 'condition', 'tags'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_meilisearch_settings_filterable_fields_blog_posts_field" AS ENUM('categories', 'status', 'featured', 'publishedAt', 'author'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_meilisearch_settings_sortable_fields_products_field" AS ENUM('price', 'createdAt', 'title', 'stock', 'salesCount'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_meilisearch_settings_sortable_fields_blog_posts_field" AS ENUM('publishedAt', 'title', 'viewCount'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_meilisearch_settings_ranking_rules_rule" AS ENUM('words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_meilisearch_settings_custom_ranking_attributes_order" AS ENUM('asc', 'desc'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_meilisearch_settings_exclude_patterns_type" AS ENUM('url', 'content', 'field'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_meilisearch_settings_exclude_statuses_status" AS ENUM('draft', 'archived', 'pending', 'sold-out'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_chatbot_settings_model" AS ENUM('groq', 'gpt-4', 'gpt-3.5', 'ollama', 'hybrid'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_chatbot_settings_position" AS ENUM('bottom-right', 'bottom-left', 'top-right', 'top-left'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_chatbot_settings_button_icon" AS ENUM('chat', 'robot', 'lightbulb', 'question'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  CREATE TABLE IF NOT EXISTS "users_addresses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_users_addresses_type" DEFAULT 'both' NOT NULL,
  	"street" varchar NOT NULL,
  	"house_number" varchar NOT NULL,
  	"house_number_addition" varchar,
  	"postal_code" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"country" varchar DEFAULT 'Nederland',
  	"is_default" boolean DEFAULT false
  );
  
  CREATE TABLE IF NOT EXISTS "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users_favorites" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"added_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"phone" varchar,
  	"client_type" "enum_users_client_type",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_banner_variant" DEFAULT 'announcement',
  	"message" varchar,
  	"cta_text" varchar,
  	"cta_link" varchar,
  	"dismissible" boolean DEFAULT true,
  	"dismissal_key" varchar,
  	"sticky" boolean DEFAULT false,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_spacer_size" DEFAULT 'md',
  	"show_divider" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"style" "enum_pages_blocks_hero_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"title" varchar,
  	"description" jsonb,
  	"variant" "enum_pages_blocks_hero_variant" DEFAULT 'default',
  	"background_style" "enum_pages_blocks_hero_background_style" DEFAULT 'gradient',
  	"background_image_id" integer,
  	"background_color" "enum_pages_blocks_hero_background_color" DEFAULT 'navy',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"max_width" "enum_pages_blocks_content_max_width" DEFAULT 'narrow',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_media_block_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_pages_blocks_media_block_buttons_variant" DEFAULT 'primary',
  	"url" varchar,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_type" "enum_pages_blocks_media_block_media_type" DEFAULT 'image',
  	"media_position" "enum_pages_blocks_media_block_media_position" DEFAULT 'left',
  	"media_id" integer,
  	"video_url" varchar,
  	"split" "enum_pages_blocks_media_block_split" DEFAULT '50-50',
  	"subtitle" varchar,
  	"title" varchar,
  	"content" jsonb,
  	"background_color" "enum_pages_blocks_media_block_background_color" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_two_column" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"split" "enum_pages_blocks_two_column_split" DEFAULT '50-50',
  	"column_one" jsonb,
  	"column_two" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_product_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_label" varchar,
  	"heading" varchar DEFAULT 'Onze producten',
  	"intro" varchar,
  	"source" "enum_pages_blocks_product_grid_source" DEFAULT 'manual',
  	"category_id" integer,
  	"brand_id" integer,
  	"display_mode" "enum_pages_blocks_product_grid_display_mode" DEFAULT 'grid',
  	"layout" "enum_pages_blocks_product_grid_layout" DEFAULT 'grid-4',
  	"limit" numeric DEFAULT 8,
  	"show_add_to_cart" boolean DEFAULT true,
  	"show_stock_status" boolean DEFAULT true,
  	"show_brand" boolean DEFAULT true,
  	"show_compare_price" boolean DEFAULT true,
  	"show_view_all_button" boolean DEFAULT true,
  	"view_all_button_text" varchar DEFAULT 'Bekijk alle producten',
  	"view_all_button_link" varchar DEFAULT '/producten',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_category_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_label" varchar,
  	"heading" varchar DEFAULT 'Onze categorieën',
  	"intro" varchar,
  	"source" "enum_pages_blocks_category_grid_source" DEFAULT 'auto',
  	"show_icon" boolean DEFAULT true,
  	"show_product_count" boolean DEFAULT true,
  	"layout" "enum_pages_blocks_category_grid_layout" DEFAULT 'grid-3',
  	"limit" numeric DEFAULT 10,
  	"show_quick_order_card" boolean DEFAULT false,
  	"quick_order_link" varchar DEFAULT '/quick-order',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_quick_order" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Snel Bestellen',
  	"intro" varchar,
  	"show_order_lists" boolean DEFAULT true,
  	"input_mode" "enum_pages_blocks_quick_order_input_mode" DEFAULT 'textarea',
  	"placeholder_text" varchar DEFAULT 'Voer artikelnummers en aantallen in:
  
  BV-001 5
  LT-334 2
  HT-892 10',
  	"help_text" jsonb,
  	"submit_button_text" varchar DEFAULT 'Toevoegen aan winkelwagen',
  	"show_upload" boolean DEFAULT false,
  	"upload_help_text" varchar DEFAULT 'Upload een CSV bestand met artikelnummer,aantal per regel',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"style" "enum_pages_blocks_cta_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"variant" "enum_pages_blocks_cta_variant" DEFAULT 'centered',
  	"style" "enum_pages_blocks_cta_style" DEFAULT 'dark',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_calltoaction" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"button_label" varchar,
  	"button_link" varchar,
  	"background_color" "enum_pages_blocks_calltoaction_background_color" DEFAULT 'grey',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_contact_opening_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" varchar,
  	"hours" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Neem contact op',
  	"subtitle" varchar,
  	"address_street" varchar,
  	"address_postal_code" varchar,
  	"address_city" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"show_map" boolean DEFAULT true,
  	"map_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Neem contact op',
  	"description" varchar,
  	"show_phone" boolean DEFAULT true,
  	"show_subject" boolean DEFAULT true,
  	"submit_to" varchar,
  	"contact_info_phone" varchar,
  	"contact_info_email" varchar,
  	"contact_info_address" varchar,
  	"contact_info_hours" varchar,
  	"success_message" varchar DEFAULT 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.',
  	"error_message" varchar DEFAULT 'Er ging iets mis. Probeer het opnieuw of neem direct contact op.',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Blijf op de hoogte',
  	"button_label" varchar DEFAULT 'Inschrijven',
  	"description" varchar,
  	"placeholder" varchar DEFAULT 'Je email adres...',
  	"background_color" "enum_pages_blocks_newsletter_background_color" DEFAULT 'teal',
  	"privacy_text" varchar DEFAULT 'We respecteren je privacy. Geen spam.',
  	"success_message" varchar DEFAULT 'Bedankt voor je inschrijving! Check je inbox.',
  	"error_message" varchar DEFAULT 'Er ging iets mis. Probeer het opnieuw.',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_features_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"variant" "enum_pages_blocks_features_variant" DEFAULT 'grid-3',
  	"icon_style" "enum_pages_blocks_features_icon_style" DEFAULT 'glow',
  	"alignment" "enum_pages_blocks_features_alignment" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_services_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"icon_color" "enum_pages_blocks_services_services_icon_color" DEFAULT 'teal',
  	"title" varchar,
  	"description" varchar,
  	"link" varchar,
  	"link_text" varchar DEFAULT 'Meer info'
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"title" varchar,
  	"description" varchar,
  	"columns" "enum_pages_blocks_services_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_testimonials_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"avatar_id" integer,
  	"rating" numeric DEFAULT 5
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"variant" "enum_pages_blocks_testimonials_variant" DEFAULT 'grid',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Onze projecten',
  	"intro" varchar,
  	"source" "enum_pages_blocks_cases_source" DEFAULT 'featured',
  	"limit" numeric DEFAULT 6,
  	"layout" "enum_pages_blocks_cases_layout" DEFAULT 'grid-3',
  	"show_excerpt" boolean DEFAULT true,
  	"show_client" boolean DEFAULT true,
  	"show_services" boolean DEFAULT true,
  	"show_view_all_button" boolean DEFAULT true,
  	"view_all_button_text" varchar DEFAULT 'Bekijk alle projecten',
  	"view_all_button_link" varchar DEFAULT '/portfolio',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_logo_bar_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"link" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_logo_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"auto_scroll" boolean DEFAULT false,
  	"variant" "enum_pages_blocks_logo_bar_variant" DEFAULT 'light',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"value" varchar,
  	"label" varchar,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_pages_blocks_stats_columns" DEFAULT '3',
  	"description" varchar,
  	"background_color" "enum_pages_blocks_stats_background_color" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_faq_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"variant" "enum_pages_blocks_faq_variant" DEFAULT 'single-column',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"email" varchar,
  	"linkedin" varchar,
  	"twitter" varchar,
  	"github" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"title" varchar,
  	"description" varchar,
  	"columns" "enum_pages_blocks_team_columns" DEFAULT '3',
  	"photo_style" "enum_pages_blocks_team_photo_style" DEFAULT 'square',
  	"background_color" "enum_pages_blocks_team_background_color" DEFAULT 'bg',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"allow_multiple" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_blog_preview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_pages_blocks_blog_preview_columns" DEFAULT '3',
  	"description" varchar,
  	"show_excerpt" boolean DEFAULT true,
  	"show_read_time" boolean DEFAULT false,
  	"show_category" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_comparison_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"price" varchar,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_comparison_rows_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_comparison_rows_values_type" DEFAULT 'text',
  	"text" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_infobox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_infobox_variant" DEFAULT 'info',
  	"icon" varchar,
  	"title" varchar,
  	"description" jsonb,
  	"dismissible" boolean DEFAULT false,
  	"persistent" boolean DEFAULT false,
  	"storage_key" varchar,
  	"max_width" "enum_pages_blocks_infobox_max_width" DEFAULT 'wide',
  	"margin_top" "enum_pages_blocks_infobox_margin_top" DEFAULT 'md',
  	"margin_bottom" "enum_pages_blocks_infobox_margin_bottom" DEFAULT 'md',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_image_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_pages_blocks_image_gallery_columns" DEFAULT '3',
  	"aspect_ratio" "enum_pages_blocks_image_gallery_aspect_ratio" DEFAULT '4-3',
  	"enable_lightbox" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"source" "enum_pages_blocks_video_source" DEFAULT 'youtube',
  	"aspect_ratio" "enum_pages_blocks_video_aspect_ratio" DEFAULT '16-9',
  	"youtube_url" varchar,
  	"vimeo_url" varchar,
  	"video_file_id" integer,
  	"poster_image_id" integer,
  	"caption" varchar,
  	"autoplay" boolean DEFAULT false,
  	"controls" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_pages_blocks_code_language" DEFAULT 'typescript',
  	"show_line_numbers" boolean DEFAULT true,
  	"filename" varchar,
  	"code" varchar,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Locatie',
  	"address" varchar,
  	"zoom" numeric DEFAULT 15,
  	"height" "enum_pages_blocks_map_height" DEFAULT 'medium',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_construction_hero_avatars" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"initials" varchar,
  	"color" "enum_pages_blocks_construction_hero_avatars_color" DEFAULT 'teal'
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_construction_hero_floating_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"icon" varchar,
  	"color" "enum_pages_blocks_construction_hero_floating_badges_color" DEFAULT 'green',
  	"position" "enum_pages_blocks_construction_hero_floating_badges_position" DEFAULT 'bottom-left'
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_construction_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"badge_icon" varchar DEFAULT 'award',
  	"title" varchar,
  	"description" varchar,
  	"primary_c_t_a_text" varchar DEFAULT 'Gratis offerte aanvragen',
  	"primary_c_t_a_icon" varchar DEFAULT 'file-text',
  	"primary_c_t_a_link" varchar DEFAULT '/offerte-aanvragen',
  	"secondary_c_t_a_text" varchar DEFAULT 'Bekijk projecten',
  	"secondary_c_t_a_icon" varchar DEFAULT 'play-circle',
  	"secondary_c_t_a_link" varchar DEFAULT '/projecten',
  	"trust_text" varchar DEFAULT '500+ tevreden opdrachtgevers',
  	"trust_subtext" varchar DEFAULT 'Gemiddeld 4.9/5 beoordeeld',
  	"hero_image_id" integer,
  	"hero_emoji" varchar DEFAULT '🏗️',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_services_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_badge" varchar DEFAULT 'Onze diensten',
  	"heading_badge_icon" varchar DEFAULT 'wrench',
  	"heading_title" varchar DEFAULT 'Alles onder één dak',
  	"heading_description" varchar DEFAULT 'Van eerste schets tot sleuteloverdracht. Wij begeleiden u bij elke stap van uw bouwproject.',
  	"services_source" "enum_pages_blocks_services_grid_services_source" DEFAULT 'auto',
  	"limit" numeric DEFAULT 6,
  	"columns" "enum_pages_blocks_services_grid_columns" DEFAULT '3',
  	"link_text" varchar DEFAULT 'Meer info',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_projects_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_badge" varchar,
  	"heading_title" varchar DEFAULT 'Onze projecten',
  	"heading_description" varchar,
  	"projects_source" "enum_pages_blocks_projects_grid_projects_source" DEFAULT 'auto',
  	"category_id" integer,
  	"limit" numeric DEFAULT 6,
  	"columns" "enum_pages_blocks_projects_grid_columns" DEFAULT '3',
  	"show_filter" boolean DEFAULT false,
  	"cta_button_enabled" boolean DEFAULT false,
  	"cta_button_text" varchar DEFAULT 'Bekijk alle projecten',
  	"cta_button_link" varchar DEFAULT '/projecten',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_reviews_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_badge" varchar,
  	"heading_title" varchar DEFAULT 'Wat onze klanten zeggen',
  	"heading_description" varchar,
  	"reviews_source" "enum_pages_blocks_reviews_grid_reviews_source" DEFAULT 'featured',
  	"limit" numeric DEFAULT 6,
  	"columns" "enum_pages_blocks_reviews_grid_columns" DEFAULT '3',
  	"layout" "enum_pages_blocks_reviews_grid_layout" DEFAULT 'cards',
  	"show_ratings" boolean DEFAULT true,
  	"show_avatars" boolean DEFAULT true,
  	"average_rating_enabled" boolean DEFAULT false,
  	"average_rating_position" "enum_pages_blocks_reviews_grid_average_rating_position" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_stats_bar_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"icon" "enum_pages_blocks_stats_bar_stats_icon" DEFAULT 'none'
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_stats_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_pages_blocks_stats_bar_style" DEFAULT 'default',
  	"layout" "enum_pages_blocks_stats_bar_layout" DEFAULT 'horizontal',
  	"animate" boolean DEFAULT true,
  	"dividers" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_cta_banner_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"link" varchar,
  	"variant" "enum_pages_blocks_cta_banner_buttons_variant" DEFAULT 'primary'
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_cta_banner_trust_elements_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_cta_banner_trust_elements_items_icon" DEFAULT 'check',
  	"text" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_pages_blocks_cta_banner_style" DEFAULT 'gradient',
  	"background_image_id" integer,
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"trust_elements_enabled" boolean DEFAULT false,
  	"alignment" "enum_pages_blocks_cta_banner_alignment" DEFAULT 'center',
  	"size" "enum_pages_blocks_cta_banner_size" DEFAULT 'medium',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"status" "enum_pages_status" DEFAULT 'published',
  	"published_on" timestamp(3) with time zone,
  	"color_scheme_primary" varchar,
  	"color_scheme_secondary" varchar,
  	"color_scheme_accent" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_focus_keyword" varchar,
  	"meta_image_id" integer,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"meta_no_follow" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"product_categories_id" integer,
  	"cases_id" integer,
  	"blog_posts_id" integer,
  	"construction_services_id" integer,
  	"construction_projects_id" integer,
  	"construction_reviews_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_banner_variant" DEFAULT 'announcement',
  	"message" varchar,
  	"cta_text" varchar,
  	"cta_link" varchar,
  	"dismissible" boolean DEFAULT true,
  	"dismissal_key" varchar,
  	"sticky" boolean DEFAULT false,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_spacer_size" DEFAULT 'md',
  	"show_divider" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"style" "enum__pages_v_blocks_hero_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"title" varchar,
  	"description" jsonb,
  	"variant" "enum__pages_v_blocks_hero_variant" DEFAULT 'default',
  	"background_style" "enum__pages_v_blocks_hero_background_style" DEFAULT 'gradient',
  	"background_image_id" integer,
  	"background_color" "enum__pages_v_blocks_hero_background_color" DEFAULT 'navy',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"max_width" "enum__pages_v_blocks_content_max_width" DEFAULT 'narrow',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_media_block_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__pages_v_blocks_media_block_buttons_variant" DEFAULT 'primary',
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_type" "enum__pages_v_blocks_media_block_media_type" DEFAULT 'image',
  	"media_position" "enum__pages_v_blocks_media_block_media_position" DEFAULT 'left',
  	"media_id" integer,
  	"video_url" varchar,
  	"split" "enum__pages_v_blocks_media_block_split" DEFAULT '50-50',
  	"subtitle" varchar,
  	"title" varchar,
  	"content" jsonb,
  	"background_color" "enum__pages_v_blocks_media_block_background_color" DEFAULT 'white',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_two_column" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"split" "enum__pages_v_blocks_two_column_split" DEFAULT '50-50',
  	"column_one" jsonb,
  	"column_two" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_product_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_label" varchar,
  	"heading" varchar DEFAULT 'Onze producten',
  	"intro" varchar,
  	"source" "enum__pages_v_blocks_product_grid_source" DEFAULT 'manual',
  	"category_id" integer,
  	"brand_id" integer,
  	"display_mode" "enum__pages_v_blocks_product_grid_display_mode" DEFAULT 'grid',
  	"layout" "enum__pages_v_blocks_product_grid_layout" DEFAULT 'grid-4',
  	"limit" numeric DEFAULT 8,
  	"show_add_to_cart" boolean DEFAULT true,
  	"show_stock_status" boolean DEFAULT true,
  	"show_brand" boolean DEFAULT true,
  	"show_compare_price" boolean DEFAULT true,
  	"show_view_all_button" boolean DEFAULT true,
  	"view_all_button_text" varchar DEFAULT 'Bekijk alle producten',
  	"view_all_button_link" varchar DEFAULT '/producten',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_category_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_label" varchar,
  	"heading" varchar DEFAULT 'Onze categorieën',
  	"intro" varchar,
  	"source" "enum__pages_v_blocks_category_grid_source" DEFAULT 'auto',
  	"show_icon" boolean DEFAULT true,
  	"show_product_count" boolean DEFAULT true,
  	"layout" "enum__pages_v_blocks_category_grid_layout" DEFAULT 'grid-3',
  	"limit" numeric DEFAULT 10,
  	"show_quick_order_card" boolean DEFAULT false,
  	"quick_order_link" varchar DEFAULT '/quick-order',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_quick_order" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Snel Bestellen',
  	"intro" varchar,
  	"show_order_lists" boolean DEFAULT true,
  	"input_mode" "enum__pages_v_blocks_quick_order_input_mode" DEFAULT 'textarea',
  	"placeholder_text" varchar DEFAULT 'Voer artikelnummers en aantallen in:
  
  BV-001 5
  LT-334 2
  HT-892 10',
  	"help_text" jsonb,
  	"submit_button_text" varchar DEFAULT 'Toevoegen aan winkelwagen',
  	"show_upload" boolean DEFAULT false,
  	"upload_help_text" varchar DEFAULT 'Upload een CSV bestand met artikelnummer,aantal per regel',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"style" "enum__pages_v_blocks_cta_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"variant" "enum__pages_v_blocks_cta_variant" DEFAULT 'centered',
  	"style" "enum__pages_v_blocks_cta_style" DEFAULT 'dark',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_calltoaction" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"button_label" varchar,
  	"button_link" varchar,
  	"background_color" "enum__pages_v_blocks_calltoaction_background_color" DEFAULT 'grey',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_contact_opening_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" varchar,
  	"hours" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Neem contact op',
  	"subtitle" varchar,
  	"address_street" varchar,
  	"address_postal_code" varchar,
  	"address_city" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"show_map" boolean DEFAULT true,
  	"map_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Neem contact op',
  	"description" varchar,
  	"show_phone" boolean DEFAULT true,
  	"show_subject" boolean DEFAULT true,
  	"submit_to" varchar,
  	"contact_info_phone" varchar,
  	"contact_info_email" varchar,
  	"contact_info_address" varchar,
  	"contact_info_hours" varchar,
  	"success_message" varchar DEFAULT 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.',
  	"error_message" varchar DEFAULT 'Er ging iets mis. Probeer het opnieuw of neem direct contact op.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Blijf op de hoogte',
  	"button_label" varchar DEFAULT 'Inschrijven',
  	"description" varchar,
  	"placeholder" varchar DEFAULT 'Je email adres...',
  	"background_color" "enum__pages_v_blocks_newsletter_background_color" DEFAULT 'teal',
  	"privacy_text" varchar DEFAULT 'We respecteren je privacy. Geen spam.',
  	"success_message" varchar DEFAULT 'Bedankt voor je inschrijving! Check je inbox.',
  	"error_message" varchar DEFAULT 'Er ging iets mis. Probeer het opnieuw.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_features_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"variant" "enum__pages_v_blocks_features_variant" DEFAULT 'grid-3',
  	"icon_style" "enum__pages_v_blocks_features_icon_style" DEFAULT 'glow',
  	"alignment" "enum__pages_v_blocks_features_alignment" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_services_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"icon_color" "enum__pages_v_blocks_services_services_icon_color" DEFAULT 'teal',
  	"title" varchar,
  	"description" varchar,
  	"link" varchar,
  	"link_text" varchar DEFAULT 'Meer info',
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"title" varchar,
  	"description" varchar,
  	"columns" "enum__pages_v_blocks_services_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_testimonials_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"avatar_id" integer,
  	"rating" numeric DEFAULT 5,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"variant" "enum__pages_v_blocks_testimonials_variant" DEFAULT 'grid',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Onze projecten',
  	"intro" varchar,
  	"source" "enum__pages_v_blocks_cases_source" DEFAULT 'featured',
  	"limit" numeric DEFAULT 6,
  	"layout" "enum__pages_v_blocks_cases_layout" DEFAULT 'grid-3',
  	"show_excerpt" boolean DEFAULT true,
  	"show_client" boolean DEFAULT true,
  	"show_services" boolean DEFAULT true,
  	"show_view_all_button" boolean DEFAULT true,
  	"view_all_button_text" varchar DEFAULT 'Bekijk alle projecten',
  	"view_all_button_link" varchar DEFAULT '/portfolio',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_logo_bar_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_logo_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"auto_scroll" boolean DEFAULT false,
  	"variant" "enum__pages_v_blocks_logo_bar_variant" DEFAULT 'light',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"value" varchar,
  	"label" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum__pages_v_blocks_stats_columns" DEFAULT '3',
  	"description" varchar,
  	"background_color" "enum__pages_v_blocks_stats_background_color" DEFAULT 'white',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faq_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"variant" "enum__pages_v_blocks_faq_variant" DEFAULT 'single-column',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"email" varchar,
  	"linkedin" varchar,
  	"twitter" varchar,
  	"github" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"title" varchar,
  	"description" varchar,
  	"columns" "enum__pages_v_blocks_team_columns" DEFAULT '3',
  	"photo_style" "enum__pages_v_blocks_team_photo_style" DEFAULT 'square',
  	"background_color" "enum__pages_v_blocks_team_background_color" DEFAULT 'bg',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"allow_multiple" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_blog_preview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum__pages_v_blocks_blog_preview_columns" DEFAULT '3',
  	"description" varchar,
  	"show_excerpt" boolean DEFAULT true,
  	"show_read_time" boolean DEFAULT false,
  	"show_category" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_comparison_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"price" varchar,
  	"featured" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_comparison_rows_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__pages_v_blocks_comparison_rows_values_type" DEFAULT 'text',
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_infobox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_infobox_variant" DEFAULT 'info',
  	"icon" varchar,
  	"title" varchar,
  	"description" jsonb,
  	"dismissible" boolean DEFAULT false,
  	"persistent" boolean DEFAULT false,
  	"storage_key" varchar,
  	"max_width" "enum__pages_v_blocks_infobox_max_width" DEFAULT 'wide',
  	"margin_top" "enum__pages_v_blocks_infobox_margin_top" DEFAULT 'md',
  	"margin_bottom" "enum__pages_v_blocks_infobox_margin_bottom" DEFAULT 'md',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_image_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum__pages_v_blocks_image_gallery_columns" DEFAULT '3',
  	"aspect_ratio" "enum__pages_v_blocks_image_gallery_aspect_ratio" DEFAULT '4-3',
  	"enable_lightbox" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"source" "enum__pages_v_blocks_video_source" DEFAULT 'youtube',
  	"aspect_ratio" "enum__pages_v_blocks_video_aspect_ratio" DEFAULT '16-9',
  	"youtube_url" varchar,
  	"vimeo_url" varchar,
  	"video_file_id" integer,
  	"poster_image_id" integer,
  	"caption" varchar,
  	"autoplay" boolean DEFAULT false,
  	"controls" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"language" "enum__pages_v_blocks_code_language" DEFAULT 'typescript',
  	"show_line_numbers" boolean DEFAULT true,
  	"filename" varchar,
  	"code" varchar,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Locatie',
  	"address" varchar,
  	"zoom" numeric DEFAULT 15,
  	"height" "enum__pages_v_blocks_map_height" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_construction_hero_avatars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"initials" varchar,
  	"color" "enum__pages_v_blocks_construction_hero_avatars_color" DEFAULT 'teal',
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_construction_hero_floating_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"icon" varchar,
  	"color" "enum__pages_v_blocks_construction_hero_floating_badges_color" DEFAULT 'green',
  	"position" "enum__pages_v_blocks_construction_hero_floating_badges_position" DEFAULT 'bottom-left',
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_construction_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"badge_icon" varchar DEFAULT 'award',
  	"title" varchar,
  	"description" varchar,
  	"primary_c_t_a_text" varchar DEFAULT 'Gratis offerte aanvragen',
  	"primary_c_t_a_icon" varchar DEFAULT 'file-text',
  	"primary_c_t_a_link" varchar DEFAULT '/offerte-aanvragen',
  	"secondary_c_t_a_text" varchar DEFAULT 'Bekijk projecten',
  	"secondary_c_t_a_icon" varchar DEFAULT 'play-circle',
  	"secondary_c_t_a_link" varchar DEFAULT '/projecten',
  	"trust_text" varchar DEFAULT '500+ tevreden opdrachtgevers',
  	"trust_subtext" varchar DEFAULT 'Gemiddeld 4.9/5 beoordeeld',
  	"hero_image_id" integer,
  	"hero_emoji" varchar DEFAULT '🏗️',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_services_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_badge" varchar DEFAULT 'Onze diensten',
  	"heading_badge_icon" varchar DEFAULT 'wrench',
  	"heading_title" varchar DEFAULT 'Alles onder één dak',
  	"heading_description" varchar DEFAULT 'Van eerste schets tot sleuteloverdracht. Wij begeleiden u bij elke stap van uw bouwproject.',
  	"services_source" "enum__pages_v_blocks_services_grid_services_source" DEFAULT 'auto',
  	"limit" numeric DEFAULT 6,
  	"columns" "enum__pages_v_blocks_services_grid_columns" DEFAULT '3',
  	"link_text" varchar DEFAULT 'Meer info',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_projects_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_badge" varchar,
  	"heading_title" varchar DEFAULT 'Onze projecten',
  	"heading_description" varchar,
  	"projects_source" "enum__pages_v_blocks_projects_grid_projects_source" DEFAULT 'auto',
  	"category_id" integer,
  	"limit" numeric DEFAULT 6,
  	"columns" "enum__pages_v_blocks_projects_grid_columns" DEFAULT '3',
  	"show_filter" boolean DEFAULT false,
  	"cta_button_enabled" boolean DEFAULT false,
  	"cta_button_text" varchar DEFAULT 'Bekijk alle projecten',
  	"cta_button_link" varchar DEFAULT '/projecten',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_reviews_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_badge" varchar,
  	"heading_title" varchar DEFAULT 'Wat onze klanten zeggen',
  	"heading_description" varchar,
  	"reviews_source" "enum__pages_v_blocks_reviews_grid_reviews_source" DEFAULT 'featured',
  	"limit" numeric DEFAULT 6,
  	"columns" "enum__pages_v_blocks_reviews_grid_columns" DEFAULT '3',
  	"layout" "enum__pages_v_blocks_reviews_grid_layout" DEFAULT 'cards',
  	"show_ratings" boolean DEFAULT true,
  	"show_avatars" boolean DEFAULT true,
  	"average_rating_enabled" boolean DEFAULT false,
  	"average_rating_position" "enum__pages_v_blocks_reviews_grid_average_rating_position" DEFAULT 'top',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_stats_bar_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"icon" "enum__pages_v_blocks_stats_bar_stats_icon" DEFAULT 'none',
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_stats_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__pages_v_blocks_stats_bar_style" DEFAULT 'default',
  	"layout" "enum__pages_v_blocks_stats_bar_layout" DEFAULT 'horizontal',
  	"animate" boolean DEFAULT true,
  	"dividers" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_cta_banner_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"link" varchar,
  	"variant" "enum__pages_v_blocks_cta_banner_buttons_variant" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_cta_banner_trust_elements_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_cta_banner_trust_elements_items_icon" DEFAULT 'check',
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__pages_v_blocks_cta_banner_style" DEFAULT 'gradient',
  	"background_image_id" integer,
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"trust_elements_enabled" boolean DEFAULT false,
  	"alignment" "enum__pages_v_blocks_cta_banner_alignment" DEFAULT 'center',
  	"size" "enum__pages_v_blocks_cta_banner_size" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_status" "enum__pages_v_version_status" DEFAULT 'published',
  	"version_published_on" timestamp(3) with time zone,
  	"version_color_scheme_primary" varchar,
  	"version_color_scheme_secondary" varchar,
  	"version_color_scheme_accent" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_focus_keyword" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_canonical_url" varchar,
  	"version_meta_no_index" boolean DEFAULT false,
  	"version_meta_no_follow" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"product_categories_id" integer,
  	"cases_id" integer,
  	"blog_posts_id" integer,
  	"construction_services_id" integer,
  	"construction_projects_id" integer,
  	"construction_reviews_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"website" varchar,
  	"category" "enum_partners_category" DEFAULT 'klant',
  	"description" varchar,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"status" "enum_partners_status" DEFAULT 'published',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"icon_type" "enum_services_icon_type" DEFAULT 'lucide',
  	"icon_name" varchar,
  	"icon_upload_id" integer,
  	"link" varchar,
  	"category" "enum_services_category" DEFAULT 'algemeen',
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"status" "enum_services_status" DEFAULT 'published',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"type" "enum_notifications_type" NOT NULL,
  	"category" "enum_notifications_category" DEFAULT 'all' NOT NULL,
  	"title" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"is_read" boolean DEFAULT false,
  	"read_at" timestamp(3) with time zone,
  	"related_order_id" integer,
  	"related_product_id" integer,
  	"action_url" varchar,
  	"action_label" varchar,
  	"icon" "enum_notifications_icon" DEFAULT 'bell',
  	"icon_color" "enum_notifications_icon_color" DEFAULT 'teal',
  	"priority" "enum_notifications_priority" DEFAULT 'normal',
  	"expires_at" timestamp(3) with time zone,
  	"send_email" boolean DEFAULT false,
  	"email_sent" boolean DEFAULT false,
  	"email_sent_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "themes_custom_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"token_name" varchar NOT NULL,
  	"token_value" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "themes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"icon" varchar,
  	"is_default" boolean DEFAULT false,
  	"primary_color" varchar,
  	"primary_color_light" varchar,
  	"primary_color_dark" varchar,
  	"dark_surface" varchar,
  	"dark_surface_light" varchar,
  	"body_font" varchar,
  	"heading_font" varchar,
  	"primary_gradient" varchar,
  	"hero_gradient" varchar,
  	"border_radius_sm" numeric,
  	"border_radius_md" numeric,
  	"template_count" numeric,
  	"unique_component_count" numeric,
  	"status" "enum_themes_status" DEFAULT 'active',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "products_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "products_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"platform" "enum_products_videos_platform" DEFAULT 'youtube'
  );
  
  CREATE TABLE IF NOT EXISTS "products_child_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"sort_order" numeric DEFAULT 0,
  	"is_default" boolean DEFAULT false
  );
  
  CREATE TABLE IF NOT EXISTS "products_meta_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "products_specifications_attributes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"unit" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "products_specifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"group" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "products_variant_options_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"price_modifier" numeric,
  	"stock_level" numeric,
  	"color_code" varchar,
  	"image_id" integer,
  	"subscription_type" "enum_products_variant_options_values_subscription_type",
  	"issues" numeric,
  	"discount_percentage" numeric,
  	"auto_renew" boolean DEFAULT false
  );
  
  CREATE TABLE IF NOT EXISTS "products_variant_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"option_name" varchar,
  	"display_type" "enum_products_variant_options_display_type" DEFAULT 'sizeRadio'
  );
  
  CREATE TABLE IF NOT EXISTS "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"magazine_title" varchar,
  	"product_type" "enum_products_product_type" DEFAULT 'simple' NOT NULL,
  	"is_subscription" boolean DEFAULT false,
  	"sku" varchar,
  	"ean" varchar,
  	"mpn" varchar,
  	"short_description" varchar,
  	"description" jsonb,
  	"brand_id" integer,
  	"manufacturer" varchar,
  	"status" "enum_products_status" DEFAULT 'draft' NOT NULL,
  	"featured" boolean DEFAULT false,
  	"condition" "enum_products_condition" DEFAULT 'new',
  	"warranty" varchar,
  	"release_date" timestamp(3) with time zone,
  	"badge" "enum_products_badge" DEFAULT 'none',
  	"price" numeric NOT NULL,
  	"sale_price" numeric,
  	"compare_at_price" numeric,
  	"cost_price" numeric,
  	"msrp" numeric,
  	"tax_class" "enum_products_tax_class" DEFAULT 'standard',
  	"includes_tax" boolean DEFAULT false,
  	"track_stock" boolean DEFAULT true,
  	"stock" numeric DEFAULT 0,
  	"stock_status" "enum_products_stock_status" DEFAULT 'in-stock',
  	"low_stock_threshold" numeric DEFAULT 5,
  	"backorders_allowed" boolean DEFAULT false,
  	"availability_date" timestamp(3) with time zone,
  	"weight" numeric,
  	"weight_unit" "enum_products_weight_unit" DEFAULT 'kg',
  	"dimensions_length" numeric,
  	"dimensions_width" numeric,
  	"dimensions_height" numeric,
  	"shipping_class" varchar,
  	"free_shipping" boolean DEFAULT false,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"configurator_settings_show_config_summary" boolean DEFAULT true,
  	"configurator_settings_show_price_breakdown" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"product_categories_id" integer,
  	"media_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "product_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"parent_id" integer,
  	"image_id" integer,
  	"level" numeric DEFAULT 0,
  	"order" numeric DEFAULT 0,
  	"visible" boolean DEFAULT true,
  	"icon" varchar,
  	"show_in_navigation" boolean DEFAULT true,
  	"navigation_order" numeric DEFAULT 0,
  	"promo_banner_enabled" boolean DEFAULT false,
  	"promo_banner_title" varchar,
  	"promo_banner_subtitle" varchar,
  	"promo_banner_image_id" integer,
  	"promo_banner_button_text" varchar,
  	"promo_banner_button_link" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "brands" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"logo_id" integer,
  	"description" jsonb,
  	"website" varchar,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "recently_viewed" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer,
  	"session_id" varchar,
  	"product_id" integer NOT NULL,
  	"viewed_at" timestamp(3) with time zone NOT NULL,
  	"product_snapshot_title" varchar,
  	"product_snapshot_slug" varchar,
  	"product_snapshot_sku" varchar,
  	"product_snapshot_price" numeric,
  	"product_snapshot_image_url" varchar,
  	"product_snapshot_brand" varchar,
  	"referrer" varchar,
  	"source" "enum_recently_viewed_source",
  	"device" "enum_recently_viewed_device",
  	"time_on_page" numeric,
  	"scroll_depth" numeric,
  	"added_to_cart" boolean DEFAULT false,
  	"added_to_favorites" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "edition_notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"user_id" integer,
  	"magazine_title" varchar NOT NULL,
  	"product_id" integer,
  	"active" boolean DEFAULT true,
  	"last_notified" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "customer_groups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"type" "enum_customer_groups_type" DEFAULT 'b2c' NOT NULL,
  	"discount" numeric DEFAULT 0 NOT NULL,
  	"priority" numeric DEFAULT 50 NOT NULL,
  	"min_order_amount" numeric,
  	"is_default" boolean DEFAULT false,
  	"can_view_catalog" boolean DEFAULT true,
  	"can_place_orders" boolean DEFAULT true,
  	"can_request_quotes" boolean DEFAULT false,
  	"can_download_invoices" boolean DEFAULT true,
  	"can_view_order_history" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"sku" varchar,
  	"ean" varchar,
  	"parent_product_id" varchar,
  	"parent_product_title" varchar,
  	"quantity" numeric DEFAULT 1 NOT NULL,
  	"price" numeric NOT NULL,
  	"subtotal" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "orders_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"event" "enum_orders_timeline_event" NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"timestamp" timestamp(3) with time zone NOT NULL,
  	"location" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_number" varchar NOT NULL,
  	"customer_id" integer NOT NULL,
  	"subtotal" numeric NOT NULL,
  	"shipping_cost" numeric DEFAULT 0,
  	"tax" numeric DEFAULT 0,
  	"discount" numeric DEFAULT 0,
  	"total" numeric NOT NULL,
  	"shipping_address_name" varchar NOT NULL,
  	"shipping_address_company" varchar,
  	"shipping_address_street" varchar NOT NULL,
  	"shipping_address_house_number" varchar NOT NULL,
  	"shipping_address_postal_code" varchar NOT NULL,
  	"shipping_address_city" varchar NOT NULL,
  	"shipping_address_country" varchar DEFAULT 'Nederland',
  	"billing_address_same_as_shipping" boolean DEFAULT true,
  	"billing_address_company" varchar,
  	"billing_address_street" varchar,
  	"billing_address_house_number" varchar,
  	"billing_address_postal_code" varchar,
  	"billing_address_city" varchar,
  	"billing_address_country" varchar DEFAULT 'Nederland',
  	"status" "enum_orders_status" DEFAULT 'pending' NOT NULL,
  	"payment_method" "enum_orders_payment_method" NOT NULL,
  	"payment_status" "enum_orders_payment_status" DEFAULT 'pending' NOT NULL,
  	"shipping_provider" "enum_orders_shipping_provider",
  	"tracking_code" varchar,
  	"tracking_url" varchar,
  	"shipping_method" "enum_orders_shipping_method" DEFAULT 'standard',
  	"expected_delivery_date" timestamp(3) with time zone,
  	"actual_delivery_date" timestamp(3) with time zone,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "order_lists_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"default_quantity" numeric DEFAULT 1 NOT NULL,
  	"notes" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "order_lists_share_with" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"can_edit" boolean DEFAULT false
  );
  
  CREATE TABLE IF NOT EXISTS "order_lists" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"icon" "enum_order_lists_icon" DEFAULT 'clipboard-list',
  	"color" "enum_order_lists_color" DEFAULT 'teal',
  	"is_pinned" boolean DEFAULT false,
  	"owner_id" integer NOT NULL,
  	"is_default" boolean DEFAULT false,
  	"item_count" numeric,
  	"description" varchar,
  	"notes" varchar,
  	"last_ordered_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "recurring_orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"title" varchar,
  	"sku" varchar,
  	"brand" varchar,
  	"quantity" numeric DEFAULT 1 NOT NULL,
  	"price" numeric NOT NULL,
  	"line_total" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "recurring_orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference_number" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"customer_id" integer NOT NULL,
  	"status" "enum_recurring_orders_status" DEFAULT 'active' NOT NULL,
  	"frequency_value" numeric DEFAULT 1 NOT NULL,
  	"frequency_unit" "enum_recurring_orders_frequency_unit" DEFAULT 'weeks' NOT NULL,
  	"frequency_display_text" varchar,
  	"next_delivery_date" timestamp(3) with time zone NOT NULL,
  	"last_delivery_date" timestamp(3) with time zone,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone,
  	"paused_date" timestamp(3) with time zone,
  	"estimated_total" numeric NOT NULL,
  	"delivery_count" numeric DEFAULT 0,
  	"total_spent" numeric DEFAULT 0,
  	"savings_per_delivery" numeric DEFAULT 0,
  	"shipping_address_name" varchar NOT NULL,
  	"shipping_address_company" varchar,
  	"shipping_address_street" varchar NOT NULL,
  	"shipping_address_house_number" varchar NOT NULL,
  	"shipping_address_postal_code" varchar NOT NULL,
  	"shipping_address_city" varchar NOT NULL,
  	"shipping_address_country" varchar DEFAULT 'Nederland',
  	"payment_method" "enum_recurring_orders_payment_method",
  	"notes" varchar,
  	"notify_before_delivery" boolean DEFAULT true,
  	"notify_days_before" numeric DEFAULT 2,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "recurring_orders_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"orders_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "invoices_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"description" varchar NOT NULL,
  	"sku" varchar,
  	"quantity" numeric DEFAULT 1 NOT NULL,
  	"unit_price" numeric NOT NULL,
  	"line_total" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "invoices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"invoice_number" varchar NOT NULL,
  	"order_id" integer NOT NULL,
  	"customer_id" integer NOT NULL,
  	"invoice_date" timestamp(3) with time zone NOT NULL,
  	"due_date" timestamp(3) with time zone NOT NULL,
  	"payment_date" timestamp(3) with time zone,
  	"subtotal" numeric NOT NULL,
  	"tax" numeric DEFAULT 0,
  	"shipping_cost" numeric DEFAULT 0,
  	"discount" numeric DEFAULT 0,
  	"amount" numeric NOT NULL,
  	"status" "enum_invoices_status" DEFAULT 'open' NOT NULL,
  	"payment_method" "enum_invoices_payment_method",
  	"payment_reference" varchar,
  	"pdf_file_id" integer,
  	"notes" varchar,
  	"reminders_sent" numeric DEFAULT 0,
  	"last_reminder_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "returns_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"title" varchar NOT NULL,
  	"sku" varchar,
  	"brand" varchar,
  	"unit_price" numeric NOT NULL,
  	"quantity_ordered" numeric NOT NULL,
  	"quantity_returning" numeric NOT NULL,
  	"is_returnable" boolean DEFAULT true,
  	"return_value" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "returns" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"rma_number" varchar NOT NULL,
  	"order_id" integer NOT NULL,
  	"customer_id" integer NOT NULL,
  	"status" "enum_returns_status" DEFAULT 'pending' NOT NULL,
  	"return_deadline" timestamp(3) with time zone,
  	"received_date" timestamp(3) with time zone,
  	"processed_date" timestamp(3) with time zone,
  	"return_reason" "enum_returns_return_reason" NOT NULL,
  	"reason_description" varchar,
  	"product_condition" "enum_returns_product_condition" NOT NULL,
  	"preferred_resolution" "enum_returns_preferred_resolution" NOT NULL,
  	"return_shipping_tracking_code" varchar,
  	"return_shipping_tracking_url" varchar,
  	"return_shipping_return_label_generated" boolean DEFAULT false,
  	"return_shipping_return_label_sent_date" timestamp(3) with time zone,
  	"return_shipping_shipping_cost_refund" numeric DEFAULT 0,
  	"return_value" numeric NOT NULL,
  	"refund_amount" numeric DEFAULT 0,
  	"refund_date" timestamp(3) with time zone,
  	"refund_method" "enum_returns_refund_method",
  	"inspection_notes" varchar,
  	"internal_notes" varchar,
  	"approval_date" timestamp(3) with time zone,
  	"rejection_reason" varchar,
  	"replacement_order_id" integer,
  	"store_credit_amount" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "returns_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "subscription_plans_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL,
  	"included" boolean DEFAULT true
  );
  
  CREATE TABLE IF NOT EXISTS "subscription_plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"price" numeric NOT NULL,
  	"price_per_user" numeric,
  	"billing_interval" "enum_subscription_plans_billing_interval" DEFAULT 'monthly' NOT NULL,
  	"limits_users" numeric,
  	"limits_storage" numeric,
  	"limits_api_calls" numeric,
  	"active" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"allows_premium_content" boolean DEFAULT false,
  	"tier" "enum_subscription_plans_tier" DEFAULT 'free',
  	"stripe_product_id" varchar,
  	"stripe_price_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "user_subscriptions_addons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"price" numeric NOT NULL,
  	"added_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "user_subscriptions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"plan_id" integer NOT NULL,
  	"status" "enum_user_subscriptions_status" DEFAULT 'active' NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"current_period_start" timestamp(3) with time zone NOT NULL,
  	"current_period_end" timestamp(3) with time zone NOT NULL,
  	"cancel_at_period_end" boolean DEFAULT false,
  	"canceled_at" timestamp(3) with time zone,
  	"usage_users" numeric DEFAULT 1,
  	"usage_storage" numeric DEFAULT 0,
  	"usage_api_calls" numeric DEFAULT 0,
  	"stripe_subscription_id" varchar,
  	"stripe_customer_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payment_methods" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"type" "enum_payment_methods_type" NOT NULL,
  	"is_default" boolean DEFAULT false,
  	"sepa_account_holder_name" varchar,
  	"sepa_iban" varchar,
  	"sepa_bank_name" varchar,
  	"card_brand" "enum_payment_methods_card_brand",
  	"card_last4" varchar,
  	"card_expiry_month" numeric,
  	"card_expiry_year" numeric,
  	"stripe_payment_method_id" varchar,
  	"last4" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "gift_vouchers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"amount" numeric NOT NULL,
  	"balance" numeric NOT NULL,
  	"status" "enum_gift_vouchers_status" DEFAULT 'active' NOT NULL,
  	"occasion" "enum_gift_vouchers_occasion" DEFAULT 'universal',
  	"recipient_name" varchar,
  	"recipient_email" varchar NOT NULL,
  	"sender_name" varchar,
  	"sender_email" varchar,
  	"message" varchar,
  	"delivery_method" "enum_gift_vouchers_delivery_method" DEFAULT 'email' NOT NULL,
  	"scheduled_delivery" timestamp(3) with time zone,
  	"sent_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone,
  	"purchased_by_id" integer,
  	"redeemed_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "licenses_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"version" varchar NOT NULL,
  	"downloaded_at" timestamp(3) with time zone NOT NULL,
  	"file_size" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "licenses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"product_id" integer,
  	"product_name" varchar NOT NULL,
  	"license_key" varchar NOT NULL,
  	"type" "enum_licenses_type" DEFAULT 'personal' NOT NULL,
  	"status" "enum_licenses_status" DEFAULT 'active' NOT NULL,
  	"max_activations" numeric DEFAULT 1,
  	"current_activations" numeric DEFAULT 0,
  	"version" varchar,
  	"purchased_at" timestamp(3) with time zone NOT NULL,
  	"expires_at" timestamp(3) with time zone,
  	"order_id" integer,
  	"download_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "license_activations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"license_id" integer NOT NULL,
  	"device_name" varchar NOT NULL,
  	"device_id" varchar NOT NULL,
  	"os" varchar,
  	"status" "enum_license_activations_status" DEFAULT 'active' NOT NULL,
  	"activated_at" timestamp(3) with time zone NOT NULL,
  	"deactivated_at" timestamp(3) with time zone,
  	"last_seen_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "loyalty_tiers_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"benefit" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "loyalty_tiers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"icon" varchar,
  	"color" varchar,
  	"min_points" numeric NOT NULL,
  	"multiplier" numeric DEFAULT 1 NOT NULL,
  	"free_shipping" boolean DEFAULT false,
  	"priority_support" boolean DEFAULT false,
  	"early_access" boolean DEFAULT false,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "loyalty_rewards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"icon" varchar,
  	"type" "enum_loyalty_rewards_type" DEFAULT 'discount' NOT NULL,
  	"points_cost" numeric NOT NULL,
  	"value" numeric,
  	"active" boolean DEFAULT true,
  	"stock" numeric,
  	"tier_required_id" integer,
  	"expiry_days" numeric,
  	"terms" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "loyalty_points" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"available_points" numeric DEFAULT 0 NOT NULL,
  	"total_earned" numeric DEFAULT 0 NOT NULL,
  	"total_spent" numeric DEFAULT 0 NOT NULL,
  	"tier_id" integer,
  	"stats_total_orders" numeric DEFAULT 0,
  	"stats_total_spent_money" numeric DEFAULT 0,
  	"stats_rewards_redeemed" numeric DEFAULT 0,
  	"stats_referrals" numeric DEFAULT 0,
  	"referral_code" varchar,
  	"member_since" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "loyalty_transactions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"type" "enum_loyalty_transactions_type" NOT NULL,
  	"points" numeric NOT NULL,
  	"description" varchar NOT NULL,
  	"related_order_id" integer,
  	"related_reward_id" integer,
  	"metadata" jsonb,
  	"expires_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "loyalty_redemptions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"reward_id" integer NOT NULL,
  	"points_spent" numeric NOT NULL,
  	"status" "enum_loyalty_redemptions_status" DEFAULT 'available' NOT NULL,
  	"redeemed_at" timestamp(3) with time zone NOT NULL,
  	"used_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone,
  	"code" varchar,
  	"used_in_order_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "ab_tests_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"distribution" numeric DEFAULT 50 NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "ab_tests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"target_page" "enum_ab_tests_target_page" NOT NULL,
  	"status" "enum_ab_tests_status" DEFAULT 'draft' NOT NULL,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"winner" varchar,
  	"total_participants" numeric DEFAULT 0,
  	"total_conversions" numeric DEFAULT 0,
  	"auto_winner_enabled" boolean DEFAULT true,
  	"auto_winner_conversion_threshold" numeric DEFAULT 100,
  	"auto_winner_confidence_level" numeric DEFAULT 95,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "ab_test_results" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"test_id" integer NOT NULL,
  	"variant" varchar NOT NULL,
  	"user_id_id" integer,
  	"session_id" varchar,
  	"converted" boolean DEFAULT false,
  	"conversion_value" numeric,
  	"converted_at" timestamp(3) with time zone,
  	"order_id" integer,
  	"user_agent" varchar,
  	"referrer" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"featured_image_id" integer,
  	"featured_image_emoji" varchar,
  	"featured_tag" "enum_blog_posts_featured_tag" DEFAULT 'none',
  	"content" jsonb,
  	"author_id" integer,
  	"author_bio" varchar,
  	"reading_time" numeric,
  	"view_count" numeric DEFAULT 0,
  	"featured" boolean DEFAULT false,
  	"template" "enum_blog_posts_template" DEFAULT 'blogtemplate1',
  	"content_type" "enum_blog_posts_content_type" DEFAULT 'article',
  	"content_access_access_level" "enum_blog_posts_content_access_access_level" DEFAULT 'free',
  	"content_access_preview_length" numeric DEFAULT 200,
  	"content_access_lock_message" varchar,
  	"enable_t_o_c" boolean DEFAULT true,
  	"enable_share" boolean DEFAULT true,
  	"enable_comments" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"status" "enum_blog_posts_status" DEFAULT 'draft',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_focus_keyword" varchar,
  	"meta_image_id" integer,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"meta_no_follow" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_blog_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"blog_categories_id" integer,
  	"products_id" integer,
  	"blog_posts_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_featured_image_id" integer,
  	"version_featured_image_emoji" varchar,
  	"version_featured_tag" "enum__blog_posts_v_version_featured_tag" DEFAULT 'none',
  	"version_content" jsonb,
  	"version_author_id" integer,
  	"version_author_bio" varchar,
  	"version_reading_time" numeric,
  	"version_view_count" numeric DEFAULT 0,
  	"version_featured" boolean DEFAULT false,
  	"version_template" "enum__blog_posts_v_version_template" DEFAULT 'blogtemplate1',
  	"version_content_type" "enum__blog_posts_v_version_content_type" DEFAULT 'article',
  	"version_content_access_access_level" "enum__blog_posts_v_version_content_access_access_level" DEFAULT 'free',
  	"version_content_access_preview_length" numeric DEFAULT 200,
  	"version_content_access_lock_message" varchar,
  	"version_enable_t_o_c" boolean DEFAULT true,
  	"version_enable_share" boolean DEFAULT true,
  	"version_enable_comments" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_status" "enum__blog_posts_v_version_status" DEFAULT 'draft',
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_focus_keyword" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_canonical_url" varchar,
  	"version_meta_no_index" boolean DEFAULT false,
  	"version_meta_no_follow" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__blog_posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"blog_categories_id" integer,
  	"products_id" integer,
  	"blog_posts_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "blog_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"parent_id" integer,
  	"description" varchar,
  	"icon" "enum_blog_categories_icon" DEFAULT 'BookOpen',
  	"color" "enum_blog_categories_color" DEFAULT 'teal',
  	"image_id" integer,
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"category" "enum_faqs_category" DEFAULT 'algemeen',
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"status" "enum_faqs_status" DEFAULT 'published',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "cases_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "cases_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "cases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"client" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"featured_image_id" integer,
  	"content" jsonb NOT NULL,
  	"live_url" varchar,
  	"status" "enum_cases_status" DEFAULT 'published',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_focus_keyword" varchar,
  	"meta_image_id" integer,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"meta_no_follow" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"company" varchar NOT NULL,
  	"photo_id" integer,
  	"quote" varchar NOT NULL,
  	"rating" numeric DEFAULT 5 NOT NULL,
  	"featured" boolean DEFAULT false,
  	"status" "enum_testimonials_status" DEFAULT 'published',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "vendors_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"icon" "enum_vendors_certifications_icon"
  );
  
  CREATE TABLE IF NOT EXISTS "vendors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"short_name" varchar,
  	"tagline" varchar,
  	"description" jsonb,
  	"logo_id" integer,
  	"banner_id" integer,
  	"banner_color" varchar,
  	"is_verified" boolean DEFAULT false,
  	"is_premium" boolean DEFAULT false,
  	"is_featured" boolean DEFAULT false,
  	"contact_website" varchar,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"contact_address" varchar,
  	"contact_country" varchar,
  	"stats_product_count" numeric,
  	"stats_rating" numeric,
  	"stats_review_count" numeric,
  	"stats_established_year" numeric,
  	"delivery_delivery_time" varchar,
  	"delivery_free_shipping_from" numeric,
  	"delivery_offers_workshops" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "vendors_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"product_categories_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "vendor_reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"vendor_id" integer NOT NULL,
  	"title" varchar,
  	"rating" numeric NOT NULL,
  	"comment" varchar NOT NULL,
  	"author_name" varchar NOT NULL,
  	"author_email" varchar,
  	"author_company" varchar,
  	"author_initials" varchar,
  	"is_approved" boolean DEFAULT false,
  	"is_verified_purchase" boolean DEFAULT false,
  	"moderation_notes" varchar,
  	"helpful_count" numeric DEFAULT 0,
  	"vendor_response_text" varchar,
  	"vendor_response_responded_at" timestamp(3) with time zone,
  	"review_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workshops_target_audience" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_workshops_target_audience",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workshops_learning_objectives" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"objective" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workshops" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" jsonb NOT NULL,
  	"excerpt" varchar,
  	"featured_image_id" integer,
  	"emoji" varchar,
  	"vendor_id" integer,
  	"instructor" varchar,
  	"date" timestamp(3) with time zone NOT NULL,
  	"duration" numeric,
  	"duration_display" varchar,
  	"location_type" "enum_workshops_location_type" DEFAULT 'physical' NOT NULL,
  	"location_name" varchar,
  	"location_address" varchar,
  	"location_city" varchar,
  	"registration_url" varchar,
  	"max_participants" numeric,
  	"current_participants" numeric DEFAULT 0,
  	"is_free" boolean DEFAULT false,
  	"price" numeric,
  	"price_display" varchar,
  	"category" "enum_workshops_category",
  	"level" "enum_workshops_level",
  	"status" "enum_workshops_status" DEFAULT 'upcoming' NOT NULL,
  	"is_featured" boolean DEFAULT false,
  	"prerequisites" varchar,
  	"certificate_awarded" boolean DEFAULT false,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "construction_services_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "construction_services_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "construction_services_service_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "construction_services_usps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "construction_services_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "construction_services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"icon" varchar,
  	"color" "enum_construction_services_color" DEFAULT 'teal',
  	"short_description" varchar NOT NULL,
  	"long_description" jsonb,
  	"hero_image_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_keywords" varchar,
  	"status" "enum_construction_services_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "construction_services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "construction_projects_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "construction_projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"category_id" integer,
  	"location" varchar,
  	"year" numeric,
  	"duration" varchar,
  	"size" varchar,
  	"budget" varchar,
  	"short_description" varchar NOT NULL,
  	"long_description" jsonb,
  	"challenge" jsonb,
  	"solution" jsonb,
  	"result" jsonb,
  	"featured_image_id" integer NOT NULL,
  	"before_after_before_id" integer,
  	"before_after_after_id" integer,
  	"testimonial_quote" varchar,
  	"testimonial_client_name" varchar,
  	"testimonial_client_role" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"featured" boolean DEFAULT false,
  	"status" "enum_construction_projects_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "construction_projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "construction_reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_name" varchar NOT NULL,
  	"client_role" varchar,
  	"client_initials" varchar,
  	"client_color" "enum_construction_reviews_client_color" DEFAULT 'teal',
  	"rating" numeric NOT NULL,
  	"quote" varchar NOT NULL,
  	"project_id" integer,
  	"service_id" integer,
  	"featured" boolean DEFAULT false,
  	"status" "enum_construction_reviews_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "quote_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"address" varchar,
  	"postal_code" varchar,
  	"city" varchar,
  	"project_type" "enum_quote_requests_project_type" NOT NULL,
  	"budget" "enum_quote_requests_budget",
  	"timeline" "enum_quote_requests_timeline",
  	"description" varchar,
  	"status" "enum_quote_requests_status" DEFAULT 'new' NOT NULL,
  	"assigned_to_id" integer,
  	"notes" varchar,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"contacted_at" timestamp(3) with time zone,
  	"quoted_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "quote_requests_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "treatments_symptoms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"symptom" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "treatments_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step" varchar,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "treatments_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "treatments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"category" "enum_treatments_category",
  	"icon" varchar,
  	"excerpt" varchar,
  	"description" jsonb,
  	"duration" numeric,
  	"intake_duration" numeric,
  	"price" numeric,
  	"intake_price" numeric,
  	"insurance" "enum_treatments_insurance" DEFAULT 'covered',
  	"average_treatments" varchar,
  	"success_rate" numeric,
  	"featured_image_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_keywords" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_treatments_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "treatments_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"treatments_id" integer,
  	"practitioners_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_treatments_v_version_symptoms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"symptom" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_treatments_v_version_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"step" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_treatments_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_treatments_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_category" "enum__treatments_v_version_category",
  	"version_icon" varchar,
  	"version_excerpt" varchar,
  	"version_description" jsonb,
  	"version_duration" numeric,
  	"version_intake_duration" numeric,
  	"version_price" numeric,
  	"version_intake_price" numeric,
  	"version_insurance" "enum__treatments_v_version_insurance" DEFAULT 'covered',
  	"version_average_treatments" varchar,
  	"version_success_rate" numeric,
  	"version_featured_image_id" integer,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_keywords" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__treatments_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_treatments_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"treatments_id" integer,
  	"practitioners_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "practitioners_specializations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"specialization" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "practitioners_qualifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"qualification" varchar,
  	"year" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "practitioners_work_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_practitioners_work_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "practitioners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"avatar_id" integer,
  	"emoji" varchar,
  	"initials" varchar,
  	"title" varchar,
  	"role" "enum_practitioners_role",
  	"bio" jsonb,
  	"availability" "enum_practitioners_availability" DEFAULT 'available',
  	"email" varchar,
  	"phone" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_practitioners_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "practitioners_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"treatments_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_practitioners_v_version_specializations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"specialization" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_practitioners_v_version_qualifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"qualification" varchar,
  	"year" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_practitioners_v_version_work_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__practitioners_v_version_work_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "_practitioners_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_avatar_id" integer,
  	"version_emoji" varchar,
  	"version_initials" varchar,
  	"version_title" varchar,
  	"version_role" "enum__practitioners_v_version_role",
  	"version_bio" jsonb,
  	"version_availability" "enum__practitioners_v_version_availability" DEFAULT 'available',
  	"version_email" varchar,
  	"version_phone" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__practitioners_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_practitioners_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"treatments_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "appointments_preferred_time" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_appointments_preferred_time",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "appointments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"name" varchar,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"birth_date" timestamp(3) with time zone,
  	"insurance" "enum_appointments_insurance",
  	"treatment" "enum_appointments_treatment",
  	"complaint" varchar NOT NULL,
  	"has_referral" "enum_appointments_has_referral" DEFAULT 'no',
  	"type" "enum_appointments_type" DEFAULT 'new',
  	"status" "enum_appointments_status" DEFAULT 'new',
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "beauty_services_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"benefit" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "beauty_services_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step" varchar,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "beauty_services_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_beauty_services_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "beauty_services_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "beauty_services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"category" "enum_beauty_services_category",
  	"icon" varchar,
  	"excerpt" varchar,
  	"description" jsonb,
  	"duration" numeric,
  	"price" numeric,
  	"price_from" numeric,
  	"price_to" numeric,
  	"bookable" boolean DEFAULT true,
  	"requires_consultation" boolean DEFAULT false,
  	"featured_image_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_keywords" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_beauty_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "beauty_services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"beauty_services_id" integer,
  	"stylists_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_beauty_services_v_version_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"benefit" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_beauty_services_v_version_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"step" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_beauty_services_v_version_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__beauty_services_v_version_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "_beauty_services_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_beauty_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_category" "enum__beauty_services_v_version_category",
  	"version_icon" varchar,
  	"version_excerpt" varchar,
  	"version_description" jsonb,
  	"version_duration" numeric,
  	"version_price" numeric,
  	"version_price_from" numeric,
  	"version_price_to" numeric,
  	"version_bookable" boolean DEFAULT true,
  	"version_requires_consultation" boolean DEFAULT false,
  	"version_featured_image_id" integer,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_keywords" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__beauty_services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_beauty_services_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"beauty_services_id" integer,
  	"stylists_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "stylists_specialties" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"specialty" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "stylists_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"certification" varchar,
  	"year" numeric,
  	"institution" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "stylists_work_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_stylists_work_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "stylists_portfolio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "stylists" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"avatar_id" integer,
  	"emoji" varchar,
  	"initials" varchar,
  	"role" "enum_stylists_role",
  	"bio" jsonb,
  	"experience" numeric,
  	"availability" "enum_stylists_availability" DEFAULT 'available',
  	"start_time" varchar,
  	"end_time" varchar,
  	"bookable" boolean DEFAULT true,
  	"email" varchar,
  	"phone" varchar,
  	"instagram" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_stylists_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "stylists_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"beauty_services_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_stylists_v_version_specialties" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"specialty" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_stylists_v_version_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"certification" varchar,
  	"year" numeric,
  	"institution" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_stylists_v_version_work_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__stylists_v_version_work_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "_stylists_v_version_portfolio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_stylists_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_avatar_id" integer,
  	"version_emoji" varchar,
  	"version_initials" varchar,
  	"version_role" "enum__stylists_v_version_role",
  	"version_bio" jsonb,
  	"version_experience" numeric,
  	"version_availability" "enum__stylists_v_version_availability" DEFAULT 'available',
  	"version_start_time" varchar,
  	"version_end_time" varchar,
  	"version_bookable" boolean DEFAULT true,
  	"version_email" varchar,
  	"version_phone" varchar,
  	"version_instagram" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__stylists_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_stylists_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"beauty_services_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "beauty_bookings_preferred_time_slots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_beauty_bookings_preferred_time_slots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "beauty_bookings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"customer_name" varchar,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"service_id" integer,
  	"stylist_id" integer,
  	"date" timestamp(3) with time zone NOT NULL,
  	"time" varchar NOT NULL,
  	"remarks" varchar,
  	"is_first_visit" boolean DEFAULT false,
  	"marketing_consent" boolean DEFAULT false,
  	"status" "enum_beauty_bookings_status" DEFAULT 'new',
  	"total_price" numeric,
  	"duration" numeric,
  	"notes" varchar,
  	"confirmation_sent" boolean DEFAULT false,
  	"reminder_sent" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "menu_items_allergens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"allergen" "enum_menu_items_allergens_allergen"
  );
  
  CREATE TABLE IF NOT EXISTS "menu_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"category" "enum_menu_items_category" DEFAULT 'mains',
  	"description" varchar,
  	"ingredients" varchar,
  	"price" numeric,
  	"featured" boolean DEFAULT false,
  	"vegetarian" boolean DEFAULT false,
  	"vegan" boolean DEFAULT false,
  	"gluten_free" boolean DEFAULT false,
  	"image_id" integer,
  	"icon" varchar DEFAULT '🍽️',
  	"sort_order" numeric DEFAULT 0,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_menu_items_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_menu_items_v_version_allergens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"allergen" "enum__menu_items_v_version_allergens_allergen",
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_menu_items_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_category" "enum__menu_items_v_version_category" DEFAULT 'mains',
  	"version_description" varchar,
  	"version_ingredients" varchar,
  	"version_price" numeric,
  	"version_featured" boolean DEFAULT false,
  	"version_vegetarian" boolean DEFAULT false,
  	"version_vegan" boolean DEFAULT false,
  	"version_gluten_free" boolean DEFAULT false,
  	"version_image_id" integer,
  	"version_icon" varchar DEFAULT '🍽️',
  	"version_sort_order" numeric DEFAULT 0,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__menu_items_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "reservations_preferences" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_reservations_preferences",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "reservations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_name" varchar NOT NULL,
  	"customer_email" varchar NOT NULL,
  	"customer_phone" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"time" varchar NOT NULL,
  	"guests" numeric DEFAULT 2 NOT NULL,
  	"occasion" "enum_reservations_occasion" DEFAULT 'regular',
  	"special_requests" varchar,
  	"status" "enum_reservations_status" DEFAULT 'pending' NOT NULL,
  	"confirmed" boolean DEFAULT false,
  	"reminded" boolean DEFAULT false,
  	"internal_notes" varchar,
  	"assigned_table" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "events_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "events_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"event_type" "enum_events_event_type",
  	"excerpt" varchar,
  	"description" jsonb,
  	"date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"start_time" varchar DEFAULT '19:00',
  	"duration" varchar,
  	"price" numeric,
  	"max_guests" numeric,
  	"featured" boolean DEFAULT false,
  	"booking_required" boolean DEFAULT true,
  	"booking_url" varchar,
  	"image_id" integer,
  	"icon" varchar DEFAULT '🎉',
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_events_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_events_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_event_type" "enum__events_v_version_event_type",
  	"version_excerpt" varchar,
  	"version_description" jsonb,
  	"version_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_start_time" varchar DEFAULT '19:00',
  	"version_duration" varchar,
  	"version_price" numeric,
  	"version_max_guests" numeric,
  	"version_featured" boolean DEFAULT false,
  	"version_booking_required" boolean DEFAULT true,
  	"version_booking_url" varchar,
  	"version_image_id" integer,
  	"version_icon" varchar DEFAULT '🎉',
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "client_requests_website_pages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_client_requests_website_pages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "client_requests_payment_methods" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_client_requests_payment_methods",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "client_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_client_requests_status" DEFAULT 'pending' NOT NULL,
  	"company_name" varchar NOT NULL,
  	"contact_name" varchar NOT NULL,
  	"contact_email" varchar NOT NULL,
  	"contact_phone" varchar,
  	"site_type" "enum_client_requests_site_type" NOT NULL,
  	"expected_products" "enum_client_requests_expected_products",
  	"message" varchar,
  	"domain" varchar,
  	"admin_notes" varchar,
  	"created_user_id" integer,
  	"created_client_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "clients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_clients_status" DEFAULT 'pending' NOT NULL,
  	"plan" "enum_clients_plan" DEFAULT 'starter',
  	"name" varchar NOT NULL,
  	"domain" varchar NOT NULL,
  	"contact_email" varchar NOT NULL,
  	"contact_name" varchar,
  	"contact_phone" varchar,
  	"template" "enum_clients_template" DEFAULT 'corporate' NOT NULL,
  	"features_shop" boolean DEFAULT true,
  	"features_volume_pricing" boolean DEFAULT false,
  	"features_compare_products" boolean DEFAULT false,
  	"features_quick_order" boolean DEFAULT false,
  	"features_brands" boolean DEFAULT false,
  	"features_recently_viewed" boolean DEFAULT false,
  	"features_product_reviews" boolean DEFAULT false,
  	"features_cart" boolean DEFAULT true,
  	"features_mini_cart" boolean DEFAULT false,
  	"features_free_shipping_bar" boolean DEFAULT false,
  	"features_checkout" boolean DEFAULT true,
  	"features_guest_checkout" boolean DEFAULT false,
  	"features_invoices" boolean DEFAULT false,
  	"features_order_tracking" boolean DEFAULT false,
  	"features_my_account" boolean DEFAULT true,
  	"features_returns" boolean DEFAULT false,
  	"features_recurring_orders" boolean DEFAULT false,
  	"features_order_lists" boolean DEFAULT false,
  	"features_addresses" boolean DEFAULT false,
  	"features_account_invoices" boolean DEFAULT false,
  	"features_notifications" boolean DEFAULT false,
  	"features_b2b" boolean DEFAULT false,
  	"features_customer_groups" boolean DEFAULT false,
  	"features_group_pricing" boolean DEFAULT false,
  	"features_barcode_scanner" boolean DEFAULT false,
  	"features_vendors" boolean DEFAULT false,
  	"features_vendor_reviews" boolean DEFAULT false,
  	"features_workshops" boolean DEFAULT false,
  	"features_subscriptions" boolean DEFAULT false,
  	"features_gift_vouchers" boolean DEFAULT false,
  	"features_licenses" boolean DEFAULT false,
  	"features_loyalty" boolean DEFAULT false,
  	"features_blog" boolean DEFAULT true,
  	"features_faq" boolean DEFAULT true,
  	"features_testimonials" boolean DEFAULT true,
  	"features_cases" boolean DEFAULT false,
  	"features_partners" boolean DEFAULT false,
  	"features_services" boolean DEFAULT false,
  	"features_wishlists" boolean DEFAULT false,
  	"features_multi_language" boolean DEFAULT false,
  	"features_ai_content" boolean DEFAULT false,
  	"features_search" boolean DEFAULT false,
  	"features_newsletter" boolean DEFAULT false,
  	"features_authentication" boolean DEFAULT true,
  	"deployment_url" varchar,
  	"admin_url" varchar,
  	"deployment_provider" "enum_clients_deployment_provider",
  	"last_deployed_at" timestamp(3) with time zone,
  	"deployment_provider_id" varchar,
  	"last_deployment_id" varchar,
  	"database_url" varchar,
  	"database_provider_id" varchar,
  	"port" numeric,
  	"admin_email" varchar,
  	"initial_admin_password" varchar,
  	"custom_environment" jsonb,
  	"custom_settings" jsonb,
  	"billing_status" "enum_clients_billing_status" DEFAULT 'active',
  	"monthly_fee" numeric,
  	"next_billing_date" timestamp(3) with time zone,
  	"payments_enabled" boolean DEFAULT false,
  	"stripe_account_id" varchar,
  	"stripe_account_status" "enum_clients_stripe_account_status" DEFAULT 'not_started',
  	"payment_pricing_tier" "enum_clients_payment_pricing_tier" DEFAULT 'standard',
  	"custom_transaction_fee_percentage" numeric,
  	"custom_transaction_fee_fixed" numeric,
  	"total_payment_volume" numeric,
  	"total_payment_revenue" numeric,
  	"last_payment_at" timestamp(3) with time zone,
  	"multi_safepay_enabled" boolean DEFAULT false,
  	"multi_safepay_affiliate_id" varchar,
  	"multi_safepay_account_status" "enum_clients_multi_safepay_account_status" DEFAULT 'not_started',
  	"multi_safepay_pricing_tier" "enum_clients_multi_safepay_pricing_tier" DEFAULT 'standard',
  	"multi_safepay_custom_rates_ideal_fee" numeric,
  	"multi_safepay_custom_rates_card_percentage" numeric,
  	"multi_safepay_custom_rates_card_fixed" numeric,
  	"multi_safepay_total_volume" numeric,
  	"multi_safepay_total_revenue" numeric,
  	"multi_safepay_last_payment_at" timestamp(3) with time zone,
  	"last_health_check" timestamp(3) with time zone,
  	"health_status" "enum_clients_health_status",
  	"uptime_percentage" numeric,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "deployments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_id" integer NOT NULL,
  	"status" "enum_deployments_status" DEFAULT 'pending' NOT NULL,
  	"environment" "enum_deployments_environment" DEFAULT 'production' NOT NULL,
  	"type" "enum_deployments_type" NOT NULL,
  	"version" varchar,
  	"git_branch" varchar,
  	"git_commit" varchar,
  	"started_at" timestamp(3) with time zone,
  	"completed_at" timestamp(3) with time zone,
  	"duration" numeric,
  	"reason" varchar,
  	"notes" varchar,
  	"triggered_by" varchar,
  	"logs" varchar,
  	"error_message" varchar,
  	"error_stack" varchar,
  	"vercel_deployment_id" varchar,
  	"vercel_deployment_url" varchar,
  	"vercel_project_id" varchar,
  	"config_snapshot" jsonb,
  	"environment_snapshot" jsonb,
  	"health_check_passed" boolean,
  	"health_check_results" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar,
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb
  );
  
  CREATE TABLE IF NOT EXISTS "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"submit_button_label" varchar,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"confirmation_message" jsonb,
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"pages_id" integer,
  	"media_id" integer,
  	"partners_id" integer,
  	"services_id" integer,
  	"notifications_id" integer,
  	"themes_id" integer,
  	"products_id" integer,
  	"product_categories_id" integer,
  	"brands_id" integer,
  	"recently_viewed_id" integer,
  	"edition_notifications_id" integer,
  	"customer_groups_id" integer,
  	"orders_id" integer,
  	"order_lists_id" integer,
  	"recurring_orders_id" integer,
  	"invoices_id" integer,
  	"returns_id" integer,
  	"subscription_plans_id" integer,
  	"user_subscriptions_id" integer,
  	"payment_methods_id" integer,
  	"gift_vouchers_id" integer,
  	"licenses_id" integer,
  	"license_activations_id" integer,
  	"loyalty_tiers_id" integer,
  	"loyalty_rewards_id" integer,
  	"loyalty_points_id" integer,
  	"loyalty_transactions_id" integer,
  	"loyalty_redemptions_id" integer,
  	"ab_tests_id" integer,
  	"ab_test_results_id" integer,
  	"blog_posts_id" integer,
  	"blog_categories_id" integer,
  	"faqs_id" integer,
  	"cases_id" integer,
  	"testimonials_id" integer,
  	"vendors_id" integer,
  	"vendor_reviews_id" integer,
  	"workshops_id" integer,
  	"construction_services_id" integer,
  	"construction_projects_id" integer,
  	"construction_reviews_id" integer,
  	"quote_requests_id" integer,
  	"treatments_id" integer,
  	"practitioners_id" integer,
  	"appointments_id" integer,
  	"beauty_services_id" integer,
  	"stylists_id" integer,
  	"beauty_bookings_id" integer,
  	"menu_items_id" integer,
  	"reservations_id" integer,
  	"events_id" integer,
  	"client_requests_id" integer,
  	"clients_id" integer,
  	"deployments_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer,
  	"redirects_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "settings_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_settings_hours_day",
  	"open" boolean DEFAULT true,
  	"from" varchar,
  	"to" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "settings_sitemap_exclude" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "settings_robots_disallow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"path" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar NOT NULL,
  	"tagline" varchar,
  	"description" varchar,
  	"kvk_number" varchar,
  	"vat_number" varchar,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"whatsapp" varchar,
  	"address_street" varchar,
  	"address_postal_code" varchar,
  	"address_city" varchar,
  	"address_country" varchar DEFAULT 'Nederland',
  	"address_show_on_site" boolean DEFAULT true,
  	"facebook" varchar,
  	"instagram" varchar,
  	"linkedin" varchar,
  	"twitter" varchar,
  	"youtube" varchar,
  	"tiktok" varchar,
  	"hours_note" varchar,
  	"default_product_template" "enum_settings_default_product_template" DEFAULT 'template1',
  	"default_blog_template" "enum_settings_default_blog_template" DEFAULT 'blogtemplate1',
  	"default_shop_archive_template" "enum_settings_default_shop_archive_template" DEFAULT 'shoparchivetemplate1',
  	"default_cart_template" "enum_settings_default_cart_template" DEFAULT 'template1',
  	"default_checkout_template" "enum_settings_default_checkout_template" DEFAULT 'checkouttemplate1',
  	"default_my_account_template" "enum_settings_default_my_account_template" DEFAULT 'myaccounttemplate1',
  	"free_shipping_threshold" numeric DEFAULT 150 NOT NULL,
  	"shipping_cost" numeric DEFAULT 6.95 NOT NULL,
  	"delivery_time" varchar DEFAULT 'Besteld voor 16:00, morgen in huis' NOT NULL,
  	"delivery_days_monday" boolean DEFAULT true,
  	"delivery_days_tuesday" boolean DEFAULT true,
  	"delivery_days_wednesday" boolean DEFAULT true,
  	"delivery_days_thursday" boolean DEFAULT true,
  	"delivery_days_friday" boolean DEFAULT true,
  	"delivery_days_saturday" boolean DEFAULT false,
  	"delivery_days_sunday" boolean DEFAULT false,
  	"return_days" numeric DEFAULT 30 NOT NULL,
  	"return_policy" jsonb,
  	"trust_indicators_trust_score" numeric,
  	"trust_indicators_trust_source" varchar,
  	"trust_indicators_years_in_business" numeric,
  	"trust_indicators_customers_served" numeric,
  	"features_enable_quick_order" boolean DEFAULT true,
  	"features_enable_order_lists" boolean DEFAULT true,
  	"features_enable_reviews" boolean DEFAULT false,
  	"features_enable_wishlist" boolean DEFAULT true,
  	"features_enable_stock_notifications" boolean DEFAULT false,
  	"features_enable_live_chat" boolean DEFAULT false,
  	"logo_id" integer,
  	"logo_white_id" integer,
  	"favicon_id" integer,
  	"primary_color" varchar,
  	"accent_color" varchar,
  	"ga4_id" varchar,
  	"gtm_id" varchar,
  	"facebook_pixel" varchar,
  	"google_site_verification" varchar,
  	"default_meta_description" varchar,
  	"default_o_g_image_id" integer,
  	"business_category" varchar,
  	"geo_latitude" numeric,
  	"geo_longitude" numeric,
  	"price_range" varchar,
  	"sitemap_enabled" boolean DEFAULT true,
  	"enable_auto_o_g_images" boolean DEFAULT true,
  	"enable_j_s_o_n_l_d" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "theme" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"navy" varchar DEFAULT '#0A1628',
  	"navy_light" varchar DEFAULT '#121F33',
  	"teal" varchar DEFAULT '#00897B',
  	"teal_light" varchar DEFAULT '#26A69A',
  	"teal_dark" varchar DEFAULT '#00695C',
  	"green" varchar DEFAULT '#00C853',
  	"coral" varchar DEFAULT '#FF6B6B',
  	"amber" varchar DEFAULT '#F59E0B',
  	"blue" varchar DEFAULT '#2196F3',
  	"purple" varchar DEFAULT '#7C3AED',
  	"white" varchar DEFAULT '#FAFBFC',
  	"bg" varchar DEFAULT '#F5F7FA',
  	"grey" varchar DEFAULT '#E8ECF1',
  	"grey_mid" varchar DEFAULT '#94A3B8',
  	"grey_dark" varchar DEFAULT '#64748B',
  	"text" varchar DEFAULT '#1E293B',
  	"font_body" varchar DEFAULT '''Plus Jakarta Sans'', ''DM Sans'', system-ui, sans-serif',
  	"font_display" varchar DEFAULT '''DM Serif Display'', Georgia, serif',
  	"font_mono" varchar DEFAULT '''JetBrains Mono'', ''Courier New'', monospace',
  	"hero_size" numeric DEFAULT 36,
  	"section_size" numeric DEFAULT 24,
  	"card_title_size" numeric DEFAULT 18,
  	"body_lg_size" numeric DEFAULT 15,
  	"body_size" numeric DEFAULT 13,
  	"small_size" numeric DEFAULT 12,
  	"label_size" numeric DEFAULT 10,
  	"micro_size" numeric DEFAULT 8,
  	"sp1" numeric DEFAULT 4 NOT NULL,
  	"sp2" numeric DEFAULT 8 NOT NULL,
  	"sp3" numeric DEFAULT 12 NOT NULL,
  	"sp4" numeric DEFAULT 16 NOT NULL,
  	"sp6" numeric DEFAULT 24 NOT NULL,
  	"sp8" numeric DEFAULT 32 NOT NULL,
  	"sp12" numeric DEFAULT 48 NOT NULL,
  	"sp16" numeric DEFAULT 64 NOT NULL,
  	"sp20" numeric DEFAULT 80 NOT NULL,
  	"primary_gradient" varchar DEFAULT 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)',
  	"secondary_gradient" varchar DEFAULT 'linear-gradient(135deg, #0A1628 0%, #1B2B45 100%)',
  	"hero_gradient" varchar DEFAULT 'linear-gradient(135deg, rgba(0,137,123,0.08) 0%, rgba(38,166,154,0.12) 100%)',
  	"accent_gradient" varchar DEFAULT 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
  	"radius_sm" numeric DEFAULT 8 NOT NULL,
  	"radius_md" numeric DEFAULT 12 NOT NULL,
  	"radius_lg" numeric DEFAULT 16 NOT NULL,
  	"radius_xl" numeric DEFAULT 20 NOT NULL,
  	"radius_full" numeric DEFAULT 9999 NOT NULL,
  	"shadow_sm" varchar DEFAULT '0 1px 3px rgba(10, 22, 40, 0.06)' NOT NULL,
  	"shadow_md" varchar DEFAULT '0 4px 20px rgba(10, 22, 40, 0.08)' NOT NULL,
  	"shadow_lg" varchar DEFAULT '0 8px 40px rgba(10, 22, 40, 0.12)' NOT NULL,
  	"shadow_xl" varchar DEFAULT '0 20px 60px rgba(10, 22, 40, 0.16)' NOT NULL,
  	"z_dropdown" numeric DEFAULT 100 NOT NULL,
  	"z_sticky" numeric DEFAULT 200 NOT NULL,
  	"z_overlay" numeric DEFAULT 300 NOT NULL,
  	"z_modal" numeric DEFAULT 400 NOT NULL,
  	"z_toast" numeric DEFAULT 500 NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "header_top_bar_left_messages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_header_top_bar_left_messages_icon",
  	"text" varchar,
  	"link" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "header_top_bar_right_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "header_custom_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"icon" "enum_header_custom_buttons_icon",
  	"style" "enum_header_custom_buttons_style" DEFAULT 'default'
  );
  
  CREATE TABLE IF NOT EXISTS "header_navigation_special_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" "enum_header_navigation_special_items_icon",
  	"url" varchar NOT NULL,
  	"highlight" boolean DEFAULT false,
  	"position" "enum_header_navigation_special_items_position" DEFAULT 'end'
  );
  
  CREATE TABLE IF NOT EXISTS "header_navigation_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "header_navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum_header_navigation_items_icon",
  	"type" "enum_header_navigation_items_type" DEFAULT 'page',
  	"page_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"top_bar_enabled" boolean DEFAULT true,
  	"top_bar_background_color" varchar DEFAULT '#0A1628',
  	"top_bar_text_color" varchar DEFAULT '#FFFFFF',
  	"alert_bar_enabled" boolean DEFAULT false,
  	"alert_bar_message" varchar,
  	"alert_bar_type" "enum_header_alert_bar_type" DEFAULT 'info',
  	"alert_bar_icon" "enum_header_alert_bar_icon",
  	"alert_bar_link_enabled" boolean DEFAULT false,
  	"alert_bar_link_label" varchar,
  	"alert_bar_link_url" varchar,
  	"alert_bar_dismissible" boolean DEFAULT true,
  	"alert_bar_schedule_use_schedule" boolean DEFAULT false,
  	"alert_bar_schedule_start_date" timestamp(3) with time zone,
  	"alert_bar_schedule_end_date" timestamp(3) with time zone,
  	"alert_bar_custom_colors_use_custom_colors" boolean DEFAULT false,
  	"alert_bar_custom_colors_background_color" varchar,
  	"alert_bar_custom_colors_text_color" varchar,
  	"logo_override_id" integer,
  	"site_name_override" varchar,
  	"site_name_accent" varchar,
  	"enable_search" boolean DEFAULT true,
  	"search_placeholder" varchar DEFAULT 'Zoek producten...',
  	"show_phone" boolean DEFAULT true,
  	"show_wishlist" boolean DEFAULT false,
  	"show_account" boolean DEFAULT true,
  	"show_cart" boolean DEFAULT true,
  	"navigation_mode" "enum_header_navigation_mode" DEFAULT 'manual' NOT NULL,
  	"navigation_category_settings_show_icons" boolean DEFAULT true,
  	"navigation_category_settings_show_product_count" boolean DEFAULT true,
  	"navigation_category_settings_mega_menu_style" "enum_header_navigation_category_settings_mega_menu_style" DEFAULT 'subcategories',
  	"navigation_category_settings_max_items" numeric DEFAULT 10,
  	"navigation_category_settings_max_products_in_mega_menu" numeric DEFAULT 3,
  	"navigation_cta_button_text" varchar DEFAULT 'Contact',
  	"navigation_cta_button_link" varchar DEFAULT '/contact',
  	"navigation_cta_button_show" boolean DEFAULT true,
  	"sticky_header" boolean DEFAULT true,
  	"show_shadow" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_footer_columns_links_type" DEFAULT 'page',
  	"page_id" integer,
  	"external_url" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"bottom_text" jsonb,
  	"show_social_links" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "meilisearch_settings_indexed_collections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"collection" "enum_meilisearch_settings_indexed_collections_collection" NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"priority" numeric DEFAULT 1,
  	"index_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "meilisearch_settings_searchable_fields_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" "enum_meilisearch_settings_searchable_fields_products_field" NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "meilisearch_settings_searchable_fields_blog_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" "enum_meilisearch_settings_searchable_fields_blog_posts_field" NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "meilisearch_settings_searchable_fields_pages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" "enum_meilisearch_settings_searchable_fields_pages_field" NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "meilisearch_settings_filterable_fields_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" "enum_meilisearch_settings_filterable_fields_products_field" NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "meilisearch_settings_filterable_fields_blog_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" "enum_meilisearch_settings_filterable_fields_blog_posts_field" NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "meilisearch_settings_sortable_fields_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" "enum_meilisearch_settings_sortable_fields_products_field" NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "meilisearch_settings_sortable_fields_blog_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" "enum_meilisearch_settings_sortable_fields_blog_posts_field" NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "meilisearch_settings_ranking_rules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rule" "enum_meilisearch_settings_ranking_rules_rule" NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "meilisearch_settings_custom_ranking_attributes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"attribute" varchar NOT NULL,
  	"order" "enum_meilisearch_settings_custom_ranking_attributes_order" DEFAULT 'desc' NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "meilisearch_settings_typo_tolerance_disable_on_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"word" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "meilisearch_settings_synonyms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"group" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "meilisearch_settings_stop_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"word" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "meilisearch_settings_exclude_patterns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pattern" varchar NOT NULL,
  	"type" "enum_meilisearch_settings_exclude_patterns_type" DEFAULT 'url' NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "meilisearch_settings_exclude_statuses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"status" "enum_meilisearch_settings_exclude_statuses_status" NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "meilisearch_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"typo_tolerance_enabled" boolean DEFAULT true,
  	"typo_tolerance_min_word_size_for_one_typo" numeric DEFAULT 4,
  	"typo_tolerance_min_word_size_for_two_typos" numeric DEFAULT 8,
  	"auto_indexing_enabled" boolean DEFAULT true,
  	"auto_indexing_index_on_publish" boolean DEFAULT true,
  	"auto_indexing_batch_size" numeric DEFAULT 100,
  	"auto_indexing_debounce_ms" numeric DEFAULT 1000,
  	"pagination_max_total_hits" numeric DEFAULT 1000,
  	"pagination_default_limit" numeric DEFAULT 20,
  	"pagination_max_limit" numeric DEFAULT 100,
  	"performance_enable_highlighting" boolean DEFAULT true,
  	"performance_highlight_pre_tag" varchar DEFAULT '<mark>',
  	"performance_highlight_post_tag" varchar DEFAULT '</mark>',
  	"performance_crop_length" numeric DEFAULT 200,
  	"performance_crop_marker" varchar DEFAULT '...',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "chatbot_settings_suggested_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "chatbot_settings_rate_limiting_blocked_i_ps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ip" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "chatbot_settings_moderation_blocked_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "chatbot_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"model" "enum_chatbot_settings_model" DEFAULT 'groq' NOT NULL,
  	"temperature" numeric DEFAULT 0.7,
  	"max_tokens" numeric DEFAULT 500,
  	"context_window" numeric DEFAULT 5,
  	"position" "enum_chatbot_settings_position" DEFAULT 'bottom-right' NOT NULL,
  	"button_color" varchar DEFAULT '#0ea5e9',
  	"button_icon" "enum_chatbot_settings_button_icon" DEFAULT 'chat',
  	"welcome_message" varchar DEFAULT 'Hallo! Hoe kan ik je helpen?',
  	"placeholder" varchar DEFAULT 'Typ je vraag...',
  	"system_prompt" varchar,
  	"knowledge_base_integration_enabled" boolean DEFAULT true,
  	"knowledge_base_integration_max_results" numeric DEFAULT 3,
  	"knowledge_base_integration_include_source_links" boolean DEFAULT true,
  	"training_context" varchar,
  	"rate_limiting_enabled" boolean DEFAULT true,
  	"rate_limiting_max_messages_per_hour" numeric DEFAULT 20,
  	"rate_limiting_max_messages_per_day" numeric DEFAULT 50,
  	"rate_limiting_cooldown_seconds" numeric DEFAULT 3,
  	"moderation_enabled" boolean DEFAULT true,
  	"api_configuration_groq_api_key" varchar,
  	"api_configuration_openai_api_key" varchar,
  	"api_configuration_ollama_url" varchar,
  	"analytics_enable_logging" boolean DEFAULT true,
  	"analytics_enable_analytics" boolean DEFAULT true,
  	"analytics_retention_days" numeric DEFAULT 30,
  	"fallback_enable_fallback" boolean DEFAULT true,
  	"fallback_fallback_message" varchar DEFAULT 'Sorry, ik kan momenteel geen antwoord geven. Neem contact op via info@bedrijf.nl of bel 020-1234567.',
  	"fallback_contact_email" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  DO $$ BEGIN ALTER TABLE "users_addresses" ADD CONSTRAINT "users_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "users_favorites" ADD CONSTRAINT "users_favorites_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "users_favorites" ADD CONSTRAINT "users_favorites_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_banner" ADD CONSTRAINT "pages_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_spacer" ADD CONSTRAINT "pages_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_hero_buttons" ADD CONSTRAINT "pages_blocks_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_media_block_buttons" ADD CONSTRAINT "pages_blocks_media_block_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_two_column" ADD CONSTRAINT "pages_blocks_two_column_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_product_grid" ADD CONSTRAINT "pages_blocks_product_grid_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_product_grid" ADD CONSTRAINT "pages_blocks_product_grid_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_product_grid" ADD CONSTRAINT "pages_blocks_product_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_category_grid" ADD CONSTRAINT "pages_blocks_category_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_quick_order" ADD CONSTRAINT "pages_blocks_quick_order_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_cta_buttons" ADD CONSTRAINT "pages_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_calltoaction" ADD CONSTRAINT "pages_blocks_calltoaction_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_contact_opening_hours" ADD CONSTRAINT "pages_blocks_contact_opening_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_contact" ADD CONSTRAINT "pages_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_newsletter" ADD CONSTRAINT "pages_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_features_features" ADD CONSTRAINT "pages_blocks_features_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_features" ADD CONSTRAINT "pages_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_services_services" ADD CONSTRAINT "pages_blocks_services_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_services" ADD CONSTRAINT "pages_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_testimonials_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_testimonials_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_cases" ADD CONSTRAINT "pages_blocks_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_logo_bar_logos" ADD CONSTRAINT "pages_blocks_logo_bar_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_logo_bar_logos" ADD CONSTRAINT "pages_blocks_logo_bar_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_bar"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_logo_bar" ADD CONSTRAINT "pages_blocks_logo_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_stats_stats" ADD CONSTRAINT "pages_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_faq_faqs" ADD CONSTRAINT "pages_blocks_faq_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_team_members" ADD CONSTRAINT "pages_blocks_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_team_members" ADD CONSTRAINT "pages_blocks_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_team" ADD CONSTRAINT "pages_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_accordion_items" ADD CONSTRAINT "pages_blocks_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_accordion" ADD CONSTRAINT "pages_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_blog_preview" ADD CONSTRAINT "pages_blocks_blog_preview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_comparison_columns" ADD CONSTRAINT "pages_blocks_comparison_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_comparison_rows_values" ADD CONSTRAINT "pages_blocks_comparison_rows_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_comparison_rows"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_comparison_rows" ADD CONSTRAINT "pages_blocks_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_comparison" ADD CONSTRAINT "pages_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_infobox" ADD CONSTRAINT "pages_blocks_infobox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_image_gallery_images" ADD CONSTRAINT "pages_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_image_gallery_images" ADD CONSTRAINT "pages_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_image_gallery" ADD CONSTRAINT "pages_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_code" ADD CONSTRAINT "pages_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_map" ADD CONSTRAINT "pages_blocks_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_construction_hero_avatars" ADD CONSTRAINT "pages_blocks_construction_hero_avatars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_construction_hero"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_construction_hero_floating_badges" ADD CONSTRAINT "pages_blocks_construction_hero_floating_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_construction_hero"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_construction_hero" ADD CONSTRAINT "pages_blocks_construction_hero_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_construction_hero" ADD CONSTRAINT "pages_blocks_construction_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_services_grid" ADD CONSTRAINT "pages_blocks_services_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_projects_grid" ADD CONSTRAINT "pages_blocks_projects_grid_category_id_construction_services_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."construction_services"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_projects_grid" ADD CONSTRAINT "pages_blocks_projects_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_reviews_grid" ADD CONSTRAINT "pages_blocks_reviews_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_stats_bar_stats" ADD CONSTRAINT "pages_blocks_stats_bar_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_bar"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_stats_bar" ADD CONSTRAINT "pages_blocks_stats_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_cta_banner_buttons" ADD CONSTRAINT "pages_blocks_cta_banner_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_cta_banner_trust_elements_items" ADD CONSTRAINT "pages_blocks_cta_banner_trust_elements_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_cta_banner" ADD CONSTRAINT "pages_blocks_cta_banner_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_cta_banner" ADD CONSTRAINT "pages_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_construction_services_fk" FOREIGN KEY ("construction_services_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_construction_projects_fk" FOREIGN KEY ("construction_projects_id") REFERENCES "public"."construction_projects"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_construction_reviews_fk" FOREIGN KEY ("construction_reviews_id") REFERENCES "public"."construction_reviews"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_banner" ADD CONSTRAINT "_pages_v_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_spacer" ADD CONSTRAINT "_pages_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_hero_buttons" ADD CONSTRAINT "_pages_v_blocks_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_media_block_buttons" ADD CONSTRAINT "_pages_v_blocks_media_block_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_media_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_two_column" ADD CONSTRAINT "_pages_v_blocks_two_column_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_product_grid" ADD CONSTRAINT "_pages_v_blocks_product_grid_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_product_grid" ADD CONSTRAINT "_pages_v_blocks_product_grid_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_product_grid" ADD CONSTRAINT "_pages_v_blocks_product_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_category_grid" ADD CONSTRAINT "_pages_v_blocks_category_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_quick_order" ADD CONSTRAINT "_pages_v_blocks_quick_order_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_cta_buttons" ADD CONSTRAINT "_pages_v_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_calltoaction" ADD CONSTRAINT "_pages_v_blocks_calltoaction_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_contact_opening_hours" ADD CONSTRAINT "_pages_v_blocks_contact_opening_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_contact" ADD CONSTRAINT "_pages_v_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_contact_form" ADD CONSTRAINT "_pages_v_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_newsletter" ADD CONSTRAINT "_pages_v_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_features_features" ADD CONSTRAINT "_pages_v_blocks_features_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_features" ADD CONSTRAINT "_pages_v_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_services_services" ADD CONSTRAINT "_pages_v_blocks_services_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_services" ADD CONSTRAINT "_pages_v_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_testimonials_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_testimonials_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_cases" ADD CONSTRAINT "_pages_v_blocks_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_logo_bar_logos" ADD CONSTRAINT "_pages_v_blocks_logo_bar_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_logo_bar_logos" ADD CONSTRAINT "_pages_v_blocks_logo_bar_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_bar"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_logo_bar" ADD CONSTRAINT "_pages_v_blocks_logo_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_stats_stats" ADD CONSTRAINT "_pages_v_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_faq_faqs" ADD CONSTRAINT "_pages_v_blocks_faq_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_team_members" ADD CONSTRAINT "_pages_v_blocks_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_team_members" ADD CONSTRAINT "_pages_v_blocks_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_team" ADD CONSTRAINT "_pages_v_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_accordion_items" ADD CONSTRAINT "_pages_v_blocks_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_accordion" ADD CONSTRAINT "_pages_v_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_blog_preview" ADD CONSTRAINT "_pages_v_blocks_blog_preview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_comparison_columns" ADD CONSTRAINT "_pages_v_blocks_comparison_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_comparison_rows_values" ADD CONSTRAINT "_pages_v_blocks_comparison_rows_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_comparison_rows"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_comparison_rows" ADD CONSTRAINT "_pages_v_blocks_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_comparison" ADD CONSTRAINT "_pages_v_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_infobox" ADD CONSTRAINT "_pages_v_blocks_infobox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_image_gallery_images" ADD CONSTRAINT "_pages_v_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_image_gallery_images" ADD CONSTRAINT "_pages_v_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_image_gallery" ADD CONSTRAINT "_pages_v_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_code" ADD CONSTRAINT "_pages_v_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_map" ADD CONSTRAINT "_pages_v_blocks_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_construction_hero_avatars" ADD CONSTRAINT "_pages_v_blocks_construction_hero_avatars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_construction_hero"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_construction_hero_floating_badges" ADD CONSTRAINT "_pages_v_blocks_construction_hero_floating_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_construction_hero"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_construction_hero" ADD CONSTRAINT "_pages_v_blocks_construction_hero_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_construction_hero" ADD CONSTRAINT "_pages_v_blocks_construction_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_services_grid" ADD CONSTRAINT "_pages_v_blocks_services_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_projects_grid" ADD CONSTRAINT "_pages_v_blocks_projects_grid_category_id_construction_services_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."construction_services"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_projects_grid" ADD CONSTRAINT "_pages_v_blocks_projects_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_reviews_grid" ADD CONSTRAINT "_pages_v_blocks_reviews_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_stats_bar_stats" ADD CONSTRAINT "_pages_v_blocks_stats_bar_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_bar"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_stats_bar" ADD CONSTRAINT "_pages_v_blocks_stats_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_cta_banner_buttons" ADD CONSTRAINT "_pages_v_blocks_cta_banner_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_cta_banner_trust_elements_items" ADD CONSTRAINT "_pages_v_blocks_cta_banner_trust_elements_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_cta_banner" ADD CONSTRAINT "_pages_v_blocks_cta_banner_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_cta_banner" ADD CONSTRAINT "_pages_v_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_construction_services_fk" FOREIGN KEY ("construction_services_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_construction_projects_fk" FOREIGN KEY ("construction_projects_id") REFERENCES "public"."construction_projects"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_construction_reviews_fk" FOREIGN KEY ("construction_reviews_id") REFERENCES "public"."construction_reviews"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "services" ADD CONSTRAINT "services_icon_upload_id_media_id_fk" FOREIGN KEY ("icon_upload_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_order_id_orders_id_fk" FOREIGN KEY ("related_order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_product_id_products_id_fk" FOREIGN KEY ("related_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "themes_custom_colors" ADD CONSTRAINT "themes_custom_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "products_tags" ADD CONSTRAINT "products_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "products_videos" ADD CONSTRAINT "products_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "products_child_products" ADD CONSTRAINT "products_child_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "products_child_products" ADD CONSTRAINT "products_child_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "products_meta_keywords" ADD CONSTRAINT "products_meta_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "products_specifications_attributes" ADD CONSTRAINT "products_specifications_attributes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_specifications"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "products_specifications" ADD CONSTRAINT "products_specifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "products_variant_options_values" ADD CONSTRAINT "products_variant_options_values_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "products_variant_options_values" ADD CONSTRAINT "products_variant_options_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_variant_options"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "products_variant_options" ADD CONSTRAINT "products_variant_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "products" ADD CONSTRAINT "products_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_parent_id_product_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_promo_banner_image_id_media_id_fk" FOREIGN KEY ("promo_banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "brands" ADD CONSTRAINT "brands_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "brands" ADD CONSTRAINT "brands_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "recently_viewed" ADD CONSTRAINT "recently_viewed_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "recently_viewed" ADD CONSTRAINT "recently_viewed_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "edition_notifications" ADD CONSTRAINT "edition_notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "edition_notifications" ADD CONSTRAINT "edition_notifications_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "orders_timeline" ADD CONSTRAINT "orders_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "order_lists_items" ADD CONSTRAINT "order_lists_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "order_lists_items" ADD CONSTRAINT "order_lists_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."order_lists"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "order_lists_share_with" ADD CONSTRAINT "order_lists_share_with_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "order_lists_share_with" ADD CONSTRAINT "order_lists_share_with_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."order_lists"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "order_lists" ADD CONSTRAINT "order_lists_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "recurring_orders_items" ADD CONSTRAINT "recurring_orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "recurring_orders_items" ADD CONSTRAINT "recurring_orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."recurring_orders"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "recurring_orders" ADD CONSTRAINT "recurring_orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "recurring_orders_rels" ADD CONSTRAINT "recurring_orders_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."recurring_orders"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "recurring_orders_rels" ADD CONSTRAINT "recurring_orders_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "invoices_items" ADD CONSTRAINT "invoices_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "invoices" ADD CONSTRAINT "invoices_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "invoices" ADD CONSTRAINT "invoices_pdf_file_id_media_id_fk" FOREIGN KEY ("pdf_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "returns_items" ADD CONSTRAINT "returns_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "returns_items" ADD CONSTRAINT "returns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."returns"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "returns" ADD CONSTRAINT "returns_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "returns" ADD CONSTRAINT "returns_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "returns" ADD CONSTRAINT "returns_replacement_order_id_orders_id_fk" FOREIGN KEY ("replacement_order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "returns_rels" ADD CONSTRAINT "returns_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."returns"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "returns_rels" ADD CONSTRAINT "returns_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "subscription_plans_features" ADD CONSTRAINT "subscription_plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."subscription_plans"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "user_subscriptions_addons" ADD CONSTRAINT "user_subscriptions_addons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."user_subscriptions"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "gift_vouchers" ADD CONSTRAINT "gift_vouchers_purchased_by_id_users_id_fk" FOREIGN KEY ("purchased_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "gift_vouchers" ADD CONSTRAINT "gift_vouchers_redeemed_by_id_users_id_fk" FOREIGN KEY ("redeemed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "licenses_downloads" ADD CONSTRAINT "licenses_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."licenses"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "licenses" ADD CONSTRAINT "licenses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "licenses" ADD CONSTRAINT "licenses_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "licenses" ADD CONSTRAINT "licenses_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "license_activations" ADD CONSTRAINT "license_activations_license_id_licenses_id_fk" FOREIGN KEY ("license_id") REFERENCES "public"."licenses"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "loyalty_tiers_benefits" ADD CONSTRAINT "loyalty_tiers_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."loyalty_tiers"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "loyalty_rewards" ADD CONSTRAINT "loyalty_rewards_tier_required_id_loyalty_tiers_id_fk" FOREIGN KEY ("tier_required_id") REFERENCES "public"."loyalty_tiers"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "loyalty_points" ADD CONSTRAINT "loyalty_points_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "loyalty_points" ADD CONSTRAINT "loyalty_points_tier_id_loyalty_tiers_id_fk" FOREIGN KEY ("tier_id") REFERENCES "public"."loyalty_tiers"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_related_order_id_orders_id_fk" FOREIGN KEY ("related_order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_related_reward_id_loyalty_rewards_id_fk" FOREIGN KEY ("related_reward_id") REFERENCES "public"."loyalty_rewards"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "loyalty_redemptions" ADD CONSTRAINT "loyalty_redemptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "loyalty_redemptions" ADD CONSTRAINT "loyalty_redemptions_reward_id_loyalty_rewards_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."loyalty_rewards"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "loyalty_redemptions" ADD CONSTRAINT "loyalty_redemptions_used_in_order_id_orders_id_fk" FOREIGN KEY ("used_in_order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "ab_tests_variants" ADD CONSTRAINT "ab_tests_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ab_tests"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "ab_test_results" ADD CONSTRAINT "ab_test_results_test_id_ab_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."ab_tests"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "ab_test_results" ADD CONSTRAINT "ab_test_results_user_id_id_users_id_fk" FOREIGN KEY ("user_id_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "ab_test_results" ADD CONSTRAINT "ab_test_results_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "blog_posts_tags" ADD CONSTRAINT "blog_posts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "blog_posts_faq" ADD CONSTRAINT "blog_posts_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_blog_posts_v_version_tags" ADD CONSTRAINT "_blog_posts_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_blog_posts_v_version_faq" ADD CONSTRAINT "_blog_posts_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_parent_id_blog_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_blog_posts_v_rels" ADD CONSTRAINT "_blog_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_blog_posts_v_rels" ADD CONSTRAINT "_blog_posts_v_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_blog_posts_v_rels" ADD CONSTRAINT "_blog_posts_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_blog_posts_v_rels" ADD CONSTRAINT "_blog_posts_v_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "blog_categories" ADD CONSTRAINT "blog_categories_parent_id_blog_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_categories"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "blog_categories" ADD CONSTRAINT "blog_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "cases_services" ADD CONSTRAINT "cases_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "cases_gallery" ADD CONSTRAINT "cases_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "cases_gallery" ADD CONSTRAINT "cases_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "cases" ADD CONSTRAINT "cases_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "cases" ADD CONSTRAINT "cases_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "vendors_certifications" ADD CONSTRAINT "vendors_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "vendors" ADD CONSTRAINT "vendors_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "vendors" ADD CONSTRAINT "vendors_banner_id_media_id_fk" FOREIGN KEY ("banner_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "vendors" ADD CONSTRAINT "vendors_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "vendors_rels" ADD CONSTRAINT "vendors_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "vendors_rels" ADD CONSTRAINT "vendors_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "vendors_rels" ADD CONSTRAINT "vendors_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "vendor_reviews" ADD CONSTRAINT "vendor_reviews_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "workshops_target_audience" ADD CONSTRAINT "workshops_target_audience_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."workshops"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "workshops_learning_objectives" ADD CONSTRAINT "workshops_learning_objectives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."workshops"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "workshops" ADD CONSTRAINT "workshops_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "workshops" ADD CONSTRAINT "workshops_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "workshops" ADD CONSTRAINT "workshops_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "construction_services_features" ADD CONSTRAINT "construction_services_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "construction_services_process_steps" ADD CONSTRAINT "construction_services_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "construction_services_service_types" ADD CONSTRAINT "construction_services_service_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "construction_services_usps" ADD CONSTRAINT "construction_services_usps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "construction_services_faq" ADD CONSTRAINT "construction_services_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "construction_services" ADD CONSTRAINT "construction_services_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "construction_services_rels" ADD CONSTRAINT "construction_services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "construction_services_rels" ADD CONSTRAINT "construction_services_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "construction_projects_badges" ADD CONSTRAINT "construction_projects_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."construction_projects"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "construction_projects" ADD CONSTRAINT "construction_projects_category_id_construction_services_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."construction_services"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "construction_projects" ADD CONSTRAINT "construction_projects_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "construction_projects" ADD CONSTRAINT "construction_projects_before_after_before_id_media_id_fk" FOREIGN KEY ("before_after_before_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "construction_projects" ADD CONSTRAINT "construction_projects_before_after_after_id_media_id_fk" FOREIGN KEY ("before_after_after_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "construction_projects_rels" ADD CONSTRAINT "construction_projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."construction_projects"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "construction_projects_rels" ADD CONSTRAINT "construction_projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "construction_reviews" ADD CONSTRAINT "construction_reviews_project_id_construction_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."construction_projects"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "construction_reviews" ADD CONSTRAINT "construction_reviews_service_id_construction_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."construction_services"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "quote_requests_rels" ADD CONSTRAINT "quote_requests_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quote_requests"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "quote_requests_rels" ADD CONSTRAINT "quote_requests_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "treatments_symptoms" ADD CONSTRAINT "treatments_symptoms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "treatments_process" ADD CONSTRAINT "treatments_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "treatments_gallery" ADD CONSTRAINT "treatments_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "treatments_gallery" ADD CONSTRAINT "treatments_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "treatments" ADD CONSTRAINT "treatments_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "treatments_rels" ADD CONSTRAINT "treatments_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "treatments_rels" ADD CONSTRAINT "treatments_rels_treatments_fk" FOREIGN KEY ("treatments_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "treatments_rels" ADD CONSTRAINT "treatments_rels_practitioners_fk" FOREIGN KEY ("practitioners_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_treatments_v_version_symptoms" ADD CONSTRAINT "_treatments_v_version_symptoms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_treatments_v_version_process" ADD CONSTRAINT "_treatments_v_version_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_treatments_v_version_gallery" ADD CONSTRAINT "_treatments_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_treatments_v_version_gallery" ADD CONSTRAINT "_treatments_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_treatments_v" ADD CONSTRAINT "_treatments_v_parent_id_treatments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."treatments"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_treatments_v" ADD CONSTRAINT "_treatments_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_treatments_v_rels" ADD CONSTRAINT "_treatments_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_treatments_v_rels" ADD CONSTRAINT "_treatments_v_rels_treatments_fk" FOREIGN KEY ("treatments_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_treatments_v_rels" ADD CONSTRAINT "_treatments_v_rels_practitioners_fk" FOREIGN KEY ("practitioners_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "practitioners_specializations" ADD CONSTRAINT "practitioners_specializations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "practitioners_qualifications" ADD CONSTRAINT "practitioners_qualifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "practitioners_work_days" ADD CONSTRAINT "practitioners_work_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "practitioners" ADD CONSTRAINT "practitioners_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "practitioners_rels" ADD CONSTRAINT "practitioners_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "practitioners_rels" ADD CONSTRAINT "practitioners_rels_treatments_fk" FOREIGN KEY ("treatments_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_practitioners_v_version_specializations" ADD CONSTRAINT "_practitioners_v_version_specializations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_practitioners_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_practitioners_v_version_qualifications" ADD CONSTRAINT "_practitioners_v_version_qualifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_practitioners_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_practitioners_v_version_work_days" ADD CONSTRAINT "_practitioners_v_version_work_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_practitioners_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_practitioners_v" ADD CONSTRAINT "_practitioners_v_parent_id_practitioners_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."practitioners"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_practitioners_v" ADD CONSTRAINT "_practitioners_v_version_avatar_id_media_id_fk" FOREIGN KEY ("version_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_practitioners_v_rels" ADD CONSTRAINT "_practitioners_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_practitioners_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_practitioners_v_rels" ADD CONSTRAINT "_practitioners_v_rels_treatments_fk" FOREIGN KEY ("treatments_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "appointments_preferred_time" ADD CONSTRAINT "appointments_preferred_time_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "beauty_services_benefits" ADD CONSTRAINT "beauty_services_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "beauty_services_process" ADD CONSTRAINT "beauty_services_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "beauty_services_tags" ADD CONSTRAINT "beauty_services_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "beauty_services_gallery" ADD CONSTRAINT "beauty_services_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "beauty_services_gallery" ADD CONSTRAINT "beauty_services_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "beauty_services" ADD CONSTRAINT "beauty_services_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "beauty_services_rels" ADD CONSTRAINT "beauty_services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "beauty_services_rels" ADD CONSTRAINT "beauty_services_rels_beauty_services_fk" FOREIGN KEY ("beauty_services_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "beauty_services_rels" ADD CONSTRAINT "beauty_services_rels_stylists_fk" FOREIGN KEY ("stylists_id") REFERENCES "public"."stylists"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_beauty_services_v_version_benefits" ADD CONSTRAINT "_beauty_services_v_version_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_beauty_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_beauty_services_v_version_process" ADD CONSTRAINT "_beauty_services_v_version_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_beauty_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_beauty_services_v_version_tags" ADD CONSTRAINT "_beauty_services_v_version_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_beauty_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_beauty_services_v_version_gallery" ADD CONSTRAINT "_beauty_services_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_beauty_services_v_version_gallery" ADD CONSTRAINT "_beauty_services_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_beauty_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_beauty_services_v" ADD CONSTRAINT "_beauty_services_v_parent_id_beauty_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."beauty_services"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_beauty_services_v" ADD CONSTRAINT "_beauty_services_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_beauty_services_v_rels" ADD CONSTRAINT "_beauty_services_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_beauty_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_beauty_services_v_rels" ADD CONSTRAINT "_beauty_services_v_rels_beauty_services_fk" FOREIGN KEY ("beauty_services_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_beauty_services_v_rels" ADD CONSTRAINT "_beauty_services_v_rels_stylists_fk" FOREIGN KEY ("stylists_id") REFERENCES "public"."stylists"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "stylists_specialties" ADD CONSTRAINT "stylists_specialties_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stylists"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "stylists_certifications" ADD CONSTRAINT "stylists_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stylists"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "stylists_work_days" ADD CONSTRAINT "stylists_work_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stylists"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "stylists_portfolio" ADD CONSTRAINT "stylists_portfolio_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "stylists_portfolio" ADD CONSTRAINT "stylists_portfolio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stylists"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "stylists" ADD CONSTRAINT "stylists_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "stylists_rels" ADD CONSTRAINT "stylists_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stylists"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "stylists_rels" ADD CONSTRAINT "stylists_rels_beauty_services_fk" FOREIGN KEY ("beauty_services_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_stylists_v_version_specialties" ADD CONSTRAINT "_stylists_v_version_specialties_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stylists_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_stylists_v_version_certifications" ADD CONSTRAINT "_stylists_v_version_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stylists_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_stylists_v_version_work_days" ADD CONSTRAINT "_stylists_v_version_work_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_stylists_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_stylists_v_version_portfolio" ADD CONSTRAINT "_stylists_v_version_portfolio_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_stylists_v_version_portfolio" ADD CONSTRAINT "_stylists_v_version_portfolio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stylists_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_stylists_v" ADD CONSTRAINT "_stylists_v_parent_id_stylists_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stylists"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_stylists_v" ADD CONSTRAINT "_stylists_v_version_avatar_id_media_id_fk" FOREIGN KEY ("version_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_stylists_v_rels" ADD CONSTRAINT "_stylists_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_stylists_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_stylists_v_rels" ADD CONSTRAINT "_stylists_v_rels_beauty_services_fk" FOREIGN KEY ("beauty_services_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "beauty_bookings_preferred_time_slots" ADD CONSTRAINT "beauty_bookings_preferred_time_slots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."beauty_bookings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "beauty_bookings" ADD CONSTRAINT "beauty_bookings_service_id_beauty_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."beauty_services"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "beauty_bookings" ADD CONSTRAINT "beauty_bookings_stylist_id_stylists_id_fk" FOREIGN KEY ("stylist_id") REFERENCES "public"."stylists"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "menu_items_allergens" ADD CONSTRAINT "menu_items_allergens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_menu_items_v_version_allergens" ADD CONSTRAINT "_menu_items_v_version_allergens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_items_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_menu_items_v" ADD CONSTRAINT "_menu_items_v_parent_id_menu_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."menu_items"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_menu_items_v" ADD CONSTRAINT "_menu_items_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "reservations_preferences" ADD CONSTRAINT "reservations_preferences_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reservations"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "events_gallery" ADD CONSTRAINT "events_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "events_gallery" ADD CONSTRAINT "events_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "events_tags" ADD CONSTRAINT "events_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_events_v_version_gallery" ADD CONSTRAINT "_events_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_events_v_version_gallery" ADD CONSTRAINT "_events_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_events_v_version_tags" ADD CONSTRAINT "_events_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "client_requests_website_pages" ADD CONSTRAINT "client_requests_website_pages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."client_requests"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "client_requests_payment_methods" ADD CONSTRAINT "client_requests_payment_methods_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."client_requests"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "client_requests" ADD CONSTRAINT "client_requests_created_user_id_users_id_fk" FOREIGN KEY ("created_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "client_requests" ADD CONSTRAINT "client_requests_created_client_id_clients_id_fk" FOREIGN KEY ("created_client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "deployments" ADD CONSTRAINT "deployments_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notifications_fk" FOREIGN KEY ("notifications_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_themes_fk" FOREIGN KEY ("themes_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_recently_viewed_fk" FOREIGN KEY ("recently_viewed_id") REFERENCES "public"."recently_viewed"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_edition_notifications_fk" FOREIGN KEY ("edition_notifications_id") REFERENCES "public"."edition_notifications"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customer_groups_fk" FOREIGN KEY ("customer_groups_id") REFERENCES "public"."customer_groups"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_order_lists_fk" FOREIGN KEY ("order_lists_id") REFERENCES "public"."order_lists"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_recurring_orders_fk" FOREIGN KEY ("recurring_orders_id") REFERENCES "public"."recurring_orders"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_invoices_fk" FOREIGN KEY ("invoices_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_returns_fk" FOREIGN KEY ("returns_id") REFERENCES "public"."returns"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscription_plans_fk" FOREIGN KEY ("subscription_plans_id") REFERENCES "public"."subscription_plans"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_user_subscriptions_fk" FOREIGN KEY ("user_subscriptions_id") REFERENCES "public"."user_subscriptions"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payment_methods_fk" FOREIGN KEY ("payment_methods_id") REFERENCES "public"."payment_methods"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gift_vouchers_fk" FOREIGN KEY ("gift_vouchers_id") REFERENCES "public"."gift_vouchers"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_licenses_fk" FOREIGN KEY ("licenses_id") REFERENCES "public"."licenses"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_license_activations_fk" FOREIGN KEY ("license_activations_id") REFERENCES "public"."license_activations"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_loyalty_tiers_fk" FOREIGN KEY ("loyalty_tiers_id") REFERENCES "public"."loyalty_tiers"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_loyalty_rewards_fk" FOREIGN KEY ("loyalty_rewards_id") REFERENCES "public"."loyalty_rewards"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_loyalty_points_fk" FOREIGN KEY ("loyalty_points_id") REFERENCES "public"."loyalty_points"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_loyalty_transactions_fk" FOREIGN KEY ("loyalty_transactions_id") REFERENCES "public"."loyalty_transactions"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_loyalty_redemptions_fk" FOREIGN KEY ("loyalty_redemptions_id") REFERENCES "public"."loyalty_redemptions"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ab_tests_fk" FOREIGN KEY ("ab_tests_id") REFERENCES "public"."ab_tests"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ab_test_results_fk" FOREIGN KEY ("ab_test_results_id") REFERENCES "public"."ab_test_results"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vendors_fk" FOREIGN KEY ("vendors_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vendor_reviews_fk" FOREIGN KEY ("vendor_reviews_id") REFERENCES "public"."vendor_reviews"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_workshops_fk" FOREIGN KEY ("workshops_id") REFERENCES "public"."workshops"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_construction_services_fk" FOREIGN KEY ("construction_services_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_construction_projects_fk" FOREIGN KEY ("construction_projects_id") REFERENCES "public"."construction_projects"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_construction_reviews_fk" FOREIGN KEY ("construction_reviews_id") REFERENCES "public"."construction_reviews"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quote_requests_fk" FOREIGN KEY ("quote_requests_id") REFERENCES "public"."quote_requests"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_treatments_fk" FOREIGN KEY ("treatments_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_practitioners_fk" FOREIGN KEY ("practitioners_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_appointments_fk" FOREIGN KEY ("appointments_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_beauty_services_fk" FOREIGN KEY ("beauty_services_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stylists_fk" FOREIGN KEY ("stylists_id") REFERENCES "public"."stylists"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_beauty_bookings_fk" FOREIGN KEY ("beauty_bookings_id") REFERENCES "public"."beauty_bookings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menu_items_fk" FOREIGN KEY ("menu_items_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reservations_fk" FOREIGN KEY ("reservations_id") REFERENCES "public"."reservations"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_client_requests_fk" FOREIGN KEY ("client_requests_id") REFERENCES "public"."client_requests"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_deployments_fk" FOREIGN KEY ("deployments_id") REFERENCES "public"."deployments"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "settings_hours" ADD CONSTRAINT "settings_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "settings_sitemap_exclude" ADD CONSTRAINT "settings_sitemap_exclude_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "settings_robots_disallow" ADD CONSTRAINT "settings_robots_disallow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "settings" ADD CONSTRAINT "settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "settings" ADD CONSTRAINT "settings_logo_white_id_media_id_fk" FOREIGN KEY ("logo_white_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "settings" ADD CONSTRAINT "settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "settings" ADD CONSTRAINT "settings_default_o_g_image_id_media_id_fk" FOREIGN KEY ("default_o_g_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "settings_rels" ADD CONSTRAINT "settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "settings_rels" ADD CONSTRAINT "settings_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "header_top_bar_left_messages" ADD CONSTRAINT "header_top_bar_left_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "header_top_bar_right_links" ADD CONSTRAINT "header_top_bar_right_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "header_custom_buttons" ADD CONSTRAINT "header_custom_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "header_navigation_special_items" ADD CONSTRAINT "header_navigation_special_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "header_navigation_items_children" ADD CONSTRAINT "header_navigation_items_children_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "header_navigation_items_children" ADD CONSTRAINT "header_navigation_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_navigation_items"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "header_navigation_items" ADD CONSTRAINT "header_navigation_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "header_navigation_items" ADD CONSTRAINT "header_navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "header" ADD CONSTRAINT "header_logo_override_id_media_id_fk" FOREIGN KEY ("logo_override_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "meilisearch_settings_indexed_collections" ADD CONSTRAINT "meilisearch_settings_indexed_collections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "meilisearch_settings_searchable_fields_products" ADD CONSTRAINT "meilisearch_settings_searchable_fields_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "meilisearch_settings_searchable_fields_blog_posts" ADD CONSTRAINT "meilisearch_settings_searchable_fields_blog_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "meilisearch_settings_searchable_fields_pages" ADD CONSTRAINT "meilisearch_settings_searchable_fields_pages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "meilisearch_settings_filterable_fields_products" ADD CONSTRAINT "meilisearch_settings_filterable_fields_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "meilisearch_settings_filterable_fields_blog_posts" ADD CONSTRAINT "meilisearch_settings_filterable_fields_blog_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "meilisearch_settings_sortable_fields_products" ADD CONSTRAINT "meilisearch_settings_sortable_fields_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "meilisearch_settings_sortable_fields_blog_posts" ADD CONSTRAINT "meilisearch_settings_sortable_fields_blog_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "meilisearch_settings_ranking_rules" ADD CONSTRAINT "meilisearch_settings_ranking_rules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "meilisearch_settings_custom_ranking_attributes" ADD CONSTRAINT "meilisearch_settings_custom_ranking_attributes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "meilisearch_settings_typo_tolerance_disable_on_words" ADD CONSTRAINT "meilisearch_settings_typo_tolerance_disable_on_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "meilisearch_settings_synonyms" ADD CONSTRAINT "meilisearch_settings_synonyms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "meilisearch_settings_stop_words" ADD CONSTRAINT "meilisearch_settings_stop_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "meilisearch_settings_exclude_patterns" ADD CONSTRAINT "meilisearch_settings_exclude_patterns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "meilisearch_settings_exclude_statuses" ADD CONSTRAINT "meilisearch_settings_exclude_statuses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "chatbot_settings_suggested_questions" ADD CONSTRAINT "chatbot_settings_suggested_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chatbot_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "chatbot_settings_rate_limiting_blocked_i_ps" ADD CONSTRAINT "chatbot_settings_rate_limiting_blocked_i_ps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chatbot_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "chatbot_settings_moderation_blocked_keywords" ADD CONSTRAINT "chatbot_settings_moderation_blocked_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chatbot_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  CREATE INDEX IF NOT EXISTS "users_addresses_order_idx" ON "users_addresses" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "users_addresses_parent_id_idx" ON "users_addresses" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "users_favorites_order_idx" ON "users_favorites" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "users_favorites_parent_id_idx" ON "users_favorites" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "users_favorites_product_idx" ON "users_favorites" USING btree ("product_id");
  CREATE INDEX IF NOT EXISTS "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "pages_blocks_banner_order_idx" ON "pages_blocks_banner" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_banner_parent_id_idx" ON "pages_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_banner_path_idx" ON "pages_blocks_banner" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_order_idx" ON "pages_blocks_spacer" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_parent_id_idx" ON "pages_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_path_idx" ON "pages_blocks_spacer" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_buttons_order_idx" ON "pages_blocks_hero_buttons" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_buttons_parent_id_idx" ON "pages_blocks_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_background_image_idx" ON "pages_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_media_block_buttons_order_idx" ON "pages_blocks_media_block_buttons" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_media_block_buttons_parent_id_idx" ON "pages_blocks_media_block_buttons" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_media_block_order_idx" ON "pages_blocks_media_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_media_block_parent_id_idx" ON "pages_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_media_block_path_idx" ON "pages_blocks_media_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_media_block_media_idx" ON "pages_blocks_media_block" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_two_column_order_idx" ON "pages_blocks_two_column" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_two_column_parent_id_idx" ON "pages_blocks_two_column" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_two_column_path_idx" ON "pages_blocks_two_column" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_product_grid_order_idx" ON "pages_blocks_product_grid" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_product_grid_parent_id_idx" ON "pages_blocks_product_grid" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_product_grid_path_idx" ON "pages_blocks_product_grid" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_product_grid_category_idx" ON "pages_blocks_product_grid" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_product_grid_brand_idx" ON "pages_blocks_product_grid" USING btree ("brand_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_category_grid_order_idx" ON "pages_blocks_category_grid" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_category_grid_parent_id_idx" ON "pages_blocks_category_grid" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_category_grid_path_idx" ON "pages_blocks_category_grid" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_quick_order_order_idx" ON "pages_blocks_quick_order" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_quick_order_parent_id_idx" ON "pages_blocks_quick_order" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_quick_order_path_idx" ON "pages_blocks_quick_order" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_buttons_order_idx" ON "pages_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_buttons_parent_id_idx" ON "pages_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_calltoaction_order_idx" ON "pages_blocks_calltoaction" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_calltoaction_parent_id_idx" ON "pages_blocks_calltoaction" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_calltoaction_path_idx" ON "pages_blocks_calltoaction" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_contact_opening_hours_order_idx" ON "pages_blocks_contact_opening_hours" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_contact_opening_hours_parent_id_idx" ON "pages_blocks_contact_opening_hours" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_contact_order_idx" ON "pages_blocks_contact" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_contact_parent_id_idx" ON "pages_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_contact_path_idx" ON "pages_blocks_contact" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_contact_form_order_idx" ON "pages_blocks_contact_form" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_contact_form_parent_id_idx" ON "pages_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_contact_form_path_idx" ON "pages_blocks_contact_form" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_newsletter_order_idx" ON "pages_blocks_newsletter" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_newsletter_parent_id_idx" ON "pages_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_newsletter_path_idx" ON "pages_blocks_newsletter" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_features_features_order_idx" ON "pages_blocks_features_features" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_features_features_parent_id_idx" ON "pages_blocks_features_features" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_features_order_idx" ON "pages_blocks_features" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_features_parent_id_idx" ON "pages_blocks_features" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_features_path_idx" ON "pages_blocks_features" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_services_services_order_idx" ON "pages_blocks_services_services" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_services_services_parent_id_idx" ON "pages_blocks_services_services" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_services_order_idx" ON "pages_blocks_services" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_services_parent_id_idx" ON "pages_blocks_services" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_services_path_idx" ON "pages_blocks_services" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_testimonials_order_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_testimonials_parent_id_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_testimonials_avatar_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("avatar_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cases_order_idx" ON "pages_blocks_cases" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cases_parent_id_idx" ON "pages_blocks_cases" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cases_path_idx" ON "pages_blocks_cases" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_logo_bar_logos_order_idx" ON "pages_blocks_logo_bar_logos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_logo_bar_logos_parent_id_idx" ON "pages_blocks_logo_bar_logos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_logo_bar_logos_image_idx" ON "pages_blocks_logo_bar_logos" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_logo_bar_order_idx" ON "pages_blocks_logo_bar" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_logo_bar_parent_id_idx" ON "pages_blocks_logo_bar" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_logo_bar_path_idx" ON "pages_blocks_logo_bar" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_stats_stats_order_idx" ON "pages_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_stats_stats_parent_id_idx" ON "pages_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_faqs_order_idx" ON "pages_blocks_faq_faqs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_faqs_parent_id_idx" ON "pages_blocks_faq_faqs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_team_members_order_idx" ON "pages_blocks_team_members" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_team_members_parent_id_idx" ON "pages_blocks_team_members" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_team_members_photo_idx" ON "pages_blocks_team_members" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_team_order_idx" ON "pages_blocks_team" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_team_parent_id_idx" ON "pages_blocks_team" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_team_path_idx" ON "pages_blocks_team" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_accordion_items_order_idx" ON "pages_blocks_accordion_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_accordion_items_parent_id_idx" ON "pages_blocks_accordion_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_accordion_order_idx" ON "pages_blocks_accordion" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_accordion_parent_id_idx" ON "pages_blocks_accordion" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_accordion_path_idx" ON "pages_blocks_accordion" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_blog_preview_order_idx" ON "pages_blocks_blog_preview" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_blog_preview_parent_id_idx" ON "pages_blocks_blog_preview" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_blog_preview_path_idx" ON "pages_blocks_blog_preview" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_comparison_columns_order_idx" ON "pages_blocks_comparison_columns" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_comparison_columns_parent_id_idx" ON "pages_blocks_comparison_columns" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_comparison_rows_values_order_idx" ON "pages_blocks_comparison_rows_values" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_comparison_rows_values_parent_id_idx" ON "pages_blocks_comparison_rows_values" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_comparison_rows_order_idx" ON "pages_blocks_comparison_rows" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_comparison_rows_parent_id_idx" ON "pages_blocks_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_comparison_order_idx" ON "pages_blocks_comparison" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_comparison_parent_id_idx" ON "pages_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_comparison_path_idx" ON "pages_blocks_comparison" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_infobox_order_idx" ON "pages_blocks_infobox" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_infobox_parent_id_idx" ON "pages_blocks_infobox" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_infobox_path_idx" ON "pages_blocks_infobox" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_gallery_images_order_idx" ON "pages_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_gallery_images_parent_id_idx" ON "pages_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_gallery_images_image_idx" ON "pages_blocks_image_gallery_images" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_gallery_order_idx" ON "pages_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_gallery_parent_id_idx" ON "pages_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_gallery_path_idx" ON "pages_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_video_video_file_idx" ON "pages_blocks_video" USING btree ("video_file_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_video_poster_image_idx" ON "pages_blocks_video" USING btree ("poster_image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_code_order_idx" ON "pages_blocks_code" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_code_parent_id_idx" ON "pages_blocks_code" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_code_path_idx" ON "pages_blocks_code" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_map_order_idx" ON "pages_blocks_map" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_map_parent_id_idx" ON "pages_blocks_map" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_map_path_idx" ON "pages_blocks_map" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_construction_hero_avatars_order_idx" ON "pages_blocks_construction_hero_avatars" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_construction_hero_avatars_parent_id_idx" ON "pages_blocks_construction_hero_avatars" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_construction_hero_floating_badges_order_idx" ON "pages_blocks_construction_hero_floating_badges" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_construction_hero_floating_badges_parent_id_idx" ON "pages_blocks_construction_hero_floating_badges" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_construction_hero_order_idx" ON "pages_blocks_construction_hero" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_construction_hero_parent_id_idx" ON "pages_blocks_construction_hero" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_construction_hero_path_idx" ON "pages_blocks_construction_hero" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_construction_hero_hero_image_idx" ON "pages_blocks_construction_hero" USING btree ("hero_image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_services_grid_order_idx" ON "pages_blocks_services_grid" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_services_grid_parent_id_idx" ON "pages_blocks_services_grid" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_services_grid_path_idx" ON "pages_blocks_services_grid" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_projects_grid_order_idx" ON "pages_blocks_projects_grid" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_projects_grid_parent_id_idx" ON "pages_blocks_projects_grid" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_projects_grid_path_idx" ON "pages_blocks_projects_grid" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_projects_grid_category_idx" ON "pages_blocks_projects_grid" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_reviews_grid_order_idx" ON "pages_blocks_reviews_grid" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_reviews_grid_parent_id_idx" ON "pages_blocks_reviews_grid" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_reviews_grid_path_idx" ON "pages_blocks_reviews_grid" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_stats_bar_stats_order_idx" ON "pages_blocks_stats_bar_stats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_stats_bar_stats_parent_id_idx" ON "pages_blocks_stats_bar_stats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_stats_bar_order_idx" ON "pages_blocks_stats_bar" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_stats_bar_parent_id_idx" ON "pages_blocks_stats_bar" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_stats_bar_path_idx" ON "pages_blocks_stats_bar" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_banner_buttons_order_idx" ON "pages_blocks_cta_banner_buttons" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_banner_buttons_parent_id_idx" ON "pages_blocks_cta_banner_buttons" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_banner_trust_elements_items_order_idx" ON "pages_blocks_cta_banner_trust_elements_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_banner_trust_elements_items_parent_id_idx" ON "pages_blocks_cta_banner_trust_elements_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_banner_order_idx" ON "pages_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_banner_parent_id_idx" ON "pages_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_banner_path_idx" ON "pages_blocks_cta_banner" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_banner_background_image_idx" ON "pages_blocks_cta_banner" USING btree ("background_image_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "pages_rels_products_id_idx" ON "pages_rels" USING btree ("products_id");
  CREATE INDEX IF NOT EXISTS "pages_rels_product_categories_id_idx" ON "pages_rels" USING btree ("product_categories_id");
  CREATE INDEX IF NOT EXISTS "pages_rels_cases_id_idx" ON "pages_rels" USING btree ("cases_id");
  CREATE INDEX IF NOT EXISTS "pages_rels_blog_posts_id_idx" ON "pages_rels" USING btree ("blog_posts_id");
  CREATE INDEX IF NOT EXISTS "pages_rels_construction_services_id_idx" ON "pages_rels" USING btree ("construction_services_id");
  CREATE INDEX IF NOT EXISTS "pages_rels_construction_projects_id_idx" ON "pages_rels" USING btree ("construction_projects_id");
  CREATE INDEX IF NOT EXISTS "pages_rels_construction_reviews_id_idx" ON "pages_rels" USING btree ("construction_reviews_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_banner_order_idx" ON "_pages_v_blocks_banner" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_banner_parent_id_idx" ON "_pages_v_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_banner_path_idx" ON "_pages_v_blocks_banner" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_order_idx" ON "_pages_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_parent_id_idx" ON "_pages_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_path_idx" ON "_pages_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_buttons_order_idx" ON "_pages_v_blocks_hero_buttons" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_buttons_parent_id_idx" ON "_pages_v_blocks_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_background_image_idx" ON "_pages_v_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_media_block_buttons_order_idx" ON "_pages_v_blocks_media_block_buttons" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_media_block_buttons_parent_id_idx" ON "_pages_v_blocks_media_block_buttons" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_media_block_order_idx" ON "_pages_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_media_block_parent_id_idx" ON "_pages_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_media_block_path_idx" ON "_pages_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_media_block_media_idx" ON "_pages_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_two_column_order_idx" ON "_pages_v_blocks_two_column" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_two_column_parent_id_idx" ON "_pages_v_blocks_two_column" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_two_column_path_idx" ON "_pages_v_blocks_two_column" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_product_grid_order_idx" ON "_pages_v_blocks_product_grid" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_product_grid_parent_id_idx" ON "_pages_v_blocks_product_grid" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_product_grid_path_idx" ON "_pages_v_blocks_product_grid" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_product_grid_category_idx" ON "_pages_v_blocks_product_grid" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_product_grid_brand_idx" ON "_pages_v_blocks_product_grid" USING btree ("brand_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_category_grid_order_idx" ON "_pages_v_blocks_category_grid" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_category_grid_parent_id_idx" ON "_pages_v_blocks_category_grid" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_category_grid_path_idx" ON "_pages_v_blocks_category_grid" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_quick_order_order_idx" ON "_pages_v_blocks_quick_order" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_quick_order_parent_id_idx" ON "_pages_v_blocks_quick_order" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_quick_order_path_idx" ON "_pages_v_blocks_quick_order" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_buttons_order_idx" ON "_pages_v_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_buttons_parent_id_idx" ON "_pages_v_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_calltoaction_order_idx" ON "_pages_v_blocks_calltoaction" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_calltoaction_parent_id_idx" ON "_pages_v_blocks_calltoaction" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_calltoaction_path_idx" ON "_pages_v_blocks_calltoaction" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_contact_opening_hours_order_idx" ON "_pages_v_blocks_contact_opening_hours" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_contact_opening_hours_parent_id_idx" ON "_pages_v_blocks_contact_opening_hours" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_contact_order_idx" ON "_pages_v_blocks_contact" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_contact_parent_id_idx" ON "_pages_v_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_contact_path_idx" ON "_pages_v_blocks_contact" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_contact_form_order_idx" ON "_pages_v_blocks_contact_form" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_contact_form_parent_id_idx" ON "_pages_v_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_contact_form_path_idx" ON "_pages_v_blocks_contact_form" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_newsletter_order_idx" ON "_pages_v_blocks_newsletter" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_newsletter_parent_id_idx" ON "_pages_v_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_newsletter_path_idx" ON "_pages_v_blocks_newsletter" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_features_features_order_idx" ON "_pages_v_blocks_features_features" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_features_features_parent_id_idx" ON "_pages_v_blocks_features_features" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_features_order_idx" ON "_pages_v_blocks_features" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_features_parent_id_idx" ON "_pages_v_blocks_features" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_features_path_idx" ON "_pages_v_blocks_features" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_services_services_order_idx" ON "_pages_v_blocks_services_services" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_services_services_parent_id_idx" ON "_pages_v_blocks_services_services" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_services_order_idx" ON "_pages_v_blocks_services" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_services_parent_id_idx" ON "_pages_v_blocks_services" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_services_path_idx" ON "_pages_v_blocks_services" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_testimonials_order_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_testimonials_avatar_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("avatar_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cases_order_idx" ON "_pages_v_blocks_cases" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cases_parent_id_idx" ON "_pages_v_blocks_cases" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cases_path_idx" ON "_pages_v_blocks_cases" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_logo_bar_logos_order_idx" ON "_pages_v_blocks_logo_bar_logos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_logo_bar_logos_parent_id_idx" ON "_pages_v_blocks_logo_bar_logos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_logo_bar_logos_image_idx" ON "_pages_v_blocks_logo_bar_logos" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_logo_bar_order_idx" ON "_pages_v_blocks_logo_bar" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_logo_bar_parent_id_idx" ON "_pages_v_blocks_logo_bar" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_logo_bar_path_idx" ON "_pages_v_blocks_logo_bar" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_stats_stats_order_idx" ON "_pages_v_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_stats_stats_parent_id_idx" ON "_pages_v_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_faqs_order_idx" ON "_pages_v_blocks_faq_faqs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_faqs_parent_id_idx" ON "_pages_v_blocks_faq_faqs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_members_order_idx" ON "_pages_v_blocks_team_members" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_members_parent_id_idx" ON "_pages_v_blocks_team_members" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_members_photo_idx" ON "_pages_v_blocks_team_members" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_order_idx" ON "_pages_v_blocks_team" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_parent_id_idx" ON "_pages_v_blocks_team" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_path_idx" ON "_pages_v_blocks_team" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_accordion_items_order_idx" ON "_pages_v_blocks_accordion_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_accordion_items_parent_id_idx" ON "_pages_v_blocks_accordion_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_accordion_order_idx" ON "_pages_v_blocks_accordion" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_accordion_parent_id_idx" ON "_pages_v_blocks_accordion" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_accordion_path_idx" ON "_pages_v_blocks_accordion" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_blog_preview_order_idx" ON "_pages_v_blocks_blog_preview" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_blog_preview_parent_id_idx" ON "_pages_v_blocks_blog_preview" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_blog_preview_path_idx" ON "_pages_v_blocks_blog_preview" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_comparison_columns_order_idx" ON "_pages_v_blocks_comparison_columns" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_comparison_columns_parent_id_idx" ON "_pages_v_blocks_comparison_columns" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_comparison_rows_values_order_idx" ON "_pages_v_blocks_comparison_rows_values" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_comparison_rows_values_parent_id_idx" ON "_pages_v_blocks_comparison_rows_values" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_comparison_rows_order_idx" ON "_pages_v_blocks_comparison_rows" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_comparison_rows_parent_id_idx" ON "_pages_v_blocks_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_comparison_order_idx" ON "_pages_v_blocks_comparison" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_comparison_parent_id_idx" ON "_pages_v_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_comparison_path_idx" ON "_pages_v_blocks_comparison" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_infobox_order_idx" ON "_pages_v_blocks_infobox" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_infobox_parent_id_idx" ON "_pages_v_blocks_infobox" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_infobox_path_idx" ON "_pages_v_blocks_infobox" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_gallery_images_order_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_gallery_images_parent_id_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_gallery_images_image_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_gallery_order_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_gallery_parent_id_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_gallery_path_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_video_file_idx" ON "_pages_v_blocks_video" USING btree ("video_file_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_poster_image_idx" ON "_pages_v_blocks_video" USING btree ("poster_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_code_order_idx" ON "_pages_v_blocks_code" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_code_parent_id_idx" ON "_pages_v_blocks_code" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_code_path_idx" ON "_pages_v_blocks_code" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_map_order_idx" ON "_pages_v_blocks_map" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_map_parent_id_idx" ON "_pages_v_blocks_map" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_map_path_idx" ON "_pages_v_blocks_map" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_construction_hero_avatars_order_idx" ON "_pages_v_blocks_construction_hero_avatars" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_construction_hero_avatars_parent_id_idx" ON "_pages_v_blocks_construction_hero_avatars" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_construction_hero_floating_badges_order_idx" ON "_pages_v_blocks_construction_hero_floating_badges" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_construction_hero_floating_badges_parent_id_idx" ON "_pages_v_blocks_construction_hero_floating_badges" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_construction_hero_order_idx" ON "_pages_v_blocks_construction_hero" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_construction_hero_parent_id_idx" ON "_pages_v_blocks_construction_hero" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_construction_hero_path_idx" ON "_pages_v_blocks_construction_hero" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_construction_hero_hero_image_idx" ON "_pages_v_blocks_construction_hero" USING btree ("hero_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_services_grid_order_idx" ON "_pages_v_blocks_services_grid" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_services_grid_parent_id_idx" ON "_pages_v_blocks_services_grid" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_services_grid_path_idx" ON "_pages_v_blocks_services_grid" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_projects_grid_order_idx" ON "_pages_v_blocks_projects_grid" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_projects_grid_parent_id_idx" ON "_pages_v_blocks_projects_grid" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_projects_grid_path_idx" ON "_pages_v_blocks_projects_grid" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_projects_grid_category_idx" ON "_pages_v_blocks_projects_grid" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_reviews_grid_order_idx" ON "_pages_v_blocks_reviews_grid" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_reviews_grid_parent_id_idx" ON "_pages_v_blocks_reviews_grid" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_reviews_grid_path_idx" ON "_pages_v_blocks_reviews_grid" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_stats_bar_stats_order_idx" ON "_pages_v_blocks_stats_bar_stats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_stats_bar_stats_parent_id_idx" ON "_pages_v_blocks_stats_bar_stats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_stats_bar_order_idx" ON "_pages_v_blocks_stats_bar" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_stats_bar_parent_id_idx" ON "_pages_v_blocks_stats_bar" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_stats_bar_path_idx" ON "_pages_v_blocks_stats_bar" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_banner_buttons_order_idx" ON "_pages_v_blocks_cta_banner_buttons" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_banner_buttons_parent_id_idx" ON "_pages_v_blocks_cta_banner_buttons" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_banner_trust_elements_items_order_idx" ON "_pages_v_blocks_cta_banner_trust_elements_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_banner_trust_elements_items_parent_id_idx" ON "_pages_v_blocks_cta_banner_trust_elements_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_banner_order_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_banner_parent_id_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_banner_path_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_banner_background_image_idx" ON "_pages_v_blocks_cta_banner" USING btree ("background_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_products_id_idx" ON "_pages_v_rels" USING btree ("products_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_product_categories_id_idx" ON "_pages_v_rels" USING btree ("product_categories_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_cases_id_idx" ON "_pages_v_rels" USING btree ("cases_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_blog_posts_id_idx" ON "_pages_v_rels" USING btree ("blog_posts_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_construction_services_id_idx" ON "_pages_v_rels" USING btree ("construction_services_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_construction_projects_id_idx" ON "_pages_v_rels" USING btree ("construction_projects_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_construction_reviews_id_idx" ON "_pages_v_rels" USING btree ("construction_reviews_id");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "services_icon_upload_idx" ON "services" USING btree ("icon_upload_id");
  CREATE INDEX IF NOT EXISTS "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "notifications_user_idx" ON "notifications" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "notifications_related_order_idx" ON "notifications" USING btree ("related_order_id");
  CREATE INDEX IF NOT EXISTS "notifications_related_product_idx" ON "notifications" USING btree ("related_product_id");
  CREATE INDEX IF NOT EXISTS "notifications_updated_at_idx" ON "notifications" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "notifications_created_at_idx" ON "notifications" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "themes_custom_colors_order_idx" ON "themes_custom_colors" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "themes_custom_colors_parent_id_idx" ON "themes_custom_colors" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "themes_slug_idx" ON "themes" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "themes_updated_at_idx" ON "themes" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "themes_created_at_idx" ON "themes" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "products_tags_order_idx" ON "products_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "products_tags_parent_id_idx" ON "products_tags" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "products_videos_order_idx" ON "products_videos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "products_videos_parent_id_idx" ON "products_videos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "products_child_products_order_idx" ON "products_child_products" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "products_child_products_parent_id_idx" ON "products_child_products" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "products_child_products_product_idx" ON "products_child_products" USING btree ("product_id");
  CREATE INDEX IF NOT EXISTS "products_meta_keywords_order_idx" ON "products_meta_keywords" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "products_meta_keywords_parent_id_idx" ON "products_meta_keywords" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "products_specifications_attributes_order_idx" ON "products_specifications_attributes" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "products_specifications_attributes_parent_id_idx" ON "products_specifications_attributes" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "products_specifications_order_idx" ON "products_specifications" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "products_specifications_parent_id_idx" ON "products_specifications" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "products_variant_options_values_order_idx" ON "products_variant_options_values" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "products_variant_options_values_parent_id_idx" ON "products_variant_options_values" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "products_variant_options_values_image_idx" ON "products_variant_options_values" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "products_variant_options_order_idx" ON "products_variant_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "products_variant_options_parent_id_idx" ON "products_variant_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "products_slug_idx" ON "products" USING btree ("slug");
  CREATE UNIQUE INDEX IF NOT EXISTS "products_sku_idx" ON "products" USING btree ("sku");
  CREATE INDEX IF NOT EXISTS "products_brand_idx" ON "products" USING btree ("brand_id");
  CREATE INDEX IF NOT EXISTS "products_meta_meta_image_idx" ON "products" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "products_rels_product_categories_id_idx" ON "products_rels" USING btree ("product_categories_id");
  CREATE INDEX IF NOT EXISTS "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "products_rels_products_id_idx" ON "products_rels" USING btree ("products_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "product_categories_slug_idx" ON "product_categories" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "product_categories_parent_idx" ON "product_categories" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "product_categories_image_idx" ON "product_categories" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "product_categories_promo_banner_promo_banner_image_idx" ON "product_categories" USING btree ("promo_banner_image_id");
  CREATE INDEX IF NOT EXISTS "product_categories_updated_at_idx" ON "product_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "product_categories_created_at_idx" ON "product_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "brands_slug_idx" ON "brands" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "brands_logo_idx" ON "brands" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "brands_meta_meta_image_idx" ON "brands" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "brands_updated_at_idx" ON "brands" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "brands_created_at_idx" ON "brands" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "recently_viewed_user_idx" ON "recently_viewed" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "recently_viewed_product_idx" ON "recently_viewed" USING btree ("product_id");
  CREATE INDEX IF NOT EXISTS "recently_viewed_updated_at_idx" ON "recently_viewed" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "recently_viewed_created_at_idx" ON "recently_viewed" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "edition_notifications_user_idx" ON "edition_notifications" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "edition_notifications_product_idx" ON "edition_notifications" USING btree ("product_id");
  CREATE INDEX IF NOT EXISTS "edition_notifications_updated_at_idx" ON "edition_notifications" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "edition_notifications_created_at_idx" ON "edition_notifications" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "customer_groups_name_idx" ON "customer_groups" USING btree ("name");
  CREATE UNIQUE INDEX IF NOT EXISTS "customer_groups_slug_idx" ON "customer_groups" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "customer_groups_updated_at_idx" ON "customer_groups" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "customer_groups_created_at_idx" ON "customer_groups" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "orders_items_product_idx" ON "orders_items" USING btree ("product_id");
  CREATE INDEX IF NOT EXISTS "orders_timeline_order_idx" ON "orders_timeline" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "orders_timeline_parent_id_idx" ON "orders_timeline" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "orders_order_number_idx" ON "orders" USING btree ("order_number");
  CREATE INDEX IF NOT EXISTS "orders_customer_idx" ON "orders" USING btree ("customer_id");
  CREATE INDEX IF NOT EXISTS "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "order_lists_items_order_idx" ON "order_lists_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "order_lists_items_parent_id_idx" ON "order_lists_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "order_lists_items_product_idx" ON "order_lists_items" USING btree ("product_id");
  CREATE INDEX IF NOT EXISTS "order_lists_share_with_order_idx" ON "order_lists_share_with" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "order_lists_share_with_parent_id_idx" ON "order_lists_share_with" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "order_lists_share_with_user_idx" ON "order_lists_share_with" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "order_lists_owner_idx" ON "order_lists" USING btree ("owner_id");
  CREATE INDEX IF NOT EXISTS "order_lists_updated_at_idx" ON "order_lists" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "order_lists_created_at_idx" ON "order_lists" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "recurring_orders_items_order_idx" ON "recurring_orders_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "recurring_orders_items_parent_id_idx" ON "recurring_orders_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "recurring_orders_items_product_idx" ON "recurring_orders_items" USING btree ("product_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "recurring_orders_reference_number_idx" ON "recurring_orders" USING btree ("reference_number");
  CREATE INDEX IF NOT EXISTS "recurring_orders_customer_idx" ON "recurring_orders" USING btree ("customer_id");
  CREATE INDEX IF NOT EXISTS "recurring_orders_updated_at_idx" ON "recurring_orders" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "recurring_orders_created_at_idx" ON "recurring_orders" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "recurring_orders_rels_order_idx" ON "recurring_orders_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "recurring_orders_rels_parent_idx" ON "recurring_orders_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "recurring_orders_rels_path_idx" ON "recurring_orders_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "recurring_orders_rels_orders_id_idx" ON "recurring_orders_rels" USING btree ("orders_id");
  CREATE INDEX IF NOT EXISTS "invoices_items_order_idx" ON "invoices_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "invoices_items_parent_id_idx" ON "invoices_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "invoices_invoice_number_idx" ON "invoices" USING btree ("invoice_number");
  CREATE INDEX IF NOT EXISTS "invoices_order_idx" ON "invoices" USING btree ("order_id");
  CREATE INDEX IF NOT EXISTS "invoices_customer_idx" ON "invoices" USING btree ("customer_id");
  CREATE INDEX IF NOT EXISTS "invoices_pdf_file_idx" ON "invoices" USING btree ("pdf_file_id");
  CREATE INDEX IF NOT EXISTS "invoices_updated_at_idx" ON "invoices" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "invoices_created_at_idx" ON "invoices" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "returns_items_order_idx" ON "returns_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "returns_items_parent_id_idx" ON "returns_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "returns_items_product_idx" ON "returns_items" USING btree ("product_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "returns_rma_number_idx" ON "returns" USING btree ("rma_number");
  CREATE INDEX IF NOT EXISTS "returns_order_idx" ON "returns" USING btree ("order_id");
  CREATE INDEX IF NOT EXISTS "returns_customer_idx" ON "returns" USING btree ("customer_id");
  CREATE INDEX IF NOT EXISTS "returns_replacement_order_idx" ON "returns" USING btree ("replacement_order_id");
  CREATE INDEX IF NOT EXISTS "returns_updated_at_idx" ON "returns" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "returns_created_at_idx" ON "returns" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "returns_rels_order_idx" ON "returns_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "returns_rels_parent_idx" ON "returns_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "returns_rels_path_idx" ON "returns_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "returns_rels_media_id_idx" ON "returns_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "subscription_plans_features_order_idx" ON "subscription_plans_features" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "subscription_plans_features_parent_id_idx" ON "subscription_plans_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "subscription_plans_slug_idx" ON "subscription_plans" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "subscription_plans_updated_at_idx" ON "subscription_plans" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "subscription_plans_created_at_idx" ON "subscription_plans" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "user_subscriptions_addons_order_idx" ON "user_subscriptions_addons" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "user_subscriptions_addons_parent_id_idx" ON "user_subscriptions_addons" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "user_subscriptions_user_idx" ON "user_subscriptions" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "user_subscriptions_plan_idx" ON "user_subscriptions" USING btree ("plan_id");
  CREATE INDEX IF NOT EXISTS "user_subscriptions_updated_at_idx" ON "user_subscriptions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "user_subscriptions_created_at_idx" ON "user_subscriptions" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payment_methods_user_idx" ON "payment_methods" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "payment_methods_updated_at_idx" ON "payment_methods" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payment_methods_created_at_idx" ON "payment_methods" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "gift_vouchers_code_idx" ON "gift_vouchers" USING btree ("code");
  CREATE INDEX IF NOT EXISTS "gift_vouchers_purchased_by_idx" ON "gift_vouchers" USING btree ("purchased_by_id");
  CREATE INDEX IF NOT EXISTS "gift_vouchers_redeemed_by_idx" ON "gift_vouchers" USING btree ("redeemed_by_id");
  CREATE INDEX IF NOT EXISTS "gift_vouchers_updated_at_idx" ON "gift_vouchers" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "gift_vouchers_created_at_idx" ON "gift_vouchers" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "licenses_downloads_order_idx" ON "licenses_downloads" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "licenses_downloads_parent_id_idx" ON "licenses_downloads" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "licenses_user_idx" ON "licenses" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "licenses_product_idx" ON "licenses" USING btree ("product_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "licenses_license_key_idx" ON "licenses" USING btree ("license_key");
  CREATE INDEX IF NOT EXISTS "licenses_order_idx" ON "licenses" USING btree ("order_id");
  CREATE INDEX IF NOT EXISTS "licenses_updated_at_idx" ON "licenses" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "licenses_created_at_idx" ON "licenses" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "license_activations_license_idx" ON "license_activations" USING btree ("license_id");
  CREATE INDEX IF NOT EXISTS "license_activations_updated_at_idx" ON "license_activations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "license_activations_created_at_idx" ON "license_activations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "loyalty_tiers_benefits_order_idx" ON "loyalty_tiers_benefits" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "loyalty_tiers_benefits_parent_id_idx" ON "loyalty_tiers_benefits" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "loyalty_tiers_slug_idx" ON "loyalty_tiers" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "loyalty_tiers_updated_at_idx" ON "loyalty_tiers" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "loyalty_tiers_created_at_idx" ON "loyalty_tiers" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "loyalty_rewards_tier_required_idx" ON "loyalty_rewards" USING btree ("tier_required_id");
  CREATE INDEX IF NOT EXISTS "loyalty_rewards_updated_at_idx" ON "loyalty_rewards" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "loyalty_rewards_created_at_idx" ON "loyalty_rewards" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "loyalty_points_user_idx" ON "loyalty_points" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "loyalty_points_tier_idx" ON "loyalty_points" USING btree ("tier_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "loyalty_points_referral_code_idx" ON "loyalty_points" USING btree ("referral_code");
  CREATE INDEX IF NOT EXISTS "loyalty_points_updated_at_idx" ON "loyalty_points" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "loyalty_points_created_at_idx" ON "loyalty_points" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "loyalty_transactions_user_idx" ON "loyalty_transactions" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "loyalty_transactions_related_order_idx" ON "loyalty_transactions" USING btree ("related_order_id");
  CREATE INDEX IF NOT EXISTS "loyalty_transactions_related_reward_idx" ON "loyalty_transactions" USING btree ("related_reward_id");
  CREATE INDEX IF NOT EXISTS "loyalty_transactions_updated_at_idx" ON "loyalty_transactions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "loyalty_transactions_created_at_idx" ON "loyalty_transactions" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "loyalty_redemptions_user_idx" ON "loyalty_redemptions" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "loyalty_redemptions_reward_idx" ON "loyalty_redemptions" USING btree ("reward_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "loyalty_redemptions_code_idx" ON "loyalty_redemptions" USING btree ("code");
  CREATE INDEX IF NOT EXISTS "loyalty_redemptions_used_in_order_idx" ON "loyalty_redemptions" USING btree ("used_in_order_id");
  CREATE INDEX IF NOT EXISTS "loyalty_redemptions_updated_at_idx" ON "loyalty_redemptions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "loyalty_redemptions_created_at_idx" ON "loyalty_redemptions" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "ab_tests_variants_order_idx" ON "ab_tests_variants" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "ab_tests_variants_parent_id_idx" ON "ab_tests_variants" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "ab_tests_updated_at_idx" ON "ab_tests" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "ab_tests_created_at_idx" ON "ab_tests" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "ab_test_results_test_idx" ON "ab_test_results" USING btree ("test_id");
  CREATE INDEX IF NOT EXISTS "ab_test_results_user_id_idx" ON "ab_test_results" USING btree ("user_id_id");
  CREATE INDEX IF NOT EXISTS "ab_test_results_order_idx" ON "ab_test_results" USING btree ("order_id");
  CREATE INDEX IF NOT EXISTS "ab_test_results_updated_at_idx" ON "ab_test_results" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "ab_test_results_created_at_idx" ON "ab_test_results" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "test_sessionId_idx" ON "ab_test_results" USING btree ("test_id","session_id");
  CREATE INDEX IF NOT EXISTS "test_userId_idx" ON "ab_test_results" USING btree ("test_id","user_id_id");
  CREATE INDEX IF NOT EXISTS "test_variant_idx" ON "ab_test_results" USING btree ("test_id","variant");
  CREATE INDEX IF NOT EXISTS "converted_idx" ON "ab_test_results" USING btree ("converted");
  CREATE INDEX IF NOT EXISTS "blog_posts_tags_order_idx" ON "blog_posts_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_tags_parent_id_idx" ON "blog_posts_tags" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_faq_order_idx" ON "blog_posts_faq" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_faq_parent_id_idx" ON "blog_posts_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "blog_posts_featured_image_idx" ON "blog_posts" USING btree ("featured_image_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_author_idx" ON "blog_posts" USING btree ("author_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_meta_meta_image_idx" ON "blog_posts" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_updated_at_idx" ON "blog_posts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "blog_posts_created_at_idx" ON "blog_posts" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "blog_posts__status_idx" ON "blog_posts" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "blog_posts_rels_order_idx" ON "blog_posts_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "blog_posts_rels_parent_idx" ON "blog_posts_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_rels_path_idx" ON "blog_posts_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "blog_posts_rels_blog_categories_id_idx" ON "blog_posts_rels" USING btree ("blog_categories_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_rels_products_id_idx" ON "blog_posts_rels" USING btree ("products_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_rels_blog_posts_id_idx" ON "blog_posts_rels" USING btree ("blog_posts_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_version_tags_order_idx" ON "_blog_posts_v_version_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_version_tags_parent_id_idx" ON "_blog_posts_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_version_faq_order_idx" ON "_blog_posts_v_version_faq" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_version_faq_parent_id_idx" ON "_blog_posts_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_parent_idx" ON "_blog_posts_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_version_version_slug_idx" ON "_blog_posts_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_version_version_featured_image_idx" ON "_blog_posts_v" USING btree ("version_featured_image_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_version_version_author_idx" ON "_blog_posts_v" USING btree ("version_author_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_version_meta_version_meta_image_idx" ON "_blog_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_version_version_updated_at_idx" ON "_blog_posts_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_version_version_created_at_idx" ON "_blog_posts_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_version_version__status_idx" ON "_blog_posts_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_created_at_idx" ON "_blog_posts_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_updated_at_idx" ON "_blog_posts_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_latest_idx" ON "_blog_posts_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_autosave_idx" ON "_blog_posts_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_rels_order_idx" ON "_blog_posts_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_rels_parent_idx" ON "_blog_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_rels_path_idx" ON "_blog_posts_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_rels_blog_categories_id_idx" ON "_blog_posts_v_rels" USING btree ("blog_categories_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_rels_products_id_idx" ON "_blog_posts_v_rels" USING btree ("products_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_rels_blog_posts_id_idx" ON "_blog_posts_v_rels" USING btree ("blog_posts_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "blog_categories_slug_idx" ON "blog_categories" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "blog_categories_parent_idx" ON "blog_categories" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "blog_categories_image_idx" ON "blog_categories" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "blog_categories_updated_at_idx" ON "blog_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "blog_categories_created_at_idx" ON "blog_categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "cases_services_order_idx" ON "cases_services" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "cases_services_parent_id_idx" ON "cases_services" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "cases_gallery_order_idx" ON "cases_gallery" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "cases_gallery_parent_id_idx" ON "cases_gallery" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "cases_gallery_image_idx" ON "cases_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "cases_slug_idx" ON "cases" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "cases_featured_image_idx" ON "cases" USING btree ("featured_image_id");
  CREATE INDEX IF NOT EXISTS "cases_meta_meta_image_idx" ON "cases" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "cases_updated_at_idx" ON "cases" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "cases_created_at_idx" ON "cases" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "testimonials_photo_idx" ON "testimonials" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "vendors_certifications_order_idx" ON "vendors_certifications" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "vendors_certifications_parent_id_idx" ON "vendors_certifications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "vendors_slug_idx" ON "vendors" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "vendors_logo_idx" ON "vendors" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "vendors_banner_idx" ON "vendors" USING btree ("banner_id");
  CREATE INDEX IF NOT EXISTS "vendors_meta_meta_image_idx" ON "vendors" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "vendors_updated_at_idx" ON "vendors" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "vendors_created_at_idx" ON "vendors" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "vendors_rels_order_idx" ON "vendors_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "vendors_rels_parent_idx" ON "vendors_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "vendors_rels_path_idx" ON "vendors_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "vendors_rels_product_categories_id_idx" ON "vendors_rels" USING btree ("product_categories_id");
  CREATE INDEX IF NOT EXISTS "vendors_rels_products_id_idx" ON "vendors_rels" USING btree ("products_id");
  CREATE INDEX IF NOT EXISTS "vendor_reviews_vendor_idx" ON "vendor_reviews" USING btree ("vendor_id");
  CREATE INDEX IF NOT EXISTS "vendor_reviews_updated_at_idx" ON "vendor_reviews" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "vendor_reviews_created_at_idx" ON "vendor_reviews" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "workshops_target_audience_order_idx" ON "workshops_target_audience" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "workshops_target_audience_parent_idx" ON "workshops_target_audience" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "workshops_learning_objectives_order_idx" ON "workshops_learning_objectives" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "workshops_learning_objectives_parent_id_idx" ON "workshops_learning_objectives" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "workshops_slug_idx" ON "workshops" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "workshops_featured_image_idx" ON "workshops" USING btree ("featured_image_id");
  CREATE INDEX IF NOT EXISTS "workshops_vendor_idx" ON "workshops" USING btree ("vendor_id");
  CREATE INDEX IF NOT EXISTS "workshops_meta_meta_image_idx" ON "workshops" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "workshops_updated_at_idx" ON "workshops" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "workshops_created_at_idx" ON "workshops" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "construction_services_features_order_idx" ON "construction_services_features" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "construction_services_features_parent_id_idx" ON "construction_services_features" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "construction_services_process_steps_order_idx" ON "construction_services_process_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "construction_services_process_steps_parent_id_idx" ON "construction_services_process_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "construction_services_service_types_order_idx" ON "construction_services_service_types" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "construction_services_service_types_parent_id_idx" ON "construction_services_service_types" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "construction_services_usps_order_idx" ON "construction_services_usps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "construction_services_usps_parent_id_idx" ON "construction_services_usps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "construction_services_faq_order_idx" ON "construction_services_faq" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "construction_services_faq_parent_id_idx" ON "construction_services_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "construction_services_slug_idx" ON "construction_services" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "construction_services_hero_image_idx" ON "construction_services" USING btree ("hero_image_id");
  CREATE INDEX IF NOT EXISTS "construction_services_updated_at_idx" ON "construction_services" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "construction_services_created_at_idx" ON "construction_services" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "construction_services_rels_order_idx" ON "construction_services_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "construction_services_rels_parent_idx" ON "construction_services_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "construction_services_rels_path_idx" ON "construction_services_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "construction_services_rels_media_id_idx" ON "construction_services_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "construction_projects_badges_order_idx" ON "construction_projects_badges" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "construction_projects_badges_parent_id_idx" ON "construction_projects_badges" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "construction_projects_slug_idx" ON "construction_projects" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "construction_projects_category_idx" ON "construction_projects" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "construction_projects_featured_image_idx" ON "construction_projects" USING btree ("featured_image_id");
  CREATE INDEX IF NOT EXISTS "construction_projects_before_after_before_after_before_idx" ON "construction_projects" USING btree ("before_after_before_id");
  CREATE INDEX IF NOT EXISTS "construction_projects_before_after_before_after_after_idx" ON "construction_projects" USING btree ("before_after_after_id");
  CREATE INDEX IF NOT EXISTS "construction_projects_updated_at_idx" ON "construction_projects" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "construction_projects_created_at_idx" ON "construction_projects" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "construction_projects_rels_order_idx" ON "construction_projects_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "construction_projects_rels_parent_idx" ON "construction_projects_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "construction_projects_rels_path_idx" ON "construction_projects_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "construction_projects_rels_media_id_idx" ON "construction_projects_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "construction_reviews_project_idx" ON "construction_reviews" USING btree ("project_id");
  CREATE INDEX IF NOT EXISTS "construction_reviews_service_idx" ON "construction_reviews" USING btree ("service_id");
  CREATE INDEX IF NOT EXISTS "construction_reviews_updated_at_idx" ON "construction_reviews" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "construction_reviews_created_at_idx" ON "construction_reviews" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "quote_requests_assigned_to_idx" ON "quote_requests" USING btree ("assigned_to_id");
  CREATE INDEX IF NOT EXISTS "quote_requests_updated_at_idx" ON "quote_requests" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "quote_requests_created_at_idx" ON "quote_requests" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "quote_requests_rels_order_idx" ON "quote_requests_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "quote_requests_rels_parent_idx" ON "quote_requests_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "quote_requests_rels_path_idx" ON "quote_requests_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "quote_requests_rels_media_id_idx" ON "quote_requests_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "treatments_symptoms_order_idx" ON "treatments_symptoms" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "treatments_symptoms_parent_id_idx" ON "treatments_symptoms" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "treatments_process_order_idx" ON "treatments_process" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "treatments_process_parent_id_idx" ON "treatments_process" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "treatments_gallery_order_idx" ON "treatments_gallery" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "treatments_gallery_parent_id_idx" ON "treatments_gallery" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "treatments_gallery_image_idx" ON "treatments_gallery" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "treatments_featured_image_idx" ON "treatments" USING btree ("featured_image_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "treatments_slug_idx" ON "treatments" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "treatments_updated_at_idx" ON "treatments" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "treatments_created_at_idx" ON "treatments" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "treatments__status_idx" ON "treatments" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "treatments_rels_order_idx" ON "treatments_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "treatments_rels_parent_idx" ON "treatments_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "treatments_rels_path_idx" ON "treatments_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "treatments_rels_treatments_id_idx" ON "treatments_rels" USING btree ("treatments_id");
  CREATE INDEX IF NOT EXISTS "treatments_rels_practitioners_id_idx" ON "treatments_rels" USING btree ("practitioners_id");
  CREATE INDEX IF NOT EXISTS "_treatments_v_version_symptoms_order_idx" ON "_treatments_v_version_symptoms" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_treatments_v_version_symptoms_parent_id_idx" ON "_treatments_v_version_symptoms" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_treatments_v_version_process_order_idx" ON "_treatments_v_version_process" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_treatments_v_version_process_parent_id_idx" ON "_treatments_v_version_process" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_treatments_v_version_gallery_order_idx" ON "_treatments_v_version_gallery" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_treatments_v_version_gallery_parent_id_idx" ON "_treatments_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_treatments_v_version_gallery_image_idx" ON "_treatments_v_version_gallery" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_treatments_v_parent_idx" ON "_treatments_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_treatments_v_version_version_featured_image_idx" ON "_treatments_v" USING btree ("version_featured_image_id");
  CREATE INDEX IF NOT EXISTS "_treatments_v_version_version_slug_idx" ON "_treatments_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_treatments_v_version_version_updated_at_idx" ON "_treatments_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_treatments_v_version_version_created_at_idx" ON "_treatments_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_treatments_v_version_version__status_idx" ON "_treatments_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_treatments_v_created_at_idx" ON "_treatments_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_treatments_v_updated_at_idx" ON "_treatments_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_treatments_v_latest_idx" ON "_treatments_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_treatments_v_autosave_idx" ON "_treatments_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_treatments_v_rels_order_idx" ON "_treatments_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_treatments_v_rels_parent_idx" ON "_treatments_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_treatments_v_rels_path_idx" ON "_treatments_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_treatments_v_rels_treatments_id_idx" ON "_treatments_v_rels" USING btree ("treatments_id");
  CREATE INDEX IF NOT EXISTS "_treatments_v_rels_practitioners_id_idx" ON "_treatments_v_rels" USING btree ("practitioners_id");
  CREATE INDEX IF NOT EXISTS "practitioners_specializations_order_idx" ON "practitioners_specializations" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "practitioners_specializations_parent_id_idx" ON "practitioners_specializations" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "practitioners_qualifications_order_idx" ON "practitioners_qualifications" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "practitioners_qualifications_parent_id_idx" ON "practitioners_qualifications" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "practitioners_work_days_order_idx" ON "practitioners_work_days" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "practitioners_work_days_parent_idx" ON "practitioners_work_days" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "practitioners_avatar_idx" ON "practitioners" USING btree ("avatar_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "practitioners_slug_idx" ON "practitioners" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "practitioners_updated_at_idx" ON "practitioners" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "practitioners_created_at_idx" ON "practitioners" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "practitioners__status_idx" ON "practitioners" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "practitioners_rels_order_idx" ON "practitioners_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "practitioners_rels_parent_idx" ON "practitioners_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "practitioners_rels_path_idx" ON "practitioners_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "practitioners_rels_treatments_id_idx" ON "practitioners_rels" USING btree ("treatments_id");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_version_specializations_order_idx" ON "_practitioners_v_version_specializations" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_version_specializations_parent_id_idx" ON "_practitioners_v_version_specializations" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_version_qualifications_order_idx" ON "_practitioners_v_version_qualifications" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_version_qualifications_parent_id_idx" ON "_practitioners_v_version_qualifications" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_version_work_days_order_idx" ON "_practitioners_v_version_work_days" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_version_work_days_parent_idx" ON "_practitioners_v_version_work_days" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_parent_idx" ON "_practitioners_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_version_version_avatar_idx" ON "_practitioners_v" USING btree ("version_avatar_id");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_version_version_slug_idx" ON "_practitioners_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_version_version_updated_at_idx" ON "_practitioners_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_version_version_created_at_idx" ON "_practitioners_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_version_version__status_idx" ON "_practitioners_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_created_at_idx" ON "_practitioners_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_updated_at_idx" ON "_practitioners_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_latest_idx" ON "_practitioners_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_autosave_idx" ON "_practitioners_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_rels_order_idx" ON "_practitioners_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_rels_parent_idx" ON "_practitioners_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_rels_path_idx" ON "_practitioners_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_practitioners_v_rels_treatments_id_idx" ON "_practitioners_v_rels" USING btree ("treatments_id");
  CREATE INDEX IF NOT EXISTS "appointments_preferred_time_order_idx" ON "appointments_preferred_time" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "appointments_preferred_time_parent_idx" ON "appointments_preferred_time" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "appointments_updated_at_idx" ON "appointments" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "appointments_created_at_idx" ON "appointments" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "beauty_services_benefits_order_idx" ON "beauty_services_benefits" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "beauty_services_benefits_parent_id_idx" ON "beauty_services_benefits" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "beauty_services_process_order_idx" ON "beauty_services_process" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "beauty_services_process_parent_id_idx" ON "beauty_services_process" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "beauty_services_tags_order_idx" ON "beauty_services_tags" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "beauty_services_tags_parent_idx" ON "beauty_services_tags" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "beauty_services_gallery_order_idx" ON "beauty_services_gallery" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "beauty_services_gallery_parent_id_idx" ON "beauty_services_gallery" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "beauty_services_gallery_image_idx" ON "beauty_services_gallery" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "beauty_services_featured_image_idx" ON "beauty_services" USING btree ("featured_image_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "beauty_services_slug_idx" ON "beauty_services" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "beauty_services_updated_at_idx" ON "beauty_services" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "beauty_services_created_at_idx" ON "beauty_services" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "beauty_services__status_idx" ON "beauty_services" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "beauty_services_rels_order_idx" ON "beauty_services_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "beauty_services_rels_parent_idx" ON "beauty_services_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "beauty_services_rels_path_idx" ON "beauty_services_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "beauty_services_rels_beauty_services_id_idx" ON "beauty_services_rels" USING btree ("beauty_services_id");
  CREATE INDEX IF NOT EXISTS "beauty_services_rels_stylists_id_idx" ON "beauty_services_rels" USING btree ("stylists_id");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_version_benefits_order_idx" ON "_beauty_services_v_version_benefits" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_version_benefits_parent_id_idx" ON "_beauty_services_v_version_benefits" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_version_process_order_idx" ON "_beauty_services_v_version_process" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_version_process_parent_id_idx" ON "_beauty_services_v_version_process" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_version_tags_order_idx" ON "_beauty_services_v_version_tags" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_version_tags_parent_idx" ON "_beauty_services_v_version_tags" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_version_gallery_order_idx" ON "_beauty_services_v_version_gallery" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_version_gallery_parent_id_idx" ON "_beauty_services_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_version_gallery_image_idx" ON "_beauty_services_v_version_gallery" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_parent_idx" ON "_beauty_services_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_version_version_featured_image_idx" ON "_beauty_services_v" USING btree ("version_featured_image_id");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_version_version_slug_idx" ON "_beauty_services_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_version_version_updated_at_idx" ON "_beauty_services_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_version_version_created_at_idx" ON "_beauty_services_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_version_version__status_idx" ON "_beauty_services_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_created_at_idx" ON "_beauty_services_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_updated_at_idx" ON "_beauty_services_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_latest_idx" ON "_beauty_services_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_autosave_idx" ON "_beauty_services_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_rels_order_idx" ON "_beauty_services_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_rels_parent_idx" ON "_beauty_services_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_rels_path_idx" ON "_beauty_services_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_rels_beauty_services_id_idx" ON "_beauty_services_v_rels" USING btree ("beauty_services_id");
  CREATE INDEX IF NOT EXISTS "_beauty_services_v_rels_stylists_id_idx" ON "_beauty_services_v_rels" USING btree ("stylists_id");
  CREATE INDEX IF NOT EXISTS "stylists_specialties_order_idx" ON "stylists_specialties" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "stylists_specialties_parent_id_idx" ON "stylists_specialties" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "stylists_certifications_order_idx" ON "stylists_certifications" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "stylists_certifications_parent_id_idx" ON "stylists_certifications" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "stylists_work_days_order_idx" ON "stylists_work_days" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "stylists_work_days_parent_idx" ON "stylists_work_days" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "stylists_portfolio_order_idx" ON "stylists_portfolio" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "stylists_portfolio_parent_id_idx" ON "stylists_portfolio" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "stylists_portfolio_image_idx" ON "stylists_portfolio" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "stylists_avatar_idx" ON "stylists" USING btree ("avatar_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "stylists_slug_idx" ON "stylists" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "stylists_updated_at_idx" ON "stylists" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "stylists_created_at_idx" ON "stylists" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "stylists__status_idx" ON "stylists" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "stylists_rels_order_idx" ON "stylists_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "stylists_rels_parent_idx" ON "stylists_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "stylists_rels_path_idx" ON "stylists_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "stylists_rels_beauty_services_id_idx" ON "stylists_rels" USING btree ("beauty_services_id");
  CREATE INDEX IF NOT EXISTS "_stylists_v_version_specialties_order_idx" ON "_stylists_v_version_specialties" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_stylists_v_version_specialties_parent_id_idx" ON "_stylists_v_version_specialties" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_stylists_v_version_certifications_order_idx" ON "_stylists_v_version_certifications" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_stylists_v_version_certifications_parent_id_idx" ON "_stylists_v_version_certifications" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_stylists_v_version_work_days_order_idx" ON "_stylists_v_version_work_days" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_stylists_v_version_work_days_parent_idx" ON "_stylists_v_version_work_days" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_stylists_v_version_portfolio_order_idx" ON "_stylists_v_version_portfolio" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_stylists_v_version_portfolio_parent_id_idx" ON "_stylists_v_version_portfolio" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_stylists_v_version_portfolio_image_idx" ON "_stylists_v_version_portfolio" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_stylists_v_parent_idx" ON "_stylists_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_stylists_v_version_version_avatar_idx" ON "_stylists_v" USING btree ("version_avatar_id");
  CREATE INDEX IF NOT EXISTS "_stylists_v_version_version_slug_idx" ON "_stylists_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_stylists_v_version_version_updated_at_idx" ON "_stylists_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_stylists_v_version_version_created_at_idx" ON "_stylists_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_stylists_v_version_version__status_idx" ON "_stylists_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_stylists_v_created_at_idx" ON "_stylists_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_stylists_v_updated_at_idx" ON "_stylists_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_stylists_v_latest_idx" ON "_stylists_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_stylists_v_autosave_idx" ON "_stylists_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_stylists_v_rels_order_idx" ON "_stylists_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_stylists_v_rels_parent_idx" ON "_stylists_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_stylists_v_rels_path_idx" ON "_stylists_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_stylists_v_rels_beauty_services_id_idx" ON "_stylists_v_rels" USING btree ("beauty_services_id");
  CREATE INDEX IF NOT EXISTS "beauty_bookings_preferred_time_slots_order_idx" ON "beauty_bookings_preferred_time_slots" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "beauty_bookings_preferred_time_slots_parent_idx" ON "beauty_bookings_preferred_time_slots" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "beauty_bookings_service_idx" ON "beauty_bookings" USING btree ("service_id");
  CREATE INDEX IF NOT EXISTS "beauty_bookings_stylist_idx" ON "beauty_bookings" USING btree ("stylist_id");
  CREATE INDEX IF NOT EXISTS "beauty_bookings_updated_at_idx" ON "beauty_bookings" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "beauty_bookings_created_at_idx" ON "beauty_bookings" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "menu_items_allergens_order_idx" ON "menu_items_allergens" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "menu_items_allergens_parent_id_idx" ON "menu_items_allergens" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "menu_items_image_idx" ON "menu_items" USING btree ("image_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "menu_items_slug_idx" ON "menu_items" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "menu_items_updated_at_idx" ON "menu_items" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "menu_items_created_at_idx" ON "menu_items" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "menu_items__status_idx" ON "menu_items" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_menu_items_v_version_allergens_order_idx" ON "_menu_items_v_version_allergens" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_menu_items_v_version_allergens_parent_id_idx" ON "_menu_items_v_version_allergens" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_menu_items_v_parent_idx" ON "_menu_items_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_menu_items_v_version_version_image_idx" ON "_menu_items_v" USING btree ("version_image_id");
  CREATE INDEX IF NOT EXISTS "_menu_items_v_version_version_slug_idx" ON "_menu_items_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_menu_items_v_version_version_updated_at_idx" ON "_menu_items_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_menu_items_v_version_version_created_at_idx" ON "_menu_items_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_menu_items_v_version_version__status_idx" ON "_menu_items_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_menu_items_v_created_at_idx" ON "_menu_items_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_menu_items_v_updated_at_idx" ON "_menu_items_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_menu_items_v_latest_idx" ON "_menu_items_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_menu_items_v_autosave_idx" ON "_menu_items_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "reservations_preferences_order_idx" ON "reservations_preferences" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "reservations_preferences_parent_idx" ON "reservations_preferences" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "reservations_updated_at_idx" ON "reservations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "reservations_created_at_idx" ON "reservations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "events_gallery_order_idx" ON "events_gallery" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_gallery_parent_id_idx" ON "events_gallery" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "events_gallery_image_idx" ON "events_gallery" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "events_tags_order_idx" ON "events_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_tags_parent_id_idx" ON "events_tags" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "events_image_idx" ON "events" USING btree ("image_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_events_v_version_gallery_order_idx" ON "_events_v_version_gallery" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_events_v_version_gallery_parent_id_idx" ON "_events_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_events_v_version_gallery_image_idx" ON "_events_v_version_gallery" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_events_v_version_tags_order_idx" ON "_events_v_version_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_events_v_version_tags_parent_id_idx" ON "_events_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_events_v_version_version_image_idx" ON "_events_v" USING btree ("version_image_id");
  CREATE INDEX IF NOT EXISTS "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_events_v_autosave_idx" ON "_events_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "client_requests_website_pages_order_idx" ON "client_requests_website_pages" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "client_requests_website_pages_parent_idx" ON "client_requests_website_pages" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "client_requests_payment_methods_order_idx" ON "client_requests_payment_methods" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "client_requests_payment_methods_parent_idx" ON "client_requests_payment_methods" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "client_requests_created_user_idx" ON "client_requests" USING btree ("created_user_id");
  CREATE INDEX IF NOT EXISTS "client_requests_created_client_idx" ON "client_requests" USING btree ("created_client_id");
  CREATE INDEX IF NOT EXISTS "client_requests_updated_at_idx" ON "client_requests" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "client_requests_created_at_idx" ON "client_requests" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "clients_domain_idx" ON "clients" USING btree ("domain");
  CREATE INDEX IF NOT EXISTS "clients_updated_at_idx" ON "clients" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "clients_created_at_idx" ON "clients" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "deployments_client_idx" ON "deployments" USING btree ("client_id");
  CREATE INDEX IF NOT EXISTS "deployments_updated_at_idx" ON "deployments" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "deployments_created_at_idx" ON "deployments" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX IF NOT EXISTS "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX IF NOT EXISTS "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_notifications_id_idx" ON "payload_locked_documents_rels" USING btree ("notifications_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_themes_id_idx" ON "payload_locked_documents_rels" USING btree ("themes_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_product_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("product_categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_brands_id_idx" ON "payload_locked_documents_rels" USING btree ("brands_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_recently_viewed_id_idx" ON "payload_locked_documents_rels" USING btree ("recently_viewed_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_edition_notifications_id_idx" ON "payload_locked_documents_rels" USING btree ("edition_notifications_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_customer_groups_id_idx" ON "payload_locked_documents_rels" USING btree ("customer_groups_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_lists_id_idx" ON "payload_locked_documents_rels" USING btree ("order_lists_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_recurring_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("recurring_orders_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_invoices_id_idx" ON "payload_locked_documents_rels" USING btree ("invoices_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_returns_id_idx" ON "payload_locked_documents_rels" USING btree ("returns_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_subscription_plans_id_idx" ON "payload_locked_documents_rels" USING btree ("subscription_plans_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_user_subscriptions_id_idx" ON "payload_locked_documents_rels" USING btree ("user_subscriptions_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_payment_methods_id_idx" ON "payload_locked_documents_rels" USING btree ("payment_methods_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_gift_vouchers_id_idx" ON "payload_locked_documents_rels" USING btree ("gift_vouchers_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_licenses_id_idx" ON "payload_locked_documents_rels" USING btree ("licenses_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_license_activations_id_idx" ON "payload_locked_documents_rels" USING btree ("license_activations_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_loyalty_tiers_id_idx" ON "payload_locked_documents_rels" USING btree ("loyalty_tiers_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_loyalty_rewards_id_idx" ON "payload_locked_documents_rels" USING btree ("loyalty_rewards_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_loyalty_points_id_idx" ON "payload_locked_documents_rels" USING btree ("loyalty_points_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_loyalty_transactions_id_idx" ON "payload_locked_documents_rels" USING btree ("loyalty_transactions_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_loyalty_redemptions_id_idx" ON "payload_locked_documents_rels" USING btree ("loyalty_redemptions_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_ab_tests_id_idx" ON "payload_locked_documents_rels" USING btree ("ab_tests_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_ab_test_results_id_idx" ON "payload_locked_documents_rels" USING btree ("ab_test_results_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_blog_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_posts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_blog_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_cases_id_idx" ON "payload_locked_documents_rels" USING btree ("cases_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_vendors_id_idx" ON "payload_locked_documents_rels" USING btree ("vendors_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_vendor_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("vendor_reviews_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_workshops_id_idx" ON "payload_locked_documents_rels" USING btree ("workshops_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_construction_services_id_idx" ON "payload_locked_documents_rels" USING btree ("construction_services_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_construction_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("construction_projects_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_construction_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("construction_reviews_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_quote_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("quote_requests_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_treatments_id_idx" ON "payload_locked_documents_rels" USING btree ("treatments_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_practitioners_id_idx" ON "payload_locked_documents_rels" USING btree ("practitioners_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_appointments_id_idx" ON "payload_locked_documents_rels" USING btree ("appointments_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_beauty_services_id_idx" ON "payload_locked_documents_rels" USING btree ("beauty_services_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_stylists_id_idx" ON "payload_locked_documents_rels" USING btree ("stylists_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_beauty_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("beauty_bookings_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_menu_items_id_idx" ON "payload_locked_documents_rels" USING btree ("menu_items_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_reservations_id_idx" ON "payload_locked_documents_rels" USING btree ("reservations_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_client_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("client_requests_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_clients_id_idx" ON "payload_locked_documents_rels" USING btree ("clients_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_deployments_id_idx" ON "payload_locked_documents_rels" USING btree ("deployments_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "settings_hours_order_idx" ON "settings_hours" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "settings_hours_parent_id_idx" ON "settings_hours" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "settings_sitemap_exclude_order_idx" ON "settings_sitemap_exclude" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "settings_sitemap_exclude_parent_id_idx" ON "settings_sitemap_exclude" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "settings_robots_disallow_order_idx" ON "settings_robots_disallow" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "settings_robots_disallow_parent_id_idx" ON "settings_robots_disallow" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "settings_logo_idx" ON "settings" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "settings_logo_white_idx" ON "settings" USING btree ("logo_white_id");
  CREATE INDEX IF NOT EXISTS "settings_favicon_idx" ON "settings" USING btree ("favicon_id");
  CREATE INDEX IF NOT EXISTS "settings_default_o_g_image_idx" ON "settings" USING btree ("default_o_g_image_id");
  CREATE INDEX IF NOT EXISTS "settings_rels_order_idx" ON "settings_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "settings_rels_parent_idx" ON "settings_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "settings_rels_path_idx" ON "settings_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "settings_rels_media_id_idx" ON "settings_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "header_top_bar_left_messages_order_idx" ON "header_top_bar_left_messages" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "header_top_bar_left_messages_parent_id_idx" ON "header_top_bar_left_messages" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "header_top_bar_right_links_order_idx" ON "header_top_bar_right_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "header_top_bar_right_links_parent_id_idx" ON "header_top_bar_right_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "header_custom_buttons_order_idx" ON "header_custom_buttons" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "header_custom_buttons_parent_id_idx" ON "header_custom_buttons" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "header_navigation_special_items_order_idx" ON "header_navigation_special_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "header_navigation_special_items_parent_id_idx" ON "header_navigation_special_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "header_navigation_items_children_order_idx" ON "header_navigation_items_children" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "header_navigation_items_children_parent_id_idx" ON "header_navigation_items_children" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "header_navigation_items_children_page_idx" ON "header_navigation_items_children" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "header_navigation_items_order_idx" ON "header_navigation_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "header_navigation_items_parent_id_idx" ON "header_navigation_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "header_navigation_items_page_idx" ON "header_navigation_items" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "header_logo_override_idx" ON "header" USING btree ("logo_override_id");
  CREATE INDEX IF NOT EXISTS "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_columns_links_page_idx" ON "footer_columns_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_indexed_collections_order_idx" ON "meilisearch_settings_indexed_collections" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_indexed_collections_parent_id_idx" ON "meilisearch_settings_indexed_collections" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_searchable_fields_products_order_idx" ON "meilisearch_settings_searchable_fields_products" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_searchable_fields_products_parent_id_idx" ON "meilisearch_settings_searchable_fields_products" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_searchable_fields_blog_posts_order_idx" ON "meilisearch_settings_searchable_fields_blog_posts" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_searchable_fields_blog_posts_parent_id_idx" ON "meilisearch_settings_searchable_fields_blog_posts" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_searchable_fields_pages_order_idx" ON "meilisearch_settings_searchable_fields_pages" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_searchable_fields_pages_parent_id_idx" ON "meilisearch_settings_searchable_fields_pages" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_filterable_fields_products_order_idx" ON "meilisearch_settings_filterable_fields_products" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_filterable_fields_products_parent_id_idx" ON "meilisearch_settings_filterable_fields_products" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_filterable_fields_blog_posts_order_idx" ON "meilisearch_settings_filterable_fields_blog_posts" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_filterable_fields_blog_posts_parent_id_idx" ON "meilisearch_settings_filterable_fields_blog_posts" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_sortable_fields_products_order_idx" ON "meilisearch_settings_sortable_fields_products" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_sortable_fields_products_parent_id_idx" ON "meilisearch_settings_sortable_fields_products" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_sortable_fields_blog_posts_order_idx" ON "meilisearch_settings_sortable_fields_blog_posts" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_sortable_fields_blog_posts_parent_id_idx" ON "meilisearch_settings_sortable_fields_blog_posts" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_ranking_rules_order_idx" ON "meilisearch_settings_ranking_rules" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_ranking_rules_parent_id_idx" ON "meilisearch_settings_ranking_rules" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_custom_ranking_attributes_order_idx" ON "meilisearch_settings_custom_ranking_attributes" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_custom_ranking_attributes_parent_id_idx" ON "meilisearch_settings_custom_ranking_attributes" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_typo_tolerance_disable_on_words_order_idx" ON "meilisearch_settings_typo_tolerance_disable_on_words" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_typo_tolerance_disable_on_words_parent_id_idx" ON "meilisearch_settings_typo_tolerance_disable_on_words" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_synonyms_order_idx" ON "meilisearch_settings_synonyms" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_synonyms_parent_id_idx" ON "meilisearch_settings_synonyms" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_stop_words_order_idx" ON "meilisearch_settings_stop_words" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_stop_words_parent_id_idx" ON "meilisearch_settings_stop_words" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_exclude_patterns_order_idx" ON "meilisearch_settings_exclude_patterns" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_exclude_patterns_parent_id_idx" ON "meilisearch_settings_exclude_patterns" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_exclude_statuses_order_idx" ON "meilisearch_settings_exclude_statuses" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "meilisearch_settings_exclude_statuses_parent_id_idx" ON "meilisearch_settings_exclude_statuses" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "chatbot_settings_suggested_questions_order_idx" ON "chatbot_settings_suggested_questions" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "chatbot_settings_suggested_questions_parent_id_idx" ON "chatbot_settings_suggested_questions" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "chatbot_settings_rate_limiting_blocked_i_ps_order_idx" ON "chatbot_settings_rate_limiting_blocked_i_ps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "chatbot_settings_rate_limiting_blocked_i_ps_parent_id_idx" ON "chatbot_settings_rate_limiting_blocked_i_ps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "chatbot_settings_moderation_blocked_keywords_order_idx" ON "chatbot_settings_moderation_blocked_keywords" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "chatbot_settings_moderation_blocked_keywords_parent_id_idx" ON "chatbot_settings_moderation_blocked_keywords" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "users_addresses" CASCADE;
  DROP TABLE IF EXISTS "users_roles" CASCADE;
  DROP TABLE IF EXISTS "users_favorites" CASCADE;
  DROP TABLE IF EXISTS "users_sessions" CASCADE;
  DROP TABLE IF EXISTS "users" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_banner" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_spacer" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_hero_buttons" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_hero" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_content" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_media_block_buttons" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_media_block" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_two_column" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_product_grid" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_category_grid" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_quick_order" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_cta_buttons" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_cta" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_calltoaction" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_contact_opening_hours" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_contact" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_contact_form" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_newsletter" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_features_features" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_features" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_services_services" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_services" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_testimonials_testimonials" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_testimonials" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_cases" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_logo_bar_logos" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_logo_bar" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_stats_stats" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_stats" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_faq_faqs" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_faq" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_team_members" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_team" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_accordion_items" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_accordion" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_blog_preview" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_comparison_columns" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_comparison_rows_values" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_comparison_rows" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_comparison" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_infobox" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_image_gallery_images" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_image_gallery" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_video" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_code" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_map" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_construction_hero_avatars" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_construction_hero_floating_badges" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_construction_hero" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_services_grid" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_projects_grid" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_reviews_grid" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_stats_bar_stats" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_stats_bar" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_cta_banner_buttons" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_cta_banner_trust_elements_items" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_cta_banner" CASCADE;
  DROP TABLE IF EXISTS "pages" CASCADE;
  DROP TABLE IF EXISTS "pages_rels" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_banner" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_spacer" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_hero_buttons" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_hero" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_content" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_media_block_buttons" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_media_block" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_two_column" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_product_grid" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_category_grid" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_quick_order" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_cta_buttons" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_cta" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_calltoaction" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_contact_opening_hours" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_contact" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_contact_form" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_newsletter" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_features_features" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_features" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_services_services" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_services" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_testimonials_testimonials" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_cases" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_logo_bar_logos" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_logo_bar" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_stats_stats" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_stats" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_faq_faqs" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_faq" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_team_members" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_team" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_accordion_items" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_accordion" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_blog_preview" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_comparison_columns" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_comparison_rows_values" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_comparison_rows" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_comparison" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_infobox" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_image_gallery_images" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_image_gallery" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_video" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_code" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_map" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_construction_hero_avatars" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_construction_hero_floating_badges" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_construction_hero" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_services_grid" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_projects_grid" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_reviews_grid" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_stats_bar_stats" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_stats_bar" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_cta_banner_buttons" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_cta_banner_trust_elements_items" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_cta_banner" CASCADE;
  DROP TABLE IF EXISTS "_pages_v" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_rels" CASCADE;
  DROP TABLE IF EXISTS "media" CASCADE;
  DROP TABLE IF EXISTS "partners" CASCADE;
  DROP TABLE IF EXISTS "services" CASCADE;
  DROP TABLE IF EXISTS "notifications" CASCADE;
  DROP TABLE IF EXISTS "themes_custom_colors" CASCADE;
  DROP TABLE IF EXISTS "themes" CASCADE;
  DROP TABLE IF EXISTS "products_tags" CASCADE;
  DROP TABLE IF EXISTS "products_videos" CASCADE;
  DROP TABLE IF EXISTS "products_child_products" CASCADE;
  DROP TABLE IF EXISTS "products_meta_keywords" CASCADE;
  DROP TABLE IF EXISTS "products_specifications_attributes" CASCADE;
  DROP TABLE IF EXISTS "products_specifications" CASCADE;
  DROP TABLE IF EXISTS "products_variant_options_values" CASCADE;
  DROP TABLE IF EXISTS "products_variant_options" CASCADE;
  DROP TABLE IF EXISTS "products" CASCADE;
  DROP TABLE IF EXISTS "products_rels" CASCADE;
  DROP TABLE IF EXISTS "product_categories" CASCADE;
  DROP TABLE IF EXISTS "brands" CASCADE;
  DROP TABLE IF EXISTS "recently_viewed" CASCADE;
  DROP TABLE IF EXISTS "edition_notifications" CASCADE;
  DROP TABLE IF EXISTS "customer_groups" CASCADE;
  DROP TABLE IF EXISTS "orders_items" CASCADE;
  DROP TABLE IF EXISTS "orders_timeline" CASCADE;
  DROP TABLE IF EXISTS "orders" CASCADE;
  DROP TABLE IF EXISTS "order_lists_items" CASCADE;
  DROP TABLE IF EXISTS "order_lists_share_with" CASCADE;
  DROP TABLE IF EXISTS "order_lists" CASCADE;
  DROP TABLE IF EXISTS "recurring_orders_items" CASCADE;
  DROP TABLE IF EXISTS "recurring_orders" CASCADE;
  DROP TABLE IF EXISTS "recurring_orders_rels" CASCADE;
  DROP TABLE IF EXISTS "invoices_items" CASCADE;
  DROP TABLE IF EXISTS "invoices" CASCADE;
  DROP TABLE IF EXISTS "returns_items" CASCADE;
  DROP TABLE IF EXISTS "returns" CASCADE;
  DROP TABLE IF EXISTS "returns_rels" CASCADE;
  DROP TABLE IF EXISTS "subscription_plans_features" CASCADE;
  DROP TABLE IF EXISTS "subscription_plans" CASCADE;
  DROP TABLE IF EXISTS "user_subscriptions_addons" CASCADE;
  DROP TABLE IF EXISTS "user_subscriptions" CASCADE;
  DROP TABLE IF EXISTS "payment_methods" CASCADE;
  DROP TABLE IF EXISTS "gift_vouchers" CASCADE;
  DROP TABLE IF EXISTS "licenses_downloads" CASCADE;
  DROP TABLE IF EXISTS "licenses" CASCADE;
  DROP TABLE IF EXISTS "license_activations" CASCADE;
  DROP TABLE IF EXISTS "loyalty_tiers_benefits" CASCADE;
  DROP TABLE IF EXISTS "loyalty_tiers" CASCADE;
  DROP TABLE IF EXISTS "loyalty_rewards" CASCADE;
  DROP TABLE IF EXISTS "loyalty_points" CASCADE;
  DROP TABLE IF EXISTS "loyalty_transactions" CASCADE;
  DROP TABLE IF EXISTS "loyalty_redemptions" CASCADE;
  DROP TABLE IF EXISTS "ab_tests_variants" CASCADE;
  DROP TABLE IF EXISTS "ab_tests" CASCADE;
  DROP TABLE IF EXISTS "ab_test_results" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_tags" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_faq" CASCADE;
  DROP TABLE IF EXISTS "blog_posts" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_rels" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_version_tags" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_version_faq" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_rels" CASCADE;
  DROP TABLE IF EXISTS "blog_categories" CASCADE;
  DROP TABLE IF EXISTS "faqs" CASCADE;
  DROP TABLE IF EXISTS "cases_services" CASCADE;
  DROP TABLE IF EXISTS "cases_gallery" CASCADE;
  DROP TABLE IF EXISTS "cases" CASCADE;
  DROP TABLE IF EXISTS "testimonials" CASCADE;
  DROP TABLE IF EXISTS "vendors_certifications" CASCADE;
  DROP TABLE IF EXISTS "vendors" CASCADE;
  DROP TABLE IF EXISTS "vendors_rels" CASCADE;
  DROP TABLE IF EXISTS "vendor_reviews" CASCADE;
  DROP TABLE IF EXISTS "workshops_target_audience" CASCADE;
  DROP TABLE IF EXISTS "workshops_learning_objectives" CASCADE;
  DROP TABLE IF EXISTS "workshops" CASCADE;
  DROP TABLE IF EXISTS "construction_services_features" CASCADE;
  DROP TABLE IF EXISTS "construction_services_process_steps" CASCADE;
  DROP TABLE IF EXISTS "construction_services_service_types" CASCADE;
  DROP TABLE IF EXISTS "construction_services_usps" CASCADE;
  DROP TABLE IF EXISTS "construction_services_faq" CASCADE;
  DROP TABLE IF EXISTS "construction_services" CASCADE;
  DROP TABLE IF EXISTS "construction_services_rels" CASCADE;
  DROP TABLE IF EXISTS "construction_projects_badges" CASCADE;
  DROP TABLE IF EXISTS "construction_projects" CASCADE;
  DROP TABLE IF EXISTS "construction_projects_rels" CASCADE;
  DROP TABLE IF EXISTS "construction_reviews" CASCADE;
  DROP TABLE IF EXISTS "quote_requests" CASCADE;
  DROP TABLE IF EXISTS "quote_requests_rels" CASCADE;
  DROP TABLE IF EXISTS "treatments_symptoms" CASCADE;
  DROP TABLE IF EXISTS "treatments_process" CASCADE;
  DROP TABLE IF EXISTS "treatments_gallery" CASCADE;
  DROP TABLE IF EXISTS "treatments" CASCADE;
  DROP TABLE IF EXISTS "treatments_rels" CASCADE;
  DROP TABLE IF EXISTS "_treatments_v_version_symptoms" CASCADE;
  DROP TABLE IF EXISTS "_treatments_v_version_process" CASCADE;
  DROP TABLE IF EXISTS "_treatments_v_version_gallery" CASCADE;
  DROP TABLE IF EXISTS "_treatments_v" CASCADE;
  DROP TABLE IF EXISTS "_treatments_v_rels" CASCADE;
  DROP TABLE IF EXISTS "practitioners_specializations" CASCADE;
  DROP TABLE IF EXISTS "practitioners_qualifications" CASCADE;
  DROP TABLE IF EXISTS "practitioners_work_days" CASCADE;
  DROP TABLE IF EXISTS "practitioners" CASCADE;
  DROP TABLE IF EXISTS "practitioners_rels" CASCADE;
  DROP TABLE IF EXISTS "_practitioners_v_version_specializations" CASCADE;
  DROP TABLE IF EXISTS "_practitioners_v_version_qualifications" CASCADE;
  DROP TABLE IF EXISTS "_practitioners_v_version_work_days" CASCADE;
  DROP TABLE IF EXISTS "_practitioners_v" CASCADE;
  DROP TABLE IF EXISTS "_practitioners_v_rels" CASCADE;
  DROP TABLE IF EXISTS "appointments_preferred_time" CASCADE;
  DROP TABLE IF EXISTS "appointments" CASCADE;
  DROP TABLE IF EXISTS "beauty_services_benefits" CASCADE;
  DROP TABLE IF EXISTS "beauty_services_process" CASCADE;
  DROP TABLE IF EXISTS "beauty_services_tags" CASCADE;
  DROP TABLE IF EXISTS "beauty_services_gallery" CASCADE;
  DROP TABLE IF EXISTS "beauty_services" CASCADE;
  DROP TABLE IF EXISTS "beauty_services_rels" CASCADE;
  DROP TABLE IF EXISTS "_beauty_services_v_version_benefits" CASCADE;
  DROP TABLE IF EXISTS "_beauty_services_v_version_process" CASCADE;
  DROP TABLE IF EXISTS "_beauty_services_v_version_tags" CASCADE;
  DROP TABLE IF EXISTS "_beauty_services_v_version_gallery" CASCADE;
  DROP TABLE IF EXISTS "_beauty_services_v" CASCADE;
  DROP TABLE IF EXISTS "_beauty_services_v_rels" CASCADE;
  DROP TABLE IF EXISTS "stylists_specialties" CASCADE;
  DROP TABLE IF EXISTS "stylists_certifications" CASCADE;
  DROP TABLE IF EXISTS "stylists_work_days" CASCADE;
  DROP TABLE IF EXISTS "stylists_portfolio" CASCADE;
  DROP TABLE IF EXISTS "stylists" CASCADE;
  DROP TABLE IF EXISTS "stylists_rels" CASCADE;
  DROP TABLE IF EXISTS "_stylists_v_version_specialties" CASCADE;
  DROP TABLE IF EXISTS "_stylists_v_version_certifications" CASCADE;
  DROP TABLE IF EXISTS "_stylists_v_version_work_days" CASCADE;
  DROP TABLE IF EXISTS "_stylists_v_version_portfolio" CASCADE;
  DROP TABLE IF EXISTS "_stylists_v" CASCADE;
  DROP TABLE IF EXISTS "_stylists_v_rels" CASCADE;
  DROP TABLE IF EXISTS "beauty_bookings_preferred_time_slots" CASCADE;
  DROP TABLE IF EXISTS "beauty_bookings" CASCADE;
  DROP TABLE IF EXISTS "menu_items_allergens" CASCADE;
  DROP TABLE IF EXISTS "menu_items" CASCADE;
  DROP TABLE IF EXISTS "_menu_items_v_version_allergens" CASCADE;
  DROP TABLE IF EXISTS "_menu_items_v" CASCADE;
  DROP TABLE IF EXISTS "reservations_preferences" CASCADE;
  DROP TABLE IF EXISTS "reservations" CASCADE;
  DROP TABLE IF EXISTS "events_gallery" CASCADE;
  DROP TABLE IF EXISTS "events_tags" CASCADE;
  DROP TABLE IF EXISTS "events" CASCADE;
  DROP TABLE IF EXISTS "_events_v_version_gallery" CASCADE;
  DROP TABLE IF EXISTS "_events_v_version_tags" CASCADE;
  DROP TABLE IF EXISTS "_events_v" CASCADE;
  DROP TABLE IF EXISTS "client_requests_website_pages" CASCADE;
  DROP TABLE IF EXISTS "client_requests_payment_methods" CASCADE;
  DROP TABLE IF EXISTS "client_requests" CASCADE;
  DROP TABLE IF EXISTS "clients" CASCADE;
  DROP TABLE IF EXISTS "deployments" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_checkbox" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_email" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_message" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_number" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_select_options" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_select" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_text" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_textarea" CASCADE;
  DROP TABLE IF EXISTS "forms_emails" CASCADE;
  DROP TABLE IF EXISTS "forms" CASCADE;
  DROP TABLE IF EXISTS "form_submissions_submission_data" CASCADE;
  DROP TABLE IF EXISTS "form_submissions" CASCADE;
  DROP TABLE IF EXISTS "redirects" CASCADE;
  DROP TABLE IF EXISTS "redirects_rels" CASCADE;
  DROP TABLE IF EXISTS "payload_kv" CASCADE;
  DROP TABLE IF EXISTS "payload_locked_documents" CASCADE;
  DROP TABLE IF EXISTS "payload_locked_documents_rels" CASCADE;
  DROP TABLE IF EXISTS "payload_preferences" CASCADE;
  DROP TABLE IF EXISTS "payload_preferences_rels" CASCADE;
  DROP TABLE IF EXISTS "payload_migrations" CASCADE;
  DROP TABLE IF EXISTS "settings_hours" CASCADE;
  DROP TABLE IF EXISTS "settings_sitemap_exclude" CASCADE;
  DROP TABLE IF EXISTS "settings_robots_disallow" CASCADE;
  DROP TABLE IF EXISTS "settings" CASCADE;
  DROP TABLE IF EXISTS "settings_rels" CASCADE;
  DROP TABLE IF EXISTS "theme" CASCADE;
  DROP TABLE IF EXISTS "header_top_bar_left_messages" CASCADE;
  DROP TABLE IF EXISTS "header_top_bar_right_links" CASCADE;
  DROP TABLE IF EXISTS "header_custom_buttons" CASCADE;
  DROP TABLE IF EXISTS "header_navigation_special_items" CASCADE;
  DROP TABLE IF EXISTS "header_navigation_items_children" CASCADE;
  DROP TABLE IF EXISTS "header_navigation_items" CASCADE;
  DROP TABLE IF EXISTS "header" CASCADE;
  DROP TABLE IF EXISTS "footer_columns_links" CASCADE;
  DROP TABLE IF EXISTS "footer_columns" CASCADE;
  DROP TABLE IF EXISTS "footer" CASCADE;
  DROP TABLE IF EXISTS "meilisearch_settings_indexed_collections" CASCADE;
  DROP TABLE IF EXISTS "meilisearch_settings_searchable_fields_products" CASCADE;
  DROP TABLE IF EXISTS "meilisearch_settings_searchable_fields_blog_posts" CASCADE;
  DROP TABLE IF EXISTS "meilisearch_settings_searchable_fields_pages" CASCADE;
  DROP TABLE IF EXISTS "meilisearch_settings_filterable_fields_products" CASCADE;
  DROP TABLE IF EXISTS "meilisearch_settings_filterable_fields_blog_posts" CASCADE;
  DROP TABLE IF EXISTS "meilisearch_settings_sortable_fields_products" CASCADE;
  DROP TABLE IF EXISTS "meilisearch_settings_sortable_fields_blog_posts" CASCADE;
  DROP TABLE IF EXISTS "meilisearch_settings_ranking_rules" CASCADE;
  DROP TABLE IF EXISTS "meilisearch_settings_custom_ranking_attributes" CASCADE;
  DROP TABLE IF EXISTS "meilisearch_settings_typo_tolerance_disable_on_words" CASCADE;
  DROP TABLE IF EXISTS "meilisearch_settings_synonyms" CASCADE;
  DROP TABLE IF EXISTS "meilisearch_settings_stop_words" CASCADE;
  DROP TABLE IF EXISTS "meilisearch_settings_exclude_patterns" CASCADE;
  DROP TABLE IF EXISTS "meilisearch_settings_exclude_statuses" CASCADE;
  DROP TABLE IF EXISTS "meilisearch_settings" CASCADE;
  DROP TABLE IF EXISTS "chatbot_settings_suggested_questions" CASCADE;
  DROP TABLE IF EXISTS "chatbot_settings_rate_limiting_blocked_i_ps" CASCADE;
  DROP TABLE IF EXISTS "chatbot_settings_moderation_blocked_keywords" CASCADE;
  DROP TABLE IF EXISTS "chatbot_settings" CASCADE;
  DO $$ BEGIN DROP TYPE "public"."chatbot_kb_search_collections"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_users_addresses_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_users_roles"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_users_client_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_banner_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_spacer_size"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_hero_buttons_style"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_hero_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_hero_background_style"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_hero_background_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_content_max_width"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_media_block_buttons_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_media_block_media_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_media_block_media_position"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_media_block_split"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_media_block_background_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_two_column_split"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_product_grid_source"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_product_grid_display_mode"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_product_grid_layout"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_category_grid_source"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_category_grid_layout"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_quick_order_input_mode"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_cta_buttons_style"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_cta_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_cta_style"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_calltoaction_background_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_newsletter_background_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_features_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_features_icon_style"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_features_alignment"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_services_services_icon_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_services_columns"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_testimonials_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_cases_source"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_cases_layout"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_logo_bar_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_stats_columns"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_stats_background_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_faq_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_team_columns"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_team_photo_style"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_team_background_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_blog_preview_columns"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_comparison_rows_values_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_infobox_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_infobox_max_width"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_infobox_margin_top"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_infobox_margin_bottom"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_image_gallery_columns"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_image_gallery_aspect_ratio"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_video_source"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_video_aspect_ratio"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_code_language"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_map_height"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_construction_hero_avatars_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_construction_hero_floating_badges_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_construction_hero_floating_badges_position"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_services_grid_services_source"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_services_grid_columns"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_projects_grid_projects_source"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_projects_grid_columns"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_reviews_grid_reviews_source"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_reviews_grid_columns"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_reviews_grid_layout"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_reviews_grid_average_rating_position"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_stats_bar_stats_icon"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_stats_bar_style"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_stats_bar_layout"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_cta_banner_buttons_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_cta_banner_trust_elements_items_icon"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_cta_banner_style"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_cta_banner_alignment"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_blocks_cta_banner_size"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_pages_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_banner_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_spacer_size"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_hero_buttons_style"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_hero_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_hero_background_style"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_hero_background_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_content_max_width"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_media_block_buttons_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_media_block_media_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_media_block_media_position"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_media_block_split"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_media_block_background_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_two_column_split"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_product_grid_source"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_product_grid_display_mode"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_product_grid_layout"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_category_grid_source"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_category_grid_layout"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_quick_order_input_mode"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_cta_buttons_style"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_cta_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_cta_style"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_calltoaction_background_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_newsletter_background_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_features_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_features_icon_style"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_features_alignment"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_services_services_icon_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_services_columns"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_testimonials_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_cases_source"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_cases_layout"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_logo_bar_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_stats_columns"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_stats_background_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_faq_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_team_columns"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_team_photo_style"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_team_background_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_blog_preview_columns"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_comparison_rows_values_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_infobox_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_infobox_max_width"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_infobox_margin_top"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_infobox_margin_bottom"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_image_gallery_columns"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_image_gallery_aspect_ratio"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_video_source"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_video_aspect_ratio"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_code_language"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_map_height"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_construction_hero_avatars_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_construction_hero_floating_badges_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_construction_hero_floating_badges_position"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_services_grid_services_source"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_services_grid_columns"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_projects_grid_projects_source"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_projects_grid_columns"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_reviews_grid_reviews_source"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_reviews_grid_columns"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_reviews_grid_layout"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_reviews_grid_average_rating_position"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_stats_bar_stats_icon"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_stats_bar_style"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_stats_bar_layout"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_cta_banner_buttons_variant"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_cta_banner_trust_elements_items_icon"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_cta_banner_style"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_cta_banner_alignment"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_blocks_cta_banner_size"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__pages_v_version_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_partners_category"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_partners_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_services_icon_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_services_category"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_services_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_notifications_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_notifications_category"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_notifications_icon"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_notifications_icon_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_notifications_priority"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_themes_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_products_videos_platform"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_products_variant_options_values_subscription_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_products_variant_options_display_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_products_product_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_products_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_products_condition"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_products_badge"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_products_tax_class"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_products_stock_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_products_weight_unit"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_recently_viewed_source"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_recently_viewed_device"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_customer_groups_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_orders_timeline_event"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_orders_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_orders_payment_method"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_orders_payment_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_orders_shipping_provider"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_orders_shipping_method"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_order_lists_icon"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_order_lists_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_recurring_orders_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_recurring_orders_frequency_unit"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_recurring_orders_payment_method"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_invoices_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_invoices_payment_method"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_returns_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_returns_return_reason"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_returns_product_condition"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_returns_preferred_resolution"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_returns_refund_method"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_subscription_plans_billing_interval"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_subscription_plans_tier"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_user_subscriptions_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_payment_methods_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_payment_methods_card_brand"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_gift_vouchers_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_gift_vouchers_occasion"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_gift_vouchers_delivery_method"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_licenses_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_licenses_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_license_activations_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_loyalty_rewards_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_loyalty_transactions_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_loyalty_redemptions_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_ab_tests_target_page"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_ab_tests_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_blog_posts_featured_tag"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_blog_posts_template"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_blog_posts_content_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_blog_posts_content_access_access_level"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_blog_posts_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__blog_posts_v_version_featured_tag"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__blog_posts_v_version_template"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__blog_posts_v_version_content_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__blog_posts_v_version_content_access_access_level"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__blog_posts_v_version_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_blog_categories_icon"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_blog_categories_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_faqs_category"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_faqs_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_cases_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_testimonials_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_vendors_certifications_icon"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_workshops_target_audience"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_workshops_location_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_workshops_category"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_workshops_level"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_workshops_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_construction_services_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_construction_services_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_construction_projects_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_construction_reviews_client_color"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_construction_reviews_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_quote_requests_project_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_quote_requests_budget"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_quote_requests_timeline"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_quote_requests_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_treatments_category"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_treatments_insurance"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_treatments_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__treatments_v_version_category"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__treatments_v_version_insurance"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__treatments_v_version_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_practitioners_work_days"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_practitioners_role"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_practitioners_availability"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_practitioners_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__practitioners_v_version_work_days"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__practitioners_v_version_role"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__practitioners_v_version_availability"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__practitioners_v_version_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_appointments_preferred_time"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_appointments_insurance"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_appointments_treatment"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_appointments_has_referral"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_appointments_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_appointments_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_beauty_services_tags"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_beauty_services_category"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_beauty_services_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__beauty_services_v_version_tags"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__beauty_services_v_version_category"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__beauty_services_v_version_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_stylists_work_days"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_stylists_role"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_stylists_availability"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_stylists_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__stylists_v_version_work_days"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__stylists_v_version_role"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__stylists_v_version_availability"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__stylists_v_version_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_beauty_bookings_preferred_time_slots"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_beauty_bookings_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_menu_items_allergens_allergen"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_menu_items_category"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_menu_items_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__menu_items_v_version_allergens_allergen"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__menu_items_v_version_category"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__menu_items_v_version_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_reservations_preferences"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_reservations_occasion"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_reservations_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_events_event_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_events_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__events_v_version_event_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__events_v_version_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_client_requests_website_pages"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_client_requests_payment_methods"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_client_requests_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_client_requests_site_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_client_requests_expected_products"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_clients_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_clients_plan"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_clients_template"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_clients_deployment_provider"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_clients_billing_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_clients_stripe_account_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_clients_payment_pricing_tier"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_clients_multi_safepay_account_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_clients_multi_safepay_pricing_tier"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_clients_health_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_deployments_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_deployments_environment"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_deployments_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_forms_confirmation_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_redirects_to_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_settings_hours_day"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_settings_default_product_template"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_settings_default_blog_template"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_settings_default_shop_archive_template"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_settings_default_cart_template"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_settings_default_checkout_template"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_settings_default_my_account_template"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_header_top_bar_left_messages_icon"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_header_custom_buttons_icon"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_header_custom_buttons_style"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_header_navigation_special_items_icon"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_header_navigation_special_items_position"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_header_navigation_items_icon"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_header_navigation_items_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_header_alert_bar_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_header_alert_bar_icon"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_header_navigation_mode"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_header_navigation_category_settings_mega_menu_style"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_footer_columns_links_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_meilisearch_settings_indexed_collections_collection"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_meilisearch_settings_searchable_fields_products_field"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_meilisearch_settings_searchable_fields_blog_posts_field"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_meilisearch_settings_searchable_fields_pages_field"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_meilisearch_settings_filterable_fields_products_field"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_meilisearch_settings_filterable_fields_blog_posts_field"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_meilisearch_settings_sortable_fields_products_field"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_meilisearch_settings_sortable_fields_blog_posts_field"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_meilisearch_settings_ranking_rules_rule"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_meilisearch_settings_custom_ranking_attributes_order"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_meilisearch_settings_exclude_patterns_type"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_meilisearch_settings_exclude_statuses_status"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_chatbot_settings_model"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_chatbot_settings_position"; EXCEPTION WHEN undefined_object THEN null; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_chatbot_settings_button_icon"; EXCEPTION WHEN undefined_object THEN null; END $$;`)
}
