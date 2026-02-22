const redirects = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // SEO: Redirect /shop/[product-slug] to /[product-slug] (root level)
  // This prevents duplicate URLs and improves SEO
  // Note: /shop/ (without slug) remains as the shop archive page
  const shopProductRedirect = {
    source: '/shop/:slug',
    destination: '/:slug',
    permanent: true,
  }

  const redirects = [internetExplorerRedirect, shopProductRedirect]

  return redirects
}

export default redirects
