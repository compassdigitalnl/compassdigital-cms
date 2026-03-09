export interface BundleDealProps {
  title: string
  products: { id: number; title: string; image?: string; originalPrice: number }[]
  bundlePrice: number
  savingsLabel: string
  endDate?: string
}
