import React, { useState, useEffect, useMemo } from 'react';
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
import { AccountPage } from './pages/AccountPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthProvider } from './context/AuthContext';
import { AI_TOOLS } from './data/tools';
import { BLOG_POSTS } from './data/blogPosts';
import { Tool, ToolCategory, PricingType } from './types';
import { subscribeToCommunityModels } from './lib/modelsService';

// Route-level code-splitting for heavy pages
const Nexus3DPage = React.lazy(() =>
  import('./pages/Nexus3DPage').then((m) => ({ default: m.Nexus3DPage }))
);
const BenchmarksPage = React.lazy(() =>
  import('./pages/BenchmarksPage').then((m) => ({ default: m.BenchmarksPage }))
);
const FreeApisIndexPage = React.lazy(() =>
  import('./pages/FreeApisIndexPage').then((m) => ({ default: m.FreeApisIndexPage }))
);
const FreeApiDetailPage = React.lazy(() =>
  import('./pages/FreeApiDetailPage').then((m) => ({ default: m.FreeApiDetailPage }))
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

  // Community Uploaded Models Streamed from Firebase Firestore
  const [communityModels, setCommunityModels] = useState<Tool[]>([]);

  // Real-time Firestore subscription: anyone can upload without touching source code
  useEffect(() => {
    const unsubscribe = subscribeToCommunityModels(
      (models) => {
        setCommunityModels(models);
      },
      (err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn('Real-time models subscription notice:', msg);
      }
    );
    return () => unsubscribe();
  }, []);

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

  // Unified tool list merging static registry + live Firestore community uploads
  const allTools = useMemo(() => {
    if (communityModels.length === 0) return AI_TOOLS;
    const staticSlugs = new Set(AI_TOOLS.map((t) => t.slug));
    const newFromCommunity = communityModels.filter((t) => !staticSlugs.has(t.slug));
    return [...AI_TOOLS, ...newFromCommunity];
  }, [communityModels]);

  // Selected tool objects for comparison drawer
  const selectedCompareTools = compareIds
    .map((id) => allTools.find((t) => t.id === id))
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
      title = `AI Tools Directory – Browse All ${allTools.length}+ Verified Software | AI Finder`;
      description = 'Filter and compare verified AI applications across developer tools, foundation reasoning, generative video, and academic search.';
    } else if (currentPath.startsWith('/tools/')) {
      const slug = currentPath.replace('/tools/', '');
      const tool = allTools.find((t) => t.slug === slug);
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
    } else if (currentPath === '/benchmarks') {
      title = 'Live AI Model Benchmarks & Intelligence Index | AI Finder';
      description = 'Real-world comparative data across reasoning indexes, coding speed (tokens/sec), and token pricing economics. Sourced from Artificial Analysis & OpenRouter.';
    } else if (currentPath === '/free-apis') {
      title = 'Free AI APIs & Legitimate Developer Key Setup Hub (2026) | AI Finder';
      description = 'Official verified tutorials on obtaining zero-cost API keys for Google Gemini, Groq, Cerebras, Mistral, OpenRouter, and NVIDIA NIM without credit cards.';
    } else if (currentPath.startsWith('/free-apis/')) {
      const providerId = currentPath.replace('/free-apis/', '');
      title = `How to Get a Free ${providerId.toUpperCase()} API Key | AI Finder`;
      description = 'Step-by-step verified tutorial to configure environment variables, test with cURL, and copy-paste code snippets.';
    } else if (currentPath === '/submit' || currentPath === '/submit-tool') {
      title = 'Submit an AI Tool for Evaluation | AI Finder Technologies';
      description = 'Submit a new artificial intelligence tool for independent verification, benchmarks, and inclusion in our directory.';
    } else if (currentPath === '/account' || currentPath === '/account/saved') {
      title = 'Account & Saved Tools | AI Finder Technologies';
      description = 'Manage your saved AI tools, track submitted software reviews, and configure account privacy settings.';
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
          tools={allTools}
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
          tools={allTools}
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
          tools={allTools}
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
          tools={allTools}
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
          tools={allTools}
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
          tools={allTools}
        />
      );
    }

    // 9. Live Benchmarks Matrix: /benchmarks
    if (currentPath === '/benchmarks') {
      return (
        <React.Suspense
          fallback={
            <div className="h-[60vh] flex items-center justify-center text-xs font-mono text-slate-400">
              Loading Live Benchmarks Matrix...
            </div>
          }
        >
          <BenchmarksPage onNavigate={handleNavigate} tools={allTools} />
        </React.Suspense>
      );
    }

    // 10. Free AI API Keys Hub: /free-apis
    if (currentPath === '/free-apis') {
      return (
        <React.Suspense
          fallback={
            <div className="h-[60vh] flex items-center justify-center text-xs font-mono text-slate-400">
              Loading Free AI API Keys Hub...
            </div>
          }
        >
          <FreeApisIndexPage
            onNavigate={handleNavigate}
            onSelectProvider={(id) => handleNavigate(`/free-apis/${id}`)}
          />
        </React.Suspense>
      );
    }

    // 11. Free AI API Provider Guide: /free-apis/[provider]
    if (currentPath.startsWith('/free-apis/')) {
      const providerId = currentPath.replace('/free-apis/', '');
      return (
        <React.Suspense
          fallback={
            <div className="h-[60vh] flex items-center justify-center text-xs font-mono text-slate-400">
              Loading Provider Setup Guide...
            </div>
          }
        >
          <FreeApiDetailPage providerId={providerId} onNavigate={handleNavigate} />
        </React.Suspense>
      );
    }

    // 12. About Page: /about
    if (currentPath === '/about') {
      return <AboutPage onNavigate={handleNavigate} />;
    }

    // 13. Contact Page: /contact
    if (currentPath === '/contact') {
      return <ContactPage onNavigate={handleNavigate} initialIntent={intentParam} />;
    }

    // 14. Submit a Tool Page: /submit or /submit-tool
    if (currentPath === '/submit' || currentPath === '/submit-tool') {
      return <SubmitToolPage onNavigate={handleNavigate} communityModels={communityModels} />;
    }

    // 15. Privacy & Terms: /privacy, /terms
    if (currentPath === '/privacy') {
      return <LegalPage onNavigate={handleNavigate} defaultTab="privacy" />;
    }
    if (currentPath === '/terms') {
      return <LegalPage onNavigate={handleNavigate} defaultTab="terms" />;
    }

    // 16. User Account & Saved Tools: /account, /account/saved
    if (currentPath === '/account' || currentPath === '/account/saved') {
      const defaultTab = currentPath === '/account/saved' ? 'saved' : 'saved';
      return (
        <AccountPage
          onNavigate={handleNavigate}
          tools={allTools}
          defaultTab={defaultTab}
        />
      );
    }

    // 16. Dedicated 3D Nexus Spatial Playground: /nexus-3d (Lazy loaded)
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

    // 17. Fallback 404
    return <NotFoundPage onNavigate={handleNavigate} />;
  };

  return (
    <AuthProvider>
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
          onNavigate={handleNavigate}
          tools={allTools}
        />

        {/* Quiet Authority Footer */}
        <Footer onNavigate={handleNavigate} />
      </div>
    </AuthProvider>
  );
}
