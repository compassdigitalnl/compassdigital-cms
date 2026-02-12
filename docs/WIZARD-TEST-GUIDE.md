# 🧪 Site Generator Wizard - Test Guide

## 🎯 Wat Gaat Er Gebeuren?

De Site Generator Wizard zal:
1. **5 stappen** doorlopen om bedrijfsinformatie te verzamelen
2. **AI-powered content** genereren met GPT-4 Turbo
3. **Complete pagina's** maken met blocks (Hero, Services, CTA, etc.)
4. **Alles opslaan** in de Payload CMS database
5. **Direct zichtbaar** maken op de website

## 📋 Stap-voor-Stap Test

### Stap 1: Open de Wizard

Navigeer naar: **http://localhost:3020/site-generator**

Je ziet een mooi 5-stappen formulier met progress indicator.

---

### Stap 2: Vul Bedrijfsinformatie In

**Velden om in te vullen:**

```
Bedrijfsnaam: TechVision Solutions
Type bedrijf: B2B
Industrie: Technology
Doelgroep: Small to medium-sized businesses looking to digitally transform their operations

Kernwaarden (klik "+" om toe te voegen):
- Innovation
- Quality
- Customer-First

USPs (klik "+" om toe te voegen):
- 24/7 Support
- No-Code Solutions
- 99.9% Uptime
```

**Klik "Volgende →"**

---

### Stap 3: Design Voorkeuren

**Kies kleuren:**
- Primair: `#3b82f6` (blauw) - of kies je eigen kleur
- Secundair: `#64748b` (grijs)
- Accent: `#f59e0b` (oranje)

**Selecteer stijl:**
- Klik op **"Modern"** (strak, minimalistisch design)

**Font:**
- Kies **"Sans-serif"** (modern, schoon)

**Logo:**
- Laat leeg (optioneel)

**Klik "Volgende →"**

---

### Stap 4: Content Instellingen

**Taal:**
- Selecteer **"Nederlands"** 🇳🇱

**Tone of Voice:**
- Klik op **"Professional"** (zakelijk en formeel)

**Pagina's om te genereren:**
- ✅ **Home** (verplicht, al geselecteerd)
- ✅ **Over Ons** (klik om te selecteren)
- ✅ **Diensten** (klik om te selecteren)
- ✅ **Contact** (klik om te selecteren)

> **Tip:** Meer pagina's = langere generatietijd. Start met 3-4 pagina's.

**Klik "Volgende →"**

---

### Stap 5: Features Selecteren

**Klik op de volgende features:**
- ✅ Contact Formulier
- ✅ Nieuwsbrief Inschrijving
- ✅ Testimonials Sectie
- ✅ Social Media Links
- ✅ Call-to-Action Knoppen (al geselecteerd)

**Klik "Volgende →"**

---

### Stap 6: Genereer de Website! 🚀

Je ziet nu een **samenvatting** van je selecties.

**Klik op de grote blauwe knop:**
```
🚀 Genereer Mijn Website!
```

---

## 🎬 Wat Gebeurt Er Nu?

### Real-time Progress
Je ziet een **progress bar** met live updates:

```
10%  - Analyseren van bedrijfsinformatie...
20%  - Genereren van home pagina (1/4)...
30%  - Genereren van about pagina (2/4)...
40%  - Genereren van services pagina (3/4)...
50%  - Genereren van contact pagina (4/4)...
75%  - SEO optimalisatie...
85%  - Afbeeldingen voorbereiden...
90%  - Opslaan in database...
100% - Site generatie voltooid! 🎉
```

### In de Console (Terminal)
Je ziet gedetailleerde logs:

```bash
[WORKERS] Initializing workers...
[WORKERS] Site generator worker started
[SiteGeneratorWorker] Starting site generation job: site-gen-1234567890
[SiteGeneratorWorker] Company: TechVision Solutions
[SiteGeneratorWorker] Pages: home, about, services, contact
[SiteGeneratorWorker] Progress: 10% - Analyseren van bedrijfsinformatie...
[SiteGeneratorWorker] Progress: 20% - Genereren van home pagina...
...
[PayloadService] Starting to save generated site...
[PayloadService] 4 pages to save
[PayloadService] Saving page: Home
[PayloadService] ✓ Saved page: Home (ID: 123)
[PayloadService] Saving page: Over Ons
[PayloadService] ✓ Saved page: Over Ons (ID: 124)
...
[PayloadService] ✅ All pages saved successfully!
[SiteGeneratorWorker] Site generation completed
```

---

## ✅ Succesvol! Wat Nu?

### Je Ziet Een Groen Scherm:
```
✓ Website succesvol gegenereerd! 🎉
Uw website is klaar en kan nu bekeken worden
```

### 2 Knoppen:
1. **"Bekijk Website"** - Opent de gegenereerde site in een nieuwe tab
2. **"Bewerk in CMS"** - Opent het Payload admin panel

---

## 🔍 Verificatie: Controleer de Gegenereerde Pagina's

### Optie 1: Bekijk in Payload CMS Admin

1. Klik op **"Bewerk in CMS"** of ga naar:
   ```
   http://localhost:3020/admin/collections/pages
   ```

2. Je ziet **4 nieuwe pagina's**:
   - ✅ Home
   - ✅ Over Ons
   - ✅ Diensten
   - ✅ Contact

3. **Klik op een pagina** om de inhoud te zien:
   - Titel ✓
   - Slug ✓
   - Status: Published ✓
   - Layout: Meerdere blocks ✓

4. **Open een block** om de AI-gegenereerde content te zien:
   - Hero block met headline en subheadline
   - Services block met 3 diensten
   - CTA block met action-oriented tekst
   - Etc.

### Optie 2: Bekijk de Live Website

1. Klik op **"Bekijk Website"** of ga naar:
   ```
   http://localhost:3020/
   ```

2. Je ziet de **gegenereerde home pagina** met:
   - Hero sectie met compelling headline
   - Features/Services sectie
   - Testimonials (als geselecteerd)
   - Call-to-Action sectie
   - **Allemaal in het Nederlands!**

3. **Navigeer naar andere pagina's:**
   ```
   http://localhost:3020/over-ons
   http://localhost:3020/diensten
   http://localhost:3020/contact
   ```

---

## 📊 Wat Is Er Gegenereerd?

### Per Pagina:

**Home Page:**
- ✅ Hero block (titel, subtitel, CTA knoppen)
- ✅ Services/Features block (3 features uit USPs)
- ✅ Testimonials block (als feature geselecteerd)
- ✅ CTA block (action-oriented call-to-action)

**Over Ons Page:**
- ✅ Hero block
- ✅ Content block (bedrijfsverhaal)
- ✅ Services block (kernwaarden)
- ✅ CTA block

**Diensten Page:**
- ✅ Hero block
- ✅ Services block (USPs als diensten)
- ✅ CTA block

**Contact Page:**
- ✅ Hero block
- ✅ Content block (contactinformatie)
- ✅ Contact formulier block (als feature geselecteerd)
- ✅ CTA block

### AI-Gegenereerde Content:
- ✅ Business context analyse
- ✅ Pagina-specifieke titels en headlines
- ✅ SEO-geoptimaliseerde meta descriptions
- ✅ Keywords per pagina
- ✅ Tone-aanpassingen (Professional, Casual, etc.)
- ✅ Taal-specifieke content (Nederlands in dit geval)

---

## 🔧 Content Bewerken in CMS

1. **Open een pagina** in het admin panel
2. **Klik op een block** om te bewerken
3. **Wijzig de tekst** naar wens
4. **Klik "Save"**
5. **Refresh de website** - je wijzigingen zijn live!

---

## 🐛 Troubleshooting

### Probleem: "Er is een fout opgetreden"

**Oorzaken:**
1. Redis draait niet → Start Redis: `redis-server`
2. OpenAI API key ontbreekt → Check `.env.local`
3. Payload database issue → Check console logs

**Oplossing:**
```bash
# Check Redis
redis-cli ping
# Moet "PONG" returnen

# Check .env.local
cat .env.local | grep OPENAI_API_KEY
# Moet een key tonen

# Herstart dev server
npm run dev
```

### Probleem: Progress bar blijft hangen

**Oorzaken:**
1. Worker niet gestart
2. SSE connectie verbroken

**Oplossing:**
- Check console voor worker logs
- Ververs de pagina en probeer opnieuw

### Probleem: Pagina's niet zichtbaar op website

**Oorzaken:**
1. Status is "draft" ipv "published"
2. Slug is verkeerd

**Oplossing:**
- Open pagina in admin → Check status → Zet op "Published"
- Sla opnieuw op

---

## 🎯 Verwachte Tijden

| Aantal Pagina's | Geschatte Tijd |
|----------------|----------------|
| 1-2 pagina's   | 1-2 minuten    |
| 3-4 pagina's   | 2-4 minuten    |
| 5-7 pagina's   | 4-6 minuten    |

**Factoren die invloed hebben:**
- OpenAI API snelheid
- Aantal blocks per pagina
- Gekozen features

---

## ✨ Next Steps

Na een succesvolle test kun je:

1. **Nieuwe site genereren** met andere bedrijfsgegevens
2. **Meer pagina's toevoegen** (Blog, Portfolio, etc.)
3. **Design aanpassen** in de Payload admin
4. **Content verfijnen** met de CMS editor
5. **Deployen** naar productie

---

## 📝 Test Checklist

- [ ] Wizard opent correct op /site-generator
- [ ] Alle 5 stappen zijn navigeerbaar
- [ ] Validatie werkt (kan niet verder zonder verplichte velden)
- [ ] "Genereer Mijn Website!" knop start het proces
- [ ] Progress bar toont real-time voortgang
- [ ] Console toont worker logs
- [ ] Na voltooiing: groene success scherm
- [ ] Pagina's zichtbaar in /admin/collections/pages
- [ ] Pagina's hebben blocks met AI content
- [ ] Website toont gegenereerde content
- [ ] Content is in gekozen taal (Nederlands)
- [ ] Tone of voice komt overeen met selectie

---

**Succes met testen! 🚀**

Bij vragen of problemen, check de console logs voor gedetailleerde error informatie.
