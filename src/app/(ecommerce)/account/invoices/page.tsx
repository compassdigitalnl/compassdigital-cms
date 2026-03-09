'use client'

import React, { useState, useEffect } from 'react'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import InvoicesTemplate from '@/branches/ecommerce/shared/templates/account/AccountTemplate1/InvoicesTemplate'
import { useAccountTemplate } from '@/branches/ecommerce/shared/contexts/AccountTemplateContext'
import type { Invoice, InvoiceStats } from '@/branches/ecommerce/shared/templates/account/AccountTemplate1/InvoicesTemplate/types'

export default function InvoicesPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()
  const { user, isLoading: authLoading } = useAccountAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [stats, setStats] = useState<InvoiceStats>({ totalInvoices: 0, paidInvoices: 0, pendingInvoices: 0 })
  const [totalDocs, setTotalDocs] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchInvoices = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/account/invoices?page=${page}&limit=10`, { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setInvoices(
            (data.docs || []).map((o: any) => ({
              id: o.id,
              orderNumber: o.orderNumber,
              invoiceNumber: o.invoiceNumber || `INV-${o.orderNumber}`,
              createdAt: o.createdAt,
              total: o.total || 0,
              paymentStatus: o.paymentStatus || 'pending',
              invoicePDF: o.invoicePDF,
            })),
          )
          setStats(data.stats || { totalInvoices: 0, paidInvoices: 0, pendingInvoices: 0 })
          setTotalDocs(data.totalDocs || 0)
          setTotalPages(data.totalPages || 1)
        }
      } catch (err) {
        console.error('Error fetching invoices:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoices()
  }, [user, page])

  return (
    <InvoicesTemplate
      invoices={invoices}
      stats={stats}
      totalDocs={totalDocs}
      totalPages={totalPages}
      page={page}
      onPageChange={setPage}
      isLoading={authLoading || isLoading}
    />
  )
}
