import { revalidatePath, revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

// ─────────────────────────────────────────────────────────────
// After Change Hook - Revalidate when content changes
// ─────────────────────────────────────────────────────────────
export const revalidateOnChange: CollectionAfterChangeHook = async ({
  doc,
  collection,
  req,
  previousDoc,
}) => {
  // Only revalidate published content
  if (doc.status === 'draft' || doc._status === 'draft') {
    req.payload.logger.info(`[Revalidation] Skipping draft: ${collection.slug}/${doc.slug || doc.id}`)
    return doc
  }

  const slug = doc.slug

  try {
    switch (collection.slug) {
      case 'pages':
        // Revalidate the specific page
        if (slug === 'home') {
          revalidatePath('/')
          req.payload.logger.info('[Revalidation] Homepage revalidated')
        } else {
          revalidatePath(`/${slug}`)
          req.payload.logger.info(`[Revalidation] Page revalidated: /${slug}`)
        }

        // Always revalidate sitemap when pages change
        revalidatePath('/sitemap.xml')

        // Revalidate navigation if it might have changed
        revalidateTag('navigation')
        break

      case 'blog-posts':
        // Revalidate the specific blog post
        revalidatePath(`/blog/${slug}`)
        req.payload.logger.info(`[Revalidation] Blog post revalidated: /blog/${slug}`)

        // Revalidate blog index page
        revalidatePath('/blog')

        // Update sitemap
        revalidatePath('/sitemap.xml')
        break

      case 'cases':
        // Revalidate the specific case
        if (slug) {
          revalidatePath(`/cases/${slug}`)
          req.payload.logger.info(`[Revalidation] Case revalidated: /cases/${slug}`)
        }

        // Revalidate cases index
        revalidatePath('/cases')

        // Tag-based revalidation for case lists
        revalidateTag('cases')

        // Update sitemap
        revalidatePath('/sitemap.xml')
        break

      case 'testimonials':
      case 'services':
      case 'partners':
        // These are embedded in pages, so revalidate with tags
        revalidateTag(collection.slug)
        req.payload.logger.info(`[Revalidation] Tag revalidated: ${collection.slug}`)
        break

      case 'products':
        // Revalidate product page
        if (slug) {
          revalidatePath(`/${slug}`) // Dynamic route handles products
          req.payload.logger.info(`[Revalidation] Product revalidated: /${slug}`)
        }

        // Revalidate shop pages
        revalidatePath('/shop')
        revalidateTag('products')

        // Update sitemap
        revalidatePath('/sitemap.xml')
        break

      case 'product-categories':
        // Revalidate category pages
        if (slug) {
          revalidatePath(`/${slug}`)
        }
        revalidatePath('/shop')
        revalidateTag('categories')
        break

      default:
        req.payload.logger.info(`[Revalidation] No revalidation rules for: ${collection.slug}`)
    }
  } catch (error) {
    req.payload.logger.error(`[Revalidation] Error: ${error}`)
  }

  return doc
}

// ─────────────────────────────────────────────────────────────
// After Delete Hook - Revalidate when content is deleted
// ─────────────────────────────────────────────────────────────
export const revalidateOnDelete: CollectionAfterDeleteHook = async ({
  doc,
  collection,
  req,
}) => {
  const slug = doc.slug

  try {
    switch (collection.slug) {
      case 'pages':
        if (slug) {
          if (slug === 'home') {
            revalidatePath('/')
          } else {
            revalidatePath(`/${slug}`)
          }
        }
        revalidatePath('/sitemap.xml')
        revalidateTag('navigation')
        req.payload.logger.info(`[Revalidation] Deleted page: ${slug}`)
        break

      case 'blog-posts':
        if (slug) {
          revalidatePath(`/blog/${slug}`)
        }
        revalidatePath('/blog')
        revalidatePath('/sitemap.xml')
        req.payload.logger.info(`[Revalidation] Deleted blog post: ${slug}`)
        break

      case 'cases':
        if (slug) {
          revalidatePath(`/cases/${slug}`)
        }
        revalidatePath('/cases')
        revalidateTag('cases')
        revalidatePath('/sitemap.xml')
        req.payload.logger.info(`[Revalidation] Deleted case: ${slug}`)
        break

      case 'products':
        if (slug) {
          revalidatePath(`/${slug}`)
        }
        revalidatePath('/shop')
        revalidateTag('products')
        revalidatePath('/sitemap.xml')
        req.payload.logger.info(`[Revalidation] Deleted product: ${slug}`)
        break

      default:
        req.payload.logger.info(`[Revalidation] No delete rules for: ${collection.slug}`)
    }
  } catch (error) {
    req.payload.logger.error(`[Revalidation] Delete error: ${error}`)
  }

  return doc
}
