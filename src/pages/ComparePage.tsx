import React, { useState } from 'react';
import { GitCompare, ExternalLink, Star, ShieldCheck, Plus, X, ArrowRight } from 'lucide-react';
import { AI_TOOLS } from '../data/tools';
import { Tool } from '../types';

interface ComparePageProps {
  onNavigate: (path: string) => void;
  onSelectTool: (slug: string) => void;
  initialToolSlugs?: string[];
}

export const ComparePage: React.FC<ComparePageProps> = ({
  onNavigate,
  onSelectTool,
  initialToolSlugs = ['cursor', 'github-copilot']
}) => {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() => {
    // Check URL query param first
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const toolsParam = urlParams.get('tools');
      if (toolsParam) {
        const parsed = toolsParam.split(',').filter(Boolean).slice(0, 3);
        if (parsed.length > 0) return parsed;
      }
    }
    return initialToolSlugs.length > 0 ? initialToolSlugs : ['cursor', 'github-copilot'];
  });

  const updateUrlWithSlugs = (slugs: string[]) => {
    if (typeof window !== 'undefined') {
      const newSearch = slugs.length > 0 ? `?tools=${slugs.join(',')}` : '';
      window.history.replaceState({}, '', `/compare${newSearch}`);
    }
  };

  const selectedTools = selectedSlugs
    .map((s) => AI_TOOLS.find((t) => t.slug === s))
    .filter((t): t is Tool => !!t);

  const handleAddTool = (slug: string) => {
    if (!selectedSlugs.includes(slug) && selectedSlugs.length < 3) {
      const next = [...selectedSlugs, slug];
      setSelectedSlugs(next);
      updateUrlWithSlugs(next);
    }
  };

  const handleRemoveTool = (slug: string) => {
    const next = selectedSlugs.filter((s) => s !== slug);
    setSelectedSlugs(next);
    updateUrlWithSlugs(next);
  };

  const unselectedTools = AI_TOOLS.filter((t) => !selectedSlugs.includes(t.slug));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 flex items-center gap-1.5">
        <button onClick={() => onNavigate('/')} className="hover:text-slate-900 dark:hover:text-white">
          Home
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-white font-medium">Head-to-Head Compare Matrix</span>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Tool Comparison Workbench
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Select up to 3 AI applications to analyze architectural strengths, pricing models, platform compatibility, and key limitations side by side.
        </p>
      </div>

      {/* Tool Selector Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">Active Comparison:</span>
            <span className="text-slate-500">({selectedTools.length}/3 tools)</span>
          </div>

          {selectedTools.length < 3 && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Add tool:</span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddTool(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="py-1 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-200"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a tool to add...
                </option>
                {unselectedTools.map((t) => (
                  <option key={t.id} value={t.slug}>
                    {t.name} ({t.category})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Selected Badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          {selectedTools.map((tool) => (
            <div
              key={tool.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            >
              <div
                className="w-4 h-4 rounded text-[10px] font-bold text-white flex items-center justify-center"
                style={{ backgroundColor: tool.accentColor }}
              >
                {tool.monogram}
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">{tool.name}</span>
              <button
                onClick={() => handleRemoveTool(tool.slug)}
                className="text-slate-400 hover:text-rose-500 p-0.5 ml-1"
                aria-label={`Remove ${tool.name}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      {selectedTools.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                  <th className="py-4 px-5 font-semibold text-slate-400 uppercase tracking-wider text-[11px] w-1/4">
                    Dimension
                  </th>
                  {selectedTools.map((t) => (
                    <th key={t.id} className="py-4 px-5 w-1/3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-xs"
                          style={{ backgroundColor: t.accentColor }}
                        >
                          {t.monogram}
                        </div>
                        <div>
                          <div className="font-bold text-base text-slate-900 dark:text-white">
                            {t.name}
                          </div>
                          <div className="text-[11px] text-slate-500 capitalize">{t.category}</div>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {/* Score & Rating */}
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-slate-500">Benchmark Rating</td>
                  {selectedTools.map((t) => (
                    <td key={t.id} className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {t.rating.toFixed(1)}
                        </span>
                        <span className="text-slate-400">({t.reviewCount.toLocaleString()} reviews)</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Pricing Model */}
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-slate-500">Pricing &amp; Cost</td>
                  {selectedTools.map((t) => (
                    <td key={t.id} className="py-3.5 px-5">
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{t.pricing}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {t.pricingDetails}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Best For */}
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-slate-500">Target User</td>
                  {selectedTools.map((t) => (
                    <td key={t.id} className="py-3.5 px-5 text-slate-700 dark:text-slate-300 leading-relaxed">
                      {t.bestFor}
                    </td>
                  ))}
                </tr>

                {/* Platforms */}
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-slate-500">Platform Support</td>
                  {selectedTools.map((t) => (
                    <td key={t.id} className="py-3.5 px-5">
                      <div className="flex flex-wrap gap-1">
                        {t.platforms.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-0.5 text-[11px] bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Key Features */}
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-slate-500 align-top">Architectural Features</td>
                  {selectedTools.map((t) => (
                    <td key={t.id} className="py-3.5 px-5 align-top">
                      <ul className="space-y-1.5">
                        {t.keyFeatures.map((f, i) => (
                          <li key={i} className="text-slate-600 dark:text-slate-300 flex items-start gap-1.5 leading-relaxed">
                            <span className="text-[#2F5BFF] font-bold mt-0.5">•</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Pros */}
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-slate-500 align-top">Key Strengths</td>
                  {selectedTools.map((t) => (
                    <td key={t.id} className="py-3.5 px-5 align-top">
                      <ul className="space-y-1">
                        {t.pros.map((p, i) => (
                          <li key={i} className="text-slate-700 dark:text-slate-300 text-[11px] flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">+</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Cons */}
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-slate-500 align-top">Trade-offs</td>
                  {selectedTools.map((t) => (
                    <td key={t.id} className="py-3.5 px-5 align-top">
                      <ul className="space-y-1">
                        {t.cons.map((c, i) => (
                          <li key={i} className="text-slate-500 dark:text-slate-400 text-[11px] flex items-start gap-1.5">
                            <span className="text-rose-500 font-bold">-</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Action Buttons */}
                <tr>
                  <td className="py-4 px-5 font-semibold text-slate-500">Actions</td>
                  {selectedTools.map((t) => (
                    <td key={t.id} className="py-4 px-5">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => onSelectTool(t.slug)}
                          className="flex-1 py-1.5 px-3 text-xs font-semibold text-white bg-[#2F5BFF] hover:bg-[#1E46E6] rounded-md transition-colors text-center shadow-xs"
                        >
                          Deep Review
                        </button>
                        <a
                          href={t.websiteUrl}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1 py-1.5 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                        >
                          <span>Visit Site</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            No tools selected for comparison.
          </p>
          <p className="text-xs text-slate-500">
            Select tools from the dropdown above or check &quot;Compare&quot; on any tool card in the directory.
          </p>
        </div>
      )}
    </div>
  );
};
