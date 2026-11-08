import React, { useState } from 'react';

interface LegalPageProps {
  onNavigate: (path: string) => void;
  defaultTab?: 'privacy' | 'terms';
}

export const LegalPage: React.FC<LegalPageProps> = ({ onNavigate, defaultTab = 'privacy' }) => {
  const [tab, setTab] = useState<'privacy' | 'terms'>(defaultTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 flex items-center gap-1.5">
        <button onClick={() => onNavigate('/')} className="hover:text-slate-900 dark:hover:text-white">
          Home
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-white font-medium capitalize">{tab} Policy</span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setTab('privacy')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            tab === 'privacy'
              ? 'bg-[#2F5BFF] text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setTab('terms')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            tab === 'terms'
              ? 'bg-[#2F5BFF] text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Terms of Service
        </button>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-6">
        {tab === 'privacy' ? (
          <>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Privacy Policy
              </h1>
              <div className="text-xs text-slate-400">Effective Date: January 1, 2026 · Version 2.4</div>
            </div>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Information We Do Not Collect</h2>
              <p>
                AI Finder Technologies operates under a strict privacy-by-design architecture. We do not use third-party tracking pixels, biometric sensors, or cross-site tracking cookies. Tool bookmarks and comparison choices are retained strictly in your browser&apos;s local storage (localStorage) and never transmitted to our servers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Voluntary Information</h2>
              <p>
                When you submit a contact inquiry or subscribe to our weekly newsletter, we collect your email address and submitted message strictly to respond to your inquiry or deliver the requested newsletter. We never sell, rent, or trade subscriber contact lists with external third parties or advertisers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Outbound External Links</h2>
              <p>
                Our directory contains links to third-party AI software websites. These outbound links are marked with <code>rel=&quot;nofollow noopener noreferrer&quot;</code> attributes. When navigating to third-party services, their respective privacy policies govern your data handling.
              </p>
            </section>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Terms of Service
              </h1>
              <div className="text-xs text-slate-400">Effective Date: January 1, 2026 · Version 2.1</div>
            </div>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Directory Use &amp; Intellectual Property</h2>
              <p>
                The evaluations, benchmark writeups, and comparison matrices published on AI Finder Technologies are protected under international copyright law. You may cite our benchmark findings in editorial articles provided appropriate canonical attribution and hyperlinks are preserved.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Benchmark Disclaimer</h2>
              <p>
                AI benchmarks represent performance recorded under our testing methodology at specified timestamps. Because frontier models evolve rapidly, token pricing and feature sets may be updated by their respective manufacturers. Always verify final contractual terms on the official vendor website.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
