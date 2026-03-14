/**
 * Digital Library Components
 *
 * Barrel export for all library/flipbook components.
 */

// Library Overview
export { LibraryOverview } from './LibraryOverview'
export type {
  LibraryOverviewProps,
  LibraryMagazineItem,
  RecentlyReadItem,
  LatestEditionItem,
} from './LibraryOverview'

// Magazine Grid (edition listing for a single magazine)
export { LibraryMagazineGrid } from './LibraryMagazineGrid'
export type { LibraryMagazineGridProps, LibraryMagazineGridEdition } from './LibraryMagazineGrid'

// Edition Card
export { LibraryEditionCard } from './LibraryEditionCard'
export type { LibraryEditionCardProps } from './LibraryEditionCard'

// Flipbook Viewer
export { FlipbookViewer } from './FlipbookViewer'
export type { FlipbookViewerProps } from './FlipbookViewer'

// Flipbook Toolbar
export { FlipbookToolbar } from './FlipbookToolbar'
export type { FlipbookToolbarProps } from './FlipbookToolbar'

// Flipbook Table of Contents
export { FlipbookTableOfContents } from './FlipbookTableOfContents'
export type { FlipbookTableOfContentsProps, TOCEntry } from './FlipbookTableOfContents'

// No Subscription Upsell
export { NoSubscriptionUpsell } from './NoSubscriptionUpsell'
export type { NoSubscriptionUpsellProps } from './NoSubscriptionUpsell'

// Recently Read Banner
export { RecentlyReadBanner } from './RecentlyReadBanner'
export type { RecentlyReadBannerProps } from './RecentlyReadBanner'
