import React from 'react';
import { ShieldCheck, Target, Award, Users, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 flex items-center gap-1.5">
        <button onClick={() => onNavigate('/')} className="hover:text-slate-900 dark:hover:text-white">
          Home
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-white font-medium">About &amp; Methodology</span>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About AI Finder Technologies
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          We are an independent benchmarking laboratory and curated directory founded by software architects, machine learning researchers, and product designers.
        </p>
      </div>

      {/* The Independence Manifesto */}
      <div className="p-6 sm:p-8 bg-slate-900 text-white rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-[#2F5BFF] font-semibold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Our Independence Manifesto</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">
          Zero Sponsored Rankings. Zero Algorithmic Pay-to-Play.
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The software review industry is broken. Most directories sell the top spot to whoever pays the highest cost-per-click, plastering generic 5-star badges over mediocre products.
        </p>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          At AI Finder Technologies, every single tool in our directory undergoes real stress testing on production codebases, design mockups, and academic datasets. A company cannot buy their way onto our trending list or edit their pros and cons.
        </p>
      </div>

      {/* The 4-Stage Methodology */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Our 4-Stage Evaluation Framework
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            How every application is assessed before receiving a verified score.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <div className="font-mono text-xs text-[#2F5BFF] font-bold">01. Cold Setup &amp; Friction</div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Onboarding Velocity
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We measure the time from account creation to first productive output. We flag hidden credit card gates, confusing token economies, and mandatory onboarding demos.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <div className="font-mono text-xs text-[#2F5BFF] font-bold">02. Edge-Case Stress Testing</div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Prompt Adherence &amp; Rigor
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We push models with negative constraints, multi-file circular dependencies, non-trivial mathematical proofs, and subtle edge cases to observe where hallucination begins.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <div className="font-mono text-xs text-[#2F5BFF] font-bold">03. Privacy &amp; Governance</div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Data Retention Audit
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We review SOC 2 certifications, HIPAA compliance, zero-data-retention (ZDR) options, and verify whether user inputs are fed back into public model training runs.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <div className="font-mono text-xs text-[#2F5BFF] font-bold">04. Economic Value</div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              True Cost vs. ROI
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We calculate whether the tool generates quantifiable time savings that justify recurring seat pricing compared to open-weights models runnable locally.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Team */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Lead Researchers &amp; Architects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 font-bold text-sm mx-auto flex items-center justify-center text-slate-900 dark:text-white">
              ER
            </div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">Elena Rostova</div>
            <div className="text-[11px] text-slate-500">Principal Staff Engineer</div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 font-bold text-sm mx-auto flex items-center justify-center text-slate-900 dark:text-white">
              MV
            </div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">Marcus Vance</div>
            <div className="text-[11px] text-slate-500">AI Benchmarks Director</div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 font-bold text-sm mx-auto flex items-center justify-center text-slate-900 dark:text-white">
              SC
            </div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">Sofia Chen</div>
            <div className="text-[11px] text-slate-500">Creative Technologist</div>
          </div>
        </div>
      </section>

      {/* Explicit Monetization & Affiliate Disclosure */}
      <section className="p-6 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2F5BFF]" />
          <span>How We Stay Independent &amp; Evaluation Disclosure</span>
        </h2>
        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            AI Finder Technologies is committed to radical editorial transparency. To support our laboratory testing, server costs, and in-depth benchmark compute, some external outbound links may generate an affiliate commission at no additional cost to you.
          </p>
          <p>
            However, our evaluation criteria and editorial scores are strictly decoupled from commercial relationships:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-slate-700 dark:text-slate-300">
            <li>We do not accept paid placements, sponsored rankings, or pay-per-review articles.</li>
            <li>Tools without affiliate programs receive the exact same rigorous testing and fair placement as any other tool.</li>
            <li>Pros, cons, and benchmark ratings are authored solely by our engineering team and cannot be altered by vendors.</li>
            <li>If a tool regresses in quality or changes pricing terms unfavorably, its rating is downgraded immediately.</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Have a tool you want us to benchmark?
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit your product for review by our engineering editorial team.
          </p>
        </div>
        <button
          onClick={() => onNavigate('/submit')}
          className="px-4 py-2 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white text-xs font-semibold rounded-lg whitespace-nowrap shadow-xs"
        >
          Submit Product
        </button>
      </div>
    </div>
  );
};
