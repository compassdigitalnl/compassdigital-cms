/* eslint-disable no-restricted-exports */
import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3015'

export default function robots(): MetadataRoute.Robots {
  return {
    host: baseUrl,
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',           // Payload CMS admin panel
          '/api/',             // API routes
          '/_next/',           // Next.js internals
          '/*/preview',        // Draft preview pages
        ],
      },
      // Block AI crawlers (optional - uncomment if desired)
      // {
      //   userAgent: 'GPTBot',  // OpenAI GPT crawler
      //   disallow: '/',
      // },
      // {
      //   userAgent: 'ChatGPT-User',
      //   disallow: '/',
      // },
      // {
      //   userAgent: 'CCBot',   // Common Crawl
      //   disallow: '/',
      // },
      // {
      //   userAgent: 'anthropic-ai',  // Claude crawler
      //   disallow: '/',
      // },
      // {
      //   userAgent: 'Google-Extended',  // Google AI training
      //   disallow: '/',
      // },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
