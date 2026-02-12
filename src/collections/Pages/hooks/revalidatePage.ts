import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Page } from '../../../payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`

      payload.logger.info(`[Revalidation] Page published: ${path}`)

      // Revalidate the page itself
      revalidatePath(path)

      // ✨ NEW: Revalidate sitemap when pages change
      revalidatePath('/sitemap.xml')
      revalidatePath('/robots.txt')

      // ✨ NEW: Revalidate navigation (in case menu structure changed)
      revalidateTag('navigation')
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`

      payload.logger.info(`[Revalidation] Page unpublished: ${oldPath}`)

      revalidatePath(oldPath)
      revalidatePath('/sitemap.xml')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`

    payload.logger.info(`[Revalidation] Page deleted: ${path}`)

    revalidatePath(path)

    // ✨ NEW: Revalidate sitemap and navigation when pages are deleted
    revalidatePath('/sitemap.xml')
    revalidatePath('/robots.txt')
    revalidateTag('navigation')
  }

  return doc
}
