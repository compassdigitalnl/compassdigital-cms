'use client'
import { useState } from 'react'
import { Tag, Minus, Plus, Check, TrendingDown } from 'lucide-react'

export interface PriceTier {
  minQty: number
  maxQty?: number
  price: number
  savePercentage?: number
}

interface StaffelCalculatorProps {
  productName: string
  tiers: PriceTier[]
  initialQuantity?: number
  unit?: string
  onQuantityChange?: (quantity: number, price: number, total: number) => void
}

export function StaffelCalculator({
  productName,
  tiers,
  initialQuantity = 1,
  unit = 'dozen',
  onQuantityChange,
}: StaffelCalculatorProps) {
  const [quantity, setQuantity] = useState(initialQuantity)

  // Find active tier based on quantity
  const activeTier = tiers.find(
    (tier) => quantity >= tier.minQty && (tier.maxQty === undefined || quantity <= tier.maxQty),
  ) || tiers[0]

  const totalPrice = activeTier.price * quantity
  const basePrice = tiers[0].price
  const totalSavings = (basePrice - activeTier.price) * quantity

  const handleQuantityChange = (newQty: number) => {
    const validQty = Math.max(1, Math.min(999, newQty))
    setQuantity(validQty)

    const tier = tiers.find(
      (t) => validQty >= t.minQty && (t.maxQty === undefined || validQty <= t.maxQty),
    ) || tiers[0]

    onQuantityChange?.(validQty, tier.price, tier.price * validQty)
  }

  const increment = () => handleQuantityChange(quantity + 1)
  const decrement = () => handleQuantityChange(quantity - 1)

  const getTierLabel = (tier: PriceTier) => {
    if (tier.maxQty === undefined) {
      return `${tier.minQty}+ ${unit}`
    }
    return `${tier.minQty} – ${tier.maxQty} ${unit}`
  }

  const getNextTier = () => {
    const currentIndex = tiers.indexOf(activeTier)
    return tiers[currentIndex + 1]
  }

  const nextTier = getNextTier()
  const qtyToNextTier = nextTier ? nextTier.minQty - quantity : null

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-lg">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4.5">
        <Tag className="w-5 h-5 text-teal-600" />
        <h3 className="text-base font-extrabold text-gray-900">
          Staffelprijzen — {productName}
        </h3>
      </div>

      {/* Price Tiers */}
      <div className="flex flex-col gap-1 mb-5">
        {tiers.map((tier, idx) => {
          const isActive = tier === activeTier
          return (
            <button
              key={idx}
              onClick={() => handleQuantityChange(tier.minQty)}
              className={`flex items-center px-3.5 py-2.5 rounded-lg text-sm transition-all border-1.5 ${
                isActive
                  ? 'bg-teal-50 border-teal-200'
                  : 'border-transparent hover:bg-gray-50'
              }`}
            >
              {/* Checkmark */}
              <div
                className={`w-5 h-5 rounded-full mr-2.5 flex items-center justify-center flex-shrink-0 ${
                  isActive
                    ? 'bg-teal-600'
                    : 'border-2 border-gray-200'
                }`}
              >
                {isActive && <Check className="w-3 h-3 text-white" />}
              </div>

              {/* Range */}
              <span className="flex-1 text-left font-semibold text-gray-900">
                {getTierLabel(tier)}
              </span>

              {/* Price */}
              <span className="font-extrabold text-gray-900">€{tier.price.toFixed(2)}</span>

              {/* Savings Badge */}
              {tier.savePercentage && (
                <span className="ml-2.5 text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  −{tier.savePercentage}%
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Calculator */}
      <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
        {/* Quantity Controls */}
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Aantal {unit}
          </div>
          <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
            <button
              onClick={decrement}
              disabled={quantity <= 1}
              className="w-9 h-9.5 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4 text-gray-900" />
            </button>
            <input
              type="number"
              min="1"
              max="999"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-13 text-center border-none font-mono text-sm font-semibold text-gray-900 outline-none"
            />
            <button
              onClick={increment}
              disabled={quantity >= 999}
              className="w-9 h-9.5 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-900" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="text-2xl font-extrabold text-gray-900">
            €{totalPrice.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">
            €{activeTier.price.toFixed(2)} per {unit.slice(0, -2)}
          </div>
          {totalSavings > 0 && (
            <div className="flex items-center gap-1 text-xs font-bold text-green-600 mt-1">
              <TrendingDown className="w-3.5 h-3.5" />
              Je bespaart €{totalSavings.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      {/* Hint for next tier */}
      {qtyToNextTier && qtyToNextTier > 0 && (
        <div className="flex items-center gap-2 mt-3.5 px-3.5 py-2.5 bg-teal-50 rounded-lg text-xs text-teal-600 font-semibold">
          <Tag className="w-4 h-4 flex-shrink-0" />
          <span>
            Bestel nog {qtyToNextTier} {unit} voor €{nextTier.price.toFixed(2)} per stuk
            {nextTier.savePercentage && ` (−${nextTier.savePercentage}%)`}
          </span>
        </div>
      )}
    </div>
  )
}
