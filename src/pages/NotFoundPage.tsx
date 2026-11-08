import React from 'react';
import { ArrowLeft, Search, Home } from 'lucide-react';
import { AI_TOOLS } from '../data/tools';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  const popularTools = AI_TOOLS.slice(0, 4);

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="font-mono text-4xl sm:text-6xl font-extrabold text-[#2F5BFF]">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        The page you requested does not exist or may have been moved. Try exploring popular AI tools below or searching the directory.
      </p>

      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </button>
        <button
          onClick={() => onNavigate('/tools')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Browse All Tools</span>
        </button>
      </div>

      {/* Suggested Tools */}
      <div className="pt-10 border-t border-slate-200 dark:border-slate-800 text-left">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">
          Popular Verified AI Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
          {popularTools.map((t) => (
            <div
              key={t.id}
              onClick={() => onNavigate(`/tools/${t.slug}`)}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-[#2F5BFF] cursor-pointer flex items-center gap-3 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ backgroundColor: t.accentColor }}
              >
                {t.monogram}
              </div>
              <div className="truncate">
                <div className="font-semibold text-xs text-slate-900 dark:text-white">{t.name}</div>
                <div className="text-[11px] text-slate-500 capitalize">{t.category} · {t.pricing}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
