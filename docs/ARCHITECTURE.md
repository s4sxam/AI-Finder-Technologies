# AI Finder Technologies Architecture

## 1. Overview & Hosting Model

AI Finder Technologies is designed as a hybrid static/SPA application with optional serverless edge functions:
- **Client Application**: React 19 SPA bundled with Vite 8 + Tailwind CSS v4.
- **Routing**: Client-side state router in `src/App.tsx` responding to `window.location.pathname` and `popstate` events.
- **Static Prerendering**: `scripts/prerender.ts` runs during `npm run build` after Vite bundling, outputting 117+ static HTML pages with pre-baked SEO metadata, canonical links, and Schema.org JSON-LD tags into `dist/<path>/index.html`.
- **Primary Hosting Target**: Vercel (static asset CDN with rewrite fallback `/(?!api/).*` -> `/index.html` and serverless functions in `/api/*`).
- **Express Server (`server.ts`)**: Secondary/local development and full-stack container wrapper. In dev mode (`npm run dev`), it mounts Vite middlewares; in production mode, it serves static files from `dist/` with prerendered file resolution and provides `/api/benchmarks`.
- **Database & Auth**: Client-direct Firebase Auth and Google Cloud Firestore (`sacred-campus-x01dl` / `ai-studio-aifindertechnolo-7f6a2f42-0661-48c8-8c2f-d01b23567359`). Tool submissions are written directly by authenticated users to Firestore collection `communityTools/{domainKey}` using YouTube-style auto-publishing.

## 2. API & Data Flow

### A. Vercel Serverless Functions (`api/`) vs Express (`server.ts`)
- **Vercel Serverless Functions**:
  - `api/contact.ts`: Contact form processing with server-side validation and Resend email delivery.
  - `api/newsletter-subscribe.ts`: Double opt-in newsletter subscription via Resend Audience / Buttondown.
  - `api/benchmarks.ts`: Serverless benchmark provider serving cached benchmark data.
- **Express Server (`server.ts`)**:
  - Provides a single dev server process (`PORT 3000`) for environments running Node.js / container runtimes.

### B. Benchmark Data Refresh Cron Flow
1. **GitHub Actions Workflow** (`.github/workflows/refresh-data.yml`):
   - Runs every 6 hours (`0 */6 * * *`) or manually via `workflow_dispatch`.
   - Executes `scripts/fetch-benchmarks.ts`.
   - Calls OpenRouter API (`https://openrouter.ai/api/v1/models`) and Artificial Analysis API (`https://artificialanalysis.ai/api/v2/language/models`).
   - Normalizes pricing, context lengths, output speed, and intelligence index.
   - Updates `src/data/live/benchmarks.json` and `src/data/live/history.json`.
   - Commits changes to Git without `[skip ci]`, triggering a fresh build and deploy on Vercel.

### C. Community Submission Flow
1. Authenticated user inputs tool details on `/submit-tool`.
2. Normalized domain key is generated (e.g., `cursor.com`).
3. Firestore client executes atomic batch write:
   - Increments rate limit document `users/{uid}/limits/submissions`.
   - Creates document in `communityTools/{domainKey}`.
4. Auto-publish: The tool is visible immediately to public users without manual review queues.
5. Curated registry tools always take precedence over community submissions for identical domains.
6. Public users can submit abuse reports to `reports/{domainKey}_{uid}`.

## 3. Baseline Metrics (Phase 0 Before Snapshot)
- **TypeScript**: 0 errors (with non-strict baseline).
- **Vite Build**: Success.
- **Main Client Bundle**: 1,684.80 kB (gzip: 471.25 kB).
- **ThreeScene Bundle**: 570.08 kB (gzip: 142.19 kB).
- **CSS Bundle**: 76.42 kB (gzip: 12.18 kB).
- **Prerendered Routes**: 117 routes generated.
- **Package Manager**: npm with `bun.lock` conflict in CI and legacy peer deps conflict with esbuild.
