import React from 'react';
import { Flag, X, Check, Loader2 } from 'lucide-react';
import { Tool } from '../../types';
import { ReportReason } from '../../lib/communityTools';

interface ToolReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool;
  user: any;
  signInWithGoogle: () => Promise<void>;
  reportReasonCategory: ReportReason;
  setReportReasonCategory: (category: ReportReason) => void;
  reportDetails: string;
  setReportDetails: (details: string) => void;
  isSubmittingReport: boolean;
  reportSuccess: boolean;
  reportError: string | null;
  onSubmitReport: (e: React.FormEvent) => void;
}

export const ToolReportModal: React.FC<ToolReportModalProps> = ({
  isOpen,
  onClose,
  tool,
  user,
  signInWithGoogle,
  reportReasonCategory,
  setReportReasonCategory,
  reportDetails,
  setReportDetails,
  isSubmittingReport,
  reportSuccess,
  reportError,
  onSubmitReport
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
          aria-label="Close report modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-3 text-rose-600 dark:text-rose-400">
          <Flag className="w-5 h-5 shrink-0" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Report &quot;{tool.name}&quot;
          </h2>
        </div>

        {reportSuccess ? (
          <div className="py-6 text-center space-y-2">
            <Check className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Report Received
            </p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Thank you for helping keep the directory accurate and safe. Our engineering moderators will investigate this listing.
            </p>
          </div>
        ) : !user ? (
          <div className="py-4 text-center space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              To prevent automated abuse or malicious takedowns, you must authenticate with Google to submit a flag against a community listing.
            </p>
            <button
              onClick={async () => {
                await signInWithGoogle();
              }}
              className="px-4 py-2 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Sign in with Google to Report
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmitReport} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                Violation Category
              </label>
              <select
                value={reportReasonCategory}
                onChange={(e) => setReportReasonCategory(e.target.value as ReportReason)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value="spam">Spam or SEO manipulation</option>
                <option value="broken_link">Broken website / dead product link</option>
                <option value="malware">Malware / Security threat / Phishing</option>
                <option value="impersonation">Brand impersonation or trademark abuse</option>
                <option value="offensive">Offensive, abusive, or harmful content</option>
                <option value="other">Other policy concern</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                Additional Context (Optional)
              </label>
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Provide specific details or documentation for the moderators..."
                maxLength={500}
                rows={3}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white resize-none"
              />
              <div className="text-[10px] text-slate-400 text-right mt-1">
                {reportDetails.length}/500
              </div>
            </div>

            {reportError && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {reportError}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingReport}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors"
              >
                {isSubmittingReport && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Submit Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
