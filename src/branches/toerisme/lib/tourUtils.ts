/**
 * Toerisme Utilities
 *
 * Hulpfuncties voor formattering en berekeningen
 * binnen de toerisme branch.
 */

/**
 * Formatteer een prijs in euro's (Nederlands formaat).
 *
 * @param cents - Prijs in centen
 * @returns Geformatteerde prijs string
 *
 * @example
 * formatPrice(129900) // => "€ 1.299,00"
 * formatPrice(0)      // => "€ 0,00"
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}

/**
 * Formatteer de reisduur in dagen en nachten.
 *
 * @param days - Aantal dagen
 * @param nights - Aantal nachten (optioneel)
 * @returns Geformatteerde duur string
 *
 * @example
 * formatDuration(8, 7)  // => "8 dagen / 7 nachten"
 * formatDuration(5)     // => "5 dagen"
 * formatDuration(1)     // => "1 dag"
 */
export function formatDuration(days: number, nights?: number): string {
  const dayLabel = days === 1 ? 'dag' : 'dagen'
  if (nights !== undefined && nights > 0) {
    const nightLabel = nights === 1 ? 'nacht' : 'nachten'
    return `${days} ${dayLabel} / ${nights} ${nightLabel}`
  }
  return `${days} ${dayLabel}`
}

/**
 * Formatteer een continent code naar een leesbare naam.
 *
 * @param code - Continent code
 * @returns Nederlandse continent naam
 *
 * @example
 * formatContinent('europa')  // => "Europa"
 * formatContinent('azie')    // => "Azië"
 */
export function formatContinent(code: string): string {
  const continents: Record<string, string> = {
    europa: 'Europa',
    azie: 'Azië',
    afrika: 'Afrika',
    amerika: 'Amerika',
    oceanie: 'Oceanië',
  }
  return continents[code] || code
}

/**
 * Formatteer beschikbaarheidsstatus.
 *
 * @param status - Beschikbaarheidsstatus
 * @returns Object met label en kleur
 *
 * @example
 * formatAvailability('beschikbaar') // => { label: "Beschikbaar", color: "green" }
 * formatAvailability('beperkt')     // => { label: "Beperkt beschikbaar", color: "amber" }
 */
export function formatAvailability(status: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    beschikbaar: { label: 'Beschikbaar', color: 'green' },
    beperkt: { label: 'Beperkt beschikbaar', color: 'amber' },
    uitverkocht: { label: 'Uitverkocht', color: 'red' },
  }
  return map[status] || { label: status, color: 'gray' }
}

/**
 * Formatteer maaltijdplan.
 *
 * @param plan - Maaltijdplan code
 * @returns Nederlandse beschrijving
 *
 * @example
 * formatMealPlan('halfpension')   // => "Halfpension"
 * formatMealPlan('allinclusive')  // => "All-inclusive"
 */
export function formatMealPlan(plan: string): string {
  const plans: Record<string, string> = {
    logies: 'Logies',
    ontbijt: 'Logies & Ontbijt',
    halfpension: 'Halfpension',
    volpension: 'Volpension',
    allinclusive: 'All-inclusive',
  }
  return plans[plan] || plan
}

/**
 * Bereken de totaalprijs voor een reis.
 *
 * @param pricePerPerson - Prijs per persoon (in centen)
 * @param travelers - Aantal reizigers
 * @param singleSupplement - Toeslag eenpersoons (in centen, optioneel)
 * @param insurance - Verzekeringsprijs (in centen, optioneel)
 * @returns Totaalprijs in centen
 *
 * @example
 * calculateTotalPrice(129900, 2)           // => 259800
 * calculateTotalPrice(129900, 1, 25000)    // => 154900
 */
export function calculateTotalPrice(
  pricePerPerson: number,
  travelers: number,
  singleSupplement?: number,
  insurance?: number,
): number {
  let total = pricePerPerson * travelers
  if (singleSupplement && travelers === 1) {
    total += singleSupplement
  }
  if (insurance) {
    total += insurance * travelers
  }
  return total
}

/**
 * Formatteer een sterrenbeoordeling als visuele string.
 *
 * @param stars - Aantal sterren (1-5)
 * @returns String met gevulde en lege sterren
 *
 * @example
 * formatStars(4) // => "★★★★☆"
 * formatStars(5) // => "★★★★★"
 * formatStars(0) // => "☆☆☆☆☆"
 */
export function formatStars(stars: number): string {
  const filled = Math.min(Math.max(Math.round(stars), 0), 5)
  const empty = 5 - filled
  return '★'.repeat(filled) + '☆'.repeat(empty)
}
