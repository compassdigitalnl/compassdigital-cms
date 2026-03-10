'use client'

import { useAuth } from '@payloadcms/ui'
import React, { useState, useEffect } from 'react'
import './index.scss'
import type { QuickActionProps, StatCardProps, DashboardProps } from './types'

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const formatEUR = (v: number) =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v)

// ─────────────────────────────────────────────────────────────
// Quick Action Card
// ─────────────────────────────────────────────────────────────
const QuickAction: React.FC<QuickActionProps> = ({
  href,
  icon,
  label,
  description,
  accent = false,
  external = false,
}) => (
  <a
    href={href}
    className={`cd-quick-action${accent ? ' cd-quick-action--accent' : ''}`}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
  >
    <span className="cd-quick-action__icon">{icon}</span>
    <span className="cd-quick-action__label">{label}</span>
    <span className="cd-quick-action__desc">{description}</span>
    <span className="cd-quick-action__arrow">&rarr;</span>
  </a>
)

// ─────────────────────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────────────────────
const StatCard: React.FC<StatCardProps> = ({ value, label, icon, color, change }) => (
  <div className={`cd-stat cd-stat--${color}`}>
    <span className="cd-stat__icon">{icon}</span>
    <span className="cd-stat__value">{value}</span>
    <span className="cd-stat__label">
      {label}
      {change !== undefined && change !== 0 && (
        <span
          className={`cd-stat__change ${change > 0 ? 'cd-stat__change--up' : 'cd-stat__change--down'}`}
        >
          {change > 0 ? '+' : ''}
          {change}%
        </span>
      )}
    </span>
  </div>
)

// ─────────────────────────────────────────────────────────────
// Hook: fetch collection count
// ─────────────────────────────────────────────────────────────
function useCollectionCount(slug: string): number | null {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch(`/api/${slug}?limit=0&depth=0`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.totalDocs !== undefined) setCount(data.totalDocs)
      })
      .catch(() => {})
  }, [slug])

  return count
}

// ─────────────────────────────────────────────────────────────
// Analytics Mini Widget
// ─────────────────────────────────────────────────────────────
const AnalyticsMini: React.FC = () => {
  const [stats, setStats] = useState<{
    totals: { revenue: number; orderCount: number; aov: number }
    comparison: {
      revenue: { change: number }
      orderCount: { change: number }
      aov: { change: number }
    }
  } | null>(null)

  useEffect(() => {
    fetch('/api/analytics/revenue?period=30d', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.totals) setStats(data)
      })
      .catch(() => {})
  }, [])

  if (!stats) return null

  return (
    <div className="cd-section">
      <div className="cd-section__header">
        <h2 className="cd-section__title cd-section__title--inline">Afgelopen 30 dagen</h2>
        <a href="/admin/analytics" className="cd-section__link">
          Bekijk details &rarr;
        </a>
      </div>
      <div className="cd-stats-row">
        <StatCard
          value={formatEUR(stats.totals.revenue)}
          label="Omzet"
          icon="💰"
          color="green"
          change={stats.comparison?.revenue?.change}
        />
        <StatCard
          value={String(stats.totals.orderCount)}
          label="Bestellingen"
          icon="📦"
          color="blue"
          change={stats.comparison?.orderCount?.change}
        />
        <StatCard
          value={formatEUR(stats.totals.aov)}
          label="Gem. bestelbedrag"
          icon="📊"
          color="orange"
          change={stats.comparison?.aov?.change}
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Admin Dashboard
// ─────────────────────────────────────────────────────────────
const AdminDashboard: React.FC<DashboardProps> = ({ userName }) => {
  const firstName = userName?.split(' ')[0] || 'Admin'
  const clientCount = useCollectionCount('clients')
  const pageCount = useCollectionCount('pages')
  const formCount = useCollectionCount('form-submissions')
  const mediaCount = useCollectionCount('media')

  return (
    <div className="cd-dashboard">
      {/* Hero */}
      <div className="cd-hero cd-hero--admin">
        <div className="cd-hero__content">
          <p className="cd-hero__eyebrow">CompassDigital Platform</p>
          <h1 className="cd-hero__title">Welkom terug, {firstName}</h1>
          <p className="cd-hero__subtitle">
            Beheer klant-sites, bekijk deployments en monitor het platform.
          </p>
        </div>
        <div className="cd-hero__badge">CD</div>
      </div>

      {/* Stats row — real data */}
      <div className="cd-stats-row">
        <StatCard
          value={clientCount !== null ? String(clientCount) : '...'}
          label="Actieve klanten"
          icon="🏢"
          color="blue"
        />
        <StatCard
          value={pageCount !== null ? String(pageCount) : '...'}
          label="Pagina's"
          icon="📄"
          color="green"
        />
        <StatCard
          value={formCount !== null ? String(formCount) : '...'}
          label="Form inzendingen"
          icon="📬"
          color="orange"
        />
        <StatCard
          value={mediaCount !== null ? String(mediaCount) : '...'}
          label="Media bestanden"
          icon="🖼️"
          color="purple"
        />
      </div>

      {/* Platform acties */}
      <div className="cd-section">
        <h2 className="cd-section__title">Platform beheer</h2>
        <div className="cd-grid cd-grid--3">
          <QuickAction
            href="/admin/collections/clients/"
            icon="🏢"
            label="Klanten"
            description="Bekijk en beheer alle klant-sites"
            accent
          />
          <QuickAction
            href="/admin/collections/deployments/"
            icon="🚀"
            label="Deployments"
            description="Deployment historie en status"
          />
          <QuickAction
            href="/site-generator/"
            icon="✨"
            label="Site Generator"
            description="Genereer een nieuwe klant-site met AI"
          />
        </div>
      </div>

      {/* Content acties */}
      <div className="cd-section">
        <h2 className="cd-section__title">Content & design</h2>
        <div className="cd-grid cd-grid--4">
          <QuickAction
            href="/admin/collections/pages/"
            icon="📄"
            label="Pagina's"
            description="Maak en bewerk pagina's"
          />
          <QuickAction
            href="/admin/collections/blog-posts/"
            icon="✍️"
            label="Blog"
            description="Schrijf en publiceer artikelen"
          />
          <QuickAction
            href="/admin/collections/media/"
            icon="🖼️"
            label="Media"
            description="Afbeeldingen en bestanden"
          />
          <QuickAction
            href="/admin/globals/theme/"
            icon="🎨"
            label="Theme"
            description="Kleuren en typografie"
          />
        </div>
      </div>

      {/* Systeem */}
      <div className="cd-section">
        <h2 className="cd-section__title">Systeem</h2>
        <div className="cd-grid cd-grid--3">
          <QuickAction
            href="/admin/collections/users/"
            icon="👥"
            label="Gebruikers"
            description="Beheer admin en editor accounts"
          />
          <QuickAction
            href="/admin/collections/form-submissions/"
            icon="📬"
            label="Formulieren"
            description="Bekijk ingestuurde formulieren"
          />
          <QuickAction
            href="/admin/globals/settings/"
            icon="⚙️"
            label="Instellingen"
            description="Site-brede configuratie"
          />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Editor Dashboard (Klant)
// ─────────────────────────────────────────────────────────────
const EditorDashboard: React.FC<DashboardProps> = ({ userName }) => {
  const firstName = userName?.split(' ')[0] || 'daar'

  // Read client configuration from env vars
  const ecommerceEnabled = process.env.NEXT_PUBLIC_ECOMMERCE_ENABLED === 'true'
  const shopModel = process.env.NEXT_PUBLIC_SHOP_MODEL // 'b2b' | 'b2c' | undefined
  const disabledCollections = new Set(
    (process.env.NEXT_PUBLIC_DISABLED_COLLECTIONS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  )

  // Helper: check if a collection is enabled
  const isEnabled = (slug: string) => !disabledCollections.has(slug)

  return (
    <div className="cd-dashboard">
      {/* Hero */}
      <div className="cd-hero cd-hero--editor">
        <div className="cd-hero__content">
          <p className="cd-hero__eyebrow">Mijn website</p>
          <h1 className="cd-hero__title">Hoi {firstName}!</h1>
          <p className="cd-hero__subtitle">
            Alles wat je nodig hebt om jouw website te beheren staat hier. Kies hieronder waar je
            mee aan de slag wil.
          </p>
        </div>
        <a href="/" className="cd-hero__cta" target="_blank" rel="noopener noreferrer">
          Bekijk mijn site &rarr;
        </a>
      </div>

      {/* Analytics mini (ecommerce only) */}
      {ecommerceEnabled && <AnalyticsMini />}

      {/* Meest gebruikt */}
      <div className="cd-section">
        <h2 className="cd-section__title">Snel aan de slag</h2>
        <div className="cd-grid cd-grid--2">
          <QuickAction
            href="/admin/collections/pages/create/"
            icon="➕"
            label="Nieuwe pagina"
            description="Voeg een nieuwe pagina toe aan je website"
            accent
          />
          <QuickAction
            href="/admin/collections/pages/"
            icon="📄"
            label="Pagina's beheren"
            description="Bekijk en bewerk al je pagina's"
            accent
          />
        </div>
      </div>

      {/* E-commerce sectie - alleen als ECOMMERCE_ENABLED=true */}
      {ecommerceEnabled && (
        <div className="cd-section">
          <h2 className="cd-section__title">E-commerce</h2>
          <div className="cd-grid cd-grid--3">
            <QuickAction
              href="/admin/collections/products/"
              icon="📦"
              label="Producten"
              description="Beheer je productcatalogus"
              accent
            />
            <QuickAction
              href="/admin/collections/product-categories/"
              icon="🏷️"
              label="Categorieën"
              description="Productcategorieën beheren"
            />
            {isEnabled('brands') && (
              <QuickAction
                href="/admin/collections/brands/"
                icon="🏭"
                label="Merken"
                description="Merken beheren"
              />
            )}
            <QuickAction
              href="/admin/collections/orders/"
              icon="🛒"
              label="Bestellingen"
              description="Bekijk en beheer bestellingen"
            />
            {shopModel === 'b2b' && (
              <>
                <QuickAction
                  href="/admin/collections/order-lists/"
                  icon="📋"
                  label="Bestelrondes"
                  description="B2B bestelrondes beheren"
                />
                <QuickAction
                  href="/admin/collections/customer-groups/"
                  icon="👥"
                  label="Klantgroepen"
                  description="B2B klantgroepen en prijzen"
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="cd-section">
        <h2 className="cd-section__title">Content</h2>
        <div className="cd-grid cd-grid--3">
          <QuickAction
            href="/admin/collections/blog-posts/create/"
            icon="✍️"
            label="Nieuw artikel"
            description="Schrijf een nieuw blog bericht"
          />
          <QuickAction
            href="/admin/collections/blog-posts/"
            icon="📰"
            label="Alle artikelen"
            description="Beheer al je blog berichten"
          />
          <QuickAction
            href="/admin/collections/media/"
            icon="🖼️"
            label="Media uploaden"
            description="Afbeeldingen en bestanden beheren"
          />
          <QuickAction
            href="/admin/collections/testimonials/"
            icon="⭐"
            label="Reviews"
            description="Klantreviews beheren"
          />
          {isEnabled('cases') && (
            <QuickAction
              href="/admin/collections/cases/"
              icon="💼"
              label="Projecten"
              description="Portfolio projecten beheren"
            />
          )}
          {isEnabled('partners') && (
            <QuickAction
              href="/admin/collections/partners/"
              icon="🤝"
              label="Partners"
              description="Partnerbedrijven beheren"
            />
          )}
          {isEnabled('services') && (
            <QuickAction
              href="/admin/collections/services-collection/"
              icon="🔧"
              label="Diensten"
              description="Diensten beheren"
            />
          )}
        </div>
      </div>

      {/* Design & instellingen */}
      <div className="cd-section">
        <h2 className="cd-section__title">Design & instellingen</h2>
        <div className="cd-grid cd-grid--3">
          <QuickAction
            href="/admin/globals/theme/"
            icon="🎨"
            label="Kleuren & stijl"
            description="Pas het uiterlijk van je site aan"
          />
          <QuickAction
            href="/admin/globals/header/"
            icon="📋"
            label="Header"
            description="Bewerk de bovenkant van je site"
          />
          <QuickAction
            href="/admin/globals/footer/"
            icon="🔗"
            label="Footer"
            description="Bewerk de voettekst van je site"
          />
          <QuickAction
            href="/admin/globals/settings/"
            icon="⚙️"
            label="Instellingen"
            description="Contactinfo en SEO instellingen"
          />
        </div>
      </div>

      {/* Forms & Submissions */}
      <div className="cd-section">
        <h2 className="cd-section__title">Formulieren</h2>
        <div className="cd-grid cd-grid--2">
          <QuickAction
            href="/admin/collections/forms/"
            icon="📝"
            label="Formulieren"
            description="Beheer contactformulieren"
          />
          <QuickAction
            href="/admin/collections/form-submissions/"
            icon="📬"
            label="Inzendingen"
            description="Bekijk ingestuurde formulieren"
          />
        </div>
      </div>

      {/* Tip box */}
      <div className="cd-tip">
        <span className="cd-tip__icon">💡</span>
        <div className="cd-tip__content">
          <strong>Tip:</strong> Gebruik de <strong>Live Preview</strong> knop bij het bewerken van
          een pagina om direct te zien hoe wijzigingen er op je site uitzien — zonder te hoeven
          opslaan.
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────────────────────
export const BeforeDashboard: React.FC = () => {
  const { user } = useAuth()

  if (!user) return null

  const isAdmin = Array.isArray(user.roles) && user.roles.includes('admin')
  const userName = (user as any).name || user.email || ''

  // Check if this is a client/tenant deployment
  const isClientDeployment = !!(
    process.env.NEXT_PUBLIC_CLIENT_ID ||
    (typeof window !== 'undefined' && (window as any).__CLIENT_DEPLOYMENT__)
  )

  // In client deployments, always show tenant UI (even for admins)
  if (isClientDeployment) {
    return <EditorDashboard userName={userName} />
  }

  // In platform deployment, show admin UI for admin users
  if (isAdmin) {
    return <AdminDashboard userName={userName} />
  }

  return <EditorDashboard userName={userName} />
}
