export interface PackageItem {
  text: string
}

export interface BranchPackage {
  name: string
  description: string
  price: string
  priceSuffix?: string
  items: PackageItem[]
  featured?: boolean
  featuredLabel?: string
  buttonLabel?: string
  buttonIcon?: string
  buttonVariant?: 'primary' | 'outline'
  onOrder?: () => void
}

export interface BranchPackageGridProps {
  title?: string
  titleIcon?: string
  packages: BranchPackage[]
  className?: string
}
