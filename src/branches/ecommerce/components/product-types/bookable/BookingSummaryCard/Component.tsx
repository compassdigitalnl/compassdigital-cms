'use client'

import React from 'react'
import { Calendar, Clock, Users, Package, ShoppingCart } from 'lucide-react'
import { Button } from '@/branches/shared/components/ui/button'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'

export interface BookingSummary {
  date?: Date
  time?: string
  duration?: string
  participants?: {
    category: string
    count: number
    price: number
  }[]
  addOns?: {
    label: string
    price: number
  }[]
  basePrice?: number
  totalPrice: number
}

export interface BookingSummaryCardProps {
  summary: BookingSummary
  onBook?: () => void
  onEdit?: (section: 'date' | 'time' | 'participants' | 'addons') => void
  isBooking?: boolean
  showEditButtons?: boolean
  className?: string
}

export const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
  summary,
  onBook,
  onEdit,
  isBooking = false,
  showEditButtons = false,
  className = '',
}) => {
  const { formatPriceStr } = usePriceMode()

  const formatDate = (date: Date): string => {
    const days = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag']
    const months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const totalParticipants = summary.participants?.reduce((sum, p) => sum + p.count, 0) || 0
  const participantsSubtotal = summary.participants?.reduce((sum, p) => sum + (p.count * p.price), 0) || 0
  const addOnsSubtotal = summary.addOns?.reduce((sum, a) => sum + a.price, 0) || 0

  const canBook = summary.date && summary.time && totalParticipants > 0

  return (
    <div
      className={`booking-summary-card bg-white border-[1.5px] border-gray-200 rounded-[20px] overflow-hidden shadow-lg max-w-[360px] ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 text-center relative overflow-hidden">
        <div
          className="absolute -top-8 -right-8 w-30 h-30 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, var(--color-primary-glow), transparent 70%)',
          }}
        />
        <h3 className="font-heading text-lg font-extrabold text-white relative z-10">
          Jouw Reservering
        </h3>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Date */}
        {summary.date && (
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Datum
              </div>
              <div className="text-sm font-bold text-gray-900 mt-0.5">
                {formatDate(summary.date)}
              </div>
            </div>
            {showEditButtons && onEdit && (
              <button
                onClick={() => onEdit('date')}
                className="btn btn-ghost btn-sm"
              >
                Wijzig
              </button>
            )}
          </div>
        )}

        {/* Time & Duration */}
        {summary.time && (
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Tijd
              </div>
              <div className="text-sm font-bold text-gray-900 mt-0.5">
                {summary.time}
                {summary.duration && (
                  <span className="text-gray-500 font-normal ml-2">
                    ({summary.duration})
                  </span>
                )}
              </div>
            </div>
            {showEditButtons && onEdit && (
              <button
                onClick={() => onEdit('time')}
                className="btn btn-ghost btn-sm"
              >
                Wijzig
              </button>
            )}
          </div>
        )}

        {/* Participants */}
        {summary.participants && summary.participants.length > 0 && (
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Deelnemers
              </div>
              {summary.participants.map((p, index) => (
                <div key={index} className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">
                    {p.count}x {p.category}
                  </span>
                  <span className="font-mono font-semibold text-gray-900">
                    €{formatPriceStr(p.count * p.price)}
                  </span>
                </div>
              ))}
            </div>
            {showEditButtons && onEdit && (
              <button
                onClick={() => onEdit('participants')}
                className="btn btn-ghost btn-sm"
              >
                Wijzig
              </button>
            )}
          </div>
        )}

        {/* Add-ons */}
        {summary.addOns && summary.addOns.length > 0 && (
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Extra's
              </div>
              {summary.addOns.map((addon, index) => (
                <div key={index} className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{addon.label}</span>
                  <span className="font-mono font-semibold text-gray-900">
                    €{formatPriceStr(addon.price)}
                  </span>
                </div>
              ))}
            </div>
            {showEditButtons && onEdit && (
              <button
                onClick={() => onEdit('addons')}
                className="btn btn-ghost btn-sm"
              >
                Wijzig
              </button>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 pt-4">
          {/* Subtotals */}
          {summary.basePrice && (
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Basisprijs</span>
              <span className="font-mono">€{formatPriceStr(summary.basePrice)}</span>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between items-baseline mt-3">
            <span className="text-base font-bold text-gray-900">Totaal</span>
            <span className="text-2xl font-extrabold font-heading text-gray-900">
              €{formatPriceStr(summary.totalPrice)}
            </span>
          </div>
        </div>

        {/* Book Button */}
        {onBook && (
          <Button
            onClick={onBook}
            disabled={!canBook || isBooking}
            className="btn btn-primary btn-lg w-full"
          >
            {isBooking ? (
              'Reserveren...'
            ) : !canBook ? (
              'Maak een selectie'
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Nu reserveren
              </>
            )}
          </Button>
        )}

        {!canBook && (
          <p className="text-center text-xs text-gray-400 mt-2">
            Selecteer datum, tijd en aantal deelnemers
          </p>
        )}
      </div>
    </div>
  )
}

export default BookingSummaryCard
