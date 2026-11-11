import React, { useState, useEffect, useCallback } from 'react';
import {
  User as UserIcon,
  Heart,
  FileText,
  ShieldAlert,
  PlusCircle,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Tool } from '../types';
import { fetchUserCommunityTools } from '../lib/communityTools';
import { Link } from '../components/Link';

import { SavedToolsTab } from '../components/account/SavedToolsTab';
import { SubmissionsTab } from '../components/account/SubmissionsTab';
import { AccountSecurityTab } from '../components/account/AccountSecurityTab';

interface AccountPageProps {
  onNavigate: (path: string) => void;
  tools: Tool[];
  defaultTab?: 'saved' | 'submissions' | 'data';
}

export const AccountPage: React.FC<AccountPageProps> = ({
  onNavigate,
  tools,
  defaultTab = 'saved'
}) => {
  const {
    user,
    loading: authLoading,
    favorites,
    submissions: legacySubmissions,
    toggleFavorite,
    deleteAccountAndData,
    signInWithGoogle
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'saved' | 'submissions' | 'data'>(defaultTab);

  // Sync tab if defaultTab changes (e.g. URL route changed)
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  // User's Live Community Tools State
  const [userCommunityTools, setUserCommunityTools] = useState<Tool[]>([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState<boolean>(false);
  const [communityError, setCommunityError] = useState<string | null>(null);

  // Load User's Community Tools
  const loadUserTools = useCallback(async () => {
    if (!user) return;
    setIsLoadingCommunity(true);
    setCommunityError(null);
    try {
      const liveTools = await fetchUserCommunityTools(user.uid);
      setUserCommunityTools(liveTools);
    } catch (err: any) {
      console.error('Error fetching user community tools:', err);
      setCommunityError(err?.message || 'Could not load your submissions');
    } finally {
      setIsLoadingCommunity(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserTools();
    }
  }, [user, loadUserTools]);

  // Saved Tools from tools list
  const savedTools = tools.filter((t) => favorites.has(t.slug));

  // Authentication Loading State
  if (authLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2F5BFF] mx-auto mb-3" />
        <p className="text-xs text-slate-500">Checking authentication status...</p>
      </div>
    );
  }

  // Not Signed In State
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-[#2F5BFF]/10 text-[#2F5BFF] flex items-center justify-center mx-auto mb-4">
          <UserIcon className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Creator Account &amp; Dashboard
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          Sign in with Google to manage your saved tools, submit new software with instant publishing, and manage privacy settings.
        </p>

        <button
          onClick={async () => {
            await signInWithGoogle();
          }}
          className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          <span>Continue with Google</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Account Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Account'}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#2F5BFF]/30 shadow-xs"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#2F5BFF] text-white flex items-center justify-center text-xl font-bold uppercase shadow-xs">
                {user.displayName ? user.displayName.slice(0, 1) : 'U'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {user.displayName || 'Google Account'}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Creator
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1">
                UID: {user.uid.slice(0, 12)}...
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {favorites.size} saved tools · {userCommunityTools.length} published tools live
              </p>
            </div>
          </div>

          <Link
            href="/submit-tool"
            onNavigate={onNavigate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs shrink-0 self-start sm:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Submit a New Tool</span>
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs font-medium">
          <button
            onClick={() => {
              setActiveTab('saved');
              window.history.replaceState({}, '', '/account/saved');
            }}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'border-[#2F5BFF] text-[#2F5BFF] font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Saved Tools ({favorites.size})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('submissions');
              window.history.replaceState({}, '', '/account/submissions');
            }}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'submissions'
                ? 'border-[#2F5BFF] text-[#2F5BFF] font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>My Submissions ({userCommunityTools.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('data');
              window.history.replaceState({}, '', '/account');
            }}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'data'
                ? 'border-[#2F5BFF] text-[#2F5BFF] font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Account &amp; Data Deletion</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SAVED TOOLS */}
      {activeTab === 'saved' && (
        <SavedToolsTab
          savedTools={savedTools}
          onNavigate={onNavigate}
          toggleFavorite={toggleFavorite}
        />
      )}

      {/* TAB 2: MY SUBMISSIONS (LIVE IN DIRECTORY) */}
      {activeTab === 'submissions' && (
        <SubmissionsTab
          user={user}
          userCommunityTools={userCommunityTools}
          setUserCommunityTools={setUserCommunityTools}
          legacySubmissions={legacySubmissions}
          isLoadingCommunity={isLoadingCommunity}
          onNavigate={onNavigate}
          loadUserTools={loadUserTools}
        />
      )}

      {/* TAB 3: ACCOUNT & DATA DELETION */}
      {activeTab === 'data' && (
        <AccountSecurityTab
          user={user}
          deleteAccountAndData={deleteAccountAndData}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
