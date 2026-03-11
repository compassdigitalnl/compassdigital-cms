/**
 * Predefined Email Templates (#45)
 *
 * Ready-to-use templates for common e-commerce email scenarios.
 * Each template includes subject, preheader, and responsive HTML.
 * Templates use Listmonk variables: {{ .Subscriber.Name }}, {{ .Subscriber.Email }}, {{ .UnsubscribeURL }}
 * Custom variables: {{ .ProductName }}, {{ .OrderNumber }}, {{ .ShopName }}, {{ .ShopUrl }}
 */

export interface PredefinedTemplate {
  name: string
  description: string
  type: 'campaign' | 'transactional'
  category: 'welcome' | 'newsletter' | 'promotional' | 'transactional' | 'notification' | 'other'
  defaultSubject: string
  preheader: string
  html: string
  variables: Array<{
    name: string
    label: string
    defaultValue?: string
    required?: boolean
  }>
  tags: string[]
}

const baseStyle = `
<style>
  body { margin: 0; padding: 0; background: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; }
  .header { background: #1e293b; color: #ffffff; padding: 24px 32px; text-align: center; }
  .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
  .body { padding: 32px; color: #334155; line-height: 1.6; font-size: 15px; }
  .body h2 { color: #1e293b; font-size: 20px; margin: 0 0 16px; }
  .body p { margin: 0 0 16px; }
  .btn { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; }
  .btn:hover { background: #1d4ed8; }
  .footer { background: #f8fafc; padding: 24px 32px; text-align: center; font-size: 12px; color: #94a3b8; }
  .footer a { color: #64748b; }
  .stars { font-size: 28px; color: #f59e0b; letter-spacing: 4px; }
  .product-img { width: 100%; max-width: 200px; border-radius: 8px; }
  .divider { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
  @media (max-width: 600px) { .body { padding: 20px; } .header { padding: 16px 20px; } }
</style>
`

export const predefinedTemplates: PredefinedTemplate[] = [
  // ═══════════════════════════════════════════════════════════
  // 1. REVIEW REQUEST
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Review Request',
    description: 'Vraag klanten om een product te beoordelen na hun aankoop',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Wat vind je van je aankoop, {{ .Subscriber.Name }}?',
    preheader: 'Deel je ervaring en help andere klanten',
    tags: ['review', 'post-purchase', 'predefined'],
    variables: [
      { name: 'ProductName', label: 'Productnaam', required: true },
      { name: 'ProductUrl', label: 'Product URL', required: true },
      { name: 'ProductImage', label: 'Product Afbeelding URL', defaultValue: '' },
      { name: 'OrderNumber', label: 'Bestelnummer', required: true },
      { name: 'ShopName', label: 'Shopnaam', defaultValue: 'Onze shop' },
      { name: 'ReviewUrl', label: 'Review URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header"><h1>{{ .ShopName }}</h1></div>
  <div class="body">
    <h2>Hoe vond je je aankoop?</h2>
    <p>Hoi {{ .Subscriber.Name }},</p>
    <p>Je hebt onlangs <strong>{{ .ProductName }}</strong> besteld (order {{ .OrderNumber }}). We horen graag wat je ervan vindt!</p>
    <p>Je review helpt andere klanten bij hun keuze en helpt ons om onze producten te verbeteren.</p>
    <div class="stars">★ ★ ★ ★ ★</div>
    <p style="margin-top: 24px; text-align: center;">
      <a href="{{ .ReviewUrl }}" class="btn">Review schrijven</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Het schrijven van een review duurt slechts 1 minuut. Bedankt voor je hulp!</p>
  </div>
  <div class="footer">
    <p>{{ .ShopName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 2. REVIEW REMINDER
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Review Herinnering',
    description: 'Herinnering voor klanten die nog geen review hebben geschreven',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Nog even: wat vond je van {{ .ProductName }}?',
    preheader: 'Je review is nog niet geplaatst',
    tags: ['review', 'reminder', 'predefined'],
    variables: [
      { name: 'ProductName', label: 'Productnaam', required: true },
      { name: 'ReviewUrl', label: 'Review URL', required: true },
      { name: 'ShopName', label: 'Shopnaam', defaultValue: 'Onze shop' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header"><h1>{{ .ShopName }}</h1></div>
  <div class="body">
    <h2>Vergeet je review niet!</h2>
    <p>Hoi {{ .Subscriber.Name }},</p>
    <p>We zagen dat je nog geen review hebt geschreven voor <strong>{{ .ProductName }}</strong>. We waarderen je mening enorm!</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ReviewUrl }}" class="btn">Nu beoordelen</a>
    </p>
    <p style="font-size: 13px; color: #94a3b8;">Je helpt hiermee andere klanten bij hun keuze. Alvast bedankt!</p>
  </div>
  <div class="footer">
    <p>{{ .ShopName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 3. WELKOM
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Welkom',
    description: 'Welkomstmail voor nieuwe klanten of subscribers',
    type: 'transactional',
    category: 'welcome',
    defaultSubject: 'Welkom bij {{ .ShopName }}, {{ .Subscriber.Name }}!',
    preheader: 'Leuk dat je er bent! Hier is wat je kunt verwachten.',
    tags: ['welcome', 'onboarding', 'predefined'],
    variables: [
      { name: 'ShopName', label: 'Shopnaam', defaultValue: 'Onze shop' },
      { name: 'ShopUrl', label: 'Shop URL', required: true },
      { name: 'DiscountCode', label: 'Kortingscode (optioneel)', defaultValue: '' },
      { name: 'DiscountPercent', label: 'Kortingspercentage', defaultValue: '10' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header"><h1>Welkom! 🎉</h1></div>
  <div class="body">
    <h2>Hoi {{ .Subscriber.Name }},</h2>
    <p>Welkom bij <strong>{{ .ShopName }}</strong>! We zijn blij dat je er bent.</p>
    <p>Als klant kun je rekenen op:</p>
    <ul>
      <li>✅ Persoonlijke aanbevelingen</li>
      <li>✅ Exclusieve aanbiedingen</li>
      <li>✅ Snelle levering</li>
      <li>✅ Uitstekende klantenservice</li>
    </ul>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ShopUrl }}" class="btn">Bekijk onze producten</a>
    </p>
  </div>
  <div class="footer">
    <p>{{ .ShopName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 4. HERBESTELLING
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Herbestelling Herinnering',
    description: 'Herinner klanten eraan om producten opnieuw te bestellen',
    type: 'campaign',
    category: 'promotional',
    defaultSubject: 'Tijd om bij te bestellen, {{ .Subscriber.Name }}?',
    preheader: 'Je favoriete producten wachten op je',
    tags: ['reorder', 'retention', 'predefined'],
    variables: [
      { name: 'ShopName', label: 'Shopnaam', defaultValue: 'Onze shop' },
      { name: 'ShopUrl', label: 'Shop URL', required: true },
      { name: 'DaysSinceOrder', label: 'Dagen sinds laatste bestelling', defaultValue: '30' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header"><h1>{{ .ShopName }}</h1></div>
  <div class="body">
    <h2>Tijd om bij te bestellen?</h2>
    <p>Hoi {{ .Subscriber.Name }},</p>
    <p>Het is alweer {{ .DaysSinceOrder }} dagen geleden sinds je laatste bestelling. Misschien is het tijd om je favoriete producten weer aan te vullen?</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ShopUrl }}" class="btn">Opnieuw bestellen</a>
    </p>
    <p style="font-size: 13px; color: #94a3b8;">Gebaseerd op je eerdere aankopen bij {{ .ShopName }}.</p>
  </div>
  <div class="footer">
    <p>{{ .ShopName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 5. VERJAARDAG
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Verjaardag',
    description: 'Verjaardagsmail met optionele korting',
    type: 'campaign',
    category: 'promotional',
    defaultSubject: 'Gefeliciteerd {{ .Subscriber.Name }}! 🎂',
    preheader: 'Een speciaal cadeau voor jouw verjaardag',
    tags: ['birthday', 'loyalty', 'predefined'],
    variables: [
      { name: 'ShopName', label: 'Shopnaam', defaultValue: 'Onze shop' },
      { name: 'ShopUrl', label: 'Shop URL', required: true },
      { name: 'DiscountCode', label: 'Kortingscode', defaultValue: 'BIRTHDAY' },
      { name: 'DiscountPercent', label: 'Kortingspercentage', defaultValue: '15' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header"><h1>🎂 Gefeliciteerd!</h1></div>
  <div class="body">
    <h2>Van harte gefeliciteerd, {{ .Subscriber.Name }}!</h2>
    <p>Namens het hele team van <strong>{{ .ShopName }}</strong> wensen we je een fantastische verjaardag!</p>
    <p>Als cadeau krijg je <strong>{{ .DiscountPercent }}% korting</strong> op je volgende bestelling:</p>
    <div style="text-align: center; margin: 24px 0; padding: 20px; background: #fef3c7; border-radius: 12px;">
      <p style="margin: 0; font-size: 13px; color: #92400e;">Jouw kortingscode:</p>
      <p style="margin: 8px 0 0; font-size: 28px; font-weight: 800; color: #92400e; letter-spacing: 3px;">{{ .DiscountCode }}</p>
    </div>
    <p style="text-align: center;">
      <a href="{{ .ShopUrl }}" class="btn">Nu shoppen</a>
    </p>
    <p style="font-size: 13px; color: #94a3b8;">De kortingscode is 7 dagen geldig.</p>
  </div>
  <div class="footer">
    <p>{{ .ShopName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 6. WIN-BACK
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Win-Back',
    description: 'Win inactieve klanten terug met een speciale aanbieding',
    type: 'campaign',
    category: 'promotional',
    defaultSubject: 'We missen je, {{ .Subscriber.Name }}!',
    preheader: 'Het is al een tijdje geleden — hier is een speciale aanbieding',
    tags: ['win-back', 're-engagement', 'predefined'],
    variables: [
      { name: 'ShopName', label: 'Shopnaam', defaultValue: 'Onze shop' },
      { name: 'ShopUrl', label: 'Shop URL', required: true },
      { name: 'DiscountCode', label: 'Kortingscode', defaultValue: 'COMBACK' },
      { name: 'DiscountPercent', label: 'Kortingspercentage', defaultValue: '20' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header"><h1>{{ .ShopName }}</h1></div>
  <div class="body">
    <h2>We missen je! 💙</h2>
    <p>Hoi {{ .Subscriber.Name }},</p>
    <p>Het is een tijdje geleden sinds je laatste bezoek aan <strong>{{ .ShopName }}</strong>. We hebben je gemist!</p>
    <p>Om het je makkelijk te maken, bieden we je <strong>{{ .DiscountPercent }}% korting</strong> op je volgende bestelling:</p>
    <div style="text-align: center; margin: 24px 0; padding: 20px; background: #dbeafe; border-radius: 12px;">
      <p style="margin: 0; font-size: 13px; color: #1e40af;">Jouw exclusieve code:</p>
      <p style="margin: 8px 0 0; font-size: 28px; font-weight: 800; color: #1e40af; letter-spacing: 3px;">{{ .DiscountCode }}</p>
    </div>
    <p style="text-align: center;">
      <a href="{{ .ShopUrl }}" class="btn">Terug naar de shop</a>
    </p>
    <p style="font-size: 13px; color: #94a3b8;">De code is 14 dagen geldig. We hopen je snel weer te zien!</p>
  </div>
  <div class="footer">
    <p>{{ .ShopName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 7. ABANDONED CART
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Verlaten Winkelwagen',
    description: 'Herinnering voor klanten die hun winkelwagen hebben achtergelaten',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Je winkelwagen wacht op je, {{ .Subscriber.Name }}',
    preheader: 'Je hebt nog producten in je winkelwagen',
    tags: ['abandoned-cart', 'recovery', 'predefined'],
    variables: [
      { name: 'ShopName', label: 'Shopnaam', defaultValue: 'Onze shop' },
      { name: 'CartUrl', label: 'Winkelwagen URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header"><h1>{{ .ShopName }}</h1></div>
  <div class="body">
    <h2>Je bent iets vergeten! 🛒</h2>
    <p>Hoi {{ .Subscriber.Name }},</p>
    <p>Je hebt nog producten in je winkelwagen staan. Rond je bestelling af voordat ze uitverkocht zijn!</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .CartUrl }}" class="btn">Naar winkelwagen</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Heb je hulp nodig? Neem gerust contact met ons op.</p>
  </div>
  <div class="footer">
    <p>{{ .ShopName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },
]
