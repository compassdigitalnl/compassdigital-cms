# Uptime Monitoring Setup Guide

Complete handleiding voor het instellen van 24/7 uptime monitoring voor je productie website.

## 🎯 Waarom Uptime Monitoring?

**Zonder monitoring:**
- ❌ Je weet niet wanneer je website down is
- ❌ Klanten melden problemen voordat jij het weet
- ❌ Lange downtime = omzetverlies + reputatieschade
- ❌ Geen inzicht in performance degradation

**Met uptime monitoring:**
- ✅ **Instant alerts** - binnen 1-5 minuten na downtime
- ✅ **Proactieve respons** - fix het voordat klanten het merken
- ✅ **Performance insights** - response time tracking
- ✅ **SSL monitoring** - alerts voordat certificaat verloopt
- ✅ **Status pages** - transparantie naar klanten

---

## 📊 Recommended Service: UptimeRobot

**Waarom UptimeRobot?**
- 🆓 **Gratis tier** - 50 monitors, 5-minute checks, perfect voor starters
- 📱 **Multi-channel alerts** - Email, SMS, Slack, webhook
- 📈 **Public status pages** - toon uptime aan klanten
- 🌍 **Global monitoring** - checks vanuit meerdere locaties
- 💰 **Affordable pro** - €7/maand voor 1-minute checks

### Alternative Options

| Service | Free Tier | Pricing | Best For |
|---------|-----------|---------|----------|
| **UptimeRobot** ✅ | 50 monitors, 5-min | €7/maand (1-min) | Startups |
| Better Uptime | ❌ None | $10/maand | Teams |
| Pingdom | 1 monitor | $10/maand | Enterprise |
| StatusCake | 10 monitors | $24/maand | Advanced features |

**Recommendation:** UptimeRobot gratis tier → upgrade naar Pro wanneer je revenue hebt.

---

## 🚀 UptimeRobot Setup (15 minuten)

### Step 1: Account Aanmaken

1. **Ga naar:** https://uptimerobot.com
2. **Sign up:**
   - Email: je@email.com
   - Password: [strong password]
   - ✅ Verify email

3. **Navigeer naar Dashboard**

---

### Step 2: Eerste Monitor Toevoegen

**Monitor Type: HTTP(s)**

1. **In Dashboard:**
   ```
   + Add New Monitor
   ```

2. **Monitor Details:**
   ```
   Monitor Type: HTTP(s)
   Friendly Name: Production Website
   URL: https://yourdomain.com
   Monitoring Interval: 5 minutes (gratis) of 1 minute (Pro)
   ```

3. **Advanced Settings (optioneel):**
   ```
   HTTP Method: GET (default)
   Custom HTTP Headers: (leave empty)
   Timeout: 30 seconds

   ✅ Follow Redirects
   ✅ Ignore SSL errors: NO (je wilt SSL errors weten!)
   ```

4. **Keyword Monitoring (aanbevolen):**
   ```
   ✅ Keyword monitoring
   Keyword: <title>   (check of page daadwerkelijk laadt)
   Keyword Type: Exists

   Dit voorkomt false positives als je server 200 OK teruggeeft maar de pagina crashed.
   ```

5. **Alert Contacts:**
   ```
   ✅ [Your Email]
   Klik "Create Monitor"
   ```

---

### Step 3: Additional Monitors (aanbevolen)

**Monitor je kritieke endpoints:**

#### API Health Check
```
Monitor Type: HTTP(s)
Friendly Name: API Health
URL: https://yourdomain.com/api/health
Expected HTTP Status: 200
Interval: 5 minutes
```

#### Admin Panel
```
Monitor Type: HTTP(s)
Friendly Name: Admin Panel
URL: https://yourdomain.com/admin
Expected HTTP Status: 200 or 302
Interval: 10 minutes
```

#### Contact Form API
```
Monitor Type: HTTP(s)
Friendly Name: Contact Form API
URL: https://yourdomain.com/api/contact
Expected HTTP Status: 405 (Method not allowed is OK, betekent endpoint is alive)
Interval: 15 minutes
```

---

### Step 4: Alert Channels Setup

**Email Alerts (gratis)**

1. **Dashboard → Alert Contacts**
2. **Default email is al toegevoegd**
3. **Customize notifications:**
   ```
   ✅ Monitor goes down
   ✅ Monitor comes back up
   ❌ Monitor still down (optioneel - kan spammy zijn)
   ```

**Slack Alerts (aanbevolen)**

1. **In Slack:**
   ```
   Ga naar je workspace
   → Apps → Incoming Webhooks
   → Add to Slack
   → Choose channel: #alerts
   → Kopieer Webhook URL
   ```

2. **In UptimeRobot:**
   ```
   Alert Contacts → Add Alert Contact
   Type: Webhook
   Friendly Name: Slack Alerts
   URL: [paste Slack webhook URL]
   POST Value: {"text":"[monitorFriendlyName] is [monitorAlertType]! ([monitorURL])"}
   ```

**SMS Alerts (Pro only, €7/maand)**

Pro tier: 10 SMS credits/maand included

```
Alert Contacts → Add Alert Contact
Type: SMS
Phone: +31612345678
```

---

### Step 5: Status Page Setup (Optioneel maar cool!)

**Public Status Page voor transparantie naar klanten:**

1. **Dashboard → Status Pages → Add Status Page**

2. **Configure:**
   ```
   Page Name: [Your Company] Status
   URL: yourcompany.uptimerobot.com

   ✅ Show Uptime
   ✅ Show Response Times
   ❌ Show Logs (kan te detailed zijn voor klanten)

   Monitors: [Selecteer welke monitors publiek zichtbaar moeten zijn]
   ```

3. **Customization:**
   ```
   Logo: [Upload je logo]
   Favicon: [Upload favicon]
   Custom CSS: (optioneel - brand it!)
   ```

4. **Share URL met klanten:**
   ```
   https://yourcompany.uptimerobot.com

   Of embed op je eigen domain via iframe:
   <iframe src="https://yourcompany.uptimerobot.com" width="100%" height="600"></iframe>
   ```

---

## 🔔 Alert Best Practices

### Alert Thresholds

**Recommended setup:**

```
✅ Alert immediately when down (no delay)
❌ Don't alert for every blip (<30s downtime)

UptimeRobot already waits for 2 failed checks before alerting (smart!)
```

### Alert Escalation

**Multi-tier alerts:**

1. **Tier 1 (Immediate):** Email/Slack - voor dev team
2. **Tier 2 (5 min down):** SMS - voor on-call engineer
3. **Tier 3 (15 min down):** Phone call - voor CTO/founder

**Setup in UptimeRobot Pro:**
```
Monitor Settings → Advanced
Alert Contacts:
- Email: [immediately]
- SMS: [after 5 minutes]
- Phone: [after 15 minutes]
```

---

## 📊 Monitoring Dashboard

**Key Metrics to Track:**

1. **Uptime Percentage:**
   ```
   99.9% uptime = 43.8 minutes downtime/maand (excellent)
   99.5% uptime = 3.6 hours downtime/maand (acceptable)
   99.0% uptime = 7.2 hours downtime/maand (needs improvement)
   ```

2. **Response Time:**
   ```
   <200ms = Excellent
   200-500ms = Good
   500ms-1s = Acceptable
   >1s = Needs optimization
   ```

3. **Incident Frequency:**
   ```
   0 incidents/maand = Perfect
   1-2 incidents/maand = Normal
   >5 incidents/maand = Infrastructure problem
   ```

---

## 🐛 Troubleshooting

### False Positives (alerts maar site is up)

**Oorzaak:** Keyword monitoring mismatch, SSL handshake timeout, of geographical routing

**Oplossing:**
1. Check keyword is correct: `curl https://yourdomain.com | grep "keyword"`
2. Increase timeout: 30s → 60s
3. Disable SSL verification temporarily (not recommended)
4. Use "Ping" monitor type instead of HTTP(s) voor basic availability

### Missing Alerts (site is down maar geen alert)

**Oorzaak:** Alert contact niet correct geconfigureerd

**Oplossing:**
1. Check email niet in spam
2. Test alert: Monitor → Test Notification
3. Verify webhook URL is correct
4. Check alert contact is enabled for this monitor

### High Response Times

**Oorzaak:** Server overload, database slow queries, of CDN misconfiguration

**Oplossing:**
1. Check server CPU/RAM usage
2. Review slow query logs
3. Enable CDN (Cloudflare/Vercel Edge)
4. Optimize database queries
5. Scale up server resources

---

## 🎯 Advanced Features

### Multi-Location Monitoring (Pro)

Monitor from multiple locations worldwide:

```
Settings → Monitoring Locations
✅ US East
✅ EU West
✅ Asia Pacific

Alerts alleen als 2+ locations down detecteren (voorkomt false positives)
```

### SSL Certificate Monitoring

**Automatic SSL expiration alerts:**

```
Monitor Type: HTTP(s)
✅ Alert if SSL certificate expires within: 7 days

Je krijgt automatisch alert 7 dagen voordat je SSL verloopt!
```

### Custom HTTP Headers

**Voor protected endpoints:**

```
Custom HTTP Headers:
Authorization: Bearer YOUR_API_TOKEN
X-Custom-Header: value
```

### Maintenance Windows

**Disable alerts tijdens planned maintenance:**

```
Monitor → Maintenance Windows
Start: [date/time]
Duration: 2 hours
✅ Disable alerts during this window
```

---

## 💰 Cost Analysis

### Free Tier
```
Cost: €0
Monitors: 50
Interval: 5 minutes
Alerts: Email only
Status Pages: 50
SMS: ❌
Phone: ❌

Perfect voor: Startups, side projects, MVP
```

### Pro Tier (€7/maand)
```
Cost: €7/maand
Monitors: 50
Interval: 1 minute (5x faster detection!)
Alerts: Email + SMS (10 credits) + Webhook
Status Pages: 50
Multi-location: ✅
Advanced reporting: ✅

Perfect voor: Growing businesses, SaaS, e-commerce
```

### ROI Calculation

**Cost of downtime:**
- E-commerce: €1000/hour revenue → 1 hour downtime = €1000 loss
- SaaS: 100 customers × €50/maand → downtime = churn risk
- Lead gen: 50 leads/dag → 1 day downtime = 50 lost leads

**Uptime Robot cost:**
- Free: €0
- Pro: €7/maand = €84/jaar

**Break-even:** 1 prevented downtime incident per jaar pays for itself!

---

## 📚 Integration met Andere Tools

### Sentry Integration

Forward uptime alerts naar Sentry:

```javascript
// In Sentry
Settings → Integrations → Webhooks → Add Webhook
URL: [paste UptimeRobot webhook URL]
```

### Slack Integration

Already covered in Step 4, but advanced setup:

```
// Custom Slack formatting
POST body:
{
  "username": "UptimeRobot",
  "icon_emoji": ":rotating_light:",
  "attachments": [{
    "color": "danger",
    "text": "[monitorFriendlyName] is [monitorAlertType]!\n[monitorURL]",
    "footer": "UptimeRobot",
    "ts": "[monitorDateTime]"
  }]
}
```

### PagerDuty Integration (Enterprise)

For on-call rotation:

```
UptimeRobot → PagerDuty Integration
Service Key: [your PagerDuty service key]
```

---

## ✅ Post-Setup Checklist

- [ ] At least 1 monitor configured (main website)
- [ ] Alert contact verified (email test successful)
- [ ] Slack/SMS alerts configured (if applicable)
- [ ] Status page created (optioneel)
- [ ] SSL monitoring enabled
- [ ] Keyword monitoring enabled (prevent false positives)
- [ ] Test notification sent (manually trigger alert)
- [ ] Documented in runbook (wat te doen bij downtime alert)

---

## 🆘 Incident Response Playbook

**When you receive a downtime alert:**

1. **Verify the issue:**
   ```bash
   # Check if site is really down
   curl -I https://yourdomain.com

   # Check from multiple locations
   https://downforeveryoneorjustme.com/yourdomain.com
   ```

2. **Check infrastructure:**
   ```bash
   # Vercel/Netlify: Check dashboard for deploys
   # Server: SSH in and check logs
   ssh user@server
   tail -f /var/log/nginx/error.log
   ```

3. **Check dependencies:**
   - Database: Is PostgreSQL accessible?
   - API: Are external APIs down?
   - CDN: Is Cloudflare having issues?

4. **Quick fixes:**
   ```bash
   # Restart app (if self-hosted)
   pm2 restart app

   # Clear cache
   # Redeploy (Vercel)
   vercel --prod
   ```

5. **Communicate:**
   - Update status page
   - Tweet/LinkedIn update (if extended outage)
   - Email customers (if >30 min downtime)

6. **Post-mortem:**
   - Document root cause
   - Implement prevention measures
   - Update monitoring (add new checks)

---

## 📈 Uptime SLA Targets

**Industry Standards:**

| SLA | Downtime/Year | Downtime/Month | Use Case |
|-----|---------------|----------------|----------|
| 99% | 3.65 days | 7.2 hours | Personal sites |
| 99.9% | 8.76 hours | 43.8 minutes | Small business |
| 99.95% | 4.38 hours | 21.9 minutes | E-commerce |
| 99.99% | 52.6 minutes | 4.38 minutes | SaaS/Enterprise |
| 99.999% | 5.26 minutes | 26.3 seconds | Mission-critical |

**Your Target:**
- MVP/Startup: 99.5% (3.6 hours/maand)
- Growth stage: 99.9% (43 minutes/maand)
- Enterprise: 99.95%+ (<22 minutes/maand)

---

## 🎓 Resources

- [UptimeRobot Documentation](https://uptimerobot.com/help)
- [Status Page Best Practices](https://www.atlassian.com/incident-management/on-call/status-page)
- [SLA Calculations](https://uptime.is/)
- [Incident Response Templates](https://github.com/Avocode/incident-response-templates)

---

## 📞 Support

**Need help?**
1. UptimeRobot support: support@uptimerobot.com
2. Community: https://reddit.com/r/sysadmin
3. Your hosting provider docs (Vercel/Railway/Supabase)

---

**✅ Uptime monitoring configured? Je website is nu 24/7 gemonitored!**

**Next steps:**
1. Wait for first monitoring data (5-10 minutes)
2. Verify dashboard shows "Up" status
3. Test alert by temporarily breaking site (optional)
4. Document response procedures
5. Set quarterly uptime review (check trends)

Laatst bijgewerkt: Februari 2026
