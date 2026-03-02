import React, { Fragment } from 'react'
import Link from 'next/link'

/**
 * Serialize Lexical JSON to React JSX
 *
 * Converts Payload CMS Lexical editor JSON output to renderable React elements.
 * Supports: paragraphs, headings, bold, italic, links, lists, blockquotes, code blocks.
 */

type SerializedNode = {
  type?: string
  version?: number
  [key: string]: unknown
  children?: SerializedNode[]
}

type SerializedRoot = {
  root: SerializedNode
}

export function serializeLexical({ nodes }: { nodes: SerializedNode | SerializedRoot }): React.ReactNode {
  // Handle root object
  if (nodes && typeof nodes === 'object' && 'root' in nodes) {
    const root = nodes.root as SerializedNode
    return serializeChildren(root.children)
  }

  // Handle direct children array
  if (nodes && typeof nodes === 'object' && 'children' in nodes) {
    return serializeChildren(nodes.children)
  }

  return null
}

function serializeChildren(children?: SerializedNode[]): React.ReactNode {
  if (!children || !Array.isArray(children)) return null

  return children.map((node, index) => {
    return <Fragment key={index}>{serializeNode(node)}</Fragment>
  })
}

function serializeNode(node: SerializedNode): React.ReactNode {
  if (!node) return null

  const type = node.type as string

  // Text node
  if (type === 'text') {
    let text = node.text as string

    // Apply text formatting
    if (node.format) {
      const format = node.format as number

      // Bold (format & 1)
      if (format & 1) {
        text = <strong key="bold">{text}</strong> as any
      }

      // Italic (format & 2)
      if (format & 2) {
        text = <em key="italic">{text}</em> as any
      }

      // Underline (format & 8)
      if (format & 8) {
        text = <u key="underline">{text}</u> as any
      }

      // Strikethrough (format & 4)
      if (format & 4) {
        text = <s key="strikethrough">{text}</s> as any
      }

      // Code (format & 16)
      if (format & 16) {
        text = <code key="code" className="inline-code">{text}</code> as any
      }
    }

    return text
  }

  // Paragraph
  if (type === 'paragraph') {
    return <p className="mb-4 last:mb-0">{serializeChildren(node.children)}</p>
  }

  // Headings
  if (type === 'heading') {
    const tag = node.tag as string
    const className = "font-serif font-semibold mb-4 mt-8 first:mt-0"

    const children = serializeChildren(node.children)

    switch (tag) {
      case 'h1':
        return <h1 className={`text-4xl ${className}`}>{children}</h1>
      case 'h2':
        return <h2 className={`text-3xl ${className}`}>{children}</h2>
      case 'h3':
        return <h3 className={`text-2xl ${className}`}>{children}</h3>
      case 'h4':
        return <h4 className={`text-xl ${className}`}>{children}</h4>
      case 'h5':
        return <h5 className={`text-lg ${className}`}>{children}</h5>
      case 'h6':
        return <h6 className={`text-base ${className}`}>{children}</h6>
      default:
        return <p className="mb-4">{children}</p>
    }
  }

  // Links
  if (type === 'link' || type === 'autolink') {
    const fields = node.fields as Record<string, unknown> | undefined
    const url = (node.url || fields?.url) as string
    const newTab = node.newTab as boolean

    if (!url) return serializeChildren(node.children)

    // External links
    if (url.startsWith('http')) {
      return (
        <a
          href={url}
          target={newTab ? '_blank' : undefined}
          rel={newTab ? 'noopener noreferrer' : undefined}
          className="text-teal underline hover:text-teal/80 transition-colors"
        >
          {serializeChildren(node.children)}
        </a>
      )
    }

    // Internal links
    return (
      <Link href={url} className="text-teal underline hover:text-teal/80 transition-colors">
        {serializeChildren(node.children)}
      </Link>
    )
  }

  // Lists
  if (type === 'list') {
    const listType = node.listType as string
    const className = "mb-4 ml-6 space-y-2"

    if (listType === 'number') {
      return <ol className={`list-decimal ${className}`}>{serializeChildren(node.children)}</ol>
    }

    return <ul className={`list-disc ${className}`}>{serializeChildren(node.children)}</ul>
  }

  if (type === 'listitem') {
    return <li>{serializeChildren(node.children)}</li>
  }

  // Blockquote
  if (type === 'quote') {
    return (
      <blockquote className="border-l-4 border-teal pl-4 italic my-6 text-gray-700">
        {serializeChildren(node.children)}
      </blockquote>
    )
  }

  // Code block
  if (type === 'code') {
    const language = node.language as string || 'text'
    return (
      <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto my-6">
        <code className={`language-${language} text-sm`}>
          {serializeChildren(node.children)}
        </code>
      </pre>
    )
  }

  // Line break
  if (type === 'linebreak') {
    return <br />
  }

  // Fallback: render children
  return serializeChildren(node.children)
}
