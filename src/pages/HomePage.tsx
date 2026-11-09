import React, { useState, Suspense, lazy } from 'react';
import { Search, Sparkles, ArrowRight, ShieldCheck, TrendingUp, BookOpen, Layers, Check, Star, Zap, Clock } from 'lucide-react';
import { AI_TOOLS, CATEGORIES_META } from '../data/tools';
import { BLOG_POSTS } from '../data/blogPosts';
import { Tool, ToolCategory } from '../types';
import { ToolCard } from '../components/ToolCard';

// Lazy-load heavy Three.js 3D spatial canvas out of critical initial path
const ThreeScene = lazy(() =>
  import('../components/ThreeScene').then((m) => ({ default: m.ThreeScene }))
);

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenCommandPalette: () => void;
  bookmarkedIds: string[];
  onToggleBookmark: (toolId: string) => void;
  compareIds: string[];
  onToggleCompare: (toolId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenCommandPalette,
  bookmarkedIds,
  onToggleBookmark,
  compareIds,
  onToggleCompare
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [show3DNexus, setShow3DNexus] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // 1. Top Picks: Editor's top choices with highest benchmark rating & featured flag
  const topPicks = AI_TOOLS.filter((t) => t.featured || t.rating >= 4.85)
    .slice(0, 6);

  // 2. New This Week: Recent releases and fast-moving tools
  const newThisWeekTools = AI_TOOLS.slice()
    .sort((a, b) => b.releaseYear - a.releaseYear || a.trendingRank - b.trendingRank)
    .filter((t) => !topPicks.some((p) => p.id === t.id))
    .slice(0, 6);

  // 3. Latest Guides
  const latestPosts = BLOG_POSTS.slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/tools?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      onNavigate('/tools');
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      setNewsletterSubmitted(true);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-12 text-center max-w-4xl mx-auto px-4">
        {/* Editorial Kicker (Unboxed metadata text, zero pill slop) */}
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center justify-center gap-2">
          <span>The Independent AI Benchmark</span>
          <span aria-hidden="true">·</span>
          <span>Updated March 2026</span>
          <span aria-hidden="true">·</span>
          <span>Zero-Sponsored Ratings</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] text-balance mb-6">
          Find the right AI tool without the marketing fluff.
        </h1>

        {/* Concrete Value Proposition (max 65ch measure) */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          A curated, stress-tested directory of frontier AI tools across coding, writing, research, and visual creation. Verified benchmarks, real pricing models, and side-by-side matrices.
        </p>

        {/* Search First Input Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-lg p-2 focus-within:border-[#2F5BFF] focus-within:ring-2 focus-within:ring-[#2F5BFF]/20 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tool name, language, or workflow (e.g. Cursor, React UI, Audio)..."
              className="w-full px-3 py-2 text-sm text-slate-900 dark:text-white bg-transparent border-0 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#2F5BFF] hover:bg-[#1E46E6] rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              Search Tools
            </button>
          </div>
        </form>

        {/* Quick Category Jump (Functional segmented buttons, not pill badge sandwiches) */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-600 dark:text-slate-400">
          <span className="text-slate-400 text-[11px] mr-1">Popular categories:</span>
          {(['coding', 'chat', 'research', 'image', 'video', 'writing'] as ToolCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => onNavigate(`/category/${cat}`)}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition-colors capitalize text-xs font-medium"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3D Scene Toggle Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShow3DNexus(!show3DNexus)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-800 border border-slate-700 hover:border-[#2F5BFF] text-slate-200 rounded-lg text-xs font-medium transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4 text-[#2F5BFF]" />
            <span>{show3DNexus ? 'Collapse 3D Spatial Nexus' : 'Launch Interactive 3D Spatial Nexus'}</span>
          </button>
        </div>
      </section>

      {/* --- OPTIONAL 3D CONSTELLATION NEXUS (LAZY THREE.JS SCENE) --- */}
      {show3DNexus && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <Suspense
              fallback={
                <div className="h-[480px] flex items-center justify-center bg-slate-950 text-slate-400 text-xs font-mono">
                  Initializing WebGL Constellation Nexus...
                </div>
              }
            >
              <ThreeScene
                onSelectCategory={(cat) => onNavigate(`/category/${cat}`)}
                className="h-[480px]"
              />
            </Suspense>
          </div>
        </section>
      )}

      {/* --- SECTION 1: TOP PICKS --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#2F5BFF]" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Top Picks &amp; Editorial Choices
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              The highest-performing models and tools rigorously validated across real developer, research, and creative workflows.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/tools')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F5BFF] hover:underline"
          >
            <span>View All {AI_TOOLS.length} Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topPicks.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isBookmarked={bookmarkedIds.includes(tool.id)}
              onToggleBookmark={onToggleBookmark}
              isSelectedForCompare={compareIds.includes(tool.id)}
              onToggleCompare={onToggleCompare}
              onSelect={(slug) => onNavigate(`/tools/${slug}`)}
            />
          ))}
        </div>
      </section>

      {/* --- SECTION 2: NEW THIS WEEK --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2F5BFF]" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                New This Week &amp; Rising Velocity
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Recently benchmarked frontier tools and autonomous agents gaining significant engineer traction.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/tools?sort=newest')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F5BFF] hover:underline"
          >
            <span>Explore Newest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newThisWeekTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isBookmarked={bookmarkedIds.includes(tool.id)}
              onToggleBookmark={onToggleBookmark}
              isSelectedForCompare={compareIds.includes(tool.id)}
              onToggleCompare={onToggleCompare}
              onSelect={(slug) => onNavigate(`/tools/${slug}`)}
            />
          ))}
        </div>
      </section>

      {/* --- DIRECTORY CATEGORIES SHOWCASE --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Explore by Discipline
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Carefully partitioned taxonomies with focused evaluations for specific creative and engineering workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(CATEGORIES_META) as ToolCategory[]).map((catKey) => {
            const meta = CATEGORIES_META[catKey];
            return (
              <div
                key={catKey}
                onClick={() => onNavigate(`/category/${catKey}`)}
                className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#2F5BFF] transition-colors">
                    {meta.name}
                  </h3>
                  <span className="font-mono text-xs text-slate-400">
                    {meta.count} tools
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {meta.description}
                </p>
                <div className="text-[11px] text-[#2F5BFF] flex items-center gap-1 font-medium">
                  <span>Browse Category</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- EDITORIAL RESEARCH & BENCHMARK ARTICLES --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#2F5BFF]" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Engineering Benchmarks & Guides
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Rigorous, original head-to-head technical writeups written by practitioners.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/blog')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F5BFF] hover:underline"
          >
            <span>All 10 Guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onNavigate(`/blog/${post.slug}`)}
              className="group flex flex-col justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer hover:shadow-md"
            >
              <div>
                {/* Zero-Pill Unboxed Metadata */}
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-2">
                  <span className="capitalize text-slate-700 dark:text-slate-300 font-medium">{post.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTimeMinutes} min read</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.date}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#2F5BFF] transition-colors line-clamp-2 mb-2 leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {post.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>By {post.author.name}</span>
                <span className="text-[#2F5BFF] font-medium flex items-center gap-1">
                  Read Guide
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- NEWSLETTER SIGNUP --- */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="p-8 bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-xl text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            Weekly AI Benchmark Briefing
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mb-6 leading-relaxed">
            Every Thursday, we send one concise breakdown of newly released AI models, real benchmark results, and what is actually worth your time. Zero spam.
          </p>

          {newsletterSubmitted ? (
            <div className="p-3 bg-[#2F5BFF]/10 border border-[#2F5BFF]/30 rounded-lg text-xs text-white max-w-md mx-auto flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-[#2F5BFF]" />
              <span>You are subscribed. Watch your inbox for Thursday issue #142.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="developer@company.com"
                className="flex-1 px-4 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#2F5BFF]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                Join 42,000+ Engineers
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
