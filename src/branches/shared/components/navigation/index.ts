/**
 * Navigation Components - Main Exports
 *
 * Complete navigation system with core components + optional sub-components:
 * - Topbar (USP messages, language switcher, price toggle)
 * - Logo (responsive branding)
 * - SearchBar (with overlay and autocomplete)
 * - HeaderActions (cart, account, wishlist, etc.)
 * - Navigation (main nav with mega menus and branches dropdown)
 * - MobileDrawer (full mobile navigation)
 * - AccountSidebar (user profile + account navigation)
 * - Optional: BranchesDropdown, PriceToggle, LanguageSwitcher, PromoCard
 *
 * Note: SubcategoryChips (EC03) moved to @branches/ecommerce/components/navigation
 */

// Core Components
export * from './Topbar'
export * from './Logo'
export * from './SearchBar'
export * from './HeaderActions'
export * from './Navigation'
export * from './MobileDrawer'
export * from './AccountSidebar'

// Optional Sub-Components (to be implemented later if needed)
// export * from './BranchesDropdown'
// export * from './PriceToggle'
// export * from './LanguageSwitcher'
// export * from './PromoCard'
