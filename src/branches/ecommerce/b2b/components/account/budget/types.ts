export interface BudgetOverview {
  monthlyBudget?: number
  quarterlyBudget?: number
  monthlyUsed: number
  quarterlyUsed: number
  creditLimit?: number
  creditUsed: number
  paymentTerms: string
}

export interface UserBudgetRow {
  id: number
  name: string
  email: string
  companyRole: string
  monthlyBudgetLimit?: number
  monthlyUsed: number
}
