import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export default async function PortfolioPage() {
  const payload = await getPayload({ config })

  const stylistsResult = await payload.find({
    collection: 'stylists',
    where: {
      _status: {
        equals: 'published',
      },
    },
    limit: 20,
  })

  const stylists = stylistsResult.docs

  // Collect all portfolio images from stylists
  const portfolioItems: any[] = []
  stylists.forEach((stylist: any) => {
    if (stylist.portfolio && stylist.portfolio.length > 0) {
      stylist.portfolio.forEach((item: any) => {
        portfolioItems.push({
          ...item,
          stylistName: stylist.name,
        })
      })
    }
  })

  return (
    <div className="min-h-screen bg-theme-background">
      {/* Page Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-theme-secondary to-theme-secondary-light py-11 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,137,123,0.06),transparent_70%)]"></div>
        <div className="relative z-10">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-theme-primary/20 bg-theme-primary/10 px-3 py-1 text-[11px] font-bold text-theme-primary-light">
            📸 Portfolio
          </div>
          <h1 className="mb-1 font-['Plus_Jakarta_Sans'] text-4xl font-extrabold text-white">
            Ons Werk
          </h1>
          <p className="mx-auto max-w-lg text-sm text-white/30">
            Laat je inspireren door onze creaties. Van klassiek tot trendy, we maken elke look werkelijkheid.
          </p>
        </div>
      </section>

      {/* Portfolio grid */}
      <div className="container mx-auto px-6 py-8">
        {portfolioItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-6">
            {portfolioItems.slice(0, 24).map((item: any, index: number) => (
              <div
                key={index}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl transition hover:scale-105"
              >
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-theme-primary/10 to-theme-primary/5 text-4xl">
                  ✨
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-theme-secondary/50 opacity-0 transition group-hover:opacity-100">
                  <span className="text-2xl text-white">❤️</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-6">
            {[...Array(24)].map((_, index) => (
              <div
                key={index}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl transition hover:scale-105"
              >
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-theme-primary/10 to-theme-primary/5 text-4xl">
                  {['💇‍♀️', '💅', '✨', '💄', '🎨', '💆'][index % 6]}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-theme-secondary/50 opacity-0 transition group-hover:opacity-100">
                  <span className="text-2xl text-white">❤️</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instagram CTA */}
        <div className="mt-8 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 text-sm font-bold text-theme-secondary">
            <span className="text-2xl">📸</span>
            Volg ons op Instagram voor dagelijkse inspiratie
          </div>
          <div>
            <a
              href="https://instagram.com/studiobloom"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-theme-primary px-6 py-3 font-['Plus_Jakarta_Sans'] text-sm font-extrabold text-white shadow-lg shadow-theme-primary/30 transition hover:bg-theme-secondary"
            >
              📷 @studiobloom
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
