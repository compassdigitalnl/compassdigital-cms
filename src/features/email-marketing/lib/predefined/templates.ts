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

  // ═══════════════════════════════════════════════════════════
  // 8. WACHTWOORD RESET
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Wachtwoord Reset',
    description: 'E-mail met wachtwoord reset link',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Wachtwoord herstellen — {{ .ShopName }}',
    preheader: 'Klik op de link om je wachtwoord opnieuw in te stellen',
    tags: ['password-reset', 'security', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', defaultValue: 'Klant' },
      { name: 'ResetUrl', label: 'Reset URL', required: true },
      { name: 'ExpiresIn', label: 'Geldigheid (bijv. "1 uur")', defaultValue: '1 uur' },
      { name: 'ShopName', label: 'Shopnaam', defaultValue: 'Onze shop' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header"><h1>{{ .ShopName }}</h1></div>
  <div class="body">
    <h2>Wachtwoord herstellen</h2>
    <p>Hoi {{ .CustomerName }},</p>
    <p>We hebben een verzoek ontvangen om je wachtwoord te herstellen. Klik op de knop hieronder om een nieuw wachtwoord in te stellen.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ResetUrl }}" class="btn">Nieuw wachtwoord instellen</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Deze link is {{ .ExpiresIn }} geldig. Heb jij dit niet aangevraagd? Dan kun je deze e-mail negeren.</p>
  </div>
  <div class="footer">
    <p>{{ .ShopName }}</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 9. B2B TEAM UITNODIGING
  // ═══════════════════════════════════════════════════════════
  {
    name: 'B2B Team Uitnodiging',
    description: 'Uitnodiging voor een medewerker om lid te worden van een B2B bedrijfsaccount',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: '{{ .InviterName }} nodigt je uit voor {{ .CompanyName }}',
    preheader: 'Je bent uitgenodigd om lid te worden van een zakelijk account',
    tags: ['b2b', 'invite', 'team', 'predefined'],
    variables: [
      { name: 'InviterName', label: 'Naam uitnodiger', required: true },
      { name: 'CompanyName', label: 'Bedrijfsnaam', required: true },
      { name: 'Role', label: 'Rol (bijv. Inkoper)', defaultValue: 'Teamlid' },
      { name: 'InviteUrl', label: 'Uitnodigingslink', required: true },
      { name: 'ShopName', label: 'Shopnaam', defaultValue: 'Onze shop' },
      { name: 'Message', label: 'Persoonlijk bericht (optioneel)', defaultValue: '' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header"><h1>{{ .ShopName }}</h1></div>
  <div class="body">
    <h2>Je bent uitgenodigd!</h2>
    <p>Hoi,</p>
    <p><strong>{{ .InviterName }}</strong> nodigt je uit om lid te worden van het zakelijke account van <strong>{{ .CompanyName }}</strong> als <strong>{{ .Role }}</strong>.</p>
    <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #1e40af;">Met een zakelijk account kun je bestellen, offertes aanvragen en bestellingen beheren namens {{ .CompanyName }}.</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .InviteUrl }}" class="btn">Uitnodiging accepteren</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Deze uitnodiging is 7 dagen geldig. Heb je hier niet om gevraagd? Dan kun je deze e-mail negeren.</p>
  </div>
  <div class="footer">
    <p>{{ .ShopName }}</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 10. OFFERTE ONTVANGEN (ADMIN)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Offerte Ontvangen (Admin)',
    description: 'Notificatie aan admin dat er een nieuwe offerteaanvraag is binnengekomen',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Nieuwe offerteaanvraag {{ .QuoteNumber }}',
    preheader: 'Er is een nieuwe offerteaanvraag binnengekomen',
    tags: ['quote', 'admin', 'notification', 'predefined'],
    variables: [
      { name: 'QuoteNumber', label: 'Offertenummer', required: true },
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ProductCount', label: 'Aantal producten', defaultValue: '0' },
      { name: 'ShopName', label: 'Shopnaam', defaultValue: 'Onze shop' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header"><h1>{{ .ShopName }}</h1></div>
  <div class="body">
    <h2>Nieuwe offerteaanvraag</h2>
    <p>Er is een nieuwe offerteaanvraag binnengekomen:</p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Offertenummer:</strong> {{ .QuoteNumber }}</p>
      <p style="margin: 0 0 8px;"><strong>Klant:</strong> {{ .CustomerName }}</p>
      <p style="margin: 0;"><strong>Aantal producten:</strong> {{ .ProductCount }}</p>
    </div>
    <p>Ga naar het admin panel om de offerte te bekijken en te beantwoorden.</p>
  </div>
  <div class="footer">
    <p>{{ .ShopName }}</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 11. OFFERTE KLAAR (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Offerte Klaar (Klant)',
    description: 'Notificatie aan klant dat de offerte gereed is',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Uw offerte {{ .QuoteNumber }} is klaar — {{ .ShopName }}',
    preheader: 'Uw offerte is gereed en wacht op uw reactie',
    tags: ['quote', 'customer', 'predefined'],
    variables: [
      { name: 'QuoteNumber', label: 'Offertenummer', required: true },
      { name: 'TotalPrice', label: 'Totaalprijs', required: true },
      { name: 'ValidUntil', label: 'Geldig tot', required: true },
      { name: 'QuoteUrl', label: 'Offerte URL', required: true },
      { name: 'ShopName', label: 'Shopnaam', defaultValue: 'Onze shop' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header"><h1>{{ .ShopName }}</h1></div>
  <div class="body">
    <h2>Uw offerte is klaar</h2>
    <p>Hoi {{ .Subscriber.Name }},</p>
    <p>Goed nieuws! Uw offerte <strong>{{ .QuoteNumber }}</strong> is gereed.</p>
    <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Totaalprijs:</strong> {{ .TotalPrice }}</p>
      <p style="margin: 0;"><strong>Geldig tot:</strong> {{ .ValidUntil }}</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .QuoteUrl }}" class="btn">Offerte bekijken</a>
    </p>
  </div>
  <div class="footer">
    <p>{{ .ShopName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 12. OFFERTE GEACCEPTEERD (ADMIN)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Offerte Geaccepteerd (Admin)',
    description: 'Notificatie aan admin dat een offerte is geaccepteerd door de klant',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Offerte {{ .QuoteNumber }} geaccepteerd door {{ .CustomerName }}',
    preheader: 'Een klant heeft uw offerte geaccepteerd',
    tags: ['quote', 'admin', 'accepted', 'predefined'],
    variables: [
      { name: 'QuoteNumber', label: 'Offertenummer', required: true },
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ShopName', label: 'Shopnaam', defaultValue: 'Onze shop' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header"><h1>{{ .ShopName }}</h1></div>
  <div class="body">
    <h2>Offerte geaccepteerd</h2>
    <p>Klant <strong>{{ .CustomerName }}</strong> heeft offerte <strong>{{ .QuoteNumber }}</strong> geaccepteerd.</p>
    <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0;">De offerte kan nu omgezet worden naar een bestelling.</p>
    </div>
    <p>Ga naar het admin panel om de bestelling aan te maken.</p>
  </div>
  <div class="footer">
    <p>{{ .ShopName }}</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 13. OFFERTE AFGEWEZEN (ADMIN)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Offerte Afgewezen (Admin)',
    description: 'Notificatie aan admin dat een offerte is afgewezen door de klant',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Offerte {{ .QuoteNumber }} afgewezen',
    preheader: 'Een klant heeft uw offerte afgewezen',
    tags: ['quote', 'admin', 'rejected', 'predefined'],
    variables: [
      { name: 'QuoteNumber', label: 'Offertenummer', required: true },
      { name: 'Reason', label: 'Reden afwijzing', defaultValue: 'Geen reden opgegeven' },
      { name: 'ShopName', label: 'Shopnaam', defaultValue: 'Onze shop' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header"><h1>{{ .ShopName }}</h1></div>
  <div class="body">
    <h2>Offerte afgewezen</h2>
    <p>Offerte <strong>{{ .QuoteNumber }}</strong> is afgewezen.</p>
    <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0;"><strong>Reden:</strong> {{ .Reason }}</p>
    </div>
  </div>
  <div class="footer">
    <p>{{ .ShopName }}</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 14. GOEDKEURING GEVRAAGD
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Goedkeuring Gevraagd',
    description: 'Notificatie aan B2B beheerder dat een medewerker goedkeuring vraagt voor een bestelling',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Goedkeuring gevraagd: {{ .OrderRef }} — {{ .ShopName }}',
    preheader: 'Een teamlid heeft goedkeuring nodig voor een bestelling',
    tags: ['approval', 'b2b', 'notification', 'predefined'],
    variables: [
      { name: 'RequesterName', label: 'Naam aanvrager', required: true },
      { name: 'OrderRef', label: 'Orderreferentie', required: true },
      { name: 'Amount', label: 'Bedrag', required: true },
      { name: 'ApprovalUrl', label: 'Goedkeurings-URL', required: true },
      { name: 'ShopName', label: 'Shopnaam', defaultValue: 'Onze shop' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header"><h1>{{ .ShopName }}</h1></div>
  <div class="body">
    <h2>Goedkeuring gevraagd</h2>
    <p><strong>{{ .RequesterName }}</strong> heeft een bestelling ter goedkeuring ingediend.</p>
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Referentie:</strong> {{ .OrderRef }}</p>
      <p style="margin: 0;"><strong>Bedrag:</strong> {{ .Amount }}</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ApprovalUrl }}" class="btn">Bestelling beoordelen</a>
    </p>
  </div>
  <div class="footer">
    <p>{{ .ShopName }}</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 15. GOEDKEURING GOEDGEKEURD
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Goedkeuring Goedgekeurd',
    description: 'Notificatie aan B2B medewerker dat de bestelling is goedgekeurd',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Bestelling {{ .OrderRef }} goedgekeurd — {{ .ShopName }}',
    preheader: 'Je bestelling is goedgekeurd en wordt verwerkt',
    tags: ['approval', 'approved', 'b2b', 'predefined'],
    variables: [
      { name: 'OrderRef', label: 'Orderreferentie', required: true },
      { name: 'ApproverName', label: 'Naam goedkeurder', required: true },
      { name: 'Amount', label: 'Bedrag', required: true },
      { name: 'ShopName', label: 'Shopnaam', defaultValue: 'Onze shop' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header"><h1>{{ .ShopName }}</h1></div>
  <div class="body">
    <h2>Bestelling goedgekeurd</h2>
    <p>Hoi {{ .Subscriber.Name }},</p>
    <p>Je bestelling <strong>{{ .OrderRef }}</strong> is goedgekeurd door <strong>{{ .ApproverName }}</strong>.</p>
    <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Bedrag:</strong> {{ .Amount }}</p>
      <p style="margin: 0;">Je bestelling wordt nu verwerkt.</p>
    </div>
  </div>
  <div class="footer">
    <p>{{ .ShopName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 16. GOEDKEURING AFGEWEZEN
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Goedkeuring Afgewezen',
    description: 'Notificatie aan B2B medewerker dat de bestelling is afgewezen',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Bestelling {{ .OrderRef }} afgewezen — {{ .ShopName }}',
    preheader: 'Je bestelling is helaas afgewezen',
    tags: ['approval', 'rejected', 'b2b', 'predefined'],
    variables: [
      { name: 'OrderRef', label: 'Orderreferentie', required: true },
      { name: 'ApproverName', label: 'Naam beoordelaar', required: true },
      { name: 'Reason', label: 'Reden afwijzing', defaultValue: 'Geen reden opgegeven' },
      { name: 'ShopName', label: 'Shopnaam', defaultValue: 'Onze shop' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header"><h1>{{ .ShopName }}</h1></div>
  <div class="body">
    <h2>Bestelling afgewezen</h2>
    <p>Hoi {{ .Subscriber.Name }},</p>
    <p>Je bestelling <strong>{{ .OrderRef }}</strong> is afgewezen door <strong>{{ .ApproverName }}</strong>.</p>
    <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0;"><strong>Reden:</strong> {{ .Reason }}</p>
    </div>
    <p>Neem contact op met je beheerder als je vragen hebt.</p>
  </div>
  <div class="footer">
    <p>{{ .ShopName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 17. RETOUR BEVESTIGING
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Retour Bevestiging',
    description: 'Bevestiging aan klant dat de retour is ontvangen en in behandeling wordt genomen',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Retour {{ .ReturnNumber }} ontvangen — {{ .ShopName }}',
    preheader: 'We hebben je retourverzoek ontvangen',
    tags: ['return', 'rma', 'confirmation', 'predefined'],
    variables: [
      { name: 'OrderNumber', label: 'Bestelnummer', required: true },
      { name: 'ReturnNumber', label: 'Retournummer (RMA)', required: true },
      { name: 'ItemCount', label: 'Aantal producten', required: true },
      { name: 'ShopName', label: 'Shopnaam', defaultValue: 'Onze shop' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header"><h1>{{ .ShopName }}</h1></div>
  <div class="body">
    <h2>Retour ontvangen</h2>
    <p>Hoi {{ .Subscriber.Name }},</p>
    <p>We hebben je retourverzoek in goede orde ontvangen.</p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>RMA-nummer:</strong> {{ .ReturnNumber }}</p>
      <p style="margin: 0 0 8px;"><strong>Bestelling:</strong> {{ .OrderNumber }}</p>
      <p style="margin: 0;"><strong>Aantal producten:</strong> {{ .ItemCount }}</p>
    </div>
    <p>We beoordelen je retour zo snel mogelijk. Je ontvangt een e-mail zodra de retour is verwerkt.</p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Heb je vragen over je retour? Neem gerust contact met ons op.</p>
  </div>
  <div class="footer">
    <p>{{ .ShopName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 18. FACTUUR BESCHIKBAAR
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Factuur Beschikbaar',
    description: 'Notificatie dat een factuur beschikbaar is voor download',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Factuur {{ .InvoiceNumber }} beschikbaar — {{ .ShopName }}',
    preheader: 'Je factuur staat klaar in je account',
    tags: ['invoice', 'b2b', 'predefined'],
    variables: [
      { name: 'InvoiceNumber', label: 'Factuurnummer', required: true },
      { name: 'Amount', label: 'Bedrag', required: true },
      { name: 'InvoiceUrl', label: 'Factuur URL', required: true },
      { name: 'ShopName', label: 'Shopnaam', defaultValue: 'Onze shop' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header"><h1>{{ .ShopName }}</h1></div>
  <div class="body">
    <h2>Factuur beschikbaar</h2>
    <p>Hoi {{ .Subscriber.Name }},</p>
    <p>Er staat een nieuwe factuur voor je klaar.</p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Factuurnummer:</strong> {{ .InvoiceNumber }}</p>
      <p style="margin: 0;"><strong>Bedrag:</strong> {{ .Amount }}</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .InvoiceUrl }}" class="btn">Factuur bekijken</a>
    </p>
  </div>
  <div class="footer">
    <p>{{ .ShopName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 19. WELKOMSTMAIL (TRANSACTIONAL)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Welkomstmail Account',
    description: 'Welkomstmail bij het aanmaken van een nieuw account (transactioneel)',
    type: 'transactional',
    category: 'welcome',
    defaultSubject: 'Welkom bij {{ .ShopName }}, {{ .CustomerName }}!',
    preheader: 'Je account is aangemaakt. Ontdek wat je kunt doen.',
    tags: ['welcome', 'registration', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ShopName', label: 'Shopnaam', defaultValue: 'Onze shop' },
      { name: 'LoginUrl', label: 'Inlog URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header"><h1>Welkom!</h1></div>
  <div class="body">
    <h2>Hoi {{ .CustomerName }},</h2>
    <p>Welkom bij <strong>{{ .ShopName }}</strong>! Je account is succesvol aangemaakt.</p>
    <p>Met je account kun je:</p>
    <ul>
      <li>Bestellingen volgen en herhalen</li>
      <li>Favoriete producten bewaren</li>
      <li>Facturen downloaden</li>
      <li>Retouren aanvragen</li>
    </ul>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .LoginUrl }}" class="btn">Naar je account</a>
    </p>
  </div>
  <div class="footer">
    <p>{{ .ShopName }}</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // BEAUTY BRANCH — BOOKING TEMPLATES (20–27)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 20. BEAUTY — AFSPRAAK BEVESTIGING (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Afspraak Bevestiging (Klant)',
    description: 'Bevestigingsmail naar de klant na het boeken van een beauty afspraak',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Afspraak bevestigd — {{ .ServiceName }} op {{ .AppointmentDate }}',
    preheader: 'Je afspraak is bevestigd! Hier zijn de details.',
    tags: ['beauty', 'booking', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceName', label: 'Behandeling', required: true },
      { name: 'AppointmentDate', label: 'Datum afspraak', required: true },
      { name: 'AppointmentTime', label: 'Tijd afspraak', required: true },
      { name: 'Duration', label: 'Duur (bijv. "60 min")', defaultValue: '60 min' },
      { name: 'SpecialistName', label: 'Naam specialist', required: true },
      { name: 'SalonName', label: 'Salonnaam', defaultValue: 'Onze salon' },
      { name: 'SalonAddress', label: 'Salonadres', defaultValue: '' },
      { name: 'Price', label: 'Prijs', defaultValue: '' },
      { name: 'BookingUrl', label: 'Boeking bekijken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #ec4899, #8b5cf6);"><h1>{{ .SalonName }}</h1></div>
  <div class="body">
    <h2>Je afspraak is bevestigd!</h2>
    <p>Hoi {{ .CustomerName }},</p>
    <p>Fijn dat je een afspraak hebt gemaakt. Hier zijn de details:</p>
    <div style="background: #fdf4ff; border-left: 4px solid #ec4899; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Behandeling:</strong> {{ .ServiceName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .AppointmentDate }}</p>
      <p style="margin: 0 0 8px;"><strong>Tijd:</strong> {{ .AppointmentTime }}</p>
      <p style="margin: 0 0 8px;"><strong>Duur:</strong> {{ .Duration }}</p>
      <p style="margin: 0 0 8px;"><strong>Specialist:</strong> {{ .SpecialistName }}</p>
      <p style="margin: 0 0 8px;"><strong>Locatie:</strong> {{ .SalonAddress }}</p>
      <p style="margin: 0;"><strong>Prijs:</strong> {{ .Price }}</p>
    </div>
    <p style="font-size: 13px; color: #6b7280;">Tip: Kom je voor het eerst? Kom dan 10 minuten eerder voor een korte intake.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .BookingUrl }}" class="btn" style="background: #ec4899;">Afspraak bekijken</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Moet je je afspraak wijzigen of annuleren? Dat kan via bovenstaande link of neem telefonisch contact met ons op.</p>
  </div>
  <div class="footer">
    <p>{{ .SalonName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 21. BEAUTY — AFSPRAAK BEVESTIGING (ADMIN)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Afspraak Bevestiging (Admin)',
    description: 'Notificatie aan de salon admin bij een nieuwe beauty afspraak',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Nieuwe afspraak: {{ .CustomerName }} — {{ .ServiceName }}',
    preheader: 'Er is een nieuwe afspraak geboekt',
    tags: ['beauty', 'booking', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'CustomerEmail', label: 'E-mail klant', required: true },
      { name: 'CustomerPhone', label: 'Telefoonnummer klant', defaultValue: '' },
      { name: 'ServiceName', label: 'Behandeling', required: true },
      { name: 'AppointmentDate', label: 'Datum afspraak', required: true },
      { name: 'AppointmentTime', label: 'Tijd afspraak', required: true },
      { name: 'SpecialistName', label: 'Naam specialist', required: true },
      { name: 'IsFirstVisit', label: 'Eerste bezoek (ja/nee)', defaultValue: 'nee' },
      { name: 'Remarks', label: 'Opmerkingen klant', defaultValue: 'Geen' },
      { name: 'Price', label: 'Prijs', defaultValue: '' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #ec4899, #8b5cf6);"><h1>Nieuwe Afspraak</h1></div>
  <div class="body">
    <h2>Nieuwe boeking ontvangen</h2>
    <p>Er is een nieuwe afspraak geboekt via de website:</p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Klant:</strong> {{ .CustomerName }}</p>
      <p style="margin: 0 0 8px;"><strong>E-mail:</strong> {{ .CustomerEmail }}</p>
      <p style="margin: 0 0 8px;"><strong>Telefoon:</strong> {{ .CustomerPhone }}</p>
      <p style="margin: 0 0 8px;"><strong>Behandeling:</strong> {{ .ServiceName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .AppointmentDate }}</p>
      <p style="margin: 0 0 8px;"><strong>Tijd:</strong> {{ .AppointmentTime }}</p>
      <p style="margin: 0 0 8px;"><strong>Specialist:</strong> {{ .SpecialistName }}</p>
      <p style="margin: 0 0 8px;"><strong>Prijs:</strong> {{ .Price }}</p>
      <p style="margin: 0 0 8px;"><strong>Eerste bezoek:</strong> {{ .IsFirstVisit }}</p>
      <p style="margin: 0;"><strong>Opmerkingen:</strong> {{ .Remarks }}</p>
    </div>
  </div>
  <div class="footer">
    <p>Automatische notificatie — Beauty Salon Admin</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 22. BEAUTY — AFSPRAAK HERINNERING
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Afspraak Herinnering',
    description: 'Herinnering aan de klant 1 dag voor de beauty afspraak',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Herinnering: {{ .ServiceName }} morgen om {{ .AppointmentTime }}',
    preheader: 'Niet vergeten: je afspraak is morgen!',
    tags: ['beauty', 'booking', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceName', label: 'Behandeling', required: true },
      { name: 'AppointmentDate', label: 'Datum afspraak', required: true },
      { name: 'AppointmentTime', label: 'Tijd afspraak', required: true },
      { name: 'SpecialistName', label: 'Naam specialist', required: true },
      { name: 'SalonAddress', label: 'Salonadres', defaultValue: '' },
      { name: 'CancelUrl', label: 'Annulerings URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #ec4899, #8b5cf6);"><h1>Herinnering</h1></div>
  <div class="body">
    <h2>Je afspraak is morgen!</h2>
    <p>Hoi {{ .CustomerName }},</p>
    <p>Even een vriendelijke herinnering: je hebt morgen een afspraak bij ons.</p>
    <div style="background: #fdf4ff; border-left: 4px solid #ec4899; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Behandeling:</strong> {{ .ServiceName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .AppointmentDate }}</p>
      <p style="margin: 0 0 8px;"><strong>Tijd:</strong> {{ .AppointmentTime }}</p>
      <p style="margin: 0 0 8px;"><strong>Specialist:</strong> {{ .SpecialistName }}</p>
      <p style="margin: 0;"><strong>Locatie:</strong> {{ .SalonAddress }}</p>
    </div>
    <p>We kijken ernaar uit je te verwelkomen!</p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Kun je niet komen? <a href="{{ .CancelUrl }}" style="color: #ec4899;">Annuleer of verzet je afspraak</a> (gratis tot 24 uur van tevoren).</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 23. BEAUTY — AFSPRAAK GEANNULEERD (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Afspraak Geannuleerd (Klant)',
    description: 'Bevestiging aan de klant dat de beauty afspraak is geannuleerd',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Afspraak geannuleerd — {{ .ServiceName }}',
    preheader: 'Je afspraak is geannuleerd',
    tags: ['beauty', 'booking', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceName', label: 'Behandeling', required: true },
      { name: 'AppointmentDate', label: 'Datum afspraak', required: true },
      { name: 'SalonPhone', label: 'Telefoonnummer salon', defaultValue: '' },
      { name: 'RebookUrl', label: 'Opnieuw boeken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #ec4899, #8b5cf6);"><h1>Afspraak Geannuleerd</h1></div>
  <div class="body">
    <h2>Je afspraak is geannuleerd</h2>
    <p>Hoi {{ .CustomerName }},</p>
    <p>Je afspraak voor <strong>{{ .ServiceName }}</strong> op <strong>{{ .AppointmentDate }}</strong> is geannuleerd.</p>
    <p>Jammer dat het niet is doorgegaan! Wil je een nieuwe afspraak maken? Dat kan eenvoudig via de knop hieronder.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .RebookUrl }}" class="btn" style="background: #ec4899;">Opnieuw boeken</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Heb je vragen? Bel ons gerust op {{ .SalonPhone }}.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 24. BEAUTY — AFSPRAAK GEANNULEERD (ADMIN)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Afspraak Geannuleerd (Admin)',
    description: 'Notificatie aan de salon admin bij annulering van een beauty afspraak',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Afspraak geannuleerd: {{ .CustomerName }}',
    preheader: 'Een afspraak is zojuist geannuleerd',
    tags: ['beauty', 'booking', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'CustomerEmail', label: 'E-mail klant', required: true },
      { name: 'ServiceName', label: 'Behandeling', required: true },
      { name: 'AppointmentDate', label: 'Datum afspraak', required: true },
      { name: 'SpecialistName', label: 'Naam specialist', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #ec4899, #8b5cf6);"><h1>Afspraak Geannuleerd</h1></div>
  <div class="body">
    <h2>Afspraak geannuleerd</h2>
    <p>De volgende afspraak is zojuist geannuleerd:</p>
    <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Klant:</strong> {{ .CustomerName }}</p>
      <p style="margin: 0 0 8px;"><strong>E-mail:</strong> {{ .CustomerEmail }}</p>
      <p style="margin: 0 0 8px;"><strong>Behandeling:</strong> {{ .ServiceName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .AppointmentDate }}</p>
      <p style="margin: 0;"><strong>Specialist:</strong> {{ .SpecialistName }}</p>
    </div>
    <p>Dit tijdslot is nu weer beschikbaar in de agenda.</p>
  </div>
  <div class="footer">
    <p>Automatische notificatie — Beauty Salon Admin</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 25. BEAUTY — AFSPRAAK VERZET (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Afspraak Verzet (Klant)',
    description: 'Bevestiging aan de klant dat de beauty afspraak is verzet naar een nieuw moment',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Afspraak verzet — {{ .ServiceName }} op {{ .NewDate }}',
    preheader: 'Je afspraak is verzet naar een nieuwe datum',
    tags: ['beauty', 'booking', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceName', label: 'Behandeling', required: true },
      { name: 'OldDate', label: 'Oude datum', required: true },
      { name: 'OldTime', label: 'Oude tijd', required: true },
      { name: 'NewDate', label: 'Nieuwe datum', required: true },
      { name: 'NewTime', label: 'Nieuwe tijd', required: true },
      { name: 'SpecialistName', label: 'Naam specialist', required: true },
      { name: 'BookingUrl', label: 'Boeking bekijken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #ec4899, #8b5cf6);"><h1>Afspraak Verzet</h1></div>
  <div class="body">
    <h2>Je afspraak is verzet</h2>
    <p>Hoi {{ .CustomerName }},</p>
    <p>Je afspraak voor <strong>{{ .ServiceName }}</strong> is verplaatst naar een nieuw moment:</p>
    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 12px; color: #94a3b8; text-decoration: line-through;"><strong>Was:</strong> {{ .OldDate }} om {{ .OldTime }}</p>
      <p style="margin: 0; color: #059669; font-size: 17px;"><strong>Nieuw:</strong> {{ .NewDate }} om {{ .NewTime }}</p>
    </div>
    <div style="background: #fdf4ff; border-left: 4px solid #ec4899; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Behandeling:</strong> {{ .ServiceName }}</p>
      <p style="margin: 0;"><strong>Specialist:</strong> {{ .SpecialistName }}</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .BookingUrl }}" class="btn" style="background: #ec4899;">Afspraak bekijken</a>
    </p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 26. BEAUTY — EERSTE BEZOEK WELKOM
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Eerste Bezoek Welkom',
    description: 'Welkomstmail voor klanten die voor het eerst een afspraak hebben bij de beauty salon',
    type: 'transactional',
    category: 'welcome',
    defaultSubject: 'Welkom bij {{ .SalonName }}! Alles over je eerste bezoek',
    preheader: 'Leuk dat je langskomt! Dit kun je verwachten.',
    tags: ['beauty', 'booking', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceName', label: 'Behandeling', required: true },
      { name: 'AppointmentDate', label: 'Datum afspraak', required: true },
      { name: 'AppointmentTime', label: 'Tijd afspraak', required: true },
      { name: 'SpecialistName', label: 'Naam specialist', required: true },
      { name: 'SalonName', label: 'Salonnaam', defaultValue: 'Onze salon' },
      { name: 'SalonAddress', label: 'Salonadres', defaultValue: '' },
      { name: 'ParkingInfo', label: 'Parkeerinformatie', defaultValue: 'Gratis parkeren voor de deur.' },
      { name: 'WhatToExpect', label: 'Wat te verwachten', defaultValue: 'We beginnen met een korte intake om je wensen te bespreken, waarna de behandeling start.' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #ec4899, #8b5cf6);"><h1>Welkom bij {{ .SalonName }}!</h1></div>
  <div class="body">
    <h2>Leuk dat je langskomt!</h2>
    <p>Hoi {{ .CustomerName }},</p>
    <p>Wat fijn dat je een afspraak hebt gemaakt bij <strong>{{ .SalonName }}</strong>! Omdat het je eerste bezoek is, willen we je graag wat meer vertellen over wat je kunt verwachten.</p>
    <div style="background: #fdf4ff; border-left: 4px solid #ec4899; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Behandeling:</strong> {{ .ServiceName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .AppointmentDate }}</p>
      <p style="margin: 0 0 8px;"><strong>Tijd:</strong> {{ .AppointmentTime }}</p>
      <p style="margin: 0;"><strong>Specialist:</strong> {{ .SpecialistName }}</p>
    </div>
    <h2 style="font-size: 17px; margin-top: 28px;">Wat kun je verwachten?</h2>
    <p>{{ .WhatToExpect }}</p>
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0; font-weight: 600; color: #92400e;">Tip: Kom 10 minuten eerder zodat we rustig kennis kunnen maken en je wensen kunnen bespreken.</p>
    </div>
    <h2 style="font-size: 17px; margin-top: 28px;">Locatie & Parkeren</h2>
    <p><strong>Adres:</strong> {{ .SalonAddress }}</p>
    <p><strong>Parkeren:</strong> {{ .ParkingInfo }}</p>
    <p>We kijken ernaar uit je te ontmoeten!</p>
  </div>
  <div class="footer">
    <p>{{ .SalonName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 27. BEAUTY — REVIEW VERZOEK (NA BEHANDELING)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Review Verzoek (Na Behandeling)',
    description: 'Review verzoek aan de klant na een afgeronde beauty behandeling',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Hoe was je {{ .ServiceName }}, {{ .CustomerName }}?',
    preheader: 'Deel je ervaring en help andere klanten',
    tags: ['beauty', 'booking', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceName', label: 'Behandeling', required: true },
      { name: 'SpecialistName', label: 'Naam specialist', required: true },
      { name: 'AppointmentDate', label: 'Datum behandeling', required: true },
      { name: 'ReviewUrl', label: 'Review URL', required: true },
      { name: 'RebookUrl', label: 'Opnieuw boeken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #ec4899, #8b5cf6);"><h1>Hoe was het?</h1></div>
  <div class="body">
    <h2>Hoe was je {{ .ServiceName }}?</h2>
    <p>Hoi {{ .CustomerName }},</p>
    <p>Je bent op <strong>{{ .AppointmentDate }}</strong> bij <strong>{{ .SpecialistName }}</strong> geweest voor een <strong>{{ .ServiceName }}</strong>. We hopen dat je tevreden bent!</p>
    <p>We horen graag hoe je het hebt ervaren. Je review helpt ons om nog beter te worden en helpt andere klanten bij hun keuze.</p>
    <div class="stars" style="text-align: center; margin: 20px 0;">&#9733; &#9733; &#9733; &#9733; &#9733;</div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ReviewUrl }}" class="btn" style="background: #ec4899;">Review schrijven</a>
    </p>
    <hr class="divider">
    <p style="text-align: center;">Tevreden? Boek direct je volgende afspraak:</p>
    <p style="text-align: center; margin: 16px 0;">
      <a href="{{ .RebookUrl }}" class="btn" style="background: #8b5cf6;">Opnieuw boeken</a>
    </p>
    <p style="font-size: 13px; color: #94a3b8; text-align: center;">Het schrijven van een review duurt slechts 1 minuut. Bedankt!</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // HORECA BRANCH — RESERVATION EMAIL TEMPLATES (28–35)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 28. HORECA — RESERVERING BEVESTIGD (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Reservering Bevestigd (Klant)',
    description: 'Bevestigingsmail aan de gast na het plaatsen van een reservering',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Reservering bevestigd — {{ .Date }} om {{ .Time }}',
    preheader: 'Uw tafel is gereserveerd',
    tags: ['horeca', 'reservation', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'Date', label: 'Datum', required: true },
      { name: 'Time', label: 'Tijd', required: true },
      { name: 'Guests', label: 'Aantal gasten', required: true },
      { name: 'Occasion', label: 'Gelegenheid', defaultValue: '' },
      { name: 'Preferences', label: 'Voorkeuren', defaultValue: '' },
      { name: 'RestaurantName', label: 'Restaurantnaam', required: true },
      { name: 'RestaurantAddress', label: 'Adres restaurant', required: true },
      { name: 'RestaurantPhone', label: 'Telefoonnummer restaurant', required: true },
      { name: 'ReservationUrl', label: 'Reservering URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #f97316, #dc2626);"><h1>Reservering Bevestigd</h1></div>
  <div class="body">
    <h2>Welkom, {{ .CustomerName }}!</h2>
    <p>Uw reservering is bevestigd. Wij verwachten u graag op het volgende tijdstip:</p>
    <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <table width="100%" style="font-size: 15px; color: #334155;">
        <tr><td style="padding: 6px 0; font-weight: 600;">Datum</td><td style="padding: 6px 0;">{{ .Date }}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Tijd</td><td style="padding: 6px 0;">{{ .Time }}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Aantal gasten</td><td style="padding: 6px 0;">{{ .Guests }}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Gelegenheid</td><td style="padding: 6px 0;">{{ .Occasion }}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Voorkeuren</td><td style="padding: 6px 0;">{{ .Preferences }}</td></tr>
      </table>
    </div>
    <p style="font-size: 13px; color: #94a3b8;">Annuleringsbeleid: gratis annuleren tot 4 uur voor de reservering. Neem bij wijzigingen contact op via telefoon.</p>
    <hr class="divider">
    <p><strong>{{ .RestaurantName }}</strong><br>{{ .RestaurantAddress }}<br>Tel: {{ .RestaurantPhone }}</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ReservationUrl }}" class="btn" style="background: #f97316;">Reservering bekijken</a>
    </p>
  </div>
  <div class="footer">
    <p>{{ .RestaurantName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 29. HORECA — RESERVERING BEVESTIGD (ADMIN)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Reservering Bevestigd (Admin)',
    description: 'Notificatie aan het restaurant bij een nieuwe reservering',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Nieuwe reservering: {{ .CustomerName }} — {{ .Guests }} gasten',
    preheader: 'Nieuwe reservering ontvangen',
    tags: ['horeca', 'reservation', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'CustomerEmail', label: 'E-mail klant', required: true },
      { name: 'CustomerPhone', label: 'Telefoon klant', required: true },
      { name: 'Date', label: 'Datum', required: true },
      { name: 'Time', label: 'Tijd', required: true },
      { name: 'Guests', label: 'Aantal gasten', required: true },
      { name: 'Occasion', label: 'Gelegenheid', defaultValue: '' },
      { name: 'Preferences', label: 'Voorkeuren', defaultValue: '' },
      { name: 'Remarks', label: 'Opmerkingen', defaultValue: '' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #f97316, #dc2626);"><h1>Nieuwe Reservering</h1></div>
  <div class="body">
    <h2>Nieuwe reservering ontvangen</h2>
    <table width="100%" style="font-size: 15px; color: #334155; border-collapse: collapse;">
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Naam</td><td style="padding: 10px 0;">{{ .CustomerName }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">E-mail</td><td style="padding: 10px 0;">{{ .CustomerEmail }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Telefoon</td><td style="padding: 10px 0;">{{ .CustomerPhone }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Datum</td><td style="padding: 10px 0;">{{ .Date }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Tijd</td><td style="padding: 10px 0;">{{ .Time }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Gasten</td><td style="padding: 10px 0;">{{ .Guests }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Gelegenheid</td><td style="padding: 10px 0;">{{ .Occasion }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Voorkeuren</td><td style="padding: 10px 0;">{{ .Preferences }}</td></tr>
      <tr><td style="padding: 10px 0; font-weight: 600;">Opmerkingen</td><td style="padding: 10px 0;">{{ .Remarks }}</td></tr>
    </table>
  </div>
  <div class="footer">
    <p>Dit is een automatisch gegenereerd bericht.</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 30. HORECA — RESERVERING HERINNERING
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Reservering Herinnering',
    description: 'Herinnering aan de gast 1 dag voor de reservering',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Herinnering: reservering morgen om {{ .Time }}',
    preheader: 'Vergeet uw reservering morgen niet',
    tags: ['horeca', 'reservation', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'Date', label: 'Datum', required: true },
      { name: 'Time', label: 'Tijd', required: true },
      { name: 'Guests', label: 'Aantal gasten', required: true },
      { name: 'RestaurantName', label: 'Restaurantnaam', required: true },
      { name: 'RestaurantAddress', label: 'Adres restaurant', required: true },
      { name: 'CancelUrl', label: 'Annulerings URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #f97316, #dc2626);"><h1>Herinnering</h1></div>
  <div class="body">
    <h2>Tot morgen, {{ .CustomerName }}!</h2>
    <p>Dit is een vriendelijke herinnering aan uw reservering:</p>
    <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <table width="100%" style="font-size: 15px; color: #334155;">
        <tr><td style="padding: 6px 0; font-weight: 600;">Datum</td><td style="padding: 6px 0;">{{ .Date }}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Tijd</td><td style="padding: 6px 0;">{{ .Time }}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Aantal gasten</td><td style="padding: 6px 0;">{{ .Guests }}</td></tr>
      </table>
    </div>
    <p><strong>{{ .RestaurantName }}</strong><br>{{ .RestaurantAddress }}</p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Kunt u niet komen? Annuleer uw reservering gratis tot 4 uur voor de afgesproken tijd.</p>
    <p style="text-align: center; margin: 16px 0;">
      <a href="{{ .CancelUrl }}" style="color: #dc2626; font-size: 13px;">Reservering annuleren</a>
    </p>
  </div>
  <div class="footer">
    <p>{{ .RestaurantName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 31. HORECA — RESERVERING GEANNULEERD (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Reservering Geannuleerd (Klant)',
    description: 'Bevestiging aan de gast dat de reservering is geannuleerd',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Reservering geannuleerd — {{ .Date }}',
    preheader: 'Uw reservering is geannuleerd',
    tags: ['horeca', 'reservation', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'Date', label: 'Datum', required: true },
      { name: 'Time', label: 'Tijd', required: true },
      { name: 'RestaurantName', label: 'Restaurantnaam', required: true },
      { name: 'RestaurantPhone', label: 'Telefoonnummer restaurant', required: true },
      { name: 'RebookUrl', label: 'Opnieuw reserveren URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #f97316, #dc2626);"><h1>Reservering Geannuleerd</h1></div>
  <div class="body">
    <h2>Reservering geannuleerd</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Uw reservering op <strong>{{ .Date }}</strong> om <strong>{{ .Time }}</strong> is geannuleerd.</p>
    <p>We vinden het jammer dat u niet kunt komen. U bent natuurlijk altijd welkom om een nieuwe reservering te maken.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .RebookUrl }}" class="btn" style="background: #f97316;">Opnieuw reserveren</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Vragen? Neem contact op met {{ .RestaurantName }} via {{ .RestaurantPhone }}.</p>
  </div>
  <div class="footer">
    <p>{{ .RestaurantName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 32. HORECA — RESERVERING GEANNULEERD (ADMIN)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Reservering Geannuleerd (Admin)',
    description: 'Notificatie aan het restaurant bij een geannuleerde reservering',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Reservering geannuleerd: {{ .CustomerName }}',
    preheader: 'Een reservering is geannuleerd',
    tags: ['horeca', 'reservation', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'CustomerEmail', label: 'E-mail klant', required: true },
      { name: 'Date', label: 'Datum', required: true },
      { name: 'Time', label: 'Tijd', required: true },
      { name: 'Guests', label: 'Aantal gasten', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #f97316, #dc2626);"><h1>Reservering Geannuleerd</h1></div>
  <div class="body">
    <h2>Reservering geannuleerd</h2>
    <p>De volgende reservering is geannuleerd:</p>
    <table width="100%" style="font-size: 15px; color: #334155; border-collapse: collapse;">
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Naam</td><td style="padding: 10px 0;">{{ .CustomerName }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">E-mail</td><td style="padding: 10px 0;">{{ .CustomerEmail }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Datum</td><td style="padding: 10px 0;">{{ .Date }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Tijd</td><td style="padding: 10px 0;">{{ .Time }}</td></tr>
      <tr><td style="padding: 10px 0; font-weight: 600;">Gasten</td><td style="padding: 10px 0;">{{ .Guests }}</td></tr>
    </table>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">De tafel is nu weer beschikbaar voor andere gasten.</p>
  </div>
  <div class="footer">
    <p>Dit is een automatisch gegenereerd bericht.</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 33. HORECA — RESERVERING GEWIJZIGD (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Reservering Gewijzigd (Klant)',
    description: 'Bevestiging aan de gast dat de reservering is gewijzigd',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Reservering gewijzigd — {{ .NewDate }} om {{ .NewTime }}',
    preheader: 'Uw reservering is gewijzigd',
    tags: ['horeca', 'reservation', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'OldDate', label: 'Oude datum', required: true },
      { name: 'OldTime', label: 'Oude tijd', required: true },
      { name: 'NewDate', label: 'Nieuwe datum', required: true },
      { name: 'NewTime', label: 'Nieuwe tijd', required: true },
      { name: 'Guests', label: 'Aantal gasten', required: true },
      { name: 'RestaurantName', label: 'Restaurantnaam', required: true },
      { name: 'ReservationUrl', label: 'Reservering URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #f97316, #dc2626);"><h1>Reservering Gewijzigd</h1></div>
  <div class="body">
    <h2>Reservering gewijzigd</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Uw reservering is succesvol gewijzigd. Hieronder vindt u de details:</p>
    <div style="background: #fee2e2; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 0; font-size: 13px; color: #991b1b;"><strong>Was:</strong> {{ .OldDate }} om {{ .OldTime }}</p>
    </div>
    <div style="background: #dcfce7; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 0; font-size: 13px; color: #166534;"><strong>Wordt:</strong> {{ .NewDate }} om {{ .NewTime }}</p>
    </div>
    <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <table width="100%" style="font-size: 15px; color: #334155;">
        <tr><td style="padding: 6px 0; font-weight: 600;">Nieuwe datum</td><td style="padding: 6px 0;">{{ .NewDate }}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Nieuwe tijd</td><td style="padding: 6px 0;">{{ .NewTime }}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Aantal gasten</td><td style="padding: 6px 0;">{{ .Guests }}</td></tr>
      </table>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ReservationUrl }}" class="btn" style="background: #f97316;">Reservering bekijken</a>
    </p>
  </div>
  <div class="footer">
    <p>{{ .RestaurantName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 34. HORECA — GROEPSRESERVERING ONTVANGEN
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Groepsreservering Ontvangen',
    description: 'Bevestiging aan de gast dat een groepsreservering (8+ gasten) is ontvangen',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Uw groepsaanvraag voor {{ .Guests }} gasten is ontvangen',
    preheader: 'Wij nemen persoonlijk contact met u op',
    tags: ['horeca', 'reservation', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'Date', label: 'Datum', required: true },
      { name: 'Time', label: 'Tijd', required: true },
      { name: 'Guests', label: 'Aantal gasten', required: true },
      { name: 'Occasion', label: 'Gelegenheid', defaultValue: '' },
      { name: 'Remarks', label: 'Opmerkingen', defaultValue: '' },
      { name: 'RestaurantName', label: 'Restaurantnaam', required: true },
      { name: 'RestaurantPhone', label: 'Telefoonnummer restaurant', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #f97316, #dc2626);"><h1>Groepsreservering Ontvangen</h1></div>
  <div class="body">
    <h2>Bedankt voor uw aanvraag!</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Wij hebben uw groepsreservering voor <strong>{{ .Guests }} gasten</strong> in goede orde ontvangen. Omdat het om een groep gaat, nemen wij persoonlijk telefonisch contact met u op om de details te bespreken.</p>
    <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <table width="100%" style="font-size: 15px; color: #334155;">
        <tr><td style="padding: 6px 0; font-weight: 600;">Gewenste datum</td><td style="padding: 6px 0;">{{ .Date }}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Gewenste tijd</td><td style="padding: 6px 0;">{{ .Time }}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Aantal gasten</td><td style="padding: 6px 0;">{{ .Guests }}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Gelegenheid</td><td style="padding: 6px 0;">{{ .Occasion }}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Opmerkingen</td><td style="padding: 6px 0;">{{ .Remarks }}</td></tr>
      </table>
    </div>
    <p>Wij streven ernaar om u binnen 24 uur te bellen. Kunt u niet wachten? Bel ons gerust op <strong>{{ .RestaurantPhone }}</strong>.</p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Let op: deze aanvraag is nog niet definitief bevestigd. U ontvangt een bevestiging nadat wij telefonisch contact hebben gehad.</p>
  </div>
  <div class="footer">
    <p>{{ .RestaurantName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 35. HORECA — REVIEW VERZOEK (NA BEZOEK)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Review Verzoek Na Bezoek (Horeca)',
    description: 'Review verzoek aan de gast na een afgerond restaurantbezoek',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Hoe was uw bezoek, {{ .CustomerName }}?',
    preheader: 'Deel uw ervaring en help andere gasten',
    tags: ['horeca', 'reservation', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'Date', label: 'Datum bezoek', required: true },
      { name: 'RestaurantName', label: 'Restaurantnaam', required: true },
      { name: 'ReviewUrl', label: 'Review URL', required: true },
      { name: 'RebookUrl', label: 'Opnieuw reserveren URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #f97316, #dc2626);"><h1>Hoe was het?</h1></div>
  <div class="body">
    <h2>Hoe was uw bezoek?</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>U bent op <strong>{{ .Date }}</strong> bij <strong>{{ .RestaurantName }}</strong> geweest. Wij hopen dat u een fijne avond heeft gehad!</p>
    <p>We horen graag hoe u het hebt ervaren. Uw review helpt ons om nog beter te worden en helpt andere gasten bij hun keuze.</p>
    <div class="stars" style="text-align: center; margin: 20px 0;">&#9733; &#9733; &#9733; &#9733; &#9733;</div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ReviewUrl }}" class="btn" style="background: #f97316;">Review schrijven</a>
    </p>
    <hr class="divider">
    <p style="text-align: center;">Tevreden? Reserveer direct uw volgende bezoek:</p>
    <p style="text-align: center; margin: 16px 0;">
      <a href="{{ .RebookUrl }}" class="btn" style="background: #dc2626;">Opnieuw reserveren</a>
    </p>
    <p style="font-size: 13px; color: #94a3b8; text-align: center;">Het schrijven van een review duurt slechts 1 minuut. Bedankt!</p>
  </div>
  <div class="footer">
    <p>{{ .RestaurantName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // ZORG BRANCH — APPOINTMENT EMAIL TEMPLATES (36–43)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 36. ZORG — AFSPRAAK BEVESTIGD (PATIËNT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Afspraak Bevestigd Patiënt (Zorg)',
    description: 'Bevestigingsmail naar de patiënt na het maken van een zorgafspraak',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Afspraak bevestigd — {{ .TreatmentName }} op {{ .Date }}',
    preheader: 'Uw afspraak is bevestigd. Hier vindt u alle details.',
    tags: ['zorg', 'appointment', 'predefined'],
    variables: [
      { name: 'PatientName', label: 'Patiëntnaam', required: true },
      { name: 'TreatmentName', label: 'Behandeling', required: true },
      { name: 'Date', label: 'Datum afspraak', required: true },
      { name: 'Time', label: 'Tijd afspraak', required: true },
      { name: 'Duration', label: 'Duur (bijv. "30 min")', defaultValue: '30 min' },
      { name: 'PractitionerName', label: 'Naam behandelaar', required: true },
      { name: 'PracticeName', label: 'Praktijknaam', defaultValue: 'Onze praktijk' },
      { name: 'PracticeAddress', label: 'Praktijkadres', defaultValue: '' },
      { name: 'Price', label: 'Tarief', defaultValue: '' },
      { name: 'InsuranceInfo', label: 'Verzekeringsinformatie', defaultValue: 'De kosten worden (gedeeltelijk) vergoed vanuit uw aanvullende verzekering.' },
      { name: 'AppointmentUrl', label: 'Afspraak bekijken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #059669, #0891b2);"><h1>{{ .PracticeName }}</h1></div>
  <div class="body">
    <h2>Uw afspraak is bevestigd</h2>
    <p>Beste {{ .PatientName }},</p>
    <p>Uw afspraak is bevestigd. Hieronder vindt u de details:</p>
    <div style="background: #ecfdf5; border-left: 4px solid #059669; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Behandeling:</strong> {{ .TreatmentName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .Date }}</p>
      <p style="margin: 0 0 8px;"><strong>Tijd:</strong> {{ .Time }}</p>
      <p style="margin: 0 0 8px;"><strong>Duur:</strong> {{ .Duration }}</p>
      <p style="margin: 0 0 8px;"><strong>Behandelaar:</strong> {{ .PractitionerName }}</p>
      <p style="margin: 0 0 8px;"><strong>Locatie:</strong> {{ .PracticeAddress }}</p>
      <p style="margin: 0;"><strong>Tarief:</strong> {{ .Price }}</p>
    </div>
    <p style="font-size: 13px; color: #6b7280;">{{ .InsuranceInfo }}</p>
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0; font-weight: 600; color: #92400e;">Tip: Kom 10 minuten voor uw afspraak. Neem een geldig identiteitsbewijs en uw verzekeringsgegevens mee.</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .AppointmentUrl }}" class="btn" style="background: #059669;">Afspraak bekijken</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Moet u uw afspraak wijzigen of annuleren? Dat kan via bovenstaande link of neem telefonisch contact met ons op.</p>
  </div>
  <div class="footer">
    <p>{{ .PracticeName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 37. ZORG — AFSPRAAK BEVESTIGD (PRAKTIJK)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Afspraak Bevestigd Praktijk (Zorg)',
    description: 'Notificatie aan de praktijk bij een nieuwe zorgafspraak',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Nieuwe afspraak: {{ .PatientName }} — {{ .TreatmentName }}',
    preheader: 'Er is een nieuwe afspraak ingepland',
    tags: ['zorg', 'appointment', 'predefined'],
    variables: [
      { name: 'PatientName', label: 'Patiëntnaam', required: true },
      { name: 'PatientEmail', label: 'E-mail patiënt', required: true },
      { name: 'PatientPhone', label: 'Telefoonnummer patiënt', defaultValue: '' },
      { name: 'BirthDate', label: 'Geboortedatum', defaultValue: '' },
      { name: 'InsuranceProvider', label: 'Zorgverzekeraar', defaultValue: '' },
      { name: 'TreatmentName', label: 'Behandeling', required: true },
      { name: 'Date', label: 'Datum afspraak', required: true },
      { name: 'Time', label: 'Tijd afspraak', required: true },
      { name: 'PractitionerName', label: 'Naam behandelaar', required: true },
      { name: 'HasReferral', label: 'Verwijzing aanwezig (ja/nee)', defaultValue: 'nee' },
      { name: 'Complaint', label: 'Klacht/reden bezoek', defaultValue: '' },
      { name: 'Remarks', label: 'Opmerkingen', defaultValue: 'Geen' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #059669, #0891b2);"><h1>Nieuwe Afspraak</h1></div>
  <div class="body">
    <h2>Nieuwe afspraak ingepland</h2>
    <p>Er is een nieuwe afspraak gemaakt via de website:</p>
    <table width="100%" style="font-size: 15px; color: #334155; border-collapse: collapse;">
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Patiënt</td><td style="padding: 10px 0;">{{ .PatientName }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">E-mail</td><td style="padding: 10px 0;">{{ .PatientEmail }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Telefoon</td><td style="padding: 10px 0;">{{ .PatientPhone }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Geboortedatum</td><td style="padding: 10px 0;">{{ .BirthDate }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Zorgverzekeraar</td><td style="padding: 10px 0;">{{ .InsuranceProvider }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Behandeling</td><td style="padding: 10px 0;">{{ .TreatmentName }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Datum</td><td style="padding: 10px 0;">{{ .Date }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Tijd</td><td style="padding: 10px 0;">{{ .Time }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Behandelaar</td><td style="padding: 10px 0;">{{ .PractitionerName }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Verwijzing</td><td style="padding: 10px 0;">{{ .HasReferral }}</td></tr>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: 600;">Klacht</td><td style="padding: 10px 0;">{{ .Complaint }}</td></tr>
      <tr><td style="padding: 10px 0; font-weight: 600;">Opmerkingen</td><td style="padding: 10px 0;">{{ .Remarks }}</td></tr>
    </table>
  </div>
  <div class="footer">
    <p>Automatische notificatie — Zorgpraktijk Admin</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 38. ZORG — AFSPRAAK HERINNERING
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Afspraak Herinnering (Zorg)',
    description: 'Herinnering aan de patiënt 1 dag voor de zorgafspraak',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Herinnering: afspraak morgen om {{ .Time }}',
    preheader: 'Vergeet uw afspraak morgen niet',
    tags: ['zorg', 'appointment', 'predefined'],
    variables: [
      { name: 'PatientName', label: 'Patiëntnaam', required: true },
      { name: 'TreatmentName', label: 'Behandeling', required: true },
      { name: 'Date', label: 'Datum afspraak', required: true },
      { name: 'Time', label: 'Tijd afspraak', required: true },
      { name: 'PractitionerName', label: 'Naam behandelaar', required: true },
      { name: 'PracticeAddress', label: 'Praktijkadres', defaultValue: '' },
      { name: 'CancelUrl', label: 'Annulerings URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #059669, #0891b2);"><h1>Herinnering</h1></div>
  <div class="body">
    <h2>Uw afspraak is morgen</h2>
    <p>Beste {{ .PatientName }},</p>
    <p>Dit is een vriendelijke herinnering aan uw afspraak van morgen.</p>
    <div style="background: #ecfdf5; border-left: 4px solid #059669; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Behandeling:</strong> {{ .TreatmentName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .Date }}</p>
      <p style="margin: 0 0 8px;"><strong>Tijd:</strong> {{ .Time }}</p>
      <p style="margin: 0 0 8px;"><strong>Behandelaar:</strong> {{ .PractitionerName }}</p>
      <p style="margin: 0;"><strong>Locatie:</strong> {{ .PracticeAddress }}</p>
    </div>
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0; font-weight: 600; color: #92400e;">Neem mee: geldig identiteitsbewijs, verzekeringsgegevens en eventuele verwijsbrief.</p>
    </div>
    <p>Er is voldoende parkeergelegenheid bij de praktijk. Wij verzoeken u 10 minuten voor aanvang aanwezig te zijn.</p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Kunt u niet komen? <a href="{{ .CancelUrl }}" style="color: #059669;">Annuleer of verzet uw afspraak</a> (gratis tot 24 uur van tevoren).</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 39. ZORG — AFSPRAAK GEANNULEERD (PATIËNT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Afspraak Geannuleerd Patiënt (Zorg)',
    description: 'Bevestiging aan de patiënt dat de zorgafspraak is geannuleerd',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Afspraak geannuleerd — {{ .TreatmentName }}',
    preheader: 'Uw afspraak is geannuleerd',
    tags: ['zorg', 'appointment', 'predefined'],
    variables: [
      { name: 'PatientName', label: 'Patiëntnaam', required: true },
      { name: 'TreatmentName', label: 'Behandeling', required: true },
      { name: 'Date', label: 'Datum afspraak', required: true },
      { name: 'PracticePhone', label: 'Telefoonnummer praktijk', defaultValue: '' },
      { name: 'RebookUrl', label: 'Opnieuw inplannen URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #059669, #0891b2);"><h1>Afspraak Geannuleerd</h1></div>
  <div class="body">
    <h2>Uw afspraak is geannuleerd</h2>
    <p>Beste {{ .PatientName }},</p>
    <p>Uw afspraak voor <strong>{{ .TreatmentName }}</strong> op <strong>{{ .Date }}</strong> is geannuleerd.</p>
    <p>Wilt u een nieuwe afspraak inplannen? Dat kan eenvoudig via de knop hieronder.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .RebookUrl }}" class="btn" style="background: #059669;">Nieuwe afspraak maken</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Heeft u vragen? Neem contact op met de praktijk via {{ .PracticePhone }}.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 40. ZORG — AFSPRAAK GEANNULEERD (PRAKTIJK)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Afspraak Geannuleerd Praktijk (Zorg)',
    description: 'Notificatie aan de praktijk bij annulering van een zorgafspraak',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Afspraak geannuleerd: {{ .PatientName }}',
    preheader: 'Een afspraak is zojuist geannuleerd',
    tags: ['zorg', 'appointment', 'predefined'],
    variables: [
      { name: 'PatientName', label: 'Patiëntnaam', required: true },
      { name: 'PatientEmail', label: 'E-mail patiënt', required: true },
      { name: 'TreatmentName', label: 'Behandeling', required: true },
      { name: 'Date', label: 'Datum afspraak', required: true },
      { name: 'PractitionerName', label: 'Naam behandelaar', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #059669, #0891b2);"><h1>Afspraak Geannuleerd</h1></div>
  <div class="body">
    <h2>Afspraak geannuleerd</h2>
    <p>De volgende afspraak is zojuist geannuleerd:</p>
    <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Patiënt:</strong> {{ .PatientName }}</p>
      <p style="margin: 0 0 8px;"><strong>E-mail:</strong> {{ .PatientEmail }}</p>
      <p style="margin: 0 0 8px;"><strong>Behandeling:</strong> {{ .TreatmentName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .Date }}</p>
      <p style="margin: 0;"><strong>Behandelaar:</strong> {{ .PractitionerName }}</p>
    </div>
    <p>Dit tijdslot is nu weer beschikbaar in de agenda.</p>
  </div>
  <div class="footer">
    <p>Automatische notificatie — Zorgpraktijk Admin</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 41. ZORG — AFSPRAAK VERZET (PATIËNT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Afspraak Verzet Patiënt (Zorg)',
    description: 'Bevestiging aan de patiënt dat de zorgafspraak is verzet naar een nieuw moment',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Afspraak verzet — {{ .TreatmentName }} op {{ .NewDate }}',
    preheader: 'Uw afspraak is verzet naar een nieuwe datum',
    tags: ['zorg', 'appointment', 'predefined'],
    variables: [
      { name: 'PatientName', label: 'Patiëntnaam', required: true },
      { name: 'TreatmentName', label: 'Behandeling', required: true },
      { name: 'OldDate', label: 'Oude datum', required: true },
      { name: 'OldTime', label: 'Oude tijd', required: true },
      { name: 'NewDate', label: 'Nieuwe datum', required: true },
      { name: 'NewTime', label: 'Nieuwe tijd', required: true },
      { name: 'PractitionerName', label: 'Naam behandelaar', required: true },
      { name: 'AppointmentUrl', label: 'Afspraak bekijken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #059669, #0891b2);"><h1>Afspraak Verzet</h1></div>
  <div class="body">
    <h2>Uw afspraak is verzet</h2>
    <p>Beste {{ .PatientName }},</p>
    <p>Uw afspraak voor <strong>{{ .TreatmentName }}</strong> is verplaatst naar een nieuw moment:</p>
    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 12px; color: #94a3b8; text-decoration: line-through;"><strong>Was:</strong> {{ .OldDate }} om {{ .OldTime }}</p>
      <p style="margin: 0; color: #059669; font-size: 17px;"><strong>Nieuw:</strong> {{ .NewDate }} om {{ .NewTime }}</p>
    </div>
    <div style="background: #ecfdf5; border-left: 4px solid #059669; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Behandeling:</strong> {{ .TreatmentName }}</p>
      <p style="margin: 0;"><strong>Behandelaar:</strong> {{ .PractitionerName }}</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .AppointmentUrl }}" class="btn" style="background: #059669;">Afspraak bekijken</a>
    </p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 42. ZORG — INTAKE FORMULIER ONTVANGEN
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Intake Formulier Ontvangen (Zorg)',
    description: 'Bevestiging aan de patiënt dat het intakeformulier is ontvangen',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Uw intake-aanvraag is ontvangen',
    preheader: 'Wij hebben uw intake-aanvraag in goede orde ontvangen',
    tags: ['zorg', 'intake', 'predefined'],
    variables: [
      { name: 'PatientName', label: 'Patiëntnaam', required: true },
      { name: 'PracticeName', label: 'Praktijknaam', defaultValue: 'Onze praktijk' },
      { name: 'WhatToExpect', label: 'Wat te verwachten', defaultValue: 'Tijdens het eerste consult bespreken wij uw klachten, doen wij een lichamelijk onderzoek en stellen wij samen een behandelplan op.' },
      { name: 'ContactPhone', label: 'Telefoonnummer praktijk', defaultValue: '' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #059669, #0891b2);"><h1>{{ .PracticeName }}</h1></div>
  <div class="body">
    <h2>Uw intake-aanvraag is ontvangen</h2>
    <p>Beste {{ .PatientName }},</p>
    <p>Wij hebben uw intake-aanvraag in goede orde ontvangen. Bedankt voor het invullen van het formulier.</p>
    <h2 style="font-size: 17px; margin-top: 28px;">Wat kunt u verwachten?</h2>
    <p>{{ .WhatToExpect }}</p>
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0; font-weight: 600; color: #92400e;">Voorbereiding: Neem een geldig identiteitsbewijs, uw verzekeringsgegevens en een eventuele verwijsbrief van uw (huis)arts mee.</p>
    </div>
    <p>Heeft u vragen of wilt u uw afspraak wijzigen? Neem dan gerust contact met ons op via <strong>{{ .ContactPhone }}</strong>.</p>
    <p>Wij kijken ernaar uit u te verwelkomen!</p>
  </div>
  <div class="footer">
    <p>{{ .PracticeName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 43. ZORG — REVIEW VERZOEK (NA BEHANDELING)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Review Verzoek Na Behandeling (Zorg)',
    description: 'Review verzoek aan de patiënt na een afgeronde zorgbehandeling',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Hoe was uw behandeling, {{ .PatientName }}?',
    preheader: 'Deel uw ervaring en help andere patiënten',
    tags: ['zorg', 'appointment', 'predefined'],
    variables: [
      { name: 'PatientName', label: 'Patiëntnaam', required: true },
      { name: 'TreatmentName', label: 'Behandeling', required: true },
      { name: 'PractitionerName', label: 'Naam behandelaar', required: true },
      { name: 'Date', label: 'Datum behandeling', required: true },
      { name: 'ReviewUrl', label: 'Review URL', required: true },
      { name: 'RebookUrl', label: 'Nieuwe afspraak URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #059669, #0891b2);"><h1>Hoe was het?</h1></div>
  <div class="body">
    <h2>Hoe was uw behandeling?</h2>
    <p>Beste {{ .PatientName }},</p>
    <p>U bent op <strong>{{ .Date }}</strong> bij <strong>{{ .PractitionerName }}</strong> geweest voor een <strong>{{ .TreatmentName }}</strong>. Wij hopen dat u tevreden bent over de behandeling.</p>
    <p>Wij horen graag hoe u het hebt ervaren. Uw review helpt ons om onze zorg te verbeteren en helpt andere patiënten bij hun keuze.</p>
    <div class="stars" style="text-align: center; margin: 20px 0;">&#9733; &#9733; &#9733; &#9733; &#9733;</div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ReviewUrl }}" class="btn" style="background: #059669;">Review schrijven</a>
    </p>
    <hr class="divider">
    <p style="text-align: center;">Heeft u een vervolgafspraak nodig? Plan deze direct in:</p>
    <p style="text-align: center; margin: 16px 0;">
      <a href="{{ .RebookUrl }}" class="btn" style="background: #0891b2;">Nieuwe afspraak maken</a>
    </p>
    <p style="font-size: 13px; color: #94a3b8; text-align: center;">Het schrijven van een review duurt slechts 1 minuut. Bedankt!</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // PUBLISHING BRANCH — CONTENT & SUBSCRIPTION TEMPLATES (44–49)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 44. PUBLISHING — NIEUW ARTIKEL GEPUBLICEERD
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Nieuw Artikel Gepubliceerd (Publishing)',
    description: 'Notificatie aan lezers wanneer een nieuw artikel is gepubliceerd',
    type: 'campaign',
    category: 'newsletter',
    defaultSubject: 'Nieuw: {{ .ArticleTitle }}',
    preheader: 'Lees het nieuwste artikel op ons platform',
    tags: ['publishing', 'content', 'predefined'],
    variables: [
      { name: 'ArticleTitle', label: 'Artikeltitel', required: true },
      { name: 'ArticleExcerpt', label: 'Artikel samenvatting', required: true },
      { name: 'ArticleUrl', label: 'Artikel URL', required: true },
      { name: 'AuthorName', label: 'Naam auteur', required: true },
      { name: 'ReadingTime', label: 'Leestijd (bijv. "5 min")', defaultValue: '5 min' },
      { name: 'CategoryName', label: 'Categorie', defaultValue: '' },
      { name: 'SiteName', label: 'Sitenaam', defaultValue: 'Ons platform' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #7c3aed, #2563eb);"><h1>{{ .SiteName }}</h1></div>
  <div class="body">
    <div style="background: #f5f3ff; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 13px; color: #7c3aed; font-weight: 600;">NIEUW ARTIKEL</p>
    </div>
    <h2>{{ .ArticleTitle }}</h2>
    <p>{{ .ArticleExcerpt }}</p>
    <div style="background: #f5f3ff; border-left: 4px solid #7c3aed; padding: 12px 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0; font-size: 13px; color: #6b7280;">Door <strong>{{ .AuthorName }}</strong> &middot; {{ .ReadingTime }} leestijd &middot; {{ .CategoryName }}</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ArticleUrl }}" class="btn" style="background: #7c3aed;">Lees het artikel</a>
    </p>
  </div>
  <div class="footer">
    <p>{{ .SiteName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 45. PUBLISHING — WEKELIJKSE CONTENT DIGEST
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Wekelijkse Content Digest (Publishing)',
    description: 'Wekelijks overzicht van nieuwe artikelen voor lezers',
    type: 'campaign',
    category: 'newsletter',
    defaultSubject: 'Deze week op {{ .SiteName }}: {{ .ArticleCount }} nieuwe artikelen',
    preheader: 'De beste artikelen van deze week op een rij',
    tags: ['publishing', 'content', 'predefined'],
    variables: [
      { name: 'SiteName', label: 'Sitenaam', defaultValue: 'Ons platform' },
      { name: 'ArticleCount', label: 'Aantal artikelen', required: true },
      { name: 'Article1Title', label: 'Artikel 1 titel', required: true },
      { name: 'Article1Url', label: 'Artikel 1 URL', required: true },
      { name: 'Article1Excerpt', label: 'Artikel 1 samenvatting', required: true },
      { name: 'Article2Title', label: 'Artikel 2 titel', required: true },
      { name: 'Article2Url', label: 'Artikel 2 URL', required: true },
      { name: 'Article2Excerpt', label: 'Artikel 2 samenvatting', required: true },
      { name: 'Article3Title', label: 'Artikel 3 titel', required: true },
      { name: 'Article3Url', label: 'Artikel 3 URL', required: true },
      { name: 'Article3Excerpt', label: 'Artikel 3 samenvatting', required: true },
      { name: 'UnsubscribeUrl', label: 'Uitschrijf URL', defaultValue: '{{ .UnsubscribeURL }}' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #7c3aed, #2563eb);"><h1>{{ .SiteName }}</h1></div>
  <div class="body">
    <h2>Deze week: {{ .ArticleCount }} nieuwe artikelen</h2>
    <p>Hoi {{ .Subscriber.Name }},</p>
    <p>Hier is je wekelijkse overzicht van de nieuwste content op {{ .SiteName }}:</p>
    <div style="background: #f5f3ff; border-left: 4px solid #7c3aed; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <h3 style="margin: 0 0 8px; font-size: 16px;"><a href="{{ .Article1Url }}" style="color: #7c3aed; text-decoration: none;">{{ .Article1Title }}</a></h3>
      <p style="margin: 0; font-size: 14px; color: #6b7280;">{{ .Article1Excerpt }}</p>
    </div>
    <div style="background: #f5f3ff; border-left: 4px solid #7c3aed; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <h3 style="margin: 0 0 8px; font-size: 16px;"><a href="{{ .Article2Url }}" style="color: #7c3aed; text-decoration: none;">{{ .Article2Title }}</a></h3>
      <p style="margin: 0; font-size: 14px; color: #6b7280;">{{ .Article2Excerpt }}</p>
    </div>
    <div style="background: #f5f3ff; border-left: 4px solid #7c3aed; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <h3 style="margin: 0 0 8px; font-size: 16px;"><a href="{{ .Article3Url }}" style="color: #7c3aed; text-decoration: none;">{{ .Article3Title }}</a></h3>
      <p style="margin: 0; font-size: 14px; color: #6b7280;">{{ .Article3Excerpt }}</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .Article1Url }}" class="btn" style="background: #7c3aed;">Bekijk alle artikelen</a>
    </p>
  </div>
  <div class="footer">
    <p>{{ .SiteName }} &mdash; <a href="{{ .UnsubscribeUrl }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 46. PUBLISHING — PREMIUM ARTIKEL BESCHIKBAAR
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Premium Artikel Beschikbaar (Publishing)',
    description: 'Notificatie aan premium abonnees over nieuw exclusief artikel',
    type: 'campaign',
    category: 'promotional',
    defaultSubject: 'Exclusief voor abonnees: {{ .ArticleTitle }}',
    preheader: 'Nieuw premium artikel beschikbaar in je abonnement',
    tags: ['publishing', 'premium', 'predefined'],
    variables: [
      { name: 'SubscriberName', label: 'Naam abonnee', required: true },
      { name: 'ArticleTitle', label: 'Artikeltitel', required: true },
      { name: 'ArticleExcerpt', label: 'Artikel samenvatting', required: true },
      { name: 'ArticleUrl', label: 'Artikel URL', required: true },
      { name: 'AuthorName', label: 'Naam auteur', required: true },
      { name: 'SiteName', label: 'Sitenaam', defaultValue: 'Ons platform' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #7c3aed, #2563eb);"><h1>{{ .SiteName }}</h1></div>
  <div class="body">
    <div style="background: #f5f3ff; border: 2px solid #7c3aed; border-radius: 8px; padding: 12px 16px; text-align: center; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 13px; color: #7c3aed; font-weight: 700;">PREMIUM CONTENT</p>
    </div>
    <h2>{{ .ArticleTitle }}</h2>
    <p>Beste {{ .SubscriberName }},</p>
    <p>Er is een nieuw premium artikel beschikbaar, exclusief voor abonnees:</p>
    <p>{{ .ArticleExcerpt }}</p>
    <div style="background: #f5f3ff; border-left: 4px solid #7c3aed; padding: 12px 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0; font-size: 13px; color: #6b7280;">Door <strong>{{ .AuthorName }}</strong></p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ArticleUrl }}" class="btn" style="background: #7c3aed;">Lees als premium abonnee</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Als premium abonnee geniet je van exclusieve artikelen, de digitale bibliotheek en toegang tot de volledige kennisbank.</p>
  </div>
  <div class="footer">
    <p>{{ .SiteName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 47. PUBLISHING — ABONNEMENT WELKOM
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Abonnement Welkom (Publishing)',
    description: 'Welkomstmail voor nieuwe premium abonnees',
    type: 'transactional',
    category: 'welcome',
    defaultSubject: 'Welkom bij {{ .SiteName }} Premium!',
    preheader: 'Je premium abonnement is geactiveerd',
    tags: ['publishing', 'subscription', 'predefined'],
    variables: [
      { name: 'SubscriberName', label: 'Naam abonnee', required: true },
      { name: 'SiteName', label: 'Sitenaam', defaultValue: 'Ons platform' },
      { name: 'PlanName', label: 'Abonnementsnaam', required: true },
      { name: 'BillingPeriod', label: 'Facturatieperiode', defaultValue: 'maandelijks' },
      { name: 'NextBillingDate', label: 'Volgende factuurdatum', required: true },
      { name: 'LibraryUrl', label: 'Digitale bibliotheek URL', required: true },
      { name: 'KnowledgeBaseUrl', label: 'Kennisbank URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #7c3aed, #2563eb);"><h1>Welkom, Premium!</h1></div>
  <div class="body">
    <h2>Welkom bij {{ .SiteName }} Premium!</h2>
    <p>Beste {{ .SubscriberName }},</p>
    <p>Bedankt voor je premium abonnement! Je hebt nu toegang tot al onze exclusieve content.</p>
    <div style="background: #f5f3ff; border-left: 4px solid #7c3aed; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Abonnement:</strong> {{ .PlanName }}</p>
      <p style="margin: 0 0 8px;"><strong>Facturatie:</strong> {{ .BillingPeriod }}</p>
      <p style="margin: 0;"><strong>Volgende factuurdatum:</strong> {{ .NextBillingDate }}</p>
    </div>
    <h3 style="font-size: 17px; margin-top: 28px;">Dit is wat je krijgt:</h3>
    <ul>
      <li><strong>Premium content</strong> — Exclusieve artikelen en diepgaande analyses</li>
      <li><strong>Digitale bibliotheek</strong> — Toegang tot alle tijdschriften en edities</li>
      <li><strong>Kennisbank</strong> — Volledige toegang tot handleidingen en how-to guides</li>
    </ul>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .LibraryUrl }}" class="btn" style="background: #7c3aed;">Naar de bibliotheek</a>
    </p>
    <p style="text-align: center; margin: 16px 0;">
      <a href="{{ .KnowledgeBaseUrl }}" class="btn" style="background: #2563eb;">Naar de kennisbank</a>
    </p>
  </div>
  <div class="footer">
    <p>{{ .SiteName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 48. PUBLISHING — ABONNEMENT VERLENGD
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Abonnement Verlengd (Publishing)',
    description: 'Bevestiging dat het abonnement is verlengd met facturatiedetails',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Uw abonnement is verlengd \u2014 {{ .PlanName }}',
    preheader: 'Uw abonnement is succesvol verlengd',
    tags: ['publishing', 'subscription', 'predefined'],
    variables: [
      { name: 'SubscriberName', label: 'Naam abonnee', required: true },
      { name: 'PlanName', label: 'Abonnementsnaam', required: true },
      { name: 'BillingPeriod', label: 'Facturatieperiode', defaultValue: 'maandelijks' },
      { name: 'Amount', label: 'Bedrag', required: true },
      { name: 'NextBillingDate', label: 'Volgende factuurdatum', required: true },
      { name: 'InvoiceUrl', label: 'Factuur URL', required: true },
      { name: 'AccountUrl', label: 'Account URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #7c3aed, #2563eb);"><h1>Abonnement Verlengd</h1></div>
  <div class="body">
    <h2>Uw abonnement is verlengd</h2>
    <p>Beste {{ .SubscriberName }},</p>
    <p>Uw abonnement is succesvol verlengd. Hieronder vindt u de details:</p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Abonnement:</strong> {{ .PlanName }}</p>
      <p style="margin: 0 0 8px;"><strong>Periode:</strong> {{ .BillingPeriod }}</p>
      <p style="margin: 0 0 8px;"><strong>Bedrag:</strong> {{ .Amount }}</p>
      <p style="margin: 0;"><strong>Volgende factuurdatum:</strong> {{ .NextBillingDate }}</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .InvoiceUrl }}" class="btn" style="background: #7c3aed;">Factuur bekijken</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8; text-align: center;">Wilt u uw abonnement beheren? Ga naar <a href="{{ .AccountUrl }}" style="color: #7c3aed;">uw account</a>.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 49. PUBLISHING — NIEUWE MAGAZINE EDITIE
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Nieuwe Magazine Editie (Publishing)',
    description: 'Notificatie aan abonnees wanneer een nieuwe magazine editie beschikbaar is',
    type: 'campaign',
    category: 'newsletter',
    defaultSubject: 'Nieuwe editie: {{ .MagazineTitle }} \u2014 {{ .EditionTitle }}',
    preheader: 'De nieuwste editie staat klaar in je digitale bibliotheek',
    tags: ['publishing', 'magazine', 'predefined'],
    variables: [
      { name: 'SubscriberName', label: 'Naam abonnee', required: true },
      { name: 'MagazineTitle', label: 'Tijdschrifttitel', required: true },
      { name: 'EditionTitle', label: 'Editietitel', required: true },
      { name: 'EditionNumber', label: 'Editienummer', required: true },
      { name: 'CoverImageUrl', label: 'Cover afbeelding URL', defaultValue: '' },
      { name: 'LibraryUrl', label: 'Digitale bibliotheek URL', required: true },
      { name: 'SiteName', label: 'Sitenaam', defaultValue: 'Ons platform' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #7c3aed, #2563eb);"><h1>{{ .SiteName }}</h1></div>
  <div class="body">
    <div style="background: #f5f3ff; border: 2px solid #7c3aed; border-radius: 8px; padding: 12px 16px; text-align: center; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 13px; color: #7c3aed; font-weight: 700;">NIEUWE EDITIE</p>
    </div>
    <h2>{{ .MagazineTitle }} &mdash; {{ .EditionTitle }}</h2>
    <p>Beste {{ .SubscriberName }},</p>
    <p>Er is een nieuwe editie van <strong>{{ .MagazineTitle }}</strong> beschikbaar in je digitale bibliotheek!</p>
    <div style="text-align: center; margin: 24px 0;">
      <img src="{{ .CoverImageUrl }}" alt="{{ .MagazineTitle }}" style="max-width: 280px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    </div>
    <div style="background: #f5f3ff; border-left: 4px solid #7c3aed; padding: 12px 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Editie:</strong> {{ .EditionNumber }}</p>
      <p style="margin: 0;"><strong>Titel:</strong> {{ .EditionTitle }}</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .LibraryUrl }}" class="btn" style="background: #7c3aed;">Lees in de bibliotheek</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8; text-align: center;">Deze editie is beschikbaar voor alle actieve abonnees.</p>
  </div>
  <div class="footer">
    <p>{{ .SiteName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // AUTOMOTIVE BRANCH — WORKSHOP & VEHICLE TEMPLATES (50–57)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 50. AUTOMOTIVE — WERKPLAATSAFSPRAAK BEVESTIGD (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Werkplaatsafspraak Bevestigd Klant (Automotive)',
    description: 'Bevestigingsmail naar de klant na het boeken van een werkplaatsafspraak',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Afspraak bevestigd — {{ .ServiceName }} op {{ .Date }}',
    preheader: 'Uw werkplaatsafspraak is bevestigd',
    tags: ['automotive', 'workshop', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceName', label: 'Dienst', required: true },
      { name: 'Date', label: 'Datum', required: true },
      { name: 'Time', label: 'Tijd', required: true },
      { name: 'LicensePlate', label: 'Kenteken', required: true },
      { name: 'VehicleInfo', label: 'Voertuiggegevens', required: true },
      { name: 'GarageName', label: 'Werkplaatsnaam', defaultValue: 'Onze werkplaats' },
      { name: 'GarageAddress', label: 'Werkplaatsadres', required: true },
      { name: 'CancelUrl', label: 'Annuleer URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #FF5722, #E65100);"><h1>{{ .GarageName }}</h1></div>
  <div class="body">
    <h2>Uw afspraak is bevestigd</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Uw werkplaatsafspraak is succesvol ingepland. Hieronder vindt u de details:</p>
    <div style="background: #FFF3E0; border-left: 4px solid #FF5722; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <table width="100%" style="font-size: 15px; color: #334155;">
        <tr><td style="padding: 6px 0; font-weight: 600;">Dienst</td><td style="padding: 6px 0;">{{ .ServiceName }}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Datum</td><td style="padding: 6px 0;">{{ .Date }}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Tijd</td><td style="padding: 6px 0;">{{ .Time }}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Voertuig</td><td style="padding: 6px 0;">{{ .VehicleInfo }}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Kenteken</td><td style="padding: 6px 0;">{{ .LicensePlate }}</td></tr>
      </table>
    </div>
    <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0 0 8px; font-weight: 600;">Wat meenemen?</p>
      <ul style="margin: 0; padding-left: 20px; color: #334155;">
        <li>Uw rijbewijs</li>
        <li>Kentekenbewijs (overschrijvingsbewijs)</li>
        <li>Eventuele reservesleutels</li>
      </ul>
    </div>
    <p><strong>Locatie:</strong> {{ .GarageAddress }}</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .CancelUrl }}" style="color: #FF5722; font-size: 13px;">Afspraak annuleren of wijzigen</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">U kunt gratis annuleren tot 24 uur voor de afspraak.</p>
  </div>
  <div class="footer">
    <p>{{ .GarageName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 51. AUTOMOTIVE — WERKPLAATSAFSPRAAK BEVESTIGD (WERKPLAATS)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Werkplaatsafspraak Bevestigd Werkplaats (Automotive)',
    description: 'Notificatie aan de werkplaats bij een nieuwe werkplaatsafspraak',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Nieuwe afspraak: {{ .CustomerName }} — {{ .ServiceName }}',
    preheader: 'Er is een nieuwe werkplaatsafspraak geboekt',
    tags: ['automotive', 'workshop', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'CustomerEmail', label: 'E-mail klant', required: true },
      { name: 'CustomerPhone', label: 'Telefoonnummer klant', defaultValue: '' },
      { name: 'ServiceName', label: 'Dienst', required: true },
      { name: 'Date', label: 'Datum', required: true },
      { name: 'Time', label: 'Tijd', required: true },
      { name: 'LicensePlate', label: 'Kenteken', required: true },
      { name: 'VehicleBrand', label: 'Merk', required: true },
      { name: 'VehicleModel', label: 'Model', required: true },
      { name: 'Remarks', label: 'Opmerkingen klant', defaultValue: 'Geen' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #FF5722, #E65100);"><h1>Nieuwe Werkplaatsafspraak</h1></div>
  <div class="body">
    <h2>Nieuwe afspraak ontvangen</h2>
    <p>Er is een nieuwe werkplaatsafspraak geboekt via de website:</p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Klant:</strong> {{ .CustomerName }}</p>
      <p style="margin: 0 0 8px;"><strong>E-mail:</strong> {{ .CustomerEmail }}</p>
      <p style="margin: 0 0 8px;"><strong>Telefoon:</strong> {{ .CustomerPhone }}</p>
      <hr class="divider">
      <p style="margin: 0 0 8px;"><strong>Dienst:</strong> {{ .ServiceName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .Date }}</p>
      <p style="margin: 0 0 8px;"><strong>Tijd:</strong> {{ .Time }}</p>
      <p style="margin: 0 0 8px;"><strong>Voertuig:</strong> {{ .VehicleBrand }} {{ .VehicleModel }}</p>
      <p style="margin: 0 0 8px;"><strong>Kenteken:</strong> {{ .LicensePlate }}</p>
      <p style="margin: 0;"><strong>Opmerkingen:</strong> {{ .Remarks }}</p>
    </div>
  </div>
  <div class="footer">
    <p>Automatische notificatie — Werkplaats Admin</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 52. AUTOMOTIVE — WERKPLAATSAFSPRAAK HERINNERING
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Werkplaatsafspraak Herinnering (Automotive)',
    description: 'Herinnering aan de klant 1 dag voor de werkplaatsafspraak',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Herinnering: afspraak morgen om {{ .Time }}',
    preheader: 'Niet vergeten: uw werkplaatsafspraak is morgen!',
    tags: ['automotive', 'workshop', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceName', label: 'Dienst', required: true },
      { name: 'Date', label: 'Datum', required: true },
      { name: 'Time', label: 'Tijd', required: true },
      { name: 'LicensePlate', label: 'Kenteken', required: true },
      { name: 'GarageAddress', label: 'Werkplaatsadres', required: true },
      { name: 'CancelUrl', label: 'Annuleer URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #FF5722, #E65100);"><h1>Afspraak Herinnering</h1></div>
  <div class="body">
    <div style="background: #FFF3E0; border: 2px solid #FF5722; border-radius: 8px; padding: 12px 16px; text-align: center; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 13px; color: #E65100; font-weight: 700;">HERINNERING: MORGEN</p>
    </div>
    <h2>Uw afspraak is morgen</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Dit is een herinnering dat u morgen een werkplaatsafspraak heeft:</p>
    <div style="background: #FFF3E0; border-left: 4px solid #FF5722; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Dienst:</strong> {{ .ServiceName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .Date }}</p>
      <p style="margin: 0 0 8px;"><strong>Tijd:</strong> {{ .Time }}</p>
      <p style="margin: 0 0 8px;"><strong>Kenteken:</strong> {{ .LicensePlate }}</p>
      <p style="margin: 0;"><strong>Locatie:</strong> {{ .GarageAddress }}</p>
    </div>
    <p style="font-size: 13px; color: #6b7280;">Vergeet niet uw rijbewijs en kentekenbewijs mee te nemen.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .CancelUrl }}" style="color: #FF5722; font-size: 13px;">Afspraak annuleren of wijzigen</a>
    </p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 53. AUTOMOTIVE — WERKPLAATSAFSPRAAK GEANNULEERD (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Werkplaatsafspraak Geannuleerd Klant (Automotive)',
    description: 'Bevestiging aan de klant dat de werkplaatsafspraak is geannuleerd',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Afspraak geannuleerd — {{ .ServiceName }}',
    preheader: 'Uw werkplaatsafspraak is geannuleerd',
    tags: ['automotive', 'workshop', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceName', label: 'Dienst', required: true },
      { name: 'Date', label: 'Oorspronkelijke datum', required: true },
      { name: 'GaragePhone', label: 'Telefoonnummer werkplaats', required: true },
      { name: 'RebookUrl', label: 'Opnieuw boeken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #FF5722, #E65100);"><h1>Afspraak Geannuleerd</h1></div>
  <div class="body">
    <h2>Uw afspraak is geannuleerd</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Uw werkplaatsafspraak voor <strong>{{ .ServiceName }}</strong> op {{ .Date }} is geannuleerd.</p>
    <p>Wilt u toch een afspraak inplannen? Dat kan eenvoudig via onderstaande knop of telefonisch.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .RebookUrl }}" class="btn" style="background: #FF5722;">Opnieuw inplannen</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Heeft u vragen? Bel ons op {{ .GaragePhone }}.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 54. AUTOMOTIVE — PROEFRIT AANVRAAG ONTVANGEN (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Proefrit Aanvraag Ontvangen (Automotive)',
    description: 'Bevestiging aan de klant dat de proefritaanvraag is ontvangen',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Uw proefrit-aanvraag is ontvangen — {{ .VehicleName }}',
    preheader: 'Wij nemen contact met u op om de proefrit te plannen',
    tags: ['automotive', 'test-drive', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'VehicleName', label: 'Voertuignaam', required: true },
      { name: 'VehiclePrice', label: 'Vraagprijs', defaultValue: '' },
      { name: 'PreferredDate', label: 'Voorkeursdatum', defaultValue: '' },
      { name: 'DealerName', label: 'Dealernaam', defaultValue: 'Ons autobedrijf' },
      { name: 'DealerPhone', label: 'Telefoonnummer dealer', required: true },
      { name: 'DealerAddress', label: 'Dealeradres', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #FF5722, #E65100);"><h1>{{ .DealerName }}</h1></div>
  <div class="body">
    <div style="background: #FFF3E0; border: 2px solid #FF5722; border-radius: 8px; padding: 12px 16px; text-align: center; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 13px; color: #E65100; font-weight: 700;">PROEFRIT-AANVRAAG ONTVANGEN</p>
    </div>
    <h2>Bedankt voor uw aanvraag!</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Wij hebben uw proefrit-aanvraag ontvangen voor de <strong>{{ .VehicleName }}</strong>. Wij nemen zo snel mogelijk contact met u op om een afspraak in te plannen.</p>
    <div style="background: #FFF3E0; border-left: 4px solid #FF5722; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Voertuig:</strong> {{ .VehicleName }}</p>
      <p style="margin: 0 0 8px;"><strong>Vraagprijs:</strong> {{ .VehiclePrice }}</p>
      <p style="margin: 0;"><strong>Voorkeursdatum:</strong> {{ .PreferredDate }}</p>
    </div>
    <p><strong>Bezoekadres:</strong> {{ .DealerAddress }}</p>
    <p>Heeft u vragen? Bel ons op <strong>{{ .DealerPhone }}</strong>.</p>
  </div>
  <div class="footer">
    <p>{{ .DealerName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 55. AUTOMOTIVE — PROEFRIT AANVRAAG (DEALER)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Proefrit Aanvraag Dealer (Automotive)',
    description: 'Notificatie aan de dealer bij een nieuwe proefritaanvraag',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Nieuwe proefrit-aanvraag: {{ .CustomerName }} — {{ .VehicleName }}',
    preheader: 'Er is een nieuwe proefrit-aanvraag ontvangen',
    tags: ['automotive', 'test-drive', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'CustomerEmail', label: 'E-mail klant', required: true },
      { name: 'CustomerPhone', label: 'Telefoonnummer klant', defaultValue: '' },
      { name: 'VehicleName', label: 'Voertuignaam', required: true },
      { name: 'VehiclePrice', label: 'Vraagprijs', defaultValue: '' },
      { name: 'PreferredDate', label: 'Voorkeursdatum', defaultValue: '' },
      { name: 'PreferredTime', label: 'Voorkeurstijd', defaultValue: '' },
      { name: 'Remarks', label: 'Opmerkingen klant', defaultValue: 'Geen' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #FF5722, #E65100);"><h1>Nieuwe Proefrit-aanvraag</h1></div>
  <div class="body">
    <h2>Proefrit-aanvraag ontvangen</h2>
    <p>Er is een nieuwe proefrit-aanvraag ontvangen via de website:</p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Klant:</strong> {{ .CustomerName }}</p>
      <p style="margin: 0 0 8px;"><strong>E-mail:</strong> {{ .CustomerEmail }}</p>
      <p style="margin: 0 0 8px;"><strong>Telefoon:</strong> {{ .CustomerPhone }}</p>
      <hr class="divider">
      <p style="margin: 0 0 8px;"><strong>Voertuig:</strong> {{ .VehicleName }}</p>
      <p style="margin: 0 0 8px;"><strong>Vraagprijs:</strong> {{ .VehiclePrice }}</p>
      <p style="margin: 0 0 8px;"><strong>Voorkeursdatum:</strong> {{ .PreferredDate }}</p>
      <p style="margin: 0 0 8px;"><strong>Voorkeurstijd:</strong> {{ .PreferredTime }}</p>
      <p style="margin: 0;"><strong>Opmerkingen:</strong> {{ .Remarks }}</p>
    </div>
  </div>
  <div class="footer">
    <p>Automatische notificatie — Dealer Admin</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 56. AUTOMOTIVE — INRUIL AANVRAAG ONTVANGEN
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Inruil Aanvraag Ontvangen (Automotive)',
    description: 'Bevestiging aan de klant dat de inruilaanvraag is ontvangen',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Uw inruil-aanvraag is ontvangen',
    preheader: 'Wij beoordelen uw inruilverzoek en nemen contact op',
    tags: ['automotive', 'trade-in', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'LicensePlate', label: 'Kenteken', required: true },
      { name: 'VehicleBrand', label: 'Merk', required: true },
      { name: 'VehicleModel', label: 'Model', required: true },
      { name: 'Mileage', label: 'Kilometerstand', required: true },
      { name: 'Condition', label: 'Staat voertuig', defaultValue: '' },
      { name: 'DealerName', label: 'Dealernaam', defaultValue: 'Ons autobedrijf' },
      { name: 'DealerPhone', label: 'Telefoonnummer dealer', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #FF5722, #E65100);"><h1>{{ .DealerName }}</h1></div>
  <div class="body">
    <div style="background: #FFF3E0; border: 2px solid #FF5722; border-radius: 8px; padding: 12px 16px; text-align: center; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 13px; color: #E65100; font-weight: 700;">INRUIL-AANVRAAG ONTVANGEN</p>
    </div>
    <h2>Bedankt voor uw inruilverzoek</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Wij hebben uw inruil-aanvraag ontvangen. Onze specialisten beoordelen uw voertuiggegevens en nemen zo snel mogelijk contact met u op met een voorstel.</p>
    <div style="background: #FFF3E0; border-left: 4px solid #FF5722; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Merk:</strong> {{ .VehicleBrand }}</p>
      <p style="margin: 0 0 8px;"><strong>Model:</strong> {{ .VehicleModel }}</p>
      <p style="margin: 0 0 8px;"><strong>Kenteken:</strong> {{ .LicensePlate }}</p>
      <p style="margin: 0 0 8px;"><strong>Kilometerstand:</strong> {{ .Mileage }}</p>
      <p style="margin: 0;"><strong>Staat:</strong> {{ .Condition }}</p>
    </div>
    <p>Heeft u vragen? Bel ons op <strong>{{ .DealerPhone }}</strong>.</p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Wij streven ernaar om binnen 2 werkdagen een indicatie te geven van de inruilwaarde.</p>
  </div>
  <div class="footer">
    <p>{{ .DealerName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 57. AUTOMOTIVE — APK HERINNERING
  // ═══════════════════════════════════════════════════════════
  {
    name: 'APK Herinnering (Automotive)',
    description: 'Herinnering aan de klant dat de APK-keuring verloopt of verlopen is',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'APK verlopen of bijna verlopen — {{ .VehicleName }}',
    preheader: 'Plan uw APK-keuring tijdig in',
    tags: ['automotive', 'apk', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'VehicleName', label: 'Voertuignaam', required: true },
      { name: 'LicensePlate', label: 'Kenteken', required: true },
      { name: 'ApkExpiryDate', label: 'APK-verloopdatum', required: true },
      { name: 'GarageName', label: 'Werkplaatsnaam', defaultValue: 'Onze werkplaats' },
      { name: 'BookingUrl', label: 'Boekings-URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #FF5722, #E65100);"><h1>{{ .GarageName }}</h1></div>
  <div class="body">
    <div style="background: #FFF3E0; border: 2px solid #FF5722; border-radius: 8px; padding: 12px 16px; text-align: center; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 13px; color: #E65100; font-weight: 700;">APK HERINNERING</p>
    </div>
    <h2>Uw APK verloopt binnenkort</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>De APK-keuring van uw <strong>{{ .VehicleName }}</strong> ({{ .LicensePlate }}) verloopt op <strong>{{ .ApkExpiryDate }}</strong>. Zonder geldige APK mag u niet de weg op.</p>
    <div style="background: #FFF3E0; border-left: 4px solid #FF5722; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Voertuig:</strong> {{ .VehicleName }}</p>
      <p style="margin: 0 0 8px;"><strong>Kenteken:</strong> {{ .LicensePlate }}</p>
      <p style="margin: 0;"><strong>APK verloopt:</strong> {{ .ApkExpiryDate }}</p>
    </div>
    <p>Plan uw APK-keuring snel en eenvoudig in via onderstaande knop:</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .BookingUrl }}" class="btn" style="background: #FF5722;">Plan uw APK-keuring</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Tip: u mag uw auto al 2 maanden voor de verloopdatum laten keuren, zonder dat u keuringstijd verliest.</p>
  </div>
  <div class="footer">
    <p>{{ .GarageName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // TOERISME BRANCH — BOOKING & TRAVEL TEMPLATES (58–65)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 58. TOERISME — BOEKINGSBEVESTIGING (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Boekingsbevestiging (Klant)',
    description: 'Bevestigingsmail naar de klant na het boeken van een reis',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Uw reis is geboekt — {{ .TourName }}',
    preheader: 'Uw reis is bevestigd! Hier zijn alle details.',
    tags: ['toerisme', 'reizen', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'TourName', label: 'Reisnaam', required: true },
      { name: 'Destination', label: 'Bestemming', required: true },
      { name: 'DepartureDate', label: 'Vertrekdatum', required: true },
      { name: 'ReturnDate', label: 'Retourdatum', required: true },
      { name: 'Duration', label: 'Duur (bijv. "8 dagen")', required: true },
      { name: 'Travelers', label: 'Aantal reizigers', required: true },
      { name: 'TotalPrice', label: 'Totaalprijs', required: true },
      { name: 'IncludedItems', label: 'Inbegrepen items', defaultValue: '' },
      { name: 'BookingNumber', label: 'Boekingsnummer', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #00BCD4, #0097A7);"><h1>Reis Geboekt!</h1></div>
  <div class="body">
    <h2>Uw reis is bevestigd!</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Wat leuk dat u met ons op reis gaat! Hieronder vindt u de details van uw boeking:</p>
    <div style="background: #E0F7FA; border-left: 4px solid #00BCD4; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Boekingsnummer:</strong> {{ .BookingNumber }}</p>
      <p style="margin: 0 0 8px;"><strong>Reis:</strong> {{ .TourName }}</p>
      <p style="margin: 0 0 8px;"><strong>Bestemming:</strong> {{ .Destination }}</p>
      <p style="margin: 0 0 8px;"><strong>Vertrek:</strong> {{ .DepartureDate }}</p>
      <p style="margin: 0 0 8px;"><strong>Retour:</strong> {{ .ReturnDate }}</p>
      <p style="margin: 0 0 8px;"><strong>Duur:</strong> {{ .Duration }}</p>
      <p style="margin: 0 0 8px;"><strong>Aantal reizigers:</strong> {{ .Travelers }}</p>
      <p style="margin: 0;"><strong>Totaalprijs:</strong> {{ .TotalPrice }}</p>
    </div>
    <p><strong>Inbegrepen:</strong> {{ .IncludedItems }}</p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">U ontvangt 7 dagen voor vertrek een herinneringsmail met praktische informatie en een paklijst. Bij vragen kunt u altijd contact opnemen met uw reisadviseur.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 59. TOERISME — BOEKINGSBEVESTIGING (ADMIN)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Boekingsbevestiging (Admin)',
    description: 'Notificatie aan de admin bij een nieuwe reisboeking',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Nieuwe boeking: {{ .CustomerName }} — {{ .TourName }}',
    preheader: 'Er is een nieuwe reisboeking ontvangen',
    tags: ['toerisme', 'reizen', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'CustomerEmail', label: 'E-mail klant', required: true },
      { name: 'CustomerPhone', label: 'Telefoonnummer klant', defaultValue: '' },
      { name: 'TourName', label: 'Reisnaam', required: true },
      { name: 'Destination', label: 'Bestemming', required: true },
      { name: 'DepartureDate', label: 'Vertrekdatum', required: true },
      { name: 'Travelers', label: 'Aantal reizigers', required: true },
      { name: 'TotalPrice', label: 'Totaalprijs', required: true },
      { name: 'TravelInsurance', label: 'Reisverzekering (ja/nee)', defaultValue: 'nee' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #00BCD4, #0097A7);"><h1>Nieuwe Boeking</h1></div>
  <div class="body">
    <h2>Nieuwe reisboeking ontvangen</h2>
    <p>Er is een nieuwe reisboeking ontvangen via de website:</p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Klant:</strong> {{ .CustomerName }}</p>
      <p style="margin: 0 0 8px;"><strong>E-mail:</strong> {{ .CustomerEmail }}</p>
      <p style="margin: 0 0 8px;"><strong>Telefoon:</strong> {{ .CustomerPhone }}</p>
      <hr class="divider">
      <p style="margin: 0 0 8px;"><strong>Reis:</strong> {{ .TourName }}</p>
      <p style="margin: 0 0 8px;"><strong>Bestemming:</strong> {{ .Destination }}</p>
      <p style="margin: 0 0 8px;"><strong>Vertrekdatum:</strong> {{ .DepartureDate }}</p>
      <p style="margin: 0 0 8px;"><strong>Reizigers:</strong> {{ .Travelers }}</p>
      <p style="margin: 0 0 8px;"><strong>Totaalprijs:</strong> {{ .TotalPrice }}</p>
      <p style="margin: 0;"><strong>Reisverzekering:</strong> {{ .TravelInsurance }}</p>
    </div>
  </div>
  <div class="footer">
    <p>Automatische notificatie — Reisbureau Admin</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 60. TOERISME — BOEKING GEANNULEERD (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Boeking Geannuleerd (Klant)',
    description: 'Bevestiging van annulering van een reisboeking naar de klant',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Boeking geannuleerd — {{ .TourName }}',
    preheader: 'Uw boeking is geannuleerd',
    tags: ['toerisme', 'reizen', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'TourName', label: 'Reisnaam', required: true },
      { name: 'DepartureDate', label: 'Vertrekdatum', required: true },
      { name: 'RefundInfo', label: 'Restitutie-informatie', defaultValue: 'Neem contact op voor meer informatie.' },
      { name: 'RebookUrl', label: 'Opnieuw boeken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #00BCD4, #0097A7);"><h1>Boeking Geannuleerd</h1></div>
  <div class="body">
    <h2>Uw boeking is geannuleerd</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Uw boeking voor <strong>{{ .TourName }}</strong> met vertrekdatum {{ .DepartureDate }} is geannuleerd.</p>
    <div style="background: #FFF3E0; border-left: 4px solid #FF9800; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0;"><strong>Restitutie:</strong> {{ .RefundInfo }}</p>
    </div>
    <p>Jammer dat het niet doorgaat! Misschien is een andere reis iets voor u?</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .RebookUrl }}" class="btn" style="background: #00BCD4;">Andere reizen bekijken</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Heeft u vragen over de annulering of restitutie? Neem dan contact op met uw reisadviseur.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 61. TOERISME — REISHERINNERING (7 DAGEN)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Reisherinnering (7 dagen)',
    description: 'Herinnering 7 dagen voor vertrek met praktische informatie',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Over 7 dagen vertrekt u! — {{ .TourName }}',
    preheader: 'Nog een week tot uw vakantie! Hier is uw checklist.',
    tags: ['toerisme', 'reizen', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'TourName', label: 'Reisnaam', required: true },
      { name: 'Destination', label: 'Bestemming', required: true },
      { name: 'DepartureDate', label: 'Vertrekdatum', required: true },
      { name: 'Duration', label: 'Duur', required: true },
      { name: 'PackingTips', label: 'Paklijst tips', defaultValue: 'Vergeet uw paspoort, zonnebrand en comfortabele schoenen niet!' },
      { name: 'ChecklistUrl', label: 'Checklist URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #00BCD4, #0097A7);"><h1>Nog 7 dagen!</h1></div>
  <div class="body">
    <h2>Over een week vertrekt u!</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Nog even en u vertrekt naar <strong>{{ .Destination }}</strong>! Hier zijn een paar praktische tips om u voor te bereiden op uw reis <strong>{{ .TourName }}</strong>.</p>
    <div style="background: #E0F7FA; border-left: 4px solid #00BCD4; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Reis:</strong> {{ .TourName }}</p>
      <p style="margin: 0 0 8px;"><strong>Vertrekdatum:</strong> {{ .DepartureDate }}</p>
      <p style="margin: 0;"><strong>Duur:</strong> {{ .Duration }}</p>
    </div>
    <h3 style="color: #1e293b;">Paklijst tips</h3>
    <p>{{ .PackingTips }}</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ChecklistUrl }}" class="btn" style="background: #00BCD4;">Bekijk uw reischecklist</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Morgen voor vertrek ontvangt u nog een laatste herinnering met het verzamelpunt en contactgegevens.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 62. TOERISME — REISHERINNERING (1 DAG)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Reisherinnering (1 dag)',
    description: 'Herinnering 1 dag voor vertrek met verzamelpunt en contactgegevens',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Morgen is het zover! — {{ .TourName }}',
    preheader: 'Morgen begint uw reis! Hier zijn de laatste details.',
    tags: ['toerisme', 'reizen', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'TourName', label: 'Reisnaam', required: true },
      { name: 'DepartureDate', label: 'Vertrekdatum', required: true },
      { name: 'MeetingPoint', label: 'Verzamelpunt', required: true },
      { name: 'ContactPhone', label: 'Contactnummer reisleider', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #00BCD4, #0097A7);"><h1>Morgen is het zover!</h1></div>
  <div class="body">
    <h2>Nog 1 nachtje slapen!</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Morgen begint uw reis <strong>{{ .TourName }}</strong>! We verheugen ons erop u te verwelkomen.</p>
    <div style="background: #E0F7FA; border-left: 4px solid #00BCD4; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Vertrekdatum:</strong> {{ .DepartureDate }}</p>
      <p style="margin: 0 0 8px;"><strong>Verzamelpunt:</strong> {{ .MeetingPoint }}</p>
      <p style="margin: 0;"><strong>Contact reisleider:</strong> {{ .ContactPhone }}</p>
    </div>
    <p>Zorg ervoor dat u op tijd aanwezig bent op het verzamelpunt. Neem uw paspoort en reisdocumenten mee!</p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Heeft u nog vragen? Neem contact op met uw reisleider via bovenstaand telefoonnummer. Goede reis!</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 63. TOERISME — NA-REIS REVIEW VERZOEK
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Na-Reis Review Verzoek',
    description: 'Verzoek aan de klant om een review te schrijven na afloop van de reis',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Hoe was uw reis, {{ .CustomerName }}?',
    preheader: 'Deel uw reiservaring en help andere reizigers!',
    tags: ['toerisme', 'reizen', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'TourName', label: 'Reisnaam', required: true },
      { name: 'Destination', label: 'Bestemming', required: true },
      { name: 'ReviewUrl', label: 'Review URL', required: true },
      { name: 'RebookUrl', label: 'Opnieuw boeken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #00BCD4, #0097A7);"><h1>Hoe was het?</h1></div>
  <div class="body">
    <h2>Welkom terug!</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>We hopen dat u een fantastische tijd heeft gehad tijdens uw reis <strong>{{ .TourName }}</strong> naar {{ .Destination }}!</p>
    <p>Wij horen graag hoe u het heeft ervaren. Uw review helpt andere reizigers bij het kiezen van hun droomvakantie.</p>
    <div class="stars">&#9733; &#9733; &#9733; &#9733; &#9733;</div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ReviewUrl }}" class="btn" style="background: #00BCD4;">Review schrijven</a>
    </p>
    <hr class="divider">
    <p>Al zin in een volgende reis? Bekijk onze nieuwste bestemmingen!</p>
    <p style="text-align: center; margin: 16px 0;">
      <a href="{{ .RebookUrl }}" style="color: #00BCD4; font-weight: 600;">Nieuwe reizen bekijken &rarr;</a>
    </p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 64. TOERISME — BESTEMMING NIEUWSBRIEF
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Bestemming Nieuwsbrief',
    description: 'Nieuwsbrief met nieuwe reizen naar een specifieke bestemming',
    type: 'campaign',
    category: 'newsletter',
    defaultSubject: 'Ontdek {{ .DestinationName }}: {{ .TourCount }} nieuwe reizen',
    preheader: 'Nieuwe reizen beschikbaar naar {{ .DestinationName }}!',
    tags: ['toerisme', 'reizen', 'predefined'],
    variables: [
      { name: 'DestinationName', label: 'Bestemmingsnaam', required: true },
      { name: 'TourCount', label: 'Aantal reizen', required: true },
      { name: 'FeaturedTours', label: 'Uitgelichte reizen (HTML)', defaultValue: '' },
      { name: 'SiteName', label: 'Sitenaam', defaultValue: 'Ons reisbureau' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #00BCD4, #0097A7);"><h1>{{ .SiteName }}</h1></div>
  <div class="body">
    <h2>Ontdek {{ .DestinationName }}</h2>
    <p>Hoi {{ .Subscriber.Name }},</p>
    <p>Er zijn <strong>{{ .TourCount }} nieuwe reizen</strong> beschikbaar naar {{ .DestinationName }}! Van avontuurlijke expedities tot ontspannen strandvakanties: er is voor ieder wat wils.</p>
    {{ .FeaturedTours }}
    <p style="text-align: center; margin: 24px 0;">
      <a href="#" class="btn" style="background: #00BCD4;">Alle reizen bekijken</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Liever persoonlijk advies? Bel ons of plan een adviesgesprek met een reisadviseur.</p>
  </div>
  <div class="footer">
    <p>{{ .SiteName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 65. TOERISME — VROEGBOEKKORTING NOTIFICATIE
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Vroegboekkorting Notificatie',
    description: 'Notificatie over beschikbare vroegboekkorting op een reis',
    type: 'campaign',
    category: 'promotional',
    defaultSubject: 'Vroegboekkorting: bespaar op {{ .TourName }}!',
    preheader: 'Boek nu met vroegboekkorting en bespaar!',
    tags: ['toerisme', 'reizen', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'TourName', label: 'Reisnaam', required: true },
      { name: 'OriginalPrice', label: 'Originele prijs', required: true },
      { name: 'EarlyBirdPrice', label: 'Vroegboekprijs', required: true },
      { name: 'Discount', label: 'Kortingsbedrag', required: true },
      { name: 'Deadline', label: 'Deadline vroegboekkorting', required: true },
      { name: 'BookUrl', label: 'Boeken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #00BCD4, #0097A7);"><h1>Vroegboekkorting!</h1></div>
  <div class="body">
    <h2>Bespaar op uw droomreis!</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Goed nieuws! Op de reis <strong>{{ .TourName }}</strong> is nu een vroegboekkorting beschikbaar. Boek voor {{ .Deadline }} en profiteer van een mooie korting.</p>
    <div style="background: #E0F7FA; border-left: 4px solid #00BCD4; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Reis:</strong> {{ .TourName }}</p>
      <p style="margin: 0 0 8px;"><strong>Normale prijs:</strong> <span style="text-decoration: line-through;">{{ .OriginalPrice }}</span></p>
      <p style="margin: 0 0 8px;"><strong>Vroegboekprijs:</strong> <span style="color: #00BCD4; font-weight: 700; font-size: 18px;">{{ .EarlyBirdPrice }}</span></p>
      <p style="margin: 0 0 8px;"><strong>U bespaart:</strong> {{ .Discount }}</p>
      <p style="margin: 0;"><strong>Geldig tot:</strong> {{ .Deadline }}</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .BookUrl }}" class="btn" style="background: #00BCD4;">Nu boeken met korting</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Op is op! De vroegboekkorting geldt zolang de voorraad strekt en vervalt op {{ .Deadline }}.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // VASTGOED BRANCH — VIEWING & VALUATION TEMPLATES (66–73)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 66. VASTGOED — BEZICHTIGING BEVESTIGING (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Bezichtiging Bevestiging (Klant)',
    description: 'Bevestigingsmail naar de klant na het inplannen van een bezichtiging',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Bezichtiging bevestigd — {{ .PropertyAddress }}',
    preheader: 'Uw bezichtiging is ingepland! Hier vindt u alle details.',
    tags: ['vastgoed', 'makelaar', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'PropertyAddress', label: 'Adres woning', required: true },
      { name: 'PropertyCity', label: 'Stad', required: true },
      { name: 'PropertyPrice', label: 'Vraagprijs', required: true },
      { name: 'ViewingDate', label: 'Datum bezichtiging', required: true },
      { name: 'ViewingTime', label: 'Tijdstip bezichtiging', required: true },
      { name: 'ViewingType', label: 'Type bezichtiging (fysiek/online)', defaultValue: 'fysiek' },
      { name: 'AgentName', label: 'Naam makelaar', required: true },
      { name: 'AgentPhone', label: 'Telefoonnummer makelaar', required: true },
      { name: 'OfficeAddress', label: 'Kantooradres', defaultValue: '' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #3F51B5, #303F9F);"><h1>Bezichtiging Bevestigd</h1></div>
  <div class="body">
    <h2>Uw bezichtiging is ingepland</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Wij bevestigen hierbij uw bezichtiging voor de woning aan <strong>{{ .PropertyAddress }}</strong> te {{ .PropertyCity }}.</p>
    <div style="background: #E8EAF6; border-left: 4px solid #3F51B5; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Adres:</strong> {{ .PropertyAddress }}, {{ .PropertyCity }}</p>
      <p style="margin: 0 0 8px;"><strong>Vraagprijs:</strong> {{ .PropertyPrice }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .ViewingDate }}</p>
      <p style="margin: 0 0 8px;"><strong>Tijdstip:</strong> {{ .ViewingTime }}</p>
      <p style="margin: 0 0 8px;"><strong>Type:</strong> {{ .ViewingType }}</p>
      <p style="margin: 0;"><strong>Uw makelaar:</strong> {{ .AgentName }} — {{ .AgentPhone }}</p>
    </div>
    <p>Wij verzoeken u om 5 minuten voor het afgesproken tijdstip aanwezig te zijn op het adres van de woning. Bij een online bezichtiging ontvangt u apart een videolink.</p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Kunt u niet komen? Neem dan zo snel mogelijk contact op met uw makelaar {{ .AgentName }} via {{ .AgentPhone }}. Wij plannen graag een nieuw moment in.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 67. VASTGOED — BEZICHTIGING BEVESTIGING (MAKELAAR)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Bezichtiging Bevestiging (Makelaar)',
    description: 'Notificatie aan de makelaar bij een nieuwe bezichtiging',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Nieuwe bezichtiging: {{ .CustomerName }} — {{ .PropertyAddress }}',
    preheader: 'Er is een nieuwe bezichtiging ingepland',
    tags: ['vastgoed', 'makelaar', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'CustomerEmail', label: 'E-mail klant', required: true },
      { name: 'CustomerPhone', label: 'Telefoonnummer klant', defaultValue: '' },
      { name: 'PropertyAddress', label: 'Adres woning', required: true },
      { name: 'PropertyPrice', label: 'Vraagprijs', required: true },
      { name: 'ViewingDate', label: 'Datum bezichtiging', required: true },
      { name: 'ViewingTime', label: 'Tijdstip bezichtiging', required: true },
      { name: 'ViewingType', label: 'Type bezichtiging (fysiek/online)', defaultValue: 'fysiek' },
      { name: 'Remarks', label: 'Opmerkingen klant', defaultValue: 'Geen opmerkingen' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #3F51B5, #303F9F);"><h1>Nieuwe Bezichtiging</h1></div>
  <div class="body">
    <h2>Nieuwe bezichtiging ingepland</h2>
    <p>Er is een nieuwe bezichtiging ingepland via de website:</p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Klant:</strong> {{ .CustomerName }}</p>
      <p style="margin: 0 0 8px;"><strong>E-mail:</strong> {{ .CustomerEmail }}</p>
      <p style="margin: 0 0 8px;"><strong>Telefoon:</strong> {{ .CustomerPhone }}</p>
      <hr class="divider">
      <p style="margin: 0 0 8px;"><strong>Woning:</strong> {{ .PropertyAddress }}</p>
      <p style="margin: 0 0 8px;"><strong>Vraagprijs:</strong> {{ .PropertyPrice }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .ViewingDate }}</p>
      <p style="margin: 0 0 8px;"><strong>Tijdstip:</strong> {{ .ViewingTime }}</p>
      <p style="margin: 0 0 8px;"><strong>Type:</strong> {{ .ViewingType }}</p>
      <p style="margin: 0;"><strong>Opmerkingen:</strong> {{ .Remarks }}</p>
    </div>
  </div>
  <div class="footer">
    <p>Automatische notificatie — Makelaarskantoor Admin</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 68. VASTGOED — BEZICHTIGING HERINNERING
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Bezichtiging Herinnering',
    description: 'Herinnering 1 dag voor de bezichtiging met alle details',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Herinnering: bezichtiging {{ .PropertyAddress }} morgen om {{ .ViewingTime }}',
    preheader: 'Morgen is uw bezichtiging! Vergeet het niet.',
    tags: ['vastgoed', 'makelaar', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'PropertyAddress', label: 'Adres woning', required: true },
      { name: 'PropertyCity', label: 'Stad', required: true },
      { name: 'ViewingDate', label: 'Datum bezichtiging', required: true },
      { name: 'ViewingTime', label: 'Tijdstip bezichtiging', required: true },
      { name: 'ViewingType', label: 'Type bezichtiging (fysiek/online)', defaultValue: 'fysiek' },
      { name: 'AgentName', label: 'Naam makelaar', required: true },
      { name: 'CancelUrl', label: 'Annulerings-URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #3F51B5, #303F9F);"><h1>Herinnering Bezichtiging</h1></div>
  <div class="body">
    <h2>Morgen is uw bezichtiging!</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Wij herinneren u graag aan uw bezichtiging van morgen:</p>
    <div style="background: #E8EAF6; border-left: 4px solid #3F51B5; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Adres:</strong> {{ .PropertyAddress }}, {{ .PropertyCity }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .ViewingDate }}</p>
      <p style="margin: 0 0 8px;"><strong>Tijdstip:</strong> {{ .ViewingTime }}</p>
      <p style="margin: 0;"><strong>Type:</strong> {{ .ViewingType }}</p>
    </div>
    <p>Uw makelaar <strong>{{ .AgentName }}</strong> verwacht u op locatie. Wees a.u.b. 5 minuten voor aanvang aanwezig.</p>
    <p><strong>Tips voor uw bezichtiging:</strong></p>
    <ul style="color: #475569; margin: 0 0 16px;">
      <li>Neem een geldig legitimatiebewijs mee</li>
      <li>Noteer uw vragen vooraf</li>
      <li>Let op de staat van het dak, kozijnen en installaties</li>
      <li>Bekijk de omgeving en parkeerruimte</li>
    </ul>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Kunt u niet komen? <a href="{{ .CancelUrl }}" style="color: #3F51B5;">Annuleer of verzet de bezichtiging</a> zodat wij een ander moment kunnen inplannen.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 69. VASTGOED — BEZICHTIGING GEANNULEERD (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Bezichtiging Geannuleerd (Klant)',
    description: 'Bevestiging van annulering van een bezichtiging naar de klant',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Bezichtiging geannuleerd — {{ .PropertyAddress }}',
    preheader: 'Uw bezichtiging is geannuleerd',
    tags: ['vastgoed', 'makelaar', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'PropertyAddress', label: 'Adres woning', required: true },
      { name: 'OfficePhone', label: 'Telefoonnummer kantoor', required: true },
      { name: 'RebookUrl', label: 'Opnieuw boeken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #3F51B5, #303F9F);"><h1>Bezichtiging Geannuleerd</h1></div>
  <div class="body">
    <h2>Uw bezichtiging is geannuleerd</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Wij bevestigen dat uw bezichtiging voor de woning aan <strong>{{ .PropertyAddress }}</strong> is geannuleerd.</p>
    <div style="background: #FFF3E0; border-left: 4px solid #FF9800; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0;">Heeft u de woning nog niet gevonden? Wij helpen u graag bij het vinden van uw ideale woning.</p>
    </div>
    <p>U kunt altijd een nieuwe bezichtiging inplannen of contact met ons opnemen via {{ .OfficePhone }}.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .RebookUrl }}" class="btn" style="background: #3F51B5;">Andere woningen bekijken</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Heeft u vragen? Neem gerust contact op met ons kantoor via {{ .OfficePhone }}.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 70. VASTGOED — WAARDEBEPALING ONTVANGEN (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Waardebepaling Ontvangen (Klant)',
    description: 'Bevestiging dat de waardebepalingsaanvraag is ontvangen',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Uw waardebepaling is in behandeling',
    preheader: 'Wij hebben uw aanvraag voor een gratis waardebepaling ontvangen.',
    tags: ['vastgoed', 'makelaar', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'PropertyAddress', label: 'Adres woning', required: true },
      { name: 'PropertyType', label: 'Woningtype', defaultValue: '' },
      { name: 'PropertyArea', label: 'Oppervlakte (m2)', defaultValue: '' },
      { name: 'AgentName', label: 'Naam makelaar', required: true },
      { name: 'ExpectedDate', label: 'Verwachte opleverdatum', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #3F51B5, #303F9F);"><h1>Waardebepaling Ontvangen</h1></div>
  <div class="body">
    <h2>Uw aanvraag is in behandeling</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Bedankt voor uw aanvraag voor een gratis waardebepaling. Wij hebben de volgende gegevens ontvangen:</p>
    <div style="background: #E8EAF6; border-left: 4px solid #3F51B5; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Adres:</strong> {{ .PropertyAddress }}</p>
      <p style="margin: 0 0 8px;"><strong>Woningtype:</strong> {{ .PropertyType }}</p>
      <p style="margin: 0;"><strong>Oppervlakte:</strong> {{ .PropertyArea }} m&sup2;</p>
    </div>
    <p>Uw waardebepaling wordt uitgevoerd door <strong>{{ .AgentName }}</strong>. U kunt het rapport verwachten rond <strong>{{ .ExpectedDate }}</strong>.</p>
    <h3 style="color: #1e293b;">Hoe werkt het?</h3>
    <ol style="color: #475569; margin: 0 0 16px;">
      <li>Wij analyseren uw woning en de omgeving</li>
      <li>Vergelijking met recent verkochte woningen in de buurt</li>
      <li>U ontvangt een vrijblijvend waarderapport per e-mail</li>
      <li>Optioneel: persoonlijk gesprek met uw makelaar</li>
    </ol>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Deze waardebepaling is volledig gratis en vrijblijvend. Heeft u vragen? Neem contact op met {{ .AgentName }}.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 71. VASTGOED — WAARDEBEPALING GEREED (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Waardebepaling Gereed (Klant)',
    description: 'Notificatie dat de waardebepaling klaar is met link naar het rapport',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Uw waardebepaling is klaar — {{ .PropertyAddress }}',
    preheader: 'Uw waardebepaling is gereed! Bekijk het rapport.',
    tags: ['vastgoed', 'makelaar', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'PropertyAddress', label: 'Adres woning', required: true },
      { name: 'EstimatedValue', label: 'Geschatte waarde', required: true },
      { name: 'AgentName', label: 'Naam makelaar', required: true },
      { name: 'AgentPhone', label: 'Telefoonnummer makelaar', required: true },
      { name: 'ReportUrl', label: 'Rapport URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #3F51B5, #303F9F);"><h1>Waardebepaling Gereed</h1></div>
  <div class="body">
    <h2>Uw waardebepaling is klaar!</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Goed nieuws! De waardebepaling van uw woning aan <strong>{{ .PropertyAddress }}</strong> is afgerond.</p>
    <div style="background: #E8EAF6; border-left: 4px solid #3F51B5; padding: 16px; border-radius: 4px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 8px; font-size: 13px; color: #5C6BC0;">Geschatte marktwaarde</p>
      <p style="margin: 0; font-size: 28px; font-weight: 700; color: #3F51B5;">{{ .EstimatedValue }}</p>
    </div>
    <p>Dit is een indicatie op basis van vergelijkbare woningen in uw omgeving, de staat van de woning en de huidige marktomstandigheden.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ReportUrl }}" class="btn" style="background: #3F51B5;">Bekijk het volledige rapport</a>
    </p>
    <h3 style="color: #1e293b;">Volgende stap?</h3>
    <p>Wilt u uw woning verkopen? Makelaar <strong>{{ .AgentName }}</strong> bespreekt graag de mogelijkheden met u. Neem contact op via {{ .AgentPhone }} of plan een vrijblijvend verkoopgesprek in.</p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Deze waardebepaling is vrijblijvend en vervangt geen officieel taxatierapport. Voor een taxatie ten behoeve van een hypotheek dient u een beëdigd taxateur in te schakelen.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 72. VASTGOED — NIEUWE WONING NOTIFICATIE
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Nieuwe Woning Notificatie',
    description: 'Notificatie over een nieuwe woning in het aanbod die past bij de zoekcriteria',
    type: 'campaign',
    category: 'promotional',
    defaultSubject: 'Nieuw in aanbod: {{ .PropertyAddress }} — {{ .PropertyPrice }}',
    preheader: 'Er is een nieuwe woning beschikbaar die bij uw zoekcriteria past!',
    tags: ['vastgoed', 'makelaar', 'predefined'],
    variables: [
      { name: 'PropertyAddress', label: 'Adres woning', required: true },
      { name: 'PropertyCity', label: 'Stad', required: true },
      { name: 'PropertyPrice', label: 'Vraagprijs', required: true },
      { name: 'PropertyType', label: 'Woningtype', required: true },
      { name: 'Bedrooms', label: 'Aantal slaapkamers', required: true },
      { name: 'Area', label: 'Woonoppervlakte (m2)', required: true },
      { name: 'EnergyLabel', label: 'Energielabel', defaultValue: '' },
      { name: 'PropertyUrl', label: 'Woning URL', required: true },
      { name: 'AgentName', label: 'Naam makelaar', defaultValue: '' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #3F51B5, #303F9F);"><h1>Nieuw in Aanbod</h1></div>
  <div class="body">
    <h2>Nieuwe woning beschikbaar!</h2>
    <p>Beste {{ .Subscriber.Name }},</p>
    <p>Er is een nieuwe woning beschikbaar die past bij uw zoekcriteria:</p>
    <div style="background: #E8EAF6; border-left: 4px solid #3F51B5; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Adres:</strong> {{ .PropertyAddress }}, {{ .PropertyCity }}</p>
      <p style="margin: 0 0 8px;"><strong>Type:</strong> {{ .PropertyType }}</p>
      <p style="margin: 0 0 8px;"><strong>Vraagprijs:</strong> <span style="color: #3F51B5; font-weight: 700; font-size: 18px;">{{ .PropertyPrice }}</span></p>
      <p style="margin: 0 0 8px;"><strong>Slaapkamers:</strong> {{ .Bedrooms }}</p>
      <p style="margin: 0 0 8px;"><strong>Woonoppervlakte:</strong> {{ .Area }} m&sup2;</p>
      <p style="margin: 0;"><strong>Energielabel:</strong> {{ .EnergyLabel }}</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .PropertyUrl }}" class="btn" style="background: #3F51B5;">Bekijk deze woning</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Interesse? Plan direct een bezichtiging in via de woningpagina of neem contact op met {{ .AgentName }}.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 73. VASTGOED — NA-BEZICHTIGING FOLLOW-UP
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Na-Bezichtiging Follow-up',
    description: 'Follow-up mail na een bezichtiging om interesse te peilen en een review te vragen',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Hoe was de bezichtiging van {{ .PropertyAddress }}, {{ .CustomerName }}?',
    preheader: 'Wij horen graag hoe de bezichtiging is bevallen.',
    tags: ['vastgoed', 'makelaar', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'PropertyAddress', label: 'Adres woning', required: true },
      { name: 'PropertyPrice', label: 'Vraagprijs', required: true },
      { name: 'AgentName', label: 'Naam makelaar', required: true },
      { name: 'AgentPhone', label: 'Telefoonnummer makelaar', required: true },
      { name: 'ReviewUrl', label: 'Review URL', required: true },
      { name: 'ValuationUrl', label: 'Waardebepaling URL', defaultValue: '' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #3F51B5, #303F9F);"><h1>Hoe was het?</h1></div>
  <div class="body">
    <h2>Hoe was de bezichtiging?</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Bedankt voor uw bezoek aan de woning aan <strong>{{ .PropertyAddress }}</strong> ({{ .PropertyPrice }}). Wij hopen dat de bezichtiging u een goed beeld heeft gegeven van deze woning.</p>
    <h3 style="color: #1e293b;">Interesse?</h3>
    <p>Heeft de woning uw interesse gewekt? Neem dan contact op met uw makelaar <strong>{{ .AgentName }}</strong> via {{ .AgentPhone }} om de volgende stappen te bespreken. Wij adviseren u graag over het uitbrengen van een bod.</p>
    <h3 style="color: #1e293b;">Uw ervaring</h3>
    <p>Wij stellen het op prijs als u een korte review achterlaat over uw ervaring met ons kantoor:</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ReviewUrl }}" class="btn" style="background: #3F51B5;">Review schrijven</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Overweegt u uw eigen woning te verkopen? Vraag een <a href="{{ .ValuationUrl }}" style="color: #3F51B5;">gratis waardebepaling</a> aan en ontdek wat uw woning waard is.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // ONDERWIJS BRANCH — ENROLLMENT & COURSE TEMPLATES (74–81)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 74. ONDERWIJS — INSCHRIJVING BEVESTIGING (STUDENT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Inschrijving Bevestiging (Student)',
    description: 'Bevestigingsmail naar de student na inschrijving voor een cursus',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Welkom bij {{ .CourseName }}!',
    preheader: 'Je inschrijving is bevestigd. Welkom aan boord!',
    tags: ['onderwijs', 'cursus', 'predefined'],
    variables: [
      { name: 'StudentName', label: 'Naam student', required: true },
      { name: 'CourseName', label: 'Cursusnaam', required: true },
      { name: 'InstructorName', label: 'Naam docent', required: true },
      { name: 'EnrollmentNumber', label: 'Inschrijfnummer', required: true },
      { name: 'CourseUrl', label: 'Cursus URL', required: true },
      { name: 'Duration', label: 'Duur (uren)', required: true },
      { name: 'Level', label: 'Niveau', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #2563EB, #1E40AF);"><h1>Welkom bij je cursus!</h1></div>
  <div class="body">
    <h2>Je bent ingeschreven!</h2>
    <p>Hoi {{ .StudentName }},</p>
    <p>Geweldig nieuws! Je bent succesvol ingeschreven voor <strong>{{ .CourseName }}</strong>. We zijn blij dat je erbij bent!</p>
    <div style="background: #EFF6FF; border-left: 4px solid #2563EB; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Cursus:</strong> {{ .CourseName }}</p>
      <p style="margin: 0 0 8px;"><strong>Docent:</strong> {{ .InstructorName }}</p>
      <p style="margin: 0 0 8px;"><strong>Niveau:</strong> {{ .Level }}</p>
      <p style="margin: 0 0 8px;"><strong>Duur:</strong> {{ .Duration }} uur</p>
      <p style="margin: 0;"><strong>Inschrijfnummer:</strong> {{ .EnrollmentNumber }}</p>
    </div>
    <p>Je kunt direct beginnen met leren. Klik op de knop hieronder om naar je cursus te gaan.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .CourseUrl }}" class="btn" style="background: #2563EB;">Naar mijn cursus</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Bewaar je inschrijfnummer {{ .EnrollmentNumber }} goed. Dit heb je nodig bij vragen over je inschrijving.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 75. ONDERWIJS — INSCHRIJVING BEVESTIGING (ADMIN)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Inschrijving Bevestiging (Admin)',
    description: 'Notificatie aan de admin bij een nieuwe cursus-inschrijving',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Nieuwe inschrijving: {{ .StudentName }} \u2014 {{ .CourseName }}',
    preheader: 'Er is een nieuwe inschrijving ontvangen',
    tags: ['onderwijs', 'cursus', 'predefined'],
    variables: [
      { name: 'StudentName', label: 'Naam student', required: true },
      { name: 'StudentEmail', label: 'E-mail student', required: true },
      { name: 'CourseName', label: 'Cursusnaam', required: true },
      { name: 'InstructorName', label: 'Naam docent', required: true },
      { name: 'Amount', label: 'Bedrag', required: true },
      { name: 'PaymentMethod', label: 'Betaalmethode', required: true },
      { name: 'EnrollmentNumber', label: 'Inschrijfnummer', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #2563EB, #1E40AF);"><h1>Nieuwe Inschrijving</h1></div>
  <div class="body">
    <h2>Nieuwe inschrijving ontvangen</h2>
    <p>Er is een nieuwe inschrijving via het platform:</p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Student:</strong> {{ .StudentName }}</p>
      <p style="margin: 0 0 8px;"><strong>E-mail:</strong> {{ .StudentEmail }}</p>
      <hr class="divider">
      <p style="margin: 0 0 8px;"><strong>Cursus:</strong> {{ .CourseName }}</p>
      <p style="margin: 0 0 8px;"><strong>Docent:</strong> {{ .InstructorName }}</p>
      <p style="margin: 0 0 8px;"><strong>Bedrag:</strong> {{ .Amount }}</p>
      <p style="margin: 0 0 8px;"><strong>Betaalmethode:</strong> {{ .PaymentMethod }}</p>
      <p style="margin: 0;"><strong>Inschrijfnummer:</strong> {{ .EnrollmentNumber }}</p>
    </div>
  </div>
  <div class="footer">
    <p>Automatische notificatie \u2014 Onderwijs Platform Admin</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 76. ONDERWIJS — BETALING ONTVANGEN
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Betaling Ontvangen (Onderwijs)',
    description: 'Bevestigingsmail na succesvolle betaling voor een cursus',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Betaling ontvangen \u2014 {{ .CourseName }}',
    preheader: 'Je betaling is succesvol verwerkt.',
    tags: ['onderwijs', 'cursus', 'predefined'],
    variables: [
      { name: 'StudentName', label: 'Naam student', required: true },
      { name: 'CourseName', label: 'Cursusnaam', required: true },
      { name: 'Amount', label: 'Bedrag', required: true },
      { name: 'PaymentMethod', label: 'Betaalmethode', required: true },
      { name: 'PaymentId', label: 'Betalingskenmerk', required: true },
      { name: 'InvoiceUrl', label: 'Factuur URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #2563EB, #1E40AF);"><h1>Betaling Ontvangen</h1></div>
  <div class="body">
    <h2>Betaling succesvol!</h2>
    <p>Hoi {{ .StudentName }},</p>
    <p>We hebben je betaling voor <strong>{{ .CourseName }}</strong> in goede orde ontvangen. Hieronder vind je de details.</p>
    <div style="background: #EFF6FF; border-left: 4px solid #2563EB; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Cursus:</strong> {{ .CourseName }}</p>
      <p style="margin: 0 0 8px;"><strong>Bedrag:</strong> <span style="color: #2563EB; font-weight: 700; font-size: 18px;">{{ .Amount }}</span></p>
      <p style="margin: 0 0 8px;"><strong>Betaalmethode:</strong> {{ .PaymentMethod }}</p>
      <p style="margin: 0;"><strong>Betalingskenmerk:</strong> {{ .PaymentId }}</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .InvoiceUrl }}" class="btn" style="background: #2563EB;">Factuur downloaden</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Je hebt 30 dagen niet-goed-geld-terug garantie. Niet tevreden? Neem contact op met ons supportteam.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 77. ONDERWIJS — CURSUS WELKOM
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Cursus Welkom',
    description: 'Welkomstmail met praktische info om te starten met de cursus',
    type: 'transactional',
    category: 'welcome',
    defaultSubject: 'Tijd om te beginnen! Jouw eerste les in {{ .CourseName }}',
    preheader: 'Je cursus staat klaar. Begin vandaag nog met leren!',
    tags: ['onderwijs', 'cursus', 'predefined'],
    variables: [
      { name: 'StudentName', label: 'Naam student', required: true },
      { name: 'CourseName', label: 'Cursusnaam', required: true },
      { name: 'InstructorName', label: 'Naam docent', required: true },
      { name: 'FirstLessonTitle', label: 'Titel eerste les', required: true },
      { name: 'CourseUrl', label: 'Cursus URL', required: true },
      { name: 'TotalLessons', label: 'Totaal aantal lessen', required: true },
      { name: 'Duration', label: 'Duur (uren)', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #2563EB, #1E40AF);"><h1>Tijd om te leren!</h1></div>
  <div class="body">
    <h2>Welkom bij {{ .CourseName }}!</h2>
    <p>Hoi {{ .StudentName }},</p>
    <p>Alles staat klaar voor jou! Je cursus <strong>{{ .CourseName }}</strong> wacht op je. Docent {{ .InstructorName }} heeft een geweldig programma voor je samengesteld.</p>
    <div style="background: #EFF6FF; border-left: 4px solid #2563EB; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Eerste les:</strong> {{ .FirstLessonTitle }}</p>
      <p style="margin: 0 0 8px;"><strong>Totaal lessen:</strong> {{ .TotalLessons }}</p>
      <p style="margin: 0;"><strong>Geschatte duur:</strong> {{ .Duration }} uur</p>
    </div>
    <h3 style="color: #1e293b;">Tips om het meeste uit je cursus te halen:</h3>
    <ul style="color: #334155; padding-left: 20px;">
      <li>Neem de tijd \u2014 je hebt levenslang toegang</li>
      <li>Maak aantekeningen bij elke les</li>
      <li>Doe alle oefeningen en opdrachten</li>
      <li>Stel vragen als iets niet duidelijk is</li>
    </ul>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .CourseUrl }}" class="btn" style="background: #2563EB;">Start met leren</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Veel succes met je cursus! Bij vragen kun je altijd contact opnemen met ons supportteam.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 78. ONDERWIJS — VOORTGANG HERINNERING
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Voortgang Herinnering',
    description: 'Herinnering om verder te gaan met de cursus, met voortgangsoverzicht',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Je bent {{ .Progress }}% \u2014 ga door met {{ .CourseName }}!',
    preheader: 'Je bent goed op weg! Ga verder waar je gebleven was.',
    tags: ['onderwijs', 'cursus', 'predefined'],
    variables: [
      { name: 'StudentName', label: 'Naam student', required: true },
      { name: 'CourseName', label: 'Cursusnaam', required: true },
      { name: 'Progress', label: 'Voortgang (%)', required: true },
      { name: 'CompletedLessons', label: 'Afgeronde lessen', required: true },
      { name: 'TotalLessons', label: 'Totaal lessen', required: true },
      { name: 'NextLessonTitle', label: 'Titel volgende les', required: true },
      { name: 'CourseUrl', label: 'Cursus URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #2563EB, #1E40AF);"><h1>Ga door met leren!</h1></div>
  <div class="body">
    <h2>Je bent goed op weg!</h2>
    <p>Hoi {{ .StudentName }},</p>
    <p>Je hebt al <strong>{{ .Progress }}%</strong> van <strong>{{ .CourseName }}</strong> afgerond. Dat is geweldig! Laat je voortgang niet stilvallen.</p>
    <div style="background: #EFF6FF; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 8px; font-size: 13px; color: #2563EB;">Je voortgang</p>
      <div style="background: #DBEAFE; border-radius: 999px; height: 24px; overflow: hidden; margin: 0 0 12px;">
        <div style="background: linear-gradient(90deg, #2563EB, #1E40AF); height: 100%; width: {{ .Progress }}%; border-radius: 999px;"></div>
      </div>
      <p style="margin: 0; font-size: 14px; color: #64748b;">{{ .CompletedLessons }} van {{ .TotalLessons }} lessen afgerond</p>
    </div>
    <div style="background: #EFF6FF; border-left: 4px solid #2563EB; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 4px; font-size: 13px; color: #2563EB;">Volgende les</p>
      <p style="margin: 0; font-weight: 600;">{{ .NextLessonTitle }}</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .CourseUrl }}" class="btn" style="background: #2563EB;">Verder met leren</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Even geen tijd? Geen probleem \u2014 je hebt levenslang toegang tot je cursus. Maar hoe eerder je verder gaat, hoe sneller je resultaat ziet!</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 79. ONDERWIJS — CURSUS AFGEROND
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Cursus Afgerond',
    description: 'Felicitatiemail bij het afronden van een cursus met certificaat-link',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Gefeliciteerd! Je hebt {{ .CourseName }} afgerond \uD83C\uDF93',
    preheader: 'Je hebt het gedaan! Download je certificaat.',
    tags: ['onderwijs', 'cursus', 'predefined'],
    variables: [
      { name: 'StudentName', label: 'Naam student', required: true },
      { name: 'CourseName', label: 'Cursusnaam', required: true },
      { name: 'InstructorName', label: 'Naam docent', required: true },
      { name: 'CompletedAt', label: 'Datum afronding', required: true },
      { name: 'CertificateUrl', label: 'Certificaat URL', required: true },
      { name: 'ReviewUrl', label: 'Review URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #2563EB, #1E40AF);"><h1>\uD83C\uDF93 Gefeliciteerd!</h1></div>
  <div class="body">
    <h2>Je hebt het gedaan!</h2>
    <p>Hoi {{ .StudentName }},</p>
    <p>Wat een prestatie! Je hebt <strong>{{ .CourseName }}</strong> succesvol afgerond op {{ .CompletedAt }}. Docent {{ .InstructorName }} en het hele team zijn trots op je.</p>
    <div style="background: #EFF6FF; border-radius: 8px; padding: 24px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 4px; font-size: 40px;">\uD83C\uDF93</p>
      <p style="margin: 0 0 8px; font-size: 18px; font-weight: 700; color: #1E40AF;">Certificaat behaald</p>
      <p style="margin: 0 0 16px; color: #64748b;">{{ .CourseName }}</p>
      <a href="{{ .CertificateUrl }}" class="btn" style="background: #2563EB;">Download je certificaat</a>
    </div>
    <h3 style="color: #1e293b;">Deel je ervaring</h3>
    <p>Help andere studenten door een review achter te laten over je cursus-ervaring.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ReviewUrl }}" class="btn" style="background: #1E40AF;">Review schrijven</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Je certificaat kun je altijd terugvinden in je account. Veel succes met het toepassen van je nieuwe kennis!</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 80. ONDERWIJS — REVIEW VERZOEK (NA CURSUS)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Review Verzoek (Na Cursus)',
    description: 'Review verzoek een paar dagen na het afronden van de cursus',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Hoe vond je {{ .CourseName }}, {{ .StudentName }}?',
    preheader: 'Deel je ervaring en help andere studenten bij hun keuze.',
    tags: ['onderwijs', 'cursus', 'predefined'],
    variables: [
      { name: 'StudentName', label: 'Naam student', required: true },
      { name: 'CourseName', label: 'Cursusnaam', required: true },
      { name: 'InstructorName', label: 'Naam docent', required: true },
      { name: 'ReviewUrl', label: 'Review URL', required: true },
      { name: 'CourseUrl', label: 'Cursus URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #2563EB, #1E40AF);"><h1>Hoe was je cursus?</h1></div>
  <div class="body">
    <h2>Wat vond je van {{ .CourseName }}?</h2>
    <p>Hoi {{ .StudentName }},</p>
    <p>Je hebt onlangs <strong>{{ .CourseName }}</strong> afgerond bij docent {{ .InstructorName }}. We zijn benieuwd naar je ervaring!</p>
    <p>Jouw review helpt andere studenten om de juiste cursus te kiezen en helpt ons om het leerplatform te verbeteren.</p>
    <div class="stars">&#9733; &#9733; &#9733; &#9733; &#9733;</div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ReviewUrl }}" class="btn" style="background: #2563EB;">Review schrijven</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Het schrijven van een review duurt slechts 1 minuut. Bedankt dat je andere studenten helpt!</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 81. ONDERWIJS — TERUGBETALING BEVESTIGING
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Terugbetaling Bevestiging (Onderwijs)',
    description: 'Bevestigingsmail na het verwerken van een terugbetaling voor een cursus',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Terugbetaling verwerkt \u2014 {{ .CourseName }}',
    preheader: 'Je terugbetaling is verwerkt. Het bedrag wordt binnen enkele werkdagen teruggestort.',
    tags: ['onderwijs', 'cursus', 'predefined'],
    variables: [
      { name: 'StudentName', label: 'Naam student', required: true },
      { name: 'CourseName', label: 'Cursusnaam', required: true },
      { name: 'Amount', label: 'Bedrag', required: true },
      { name: 'RefundId', label: 'Terugbetalingskenmerk', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #2563EB, #1E40AF);"><h1>Terugbetaling Verwerkt</h1></div>
  <div class="body">
    <h2>Terugbetaling bevestigd</h2>
    <p>Hoi {{ .StudentName }},</p>
    <p>We bevestigen dat je terugbetaling voor <strong>{{ .CourseName }}</strong> is verwerkt.</p>
    <div style="background: #EFF6FF; border-left: 4px solid #2563EB; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Cursus:</strong> {{ .CourseName }}</p>
      <p style="margin: 0 0 8px;"><strong>Terugbetaald bedrag:</strong> <span style="color: #2563EB; font-weight: 700; font-size: 18px;">{{ .Amount }}</span></p>
      <p style="margin: 0;"><strong>Kenmerk:</strong> {{ .RefundId }}</p>
    </div>
    <p>Het bedrag wordt binnen 5\u201310 werkdagen teruggestort op je oorspronkelijke betaalmethode.</p>
    <p>We vinden het jammer dat de cursus niet aan je verwachtingen voldeed. Als je feedback hebt, horen we dat graag \u2014 zo kunnen we ons aanbod verbeteren.</p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Heb je vragen over de terugbetaling? Neem contact op met ons supportteam. Vermeld daarbij je kenmerk {{ .RefundId }}.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // CONSTRUCTION BRANCH — BOUWBEDRIJF TEMPLATES (82–89)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 82. BOUW — OFFERTE AANVRAAG BEVESTIGING (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Offerte Aanvraag Bevestiging (Klant)',
    description: 'Bevestigingsmail naar de klant na het indienen van een offerte aanvraag voor een bouwproject',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Offerte aanvraag ontvangen \u2014 {{ .ProjectType }}',
    preheader: 'Bedankt voor uw aanvraag! We nemen binnen 2 werkdagen contact met u op.',
    tags: ['bouw', 'construction', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ProjectType', label: 'Type project (bijv. "Verbouwing badkamer")', required: true },
      { name: 'ProjectDescription', label: 'Projectomschrijving', required: true },
      { name: 'EstimatedBudget', label: 'Geschat budget', defaultValue: 'Nog niet opgegeven' },
      { name: 'PreferredStartDate', label: 'Gewenste startdatum', defaultValue: 'In overleg' },
      { name: 'QuoteUrl', label: 'Offerte bekijken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #667eea, #764ba2);"><h1>Offerte Aanvraag Ontvangen</h1></div>
  <div class="body">
    <h2>Bedankt voor uw aanvraag!</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Wij hebben uw offerte aanvraag in goede orde ontvangen. Hieronder vindt u een overzicht van de door u opgegeven gegevens:</p>
    <div style="background: #f0eeff; border-left: 4px solid #667eea; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Type project:</strong> {{ .ProjectType }}</p>
      <p style="margin: 0 0 8px;"><strong>Omschrijving:</strong> {{ .ProjectDescription }}</p>
      <p style="margin: 0 0 8px;"><strong>Geschat budget:</strong> {{ .EstimatedBudget }}</p>
      <p style="margin: 0;"><strong>Gewenste startdatum:</strong> {{ .PreferredStartDate }}</p>
    </div>
    <p>Ons team neemt binnen <strong>2 werkdagen</strong> contact met u op om uw wensen te bespreken en een vrijblijvende offerte op te stellen.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .QuoteUrl }}" class="btn" style="background: #667eea;">Aanvraag bekijken</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Heeft u tussentijds vragen? Neem gerust contact met ons op. We helpen u graag verder.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 83. BOUW — OFFERTE AANVRAAG ONTVANGEN (ADMIN)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Offerte Aanvraag Ontvangen (Admin)',
    description: 'Notificatie aan de admin bij een nieuwe offerte aanvraag voor een bouwproject',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Nieuwe offerte aanvraag: {{ .CustomerName }} \u2014 {{ .ProjectType }}',
    preheader: 'Er is een nieuwe offerte aanvraag ontvangen via de website',
    tags: ['bouw', 'construction', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'CustomerEmail', label: 'E-mail klant', required: true },
      { name: 'CustomerPhone', label: 'Telefoonnummer klant', defaultValue: '' },
      { name: 'ProjectType', label: 'Type project', required: true },
      { name: 'ProjectDescription', label: 'Projectomschrijving', required: true },
      { name: 'EstimatedBudget', label: 'Geschat budget', defaultValue: 'Niet opgegeven' },
      { name: 'PreferredStartDate', label: 'Gewenste startdatum', defaultValue: 'In overleg' },
      { name: 'Address', label: 'Adres project', defaultValue: '' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #667eea, #764ba2);"><h1>Nieuwe Offerte Aanvraag</h1></div>
  <div class="body">
    <h2>Nieuwe aanvraag ontvangen</h2>
    <p>Er is een nieuwe offerte aanvraag binnengekomen via de website:</p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Klant:</strong> {{ .CustomerName }}</p>
      <p style="margin: 0 0 8px;"><strong>E-mail:</strong> {{ .CustomerEmail }}</p>
      <p style="margin: 0 0 8px;"><strong>Telefoon:</strong> {{ .CustomerPhone }}</p>
      <p style="margin: 0 0 8px;"><strong>Type project:</strong> {{ .ProjectType }}</p>
      <p style="margin: 0 0 8px;"><strong>Omschrijving:</strong> {{ .ProjectDescription }}</p>
      <p style="margin: 0 0 8px;"><strong>Geschat budget:</strong> {{ .EstimatedBudget }}</p>
      <p style="margin: 0 0 8px;"><strong>Gewenste startdatum:</strong> {{ .PreferredStartDate }}</p>
      <p style="margin: 0;"><strong>Adres:</strong> {{ .Address }}</p>
    </div>
  </div>
  <div class="footer">
    <p>Automatische notificatie \u2014 Bouwbedrijf Admin</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 84. BOUW — OFFERTE GEREED (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Offerte Gereed (Klant)',
    description: 'Notificatie aan de klant dat de offerte voor het bouwproject klaar is',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Uw offerte is gereed \u2014 {{ .ProjectType }}',
    preheader: 'Uw offerte is klaar! Bekijk het voorstel en de details.',
    tags: ['bouw', 'construction', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ProjectType', label: 'Type project', required: true },
      { name: 'QuoteAmount', label: 'Offertebedrag', required: true },
      { name: 'ValidUntil', label: 'Geldig tot', required: true },
      { name: 'ProjectManager', label: 'Naam projectleider', required: true },
      { name: 'QuoteUrl', label: 'Offerte bekijken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #667eea, #764ba2);"><h1>Uw Offerte is Gereed</h1></div>
  <div class="body">
    <h2>Offerte gereed voor {{ .ProjectType }}</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Goed nieuws! Uw offerte voor <strong>{{ .ProjectType }}</strong> is gereed en klaar om te bekijken.</p>
    <div style="background: #f0eeff; border-left: 4px solid #667eea; padding: 16px; border-radius: 4px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 4px; font-size: 13px; color: #6b7280;">Offertebedrag</p>
      <p style="margin: 0 0 12px; font-size: 28px; font-weight: 700; color: #667eea;">{{ .QuoteAmount }}</p>
      <p style="margin: 0; font-size: 13px; color: #6b7280;">Geldig tot {{ .ValidUntil }}</p>
    </div>
    <p>Uw projectleider <strong>{{ .ProjectManager }}</strong> heeft de offerte opgesteld op basis van uw wensen. Bij vragen kunt u rechtstreeks contact opnemen.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .QuoteUrl }}" class="btn" style="background: #667eea;">Offerte bekijken</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Deze offerte is vrijblijvend en geldig tot {{ .ValidUntil }}. Na die datum kan het bedrag afwijken.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 85. BOUW — OFFERTE GEACCEPTEERD — WELKOM (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Offerte Geaccepteerd \u2014 Welkom (Klant)',
    description: 'Welkomstmail aan de klant na het accepteren van een offerte voor een bouwproject',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Welkom als opdrachtgever! \u2014 {{ .ProjectType }}',
    preheader: 'Welkom! Hier leest u wat u kunt verwachten.',
    tags: ['bouw', 'construction', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ProjectType', label: 'Type project', required: true },
      { name: 'ProjectManager', label: 'Naam projectleider', required: true },
      { name: 'ProjectManagerPhone', label: 'Telefoon projectleider', required: true },
      { name: 'StartDate', label: 'Geplande startdatum', required: true },
      { name: 'ProjectUrl', label: 'Project portaal URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #667eea, #764ba2);"><h1>Welkom als Opdrachtgever!</h1></div>
  <div class="body">
    <h2>Welkom bij ons bouwteam!</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Bedankt voor uw vertrouwen! Wij zijn verheugd om uw project <strong>{{ .ProjectType }}</strong> te mogen realiseren. Hieronder leest u wat u de komende periode kunt verwachten:</p>
    <div style="background: #f0eeff; border-left: 4px solid #667eea; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 12px;"><strong>1.</strong> Uw projectleider <strong>{{ .ProjectManager }}</strong> neemt contact met u op voor een kennismaking (tel: {{ .ProjectManagerPhone }})</p>
      <p style="margin: 0 0 12px;"><strong>2.</strong> Samen stellen we een gedetailleerde planning op</p>
      <p style="margin: 0 0 12px;"><strong>3.</strong> U ontvangt alle benodigde documenten en vergunningen</p>
      <p style="margin: 0;"><strong>4.</strong> De werkzaamheden starten op <strong>{{ .StartDate }}</strong></p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ProjectUrl }}" class="btn" style="background: #667eea;">Project portaal openen</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Via het project portaal kunt u altijd de voortgang volgen en documenten inzien. Bij vragen kunt u terecht bij {{ .ProjectManager }}.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 86. BOUW — OFFERTE AFGEWEZEN (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Offerte Afgewezen (Klant)',
    description: 'Opvolgmail naar de klant na het afwijzen van een offerte voor een bouwproject',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Bedankt voor uw interesse \u2014 {{ .ProjectType }}',
    preheader: 'Jammer dat het niet is geworden. De deur staat altijd open!',
    tags: ['bouw', 'construction', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ProjectType', label: 'Type project', required: true },
      { name: 'NewQuoteUrl', label: 'Nieuwe offerte aanvragen URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #667eea, #764ba2);"><h1>Bedankt voor uw Interesse</h1></div>
  <div class="body">
    <h2>Bedankt voor uw interesse</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>We begrijpen dat u heeft besloten om op dit moment niet verder te gaan met de offerte voor <strong>{{ .ProjectType }}</strong>. Dat respecteren wij uiteraard volledig.</p>
    <p>Mocht u in de toekomst alsnog bouwplannen hebben, dan staan wij graag voor u klaar. Onze deur staat altijd open voor een vrijblijvend gesprek.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .NewQuoteUrl }}" class="btn" style="background: #667eea;">Nieuwe offerte aanvragen</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">We waarderen het dat u ons heeft overwogen. Mocht u feedback hebben over onze offerte, horen we dat graag.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 87. BOUW — PROJECT VOORTGANG UPDATE
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Project Voortgang Update (Bouw)',
    description: 'Voortgangsupdate voor de klant over de status van het bouwproject',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Voortgang update \u2014 {{ .ProjectType }}',
    preheader: 'Er is een update over de voortgang van uw project.',
    tags: ['bouw', 'construction', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ProjectType', label: 'Type project', required: true },
      { name: 'ProjectPhase', label: 'Huidige fase (bijv. "Ruwbouw")', required: true },
      { name: 'UpdateMessage', label: 'Voortgangsbericht', required: true },
      { name: 'NextSteps', label: 'Volgende stappen', required: true },
      { name: 'ProjectUrl', label: 'Project portaal URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #667eea, #764ba2);"><h1>Voortgang Update</h1></div>
  <div class="body">
    <h2>Voortgang update \u2014 {{ .ProjectType }}</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Hierbij informeren wij u over de voortgang van uw project.</p>
    <div style="background: #f0eeff; border-left: 4px solid #667eea; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Project:</strong> {{ .ProjectType }}</p>
      <p style="margin: 0 0 8px;"><strong>Huidige fase:</strong> {{ .ProjectPhase }}</p>
      <p style="margin: 0;"><strong>Status:</strong> {{ .UpdateMessage }}</p>
    </div>
    <h2 style="font-size: 17px; margin-top: 28px;">Volgende stappen</h2>
    <p>{{ .NextSteps }}</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ProjectUrl }}" class="btn" style="background: #667eea;">Project portaal openen</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Heeft u vragen over de voortgang? Neem contact op met uw projectleider.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 88. BOUW — PROJECT OPLEVERING
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Project Oplevering (Bouw)',
    description: 'Notificatie aan de klant dat het bouwproject is opgeleverd',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Project opgeleverd \u2014 {{ .ProjectType }}',
    preheader: 'Uw project is opgeleverd! Bekijk de garantievoorwaarden.',
    tags: ['bouw', 'construction', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ProjectType', label: 'Type project', required: true },
      { name: 'CompletionDate', label: 'Opleverdatum', required: true },
      { name: 'WarrantyInfo', label: 'Garantie-informatie', required: true },
      { name: 'ReviewUrl', label: 'Review URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #667eea, #764ba2);"><h1>Project Opgeleverd!</h1></div>
  <div class="body">
    <h2>Uw project is opgeleverd</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Met trots melden wij dat uw project <strong>{{ .ProjectType }}</strong> op <strong>{{ .CompletionDate }}</strong> is opgeleverd. Wij hopen dat het resultaat aan uw verwachtingen voldoet!</p>
    <div style="background: #f0eeff; border-left: 4px solid #667eea; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Project:</strong> {{ .ProjectType }}</p>
      <p style="margin: 0 0 8px;"><strong>Opleverdatum:</strong> {{ .CompletionDate }}</p>
      <p style="margin: 0;"><strong>Garantie:</strong> {{ .WarrantyInfo }}</p>
    </div>
    <p>Mocht u na de oplevering nog vragen of opmerkingen hebben, neem dan gerust contact met ons op. We staan voor u klaar!</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ReviewUrl }}" class="btn" style="background: #667eea;">Beoordeling achterlaten</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Bewaar deze e-mail voor uw garantie-informatie. Bij gebreken binnen de garantieperiode kunt u altijd een beroep doen op uw garantie.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 89. BOUW — REVIEW VERZOEK (NA PROJECT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Review Verzoek (Na Project \u2014 Bouw)',
    description: 'Review verzoek aan de klant na een afgerond bouwproject',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Hoe was uw ervaring, {{ .CustomerName }}?',
    preheader: 'Deel uw ervaring en help andere klanten',
    tags: ['bouw', 'construction', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ProjectType', label: 'Type project', required: true },
      { name: 'ProjectManager', label: 'Naam projectleider', required: true },
      { name: 'ReviewUrl', label: 'Review URL', required: true },
      { name: 'RebookUrl', label: 'Nieuw project URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #667eea, #764ba2);"><h1>Hoe was uw ervaring?</h1></div>
  <div class="body">
    <h2>Hoe was uw ervaring met {{ .ProjectType }}?</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Uw project <strong>{{ .ProjectType }}</strong> is afgerond onder leiding van <strong>{{ .ProjectManager }}</strong>. We hopen dat u tevreden bent met het resultaat!</p>
    <p>Uw mening is waardevol voor ons. Een review helpt ons om nog beter te worden en helpt andere klanten bij hun keuze.</p>
    <div class="stars" style="text-align: center; margin: 20px 0;">&#9733; &#9733; &#9733; &#9733; &#9733;</div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ReviewUrl }}" class="btn" style="background: #667eea;">Review schrijven</a>
    </p>
    <hr class="divider">
    <p style="text-align: center;">Nieuwe bouwplannen? Vraag direct een offerte aan:</p>
    <p style="text-align: center; margin: 16px 0;">
      <a href="{{ .RebookUrl }}" class="btn" style="background: #764ba2;">Nieuwe offerte aanvragen</a>
    </p>
    <p style="font-size: 13px; color: #94a3b8; text-align: center;">Het schrijven van een review duurt slechts 1 minuut. Bedankt!</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // EXPERIENCES BRANCH — ERVARINGEN TEMPLATES (90–97)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 90. ERVARINGEN — BOEKING BEVESTIGING (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Boeking Bevestiging (Klant \u2014 Ervaringen)',
    description: 'Bevestigingsmail naar de klant na het boeken van een ervaring',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Boeking bevestigd \u2014 {{ .ExperienceName }}',
    preheader: 'Je boeking is bevestigd! Hier zijn de details.',
    tags: ['ervaringen', 'experiences', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ExperienceName', label: 'Naam ervaring', required: true },
      { name: 'BookingNumber', label: 'Boekingsnummer', required: true },
      { name: 'Date', label: 'Datum', required: true },
      { name: 'Time', label: 'Tijd', required: true },
      { name: 'Duration', label: 'Duur (bijv. "2 uur")', defaultValue: '2 uur' },
      { name: 'GroupSize', label: 'Groepsgrootte', defaultValue: '1' },
      { name: 'Location', label: 'Locatie', required: true },
      { name: 'TotalPrice', label: 'Totaalprijs', required: true },
      { name: 'IncludedItems', label: 'Inclusief (bijv. "Lunch, drankjes")', defaultValue: '' },
      { name: 'BookingUrl', label: 'Boeking bekijken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #0891B2, #164E63);"><h1>Boeking Bevestigd!</h1></div>
  <div class="body">
    <h2>Je boeking is bevestigd!</h2>
    <p>Hoi {{ .CustomerName }},</p>
    <p>Wat leuk dat je hebt geboekt! Hieronder vind je alle details van je ervaring.</p>
    <div style="background: #ecfeff; border-left: 4px solid #0891B2; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Ervaring:</strong> {{ .ExperienceName }}</p>
      <p style="margin: 0 0 8px;"><strong>Boekingsnummer:</strong> {{ .BookingNumber }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .Date }}</p>
      <p style="margin: 0 0 8px;"><strong>Tijd:</strong> {{ .Time }}</p>
      <p style="margin: 0 0 8px;"><strong>Duur:</strong> {{ .Duration }}</p>
      <p style="margin: 0 0 8px;"><strong>Aantal personen:</strong> {{ .GroupSize }}</p>
      <p style="margin: 0 0 8px;"><strong>Locatie:</strong> {{ .Location }}</p>
      <p style="margin: 0 0 8px;"><strong>Inclusief:</strong> {{ .IncludedItems }}</p>
      <p style="margin: 0;"><strong>Totaalprijs:</strong> <span style="color: #0891B2; font-weight: 700; font-size: 18px;">{{ .TotalPrice }}</span></p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .BookingUrl }}" class="btn" style="background: #0891B2;">Boeking bekijken</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Moet je je boeking wijzigen of annuleren? Dat kan via bovenstaande link of neem contact met ons op.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 91. ERVARINGEN — BOEKING BEVESTIGING (ADMIN)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Boeking Bevestiging (Admin \u2014 Ervaringen)',
    description: 'Notificatie aan de admin bij een nieuwe boeking voor een ervaring',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Nieuwe boeking: {{ .CustomerName }} \u2014 {{ .ExperienceName }}',
    preheader: 'Er is een nieuwe boeking ontvangen',
    tags: ['ervaringen', 'experiences', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'CustomerEmail', label: 'E-mail klant', required: true },
      { name: 'CustomerPhone', label: 'Telefoonnummer klant', defaultValue: '' },
      { name: 'ExperienceName', label: 'Naam ervaring', required: true },
      { name: 'Date', label: 'Datum', required: true },
      { name: 'Time', label: 'Tijd', required: true },
      { name: 'GroupSize', label: 'Groepsgrootte', defaultValue: '1' },
      { name: 'TotalPrice', label: 'Totaalprijs', required: true },
      { name: 'Extras', label: 'Extra opties', defaultValue: 'Geen' },
      { name: 'Remarks', label: 'Opmerkingen klant', defaultValue: 'Geen' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #0891B2, #164E63);"><h1>Nieuwe Boeking</h1></div>
  <div class="body">
    <h2>Nieuwe boeking ontvangen</h2>
    <p>Er is een nieuwe boeking binnengekomen via de website:</p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Klant:</strong> {{ .CustomerName }}</p>
      <p style="margin: 0 0 8px;"><strong>E-mail:</strong> {{ .CustomerEmail }}</p>
      <p style="margin: 0 0 8px;"><strong>Telefoon:</strong> {{ .CustomerPhone }}</p>
      <p style="margin: 0 0 8px;"><strong>Ervaring:</strong> {{ .ExperienceName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .Date }}</p>
      <p style="margin: 0 0 8px;"><strong>Tijd:</strong> {{ .Time }}</p>
      <p style="margin: 0 0 8px;"><strong>Aantal personen:</strong> {{ .GroupSize }}</p>
      <p style="margin: 0 0 8px;"><strong>Totaalprijs:</strong> {{ .TotalPrice }}</p>
      <p style="margin: 0 0 8px;"><strong>Extra opties:</strong> {{ .Extras }}</p>
      <p style="margin: 0;"><strong>Opmerkingen:</strong> {{ .Remarks }}</p>
    </div>
  </div>
  <div class="footer">
    <p>Automatische notificatie \u2014 Ervaringen Admin</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 92. ERVARINGEN — BOEKING HERINNERING
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Boeking Herinnering (Ervaringen)',
    description: 'Herinnering aan de klant voor een aankomende ervaring',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Herinnering: {{ .ExperienceName }} op {{ .Date }}',
    preheader: 'Niet vergeten: je ervaring is binnenkort!',
    tags: ['ervaringen', 'experiences', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ExperienceName', label: 'Naam ervaring', required: true },
      { name: 'Date', label: 'Datum', required: true },
      { name: 'Time', label: 'Tijd', required: true },
      { name: 'Location', label: 'Locatie', required: true },
      { name: 'WhatToBring', label: 'Wat meenemen', defaultValue: 'Comfortabele kleding en goed humeur!' },
      { name: 'CancelUrl', label: 'Annulerings URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #0891B2, #164E63);"><h1>Herinnering</h1></div>
  <div class="body">
    <h2>Je ervaring komt eraan!</h2>
    <p>Hoi {{ .CustomerName }},</p>
    <p>Een vriendelijke herinnering: je <strong>{{ .ExperienceName }}</strong> staat gepland op <strong>{{ .Date }}</strong> om <strong>{{ .Time }}</strong>.</p>
    <div style="background: #ecfeff; border-left: 4px solid #0891B2; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Ervaring:</strong> {{ .ExperienceName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .Date }}</p>
      <p style="margin: 0 0 8px;"><strong>Tijd:</strong> {{ .Time }}</p>
      <p style="margin: 0;"><strong>Locatie:</strong> {{ .Location }}</p>
    </div>
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0; font-weight: 600; color: #92400e;">Wat meenemen: {{ .WhatToBring }}</p>
    </div>
    <p>We kijken ernaar uit je te zien!</p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Kun je toch niet komen? <a href="{{ .CancelUrl }}">Annuleer je boeking</a> zo snel mogelijk zodat iemand anders je plek kan innemen.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 93. ERVARINGEN — BOEKING GEANNULEERD (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Boeking Geannuleerd (Klant \u2014 Ervaringen)',
    description: 'Bevestiging van annulering van een ervaring aan de klant',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Boeking geannuleerd \u2014 {{ .ExperienceName }}',
    preheader: 'Je boeking is geannuleerd. Hier zijn de details.',
    tags: ['ervaringen', 'experiences', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ExperienceName', label: 'Naam ervaring', required: true },
      { name: 'Date', label: 'Datum', required: true },
      { name: 'RefundInfo', label: 'Terugbetaling info', defaultValue: 'Het bedrag wordt binnen 5\u201310 werkdagen teruggestort.' },
      { name: 'RebookUrl', label: 'Opnieuw boeken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #0891B2, #164E63);"><h1>Boeking Geannuleerd</h1></div>
  <div class="body">
    <h2>Boeking geannuleerd</h2>
    <p>Hoi {{ .CustomerName }},</p>
    <p>We bevestigen dat je boeking voor <strong>{{ .ExperienceName }}</strong> op <strong>{{ .Date }}</strong> is geannuleerd.</p>
    <div style="background: #ecfeff; border-left: 4px solid #0891B2; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Ervaring:</strong> {{ .ExperienceName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .Date }}</p>
      <p style="margin: 0;"><strong>Terugbetaling:</strong> {{ .RefundInfo }}</p>
    </div>
    <p>Jammer dat je er niet bij kunt zijn! Je bent altijd welkom om opnieuw te boeken.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .RebookUrl }}" class="btn" style="background: #0891B2;">Opnieuw boeken</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Heb je vragen over de annulering of terugbetaling? Neem gerust contact met ons op.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 94. ERVARINGEN — BOEKING GEANNULEERD (ADMIN)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Boeking Geannuleerd (Admin \u2014 Ervaringen)',
    description: 'Notificatie aan de admin bij annulering van een ervaring',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Boeking geannuleerd: {{ .CustomerName }} \u2014 {{ .ExperienceName }}',
    preheader: 'Een boeking is geannuleerd',
    tags: ['ervaringen', 'experiences', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'CustomerEmail', label: 'E-mail klant', required: true },
      { name: 'ExperienceName', label: 'Naam ervaring', required: true },
      { name: 'Date', label: 'Datum', required: true },
      { name: 'GroupSize', label: 'Groepsgrootte', defaultValue: '1' },
      { name: 'CancellationReason', label: 'Reden annulering', defaultValue: 'Niet opgegeven' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #0891B2, #164E63);"><h1>Boeking Geannuleerd</h1></div>
  <div class="body">
    <h2>Boeking geannuleerd</h2>
    <p>De volgende boeking is geannuleerd:</p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Klant:</strong> {{ .CustomerName }}</p>
      <p style="margin: 0 0 8px;"><strong>E-mail:</strong> {{ .CustomerEmail }}</p>
      <p style="margin: 0 0 8px;"><strong>Ervaring:</strong> {{ .ExperienceName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .Date }}</p>
      <p style="margin: 0 0 8px;"><strong>Aantal personen:</strong> {{ .GroupSize }}</p>
      <p style="margin: 0;"><strong>Reden annulering:</strong> {{ .CancellationReason }}</p>
    </div>
  </div>
  <div class="footer">
    <p>Automatische notificatie \u2014 Ervaringen Admin</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 95. ERVARINGEN — BOEKING GEWIJZIGD (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Boeking Gewijzigd (Klant \u2014 Ervaringen)',
    description: 'Notificatie aan de klant dat de boeking voor een ervaring is gewijzigd',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Boeking gewijzigd \u2014 {{ .ExperienceName }}',
    preheader: 'Je boeking is gewijzigd. Bekijk de nieuwe details.',
    tags: ['ervaringen', 'experiences', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ExperienceName', label: 'Naam ervaring', required: true },
      { name: 'OldDate', label: 'Oude datum', required: true },
      { name: 'OldTime', label: 'Oude tijd', required: true },
      { name: 'NewDate', label: 'Nieuwe datum', required: true },
      { name: 'NewTime', label: 'Nieuwe tijd', required: true },
      { name: 'BookingUrl', label: 'Boeking bekijken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #0891B2, #164E63);"><h1>Boeking Gewijzigd</h1></div>
  <div class="body">
    <h2>Je boeking is gewijzigd</h2>
    <p>Hoi {{ .CustomerName }},</p>
    <p>Je boeking voor <strong>{{ .ExperienceName }}</strong> is gewijzigd. Hieronder vind je de oude en nieuwe details:</p>
    <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; color: #991b1b; font-weight: 600;">Oud</p>
      <p style="margin: 0 0 4px;"><strong>Datum:</strong> {{ .OldDate }}</p>
      <p style="margin: 0;"><strong>Tijd:</strong> {{ .OldTime }}</p>
    </div>
    <div style="background: #ecfeff; border-left: 4px solid #0891B2; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; color: #164E63; font-weight: 600;">Nieuw</p>
      <p style="margin: 0 0 4px;"><strong>Datum:</strong> {{ .NewDate }}</p>
      <p style="margin: 0;"><strong>Tijd:</strong> {{ .NewTime }}</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .BookingUrl }}" class="btn" style="background: #0891B2;">Boeking bekijken</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Klopt er iets niet? Neem contact met ons op om je boeking aan te passen.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 96. ERVARINGEN — GROEPSERVARING WELKOM
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Groepservaring Welkom (Ervaringen)',
    description: 'Welkomstmail met praktische informatie voor deelnemers aan een groepservaring',
    type: 'transactional',
    category: 'welcome',
    defaultSubject: 'Welkom! Alles wat je moet weten over {{ .ExperienceName }}',
    preheader: 'Leuk dat je meedoet! Dit moet je weten.',
    tags: ['ervaringen', 'experiences', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ExperienceName', label: 'Naam ervaring', required: true },
      { name: 'Date', label: 'Datum', required: true },
      { name: 'Time', label: 'Tijd', required: true },
      { name: 'Location', label: 'Locatie', required: true },
      { name: 'WhatToBring', label: 'Wat meenemen', defaultValue: 'Comfortabele kleding en goed humeur!' },
      { name: 'ParkingInfo', label: 'Parkeerinformatie', defaultValue: 'Gratis parkeren voor de deur.' },
      { name: 'GroupSize', label: 'Groepsgrootte', defaultValue: '' },
      { name: 'BookingUrl', label: 'Boeking bekijken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #0891B2, #164E63);"><h1>Welkom bij {{ .ExperienceName }}!</h1></div>
  <div class="body">
    <h2>Leuk dat je meedoet!</h2>
    <p>Hoi {{ .CustomerName }},</p>
    <p>Wat fijn dat je je hebt aangemeld voor <strong>{{ .ExperienceName }}</strong>! Hier vind je alle praktische informatie die je nodig hebt.</p>
    <div style="background: #ecfeff; border-left: 4px solid #0891B2; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Ervaring:</strong> {{ .ExperienceName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .Date }}</p>
      <p style="margin: 0 0 8px;"><strong>Tijd:</strong> {{ .Time }}</p>
      <p style="margin: 0 0 8px;"><strong>Locatie:</strong> {{ .Location }}</p>
      <p style="margin: 0;"><strong>Groepsgrootte:</strong> {{ .GroupSize }}</p>
    </div>
    <h2 style="font-size: 17px; margin-top: 28px;">Wat moet je meenemen?</h2>
    <p>{{ .WhatToBring }}</p>
    <h2 style="font-size: 17px; margin-top: 28px;">Locatie & Parkeren</h2>
    <p><strong>Adres:</strong> {{ .Location }}</p>
    <p><strong>Parkeren:</strong> {{ .ParkingInfo }}</p>
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0; font-weight: 600; color: #92400e;">Tip: Kom 10 minuten eerder zodat we op tijd kunnen starten.</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .BookingUrl }}" class="btn" style="background: #0891B2;">Boeking bekijken</a>
    </p>
    <p>We kijken ernaar uit je te ontmoeten!</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 97. ERVARINGEN — REVIEW VERZOEK (NA ERVARING)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Review Verzoek (Na Ervaring)',
    description: 'Review verzoek aan de klant na een afgeronde ervaring',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Hoe was {{ .ExperienceName }}, {{ .CustomerName }}?',
    preheader: 'Deel je ervaring en help andere deelnemers',
    tags: ['ervaringen', 'experiences', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ExperienceName', label: 'Naam ervaring', required: true },
      { name: 'Date', label: 'Datum', required: true },
      { name: 'ReviewUrl', label: 'Review URL', required: true },
      { name: 'RebookUrl', label: 'Opnieuw boeken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #0891B2, #164E63);"><h1>Hoe was het?</h1></div>
  <div class="body">
    <h2>Hoe was {{ .ExperienceName }}?</h2>
    <p>Hoi {{ .CustomerName }},</p>
    <p>Je hebt op <strong>{{ .Date }}</strong> deelgenomen aan <strong>{{ .ExperienceName }}</strong>. We hopen dat je een geweldige tijd hebt gehad!</p>
    <p>We horen graag hoe je het hebt ervaren. Je review helpt ons om nog betere ervaringen te cre\u00ebren en helpt andere deelnemers bij hun keuze.</p>
    <div class="stars" style="text-align: center; margin: 20px 0;">&#9733; &#9733; &#9733; &#9733; &#9733;</div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ReviewUrl }}" class="btn" style="background: #0891B2;">Review schrijven</a>
    </p>
    <hr class="divider">
    <p style="text-align: center;">Zo leuk dat je het opnieuw wilt beleven?</p>
    <p style="text-align: center; margin: 16px 0;">
      <a href="{{ .RebookUrl }}" class="btn" style="background: #164E63;">Opnieuw boeken</a>
    </p>
    <p style="font-size: 13px; color: #94a3b8; text-align: center;">Het schrijven van een review duurt slechts 1 minuut. Bedankt!</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // HOSPITALITY BRANCH — PRAKTIJK TEMPLATES (98–105)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 98. HOSPITALITY — AFSPRAAK BEVESTIGING (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Afspraak Bevestiging (Klant \u2014 Hospitality)',
    description: 'Bevestigingsmail naar de klant na het boeken van een afspraak bij een praktijk',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Afspraak bevestigd \u2014 {{ .ServiceName }} op {{ .AppointmentDate }}',
    preheader: 'Uw afspraak is bevestigd! Hier zijn de details.',
    tags: ['hospitality', 'praktijk', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceName', label: 'Dienst/Behandeling', required: true },
      { name: 'AppointmentDate', label: 'Datum afspraak', required: true },
      { name: 'AppointmentTime', label: 'Tijd afspraak', required: true },
      { name: 'Duration', label: 'Duur (bijv. "30 min")', defaultValue: '30 min' },
      { name: 'PractitionerName', label: 'Naam behandelaar', required: true },
      { name: 'PracticeName', label: 'Naam praktijk', defaultValue: 'Onze praktijk' },
      { name: 'PracticeAddress', label: 'Adres praktijk', defaultValue: '' },
      { name: 'BookingUrl', label: 'Afspraak bekijken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #059669, #065F46);"><h1>{{ .PracticeName }}</h1></div>
  <div class="body">
    <h2>Uw afspraak is bevestigd!</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Fijn dat u een afspraak heeft gemaakt. Hieronder vindt u de details:</p>
    <div style="background: #ecfdf5; border-left: 4px solid #059669; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Dienst:</strong> {{ .ServiceName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .AppointmentDate }}</p>
      <p style="margin: 0 0 8px;"><strong>Tijd:</strong> {{ .AppointmentTime }}</p>
      <p style="margin: 0 0 8px;"><strong>Duur:</strong> {{ .Duration }}</p>
      <p style="margin: 0 0 8px;"><strong>Behandelaar:</strong> {{ .PractitionerName }}</p>
      <p style="margin: 0;"><strong>Locatie:</strong> {{ .PracticeAddress }}</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .BookingUrl }}" class="btn" style="background: #059669;">Afspraak bekijken</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Moet u uw afspraak wijzigen of annuleren? Dat kan via bovenstaande link of neem telefonisch contact met ons op.</p>
  </div>
  <div class="footer">
    <p>{{ .PracticeName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 99. HOSPITALITY — AFSPRAAK BEVESTIGING (PRAKTIJK)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Afspraak Bevestiging (Praktijk \u2014 Hospitality)',
    description: 'Notificatie aan de praktijk admin bij een nieuwe afspraak',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Nieuwe afspraak: {{ .CustomerName }} \u2014 {{ .ServiceName }}',
    preheader: 'Er is een nieuwe afspraak geboekt',
    tags: ['hospitality', 'praktijk', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'CustomerEmail', label: 'E-mail klant', required: true },
      { name: 'CustomerPhone', label: 'Telefoonnummer klant', defaultValue: '' },
      { name: 'ServiceName', label: 'Dienst/Behandeling', required: true },
      { name: 'AppointmentDate', label: 'Datum afspraak', required: true },
      { name: 'AppointmentTime', label: 'Tijd afspraak', required: true },
      { name: 'PractitionerName', label: 'Naam behandelaar', required: true },
      { name: 'IsFirstVisit', label: 'Eerste bezoek (ja/nee)', defaultValue: 'nee' },
      { name: 'Remarks', label: 'Opmerkingen klant', defaultValue: 'Geen' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #059669, #065F46);"><h1>Nieuwe Afspraak</h1></div>
  <div class="body">
    <h2>Nieuwe afspraak ontvangen</h2>
    <p>Er is een nieuwe afspraak geboekt via de website:</p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Klant:</strong> {{ .CustomerName }}</p>
      <p style="margin: 0 0 8px;"><strong>E-mail:</strong> {{ .CustomerEmail }}</p>
      <p style="margin: 0 0 8px;"><strong>Telefoon:</strong> {{ .CustomerPhone }}</p>
      <p style="margin: 0 0 8px;"><strong>Dienst:</strong> {{ .ServiceName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .AppointmentDate }}</p>
      <p style="margin: 0 0 8px;"><strong>Tijd:</strong> {{ .AppointmentTime }}</p>
      <p style="margin: 0 0 8px;"><strong>Behandelaar:</strong> {{ .PractitionerName }}</p>
      <p style="margin: 0 0 8px;"><strong>Eerste bezoek:</strong> {{ .IsFirstVisit }}</p>
      <p style="margin: 0;"><strong>Opmerkingen:</strong> {{ .Remarks }}</p>
    </div>
  </div>
  <div class="footer">
    <p>Automatische notificatie \u2014 Praktijk Admin</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 100. HOSPITALITY — AFSPRAAK HERINNERING
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Afspraak Herinnering (Hospitality)',
    description: 'Herinnering aan de klant 1 dag voor de afspraak bij de praktijk',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Herinnering: {{ .ServiceName }} morgen om {{ .AppointmentTime }}',
    preheader: 'Niet vergeten: uw afspraak is morgen!',
    tags: ['hospitality', 'praktijk', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceName', label: 'Dienst/Behandeling', required: true },
      { name: 'AppointmentDate', label: 'Datum afspraak', required: true },
      { name: 'AppointmentTime', label: 'Tijd afspraak', required: true },
      { name: 'PractitionerName', label: 'Naam behandelaar', required: true },
      { name: 'PracticeAddress', label: 'Adres praktijk', defaultValue: '' },
      { name: 'CancelUrl', label: 'Annulerings URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #059669, #065F46);"><h1>Herinnering</h1></div>
  <div class="body">
    <h2>Uw afspraak is morgen!</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Een vriendelijke herinnering: uw afspraak voor <strong>{{ .ServiceName }}</strong> is morgen.</p>
    <div style="background: #ecfdf5; border-left: 4px solid #059669; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Dienst:</strong> {{ .ServiceName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .AppointmentDate }}</p>
      <p style="margin: 0 0 8px;"><strong>Tijd:</strong> {{ .AppointmentTime }}</p>
      <p style="margin: 0 0 8px;"><strong>Behandelaar:</strong> {{ .PractitionerName }}</p>
      <p style="margin: 0;"><strong>Locatie:</strong> {{ .PracticeAddress }}</p>
    </div>
    <p style="font-size: 13px; color: #6b7280;">Tip: Kom 5 minuten eerder zodat we op tijd kunnen beginnen.</p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Kunt u toch niet komen? <a href="{{ .CancelUrl }}">Annuleer uw afspraak</a> zo snel mogelijk zodat iemand anders uw plek kan innemen.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 101. HOSPITALITY — AFSPRAAK GEANNULEERD (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Afspraak Geannuleerd (Klant \u2014 Hospitality)',
    description: 'Bevestiging van annulering van een afspraak aan de klant',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Afspraak geannuleerd \u2014 {{ .ServiceName }}',
    preheader: 'Uw afspraak is geannuleerd.',
    tags: ['hospitality', 'praktijk', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceName', label: 'Dienst/Behandeling', required: true },
      { name: 'AppointmentDate', label: 'Datum afspraak', required: true },
      { name: 'PracticePhone', label: 'Telefoonnummer praktijk', defaultValue: '' },
      { name: 'RebookUrl', label: 'Opnieuw boeken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #059669, #065F46);"><h1>Afspraak Geannuleerd</h1></div>
  <div class="body">
    <h2>Afspraak geannuleerd</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>We bevestigen dat uw afspraak voor <strong>{{ .ServiceName }}</strong> op <strong>{{ .AppointmentDate }}</strong> is geannuleerd.</p>
    <p>Jammer dat het niet is gelukt. U kunt altijd een nieuwe afspraak maken wanneer het u beter uitkomt.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .RebookUrl }}" class="btn" style="background: #059669;">Nieuwe afspraak maken</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Heeft u vragen? Neem contact op via {{ .PracticePhone }}. We helpen u graag verder.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 102. HOSPITALITY — AFSPRAAK GEANNULEERD (PRAKTIJK)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Afspraak Geannuleerd (Praktijk \u2014 Hospitality)',
    description: 'Notificatie aan de praktijk admin bij annulering van een afspraak',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Afspraak geannuleerd: {{ .CustomerName }} \u2014 {{ .ServiceName }}',
    preheader: 'Een afspraak is geannuleerd',
    tags: ['hospitality', 'praktijk', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'CustomerEmail', label: 'E-mail klant', required: true },
      { name: 'ServiceName', label: 'Dienst/Behandeling', required: true },
      { name: 'AppointmentDate', label: 'Datum afspraak', required: true },
      { name: 'PractitionerName', label: 'Naam behandelaar', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #059669, #065F46);"><h1>Afspraak Geannuleerd</h1></div>
  <div class="body">
    <h2>Afspraak geannuleerd</h2>
    <p>De volgende afspraak is geannuleerd:</p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Klant:</strong> {{ .CustomerName }}</p>
      <p style="margin: 0 0 8px;"><strong>E-mail:</strong> {{ .CustomerEmail }}</p>
      <p style="margin: 0 0 8px;"><strong>Dienst:</strong> {{ .ServiceName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .AppointmentDate }}</p>
      <p style="margin: 0;"><strong>Behandelaar:</strong> {{ .PractitionerName }}</p>
    </div>
  </div>
  <div class="footer">
    <p>Automatische notificatie \u2014 Praktijk Admin</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 103. HOSPITALITY — AFSPRAAK VERZET (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Afspraak Verzet (Klant \u2014 Hospitality)',
    description: 'Notificatie aan de klant dat de afspraak is verzet naar een nieuw tijdstip',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Afspraak verzet \u2014 {{ .ServiceName }} naar {{ .NewDate }}',
    preheader: 'Uw afspraak is verzet. Bekijk de nieuwe details.',
    tags: ['hospitality', 'praktijk', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceName', label: 'Dienst/Behandeling', required: true },
      { name: 'OldDate', label: 'Oude datum', required: true },
      { name: 'OldTime', label: 'Oude tijd', required: true },
      { name: 'NewDate', label: 'Nieuwe datum', required: true },
      { name: 'NewTime', label: 'Nieuwe tijd', required: true },
      { name: 'PractitionerName', label: 'Naam behandelaar', required: true },
      { name: 'BookingUrl', label: 'Afspraak bekijken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #059669, #065F46);"><h1>Afspraak Verzet</h1></div>
  <div class="body">
    <h2>Uw afspraak is verzet</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Uw afspraak voor <strong>{{ .ServiceName }}</strong> bij <strong>{{ .PractitionerName }}</strong> is verzet. Hieronder vindt u de oude en nieuwe details:</p>
    <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; color: #991b1b; font-weight: 600;">Oud</p>
      <p style="margin: 0 0 4px;"><strong>Datum:</strong> {{ .OldDate }}</p>
      <p style="margin: 0;"><strong>Tijd:</strong> {{ .OldTime }}</p>
    </div>
    <div style="background: #ecfdf5; border-left: 4px solid #059669; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; color: #065F46; font-weight: 600;">Nieuw</p>
      <p style="margin: 0 0 4px;"><strong>Datum:</strong> {{ .NewDate }}</p>
      <p style="margin: 0;"><strong>Tijd:</strong> {{ .NewTime }}</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .BookingUrl }}" class="btn" style="background: #059669;">Afspraak bekijken</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Komt het nieuwe tijdstip niet uit? Neem contact met ons op om een ander moment te kiezen.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 104. HOSPITALITY — EERSTE BEZOEK WELKOM
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Eerste Bezoek Welkom (Hospitality)',
    description: 'Welkomstmail voor klanten die voor het eerst een afspraak hebben bij de praktijk',
    type: 'transactional',
    category: 'welcome',
    defaultSubject: 'Welkom bij {{ .PracticeName }}! Alles over uw eerste bezoek',
    preheader: 'Fijn dat u langskomt! Dit kunt u verwachten.',
    tags: ['hospitality', 'praktijk', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceName', label: 'Dienst/Behandeling', required: true },
      { name: 'AppointmentDate', label: 'Datum afspraak', required: true },
      { name: 'AppointmentTime', label: 'Tijd afspraak', required: true },
      { name: 'PractitionerName', label: 'Naam behandelaar', required: true },
      { name: 'PracticeName', label: 'Naam praktijk', defaultValue: 'Onze praktijk' },
      { name: 'PracticeAddress', label: 'Adres praktijk', defaultValue: '' },
      { name: 'ParkingInfo', label: 'Parkeerinformatie', defaultValue: 'Gratis parkeren voor de deur.' },
      { name: 'WhatToExpect', label: 'Wat te verwachten', defaultValue: 'We beginnen met een korte intake om uw situatie te bespreken, waarna de behandeling start.' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #059669, #065F46);"><h1>Welkom bij {{ .PracticeName }}!</h1></div>
  <div class="body">
    <h2>Fijn dat u langskomt!</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Welkom bij <strong>{{ .PracticeName }}</strong>! Omdat het uw eerste bezoek is, willen we u graag vertellen wat u kunt verwachten.</p>
    <div style="background: #ecfdf5; border-left: 4px solid #059669; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Dienst:</strong> {{ .ServiceName }}</p>
      <p style="margin: 0 0 8px;"><strong>Datum:</strong> {{ .AppointmentDate }}</p>
      <p style="margin: 0 0 8px;"><strong>Tijd:</strong> {{ .AppointmentTime }}</p>
      <p style="margin: 0;"><strong>Behandelaar:</strong> {{ .PractitionerName }}</p>
    </div>
    <h2 style="font-size: 17px; margin-top: 28px;">Wat kunt u verwachten?</h2>
    <p>{{ .WhatToExpect }}</p>
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0; font-weight: 600; color: #92400e;">Tip: Kom 10 minuten eerder zodat we rustig kennis kunnen maken.</p>
    </div>
    <h2 style="font-size: 17px; margin-top: 28px;">Locatie & Parkeren</h2>
    <p><strong>Adres:</strong> {{ .PracticeAddress }}</p>
    <p><strong>Parkeren:</strong> {{ .ParkingInfo }}</p>
    <p>We kijken ernaar uit u te ontmoeten!</p>
  </div>
  <div class="footer">
    <p>{{ .PracticeName }} &mdash; <a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 105. HOSPITALITY — REVIEW VERZOEK (NA BEZOEK)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Review Verzoek (Na Bezoek \u2014 Hospitality)',
    description: 'Review verzoek aan de klant na een bezoek aan de praktijk',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Hoe was uw bezoek, {{ .CustomerName }}?',
    preheader: 'Deel uw ervaring en help andere klanten',
    tags: ['hospitality', 'praktijk', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceName', label: 'Dienst/Behandeling', required: true },
      { name: 'PractitionerName', label: 'Naam behandelaar', required: true },
      { name: 'AppointmentDate', label: 'Datum bezoek', required: true },
      { name: 'ReviewUrl', label: 'Review URL', required: true },
      { name: 'RebookUrl', label: 'Opnieuw boeken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #059669, #065F46);"><h1>Hoe was uw bezoek?</h1></div>
  <div class="body">
    <h2>Hoe was uw bezoek?</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>U bent op <strong>{{ .AppointmentDate }}</strong> bij <strong>{{ .PractitionerName }}</strong> geweest voor <strong>{{ .ServiceName }}</strong>. We hopen dat u tevreden bent!</p>
    <p>Uw mening is waardevol voor ons. Een review helpt ons om nog betere zorg te bieden en helpt andere klanten bij hun keuze.</p>
    <div class="stars" style="text-align: center; margin: 20px 0;">&#9733; &#9733; &#9733; &#9733; &#9733;</div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ReviewUrl }}" class="btn" style="background: #059669;">Review schrijven</a>
    </p>
    <hr class="divider">
    <p style="text-align: center;">Tevreden? Maak direct een nieuwe afspraak:</p>
    <p style="text-align: center; margin: 16px 0;">
      <a href="{{ .RebookUrl }}" class="btn" style="background: #065F46;">Nieuwe afspraak maken</a>
    </p>
    <p style="font-size: 13px; color: #94a3b8; text-align: center;">Het schrijven van een review duurt slechts 1 minuut. Bedankt!</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // PROFESSIONAL-SERVICES BRANCH — ZAKELIJKE DIENSTVERLENING TEMPLATES (106–113)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 106. ZAKELIJK — ADVIESGESPREK BEVESTIGING (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Adviesgesprek Bevestiging (Klant)',
    description: 'Bevestigingsmail naar de klant na het indienen van een adviesgesprek aanvraag',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Adviesgesprek aanvraag ontvangen \u2014 {{ .ServiceType }}',
    preheader: 'Bedankt voor uw aanvraag! We nemen snel contact met u op.',
    tags: ['zakelijk', 'professional-services', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceType', label: 'Type dienst', required: true },
      { name: 'CompanyName', label: 'Bedrijfsnaam', defaultValue: '' },
      { name: 'Description', label: 'Omschrijving vraag', required: true },
      { name: 'PreferredDate', label: 'Voorkeursdatum', defaultValue: 'In overleg' },
      { name: 'ConsultationUrl', label: 'Aanvraag bekijken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #667eea, #764ba2);"><h1>Adviesgesprek Aanvraag Ontvangen</h1></div>
  <div class="body">
    <h2>Bedankt voor uw aanvraag!</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Wij hebben uw aanvraag voor een adviesgesprek in goede orde ontvangen. Hieronder vindt u een overzicht:</p>
    <div style="background: #f0eeff; border-left: 4px solid #667eea; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Type dienst:</strong> {{ .ServiceType }}</p>
      <p style="margin: 0 0 8px;"><strong>Bedrijf:</strong> {{ .CompanyName }}</p>
      <p style="margin: 0 0 8px;"><strong>Omschrijving:</strong> {{ .Description }}</p>
      <p style="margin: 0;"><strong>Voorkeursdatum:</strong> {{ .PreferredDate }}</p>
    </div>
    <p>Ons team neemt zo snel mogelijk contact met u op om een geschikt moment in te plannen voor het adviesgesprek.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ConsultationUrl }}" class="btn" style="background: #667eea;">Aanvraag bekijken</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Heeft u tussentijds vragen? Neem gerust contact met ons op. We helpen u graag verder.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 107. ZAKELIJK — ADVIESGESPREK ONTVANGEN (ADMIN)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Adviesgesprek Ontvangen (Admin)',
    description: 'Notificatie aan de admin bij een nieuwe adviesgesprek aanvraag',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Nieuwe adviesgesprek aanvraag: {{ .CustomerName }} \u2014 {{ .ServiceType }}',
    preheader: 'Er is een nieuwe adviesgesprek aanvraag ontvangen',
    tags: ['zakelijk', 'professional-services', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'CustomerEmail', label: 'E-mail klant', required: true },
      { name: 'CustomerPhone', label: 'Telefoonnummer klant', defaultValue: '' },
      { name: 'CompanyName', label: 'Bedrijfsnaam', defaultValue: '' },
      { name: 'ServiceType', label: 'Type dienst', required: true },
      { name: 'Description', label: 'Omschrijving vraag', required: true },
      { name: 'EstimatedBudget', label: 'Geschat budget', defaultValue: 'Niet opgegeven' },
      { name: 'PreferredDate', label: 'Voorkeursdatum', defaultValue: 'In overleg' },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #667eea, #764ba2);"><h1>Nieuwe Adviesgesprek Aanvraag</h1></div>
  <div class="body">
    <h2>Nieuwe aanvraag ontvangen</h2>
    <p>Er is een nieuwe adviesgesprek aanvraag binnengekomen via de website:</p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Klant:</strong> {{ .CustomerName }}</p>
      <p style="margin: 0 0 8px;"><strong>E-mail:</strong> {{ .CustomerEmail }}</p>
      <p style="margin: 0 0 8px;"><strong>Telefoon:</strong> {{ .CustomerPhone }}</p>
      <p style="margin: 0 0 8px;"><strong>Bedrijf:</strong> {{ .CompanyName }}</p>
      <p style="margin: 0 0 8px;"><strong>Type dienst:</strong> {{ .ServiceType }}</p>
      <p style="margin: 0 0 8px;"><strong>Omschrijving:</strong> {{ .Description }}</p>
      <p style="margin: 0 0 8px;"><strong>Geschat budget:</strong> {{ .EstimatedBudget }}</p>
      <p style="margin: 0;"><strong>Voorkeursdatum:</strong> {{ .PreferredDate }}</p>
    </div>
  </div>
  <div class="footer">
    <p>Automatische notificatie \u2014 Zakelijke Dienstverlening Admin</p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 108. ZAKELIJK — VOORSTEL GEREED (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Voorstel Gereed (Klant)',
    description: 'Notificatie aan de klant dat het zakelijke voorstel klaar is',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Uw voorstel is gereed \u2014 {{ .ServiceType }}',
    preheader: 'Uw voorstel is klaar! Bekijk het voorstel en de details.',
    tags: ['zakelijk', 'professional-services', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceType', label: 'Type dienst', required: true },
      { name: 'ProposalAmount', label: 'Voorstelbedrag', required: true },
      { name: 'ValidUntil', label: 'Geldig tot', required: true },
      { name: 'AccountManager', label: 'Naam accountmanager', required: true },
      { name: 'ProposalUrl', label: 'Voorstel bekijken URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #667eea, #764ba2);"><h1>Uw Voorstel is Gereed</h1></div>
  <div class="body">
    <h2>Voorstel gereed voor {{ .ServiceType }}</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Goed nieuws! Uw voorstel voor <strong>{{ .ServiceType }}</strong> is gereed en klaar om te bekijken.</p>
    <div style="background: #f0eeff; border-left: 4px solid #667eea; padding: 16px; border-radius: 4px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 4px; font-size: 13px; color: #6b7280;">Voorstelbedrag</p>
      <p style="margin: 0 0 12px; font-size: 28px; font-weight: 700; color: #667eea;">{{ .ProposalAmount }}</p>
      <p style="margin: 0; font-size: 13px; color: #6b7280;">Geldig tot {{ .ValidUntil }}</p>
    </div>
    <p>Uw accountmanager <strong>{{ .AccountManager }}</strong> heeft het voorstel opgesteld op basis van uw wensen. Bij vragen kunt u rechtstreeks contact opnemen.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ProposalUrl }}" class="btn" style="background: #667eea;">Voorstel bekijken</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Dit voorstel is vrijblijvend en geldig tot {{ .ValidUntil }}. Na die datum kan het bedrag afwijken.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 109. ZAKELIJK — VOORSTEL GEACCEPTEERD — WELKOM (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Voorstel Geaccepteerd \u2014 Welkom (Klant)',
    description: 'Welkomstmail aan de klant na het accepteren van een zakelijk voorstel',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Welkom als opdrachtgever! \u2014 {{ .ServiceType }}',
    preheader: 'Welkom! Hier leest u wat u kunt verwachten.',
    tags: ['zakelijk', 'professional-services', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceType', label: 'Type dienst', required: true },
      { name: 'AccountManager', label: 'Naam accountmanager', required: true },
      { name: 'AccountManagerPhone', label: 'Telefoon accountmanager', required: true },
      { name: 'StartDate', label: 'Geplande startdatum', required: true },
      { name: 'ProjectUrl', label: 'Project portaal URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #667eea, #764ba2);"><h1>Welkom als Opdrachtgever!</h1></div>
  <div class="body">
    <h2>Welkom bij ons team!</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Bedankt voor uw vertrouwen! Wij zijn verheugd om aan de slag te gaan met <strong>{{ .ServiceType }}</strong>. Hieronder leest u wat u kunt verwachten:</p>
    <div style="background: #f0eeff; border-left: 4px solid #667eea; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 12px;"><strong>1.</strong> Uw accountmanager <strong>{{ .AccountManager }}</strong> neemt contact met u op (tel: {{ .AccountManagerPhone }})</p>
      <p style="margin: 0 0 12px;"><strong>2.</strong> Samen stellen we een gedetailleerd plan van aanpak op</p>
      <p style="margin: 0 0 12px;"><strong>3.</strong> U ontvangt toegang tot het project portaal</p>
      <p style="margin: 0;"><strong>4.</strong> De werkzaamheden starten op <strong>{{ .StartDate }}</strong></p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ProjectUrl }}" class="btn" style="background: #667eea;">Project portaal openen</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Via het project portaal kunt u altijd de voortgang volgen en documenten inzien. Bij vragen kunt u terecht bij {{ .AccountManager }}.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 110. ZAKELIJK — VOORSTEL AFGEWEZEN (KLANT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Voorstel Afgewezen (Klant)',
    description: 'Opvolgmail naar de klant na het afwijzen van een zakelijk voorstel',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Bedankt voor uw interesse \u2014 {{ .ServiceType }}',
    preheader: 'Jammer dat het niet is geworden. De deur staat altijd open!',
    tags: ['zakelijk', 'professional-services', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceType', label: 'Type dienst', required: true },
      { name: 'NewConsultationUrl', label: 'Nieuw adviesgesprek URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #667eea, #764ba2);"><h1>Bedankt voor uw Interesse</h1></div>
  <div class="body">
    <h2>Bedankt voor uw interesse</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>We begrijpen dat u heeft besloten om op dit moment niet verder te gaan met het voorstel voor <strong>{{ .ServiceType }}</strong>. Dat respecteren wij uiteraard volledig.</p>
    <p>Mocht u in de toekomst alsnog behoefte hebben aan onze dienstverlening, dan staan wij graag voor u klaar. Onze deur staat altijd open voor een vrijblijvend adviesgesprek.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .NewConsultationUrl }}" class="btn" style="background: #667eea;">Nieuw adviesgesprek aanvragen</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">We waarderen het dat u ons heeft overwogen. Mocht u feedback hebben over ons voorstel, horen we dat graag.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 111. ZAKELIJK — OPDRACHT VOORTGANG UPDATE
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Opdracht Voortgang Update (Zakelijk)',
    description: 'Voortgangsupdate voor de klant over de status van de zakelijke opdracht',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Voortgang update \u2014 {{ .ServiceType }}',
    preheader: 'Er is een update over de voortgang van uw opdracht.',
    tags: ['zakelijk', 'professional-services', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceType', label: 'Type dienst', required: true },
      { name: 'Phase', label: 'Huidige fase', required: true },
      { name: 'UpdateMessage', label: 'Voortgangsbericht', required: true },
      { name: 'NextSteps', label: 'Volgende stappen', required: true },
      { name: 'ProjectUrl', label: 'Project portaal URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #667eea, #764ba2);"><h1>Voortgang Update</h1></div>
  <div class="body">
    <h2>Voortgang update \u2014 {{ .ServiceType }}</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Hierbij informeren wij u over de voortgang van uw opdracht.</p>
    <div style="background: #f0eeff; border-left: 4px solid #667eea; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Opdracht:</strong> {{ .ServiceType }}</p>
      <p style="margin: 0 0 8px;"><strong>Huidige fase:</strong> {{ .Phase }}</p>
      <p style="margin: 0;"><strong>Status:</strong> {{ .UpdateMessage }}</p>
    </div>
    <h2 style="font-size: 17px; margin-top: 28px;">Volgende stappen</h2>
    <p>{{ .NextSteps }}</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ProjectUrl }}" class="btn" style="background: #667eea;">Project portaal openen</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Heeft u vragen over de voortgang? Neem contact op met uw accountmanager.</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 112. ZAKELIJK — OPDRACHT AFGEROND
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Opdracht Afgerond (Zakelijk)',
    description: 'Notificatie aan de klant dat de zakelijke opdracht is afgerond',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Opdracht afgerond \u2014 {{ .ServiceType }}',
    preheader: 'Uw opdracht is afgerond! Bekijk het overzicht.',
    tags: ['zakelijk', 'professional-services', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceType', label: 'Type dienst', required: true },
      { name: 'CompletionDate', label: 'Afrondingsdatum', required: true },
      { name: 'DeliverablesSummary', label: 'Samenvatting opgeleverd werk', required: true },
      { name: 'ReviewUrl', label: 'Review URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #667eea, #764ba2);"><h1>Opdracht Afgerond!</h1></div>
  <div class="body">
    <h2>Uw opdracht is afgerond</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Met genoegen melden wij dat uw opdracht <strong>{{ .ServiceType }}</strong> op <strong>{{ .CompletionDate }}</strong> is afgerond. Wij hopen dat het resultaat aan uw verwachtingen voldoet!</p>
    <div style="background: #f0eeff; border-left: 4px solid #667eea; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Opdracht:</strong> {{ .ServiceType }}</p>
      <p style="margin: 0 0 8px;"><strong>Afrondingsdatum:</strong> {{ .CompletionDate }}</p>
      <p style="margin: 0;"><strong>Opgeleverd:</strong> {{ .DeliverablesSummary }}</p>
    </div>
    <p>Mocht u na de oplevering nog vragen of opmerkingen hebben, neem dan gerust contact met ons op.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ReviewUrl }}" class="btn" style="background: #667eea;">Beoordeling achterlaten</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #94a3b8;">Bedankt voor de prettige samenwerking. We kijken uit naar een eventueel vervolg!</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 113. ZAKELIJK — REVIEW VERZOEK (NA OPDRACHT)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Review Verzoek (Na Opdracht \u2014 Zakelijk)',
    description: 'Review verzoek aan de klant na een afgeronde zakelijke opdracht',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Hoe was onze dienstverlening, {{ .CustomerName }}?',
    preheader: 'Deel uw ervaring en help andere opdrachtgevers',
    tags: ['zakelijk', 'professional-services', 'predefined'],
    variables: [
      { name: 'CustomerName', label: 'Klantnaam', required: true },
      { name: 'ServiceType', label: 'Type dienst', required: true },
      { name: 'AccountManager', label: 'Naam accountmanager', required: true },
      { name: 'ReviewUrl', label: 'Review URL', required: true },
      { name: 'RebookUrl', label: 'Nieuwe opdracht URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #667eea, #764ba2);"><h1>Hoe was onze dienstverlening?</h1></div>
  <div class="body">
    <h2>Hoe was onze dienstverlening?</h2>
    <p>Beste {{ .CustomerName }},</p>
    <p>Uw opdracht <strong>{{ .ServiceType }}</strong> is afgerond onder leiding van <strong>{{ .AccountManager }}</strong>. We hopen dat u tevreden bent met onze dienstverlening!</p>
    <p>Uw mening is waardevol voor ons. Een review helpt ons om nog betere diensten te leveren en helpt andere opdrachtgevers bij hun keuze.</p>
    <div class="stars" style="text-align: center; margin: 20px 0;">&#9733; &#9733; &#9733; &#9733; &#9733;</div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ReviewUrl }}" class="btn" style="background: #667eea;">Review schrijven</a>
    </p>
    <hr class="divider">
    <p style="text-align: center;">Tevreden? Start direct een nieuwe opdracht:</p>
    <p style="text-align: center; margin: 16px 0;">
      <a href="{{ .RebookUrl }}" class="btn" style="background: #764ba2;">Nieuwe opdracht bespreken</a>
    </p>
    <p style="font-size: 13px; color: #94a3b8; text-align: center;">Het schrijven van een review duurt slechts 1 minuut. Bedankt!</p>
  </div>
  <div class="footer">
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 114. MARKETPLACE — LEVERANCIER AANVRAAG ONTVANGEN (ADMIN)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Leverancier Aanvraag Ontvangen (Admin)',
    description: 'Notificatie aan admin bij nieuwe leverancier aanvraag',
    type: 'transactional',
    category: 'notification',
    defaultSubject: 'Nieuwe leverancier aanvraag: {{ .CompanyName }}',
    preheader: 'Een nieuw bedrijf wil leverancier worden',
    tags: ['marketplace', 'vendor', 'notification', 'predefined'],
    variables: [
      { name: 'CompanyName', label: 'Bedrijfsnaam', required: true },
      { name: 'ContactPerson', label: 'Contactpersoon', required: true },
      { name: 'Email', label: 'E-mailadres', required: true },
      { name: 'Phone', label: 'Telefoonnummer' },
      { name: 'Description', label: 'Beschrijving', required: true },
      { name: 'AdminUrl', label: 'Admin URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #0A1628, #121F33);"><h1>Nieuwe leverancier aanvraag</h1></div>
  <div class="body">
    <h2>{{ .CompanyName }} wil leverancier worden</h2>
    <p>Er is een nieuwe leverancier aanvraag ontvangen via het partnerprogramma.</p>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Bedrijf</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">{{ .CompanyName }}</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Contact</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">{{ .ContactPerson }}</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">E-mail</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:{{ .Email }}">{{ .Email }}</a></td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Telefoon</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">{{ .Phone }}</td></tr>
    </table>
    <p><strong>Beschrijving:</strong></p>
    <p style="background: #f8fafc; padding: 12px; border-radius: 8px;">{{ .Description }}</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .AdminUrl }}" class="btn" style="background: #00897B;">Bekijk aanvraag in admin</a>
    </p>
  </div>
  <div class="footer"><p>Dit is een automatische notificatie.</p></div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 115. MARKETPLACE — LEVERANCIER AANVRAAG BEVESTIGING
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Leverancier Aanvraag Bevestiging',
    description: 'Bevestigingsmail aan de aanvrager na indienen leverancier aanvraag',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Uw aanvraag als leverancier is ontvangen',
    preheader: 'Bedankt voor uw interesse in ons partnerprogramma',
    tags: ['marketplace', 'vendor', 'transactional', 'predefined'],
    variables: [
      { name: 'ContactPerson', label: 'Contactpersoon', required: true },
      { name: 'CompanyName', label: 'Bedrijfsnaam', required: true },
      { name: 'ShopName', label: 'Webshop naam', required: true, defaultValue: 'Ons platform' },
      { name: 'ShopUrl', label: 'Webshop URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #0A1628, #121F33);"><h1>Aanvraag ontvangen</h1></div>
  <div class="body">
    <h2>Bedankt voor uw aanvraag!</h2>
    <p>Beste {{ .ContactPerson }},</p>
    <p>Wij hebben uw aanvraag namens <strong>{{ .CompanyName }}</strong> in goede orde ontvangen. Ons team beoordeelt uw aanvraag en neemt binnen 5 werkdagen contact met u op.</p>
    <p><strong>Wat kunt u verwachten?</strong></p>
    <ul>
      <li>Beoordeling van uw aanvraag door ons team</li>
      <li>Persoonlijk contact voor verdere afstemming</li>
      <li>Onboarding begeleiding na goedkeuring</li>
    </ul>
    <p>Heeft u in de tussentijd vragen? Neem gerust contact met ons op.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .ShopUrl }}/vendors" class="btn" style="background: #00897B;">Bekijk onze leveranciers</a>
    </p>
  </div>
  <div class="footer">
    <p>Met vriendelijke groet, het {{ .ShopName }} team</p>
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },

  // ═══════════════════════════════════════════════════════════
  // 116. MARKETPLACE — LEVERANCIER AANVRAAG STATUS UPDATE
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Leverancier Aanvraag Status Update',
    description: 'Status update email aan aanvrager (goedgekeurd/afgewezen)',
    type: 'transactional',
    category: 'transactional',
    defaultSubject: 'Update over uw leverancier aanvraag',
    preheader: 'Er is een update over uw aanvraag als leverancier',
    tags: ['marketplace', 'vendor', 'transactional', 'predefined'],
    variables: [
      { name: 'ContactPerson', label: 'Contactpersoon', required: true },
      { name: 'CompanyName', label: 'Bedrijfsnaam', required: true },
      { name: 'Status', label: 'Status (goedgekeurd/afgewezen)', required: true },
      { name: 'StatusMessage', label: 'Toelichting status', required: true },
      { name: 'ShopName', label: 'Webshop naam', required: true, defaultValue: 'Ons platform' },
      { name: 'NextStepUrl', label: 'Volgende stap URL', required: true },
    ],
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${baseStyle}</head><body>
<div class="wrapper">
  <div class="header" style="background: linear-gradient(135deg, #0A1628, #121F33);"><h1>Update leverancier aanvraag</h1></div>
  <div class="body">
    <h2>Update over uw aanvraag</h2>
    <p>Beste {{ .ContactPerson }},</p>
    <p>Er is een update over uw leverancier aanvraag namens <strong>{{ .CompanyName }}</strong>.</p>
    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #00897B; margin: 16px 0;">
      <p style="margin: 0; font-weight: 600;">Status: {{ .Status }}</p>
      <p style="margin: 8px 0 0;">{{ .StatusMessage }}</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{{ .NextStepUrl }}" class="btn" style="background: #00897B;">Volgende stap</a>
    </p>
    <p>Heeft u vragen? Neem gerust contact met ons op.</p>
  </div>
  <div class="footer">
    <p>Met vriendelijke groet, het {{ .ShopName }} team</p>
    <p><a href="{{ .UnsubscribeURL }}">Uitschrijven</a></p>
  </div>
</div>
</body></html>`,
  },
]
