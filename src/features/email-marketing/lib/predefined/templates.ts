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
]
