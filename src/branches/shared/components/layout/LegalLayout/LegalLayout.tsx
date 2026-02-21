'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Shield, Printer, FileText } from 'lucide-react'
import { Breadcrumb } from '@/branches/shared/components/layout/breadcrumbs/Breadcrumb'

interface TOCItem {
  id: string
  label: string
}

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  badge?: {
    icon: React.ReactNode
    label: string
  }
  tocItems: TOCItem[]
  children: React.ReactNode
  breadcrumbItems: { label: string; href?: string }[]
}

export function LegalLayout({
  title,
  lastUpdated,
  badge,
  tocItems,
  children,
  breadcrumbItems,
}: LegalLayoutProps) {
  const [activeSection, setActiveSection] = useState(tocItems[0]?.id || '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -80% 0px',
      },
    )

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [tocItems])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-extrabold text-navy-900">
              plasti<span className="text-teal-600">med</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar winkel
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-extrabold text-navy-900 mb-2">{title}</h1>

        <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Laatste update: {lastUpdated}
          </span>
          {badge && (
            <span className="flex items-center gap-1.5">
              {badge.icon}
              {badge.label}
            </span>
          )}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg font-semibold text-navy-900 hover:border-teal-600 hover:text-teal-600 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>

        <div className="grid grid-cols-[220px_1fr] gap-8 items-start">
          {/* TOC Sidebar */}
          <nav className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-4">
            <div className="text-xs font-extrabold text-navy-900 mb-2.5">
              Inhoud
            </div>
            {tocItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block px-2.5 py-1.5 text-xs rounded-lg mb-0.5 transition-all ${
                  activeSection === item.id
                    ? 'bg-teal-50 text-teal-600 font-semibold'
                    : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Content */}
          <div className="legal-body">{children}</div>
        </div>
      </div>
    </div>
  )
}
