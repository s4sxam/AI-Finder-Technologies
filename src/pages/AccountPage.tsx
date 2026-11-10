import React, { useState, useEffect, useCallback } from 'react';
import {
  User as UserIcon,
  Heart,
  FileText,
  Trash2,
  ExternalLink,
  ShieldAlert,
  CheckCircle,
  PlusCircle,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Edit2,
  Sparkles,
  AlertTriangle,
  X,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Tool } from '../types';
import {
  fetchUserCommunityTools,
  updateCommunityTool,
  deleteCommunityTool,
  migrateLegacySubmissions
} from '../lib/communityTools';

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

  // Edit Modal State
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editShowSubmitter, setEditShowSubmitter] = useState(true);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete Confirmation State
  const [deletingTool, setDeletingTool] = useState<Tool | null>(null);
  const [isDeletingTool, setIsDeletingTool] = useState(false);
  const [deleteToolError, setDeleteToolError] = useState<string | null>(null);

  // Migration State
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);

  // Account Deletion State
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null);

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

  // Saved Tools from tools array
  const savedTools = tools.filter((t) => favorites.has(t.slug) || favorites.has(t.id));

  // Count unmigrated legacy submissions
  const unmigratedLegacyCount = legacySubmissions.filter((s) => !(s as any).migrated).length;

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#2F5BFF]" />
      </div>
    );
  }

  // Guest view - Prompt Sign In
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-800">
          <UserIcon className="w-7 h-7 text-[#2F5BFF]" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Sign In to Access Your Account
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          Sign in with your Google account to bookmark favorite AI tools, submit new software with instant publishing, and manage your directory submissions.
        </p>
        <button
          onClick={signInWithGoogle}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <svg className="w-4 h-4 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
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

  // Handle Edit Tool Submission
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTool || !editingTool.domainKey) return;

    if (editDescription.trim().length < 20 || editDescription.trim().length > 300) {
      setEditError('Description must be between 20 and 300 characters.');
      return;
    }

    setIsSavingEdit(true);
    setEditError(null);

    try {
      const parsedTags = editTags
        .split(/[,\s]+/)
        .map((t) => t.trim().toLowerCase().replace(/[^a-z0-9-]/g, ''))
        .filter(Boolean)
        .slice(0, 10);

      await updateCommunityTool(
        editingTool.domainKey,
        {
          description: editDescription.trim(),
          tags: parsedTags,
          showSubmitter: editShowSubmitter
        },
        user
      );

      // Update local state
      setUserCommunityTools((prev) =>
        prev.map((t) =>
          t.domainKey === editingTool.domainKey
            ? {
                ...t,
                description: editDescription.trim(),
                tagline: editDescription.trim(),
                tags: parsedTags,
                showSubmitter: editShowSubmitter
              }
            : t
        )
      );

      setEditingTool(null);
    } catch (err: any) {
      setEditError(err?.message || 'Failed to update tool.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Handle Delete Community Tool
  const handleConfirmDeleteTool = async () => {
    if (!deletingTool || !deletingTool.domainKey) return;
    setIsDeletingTool(true);
    setDeleteToolError(null);

    try {
      await deleteCommunityTool(deletingTool.domainKey, user);
      setUserCommunityTools((prev) => prev.filter((t) => t.domainKey !== deletingTool.domainKey));
      setDeletingTool(null);
    } catch (err: any) {
      setDeleteToolError(err?.message || 'Failed to delete tool.');
    } finally {
      setIsDeletingTool(false);
    }
  };

  // Handle One-Time Migration of Earlier Submissions
  const handleMigrateEarlierSubmissions = async () => {
    setIsMigrating(true);
    setMigrationStatus(null);
    try {
      const res = await migrateLegacySubmissions(user);
      setMigrationStatus(
        `Successfully published ${res.migratedCount} earlier submission${res.migratedCount === 1 ? '' : 's'} live to the directory!`
      );
      await loadUserTools();
    } catch (err: any) {
      setMigrationStatus(`Migration notice: ${err?.message || 'Could not complete migration'}`);
    } finally {
      setIsMigrating(false);
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    setDeleteAccountError(null);
    try {
      await deleteAccountAndData();
      setDeleteConfirmOpen(false);
      onNavigate('/');
    } catch (err: any) {
      setDeleteAccountError(err?.message || 'Failed to delete account. Please try again.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

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

          <button
            onClick={() => onNavigate('/submit-tool')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs shrink-0 self-start sm:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Submit a New Tool</span>
          </button>
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
        <section aria-label="Saved AI Tools">
          {savedTools.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
              <Heart className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                No Saved Tools Yet
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
                Click the heart icon on any tool card across the directory or benchmarks to save tools here for rapid access.
              </p>
              <button
                onClick={() => onNavigate('/tools')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-md hover:bg-slate-800 transition-colors"
              >
                <span>Explore Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedTools.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ backgroundColor: tool.accentColor }}
                        >
                          {tool.monogram}
                        </div>
                        <div>
                          <button
                            onClick={() => onNavigate(`/tools/${tool.slug}`)}
                            className="font-bold text-xs text-slate-900 dark:text-white hover:text-[#2F5BFF] transition-colors text-left"
                          >
                            {tool.name}
                          </button>
                          <p className="text-[10px] text-slate-500 capitalize">
                            {tool.pricing} · {tool.category}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFavorite(tool.slug)}
                        className="p-1.5 text-rose-500 hover:text-rose-600 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Remove from saved"
                        aria-label={`Remove ${tool.name} from saved`}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                      {tool.tagline}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="nofollow ugc noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-[#2F5BFF]"
                    >
                      <span>Visit Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => onNavigate(`/tools/${tool.slug}`)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2F5BFF] hover:underline"
                    >
                      <span>View Specs</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: MY SUBMISSIONS (LIVE IN DIRECTORY) */}
      {activeTab === 'submissions' && (
        <section aria-label="My Tool Submissions" className="space-y-6">
          {/* Legacy Migration Banner if any older submissions exist */}
          {legacySubmissions.length > 0 && (
            <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2F5BFF]" />
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Earlier Submissions Available
                  </p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  You have {legacySubmissions.length} earlier tool submissions. Click to publish them live to the public directory immediately without review.
                </p>
                {migrationStatus && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1.5">
                    {migrationStatus}
                  </p>
                )}
              </div>

              <button
                onClick={handleMigrateEarlierSubmissions}
                disabled={isMigrating}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-lg transition-colors shrink-0 disabled:opacity-50"
              >
                {isMigrating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Publishing Live...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Publish my earlier submissions</span>
                  </>
                )}
              </button>
            </div>
          )}

          {isLoadingCommunity ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <Loader2 className="w-6 h-6 animate-spin text-[#2F5BFF] mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading your live submissions...</p>
            </div>
          ) : userCommunityTools.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
              <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                No Community Tools Published Yet
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
                When you submit an AI tool, it goes live immediately for everyone to discover on AI Finder. No waiting for editorial review.
              </p>
              <button
                onClick={() => onNavigate('/submit-tool')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-md transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Publish a Tool Now</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userCommunityTools.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs text-white shrink-0"
                        style={{ backgroundColor: tool.accentColor }}
                      >
                        {tool.monogram}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {tool.name}
                      </h3>

                      {/* Live Status Badge with Pulse Indicator */}
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Live in Directory</span>
                      </span>

                      <span className="text-[11px] text-slate-500 font-mono">
                        Key: {tool.domainKey}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 max-w-2xl leading-relaxed">
                      {tool.description}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2 flex-wrap">
                      <span className="capitalize font-medium text-slate-700 dark:text-slate-300">{tool.category}</span>
                      <span>·</span>
                      <span>{tool.pricing}</span>
                      <span>·</span>
                      <span>Added on {tool.createdAt ? new Date(tool.createdAt).toLocaleDateString() : 'Recent'}</span>
                      {tool.tags && tool.tags.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-slate-400">Tags: {tool.tags.join(', ')}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions: View Live, Edit, Delete */}
                  <div className="flex items-center gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => onNavigate(`/tools/${tool.slug}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                      title="Open public tool page"
                    >
                      <span>View Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => {
                        setEditingTool(tool);
                        setEditDescription(tool.description);
                        setEditTags(tool.tags.join(', '));
                        setEditShowSubmitter(tool.showSubmitter !== false);
                        setEditError(null);
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
                      title="Edit description and tags"
                      aria-label={`Edit ${tool.name}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setDeletingTool(tool);
                        setDeleteToolError(null);
                      }}
                      className="p-1.5 text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 rounded-md border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete tool listing"
                      aria-label={`Delete ${tool.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 3: ACCOUNT & DATA DELETION */}
      {activeTab === 'data' && (
        <section aria-label="Account & Data Management" className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Privacy &amp; Data Transparency
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              AI Finder Technologies complies with strict data minimization principles. Below is an exact accounting of what information is stored:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-white mb-1">
                  Stored Public Identity
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Google UID, Display Name, Profile Photo URL. Your email address is never stored in public directories or documents.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-white mb-1">
                  Activity Data
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Saved tool slugs (stored privately under your UID) and any live community tools you have published.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-xl p-6">
            <h2 className="text-base font-bold text-rose-900 dark:text-rose-200 mb-1">
              Delete Account &amp; Stored Data
            </h2>
            <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed mb-4">
              Permanently delete your profile, bookmarked tools, your submitted community tools, and remove your Google authorization. This action is irreversible.
            </p>

            {deleteAccountError && (
              <div className="p-3 bg-rose-100 dark:bg-rose-900/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs rounded-md mb-4">
                {deleteAccountError}
              </div>
            )}

            {!deleteConfirmOpen ? (
              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-md transition-colors shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete my account and data</span>
              </button>
            ) : (
              <div className="p-4 bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-lg max-w-lg">
                <p className="text-xs font-semibold text-slate-900 dark:text-white mb-2">
                  Are you absolutely sure you want to delete your account?
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  All your saved favorites and all community tools published under your UID will be permanently deleted from Firestore. If your session has expired, Google will prompt you to verify credentials one final time before account termination.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeletingAccount}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-md transition-colors disabled:opacity-50"
                  >
                    {isDeletingAccount ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    <span>Confirm Permanent Deletion</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmOpen(false)}
                    disabled={isDeletingAccount}
                    className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* --- EDIT MODAL --- */}
      {editingTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setEditingTool(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
              aria-label="Close edit modal"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Edit &quot;{editingTool.name}&quot;
            </h2>
            <p className="text-xs text-slate-500 mb-4 font-mono">
              Key: {editingTool.domainKey}
            </p>

            {editError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs rounded-md mb-4">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-900 dark:text-white">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {editDescription.length}/300 (min 20)
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  maxLength={300}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2F5BFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1">
                  Tags (comma or space separated)
                </label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="e.g. coding, rust, llm"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2F5BFF]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editShowSubmitter"
                  checked={editShowSubmitter}
                  onChange={(e) => setEditShowSubmitter(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#2F5BFF] focus:ring-[#2F5BFF]"
                />
                <label htmlFor="editShowSubmitter" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  Show my creator name on public tool page
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTool(null)}
                  className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit || editDescription.trim().length < 20}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-md transition-colors disabled:opacity-50"
                >
                  {isSavingEdit && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE TOOL CONFIRMATION MODAL --- */}
      {deletingTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 mb-3 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Delete &quot;{deletingTool.name}&quot;?
              </h2>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              This will permanently remove the tool from the public AI Finder directory, search index, and category hubs.
            </p>

            {deleteToolError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs rounded-md mb-4">
                {deleteToolError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingTool(null)}
                className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:underline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTool}
                disabled={isDeletingTool}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-md transition-colors disabled:opacity-50"
              >
                {isDeletingTool && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Tool</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
