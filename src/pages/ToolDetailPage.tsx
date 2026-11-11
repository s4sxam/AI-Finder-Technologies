import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { AI_TOOLS } from '../data/tools';
import { BLOG_POSTS } from '../data/blogPosts';
import { Tool, BlogPost } from '../types';
import { ToolCard } from '../components/ToolCard';
import { useAuth } from '../context/AuthContext';
import { getCommunityToolBySlug, submitToolReport, ReportReason } from '../lib/communityTools';
import { safeJsonLd } from '../lib/safeJsonLd';
import { SITE_URL } from '../lib/constants';
import { Link } from '../components/Link';

import { ToolHero } from '../components/tool-detail/ToolHero';
import { ToolOverview } from '../components/tool-detail/ToolOverview';
import { ToolPricingSection } from '../components/tool-detail/ToolPricingSection';
import { ToolFaqSection } from '../components/tool-detail/ToolFaqSection';
import { ToolReportModal } from '../components/tool-detail/ToolReportModal';

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
  const { user, isFavorite, toggleFavorite, signInWithGoogle } = useAuth();

  const [tool, setTool] = useState<Tool | null>(() => tools.find((t) => t.slug === slug) || null);
  const [isLoading, setIsLoading] = useState<boolean>(!tools.find((t) => t.slug === slug));
  const [copiedLink, setCopiedLink] = useState(false);

  // Reporting State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReasonCategory, setReportReasonCategory] = useState<ReportReason>('spam');
  const [reportDetails, setReportDetails] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  // Sync tool from tools prop or fallback to Firestore community query
  useEffect(() => {
    const found = tools.find((t) => t.slug === slug);
    if (found) {
      setTool(found);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    getCommunityToolBySlug(slug)
      .then((communityTool) => {
        if (isMounted) {
          setTool(communityTool);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching tool by slug:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug, tools]);

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded mb-6" />
        <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  // Not Found State
  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tool Not Found</h1>
        <p className="text-xs text-slate-500">
          The software listing with identifier &quot;{slug}&quot; could not be located in either verified or community records.
        </p>
        <Link
          href="/tools"
          onNavigate={onNavigate}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#2F5BFF] rounded-md hover:bg-[#1E46E6] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Directory</span>
        </Link>
      </div>
    );
  }

  // Find top alternatives
  const alternativesList: Tool[] = tool.alternatives
    ? tool.alternatives
        .map((altName) => tools.find((t) => t.name.toLowerCase() === altName.toLowerCase()))
        .filter((t): t is Tool => !!t)
    : [];

  // Related Tools in the same category
  const relatedTools = tools
    .filter((t) => t.category === tool.category && t.id !== tool.id)
    .slice(0, 3);

  // Related Blog Guides
  const relatedGuides: BlogPost[] = BLOG_POSTS.filter((post) =>
    post.relatedToolSlugs?.includes(tool.slug)
  ).slice(0, 2);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      await signInWithGoogle();
      return;
    }

    setIsSubmittingReport(true);
    setReportError(null);

    try {
      await submitToolReport({
        toolSlug: tool.slug,
        toolName: tool.name,
        reporterUid: user.uid,
        reason: reportReasonCategory,
        details: reportDetails.trim(),
        reporterEmail: user.email || undefined
      });
      setReportSuccess(true);
      setTimeout(() => {
        setIsReportModalOpen(false);
        setReportSuccess(false);
        setReportDetails('');
      }, 2500);
    } catch (err: any) {
      console.error('Failed to submit tool report:', err);
      setReportError(err?.message || 'Failed to submit report. Please try again later.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const isCompared = compareIds.includes(tool.id);
  const isFavorited = isFavorite(tool.slug) || bookmarkedIds.includes(tool.id);

  // Schema.org SoftwareApplication & FAQPage Structured Data
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': tool.name,
    'url': `${SITE_URL}/tools/${tool.slug}`,
    'applicationCategory': tool.category,
    'operatingSystem': tool.platforms.join(', '),
    'description': tool.description,
    ...(tool.priceVerifiedAt && tool.startingPrice ? {
      'offers': {
        '@type': 'Offer',
        'price': tool.hasFreeTier ? '0' : tool.startingPrice.replace(/[^0-9.]/g, '') || '0',
        'priceCurrency': 'USD'
      }
    } : {})
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
    <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Schema.org Injections */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
        <Link href="/" onNavigate={onNavigate} className="hover:text-slate-900 dark:hover:text-white">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/tools" onNavigate={onNavigate} className="hover:text-slate-900 dark:hover:text-white">
          Directory
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/category/${tool.category}`}
          onNavigate={onNavigate}
          className="capitalize hover:text-slate-900 dark:hover:text-white"
        >
          {tool.category}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-white font-medium truncate">{tool.name}</span>
      </nav>

      {/* Hero Block */}
      <ToolHero
        tool={tool}
        isFavorited={isFavorited}
        onToggleFavorite={async () => {
          await toggleFavorite(tool.slug);
          onToggleBookmark(tool.id);
        }}
        isCompared={isCompared}
        onToggleCompare={() => onToggleCompare(tool.id)}
        onCopyShareLink={handleCopyLink}
        copiedLink={copiedLink}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Overview, Radar, Specs, Pros/Cons */}
      <ToolOverview tool={tool} alternativesList={alternativesList} />

      {/* Pricing Analysis */}
      <ToolPricingSection tool={tool} />

      {/* FAQ Accordion */}
      <ToolFaqSection tool={tool} />

      {/* Related Guides */}
      {relatedGuides.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#2F5BFF]" />
              <span>Related Research &amp; Evaluation Guides</span>
            </h2>
            <Link
              href="/blog"
              onNavigate={onNavigate}
              className="text-xs font-semibold text-[#2F5BFF] hover:underline"
            >
              Browse all guides
            </Link>
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

      {/* Top Alternatives */}
      {alternativesList.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Direct Alternatives to {tool.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {alternativesList.map((alt) => (
              <Link
                key={alt.id}
                href={`/tools/${alt.slug}`}
                onNavigate={onNavigate}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all block"
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
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related Tools in Category */}
      {relatedTools.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              More Verified {tool.category.toUpperCase()} Tools
            </h2>
            <Link
              href={`/category/${tool.category}`}
              onNavigate={onNavigate}
              className="text-xs font-semibold text-[#2F5BFF] hover:underline"
            >
              View all in category
            </Link>
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
                onSelect={(toolSlug) => onNavigate(`/tools/${toolSlug}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Report Modal */}
      <ToolReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setReportError(null);
          setReportSuccess(false);
        }}
        tool={tool}
        user={user}
        signInWithGoogle={signInWithGoogle}
        reportReasonCategory={reportReasonCategory}
        setReportReasonCategory={setReportReasonCategory}
        reportDetails={reportDetails}
        setReportDetails={setReportDetails}
        isSubmittingReport={isSubmittingReport}
        reportSuccess={reportSuccess}
        reportError={reportError}
        onSubmitReport={handleReportSubmit}
      />
    </article>
  );
};
