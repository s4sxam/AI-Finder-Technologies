import React from 'react';
import { X, Download, ShieldCheck, Check } from 'lucide-react';

interface BrandGuideModalProps {
  onClose: () => void;
}

export const BrandGuideModal: React.FC<BrandGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2F5BFF]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI Finder Technologies — Brand Assets & Guidelines
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
            aria-label="Close brand guide modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 text-xs text-slate-600 dark:text-slate-300">
          {/* Logo Preview */}
          <div className="p-4 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo-mark.svg" alt="AI Finder Logo Mark" className="w-8 h-8" />
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold text-slate-900 dark:text-white">AI Finder</span>
                <span className="text-xs uppercase font-medium text-slate-500">TECHNOLOGIES</span>
              </div>
            </div>
          </div>

          {/* Color Palette Tokens */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 uppercase tracking-wider text-[11px]">
              1. Color Tokens
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950">
                <div className="w-full h-6 rounded bg-[#2F5BFF] mb-1.5" />
                <div className="font-semibold text-slate-900 dark:text-white">Primary Accent</div>
                <div className="font-mono text-slate-500">#2F5BFF</div>
              </div>
              <div className="p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950">
                <div className="w-full h-6 rounded bg-[#0B0F19] mb-1.5" />
                <div className="font-semibold text-slate-900 dark:text-white">Obsidian Base</div>
                <div className="font-mono text-slate-500">#0B0F19</div>
              </div>
              <div className="p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950">
                <div className="w-full h-6 rounded bg-slate-50 mb-1.5 border border-slate-200" />
                <div className="font-semibold text-slate-900 dark:text-white">Canvas Light</div>
                <div className="font-mono text-slate-500">#F8FAFC</div>
              </div>
              <div className="p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950">
                <div className="w-full h-6 rounded bg-slate-950 mb-1.5" />
                <div className="font-semibold text-slate-900 dark:text-white">Canvas Dark</div>
                <div className="font-mono text-slate-500">#020617</div>
              </div>
            </div>
          </div>

          {/* Clear Space & Minimum Sizing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1 uppercase tracking-wider text-[11px]">
                2. Clear-Space Rule
              </h3>
              <p className="leading-relaxed text-slate-500 dark:text-slate-400">
                Maintain minimum clear space equal to <strong>1x mark width</strong> (100% of the reticle box height) around the entire mark and wordmark to ensure visual legibility.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1 uppercase tracking-wider text-[11px]">
                3. Minimum Sizing
              </h3>
              <p className="leading-relaxed text-slate-500 dark:text-slate-400">
                - Favicon: <strong>16x16 px</strong>
                <br />
                - Icon Mark: <strong>24x24 px</strong>
                <br />
                - Full Wordmark: <strong>96x20 px</strong> (print: 20mm min)
              </p>
            </div>
          </div>

          {/* Direct File Links */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 uppercase tracking-wider text-[11px]">
              4. Exportable Assets
            </h3>
            <div className="flex flex-wrap gap-2">
              <a
                href="/logo.svg"
                download="ai-finder-logo.svg"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>logo.svg (Full)</span>
              </a>
              <a
                href="/logo-mark.svg"
                download="ai-finder-mark.svg"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>logo-mark.svg (Icon)</span>
              </a>
              <a
                href="/favicon.svg"
                download="favicon.svg"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>favicon.svg</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-md hover:opacity-90 transition-opacity"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
