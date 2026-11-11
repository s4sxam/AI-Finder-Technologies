import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { MODEL_ALIASES, AA_SLUG_TO_ALIAS, OPENROUTER_ID_TO_ALIAS } from './src/data/modelAliases.ts';
import { LiveModel } from './src/types/index.ts';
import contactHandler from './api/contact.ts';
import newsletterHandler from './api/newsletter-subscribe.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);
const APP_URL = (process.env.VITE_APP_URL || process.env.APP_URL || 'https://ai-finder-ruddy.vercel.app').replace(/\/+$/, '');

const app = express();
app.use(express.json());


// In-memory cache for live benchmarks (3 hours)
const CACHE_DURATION_MS = 3 * 60 * 60 * 1000;
interface CachedBenchmarks {
  fetchedAt: string;
  sources: {
    openrouter: boolean;
    artificialAnalysis: boolean;
  };
  totalModels: number;
  freeModelsCount: number;
  models: LiveModel[];
  lastCachedTimestamp: number;
}

let benchmarkCache: CachedBenchmarks | null = null;
let isRefreshing = false;

// Load bundled benchmarks on cold start
function loadBundledSnapshot(): CachedBenchmarks {
  try {
    const benchmarksPath = path.resolve(__dirname, 'src/data/live/benchmarks.json');
    if (fs.existsSync(benchmarksPath)) {
      const data = JSON.parse(fs.readFileSync(benchmarksPath, 'utf8'));
      return {
        fetchedAt: data.fetchedAt || new Date().toISOString(),
        sources: {
          openrouter: true,
          artificialAnalysis: Boolean(process.env.ARTIFICIAL_ANALYSIS_API_KEY)
        },
        totalModels: data.totalModels || (data.models ? data.models.length : 25),
        freeModelsCount: data.freeModelsCount || 20,
        models: data.models || [],
        lastCachedTimestamp: Date.now()
      };
    }
  } catch (err) {
    console.warn('[SERVER] Could not read benchmarks.json:', err);
  }

  return {
    fetchedAt: new Date().toISOString(),
    sources: { openrouter: false, artificialAnalysis: false },
    totalModels: 0,
    freeModelsCount: 0,
    models: [],
    lastCachedTimestamp: Date.now()
  };
}

// Fetch with retry & backoff
async function fetchWithRetry(url: string, headers: Record<string, string> = {}, retries = 2, delayMs = 1000): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) {
        const bodyText = await res.text().catch(() => '');
        const err = new Error(`HTTP ${res.status}: ${bodyText}`);
        (err as any).status = res.status;
        throw err;
      }
      return await res.json();
    } catch (err: any) {
      if (err?.status === 401 || err?.status === 403) {
        throw err;
      }
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt - 1)));
    }
  }
}

// Refresh benchmarks logic
async function refreshBenchmarks(): Promise<CachedBenchmarks> {
  const AA_API_KEY = process.env.ARTIFICIAL_ANALYSIS_API_KEY;
  let openrouterSuccess = false;
  let aaSuccess = false;

  // 1. Fetch OpenRouter Models
  let openRouterModelsList: any[] = [];
  try {
    const openRouterRes = await fetchWithRetry('https://openrouter.ai/api/v1/models');
    if (Array.isArray(openRouterRes?.data)) {
      openRouterModelsList = openRouterRes.data;
      openrouterSuccess = true;
    }
  } catch (err: any) {
    console.warn('[SERVER] OpenRouter fetch notice:', err.message);
  }

  const openRouterById = new Map<string, any>();
  let freeCount = 0;
  for (const m of openRouterModelsList) {
    openRouterById.set(m.id, m);
    const pPrompt = parseFloat(m.pricing?.prompt || '-1');
    const pCompletion = parseFloat(m.pricing?.completion || '-1');
    if (pPrompt === 0 && pCompletion === 0) {
      freeCount++;
    }
  }

  // 2. Fetch Artificial Analysis models if key present
  let aaModelsList: any[] = [];
  if (AA_API_KEY) {
    try {
      const aaRes = await fetchWithRetry('https://artificialanalysis.ai/api/v2/language/models', {
        'x-api-key': AA_API_KEY
      });
      aaModelsList = Array.isArray(aaRes) ? aaRes : (aaRes?.models || aaRes?.data || []);
      aaSuccess = true;
    } catch (err: any) {
      if (err?.status === 403) {
        console.log('[SERVER] Artificial Analysis returned Free tier (language model endpoints require Pro). Retaining verified baseline.');
      } else {
        console.warn('[SERVER] AA API notice:', err.message);
      }
    }
  }

  const aaBySlug = new Map<string, any>();
  for (const item of aaModelsList) {
    if (item.slug) aaBySlug.set(item.slug, item);
  }

  // Read existing baseline snapshot
  const baseline = loadBundledSnapshot();
  const baselineById = new Map<string, LiveModel>();
  for (const m of baseline.models) {
    baselineById.set(m.id, m);
  }

  // Merge models via modelAliases
  const normalizedModels: LiveModel[] = [];
  for (const alias of MODEL_ALIASES) {
    const orRecord = openRouterById.get(alias.openRouterId);
    const aaRecord = aaBySlug.get(alias.aaSlug);
    const prev = baselineById.get(alias.openRouterId);

    let priceIn = prev?.priceInPerM ?? 0;
    let priceOut = prev?.priceOutPerM ?? 0;
    let isFree = prev?.isFree ?? false;
    let contextLen = prev?.contextLength ?? 128000;

    if (orRecord?.pricing) {
      const pIn = parseFloat(orRecord.pricing.prompt || '-1') * 1000000;
      const pOut = parseFloat(orRecord.pricing.completion || '-1') * 1000000;
      if (pIn >= 0) priceIn = Math.round(pIn * 100) / 100;
      if (pOut >= 0) priceOut = Math.round(pOut * 100) / 100;
      isFree = priceIn === 0 && priceOut === 0;
      if (orRecord.context_length) contextLen = orRecord.context_length;
    }

    const intel = aaRecord?.evaluations?.artificial_analysis_intelligence_index ?? prev?.intelligenceIndex;
    const speed = aaRecord?.performance_v3?.mean_output_tokens_per_second ?? prev?.outputTokensPerSec;

    normalizedModels.push({
      id: alias.openRouterId,
      name: alias.displayName,
      creator: alias.creator,
      intelligenceIndex: intel !== undefined && intel !== null ? Math.round(intel * 10) / 10 : (prev?.intelligenceIndex ?? null),
      codingIndex: prev?.codingIndex ?? null,
      agenticIndex: prev?.agenticIndex ?? null,
      outputTokensPerSec: speed !== undefined && speed !== null ? Math.round(speed * 10) / 10 : (prev?.outputTokensPerSec ?? null),
      ttftSec: prev?.ttftSec ?? null,
      priceInPerM: priceIn,
      priceOutPerM: priceOut,
      contextLength: contextLen,
      isFree,
      toolSlug: alias.toolSlug
    });
  }

  const result: CachedBenchmarks = {
    fetchedAt: new Date().toISOString(),
    sources: {
      openrouter: openrouterSuccess,
      artificialAnalysis: aaSuccess
    },
    totalModels: normalizedModels.length > 0 ? normalizedModels.length : baseline.totalModels,
    freeModelsCount: freeCount > 0 ? freeCount : baseline.freeModelsCount,
    models: normalizedModels.length > 0 ? normalizedModels : baseline.models,
    lastCachedTimestamp: Date.now()
  };

  return result;
}

// Route: GET /api/benchmarks with 3-hour cache & stale-while-revalidate
app.get('/api/benchmarks', async (req, res) => {
  const now = Date.now();

  // 1. Cold start initialize
  if (!benchmarkCache) {
    benchmarkCache = loadBundledSnapshot();
    // Trigger async background refresh
    if (!isRefreshing) {
      isRefreshing = true;
      refreshBenchmarks()
        .then((fresh) => {
          benchmarkCache = fresh;
        })
        .catch((e) => console.warn('[SERVER] Async refresh error:', e))
        .finally(() => {
          isRefreshing = false;
        });
    }
    return res.json({
      fetchedAt: benchmarkCache.fetchedAt,
      sources: benchmarkCache.sources,
      totalModels: benchmarkCache.totalModels,
      freeModelsCount: benchmarkCache.freeModelsCount,
      models: benchmarkCache.models
    });
  }

  // 2. Stale-while-revalidate check
  const isStale = now - benchmarkCache.lastCachedTimestamp > CACHE_DURATION_MS;
  if (isStale && !isRefreshing) {
    isRefreshing = true;
    refreshBenchmarks()
      .then((fresh) => {
        benchmarkCache = fresh;
      })
      .catch((e) => console.warn('[SERVER] Stale refresh error:', e))
      .finally(() => {
        isRefreshing = false;
      });
  }

  // Serve currently cached data instantly
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=7200');
  return res.json({
    fetchedAt: benchmarkCache.fetchedAt,
    sources: benchmarkCache.sources,
    totalModels: benchmarkCache.totalModels,
    freeModelsCount: benchmarkCache.freeModelsCount,
    models: benchmarkCache.models
  });
});

// Route: Contact Form Dispatcher
app.all('/api/contact', async (req, res) => {
  return contactHandler(req, res);
});

// Route: Newsletter Subscription Dispatcher
app.all('/api/newsletter-subscribe', async (req, res) => {
  return newsletterHandler(req, res);
});

// Dynamic /robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\n\nSitemap: ${APP_URL}/sitemap.xml\n`);
});

// Dynamic /sitemap.xml fallback
app.get('/sitemap.xml', (req, res) => {
  const sitemapPath = path.resolve(__dirname, 'dist/sitemap.xml');
  const publicSitemap = path.resolve(__dirname, 'public/sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    return res.sendFile(sitemapPath);
  }
  if (fs.existsSync(publicSitemap)) {
    return res.sendFile(publicSitemap);
  }
  res.status(404).send('Sitemap not found');
});

// Serve frontend assets
async function startServer() {
  if (!isProd) {
    // Development mode: Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve prerendered static assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath, { index: false }));

    app.get('*', (req, res) => {
      // 1. Check if prerendered HTML file exists for this route (e.g. dist/tools/cursor/index.html)
      const cleanPath = req.path.replace(/^\/|\/$/g, '');
      const potentialFile = path.resolve(distPath, cleanPath, 'index.html');
      if (cleanPath && fs.existsSync(potentialFile)) {
        return res.sendFile(potentialFile);
      }

      // 2. Root index
      const rootIndex = path.resolve(distPath, 'index.html');
      if (fs.existsSync(rootIndex)) {
        return res.sendFile(rootIndex);
      }

      // 3. Fallback 404
      const notFoundFile = path.resolve(distPath, '404.html');
      if (fs.existsSync(notFoundFile)) {
        return res.status(404).sendFile(notFoundFile);
      }
      return res.status(404).send('Page not found');
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] AI Finder Technologies server running on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[SERVER FATAL ERROR]', err);
  process.exit(1);
});
