'use client'

import React from 'react'
import { Package } from 'lucide-react'
import { AccountLoadingSkeleton, AccountEmptyState } from '@/branches/ecommerce/shared/components/account/ui'
import { OrderSearchBar, OrdersTable, OrderCardMobile, OrderPagination } from '@/branches/ecommerce/shared/components/account/orders'
import type { OrdersTemplateProps } from './types'

export default function OrdersTemplate({
  orders,
  totalDocs,
  totalPages,
  page,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  onStatusFilter,
  onSearch,
  statusFilter,
  searchQuery,
  isLoading,
}: OrdersTemplateProps) {
  if (isLoading) return <AccountLoadingSkeleton variant="table" />

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2 text-navy">
            Bestellingen
          </h1>
          <p className="text-sm lg:text-base text-grey-mid">
            {totalDocs} bestellingen gevonden
          </p>
        </div>
      </div>

      <OrderSearchBar
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearch={onSearch}
        onStatusFilter={onStatusFilter}
      />

      {orders.length === 0 ? (
        <AccountEmptyState
          icon={Package}
          title="Geen bestellingen"
          description="Je hebt nog geen bestellingen geplaatst."
          actionLabel="Bekijk producten"
          actionHref="/shop"
        />
      ) : (
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm overflow-hidden">
          <OrdersTable orders={orders} />
          <div className="lg:hidden divide-y divide-grey-light">
            {orders.map((order) => (
              <OrderCardMobile key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}

      <OrderPagination
        page={page}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        onPageChange={onPageChange}
      />
    </div>
  )
}
