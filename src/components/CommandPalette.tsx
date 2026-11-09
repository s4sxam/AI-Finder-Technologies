import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, CornerDownLeft, Sparkles, BookOpen, Layers, X, Bookmark, Check } from 'lucide-react';
import { AI_TOOLS } from '../data/tools';
import { BLOG_POSTS } from '../data/blogPosts';
import { FREE_API_PROVIDERS } from '../data/freeApis';
import { Tool, BlogPost, ToolCategory } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (slug: string) => void;
  onSelectBlog: (slug: string) => void;
  onSelectCategory: (category: ToolCategory) => void;
  onNavigate?: (path: string) => void;
  tools?: Tool[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  onSelectBlog,
  onSelectCategory,
  onNavigate,
  tools = AI_TOOLS
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keydown handler for Esc and navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter tools, categories, and posts
  const lowerQuery = query.toLowerCase().trim();

  const matchingCategories = (['coding', 'chat', 'image', 'video', 'audio', 'research', 'writing', 'productivity', 'design', 'marketing'] as ToolCategory[]).filter(
    (cat) => lowerQuery && cat.includes(lowerQuery)
  );

  const matchingTools = tools.filter((tool) => {
    if (!lowerQuery) return tool.trendingRank <= 6;
    return (
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.tagline.toLowerCase().includes(lowerQuery) ||
      tool.category.toLowerCase().includes(lowerQuery) ||
      tool.tags?.some((t) => t.toLowerCase().includes(lowerQuery)) ||
      tool.keyFeatures.some((f) => f.toLowerCase().includes(lowerQuery))
    );
  }).slice(0, 5);

  const matchingPosts = BLOG_POSTS.filter((post) => {
    if (!lowerQuery) return true;
    return (
      post.title.toLowerCase().includes(lowerQuery) ||
      post.tags.some((t) => t.toLowerCase().includes(lowerQuery)) ||
      post.description.toLowerCase().includes(lowerQuery)
    );
  }).slice(0, 3);

  const matchingFreeApis = FREE_API_PROVIDERS.filter((p) => {
    if (!lowerQuery) return false;
    return (
      p.name.toLowerCase().includes(lowerQuery) ||
      p.envVarName.toLowerCase().includes(lowerQuery) ||
      p.bestFor.toLowerCase().includes(lowerQuery)
    );
  }).slice(0, 3);

  const totalResults =
    matchingCategories.length +
    matchingTools.length +
    matchingPosts.length +
    matchingFreeApis.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalResults));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalResults) % Math.max(1, totalResults));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < matchingCategories.length) {
        onSelectCategory(matchingCategories[selectedIndex]);
        onClose();
      } else if (selectedIndex < matchingCategories.length + matchingTools.length) {
        const toolIdx = selectedIndex - matchingCategories.length;
        onSelectTool(matchingTools[toolIdx].slug);
        onClose();
      } else if (selectedIndex < matchingCategories.length + matchingTools.length + matchingPosts.length) {
        const postIdx = selectedIndex - matchingCategories.length - matchingTools.length;
        if (matchingPosts[postIdx]) {
          onSelectBlog(matchingPosts[postIdx].slug);
          onClose();
        }
      } else {
        const apiIdx = selectedIndex - matchingCategories.length - matchingTools.length - matchingPosts.length;
        if (matchingFreeApis[apiIdx] && onNavigate) {
          onNavigate(`/free-apis/${matchingFreeApis[apiIdx].id}`);
          onClose();
        }
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command search palette"
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search AI tools, benchmark guides, categories (e.g. Cursor, Claude, Coding)..."
            className="w-full bg-transparent border-0 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {/* Quick Categories Bar when query is empty */}
          {!query && (
            <div className="px-3 py-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Quick Category Jump
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['coding', 'chat', 'image', 'video', 'audio', 'research', 'writing', 'productivity', 'design', 'marketing'] as ToolCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      onSelectCategory(cat);
                      onClose();
                    }}
                    className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-[#2F5BFF] hover:text-white dark:hover:bg-[#2F5BFF] rounded-md transition-colors capitalize text-slate-700 dark:text-slate-300"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Category Results when query is active */}
          {matchingCategories.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#2F5BFF]" />
                <span>Categories</span>
              </div>
              <div className="space-y-0.5 mt-1">
                {matchingCategories.map((cat, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={cat}
                      onClick={() => {
                        onSelectCategory(cat);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs capitalize text-slate-900 dark:text-white">
                          Browse Best AI {cat.toUpperCase()} Tools
                        </span>
                        <span className="text-[11px] text-[#2F5BFF] font-medium">Category Hub</span>
                      </div>
                      <CornerDownLeft className="w-3 h-3 text-slate-400" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tools Results */}
          {matchingTools.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {query ? 'Matched AI Tools' : 'Trending Tools'}
              </div>
              <div className="space-y-0.5 mt-1">
                {matchingTools.map((tool, idx) => {
                  const isSelected = idx + matchingCategories.length === selectedIndex;
                  return (
                    <div
                      key={tool.id}
                      onClick={() => {
                        onSelectTool(tool.slug);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx + matchingCategories.length)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                          style={{ backgroundColor: tool.accentColor }}
                        >
                          {tool.monogram}
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-900 dark:text-white">
                              {tool.name}
                            </span>
                            <span className="text-[11px] text-slate-500 capitalize">
                              {tool.category}
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {tool.pricing}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-md">
                            {tool.tagline}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSelected && (
                          <span className="text-[11px] text-[#2F5BFF] flex items-center gap-1">
                            <span>Open</span>
                            <CornerDownLeft className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Blog & Guide Results */}
          {matchingPosts.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Research & Benchmarks
              </div>
              <div className="space-y-0.5 mt-1">
                {matchingPosts.map((post, postIdx) => {
                  const globalIdx = matchingCategories.length + matchingTools.length + postIdx;
                  const isSelected = globalIdx === selectedIndex;
                  return (
                    <div
                      key={post.id}
                      onClick={() => {
                        onSelectBlog(post.slug);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                        <div className="truncate">
                          <div className="text-xs font-medium text-slate-900 dark:text-white truncate">
                            {post.title}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {post.readTimeMinutes} min read · {post.category}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-[#2F5BFF] shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Free AI API Setup Guides */}
          {matchingFreeApis.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Free AI API Key Guides
              </div>
              <div className="space-y-0.5 mt-1">
                {matchingFreeApis.map((api, apiIdx) => {
                  const globalIdx =
                    matchingCategories.length +
                    matchingTools.length +
                    matchingPosts.length +
                    apiIdx;
                  const isSelected = globalIdx === selectedIndex;
                  return (
                    <div
                      key={api.id}
                      onClick={() => {
                        if (onNavigate) onNavigate(`/free-apis/${api.id}`);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div className="truncate">
                          <div className="text-xs font-medium text-slate-900 dark:text-white truncate">
                            {api.name} Free API Key Guide
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Env: {api.envVarName} · {api.creditCardRequired === 'no' ? 'No Credit Card' : 'Credit Card Req.'}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-[#2F5BFF] shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching AI tools or articles found for &quot;{query}&quot;. Try searching for general terms like &quot;coding&quot;, &quot;image&quot;, or &quot;research&quot;.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 border border-slate-200 dark:border-slate-800 rounded">
                ↑↓
              </kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 border border-slate-200 dark:border-slate-800 rounded">
                ↵
              </kbd>{' '}
              Select
            </span>
          </div>
          <span>AI Finder Technologies Directory</span>
        </div>
      </div>
    </div>
  );
};
