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
      i % 5 === 0 ? 'shipped' : i % 5 === 1 ? 'delivered' : i % 5 === 2 ? 'processing' : i % 5 === 3 ? 'paid' : 'pending',
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="font-extrabold mb-2"
            style={{
              fontSize: '28px',
              color: '#0A1628',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            Bestellingen
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8' }}>
            {filteredOrders.length} bestellingen gevonden
          </p>
        </div>

        <Link
          href="/my-account"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-gray-100"
          style={{ background: '#F5F7FA', color: '#0A1628', fontSize: '14px' }}
        >
          <ChevronLeft className="w-4 h-4" />
          Terug naar dashboard
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5"
              style={{ color: '#94A3B8' }}
            />
            <input
              type="text"
              placeholder="Zoek op bestelnummer of datum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all"
              style={{
                border: '1.5px solid #E8ECF1',
                fontSize: '14px',
                background: '#FAFBFC',
              }}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5"
              style={{ color: '#94A3B8' }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-3 rounded-xl outline-none appearance-none cursor-pointer transition-all"
              style={{
                border: '1.5px solid #E8ECF1',
                fontSize: '14px',
                background: `#FAFBFC url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2394A3B8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 16px center`,
                backgroundSize: '16px 16px',
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

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => {
              setSearchQuery('')
              setStatusFilter('all')
            }}
            className="font-semibold transition-colors"
            style={{ fontSize: '13px', color: '#00897B' }}
          >
            Filters wissen
          </button>

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
            style={{ background: '#00897B', color: 'white', fontSize: '13px' }}
          >
            <Download className="w-4 h-4" />
            Exporteer naar CSV
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: '#F5F7FA', borderBottom: '1px solid #E8ECF1' }}>
              <tr>
                <th
                  className="text-left px-6 py-4 font-bold"
                  style={{ fontSize: '13px', color: '#94A3B8' }}
                >
                  BESTELNUMMER
                </th>
                <th
                  className="text-left px-6 py-4 font-bold"
                  style={{ fontSize: '13px', color: '#94A3B8' }}
                >
                  DATUM
                </th>
                <th
                  className="text-left px-6 py-4 font-bold"
                  style={{ fontSize: '13px', color: '#94A3B8' }}
                >
                  PRODUCTEN
                </th>
                <th
                  className="text-left px-6 py-4 font-bold"
                  style={{ fontSize: '13px', color: '#94A3B8' }}
                >
                  STATUS
                </th>
                <th
                  className="text-right px-6 py-4 font-bold"
                  style={{ fontSize: '13px', color: '#94A3B8' }}
                >
                  TOTAAL
                </th>
                <th
                  className="text-right px-6 py-4 font-bold"
                  style={{ fontSize: '13px', color: '#94A3B8' }}
                >
                  ACTIES
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order, idx) => {
                const statusColors = getStatusColor(order.status)
                return (
                  <tr
                    key={order.id}
                    style={{ borderBottom: idx !== paginatedOrders.length - 1 ? '1px solid #E8ECF1' : 'none' }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span
                        className="font-bold"
                        style={{
                          fontSize: '13px',
                          color: '#0A1628',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                      >
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span style={{ fontSize: '13px', color: '#0A1628' }}>
                        {new Date(order.date).toLocaleDateString('nl-NL', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" style={{ color: '#94A3B8' }} />
                        <span style={{ fontSize: '13px', color: '#0A1628' }}>
                          {order.productCount} {order.productCount === 1 ? 'product' : 'producten'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2.5 py-1 rounded-full font-semibold inline-block"
                        style={{
                          background: statusColors.bg,
                          color: statusColors.text,
                          fontSize: '12px',
                          border: `1px solid ${statusColors.border}`,
                        }}
                      >
                        {order.statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className="font-bold"
                        style={{
                          fontSize: '14px',
                          color: '#0A1628',
                          fontFamily: 'Plus Jakarta Sans, sans-serif',
                        }}
                      >
                        €{order.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/my-account/orders/${order.id}`}
                        className="inline-block px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
                        style={{ background: '#00897B', color: 'white', fontSize: '13px' }}
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
        <div className="md:hidden divide-y" style={{ borderColor: '#E8ECF1' }}>
          {paginatedOrders.map((order) => {
            const statusColors = getStatusColor(order.status)
            return (
              <div key={order.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <span
                      className="font-bold block"
                      style={{
                        fontSize: '13px',
                        color: '#0A1628',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                    >
                      {order.orderNumber}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                      {new Date(order.date).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <span
                    className="font-bold"
                    style={{
                      fontSize: '16px',
                      color: '#0A1628',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                  >
                    €{order.total.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" style={{ color: '#94A3B8' }} />
                    <span style={{ fontSize: '13px', color: '#0A1628' }}>
                      {order.productCount} {order.productCount === 1 ? 'product' : 'producten'}
                    </span>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full font-semibold"
                    style={{
                      background: statusColors.bg,
                      color: statusColors.text,
                      fontSize: '12px',
                      border: `1px solid ${statusColors.border}`,
                    }}
                  >
                    {order.statusLabel}
                  </span>
                </div>

                <Link
                  href={`/my-account/orders/${order.id}`}
                  className="block w-full px-4 py-2 rounded-lg font-semibold text-center transition-all hover:opacity-80"
                  style={{ background: '#00897B', color: 'white', fontSize: '13px' }}
                >
                  Bekijk details
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
            style={{ background: '#F5F7FA', color: '#0A1628', fontSize: '14px' }}
          >
            <ChevronLeft className="w-4 h-4" />
            Vorige
          </button>

          <div className="flex items-center gap-2">
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
                    <span style={{ color: '#94A3B8' }}>...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className="w-10 h-10 rounded-xl font-bold transition-all"
                    style={{
                      background: currentPage === page ? '#00897B' : '#F5F7FA',
                      color: currentPage === page ? 'white' : '#0A1628',
                      fontSize: '14px',
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
            style={{ background: '#F5F7FA', color: '#0A1628', fontSize: '14px' }}
          >
            Volgende
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
