import React, { useState } from 'react';
import { Trash2, Loader2, CheckCircle, ShieldAlert } from 'lucide-react';

interface AccountSecurityTabProps {
  user: any;
  deleteAccountAndData: () => Promise<void>;
  onNavigate: (path: string) => void;
}

export const AccountSecurityTab: React.FC<AccountSecurityTabProps> = ({
  user,
  deleteAccountAndData,
  onNavigate
}) => {
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null);

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
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mb-3">
            {deleteAccountError}
          </p>
        )}

        {deleteConfirmOpen ? (
          <div className="p-4 bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-xl space-y-3">
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              Are you absolutely certain? This will delete all your data permanently.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-md disabled:opacity-50"
              >
                {isDeletingAccount && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Permanent Deletion</span>
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-md transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete My Account &amp; All Data</span>
          </button>
        )}
      </div>
    </section>
  );
};
