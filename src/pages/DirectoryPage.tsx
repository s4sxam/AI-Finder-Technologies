import React, { useState, useMemo } from 'react';
import { Search, LayoutGrid, List, SlidersHorizontal, X, ShieldCheck, Bookmark, RotateCcw } from 'lucide-react';
import { AI_TOOLS } from '../data/tools';
import { Tool, ToolCategory, PricingType } from '../types';
import { ToolCard } from '../components/ToolCard';

interface DirectoryPageProps {
  initialSearch?: string;
  initialCategory?: ToolCategory | 'all';
  initialPricing?: PricingType | 'all';
  initialOnlyBookmarked?: boolean;
  initialOnlyFreeTier?: boolean;
  initialSort?: 'trending' | 'rating' | 'newest' | 'alphabetical';
  bookmarkedIds: string[];
  onToggleBookmark: (toolId: string) => void;
  compareIds: string[];
  onToggleCompare: (toolId: string) => void;
  onSelectTool: (slug: string) => void;
  onUpdateUrlParams: (params: Record<string, string>) => void;
  tools?: Tool[];
}

export const DirectoryPage: React.FC<DirectoryPageProps> = ({
  initialSearch = '',
  initialCategory = 'all',
  initialPricing = 'all',
  initialOnlyBookmarked = false,
  initialOnlyFreeTier = false,
  initialSort = 'trending',
  bookmarkedIds,
  onToggleBookmark,
  compareIds,
  onToggleCompare,
  onSelectTool,
  onUpdateUrlParams,
  tools = AI_TOOLS
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState<ToolCategory | 'all'>(initialCategory);
  const [pricing, setPricing] = useState<PricingType | 'all'>(initialPricing);
  const [platform, setPlatform] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'trending' | 'rating' | 'newest' | 'alphabetical'>(initialSort);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyBookmarked, setOnlyBookmarked] = useState(initialOnlyBookmarked);
  const [onlyFreeTier, setOnlyFreeTier] = useState(initialOnlyFreeTier);

  // Sync to URL
  const updateFilters = (newParams: Partial<{
    search: string;
    category: string;
    pricing: string;
    bookmarked: boolean;
    freeTier: boolean;
    sort: string;
  }>) => {
    const params: Record<string, string> = {};
    const nextSearch = newParams.search !== undefined ? newParams.search : search;
    const nextCat = newParams.category !== undefined ? newParams.category : category;
    const nextPricing = newParams.pricing !== undefined ? newParams.pricing : pricing;
    const nextBookmarked = newParams.bookmarked !== undefined ? newParams.bookmarked : onlyBookmarked;
    const nextFreeTier = newParams.freeTier !== undefined ? newParams.freeTier : onlyFreeTier;
    const nextSort = newParams.sort !== undefined ? newParams.sort : sortBy;

    if (nextSearch) params.q = nextSearch;
    if (nextCat !== 'all') params.category = nextCat;
    if (nextPricing !== 'all') params.pricing = nextPricing;
    if (nextBookmarked) params.bookmarked = 'true';
    if (nextFreeTier) params.freeTier = 'true';
    if (nextSort !== 'trending') params.sort = nextSort;

    onUpdateUrlParams(params);
  };

  // Filter and sort calculation
  const filteredTools = useMemo(() => {
    return tools.filter((t) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          t.name.toLowerCase().includes(q) ||
          t.tagline.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(q)) ||
          t.keyFeatures.some((f) => f.toLowerCase().includes(q)) ||
          t.platforms.some((p) => p.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Category
      if (category !== 'all' && t.category !== category) return false;

      // Pricing
      if (pricing !== 'all' && t.pricing !== pricing) return false;

      // Free Tier
      if (onlyFreeTier && !t.hasFreeTier) return false;

      // Platform
      if (platform !== 'all' && !t.platforms.includes(platform)) return false;

      // Only Verified
      if (onlyVerified && !t.verified) return false;

      // Only Bookmarked
      if (onlyBookmarked && !bookmarkedIds.includes(t.id)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'trending') return a.trendingRank - b.trendingRank;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.releaseYear - a.releaseYear;
      if (sortBy === 'alphabetical') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [tools, search, category, pricing, platform, onlyVerified, onlyBookmarked, onlyFreeTier, bookmarkedIds, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('all');
    setPricing('all');
    setPlatform('all');
    setOnlyVerified(false);
    setOnlyBookmarked(false);
    setOnlyFreeTier(false);
    setSortBy('trending');
    updateFilters({ search: '', category: 'all', pricing: 'all', bookmarked: false, freeTier: false, sort: 'trending' });
  };

  const platformsList = ['Mac', 'Windows', 'Linux', 'iOS', 'Android', 'Web', 'VS Code'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Breadcrumb Header */}
      <div>
        <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
          <span>Home</span>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 dark:text-white font-medium">Tools Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Curated AI Tools Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Filter and compare {AI_TOOLS.length} verified AI applications across developer workflows, foundation reasoning, generative visuals, and academic search.
        </p>
      </div>

      {/* --- STICKY FILTER BAR --- */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-md space-y-3">
        {/* Row 1: Search Input & View Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                updateFilters({ search: e.target.value });
              }}
              placeholder="Filter by name, feature, or tech..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF]"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  updateFilters({ search: '' });
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 text-xs">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 whitespace-nowrap">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setSortBy(val);
                  updateFilters({ sort: val });
                }}
                className="py-1.5 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="trending">Trending Velocity</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
              </select>
            </div>

            {/* Grid vs List View Toggle */}
            <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-md p-0.5 bg-slate-100 dark:bg-slate-900">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Grid layout"
                aria-label="Grid layout"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="List layout"
                aria-label="List layout"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Category Segmented Filter Tabs (All 10 Categories) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 text-[11px] whitespace-nowrap mr-1">Category:</span>
          {(['all', 'coding', 'chat', 'image', 'video', 'audio', 'research', 'writing', 'productivity', 'design', 'marketing'] as const).map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  updateFilters({ category: cat });
                }}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors capitalize ${
                  isActive
                    ? 'bg-[#2F5BFF] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            );
          })}
        </div>

        {/* Row 3: Faceted Pricing, Free Tier, Platforms, and Verification Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Pricing Model */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Pricing:</span>
              <select
                value={pricing}
                onChange={(e) => {
                  setPricing(e.target.value as any);
                  updateFilters({ pricing: e.target.value });
                }}
                className="py-1 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
              >
                <option value="all">All Pricing</option>
                <option value="Free">100% Free</option>
                <option value="Freemium">Freemium</option>
                <option value="Paid">Paid Only</option>
              </select>
            </div>

            {/* Free Tier Filter Checkbox */}
            <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyFreeTier}
                onChange={(e) => {
                  setOnlyFreeTier(e.target.checked);
                  updateFilters({ freeTier: e.target.checked });
                }}
                className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-[#2F5BFF] focus:ring-[#2F5BFF]"
              />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Free Tier Available</span>
            </label>

            {/* Platform Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Platform:</span>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="py-1 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
              >
                <option value="all">Any Platform</option>
                {platformsList.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Only Verified Checkbox */}
            <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-[#2F5BFF] focus:ring-[#2F5BFF]"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#2F5BFF]" />
                <span>Verified Only</span>
              </span>
            </label>

            {/* Only Bookmarked Checkbox */}
            <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyBookmarked}
                onChange={(e) => {
                  setOnlyBookmarked(e.target.checked);
                  updateFilters({ bookmarked: e.target.checked });
                }}
                className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-[#2F5BFF] focus:ring-[#2F5BFF]"
              />
              <span className="flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-[#2F5BFF]" />
                <span>Saved ({bookmarkedIds.length})</span>
              </span>
            </label>
          </div>

          {/* Reset Filters Action */}
          <button
            onClick={handleResetFilters}
            className="text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        </div>
      </div>

      {/* Results Header Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong>{filteredTools.length}</strong> of {AI_TOOLS.length} tools
        </span>
        {compareIds.length > 0 && (
          <span className="text-[#2F5BFF] font-medium">
            {compareIds.length} tool{compareIds.length > 1 ? 's' : ''} queued for comparison
          </span>
        )}
      </div>

      {/* Tools Display: Grid or List */}
      {filteredTools.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-3'
          }
        >
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              viewMode={viewMode}
              isBookmarked={bookmarkedIds.includes(tool.id)}
              onToggleBookmark={onToggleBookmark}
              isSelectedForCompare={compareIds.includes(tool.id)}
              onToggleCompare={onToggleCompare}
              onSelect={onSelectTool}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            No tools matched your active filters.
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search query or selecting &quot;All Categories&quot; to see available tools.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#2F5BFF] hover:bg-[#1E46E6] rounded-md transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
