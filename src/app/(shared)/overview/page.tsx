import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Site Overview | All Pages & APIs',
  description: 'Complete overview of all available pages, admin panels, and API endpoints',
}

export default function OverviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-grey-light to-white">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-teal"
              aria-hidden="true"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-navy mb-4">Site Overview</h1>
          <p className="text-xl text-grey-dark max-w-3xl mx-auto">
            Complete overzicht van alle beschikbare pagina's, admin panels en API endpoints
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
            <span className="inline-block w-2 h-2 bg-green rounded-full animate-pulse"></span>
            Server draait op <strong>http://localhost:3015</strong>
          </div>
        </div>

        <div className="space-y-8">
          {/* Frontend Pages */}
          <div className="bg-white border-2 border-teal-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-teal-100 text-teal rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <path d="M3 9h18"></path>
                  <path d="M9 21V9"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-navy mb-1">
                  🏠 Frontend Pagina's (Public)
                </h2>
                <p className="text-grey-dark">Publiek toegankelijke pagina's</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a
                href="/"
                className="bg-teal-50 border-2 border-teal-200 hover:border-teal-300 rounded-xl p-4 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy group-hover:text-grey-dark">
                      Homepage
                    </h3>
                    <p className="text-sm text-grey-dark">/</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-grey-mid group-hover:text-grey-dark transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </a>
              <a
                href="/setup/"
                className="bg-teal-50 border-2 border-teal-200 hover:border-teal-300 rounded-xl p-4 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy group-hover:text-grey-dark">
                      Setup Guide
                    </h3>
                    <p className="text-sm text-grey-dark">/setup</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-grey-mid group-hover:text-grey-dark transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </a>
              <a
                href="/docs/"
                className="bg-teal-50 border-2 border-teal-200 hover:border-teal-300 rounded-xl p-4 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy group-hover:text-grey-dark">
                      Documentation
                    </h3>
                    <p className="text-sm text-grey-dark">/docs</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-grey-mid group-hover:text-grey-dark transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </a>
              <a
                href="/site-generator/"
                className="bg-teal-50 border-2 border-teal-200 hover:border-teal-300 rounded-xl p-4 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy group-hover:text-grey-dark">
                      AI Site Generator
                    </h3>
                    <p className="text-sm text-grey-dark">/site-generator</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-grey-mid group-hover:text-grey-dark transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </a>
              <a
                href="/ai-playground/"
                className="bg-teal-50 border-2 border-teal-200 hover:border-teal-300 rounded-xl p-4 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy group-hover:text-grey-dark">
                      AI Playground
                    </h3>
                    <p className="text-sm text-grey-dark">/ai-playground</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-grey-mid group-hover:text-grey-dark transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* Admin & CMS */}
          <div className="bg-white border-2 border-teal-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-teal-100 text-teal rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-navy mb-1">🔧 Admin & CMS</h2>
                <p className="text-grey-dark">Content beheer systeem</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a
                href="/admin/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal-50 border-2 border-teal-200 hover:border-teal-300 rounded-xl p-4 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy group-hover:text-grey-dark">
                      CMS Dashboard
                    </h3>
                    <p className="text-sm text-grey-dark">/admin</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-grey-mid group-hover:text-grey-dark transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" x2="21" y1="14" y2="3"></line>
                  </svg>
                </div>
              </a>
              <a
                href="/admin/collections/pages/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal-50 border-2 border-teal-200 hover:border-teal-300 rounded-xl p-4 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy group-hover:text-grey-dark">
                      Pages Collection
                    </h3>
                    <p className="text-sm text-grey-dark">/admin/collections/pages</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-grey-mid group-hover:text-grey-dark transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" x2="21" y1="14" y2="3"></line>
                  </svg>
                </div>
              </a>
              <a
                href="/admin/collections/blog-posts/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal-50 border-2 border-teal-200 hover:border-teal-300 rounded-xl p-4 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy group-hover:text-grey-dark">
                      Blog Posts
                    </h3>
                    <p className="text-sm text-grey-dark">/admin/collections/blog-posts</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-grey-mid group-hover:text-grey-dark transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" x2="21" y1="14" y2="3"></line>
                  </svg>
                </div>
              </a>
              <a
                href="/admin/collections/users/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal-50 border-2 border-teal-200 hover:border-teal-300 rounded-xl p-4 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy group-hover:text-grey-dark">
                      Users
                    </h3>
                    <p className="text-sm text-grey-dark">/admin/collections/users</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-grey-mid group-hover:text-grey-dark transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" x2="21" y1="14" y2="3"></line>
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* API Endpoints */}
          <div className="bg-white border-2 border-green-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 text-green rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-navy mb-1">🔌 API Endpoints</h2>
                <p className="text-grey-dark">REST & GraphQL APIs</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a
                href="/api/health/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-50 border-2 border-green-200 hover:border-green-300 rounded-xl p-4 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy group-hover:text-grey-dark">
                      Health Check
                    </h3>
                    <p className="text-sm text-grey-dark font-mono">/api/health</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-grey-mid group-hover:text-grey-dark transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" x2="21" y1="14" y2="3"></line>
                  </svg>
                </div>
              </a>
              <a
                href="/api/og?title=Test&description=Dit%20is%20een%20test"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-50 border-2 border-green-200 hover:border-green-300 rounded-xl p-4 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy group-hover:text-grey-dark">
                      OG Image Generator
                    </h3>
                    <p className="text-sm text-grey-dark font-mono">/api/og</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-grey-mid group-hover:text-grey-dark transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" x2="21" y1="14" y2="3"></line>
                  </svg>
                </div>
              </a>
              <a
                href="/api/graphql-playground/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-50 border-2 border-green-200 hover:border-green-300 rounded-xl p-4 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy group-hover:text-grey-dark">
                      GraphQL Playground
                    </h3>
                    <p className="text-sm text-grey-dark font-mono">/api/graphql-playground</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-grey-mid group-hover:text-grey-dark transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" x2="21" y1="14" y2="3"></line>
                  </svg>
                </div>
              </a>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-50 border-2 border-green-200 hover:border-green-300 rounded-xl p-4 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy group-hover:text-grey-dark">
                      XML Sitemap
                    </h3>
                    <p className="text-sm text-grey-dark font-mono">/sitemap.xml</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-grey-mid group-hover:text-grey-dark transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" x2="21" y1="14" y2="3"></line>
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* Account Pages */}
          <div className="bg-white border-2 border-amber-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-navy mb-1">
                  👤 Account & Authenticatie
                </h2>
                <p className="text-grey-dark">Login en account beheer</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a
                href="/inloggen/"
                className="bg-amber-50 border-2 border-amber-200 hover:border-amber-300 rounded-xl p-4 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy group-hover:text-grey-dark">
                      Login
                    </h3>
                    <p className="text-sm text-grey-dark">/inloggen</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-grey-mid group-hover:text-grey-dark transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </a>
              <a
                href="/create-account/"
                className="bg-amber-50 border-2 border-amber-200 hover:border-amber-300 rounded-xl p-4 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy group-hover:text-grey-dark">
                      Account Aanmaken
                    </h3>
                    <p className="text-sm text-grey-dark">/create-account</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-grey-mid group-hover:text-grey-dark transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </a>
              <a
                href="/forgot-password/"
                className="bg-amber-50 border-2 border-amber-200 hover:border-amber-300 rounded-xl p-4 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy group-hover:text-grey-dark">
                      Wachtwoord Vergeten
                    </h3>
                    <p className="text-sm text-grey-dark">/forgot-password</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-grey-mid group-hover:text-grey-dark transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </a>
              <a
                href="/logout/"
                className="bg-amber-50 border-2 border-amber-200 hover:border-amber-300 rounded-xl p-4 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy group-hover:text-grey-dark">
                      Logout
                    </h3>
                    <p className="text-sm text-grey-dark">/logout</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-grey-mid group-hover:text-grey-dark transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* PM2 Management */}
          <div className="bg-gradient-to-r from-teal-50 to-teal-50 border-2 border-teal-200 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-teal-100 text-teal rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <path d="M9 3v18"></path>
                  <path d="m16 15-3-3 3-3"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-navy mb-1">⚡ PM2 Commando's</h2>
                <p className="text-grey-dark">Server management via terminal</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-4 border border-teal-200">
                <code className="text-sm text-teal-700 font-mono">npm run pm2:status</code>
                <p className="text-xs text-grey-dark mt-1">Bekijk server status</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-teal-200">
                <code className="text-sm text-teal-700 font-mono">npm run pm2:restart</code>
                <p className="text-xs text-grey-dark mt-1">Herstart de server</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-teal-200">
                <code className="text-sm text-teal-700 font-mono">npm run pm2:logs</code>
                <p className="text-xs text-grey-dark mt-1">Bekijk live logs</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-teal-200">
                <code className="text-sm text-teal-700 font-mono">npm run pm2:stop</code>
                <p className="text-xs text-grey-dark mt-1">Stop de server</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-grey-mid">
          <p>
            💡 Tip: Gebruik <code className="bg-grey-light px-2 py-0.5 rounded">Cmd+Click</code> om
            links in een nieuw tabblad te openen
          </p>
        </div>
      </div>
    </div>
  )
}
