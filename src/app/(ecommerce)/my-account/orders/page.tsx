'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, Download, ChevronLeft, ChevronRight, Package } from 'lucide-react'

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // TODO: Replace with real data from API
  const allOrders = Array.from({ length: 47 }, (_, i) => ({
    id: `${47 - i}`,
    orderNumber: `ORD-2026${String(2 - Math.floor(i / 20)).padStart(2, '0')}${String(18 - Math.floor(i / 2)).padStart(2, '0')}-00${String(142 - i).padStart(3, '0')}`,
    date: `2026-0${2 - Math.floor(i / 20)}-${String(18 - Math.floor(i / 2)).padStart(2, '0')}`,
    productCount: Math.floor(Math.random() * 5) + 1,
    status:
      i % 5 === 0
        ? 'shipped'
        : i % 5 === 1
          ? 'delivered'
          : i % 5 === 2
            ? 'processing'
            : i % 5 === 3
              ? 'paid'
              : 'pending',
    statusLabel:
      i % 5 === 0
        ? 'Onderweg'
        : i % 5 === 1
          ? 'Afgeleverd'
          : i % 5 === 2
            ? 'In behandeling'
            : i % 5 === 3
              ? 'Betaald'
              : 'In afwachting',
    total: Math.random() * 500 + 50,
  }))

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.date.includes(searchQuery)
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shipped':
        return { bg: '#E3F2FD', text: '#2196F3', border: '#90CAF9' }
      case 'delivered':
        return { bg: '#E8F5E9', text: '#00C853', border: '#A5D6A7' }
      case 'processing':
        return { bg: '#FFF8E1', text: '#F59E0B', border: '#FFE082' }
      case 'paid':
        return { bg: '#E0F2F1', text: '#00897B', border: '#80CBC4' }
      case 'pending':
        return { bg: '#F5F7FA', text: '#94A3B8', border: '#E8ECF1' }
      default:
        return { bg: '#F5F7FA', text: '#94A3B8', border: '#E8ECF1' }
    }
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Page Header - Mobile First */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2 text-gray-900">
            Bestellingen
          </h1>
          <p className="text-sm lg:text-base text-gray-500">
            {filteredOrders.length} bestellingen gevonden
          </p>
        </div>

        <Link
          href="/my-account"
          className="flex items-center justify-center gap-2 px-4 py-2.5 lg:py-3 rounded-xl text-sm lg:text-base font-semibold transition-all active:bg-gray-200 lg:hover:bg-gray-100 bg-gray-50 text-gray-900"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden lg:inline">Terug naar dashboard</span>
          <span className="lg:hidden">Dashboard</span>
        </Link>
      </div>

      {/* Filters - Mobile First */}
      <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            />
            <input
              type="text"
              placeholder="Zoek op bestelnummer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-base outline-none transition-all bg-gray-50 border border-gray-200 focus:border-gray-300"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 lg:pl-12 pr-10 py-3 lg:py-3.5 rounded-xl text-sm lg:text-base outline-none appearance-none cursor-pointer transition-all bg-gray-50 border border-gray-200"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2394A3B8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px',
              }}
            >
              <option value="all">Alle statussen</option>
              <option value="pending">In afwachting</option>
              <option value="paid">Betaald</option>
              <option value="processing">In behandeling</option>
              <option value="shipped">Onderweg</option>
              <option value="delivered">Afgeleverd</option>
            </select>
          </div>
        </div>

        <div className="mt-3 lg:mt-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2 lg:gap-0">
          <button
            onClick={() => {
              setSearchQuery('')
              setStatusFilter('all')
            }}
            className="text-sm font-semibold transition-colors text-teal-700 py-2 lg:py-0"
          >
            Filters wissen
          </button>

          <button className="flex items-center justify-center gap-2 px-4 py-2.5 lg:py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all active:opacity-80 lg:hover:opacity-90 bg-teal-700 text-white">
            <Download className="w-4 h-4" />
            <span className="hidden lg:inline">Exporteer naar CSV</span>
            <span className="lg:hidden">Exporteer</span>
          </button>
        </div>
      </div>

      {/* Orders - Mobile First Cards, Desktop Table */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Bestelnummer
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Datum
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Producten
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Totaal
                </th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order, idx) => {
                const statusColors = getStatusColor(order.status)
                return (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900 font-mono">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {new Date(order.date).toLocaleDateString('nl-NL', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {order.productCount} {order.productCount === 1 ? 'product' : 'producten'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold inline-block"
                        style={{
                          background: statusColors.bg,
                          color: statusColors.text,
                          border: `1px solid ${statusColors.border}`,
                        }}
                      >
                        {order.statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-gray-900">€{order.total.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/my-account/orders/${order.id}`}
                        className="inline-block px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-80 bg-teal-700 text-white"
                      >
                        Bekijk
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-gray-100">
          {paginatedOrders.map((order) => {
            const statusColors = getStatusColor(order.status)
            return (
              <div key={order.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-gray-900 font-mono block mb-0.5">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(order.date).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className="text-base font-bold text-gray-900 flex-shrink-0 ml-2">
                    €{order.total.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-900">
                      {order.productCount} {order.productCount === 1 ? 'product' : 'producten'}
                    </span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      background: statusColors.bg,
                      color: statusColors.text,
                      border: `1px solid ${statusColors.border}`,
                    }}
                  >
                    {order.statusLabel}
                  </span>
                </div>

                <Link
                  href={`/my-account/orders/${order.id}`}
                  className="block w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-center transition-all active:opacity-80 bg-teal-700 text-white"
                >
                  Bekijk details
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pagination - Mobile First */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2.5 rounded-xl text-sm lg:text-base font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed active:bg-gray-200 lg:hover:bg-gray-100 bg-gray-50 text-gray-900"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden lg:inline">Vorige</span>
          </button>

          <div className="flex items-center gap-1 lg:gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1),
              )
              .map((page, idx, arr) => (
                <React.Fragment key={page}>
                  {idx > 0 && arr[idx - 1] !== page - 1 && (
                    <span className="text-gray-400 text-sm">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl text-sm lg:text-base font-bold transition-all"
                    style={{
                      background: currentPage === page ? '#00897B' : '#F5F7FA',
                      color: currentPage === page ? 'white' : '#0A1628',
                    }}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2.5 rounded-xl text-sm lg:text-base font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed active:bg-gray-200 lg:hover:bg-gray-100 bg-gray-50 text-gray-900"
          >
            <span className="hidden lg:inline">Volgende</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
