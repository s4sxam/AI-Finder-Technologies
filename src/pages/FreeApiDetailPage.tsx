import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Copy, Check, ShieldAlert, Key, Terminal, Code2, AlertTriangle, BookOpen, CheckCircle2 } from 'lucide-react';
import { FREE_API_BY_ID, FREE_API_PROVIDERS } from '../data/freeApis.ts';

interface FreeApiDetailPageProps {
  providerId: string;
  onNavigate: (path: string) => void;
}

export const FreeApiDetailPage: React.FC<FreeApiDetailPageProps> = ({
  providerId,
  onNavigate
}) => {
  const provider = FREE_API_BY_ID.get(providerId);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!provider) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Provider Not Found</h1>
        <p className="text-xs text-slate-500">
          We could not locate setup instructions for provider ID &quot;{providerId}&quot;.
        </p>
        <button
          onClick={() => onNavigate('/free-apis')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#2F5BFF] rounded-md"
        >
          Return to Free AI API Hub
        </button>
      </div>
    );
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5">
        <button onClick={() => onNavigate('/')} className="hover:text-slate-900 dark:hover:text-white">
          Home
        </button>
        <span aria-hidden="true">/</span>
        <button onClick={() => onNavigate('/free-apis')} className="hover:text-slate-900 dark:hover:text-white">
          Free AI APIs
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-white font-medium">{provider.name}</span>
      </nav>

      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Official Free Tier (March 2026)</span>
          </div>

          <a
            href={provider.limitsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#2F5BFF] hover:underline inline-flex items-center gap-1 font-medium"
          >
            <span>Official Limits & Quotas</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How to Get Your Free {provider.name} API Key
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {provider.bestFor}
        </p>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Credit Card</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">
              {provider.creditCardRequired === 'no' ? 'Not Required' : 'Required'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">OpenAI Compatible</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {provider.openAiCompatible ? 'Yes (Drop-in SDK)' : 'Custom SDK / REST'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Env Variable</span>
            <code className="text-xs font-mono font-bold text-[#2F5BFF]">
              {provider.envVarName}
            </code>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Official Console</span>
            <a
              href={provider.getKeyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#2F5BFF] hover:underline inline-flex items-center gap-1"
            >
              <span>Get API Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Mandatory Security Box */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold">Strict Secret Key Security Rule</h4>
          <p className="leading-relaxed">
            Never commit API keys to GitHub or public repositories. Never embed keys in client-side React code where users can inspect network requests. Always load via environment variables in backend functions or server proxy routes. If a key is accidentally exposed, revoke and rotate it immediately in the provider dashboard.
          </p>
        </div>
      </div>

      {/* 6-Step Implementation Walkthrough */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#2F5BFF]" />
          <span>Step-by-Step Implementation Walkthrough</span>
        </h2>

        <div className="space-y-4">
          {provider.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-3"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#2F5BFF] text-white flex items-center justify-center text-xs font-mono font-bold flex-shrink-0">
                  {idx + 1}
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {step.title}
                </h3>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed pl-8">
                {step.instruction}
              </p>

              {step.codeSnippet && (
                <div className="pl-8 pt-1">
                  <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 text-xs">
                    <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                      <span>{step.codeSnippet.filename || step.codeSnippet.lang}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(step.codeSnippet!.code, idx)}
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3.5 overflow-x-auto font-mono text-[11px] leading-relaxed">
                      <code>{step.codeSnippet.code}</code>
                    </pre>
                  </div>
                </div>
              )}

              {step.note && (
                <div className="pl-8 text-[11px] text-slate-500 italic">
                  Note: {step.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Other Free Providers Recommendations */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Explore Other Legitimate Free AI Providers
        </h3>
        <div className="flex flex-wrap gap-2">
          {FREE_API_PROVIDERS.filter((p) => p.id !== provider.id).map((other) => (
            <button
              key={other.id}
              onClick={() => onNavigate(`/free-apis/${other.id}`)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {other.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
