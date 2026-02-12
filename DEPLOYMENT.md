# Deployment Guide

Complete guide voor het deployen van de Payload CMS website naar productie.

## Prerequisites

- Node.js 18+ geïnstalleerd
- npm of pnpm package manager
- Git repository
- Domain naam
- Hosting platform account (Vercel aanbevolen)

## Environment Variables

### Required Variables

Kopieer `.env.example` naar `.env` en vul de volgende waarden in:

```bash
# Database
DATABASE_URL=file:./payload.db  # Development
# DATABASE_URL=postgresql://...  # Production (PostgreSQL aanbevolen)

# Payload Secret
PAYLOAD_SECRET=your-super-secret-key-here
# Generate met: openssl rand -base64 32

# Server URLs
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
PAYLOAD_PUBLIC_SERVER_URL=https://yourdomain.com

# Email (Resend)
RESEND_API_KEY=re_your_api_key_here
CONTACT_EMAIL=info@yourdomain.com
FROM_EMAIL=noreply@yourdomain.com
```

### Resend Email Setup

1. Ga naar [https://resend.com](https://resend.com)
2. Maak een account aan (gratis tier: 100 emails/dag)
3. Ga naar API Keys en maak een nieuwe key
4. Voeg je domain toe in "Domains" sectie
5. Verify je domain via DNS records
6. Update `RESEND_API_KEY`, `CONTACT_EMAIL`, en `FROM_EMAIL` in `.env`

## Database Setup

### Development (SQLite)
```bash
# SQLite wordt automatisch gebruikt in development
# Database file: payload.db (zit al in .gitignore)
```

### Production (PostgreSQL - Aanbevolen)

**Waarom PostgreSQL?**
- Beter voor productie
- Concurrent writes
- Betere performance
- Backup mogelijkheden

**Setup met Railway:**
```bash
# 1. Ga naar https://railway.app
# 2. Create New Project → Provision PostgreSQL
# 3. Kopieer DATABASE_URL (Connection URL)
# 4. Voeg toe aan productie environment variables
```

**Setup met Supabase:**
```bash
# 1. Ga naar https://supabase.com
# 2. Create New Project
# 3. Ga naar Project Settings → Database
# 4. Kopieer Connection String (Pooler, Port 6543)
# 5. Replace [YOUR-PASSWORD] met je database password
```

## Deployment Platforms

### Option 1: Vercel (Aanbevolen)

**Waarom Vercel?**
- Officiële Next.js platform
- Automatische deployments bij Git push
- Edge network (snelle global CDN)
- Gratis tier beschikbaar

**Setup:**

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
# First deployment
vercel

# Production deployment
vercel --prod
```

4. **Environment Variables toevoegen:**
```bash
# Via Vercel Dashboard:
# Settings → Environment Variables
# Voeg alle vars uit .env toe
```

5. **Database Migratie (eerste keer):**
```bash
# Lokaal eerst payload seed draaien:
npm run payload migrate
```

6. **Custom Domain:**
```bash
# Vercel Dashboard → Settings → Domains
# Voeg je domain toe
# Update DNS records bij je domain registrar
```

### Option 2: Netlify

1. **Connect repository**
   - Ga naar [https://netlify.com](https://netlify.com)
   - New site from Git → Select repository

2. **Build settings:**
```
Build command: npm run build
Publish directory: .next
```

3. **Environment Variables:**
   - Site settings → Environment variables
   - Voeg alle vars uit `.env` toe

### Option 3: DigitalOcean App Platform

1. **Create New App**
2. **Connect GitHub repository**
3. **Build Command:** `npm run build`
4. **Run Command:** `npm start`
5. **Environment Variables:**
   - Settings → App-Level Environment Variables

## Post-Deployment Checklist

### 1. Test de Website
- [ ] Homepage laadt correct
- [ ] Admin panel bereikbaar op `/admin`
- [ ] Login werkt
- [ ] Contactformulier werkt
- [ ] Emails worden verstuurd

### 2. SEO Setup

**Google Search Console:**
1. Ga naar [https://search.google.com/search-console](https://search.google.com/search-console)
2. Add property → Enter URL
3. Verify via DNS or HTML file
4. Submit sitemap: `https://yourdomain.com/sitemap.xml`

**Google Analytics (Optioneel):**
1. Create account op [https://analytics.google.com](https://analytics.google.com)
2. Add tracking code to `src/app/layout.tsx`

### 3. Performance Check
```bash
# Run Lighthouse audit
# Chrome DevTools → Lighthouse → Generate report
# Target: 90+ voor alle scores
```

### 4. Security

**SSL Certificate:**
- Vercel/Netlify: automatisch
- Eigen server: gebruik Let's Encrypt

**Security Headers:**
Voeg toe aan `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
      ],
    },
  ]
}
```

## Continuous Deployment (CI/CD)

### Automatische Deployments via Git

**Vercel:**
```bash
# Elke push naar main branch = automatische deployment
git push origin main
```

**GitHub Actions (voor andere platforms):**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy
        run: |
          # Your deployment command here
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET }}
```

## Backup Strategy

### Database Backups

**Automatisch via Railway:**
- Railway maakt automatisch daily backups
- Te herstellen via Railway dashboard

**Manueel PostgreSQL Backup:**
```bash
# Backup maken
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup-20240115.sql
```

### Media Backups

**Option 1: Vercel Blob Storage**
```bash
npm install @vercel/blob
# Configure in payload.config.ts
```

**Option 2: S3-compatible storage (Cloudflare R2)**
```bash
npm install @aws-sdk/client-s3
# Configure S3 adapter in payload.config.ts
```

## Troubleshooting

### Build Errors

**"Module not found" errors:**
```bash
# Clear cache en reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

**TypeScript errors:**
```bash
# Generate Payload types
npm run payload generate:types

# Check TypeScript
npm run type-check
```

### Runtime Errors

**500 Internal Server Error:**
- Check server logs: `vercel logs` or platform dashboard
- Check environment variables zijn correct
- Check database connection

**Images not loading:**
- Check `next.config.js` remotePatterns
- Verify NEXT_PUBLIC_SERVER_URL is correct

**Email niet verzonden:**
- Check RESEND_API_KEY is correct
- Check Resend dashboard voor errors
- Verify domain is verified in Resend

## Monitoring

### Error Tracking - Sentry (Aanbevolen)

1. **Setup:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

2. **Environment Variables:**
```bash
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=production
```

### Uptime Monitoring

**Options:**
- [Uptime Robot](https://uptimerobot.com/) - Gratis
- [Pingdom](https://www.pingdom.com/)
- [Better Uptime](https://betteruptime.com/)

## Performance Optimization

### CDN Setup

**Vercel:**
- Automatisch edge network worldwide
- Niks extra nodig

**Cloudflare:**
1. Add site to Cloudflare
2. Update nameservers bij domain registrar
3. Enable "Auto Minify" voor HTML/CSS/JS
4. Enable "Brotli" compression

### Image Optimization

Next.js Image component handelt dit automatisch af:
```tsx
<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
  quality={85}
/>
```

## Scaling

### Horizontal Scaling

**Vercel:**
- Automatisch scaling based on traffic
- Serverless functions scale automatisch

**DigitalOcean:**
- App Platform: Increase container count
- Settings → Scaling → Adjust containers

### Database Scaling

**Railway PostgreSQL:**
- Upgrade plan voor meer resources
- Consider read replicas voor high traffic

## Cost Optimization

### Free Tier Limits

**Vercel:**
- 100GB bandwidth/month
- Unlimited deployments
- Upgrade: $20/maand voor Pro

**Resend Email:**
- 100 emails/dag gratis
- 3,000 emails/maand gratis
- Upgrade: $20/maand voor 50k emails

**Railway PostgreSQL:**
- $5 credit gratis per maand
- Database: ~$5-15/maand depending on usage

## Maintenance

### Updates

```bash
# Update dependencies monthly
npm outdated
npm update

# Major updates (voorzichtig!)
npm install next@latest
npm install payload@latest

# Test thoroughly na updates!
npm run dev
npm run build
```

### Database Migrations

```bash
# Run migrations na Payload updates
npm run payload migrate
```

## Support

### Resources
- [Payload Docs](https://payloadcms.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)

### Community
- [Payload Discord](https://discord.com/invite/payload)
- [Payload GitHub](https://github.com/payloadcms/payload)
