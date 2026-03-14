export interface AuthorCardAuthor {
  /**
   * Author name
   */
  name: string

  /**
   * Short bio / description
   */
  bio?: string

  /**
   * Avatar image URL
   */
  avatar?: string | null

  /**
   * Number of articles published by this author
   */
  articleCount?: number

  /**
   * Author slug for linking to author filter page
   */
  slug?: string
}

export interface AuthorCardProps {
  /**
   * Author data
   */
  author: AuthorCardAuthor

  /**
   * Additional CSS classes
   */
  className?: string
}
