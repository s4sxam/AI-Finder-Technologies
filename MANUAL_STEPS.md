# Manual Owner Actions & Configuration Guide

This document catalogs every setting, secret, and administrative task that can only be performed by the repository owner in provider dashboards (Vercel, GitHub, Google Cloud, Firebase, Resend, Turnstile).

---

## 1. Automated Benchmark Refresh & Vercel Auto-Redeployment (Phase 1)

The GitHub Actions workflow `.github/workflows/refresh-data.yml` runs every 6 hours (`0 */6 * * *`) to fetch the latest model intelligence indexes and OpenRouter pricing into `src/data/live/benchmarks.json`.

### How to verify after the first cron run:
1. Go to your repository on GitHub -> **Actions** tab -> **Refresh Live AI Benchmarks**.
2. Click **Run workflow** (branch: `main`) to trigger a manual dispatch test.
3. Once the workflow completes, navigate to your **Vercel Dashboard** -> **Deployments**.
4. Confirm a new deployment is triggered with the commit message `chore(data): refresh live benchmarks from Artificial Analysis & OpenRouter`.
5. Note: Since `[skip ci]` was removed from this commit and the workflow runs on a cron schedule (not on git push), Vercel deploys the updated data cleanly without triggering an infinite workflow loop.
6. Optional Secret: If you have an **Artificial Analysis Pro API key**, add it as a secret named `ARTIFICIAL_ANALYSIS_API_KEY` in GitHub repo settings -> **Secrets and variables** -> **Actions**. Without this key, the workflow automatically uses OpenRouter's live catalog and verified baseline intelligence indexes without failing.

---

## 2. Contact Form & Newsletter Setup via Resend / Buttondown (Phase 3)

### A. Contact Form Delivery (Resend)
1. Sign up or log into [Resend](https://resend.com).
2. Create an API key under **API Keys** -> **Create API Key** (permission: Full Access or Sending Access).
3. In your **Vercel Dashboard** (or `.env` for local testing), add:
   - `RESEND_API_KEY=re_yourApiKeyHere`
   - `CONTACT_TO_EMAIL=your-inbox@example.com`
4. Testing:
   - **With env vars unset**: submitting the form returns HTTP 503 and prompts the user with an honest message: *"Couldn't send right now — email us at <fallback email>"*. No fake success is ever displayed.
   - **With env vars set**: submit a message on `/contact`. A real email from `onboarding@resend.dev` (or your verified domain) will arrive in `CONTACT_TO_EMAIL`.

### B. Newsletter Provider Setup
Choose one of the two supported providers:
- **Option 1: Resend Audience**
  1. In Resend, go to **Audiences** -> **Create Audience**.
  2. Copy the Audience ID.
  3. Set `RESEND_API_KEY=re_...` and `RESEND_AUDIENCE_ID=your_audience_id`.
- **Option 2: Buttondown**
  1. In [Buttondown](https://buttondown.email), go to Settings -> Programming / API.
  2. Copy your API key.
  3. Set `BUTTONDOWN_API_KEY=your_key_here`.
- **Feature Flag Behavior**:
  - If neither `RESEND_AUDIENCE_ID` nor `BUTTONDOWN_API_KEY` is present, `GET /api/newsletter-subscribe` returns `{ enabled: false }` and the newsletter form automatically hides itself to avoid showing a dead form.
  - When configured, the form appears, requires valid email input, and instructs the user to confirm via their inbox upon HTTP 200 response.

---

## 3. Firestore Rules Admin Email & Deployment (Phase 4)

### A. Setting the Admin Email Kill Switch
1. Open `firestore.rules`.
2. Locate line 22:
   ```javascript
   function isAdmin() {
     return isSignedIn()
       && request.auth.token.email == 'ADMIN_EMAIL_PLACEHOLDER'
       && request.auth.token.email_verified == true;
   }
   ```
3. Replace `'ADMIN_EMAIL_PLACEHOLDER'` with your actual Google Account email address (e.g. `'uzoro7615@gmail.com'`).
4. Ensure your email address is verified with Google so `email_verified == true`.

### B. Deploying Updated Security Rules to Firebase
Run the following in your terminal with Firebase CLI logged in:
```bash
firebase deploy --only firestore:rules
```
Or copy the contents of `firestore.rules` directly into the **Firebase Console** -> **Firestore Database** -> **Rules** tab, and click **Publish**.

---

## 4. Security Headers, CSP & Vercel Firewall Hardening (Phase 5)

### A. Restricting the Firebase API Key in Google Cloud
1. Visit [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Select your Firebase project (`sacred-campus-x01dl`).
3. Click your Browser API Key (`AIzaSy...`).
4. Set **Application restrictions** to **Websites** and add:
   - `https://ai-finder-ruddy.vercel.app/*`
   - `https://*.vercel.app/*`
   - `http://localhost:*/*`
   - Any custom domain (e.g. `https://aifindertechnologies.com/*`)
5. Save changes.

### B. Configuring Firebase App Check
1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin) and create a reCAPTCHA v3 site.
2. Register your domains (`ai-finder-ruddy.vercel.app`, `localhost`).
3. In Firebase Console -> **App Check**, register your web app with the reCAPTCHA v3 Secret Key.
4. In Vercel Environment Variables, add:
   ```bash
   VITE_APPCHECK_SITE_KEY=your_recaptcha_v3_site_key
   ```
5. After 72 hours of clean metrics in the Firebase App Check dashboard, click **Enforce** for Cloud Firestore.

### C. Promoting Content-Security-Policy to Enforcing
1. The site is currently configured in `vercel.json` with `Content-Security-Policy-Report-Only` to allow testing across third-party fonts, Three.js canvases, and Google Auth popups without breaking production users.
2. After observing zero legitimate violations in your browser developer console or CSP reporting endpoint for 7 days:
3. In `vercel.json`, change the header key:
   `"Content-Security-Policy-Report-Only"` -> `"Content-Security-Policy"`.

### D. Setting up Vercel Firewall Rate Limiting for /api/*
1. In your **Vercel Project Dashboard**, navigate to **Security** -> **Attack Challenge Mode / Firewall**.
2. Click **Create Rule**.
3. Set condition: **Path starts with** `/api/`.
4. Action: **Rate Limit** (e.g., 30 requests per minute per IP).
5. Click **Save Rule**.

