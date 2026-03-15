'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Shield, Printer, FileText } from 'lucide-react'
import { Breadcrumb } from '@/globals/site/breadcrumbs/components/Breadcrumb'
import type { LegalLayoutProps } from './types'

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
    <div className="min-h-screen bg-grey-light">
      {/* Header */}
      <header className="bg-white border-b border-grey-light sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-extrabold text-navy-900">
              plasti<span className="text-[var(--color-primary)]">med</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-grey-mid hover:text-[var(--color-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar winkel
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-grey-light">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-extrabold text-navy-900 mb-2">{title}</h1>

        <div className="flex items-center gap-4 mb-6 text-sm text-grey-mid">
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
            className="btn btn-outline-neutral btn-sm flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>

        <div className="grid grid-cols-[220px_1fr] gap-8 items-start">
          {/* TOC Sidebar */}
          <nav className="sticky top-24 bg-white border border-grey-light rounded-2xl p-4">
            <div className="text-xs font-extrabold text-navy-900 mb-2.5">
              Inhoud
            </div>
            {tocItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block px-2.5 py-1.5 text-xs rounded-lg mb-0.5 transition-all ${
                  activeSection === item.id
                    ? 'bg-[var(--color-primary-glow)] text-[var(--color-primary)] font-semibold'
                    : 'text-grey-dark hover:bg-[var(--color-primary-glow)] hover:text-[var(--color-primary)]'
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
