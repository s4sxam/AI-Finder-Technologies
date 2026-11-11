import React from 'react';
import { ShieldCheck, Scale, Cpu, Zap, Code2, Award, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';

interface MethodologyPageProps {
  onNavigate: (path: string) => void;
}

export const MethodologyPage: React.FC<MethodologyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5">
        <button onClick={() => onNavigate('/')} className="hover:text-slate-900 dark:hover:text-white">
          Home
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-white font-medium">Evaluation Methodology</span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-blue-50 text-[#2F5BFF] dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
          <Scale className="w-3.5 h-3.5" />
          <span>Independent Technical Standards</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Finder Editorial Score &amp; Testing Methodology
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          How we evaluate, benchmark, and score artificial intelligence software. Zero sponsored rankings, zero pay-to-play placements, and complete transparency on empirical vs estimated inputs.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2F5BFF] flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Editorial Independence</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            No developer or company can pay for a higher rating, featured placement, or preferential review ranking. Scores are calculated strictly from technical benchmarks and feature audits.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Empirical Telemetry</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Token pricing, inference speed (tokens/sec), time-to-first-token (TTFT), and reasoning intelligence indexes are drawn directly from live public telemetry via OpenRouter and Artificial Analysis.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Verification Discipline</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            We only claim &quot;Verified&quot; on tools that have a verified source URL and recorded verification timestamp. When an input lacks real telemetry, it is explicitly flagged as an editor&apos;s estimate.
          </p>
        </div>
      </div>

      {/* The 4 Evaluation Pillars */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          The 4 Evaluation Pillars
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          The AI Finder editorial score (scale of 1.0 to 5.0) is a weighted composite derived from four distinct engineering criteria:
        </p>

        <div className="space-y-4">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#2F5BFF]" />
                <span>1. Reasoning &amp; Capability Depth (35% weight)</span>
              </h3>
              <span className="text-xs font-mono font-medium text-slate-400">Empirical Benchmark Input</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Assesses the underlying model intelligence index, architectural context window length, coding benchmark accuracy (HumanEval / SWE-bench), and complex agentic task execution reliability.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-600" />
                <span>2. Developer Ergonomics &amp; User Experience (25% weight)</span>
              </h3>
              <span className="text-xs font-mono font-medium text-slate-400">Audited Evaluation</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              API clarity, IDE integration quality, latency responsiveness, cross-platform client availability, documentation completeness, and ease of workflow setup.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>3. Operational Speed &amp; Reliability (20% weight)</span>
              </h3>
              <span className="text-xs font-mono font-medium text-slate-400">Empirical Telemetry</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Throughput generation speed measured in output tokens per second, median time-to-first-token (TTFT), service uptime history, and rate-limit predictability.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-500" />
                <span>4. Economic Value &amp; Pricing Transparency (20% weight)</span>
              </h3>
              <span className="text-xs font-mono font-medium text-slate-400">Verified Pricing Audit</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Token input/output cost economics, accessibility of free tier offerings, transparency of usage limits, and absence of deceptive billing practices.
            </p>
          </div>
        </div>
      </div>

      {/* Disputing Data */}
      <div className="p-6 bg-slate-100 dark:bg-slate-800/60 rounded-xl space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Disputing an Evaluation or Benchmark Metric
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          If you are a tool creator and your pricing, architectural models, or specifications have updated, please contact our research team directly via our contact form or challenge telemetry via our dispute channel.
        </p>
        <button
          onClick={() => onNavigate('/contact?intent=benchmark-dispute')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F5BFF] dark:text-blue-400 hover:underline"
        >
          <span>Open a Benchmark Dispute</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
