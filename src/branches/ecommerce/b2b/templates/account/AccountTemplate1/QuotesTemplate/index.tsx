'use client'

import React from 'react'
import { Clock, Tag, ShieldCheck, Check, Phone } from 'lucide-react'
import { AccountLoadingSkeleton } from '@/branches/ecommerce/shared/components/account/ui'
import {
  QuoteProductTable,
  QuoteForm,
  QuoteSteps,
} from '@/branches/ecommerce/b2b/components/account/quotes'
import type { QuotesTemplateProps } from './types'

const TRUST_ITEMS = [
  'Extra korting bij grote volumes',
  'Prijsgarantie gedurende offerte',
  'Op maat samengestelde pakketten',
  'Persoonlijk advies van specialist',
  'Flexibele leveringsschema\'s',
]

export default function QuotesTemplate({
  products,
  formData,
  onQuantityChange,
  onRemoveProduct,
  onAddProduct,
  onFormChange,
  onSubmit,
  isSubmitting,
  isLoading,
  contactPhone,
  contactEmail,
}: QuotesTemplateProps) {
  if (isLoading) return <AccountLoadingSkeleton variant="page" />

  return (
    <div className="space-y-5 lg:space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2 text-gray-900">
          Offerte aanvragen
        </h1>
        <p className="text-sm lg:text-base text-gray-500">
          Grote bestelling of specifieke wensen? Vraag een offerte aan en ontvang scherpe volume-prijzen binnen 24 uur.
        </p>
      </div>

      {/* Hero banner */}
      <div
        className="rounded-2xl px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light))' }}
      >
        {/* Glow accent */}
        <div
          className="absolute top-0 right-16 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--color-primary-glow), transparent 70%)' }}
        />
        <div className="relative">
          <h2
            className="text-xl md:text-2xl font-extrabold text-white mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Offerte op maat aanvragen
          </h2>
          <p className="text-sm max-w-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Grote bestelling of specifieke wensen? Vraag een offerte aan en ontvang scherpe volume-prijzen binnen 24 uur.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 relative flex-shrink-0">
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.60)' }}
          >
            <Clock className="w-4 h-4" style={{ color: 'var(--color-primary-light)' }} />
            Reactie binnen 24 uur
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.60)' }}
          >
            <Tag className="w-4 h-4" style={{ color: 'var(--color-primary-light)' }} />
            Scherpe volumeprijzen
          </div>
        </div>
      </div>

      {/* Main layout: form + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 lg:gap-7 items-start pb-10">
        {/* Left column */}
        <div className="space-y-5">
          {/* Step 1: Products */}
          <div className="bg-white border rounded-2xl p-6 md:p-7" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
                style={{ background: 'var(--color-primary)' }}
              >
                1
              </span>
              <h2
                className="text-base font-extrabold"
                style={{ color: 'var(--color-foreground)', fontFamily: 'var(--font-heading)' }}
              >
                Producten toevoegen
              </h2>
            </div>
            <p className="text-sm mb-5 ml-9" style={{ color: 'var(--color-muted-foreground)' }}>
              Zoek en voeg de gewenste producten toe met het aantal. U kunt ook een omschrijving typen als u het exacte product niet weet.
            </p>
            <QuoteProductTable
              products={products}
              onQuantityChange={onQuantityChange}
              onRemove={onRemoveProduct}
              onAddProduct={onAddProduct}
            />
          </div>

          {/* Steps 2 + 3 (company info + delivery) */}
          <QuoteForm
            formData={formData}
            onChange={onFormChange}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* How it works */}
          <QuoteSteps />

          {/* Why via quote */}
          <div className="bg-white border rounded-2xl p-6" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              <h3
                className="text-sm font-extrabold"
                style={{ color: 'var(--color-foreground)', fontFamily: 'var(--font-heading)' }}
              >
                Waarom via offerte?
              </h3>
            </div>
            <ul className="space-y-2">
              {TRUST_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-foreground)' }}>
                  <Check className="w-4 h-4 flex-shrink-0 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Phone help */}
          {contactPhone && (
            <div
              className="rounded-2xl p-6 text-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light))' }}
            >
              <div
                className="absolute -top-5 -right-5 w-24 h-24 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, var(--color-primary-glow), transparent 70%)' }}
              />
              <h4
                className="text-base font-extrabold text-white mb-1.5 relative"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Liever telefonisch?
              </h4>
              <p className="text-xs leading-relaxed mb-3.5 relative" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Onze productspecialisten helpen u graag met een offerte op maat.
              </p>
              <a
                href={`tel:${contactPhone.replace(/[^+\d]/g, '')}`}
                className="inline-flex items-center gap-1.5 text-sm font-bold relative transition-colors"
                style={{ color: 'var(--color-primary-light)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-primary-light)')}
              >
                <Phone className="w-4 h-4" />
                {contactPhone}
              </a>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
