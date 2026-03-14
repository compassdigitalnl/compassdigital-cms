/**
 * Onderwijs Utilities
 *
 * Hulpfuncties voor formattering en berekeningen
 * binnen de onderwijs branch.
 */

/**
 * Formatteer een prijs in euro's (Nederlands cursus formaat).
 *
 * @param price - Prijs in euro's
 * @returns Geformatteerde prijs string
 *
 * @example
 * formatPrice(49.95)  // => "€ 49,95"
 * formatPrice(0)      // => "Gratis"
 * formatPrice(99.95)  // => "€ 99,95"
 */
export function formatPrice(price: number): string {
  if (price === 0) return 'Gratis'

  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

/**
 * Formatteer een duur in uren.
 *
 * @param hours - Aantal uren
 * @returns Geformatteerde duur string
 *
 * @example
 * formatDuration(12)  // => "12 uur"
 * formatDuration(1)   // => "1 uur"
 * formatDuration(0.5) // => "30 min"
 */
export function formatDuration(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`
  }
  return `${hours} uur`
}

/**
 * Formatteer een cursusniveau naar een leesbare Nederlandse naam.
 *
 * @param level - Niveau code
 * @returns Nederlandse niveaunaam
 *
 * @example
 * formatLevel('beginner')  // => "Beginner"
 * formatLevel('gevorderd') // => "Gevorderd"
 * formatLevel('expert')    // => "Expert"
 */
export function formatLevel(level: string): string {
  const levels: Record<string, string> = {
    beginner: 'Beginner',
    gevorderd: 'Gevorderd',
    expert: 'Expert',
  }
  return levels[level] || level
}

/**
 * Bereken het kortingspercentage.
 *
 * @param price - Huidige prijs
 * @param originalPrice - Originele prijs
 * @returns Kortingspercentage (afgerond)
 *
 * @example
 * calculateDiscount(49.95, 99.95) // => 50
 * calculateDiscount(79.95, 99.95) // => 20
 */
export function calculateDiscount(price: number, originalPrice: number): number {
  if (originalPrice <= 0 || price >= originalPrice) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

/**
 * Formatteer een lestype naar een icoon + Nederlandse label.
 *
 * @param type - Lestype code
 * @returns Object met icon naam en label
 *
 * @example
 * formatLessonType('video')      // => { icon: "play-circle", label: "Video" }
 * formatLessonType('reading')    // => { icon: "book-open", label: "Leesmateriaal" }
 * formatLessonType('quiz')       // => { icon: "help-circle", label: "Quiz" }
 * formatLessonType('assignment') // => { icon: "file-text", label: "Opdracht" }
 */
export function formatLessonType(type: string): { icon: string; label: string } {
  const types: Record<string, { icon: string; label: string }> = {
    video: { icon: 'play-circle', label: 'Video' },
    reading: { icon: 'book-open', label: 'Leesmateriaal' },
    quiz: { icon: 'help-circle', label: 'Quiz' },
    assignment: { icon: 'file-text', label: 'Opdracht' },
  }
  return types[type] || { icon: 'file', label: type }
}

/**
 * Genereer een uniek inschrijfnummer.
 *
 * @returns Inschrijfnummer in formaat "ENR-YYYY-XXXXX"
 *
 * @example
 * generateEnrollmentNumber() // => "ENR-2026-48291"
 */
export function generateEnrollmentNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(10000 + Math.random() * 90000)
  return `ENR-${year}-${random}`
}

/**
 * Formatteer een voortgangspercentage.
 *
 * @param progress - Voortgang (0-100)
 * @returns Geformatteerde voortgang string
 *
 * @example
 * formatProgress(45)  // => "45%"
 * formatProgress(100) // => "100%"
 * formatProgress(0)   // => "0%"
 */
export function formatProgress(progress: number): string {
  return `${Math.round(Math.min(100, Math.max(0, progress)))}%`
}

/**
 * Formatteer een beoordeling.
 *
 * @param rating - Beoordeling (0-5)
 * @returns Geformatteerde beoordeling string
 *
 * @example
 * formatRating(4.8)  // => "4.8"
 * formatRating(5.0)  // => "5.0"
 * formatRating(3.25) // => "3.3"
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1)
}
