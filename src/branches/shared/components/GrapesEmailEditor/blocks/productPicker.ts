/**
 * Product Picker Modal
 *
 * Registers a GrapesJS command `product-picker:open` that opens a modal
 * with a product search UI. Selected products are returned via callback.
 *
 * Uses DOM-based UI (no React) since GrapesJS modals work with raw DOM.
 */

interface ProductData {
  id: number
  title: string
  price: number
  salePrice?: number
  slug: string
  imageUrl?: string
}

export function registerProductPicker(editor: any) {
  editor.Commands.add('product-picker:open', {
    run(editorInstance: any, _sender: any, options: { onSelect?: (product: ProductData) => void } = {}) {
      const modal = editorInstance.Modal
      modal.open({
        title: 'Product kiezen',
        content: '',
      })

      const modalContent = modal.getContentEl()
      modalContent.innerHTML = ''

      // Build the picker UI
      const container = document.createElement('div')
      container.className = 'product-picker'

      // Search bar
      const searchWrapper = document.createElement('div')
      searchWrapper.className = 'product-picker__search-wrapper'

      const searchInput = document.createElement('input')
      searchInput.type = 'text'
      searchInput.className = 'product-picker__search'
      searchInput.placeholder = 'Zoek op productnaam...'
      searchWrapper.appendChild(searchInput)

      container.appendChild(searchWrapper)

      // Loading indicator
      const loading = document.createElement('div')
      loading.className = 'product-picker__loading'
      loading.textContent = 'Producten laden...'
      loading.style.display = 'none'
      container.appendChild(loading)

      // Product grid
      const grid = document.createElement('div')
      grid.className = 'product-picker__grid'
      container.appendChild(grid)

      // Empty state
      const emptyState = document.createElement('div')
      emptyState.className = 'product-picker__empty'
      emptyState.textContent = 'Typ een zoekopdracht om producten te vinden'
      container.appendChild(emptyState)

      modalContent.appendChild(container)

      // Debounced search
      let searchTimeout: any = null

      const fetchProducts = async (query: string) => {
        if (!query || query.length < 2) {
          grid.innerHTML = ''
          emptyState.style.display = 'block'
          emptyState.textContent = 'Typ minimaal 2 tekens om te zoeken'
          return
        }

        loading.style.display = 'block'
        emptyState.style.display = 'none'
        grid.innerHTML = ''

        try {
          const params = new URLSearchParams({
            'where[status][equals]': 'published',
            'where[title][like]': query,
            limit: '12',
            depth: '1',
          })
          const response = await fetch(`/api/products?${params}`)
          const data = await response.json()

          loading.style.display = 'none'

          if (!data.docs || data.docs.length === 0) {
            emptyState.style.display = 'block'
            emptyState.textContent = 'Geen producten gevonden'
            return
          }

          data.docs.forEach((product: any) => {
            const item = document.createElement('div')
            item.className = 'product-picker__item'

            // Image
            const imageUrl = product.images?.[0]?.image?.url
              || product.images?.[0]?.url
              || product.featuredImage?.url
              || ''

            if (imageUrl) {
              const img = document.createElement('img')
              img.src = imageUrl
              img.alt = product.title || ''
              img.className = 'product-picker__image'
              item.appendChild(img)
            } else {
              const placeholder = document.createElement('div')
              placeholder.className = 'product-picker__image-placeholder'
              placeholder.textContent = 'Geen afbeelding'
              item.appendChild(placeholder)
            }

            // Info
            const info = document.createElement('div')
            info.className = 'product-picker__info'

            const title = document.createElement('p')
            title.className = 'product-picker__title'
            title.textContent = product.title || 'Naamloos product'
            info.appendChild(title)

            const price = document.createElement('p')
            price.className = 'product-picker__price'
            const priceValue = product.salePrice || product.price || 0
            price.textContent = `€${Number(priceValue).toFixed(2)}`
            if (product.salePrice && product.price) {
              price.innerHTML = `<strong>€${Number(product.salePrice).toFixed(2)}</strong> <s>€${Number(product.price).toFixed(2)}</s>`
            }
            info.appendChild(price)

            item.appendChild(info)

            // Click handler
            item.addEventListener('click', () => {
              const productData: ProductData = {
                id: product.id,
                title: product.title || 'Product',
                price: product.price || 0,
                salePrice: product.salePrice || undefined,
                slug: product.slug || '',
                imageUrl: imageUrl || undefined,
              }

              if (options.onSelect) {
                options.onSelect(productData)
              }
              modal.close()
            })

            grid.appendChild(item)
          })
        } catch (error) {
          loading.style.display = 'none'
          emptyState.style.display = 'block'
          emptyState.textContent = 'Fout bij laden van producten'
          console.error('[Product Picker] Fetch error:', error)
        }
      }

      // Load initial products (most recent)
      fetchProducts('*')

      searchInput.addEventListener('input', () => {
        if (searchTimeout) clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {
          fetchProducts(searchInput.value || '*')
        }, 300)
      })

      // Focus search input
      setTimeout(() => searchInput.focus(), 100)
    },
  })

  console.log('[Product Picker] Registered product-picker:open command')
}
