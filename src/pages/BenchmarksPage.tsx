import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, ArrowRight, Activity, Zap, Cpu, Award, Sparkles, Filter } from 'lucide-react';
import benchmarksData from '../data/live/benchmarks.json';
import historyData from '../data/live/history.json';
import { AI_TOOLS } from '../data/tools.ts';
import { AnimatedBarRace } from '../components/charts/AnimatedBarRace.tsx';
import { PriceVsIntelligenceScatter } from '../components/charts/PriceVsIntelligenceScatter.tsx';
import { SpeedVsQualityQuadrant } from '../components/charts/SpeedVsQualityQuadrant.tsx';
import { HistoryLines } from '../components/charts/HistoryLines.tsx';
import { FreeModelsCounter } from '../components/charts/FreeModelsCounter.tsx';
import { CapabilityHeatmap } from '../components/charts/CapabilityHeatmap.tsx';
import { TaskToolSelector } from '../components/TaskToolSelector.tsx';
import { Tool } from '../types/index.ts';

interface BenchmarksPageProps {
  onNavigate: (path: string) => void;
  tools?: Tool[];
}

export const BenchmarksPage: React.FC<BenchmarksPageProps> = ({
  onNavigate,
  tools = AI_TOOLS
}) => {
  const models = benchmarksData.models || [];
  const fetchedAt = benchmarksData.fetchedAt;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5">
        <button onClick={() => onNavigate('/')} className="hover:text-slate-900 dark:hover:text-white">
          Home
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-white font-medium">Independent Benchmarks</span>
      </nav>

      {/* Header Banner */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-blue-50 text-[#2F5BFF] dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Activity className="w-3.5 h-3.5" />
            <span>Independent Live Evaluations & Performance Tracking</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Cron Refreshed Every 6 Hours
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Model Intelligence & Economic Benchmarks
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Real-world comparative data across reasoning indexes, coding agility, latency speed (tokens/sec), and token pricing economics. Sourced programmatically from <a href="https://artificialanalysis.ai" target="_blank" rel="noopener noreferrer" className="text-[#2F5BFF] underline font-medium">Artificial Analysis</a> and <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-[#2F5BFF] underline font-medium">OpenRouter</a> without editorial tampering.
        </p>
      </div>

      {/* Zero Cost APIs Banner */}
      <FreeModelsCounter
        count={benchmarksData.freeModelsCount || 24}
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
          limit={35}
        />
      </div>

      {/* Detailed Methodology & Attribution Section */}
      <div className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Evaluation Methodology & Attribution Standards</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              1. Intelligence & Speed Metrics
            </h4>
            <p>
              Data is drawn from <strong className="text-slate-800 dark:text-slate-200">Artificial Analysis</strong> independent benchmarks. The Intelligence Index synthesizes evaluations across MMLU-Pro, GPQA, and math benchmarks. Output speed is measured under concurrent production load.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              2. Token Economics & Free Tier
            </h4>
            <p>
              Prices reflect public API rates fetched directly from the <strong className="text-slate-800 dark:text-slate-200">OpenRouter</strong> models catalog. Blended price represents the average cost of 500k input tokens + 500k output tokens. Models with prompt & completion cost of $0 are cataloged as free tier.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              3. Independent Editorial Integrity
            </h4>
            <p>
              No provider can pay for benchmark placement or artificial index inflation. Data refreshes autonomously via GitHub Actions every 6 hours with automated change detection.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            Attribution: Byline & data provided by <a href="https://artificialanalysis.ai" target="_blank" rel="noopener noreferrer" className="text-[#2F5BFF] font-medium hover:underline">Artificial Analysis</a> and <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-[#2F5BFF] font-medium hover:underline">OpenRouter</a>.
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
