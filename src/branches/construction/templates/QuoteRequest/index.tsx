import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { QuoteForm } from '@/branches/construction/components/QuoteForm'
import { QuoteSidebar } from '@/branches/construction/components/QuoteSidebar'
import type { QuoteRequestProps } from './types'

export async function QuoteRequestTemplate({ phone = '0251-247233' }: QuoteRequestProps) {
  let testimonial = null
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'construction-reviews',
      where: { and: [{ status: { equals: 'published' } }, { featured: { equals: true } }] },
      limit: 1,
      sort: '-createdAt',
    })
    testimonial = result.docs[0] || null
  } catch (e) { /* fail silently */ }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-grey-mid">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-navy">Offerte aanvragen</span>
        </nav>
      </div>

      <section className="bg-gradient-to-br from-secondary to-secondary/90 py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="font-display text-3xl text-white md:text-4xl">Gratis offerte aanvragen</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-white/80">Vul het formulier in en ontvang binnen 24 uur een vrijblijvende offerte op maat.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-grey bg-white p-6 md:p-8">
              <QuoteForm />
            </div>
          </div>
          <QuoteSidebar phone={phone} testimonial={testimonial} />
        </div>
      </div>
    </div>
  )
}

export default QuoteRequestTemplate
