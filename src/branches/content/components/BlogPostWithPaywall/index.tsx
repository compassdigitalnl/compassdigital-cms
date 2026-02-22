'use client'

/**
 * Sprint 7: Blog Post With Paywall Component
 *
 * Wrapper component that handles access control and paywall display
 * for premium blog posts
 */

import React, { useMemo } from 'react'
import type { BlogPost } from '@/payload-types'
import { useContentAccess } from '@/branches/content/hooks/useContentAccess'
import { PaywallOverlay } from '@/branches/content/components/PaywallOverlay'
import { PremiumBadge } from '@/branches/content/components/PremiumBadge'
import { RenderBlogContent } from '@/branches/shared/components/features/blog/blog/RenderBlogContent'

export interface BlogPostWithPaywallProps {
  /**
   * Blog post data
   */
  post: BlogPost

  /**
   * Show premium badge in header
   */
  showPremiumBadge?: boolean

  /**
   * Additional CSS class for content wrapper
   */
  className?: string
}

/**
 * Extract plain text from Lexical content for preview truncation
 */
function extractTextFromLexical(content: any): string {
  if (!content || !content.root || !content.root.children) {
    return ''
  }

  let text = ''

  function traverse(node: any) {
    if (!node) return

    // Text nodes
    if (node.text) {
      text += node.text + ' '
    }

    // Traverse children
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(traverse)
    }
  }

  traverse(content.root)
  return text
}

/**
 * Truncate Lexical content to a specific word count
 */
function truncateLexicalContent(content: any, wordLimit: number): any {
  if (!content || !content.root || !content.root.children) {
    return content
  }

  let wordCount = 0
  let truncated = false

  function truncateNode(node: any): any | null {
    if (truncated) return null

    const newNode: any = { ...node }

    // Handle text nodes
    if (node.text) {
      const words = node.text.split(/\s+/).filter(Boolean)
      const remainingWords = wordLimit - wordCount

      if (words.length <= remainingWords) {
        wordCount += words.length
        return newNode
      } else {
        // Truncate this text node
        newNode.text = words.slice(0, remainingWords).join(' ') + '...'
        wordCount = wordLimit
        truncated = true
        return newNode
      }
    }

    // Handle nodes with children
    if (node.children && Array.isArray(node.children)) {
      newNode.children = node.children
        .map(truncateNode)
        .filter((child: any) => child !== null)

      if (truncated && newNode.children.length === 0) {
        return null
      }
    }

    return newNode
  }

  const truncatedContent = {
    ...content,
    root: {
      ...content.root,
      children: content.root.children
        .map(truncateNode)
        .filter((child: any) => child !== null),
    },
  }

  return truncatedContent
}

/**
 * Blog Post With Paywall Component
 *
 * Handles premium content access control and displays paywall
 * when user doesn't have access
 */
export function BlogPostWithPaywall({
  post,
  showPremiumBadge = true,
  className = '',
}: BlogPostWithPaywallProps) {
  // Check access
  const { hasAccess, reason, isLoading } = useContentAccess(post)

  // Get access level and preview settings
  const isPremium = post.contentAccess?.accessLevel === 'premium'
  const previewLength = post.contentAccess?.previewLength || 200
  const lockMessage = post.contentAccess?.lockMessage

  // Determine if we should show preview + paywall
  const showPaywall = isPremium && !hasAccess && !isLoading

  // Truncate content for preview if needed
  const displayContent = useMemo(() => {
    if (!showPaywall) {
      // Full access - show full content
      return post.content
    }

    // Limited access - show truncated preview
    return truncateLexicalContent(post.content, previewLength)
  }, [post.content, showPaywall, previewLength])

  // Loading state
  if (isLoading) {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Premium Badge (optional) */}
      {showPremiumBadge && isPremium && (
        <div className="mb-6">
          <PremiumBadge variant="solid" size="md" icon="crown" text="Pro Content" pill />
        </div>
      )}

      {/* Blog Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <RenderBlogContent content={displayContent} />
      </div>

      {/* Paywall Overlay */}
      {showPaywall && reason && (
        <PaywallOverlay
          reason={reason}
          customMessage={lockMessage || undefined}
          variant="overlay"
        />
      )}
    </div>
  )
}
