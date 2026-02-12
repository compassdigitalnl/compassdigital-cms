# Payload CMS Admin Guide

Complete handleiding voor het beheren van je website via Payload CMS.

## Inloggen

1. Ga naar: `https://your-domain.com/admin`
2. Log in met je email en wachtwoord
3. Je komt nu in het Payload CMS dashboard

## Dashboard Overzicht

Na inloggen zie je:
- **Collections** (linkermenu): Pages, Blog Posts, Cases, Testimonials, etc.
- **Globals** (linkermenu): Site Settings, Header, Footer, Navigation
- **Recent documents**: Je laatst bewerkte content

## Pagina's Beheren

### Nieuwe Pagina Maken

1. **Collections → Pages → Create New**
2. Vul de velden in:
   - **Title**: Titel van de pagina
   - **Slug**: URL (automatisch gegenereerd)
   - **Layout**: Sleep en plaats blokken (zie Blocks sectie)
   - **Meta**: SEO instellingen
3. **Save Draft** of **Publish**

### Bestaande Pagina Bewerken

1. **Collections → Pages**
2. Klik op de pagina die je wilt bewerken
3. Maak je wijzigingen
4. **Save Draft** of **Save & Publish**

### Pagina Verwijderen

1. Open de pagina
2. Klik op **Delete** (rechtsbovenin)
3. Bevestig de verwijdering

## Content Blocks

Payload gebruikt een block-based systeem. Je kunt verschillende blocks toevoegen aan een pagina.

### Beschikbare Blocks

#### Hero Block
Hero sectie bovenaan pagina met grote afbeelding/tekst.

**Velden:**
- **Title**: Grote hoofdtitel
- **Subtitle**: Ondertitel tekst
- **Description**: Langere beschrijving
- **CTA Label**: Tekst voor knop
- **CTA Link**: Waar knop naartoe linkt
- **Style**: `simple`, `image`, of `gradient`
- **Background Image**: Optionele achtergrond (alleen bij `image` style)

**Tip:** Gebruik voor homepage altijd `image` style met opvallende achtergrond.

#### Content Block
Standaard contentblok met tekst en optionele afbeelding.

**Velden:**
- **Heading**: Sectie titel
- **Content**: Rich text editor (opmaak mogelijk)
- **Media**: Optionele afbeelding
- **Media Position**: Links, rechts, boven of onder
- **Reverse Layout**: Wissel positie om

**Tip:** Gebruik voor About page, Services, etc.

#### Features Block
Grid met features/USPs met icons.

**Velden:**
- **Heading**: Sectie titel
- **Features**: Array van features
  - **Title**: Feature naam
  - **Description**: Feature beschrijving
  - **Icon**: Kies icon (check, star, heart, lightning, shield)

**Tip:** Maximum 6 features voor beste weergave.

#### Team Block
Team member grid met foto's en bios.

**Velden:**
- **Heading**: Sectie titel
- **Intro**: Intro tekst boven team
- **Members**: Array van teamleden
  - **Name**: Volledige naam
  - **Role**: Functie
  - **Photo**: Profiel foto (400x400px aanbevolen)
  - **Bio**: Korte biografie

**Tip:** Gebruik square foto's (1:1 ratio) voor beste resultaat.

#### CTA (Call-to-Action) Block
Opvallende call-to-action sectie.

**Velden:**
- **Heading**: CTA titel
- **Description**: CTA tekst
- **Primary CTA**: Hoofdknop (tekst + link)
- **Secondary CTA**: Tweede knop (optioneel)
- **Background Style**: `solid`, `gradient`, `image`

**Tip:** Plaats onderaan pagina om conversies te verhogen.

#### Contact Form Block
Werkend contactformulier.

**Velden:**
- **Heading**: Formulier titel
- **Intro**: Intro tekst boven formulier

**Functionaliteit:**
- Validatie op alle velden
- Email notificatie bij inzending
- Submissions opgeslagen in CMS

#### Blog Preview Block
Grid met blog posts (GEEN AI generatie).

**Velden:**
- **Heading**: Sectie titel
- **Intro**: Intro tekst
- **Limit**: Aantal posts om te tonen (1-12)
- **Category**: Filter op category (optioneel)
- **Layout**: `grid-3` of `grid-2` kolommen
- **Show Excerpt**: Toon preview tekst
- **Show Date**: Toon publicatie datum
- **Show Author**: Toon auteur naam

**Let op:** Deze block toont alleen bestaande blog posts. Maak eerst blog posts aan voordat je deze block gebruikt!

### Block Toevoegen

1. In page editor, scroll naar **Layout** sectie
2. Klik **Add Block**
3. Selecteer block type
4. Vul velden in
5. Save

### Block Verplaatsen

Sleep de ≡ icon aan de linkerkant van het block.

### Block Verwijderen

Klik op trash icon (🗑️) rechtsboven in block.

## Blog Posts Beheren

### Nieuwe Blog Post Maken

1. **Collections → Blog Posts → Create New**
2. Vul velden in:
   - **Title**: Blog titel
   - **Slug**: URL (auto-generated)
   - **Excerpt**: Preview tekst (150-200 karakters)
   - **Featured Image**: Hoofdafbeelding (1200x630px aanbevolen)
   - **Content**: Blog inhoud (rich text)
   - **Categories**: Selecteer categorieën
   - **Author**: Kies auteur
   - **Published At**: Publicatie datum
   - **Meta**: SEO instellingen
3. **Save Draft** of **Publish**

### Blog Categorieën

1. **Collections → Categories → Create New**
2. Vul in:
   - **Name**: Category naam
   - **Slug**: URL-vriendelijke versie
3. **Save**

**Tip:** Maak eerst categorieën voordat je blog posts maakt.

## Cases/Portfolio Beheren

1. **Collections → Cases → Create New**
2. Vul velden in (vergelijkbaar met blog posts)
3. Upload case afbeeldingen (1200x800px aanbevolen)
4. **Publish**

## Testimonials Beheren

1. **Collections → Testimonials → Create New**
2. Vul in:
   - **Name**: Klant naam
   - **Role**: Functie
   - **Company**: Bedrijfsnaam
   - **Quote**: Testimonial tekst
   - **Rating**: Sterren (1-5)
   - **Photo**: Optionele foto
3. **Publish**

## Globals (Site-wide Settings)

### Site Settings

**Collections → Globals → Site Settings**

- **Site Name**: Naam van je website
- **Site Description**: Algemene beschrijving
- **Logo**: Upload je logo (SVG aanbevolen)
- **Favicon**: Upload favicon (32x32px)
- **Social Links**: Facebook, Twitter, LinkedIn, etc.
- **Contact Info**: Email, telefoon, adres

**Tip:** Deze info wordt gebruikt op hele site.

### Navigation

**Collections → Globals → Navigation**

Beheer hoofdmenu:
- **Main Menu Items**: Hoofd navigatie
  - **Label**: Menu item tekst
  - **Link**: Internal page of externe URL
- **Footer Menu Items**: Footer navigatie

**Tip:** Maximum 7 items in hoofdmenu voor beste UX.

### Header & Footer

**Collections → Globals → Header / Footer**

Configureer header en footer layout:
- **Show CTA Button**: Toon actie knop in header
- **CTA Text/Link**: Knop configuratie
- **Footer Columns**: Footer kolommen en links

## Media Library

### Afbeeldingen Uploaden

1. **Collections → Media → Upload**
2. Sleep afbeelding of klik om te selecteren
3. Vul **Alt Text** in (belangrijk voor SEO!)
4. **Save**

### Aanbevolen Image Sizes

- **Hero Images**: 1920x1080px (landscape)
- **Blog Featured Images**: 1200x630px (Open Graph ratio)
- **Team Photos**: 400x400px (square)
- **Icons/Logos**: SVG formaat (schaalbaar)

### Image Optimization Tips

- Comprimeer images voordat je upload (gebruik TinyPNG.com)
- Gebruik JPEG voor foto's
- Gebruik PNG voor graphics met transparantie
- Gebruik WebP indien mogelijk (moderne browsers)
- Maximum filesize: 2MB per afbeelding

## SEO Instellingen

Elke page en post heeft **Meta** sectie:

### Meta Title
- **Aanbevolen lengte**: 50-60 karakters
- **Format**: "Page Title | Site Name"
- **Tip**: Gebruik belangrijkste keyword vooraan

### Meta Description
- **Aanbevolen lengte**: 150-160 karakters
- **Tip**: Schrijf overtuigende tekst die mensen aanzet om te klikken
- **Bevat**: Belangrijkste keyword en call-to-action

### Meta Image (Open Graph)
- **Size**: 1200x630px
- **Gebruik**: Voor social media previews (Facebook, Twitter)
- **Tip**: Voeg tekst overlay toe aan image voor meer impact

## Form Submissions Bekijken

1. **Collections → Form Submissions**
2. Klik op submission om details te zien
3. Velden:
   - **Form**: Type formulier (contact, newsletter, etc.)
   - **Submitted At**: Datum/tijd
   - **Data**: Alle ingevulde velden
   - **Processed**: Vink aan als afgehandeld
   - **Notes**: Interne notities

**Tip:** Check dagelijks voor nieuwe submissions.

## Drafts & Publishing

### Draft Mode

- **Save Draft**: Bewaar zonder te publiceren
- **Preview**: Bekijk hoe het eruit ziet (draft mode)
- **Publish**: Maak live op website

### Versioning

Payload slaat alle wijzigingen op:
- **Versions** tab: Bekijk historie
- **Compare**: Vergelijk versies
- **Restore**: Herstel oude versie

## Tips & Best Practices

### Content Writing

1. **Gebruik duidelijke koppen**: H2 voor secties, H3 voor subsecties
2. **Korte paragrafen**: Max 3-4 zinnen per alinea
3. **Bullet points**: Voor lijsten en belangrijke punten
4. **Call-to-actions**: Vertel bezoekers wat te doen
5. **Links**: Interne links naar gerelateerde content

### SEO Best Practices

1. **Unieke titles**: Elke pagina eigen title
2. **Keywords**: Gebruik natuurlijk in content
3. **Alt text**: Beschrijf alle afbeeldingen
4. **Internal linking**: Link tussen gerelateerde pages
5. **Fresh content**: Update regelmatig (vooral blog)

### Performance

1. **Optimize images**: Comprimeer voordat je upload
2. **Limit blocks**: Te veel blocks = langzame page
3. **Clean up**: Verwijder ongebruikte media
4. **Drafts**: Verwijder oude drafts regelmatig

## Troubleshooting

### "Access Denied" Error

- **Oplossing**: Check je user role (moet admin of editor zijn)
- **Contact**: Site beheerder om rechten aan te passen

### Images Laden Niet

- **Check**: Filesize niet te groot (max 10MB)
- **Check**: Bestandsformaat (JPG, PNG, WebP, SVG)
- **Oplossing**: Re-upload image in kleiner formaat

### Changes Niet Zichtbaar

- **Check**: Pagina is gepubliceerd (niet draft)
- **Oplossing**: Clear browser cache (Ctrl+Shift+R)
- **Oplossing**: Wacht 1-2 minuten (CDN cache)

### Rich Text Editor Issues

- **Probleem**: Formatting verdwijnt
- **Oplossing**: Gebruik toolbar buttons, niet Ctrl+C/V
- **Tip**: Plak eerst in Notepad, dan kopieer naar editor

## Keyboard Shortcuts

- **Ctrl/Cmd + S**: Save
- **Ctrl/Cmd + K**: Insert link
- **Ctrl/Cmd + B**: Bold text
- **Ctrl/Cmd + I**: Italic text
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Shift + Z**: Redo

## Support

### Help Nodig?

1. **Check documentatie**: Lees deze guide opnieuw
2. **Payload Docs**: [https://payloadcms.com/docs](https://payloadcms.com/docs)
3. **Contact developer**: Voor technische issues
4. **Video tutorials**: YouTube: "Payload CMS Tutorial"

### Veelgestelde Vragen

**Q: Hoe maak ik een nieuwe gebruiker aan?**
A: Collections → Users → Create New (admin rechten vereist)

**Q: Kan ik de URL van een pagina wijzigen?**
A: Ja, via het "Slug" veld. Let op: oude URL werkt daarna niet meer.

**Q: Hoe zet ik een pagina offline?**
A: Open pagina → klik "Unpublish" rechtsbovenin.

**Q: Kan ik content herstellen die ik per ongeluk verwijderd heb?**
A: Nee, verwijderingen zijn permanent. Gebruik "Versions" tab om oude versie te herstellen voordat verwijdering.

**Q: Hoeveel images kan ik uploaden?**
A: Onbeperkt, maar let op totale storage limits van je hosting.

**Q: Kan ik video's uploaden?**
A: Gebruik YouTube/Vimeo en embed de link in content. Direct video upload niet aanbevolen (te groot).

## Cheat Sheet

### Quick Actions

```
Nieuwe pagina maken:
Collections → Pages → Create New

Blog post publiceren:
Collections → Blog Posts → [Post] → Publish

Media uploaden:
Collections → Media → Upload

Menu wijzigen:
Globals → Navigation → Edit

Logo updaten:
Globals → Site Settings → Logo → Upload

Form submissions checken:
Collections → Form Submissions
```

### Content Workflow

1. **Plan**: Bepaal doel en structuur
2. **Draft**: Schrijf en bouw in draft mode
3. **Preview**: Check hoe het eruit ziet
4. **SEO**: Vul meta fields in
5. **Images**: Optimize en upload
6. **Review**: Check spelling en links
7. **Publish**: Maak live!
8. **Share**: Deel op social media

---

**Laatst bijgewerkt:** Februari 2026
**Versie:** 1.0
