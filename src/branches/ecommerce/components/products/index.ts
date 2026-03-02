// E-commerce Product Components
export { ProductCard } from './ProductCard'
export type {
  ProductCardProps,
  VolumePricingTier,
  Brand,
  ProductImage,
} from './ProductCard'
export type {
  BadgeType as ProductCardBadgeType,
  ProductBadge as ProductCardBadge,
  StockStatus as ProductCardStockStatus,
} from './ProductCard'

export { ProductBadge } from './ProductBadges'
export type {
  ProductBadgeProps,
  BadgeVariant,
  BadgeSize,
  BadgeStyle,
  BadgeConfig,
} from './ProductBadges'
export type {
  BadgePosition as ProductBadgePosition,
} from './ProductBadges'

export { StockIndicator } from './StockIndicator'
export type { StockIndicatorProps, StockSize } from './StockIndicator'

export { StaffelCalculator } from './StaffelCalculator'
export type { StaffelCalculatorProps, VolumePriceTier } from './StaffelCalculator'

export { ReviewWidget } from './ReviewWidget'
export type {
  ReviewWidgetProps,
  Review,
  ReviewSummary,
  ReviewDistribution,
  SortOption,
} from './ReviewWidget'

export { QuickViewModal } from './QuickViewModal'
export type {
  QuickViewModalProps,
  QuickViewProduct,
  ProductVariant,
  ProductStock,
} from './QuickViewModal'
export type {
  StockStatus as QuickViewStockStatus,
} from './QuickViewModal'

export { ProductGallery } from './ProductGallery'
export type {
  ProductGalleryProps,
  GalleryImage,
  GalleryBadge,
  GalleryLayout,
} from './ProductGallery'
export type {
  BadgeType as GalleryBadgeType,
  BadgePosition as GalleryBadgePosition,
} from './ProductGallery'

export { ProductMeta } from './ProductMeta'
export type {
  ProductMetaProps,
  ProductMetaProduct,
  ProductRating,
  StockInfo,
  TrustBadge,
} from './ProductMeta'
export type {
  StockStatus as ProductMetaStockStatus,
} from './ProductMeta'

export { ProductTabs } from './ProductTabs'
export type { ProductTabsProps, TabContent, TabVariant } from './ProductTabs'

export { ProductSpecsTable } from './ProductSpecsTable'
export type { ProductSpecsTableProps, SpecGroup, SpecRow, SpecsVariant } from './ProductSpecsTable'

export { ProductActions } from './ProductActions'
export type { ProductActionsProps } from './ProductActions'

export { StickyAddToCartBar } from './StickyAddToCartBar'
export type { StickyAddToCartBarProps, StickyAddToCartBarProduct } from './StickyAddToCartBar'

export { BackInStockNotifier } from './BackInStockNotifier'
export type { BackInStockNotifierProps, BackInStockNotifierProduct } from './BackInStockNotifier'

export { ProductCompareBar } from './ProductCompareBar'
export type { ProductCompareBarProps, CompareProduct } from './ProductCompareBar'

export { PromoCard } from './PromoCard'
export type { PromoCardProps, PromoCardProduct, PromoCardVariant } from './PromoCard'

export { StaffelHintBanner } from './StaffelHintBanner'
export type {
  StaffelHintBannerProps,
  StaffelHintTier,
  StaffelHintVariant,
} from './StaffelHintBanner'
