/**
 * Publishing Blocks Index
 *
 * Exports all publishing-specific Payload blocks.
 * These blocks are only available when the Publishing feature is enabled.
 */

// Block configs
export { FeaturedArticle } from './FeaturedArticle'
export { LatestArticles } from './LatestArticles'
export { MagazineShowcase } from './MagazineShowcase'
export { KnowledgeBasePreview } from './KnowledgeBasePreview'

// Block components
export { FeaturedArticleComponent } from './FeaturedArticle/Component'
export { LatestArticlesComponent } from './LatestArticles/Component'
export { MagazineShowcaseComponent } from './MagazineShowcase/Component'
export { KnowledgeBasePreviewComponent } from './KnowledgeBasePreview/Component'

// Re-import for array export
import { FeaturedArticle } from './FeaturedArticle'
import { LatestArticles } from './LatestArticles'
import { MagazineShowcase } from './MagazineShowcase'
import { KnowledgeBasePreview } from './KnowledgeBasePreview'

/**
 * All publishing blocks in one array
 * Use this for conditional registration in Pages collection
 */
export const publishingBlocks = [
  FeaturedArticle,
  LatestArticles,
  MagazineShowcase,
  KnowledgeBasePreview,
]

/**
 * Block slugs for reference
 */
export const publishingBlockSlugs = publishingBlocks.map((block) => block.slug)
