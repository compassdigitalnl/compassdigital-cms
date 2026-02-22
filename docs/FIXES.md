Instructies voor Claude Lokaal: 3 Bugfixes

  Bug 1: Mini-cart opent niet, cart icon navigeert direct naar /cart/

  Bestand: src/branches/shared/components/layout/header/Header/index.client.tsx

  Probleem: Het cart-icoon in de header is een <Link href="/cart/">. Het zou een <button> moeten zijn die de mini-cart drawer opent via useMiniCart().

  Fix:

  1. Voeg import toe:
  import { useMiniCart } from '@/branches/shared/components/ui/MiniCart'

  2. In de component, voeg hook call toe:
  const { openCart, totalItems } = useMiniCart()

  3. Vervang het cart <Link> blok (rond regel 278-296) van:
  <Link
    href="/cart/"
    className="h-[42px] px-4 rounded-[10px] text-white ..."
  >
    <ShoppingCart className="w-4 h-4" />
    <span className="hidden sm:inline">€0,00</span>
  </Link>

  Naar:
  <button
    onClick={openCart}
    className="h-[42px] px-4 rounded-[10px] text-white border flex items-center gap-2 transition-all font-bold text-[13.5px] cursor-pointer"
    style={{
      borderColor: 'color-mix(in srgb, var(--color-primary) 50%, white)',
      background: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
    }}
  >
    <ShoppingCart className="w-4 h-4" />
    {totalItems > 0 && (
      <span className="bg-white text-[var(--color-primary)] text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {totalItems}
      </span>
    )}
  </button>

  4. Doe dezelfde fix in DynamicHeader.tsx als die ook nog een <Link href="/cart/"> heeft.

  ---
  Bug 2: Account icon linkt naar /account/ ipv /my-account/

  Bestanden:
  - src/branches/shared/components/layout/header/Header/index.client.tsx (rond regel 263)
  - src/branches/shared/components/layout/header/DynamicHeader.tsx (rond regel 149)

  Fix: Verander in BEIDE bestanden:
  href="/account/"
  Naar:
  href="/my-account/"

  ---
  Bug 3: Checkout toont altijd "Your cart is empty"

  Bestand: src/app/(ecommerce)/checkout/CheckoutTemplate1.tsx

  Probleem: De checkout importeert useCart van @payloadcms/plugin-ecommerce/client/react — dat is een ANDER cart systeem dan de lokale CartContext die door MiniCart en de add-to-cart buttons wordt
  gebruikt. De Payload plugin cart is altijd leeg omdat producten naar de lokale localStorage cart gaan.

  Fix:

  1. Verander de cart import (rond regel 20) van:
  import { useAddresses, useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
  Naar:
  import { useAddresses, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
  import { useCart } from '@/branches/ecommerce/contexts/CartContext'

  2. Verander de cart hook call (rond regel 36) van:
  const { cart } = useCart()
  Naar:
  const { items: cartItems, total: cartTotal, itemCount } = useCart()

  3. Verander de empty cart check (rond regel 56) van:
  const cartIsEmpty = !cart || !cart.items || !cart.items.length
  Naar:
  const cartIsEmpty = !cartItems || cartItems.length === 0

  4. Update alle referenties naar cart.items en cart.subtotal in de rest van de component:
    - cart.items wordt cartItems
    - cart.items.length wordt cartItems.length of itemCount
    - cart.subtotal of totaalbedragen worden cartTotal
    - Elk cart item heeft de structuur: { id, title, slug, price, quantity, unitPrice, image, sku }
  5. Update ook het "Your cart is empty" bericht (rond regels 126-132):
  if (cartIsEmpty) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Je winkelwagen is leeg.</p>
        <Link href="/shop/" className="text-[var(--color-primary)] font-semibold mt-4 inline-block">
          Verder winkelen
        </Link>
      </div>
    )
  }

  ---
  Samenvatting

  ┌──────────────────────┬────────────────────────────────────────────┬─────────────────────────────────────────────────────────────┐
  │         Bug          │                Bestand(en)                 │                             Fix                             │
  ├──────────────────────┼────────────────────────────────────────────┼─────────────────────────────────────────────────────────────┤
  │ Mini-cart opent niet │ Header/index.client.tsx, DynamicHeader.tsx │ <Link> → <button onClick={openCart}> met useMiniCart() hook │
  ├──────────────────────┼────────────────────────────────────────────┼─────────────────────────────────────────────────────────────┤
  │ Account link fout    │ Header/index.client.tsx, DynamicHeader.tsx │ /account/ → /my-account/                                    │
  ├──────────────────────┼────────────────────────────────────────────┼─────────────────────────────────────────────────────────────┤
  │ Checkout altijd leeg │ checkout/CheckoutTemplate1.tsx             │ Payload plugin useCart → lokale CartContext useCart         │
  └──────────────────────┴────────────────────────────────────────────┴─────────────────────────────────────────────────────────────┘

  Root cause van bug 1 + 3: Er zijn twee losse cart systemen — de lokale CartContext (localStorage) en de Payload plugin cart. De frontend (MiniCart, add-to-cart buttons) schrijft naar de lokale cart,
  maar de checkout leest van de Payload plugin cart. Alles moet de lokale CartContext gebruiken.