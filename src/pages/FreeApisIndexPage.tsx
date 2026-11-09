import React, { useState, useMemo } from 'react';
import { ShieldCheck, ExternalLink, ArrowRight, CreditCard, Check, X, Sparkles, Database, Terminal, Search, Key, HelpCircle } from 'lucide-react';
import { FREE_API_PROVIDERS } from '../data/freeApis.ts';
import { FreeApiProvider } from '../types/index.ts';

interface FreeApisIndexPageProps {
  onNavigate: (path: string) => void;
  onSelectProvider: (id: string) => void;
}

export const FreeApisIndexPage: React.FC<FreeApisIndexPageProps> = ({
  onNavigate,
  onSelectProvider
}) => {
  const [search, setSearch] = useState('');
  const [filterCard, setFilterCard] = useState<'all' | 'no-card'>('all');
  const [filterOpenAi, setFilterOpenAi] = useState(false);

  // Split providers into LLM Inference and Data APIs
  const { inferenceProviders, dataApiProviders } = useMemo(() => {
    const inf: FreeApiProvider[] = [];
    const data: FreeApiProvider[] = [];

    FREE_API_PROVIDERS.forEach((p) => {
      // Search query filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.bestFor.toLowerCase().includes(q) ||
          p.freeTierSummary.toLowerCase().includes(q) ||
          p.envVarName.toLowerCase().includes(q);
        if (!matches) return;
      }

      // Credit card filter
      if (filterCard === 'no-card' && p.creditCardRequired !== 'no') return;

      // OpenAI compatible filter
      if (filterOpenAi && !p.openAiCompatible) return;

      if (p.isDataApi) {
        data.push(p);
      } else {
        inf.push(p);
      }
    });

    return { inferenceProviders: inf, dataApiProviders: data };
  }, [search, filterCard, filterOpenAi]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5">
        <button onClick={() => onNavigate('/')} className="hover:text-slate-900 dark:hover:text-white">
          Home
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-white font-medium">Free AI API Keys Hub</span>
      </nav>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <Key className="w-3.5 h-3.5" />
          <span>Zero-Cost Developer Inference Catalog</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Legitimate Free AI APIs & Key Setup Guides
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Learn how to get <strong className="text-slate-900 dark:text-white font-semibold">your own official free API keys</strong> directly from legitimate AI providers. No shared keys, no leaked accounts, and zero credit card required for most tiers. Verified against official documentation as of March 2026.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search providers (Gemini, Groq, Llama, OpenAI-compatible)..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5BFF] text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>

        {/* Quick Filter Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setFilterCard((prev) => (prev === 'no-card' ? 'all' : 'no-card'))}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              filterCard === 'no-card'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>No Credit Card ({filterCard === 'no-card' ? 'Active' : 'Show All'})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterOpenAi((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              filterOpenAi
                ? 'bg-blue-50 text-[#2F5BFF] dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>OpenAI Compatible SDK</span>
          </button>
        </div>
      </div>

      {/* Section 1: LLM Inference Providers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Model Inference & Generation APIs ({inferenceProviders.length})
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {inferenceProviders.length} verified providers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inferenceProviders.map((provider) => (
            <div
              key={provider.id}
              onClick={() => onSelectProvider(provider.id)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#2F5BFF] rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-[#2F5BFF] transition-colors">
                      {provider.name}
                    </h3>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      Env: <code className="text-[#2F5BFF]">{provider.envVarName}</code>
                    </div>
                  </div>

                  {/* Verified Badge */}
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex-shrink-0">
                    Verified {provider.lastVerified.slice(5)}
                  </span>
                </div>

                {/* Best for */}
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {provider.bestFor}
                </p>

                {/* Free Tier Summary */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <div className="text-[10px] uppercase font-mono font-bold text-slate-400">
                    Official Free Tier Policy
                  </div>
                  <p className="line-clamp-2 text-[11px] leading-relaxed">
                    {provider.freeTierSummary}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${
                    provider.creditCardRequired === 'no'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  }`}>
                    <CreditCard className="w-3 h-3" />
                    <span>{provider.creditCardRequired === 'no' ? 'No Credit Card' : 'Credit Card Req.'}</span>
                  </span>

                  {provider.openAiCompatible && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-[#2F5BFF] dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      <Terminal className="w-3 h-3" />
                      <span>OpenAI SDK Drop-in</span>
                    </span>
                  )}
                </div>
              </div>

              {/* View 6-Step Guide CTA */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#2F5BFF] group-hover:translate-x-0.5 transition-transform">
                <span>View 6-Step Setup Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Public Data APIs (Zero Key Needed) */}
      <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-[#2F5BFF]" />
              <span>Public AI Data APIs (Catalog & Benchmarks)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              REST APIs that provide live model pricing, context lengths, and benchmark intelligence metrics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dataApiProviders.map((provider) => (
            <div
              key={provider.id}
              onClick={() => onSelectProvider(provider.id)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#2F5BFF] rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-[#2F5BFF] transition-colors">
                      {provider.name}
                    </h3>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">
                      {provider.baseUrl}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-50 text-[#2F5BFF] dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    Data API
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {provider.bestFor}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  <div className="text-[10px] uppercase font-mono font-bold text-slate-400 mb-0.5">
                    Usage Policy
                  </div>
                  <p className="text-[11px]">{provider.freeTierSummary}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#2F5BFF]">
                <span>View Programmatic Code Examples</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
