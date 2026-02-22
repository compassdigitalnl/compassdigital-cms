'use client'

/**
 * Sprint 7: Content Access Hook
 *
 * Client-side hook to check if the current user has access to premium content
 */

import { useAuth } from '@/providers/Auth'
import type { BlogPost } from '@/payload-types'
import {
  checkContentAccess,
  userHasPremiumAccess,
  type ContentAccessResult,
} from '@/branches/content/utils/checkContentAccess'

export interface UseContentAccessResult extends ContentAccessResult {
  isLoading: boolean
  isPremiumUser: boolean
}

/**
 * Hook to check content access for the current user
 *
 * @param post - The blog post to check access for
 * @returns Access result including loading state and premium user status
 *
 * @example
 * ```tsx
 * function BlogPost({ post }) {
 *   const { hasAccess, reason, isLoading, isPremiumUser } = useContentAccess(post)
 *
 *   if (isLoading) return <Skeleton />
 *   if (!hasAccess) return <PaywallOverlay reason={reason} />
 *
 *   return <ArticleContent content={post.content} />
 * }
 * ```
 */
export function useContentAccess(post: BlogPost | null): UseContentAccessResult {
  const { user, status } = useAuth()

  // Loading state
  const isLoading = status === 'loading'

  // Check if user has any premium subscription
  const isPremiumUser = userHasPremiumAccess(user)

  // Check access to this specific post
  if (!post) {
    return {
      hasAccess: false,
      reason: undefined,
      isLoading,
      isPremiumUser,
    }
  }

  const accessResult = checkContentAccess(post, user)

  return {
    ...accessResult,
    isLoading,
    isPremiumUser,
  }
}

/**
 * Hook to check if the current user has any premium access
 * (without requiring a specific post)
 *
 * Useful for UI elements like "Upgrade to Pro" banners
 *
 * @example
 * ```tsx
 * function NavBar() {
 *   const { isPremiumUser, isLoading } = usePremiumAccess()
 *
 *   if (isLoading) return null
 *   if (isPremiumUser) return <Badge>Pro Member</Badge>
 *
 *   return <UpgradeBanner />
 * }
 * ```
 */
export function usePremiumAccess() {
  const { user, status } = useAuth()

  const isLoading = status === 'loading'
  const isPremiumUser = userHasPremiumAccess(user)

  return {
    isPremiumUser,
    isLoading,
    user,
  }
}
