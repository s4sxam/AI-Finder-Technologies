import React, { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  Loader2,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Globe,
  Tag as TagIcon
} from 'lucide-react';
import { ToolCategory, PricingType, Tool } from '../types';
import { CATEGORIES_META, AI_TOOLS } from '../data/tools';
import { useAuth } from '../context/AuthContext';
import {
  normalizeDomainKey,
  generateSlug,
  checkDuplicateTool,
  submitCommunityTool,
  DuplicateCheckOutput
} from '../lib/communityTools';
import { useAllTools } from '../hooks/useAllTools';

interface SubmitToolPageProps {
  onNavigate: (path: string) => void;
  communityModels?: Tool[];
}

export const SubmitToolPage: React.FC<SubmitToolPageProps> = ({ onNavigate }) => {
  const { user, signInWithGoogle } = useAuth();
  const { allTools, communityTools } = useAllTools();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    websiteUrl: '',
    description: '',
    category: 'coding' as ToolCategory,
    pricing: 'Freemium' as PricingType,
    tags: '',
    showSubmitter: true
  });

  const [confirmDistinct, setConfirmDistinct] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedSlug, setSubmittedSlug] = useState('');
  const [submittedToolName, setSubmittedToolName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // Duplicate Check State
  const [duplicateCheck, setDuplicateCheck] = useState<DuplicateCheckOutput | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [domainKeyPreview, setDomainKeyPreview] = useState<string | null>(null);
  const [domainError, setDomainError] = useState<string | null>(null);

  // Debounced live duplicate detection on name and URL change
  useEffect(() => {
    const trimmedName = formData.name.trim();
    const trimmedUrl = formData.websiteUrl.trim();

    // Domain normalization preview
    if (trimmedUrl.length >= 8) {
      const norm = normalizeDomainKey(trimmedUrl);
      if (norm.error) {
        setDomainError(norm.error);
        setDomainKeyPreview(null);
      } else {
        setDomainError(null);
        setDomainKeyPreview(norm.domainKey || null);
      }
    } else {
      setDomainError(null);
      setDomainKeyPreview(null);
    }

    if (trimmedName.length < 2 && trimmedUrl.length < 8) {
      setDuplicateCheck(null);
      return;
    }

    setIsCheckingDuplicate(true);
    const timer = setTimeout(() => {
      const result = checkDuplicateTool(trimmedName, trimmedUrl, AI_TOOLS, communityTools);
      setDuplicateCheck(result);
      setIsCheckingDuplicate(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [formData.name, formData.websiteUrl, communityTools]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) {
      try {
        await signInWithGoogle();
      } catch (err: any) {
        setErrorMessage(err?.message || 'Google authentication failed.');
      }
      return;
    }

    const name = formData.name.trim();
    const websiteUrl = formData.websiteUrl.trim();
    const description = formData.description.trim();

    if (name.length < 2 || name.length > 100) {
      setErrorMessage('Tool name must be between 2 and 100 characters.');
      return;
    }

    const norm = normalizeDomainKey(websiteUrl);
    if (norm.error || !norm.domainKey) {
      setErrorMessage(norm.error || 'Please enter a valid, secure HTTPS website URL.');
      return;
    }

    if (description.length < 20 || description.length > 300) {
      setErrorMessage('Description must be between 20 and 300 characters.');
      return;
    }

    if (duplicateCheck?.isBlocked) {
      setErrorMessage(duplicateCheck.message);
      return;
    }

    if (duplicateCheck?.isWarning && !confirmDistinct) {
      setErrorMessage('Please confirm that your tool is a distinct project from the similar tool found.');
      return;
    }

    setIsSubmitting(true);

    try {
      const parsedTags = formData.tags
        .split(/[,\s]+/)
        .map((t) => t.trim().toLowerCase().replace(/[^a-z0-9-]/g, ''))
        .filter(Boolean)
        .slice(0, 10);

      const result = await submitCommunityTool(
        {
          name,
          websiteUrl,
          description,
          category: formData.category,
          pricing: formData.pricing,
          tags: parsedTags,
          showSubmitter: formData.showSubmitter
        },
        user
      );

      setSubmittedSlug(result.slug);
      setSubmittedToolName(name);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Submission error:', err);
      const msg = err?.message || 'Failed to submit tool. Please check your connection.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyShareLink = () => {
    const fullUrl = `${window.location.origin}/tools/${submittedSlug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  // SUCCESS VIEW: INSTANT GO-LIVE CONFIRMATION
  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-10 shadow-sm animate-in zoom-in-95 duration-200">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800 shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 mb-2">
            Status: Live in Directory
          </span>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
            Your Tool is Live!
          </h1>

          <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            <strong className="text-slate-900 dark:text-white">{submittedToolName}</strong> is now published and immediately discoverable by everyone across the AI Finder directory, search index, and category hubs.
          </p>

          {/* Quick Action Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate(`/tools/${submittedSlug}`)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <span>View Tool Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCopyShareLink}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            >
              {copiedShareLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedShareLink ? 'Link Copied!' : 'Share Tool Link'}</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={() => onNavigate('/account/submissions')}
              className="text-[#2F5BFF] hover:underline font-medium"
            >
              Manage in My Submissions →
            </button>

            <button
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  name: '',
                  websiteUrl: '',
                  description: '',
                  category: 'coding',
                  pricing: 'Freemium',
                  tags: '',
                  showSubmitter: true
                });
                setSubmittedSlug('');
                setSubmittedToolName('');
                setDuplicateCheck(null);
                setConfirmDistinct(false);
              }}
              className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              Submit Another Tool
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => onNavigate('/')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Publish an AI Tool
          </h1>
          {user && (
            <span className="text-[11px] font-mono text-slate-400">
              Creator: {user.displayName}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          Submit your AI application, developer platform, or reasoning model. Submissions go live instantly and are indexed across search, filters, and comparisons.
        </p>

        {errorMessage && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tool Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
              Tool Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Cursor, Lovable, Midjourney"
              maxLength={100}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2F5BFF]"
            />
            {formData.name.trim() && (
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                Live URL will be: /tools/{generateSlug(formData.name)}
              </p>
            )}
          </div>

          {/* Official Website URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
              Official Website URL <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://yourproduct.com"
                className={`w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2F5BFF] ${
                  domainError
                    ? 'border-rose-300 dark:border-rose-800'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {isCheckingDuplicate && (
                <div className="absolute right-3 top-2.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                </div>
              )}
            </div>

            {domainError && (
              <p className="text-[11px] text-rose-500 mt-1">{domainError}</p>
            )}
            {domainKeyPreview && !domainError && (
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                Normalized database key: <span className="text-slate-600 dark:text-slate-300 font-semibold">{domainKeyPreview}</span>
              </p>
            )}
          </div>

          {/* Live Duplicate Warning & Blocking Alerts */}
          {duplicateCheck?.isBlocked && duplicateCheck.existingTool && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-800 dark:text-rose-200 text-xs flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Tool already cataloged</p>
                  <p className="mt-0.5 leading-relaxed">{duplicateCheck.message}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(`/tools/${duplicateCheck.existingTool?.slug}`)}
                className="shrink-0 px-2.5 py-1 text-[11px] font-semibold bg-rose-200/60 dark:bg-rose-900/60 text-rose-900 dark:text-rose-100 rounded hover:bg-rose-300 transition-colors"
              >
                View Existing
              </button>
            </div>
          )}

          {duplicateCheck?.isWarning && !duplicateCheck.isBlocked && duplicateCheck.existingTool && (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg text-amber-800 dark:text-amber-200 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <p className="font-semibold">{duplicateCheck.message}</p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                    Existing tool: <strong>{duplicateCheck.existingTool.name}</strong> ({duplicateCheck.existingTool.websiteUrl})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-amber-200 dark:border-amber-900/60">
                <input
                  type="checkbox"
                  id="confirmDistinct"
                  checked={confirmDistinct}
                  onChange={(e) => setConfirmDistinct(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-amber-300 text-[#2F5BFF] focus:ring-[#2F5BFF]"
                />
                <label htmlFor="confirmDistinct" className="text-[11px] text-amber-900 dark:text-amber-200 font-medium cursor-pointer">
                  I confirm this is a distinct, standalone AI tool and not a duplicate listing.
                </label>
              </div>
            </div>
          )}

          {/* Short Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-900 dark:text-white">
                Short Description <span className="text-rose-500">*</span>
              </label>
              <span className={`text-[10px] font-mono ${
                formData.description.length < 20 || formData.description.length > 300
                  ? 'text-amber-500'
                  : 'text-slate-400'
              }`}>
                {formData.description.length}/300 (min 20)
              </span>
            </div>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Concise overview of what the tool does, key models used, and who it helps (20–300 characters)..."
              maxLength={300}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2F5BFF]"
            />
          </div>

          {/* Category & Pricing Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
                Primary Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ToolCategory })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2F5BFF]"
              >
                {Object.entries(CATEGORIES_META).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
                Pricing Model <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.pricing}
                onChange={(e) => setFormData({ ...formData, pricing: e.target.value as PricingType })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2F5BFF]"
              >
                <option value="Free">100% Free</option>
                <option value="Freemium">Freemium (Free tier available)</option>
                <option value="Paid">Paid Only</option>
                <option value="Free Trial">Free Trial</option>
              </select>
            </div>
          </div>

          {/* Tags (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
              Tags (Optional)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. coding, rust, llm, agents, autocomplete (comma or space separated)"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2F5BFF]"
            />
          </div>

          {/* Checkbox: Show my name on tool page */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="showSubmitter"
              checked={formData.showSubmitter}
              onChange={(e) => setFormData({ ...formData, showSubmitter: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#2F5BFF] focus:ring-[#2F5BFF] cursor-pointer"
            />
            <label htmlFor="showSubmitter" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              Show &quot;Community submitted · added by {user?.displayName || 'Creator'}&quot; badge on the tool page
            </label>
          </div>

          {/* Submission Action Bar */}
          <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-[11px] text-slate-500">
              No approval queue: tools are published immediately and visible to all users.
            </p>

            {!user ? (
              <button
                type="button"
                onClick={async () => {
                  try {
                    await signInWithGoogle();
                  } catch (err: any) {
                    setErrorMessage(err?.message || 'Google authentication failed.');
                  }
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
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
                <span>Sign in with Google to Submit</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  duplicateCheck?.isBlocked ||
                  (duplicateCheck?.isWarning && !confirmDistinct) ||
                  formData.description.trim().length < 20 ||
                  Boolean(domainError)
                }
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Publishing Live...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Tool Live</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
