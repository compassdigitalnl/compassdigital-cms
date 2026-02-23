/**
 * Slug Generation Utility
 *
 * Provides utilities for automatically generating URL-friendly slugs
 * from titles and other text fields in Payload CMS collections.
 */

/**
 * Convert a string to a URL-friendly slug
 *
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug (lowercase, alphanumeric, hyphens only)
 *
 * @example
 * slugify('Hello World!') // => 'hello-world'
 * slugify('Café & Restaurant') // => 'cafe-restaurant'
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Normalize accents (é => e)
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/(^-|-$)/g, '') // Remove leading/trailing hyphens
}

/**
 * Payload beforeValidate hook to auto-generate slug from title
 *
 * This hook automatically generates a URL slug from the title field
 * if the slug is empty. It can be used in any Payload collection.
 *
 * @example
 * // In your collection config:
 * fields: [
 *   { name: 'title', type: 'text', required: true },
 *   {
 *     name: 'slug',
 *     type: 'text',
 *     required: true,
 *     unique: true,
 *     hooks: { beforeValidate: [autoGenerateSlug] }
 *   }
 * ]
 */
export const autoGenerateSlug = ({ value, data }: any) => {
  // If slug is already filled, keep it (allow manual override)
  if (value) {
    return value
  }

  // Generate from title if available
  if (data?.title) {
    return slugify(data.title)
  }

  // Return empty if no title available
  return value
}

/**
 * Payload beforeValidate hook to auto-generate slug from name
 * (for collections that use 'name' instead of 'title')
 *
 * @example
 * // In your collection config:
 * fields: [
 *   { name: 'name', type: 'text', required: true },
 *   {
 *     name: 'slug',
 *     type: 'text',
 *     required: true,
 *     unique: true,
 *     hooks: { beforeValidate: [autoGenerateSlugFromName] }
 *   }
 * ]
 */
export const autoGenerateSlugFromName = ({ value, data }: any) => {
  // If slug is already filled, keep it (allow manual override)
  if (value) {
    return value
  }

  // Generate from name if available
  if (data?.name) {
    return slugify(data.name)
  }

  // Return empty if no name available
  return value
}

/**
 * Generate alt text from filename
 *
 * Converts "product-image-2024.jpg" → "Product Image 2024"
 * Removes file extension, replaces dashes/underscores with spaces,
 * and capitalizes each word.
 *
 * @param filename - The filename to convert
 * @returns Human-readable alt text
 *
 * @example
 * filenameToAltText('my-product-photo.jpg') // => 'My Product Photo'
 * filenameToAltText('banner_2024_sale.png') // => 'Banner 2024 Sale'
 */
export function filenameToAltText(filename: string): string {
  return (
    filename
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[-_]/g, ' ') // Replace dashes/underscores with spaces
      .replace(/\b\w/g, (l) => l.toUpperCase()) // Capitalize each word
  )
}

/**
 * Payload beforeValidate hook to auto-generate alt text from filename
 *
 * Automatically creates descriptive alt text from the uploaded file's name
 * if alt text is not provided. This ensures accessibility compliance while
 * not blocking uploads.
 *
 * @example
 * // In Media collection config:
 * fields: [
 *   {
 *     name: 'alt',
 *     type: 'text',
 *     required: false,
 *     hooks: { beforeValidate: [autoGenerateAltText] }
 *   }
 * ]
 */
export const autoGenerateAltText = ({ value, data }: any) => {
  // If alt text already provided, keep it (allow manual override)
  if (value) {
    return value
  }

  // Generate from filename if available
  if (data?.filename) {
    return filenameToAltText(data.filename)
  }

  // Return empty if no filename (shouldn't happen in Media uploads)
  return value
}
