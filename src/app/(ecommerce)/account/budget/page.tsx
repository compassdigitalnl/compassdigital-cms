'use client'

import React, { useState, useEffect } from 'react'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import { AccountLoadingSkeleton } from '@/branches/ecommerce/shared/components/account/ui'
import BudgetTemplate from '@/branches/ecommerce/b2b/templates/account/AccountTemplate1/BudgetTemplate'
import type { BudgetOverview, UserBudgetRow } from '@/branches/ecommerce/b2b/components/account/budget/types'
import { toast } from '@/lib/toast'

export default function BudgetPage() {
  if (!isFeatureEnabled('budget_limits') && !isFeatureEnabled('credit_limit')) notFound()

  const { user, isLoading: authLoading } = useAccountAuth()
  const [budget, setBudget] = useState<BudgetOverview | null>(null)
  const [users, setUsers] = useState<UserBudgetRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch('/api/account/budget', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setBudget(data.budget)
        setUsers(data.users || [])
      })
      .catch(() => toast.error('Kon budgetgegevens niet laden'))
      .finally(() => setIsLoading(false))
  }, [user])

  if (authLoading || isLoading || !user) return <AccountLoadingSkeleton variant="page" />

  if (!budget) {
    return (
      <div className="text-center py-12">
        <p className="text-grey-mid">Geen budgetinformatie beschikbaar.</p>
      </div>
    )
  }

  const companyRole = (user as any).companyRole || 'viewer'
  const canManage = companyRole === 'admin' || companyRole === 'manager'

  return <BudgetTemplate budget={budget} users={users} canManage={canManage} />
}
