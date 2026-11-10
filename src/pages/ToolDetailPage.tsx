import React, { useState } from 'react';
import { ExternalLink, Heart, Check, ShieldCheck, ArrowLeft, Star, ChevronDown, ChevronUp, GitCompare, Share2, BookOpen, Clock, Tag } from 'lucide-react';
import { AI_TOOLS } from '../data/tools';
import { BLOG_POSTS } from '../data/blogPosts';
import { Tool, BlogPost } from '../types';
import { ToolCard } from '../components/ToolCard';
import { CapabilityRadar } from '../components/charts/CapabilityRadar';
import { useAuth } from '../context/AuthContext';

interface ToolDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (toolId: string) => void;
  compareIds: string[];
  onToggleCompare: (toolId: string) => void;
  tools?: Tool[];
}

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({
  slug,
  onNavigate,
  bookmarkedIds,
  onToggleBookmark,
  compareIds,
  onToggleCompare,
  tools = AI_TOOLS
}) => {
  const tool = tools.find((t) => t.slug === slug);
  const { isFavorite, toggleFavorite } = useAuth();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tool Not Found</h1>
        <p className="text-xs text-slate-500">
          We could not locate an evaluation for slug &quot;{slug}&quot;. It may have been renamed or archived.
        </p>
        <button
          onClick={() => onNavigate('/tools')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#2F5BFF] rounded-md"
        >
          Return to Tools Directory
        </button>
      </div>
    );
  }

  const isBookmarked = bookmarkedIds.includes(tool.id);
  const isCompared = compareIds.includes(tool.id);

  // Find alternative tools
  const alternativesList = tools.filter((t) => tool.alternatives.includes(t.slug));

  // Find related tools in same category
  const relatedTools = tools.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 3);

  // Find related blog guides
  const relatedGuides = BLOG_POSTS.filter(
    (p) => p.relatedToolSlugs.includes(tool.slug) || p.category === tool.category
  ).slice(0, 2);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Structured Data Schema for SoftwareApplication & FAQPage
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': tool.name,
    'applicationCategory': tool.category,
    'operatingSystem': tool.platforms.join(', '),
    'description': tool.description,
    'offers': {
      '@type': 'Offer',
      'price': tool.pricing === 'Free' ? '0' : '20.00',
      'priceCurrency': 'USD'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': tool.rating,
      'reviewCount': tool.reviewCount,
      'bestRating': '5',
      'worstRating': '1'
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': tool.faqs.map((f) => ({
      '@type': 'Question',
      'name': f.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.answer
      }
    }))
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Schema.org Injections */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
        <button onClick={() => onNavigate('/')} className="hover:text-slate-900 dark:hover:text-white">
          Home
        </button>
        <span aria-hidden="true">/</span>
        <button onClick={() => onNavigate('/tools')} className="hover:text-slate-900 dark:hover:text-white">
          Directory
        </button>
        <span aria-hidden="true">/</span>
        <button
          onClick={() => onNavigate(`/category/${tool.category}`)}
          className="capitalize hover:text-slate-900 dark:hover:text-white"
        >
          {tool.category}
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-white font-medium truncate">{tool.name}</span>
      </nav>

      {/* --- HERO TOOL BLOCK --- */}
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
              rel="nofollow noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <span>Visit Official Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  if (tool) {
                    await toggleFavorite(tool.slug);
                    onToggleBookmark(tool.id);
                  }
                }}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-medium transition-colors ${
                  tool && isFavorite(tool.slug)
                    ? 'border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${tool && isFavorite(tool.slug) ? 'fill-current text-rose-500' : ''}`} />
                <span>{tool && isFavorite(tool.slug) ? 'Saved' : 'Favorite'}</span>
              </button>

              <button
                onClick={() => onToggleCompare(tool.id)}
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
                onClick={handleCopyLink}
                className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
                title="Copy share link"
                aria-label="Copy tool share link"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
            {copiedLink && (
              <span className="text-[11px] text-[#2F5BFF] text-center font-medium">Link copied!</span>
            )}
          </div>
        </div>
      </div>

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

      {/* --- PRICING BREAKDOWN --- */}
      <section className="p-6 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Pricing Structure &amp; Value Analysis
        </h2>
        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {tool.pricingDetails}
        </div>
      </section>

      {/* --- FAQ ACCORDION --- */}
      {tool.faqs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            {tool.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="p-4 transition-colors">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-semibold text-xs text-slate-900 dark:text-white gap-4"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed animate-in fade-in duration-150">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* --- RELATED BENCHMARKS & EDITORIAL GUIDES --- */}
      {relatedGuides.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#2F5BFF]" />
              <span>Related Research &amp; Evaluation Guides</span>
            </h2>
            <button
              onClick={() => onNavigate('/blog')}
              className="text-xs font-semibold text-[#2F5BFF] hover:underline"
            >
              Browse all guides
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedGuides.map((guide) => (
              <div
                key={guide.id}
                onClick={() => onNavigate(`/blog/${guide.slug}`)}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group shadow-xs"
              >
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-2">
                  <span className="capitalize text-slate-700 dark:text-slate-300 font-medium">{guide.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{guide.readTimeMinutes} min read</span>
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-[#2F5BFF] transition-colors line-clamp-2 mb-2 leading-snug">
                  {guide.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {guide.description}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Author: {guide.author.name}</span>
                  <span className="text-[#2F5BFF] font-medium group-hover:translate-x-0.5 transition-transform inline-block">Read Analysis →</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- TOP ALTERNATIVES --- */}
      {alternativesList.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Direct Alternatives to {tool.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {alternativesList.map((alt) => (
              <div
                key={alt.id}
                onClick={() => onNavigate(`/tools/${alt.slug}`)}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] text-white"
                    style={{ backgroundColor: alt.accentColor }}
                  >
                    {alt.monogram}
                  </div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {alt.name}
                  </span>
                  <span className="text-[11px] text-slate-400">· {alt.pricing}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {alt.tagline}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- RELATED TOOLS IN CATEGORY --- */}
      {relatedTools.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              More Verified {tool.category.toUpperCase()} Tools
            </h2>
            <button
              onClick={() => onNavigate(`/category/${tool.category}`)}
              className="text-xs font-semibold text-[#2F5BFF] hover:underline"
            >
              View all in category
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((rel) => (
              <ToolCard
                key={rel.id}
                tool={rel}
                isBookmarked={bookmarkedIds.includes(rel.id)}
                onToggleBookmark={onToggleBookmark}
                isSelectedForCompare={compareIds.includes(rel.id)}
                onToggleCompare={onToggleCompare}
                onSelect={(slug) => onNavigate(`/tools/${slug}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
