/**
 * Vehicle Utilities for Automotive Branch
 */

/**
 * Format a vehicle price in Dutch format
 *
 * @param price - The main price in euros
 * @param salePrice - Optional sale/action price
 * @param priceType - Price type label (btw-marge, btw-auto, ex-btw)
 * @returns Formatted price string, e.g. "€ 24.950" or "€ 22.500 ~~€ 24.950~~"
 */
export function formatPrice(price: number, salePrice?: number, priceType?: string): string {
  const formatter = new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  const formattedPrice = formatter.format(price)

  if (salePrice && salePrice < price) {
    const formattedSale = formatter.format(salePrice)
    return `${formattedSale} ~~${formattedPrice}~~`
  }

  return formattedPrice
}

/**
 * Format mileage in Dutch format
 *
 * @param km - Kilometers
 * @returns Formatted mileage, e.g. "45.000 km"
 */
export function formatMileage(km: number): string {
  return `${new Intl.NumberFormat('nl-NL').format(km)} km`
}

/**
 * Format fuel type to Dutch label
 */
const FUEL_TYPE_LABELS: Record<string, string> = {
  benzine: 'Benzine',
  diesel: 'Diesel',
  elektrisch: 'Elektrisch',
  'hybride-benzine': 'Hybride (benzine)',
  'hybride-diesel': 'Hybride (diesel)',
  lpg: 'LPG',
}

export function formatFuelType(type: string): string {
  return FUEL_TYPE_LABELS[type] || type
}

/**
 * Format transmission type to Dutch label
 */
const TRANSMISSION_LABELS: Record<string, string> = {
  handgeschakeld: 'Handgeschakeld',
  automaat: 'Automaat',
}

export function formatTransmission(type: string): string {
  return TRANSMISSION_LABELS[type] || type
}

/**
 * Format body type to Dutch label
 */
const BODY_TYPE_LABELS: Record<string, string> = {
  sedan: 'Sedan',
  hatchback: 'Hatchback',
  suv: 'SUV',
  stationwagon: 'Stationwagon',
  cabrio: 'Cabrio',
  coupe: 'Coup\u00e9',
  bus: 'Bus',
  bestel: 'Bestel',
}

export function formatBodyType(type: string): string {
  return BODY_TYPE_LABELS[type] || type
}

/**
 * Calculate monthly annuity payment
 *
 * @param price - Vehicle price in euros
 * @param downPayment - Down payment (aanbetaling) in euros
 * @param months - Loan duration in months
 * @param interestRate - Annual interest rate as percentage (e.g. 4.9 for 4.9%)
 * @returns Monthly payment in euros
 */
export function calculateMonthlyPayment(
  price: number,
  downPayment: number = 0,
  months: number = 60,
  interestRate: number = 4.9,
): number {
  const principal = price - downPayment
  if (principal <= 0) return 0
  if (interestRate === 0) return principal / months

  const monthlyRate = interestRate / 100 / 12
  const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)

  return Math.round(payment * 100) / 100
}

/**
 * Format APK status based on expiry date
 *
 * @param apkExpiry - APK expiry date string (ISO format)
 * @returns Status string: "Geldig tot ...", "Bijna verlopen", or "Verlopen"
 */
export function formatApkStatus(apkExpiry: string | Date | null | undefined): string {
  if (!apkExpiry) return 'Onbekend'

  const expiry = new Date(apkExpiry)
  const now = new Date()
  const diffMs = expiry.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return 'Verlopen'
  }

  if (diffDays <= 30) {
    return 'Bijna verlopen'
  }

  const formatter = new Intl.DateTimeFormat('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return `Geldig tot ${formatter.format(expiry)}`
}

/**
 * Format a Dutch license plate with standard formatting
 *
 * Dutch license plates follow patterns like:
 * XX-XX-99, 99-XX-XX, XX-99-XX, etc.
 * This function inserts hyphens in the standard positions.
 *
 * @param plate - Raw license plate string (with or without hyphens)
 * @returns Formatted license plate, e.g. "AB-123-C" or "XX-XXX-X"
 */
export function formatLicensePlate(plate: string | null | undefined): string {
  if (!plate) return ''

  // Remove all non-alphanumeric characters and uppercase
  const clean = plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase()

  if (clean.length !== 6) return clean

  // Common Dutch plate patterns (sidecodes)
  // Try to detect and format based on character types
  const chars = clean.split('').map((c) => (/[0-9]/.test(c) ? '9' : 'X'))
  const pattern = chars.join('')

  // Known sidecodes — format as XX-99-XX, 99-XX-XX, XX-XX-99, etc.
  const knownPatterns: Record<string, string> = {
    'XX99XX': `${clean.slice(0, 2)}-${clean.slice(2, 4)}-${clean.slice(4, 6)}`,
    '99XXXX': `${clean.slice(0, 2)}-${clean.slice(2, 4)}-${clean.slice(4, 6)}`,
    'XXXX99': `${clean.slice(0, 2)}-${clean.slice(2, 4)}-${clean.slice(4, 6)}`,
    '99XX99': `${clean.slice(0, 2)}-${clean.slice(2, 4)}-${clean.slice(4, 6)}`,
    'X999XX': `${clean.slice(0, 1)}-${clean.slice(1, 4)}-${clean.slice(4, 6)}`,
    'XX999X': `${clean.slice(0, 2)}-${clean.slice(2, 5)}-${clean.slice(5, 6)}`,
    'X99XXX': `${clean.slice(0, 1)}-${clean.slice(1, 3)}-${clean.slice(3, 6)}`,
    'XXX99X': `${clean.slice(0, 3)}-${clean.slice(3, 5)}-${clean.slice(5, 6)}`,
  }

  // Use known pattern or fallback to XX-XXX-X (sidecode 9+)
  return knownPatterns[pattern] || `${clean.slice(0, 2)}-${clean.slice(2, 5)}-${clean.slice(5, 6)}`
}
