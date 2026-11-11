import React, { useState, useMemo } from 'react';
import { ArrowLeft, Clock, Calendar, User, Share2, Check, ExternalLink, Bookmark, ShieldCheck, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { BLOG_POSTS } from '../data/blogPosts';
import { AI_TOOLS } from '../data/tools';
import { BlogPost, Tool } from '../types';
import { safeJsonLd } from '../lib/safeJsonLd';
import { SITE_URL } from '../lib/constants';
import { Link } from '../components/Link';

interface BlogPostPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  onSelectTool: (slug: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onNavigate, onSelectTool }) => {
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Article Not Found</h1>
        <p className="text-xs text-slate-500">
          The requested benchmark article slug &quot;{slug}&quot; could not be found.
        </p>
        <button
          onClick={() => onNavigate('/blog')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#2F5BFF] rounded-md"
        >
          Return to Blog Index
        </button>
      </div>
    );
  }

  // Related Tools mentioned in the post
  const relatedTools: Tool[] = post.relatedToolSlugs
    .map((slug) => AI_TOOLS.find((t) => t.slug === slug))
    .filter((t): t is Tool => !!t);

  // Other blog posts
  const otherPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Schema.org BlogPosting & FAQPage JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.description,
    'datePublished': post.date,
    'dateModified': post.updated,
    'author': {
      '@type': 'Person',
      'name': post.author.name,
      'jobTitle': post.author.role
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'AI Finder Technologies',
      'url': SITE_URL
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`
    }
  };

  const parsedHtml = useMemo(() => {
    const raw = marked.parse(post.content, { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [post.content]);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': post.faqs.map((f) => ({
      '@type': 'Question',
      'name': f.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.answer
      }
    }))
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Schema.org Injections */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
        <Link href="/" onNavigate={onNavigate} className="hover:text-slate-900 dark:hover:text-white">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/blog" onNavigate={onNavigate} className="hover:text-slate-900 dark:hover:text-white">
          Blog
        </Link>
        <span aria-hidden="true">/</span>
        <span className="capitalize hover:text-slate-900 dark:hover:text-white">{post.category}</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">{post.title}</span>
      </nav>

      {/* Article Header */}
      <header className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        {/* Zero-Pill Unboxed Metadata */}
        <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-[#2F5BFF] uppercase tracking-wider text-[11px]">
            {post.category} Guide
          </span>
          <span aria-hidden="true">·</span>
          <span>{post.readTimeMinutes} min read</span>
          <span aria-hidden="true">·</span>
          <span>Target Keyword: <code className="font-mono text-slate-700 dark:text-slate-300">&quot;{post.targetKeyword}&quot;</code></span>
          <span aria-hidden="true">·</span>
          <span>Intent: {post.searchIntent}</span>
        </div>

        {/* Primary H1 Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.18] text-balance">
          {post.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {post.description}
        </p>

        {/* Author Bio Bar & Share triggers */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white flex items-center justify-center border border-slate-300 dark:border-slate-700">
              {post.author.avatar}
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{post.author.name}</div>
              <div className="text-[11px] text-slate-500">{post.author.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px]">Published: {post.date}</span>
            <span>·</span>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 text-[#2F5BFF] hover:underline font-medium"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied' : 'Share Article'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Auto Table of Contents */}
      <section className="p-5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
        <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
          Table of Contents
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
          {post.outline.map((item, i) => (
            <li key={i} className="flex items-start gap-1.5 hover:text-[#2F5BFF] transition-colors">
              <span className="text-[#2F5BFF] font-mono font-medium text-[11px]">0{i + 1}.</span>
              <span className="line-clamp-1">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Article Body Prose */}
      <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-6">
        <div
          className="markdown-rendered space-y-4"
          dangerouslySetInnerHTML={{ __html: parsedHtml }}
        />
      </div>

      {/* CTA Box to Relevant Tools Mentioned */}
      {relatedTools.length > 0 && (
        <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              AI Tools Evaluated in This Guide
            </h3>
            <span className="text-xs text-slate-500 font-mono">{relatedTools.length} tools</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onSelectTool(tool.slug)}
                className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-[#2F5BFF] transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0"
                    style={{ backgroundColor: tool.accentColor }}
                  >
                    {tool.monogram}
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{tool.name}</span>
                      <span className="text-[11px] text-slate-500 font-normal">· {tool.pricing}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {tool.tagline}
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Block with Accordion */}
      {post.faqs.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Editorial FAQ &amp; Guidance
          </h2>
          <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            {post.faqs.map((faq, idx) => {
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

      {/* Related Posts */}
      <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Related Benchmark Guides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {otherPosts.map((other) => (
            <div
              key={other.id}
              onClick={() => onNavigate(`/blog/${other.slug}`)}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
            >
              <div className="text-[11px] text-slate-400 capitalize mb-1">
                {other.category} · {other.readTimeMinutes} min read
              </div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 mb-2">
                {other.title}
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                {other.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
};
