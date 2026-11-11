import React, { useState } from 'react';
import {
  FileText,
  PlusCircle,
  ExternalLink,
  Edit2,
  Trash2,
  Sparkles,
  Loader2,
  X,
  Check
} from 'lucide-react';
import { Tool } from '../../types';
import { Link } from '../Link';
import { updateCommunityTool, deleteCommunityTool, migrateLegacySubmissions } from '../../lib/communityTools';

interface SubmissionsTabProps {
  user: any;
  userCommunityTools: Tool[];
  setUserCommunityTools: React.Dispatch<React.SetStateAction<Tool[]>>;
  legacySubmissions: any[];
  isLoadingCommunity: boolean;
  onNavigate: (path: string) => void;
  loadUserTools: () => Promise<void>;
}

export const SubmissionsTab: React.FC<SubmissionsTabProps> = ({
  user,
  userCommunityTools,
  setUserCommunityTools,
  legacySubmissions,
  isLoadingCommunity,
  onNavigate,
  loadUserTools
}) => {
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

  return (
    <section aria-label="My Tool Submissions" className="space-y-6">
      {/* Legacy Migration Banner */}
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
          <Link
            href="/submit-tool"
            onNavigate={onNavigate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-md transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Publish a Tool Now</span>
          </Link>
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

                  {/* Live Status Badge */}
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

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <Link
                  href={`/tools/${tool.slug}`}
                  onNavigate={onNavigate}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                  title="Open public tool page"
                >
                  <span>View Live</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

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

      {/* Edit Modal */}
      {editingTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setEditingTool(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
              aria-label="Close edit modal"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Edit &quot;{editingTool.name}&quot;
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Update description, tags, or attribution. Changes update live immediately.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                  Tool Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white resize-none"
                  minLength={20}
                  maxLength={300}
                  required
                />
                <div className="text-[10px] text-slate-400 text-right mt-1">
                  {editDescription.length}/300
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="e.g. coding, automation, workflow"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editShowSubmitter"
                  checked={editShowSubmitter}
                  onChange={(e) => setEditShowSubmitter(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2F5BFF]"
                />
                <label htmlFor="editShowSubmitter" className="text-xs text-slate-700 dark:text-slate-300">
                  Display &quot;Added by {user.displayName || 'Creator'}&quot; on tool card
                </label>
              </div>

              {editError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {editError}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTool(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-md disabled:opacity-50"
                >
                  {isSavingEdit && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Remove &quot;{deletingTool.name}&quot; from Directory?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              This will remove the listing from public search and category rankings immediately. This action cannot be undone.
            </p>

            {deleteToolError && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mb-3">
                {deleteToolError}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeletingTool(null)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
              >
                Keep Listing
              </button>
              <button
                onClick={handleConfirmDeleteTool}
                disabled={isDeletingTool}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-md disabled:opacity-50"
              >
                {isDeletingTool && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Tool</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
