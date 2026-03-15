'use client'

import React from 'react'
import { FileText } from 'lucide-react'
import { AccountEmptyState, AccountLoadingSkeleton } from '@/branches/ecommerce/shared/components/account/ui'
import { InvoiceStatsBar, InvoiceRow } from '@/branches/ecommerce/shared/components/account/invoices'
import type { InvoicesTemplateProps } from './types'

export default function InvoicesTemplate({
  invoices,
  stats,
  isLoading,
}: InvoicesTemplateProps) {
  if (isLoading) return <AccountLoadingSkeleton variant="page" />

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2 text-navy">Mijn Facturen</h1>
        <p className="text-sm lg:text-base text-grey-mid">Bekijk en download je facturen</p>
      </div>

      {invoices.length > 0 && <InvoiceStatsBar stats={stats} />}

      {invoices.length > 0 ? (
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <InvoiceRow key={invoice.id} invoice={invoice} />
          ))}
        </div>
      ) : (
        <AccountEmptyState
          icon={FileText}
          title="Geen facturen"
          description="Je hebt nog geen facturen."
          actionLabel="Bekijk producten"
          actionHref="/shop"
        />
      )}
    </div>
  )
}
