'use client'

/**
 * ClientSwitcher — Admin Navigatie Component
 *
 * Toont een client-selector in de admin sidebar.
 * Alleen zichtbaar voor admin-gebruikers.
 *
 * Werking:
 * - Haalt alle clients op via de Payload REST API
 * - Slaat de geselecteerde client op in localStorage
 * - Toont de actieve client met snelkoppelingen
 * - Biedt een dropdown om snel te wisselen van client
 */

import { useAuth } from '@payloadcms/ui'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import './index.scss'

// ─── Types ────────────────────────────────────────────────────────
interface Client {
  id: string | number
  name: string
  domain: string
  template?: string
  status?: string
  contactEmail?: string
}

interface ClientsResponse {
  docs: Client[]
  totalDocs: number
}

// ─── Helpers ──────────────────────────────────────────────────────
const STORAGE_KEY = 'cd_active_client'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getStatusColor(status?: string): string {
  switch (status) {
    case 'active':
      return 'cd-cs__status--active'
    case 'suspended':
      return 'cd-cs__status--suspended'
    case 'trial':
      return 'cd-cs__status--trial'
    default:
      return 'cd-cs__status--unknown'
  }
}

// ─── ClientSwitcher Component ─────────────────────────────────────
export const ClientSwitcher: React.FC = () => {
  const { user } = useAuth()

  const [clients, setClients] = useState<Client[]>([])
  const [activeClient, setActiveClient] = useState<Client | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Alleen zichtbaar voor admins
  const isAdmin = Array.isArray((user as any)?.roles) && (user as any).roles.includes('admin')

  // ─── Fetch clients ───────────────────────────────────────────
  useEffect(() => {
    if (!isAdmin) return

    const fetchClients = async () => {
      try {
        const res = await fetch('/api/clients?limit=100&depth=0', {
          credentials: 'include',
        })
        if (!res.ok) return
        const data: ClientsResponse = await res.json()
        setClients(data.docs || [])

        // Herstel actieve client vanuit localStorage
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          const found = data.docs.find((c) => String(c.id) === String(parsed.id))
          if (found) {
            setActiveClient(found)
          }
        }
      } catch (err) {
        // Stil falen — component toont lege staat
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()
  }, [isAdmin])

  // ─── Klik buiten dropdown sluit hem ─────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ─── Selecteer een client ────────────────────────────────────
  const selectClient = useCallback((client: Client) => {
    setActiveClient(client)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: client.id, name: client.name }))
    setIsOpen(false)
  }, [])

  // ─── Wis selectie ───────────────────────────────────────────
  const clearClient = useCallback(() => {
    setActiveClient(null)
    localStorage.removeItem(STORAGE_KEY)
    setIsOpen(false)
  }, [])

  // Hide in client/tenant deployments
  const isClientDeployment = !!(
    process.env.NEXT_PUBLIC_CLIENT_ID ||
    typeof window !== 'undefined' && (window as any).__CLIENT_DEPLOYMENT__
  )
  if (isClientDeployment) return null

  if (!isAdmin) return null
  if (isLoading) return <div className="cd-cs cd-cs--loading">Klanten laden…</div>

  return (
    <div className="cd-cs" ref={dropdownRef}>
      {/* ─── Header label ─── */}
      <div className="cd-cs__label">Actieve klant</div>

      {/* ─── Trigger button ─── */}
      <button
        className={`cd-cs__trigger ${activeClient ? 'cd-cs__trigger--active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {activeClient ? (
          <>
            <span className="cd-cs__avatar">{getInitials(activeClient.name)}</span>
            <span className="cd-cs__info">
              <span className="cd-cs__name">{activeClient.name}</span>
              <span className="cd-cs__domain">{activeClient.domain}</span>
            </span>
          </>
        ) : (
          <>
            <span className="cd-cs__avatar cd-cs__avatar--empty">—</span>
            <span className="cd-cs__info">
              <span className="cd-cs__name">Geen selectie</span>
              <span className="cd-cs__domain">{clients.length} klanten</span>
            </span>
          </>
        )}
        <span className={`cd-cs__chevron ${isOpen ? 'cd-cs__chevron--up' : ''}`}>▾</span>
      </button>

      {/* ─── Dropdown ─── */}
      {isOpen && (
        <div className="cd-cs__dropdown" role="listbox">
          {/* Wis selectie optie */}
          {activeClient && (
            <button
              className="cd-cs__option cd-cs__option--clear"
              onClick={clearClient}
              type="button"
            >
              <span className="cd-cs__option-icon">✕</span>
              <span>Geen client — platform overzicht</span>
            </button>
          )}

          {/* Client opties */}
          {clients.length === 0 && (
            <div className="cd-cs__empty">Nog geen klanten aangemaakt</div>
          )}
          {clients.map((client) => (
            <button
              key={client.id}
              className={`cd-cs__option ${activeClient?.id === client.id ? 'cd-cs__option--selected' : ''}`}
              onClick={() => selectClient(client)}
              type="button"
              role="option"
              aria-selected={activeClient?.id === client.id}
            >
              <span className="cd-cs__option-avatar">{getInitials(client.name)}</span>
              <span className="cd-cs__option-info">
                <span className="cd-cs__option-name">{client.name}</span>
                <span className="cd-cs__option-domain">{client.domain}</span>
              </span>
              <span className={`cd-cs__badge ${getStatusColor(client.status)}`}>
                {client.status || '?'}
              </span>
            </button>
          ))}

          {/* Nieuwe klant aanmaken */}
          <a
            href="/admin/collections/clients/create"
            className="cd-cs__option cd-cs__option--new"
            onClick={() => setIsOpen(false)}
          >
            <span className="cd-cs__option-icon">＋</span>
            <span>Nieuwe klant aanmaken</span>
          </a>
        </div>
      )}

      {/* ─── Snelkoppelingen voor actieve client ─── */}
      {activeClient && (
        <div className="cd-cs__actions">
          <a
            href={`https://${activeClient.domain}/admin`}
            className="cd-cs__action cd-cs__action--primary"
            title="Open client admin panel"
            target="_blank"
            rel="noopener noreferrer"
          >
            🖥️ Open Admin
          </a>
          <a
            href={`/admin/collections/clients/${activeClient.id}`}
            className="cd-cs__action"
            title="Client bewerken"
          >
            ✏️ Bewerken
          </a>
          <a
            href={`/admin/collections/deployments?where[client][equals]=${activeClient.id}`}
            className="cd-cs__action"
            title="Deployments bekijken"
          >
            🚀 Deployments
          </a>
          <a
            href={`/admin/collections/users?where[client][equals]=${activeClient.id}`}
            className="cd-cs__action"
            title="Gebruikers van deze client"
          >
            👤 Gebruikers
          </a>
        </div>
      )}

      {/* ─── Divider ─── */}
      <div className="cd-cs__divider" />
    </div>
  )
}
