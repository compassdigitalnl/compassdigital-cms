/**
 * Query Analyzer
 * Detects natural language patterns, extracts filters, and determines search intent
 * Optimized for Dutch language queries
 */

import type { QueryAnalysis } from './types'

// Natural language patterns (Dutch)
const NL_PATTERNS = [
  /^ik\s+(zoek|wil|heb)/i,
  /^waar\s+(vind|kan|is)/i,
  /^wat\s+(is|zijn|kost)/i,
  /^hoe\s+(kan|moet|werkt)/i,
  /^welke?\s/i,
  /^geef\s+me/i,
  /^toon\s/i,
  /^laat\s.+zien/i,
  /^kun\s+je/i,
  /^hebben\s+jullie/i,
]

// Comparison patterns (Dutch)
const COMPARE_PATTERNS = [
  /vergelijk/i,
  /versus|vs\.?/i,
  /verschil\s+tussen/i,
  /\bof\b.*\bof\b/i,
  /wat\s+is\s+(het\s+)?beter/i,
]

// Question patterns (Dutch)
const QUESTION_PATTERNS = [
  /\?$/,
  /^wat\s/i,
  /^hoe\s/i,
  /^waarom\s/i,
  /^wanneer\s/i,
  /^hoeveel\s/i,
]

// Navigation patterns (Dutch)
const NAVIGATE_PATTERNS = [
  /^ga\s+naar/i,
  /^open\s/i,
  /^navigeer/i,
  /^breng\s+me\s+naar/i,
  /^(contact|over\s+ons|winkelwagen|account|inloggen)/i,
]

// Price patterns (Dutch + generic)
const PRICE_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /onder\s+(\d+(?:[.,]\d+)?)\s*euro/i, key: 'price_max' },
  { pattern: /goedkoper\s+dan\s+(\d+(?:[.,]\d+)?)/i, key: 'price_max' },
  { pattern: /minder\s+dan\s+(\d+(?:[.,]\d+)?)\s*euro/i, key: 'price_max' },
  { pattern: /tot\s+(\d+(?:[.,]\d+)?)\s*euro/i, key: 'price_max' },
  { pattern: /vanaf\s+(\d+(?:[.,]\d+)?)\s*euro/i, key: 'price_min' },
  { pattern: /meer\s+dan\s+(\d+(?:[.,]\d+)?)\s*euro/i, key: 'price_min' },
  { pattern: /duurder\s+dan\s+(\d+(?:[.,]\d+)?)/i, key: 'price_min' },
  { pattern: /tussen\s+(\d+(?:[.,]\d+)?)\s*(?:en|-)?\s*(\d+(?:[.,]\d+)?)\s*euro/i, key: 'price_range' },
]

// Common brand names (extend as needed)
const KNOWN_BRANDS = [
  'plastimed',
  '3m',
  'hartmann',
  'coloplast',
  'mölnlycke',
  'bsn medical',
  'smith & nephew',
  'lohmann & rauscher',
  'medline',
  'essity',
]

/**
 * Analyze a search query to detect intent, language patterns, and extract filters
 */
export function analyzeQuery(query: string): QueryAnalysis {
  const trimmed = query.trim()

  const analysis: QueryAnalysis = {
    originalQuery: trimmed,
    isNaturalLanguage: false,
    extractedKeywords: [],
    extractedFilters: {},
    intent: 'search',
  }

  if (!trimmed) return analysis

  // Detect natural language
  analysis.isNaturalLanguage = NL_PATTERNS.some((p) => p.test(trimmed))

  // Determine intent
  if (NAVIGATE_PATTERNS.some((p) => p.test(trimmed))) {
    analysis.intent = 'navigate'
  } else if (COMPARE_PATTERNS.some((p) => p.test(trimmed))) {
    analysis.intent = 'compare'
  } else if (QUESTION_PATTERNS.some((p) => p.test(trimmed))) {
    analysis.intent = 'question'
  } else {
    analysis.intent = 'search'
  }

  // Extract price filters
  for (const { pattern, key } of PRICE_PATTERNS) {
    const match = trimmed.match(pattern)
    if (match) {
      if (key === 'price_range' && match[2]) {
        analysis.extractedFilters['price_min'] = match[1].replace(',', '.')
        analysis.extractedFilters['price_max'] = match[2].replace(',', '.')
      } else if (match[1]) {
        analysis.extractedFilters[key] = match[1].replace(',', '.')
      }
    }
  }

  // Extract brand mentions
  const queryLower = trimmed.toLowerCase()
  for (const brand of KNOWN_BRANDS) {
    if (queryLower.includes(brand)) {
      analysis.extractedFilters['brand'] = brand
      break
    }
  }

  // Extract keywords (remove filler words)
  const fillerWords = new Set([
    'ik', 'zoek', 'wil', 'heb', 'waar', 'vind', 'kan', 'een', 'het', 'de',
    'is', 'zijn', 'wat', 'hoe', 'naar', 'voor', 'van', 'met', 'in', 'op',
    'en', 'of', 'die', 'dat', 'er', 'je', 'we', 'ze', 'hun', 'me', 'mij',
    'nodig', 'graag', 'alsjeblieft', 'aub', 'euro', 'dan', 'onder', 'boven',
    'goedkoper', 'duurder', 'vanaf', 'tot', 'tussen', 'minder', 'meer',
    'vergelijk', 'versus', 'vs', 'toon', 'laat', 'zien', 'geef',
  ])

  analysis.extractedKeywords = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9\sàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ-]/g, '')
    .split(/\s+/)
    .filter((word) => word.length >= 2 && !fillerWords.has(word))

  return analysis
}
