# Firebase Security Hardening & App Check Guide

This document describes the security model for Firebase Authentication, Cloud Firestore, and Google Cloud API credentials used by AI Finder Technologies.

## 1. Firebase API Key Security Context

The Firebase web credentials stored in `firebase-applet-config.json` identify your Firebase project to Google APIs and are public by design. However, defense-in-depth requires restricting the API key in the Google Cloud Console.

### Restricting the API Key by HTTP Referrer:
1. Navigate to the [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Select your Firebase project (`sacred-campus-x01dl`).
3. Click on the Browser API Key (matching the `apiKey` in `firebase-applet-config.json`).
4. Under **Set application restrictions**, choose **Websites**.
5. Under **Website restrictions**, add the following authorized domains:
   - `https://ai-finder-ruddy.vercel.app/*`
   - `https://*.vercel.app/*`
   - `http://localhost:*/*`
   - Any custom domain (e.g., `https://aifindertechnologies.com/*`)
6. Under **API restrictions**, choose **Restrict key** and limit access to:
   - **Identity Toolkit API** (Firebase Auth)
   - **Cloud Firestore API**
   - **Token Service API**
7. Click **Save**.

---

## 2. Firebase App Check (reCAPTCHA v3) Setup

Firebase App Check verifies that traffic to Firestore originates from your legitimate web application, preventing headless scrapers, bot spam, and script abuse.

### Step 1: Register reCAPTCHA v3 in Google Cloud / reCAPTCHA Console
1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin).
2. Register a new site with:
   - **reCAPTCHA type**: reCAPTCHA v3
   - **Domains**: `ai-finder-ruddy.vercel.app`, `localhost`, and your production custom domain.
3. Copy the **Site Key** and **Secret Key**.

### Step 2: Configure Firebase App Check in Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/) -> Select your project -> **App Check**.
2. Click on your Web app.
3. Select **reCAPTCHA v3**, paste the Secret Key, set the token TTL (default: 1 hour), and click **Save**.

### Step 3: Enable in AI Finder Codebase
In your environment variables (`.env` or Vercel Environment Variables):
```bash
VITE_APPCHECK_SITE_KEY=your_recaptcha_v3_site_key_here
```
The client code in `src/lib/firebase.ts` detects this variable and automatically activates `initializeAppCheck` with `ReCaptchaV3Provider` and auto-token refresh.

### Step 4: Enforce App Check on Firestore
1. Once deployed, monitor the **App Check** metrics in Firebase Console for 72 hours.
2. Verify that legitimate client requests show green "Verified" status.
3. Click **Enforce** for Cloud Firestore to deny all unverified requests at the infrastructure edge.
