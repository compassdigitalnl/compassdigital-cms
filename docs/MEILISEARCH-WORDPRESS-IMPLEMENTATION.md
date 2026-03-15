# Meilisearch Implementatie voor WordPress Bedrock

**Bron:** Volledige 1:1 vertaling van de CompassDigital Payload CMS implementatie
**Datum:** 11 maart 2026

---

## Inhoudsopgave

1. [Architectuur Overzicht](#1-architectuur-overzicht)
2. [Installatie & Configuratie](#2-installatie--configuratie)
3. [PHP Client & Indexing Service](#3-php-client--indexing-service)
4. [Document Transformatie (Products, Posts, Pages)](#4-document-transformatie)
5. [WordPress Hooks (Auto-Indexing)](#5-wordpress-hooks-auto-indexing)
6. [REST API Endpoints](#6-rest-api-endpoints)
7. [Admin Settings Pagina](#7-admin-settings-pagina)
8. [Frontend Zoekcomponenten](#8-frontend-zoekcomponenten)
9. [WP-CLI Commando's](#9-wp-cli-commandos)
10. [Deployment & Productie](#10-deployment--productie)

---

## 1. Architectuur Overzicht

### Hoe het werkt in Payload CMS (bron)

```
┌──────────────────────────┐
│  Payload CMS (Next.js)   │
│                          │
│  Collection Hooks:       │     ┌─────────────────────┐
│  afterChange → index     │────▶│   Meilisearch       │
│  afterDelete → delete    │     │   localhost:7700     │
│                          │     │                     │
│  API Routes:             │◀───▶│  Indexes:           │
│  /api/search             │     │  - products         │
│  /api/shop/search        │     │  - blog-posts       │
│                          │     │  - pages            │
│  Global Settings:        │     └─────────────────────┘
│  meilisearch-settings    │
└──────────────────────────┘
```

### Hoe het wordt in WordPress Bedrock

```
┌──────────────────────────┐
│  WordPress Bedrock       │
│                          │
│  Action Hooks:           │     ┌─────────────────────┐
│  save_post → index       │────▶│   Meilisearch       │
│  delete_post → delete    │     │   localhost:7700     │
│                          │     │                     │
│  REST API:               │◀───▶│  Indexes:           │
│  /wp-json/ms/v1/search   │     │  - products         │
│  /wp-json/ms/v1/shop     │     │  - posts            │
│                          │     │  - pages            │
│  Options Page:           │     └─────────────────────┘
│  Meilisearch Settings    │
└──────────────────────────┘
```

### Mapping Payload → WordPress

| Payload CMS | WordPress Bedrock |
|-------------|-------------------|
| Collection hooks (`afterChange`, `afterDelete`) | Action hooks (`save_post`, `before_delete_post`) |
| Next.js API Routes (`/api/search`) | WP REST API (`/wp-json/ms/v1/search`) |
| Payload Global (`meilisearch-settings`) | WordPress Options Page (ACF / custom) |
| `meilisearch` npm package | `meilisearch/meilisearch-php` Composer package |
| `product.categories` (relationship) | `wp_get_post_terms()` / WooCommerce taxonomies |
| `product.brand` (relationship) | Custom taxonomy of ACF relationship |
| Lexical JSON → tekst extractie | Gutenberg blocks → `wp_strip_all_tags(rendered)` |
| Environment vars (`.env`) | `.env` via Bedrock (vlado/phpdotenv) |

---

## 2. Installatie & Configuratie

### 2.1 Meilisearch Server Installeren

```bash
# Op de server (Ubuntu)
curl -L https://install.meilisearch.com | sh
sudo mv ./meilisearch /usr/local/bin/

# Systemd service aanmaken
sudo tee /etc/systemd/system/meilisearch.service > /dev/null <<EOF
[Unit]
Description=Meilisearch
After=network.target

[Service]
User=www-data
ExecStart=/usr/local/bin/meilisearch --http-addr 127.0.0.1:7700 --master-key YOUR_MASTER_KEY --env production --db-path /var/lib/meilisearch/data
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable meilisearch
sudo systemctl start meilisearch
```

Of via Docker:
```bash
docker run -d --name meilisearch \
  -p 7700:7700 \
  -v meilisearch_data:/meili_data \
  -e MEILI_MASTER_KEY=YOUR_MASTER_KEY \
  -e MEILI_ENV=production \
  getmeili/meilisearch:latest
```

### 2.2 Composer Package Installeren

```bash
cd /path/to/bedrock
composer require meilisearch/meilisearch-php
```

### 2.3 Environment Variables (.env)

```env
# Meilisearch
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_MASTER_KEY=your-master-key-here

# Index namen (optioneel, defaults hieronder)
MEILISEARCH_PRODUCTS_INDEX=products
MEILISEARCH_POSTS_INDEX=posts
MEILISEARCH_PAGES_INDEX=pages
```

### 2.4 Plugin Structuur

Maak een mu-plugin (must-use plugin) in `web/app/mu-plugins/`:

```
web/app/mu-plugins/
└── meilisearch/
    ├── meilisearch.php              ← Loader
    ├── src/
    │   ├── Client.php               ← Meilisearch client singleton
    │   ├── Settings.php             ← Default settings + merge logic
    │   ├── AdminPage.php            ← WP admin instellingen pagina
    │   ├── Hooks.php                ← WordPress action hooks
    │   ├── RestApi.php              ← REST API endpoints
    │   ├── CLI.php                  ← WP-CLI commando's
    │   └── Indexers/
    │       ├── ProductIndexer.php   ← WooCommerce product → Meilisearch doc
    │       ├── PostIndexer.php      ← Blog post → Meilisearch doc
    │       └── PageIndexer.php      ← Page → Meilisearch doc
    └── assets/
        ├── instant-search.js        ← Frontend zoekcomponent
        └── instant-search.css
```

---

## 3. PHP Client & Indexing Service

### 3.1 Plugin Loader (`meilisearch.php`)

```php
<?php
/**
 * Plugin Name: Meilisearch Integration
 * Description: Meilisearch zoekintegratie voor WordPress
 */

if (!defined('ABSPATH')) exit;

// Autoload via Bedrock's Composer
// (meilisearch/meilisearch-php is al geladen)

require_once __DIR__ . '/src/Client.php';
require_once __DIR__ . '/src/Settings.php';
require_once __DIR__ . '/src/AdminPage.php';
require_once __DIR__ . '/src/Hooks.php';
require_once __DIR__ . '/src/RestApi.php';
require_once __DIR__ . '/src/Indexers/ProductIndexer.php';
require_once __DIR__ . '/src/Indexers/PostIndexer.php';
require_once __DIR__ . '/src/Indexers/PageIndexer.php';

// Of gebruik een PSR-4 autoloader:
// spl_autoload_register(function ($class) { ... });

add_action('init', function () {
    \Meilisearch\Hooks::register();
    \Meilisearch\RestApi::register();
});

add_action('admin_menu', function () {
    \Meilisearch\AdminPage::register();
});

if (defined('WP_CLI') && WP_CLI) {
    require_once __DIR__ . '/src/CLI.php';
    WP_CLI::add_command('meilisearch', \Meilisearch\CLI::class);
}
```

### 3.2 Client Singleton (`src/Client.php`)

```php
<?php
namespace Meilisearch;

use MeiliSearch\Client as MeiliClient;

/**
 * Meilisearch Client — Singleton
 *
 * Equivalent van: src/features/search/lib/meilisearch/client.ts
 */
class Client
{
    private static ?MeiliClient $instance = null;

    // Index namen
    const INDEX_PRODUCTS = 'products';
    const INDEX_POSTS    = 'posts';
    const INDEX_PAGES    = 'pages';

    /**
     * Get Meilisearch client instance
     */
    public static function get(): ?MeiliClient
    {
        if (self::$instance === null) {
            $host = env('MEILISEARCH_HOST') ?: 'http://127.0.0.1:7700';
            $key  = env('MEILISEARCH_MASTER_KEY') ?: '';

            if (empty($host)) {
                error_log('[Meilisearch] MEILISEARCH_HOST not configured');
                return null;
            }

            self::$instance = new MeiliClient($host, $key);
        }
        return self::$instance;
    }

    /**
     * Get index name (configurable via env)
     */
    public static function indexName(string $type): string
    {
        return match ($type) {
            'products' => env('MEILISEARCH_PRODUCTS_INDEX') ?: self::INDEX_PRODUCTS,
            'posts'    => env('MEILISEARCH_POSTS_INDEX') ?: self::INDEX_POSTS,
            'pages'    => env('MEILISEARCH_PAGES_INDEX') ?: self::INDEX_PAGES,
            default    => $type,
        };
    }

    /**
     * Get or create an index
     *
     * Equivalent van: getOrCreateIndex() in client.ts
     */
    public static function getOrCreateIndex(string $name)
    {
        $client = self::get();
        if (!$client) return null;

        try {
            $index = $client->index($name);
            $index->getStats(); // Test of index bestaat
            return $index;
        } catch (\Exception $e) {
            if (str_contains($e->getMessage(), 'index_not_found')) {
                $task = $client->createIndex($name, ['primaryKey' => 'id']);
                $client->waitForTask($task['taskUid']);
                return $client->index($name);
            }
            throw $e;
        }
    }

    /**
     * Health check
     *
     * Equivalent van: isMeilisearchAvailable() in client.ts
     */
    public static function isAvailable(): bool
    {
        try {
            $client = self::get();
            if (!$client) return false;
            $client->health();
            return true;
        } catch (\Exception $e) {
            error_log('[Meilisearch] Not available: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Initialize all indexes with settings
     *
     * Equivalent van: initializeMeilisearch() in client.ts
     */
    public static function initialize(): bool
    {
        if (!self::isAvailable()) return false;

        try {
            self::configureIndex('products');
            self::configureIndex('posts');
            self::configureIndex('pages');
            return true;
        } catch (\Exception $e) {
            error_log('[Meilisearch] Init failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Configure a single index with settings
     *
     * Equivalent van: configureProductsIndex() / configureBlogIndex() in client.ts
     */
    public static function configureIndex(string $type): void
    {
        $indexName = self::indexName($type);
        $index = self::getOrCreateIndex($indexName);
        if (!$index) return;

        $settings = Settings::getForCollection($type);

        $index->updateSettings([
            'searchableAttributes'  => $settings['searchableAttributes'],
            'filterableAttributes'  => $settings['filterableAttributes'],
            'sortableAttributes'    => $settings['sortableAttributes'],
            'displayedAttributes'   => ['*'],
            'rankingRules'          => $settings['rankingRules'],
            'typoTolerance'        => $settings['typoTolerance'],
            'synonyms'             => $settings['synonyms'],
            'stopWords'            => $settings['stopWords'],
            'pagination'           => $settings['pagination'],
        ]);
    }
}
```

### 3.3 Settings (`src/Settings.php`)

```php
<?php
namespace Meilisearch;

/**
 * Meilisearch Settings — Defaults + CMS merge
 *
 * Equivalent van: src/features/search/lib/meilisearch/settings.ts
 *
 * WordPress options opgeslagen onder: 'meilisearch_settings'
 */
class Settings
{
    /**
     * Standaard settings (fallback)
     *
     * Exact dezelfde velden als DEFAULT_SETTINGS in settings.ts
     */
    const DEFAULTS = [
        'products' => [
            'searchableAttributes' => [
                'title', 'brand', 'sku', 'ean',
                'short_description', 'description',
                'categories', 'tags', 'specsFlatSearch',
            ],
            'filterableAttributes' => [
                'brand', 'brandId', 'brandLevel',
                'manufacturer', 'productLine',
                'categories', 'categoryIds',
                'price', 'effectivePrice',
                'stock', 'stockStatus',
                'status', 'featured', 'badge',
                'productType', 'backordersAllowed',
                'specs', 'hideFromCatalog',
            ],
            'sortableAttributes' => [
                'effectivePrice', 'createdAt', 'title', 'stock',
            ],
        ],
        'posts' => [
            'searchableAttributes' => [
                'title', 'excerpt', 'content',
                'categories', 'tags', 'author',
            ],
            'filterableAttributes' => [
                'categories', 'status', 'featured', 'publishedAt',
            ],
            'sortableAttributes' => [
                'publishedAt', 'title',
            ],
        ],
        'pages' => [
            'searchableAttributes' => [
                'title', 'content', 'slug',
            ],
            'filterableAttributes' => [
                'status',
            ],
            'sortableAttributes' => [
                'createdAt', 'title',
            ],
        ],
    ];

    /**
     * Standaard ranking rules
     */
    const DEFAULT_RANKING_RULES = [
        'words', 'typo', 'proximity', 'attribute', 'sort', 'exactness',
    ];

    /**
     * Standaard typo tolerance
     */
    const DEFAULT_TYPO_TOLERANCE = [
        'enabled' => true,
        'minWordSizeForTypos' => [
            'oneTypo'  => 4,
            'twoTypos' => 8,
        ],
    ];

    /**
     * Standaard pagination
     */
    const DEFAULT_PAGINATION = [
        'maxTotalHits' => 10000,
    ];

    /**
     * Get merged settings voor een collection
     */
    public static function getForCollection(string $type): array
    {
        $saved = get_option('meilisearch_settings', []);
        $defaults = self::DEFAULTS[$type] ?? self::DEFAULTS['pages'];

        // Merge: saved overschrijft defaults
        $searchable = !empty($saved[$type]['searchableAttributes'])
            ? $saved[$type]['searchableAttributes']
            : $defaults['searchableAttributes'];

        $filterable = !empty($saved[$type]['filterableAttributes'])
            ? $saved[$type]['filterableAttributes']
            : $defaults['filterableAttributes'];

        $sortable = !empty($saved[$type]['sortableAttributes'])
            ? $saved[$type]['sortableAttributes']
            : $defaults['sortableAttributes'];

        // Global settings
        $rankingRules = !empty($saved['rankingRules'])
            ? $saved['rankingRules']
            : self::DEFAULT_RANKING_RULES;

        $typoTolerance = array_merge(
            self::DEFAULT_TYPO_TOLERANCE,
            $saved['typoTolerance'] ?? []
        );

        // Synonymen: [['laptop', 'notebook', 'computer'], ...]
        $synonymGroups = $saved['synonyms'] ?? [];
        $synonyms = [];
        foreach ($synonymGroups as $group) {
            if (count($group) >= 2) {
                // Elke term wijst naar alle andere termen
                foreach ($group as $term) {
                    $synonyms[$term] = array_values(array_filter($group, fn($t) => $t !== $term));
                }
            }
        }

        $stopWords = $saved['stopWords'] ?? [];

        return [
            'searchableAttributes' => $searchable,
            'filterableAttributes' => $filterable,
            'sortableAttributes'   => $sortable,
            'rankingRules'         => $rankingRules,
            'typoTolerance'        => $typoTolerance,
            'synonyms'             => $synonyms,
            'stopWords'            => $stopWords,
            'pagination'           => self::DEFAULT_PAGINATION,
        ];
    }
}
```

---

## 4. Document Transformatie

### 4.1 Product Indexer (`src/Indexers/ProductIndexer.php`)

```php
<?php
namespace Meilisearch\Indexers;

use Meilisearch\Client;

/**
 * WooCommerce Product → Meilisearch Document
 *
 * Equivalent van: src/features/search/lib/meilisearch/indexProducts.ts
 *
 * Alle velden 1:1 overgenomen:
 * - Brand hierarchy (manufacturer/productLine)
 * - Specification faceting (spec_kleur, spec_maat)
 * - Grouped products (min price, aggregated stock)
 * - Image extraction
 */
class ProductIndexer
{
    /**
     * Transform WooCommerce product naar Meilisearch document
     *
     * Equivalent van: transformProductForSearch() in indexProducts.ts
     */
    public static function transform(\WC_Product $product): array
    {
        $id = $product->get_id();

        // Brand (custom taxonomy of ACF field)
        $brandName = null;
        $brandId = null;
        $manufacturer = null;
        $productLine = null;

        // Optie 1: Custom taxonomy 'product_brand'
        $brands = wp_get_post_terms($id, 'product_brand', ['fields' => 'all']);
        if (!is_wp_error($brands) && !empty($brands)) {
            $brand = $brands[0];
            $brandName = $brand->name;
            $brandId = $brand->term_id;

            // Hiërarchie: parent = manufacturer, child = productLine
            if ($brand->parent) {
                $parent = get_term($brand->parent, 'product_brand');
                $manufacturer = $parent ? $parent->name : null;
                $productLine = $brandName;
            } else {
                $manufacturer = $brandName;
            }
        }

        // Categories
        $categories = [];
        $categoryIds = [];
        $terms = wp_get_post_terms($id, 'product_cat', ['fields' => 'all']);
        if (!is_wp_error($terms)) {
            foreach ($terms as $term) {
                $categories[] = $term->name;
                $categoryIds[] = $term->term_id;
            }
        }

        // Tags
        $tags = [];
        $tagTerms = wp_get_post_terms($id, 'product_tag', ['fields' => 'names']);
        if (!is_wp_error($tagTerms)) {
            $tags = $tagTerms;
        }

        // Prijzen
        $price = (float) $product->get_regular_price() ?: null;
        $salePrice = (float) $product->get_sale_price() ?: null;
        $effectivePrice = $salePrice ?: $price;

        // Stock
        $stock = $product->get_stock_quantity() ?? 0;
        $stockStatus = $product->get_stock_status(); // 'instock', 'outofstock', 'onbackorder'
        // Normaliseer naar ons format
        $stockStatusNorm = match ($stockStatus) {
            'instock'     => 'in-stock',
            'onbackorder' => 'on-backorder',
            default       => 'out',
        };

        // Image
        $imageUrl = wp_get_attachment_url($product->get_image_id()) ?: null;

        // Specificaties (product attributes als facets)
        $specs = [];
        $specsFlatSearch = [];
        $flatSpecs = [];
        foreach ($product->get_attributes() as $attrKey => $attribute) {
            $attrName = $attribute->get_name();
            // Taxonomy-based attribute
            if ($attribute->is_taxonomy()) {
                $attrName = wc_attribute_label($attrName);
                $values = wc_get_product_terms($id, $attribute->get_name(), ['fields' => 'names']);
            } else {
                // Custom attribute
                $values = $attribute->get_options();
            }

            $key = sanitize_title($attrName); // Bijv. 'kleur', 'maat'
            $key = str_replace('-', '_', $key);

            $specs[$key] = $values;
            $specsFlatSearch = array_merge($specsFlatSearch, $values);
            $flatSpecs["spec_{$key}"] = $values;
        }

        // Grouped/Variable products: min prijs + geaggregeerde stock
        if ($product->is_type('grouped')) {
            $children = $product->get_children();
            $minPrice = null;
            $hasInStock = false;
            $hasBackorder = false;

            foreach ($children as $childId) {
                $child = wc_get_product($childId);
                if (!$child) continue;

                $cp = (float) ($child->get_sale_price() ?: $child->get_regular_price());
                if ($cp > 0 && ($minPrice === null || $cp < $minPrice)) {
                    $minPrice = $cp;
                }

                $cs = $child->get_stock_status();
                if ($cs === 'instock') $hasInStock = true;
                if ($cs === 'onbackorder') $hasBackorder = true;
            }

            if ($effectivePrice === null && $minPrice !== null) {
                $effectivePrice = $minPrice;
            }
            $stockStatusNorm = $hasInStock ? 'in-stock' : ($hasBackorder ? 'on-backorder' : 'out');
        }

        // Product type
        $productType = $product->get_type(); // simple, variable, grouped, external

        // Document
        $doc = [
            'id'                => $id,
            'title'             => $product->get_name(),
            'slug'              => $product->get_slug(),
            'brand'             => $brandName,
            'brandId'           => $brandId,
            'manufacturer'      => $manufacturer,
            'productLine'       => $productLine,
            'sku'               => $product->get_sku() ?: '',
            'description'       => wp_strip_all_tags($product->get_description()),
            'short_description' => wp_strip_all_tags($product->get_short_description()),
            'price'             => $price,
            'salePrice'         => $salePrice,
            'effectivePrice'    => $effectivePrice,
            'stock'             => $stock,
            'stockStatus'       => $stockStatusNorm,
            'backordersAllowed' => $product->backorders_allowed(),
            'image'             => $imageUrl,
            'categories'        => $categories,
            'categoryIds'       => $categoryIds,
            'productType'       => $productType,
            'badge'             => get_post_meta($id, '_product_badge', true) ?: null,
            'tags'              => $tags,
            'status'            => $product->get_status() === 'publish' ? 'published' : $product->get_status(),
            'featured'          => $product->is_featured(),
            'hideFromCatalog'   => has_term('exclude-from-catalog', 'product_visibility', $id),
            'specs'             => $specs,
            'specsFlatSearch'   => $specsFlatSearch,
            'collection'        => 'products',
            'createdAt'         => $product->get_date_created()?->format('c'),
            'updatedAt'         => $product->get_date_modified()?->format('c'),
        ];

        // Flat spec fields voor faceting (spec_kleur, spec_maat)
        foreach ($flatSpecs as $key => $values) {
            $doc[$key] = $values;
        }

        return $doc;
    }

    /**
     * Index een enkel product (fire-and-forget)
     *
     * Equivalent van: indexProduct() in indexProducts.ts
     */
    public static function index(\WC_Product $product): bool
    {
        try {
            $indexName = Client::indexName('products');
            $index = Client::getOrCreateIndex($indexName);
            if (!$index) return false;

            $doc = self::transform($product);
            $index->addDocuments([$doc]);
            return true;
        } catch (\Exception $e) {
            error_log("[Meilisearch] Failed to index product {$product->get_id()}: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Verwijder product uit index
     *
     * Equivalent van: deleteProductFromIndex() in indexProducts.ts
     */
    public static function delete(int $productId): bool
    {
        try {
            $indexName = Client::indexName('products');
            $index = Client::getOrCreateIndex($indexName);
            if (!$index) return false;

            $index->deleteDocument($productId);
            return true;
        } catch (\Exception $e) {
            error_log("[Meilisearch] Failed to delete product {$productId}: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Volledige reindex van alle producten
     *
     * Equivalent van: reindexAllProducts() in indexProducts.ts
     *
     * - Bouwt brand hierarchy map
     * - Batch indexing (100 per batch)
     * - Dynamische spec_* filterable attributes
     */
    public static function reindexAll(): bool
    {
        try {
            $indexName = Client::indexName('products');
            $index = Client::getOrCreateIndex($indexName);
            if (!$index) return false;

            // Alle producten ophalen
            $args = [
                'status'  => 'publish',
                'limit'   => -1,
                'return'  => 'ids',
            ];
            $productIds = wc_get_products($args);

            $allDocs = [];
            $allSpecKeys = [];
            $batchSize = 100;

            foreach ($productIds as $productId) {
                $product = wc_get_product($productId);
                if (!$product) continue;

                $doc = self::transform($product);
                $allDocs[] = $doc;

                // Verzamel alle spec keys
                foreach (array_keys($doc['specs'] ?? []) as $key) {
                    $allSpecKeys["spec_{$key}"] = true;
                }
            }

            // Batch indexing
            $batches = array_chunk($allDocs, $batchSize);
            foreach ($batches as $i => $batch) {
                $index->addDocuments($batch);
                // Optional: WP_CLI::log("Batch " . ($i + 1) . "/" . count($batches));
            }

            // Update filterable attributes met dynamische spec keys
            if (!empty($allSpecKeys)) {
                $currentSettings = $index->getSettings();
                $currentFilterable = $currentSettings['filterableAttributes'] ?? [];
                $merged = array_unique(array_merge($currentFilterable, array_keys($allSpecKeys)));
                $index->updateSettings(['filterableAttributes' => array_values($merged)]);
            }

            return true;
        } catch (\Exception $e) {
            error_log("[Meilisearch] Reindex products failed: {$e->getMessage()}");
            return false;
        }
    }
}
```

### 4.2 Post Indexer (`src/Indexers/PostIndexer.php`)

```php
<?php
namespace Meilisearch\Indexers;

use Meilisearch\Client;

/**
 * WordPress Post → Meilisearch Document
 *
 * Equivalent van: src/features/search/lib/meilisearch/indexBlogPosts.ts
 */
class PostIndexer
{
    /**
     * Transform WP post naar Meilisearch document
     *
     * Equivalent van: transformBlogPostForSearch() in indexBlogPosts.ts
     */
    public static function transform(\WP_Post $post): array
    {
        // Content extractie (Gutenberg blocks → plain text)
        // Equivalent van Lexical JSON text extraction in indexBlogPosts.ts
        $renderedContent = apply_filters('the_content', $post->post_content);
        $plainContent = wp_strip_all_tags($renderedContent);
        $plainContent = mb_substr($plainContent, 0, 2000); // Max 2000 chars (zelfde als Payload)

        // Categories
        $categories = [];
        $terms = wp_get_post_terms($post->ID, 'category', ['fields' => 'names']);
        if (!is_wp_error($terms)) {
            $categories = $terms;
        }

        // Tags
        $tags = [];
        $tagTerms = wp_get_post_terms($post->ID, 'post_tag', ['fields' => 'names']);
        if (!is_wp_error($tagTerms)) {
            $tags = $tagTerms;
        }

        // Author
        $author = get_the_author_meta('display_name', $post->post_author);

        // Featured image
        $featuredImage = get_the_post_thumbnail_url($post->ID, 'medium') ?: null;

        return [
            'id'            => $post->ID,
            'title'         => $post->post_title,
            'slug'          => $post->post_name,
            'excerpt'       => wp_strip_all_tags($post->post_excerpt) ?: mb_substr($plainContent, 0, 200),
            'content'       => $plainContent,
            'featuredImage'  => $featuredImage,
            'categories'    => $categories,
            'tags'          => $tags,
            'author'        => $author,
            'status'        => $post->post_status === 'publish' ? 'published' : $post->post_status,
            'publishedAt'   => $post->post_date_gmt,
            'createdAt'     => $post->post_date_gmt,
            'updatedAt'     => $post->post_modified_gmt,
            'collection'    => 'posts',
        ];
    }

    public static function index(\WP_Post $post): bool
    {
        try {
            $index = Client::getOrCreateIndex(Client::indexName('posts'));
            if (!$index) return false;
            $index->addDocuments([self::transform($post)]);
            return true;
        } catch (\Exception $e) {
            error_log("[Meilisearch] Failed to index post {$post->ID}: {$e->getMessage()}");
            return false;
        }
    }

    public static function delete(int $postId): bool
    {
        try {
            $index = Client::getOrCreateIndex(Client::indexName('posts'));
            if (!$index) return false;
            $index->deleteDocument($postId);
            return true;
        } catch (\Exception $e) {
            error_log("[Meilisearch] Failed to delete post {$postId}: {$e->getMessage()}");
            return false;
        }
    }

    public static function reindexAll(): bool
    {
        try {
            $index = Client::getOrCreateIndex(Client::indexName('posts'));
            if (!$index) return false;

            $posts = get_posts([
                'post_type'   => 'post',
                'post_status' => 'publish',
                'numberposts' => -1,
            ]);

            $docs = array_map(fn($p) => self::transform($p), $posts);
            $batches = array_chunk($docs, 100);

            foreach ($batches as $batch) {
                $index->addDocuments($batch);
            }

            return true;
        } catch (\Exception $e) {
            error_log("[Meilisearch] Reindex posts failed: {$e->getMessage()}");
            return false;
        }
    }
}
```

### 4.3 Page Indexer (`src/Indexers/PageIndexer.php`)

```php
<?php
namespace Meilisearch\Indexers;

use Meilisearch\Client;

/**
 * WordPress Page → Meilisearch Document
 *
 * Equivalent van: src/features/search/lib/meilisearch/indexPages.ts
 */
class PageIndexer
{
    public static function transform(\WP_Post $page): array
    {
        // Content extractie uit Gutenberg blocks
        // Equivalent van block text extraction in indexPages.ts
        $renderedContent = apply_filters('the_content', $page->post_content);
        $plainContent = wp_strip_all_tags($renderedContent);
        $plainContent = mb_substr($plainContent, 0, 2000);

        return [
            'id'        => $page->ID,
            'title'     => $page->post_title,
            'slug'      => $page->post_name,
            'content'   => $plainContent,
            'status'    => $page->post_status === 'publish' ? 'published' : $page->post_status,
            'createdAt' => $page->post_date_gmt,
            'updatedAt' => $page->post_modified_gmt,
            'collection' => 'pages',
        ];
    }

    public static function index(\WP_Post $page): bool
    {
        try {
            $index = Client::getOrCreateIndex(Client::indexName('pages'));
            if (!$index) return false;
            $index->addDocuments([self::transform($page)]);
            return true;
        } catch (\Exception $e) {
            error_log("[Meilisearch] Failed to index page {$page->ID}: {$e->getMessage()}");
            return false;
        }
    }

    public static function delete(int $pageId): bool
    {
        try {
            $index = Client::getOrCreateIndex(Client::indexName('pages'));
            if (!$index) return false;
            $index->deleteDocument($pageId);
            return true;
        } catch (\Exception $e) {
            error_log("[Meilisearch] Failed to delete page {$pageId}: {$e->getMessage()}");
            return false;
        }
    }

    public static function reindexAll(): bool
    {
        try {
            $index = Client::getOrCreateIndex(Client::indexName('pages'));
            if (!$index) return false;

            $pages = get_posts([
                'post_type'   => 'page',
                'post_status' => 'publish',
                'numberposts' => -1,
            ]);

            $docs = array_map(fn($p) => self::transform($p), $pages);
            $batches = array_chunk($docs, 100);

            foreach ($batches as $batch) {
                $index->addDocuments($batch);
            }

            return true;
        } catch (\Exception $e) {
            error_log("[Meilisearch] Reindex pages failed: {$e->getMessage()}");
            return false;
        }
    }
}
```

---

## 5. WordPress Hooks (Auto-Indexing)

### `src/Hooks.php`

```php
<?php
namespace Meilisearch;

use Meilisearch\Indexers\ProductIndexer;
use Meilisearch\Indexers\PostIndexer;
use Meilisearch\Indexers\PageIndexer;

/**
 * WordPress Action Hooks voor automatische indexering
 *
 * Equivalent van de afterChange/afterDelete hooks in:
 * - src/branches/ecommerce/shared/collections/products/index.ts
 * - src/branches/publishing/collections/BlogPosts.ts
 * - src/branches/shared/collections/Pages/index.ts
 *
 * Pattern: Fire-and-forget (fouten blokkeren save NIET)
 */
class Hooks
{
    public static function register(): void
    {
        // === PRODUCTS (WooCommerce) ===
        // Equivalent van: products afterChange hook
        add_action('woocommerce_update_product', [self::class, 'onProductSave'], 20);
        add_action('woocommerce_new_product', [self::class, 'onProductSave'], 20);

        // Equivalent van: products afterDelete hook
        add_action('before_delete_post', [self::class, 'onProductDelete'], 10);

        // === BLOG POSTS ===
        // Equivalent van: blog-posts afterChange hook
        add_action('save_post_post', [self::class, 'onPostSave'], 20, 2);

        // Equivalent van: blog-posts afterDelete hook
        add_action('before_delete_post', [self::class, 'onPostDelete'], 10, 2);

        // === PAGES ===
        // Equivalent van: pages afterChange hook
        add_action('save_post_page', [self::class, 'onPageSave'], 20, 2);

        // Equivalent van: pages afterDelete hook
        add_action('before_delete_post', [self::class, 'onPageDelete'], 10, 2);

        // Trash/untrash = verwijderen/toevoegen uit index
        add_action('wp_trash_post', [self::class, 'onTrash']);
        add_action('untrash_post', [self::class, 'onUntrash']);
    }

    /**
     * Product opgeslagen → index in Meilisearch
     *
     * Fire-and-forget: fouten loggen maar NIET blokkeren
     */
    public static function onProductSave(int $productId): void
    {
        // Voorkom oneindige loops bij autosave/revision
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (wp_is_post_revision($productId)) return;

        try {
            $product = wc_get_product($productId);
            if (!$product || $product->get_status() !== 'publish') {
                // Als niet published, verwijder uit index
                ProductIndexer::delete($productId);
                return;
            }
            ProductIndexer::index($product);
        } catch (\Exception $e) {
            error_log("[Meilisearch] Hook error (product save): {$e->getMessage()}");
        }
    }

    public static function onProductDelete(int $postId): void
    {
        if (get_post_type($postId) !== 'product') return;
        try {
            ProductIndexer::delete($postId);
        } catch (\Exception $e) {
            error_log("[Meilisearch] Hook error (product delete): {$e->getMessage()}");
        }
    }

    public static function onPostSave(int $postId, \WP_Post $post): void
    {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (wp_is_post_revision($postId)) return;

        try {
            if ($post->post_status !== 'publish') {
                PostIndexer::delete($postId);
                return;
            }
            PostIndexer::index($post);
        } catch (\Exception $e) {
            error_log("[Meilisearch] Hook error (post save): {$e->getMessage()}");
        }
    }

    public static function onPostDelete(int $postId, \WP_Post $post): void
    {
        if ($post->post_type !== 'post') return;
        try {
            PostIndexer::delete($postId);
        } catch (\Exception $e) {
            error_log("[Meilisearch] Hook error (post delete): {$e->getMessage()}");
        }
    }

    public static function onPageSave(int $postId, \WP_Post $post): void
    {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (wp_is_post_revision($postId)) return;

        try {
            if ($post->post_status !== 'publish') {
                PageIndexer::delete($postId);
                return;
            }
            PageIndexer::index($post);
        } catch (\Exception $e) {
            error_log("[Meilisearch] Hook error (page save): {$e->getMessage()}");
        }
    }

    public static function onPageDelete(int $postId, \WP_Post $post): void
    {
        if ($post->post_type !== 'page') return;
        try {
            PageIndexer::delete($postId);
        } catch (\Exception $e) {
            error_log("[Meilisearch] Hook error (page delete): {$e->getMessage()}");
        }
    }

    /**
     * Trash → verwijder uit index
     */
    public static function onTrash(int $postId): void
    {
        $type = get_post_type($postId);
        try {
            match ($type) {
                'product' => ProductIndexer::delete($postId),
                'post'    => PostIndexer::delete($postId),
                'page'    => PageIndexer::delete($postId),
                default   => null,
            };
        } catch (\Exception $e) {
            // Silently fail
        }
    }

    /**
     * Untrash → voeg terug toe aan index
     */
    public static function onUntrash(int $postId): void
    {
        $post = get_post($postId);
        if (!$post) return;

        try {
            match ($post->post_type) {
                'product' => ProductIndexer::index(wc_get_product($postId)),
                'post'    => PostIndexer::index($post),
                'page'    => PageIndexer::index($post),
                default   => null,
            };
        } catch (\Exception $e) {
            // Silently fail
        }
    }
}
```

---

## 6. REST API Endpoints

### `src/RestApi.php`

```php
<?php
namespace Meilisearch;

/**
 * WordPress REST API Endpoints
 *
 * Equivalent van:
 * - src/app/api/search/route.ts           → /wp-json/ms/v1/search
 * - src/app/api/shop/search/route.ts      → /wp-json/ms/v1/shop/search
 * - src/app/api/meilisearch/reindex/route.ts → /wp-json/ms/v1/reindex
 */
class RestApi
{
    const NAMESPACE = 'ms/v1';

    public static function register(): void
    {
        add_action('rest_api_init', function () {

            // ─── Instant Search ───────────────────────────────────
            // Equivalent van: GET /api/search
            register_rest_route(self::NAMESPACE, '/search', [
                'methods'  => 'GET',
                'callback' => [self::class, 'instantSearch'],
                'permission_callback' => '__return_true',
                'args' => [
                    'q'     => ['required' => true, 'type' => 'string'],
                    'type'  => ['default' => 'all', 'type' => 'string'],
                    'limit' => ['default' => 10, 'type' => 'integer'],
                ],
            ]);

            // ─── Shop Search (Faceted) ────────────────────────────
            // Equivalent van: GET /api/shop/search
            register_rest_route(self::NAMESPACE, '/shop/search', [
                'methods'  => 'GET',
                'callback' => [self::class, 'shopSearch'],
                'permission_callback' => '__return_true',
            ]);

            // ─── Reindex (Admin only) ─────────────────────────────
            // Equivalent van: POST /api/meilisearch/reindex
            register_rest_route(self::NAMESPACE, '/reindex', [
                'methods'  => 'POST',
                'callback' => [self::class, 'reindex'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            ]);

            // ─── Health Check ─────────────────────────────────────
            register_rest_route(self::NAMESPACE, '/health', [
                'methods'  => 'GET',
                'callback' => [self::class, 'health'],
                'permission_callback' => '__return_true',
            ]);
        });
    }

    /**
     * Instant Search — multi-index
     *
     * Equivalent van: GET handler in src/app/api/search/route.ts
     *
     * GET /wp-json/ms/v1/search?q=schroevendraaier&type=all&limit=10
     */
    public static function instantSearch(\WP_REST_Request $request): \WP_REST_Response
    {
        $startTime = microtime(true);

        if (!Client::isAvailable()) {
            return new \WP_REST_Response(['error' => 'Search service unavailable'], 503);
        }

        $query = sanitize_text_field($request->get_param('q'));
        $type  = $request->get_param('type') ?: 'all';
        $limit = min(50, max(1, (int) $request->get_param('limit')));

        if (strlen($query) < 2) {
            return new \WP_REST_Response(['results' => [], 'message' => 'Query too short']);
        }

        $client = Client::get();
        $searchOpts = [
            'limit' => $limit,
            'attributesToHighlight' => ['title', 'brand', 'sku', 'excerpt', 'content'],
            'highlightPreTag'  => '<mark>',
            'highlightPostTag' => '</mark>',
        ];

        try {
            if ($type === 'all') {
                // Parallel multi-index search (sequentieel in PHP, maar snel)
                $products = $client->index(Client::indexName('products'))
                    ->search($query, array_merge($searchOpts, ['limit' => 5]));
                $posts = $client->index(Client::indexName('posts'))
                    ->search($query, array_merge($searchOpts, ['limit' => 3]));
                $pages = $client->index(Client::indexName('pages'))
                    ->search($query, array_merge($searchOpts, ['limit' => 3]));

                $responseTimeMs = round((microtime(true) - $startTime) * 1000);

                return new \WP_REST_Response([
                    'products' => [
                        'hits'  => $products->getHits(),
                        'total' => $products->getEstimatedTotalHits(),
                    ],
                    'posts' => [
                        'hits'  => $posts->getHits(),
                        'total' => $posts->getEstimatedTotalHits(),
                    ],
                    'pages' => [
                        'hits'  => $pages->getHits(),
                        'total' => $pages->getEstimatedTotalHits(),
                    ],
                    'query' => $query,
                    'mode' => 'keyword',
                    'processingTimeMs' => $responseTimeMs,
                ]);
            }

            // Single index search
            $indexName = Client::indexName($type);
            $results = $client->index($indexName)->search($query, $searchOpts);

            return new \WP_REST_Response([
                'hits'  => $results->getHits(),
                'total' => $results->getEstimatedTotalHits(),
                'query' => $query,
                'mode'  => 'keyword',
                'processingTimeMs' => round((microtime(true) - $startTime) * 1000),
            ]);
        } catch (\Exception $e) {
            return new \WP_REST_Response(['error' => 'Search failed', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Shop Search — Faceted product zoeken
     *
     * Equivalent van: GET handler in src/app/api/shop/search/route.ts
     *
     * GET /wp-json/ms/v1/shop/search?q=&category=123&brand=456&minPrice=10&maxPrice=50&specs[maat]=L&page=1&limit=24&sort=price:asc
     */
    public static function shopSearch(\WP_REST_Request $request): \WP_REST_Response
    {
        if (!Client::isAvailable()) {
            return new \WP_REST_Response(['error' => 'Search service unavailable'], 503);
        }

        $params = $request->get_query_params();

        $q           = sanitize_text_field($params['q'] ?? '');
        $page        = max(1, (int) ($params['page'] ?? 1));
        $limit       = min(100, max(1, (int) ($params['limit'] ?? 24)));
        $sort        = sanitize_text_field($params['sort'] ?? '');
        $categoryIds = array_map('intval', (array) ($params['category'] ?? []));
        $brandIds    = array_map('intval', (array) ($params['brand'] ?? []));
        $brandNames  = array_map('sanitize_text_field', (array) ($params['brandName'] ?? []));
        $manufacturers = array_map('sanitize_text_field', (array) ($params['manufacturer'] ?? []));
        $productLines  = array_map('sanitize_text_field', (array) ($params['productLine'] ?? []));
        $minPrice    = isset($params['minPrice']) ? (float) $params['minPrice'] : null;
        $maxPrice    = isset($params['maxPrice']) ? (float) $params['maxPrice'] : null;
        $stockStatus = array_map('sanitize_text_field', (array) ($params['stock'] ?? []));
        $badge       = isset($params['badge']) ? sanitize_text_field($params['badge']) : null;
        $productType = isset($params['productType']) ? sanitize_text_field($params['productType']) : null;

        // Specs: specs[maat]=L&specs[kleur]=rood
        $specs = [];
        foreach ($params as $key => $value) {
            if (preg_match('/^specs\[(.+)\]$/', $key, $match)) {
                $specKey = strtolower(sanitize_text_field($match[1]));
                $specs[$specKey] = array_map('sanitize_text_field', (array) $value);
            }
        }

        // Build filter array
        // Exact dezelfde logica als buildMeilisearchFilter() in route.ts
        $filter = ['status = "published"', 'hideFromCatalog = false'];

        if (!empty($categoryIds)) {
            $catFilters = array_map(fn($id) => "categoryIds = {$id}", $categoryIds);
            $filter[] = '(' . implode(' OR ', $catFilters) . ')';
        }

        $brandClauses = [];
        foreach ($brandIds as $id) {
            $brandClauses[] = "brandId = {$id}";
        }
        foreach ($brandNames as $name) {
            $brandClauses[] = 'brand = "' . addslashes($name) . '"';
        }
        if (!empty($brandClauses)) {
            $filter[] = '(' . implode(' OR ', $brandClauses) . ')';
        }

        if (!empty($manufacturers)) {
            $mfrClauses = array_map(fn($n) => 'manufacturer = "' . addslashes($n) . '"', $manufacturers);
            $filter[] = '(' . implode(' OR ', $mfrClauses) . ')';
        }

        if (!empty($productLines)) {
            $plClauses = array_map(fn($n) => 'productLine = "' . addslashes($n) . '"', $productLines);
            $filter[] = '(' . implode(' OR ', $plClauses) . ')';
        }

        if ($minPrice !== null) $filter[] = "effectivePrice >= {$minPrice}";
        if ($maxPrice !== null) $filter[] = "effectivePrice <= {$maxPrice}";

        if (!empty($stockStatus)) {
            $stockFilters = array_map(fn($s) => "stockStatus = \"{$s}\"", $stockStatus);
            $filter[] = '(' . implode(' OR ', $stockFilters) . ')';
        }

        if ($badge) $filter[] = "badge = \"{$badge}\"";
        if ($productType) $filter[] = "productType = \"{$productType}\"";

        // Spec filters (flat: spec_maat, spec_kleur)
        foreach ($specs as $key => $values) {
            $specFilters = array_map(fn($v) => "spec_{$key} = \"" . addslashes($v) . '"', $values);
            $filter[] = '(' . implode(' OR ', $specFilters) . ')';
        }

        // Sort
        $sortArr = match ($sort) {
            'price:asc', 'price-asc'   => ['effectivePrice:asc'],
            'price:desc', 'price-desc' => ['effectivePrice:desc'],
            'newest', 'createdAt:desc' => ['createdAt:desc'],
            'name-asc', 'title:asc'    => ['title:asc'],
            'name-desc', 'title:desc'  => ['title:desc'],
            default => null,
        };

        try {
            $client = Client::get();
            $index = $client->index(Client::indexName('products'));

            $result = $index->search($q, [
                'filter' => $filter,
                'sort'   => $sortArr,
                'limit'  => $limit,
                'offset' => ($page - 1) * $limit,
                'facets' => ['*'],
                'attributesToHighlight' => ['title', 'brand'],
                'highlightPreTag'  => '<mark>',
                'highlightPostTag' => '</mark>',
            ]);

            // Facets verwerken (exact dezelfde structuur als route.ts)
            $facetDist = $result->getFacetDistribution() ?? [];
            $facetStats = $result->getFacetStats() ?? [];

            // Spec facets extraheren (spec_* → geneste structuur)
            $specFacets = [];
            foreach ($facetDist as $key => $dist) {
                if (str_starts_with($key, 'spec_')) {
                    $specName = substr($key, 5); // Verwijder 'spec_' prefix
                    $specFacets[$specName] = $dist;
                }
            }

            $total = $result->getEstimatedTotalHits() ?? 0;

            return new \WP_REST_Response([
                'hits'       => $result->getHits(),
                'total'      => $total,
                'page'       => $page,
                'limit'      => $limit,
                'totalPages' => (int) ceil($total / $limit),
                'facets'     => [
                    'brands'       => $facetDist['brand'] ?? [],
                    'brandIds'     => $facetDist['brandId'] ?? [],
                    'manufacturers' => $facetDist['manufacturer'] ?? [],
                    'productLines' => $facetDist['productLine'] ?? [],
                    'categories'   => $facetDist['categories'] ?? [],
                    'categoryIds'  => $facetDist['categoryIds'] ?? [],
                    'stockStatus'  => $facetDist['stockStatus'] ?? [],
                    'badge'        => $facetDist['badge'] ?? [],
                    'productType'  => $facetDist['productType'] ?? [],
                    'specs'        => $specFacets,
                    'priceRange'   => isset($facetStats['effectivePrice'])
                        ? ['min' => $facetStats['effectivePrice']['min'], 'max' => $facetStats['effectivePrice']['max']]
                        : null,
                ],
                'processingTimeMs' => $result->getProcessingTimeMs(),
            ]);
        } catch (\Exception $e) {
            return new \WP_REST_Response(['error' => 'Search failed', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Reindex — Alle indexen opnieuw opbouwen
     *
     * Equivalent van: POST handler in src/app/api/meilisearch/reindex/route.ts
     */
    public static function reindex(): \WP_REST_Response
    {
        if (!Client::isAvailable()) {
            return new \WP_REST_Response(['error' => 'Meilisearch not available'], 503);
        }

        // Eerst index settings configureren
        Client::initialize();

        $results = [
            'products' => Indexers\ProductIndexer::reindexAll(),
            'posts'    => Indexers\PostIndexer::reindexAll(),
            'pages'    => Indexers\PageIndexer::reindexAll(),
        ];

        return new \WP_REST_Response([
            'success' => !in_array(false, $results, true),
            'results' => $results,
        ]);
    }

    /**
     * Health check
     */
    public static function health(): \WP_REST_Response
    {
        $available = Client::isAvailable();

        if (!$available) {
            return new \WP_REST_Response(['status' => 'unavailable'], 503);
        }

        try {
            $client = Client::get();
            $indexes = [];
            foreach (['products', 'posts', 'pages'] as $type) {
                $indexName = Client::indexName($type);
                try {
                    $stats = $client->index($indexName)->getStats();
                    $indexes[$type] = [
                        'name'       => $indexName,
                        'documents'  => $stats['numberOfDocuments'],
                        'isIndexing' => $stats['isIndexing'],
                    ];
                } catch (\Exception $e) {
                    $indexes[$type] = ['name' => $indexName, 'error' => $e->getMessage()];
                }
            }

            return new \WP_REST_Response([
                'status'  => 'available',
                'indexes' => $indexes,
            ]);
        } catch (\Exception $e) {
            return new \WP_REST_Response(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
```

---

## 7. Admin Settings Pagina

### `src/AdminPage.php`

```php
<?php
namespace Meilisearch;

/**
 * WordPress Admin Settings Pagina
 *
 * Equivalent van: src/features/search/globals/MeilisearchSettings.ts
 * (8-tab Payload Global met alle configuratie)
 *
 * Minimale versie — uitbreidbaar met ACF voor meer tabs
 */
class AdminPage
{
    public static function register(): void
    {
        add_menu_page(
            'Meilisearch',
            'Meilisearch',
            'manage_options',
            'meilisearch-settings',
            [self::class, 'renderPage'],
            'dashicons-search',
            80
        );

        add_action('admin_init', [self::class, 'registerSettings']);
    }

    public static function registerSettings(): void
    {
        register_setting('meilisearch_settings_group', 'meilisearch_settings');
    }

    public static function renderPage(): void
    {
        // Health check
        $available = Client::isAvailable();
        $settings = get_option('meilisearch_settings', []);

        // Index stats
        $indexStats = [];
        if ($available) {
            try {
                $client = Client::get();
                foreach (['products', 'posts', 'pages'] as $type) {
                    $name = Client::indexName($type);
                    try {
                        $stats = $client->index($name)->getStats();
                        $indexStats[$type] = $stats['numberOfDocuments'];
                    } catch (\Exception $e) {
                        $indexStats[$type] = 'N/A';
                    }
                }
            } catch (\Exception $e) {
                // Skip
            }
        }

        ?>
        <div class="wrap">
            <h1>Meilisearch Instellingen</h1>

            <!-- Status -->
            <div class="notice <?= $available ? 'notice-success' : 'notice-error' ?>">
                <p>
                    <strong>Status:</strong>
                    <?= $available ? 'Verbonden met Meilisearch' : 'Meilisearch niet bereikbaar' ?>
                    (<?= esc_html(env('MEILISEARCH_HOST') ?: 'http://127.0.0.1:7700') ?>)
                </p>
            </div>

            <?php if ($available && !empty($indexStats)): ?>
            <table class="widefat" style="max-width: 500px; margin: 20px 0;">
                <thead><tr><th>Index</th><th>Documenten</th><th>Actie</th></tr></thead>
                <tbody>
                <?php foreach ($indexStats as $type => $count): ?>
                    <tr>
                        <td><strong><?= esc_html(ucfirst($type)) ?></strong></td>
                        <td><?= esc_html($count) ?></td>
                        <td><button class="button ms-reindex" data-type="<?= esc_attr($type) ?>">Reindex</button></td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
            <button id="ms-reindex-all" class="button button-primary">Alles Reindexen</button>
            <?php endif; ?>

            <hr>

            <!-- Settings Form -->
            <form method="post" action="options.php">
                <?php settings_fields('meilisearch_settings_group'); ?>

                <h2>Synoniemen</h2>
                <p>Komma-gescheiden groepen, bijv: <code>laptop, notebook, computer</code></p>
                <textarea name="meilisearch_settings[synonyms_raw]" rows="5" cols="60"><?=
                    esc_textarea($settings['synonyms_raw'] ?? '')
                ?></textarea>

                <h2>Stop Words</h2>
                <p>Woorden die genegeerd worden bij zoeken (1 per regel)</p>
                <textarea name="meilisearch_settings[stopwords_raw]" rows="5" cols="60"><?=
                    esc_textarea($settings['stopwords_raw'] ?? 'de\nhet\neen\nvan\nen\nin\nis\nop\naar\nvoor')
                ?></textarea>

                <h2>Typo Tolerantie</h2>
                <label>
                    <input type="checkbox" name="meilisearch_settings[typoTolerance][enabled]" value="1"
                        <?php checked($settings['typoTolerance']['enabled'] ?? true); ?>>
                    Ingeschakeld
                </label><br>
                <label>
                    Min. woordlengte voor 1 typo:
                    <input type="number" name="meilisearch_settings[typoTolerance][minWordSizeForTypos][oneTypo]"
                        value="<?= esc_attr($settings['typoTolerance']['minWordSizeForTypos']['oneTypo'] ?? 4) ?>" min="1" max="20">
                </label><br>
                <label>
                    Min. woordlengte voor 2 typos:
                    <input type="number" name="meilisearch_settings[typoTolerance][minWordSizeForTypos][twoTypos]"
                        value="<?= esc_attr($settings['typoTolerance']['minWordSizeForTypos']['twoTypos'] ?? 8) ?>" min="1" max="20">
                </label>

                <?php submit_button('Instellingen Opslaan'); ?>
            </form>
        </div>

        <script>
        // Reindex knoppen
        document.querySelectorAll('.ms-reindex').forEach(btn => {
            btn.addEventListener('click', async () => {
                btn.disabled = true;
                btn.textContent = 'Bezig...';
                try {
                    const res = await fetch('/wp-json/ms/v1/reindex', {
                        method: 'POST',
                        headers: { 'X-WP-Nonce': '<?= wp_create_nonce('wp_rest') ?>' }
                    });
                    const data = await res.json();
                    btn.textContent = data.success ? 'Klaar!' : 'Fout';
                } catch (e) {
                    btn.textContent = 'Fout';
                }
                setTimeout(() => { btn.textContent = 'Reindex'; btn.disabled = false; }, 2000);
            });
        });

        document.getElementById('ms-reindex-all')?.addEventListener('click', async function() {
            this.disabled = true;
            this.textContent = 'Bezig met reindexen...';
            try {
                const res = await fetch('/wp-json/ms/v1/reindex', {
                    method: 'POST',
                    headers: { 'X-WP-Nonce': '<?= wp_create_nonce('wp_rest') ?>' }
                });
                const data = await res.json();
                this.textContent = data.success ? 'Reindex voltooid!' : 'Fout bij reindex';
            } catch (e) {
                this.textContent = 'Fout';
            }
            setTimeout(() => { this.textContent = 'Alles Reindexen'; this.disabled = false; }, 3000);
        });
        </script>
        <?php
    }
}
```

---

## 8. Frontend Zoekcomponenten

### 8.1 Instant Search (JavaScript)

```javascript
/**
 * Instant Search Component
 *
 * Equivalent van de frontend search component in het Payload CMS project.
 * Roept /wp-json/ms/v1/search aan.
 *
 * Gebruik: <div id="instant-search"></div>
 */
class InstantSearch {
  constructor(selector, options = {}) {
    this.container = document.querySelector(selector);
    if (!this.container) return;

    this.debounceTimer = null;
    this.debounceMs = options.debounceMs || 300;
    this.minChars = options.minChars || 2;
    this.apiBase = options.apiBase || '/wp-json/ms/v1';

    this.init();
  }

  init() {
    // Input
    this.input = this.container.querySelector('input[type="search"], input[type="text"]');
    if (!this.input) return;

    // Results container
    this.results = this.container.querySelector('.search-results')
      || this.createResultsContainer();

    // Events
    this.input.addEventListener('input', () => this.onInput());
    this.input.addEventListener('focus', () => {
      if (this.input.value.length >= this.minChars) this.search(this.input.value);
    });
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) this.hideResults();
    });
  }

  createResultsContainer() {
    const div = document.createElement('div');
    div.className = 'search-results';
    this.container.appendChild(div);
    return div;
  }

  onInput() {
    clearTimeout(this.debounceTimer);
    const query = this.input.value.trim();

    if (query.length < this.minChars) {
      this.hideResults();
      return;
    }

    this.debounceTimer = setTimeout(() => this.search(query), this.debounceMs);
  }

  async search(query) {
    try {
      const res = await fetch(`${this.apiBase}/search?q=${encodeURIComponent(query)}&type=all&limit=10`);
      const data = await res.json();
      this.renderResults(data, query);
    } catch (e) {
      console.error('[Search]', e);
    }
  }

  renderResults(data, query) {
    let html = '';

    // Products
    if (data.products?.hits?.length > 0) {
      html += `<div class="search-group">
        <h3>Producten (${data.products.total})</h3>
        ${data.products.hits.map(hit => `
          <a href="/product/${hit.slug}" class="search-hit">
            ${hit.image ? `<img src="${hit.image}" alt="${hit.title}" width="40" height="40">` : ''}
            <div>
              <span class="hit-title">${hit._formatted?.title || hit.title}</span>
              ${hit.effectivePrice ? `<span class="hit-price">&euro;${hit.effectivePrice.toFixed(2)}</span>` : ''}
            </div>
          </a>
        `).join('')}
      </div>`;
    }

    // Posts
    if (data.posts?.hits?.length > 0) {
      html += `<div class="search-group">
        <h3>Artikelen (${data.posts.total})</h3>
        ${data.posts.hits.map(hit => `
          <a href="/blog/${hit.slug}" class="search-hit">
            <div>
              <span class="hit-title">${hit._formatted?.title || hit.title}</span>
              <span class="hit-excerpt">${hit.excerpt || ''}</span>
            </div>
          </a>
        `).join('')}
      </div>`;
    }

    // Pages
    if (data.pages?.hits?.length > 0) {
      html += `<div class="search-group">
        <h3>Pagina's (${data.pages.total})</h3>
        ${data.pages.hits.map(hit => `
          <a href="/${hit.slug}" class="search-hit">
            <span class="hit-title">${hit._formatted?.title || hit.title}</span>
          </a>
        `).join('')}
      </div>`;
    }

    if (!html) {
      html = `<div class="search-empty">Geen resultaten voor "${query}"</div>`;
    }

    // Processing time
    html += `<div class="search-meta">${data.processingTimeMs}ms</div>`;

    this.results.innerHTML = html;
    this.results.style.display = 'block';
  }

  hideResults() {
    this.results.style.display = 'none';
  }
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  new InstantSearch('#instant-search');
});
```

### 8.2 Enqueue in WordPress

```php
// In je theme functions.php of mu-plugin:
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_script(
        'meilisearch-instant-search',
        plugin_dir_url(__FILE__) . 'assets/instant-search.js',
        [],
        '1.0.0',
        true
    );
    wp_enqueue_style(
        'meilisearch-instant-search',
        plugin_dir_url(__FILE__) . 'assets/instant-search.css',
        [],
        '1.0.0'
    );
});
```

---

## 9. WP-CLI Commando's

### `src/CLI.php`

```php
<?php
namespace Meilisearch;

use Meilisearch\Indexers\{ProductIndexer, PostIndexer, PageIndexer};

/**
 * WP-CLI commando's voor Meilisearch
 *
 * Equivalent van: POST /api/meilisearch/reindex (maar via CLI)
 *
 * Gebruik:
 *   wp meilisearch status       — Status + index stats
 *   wp meilisearch reindex      — Alles reindexen
 *   wp meilisearch reindex products — Alleen producten
 *   wp meilisearch configure    — Index settings configureren
 */
class CLI
{
    /**
     * Toon Meilisearch status
     *
     * ## EXAMPLES
     *     wp meilisearch status
     *
     * @subcommand status
     */
    public function status($args, $assoc_args)
    {
        $available = Client::isAvailable();

        if (!$available) {
            \WP_CLI::error('Meilisearch is niet bereikbaar op ' . (env('MEILISEARCH_HOST') ?: 'http://127.0.0.1:7700'));
            return;
        }

        \WP_CLI::success('Meilisearch is online');

        $client = Client::get();
        $table = [];

        foreach (['products', 'posts', 'pages'] as $type) {
            $name = Client::indexName($type);
            try {
                $stats = $client->index($name)->getStats();
                $table[] = [
                    'Index'      => $name,
                    'Documents'  => $stats['numberOfDocuments'],
                    'Indexing'   => $stats['isIndexing'] ? 'Yes' : 'No',
                ];
            } catch (\Exception $e) {
                $table[] = ['Index' => $name, 'Documents' => 'N/A', 'Indexing' => $e->getMessage()];
            }
        }

        \WP_CLI\Utils\format_items('table', $table, ['Index', 'Documents', 'Indexing']);
    }

    /**
     * Reindex documenten
     *
     * ## OPTIONS
     * [<type>]
     * : Specifiek type: products, posts, pages. Leeg = alles.
     *
     * ## EXAMPLES
     *     wp meilisearch reindex
     *     wp meilisearch reindex products
     *
     * @subcommand reindex
     */
    public function reindex($args, $assoc_args)
    {
        if (!Client::isAvailable()) {
            \WP_CLI::error('Meilisearch niet bereikbaar');
            return;
        }

        $type = $args[0] ?? 'all';

        // Eerst settings configureren
        \WP_CLI::log('Index settings configureren...');
        Client::initialize();

        if ($type === 'all' || $type === 'products') {
            \WP_CLI::log('Producten reindexen...');
            $ok = ProductIndexer::reindexAll();
            $ok ? \WP_CLI::success('Producten geindexeerd') : \WP_CLI::warning('Producten reindex mislukt');
        }

        if ($type === 'all' || $type === 'posts') {
            \WP_CLI::log('Blog posts reindexen...');
            $ok = PostIndexer::reindexAll();
            $ok ? \WP_CLI::success('Posts geindexeerd') : \WP_CLI::warning('Posts reindex mislukt');
        }

        if ($type === 'all' || $type === 'pages') {
            \WP_CLI::log("Pagina's reindexen...");
            $ok = PageIndexer::reindexAll();
            $ok ? \WP_CLI::success("Pagina's geindexeerd") : \WP_CLI::warning("Pagina's reindex mislukt");
        }

        \WP_CLI::success('Reindex voltooid!');
    }

    /**
     * Configureer index settings
     *
     * ## EXAMPLES
     *     wp meilisearch configure
     *
     * @subcommand configure
     */
    public function configure($args, $assoc_args)
    {
        if (!Client::isAvailable()) {
            \WP_CLI::error('Meilisearch niet bereikbaar');
            return;
        }

        $ok = Client::initialize();
        $ok ? \WP_CLI::success('Alle indexes geconfigureerd') : \WP_CLI::error('Configuratie mislukt');
    }
}
```

---

## 10. Deployment & Productie

### 10.1 Checklist

```bash
# 1. Meilisearch installeren en starten
sudo systemctl start meilisearch
sudo systemctl enable meilisearch

# 2. .env configureren
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_MASTER_KEY=your-secure-key

# 3. Composer package
composer require meilisearch/meilisearch-php

# 4. Plugin activeren (mu-plugin = altijd actief)

# 5. Index settings configureren
wp meilisearch configure

# 6. Eerste volledige reindex
wp meilisearch reindex

# 7. Status checken
wp meilisearch status
```

### 10.2 Cron Job (Optioneel — Periodieke Reindex)

```bash
# Elke nacht om 03:00 — volledige reindex
0 3 * * * cd /home/ploi/site.nl && wp meilisearch reindex 2>&1 >> /var/log/meilisearch-reindex.log
```

### 10.3 Nginx Configuratie

Meilisearch mag NIET direct bereikbaar zijn van buitenaf. Alleen via localhost:

```nginx
# NIET doen: proxy_pass naar Meilisearch
# Meilisearch draait alleen op 127.0.0.1:7700
# Alle requests gaan via WordPress REST API
```

### 10.4 Monitoring

```bash
# Meilisearch health
curl -s http://127.0.0.1:7700/health
# {"status":"available"}

# Index stats
curl -s http://127.0.0.1:7700/indexes -H "Authorization: Bearer YOUR_MASTER_KEY"

# WordPress health endpoint
curl -s https://site.nl/wp-json/ms/v1/health
```

---

## Samenvatting: Payload CMS → WordPress Mapping

| Feature | Payload CMS | WordPress Bedrock |
|---------|-------------|-------------------|
| **Client** | `meilisearch` (npm) | `meilisearch/meilisearch-php` (Composer) |
| **Auto-index** | `afterChange`/`afterDelete` hooks | `save_post`/`before_delete_post` actions |
| **Instant search** | `GET /api/search` (Next.js route) | `GET /wp-json/ms/v1/search` (REST API) |
| **Shop search** | `GET /api/shop/search` | `GET /wp-json/ms/v1/shop/search` |
| **Reindex** | `POST /api/meilisearch/reindex` | `POST /wp-json/ms/v1/reindex` + `wp meilisearch reindex` |
| **Settings UI** | Payload Global (8 tabs) | WP Admin Options Page |
| **Product data** | Payload Product collection | WooCommerce `wc_get_product()` |
| **Categories** | Payload relationship | `wp_get_post_terms('product_cat')` |
| **Brands** | Payload relationship | Custom taxonomy `product_brand` |
| **Specs/Facets** | `product.specifications` array | `$product->get_attributes()` |
| **Content extract** | Lexical JSON traversal | `wp_strip_all_tags(the_content)` |
| **Env vars** | `.env` (Next.js) | `.env` (Bedrock/phpdotenv) |
| **CLI** | N/A | `wp meilisearch` (WP-CLI) |
| **Batch size** | 100 docs/batch | 100 docs/batch |
| **Fire-and-forget** | `hook.catch(() => {})` | `try/catch` + `error_log()` |

---

## Benodigde Composer Packages

```json
{
  "require": {
    "meilisearch/meilisearch-php": "^1.0",
    "guzzlehttp/guzzle": "^7.0"
  }
}
```

Meilisearch PHP SDK vereist Guzzle als HTTP client (meestal al aanwezig in WordPress).
