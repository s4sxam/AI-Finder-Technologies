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
              <div className="text-xs text-slate-400">Effective Date: November 2026 · Version 3.0</div>
            </div>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Authentication via Google Sign-In</h2>
              <p>
                AI Finder Technologies offers optional Google Sign-In powered by Firebase Authentication. When you authenticate using Google, we access only your basic profile information: your Google unique user identifier (UID), your public display name, and your avatar photo URL. We do not store your Google password or request access to your private Google Drive, Gmail, contacts, or calendar.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">2. What Firestore Stores &amp; Privacy Isolation</h2>
              <p>
                Our persistent database (Firebase Firestore) maintains strict role-based access rules:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                <li>
                  <strong className="text-slate-900 dark:text-white">User Profiles:</strong> Stored under <code>users/&#123;uid&#125;</code> containing only <code>uid</code>, <code>displayName</code>, and <code>photoURL</code>. Your email address is never stored in public documents or shared with third parties.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Saved Tools (Favorites):</strong> Stored privately at <code>users/&#123;uid&#125;/favorites/&#123;toolSlug&#125;</code>. These bookmarks can be read and written exclusively by your authenticated Google UID.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Tool Submissions:</strong> Stored under <code>submissions/&#123;submissionId&#125;</code> with <code>status: &quot;pending&quot;</code> and linked to your UID so you can track editorial review status.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">3. How Account &amp; Data Deletion Works</h2>
              <p>
                You retain complete sovereignty over your data. At any time, you can visit the <strong>Account &amp; Data Deletion</strong> tab in your Account settings and click &quot;Delete my account and data&quot;. This process immediately and irreversibly:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                <li>Permanently wipes all documents in your <code>users/&#123;uid&#125;/favorites</code> subcollection.</li>
                <li>Deletes your <code>users/&#123;uid&#125;</code> profile document from Firestore.</li>
                <li>Permanently terminates your Firebase Auth user record. If your session token is older than five minutes, Google will prompt you to verify credentials one final time before complete deletion.</li>
              </ol>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">4. No Tracking Pixels or Ad Retargeting</h2>
              <p>
                AI Finder Technologies does not sell data, deploy cross-site tracking pixels, or utilize ad retargeting networks. Outbound links to external AI tool websites are designated with <code>rel=&quot;nofollow noopener noreferrer&quot;</code> attributes to protect your referral privacy.
              </p>
            </section>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Terms of Service
              </h1>
              <div className="text-xs text-slate-400">Effective Date: November 2026 · Version 3.0</div>
            </div>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Service Scope &amp; Editorial Independence</h2>
              <p>
                AI Finder Technologies is an independent directory and benchmark laboratory evaluating artificial intelligence models and software applications. All evaluations, benchmark indexes, and capability ratings represent our editorial assessments and automated measurement pipelines.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">2. User Accounts &amp; Community Submissions</h2>
              <p>
                To save favorite tools or submit software for review, users authenticate via Google. By submitting an AI tool to our directory, you represent that the software description, website URL, and claimed pricing tiers are accurate and do not violate third-party trademarks or proprietary rights. We reserve the right to decline or unpublish any tool that fails security, safety, or quality standards.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">3. API &amp; Benchmark Data Disclaimer</h2>
              <p>
                Frontier AI model benchmark metrics (latency, tokens per second, and API pricing) are fetched programmatically from public endpoints including OpenRouter and Artificial Analysis. Because AI providers update model weights and API pricing frequently, specifications may change without prior notice. Always verify production service-level agreements and token pricing directly on the provider&apos;s developer console.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
