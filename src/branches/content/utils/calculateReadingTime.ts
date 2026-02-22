/**
 * Sprint 7: Reading Time Calculator
 *
 * Calculates estimated reading time for blog posts and content
 * based on word count, images, and content complexity
 */

import type { BlogPost } from '@/payload-types'

export interface ReadingTimeResult {
  minutes: number
  words: number
  text: string // Human-readable format: "5 min leestijd"
}

const WORDS_PER_MINUTE = 225 // Average reading speed for Dutch technical content
const IMAGE_READING_TIME = 12 // Seconds per image (on average)
const CODE_BLOCK_FACTOR = 1.5 // Code blocks take 50% longer to read

/**
 * Extract plain text from Lexical rich text content
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
 * Count images in Lexical content
 */
function countImages(content: any): number {
  if (!content || !content.root || !content.root.children) {
    return 0
  }

  let imageCount = 0

  function traverse(node: any) {
    if (!node) return

    // Check for image blocks or upload nodes
    if (node.type === 'upload' || node.type === 'image') {
      imageCount++
    }

    // Check for blocks that might contain images
    if (node.type === 'block' && node.fields) {
      // Some blocks have featured images or media
      if (node.fields.featuredImage || node.fields.image || node.fields.media) {
        imageCount++
      }
    }

    // Traverse children
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(traverse)
    }
  }

  traverse(content.root)
  return imageCount
}

/**
 * Count code blocks in Lexical content
 */
function countCodeBlocks(content: any): number {
  if (!content || !content.root || !content.root.children) {
    return 0
  }

  let codeBlockCount = 0

  function traverse(node: any) {
    if (!node) return

    // Check for code blocks
    if (node.type === 'code') {
      codeBlockCount++
    }

    // Traverse children
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(traverse)
    }
  }

  traverse(content.root)
  return codeBlockCount
}

/**
 * Calculate reading time for a blog post
 *
 * Factors:
 * - Word count (base calculation)
 * - Images (add 12 seconds per image)
 * - Code blocks (add 50% time for technical content)
 * - Minimum reading time: 1 minute
 */
export function calculateReadingTime(post: BlogPost): ReadingTimeResult {
  // Extract text from content
  const plainText = extractTextFromLexical(post.content)

  // Count words
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length

  // Count images
  const imageCount = countImages(post.content)

  // Count code blocks
  const codeBlockCount = countCodeBlocks(post.content)

  // Base reading time (words)
  let totalMinutes = wordCount / WORDS_PER_MINUTE

  // Add time for images (12 seconds each)
  totalMinutes += (imageCount * IMAGE_READING_TIME) / 60

  // Add extra time for code blocks (50% longer)
  if (codeBlockCount > 0) {
    const codeBlockWords = wordCount * 0.2 // Assume ~20% of content is code
    const codeBlockExtraTime = (codeBlockWords / WORDS_PER_MINUTE) * (CODE_BLOCK_FACTOR - 1)
    totalMinutes += codeBlockExtraTime
  }

  // Round to nearest minute, minimum 1 minute
  const minutes = Math.max(1, Math.round(totalMinutes))

  // Generate human-readable text
  const text = `${minutes} min leestijd`

  return {
    minutes,
    words: wordCount,
    text,
  }
}

/**
 * Calculate reading time from plain text
 * (useful for previews or excerpts)
 */
export function calculateReadingTimeFromText(text: string): ReadingTimeResult {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE))

  return {
    minutes,
    words: wordCount,
    text: `${minutes} min leestijd`,
  }
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return '< 1 min leestijd'
  if (minutes === 1) return '1 min leestijd'
  return `${minutes} min leestijd`
}
