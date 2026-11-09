import React, { useState } from 'react';
import { Search, Moon, Sun, BookOpen, Layers, GitCompare, Bookmark, ShieldCheck, Sparkles } from 'lucide-react';
import { BrandGuideModal } from './BrandGuideModal';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenCommandPalette: () => void;
  bookmarkCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  onOpenCommandPalette,
  bookmarkCount,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [showBrandGuide, setShowBrandGuide] = useState(false);

  return (
    <>
      {/* Skip Link for WCAG 2.2 AA Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#2F5BFF] focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Top Bar Contract: 1-row, 3-zone contract separated by gap-8 */}
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 transition-colors backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text element / inline brand link */}
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-3 text-left whitespace-nowrap shrink-0 group focus:outline-none"
            aria-label="AI Finder Technologies Home"
          >
            {/* Crisp inline vector mark */}
            <svg
              className="w-8 h-8 shrink-0 transition-transform duration-200 group-hover:scale-105"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect width="32" height="32" rx="7" fill="#0B0F19" />
              <path d="M7 12V7H12" stroke="#2F5BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M25 12V7H20" stroke="#2F5BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 20V25H12" stroke="#2F5BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M25 20V25H20" stroke="#2F5BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="16" cy="16" r="3.5" fill="#2F5BFF" />
              <path d="M16 9V11.5M16 20.5V23M9 16H11.5M20.5 16H23" stroke="#2F5BFF" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                AI Finder
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Technologies
              </span>
            </div>
          </button>

          {/* Zone 2: Clean single-line nav links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onNavigate('/tools')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#2F5BFF] dark:hover:text-[#2F5BFF] ${
                currentPath.startsWith('/tools') ? 'text-[#2F5BFF] dark:text-[#2F5BFF] font-semibold' : ''
              }`}
            >
              Directory
            </button>
            <button
              onClick={() => onNavigate('/benchmarks')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#2F5BFF] dark:hover:text-[#2F5BFF] flex items-center gap-1.5 ${
                currentPath === '/benchmarks' ? 'text-[#2F5BFF] dark:text-[#2F5BFF] font-semibold' : ''
              }`}
            >
              <span>Live Benchmarks</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>
            <button
              onClick={() => onNavigate('/free-apis')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#2F5BFF] dark:hover:text-[#2F5BFF] ${
                currentPath.startsWith('/free-apis') ? 'text-[#2F5BFF] dark:text-[#2F5BFF] font-semibold' : ''
              }`}
            >
              Free APIs
            </button>
            <button
              onClick={() => onNavigate('/compare')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#2F5BFF] dark:hover:text-[#2F5BFF] ${
                currentPath === '/compare' ? 'text-[#2F5BFF] dark:text-[#2F5BFF] font-semibold' : ''
              }`}
            >
              Compare
            </button>
            <button
              onClick={() => onNavigate('/blog')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#2F5BFF] dark:hover:text-[#2F5BFF] ${
                currentPath.startsWith('/blog') ? 'text-[#2F5BFF] dark:text-[#2F5BFF] font-semibold' : ''
              }`}
            >
              Research &amp; Guides
            </button>
          </nav>

          {/* Zone 3: 1 primary action + search trigger & utility buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Cmd+K Search Trigger */}
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:border-slate-300 dark:hover:border-slate-700 transition-colors whitespace-nowrap"
              aria-label="Open search command palette (Ctrl+K or Cmd+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search tools...</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-500">
                ⌘K
              </kbd>
            </button>

            {/* Saved Bookmarks Indicator */}
            {bookmarkCount > 0 && (
              <button
                onClick={() => onNavigate('/tools?bookmarked=true')}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                title={`${bookmarkCount} saved tools`}
                aria-label={`View ${bookmarkCount} saved tools`}
              >
                <Bookmark className="w-4 h-4 fill-current text-[#2F5BFF]" />
                <span className="sr-only">Saved Tools</span>
              </button>
            )}

            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => onNavigate('/submit')}
              className="hidden sm:inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-[#2F5BFF] hover:bg-[#1E46E6] rounded-md transition-colors whitespace-nowrap shadow-sm"
            >
              Submit Tool
            </button>
          </div>
        </div>
      </header>

      {/* Brand Guide Modal */}
      {showBrandGuide && (
        <BrandGuideModal onClose={() => setShowBrandGuide(false)} />
      )}
    </>
  );
};
