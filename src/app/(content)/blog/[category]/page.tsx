import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { BlogPost, BlogCategory } from '@/payload-types'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: categorySlug } = await params
  const payload = await getPayload({ config })

  const { docs: categories } = await payload.find({
    collection: 'blog-categories',
    where: {
      slug: { equals: categorySlug },
    },
    limit: 1,
  })

  const category = categories[0]

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.name} | Kennisbank`,
    description: category.description || `Alle artikelen in categorie ${category.name}`,
  }
}

export default async function CategoryArchivePage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: Promise<{ sort?: string; page?: string }>
}) {
  const { category: categorySlug } = await params
  const queryParams = await searchParams
  const payload = await getPayload({ config })

  // Fetch the category
  const { docs: categories } = await payload.find({
    collection: 'blog-categories',
    where: {
      slug: { equals: categorySlug },
    },
    depth: 1,
    limit: 1,
  })

  const category = categories[0] as BlogCategory

  if (!category) {
    notFound()
  }

  // Fetch all categories for filter chips
  const { docs: allCategories } = await payload.find({
    collection: 'blog-categories',
    depth: 0,
    limit: 100,
    sort: 'displayOrder',
  })

  // Build query
  const page = parseInt(queryParams.page || '1')
  const limit = 12
  const sort =
    queryParams.sort === 'popular'
      ? '-viewCount'
      : queryParams.sort === 'alphabetical'
        ? 'title'
        : '-publishedAt'

  const where: any = {
    status: { equals: 'published' },
    categories: { contains: category.id },
  }

  // Fetch posts in this category
  const { docs: posts, totalDocs, totalPages } = await payload.find({
    collection: 'blog-posts',
    where,
    depth: 2,
    limit,
    page,
    sort,
  })

  // Get featured post (only on first page)
  let featuredPost: any = null
  if (page === 1) {
    const { docs: featured } = await payload.find({
      collection: 'blog-posts',
      where: {
        status: { equals: 'published' },
        categories: { contains: category.id },
        featured: { equals: true },
      },
      depth: 2,
      limit: 1,
      sort: '-publishedAt',
    })
    featuredPost = featured[0]
  }

  // Get category color gradient
  const getColorGradient = (color?: string) => {
    switch (color) {
      case 'blue':
        return 'from-blue-600 to-blue-800'
      case 'green':
        return 'from-green-600 to-green-800'
      case 'coral':
        return 'from-red-600 to-red-800'
      case 'amber':
        return 'from-amber-600 to-amber-800'
      case 'purple':
        return 'from-purple-600 to-purple-800'
      case 'pink':
        return 'from-pink-600 to-pink-800'
      default:
        return 'from-teal-600 to-teal-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/blog/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar alle artikelen
          </Link>
        </div>

        {/* Hero Section */}
        <div
          className={`bg-gradient-to-br ${getColorGradient(category.color)} rounded-3xl p-12 mb-8 relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 px-4 py-2 rounded-full text-sm font-bold text-white mb-4">
              📂 Categorie
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-lg text-white/80 max-w-2xl">{category.description}</p>
            )}
            <div className="mt-4 text-sm text-white/60">
              {totalDocs} {totalDocs === 1 ? 'artikel' : 'artikelen'}
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-2 flex-wrap mb-8">
          <Link
            href="/blog/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 bg-white text-gray-700 border-gray-200 hover:border-teal-500 transition-all"
          >
            Alles
          </Link>
          {allCategories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/blog/${cat.slug}`}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                cat.id === category.id
                  ? 'bg-teal-500 text-white border-teal-500'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-teal-500'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Featured Article (only on page 1) */}
        {featuredPost && (
          <Link
            href={`/blog/${categorySlug}/${featuredPost.slug}`}
            className="block bg-white border border-gray-200 rounded-2xl overflow-hidden mb-8 hover:shadow-xl transition-all"
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 h-64 md:h-auto flex items-center justify-center text-6xl">
                {featuredPost.featuredImageEmoji || '📰'}
              </div>
              <div className="p-8">
                <div className="inline-flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
                  ⭐ Uitgelicht
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">
                  {category.name}
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{new Date(featuredPost.publishedAt).toLocaleDateString('nl-NL')}</span>
                  {featuredPost.readingTime && <span>{featuredPost.readingTime} min leestijd</span>}
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Sort Dropdown */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900">Alle artikelen</h2>
          <select
            className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-semibold bg-white"
            defaultValue={sort}
          >
            <option value="-publishedAt">Nieuwste eerst</option>
            <option value="-viewCount">Meest gelezen</option>
            <option value="title">A-Z</option>
          </select>
        </div>

        {/* Articles Grid */}
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map((post: any) => {
              const postCategory = post.categories?.[0]

              return (
                <Link
                  key={post.id}
                  href={`/blog/${categorySlug}/${post.slug}`}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div
                    className={`h-48 flex items-center justify-center text-5xl bg-gradient-to-br ${
                      category.color === 'blue'
                        ? 'from-blue-50 to-blue-100'
                        : category.color === 'green'
                          ? 'from-green-50 to-green-100'
                          : category.color === 'coral'
                            ? 'from-red-50 to-red-100'
                            : category.color === 'amber'
                              ? 'from-amber-50 to-amber-100'
                              : category.color === 'purple'
                                ? 'from-purple-50 to-purple-100'
                                : 'from-teal-50 to-teal-100'
                    }`}
                  >
                    {post.featuredImageEmoji || '📄'}
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">
                      {category.name}
                    </div>
                    <h3 className="text-lg font-extrabold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>
                          {new Date(post.publishedAt).toLocaleDateString('nl-NL', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                        {post.readingTime && <span>{post.readingTime} min</span>}
                      </div>
                      <span className="text-sm font-bold text-teal-600 group-hover:gap-2 flex items-center gap-1 transition-all">
                        Lees →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Nog geen artikelen</h3>
            <p className="text-gray-600">Er zijn nog geen artikelen in deze categorie.</p>
            <Link
              href="/blog/"
              className="inline-block mt-6 px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors"
            >
              Bekijk alle artikelen
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Link
                key={pageNum}
                href={`/blog/${categorySlug}?page=${pageNum}`}
                className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-semibold text-sm transition-all ${
                  pageNum === page
                    ? 'bg-teal-500 text-white border-teal-500'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-teal-500'
                }`}
              >
                {pageNum}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
