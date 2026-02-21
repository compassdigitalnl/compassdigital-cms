'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Gift, ShoppingCart, Mail, Printer, Truck, Calendar, Heart, GraduationCap, PartyPopper } from 'lucide-react'

export default function GiftVoucherPurchasePage() {
  const [formData, setFormData] = useState({
    amount: 50,
    customAmount: '',
    occasion: 'birthday',
    recipientEmail: '',
    recipientName: '',
    senderName: '',
    message: '',
    deliveryMethod: 'email',
    deliveryDate: '',
  })

  const occasions = [
    { value: 'birthday', label: 'Verjaardag', icon: '🎂' },
    { value: 'christmas', label: 'Kerst', icon: '🎄' },
    { value: 'graduation', label: 'Afstuderen', icon: '🎓' },
    { value: 'wedding', label: 'Bruiloft', icon: '💍' },
    { value: 'anniversary', label: 'Jubileum', icon: '💝' },
    { value: 'thank_you', label: 'Bedankt', icon: '🙏' },
    { value: 'congratulations', label: 'Gefeliciteerd', icon: '🎉' },
    { value: 'other', label: 'Anders', icon: '🎁' },
  ]

  const predefinedAmounts = [25, 50, 75, 100, 150, 200]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement gift voucher purchase API call
    console.log('Purchasing gift voucher:', formData)
    alert('Cadeaubon aanmaken nog niet geïmplementeerd - API endpoint nodig')
  }

  const finalAmount = formData.amount === 0 ? parseInt(formData.customAmount) || 0 : formData.amount

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-3">Cadeaubon kopen</h1>
        <p className="text-gray-600 text-lg">
          Verras iemand met een cadeaubon voor onze webshop
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Amount Selection */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4">Kies een bedrag</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setFormData({ ...formData, amount, customAmount: '' })}
                className={`p-4 border-2 rounded-lg font-bold text-lg transition-all ${
                  formData.amount === amount
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-300 hover:border-teal-300'
                }`}
              >
                €{amount}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Of voer een eigen bedrag in</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">€</span>
              <input
                type="number"
                min="10"
                max="500"
                value={formData.customAmount}
                onChange={(e) =>
                  setFormData({ ...formData, customAmount: e.target.value, amount: 0 })
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Eigen bedrag (min. €10)"
              />
            </div>
          </div>
        </div>

        {/* Occasion */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4">Kies een gelegenheid</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {occasions.map((occasion) => (
              <button
                key={occasion.value}
                type="button"
                onClick={() => setFormData({ ...formData, occasion: occasion.value })}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.occasion === occasion.value
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-300 hover:border-teal-300'
                }`}
              >
                <div className="text-3xl mb-2">{occasion.icon}</div>
                <div className="font-semibold text-sm">{occasion.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Recipient Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4">Ontvangergegevens</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Naam ontvanger</label>
              <input
                type="text"
                required
                value={formData.recipientName}
                onChange={(e) =>
                  setFormData({ ...formData, recipientName: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Voor wie is de cadeaubon?"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">E-mailadres ontvanger</label>
              <input
                type="email"
                required
                value={formData.recipientEmail}
                onChange={(e) =>
                  setFormData({ ...formData, recipientEmail: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="ontvanger@example.nl"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Jouw naam</label>
              <input
                type="text"
                required
                value={formData.senderName}
                onChange={(e) =>
                  setFormData({ ...formData, senderName: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Van wie komt de cadeaubon?"
              />
            </div>
          </div>
        </div>

        {/* Personal Message */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4">Persoonlijk bericht (optioneel)</h3>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Schrijf een persoonlijk bericht..."
          />
          <div className="text-xs text-gray-500 mt-2 text-right">
            {formData.message.length}/500 tekens
          </div>
        </div>

        {/* Delivery Method */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4">Bezorgmethode</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, deliveryMethod: 'email' })}
              className={`p-4 border-2 rounded-lg transition-all ${
                formData.deliveryMethod === 'email'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-300 hover:border-teal-300'
              }`}
            >
              <Mail className="w-8 h-8 mx-auto mb-2 text-teal-600" />
              <div className="font-semibold mb-1">E-mail</div>
              <div className="text-xs text-gray-600">Direct verzonden</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, deliveryMethod: 'print' })}
              className={`p-4 border-2 rounded-lg transition-all ${
                formData.deliveryMethod === 'print'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-300 hover:border-teal-300'
              }`}
            >
              <Printer className="w-8 h-8 mx-auto mb-2 text-teal-600" />
              <div className="font-semibold mb-1">Printen</div>
              <div className="text-xs text-gray-600">PDF downloaden</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, deliveryMethod: 'post' })}
              className={`p-4 border-2 rounded-lg transition-all ${
                formData.deliveryMethod === 'post'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-300 hover:border-teal-300'
              }`}
            >
              <Truck className="w-8 h-8 mx-auto mb-2 text-teal-600" />
              <div className="font-semibold mb-1">Post</div>
              <div className="text-xs text-gray-600">Fysieke kaart (+€2,50)</div>
            </button>
          </div>

          {formData.deliveryMethod === 'email' && (
            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">
                Geplande verzending (optioneel)
              </label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Laat leeg om direct te verzenden
              </p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4">Overzicht</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Cadeaubon waarde</span>
              <span className="font-semibold">€{finalAmount}</span>
            </div>
            {formData.deliveryMethod === 'post' && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Verzendkosten</span>
                <span>€2,50</span>
              </div>
            )}
            <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold">
              <span>Totaal</span>
              <span className="text-teal-600">
                €{finalAmount + (formData.deliveryMethod === 'post' ? 2.5 : 0)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={finalAmount < 10}
            className="w-full py-4 bg-teal-600 text-white font-bold rounded-lg hover:bg-navy-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Naar afrekenen
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            De cadeaubon is 1 jaar geldig vanaf aankoopdatum
          </p>
        </div>
      </form>
    </div>
  )
}
