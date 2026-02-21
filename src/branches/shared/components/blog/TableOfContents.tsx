'use client'
import React, { useEffect, useState } from 'react'
import { Icon } from '@/branches/shared/components/Icon'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  className?: string
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ className = '' }) => {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Extract all H2 and H3 headings from article content
    const articleContent = document.querySelector('.article-content')
    if (!articleContent) return

    const headingElements = articleContent.querySelectorAll('h2, h3')
    const items: TOCItem[] = []

    headingElements.forEach((heading, index) => {
      // Create ID if it doesn't exist
      let id = heading.id
      if (!id) {
        id = `heading-${index}`
        heading.id = id
      }

      items.push({
        id,
        text: heading.textContent || '',
        level: heading.tagName === 'H2' ? 2 : 3,
      })
    })

    setHeadings(items)

    // Scroll spy - track which heading is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -60% 0px',
      },
    )

    headingElements.forEach((heading) => {
      observer.observe(heading)
    })

    return () => {
      headingElements.forEach((heading) => {
        observer.unobserve(heading)
      })
    }
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const top = element.offsetTop - 140 // Account for sticky header
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl p-6 sticky ${className}`}
      style={{ top: '140px' }}
    >
      <div className="flex items-center gap-2 font-extrabold text-sm text-gray-900 mb-4">
        <Icon name="List" size={16} className="text-teal-600" />
        Inhoudsopgave
      </div>

      <nav>
        <ul className="flex flex-col gap-1">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={`flex items-start gap-2 py-2 px-3 rounded-lg text-sm transition-all border-l-2 ${
                  activeId === heading.id
                    ? 'bg-teal-50 text-teal-700 font-bold border-teal-500'
                    : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600 border-transparent hover:border-teal-500'
                } ${heading.level === 3 ? 'ml-4 text-xs' : ''}`}
                style={{
                  textDecoration: 'none',
                }}
              >
                <span
                  className={`w-1 h-1 rounded-full flex-shrink-0 mt-1.5 ${
                    activeId === heading.id ? 'bg-teal-600' : 'bg-gray-400'
                  }`}
                />
                <span className="line-clamp-2">{heading.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
