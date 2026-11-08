import React, { useState } from 'react';
import { X, GitCompare, ExternalLink, Check, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { Tool } from '../types';

interface ComparisonDrawerProps {
  selectedTools: Tool[];
  onRemoveTool: (toolId: string) => void;
  onClearAll: () => void;
  onSelectTool: (slug: string) => void;
}

export const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  selectedTools,
  onRemoveTool,
  onClearAll,
  onSelectTool
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (selectedTools.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Sticky Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-xl bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl p-3 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto min-w-0 py-0.5">
            <span className="text-xs font-semibold text-slate-300 whitespace-nowrap hidden sm:inline">
              Compare ({selectedTools.length}/3):
            </span>
            {selectedTools.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-xs whitespace-nowrap shrink-0"
              >
                <div
                  className="w-4 h-4 rounded text-[10px] font-bold text-white flex items-center justify-center"
                  style={{ backgroundColor: t.accentColor }}
                >
                  {t.monogram}
                </div>
                <span className="font-medium text-slate-200">{t.name}</span>
                <button
                  onClick={() => onRemoveTool(t.id)}
                  className="text-slate-400 hover:text-white p-0.5"
                  aria-label={`Remove ${t.name} from comparison`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClearAll}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-md transition-colors shadow-xs"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full-Screen Comparison Matrix Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden my-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2F5BFF]/10 text-[#2F5BFF] flex items-center justify-center">
                  <GitCompare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Side-by-Side Tool Comparison
                  </h2>
                  <p className="text-xs text-slate-500">
                    Comparing {selectedTools.length} tools across capabilities, pricing, and architecture.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                aria-label="Close comparison modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4 font-semibold text-slate-400 uppercase tracking-wider text-[11px] w-1/4">
                      Specification
                    </th>
                    {selectedTools.map((t) => (
                      <th key={t.id} className="py-3 px-4 w-1/4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold text-white shadow-xs"
                            style={{ backgroundColor: t.accentColor }}
                          >
                            {t.monogram}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-900 dark:text-white">
                              {t.name}
                            </div>
                            <div className="text-[11px] text-slate-500 capitalize">{t.category}</div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {/* Rating */}
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-500">Score & Rating</td>
                    {selectedTools.map((t) => (
                      <td key={t.id} className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-mono">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold">{t.rating.toFixed(1)}</span>
                          <span className="text-slate-400">({t.reviewCount.toLocaleString()} reviews)</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Pricing */}
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-500">Pricing Model</td>
                    {selectedTools.map((t) => (
                      <td key={t.id} className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{t.pricing}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{t.pricingDetails}</div>
                      </td>
                    ))}
                  </tr>

                  {/* Platforms */}
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-500">Platforms & IDEs</td>
                    {selectedTools.map((t) => (
                      <td key={t.id} className="py-3 px-4">
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

                  {/* Best For */}
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-500">Best For</td>
                    {selectedTools.map((t) => (
                      <td key={t.id} className="py-3 px-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                        {t.bestFor}
                      </td>
                    ))}
                  </tr>

                  {/* Key Features */}
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-500 align-top">Key Features</td>
                    {selectedTools.map((t) => (
                      <td key={t.id} className="py-3 px-4 align-top">
                        <ul className="space-y-1.5">
                          {t.keyFeatures.map((f, i) => (
                            <li key={i} className="text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                              <span className="text-[#2F5BFF] font-bold">•</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* Pros & Cons */}
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-500 align-top">Pros & Cons</td>
                    {selectedTools.map((t) => (
                      <td key={t.id} className="py-3 px-4 align-top space-y-3">
                        <div>
                          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                            Key Strengths:
                          </div>
                          {t.pros.map((p, i) => (
                            <div key={i} className="text-[11px] text-slate-600 dark:text-slate-300 mb-0.5">
                              + {p}
                            </div>
                          ))}
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-rose-500 dark:text-rose-400 mb-1">
                            Limitations:
                          </div>
                          {t.cons.map((c, i) => (
                            <div key={i} className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                              - {c}
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Action Link */}
                  <tr>
                    <td className="py-4 px-4 font-medium text-slate-500">Next Steps</td>
                    {selectedTools.map((t) => (
                      <td key={t.id} className="py-4 px-4">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              setIsModalOpen(false);
                              onSelectTool(t.slug);
                            }}
                            className="w-full py-1.5 px-3 text-xs font-semibold text-white bg-[#2F5BFF] hover:bg-[#1E46E6] rounded-md transition-colors text-center"
                          >
                            Full Benchmark
                          </button>
                          <a
                            href={t.websiteUrl}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          >
                            <span>Visit Site</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
