import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { ArrowLeft, Download } from 'lucide-react'
import { notFound } from 'next/navigation'
import { AddToCartButton } from './AddToCartButton'
import { GroupedProductTable } from './GroupedProductTable'
import type { Product } from '@/payload-types'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const payload = await getPayload({ config })

  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: params.slug,
      },
    },
    limit: 1,
  })

  const product = products[0]

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title:
      (typeof product.meta === 'object' && product.meta?.title) ||
      `${product.title} | Shop`,
    description:
      (typeof product.meta === 'object' && product.meta?.description) ||
      product.shortDescription ||
      `Buy ${product.title} - Professional equipment`,
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const payload = await getPayload({ config })

  // Fetch product with depth for relationships
  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: params.slug,
      },
    },
    depth: 2, // Resolve childProducts and their images
    limit: 1,
  })

  const product = products[0] as Product

  if (!product || product.status !== 'published') {
    notFound()
  }

  // Determine if this is a grouped product
  const isGrouped = product.productType === 'grouped'

  const imageUrl =
    typeof product.images?.[0] === 'object' && product.images[0] !== null
      ? product.images[0].url
      : null

  const isInStock =
    !product.trackStock ||
    product.stockStatus === 'in-stock' ||
    (product.stock !== undefined && product.stock > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar Shop
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {isGrouped && product.childProducts && product.childProducts.length > 0 ? (
          /* ======================================
             GROUPED PRODUCT VIEW
             ====================================== */
          <div>
            {/* Product Header */}
            <div className="mb-8">
              <div className="mb-4">
                {typeof product.categories?.[0] === 'object' &&
                  product.categories[0] !== null && (
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-teal-50 text-teal-700 rounded">
                      {product.categories[0].title}
                    </span>
                  )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>
              {product.shortDescription && (
                <p className="text-lg text-gray-600 mt-4">{product.shortDescription}</p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-gray max-w-none mb-8 bg-white p-6 rounded-lg shadow-sm">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      typeof product.description === 'string'
                        ? product.description
                        : JSON.stringify(product.description),
                  }}
                />
              </div>
            )}

            {/* Grouped Products Table */}
            <GroupedProductTable
              parentProduct={{
                id: product.id,
                title: product.title,
              }}
              childProducts={product.childProducts}
            />
          </div>
        ) : (
          /* ======================================
             SIMPLE PRODUCT VIEW
             ====================================== */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              <div className="aspect-square bg-white rounded-lg shadow-sm border overflow-hidden sticky top-8">
                {product.badge && product.badge !== 'none' && (
                  <div className="absolute top-4 right-4 z-10">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        product.badge === 'sale'
                          ? 'bg-red-500 text-white'
                          : product.badge === 'new'
                            ? 'bg-blue-500 text-white'
                            : product.badge === 'popular'
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-500 text-white'
                      }`}
                    >
                      {product.badge === 'sale'
                        ? 'Sale'
                        : product.badge === 'new'
                          ? 'Nieuw'
                          : product.badge === 'popular'
                            ? 'Populair'
                            : product.badge === 'sold-out'
                              ? 'Uitverkocht'
                              : ''}
                    </span>
                  </div>
                )}
                {imageUrl ? (
                  <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <svg
                      className="w-24 h-24 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Breadcrumb */}
              <div className="mb-4">
                {typeof product.categories?.[0] === 'object' &&
                  product.categories[0] !== null && (
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-teal-50 text-teal-700 rounded">
                      {product.categories[0].title}
                    </span>
                  )}
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>

              {/* SKU & EAN */}
              <div className="flex gap-4 text-sm text-gray-500 mb-6">
                {product.sku && <span>SKU: {product.sku}</span>}
                {product.ean && <span>EAN: {product.ean}</span>}
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-lg text-gray-700 mb-6">{product.shortDescription}</p>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  €{product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      €{product.compareAtPrice.toFixed(2)}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded">
                      Bespaar €{(product.compareAtPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Volume Pricing Table */}
              {product.volumePricing && product.volumePricing.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-2 text-blue-900">Staffelprijzen</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-blue-200">
                          <th className="text-left py-2 text-blue-900">Vanaf</th>
                          <th className="text-right py-2 text-blue-900">Stuksprijs</th>
                          <th className="text-right py-2 text-blue-900">Korting</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.volumePricing.map((tier, i) => (
                          <tr key={i} className="border-b border-blue-100">
                            <td className="py-2 text-gray-900">
                              {tier.minQuantity}
                              {tier.maxQuantity ? `-${tier.maxQuantity}` : '+'} stuks
                            </td>
                            <td className="text-right text-gray-900 font-medium">
                              €{tier.price?.toFixed(2) || '-'}
                            </td>
                            <td className="text-right text-blue-700">
                              {tier.discountPercentage ? `${tier.discountPercentage}%` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-8">
                {isInStock ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 font-medium">
                      {product.trackStock && product.stock
                        ? `${product.stock} op voorraad`
                        : 'Op Voorraad'}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-700 font-medium">Uitverkocht</span>
                  </>
                )}
              </div>

              {/* B2B Info */}
              {(product.minOrderQuantity ||
                product.orderMultiple ||
                product.leadTime ||
                product.quotationRequired) && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm">
                  <h3 className="font-semibold text-amber-900 mb-2">B2B Informatie</h3>
                  <ul className="space-y-1 text-amber-800">
                    {product.minOrderQuantity && (
                      <li>Minimum bestelhoeveelheid: {product.minOrderQuantity} stuks</li>
                    )}
                    {product.orderMultiple && product.orderMultiple > 1 && (
                      <li>Bestelbaar in veelvouden van: {product.orderMultiple}</li>
                    )}
                    {product.leadTime && <li>Levertijd: {product.leadTime} dagen</li>}
                    {product.quotationRequired && <li>Offerte verplicht</li>}
                  </ul>
                </div>
              )}

              {/* Add to Cart Section */}
              {isInStock && !product.quotationRequired && (
                <AddToCartButton
                  product={{
                    id: product.id,
                    slug: product.slug!,
                    title: product.title,
                    price: product.price,
                    stock: product.stock || 0,
                    sku: product.sku || undefined,
                    ean: product.ean || undefined,
                    image: imageUrl || undefined,
                    minOrderQuantity: product.minOrderQuantity || undefined,
                    orderMultiple: product.orderMultiple || undefined,
                    maxOrderQuantity: product.maxOrderQuantity || undefined,
                  }}
                />
              )}

              {/* Description */}
              {product.description && (
                <div className="prose prose-gray max-w-none mt-8 mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Beschrijving</h2>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        typeof product.description === 'string'
                          ? product.description
                          : JSON.stringify(product.description),
                    }}
                  />
                </div>
              )}

              {/* Specifications (New Grouped Format) */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6 mt-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Specificaties</h2>
                  <div className="space-y-6">
                    {product.specifications.map((specGroup, groupIndex) => (
                      <div key={groupIndex}>
                        <h3 className="font-semibold text-gray-800 mb-3">{specGroup.group}</h3>
                        <dl className="space-y-2">
                          {specGroup.attributes?.map((attr, attrIndex) => (
                            <div key={attrIndex} className="flex">
                              <dt className="text-gray-600 w-48">{attr.name}:</dt>
                              <dd className="text-gray-900 font-medium">
                                {attr.value}
                                {attr.unit && ` ${attr.unit}`}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Downloads */}
              {product.downloads && product.downloads.length > 0 && (
                <div className="bg-white rounded-lg border p-6 mt-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Downloads</h2>
                  <div className="space-y-2">
                    {product.downloads.map((download, index) => {
                      const downloadFile =
                        typeof download === 'object' && download !== null ? download : null
                      if (!downloadFile) return null

                      return (
                        <a
                          key={index}
                          href={downloadFile.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <Download className="w-5 h-5 text-teal-600 group-hover:text-teal-700" />
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium group-hover:text-teal-700">
                              {downloadFile.filename || 'Download'}
                            </p>
                            {downloadFile.filesize && (
                              <p className="text-sm text-gray-500">
                                {(downloadFile.filesize / 1024 / 1024).toFixed(2)} MB
                              </p>
                            )}
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
