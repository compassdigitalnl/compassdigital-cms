export interface TOCItem {
  id: string
  label: string
}

export interface LegalLayoutProps {
  title: string
  lastUpdated: string
  badge?: {
    icon: React.ReactNode
    label: string
  }
  tocItems: TOCItem[]
  children: React.ReactNode
  breadcrumbItems: { label: string; href?: string }[]
}
