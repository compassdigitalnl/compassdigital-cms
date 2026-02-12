import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Get parameters from URL
    const title = searchParams.get('title') || 'Welkom'
    const type = searchParams.get('type') || 'page' // page | blog | service | case
    const companyName = searchParams.get('companyName') || process.env.NEXT_PUBLIC_SITE_NAME || 'Website'
    const primaryColor = searchParams.get('primaryColor') || '#6366f1'
    const accentColor = searchParams.get('accentColor') || '#3B82F6'

    // Type labels for badges
    const typeLabels: Record<string, string> = {
      page: '',
      blog: 'Blog',
      service: 'Dienst',
      case: 'Case Study',
      portfolio: 'Portfolio',
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 80px',
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${adjustColor(primaryColor, 30)} 100%)`,
            color: 'white',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Type badge (if applicable) */}
          {typeLabels[type] && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  background: accentColor,
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: '18px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {typeLabels[type]}
              </div>
            </div>
          )}

          {/* Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <h1
              style={{
                fontSize: title.length > 40 ? '52px' : '68px',
                fontWeight: 800,
                lineHeight: 1.1,
                margin: 0,
                maxWidth: '900px',
                textShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            >
              {title}
            </h1>
          </div>

          {/* Footer with company name and domain */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '2px solid rgba(255,255,255,0.2)',
              paddingTop: '24px',
            }}
          >
            <div
              style={{
                fontSize: '26px',
                fontWeight: 600,
              }}
            >
              {companyName}
            </div>
            <div
              style={{
                fontSize: '18px',
                opacity: 0.7,
              }}
            >
              {new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://example.com').hostname}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.error('OG Image generation error:', e)
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    })
  }
}

// Helper: make color lighter/darker
function adjustColor(hex: string, amount: number): string {
  // Remove # if present
  const cleanHex = hex.replace('#', '')

  // Parse hex to RGB
  const num = parseInt(cleanHex, 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount))
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount))

  // Convert back to hex
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}
