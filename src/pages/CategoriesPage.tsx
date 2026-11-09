import React from 'react';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { CATEGORIES_META, AI_TOOLS } from '../data/tools';
import { ToolCategory } from '../types';
import { ToolCard } from '../components/ToolCard';

interface CategoriesPageProps {
  currentCategorySlug?: string;
  onNavigate: (path: string) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (toolId: string) => void;
  compareIds: string[];
  onToggleCompare: (toolId: string) => void;
  onSelectTool: (slug: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  currentCategorySlug,
  onNavigate,
  bookmarkedIds,
  onToggleBookmark,
  compareIds,
  onToggleCompare,
  onSelectTool
}) => {
  const isSingleCategory = !!currentCategorySlug && currentCategorySlug in CATEGORIES_META;
  const currentCategory = isSingleCategory
    ? (currentCategorySlug as ToolCategory)
    : null;

  // Single Category View
  if (isSingleCategory && currentCategory) {
    const meta = CATEGORIES_META[currentCategory];
    const categoryTools = AI_TOOLS.filter((t) => t.category === currentCategory).sort(
      (a, b) => a.trendingRank - b.trendingRank
    );

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5">
          <button onClick={() => onNavigate('/')} className="hover:text-slate-900 dark:hover:text-white">
            Home
          </button>
          <span aria-hidden="true">/</span>
          <button onClick={() => onNavigate('/categories')} className="hover:text-slate-900 dark:hover:text-white">
            Categories
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 dark:text-white font-medium capitalize">{meta.name}</span>
        </nav>

        {/* Category Header */}
        <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#2F5BFF] uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <span>Curated Industry Ranking</span>
                <span aria-hidden="true">·</span>
                <span>Updated 2026</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Best AI {meta.name} Tools (2026)
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
                {meta.description}
              </p>
            </div>
            <div className="font-mono text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-lg shrink-0 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white">{categoryTools.length}</span> Verified Tools Benchmarked
            </div>
          </div>

          {/* Editorial Category Intro Paragraph */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Editorial State of the Discipline
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {meta.intro}
              </p>
            </div>
          </div>
        </div>

        {/* Category Tools Ranked Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Ranked by verified practitioner adoption, benchmark accuracy, and pricing transparency</span>
            <button
              onClick={() => onNavigate(`/tools?category=${currentCategory}`)}
              className="text-[#2F5BFF] font-medium hover:underline flex items-center gap-1"
            >
              <span>Filter in Directory View</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTools.map((tool, index) => (
              <div key={tool.id} className="relative group">
                {/* Ranking Badge */}
                <div className="absolute -top-2.5 -left-2.5 z-20 px-2 py-0.5 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-mono font-bold rounded-md shadow-md border border-slate-700">
                  #{index + 1}
                </div>
                <ToolCard
                  tool={tool}
                  isBookmarked={bookmarkedIds.includes(tool.id)}
                  onToggleBookmark={onToggleBookmark}
                  isSelectedForCompare={compareIds.includes(tool.id)}
                  onToggleCompare={onToggleCompare}
                  onSelect={onSelectTool}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // All Categories Hub View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 flex items-center gap-1.5">
        <button onClick={() => onNavigate('/')} className="hover:text-slate-900 dark:hover:text-white">
          Home
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-white font-medium">Categories</span>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Application Categories
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Explore specialized tools structured by discipline, operational workflows, and verified technical benchmarks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Object.keys(CATEGORIES_META) as ToolCategory[]).map((catKey) => {
          const meta = CATEGORIES_META[catKey];
          const sampleTools = AI_TOOLS.filter((t) => t.category === catKey).slice(0, 3);

          return (
            <div
              key={catKey}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {meta.name}
                  </h2>
                  <span className="font-mono text-xs text-slate-400">
                    {meta.count} tools
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {meta.description}
                </p>

                {/* Top Picks Preview */}
                <div className="space-y-1.5 mb-6">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Featured Tools:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleTools.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => onSelectTool(t.slug)}
                        className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-[#2F5BFF] hover:text-white rounded text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate(`/category/${catKey}`)}
                className="w-full py-2 px-3 text-xs font-semibold text-[#2F5BFF] bg-[#2F5BFF]/10 hover:bg-[#2F5BFF] hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View {meta.name} Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
