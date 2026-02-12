import { NextRequest, NextResponse } from 'next/server'
import { sendProgress } from '@/app/api/ai/stream/[connectionId]/route'
import { WizardState } from '@/lib/siteGenerator/types'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes

interface GenerateSiteRequest {
  wizardData: WizardState
  sseConnectionId: string
}

async function generateSite(wizardData: WizardState, sseConnectionId: string) {
  try {
    const payload = await getPayload({ config })

    // Step 1: Analyze company context (10%)
    await sendProgress(sseConnectionId, {
      type: 'progress',
      progress: 10,
      message: 'Bedrijfscontext analyseren...',
    })

    // Step 2: Generate Home page (20-40%)
    await sendProgress(sseConnectionId, {
      type: 'progress',
      progress: 20,
      message: 'Home pagina genereren...',
    })

    // Create unique slug with timestamp to avoid conflicts
    const timestamp = Date.now()
    const homePageData = {
      title: `${wizardData.companyInfo.name} - Home`,
      slug: `home-${timestamp}`,
      meta: {
        title: `${wizardData.companyInfo.name} | ${wizardData.companyInfo.industry}`,
        description: wizardData.companyInfo.targetAudience || `Welkom bij ${wizardData.companyInfo.name}`,
      },
      layout: [
        // Hero section using Content block
        {
          blockType: 'content',
          columns: [
            {
              size: 'full',
              richText: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'heading',
                      tag: 'h1',
                      children: [
                        { type: 'text', text: `Welkom bij ${wizardData.companyInfo.name}` },
                      ],
                    },
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          text:
                            wizardData.companyInfo.targetAudience ||
                            `Uw partner in ${wizardData.companyInfo.industry}`,
                        },
                      ],
                    },
                  ],
                },
              },
              enableLink: true,
              link: {
                type: 'custom',
                url: '/contact',
                label: 'Neem contact op',
              },
            },
          ],
        },
        // Core values section
        ...(wizardData.companyInfo.coreValues.length > 0
          ? [
              {
                blockType: 'content',
                columns: [
                  {
                    size: 'full',
                    richText: {
                      root: {
                        type: 'root',
                        children: [
                          {
                            type: 'heading',
                            tag: 'h2',
                            children: [{ type: 'text', text: 'Onze Kernwaarden' }],
                          },
                          {
                            type: 'list',
                            tag: 'ul',
                            children: wizardData.companyInfo.coreValues.map((value) => ({
                              type: 'listitem',
                              children: [{ type: 'text', text: value }],
                            })),
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            ]
          : []),
        // Simple banner for CTA
        {
          blockType: 'banner',
          style: 'info',
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text:
                        'Klaar om te starten? Neem vandaag nog contact met ons op en ontdek wat we voor u kunnen betekenen.',
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
      _status: 'published' as const,
    }

    const homePage = await payload.create({
      collection: 'pages',
      data: homePageData,
    })

    await sendProgress(sseConnectionId, {
      type: 'progress',
      progress: 40,
      message: 'Home pagina aangemaakt',
    })

    // Step 3: Generate other pages (40-60%)
    const createdPages = [homePage]
    let currentProgress = 40
    const progressPerPage = 20 / wizardData.content.pages.length

    for (const pageType of wizardData.content.pages) {
      if (pageType === 'home') continue // Skip home, already created

      currentProgress += progressPerPage
      await sendProgress(sseConnectionId, {
        type: 'progress',
        progress: Math.round(currentProgress),
        message: `${pageType} pagina genereren...`,
      })

      let pageData: any = {
        title: pageType.charAt(0).toUpperCase() + pageType.slice(1),
        slug: `${pageType}-${timestamp}`,
        meta: {
          title: `${pageType.charAt(0).toUpperCase() + pageType.slice(1)} | ${wizardData.companyInfo.name}`,
          description: `Ontdek meer over ${pageType}`,
        },
        layout: [],
        _status: 'published' as const,
      }

      // Customize based on page type
      switch (pageType) {
        case 'about':
          pageData.layout = [
            {
              blockType: 'content',
              columns: [
                {
                  size: 'full',
                  richText: {
                    root: {
                      type: 'root',
                      children: [
                        {
                          type: 'heading',
                          tag: 'h1',
                          children: [{ type: 'text', text: `Over ${wizardData.companyInfo.name}` }],
                        },
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              text: `${wizardData.companyInfo.name} is actief in de ${wizardData.companyInfo.industry} sector en richt zich op ${wizardData.companyInfo.businessType} klanten.`,
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          ]
          break

        case 'services':
          if (wizardData.companyInfo.services && wizardData.companyInfo.services.length > 0) {
            pageData.layout = [
              {
                blockType: 'content',
                columns: [
                  {
                    size: 'full',
                    richText: {
                      root: {
                        type: 'root',
                        children: [
                          {
                            type: 'heading',
                            tag: 'h1',
                            children: [{ type: 'text', text: 'Onze Diensten' }],
                          },
                          ...wizardData.companyInfo.services.flatMap((service) => [
                            {
                              type: 'heading',
                              tag: 'h3',
                              children: [{ type: 'text', text: service.name }],
                            },
                            {
                              type: 'paragraph',
                              children: [{ type: 'text', text: service.description }],
                            },
                          ]),
                        ],
                      },
                    },
                  },
                ],
              },
            ]
          }
          break

        case 'contact':
          pageData.layout = [
            {
              blockType: 'content',
              columns: [
                {
                  size: 'full',
                  richText: {
                    root: {
                      type: 'root',
                      children: [
                        {
                          type: 'heading',
                          tag: 'h1',
                          children: [{ type: 'text', text: 'Neem Contact Op' }],
                        },
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              text: 'Heeft u vragen? Neem gerust contact met ons op!',
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
            },
            ...(wizardData.features.contactForm
              ? [
                  {
                    blockType: 'form',
                    form: 'contact-form',
                  },
                ]
              : []),
          ]
          break

        default:
          pageData.layout = [
            {
              blockType: 'content',
              columns: [
                {
                  size: 'full',
                  richText: {
                    root: {
                      type: 'root',
                      children: [
                        {
                          type: 'heading',
                          tag: 'h1',
                          children: [
                            {
                              type: 'text',
                              text: pageType.charAt(0).toUpperCase() + pageType.slice(1),
                            },
                          ],
                        },
                        {
                          type: 'paragraph',
                          children: [
                            { type: 'text', text: `Welkom op de ${pageType} pagina.` },
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          ]
      }

      const page = await payload.create({
        collection: 'pages',
        data: pageData,
      })

      createdPages.push(page)
    }

    // Step 4: Finalize (90-100%)
    await sendProgress(sseConnectionId, {
      type: 'progress',
      progress: 90,
      message: 'Laatste details afwerken...',
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    await sendProgress(sseConnectionId, {
      type: 'progress',
      progress: 100,
      message: 'Website succesvol gegenereerd!',
    })

    // Send completion
    await sendProgress(sseConnectionId, {
      type: 'complete',
      data: {
        previewUrl: `/${homePage.slug}`,
        pages: createdPages.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
        })),
      },
    })
  } catch (error: any) {
    console.error('Site generation error:', error)
    await sendProgress(sseConnectionId, {
      type: 'error',
      error: error.message || 'Er is een fout opgetreden tijdens het genereren van de website',
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateSiteRequest = await request.json()
    const { wizardData, sseConnectionId } = body

    // Validate input
    if (!wizardData || !sseConnectionId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Generate unique job ID
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(7)}`

    // Start generation in background (non-blocking)
    generateSite(wizardData, sseConnectionId).catch((error) => {
      console.error('Background site generation failed:', error)
    })

    // Return immediately with job ID
    return NextResponse.json({
      success: true,
      jobId,
      message: 'Site generation started',
    })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 },
    )
  }
}
