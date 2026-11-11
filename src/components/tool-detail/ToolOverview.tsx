import React from 'react';
import { Tool } from '../../types';
import { CapabilityRadar } from '../charts/CapabilityRadar';

interface ToolOverviewProps {
  tool: Tool;
  alternativesList: Tool[];
}

export const ToolOverview: React.FC<ToolOverviewProps> = ({ tool, alternativesList }) => {
  return (
    <>
      {/* --- OVERVIEW & BEST FOR --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Editorial Evaluation Summary
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {tool.description}
          </p>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Ideal Target Audience &amp; Best For:
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {tool.bestFor}
            </p>
          </div>
        </div>

        {/* Quick Specs Sidebar */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3.5 text-xs">
          <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            Specifications &amp; Runtime
          </div>
          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500">Category:</span>
              <span className="font-medium capitalize text-slate-900 dark:text-white">{tool.category}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500">Pricing Model:</span>
              <span className="font-medium text-slate-900 dark:text-white">{tool.pricing}</span>
            </div>
            {tool.startingPrice && (
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-500">Starting Price:</span>
                <span className="font-semibold text-[#2F5BFF]">{tool.startingPrice}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500">Free Tier:</span>
              <span className={`font-medium ${tool.hasFreeTier ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                {tool.hasFreeTier ? 'Yes (Forever Free)' : 'No (Paid Only)'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500">Last Audited:</span>
              <span className="font-mono text-slate-900 dark:text-white">{tool.lastUpdated}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500">Release Year:</span>
              <span className="font-mono text-slate-900 dark:text-white">{tool.releaseYear}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500">Monthly Reach:</span>
              <span className="font-mono text-slate-900 dark:text-white">{tool.monthlyUsers || 'N/A'}</span>
            </div>
            <div className="py-1">
              <span className="text-slate-500 block mb-1">Supported Platforms:</span>
              <div className="flex flex-wrap gap-1">
                {tool.platforms.map((p) => (
                  <span
                    key={p}
                    className="px-2 py-0.5 text-[11px] bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CAPABILITY RADAR & EDITORIAL SCORES --- */}
      {tool.capabilities && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Aptitude Profile vs. Top Alternatives
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Editorial Audit: March 2026
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <CapabilityRadar tools={[tool, ...alternativesList.slice(0, 2)]} />
            </div>
            <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                  Task Aptitude Ratings
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Evaluated across practical software engineering, multimodal generation, and business analysis workflows. Ratings indicate verified platform capabilities (Strong / Limited / No native support).
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {Object.entries(tool.capabilities).map(([task, score]) => (
                    <div
                      key={task}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between"
                    >
                      <span className="capitalize font-medium text-slate-700 dark:text-slate-300">
                        {task.replace('Gen', '')}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                          score === 2
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : score === 1
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {score === 2 ? 'Strong' : score === 1 ? 'Limited' : 'None'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800 mt-4">
                Independent editorial evaluation conducted by AI Finder technical reviewers.
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- KEY FEATURES --- */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Key Features &amp; Architecture
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tool.keyFeatures.map((feat, i) => (
            <div
              key={i}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-[#2F5BFF]/10 text-[#2F5BFF] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                ✓
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {feat}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- PROS & CONS BREAKDOWN --- */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Pros &amp; Limitations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Pros */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-emerald-500/20 rounded-xl space-y-2.5">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
              Verified Advantages
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {tool.pros.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">+</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-rose-500/20 rounded-xl space-y-2.5">
            <div className="text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider text-[11px]">
              Known Trade-offs
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {tool.cons.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">-</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};
