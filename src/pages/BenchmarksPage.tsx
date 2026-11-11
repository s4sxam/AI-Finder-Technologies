import React, { useState, useEffect } from 'react';
import { ShieldCheck, ExternalLink, ArrowRight, Activity, Zap, Cpu, Award, Sparkles, Filter, KeyRound } from 'lucide-react';
import benchmarksFallback from '../data/live/benchmarks.json';
import historyData from '../data/live/history.json';
import { AI_TOOLS } from '../data/tools.ts';
import { AnimatedBarRace } from '../components/charts/AnimatedBarRace.tsx';
import { PriceVsIntelligenceScatter } from '../components/charts/PriceVsIntelligenceScatter.tsx';
import { SpeedVsQualityQuadrant } from '../components/charts/SpeedVsQualityQuadrant.tsx';
import { HistoryLines } from '../components/charts/HistoryLines.tsx';
import { FreeModelsCounter } from '../components/charts/FreeModelsCounter.tsx';
import { CapabilityHeatmap } from '../components/charts/CapabilityHeatmap.tsx';
import { TaskToolSelector } from '../components/TaskToolSelector.tsx';
import { Tool, LiveModel } from '../types/index.ts';

interface BenchmarksPageProps {
  onNavigate: (path: string) => void;
  tools?: Tool[];
}

function formatRelativeTime(isoDate: string): string {
  try {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) {
      const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
      return `Updated ${diffMins}m ago`;
    }
    if (diffHrs < 24) {
      return `Updated ${diffHrs}h ago`;
    }
    return `Showing data from ${new Date(isoDate).toLocaleDateString()}`;
  } catch {
    return 'Recently updated';
  }
}

export const BenchmarksPage: React.FC<BenchmarksPageProps> = ({
  onNavigate,
  tools = AI_TOOLS
}) => {
  const [models, setModels] = useState<LiveModel[]>(benchmarksFallback.models as LiveModel[] || []);
  const [fetchedAt, setFetchedAt] = useState<string>(benchmarksFallback.fetchedAt || new Date().toISOString());
  const [freeModelsCount, setFreeModelsCount] = useState<number>(benchmarksFallback.freeModelsCount || 20);
  const [sources, setSources] = useState<{ openrouter: boolean; artificialAnalysis: boolean }>({
    openrouter: true,
    artificialAnalysis: true
  });

  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);

  // Client-side fetch to /api/benchmarks with stale-while-revalidate
  useEffect(() => {
    let isMounted = true;
    fetch('/api/benchmarks')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (isMounted && data?.models?.length > 0) {
          setModels(data.models);
          if (data.fetchedAt) setFetchedAt(data.fetchedAt);
          if (data.freeModelsCount) setFreeModelsCount(data.freeModelsCount);
          if (data.sources) setSources(data.sources);
          setIsUsingFallback(false);
        }
      })
      .catch((err) => {
        console.warn('Using bundled benchmarks fallback:', err.message);
        if (isMounted) setIsUsingFallback(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const relativeTime = formatRelativeTime(fetchedAt);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5">
        <button onClick={() => onNavigate('/')} className="hover:text-slate-900 dark:hover:text-white">
          Home
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-white font-medium">Live Benchmarks</span>
      </nav>

      {/* Header Banner */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-blue-50 text-[#2F5BFF] dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Activity className="w-3.5 h-3.5" />
            <span>Frontier Model Evaluations &amp; Economic Benchmarks</span>
          </div>

          <div className="flex items-center gap-2">
            {isUsingFallback ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Using bundled data, last updated {new Date(fetchedAt).toLocaleDateString()}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{relativeTime}</span>
              </span>
            )}
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Frontier AI Model Intelligence &amp; Speed Benchmarks
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Real-world comparative data across reasoning indexes, coding agility, latency speed (tokens/sec), and token pricing economics. Refreshed continuously from <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-[#2F5BFF] underline font-medium">OpenRouter</a> and <a href="https://artificialanalysis.ai" target="_blank" rel="noopener noreferrer" className="text-[#2F5BFF] underline font-medium">Artificial Analysis</a> without sponsored ranking bias.
        </p>
      </div>

      {/* Sub-banner if Artificial Analysis key is not activated */}
      {!sources.artificialAnalysis && (
        <div className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-2.5 text-blue-900 dark:text-blue-200">
            <KeyRound className="w-4 h-4 text-[#2F5BFF] shrink-0 mt-0.5 sm:mt-0" />
            <span>
              Unlock live automated speed and intelligence updates: add <code className="font-mono bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded text-[11px]">ARTIFICIAL_ANALYSIS_API_KEY</code> in Settings &gt; Secrets (free key at <a href="https://artificialanalysis.ai/account" target="_blank" rel="noopener noreferrer" className="underline font-semibold">artificialanalysis.ai/account</a>).
            </span>
          </div>
          <a
            href="https://artificialanalysis.ai/account"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#2F5BFF] hover:underline shrink-0"
          >
            <span>Get Free Key</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Zero Cost APIs Banner */}
      <FreeModelsCounter
        count={freeModelsCount}
        onExploreFree={() => onNavigate('/free-apis')}
      />

      {/* Interactive Charts Grid */}
      <div className="space-y-8">
        {/* Chart 1: Animated Bar Race */}
        <AnimatedBarRace
          models={models}
          updatedAt={fetchedAt}
          onSelectTool={(slug) => onNavigate(`/tools/${slug}`)}
        />

        {/* Chart 2 & 3: Scatter & Quadrant in 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PriceVsIntelligenceScatter
            models={models}
            updatedAt={fetchedAt}
            onSelectTool={(slug) => onNavigate(`/tools/${slug}`)}
          />
          <SpeedVsQualityQuadrant
            models={models}
            updatedAt={fetchedAt}
            onSelectTool={(slug) => onNavigate(`/tools/${slug}`)}
          />
        </div>

        {/* Chart 4: Historical Time-Series Trajectory */}
        <HistoryLines
          history={historyData}
          updatedAt={fetchedAt}
          onSelectTool={(slug) => onNavigate(`/tools/${slug}`)}
        />

        {/* Phase 5: "I want to ___" selector */}
        <TaskToolSelector
          tools={tools}
          onSelectTool={(slug) => onNavigate(`/tools/${slug}`)}
        />

        {/* Phase 5: Full Cross-Discipline Capability Heatmap */}
        <CapabilityHeatmap
          tools={tools}
          onSelectTool={(slug) => onNavigate(`/tools/${slug}`)}
          limit={40}
        />
      </div>

      {/* Detailed Methodology & Attribution Section */}
      <div className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Evaluation Methodology &amp; Attribution Standards</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              1. Intelligence &amp; Speed Metrics
            </h4>
            <p>
              Composite evaluations benchmarked across MMLU-Pro, GPQA, and coding evaluations. Output speed is measured in mean generated tokens per second under concurrent production workloads. Attributed to <a href="https://artificialanalysis.ai" target="_blank" rel="noopener noreferrer" className="text-[#2F5BFF] underline font-medium">Artificial Analysis</a>.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              2. Token Economics &amp; Free Tier
            </h4>
            <p>
              Prices reflect public API rates fetched directly from the <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-[#2F5BFF] underline font-medium">OpenRouter</a> models catalog. Blended price represents the average cost of 500k input tokens + 500k output tokens. Models with prompt &amp; completion cost of $0 are cataloged as free tier.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              3. Independent Editorial Integrity
            </h4>
            <p>
              No provider can pay for benchmark placement or artificial index inflation. Data is cached in-memory on our server for 3 hours with stale-while-revalidate and backed by automated background refresh.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            Attribution: Data and methodology provided by <a href="https://artificialanalysis.ai" target="_blank" rel="noopener noreferrer" className="text-[#2F5BFF] font-medium hover:underline">Artificial Analysis</a> and <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-[#2F5BFF] font-medium hover:underline">OpenRouter</a>.
          </div>
          <button
            onClick={() => onNavigate('/tools')}
            className="inline-flex items-center gap-1 font-semibold text-[#2F5BFF] hover:underline"
          >
            <span>Explore 60+ Directory Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
