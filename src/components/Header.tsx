import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Moon,
  Sun,
  Bookmark,
  Heart,
  PlusCircle,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Menu,
  X,
  FileText,
  Shield,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
  const { user, loading: authLoading, authError, signInWithGoogle, logout, favorites, clearAuthError } = useAuth();
  const [showBrandGuide, setShowBrandGuide] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
    await logout();
  };

  const totalFavoritesCount = favorites.size > 0 ? favorites.size : bookmarkCount;

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#2F5BFF] focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none text-xs font-semibold"
      >
        Skip to main content
      </a>

      {/* Auth error notification banner if applicable */}
      {authError && (
        <div className="bg-amber-50 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 px-4 py-2 text-xs flex items-center justify-between z-50">
          <span>{authError}</span>
          <button
            onClick={clearAuthError}
            className="text-amber-700 dark:text-amber-300 hover:underline font-semibold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 transition-colors backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
          
          {/* Zone 1: Logo & brand */}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onNavigate('/');
            }}
            className="flex items-center gap-3 text-left whitespace-nowrap shrink-0 group focus:outline-none"
            aria-label="AI Finder Technologies Home"
          >
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
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden xs:inline">
                Technologies
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
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

          {/* Zone 3: Actions (Search, Favorites, Theme, Google Auth, Submit) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Cmd+K Search Trigger */}
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:border-slate-300 dark:hover:border-slate-700 transition-colors whitespace-nowrap"
              aria-label="Open search command palette (Ctrl+K or Cmd+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search tools...</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-500">
                ⌘K
              </kbd>
            </button>

            {/* Favorites / Bookmarks Link */}
            <button
              onClick={() => {
                if (user) {
                  onNavigate('/account/saved');
                } else {
                  onNavigate('/tools?bookmarked=true');
                }
              }}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              title={user ? `${favorites.size} saved favorites` : `${totalFavoritesCount} saved tools`}
              aria-label="View saved tools"
            >
              <Heart className={`w-4 h-4 ${totalFavoritesCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
              {totalFavoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[9px] font-bold bg-[#2F5BFF] text-white rounded-full flex items-center justify-center">
                  {totalFavoritesCount}
                </span>
              )}
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Submit Tool Button */}
            <button
              onClick={() => onNavigate('/submit-tool')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#2F5BFF] hover:bg-[#1E46E6] rounded-md transition-colors whitespace-nowrap shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Submit Tool</span>
            </button>

            {/* Google Authentication Section */}
            {authLoading ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              </div>
            ) : user ? (
              /* Authenticated User Dropdown */
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#2F5BFF]/30 transition-all focus:outline-none"
                  aria-expanded={isUserMenuOpen}
                  aria-label="User account menu"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Account'}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#2F5BFF] text-white flex items-center justify-center text-xs font-bold uppercase">
                      {user.displayName ? user.displayName.slice(0, 1) : 'U'}
                    </div>
                  )}
                  <ChevronDown className="w-3 h-3 text-slate-500 hidden sm:inline" />
                </button>

                {/* Dropdown Menu Card */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 text-xs z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {user.displayName || 'Google Account'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        Verified Creator
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate('/account/saved');
                        }}
                        className="w-full text-left px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Heart className="w-3.5 h-3.5 text-rose-500" />
                          Saved Tools
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {favorites.size}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate('/account/submissions');
                        }}
                        className="w-full text-left px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#2F5BFF]" />
                        My Submissions
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate('/account');
                        }}
                        className="w-full text-left px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                        Account &amp; Privacy
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Sign In With Google Button */
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs disabled:opacity-60"
              >
                {isSigningIn ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2F5BFF]" />
                ) : (
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span className="hidden xs:inline">Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 px-4 pt-3 pb-5 space-y-2 text-sm backdrop-blur-md">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('/tools');
              }}
              className="w-full text-left py-2 px-3 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium"
            >
              Directory
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('/benchmarks');
              }}
              className="w-full text-left py-2 px-3 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium flex items-center justify-between"
            >
              <span>Live Benchmarks</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('/free-apis');
              }}
              className="w-full text-left py-2 px-3 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium"
            >
              Free APIs Hub
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('/compare');
              }}
              className="w-full text-left py-2 px-3 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium"
            >
              Compare Matrix
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('/blog');
              }}
              className="w-full text-left py-2 px-3 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium"
            >
              Research &amp; Guides
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('/submit-tool');
              }}
              className="w-full text-left py-2 px-3 rounded-md bg-[#2F5BFF] text-white font-medium flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Submit AI Tool
            </button>

            {user && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/account/submissions');
                  }}
                  className="w-full text-left py-2 px-3 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-[#2F5BFF]" />
                  My Submissions
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/account');
                  }}
                  className="w-full text-left py-2 px-3 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-slate-500" />
                  Account &amp; Saved Tools ({favorites.size})
                </button>
                <button
                  onClick={async () => {
                    setIsMobileMenuOpen(false);
                    await logout();
                  }}
                  className="w-full text-left py-2 px-3 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Brand Guide Modal */}
      {showBrandGuide && (
        <BrandGuideModal onClose={() => setShowBrandGuide(false)} />
      )}
    </>
  );
};
