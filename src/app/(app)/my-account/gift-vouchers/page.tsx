'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Gift, ShoppingBag, Mail, Printer, Send } from 'lucide-react'

export default function GiftVouchersPage() {
  // TODO: Replace with real voucher data from API
  const [vouchers] = useState([
    {
      id: 1,
      code: 'GIFT-2024-AB42CD89',
      amount: 50,
      balance: 50,
      status: 'active',
      occasion: 'birthday',
      occasionEmoji: '🎂',
      recipientEmail: 'jan@example.nl',
      message: 'Gefeliciteerd met je verjaardag!',
      deliveryMethod: 'email',
      purchasedAt: '2024-02-01',
      expiresAt: '2025-02-01',
    },
    {
      id: 2,
      code: 'GIFT-2023-XY98ZW12',
      amount: 100,
      balance: 35,
      status: 'active',
      occasion: 'christmas',
      occasionEmoji: '🎄',
      recipientEmail: 'marie@example.nl',
      message: 'Fijne feestdagen!',
      deliveryMethod: 'email',
      purchasedAt: '2023-12-20',
      expiresAt: '2024-12-20',
    },
  ])

  const handleSendVoucher = (voucherId: number) => {
    // TODO: Implement send voucher API call
    console.log(`Sending voucher ${voucherId}`)
    alert('Cadeaubon verzonden!')
  }

  const handlePrintVoucher = (voucherId: number) => {
    // TODO: Implement print voucher
    console.log(`Printing voucher ${voucherId}`)
    alert('Print functionaliteit nog niet beschikbaar')
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/my-account"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold">Cadeaubonnen</h1>
            </div>
            <p className="text-sm text-gray-600">
              Beheer je cadeaubonnen en verstuur ze naar vrienden en familie
            </p>
          </div>
          <Link
            href="/gift-vouchers/purchase"
            className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-navy-900 transition-colors flex items-center gap-2"
          >
            <Gift className="w-4 h-4" />
            Cadeaubon kopen
          </Link>
        </div>
      </div>

      {/* Vouchers List */}
      <div className="space-y-4">
        {vouchers.map((voucher) => (
          <div key={voucher.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Voucher Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl shadow-sm">
                    {voucher.occasionEmoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold">€{voucher.amount} Cadeaubon</h3>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">
                        {voucher.status === 'active' ? 'Actief' : voucher.status === 'spent' ? 'Gebruikt' : 'Verlopen'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Code: <span className="font-mono font-semibold">{voucher.code}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        Gekocht {new Date(voucher.purchasedAt).toLocaleDateString('nl-NL')}
                      </span>
                      <span>
                        Geldig tot {new Date(voucher.expiresAt).toLocaleDateString('nl-NL')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Restwaarde</div>
                  <div className="text-2xl font-bold text-purple-600">€{voucher.balance}</div>
                  <div className="text-xs text-gray-500">
                    van €{voucher.amount}
                  </div>
                </div>
              </div>
            </div>

            {/* Voucher Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Ontvanger</div>
                  <div className="font-semibold text-sm">{voucher.recipientEmail}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Bezorgmethode</div>
                  <div className="flex items-center gap-2 text-sm">
                    {voucher.deliveryMethod === 'email' ? (
                      <>
                        <Mail className="w-4 h-4 text-teal-600" />
                        <span className="font-semibold">E-mail</span>
                      </>
                    ) : voucher.deliveryMethod === 'print' ? (
                      <>
                        <Printer className="w-4 h-4 text-teal-600" />
                        <span className="font-semibold">Printen</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-teal-600" />
                        <span className="font-semibold">Post</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {voucher.message && (
                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                  <div className="text-xs text-gray-500 mb-1">Persoonlijk bericht</div>
                  <div className="text-sm italic">"{voucher.message}"</div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleSendVoucher(voucher.id)}
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Mail className="w-4 h-4" />
                  Opnieuw versturen
                </button>
                <button
                  onClick={() => handlePrintVoucher(voucher.id)}
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Printer className="w-4 h-4" />
                  Printen
                </button>
                <button className="flex-1 px-3 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-navy-900 transition-colors flex items-center justify-center gap-2 text-sm">
                  <ShoppingBag className="w-4 h-4" />
                  Gebruiken
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {vouchers.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-bold text-lg mb-2">Geen cadeaubonnen</h3>
          <p className="text-gray-600 text-sm mb-4">
            Je hebt nog geen cadeaubonnen gekocht of ontvangen
          </p>
          <Link
            href="/gift-vouchers/purchase"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-navy-900 transition-colors"
          >
            <Gift className="w-4 h-4" />
            Cadeaubon kopen
          </Link>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-bold text-sm mb-2 text-blue-900">Over cadeaubonnen</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Cadeaubonnen zijn 1 jaar geldig vanaf aankoopdatum</li>
          <li>• Je kunt cadeaubonnen gebruiken voor alle producten in de webshop</li>
          <li>• Het restbedrag blijft beschikbaar voor toekomstige aankopen</li>
          <li>• Cadeaubonnen zijn niet inwisselbaar voor contant geld</li>
        </ul>
      </div>
    </div>
  )
}
