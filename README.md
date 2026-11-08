# AI Finder Technologies

<div align="center">

![AI Finder Technologies Mark](/public/logo-mark.svg)

### A Curated Directory & Benchmarking Laboratory for Frontier AI Tools

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r187-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Production%20Ready-black?style=flat-square&logo=vercel)](https://vercel.com/)
[![WCAG 2.2 AA](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA-success?style=flat-square)](#accessibility--performance)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 📌 Overview

**AI Finder Technologies** is an independent, production-grade directory and evaluation platform for artificial intelligence software. Designed with the aesthetic density and typography standards of **Linear, Raycast, and Stripe**, it completely eliminates AI-slop clichés (no purple gradient heroes, no pill-badge sandwiches, no fake scorecards, and no sponsored pay-to-play rankings).

### Key Features
* 🔍 **Instant Live Search**: Sub-millisecond debounced search with keyword highlighting and live category suggestions.
* ⌨️ **Cmd/Ctrl+K Command Palette**: Full-featured keyboard navigation dialog to jump straight to any tool, guide, or category.
* 🪐 **Interactive 3D Constellation Nexus (Three.js)**: Physically-Based Rendering (PBR) WebGL scene featuring composite procedural models, `RoomEnvironment` studio lighting, exponential camera damping, and a collapsible bottom dock ($\le 15\%$ viewport footprint).
* ⚖️ **Side-by-Side Compare Matrix**: Select up to 3 tools to compare architecture, pricing models, platforms, pros/cons, and target users head-to-head.
* 📑 **10 Original Benchmark Guides**: 900–1,500 word in-depth analyses covering IDE refactoring, model reasoning, image diffusion, video editing, and academic search.
* 🏷️ **Faceted Real-Time Filtering**: Filter by category, pricing model (`Free`, `Freemium`, `Paid`), platform, verified status, and bookmarks—all automatically synchronized to the URL query string for effortless sharing.
* 🔖 **Persistent Local Bookmarks**: Save favorite tools directly to browser `localStorage` with zero account required.
* 🌓 **Dual-Theme Design System**: Clean Light and Dark modes built with CSS custom properties and Tailwind CSS v4 `@custom-variant dark`.
* 🚀 **Technical SEO Pre-Wired**: XML Sitemap (`/sitemap.xml`), robots.txt (`/robots.txt`), RSS 2.0 Feed (`/rss.xml`), and Schema.org JSON-LD structured data (`SoftwareApplication`, `BlogPosting`, `FAQPage`, `WebSite`, `Organization`).

---

## 🛠️ Tech Stack

* **Framework**: React 19 (Functional components, custom hooks)
* **Language**: TypeScript 5.x (Strict type safety, zero compile warnings)
* **Build Tool**: Vite 8
* **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`, CSS variables, zero runtime CSS overhead)
* **3D Visuals**: Three.js (r187) with ACES Filmic tone mapping, PMREM generator, procedural canvas textures
* **Icons**: Lucide React
* **Deployment Target**: Vercel, Netlify, Cloudflare Pages, or GitHub Pages

---

## 📂 Project Structure

```
├── /index.html                         # HTML entry point, fonts, OpenGraph, JSON-LD
├── /package.json                       # Dependencies & scripts
├── /vite.config.ts                     # Vite + Tailwind v4 + React plugins
├── /vercel.json                        # SPA rewrite rule (prevents 404 on refresh)
├── /.github/workflows/ci.yml           # GitHub Actions automated build & lint check
├── /public/
│   ├── favicon.svg                     # Crisp 32x32 geometric reticle vector favicon
│   ├── logo-mark.svg                   # Vector icon mark
│   ├── logo.svg                        # Vector logo mark + wordmark
│   ├── robots.txt                      # Search engine crawler instructions
│   ├── sitemap.xml                     # XML Sitemap with all 25+ canonical URLs
│   └── rss.xml                         # RSS 2.0 editorial syndication feed
├── /src/
│   ├── App.tsx                         # Core SPA routing, state, dark mode, SEO sync
│   ├── index.css                       # Design tokens, Tailwind v4 custom dark variant
│   ├── main.tsx                        # React DOM mounting
│   ├── types/
│   │   └── index.ts                    # TypeScript types (Tool, BlogPost, FilterOptions)
│   ├── data/
│   │   ├── tools.ts                    # 18 premier AI tools with full metrics & FAQs
│   │   └── blogPosts.ts                # 10 comprehensive, original starter guides
│   ├── components/
│   │   ├── Header.tsx                  # 3-zone top bar contract (Brand, Links, Actions)
│   │   ├── Footer.tsx                  # Quiet authority footer with sitemap & legal links
│   │   ├── CommandPalette.tsx          # Cmd/Ctrl+K keyboard search dialog
│   │   ├── ToolCard.tsx                # Zero-pill metadata tool card (Grid & List)
│   │   ├── ComparisonDrawer.tsx        # Floating dock & side-by-side modal matrix
│   │   ├── BrandGuideModal.tsx         # Colors, clear space, minimum size rules
│   │   └── ThreeScene.tsx              # Three.js 3D Constellation Nexus
│   └── pages/
│       ├── HomePage.tsx                # Search first, trending tools, 3D nexus toggle
│       ├── DirectoryPage.tsx           # Multi-faceted filter catalog with URL syncing
│       ├── ToolDetailPage.tsx          # Deep /tools/[slug] evaluation with specs & FAQ
│       ├── CategoriesPage.tsx          # Category hub & single category views
│       ├── BlogIndexPage.tsx           # Research hub with filter tags & read times
│       ├── BlogPostPage.tsx            # /blog/[slug] guide with auto TOC & tool CTAs
│       ├── ComparePage.tsx             # Dedicated full-page comparison workbench
│       ├── AboutPage.tsx               # Independence manifesto & 4-stage methodology
│       ├── ContactPage.tsx             # Validated submission & feedback form
│       ├── LegalPage.tsx               # Privacy policy & terms of service
│       ├── Nexus3DPage.tsx             # Dedicated full-bleed 3D viewport
│       └── NotFoundPage.tsx            # Polished 404 recovery state
```

---

## ⚡ Getting Started (Local Development)

### 1. Prerequisites
* **Node.js**: v18.0.0 or higher (v20+ recommended)
* **npm**: v9.0.0 or higher (or pnpm / yarn)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/ai-finder-technologies.git

# Navigate into the project directory
cd ai-finder-technologies

# Install dependencies
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production & Verify Types
```bash
# Validate TypeScript with zero errors
npm run lint

# Build production bundle into /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 🚀 Zero-Error Vercel Deployment Guide

Deploying Single Page Applications (SPAs) on Vercel often causes `404: NOT_FOUND` errors when users refresh deep URLs like `/tools/cursor` or `/blog/best-ai-tools-for-coding`.

**This repository includes a pre-configured `vercel.json`** that routes all incoming requests back to `/index.html`, ensuring 100% smooth, error-free routing on Vercel:

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step-by-Step Vercel Setup:
1. **Push your code to GitHub** (see GitHub section below).
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** > **"Project"**.
3. Import your `ai-finder-technologies` repository.
4. Verify the **Project Settings**:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `./`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
   * **Install Command**: `npm install`
5. *(Optional)* Add Environment Variables:
   * `APP_URL`: `https://your-custom-domain.com`
6. Click **"Deploy"**. Vercel will build and deploy the applet in ~30 seconds with **zero build or routing errors**.

---

## 🐙 GitHub Setup & Automated CI

### 1. Initial Git Push
```bash
# Initialize git if not already initialized
git init

# Add all files
git add .

# Initial commit
git commit -m "feat: complete production-grade AI Finder Technologies rebuild"

# Rename branch to main
git branch -M main

# Add your GitHub remote repository
git remote add origin https://github.com/your-username/ai-finder-technologies.git

# Push to GitHub
git push -u origin main
```

### 2. Pre-Configured GitHub Actions CI
This repository includes `.github/workflows/ci.yml`. On every push or pull request to `main`, GitHub Actions automatically:
* Installs dependencies with `npm ci`
* Runs TypeScript type checking via `npm run lint`
* Tests production bundling via `npm run build`

This guarantees that broken imports, type mismatches, or missing files are caught before any code reaches production.

---

## ➕ Adding New AI Tools or Blog Posts (1-File Pattern)

Adding new content never requires touching component markup:

### Adding a New AI Tool
Open `/src/data/tools.ts` and append a new object to `AI_TOOLS`:
```typescript
{
  id: 'tool-new',
  name: 'New AI Tool',
  slug: 'new-ai-tool',
  tagline: 'One-line value proposition.',
  description: 'Detailed evaluation paragraph...',
  category: 'coding', // 'chat' | 'coding' | 'image' | 'video' | 'research' | 'writing'
  pricing: 'Freemium', // 'Free' | 'Freemium' | 'Paid'
  pricingDetails: 'Free tier with 100 credits. Pro is $20/month.',
  platforms: ['Web', 'Mac', 'VS Code'],
  websiteUrl: 'https://example.com',
  rating: 4.8,
  reviewCount: 1200,
  trendingRank: 18,
  featured: false,
  releaseYear: 2026,
  bestFor: 'Target audience summary...',
  keyFeatures: ['Feature 1', 'Feature 2'],
  pros: ['Advantage 1', 'Advantage 2'],
  cons: ['Limitation 1'],
  faqs: [{ question: 'FAQ Question?', answer: 'FAQ Answer.' }],
  alternatives: ['cursor', 'v0'],
  verified: true,
  monogram: 'NT',
  accentColor: '#2F5BFF'
}
```
The tool will automatically appear in the directory, search index, comparison matrix, category counts, and sitemap.

### Adding a New Blog Guide
Open `/src/data/blogPosts.ts` and append a new object to `BLOG_POSTS`:
```typescript
{
  id: 'post-new-topic',
  slug: 'new-topic-guide',
  title: 'Complete Guide Title in 2026',
  description: 'Meta description for search engine snippets (120-155 characters)...',
  date: '2026-03-08',
  updated: '2026-03-08',
  author: {
    name: 'Elena Rostova',
    role: 'Principal Staff Engineer',
    avatar: 'ER'
  },
  category: 'coding',
  tags: ['Coding', 'Tools', 'Guide'],
  readTimeMinutes: 8,
  targetKeyword: 'target keyword phrase',
  searchIntent: 'Commercial',
  outline: ['01. Introduction', '02. Key Findings', '03. Recommendations'],
  content: `### 01. Introduction\n\nArticle prose here...`,
  faqs: [{ question: 'Key Question?', answer: 'Detailed answer.' }],
  relatedToolSlugs: ['cursor', 'v0']
}
```

---

## 🎨 Brand Assets & Guidelines

All brand assets are pure SVG and scale cleanly from 16px favicons to high-DPI displays:
* Full Logo (Mark + Wordmark): `/public/logo.svg`
* Icon Mark Only: `/public/logo-mark.svg`
* Scalable Favicon: `/public/favicon.svg`

### Brand Specifications:
* **Primary Accent Color**: `#2F5BFF`
* **Base Dark Surface**: `#0B0F19`
* **Clear-Space Rule**: Maintain a minimum boundary of **1x mark width** (equal to the height of the optical reticle) around all logos.
* **Minimum Dimensions**:
  * Digital Favicon: `16x16 px`
  * Standalone Mark: `24x24 px`
  * Full Wordmark: `96x20 px` (Print: $\ge 20\text{mm}$)

---

## ♿ Accessibility & Performance

* **WCAG 2.2 AA Compliance**: Text contrast exceeds 4.5:1 on light and dark surfaces, high-contrast focus rings (`focus-visible: 2px solid #2F5BFF`), semantic HTML landmarks (`<header>`, `<main>`, `<nav>`, `<article>`, `<footer>`), and accessible skip links.
* **Zero Layout Shift (CLS < 0.05)**: Pre-allocated dimensions on cards, monograms, and image containers.
* **Zero Garbage Collection (GC) 3D Loop**: Three.js scratch vectors (`_vec3`, `_mat4`, `_color`) pre-allocated outside `requestAnimationFrame`.
* **Zero-Pill Metadata**: Clean typographic separation with `·` to maintain high readability across screen sizes.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built by <strong>AI Finder Technologies</strong>. Independently evaluated with zero sponsored pay-to-play rankings.</sub>
</div>
