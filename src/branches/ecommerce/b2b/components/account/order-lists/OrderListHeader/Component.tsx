'use client'

import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'
import {
  AlertTriangle,
  Building2,
  CheckCircle,
  ClipboardList,
  Clock,
  Copy,
  Download,
  Euro,
  FlaskConical,
  Package,
  Pin,
  PlusCircle,
  Printer,
  Repeat,
  Settings,
  Share2,
  ShoppingCart,
  Stethoscope,
  User,
  Users,
} from 'lucide-react'
import React from 'react'
import type { OrderListHeaderProps } from './types'

// ============================================================================
// CONSTANTS
// ============================================================================

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  'clipboard-list': ClipboardList,
  repeat: Repeat,
  stethoscope: Stethoscope,
  'flask-conical': FlaskConical,
  'plus-circle': PlusCircle,
  'building-2': Building2,
  package: Package,
}

const colorMap = {
  teal: { bg: 'var(--color-primary-glow)', color: 'var(--color-primary)' },
  blue: { bg: '#E3F2FD', color: '#2196F3' },
  amber: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
  green: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
}

const COLORS = {
  navy: 'var(--color-secondary)',
  teal: 'var(--color-primary)',
  tealLight: 'var(--color-primary-light)',
  tealGlow: 'var(--color-primary-glow)',
  grey: '#E8ECF1',
  greyMid: 'var(--color-grey-mid)',
  green: 'var(--color-success)',
  greenLight: 'var(--color-success-light)',
  amber: 'var(--color-warning)',
  amberLight: 'var(--color-warning-light)',
  blue: '#2196F3',
  blueLight: '#E3F2FD',
}

function formatRelativeTime(date: string): string {
  const now = Date.now()
  const then = new Date(date).getTime()
  const diffInDays = Math.floor((now - then) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'vandaag'
  if (diffInDays === 1) return 'gisteren'
  if (diffInDays < 7) return `${diffInDays} dagen geleden`
  if (diffInDays < 14) return 'vorige week'
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weken geleden`
  if (diffInDays < 60) return 'vorige maand'
  return `${Math.floor(diffInDays / 30)} maanden geleden`
}

// ============================================================================
// COMPONENT
// ============================================================================

export function OrderListHeader({ list, stats, onAddAllToCart, onShare, onDuplicate, onExport, onPrint }: OrderListHeaderProps) {
  const { formatPriceStr } = usePriceMode()
  const IconComponent = (iconMap[list.icon] || Repeat) as React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  const colorStyle = colorMap[list.color as keyof typeof colorMap] || colorMap.teal

  return (
    <div
      className="rounded-2xl p-7 mb-5"
      style={{ background: 'white', border: `1px solid ${COLORS.grey}` }}
    >
      <div className="flex items-start justify-between gap-5 mb-4 flex-wrap">
        {/* Icon + Title + Meta */}
        <div className="flex gap-4 items-center">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: colorStyle.bg }}
          >
            <IconComponent className="w-6 h-6" style={{ color: colorStyle.color }} />
          </div>
          <div>
            <h1
              className="mb-1"
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '24px',
                fontWeight: 800,
                color: COLORS.navy,
              }}
            >
              {list.name}
            </h1>
            <div className="flex gap-4 flex-wrap" style={{ fontSize: '13px', color: COLORS.greyMid }}>
              <span className="flex items-center gap-1">
                <Package className="w-3.5 h-3.5" />
                {list.items.length} producten
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                Aangemaakt door {list.createdBy}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Laatst bijgewerkt {formatRelativeTime(list.updatedAt)}
              </span>
            </div>

            {/* Badges */}
            {(list.isPinned || list.shareWith.length > 0) && (
              <div className="flex gap-1.5 mt-1.5">
                {list.isPinned && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md"
                    style={{
                      background: COLORS.amberLight,
                      color: COLORS.amber,
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    <Pin className="w-3 h-3" />
                    Vastgepind
                  </span>
                )}
                {list.shareWith.length > 0 && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md"
                    style={{
                      background: COLORS.blueLight,
                      color: COLORS.blue,
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    <Users className="w-3 h-3" />
                    Gedeeld met {list.shareWith.length} collega's
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onShare}
            className="btn btn-outline-neutral w-10 h-10 flex items-center justify-center"
            title="Delen"
          >
            <Share2 className="w-4 h-4" style={{ color: COLORS.navy }} />
          </button>
          <button
            onClick={onDuplicate}
            className="btn btn-outline-neutral w-10 h-10 flex items-center justify-center"
            title="Dupliceren"
          >
            <Copy className="w-4 h-4" style={{ color: COLORS.navy }} />
          </button>
          <button
            onClick={onExport}
            className="btn btn-outline-neutral w-10 h-10 flex items-center justify-center"
            title="Exporteren"
          >
            <Download className="w-4 h-4" style={{ color: COLORS.navy }} />
          </button>
          <button
            className="btn btn-outline-neutral w-10 h-10 flex items-center justify-center"
            title="Instellingen (binnenkort beschikbaar)"
          >
            <Settings className="w-4 h-4" style={{ color: COLORS.navy }} />
          </button>
          <button
            onClick={onPrint}
            className="btn btn-outline-neutral flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={onAddAllToCart}
            className="btn btn-primary flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Alles in winkelwagen
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div
        className="flex gap-6 pt-4 flex-wrap"
        style={{ borderTop: `1px solid ${COLORS.grey}` }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: COLORS.tealGlow }}
          >
            <Package className="w-4 h-4" style={{ color: COLORS.teal }} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '18px',
                fontWeight: 800,
                color: COLORS.navy,
              }}
            >
              {stats.total}
            </div>
            <div style={{ fontSize: '12px', color: COLORS.greyMid }}>Artikelen</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: COLORS.greenLight }}
          >
            <CheckCircle className="w-4 h-4" style={{ color: COLORS.green }} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '18px',
                fontWeight: 800,
                color: COLORS.navy,
              }}
            >
              {stats.inStock}
            </div>
            <div style={{ fontSize: '12px', color: COLORS.greyMid }}>Op voorraad</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: COLORS.amberLight }}
          >
            <AlertTriangle className="w-4 h-4" style={{ color: COLORS.amber }} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '18px',
                fontWeight: 800,
                color: COLORS.navy,
              }}
            >
              {stats.limited}
            </div>
            <div style={{ fontSize: '12px', color: COLORS.greyMid }}>Beperkt</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: COLORS.blueLight }}
          >
            <Euro className="w-4 h-4" style={{ color: COLORS.blue }} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '18px',
                fontWeight: 800,
                color: COLORS.navy,
              }}
            >
              €{formatPriceStr(stats.totalValue)}
            </div>
            <div style={{ fontSize: '12px', color: COLORS.greyMid }}>Totale waarde</div>
          </div>
        </div>
      </div>
    </div>
  )
}
