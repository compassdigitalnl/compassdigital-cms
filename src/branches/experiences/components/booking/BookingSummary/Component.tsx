import React from 'react'
import { Star, CheckCircle } from 'lucide-react'
import type { BookingSummaryProps } from './types'

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  eventName,
  eventCategory,
  eventIcon,
  eventRating,
  eventReviewCount,
  date,
  time,
  duration,
  persons,
  lineItems,
  total,
  vatNote,
  pricePerPerson,
  pricePerPersonNote,
  guarantees,
  onConfirm,
  onRequestQuote,
  className = '',
}) => {
  const formatPrice = (amount: number) =>
    `\u20AC${amount.toFixed(2).replace('.', ',')}`

  return (
    <div
      className={`rounded-xl border p-5 ${className}`}
      style={{
        borderColor: 'var(--color-border, #e5e7eb)',
        backgroundColor: 'var(--color-white, #ffffff)',
      }}
    >
      {/* Event header */}
      <div className="mb-4 flex items-start gap-3">
        {eventIcon && (
          <div
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg text-2xl"
            style={{ backgroundColor: 'var(--color-grey-light, #f3f4f6)' }}
          >
            {eventIcon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          {eventCategory && (
            <span
              className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--color-teal, #00a39b)' }}
            >
              {eventCategory}
            </span>
          )}
          <h3
            className="text-sm font-bold leading-snug"
            style={{ color: 'var(--color-navy, #1a2b4a)' }}
          >
            {eventName}
          </h3>
          {eventRating !== undefined && eventRating > 0 && (
            <div className="mt-1 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3 w-3"
                    fill={i < Math.round(eventRating / 2) ? '#f59e0b' : 'none'}
                    stroke={
                      i < Math.round(eventRating / 2) ? '#f59e0b' : '#d1d5db'
                    }
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              {eventReviewCount !== undefined && eventReviewCount > 0 && (
                <span className="text-[10px] text-grey-mid">
                  ({eventReviewCount})
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary details */}
      <div className="mb-3 space-y-1.5">
        {date && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-grey-mid">Datum</span>
            <span
              className="font-medium"
              style={{ color: 'var(--color-navy, #1a2b4a)' }}
            >
              {date}
            </span>
          </div>
        )}
        {time && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-grey-mid">Tijdstip</span>
            <span
              className="font-medium"
              style={{ color: 'var(--color-navy, #1a2b4a)' }}
            >
              {time}
            </span>
          </div>
        )}
        {duration && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-grey-mid">Duur</span>
            <span
              className="font-medium"
              style={{ color: 'var(--color-navy, #1a2b4a)' }}
            >
              {duration}
            </span>
          </div>
        )}
        {persons !== undefined && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-grey-mid">Personen</span>
            <span
              className="font-medium"
              style={{ color: 'var(--color-navy, #1a2b4a)' }}
            >
              {persons} personen
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <hr
        className="my-3"
        style={{ borderColor: 'var(--color-border, #e5e7eb)' }}
      />

      {/* Price line items */}
      <div className="mb-3 space-y-1.5">
        {lineItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-xs"
          >
            <span
              className={item.isExtra ? 'text-grey-mid' : 'text-grey-dark'}
            >
              {item.label}
            </span>
            <span
              className="font-medium"
              style={{
                color: item.isExtra
                  ? 'var(--color-teal, #00a39b)'
                  : 'var(--color-navy, #1a2b4a)',
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <hr
        className="my-3"
        style={{ borderColor: 'var(--color-border, #e5e7eb)' }}
      />

      {/* Total */}
      <div className="mb-1 flex items-baseline justify-between">
        <span
          className="text-sm font-bold"
          style={{ color: 'var(--color-navy, #1a2b4a)' }}
        >
          Totaal
        </span>
        <span
          className="text-2xl font-bold"
          style={{
            color: 'var(--color-navy, #1a2b4a)',
            fontFamily: 'var(--font-serif, Georgia, serif)',
          }}
        >
          {formatPrice(total)}
        </span>
      </div>

      {/* VAT note */}
      {vatNote && (
        <p className="mb-3 text-right text-[10px] text-grey-mid">{vatNote}</p>
      )}

      {/* Price per person highlight */}
      {pricePerPerson !== undefined && (
        <div
          className="mb-4 rounded-lg px-3 py-2 text-center text-xs font-semibold"
          style={{
            backgroundColor: 'var(--color-teal-light, #e6f7f6)',
            color: 'var(--color-teal, #00a39b)',
          }}
        >
          {formatPrice(pricePerPerson)} per persoon
          {pricePerPersonNote && (
            <span className="ml-1 font-normal text-grey-mid">
              {pricePerPersonNote}
            </span>
          )}
        </div>
      )}

      {/* Confirm button */}
      {onConfirm && (
        <button
          type="button"
          onClick={onConfirm}
          className="mb-2 w-full rounded-lg px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-teal, #00a39b)' }}
        >
          Reservering bevestigen
        </button>
      )}

      {/* Quote button */}
      {onRequestQuote && (
        <button
          type="button"
          onClick={onRequestQuote}
          className="mb-4 w-full rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-grey-light"
          style={{
            borderColor: 'var(--color-teal, #00a39b)',
            color: 'var(--color-teal, #00a39b)',
          }}
        >
          Liever eerst een offerte?
        </button>
      )}

      {/* Footer guarantees */}
      {guarantees && guarantees.length > 0 && (
        <div className="space-y-1.5 border-t pt-3" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
          {guarantees.map((text, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-[11px] text-grey-mid"
            >
              <CheckCircle
                className="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
                style={{ color: 'var(--color-teal, #00a39b)' }}
              />
              <span>{text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
