'use client'

import React from 'react'
import { PricingPlanCard } from '../PricingPlanCard'
import type { PricingPlansGridProps } from './types'

const GRID_COLS: Record<number, string> = {
  1: 'max-w-sm grid-cols-1',
  2: 'max-w-2xl grid-cols-1 md:grid-cols-2',
  3: 'max-w-4xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export const PricingPlansGrid: React.FC<PricingPlansGridProps> = ({
  plans,
  onSelectPlan,
  className = '',
}) => {
  const cols = GRID_COLS[Math.min(plans.length, 4)] || GRID_COLS[4]

  return (
    <div className={`mx-auto grid gap-3.5 ${cols} ${className}`}>
      {plans.map((plan) => (
        <PricingPlanCard
          key={plan.id}
          plan={plan}
          onSelect={onSelectPlan}
        />
      ))}
    </div>
  )
}
