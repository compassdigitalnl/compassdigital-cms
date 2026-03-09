'use client'

import { createContext, useContext } from 'react'
import { ACCOUNT_TEMPLATES, type AccountTemplateConfig } from '@/branches/ecommerce/shared/lib/accountTemplates'

interface AccountTemplateContextValue {
  templateKey: string
  config: AccountTemplateConfig
}

const AccountTemplateContext = createContext<AccountTemplateContextValue>({
  templateKey: 'enterprise',
  config: ACCOUNT_TEMPLATES.enterprise,
})

export function AccountTemplateProvider({
  templateKey,
  children,
}: {
  templateKey: string
  children: React.ReactNode
}) {
  const config = ACCOUNT_TEMPLATES[templateKey] || ACCOUNT_TEMPLATES.enterprise

  return (
    <AccountTemplateContext.Provider value={{ templateKey, config }}>
      {children}
    </AccountTemplateContext.Provider>
  )
}

export function useAccountTemplate() {
  return useContext(AccountTemplateContext)
}
