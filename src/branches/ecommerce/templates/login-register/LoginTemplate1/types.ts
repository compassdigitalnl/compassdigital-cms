import type { TabId } from '@/branches/ecommerce/components/auth'

export interface LoginTemplate1Props {
  defaultTab?: TabId
  siteConfig?: {
    companyName?: string
    phone?: string
    email?: string
  }
}
