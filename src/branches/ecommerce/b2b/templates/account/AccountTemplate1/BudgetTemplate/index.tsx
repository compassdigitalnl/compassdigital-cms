'use client'

import React from 'react'
import {
  BudgetOverviewCard,
  CreditLimitCard,
  BudgetPerUserTable,
} from '@/branches/ecommerce/b2b/components/account/budget'
import type { BudgetOverview, UserBudgetRow } from '@/branches/ecommerce/b2b/components/account/budget/types'

interface BudgetTemplateProps {
  budget: BudgetOverview
  users: UserBudgetRow[]
  canManage: boolean
}

export default function BudgetTemplate({ budget, users, canManage }: BudgetTemplateProps) {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2 text-gray-900">Budget & Krediet</h1>
        <p className="text-sm lg:text-base text-gray-500">Beheer bedrijfsbudgetten en kredietlimieten</p>
      </div>

      {/* Budget overview cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BudgetOverviewCard
          label="Maandbudget"
          budget={budget.monthlyBudget}
          used={budget.monthlyUsed}
          period="deze maand"
        />
        <BudgetOverviewCard
          label="Kwartaalbudget"
          budget={budget.quarterlyBudget}
          used={budget.quarterlyUsed}
          period="dit kwartaal"
        />
      </div>

      {/* Credit limit */}
      <CreditLimitCard
        creditLimit={budget.creditLimit}
        creditUsed={budget.creditUsed}
        paymentTerms={budget.paymentTerms}
      />

      {/* Per-user budget table (only for admins/managers) */}
      {canManage && <BudgetPerUserTable users={users} />}
    </div>
  )
}
