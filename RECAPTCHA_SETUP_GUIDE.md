# reCAPTCHA v3 Setup Guide

## 📋 Overview

This guide will help you set up Google reCAPTCHA v3 for spam protection on your contact forms. reCAPTCHA v3 is invisible to users and provides a score-based assessment (0.0 = bot, 1.0 = human) without interrupting the user experience.

---

## 🎯 Why reCAPTCHA v3?

- **Invisible Protection**: No checkboxes or challenges for users
- **Score-Based**: Returns a score (0.0-1.0) for each submission
- **Free Tier**: 1 million assessments/month
- **Easy Integration**: Simple setup with Google's API
- **Production-Ready**: Used by millions of websites worldwide

---

## ⚙️ Setup Instructions

### Step 1: Create reCAPTCHA Site

1. **Go to Google reCAPTCHA Admin**: https://www.google.com/recaptcha/admin/create

2. **Fill in the form**:
   - **Label**: `Your Site Name - Production` (or Development)
   - **reCAPTCHA type**: Select **reCAPTCHA v3**
   - **Domains**:
     - For **development**: `localhost`
     - For **production**: `yourdomain.com`
   - **Owners**: Your Google account email
   - **Accept Terms**: Check the box

3. **Submit**: Click "Submit"

4. **Copy Your Keys**: You'll see two keys:
   - **Site Key** (starts with `6Le...`)
   - **Secret Key** (starts with `6Le...`)

### Step 2: Configure Environment Variables

1. **Copy `.env.example` to `.env`** (if you haven't already):
   ```bash
   cp .env.example .env
   ```

2. **Update your `.env` file** with your reCAPTCHA keys:
   ```bash
   # Replace with your actual keys from Google
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeYourActualSiteKeyHere
   RECAPTCHA_SECRET_KEY=6LeYourActualSecretKeyHere
   ```

3. **Restart your dev server**:
   ```bash
   npm run dev
   ```

### Step 3: Test the Integration

1. **Submit a test contact form** on your site
2. **Check the browser console** for reCAPTCHA logs:
   ```
   [reCAPTCHA] Verification result: { success: true, score: 0.9, ... }
   ```
3. **Check the server console** for verification logs:
   ```
   [Contact Form] reCAPTCHA verified - Score: 0.9
   ```

---

## 🔧 Configuration Options

### Minimum Score Threshold

The default minimum score is **0.5**. You can adjust this in the API route:

**File**: `src/app/api/contact/route.ts`

```typescript
const recaptchaResult = await verifyRecaptchaToken(
  body.recaptchaToken,
  'contact_form',
  0.5 // Change this value (0.0 - 1.0)
)
```

**Score Guidelines**:
- `0.9 - 1.0`: Very likely human
- `0.7 - 0.9`: Likely human
- `0.5 - 0.7`: Neutral (could be human or bot)
- `0.3 - 0.5`: Likely bot
- `0.0 - 0.3`: Very likely bot

**Recommended Settings**:
- **Strict** (fewer false positives): `0.7`
- **Balanced** (default): `0.5`
- **Lenient** (fewer false negatives): `0.3`

### Custom Actions

You can track different forms with different action names:

**Frontend** (`Component.tsx`):
```typescript
recaptchaToken = await executeRecaptcha('newsletter_signup')
```

**Backend** (`route.ts`):
```typescript
await verifyRecaptchaToken(body.recaptchaToken, 'newsletter_signup', 0.5)
```

---

## 🧪 Testing with Google's Test Keys

For **development only**, you can use Google's test keys that always return a successful response:

```bash
# These keys always pass verification (for testing only!)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

⚠️ **Important**: Replace these with your real keys in production!

---

## 🚨 Troubleshooting

### Issue: "reCAPTCHA token missing"

**Cause**: reCAPTCHA is configured on the server but not on the client.

**Solution**: Make sure your `.env` file has `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` set, and restart your dev server.

### Issue: "reCAPTCHA verification failed"

**Possible Causes**:
1. **Invalid Secret Key**: Double-check your `RECAPTCHA_SECRET_KEY`
2. **Domain Mismatch**: Your site's domain isn't registered in reCAPTCHA admin
3. **Score Too Low**: The submission score is below your threshold

**Solution**:
- Check the server console for detailed error messages
- Verify your keys at https://www.google.com/recaptcha/admin
- Lower the minimum score threshold for testing

### Issue: "Script failed to load"

**Cause**: Network issues or ad blockers.

**Solution**:
- Disable ad blockers during testing
- Check browser console for network errors
- Ensure your internet connection is stable

### Issue: Form works without reCAPTCHA configured

This is **expected behavior**! If reCAPTCHA keys are not configured, the form will still work but without spam protection. This allows for graceful degradation.

To **require** reCAPTCHA, set both keys in your `.env` file.

---

## 📊 Monitoring reCAPTCHA

### View Analytics

1. Go to: https://www.google.com/recaptcha/admin
2. Select your site
3. View analytics dashboard with:
   - Total requests
   - Score distribution
   - Suspicious traffic

### Review Logs

**Server-side logs** (in your terminal):
```
[Contact Form] reCAPTCHA verified - Score: 0.9
```

**Client-side logs** (in browser console):
```
[reCAPTCHA] Verification result: { success: true, score: 0.9 }
```

---

## 🔒 Security Best Practices

1. **Never expose your Secret Key**: Keep it in `.env` only (never commit to Git)
2. **Use separate keys for dev/prod**: Create separate reCAPTCHA sites for each environment
3. **Monitor score distribution**: Check Google's analytics for patterns
4. **Adjust threshold based on data**: Start at 0.5, adjust based on false positives/negatives
5. **Don't rely solely on reCAPTCHA**: Combine with rate limiting and other security measures

---

## 📝 Next Steps

After setting up reCAPTCHA, consider:

1. **Rate Limiting**: Implement per-IP rate limits (see INTEGRATIONS_ROADMAP.md)
2. **CORS Configuration**: Restrict API access to your domain only
3. **Honeypot Fields**: Add hidden fields that bots will fill out
4. **Email Verification**: Send confirmation emails for high-risk submissions

---

## 📚 Additional Resources

- **reCAPTCHA Admin Console**: https://www.google.com/recaptcha/admin
- **Official Documentation**: https://developers.google.com/recaptcha/docs/v3
- **Score Interpretation**: https://developers.google.com/recaptcha/docs/v3#interpreting_the_score
- **Best Practices**: https://developers.google.com/recaptcha/docs/v3#best_practices

---

## 🆘 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review server and browser console logs
3. Verify your environment variables are set correctly
4. Ensure your domain is registered in reCAPTCHA admin
5. Test with Google's test keys first

---

**Status**: ✅ Implementation Complete
**Files Modified**:
- `src/hooks/useRecaptcha.ts` - Client-side reCAPTCHA hook
- `src/lib/recaptcha/verify.ts` - Server-side verification
- `src/blocks/ContactFormBlock/Component.tsx` - Form integration
- `src/app/api/contact/route.ts` - API verification
- `.env.example` - Environment variables template
