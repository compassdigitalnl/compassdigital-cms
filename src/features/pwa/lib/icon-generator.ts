/**
 * PWA Icon Generator
 *
 * Uses `sharp` to resize an uploaded logo/favicon to standard PWA icon sizes.
 * For maskable icons, adds 20% padding with the brand background color.
 */

import sharp from 'sharp'
import type { IconPurpose } from './types'
import { PWA_ICON_SIZES, DEFAULT_THEME_COLOR } from './types'

/** All standard PWA icon sizes */
export { PWA_ICON_SIZES }

/**
 * Resize a source image buffer to the given size for PWA icon use.
 *
 * @param sourceBuffer - The original image as a Buffer (PNG, JPEG, SVG, etc.)
 * @param size - Target width/height in pixels (icons are always square)
 * @param purpose - 'any' for regular icon, 'maskable' for safe-zone icon
 * @param backgroundColor - Background color for maskable padding (hex)
 * @returns Resized PNG buffer
 */
export async function generateIcon(
  sourceBuffer: Buffer,
  size: number,
  purpose: IconPurpose = 'any',
  backgroundColor: string = DEFAULT_THEME_COLOR,
): Promise<Buffer> {
  if (purpose === 'maskable') {
    return generateMaskableIcon(sourceBuffer, size, backgroundColor)
  }

  return sharp(sourceBuffer)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()
}

/**
 * Generate a maskable icon with 20% safe-zone padding.
 *
 * Maskable icons require content within a "safe zone" that is 80% of the
 * total size (10% padding on each side). We resize the source to 80% of
 * the target, then composite it centered on a solid background.
 */
async function generateMaskableIcon(
  sourceBuffer: Buffer,
  size: number,
  backgroundColor: string,
): Promise<Buffer> {
  const innerSize = Math.round(size * 0.8)
  const padding = Math.round(size * 0.1)

  // Parse hex color to RGBA
  const bg = parseHexColor(backgroundColor)

  // Resize the source image to the inner (safe zone) size
  const resizedSource = await sharp(sourceBuffer)
    .resize(innerSize, innerSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()

  // Create solid background and composite the resized source centered
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg,
    },
  })
    .png()
    .composite([
      {
        input: resizedSource,
        top: padding,
        left: padding,
      },
    ])
    .png()
    .toBuffer()
}

/**
 * Generate a fallback icon: a colored square with the company initial letter.
 *
 * Used when no logo or favicon is uploaded in Settings.
 */
export async function generateFallbackIcon(
  initial: string,
  size: number,
  backgroundColor: string = DEFAULT_THEME_COLOR,
): Promise<Buffer> {
  const letter = initial.charAt(0).toUpperCase()
  const fontSize = Math.round(size * 0.5)

  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}" rx="${Math.round(size * 0.1)}"/>
      <text
        x="50%"
        y="50%"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${fontSize}"
        font-weight="bold"
        fill="white"
        text-anchor="middle"
        dominant-baseline="central"
      >${letter}</text>
    </svg>
  `.trim()

  return sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toBuffer()
}

/** Parse a hex color string to sharp-compatible RGBA object */
function parseHexColor(hex: string): { r: number; g: number; b: number; alpha: number } {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16) || 0
  const g = parseInt(clean.substring(2, 4), 16) || 0
  const b = parseInt(clean.substring(4, 6), 16) || 0
  return { r, g, b, alpha: 1 }
}
