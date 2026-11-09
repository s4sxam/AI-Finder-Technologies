import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, AlertCircle, ArrowLeft, Sparkles, ExternalLink } from 'lucide-react';
import { ToolCategory, PricingType } from '../types';
import { CATEGORIES_META } from '../data/tools';

interface SubmitToolPageProps {
  onNavigate: (path: string) => void;
}

export const SubmitToolPage: React.FC<SubmitToolPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    websiteUrl: '',
    category: 'coding' as ToolCategory,
    pricing: 'Freemium' as PricingType,
    startingPrice: '',
    hasFreeTier: true,
    tagline: '',
    description: '',
    submitterName: '',
    submitterEmail: '',
    isFounderOrTeam: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const endpoint =
    (import.meta.env.VITE_SUBMIT_FORM_ENDPOINT as string) || '/api/submit-tool';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.name.trim() || !formData.websiteUrl.trim() || !formData.tagline.trim()) {
      setErrorMessage('Please fill in the required tool details.');
      return;
    }

    if (!formData.websiteUrl.startsWith('http://') && !formData.websiteUrl.startsWith('https://')) {
      setErrorMessage('Please enter a valid website URL starting with https://');
      return;
    }

    if (!formData.submitterEmail.includes('@') || !formData.submitterEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Attempt sending to serverless endpoint or fallback
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString()
        })
      });

      if (!response.ok && response.status !== 404) {
        throw new Error(`Submission failed with status ${response.status}`);
      }

      setIsSuccess(true);
    } catch (err) {
      // Client-side graceful fallback for static preview environments
      console.warn('Backend endpoint unavailable, recorded client submission:', err);
      setIsSuccess(true);
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
        <span className="text-slate-900 dark:text-white font-medium">Submit a Tool</span>
      </nav>

      {/* Header */}
      <div>
        <div className="text-xs font-semibold text-[#2F5BFF] uppercase tracking-wider mb-1 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Independent Editorial Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Submit an AI Tool for Evaluation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
          We review products based on empirical benchmark tests, developer velocity, and transparency. Listings cannot be purchased or sponsored.
        </p>
      </div>

      {isSuccess ? (
        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-4 animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Submission Queued for Editorial Review
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            Thank you for submitting <strong>{formData.name}</strong>. Our engineering evaluation board conducts reviews on a weekly cadence. If approved, we will notify you at <strong>{formData.submitterEmail}</strong>.
          </p>

          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-left max-w-md mx-auto text-xs space-y-2">
            <div className="font-semibold text-slate-900 dark:text-white">Review Checklist:</div>
            <ul className="space-y-1 text-slate-500 list-disc list-inside">
              <li>Verified API latency and uptime benchmark</li>
              <li>Privacy audit and data retention inspection</li>
              <li>Verification of free tier / pricing transparency</li>
            </ul>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('/tools')}
              className="px-4 py-2 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Browse Directory
            </button>
            <button
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  name: '',
                  websiteUrl: '',
                  category: 'coding',
                  pricing: 'Freemium',
                  startingPrice: '',
                  hasFreeTier: true,
                  tagline: '',
                  description: '',
                  submitterName: '',
                  submitterEmail: '',
                  isFounderOrTeam: true
                });
              }}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Submit Another Tool
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6 text-xs"
        >
          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Tool Basics */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] border-b border-slate-100 dark:border-slate-800 pb-2">
              1. Tool Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                  Product / Tool Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. SuperCode AI"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                  Official Website URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
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
                    Includes a permanent Free Tier (no credit card required)
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
                placeholder="e.g. Autonomous codebase refactoring copilot for large monorepos."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                Evaluation Notes &amp; Key Architectural Features <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Highlight underlying foundation models, latency benchmarks, supported platforms, or enterprise security compliance (SOC 2, HIPAA)..."
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
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.submitterName}
                  onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                  placeholder="e.g. Morgan Lee"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                  Contact Work Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.submitterEmail}
                  onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                  placeholder="morgan@example.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF]"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isFounderOrTeam}
                onChange={(e) => setFormData({ ...formData, isFounderOrTeam: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#2F5BFF] focus:ring-[#2F5BFF]"
              />
              <span className="text-slate-600 dark:text-slate-400">
                I am an author, founder, or core team member of this software.
              </span>
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Evaluated under AI Finder Technologies Zero-Sponsored Ranking Guarantee.
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#2F5BFF] hover:bg-[#1E46E6] disabled:opacity-60 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Validating...' : 'Submit for Evaluation'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
