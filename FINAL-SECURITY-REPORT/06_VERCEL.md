# ▲ Vercel Deployment Readiness Checklist

**Date:** 2025-10-13  
**Status:** ⚠️ CONFIGURATION NEEDED  
**Framework:** Next.js 15.5.4 (App Router)

---

## 📊 Readiness Score: 75/100

| Category | Status | Score |
|----------|--------|-------|
| Build Configuration | ✅ Ready | 20/20 |
| Output Mode | ✅ Standalone | 10/10 |
| Environment Variables | ⚠️ Needs Setup | 10/20 |
| Rewrites/Redirects | ✅ Configured | 15/15 |
| vercel.json | ❌ Missing | 0/15 |
| Security Headers | ⚠️ Partial | 10/20 |

**Missing:** vercel.json configuration (15 points), env vars setup (10 points)

---

## ✅ Current Configuration

### 1. Next.js Configuration
**File:** `next.config.js`

```javascript
const nextConfig = {
  // ✅ Vercel-compatible output mode
  output: 'standalone',

  // ✅ TypeScript validation enabled
  typescript: {
    ignoreBuildErrors: false,
  },

  // ✅ ESLint check (skipped during build for speed)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ React Strict Mode enabled
  reactStrictMode: true,

  // ✅ Security: X-Powered-By header hidden
  poweredByHeader: false,

  // ✅ Image optimization configured
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60,
  },

  // ✅ Compression enabled
  compress: true,

  // ❌ Source maps disabled in production (good for security)
  productionBrowserSourceMaps: false,
};
```

**Vercel Compatibility:** ✅ EXCELLENT

---

### 2. Build Configuration
**File:** `package.json`

```json
{
  "name": "busbuskimki-tarot",
  "version": "0.1.0",
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  },
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

**Vercel Auto-Detection:**
- ✅ Framework: Next.js (auto-detected)
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `.next` (automatic)
- ✅ Install Command: `npm install`
- ✅ Node Version: 20.x (from engines)

---

### 3. Locale & Routing
**Middleware:** `src/middleware.ts`

```typescript
export default function middleware(request: NextRequest) {
  // SEO-friendly URL rewrites
  // Locale routing (tr, en, sr)
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)',],
};
```

**Rewrites Configuration:** `next.config.js:66-126`

```javascript
async rewrites() {
  return [
    // Turkish
    { source: '/tr/anasayfa', destination: '/tr' },
    { source: '/tr/tarot-okuma', destination: '/tr/tarotokumasi' },
    
    // English
    { source: '/en/home', destination: '/en' },
    { source: '/en/tarot-reading', destination: '/en/tarotokumasi' },
    
    // Serbian
    { source: '/sr/pocetna', destination: '/sr' },
    { source: '/sr/tarot-citanje', destination: '/sr/tarotokumasi' },
  ];
}
```

**✅ Vercel Compatibility:**
- Edge Middleware: ✅ Supported
- Rewrites: ✅ Working
- Locale Routing: ✅ Compatible

---

## ❌ Missing Configuration

### 1. vercel.json File

**Status:** ❌ NOT FOUND  
**Risk:** 🟡 MEDIUM  

**Why It's Needed:**
- Explicit build/output configuration
- Security headers configuration
- Redirect rules (if needed)
- Route caching rules
- Region selection

**Recommended vercel.json** (see PATCHES/vercel.json)

---

### 2. Environment Variables

**Status:** ⚠️ NEEDS MANUAL SETUP  

**Required Variables for Vercel:**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_CONTACT_PHONE=

# AI Services
GROQ_API_KEY=
GEMINI_API_KEY=

# Payment (Shopier)
SHOPIER_MERCHANT_ID=
SHOPIER_API_KEY=
SHOPIER_API_SECRET=
SHOPIER_TEST_MODE=false
NEXT_PUBLIC_SHOPIER_API_URL=https://www.shopier.com/ShowProduct/api_pay4.php
NEXT_PUBLIC_SHOPIER_CALLBACK_URL=https://your-domain.com/payment/callback
NEXT_PUBLIC_SHOPIER_WEBHOOK_URL=https://your-domain.com/api/webhook/shopier

# Email
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=

# Environment
NODE_ENV=production
```

---

## 🔧 Vercel Dashboard Configuration

### Step 1: Import Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Connect GitHub repository
3. Select `TaraTarot` repository

### Step 2: Configure Build Settings

**Framework Preset:** Next.js  
**Root Directory:** `./` (leave empty)  
**Build Command:** `npm run build`  
**Output Directory:** `.next` (auto)  
**Install Command:** `npm install`  
**Node Version:** 20.x

### Step 3: Add Environment Variables

Go to: **Settings → Environment Variables**

**For Each Variable:**
1. Enter variable name (e.g., `GROQ_API_KEY`)
2. Enter variable value
3. Select environments:
   - [x] Production
   - [x] Preview
   - [ ] Development (optional)
4. Click **Save**

**⚠️ IMPORTANT:**
- Encrypt sensitive keys (Vercel does this automatically)
- Never commit .env files to git
- Use different keys for staging/production if possible

### Step 4: Configure Domain

Go to: **Settings → Domains**

1. Add custom domain: `your-domain.com`
2. Add www subdomain: `www.your-domain.com`
3. Configure DNS:
   ```
   A     @       76.76.21.21
   CNAME www     cname.vercel-dns.com
   ```
4. Enable HTTPS (automatic)

### Step 5: Configure Security Headers (Optional)

**Option A:** Use vercel.json (recommended)
- Upload `PATCHES/vercel.json` to root
- Commit and redeploy

**Option B:** Use next.config.js
- Already partially configured
- Apply patch from `PATCHES/next.config.js.patch`

---

## 🚀 Deployment Process

### First Deployment

```bash
# 1. Install Vercel CLI (optional)
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Link project
vercel link

# 4. Deploy to preview
vercel

# 5. Deploy to production
vercel --prod
```

### Automated Deployment (GitHub)

**Vercel automatically deploys when:**
- ✅ Push to `main` branch → Production
- ✅ Push to other branches → Preview
- ✅ Pull requests → Preview deployment

**Configuration:**
1. Go to: **Settings → Git**
2. Set production branch: `main`
3. Enable automatic deployments: ✅
4. Configure deploy hooks (optional)

---

## 📊 Build Output Analysis

### Production Build Stats

```
Route (app)                                 Size  First Load JS
┌ ○ /_not-found                            193 B         3.1 MB
├ ƒ /[locale]                             2.1 kB        3.16 MB
├ ƒ /[locale]/admin                      5.58 kB        3.15 MB
├ ƒ /[locale]/tarotokumasi               12.7 kB        3.18 MB
...
+ First Load JS shared by all             3.1 MB
ƒ Middleware                             17.2 MB
```

**Performance Concerns:**
- ⚠️ Middleware: 17.2 MB (large, may affect cold starts)
- ✅ First Load JS: 3.1 MB (acceptable with lazy loading)
- ✅ Route segments: Small individual sizes

**Recommendations:**
1. Consider splitting middleware if possible
2. Enable edge caching for static routes
3. Use Vercel Analytics to monitor performance

---

## 🔒 Security Configuration

### Current Security Features

**✅ Enabled:**
- HTTPS (automatic)
- X-Powered-By hidden
- SVG CSP configured
- Webhook security headers

**⚠️ Needs Configuration:**
- Global Content-Security-Policy
- X-Frame-Options (global)
- Strict-Transport-Security (global)
- Referrer-Policy

**Solution:** Apply `PATCHES/vercel.json` with security headers

---

## 🌍 Edge Functions & Regions

### Current Configuration

**Edge Middleware:** ✅ Enabled (automatic)  
**API Routes Runtime:** `nodejs` (default)

**Recommended Regions:**
- `fra1` - Frankfurt, Germany (Europe)
- `iad1` - Washington, D.C., USA (Americas)
- `sin1` - Singapore (Asia)

**To Configure:**
```javascript
// In API routes that need edge runtime
export const runtime = 'edge';
export const preferredRegion = ['fra1', 'iad1'];
```

---

## 📋 Pre-Deployment Checklist

### Code Preparation
- [✅] Build passes locally (`npm run build`)
- [✅] No TypeScript errors
- [✅] Environment variables documented
- [✅] Middleware tested
- [✅] API routes tested
- [⚠️ ] Security headers configured (needs patch)

### Vercel Configuration
- [ ] Project imported to Vercel
- [ ] Environment variables added
- [ ] Custom domain configured
- [ ] HTTPS enabled (automatic)
- [ ] Production branch set to `main`
- [ ] Preview deployments enabled

### Testing
- [ ] Test preview deployment
- [ ] Verify environment variables loaded
- [ ] Test authentication flow
- [ ] Test payment webhook
- [ ] Test email delivery
- [ ] Verify locale routing
- [ ] Check security headers

### Monitoring
- [ ] Enable Vercel Analytics
- [ ] Set up error alerts
- [ ] Configure deployment notifications
- [ ] Monitor function logs

---

## 🧪 Post-Deployment Testing

### 1. Basic Health Check
```bash
# Test main page
curl -I https://your-domain.com

# Test API health endpoint
curl https://your-domain.com/api/health

# Test webhook endpoint (should reject)
curl -X POST https://your-domain.com/api/webhook/shopier
```

### 2. Security Headers Check
```bash
# Check all security headers
curl -I https://your-domain.com | grep -E "(X-Frame|X-Content|Strict-Transport|Referrer)"
```

### 3. Locale Routing Check
```bash
# Test Turkish
curl -I https://your-domain.com/tr

# Test English
curl -I https://your-domain.com/en

# Test Serbian
curl -I https://your-domain.com/sr
```

### 4. Payment Flow Test
1. Go to `/[locale]/dashboard/packages`
2. Select a package (use test mode)
3. Complete Shopier payment flow
4. Verify webhook receives callback
5. Check credit balance update

---

## ⚠️ Common Deployment Issues

### Issue 1: Environment Variables Not Loading

**Symptom:** `Missing SUPABASE_URL` error  
**Solution:**
1. Check variable names (case-sensitive)
2. Redeploy after adding variables
3. Verify environment selection (Production/Preview)

### Issue 2: Middleware Too Large

**Symptom:** Cold start > 500ms  
**Solution:**
1. Move non-critical logic to API routes
2. Use edge runtime where possible
3. Consider edge caching

### Issue 3: Build Timeout

**Symptom:** Build fails after 45 minutes  
**Solution:**
1. Check for infinite loops in build scripts
2. Reduce static page generation
3. Use `fallback: 'blocking'` for dynamic routes

### Issue 4: Webhook Not Receiving Calls

**Symptom:** No webhook logs  
**Solution:**
1. Verify webhook URL in Shopier dashboard
2. Check IP whitelisting (may need to disable in test)
3. Test with curl first

---

## 🔧 Recommended Next Steps

### Priority 1: Create vercel.json
**File:** See `PATCHES/vercel.json`  
**Action:** Copy to project root and commit

### Priority 2: Configure Environment Variables
**Action:** Add all required env vars in Vercel dashboard

### Priority 3: Deploy to Preview
**Action:** Push to a feature branch, verify preview deployment

### Priority 4: Test Production Deployment
**Action:** Merge to main, monitor production deployment

### Priority 5: Configure Custom Domain
**Action:** Add domain in Vercel dashboard, update DNS

---

## ✅ Vercel-Specific Optimizations

### 1. Edge Config (Optional)
```bash
# For feature flags or A/B testing
npm install @vercel/edge-config
```

### 2. Analytics
```typescript
// Already installed: @vercel/analytics
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 3. Speed Insights
```typescript
// Already installed: @vercel/speed-insights
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## ✅ Final Assessment

**Vercel Readiness:** ⚠️ 75/100 (Good, needs configuration)  
**Build Compatibility:** ✅ EXCELLENT  
**Deploy Ready:** ⚠️ AFTER ADDING vercel.json + ENV VARS  

**Recommendation:** Complete checklist above, then deploy to preview first.

---

## 📚 Resources

- [Vercel Next.js Deployment](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/concepts/projects/domains)
- [Edge Middleware](https://vercel.com/docs/concepts/functions/edge-middleware)

