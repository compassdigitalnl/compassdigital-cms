/**
 * Icon Generation Service
 * Maps feature/service names to appropriate Lucide icons
 */

export class IconService {
  private static readonly KEYWORD_TO_ICON: Record<string, string> = {
    // Quality & Excellence
    quality: 'Award',
    excellence: 'Star',
    premium: 'Crown',
    certified: 'BadgeCheck',
    award: 'Award',
    best: 'Trophy',

    // Security & Trust
    security: 'Shield',
    safe: 'ShieldCheck',
    trust: 'ShieldAlert',
    privacy: 'Lock',
    protect: 'ShieldCheck',
    secure: 'ShieldCheck',
    veilig: 'Shield',
    beveiliging: 'Lock',

    // Speed & Performance
    speed: 'Zap',
    fast: 'Rocket',
    performance: 'TrendingUp',
    quick: 'Timer',
    snel: 'Zap',
    razen: 'Rocket',

    // Support & Service
    support: 'Headphones',
    service: 'HelpCircle',
    help: 'LifeBuoy',
    care: 'Heart',
    contact: 'Phone',
    hulp: 'Headphones',
    klantenservice: 'Headphones',

    // Delivery & Logistics
    delivery: 'Truck',
    shipping: 'Package',
    transport: 'Plane',
    logistics: 'MapPin',
    levering: 'Truck',
    verzending: 'Package',

    // Innovation & Technology
    innovation: 'Lightbulb',
    technology: 'Cpu',
    smart: 'Brain',
    digital: 'Smartphone',
    ai: 'Bot',
    innovatie: 'Lightbulb',
    technologie: 'Cpu',

    // Expertise & Experience
    expert: 'GraduationCap',
    experience: 'TrendingUp',
    professional: 'Briefcase',
    team: 'Users',
    ervaring: 'TrendingUp',
    professionals: 'Users',

    // Money & Business
    price: 'DollarSign',
    cost: 'Wallet',
    payment: 'CreditCard',
    business: 'Building',
    growth: 'BarChart',
    prijs: 'DollarSign',
    betaling: 'CreditCard',
    groei: 'BarChart',

    // Warranty & Guarantee
    warranty: 'CheckCircle',
    guarantee: 'CheckSquare',
    reliability: 'CheckCheck',
    garantie: 'CheckCircle',
    betrouwbaar: 'CheckCheck',

    // Communication
    email: 'Mail',
    message: 'MessageSquare',
    chat: 'MessageCircle',
    call: 'Phone',
    bericht: 'Mail',
    telefoon: 'Phone',

    // Time & Efficiency
    time: 'Clock',
    '24/7': 'Clock',
    efficiency: 'Gauge',
    schedule: 'Calendar',
    tijd: 'Clock',
    efficiënt: 'Gauge',

    // Customization
    custom: 'Settings',
    flexible: 'Sliders',
    personalized: 'UserCog',
    maatwerk: 'Settings',
    flexibel: 'Sliders',

    // Sustainability & Environment
    sustainable: 'Leaf',
    green: 'TreeDeciduous',
    eco: 'Sprout',
    duurzaam: 'Leaf',
    milieu: 'TreeDeciduous',

    // Location & Maps
    location: 'MapPin',
    map: 'Map',
    navigate: 'Navigation',
    locatie: 'MapPin',
    navigatie: 'Navigation',

    // Tools & Equipment
    tool: 'Wrench',
    equipment: 'Hammer',
    gereedschap: 'Wrench',

    // Documents & Legal
    document: 'FileText',
    contract: 'FileSignature',
    legal: 'Scale',
    juridisch: 'Scale',

    // Analytics & Data
    data: 'Database',
    analytics: 'BarChart3',
    report: 'FileBarChart',
    analyse: 'BarChart3',

    // Health & Medical
    health: 'Heart',
    medical: 'Stethoscope',
    gezondheid: 'Heart',

    // Education & Training
    training: 'GraduationCap',
    education: 'BookOpen',
    learning: 'BookMarked',
    opleiding: 'GraduationCap',

    // Default service/feature icons
    dienst: 'Wrench',
    feature: 'Star',
    benefit: 'ThumbsUp',
    voordeel: 'ThumbsUp',
  }

  /**
   * Generate icon name from feature/service name or description
   * Uses keyword matching with fallback to default
   */
  static generateIcon(text: string): string {
    if (!text) return 'Star'

    const normalized = text.toLowerCase()

    // Try exact keyword match
    for (const [keyword, icon] of Object.entries(this.KEYWORD_TO_ICON)) {
      if (normalized.includes(keyword)) {
        return icon
      }
    }

    // Contextual fallbacks based on common patterns
    if (normalized.includes('jaar') || normalized.includes('year')) {
      return 'Calendar' // "30+ jaar ervaring"
    }

    if (normalized.includes('klant') || normalized.includes('customer')) {
      return 'Users' // "Tevreden klanten"
    }

    if (normalized.includes('project') || normalized.includes('werk')) {
      return 'Briefcase' // "Projecten"
    }

    if (normalized.includes('kwaliteit') || normalized.includes('quality')) {
      return 'Award'
    }

    // Ultimate fallback
    return 'Star'
  }

  /**
   * Generate multiple icons ensuring variety
   * Prevents too many duplicates by using fallbacks
   */
  static generateIcons(texts: string[]): string[] {
    if (!texts || texts.length === 0) return []

    const icons = texts.map((t) => this.generateIcon(t))

    // Count icon occurrences
    const iconCounts = icons.reduce(
      (acc, icon) => {
        acc[icon] = (acc[icon] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const FALLBACK_ICONS = [
      'Star',
      'CheckCircle',
      'Sparkles',
      'Zap',
      'Award',
      'ThumbsUp',
      'Target',
      'TrendingUp',
    ]
    let fallbackIndex = 0

    // Replace duplicates with fallbacks
    const usedIcons = new Set<string>()
    return icons.map((icon, idx) => {
      // If this icon appears too often (>40% of total), use fallback
      if (iconCounts[icon] > texts.length * 0.4 && usedIcons.has(icon)) {
        const fallback = FALLBACK_ICONS[fallbackIndex++ % FALLBACK_ICONS.length]
        usedIcons.add(fallback)
        return fallback
      }

      usedIcons.add(icon)
      return icon
    })
  }

  /**
   * Validate if icon name exists in Lucide
   * (Basic validation - expand as needed)
   */
  static isValidIcon(iconName: string): boolean {
    // Common Lucide icons list (subset)
    const VALID_ICONS = [
      'Star',
      'Award',
      'Shield',
      'Zap',
      'Truck',
      'Headphones',
      'Lightbulb',
      'Users',
      'CheckCircle',
      'Heart',
      'Phone',
      'Mail',
      'Clock',
      'DollarSign',
      'Briefcase',
      'Map',
      'Settings',
      'TrendingUp',
      // Add more as needed
    ]

    return VALID_ICONS.includes(iconName)
  }
}
