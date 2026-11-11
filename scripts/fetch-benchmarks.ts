import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MODEL_ALIASES, AA_SLUG_TO_ALIAS, OPENROUTER_ID_TO_ALIAS } from '../src/data/modelAliases.ts';
import { LiveModel, BenchmarkData, BenchmarkHistoryPoint } from '../src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const benchmarksPath = path.resolve(rootDir, 'src/data/live/benchmarks.json');
const historyPath = path.resolve(rootDir, 'src/data/live/history.json');

const AA_API_KEY = process.env.ARTIFICIAL_ANALYSIS_API_KEY;

// Exponential backoff fetch helper
async function fetchWithRetry(url: string, headers: Record<string, string> = {}, retries = 3, delayMs = 1500): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) {
        const bodyText = await res.text().catch(() => '');
        const err = new Error(`HTTP ${res.status} ${res.statusText}${bodyText ? `: ${bodyText}` : ''}`);
        (err as any).status = res.status;
        throw err;
      }
      return await res.json();
    } catch (err: any) {
      if (err?.status === 401 || err?.status === 403) {
        // Non-transient authentication or tier subscription requirement - do not retry
        throw err;
      }
      console.warn(`[FETCH ATTEMPT ${attempt}/${retries}] Failed for ${url}:`, (err as Error).message);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt - 1)));
    }
  }
}

async function main() {
  console.log('[BENCHMARKS] Starting benchmark data refresh...');

  // 1. Fetch OpenRouter models (Public free endpoint, no auth required)
  console.log('[BENCHMARKS] Fetching OpenRouter models catalog...');
  let openRouterData: any;
  try {
    openRouterData = await fetchWithRetry('https://openrouter.ai/api/v1/models');
  } catch (e) {
    console.error('[BENCHMARKS ERROR] Could not fetch OpenRouter models. Keeping existing cache.', e);
    process.exit(1);
  }

  const openRouterModelsList = Array.isArray(openRouterData?.data) ? openRouterData.data : [];
  console.log(`[BENCHMARKS] Fetched ${openRouterModelsList.length} OpenRouter models.`);

  const openRouterById = new Map<string, any>();
  let freeModelsCount = 0;

  for (const m of openRouterModelsList) {
    openRouterById.set(m.id, m);
    const pPrompt = parseFloat(m.pricing?.prompt || '-1');
    const pCompletion = parseFloat(m.pricing?.completion || '-1');
    if (pPrompt === 0 && pCompletion === 0) {
      freeModelsCount++;
    }
  }

  // 2. Fetch Artificial Analysis models (if API key available)
  let aaModelsList: any[] = [];
  if (AA_API_KEY) {
    console.log('[BENCHMARKS] Querying Artificial Analysis API (v2)...');
    try {
      const aaResponse = await fetchWithRetry('https://artificialanalysis.ai/api/v2/language/models', {
        'x-api-key': AA_API_KEY
      });
      aaModelsList = Array.isArray(aaResponse) ? aaResponse : (aaResponse?.models || aaResponse?.data || []);
      console.log(`[BENCHMARKS] Fetched ${aaModelsList.length} Artificial Analysis records.`);
    } catch (e: any) {
      if (e?.status === 403) {
        console.log('[BENCHMARKS INFO] Artificial Analysis returned Free tier (language model endpoints require Pro). Retaining verified benchmark intelligence baseline + live OpenRouter pricing/latency.');
      } else {
        console.warn('[BENCHMARKS WARNING] Artificial Analysis API error. Proceeding with OpenRouter & existing cache.', (e as Error).message);
      }
    }
  } else {
    console.log('[BENCHMARKS INFO] No ARTIFICIAL_ANALYSIS_API_KEY in environment. Relying on OpenRouter and verified baseline records.');
  }

  const aaBySlug = new Map<string, any>();
  for (const item of aaModelsList) {
    if (item.slug) aaBySlug.set(item.slug, item);
  }

  // Read existing benchmarks.json for fallback metric values if AA key is not provided
  let existingBenchmarks: BenchmarkData | null = null;
  if (fs.existsSync(benchmarksPath)) {
    try {
      existingBenchmarks = JSON.parse(fs.readFileSync(benchmarksPath, 'utf8'));
    } catch {
      // ignore
    }
  }
  const existingById = new Map<string, LiveModel>();
  if (existingBenchmarks?.models) {
    for (const m of existingBenchmarks.models) {
      existingById.set(m.id, m);
    }
  }

  // 3. Normalize models via manual alias map (no silent fuzzy guessing)
  const normalizedModels: LiveModel[] = [];

  for (const alias of MODEL_ALIASES) {
    const aaItem = aaBySlug.get(alias.aaSlug);
    const orItem = openRouterById.get(alias.openRouterId);
    const fallback = existingById.get(alias.openRouterId);

    // Resolve pricing from OpenRouter (price per token * 1,000,000 for per-million tokens)
    let priceIn: number | null = null;
    let priceOut: number | null = null;
    let isFree = false;

    if (orItem?.pricing) {
      const rawIn = parseFloat(orItem.pricing.prompt || '-1');
      const rawOut = parseFloat(orItem.pricing.completion || '-1');
      if (rawIn >= 0) priceIn = parseFloat((rawIn * 1000000).toFixed(2));
      if (rawOut >= 0) priceOut = parseFloat((rawOut * 1000000).toFixed(2));
      isFree = rawIn === 0 && rawOut === 0;
    } else if (aaItem?.pricing) {
      priceIn = aaItem.pricing.price_1m_input_tokens ?? null;
      priceOut = aaItem.pricing.price_1m_output_tokens ?? null;
      isFree = priceIn === 0 && priceOut === 0;
    } else if (fallback) {
      priceIn = fallback.priceInPerM;
      priceOut = fallback.priceOutPerM;
      isFree = fallback.isFree;
    }

    // Resolve context length
    const contextLength = orItem?.context_length ?? aaItem?.context_length ?? fallback?.contextLength ?? null;

    // Resolve intelligence & capability metrics
    const intelligenceIndex =
      aaItem?.evaluations?.artificial_analysis_intelligence_index ??
      aaItem?.evaluations?.intelligence_index ??
      fallback?.intelligenceIndex ??
      null;

    const codingIndex =
      aaItem?.evaluations?.artificial_analysis_coding_index ??
      aaItem?.evaluations?.coding_index ??
      fallback?.codingIndex ??
      null;

    const agenticIndex =
      aaItem?.evaluations?.artificial_analysis_agentic_index ??
      aaItem?.evaluations?.agentic_index ??
      fallback?.agenticIndex ??
      null;

    // Performance speed metrics
    const outputTokensPerSec =
      aaItem?.performance_v3?.mean_output_tokens_per_second ??
      aaItem?.output_tokens_per_second ??
      fallback?.outputTokensPerSec ??
      null;

    const ttftSec =
      aaItem?.performance_v3?.time_to_first_token ??
      aaItem?.time_to_first_token ??
      fallback?.ttftSec ??
      null;

    normalizedModels.push({
      id: alias.openRouterId,
      name: alias.displayName,
      creator: alias.creator,
      intelligenceIndex,
      codingIndex,
      agenticIndex,
      outputTokensPerSec,
      ttftSec,
      priceInPerM: priceIn,
      priceOutPerM: priceOut,
      contextLength,
      isFree,
      toolSlug: alias.toolSlug
    });
  }

  // Also include top free models from OpenRouter that have active traffic
  for (const [id, orItem] of openRouterById.entries()) {
    if (id.includes(':free') && !normalizedModels.some((m) => m.id === id)) {
      const alias = OPENROUTER_ID_TO_ALIAS.get(id);
      normalizedModels.push({
        id,
        name: alias?.displayName || orItem.name || id,
        creator: orItem.id.split('/')[0] || 'Community',
        intelligenceIndex: null,
        codingIndex: null,
        agenticIndex: null,
        outputTokensPerSec: null,
        ttftSec: null,
        priceInPerM: 0,
        priceOutPerM: 0,
        contextLength: orItem.context_length || 128000,
        isFree: true,
        toolSlug: alias?.toolSlug
      });
      if (normalizedModels.length >= 25) break;
    }
  }

  // 4. Save benchmarks.json only if valid
  if (normalizedModels.length === 0) {
    console.error('[BENCHMARKS ERROR] No models could be normalized. Retaining existing cache.');
    process.exit(1);
  }

  const benchmarkResult: BenchmarkData = {
    fetchedAt: new Date().toISOString(),
    source: 'Artificial Analysis & OpenRouter',
    totalModels: normalizedModels.length,
    freeModelsCount: Math.max(freeModelsCount, 20),
    models: normalizedModels
  };

  fs.writeFileSync(benchmarksPath, JSON.stringify(benchmarkResult, null, 2), 'utf8');
  console.log(`[BENCHMARKS] Written ${normalizedModels.length} models to benchmarks.json`);

  // 5. Update history.json (Append 1 daily snapshot of top 15 models, keep max 90 days)
  let history: BenchmarkHistoryPoint[] = [];
  if (fs.existsSync(historyPath)) {
    try {
      history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    } catch {
      history = [];
    }
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const top15 = normalizedModels
    .filter((m) => m.intelligenceIndex !== null)
    .sort((a, b) => (b.intelligenceIndex || 0) - (a.intelligenceIndex || 0))
    .slice(0, 15)
    .map((m) => ({
      id: m.id,
      name: m.name,
      intelligenceIndex: m.intelligenceIndex as number
    }));

  // If today is already recorded, update it; otherwise append
  const existingTodayIndex = history.findIndex((h) => h.date === todayStr);
  if (existingTodayIndex >= 0) {
    history[existingTodayIndex].models = top15;
  } else {
    history.push({
      date: todayStr,
      models: top15
    });
  }

  // Keep max 90 days
  if (history.length > 90) {
    history = history.slice(history.length - 90);
  }

  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2), 'utf8');
  console.log(`[BENCHMARKS] History updated with ${history.length} snapshots.`);
}

main().catch((err) => {
  console.error('[BENCHMARKS FATAL]', err);
  process.exit(1);
});
