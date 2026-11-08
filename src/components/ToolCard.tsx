import React from 'react';
import { ExternalLink, Bookmark, Check, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  viewMode?: 'grid' | 'list';
  isBookmarked: boolean;
  onToggleBookmark: (toolId: string) => void;
  isSelectedForCompare: boolean;
  onToggleCompare: (toolId: string) => void;
  onSelect: (slug: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  viewMode = 'grid',
  isBookmarked,
  onToggleBookmark,
  isSelectedForCompare,
  onToggleCompare,
  onSelect
}) => {
  if (viewMode === 'list') {
    return (
      <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 transition-all duration-150 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left Block: Monogram, Identity & Metadata */}
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            {/* Compare Checkbox */}
            <input
              type="checkbox"
              checked={isSelectedForCompare}
              onChange={() => onToggleCompare(tool.id)}
              className="mt-1 sm:mt-0 w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#2F5BFF] focus:ring-[#2F5BFF] cursor-pointer"
              title="Select to compare"
              aria-label={`Compare ${tool.name}`}
            />

            {/* Monogram Tile */}
            <div
              className="w-10 h-10 rounded-md flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-xs"
              style={{ backgroundColor: tool.accentColor }}
            >
              {tool.monogram}
            </div>

            {/* Title, Unboxed Metadata & Description */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => onSelect(tool.slug)}
                  className="text-sm font-bold text-slate-900 dark:text-white hover:text-[#2F5BFF] dark:hover:text-[#2F5BFF] transition-colors text-left truncate"
                >
                  {tool.name}
                </button>
                {tool.verified && (
                  <span title="Verified AI Tool" className="inline-flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2F5BFF] shrink-0" />
                  </span>
                )}
                {/* Zero-Pill: Clean unboxed metadata with bullet separators */}
                <span className="text-xs text-slate-500 flex items-center gap-1.5 whitespace-nowrap">
                  <span>{tool.pricing}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{tool.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums font-mono text-[11px]">★ {tool.rating.toFixed(1)}</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1 max-w-2xl">
                {tool.tagline}
              </p>
            </div>
          </div>

          {/* Right Action Block */}
          <div className="flex items-center justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onToggleBookmark(tool.id)}
              className={`p-2 rounded-md border text-xs transition-colors ${
                isBookmarked
                  ? 'border-[#2F5BFF]/30 text-[#2F5BFF] bg-[#2F5BFF]/5'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Save bookmark'}
              aria-label={`Bookmark ${tool.name}`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              <span>Visit</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              onClick={() => onSelect(tool.slug)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[#2F5BFF] hover:bg-[#1E46E6] rounded-md transition-colors"
            >
              <span>Details</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Linear / Raycast card density)
  return (
    <div className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-all duration-150 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md">
      <div>
        {/* Top Header: Monogram, Identity, Bookmark, and Compare Toggle */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-xs"
              style={{ backgroundColor: tool.accentColor }}
            >
              {tool.monogram}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSelect(tool.slug)}
                  className="font-bold text-sm text-slate-900 dark:text-white hover:text-[#2F5BFF] dark:hover:text-[#2F5BFF] transition-colors truncate text-left"
                >
                  {tool.name}
                </button>
                {tool.verified && (
                  <span title="Verified AI Tool" className="inline-flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2F5BFF] shrink-0" />
                  </span>
                )}
              </div>
              {/* Zero-Pill: Clean unboxed metadata with subtle dot separator */}
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="font-medium text-slate-700 dark:text-slate-300">{tool.pricing}</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{tool.category}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Bookmark + Compare Checkbox) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleBookmark(tool.id)}
              className={`p-1.5 rounded border text-xs transition-colors ${
                isBookmarked
                  ? 'border-[#2F5BFF]/30 text-[#2F5BFF] bg-[#2F5BFF]/5'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Save bookmark'}
              aria-label={`Bookmark ${tool.name}`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <label
              className="flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer p-1"
              title="Compare side-by-side"
            >
              <input
                type="checkbox"
                checked={isSelectedForCompare}
                onChange={() => onToggleCompare(tool.id)}
                className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-[#2F5BFF] focus:ring-[#2F5BFF] cursor-pointer"
                aria-label={`Compare ${tool.name}`}
              />
            </label>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {tool.tagline}
        </p>

        {/* Key Feature Highlight */}
        <div className="space-y-1 mb-4">
          {tool.keyFeatures.slice(0, 2).map((feat, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
              <span className="text-[#2F5BFF] mt-0.5">•</span>
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Footer: Rating, Best-For & Action Buttons */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
              {tool.rating.toFixed(1)}
            </span>
            <span className="text-slate-400">({tool.reviewCount.toLocaleString()})</span>
          </div>
          <span className="truncate max-w-[150px] text-right text-slate-400">
            {tool.platforms[0] || 'Web'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelect(tool.slug)}
            className="flex-1 py-1.5 px-3 text-xs font-semibold text-white bg-[#2F5BFF] hover:bg-[#1E46E6] rounded-md transition-colors text-center shadow-xs"
          >
            Review & Benchmarks
          </button>
          <a
            href={tool.websiteUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
            title="Open official site"
            aria-label={`Visit official site for ${tool.name}`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
