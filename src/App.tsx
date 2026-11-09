import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';
import { ComparisonDrawer } from './components/ComparisonDrawer';
import { HomePage } from './pages/HomePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { BlogIndexPage } from './pages/BlogIndexPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ComparePage } from './pages/ComparePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { SubmitToolPage } from './pages/SubmitToolPage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AI_TOOLS } from './data/tools';
import { BLOG_POSTS } from './data/blogPosts';
import { Tool, ToolCategory, PricingType } from './types';

// Route-level code-splitting for heavy 3D Nexus page
const Nexus3DPage = React.lazy(() =>
  import('./pages/Nexus3DPage').then((m) => ({ default: m.Nexus3DPage }))
);

export default function App() {
  // Current route pathname and search
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [currentSearch, setCurrentSearch] = useState<string>(() => {
    return window.location.search || '';
  });

  // Dark Mode with System Preference default and localStorage persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('aifinder_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Saved Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aifinder_bookmarks');
      return saved ? JSON.parse(saved) : ['tool-cursor', 'tool-claude'];
    } catch {
      return ['tool-cursor', 'tool-claude'];
    }
  });

  // Comparison Tool Selection (Max 3)
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Command Palette Open State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Sync dark mode class on documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('aifinder_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('aifinder_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aifinder_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.warn('Could not save bookmarks to localStorage', e);
    }
  }, [bookmarkedIds]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setCurrentSearch(window.location.search || '');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global Cmd/Ctrl+K keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Programmatic navigation handler
  const handleNavigate = (to: string) => {
    const [path, search] = to.split('?');
    setCurrentPath(path || '/');
    setCurrentSearch(search ? `?${search}` : '');
    window.history.pushState({}, '', to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // URL query parameter updater
  const handleUpdateUrlParams = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) searchParams.set(k, v);
    });
    const newSearch = searchParams.toString() ? `?${searchParams.toString()}` : '';
    setCurrentSearch(newSearch);
    window.history.replaceState({}, '', `${currentPath}${newSearch}`);
  };

  const handleToggleBookmark = (toolId: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const handleToggleCompare = (toolId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(toolId)) {
        return prev.filter((id) => id !== toolId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), toolId];
      }
      return [...prev, toolId];
    });
  };

  const handleRemoveCompare = (toolId: string) => {
    setCompareIds((prev) => prev.filter((id) => id !== toolId));
  };

  const handleClearCompare = () => {
    setCompareIds([]);
  };

  // Selected tool objects for comparison drawer
  const selectedCompareTools = compareIds
    .map((id) => AI_TOOLS.find((t) => t.id === id))
    .filter((t): t is Tool => !!t);

  // Parse query parameters
  const searchParams = new URLSearchParams(currentSearch);
  const qParam = searchParams.get('q') || '';
  const categoryParam = (searchParams.get('category') || 'all') as ToolCategory | 'all';
  const pricingParam = (searchParams.get('pricing') || 'all') as PricingType | 'all';
  const freeTierParam = searchParams.get('freeTier') === 'true';
  const sortParam = (searchParams.get('sort') || 'trending') as 'trending' | 'rating' | 'newest' | 'alphabetical';
  const bookmarkedParam = searchParams.get('bookmarked') === 'true';
  const intentParam = searchParams.get('intent') || '';

  // Dynamic Page Title & Meta Description update for SEO
  useEffect(() => {
    let title = 'AI Finder Technologies – Premier Directory of AI Tools & Benchmarks';
    let description = 'Discover, compare, and master premier AI tools for coding, writing, research, visual creation, and workflow automation.';

    if (currentPath === '/tools') {
      title = 'AI Tools Directory – Browse All 60+ Verified Software | AI Finder';
      description = 'Filter and compare 60+ verified AI applications across developer tools, foundation reasoning, generative video, and academic search.';
    } else if (currentPath.startsWith('/tools/')) {
      const slug = currentPath.replace('/tools/', '');
      const tool = AI_TOOLS.find((t) => t.slug === slug);
      if (tool) {
        title = `${tool.name} Review, Pricing & Alternatives (2026) | AI Finder`;
        description = `${tool.tagline} Verified ratings, specifications, pros & cons, and key alternatives.`;
      }
    } else if (currentPath.startsWith('/category/')) {
      const slug = currentPath.replace('/category/', '');
      title = `Best AI ${slug.toUpperCase()} Tools in 2026 | AI Finder Technologies`;
      description = `Curated and tested artificial intelligence tools for ${slug}.`;
    } else if (currentPath === '/blog') {
      title = 'AI Research Benchmarks & Editorial Guides | AI Finder';
      description = 'Original, non-sponsored investigations and comparative benchmarks for developers and researchers.';
    } else if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '');
      const post = BLOG_POSTS.find((p) => p.slug === slug);
      if (post) {
        title = `${post.title} | AI Finder`;
        description = post.description;
      }
    } else if (currentPath === '/compare') {
      title = 'AI Tool Comparison Matrix | AI Finder Technologies';
      description = 'Compare top artificial intelligence software side by side across pricing, platforms, and capabilities.';
    } else if (currentPath === '/about') {
      title = 'About AI Finder Technologies – Independence & Methodology';
      description = 'Our 4-stage evaluation framework, zero-sponsored ranking guarantee, and research team.';
    } else if (currentPath === '/contact') {
      title = 'Contact & Editorial Inquiries | AI Finder Technologies';
      description = 'Reach out to our independent research team or challenge benchmark data.';
    } else if (currentPath === '/submit') {
      title = 'Submit an AI Tool for Evaluation | AI Finder Technologies';
      description = 'Submit a new artificial intelligence tool for independent verification, benchmarks, and inclusion in our directory.';
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
  }, [currentPath]);

  // Route Rendering Logic
  const renderRoute = () => {
    // 1. Home Page
    if (currentPath === '/' || currentPath === '') {
      return (
        <HomePage
          onNavigate={handleNavigate}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={handleToggleBookmark}
          compareIds={compareIds}
          onToggleCompare={handleToggleCompare}
        />
      );
    }

    // 2. Directory Page
    if (currentPath === '/tools') {
      return (
        <DirectoryPage
          initialSearch={qParam}
          initialCategory={categoryParam}
          initialPricing={pricingParam}
          initialOnlyBookmarked={bookmarkedParam}
          initialOnlyFreeTier={freeTierParam}
          initialSort={sortParam}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={handleToggleBookmark}
          compareIds={compareIds}
          onToggleCompare={handleToggleCompare}
          onSelectTool={(slug) => handleNavigate(`/tools/${slug}`)}
          onUpdateUrlParams={handleUpdateUrlParams}
        />
      );
    }

    // 3. Tool Detail Page: /tools/[slug]
    if (currentPath.startsWith('/tools/')) {
      const slug = currentPath.replace('/tools/', '');
      return (
        <ToolDetailPage
          slug={slug}
          onNavigate={handleNavigate}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={handleToggleBookmark}
          compareIds={compareIds}
          onToggleCompare={handleToggleCompare}
        />
      );
    }

    // 4. Categories Hub: /categories
    if (currentPath === '/categories') {
      return (
        <CategoriesPage
          onNavigate={handleNavigate}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={handleToggleBookmark}
          compareIds={compareIds}
          onToggleCompare={handleToggleCompare}
          onSelectTool={(slug) => handleNavigate(`/tools/${slug}`)}
        />
      );
    }

    // 5. Single Category View: /category/[slug]
    if (currentPath.startsWith('/category/')) {
      const catSlug = currentPath.replace('/category/', '');
      return (
        <CategoriesPage
          currentCategorySlug={catSlug}
          onNavigate={handleNavigate}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={handleToggleBookmark}
          compareIds={compareIds}
          onToggleCompare={handleToggleCompare}
          onSelectTool={(slug) => handleNavigate(`/tools/${slug}`)}
        />
      );
    }

    // 6. Blog Index: /blog
    if (currentPath === '/blog') {
      return (
        <BlogIndexPage
          onNavigate={handleNavigate}
          onSelectPost={(slug) => handleNavigate(`/blog/${slug}`)}
        />
      );
    }

    // 7. Blog Detail: /blog/[slug]
    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '');
      return (
        <BlogPostPage
          slug={slug}
          onNavigate={handleNavigate}
          onSelectTool={(toolSlug) => handleNavigate(`/tools/${toolSlug}`)}
        />
      );
    }

    // 8. Compare Matrix: /compare
    if (currentPath === '/compare') {
      return (
        <ComparePage
          onNavigate={handleNavigate}
          onSelectTool={(slug) => handleNavigate(`/tools/${slug}`)}
          initialToolSlugs={selectedCompareTools.map((t) => t.slug)}
        />
      );
    }

    // 9. About Page: /about
    if (currentPath === '/about') {
      return <AboutPage onNavigate={handleNavigate} />;
    }

    // 10. Contact Page: /contact
    if (currentPath === '/contact') {
      return <ContactPage onNavigate={handleNavigate} initialIntent={intentParam} />;
    }

    // 11. Submit a Tool Page: /submit
    if (currentPath === '/submit') {
      return <SubmitToolPage onNavigate={handleNavigate} />;
    }

    // 12. Privacy & Terms: /privacy, /terms
    if (currentPath === '/privacy') {
      return <LegalPage onNavigate={handleNavigate} defaultTab="privacy" />;
    }
    if (currentPath === '/terms') {
      return <LegalPage onNavigate={handleNavigate} defaultTab="terms" />;
    }

    // 13. Dedicated 3D Nexus Spatial Playground: /nexus-3d (Lazy loaded)
    if (currentPath === '/nexus-3d') {
      return (
        <React.Suspense
          fallback={
            <div className="h-[80vh] flex items-center justify-center bg-slate-950 text-slate-400 text-xs font-mono">
              Loading 3D Spatial Nexus...
            </div>
          }
        >
          <Nexus3DPage
            onNavigate={handleNavigate}
            onSelectCategory={(cat) => handleNavigate(`/category/${cat}`)}
          />
        </React.Suspense>
      );
    }

    // 14. Fallback 404
    return <NotFoundPage onNavigate={handleNavigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* 3-Zone Header */}
      <Header
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        bookmarkCount={bookmarkedIds.length}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {renderRoute()}
      </main>

      {/* Persistent Floating Compare Drawer (Visible when >= 1 tools selected) */}
      <ComparisonDrawer
        selectedTools={selectedCompareTools}
        onRemoveTool={handleRemoveCompare}
        onClearAll={handleClearCompare}
        onSelectTool={(slug) => handleNavigate(`/tools/${slug}`)}
      />

      {/* Global Cmd+K Search Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTool={(slug) => handleNavigate(`/tools/${slug}`)}
        onSelectBlog={(slug) => handleNavigate(`/blog/${slug}`)}
        onSelectCategory={(cat) => handleNavigate(`/category/${cat}`)}
      />

      {/* Quiet Authority Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
