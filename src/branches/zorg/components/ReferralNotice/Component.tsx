import React from 'react'
import type { ReferralNoticeProps } from './types'

export const ReferralNotice: React.FC<ReferralNoticeProps> = ({
  type,
  treatmentName,
  className = '',
}) => {
  if (type === 'no') {
    return (
      <div className={`rounded-xl border border-green-200 bg-green-50 p-5 ${className}`}>
        <div className="flex items-start gap-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mt-0.5 shrink-0 text-green-600"
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <div>
            <h4 className="text-sm font-bold text-green-800">Geen verwijzing nodig</h4>
            <p className="mt-1 text-sm text-green-700">
              {treatmentName
                ? `Voor ${treatmentName} heeft u geen verwijzing nodig. U kunt direct een afspraak maken.`
                : 'Voor deze behandeling heeft u geen verwijzing nodig. U kunt direct een afspraak maken.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'gp') {
    return (
      <div className={`rounded-xl border border-amber-200 bg-amber-50 p-5 ${className}`}>
        <div className="flex items-start gap-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mt-0.5 shrink-0 text-amber-600"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <h4 className="text-sm font-bold text-amber-800">Huisartsverwijzing vereist</h4>
            <p className="mt-1 text-sm text-amber-700">
              {treatmentName
                ? `Voor ${treatmentName} heeft u een verwijzing van uw huisarts nodig. Neem deze mee naar uw eerste afspraak.`
                : 'Voor deze behandeling heeft u een verwijzing van uw huisarts nodig. Neem deze mee naar uw eerste afspraak.'}
            </p>
            <p className="mt-2 text-xs text-amber-600">
              Met een verwijzing wordt de behandeling (gedeeltelijk) vergoed door uw zorgverzekeraar.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'specialist') {
    return (
      <div className={`rounded-xl border border-blue-200 bg-blue-50 p-5 ${className}`}>
        <div className="flex items-start gap-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mt-0.5 shrink-0 text-blue-600"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <h4 className="text-sm font-bold text-blue-800">Specialistenverwijzing vereist</h4>
            <p className="mt-1 text-sm text-blue-700">
              {treatmentName
                ? `Voor ${treatmentName} heeft u een verwijzing van een medisch specialist nodig. Vraag deze aan bij uw behandelend arts.`
                : 'Voor deze behandeling heeft u een verwijzing van een medisch specialist nodig. Vraag deze aan bij uw behandelend arts.'}
            </p>
            <p className="mt-2 text-xs text-blue-600">
              Neem de verwijsbrief en een geldig identiteitsbewijs mee naar uw eerste afspraak.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default ReferralNotice
