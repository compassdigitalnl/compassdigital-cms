/**
 * Vastgoed Utilities
 *
 * Hulpfuncties voor formattering en berekeningen
 * binnen de vastgoed branch.
 */

/**
 * Formatteer een prijs in euro's (Nederlands vastgoed formaat).
 *
 * @param price - Prijs in hele euro's
 * @param condition - Prijsconditie (k.k. of v.o.n.)
 * @returns Geformatteerde prijs string
 *
 * @example
 * formatPrice(485000)           // => "€ 485.000"
 * formatPrice(485000, 'k.k.')   // => "€ 485.000 k.k."
 * formatPrice(550000, 'v.o.n.') // => "€ 550.000 v.o.n."
 */
export function formatPrice(price: number, condition?: string): string {
  const formatted = new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)

  if (condition) {
    return `${formatted} ${condition}`
  }
  return formatted
}

/**
 * Formatteer een oppervlakte in vierkante meters.
 *
 * @param area - Oppervlakte in m²
 * @returns Geformatteerde oppervlakte string
 *
 * @example
 * formatArea(92)  // => "92 m²"
 * formatArea(150) // => "150 m²"
 */
export function formatArea(area: number): string {
  return `${area} m²`
}

/**
 * Formatteer een energielabel met bijbehorende kleur.
 *
 * @param label - Energielabel letter (A+++ t/m G)
 * @returns Object met label en kleur
 *
 * @example
 * formatEnergyLabel('A')   // => { label: "A", color: "green" }
 * formatEnergyLabel('C')   // => { label: "C", color: "yellow" }
 * formatEnergyLabel('F')   // => { label: "F", color: "red" }
 */
export function formatEnergyLabel(label: string): { label: string; color: string } {
  const colorMap: Record<string, string> = {
    'A+++': 'green',
    'A++': 'green',
    'A+': 'green',
    'A': 'green',
    'B': 'lime',
    'C': 'yellow',
    'D': 'orange',
    'E': 'red',
    'F': 'red',
    'G': 'red',
  }

  return {
    label,
    color: colorMap[label] || 'gray',
  }
}

/**
 * Bereken de prijs per vierkante meter.
 *
 * @param price - Vraagprijs in hele euro's
 * @param area - Woonoppervlakte in m²
 * @returns Prijs per m² (afgerond naar hele euro's)
 *
 * @example
 * calculatePricePerM2(485000, 92) // => 5272
 * calculatePricePerM2(350000, 75) // => 4667
 */
export function calculatePricePerM2(price: number, area: number): number {
  if (area <= 0) return 0
  return Math.round(price / area)
}

/**
 * Formatteer een woningtype naar een leesbare Nederlandse naam.
 *
 * @param type - Woningtype code
 * @returns Nederlandse woningtype naam
 *
 * @example
 * formatPropertyType('appartement')         // => "Appartement"
 * formatPropertyType('twee-onder-een-kap')  // => "Twee-onder-een-kap"
 * formatPropertyType('vrijstaand')          // => "Vrijstaande woning"
 */
export function formatPropertyType(type: string): string {
  const types: Record<string, string> = {
    appartement: 'Appartement',
    woonhuis: 'Woonhuis',
    villa: 'Villa',
    penthouse: 'Penthouse',
    tussenwoning: 'Tussenwoning',
    hoekwoning: 'Hoekwoning',
    'twee-onder-een-kap': 'Twee-onder-een-kap',
    vrijstaand: 'Vrijstaande woning',
  }
  return types[type] || type
}

/**
 * Formatteer een prijsconditie naar volledige tekst.
 *
 * @param condition - Prijsconditie code
 * @returns Volledige Nederlandse beschrijving
 *
 * @example
 * formatPriceCondition('k.k.')   // => "kosten koper"
 * formatPriceCondition('v.o.n.') // => "vrij op naam"
 */
export function formatPriceCondition(condition: string): string {
  const conditions: Record<string, string> = {
    'k.k.': 'kosten koper',
    'v.o.n.': 'vrij op naam',
  }
  return conditions[condition] || condition
}

/**
 * Bereken de maandelijkse hypotheeklasten (annuïteitenformule).
 *
 * @param principal - Hypotheekbedrag (hoofdsom)
 * @param annualRate - Jaarlijkse rente als percentage (bijv. 3.5 voor 3,5%)
 * @param years - Looptijd in jaren
 * @returns Maandelijkse betaling (afgerond naar hele euro's)
 *
 * @example
 * calculateMortgage(400000, 3.5, 30) // => 1796
 * calculateMortgage(300000, 4.0, 25) // => 1584
 */
export function calculateMortgage(principal: number, annualRate: number, years: number): number {
  if (principal <= 0 || years <= 0) return 0
  if (annualRate <= 0) return Math.round(principal / (years * 12))

  const monthlyRate = annualRate / 100 / 12
  const numberOfPayments = years * 12

  // Annuity formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const compoundFactor = Math.pow(1 + monthlyRate, numberOfPayments)
  const monthlyPayment = principal * (monthlyRate * compoundFactor) / (compoundFactor - 1)

  return Math.round(monthlyPayment)
}
