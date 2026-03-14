/**
 * Watermark Utility — Digital Library
 *
 * Adds a semi-transparent diagonal text watermark to page images
 * using Sharp. The watermark text is typically the user's email address
 * to discourage unauthorized sharing.
 */

import sharp from 'sharp'

interface WatermarkOptions {
  /** The text to overlay (typically user email) */
  text: string
  /** Font size in pixels (default: 48) */
  fontSize?: number
  /** Opacity 0-1 (default: 0.08) */
  opacity?: number
  /** Rotation in degrees (default: -30) */
  rotation?: number
  /** Text color in hex without # (default: '888888') */
  color?: string
}

/**
 * Add a semi-transparent diagonal text watermark to an image buffer.
 *
 * Creates an SVG overlay with repeated diagonal text and composites
 * it on top of the input image using Sharp.
 *
 * @param imageBuffer - The source image as a Buffer
 * @param options - Watermark configuration
 * @returns Promise<Buffer> - The watermarked image as a WebP buffer
 */
export async function addWatermark(
  imageBuffer: Buffer,
  options: WatermarkOptions,
): Promise<Buffer> {
  const {
    text,
    fontSize = 48,
    opacity = 0.08,
    rotation = -30,
    color = '888888',
  } = options

  // Get dimensions of the source image
  const metadata = await sharp(imageBuffer).metadata()
  const width = metadata.width || 800
  const height = metadata.height || 1200

  // Calculate how many text repetitions we need to cover the image
  // We need enough to cover the diagonal of the image
  const diagonal = Math.ceil(Math.sqrt(width * width + height * height))
  const textWidth = text.length * fontSize * 0.6 // rough estimate
  const lineHeight = fontSize * 3 // spacing between lines
  const repetitionsX = Math.ceil(diagonal / textWidth) + 1
  const repetitionsY = Math.ceil(diagonal / lineHeight) + 1

  // Build the repeating text lines
  const textLines: string[] = []
  for (let y = 0; y < repetitionsY; y++) {
    const yPos = y * lineHeight
    const singleLine = Array(repetitionsX)
      .fill(escapeXml(text))
      .join('    ')
    textLines.push(
      `<text x="0" y="${yPos}" font-family="sans-serif" font-size="${fontSize}" fill="#${color}">${singleLine}</text>`,
    )
  }

  // Create SVG overlay with rotation applied to the group
  const svgOverlay = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <g transform="translate(${width / 2}, ${height / 2}) rotate(${rotation}) translate(${-diagonal / 2}, ${-diagonal / 2})" opacity="${opacity}">
        ${textLines.join('\n        ')}
      </g>
    </svg>
  `)

  // Composite the watermark onto the original image
  const result = await sharp(imageBuffer)
    .composite([
      {
        input: svgOverlay,
        top: 0,
        left: 0,
      },
    ])
    .webp({ quality: 85 })
    .toBuffer()

  return result
}

/**
 * Escape special XML characters in text to prevent SVG injection.
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
