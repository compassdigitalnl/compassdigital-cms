# Testing & QA Guide

Deze guide helpt je bij het testen van de Payload CMS website voordat je live gaat.

## Performance Testing

### Lighthouse Audit

```bash
# Open Chrome DevTools (F12)
# Ga naar "Lighthouse" tab
# Selecteer: Performance, Accessibility, Best Practices, SEO
# Run audit
```

**Target Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### WebPageTest
```
https://www.webpagetest.org/
```
Test met:
- Location: Amsterdam (dichtst bij Nederland)
- Browser: Chrome
- Connection: 4G/LTE

## Responsive Testing

### Breakpoints
Test alle breakpoints:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1024px
- Large Desktop: 1440px

### Test in Chrome DevTools
```
F12 → Toggle device toolbar (Ctrl+Shift+M)
Test: iPhone SE, iPad, Desktop
```

### Browser Testing
Test minimaal in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest - macOS/iOS)
- Edge (latest)

## Accessibility (A11y) Testing

### axe DevTools
```bash
# Install Chrome extension:
# https://chrome.google.com/webstore → "axe DevTools"

# Run scan op elke pagina
# Fix alle CRITICAL en SERIOUS issues
```

### Keyboard Navigation
Test of je de hele site kan bedienen met alleen keyboard:
- `Tab` - Navigeer naar volgende element
- `Shift+Tab` - Navigeer naar vorige element
- `Enter` - Activeer link/button
- `Esc` - Sluit modals/overlays

**Checklist:**
- [ ] Focus indicators zijn zichtbaar
- [ ] Skip-to-content link werkt
- [ ] Modals kunnen gesloten worden met Esc
- [ ] Dropdown menus werken met pijltjestoetsen

### Screen Reader Testing
- **macOS**: VoiceOver (Cmd+F5)
- **Windows**: NVDA (gratis)
- **Chrome**: ChromeVox extension

## SEO Testing

### Meta Tags Checklist
Controleer op elke pagina:
- [ ] Title tag (50-60 karakters)
- [ ] Meta description (150-160 karakters)
- [ ] Canonical URL
- [ ] Open Graph tags (Facebook)
- [ ] Twitter Card tags

### Structured Data
```bash
# Test JSON-LD structured data:
https://validator.schema.org/

# Test Rich Results:
https://search.google.com/test/rich-results
```

### Sitemap & Robots
```bash
# Check sitemap:
https://your-domain.com/sitemap.xml

# Check robots.txt:
https://your-domain.com/robots.txt
```

## Functional Testing

### Contactformulier
- [ ] Alle velden valideren correct
- [ ] Error messages zijn duidelijk
- [ ] Success message verschijnt na verzenden
- [ ] Email wordt verstuurd (check inbox)
- [ ] Submission wordt opgeslagen in CMS

### Blog Functionaliteit
- [ ] Blog posts laden correct
- [ ] Afbeeldingen worden getoond
- [ ] Categories filteren werkt
- [ ] Pagination werkt (indien applicable)
- [ ] Single post pages laden

### Navigatie
- [ ] Alle menu items werken
- [ ] Mobile menu opent/sluit correct
- [ ] Footer links werken
- [ ] Breadcrumbs zijn correct (indien applicable)

## Error Pages

Test error pages:
```bash
# 404 Page Not Found
https://your-domain.com/non-existing-page

# Test in development:
# - Throw error in component om 500 page te zien
```

**Checklist:**
- [ ] 404 page toont custom design
- [ ] Error page toont custom design
- [ ] "Terug naar home" knop werkt
- [ ] "Ga terug" knop werkt

## Cross-Device Testing

### Mobile Devices (Real Device Testing)
Test op echte apparaten:
- [ ] iPhone (iOS Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)

### Checklist per device:
- [ ] Touch targets zijn groot genoeg (min 44x44px)
- [ ] Pinch-to-zoom werkt correct
- [ ] Orientation change werkt (portrait ↔ landscape)
- [ ] Forms zijn makkelijk in te vullen

## Performance Checklist

### Images
- [ ] All images gebruik Next.js Image component
- [ ] Images hebben `alt` text
- [ ] Large images zijn gecomprimeerd
- [ ] Lazy loading werkt voor below-the-fold images

### Loading Speed
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Time to Interactive < 3.8s

### Network
```bash
# Test in Chrome DevTools → Network
# Throttle to "Slow 3G"
# Check of site nog bruikbaar is
```

## Security Testing

### Basic Security Checks
- [ ] HTTPS is enabled (production)
- [ ] Admin panel vereist login
- [ ] API routes zijn beschermd
- [ ] No console errors in production
- [ ] No API keys in client-side code

### Headers Check
```bash
https://securityheaders.com/
# Test je productie URL
# Target: A+ score
```

## Pre-Launch Checklist

- [ ] All tests passed
- [ ] No console errors
- [ ] All images have alt text
- [ ] Forms tested and working
- [ ] Email notifications working
- [ ] SEO meta tags on all pages
- [ ] Sitemap submitted to Google Search Console
- [ ] Analytics/tracking installed
- [ ] Favicon en app icons installed
- [ ] 404 en error pages tested
- [ ] Mobile responsive op echte devices
- [ ] Cross-browser tested
- [ ] Performance scores > 90

## Tools & Resources

### Performance
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)

### Accessibility
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [WCAG Checklist](https://www.wuhcag.com/wcag-checklist/)

### SEO
- [Google Search Console](https://search.google.com/search-console)
- [Schema Markup Validator](https://validator.schema.org/)
- [Screaming Frog](https://www.screamingfrog.co.uk/seo-spider/)

### Mobile Testing
- [BrowserStack](https://www.browserstack.com/) (betaald)
- [LambdaTest](https://www.lambdatest.com/) (gratis trial)
