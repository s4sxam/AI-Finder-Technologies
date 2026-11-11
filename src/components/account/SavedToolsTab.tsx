import React from 'react';
import { Heart, ArrowRight, ExternalLink } from 'lucide-react';
import { Tool } from '../../types';
import { Link } from '../Link';

interface SavedToolsTabProps {
  savedTools: Tool[];
  onNavigate: (path: string) => void;
  toggleFavorite: (slug: string) => Promise<void>;
}

export const SavedToolsTab: React.FC<SavedToolsTabProps> = ({
  savedTools,
  onNavigate,
  toggleFavorite
}) => {
  if (savedTools.length === 0) {
    return (
      <section aria-label="Saved AI Tools">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
          <Heart className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            No Saved Tools Yet
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
            Click the heart icon on any tool card across the directory or benchmarks to save tools here for rapid access.
          </p>
          <Link
            href="/tools"
            onNavigate={onNavigate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-md hover:bg-slate-800 transition-colors"
          >
            <span>Explore Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Saved AI Tools">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedTools.map((tool) => (
          <div
            key={tool.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: tool.accentColor }}
                  >
                    {tool.monogram}
                  </div>
                  <div>
                    <Link
                      href={`/tools/${tool.slug}`}
                      onNavigate={onNavigate}
                      className="font-bold text-xs text-slate-900 dark:text-white hover:text-[#2F5BFF] transition-colors text-left block"
                    >
                      {tool.name}
                    </Link>
                    <p className="text-[10px] text-slate-500 capitalize">
                      {tool.pricing} · {tool.category}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleFavorite(tool.slug)}
                  className="p-1.5 text-rose-500 hover:text-rose-600 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Remove from saved"
                  aria-label={`Remove ${tool.name} from saved`}
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                {tool.tagline}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <a
                href={tool.websiteUrl}
                target="_blank"
                rel="nofollow ugc noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-[#2F5BFF]"
              >
                <span>Visit Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <Link
                href={`/tools/${tool.slug}`}
                onNavigate={onNavigate}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2F5BFF] hover:underline"
              >
                <span>View Specs</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
