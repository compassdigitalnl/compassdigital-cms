/**
 * Sprint 7: Premium Content Access Control
 *
 * Determines if a user has access to premium blog content
 * based on their subscription status
 */

import type { User, BlogPost, UserSubscription, SubscriptionPlan } from '@/payload-types'

export interface ContentAccessResult {
  hasAccess: boolean
  reason?:
    | 'free_content' // Content is free for everyone
    | 'not_logged_in' // User not logged in
    | 'no_subscription' // User logged in but no active subscription
    | 'subscription_inactive' // Subscription exists but not active
    | 'plan_no_premium_access' // Plan doesn't allow premium content
    | 'has_premium_access' // User has valid premium access
}

/**
 * Check if a user has access to a blog post's content
 *
 * Access is granted if:
 * 1. Content is marked as 'free' (accessible to everyone)
 * 2. Content is 'premium' AND user has active subscription with allowsPremiumContent=true
 */
export function checkContentAccess(post: BlogPost, user: User | null): ContentAccessResult {
  // Free content: everyone has access
  if (!post.contentAccess || post.contentAccess.accessLevel === 'free') {
    return { hasAccess: true, reason: 'free_content' }
  }

  // Premium content requires user to be logged in
  if (!user) {
    return { hasAccess: false, reason: 'not_logged_in' }
  }

  // Check if user has any subscriptions
  if (!user.subscriptions || user.subscriptions.length === 0) {
    return { hasAccess: false, reason: 'no_subscription' }
  }

  // Check for active subscription with premium access
  const hasValidSubscription = user.subscriptions.some((sub) => {
    // Subscription can be string ID or populated object
    if (typeof sub === 'string') {
      // Cannot check plan details with just ID, skip
      return false
    }

    const subscription = sub as UserSubscription

    // Check subscription status
    if (subscription.status !== 'active' && subscription.status !== 'trialing') {
      return false
    }

    // Check if plan allows premium content
    const plan = subscription.plan as SubscriptionPlan
    if (typeof plan === 'string') {
      // Plan not populated, cannot check
      return false
    }

    return plan.allowsPremiumContent === true
  })

  if (hasValidSubscription) {
    return { hasAccess: true, reason: 'has_premium_access' }
  }

  // User has subscription but it doesn't allow premium content
  const hasActiveSubscription = user.subscriptions.some((sub) => {
    if (typeof sub === 'string') return false
    const subscription = sub as UserSubscription
    return subscription.status === 'active' || subscription.status === 'trialing'
  })

  if (hasActiveSubscription) {
    return { hasAccess: false, reason: 'plan_no_premium_access' }
  }

  return { hasAccess: false, reason: 'subscription_inactive' }
}

/**
 * Get user-friendly message for access denial reason
 */
export function getAccessDenialMessage(reason: ContentAccessResult['reason']): string {
  switch (reason) {
    case 'not_logged_in':
      return 'Log in om dit premium artikel te lezen'
    case 'no_subscription':
      return 'Upgrade naar een Pro abonnement om toegang te krijgen'
    case 'subscription_inactive':
      return 'Je abonnement is verlopen. Hernieuw om toegang te behouden.'
    case 'plan_no_premium_access':
      return 'Upgrade naar een Pro abonnement voor toegang tot premium content'
    default:
      return 'Upgrade naar Pro voor volledige toegang'
  }
}

/**
 * Check if user has any active premium subscription
 * (useful for UI display without specific post context)
 */
export function userHasPremiumAccess(user: User | null): boolean {
  if (!user || !user.subscriptions || user.subscriptions.length === 0) {
    return false
  }

  return user.subscriptions.some((sub) => {
    if (typeof sub === 'string') return false

    const subscription = sub as UserSubscription
    if (subscription.status !== 'active' && subscription.status !== 'trialing') {
      return false
    }

    const plan = subscription.plan as SubscriptionPlan
    if (typeof plan === 'string') return false

    return plan.allowsPremiumContent === true
  })
}
