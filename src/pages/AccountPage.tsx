import React, { useState } from 'react';
import {
  User as UserIcon,
  Heart,
  FileText,
  Trash2,
  ExternalLink,
  ShieldAlert,
  CheckCircle,
  Clock,
  XCircle,
  PlusCircle,
  ArrowRight,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Tool } from '../types';

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
    loading,
    favorites,
    submissions,
    toggleFavorite,
    deleteAccountAndData,
    signInWithGoogle
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'saved' | 'submissions' | 'data'>(defaultTab);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Filter tools that match user favorites
  const savedTools = tools.filter((t) => favorites.has(t.slug) || favorites.has(t.id));

  if (loading) {
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
          Sign in with your Google account to bookmark favorite AI tools, submit new software for directory review, and manage your stored data.
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

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteAccountAndData();
      setDeleteConfirmOpen(false);
      onNavigate('/');
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
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
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1">
                UID: {user.uid.slice(0, 12)}...
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {favorites.size} saved tools · {submissions.length} tool submissions
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
            onClick={() => setActiveTab('saved')}
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
            onClick={() => setActiveTab('submissions')}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'submissions'
                ? 'border-[#2F5BFF] text-[#2F5BFF] font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>My Submissions ({submissions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('data')}
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

                      {/* Unsave button */}
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
                      rel="nofollow noopener noreferrer"
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

      {/* TAB 2: MY SUBMISSIONS */}
      {activeTab === 'submissions' && (
        <section aria-label="My Tool Submissions">
          {submissions.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
              <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                No Submissions Yet
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
                Are you building or maintaining an AI model, developer tool, or agent framework? Submit it for independent evaluation.
              </p>
              <button
                onClick={() => onNavigate('/submit-tool')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-md transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Submit Tool</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {sub.name}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-500">
                        ({sub.slug})
                      </span>
                      {sub.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <Clock className="w-3 h-3" />
                          Pending Review
                        </span>
                      )}
                      {sub.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle className="w-3 h-3" />
                          Published
                        </span>
                      )}
                      {sub.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                          <XCircle className="w-3 h-3" />
                          Declined
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                      {sub.tagline}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Submitted on {new Date(sub.createdAt).toLocaleDateString()} · {sub.category} · {sub.pricing}
                    </p>
                  </div>

                  <a
                    href={sub.websiteUrl}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 self-start sm:self-auto shrink-0"
                  >
                    <span>View URL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
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
                  Saved tool slugs (stored privately under your UID) and any tool submissions you submit for editorial review.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-xl p-6">
            <h2 className="text-base font-bold text-rose-900 dark:text-rose-200 mb-1">
              Delete Account &amp; Stored Data
            </h2>
            <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed mb-4">
              Permanently delete your profile, bookmarked tools, and remove your Google authorization from AI Finder Technologies. This action is irreversible.
            </p>

            {deleteError && (
              <div className="p-3 bg-rose-100 dark:bg-rose-900/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs rounded-md mb-4">
                {deleteError}
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
                  All your saved favorites will be permanently deleted from Firestore. If your session has expired, Google will prompt you to verify credentials one final time before account termination.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-md transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    <span>Confirm Permanent Deletion</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmOpen(false)}
                    disabled={isDeleting}
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
    </div>
  );
};
