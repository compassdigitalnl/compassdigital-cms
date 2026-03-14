import type { CollectionAfterChangeHook } from 'payload'

/**
 * Article Publish Hook (Publishing Branch)
 *
 * Payload CMS afterChange hook on the blog-posts collection.
 * Detects when an article transitions to "published" status and logs the event.
 *
 * Trigger:
 *   update operation where status changes from non-published -> published
 *
 * Future: Can emit a custom event for automation flows (e.g. newsletter notification,
 * social media posting, subscriber alerts).
 *
 * ONLY triggers on the blog-posts collection to avoid conflicts with other collections.
 */
export const articlePublishHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  collection,
}) => {
  // Only trigger on update operations (not create — new posts are handled differently)
  if (operation !== 'update') return doc

  // Safety check: only handle blog-posts collection
  if (collection?.slug !== 'blog-posts') return doc

  const previousStatus = previousDoc?.status
  const currentStatus = doc.status

  // Detect transition to published
  if (previousStatus !== 'published' && currentStatus === 'published') {
    const title = doc.title || 'Untitled'
    console.log(`[articlePublishHook] Article published: ${title} (id: ${doc.id})`)

    // Future: emit custom event for automation flows
    // e.g., notify subscribers, trigger social media post, send newsletter
    // eventBus.emit('article:published', { id: doc.id, title, slug: doc.slug })
  }

  return doc
}
