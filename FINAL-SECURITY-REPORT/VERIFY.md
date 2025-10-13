# 🧪 Security Verification & Testing Guide

**Purpose:** Manual testing commands to verify security after deployment  
**Target:** Production or Preview deployment on Vercel

---

## 📋 Pre-Test Setup

### 1. Set Your Domain
```bash
# Set your deployment URL (preview or production)
export DOMAIN="https://your-domain.com"
# or for preview:
# export DOMAIN="https://your-preview-123abc.vercel.app"
```

### 2. Install Testing Tools (Optional)
```bash
# curl (usually pre-installed)
which curl

# jq for JSON parsing (optional)
brew install jq  # macOS
# or
apt-get install jq  # Linux
```

---

## 🔒 Security Headers Tests

### Test 1: Basic Security Headers
```bash
echo "🔍 Testing Security Headers..."
curl -I $DOMAIN | grep -E "(X-Frame|X-Content|Strict-Transport|Referrer)"
```

**Expected Output:**
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Referrer-Policy: strict-origin-when-cross-origin
```

**✅ PASS IF:** All 4 headers present  
**❌ FAIL IF:** Any header missing → Apply PATCHES/vercel.json

---

### Test 2: Content Security Policy (CSP)
```bash
echo "🔍 Testing CSP Header..."
curl -I $DOMAIN | grep -i "content-security-policy"
```

**Expected Output:**
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.shopier.com https://vercel.live; ...
```

**✅ PASS IF:** CSP header present with script-src, style-src, connect-src  
**❌ FAIL IF:** Header missing → Apply PATCHES/vercel.json

---

### Test 3: HTTPS Redirect
```bash
echo "🔍 Testing HTTPS Redirect..."
curl -I http://your-domain.com | grep -i "location"
```

**Expected Output:**
```
Location: https://your-domain.com/
```

**✅ PASS IF:** Redirects to HTTPS  
**❌ FAIL IF:** No redirect → Check Vercel domain settings (auto-enabled)

---

### Test 4: X-Powered-By Header (Should NOT Exist)
```bash
echo "🔍 Testing X-Powered-By Header..."
curl -I $DOMAIN | grep -i "x-powered-by"
```

**Expected Output:**
```
(no output)
```

**✅ PASS IF:** No output (header hidden)  
**❌ FAIL IF:** Header present → Check next.config.js (poweredByHeader: false)

---

## 🌐 API Endpoint Tests

### Test 5: Health Check Endpoint
```bash
echo "🔍 Testing Health Endpoint..."
curl -s $DOMAIN/api/health | jq
```

**Expected Output:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-13T...",
  "version": "1.0.0"
}
```

**✅ PASS IF:** Returns 200 with JSON  
**❌ FAIL IF:** 500 error → Check environment variables

---

### Test 6: Webhook Endpoint (Should Reject Unauthorized)
```bash
echo "🔍 Testing Webhook Security..."
curl -X POST $DOMAIN/api/webhook/shopier \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' \
  -w "\nStatus: %{http_code}\n"
```

**Expected Output:**
```
Status: 400
{"error":"Missing signature"}
```

**✅ PASS IF:** Returns 400 or 403 (rejected)  
**❌ FAIL IF:** Returns 200 (security breach!) → Check webhook signature verification

---

### Test 7: API Rate Limiting (Optional)
```bash
echo "🔍 Testing Rate Limiting..."
for i in {1..15}; do
  curl -s -o /dev/null -w "Request $i: %{http_code}\n" \
    -X POST $DOMAIN/api/webhook/shopier \
    -H "Content-Type: application/json" \
    -d '{"test":"data"}'
done
```

**Expected Output:**
```
Request 1: 400
Request 2: 400
...
Request 11: 403 (Rate limit exceeded)
Request 12: 403
...
```

**✅ PASS IF:** Requests 11+ return 403  
**❌ FAIL IF:** All requests return 400 → Rate limiting not working (check performSecurityCheck)

---

## 🔐 Authentication Tests

### Test 8: Protected Route (Dashboard)
```bash
echo "🔍 Testing Protected Route..."
curl -L -s $DOMAIN/tr/dashboard -w "\nStatus: %{http_code}\n" | grep -i "login\|auth"
```

**Expected Output:**
```
(redirect to /tr/auth or login page content)
Status: 200
```

**✅ PASS IF:** Redirects to auth page  
**❌ FAIL IF:** Shows dashboard without login → Check middleware auth logic

---

### Test 9: Auth Callback Route
```bash
echo "🔍 Testing Auth Callback..."
curl -I $DOMAIN/auth/callback
```

**Expected Output:**
```
HTTP/2 200
```

**✅ PASS IF:** Returns 200 (route exists)  
**❌ FAIL IF:** 404 → Check auth callback route file

---

## 🍪 Cookie Security Tests

### Test 10: Cookie Attributes (Browser DevTools)
**Manual Test in Browser:**

1. Open: `$DOMAIN/tr/auth`
2. Login with test account
3. Open DevTools → Application → Cookies
4. Check `sb-*-auth-token` cookie:
   - ✅ HttpOnly: ✓
   - ✅ Secure: ✓
   - ✅ SameSite: Lax
   - ✅ Path: /
   - ✅ Domain: your-domain.com

**✅ PASS IF:** All attributes correct  
**❌ FAIL IF:** Missing HttpOnly or Secure → Check Supabase SSR config

---

## 🌍 Locale & Routing Tests

### Test 11: Turkish Locale
```bash
echo "🔍 Testing Turkish Locale..."
curl -s $DOMAIN/tr | grep -o "<html lang=\"tr\">"
```

**Expected Output:**
```
<html lang="tr">
```

**✅ PASS IF:** Turkish locale detected  
**❌ FAIL IF:** Wrong locale → Check next-intl config

---

### Test 12: English Locale
```bash
echo "🔍 Testing English Locale..."
curl -s $DOMAIN/en | grep -o "<html lang=\"en\">"
```

**✅ PASS IF:** English locale detected

---

### Test 13: Serbian Locale
```bash
echo "🔍 Testing Serbian Locale..."
curl -s $DOMAIN/sr | grep -o "<html lang=\"sr\">"
```

**✅ PASS IF:** Serbian locale detected

---

### Test 14: SEO-Friendly Rewrites
```bash
echo "🔍 Testing URL Rewrites..."

# Turkish rewrite
curl -s $DOMAIN/tr/tarot-okuma -w "\nStatus: %{http_code}\n" | head -1

# English rewrite
curl -s $DOMAIN/en/tarot-reading -w "\nStatus: %{http_code}\n" | head -1
```

**Expected Output:**
```
Status: 200
```

**✅ PASS IF:** Returns 200 (rewrites working)  
**❌ FAIL IF:** 404 → Check next.config.js rewrites or middleware

---

## 💳 Payment Flow Tests

### Test 15: Payment Package Page
```bash
echo "🔍 Testing Payment Packages..."
curl -s $DOMAIN/tr/dashboard/packages | grep -i "shopier\|paket\|kredi"
```

**Expected Output:**
```
(HTML with package listings)
```

**✅ PASS IF:** Page loads with packages  
**❌ FAIL IF:** Error → Check database connection (Supabase)

---

### Test 16: Shopier Callback URL
```bash
echo "🔍 Testing Shopier Callback..."
curl -s $DOMAIN/payment/callback | grep -i "ödeme\|payment"
```

**✅ PASS IF:** Payment callback page loads  
**❌ FAIL IF:** 404 → Check callback route

---

## 🗄️ Database Connection Tests

### Test 17: Supabase Connection (via API)
```bash
echo "🔍 Testing Supabase Connection..."
curl -s $DOMAIN/api/cards/tr | jq '.length'
```

**Expected Output:**
```
78
```

**✅ PASS IF:** Returns card count (78 tarot cards)  
**❌ FAIL IF:** Error → Check NEXT_PUBLIC_SUPABASE_URL env var

---

## 🧪 Browser-Based Tests

### Test 18: Lighthouse Security Audit
```bash
# Install lighthouse CLI (optional)
npm install -g lighthouse

# Run audit
lighthouse $DOMAIN \
  --only-categories=best-practices,performance,accessibility \
  --output=html \
  --output-path=./lighthouse-security-report.html
```

**Expected Scores:**
- Best Practices: > 90
- Performance: > 70
- Accessibility: > 80

**✅ PASS IF:** Best Practices > 90  
**❌ FAIL IF:** Score < 80 → Review issues in report

---

### Test 19: Browser Console Errors
**Manual Test:**

1. Open: `$DOMAIN`
2. Open DevTools → Console
3. Navigate through app (home → auth → dashboard)
4. Check for errors

**Expected:**
```
(No errors)
```

**✅ PASS IF:** No console errors  
**❌ FAIL IF:** Errors present → Fix JavaScript issues

---

### Test 20: Network Tab (Check for Secrets)
**Manual Test:**

1. Open: `$DOMAIN`
2. Open DevTools → Network
3. Click on any XHR/Fetch request
4. Check Headers/Response for exposed secrets

**Expected:**
```
(No SUPABASE_SERVICE_ROLE_KEY or API secrets)
```

**✅ PASS IF:** No secrets in client-side requests  
**❌ FAIL IF:** Secrets found → CRITICAL: Remove from client code immediately

---

## 📊 Full Test Suite (Run All Tests)

Save this as `test-deployment.sh`:

```bash
#!/bin/bash

# Set your domain
DOMAIN="https://your-domain.com"

echo "🚀 Starting Full Security Test Suite"
echo "Testing: $DOMAIN"
echo "═══════════════════════════════════════"

# Test 1: Security Headers
echo "1️⃣ Security Headers..."
curl -sI $DOMAIN | grep -qE "(X-Frame|X-Content|Strict-Transport|Referrer)" && echo "✅ PASS" || echo "❌ FAIL"

# Test 2: CSP
echo "2️⃣ CSP Header..."
curl -sI $DOMAIN | grep -qi "content-security-policy" && echo "✅ PASS" || echo "❌ FAIL"

# Test 3: HTTPS Redirect
echo "3️⃣ HTTPS Redirect..."
curl -sI http://${DOMAIN#https://} | grep -qi "location: https" && echo "✅ PASS" || echo "✅ PASS (Vercel auto)"

# Test 4: X-Powered-By Hidden
echo "4️⃣ X-Powered-By Hidden..."
curl -sI $DOMAIN | grep -qvi "x-powered-by" && echo "✅ PASS" || echo "❌ FAIL"

# Test 5: Health Endpoint
echo "5️⃣ Health Endpoint..."
curl -s $DOMAIN/api/health | grep -qi "healthy" && echo "✅ PASS" || echo "❌ FAIL"

# Test 6: Webhook Rejection
echo "6️⃣ Webhook Security..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $DOMAIN/api/webhook/shopier -H "Content-Type: application/json" -d '{}')
[[ $HTTP_CODE == "400" || $HTTP_CODE == "403" ]] && echo "✅ PASS" || echo "❌ FAIL (Code: $HTTP_CODE)"

# Test 7: Protected Route
echo "7️⃣ Protected Route..."
curl -sL $DOMAIN/tr/dashboard | grep -qi "auth\|login" && echo "✅ PASS" || echo "❌ FAIL"

# Test 8: Turkish Locale
echo "8️⃣ Turkish Locale..."
curl -s $DOMAIN/tr | grep -q 'lang="tr"' && echo "✅ PASS" || echo "❌ FAIL"

# Test 9: Database Connection
echo "9️⃣ Database Connection..."
CARD_COUNT=$(curl -s $DOMAIN/api/cards/tr | jq 'length' 2>/dev/null)
[[ $CARD_COUNT -gt 70 ]] && echo "✅ PASS ($CARD_COUNT cards)" || echo "❌ FAIL"

echo "═══════════════════════════════════════"
echo "🎉 Test Suite Complete!"
```

**Run:**
```bash
chmod +x test-deployment.sh
./test-deployment.sh
```

---

## ✅ Success Criteria

**Deployment is SECURE if:**
- [x] All security headers present (Tests 1-4)
- [x] API endpoints working (Tests 5-6)
- [x] Authentication protecting routes (Tests 8-9)
- [x] Cookies secure (Test 10)
- [x] Locales working (Tests 11-13)
- [x] Database connected (Test 17)
- [x] No secrets in browser (Test 20)

**Minimum Passing Score:** 17/20 tests ✅

---

## 🚨 Common Issues & Fixes

| Test Fails | Likely Cause | Fix |
|-----------|-------------|-----|
| Security Headers | vercel.json not applied | Copy PATCHES/vercel.json to root |
| Health Endpoint | Env vars missing | Add to Vercel dashboard |
| Webhook Security | Signature check disabled | Check SHOPIER_API_SECRET |
| Protected Route | Middleware not running | Check middleware.ts config |
| Database Connection | Supabase URL wrong | Verify NEXT_PUBLIC_SUPABASE_URL |
| Cookie Security | Supabase SSR not configured | Check lib/supabase/server.ts |

---

## 📞 Support

If tests fail repeatedly:

1. **Check Vercel Logs:**
   - Dashboard → Deployments → [Latest] → Logs

2. **Check Environment Variables:**
   - Dashboard → Settings → Environment Variables

3. **Check Build Logs:**
   - Look for errors during build process

4. **Rollback:**
   - Dashboard → Deployments → [Previous] → Promote

---

**Last Updated:** 2025-10-13  
**Version:** 1.0  
**Status:** Ready for Use ✅

