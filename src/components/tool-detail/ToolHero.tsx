import React from 'react';
import { ExternalLink, Heart, GitCompare, Share2, Flag, ShieldCheck, Star } from 'lucide-react';
import { Tool } from '../../types';

interface ToolHeroProps {
  tool: Tool;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  isCompared: boolean;
  onToggleCompare: () => void;
  onCopyShareLink: () => void;
  copiedLink: boolean;
  onOpenReportModal: () => void;
}

export const ToolHero: React.FC<ToolHeroProps> = ({
  tool,
  isFavorited,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
  onCopyShareLink,
  copiedLink,
  onOpenReportModal
}) => {
  return (
    <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        {/* Identity & Monogram */}
        <div className="flex items-start gap-4 min-w-0">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-xl text-white shrink-0 shadow-md"
            style={{ backgroundColor: tool.accentColor }}
          >
            {tool.monogram}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {tool.name}
              </h1>
              {tool.verified && (
                <div className="flex items-center gap-1 text-xs text-[#2F5BFF] font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified</span>
                </div>
              )}
              {tool.source === 'community' && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium">
                  Community submitted · unverified
                  {tool.showSubmitter && tool.submitterName && (
                    <span className="text-slate-500 dark:text-slate-400">· added by {tool.submitterName}</span>
                  )}
                </span>
              )}
            </div>

            {/* Zero-Pill Unboxed Metadata */}
            <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap mt-1.5">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{tool.pricing}</span>
              {tool.startingPrice && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#2F5BFF] font-medium">{tool.startingPrice}</span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span className={`font-medium ${tool.hasFreeTier ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                {tool.hasFreeTier ? 'Free Tier Included' : 'Paid / Commercial'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{tool.category}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-mono">Released {tool.releaseYear}</span>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1 font-mono font-medium text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{tool.rating.toFixed(1)}</span>
                <span className="text-slate-400">({tool.reviewCount.toLocaleString()})</span>
              </div>
            </div>

            {/* Tags List */}
            {tool.tags && tool.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 rounded font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed max-w-2xl">
              {tool.tagline}
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex sm:flex-col items-center sm:items-stretch gap-2.5 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          <a
            href={tool.websiteUrl}
            target="_blank"
            rel="nofollow ugc noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <span>Visit Official Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleFavorite}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-medium transition-colors ${
                isFavorited
                  ? 'border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current text-rose-500' : ''}`} />
              <span>{isFavorited ? 'Saved' : 'Favorite'}</span>
            </button>

            <button
              onClick={onToggleCompare}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-medium transition-colors ${
                isCompared
                  ? 'border-[#2F5BFF] bg-[#2F5BFF]/10 text-[#2F5BFF]'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>

            <button
              onClick={onCopyShareLink}
              className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
              title="Copy share link"
              aria-label="Copy tool share link"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Community Tool Report Button */}
          {tool.source === 'community' && (
            <button
              onClick={onOpenReportModal}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              title="Report this listing for spam or policy violation"
            >
              <Flag className="w-3 h-3" />
              <span>Report tool</span>
            </button>
          )}

          {copiedLink && (
            <span className="text-[11px] text-[#2F5BFF] text-center font-medium">Link copied!</span>
          )}
        </div>
      </div>
    </div>
  );
};
