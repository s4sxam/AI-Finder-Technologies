import React, { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Database,
  AlertTriangle,
  Eye,
  Loader2,
  Lock,
  Clock
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ToolCategory, PricingType, Tool } from '../types';
import { CATEGORIES_META } from '../data/tools';
import { generateSlug, detectDuplicateModel, DuplicateCheckResult } from '../lib/modelsService';
import { useAuth } from '../context/AuthContext';

interface SubmitToolPageProps {
  onNavigate: (path: string) => void;
  communityModels?: Tool[];
}

export const SubmitToolPage: React.FC<SubmitToolPageProps> = ({ onNavigate, communityModels = [] }) => {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    websiteUrl: '',
    category: 'coding' as ToolCategory,
    pricing: 'Freemium' as PricingType,
    startingPrice: '',
    hasFreeTier: true,
    tagline: '',
    description: '',
    bestFor: '',
    tags: '',
    keyFeatures: '',
    pros: '',
    cons: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedSlug, setSubmittedSlug] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Live Duplicate Detection State
  const [duplicateCheck, setDuplicateCheck] = useState<DuplicateCheckResult | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  // Auto-generate slug when name changes if user hasn't typed custom slug
  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug === '' || prev.slug === generateSlug(prev.name) ? generateSlug(val) : prev.slug
    }));
  };

  // Debounced live duplicate detection
  useEffect(() => {
    const trimmedName = formData.name.trim();
    const trimmedUrl = formData.websiteUrl.trim();

    if (trimmedName.length < 2 && trimmedUrl.length < 5) {
      setDuplicateCheck(null);
      return;
    }

    setIsCheckingDuplicate(true);
    const timer = setTimeout(async () => {
      try {
        const result = await detectDuplicateModel(
          trimmedName,
          trimmedUrl,
          formData.slug.trim(),
          communityModels
        );
        setDuplicateCheck(result);
      } catch (err) {
        console.warn('Duplicate check warning:', err);
      } finally {
        setIsCheckingDuplicate(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.name, formData.websiteUrl, formData.slug, communityModels]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) {
      setErrorMessage('You must be signed in with Google to submit an AI tool.');
      return;
    }

    // Validation
    const name = formData.name.trim();
    const slug = (formData.slug.trim() || generateSlug(name)).toLowerCase();
    const tagline = formData.tagline.trim();
    const websiteUrl = formData.websiteUrl.trim();

    if (!name || name.length < 2) {
      setErrorMessage('Tool name must be at least 2 characters.');
      return;
    }

    if (!slug || slug.length < 2 || !/^[a-z0-9-]+$/.test(slug)) {
      setErrorMessage('Slug must contain only lowercase letters, numbers, and hyphens.');
      return;
    }

    if (!tagline || tagline.length < 5) {
      setErrorMessage('Tagline must be at least 5 characters long.');
      return;
    }

    if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
      setErrorMessage('Please enter a valid website URL starting with https://');
      return;
    }

    if (duplicateCheck?.isDuplicate) {
      setErrorMessage(`Cannot submit duplicate model: ${duplicateCheck.duplicateReason}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionId = `sub-${slug}-${Date.now()}`;
      const submissionDocRef = doc(db, 'submissions', submissionId);

      const parsedKeyFeatures = formData.keyFeatures
        ? formData.keyFeatures.split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 10)
        : [];
      const parsedPros = formData.pros
        ? formData.pros.split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 10)
        : [];
      const parsedCons = formData.cons
        ? formData.cons.split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 10)
        : [];

      const submissionPayload = {
        ownerUid: user.uid,
        ownerDisplayName: user.displayName || 'Anonymous Creator',
        name,
        slug,
        tagline,
        description: formData.description.trim() || tagline,
        category: formData.category,
        pricing: formData.pricing,
        startingPrice: formData.startingPrice.trim() || (formData.hasFreeTier ? 'Free' : 'Custom'),
        hasFreeTier: formData.hasFreeTier,
        websiteUrl,
        bestFor: formData.bestFor.trim() || `Specialized ${formData.category} workflows.`,
        keyFeatures: parsedKeyFeatures,
        pros: parsedPros,
        cons: parsedCons,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };

      await setDoc(submissionDocRef, submissionPayload);

      setSubmittedSlug(slug);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage(err?.message || 'Failed to submit tool. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is not authenticated, show sign-in gate
  if (!user && !authLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-10 text-center shadow-sm">
          <div className="w-14 h-14 bg-[#2F5BFF]/10 text-[#2F5BFF] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#2F5BFF]/20">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
            Creator Sign-In Required
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
            To prevent spam and allow you to track your tool's review status, we require creators to authenticate with Google before submitting new software to the directory.
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
            <span>Sign In with Google to Submit</span>
          </button>
        </div>
      </div>
    );
  }

  // Success view
  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-10 shadow-sm">
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800">
            <Clock className="w-7 h-7" />
          </div>
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 mb-2">
            Status: Pending Editorial Review
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
            Tool Submitted Successfully
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            Thank you for submitting <strong className="text-slate-900 dark:text-white">{formData.name}</strong> (<code className="font-mono text-slate-500">{submittedSlug}</code>). Our editorial engineering team will audit specifications, safety compliance, and benchmark accuracy before publishing to the main directory.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('/account#submissions')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <span>View in My Submissions</span>
            </button>
            <button
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  name: '',
                  slug: '',
                  websiteUrl: '',
                  category: 'coding',
                  pricing: 'Freemium',
                  startingPrice: '',
                  hasFreeTier: true,
                  tagline: '',
                  description: '',
                  bestFor: '',
                  tags: '',
                  keyFeatures: '',
                  pros: '',
                  cons: ''
                });
              }}
              className="w-full sm:w-auto px-4 py-2.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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
            Submit an AI Tool
          </h1>
          <span className="text-[11px] font-mono text-slate-400">
            Submitter: {user?.displayName}
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          Submit your product, model, or developer library for independent evaluation. All submissions are stored with pending review status and audited against our editorial standards.
        </p>

        {errorMessage && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tool Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
                Tool Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Cursor, Midjourney, Lovable"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2F5BFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
                URL Slug <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                placeholder="e.g. cursor"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#2F5BFF]"
              />
            </div>
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
              Official Website URL <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              required
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              placeholder="https://example.com"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2F5BFF]"
            />
          </div>

          {/* Live Duplicate Warning */}
          {duplicateCheck?.isDuplicate && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{duplicateCheck.duplicateReason}</span>
            </div>
          )}

          {/* Category & Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
                Category <span className="text-rose-500">*</span>
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
                <option value="Freemium">Freemium</option>
                <option value="Paid">Paid Only</option>
                <option value="Free Trial">Free Trial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
                Starting Price
              </label>
              <input
                type="text"
                value={formData.startingPrice}
                onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                placeholder="e.g. Free, $20/mo"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2F5BFF]"
              />
            </div>
          </div>

          {/* Free Tier Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasFreeTier"
              checked={formData.hasFreeTier}
              onChange={(e) => setFormData({ ...formData, hasFreeTier: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#2F5BFF] focus:ring-[#2F5BFF]"
            />
            <label htmlFor="hasFreeTier" className="text-xs text-slate-700 dark:text-slate-300">
              Includes a usable free tier (no credit card required)
            </label>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
              Tagline (Brief Value Proposition) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. AI-powered code editor engineered for multi-file repo refactoring."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2F5BFF]"
            />
          </div>

          {/* Best For */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
              Best For (Audience &amp; Use Case)
            </label>
            <input
              type="text"
              value={formData.bestFor}
              onChange={(e) => setFormData({ ...formData, bestFor: e.target.value })}
              placeholder="e.g. Full-stack developers, frontend teams, academic researchers"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2F5BFF]"
            />
          </div>

          {/* Key Features (newline separated) */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
              Key Features (1 per line, max 5)
            </label>
            <textarea
              rows={3}
              value={formData.keyFeatures}
              onChange={(e) => setFormData({ ...formData, keyFeatures: e.target.value })}
              placeholder="Full repository indexing&#10;Custom system prompts&#10;In-line multi-file edits"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2F5BFF]"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <span className="text-[11px] text-slate-500">
              Submissions undergo manual review within 48 hours.
            </span>

            <button
              type="submit"
              disabled={isSubmitting || duplicateCheck?.isDuplicate}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting for Review...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit for Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
