# Header Feature-Guard Fixes & Service Detail Bug

Dit document bevat instructies voor code-wijzigingen die nodig zijn om:
1. De service detail pagina bug te fixen (`status: 'active'` → `'published'`)
2. De header te ontdoen van e-commerce elementen op niet-webshop sites
3. MiniCart en SearchProvider conditioneel te maken

---

## 1. CRITICAL BUG: Service Detail Page — `status: 'active'`

### Probleem
`/diensten/[slug]` geeft 500 error omdat de query `status: { equals: 'active' }` gebruikt,
maar de PostgreSQL enum `enum_construction_services_status` alleen `draft` en `published` kent.

### Bestand
`src/app/(construction)/diensten/[slug]/page.tsx`

### Fix
Vervang op **regel 31** en **regel 61**:
```typescript
// FOUT:
status: { equals: 'active' },

// GOED:
status: { equals: 'published' },
```

Beide plekken in hetzelfde bestand:
- Regel 31: in `generateMetadata()` functie
- Regel 61: in `ServiceDetailPage()` functie

---

## 2. NavigationBar — Verberg "Menu" Mega Menu Trigger

### Probleem
De `NavigationBar` component toont altijd een "Menu" knop die een e-commerce category mega menu opent.
Op sites zonder webshop (construction, content, horeca, etc.) is dit zinloos — het probeert
product categorieën op te halen die niet bestaan.

De **handmatige navigatie items** (Home, Diensten, Projecten, etc.) staan al los naast de
Menu-knop en werken prima. We hoeven alleen de mega menu trigger te verbergen.

### Bestand
`src/branches/shared/components/layout/header/Header/NavigationBar.tsx`

### Huidige Code (regel 214-243)
```tsx
{/* Menu Trigger Button */}
<button
  onClick={() => setMegaMenuOpen(!megaMenuOpen)}
  className={cn(
    'flex items-center gap-2 px-5 text-sm font-bold transition-all border-b-2',
    megaMenuOpen ? 'text-white' : 'text-white'
  )}
  style={{...}}
  onMouseEnter={(e) => {...}}
  onMouseLeave={(e) => {...}}
>
  <Menu className="w-4 h-4" />
  Menu
  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', megaMenuOpen && 'rotate-180')} />
</button>
```

### Fix
Wrap de "Menu Trigger Button" in een conditie zodat deze ALLEEN toont bij `categories` of `hybrid` mode:

```tsx
{/* Menu Trigger Button — alleen tonen bij category/hybrid navigatie */}
{(navigation.mode === 'categories' || navigation.mode === 'hybrid') && (
  <button
    onClick={() => setMegaMenuOpen(!megaMenuOpen)}
    className={cn(
      'flex items-center gap-2 px-5 text-sm font-bold transition-all border-b-2',
      megaMenuOpen ? 'text-white' : 'text-white'
    )}
    style={{
      backgroundColor: megaMenuOpen ? primaryColor : secondaryColor,
      borderColor: megaMenuOpen ? primaryColor : secondaryColor,
    }}
    onMouseEnter={(e) => {
      if (!megaMenuOpen) {
        e.currentTarget.style.backgroundColor = primaryColor
        e.currentTarget.style.borderColor = primaryColor
      }
    }}
    onMouseLeave={(e) => {
      if (!megaMenuOpen) {
        e.currentTarget.style.backgroundColor = secondaryColor
        e.currentTarget.style.borderColor = secondaryColor
      }
    }}
  >
    <Menu className="w-4 h-4" />
    Menu
    <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', megaMenuOpen && 'rotate-180')} />
  </button>
)}
```

De mega menu flyout (backdrop + panel) vanaf regel 406-607 hoeft NIET aangepast te worden —
die opent alleen als `megaMenuOpen` state true is, wat alleen kan als de button gerenderd wordt.

---

## 3. MiniCartProvider — Conditioneel MiniCart Panel

### Probleem
De `<MiniCart />` slide-out panel wordt ALTIJD gerenderd (regel 104 in MiniCartProvider.tsx),
zelfs op sites zonder winkelwagen. De HTML van het MiniCart panel staat altijd in de DOM.

### Bestand
`src/branches/shared/components/ui/MiniCart/MiniCartProvider.tsx`

### Fix
Maak de `<MiniCart />` render conditioneel op basis van een environment variable.

Aangezien dit een **client component** is, gebruik `NEXT_PUBLIC_` env vars:

**Optie A (aanbevolen):** Voeg een prop toe aan MiniCartProvider

```tsx
// MiniCartProvider.tsx — voeg prop toe
export function MiniCartProvider({ children, enableMiniCart = true }: { children: ReactNode; enableMiniCart?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const cartContext = useCart()

  // ... bestaande code ...

  return (
    <MiniCartContext.Provider value={{...}}>
      {children}
      {enableMiniCart && <MiniCart />}
    </MiniCartContext.Provider>
  )
}
```

Vervolgens in ALLE layout bestanden (server components) die MiniCartProvider gebruiken:

```tsx
// In elke layout.tsx:
import { isFeatureEnabled } from '@/lib/features'

// In de render:
<MiniCartProvider enableMiniCart={isFeatureEnabled('mini_cart') || isFeatureEnabled('cart')}>
  {/* ... */}
</MiniCartProvider>
```

### Bestanden die aangepast moeten worden
Alle layouts die `<MiniCartProvider>` gebruiken:
- `src/app/(beauty)/layout.tsx`
- `src/app/(construction)/layout.tsx`
- `src/app/(content)/layout.tsx`
- `src/app/(ecommerce)/layout.tsx`
- `src/app/(horeca)/layout.tsx`
- `src/app/(hospitality)/layout.tsx`
- `src/app/(shared)/layout.tsx`

---

## 4. SearchProvider — Conditioneel InstantSearch Modal

### Probleem
De `<InstantSearch />` modal wordt ALTIJD gerenderd (regel 40 in SearchProvider.tsx),
zelfs op sites waar search is uitgeschakeld.

### Bestand
`src/branches/shared/components/features/search/search/SearchProvider.tsx`

### Fix
Zelfde aanpak als MiniCartProvider — voeg prop toe:

```tsx
// SearchProvider.tsx
export function SearchProvider({ children, enableSearch = true }: SearchProviderProps & { enableSearch?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  const openSearch = useCallback(() => {
    if (enableSearch) setIsOpen(true)  // Alleen openen als search enabled is
  }, [enableSearch])
  const closeSearch = useCallback(() => setIsOpen(false), [])
  const toggleSearch = useCallback(() => {
    if (enableSearch) setIsOpen((prev) => !prev)
  }, [enableSearch])

  // Keyboard shortcut alleen als search enabled
  useSearchShortcut(enableSearch ? openSearch : () => {})

  return (
    <SearchContext.Provider value={{ isOpen, openSearch, closeSearch, toggleSearch }}>
      {children}
      {enableSearch && <InstantSearch isOpen={isOpen} onClose={closeSearch} />}
    </SearchContext.Provider>
  )
}
```

En in alle layouts:
```tsx
<SearchProvider enableSearch={isFeatureEnabled('search')}>
```

---

## 5. Providers — Conditioneel CartProvider

### Probleem
`CartProvider` wordt altijd geladen in `src/providers/index.tsx`, zelfs op sites zonder winkelwagen.
Dit laadt onnodig JavaScript en voert CartContext logica uit.

### Bestand
`src/providers/index.tsx`

### Fix
Maak een conditionele wrapper:

```tsx
import { AuthProvider } from '@/providers/Auth'
import React from 'react'
import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { SonnerProvider } from '@/providers/Sonner'
import { CartProvider } from '@/branches/ecommerce/contexts/CartContext'
import { isFeatureEnabled } from '@/lib/features'

// No-op CartProvider for sites without cart
function CartProviderWrapper({ children }: { children: React.ReactNode }) {
  if (isFeatureEnabled('cart') || isFeatureEnabled('checkout')) {
    return <CartProvider>{children}</CartProvider>
  }
  return <>{children}</>
}

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProviderWrapper>
          <HeaderThemeProvider>
            <SonnerProvider />
            {children}
          </HeaderThemeProvider>
        </CartProviderWrapper>
      </AuthProvider>
    </ThemeProvider>
  )
}
```

**LET OP:** Als CartProvider niet wordt geladen, zal `useCart()` in MiniCartProvider falen!
Daarom moet `MiniCartProvider` ook een fallback hebben als er geen CartProvider is.

Pas `MiniCartProvider` aan om `useCart()` veilig te maken:

```tsx
// In MiniCartProvider.tsx — bovenaan, import aanpassen:
import { useCart } from '@/branches/ecommerce/contexts/CartContext'

// Maak een veilige useCart wrapper:
function useSafeCart() {
  try {
    return useCart()
  } catch {
    // Fallback wanneer CartProvider niet beschikbaar is
    return {
      items: [],
      addItem: () => {},
      removeItem: () => {},
      updateQuantity: () => {},
      itemCount: 0,
      total: 0,
    }
  }
}

// Vervang in MiniCartProvider:
// const cartContext = useCart()
const cartContext = useSafeCart()
```

> **NOOT:** `try/catch` rond een hook is normaal niet toegestaan in React.
> Een betere aanpak is om `CartContext` optioneel te maken in zijn eigen provider.
> Pas `CartContext.tsx` aan zodat `useCart()` een fallback retourneert als er geen provider is:

```typescript
// In src/branches/ecommerce/contexts/CartContext.tsx
// Verander de useCart hook:
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    // Fallback voor sites zonder CartProvider
    return {
      items: [] as CartItem[],
      addItem: () => {},
      removeItem: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      itemCount: 0,
      total: 0,
      isLoading: false,
    }
  }
  return context
}
```

---

## 6. Overzicht: Welke bestanden moeten worden aangepast

| # | Bestand | Wijziging | Prioriteit |
|---|---------|-----------|------------|
| 1 | `src/app/(construction)/diensten/[slug]/page.tsx` | `'active'` → `'published'` (2x) | CRITICAL |
| 2 | `src/branches/shared/components/layout/header/Header/NavigationBar.tsx` | Mega menu trigger conditioneel op mode | HIGH |
| 3 | `src/branches/shared/components/ui/MiniCart/MiniCartProvider.tsx` | `enableMiniCart` prop, `<MiniCart />` conditioneel | MEDIUM |
| 4 | `src/branches/shared/components/features/search/search/SearchProvider.tsx` | `enableSearch` prop, `<InstantSearch />` conditioneel | MEDIUM |
| 5 | `src/providers/index.tsx` | CartProvider conditioneel wrappen | LOW |
| 6 | `src/branches/ecommerce/contexts/CartContext.tsx` | `useCart()` fallback zonder provider | LOW (nodig voor #5) |
| 7 | `src/app/(beauty)/layout.tsx` | enableMiniCart + enableSearch props | MEDIUM |
| 8 | `src/app/(construction)/layout.tsx` | enableMiniCart + enableSearch props | MEDIUM |
| 9 | `src/app/(content)/layout.tsx` | enableMiniCart + enableSearch props | MEDIUM |
| 10 | `src/app/(ecommerce)/layout.tsx` | enableMiniCart + enableSearch props | MEDIUM |
| 11 | `src/app/(horeca)/layout.tsx` | enableMiniCart + enableSearch props | MEDIUM |
| 12 | `src/app/(hospitality)/layout.tsx` | enableMiniCart + enableSearch props | MEDIUM |
| 13 | `src/app/(shared)/layout.tsx` | enableMiniCart + enableSearch props | MEDIUM |

---

## 7. Test Matrix

Na implementatie, verifieer:

### construction01 (ENABLE_SHOP=false, ENABLE_CART=false, ENABLE_SEARCH=false)
- [ ] `/diensten/dakwerken/` → 200 (niet meer 500)
- [ ] Header: Geen "Menu" mega menu trigger knop
- [ ] Header: Geen search balk
- [ ] Header: Geen cart knop
- [ ] Header: Geen wishlist/account knoppen
- [ ] Header: Wel navigatie items (Home, Diensten, Projecten, etc.)
- [ ] Header: Wel CTA knop "Offerte Aanvragen"
- [ ] Header: Wel contact info (telefoon, email)
- [ ] Geen MiniCart slide-out panel in DOM
- [ ] Geen InstantSearch modal in DOM

### plastimed01 (ENABLE_SHOP=true, ENABLE_CART=true, ENABLE_SEARCH=true)
- [ ] Header: "Menu" mega menu trigger WEL zichtbaar
- [ ] Header: Search balk WEL zichtbaar
- [ ] Header: Cart knop WEL zichtbaar
- [ ] MiniCart slide-out WEL aanwezig
- [ ] InstantSearch modal WEL aanwezig

---

## 8. Huidige Database Status construction01

Al geconfigureerd in de database:
- `header.enable_search = false`
- `header.show_cart = false`
- `header.show_wishlist = false`
- `header.show_account = false`
- `header.navigation_mode = 'manual'`
- `header.navigation_cta_button_show = true`
- `header.navigation_cta_button_text = 'Offerte Aanvragen'`
- `header.navigation_cta_button_link = '/offerte-aanvragen'`
- 6 handmatige navigatie items: Home, Diensten, Projecten, Over Ons, Blog, Contact
- 6 construction services (published)
- 6 construction projects (published)
- 5 construction reviews (published)
- Contact: 030-2345678, info@vandenbergbouw.nl
