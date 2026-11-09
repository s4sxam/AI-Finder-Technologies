import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, ShieldCheck, AlertCircle, ArrowLeft, Sparkles, ExternalLink, Database, AlertTriangle, Eye, Loader2 } from 'lucide-react';
import { ToolCategory, PricingType, Tool } from '../types';
import { CATEGORIES_META } from '../data/tools';
import { detectDuplicateModel, uploadModel, generateSlug, DuplicateCheckResult } from '../lib/modelsService';

interface SubmitToolPageProps {
  onNavigate: (path: string) => void;
  communityModels?: Tool[];
}

export const SubmitToolPage: React.FC<SubmitToolPageProps> = ({ onNavigate, communityModels = [] }) => {
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
    tags: '',
    submitterName: '',
    submitterEmail: '',
    isFounderOrTeam: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdSlug, setCreatedSlug] = useState('');
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

    // Pre-validation
    if (!formData.name.trim() || !formData.websiteUrl.trim() || !formData.tagline.trim()) {
      setErrorMessage('Please fill in the required tool details.');
      return;
    }

    if (!formData.websiteUrl.startsWith('http://') && !formData.websiteUrl.startsWith('https://')) {
      setErrorMessage('Please enter a valid website URL starting with https://');
      return;
    }

    // Check duplicate
    if (duplicateCheck?.isDuplicate) {
      setErrorMessage(`Cannot upload duplicate model: ${duplicateCheck.duplicateReason}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsArray = formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [formData.category, 'AI', 'Community'];

      const created = await uploadModel(
        {
          name: formData.name,
          slug: formData.slug || generateSlug(formData.name),
          websiteUrl: formData.websiteUrl,
          category: formData.category,
          pricing: formData.pricing,
          startingPrice: formData.startingPrice,
          hasFreeTier: formData.hasFreeTier,
          tagline: formData.tagline,
          description: formData.description,
          tags: tagsArray,
          submitterName: formData.submitterName,
          submitterEmail: formData.submitterEmail
        },
        communityModels
      );

      setCreatedSlug(created.slug);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Model upload error:', err);
      setErrorMessage(err.message || 'Failed to publish model. Please verify all fields and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5">
        <button onClick={() => onNavigate('/')} className="hover:text-slate-900 dark:hover:text-white">
          Home
        </button>
        <span aria-hidden="true">/</span>
        <button onClick={() => onNavigate('/tools')} className="hover:text-slate-900 dark:hover:text-white">
          Directory
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-white font-medium">Upload AI Model</span>
      </nav>

      {/* Header */}
      <div>
        <div className="text-xs font-semibold text-[#2F5BFF] uppercase tracking-wider mb-1 flex items-center gap-2">
          <Database className="w-4 h-4 text-[#2F5BFF]" />
          <span>Real-Time Firebase Firestore Integration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Upload &amp; Catalog a New AI Model
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
          Anyone can upload a new model without modifying source code. Submitted models are automatically validated, checked for duplicates, and instantly synchronized to the live directory.
        </p>
      </div>

      {isSuccess ? (
        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-4 animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Model Successfully Published to Firestore!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            <strong>{formData.name}</strong> is now live in the global directory and comparison workbench without any manual source code changes.
          </p>

          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-left max-w-md mx-auto text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Live URL Slug:</span>
              <span className="font-mono text-[#2F5BFF] font-semibold">/tools/{createdSlug}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Database Status:</span>
              <span className="text-emerald-500 font-medium">Persisted in Firestore</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Deduplication:</span>
              <span className="text-slate-700 dark:text-slate-300">Verified Unique (No conflict)</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => onNavigate(`/tools/${createdSlug}`)}
              className="px-5 py-2.5 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Your Live Model</span>
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
                  tags: '',
                  submitterName: '',
                  submitterEmail: '',
                  isFounderOrTeam: true
                });
                setDuplicateCheck(null);
              }}
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Upload Another Model
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6 text-xs"
        >
          {/* Duplicate Detection Alert Banner */}
          {duplicateCheck?.isDuplicate && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-amber-700 dark:text-amber-400 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                <span>Duplicate AI Model Detected</span>
              </div>
              <p className="text-xs leading-relaxed">
                {duplicateCheck.duplicateReason}
              </p>
              {duplicateCheck.existingModel && (
                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate(`/tools/${duplicateCheck.existingModel?.slug}`)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 rounded font-medium text-[11px] transition-colors"
                  >
                    <span>View Existing Model ({duplicateCheck.existingModel.name})</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Tool Basics */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                1. AI Model Identity &amp; Routing
              </h2>
              {isCheckingDuplicate && (
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Loader2 className="w-3 h-3 animate-spin text-[#2F5BFF]" />
                  <span>Checking database uniqueness...</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                  Model / Tool Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. DeepSeek R1"
                  className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF] ${
                    duplicateCheck?.isDuplicate && duplicateCheck.matchedField === 'name'
                      ? 'border-amber-500 ring-1 ring-amber-500/30'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                  URL Slug Identifier <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. deepseek-r1"
                  className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-lg text-slate-900 dark:text-white placeholder-slate-400 font-mono text-xs focus:outline-none focus:border-[#2F5BFF] ${
                    duplicateCheck?.isDuplicate && duplicateCheck.matchedField === 'slug'
                      ? 'border-amber-500 ring-1 ring-amber-500/30'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                  Official Website / API Docs URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://example.com"
                  className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF] ${
                    duplicateCheck?.isDuplicate && duplicateCheck.matchedField === 'websiteUrl'
                      ? 'border-amber-500 ring-1 ring-amber-500/30'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                  Category Discipline <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ToolCategory })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#2F5BFF]"
                >
                  {(Object.keys(CATEGORIES_META) as ToolCategory[]).map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORIES_META[cat].name} ({cat})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                  Pricing Model <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.pricing}
                  onChange={(e) => setFormData({ ...formData, pricing: e.target.value as PricingType })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#2F5BFF]"
                >
                  <option value="Freemium">Freemium (Free tier + Paid)</option>
                  <option value="Free">100% Free / Open Source</option>
                  <option value="Paid">Paid Only (No free tier)</option>
                  <option value="Free Trial">Paid with Free Trial</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                  Starting Price (Optional)
                </label>
                <input
                  type="text"
                  value={formData.startingPrice}
                  onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                  placeholder="e.g. $20/month or Free"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF]"
                />
              </div>

              <div className="pt-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.hasFreeTier}
                    onChange={(e) => setFormData({ ...formData, hasFreeTier: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#2F5BFF] focus:ring-[#2F5BFF]"
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Includes permanent free tier
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                Concise Tagline (Max 140 chars) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={140}
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g. Open-weights hybrid reasoning model with deep chain-of-thought."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                Evaluation Notes &amp; Capabilities
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe foundation architecture, context window, benchmark scores, or specialized developer workflows..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g. Reasoning, Open Source, Transformers, Math"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF]"
              />
            </div>
          </div>

          {/* Section 2: Submitter Identity */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              2. Submitter Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                  Your Full Name / Handle
                </label>
                <input
                  type="text"
                  value={formData.submitterName}
                  onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                  Contact Email (Optional for updates)
                </label>
                <input
                  type="email"
                  value={formData.submitterEmail}
                  onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                  placeholder="alex@domain.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF]"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Database className="w-3.5 h-3.5 text-[#2F5BFF]" />
              <span>Saves directly to Firebase Firestore with zero server restarts required.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !!duplicateCheck?.isDuplicate}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#2F5BFF] hover:bg-[#1E46E6] disabled:opacity-50 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validating &amp; Uploading...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Upload Live Model</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
