/**
 * PDF Processing Utility — Digital Library
 *
 * Provides utilities for working with PDF files:
 * - Page counting via pdf-lib
 * - Metadata extraction
 *
 * Note: Full server-side PDF-to-image rendering requires a headless browser
 * or canvas library (puppeteer, node-canvas). For the initial implementation,
 * page images are either:
 * 1. Uploaded manually per edition in the admin panel
 * 2. Rendered client-side in the flipbook viewer (PDF.js)
 * 3. Processed via a background job (future enhancement)
 */

import { PDFDocument } from 'pdf-lib'

export interface PdfInfo {
  pageCount: number
  title?: string
  author?: string
  subject?: string
  creator?: string
  creationDate?: Date
  modificationDate?: Date
}

/**
 * Count the number of pages in a PDF document.
 *
 * @param pdfBuffer - The PDF file as a Buffer or Uint8Array
 * @returns The number of pages
 */
export async function getPdfPageCount(
  pdfBuffer: Buffer | Uint8Array,
): Promise<number> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, {
    ignoreEncryption: true,
  })
  return pdfDoc.getPageCount()
}

/**
 * Extract metadata and page count from a PDF document.
 *
 * @param pdfBuffer - The PDF file as a Buffer or Uint8Array
 * @returns PdfInfo object with page count and metadata
 */
export async function getPdfInfo(
  pdfBuffer: Buffer | Uint8Array,
): Promise<PdfInfo> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, {
    ignoreEncryption: true,
  })

  return {
    pageCount: pdfDoc.getPageCount(),
    title: pdfDoc.getTitle() || undefined,
    author: pdfDoc.getAuthor() || undefined,
    subject: pdfDoc.getSubject() || undefined,
    creator: pdfDoc.getCreator() || undefined,
    creationDate: pdfDoc.getCreationDate() || undefined,
    modificationDate: pdfDoc.getModificationDate() || undefined,
  }
}

/**
 * Get the dimensions (width, height) of each page in a PDF.
 *
 * @param pdfBuffer - The PDF file as a Buffer or Uint8Array
 * @returns Array of { width, height } for each page
 */
export async function getPdfPageDimensions(
  pdfBuffer: Buffer | Uint8Array,
): Promise<Array<{ width: number; height: number }>> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, {
    ignoreEncryption: true,
  })

  const pages = pdfDoc.getPages()
  return pages.map((page) => ({
    width: Math.round(page.getWidth()),
    height: Math.round(page.getHeight()),
  }))
}

/**
 * Placeholder for future PDF-to-image extraction.
 *
 * Full implementation would use one of:
 * - puppeteer (headless Chrome) to render each page
 * - node-canvas + pdfjs-dist for server-side rendering
 * - An external service/API for PDF processing
 *
 * For now, the workflow is:
 * 1. Admin uploads PDF to the edition
 * 2. System counts pages and stores the count
 * 3. Admin uploads pre-rendered page images, OR
 * 4. Client-side viewer uses PDF.js to render pages directly
 *
 * @param _pdfBuffer - The PDF file
 * @param _options - Processing options
 * @returns Array of page image buffers (not yet implemented)
 */
export async function extractPageImages(
  _pdfBuffer: Buffer | Uint8Array,
  _options?: {
    format?: 'webp' | 'png' | 'jpeg'
    quality?: number
    maxWidth?: number
  },
): Promise<Buffer[]> {
  throw new Error(
    'PDF-to-image extraction is not yet implemented. ' +
      'Please upload pre-rendered page images manually, or use client-side PDF.js rendering.',
  )
}
