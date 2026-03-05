/**
 * Lexical RichText Conversion Helpers
 * Converts various text formats to Lexical JSON structure
 * Required for Payload CMS richText fields
 */

export class LexicalHelpers {
  /**
   * Convert plain text to Lexical paragraph node
   */
  static textToParagraph(text: string) {
    return {
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          mode: 'normal',
          text: text || '',
          type: 'text',
          style: '',
          detail: 0,
          format: 0,
          version: 1,
        },
      ],
      direction: 'ltr' as const,
    }
  }

  /**
   * Convert text to Lexical heading node
   */
  static textToHeading(text: string, level: 'h2' | 'h3' | 'h4' = 'h2') {
    return {
      type: 'heading',
      tag: level,
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          mode: 'normal',
          text: text || '',
          type: 'text',
          style: '',
          detail: 0,
          format: 0,
          version: 1,
        },
      ],
      direction: 'ltr' as const,
    }
  }

  /**
   * Convert multiple paragraphs to Lexical root structure
   */
  static paragraphsToLexical(paragraphs: string[]) {
    return {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: paragraphs.map((p) => this.textToParagraph(p)),
        direction: 'ltr' as const,
      },
    }
  }

  /**
   * Convert heading + paragraphs to Lexical root
   * Useful for content blocks with title + body
   */
  static contentToLexical(heading: string, paragraphs: string[]) {
    return {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [this.textToHeading(heading, 'h2'), ...paragraphs.map((p) => this.textToParagraph(p))],
        direction: 'ltr' as const,
      },
    }
  }

  /**
   * Convert single text to Lexical root
   * Simplest conversion - used for FAQ answers, simple content
   */
  static textToLexical(text: string) {
    return {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [this.textToParagraph(text)],
        direction: 'ltr' as const,
      },
    }
  }

  /**
   * Convert array of items (mixed headings/paragraphs) to Lexical
   * Auto-detects if item should be heading or paragraph
   */
  static mixedContentToLexical(items: Array<{ type: 'heading' | 'paragraph'; text: string; level?: 'h2' | 'h3' | 'h4' }>) {
    return {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: items.map((item) => {
          if (item.type === 'heading') {
            return this.textToHeading(item.text, item.level || 'h2')
          }
          return this.textToParagraph(item.text)
        }),
        direction: 'ltr' as const,
      },
    }
  }

  /**
   * Convert contact info to formatted Lexical content
   * Special helper for contact-info blocks
   */
  static contactInfoToLexical(
    heading: string,
    intro: string,
    contactDetails: Array<{ label: string; value: string }>,
  ) {
    const children = [
      this.textToHeading(heading, 'h2'),
      this.textToParagraph(intro),
      // Add contact details as paragraphs
      ...contactDetails.map((detail) => this.textToParagraph(`${detail.label}: ${detail.value}`)),
    ]

    return {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children,
        direction: 'ltr' as const,
      },
    }
  }

  /**
   * Validate Lexical JSON structure
   * Returns true if structure is valid
   */
  static isValidLexical(data: any): boolean {
    if (!data || typeof data !== 'object') return false
    if (!data.root || typeof data.root !== 'object') return false
    if (data.root.type !== 'root') return false
    if (!Array.isArray(data.root.children)) return false
    return true
  }
}
