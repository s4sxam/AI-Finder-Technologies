import React, { useState } from 'react';
import { ShieldCheck, Rss, FileText, ExternalLink, Sparkles } from 'lucide-react';
import { BrandGuideModal } from './BrandGuideModal';
import { NewsletterSignup } from './NewsletterSignup';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [showBrandGuide, setShowBrandGuide] = useState(false);

  return (
    <>
      <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Newsletter Signup Integration */}
          <div className="mb-12 pb-8 border-b border-slate-100 dark:border-slate-800/80">
            <div className="max-w-xl">
              <NewsletterSignup />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            
            {/* Col 1: Brand & Mission */}
            <div className="col-span-2 space-y-3">
              <button
                onClick={() => onNavigate('/')}
                className="flex items-center gap-2.5 text-left focus:outline-none group"
              >
                <svg
                  className="w-6 h-6 shrink-0"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="32" height="32" rx="7" fill="#0B0F19" />
                  <path d="M7 12V7H12" stroke="#2F5BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M25 12V7H20" stroke="#2F5BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 20V25H12" stroke="#2F5BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M25 20V25H20" stroke="#2F5BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="16" cy="16" r="3.5" fill="#2F5BFF" />
                </svg>
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    AI Finder
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-500">
                    TECHNOLOGIES
                  </span>
                </div>
              </button>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                The premier independent directory and benchmarking laboratory for artificial intelligence tools. Evaluated by senior engineers and product designers.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setShowBrandGuide(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#2F5BFF] hover:underline font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Brand Guidelines & Assets</span>
                </button>
              </div>
            </div>

            {/* Col 2: Directory Categories */}
            <div>
              <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
                Categories
              </div>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => onNavigate('/category/coding')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Coding & Dev
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/category/chat')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Chat & Reasoning
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/category/image')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Generative Image
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/category/video')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Video & Motion
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/category/research')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Research & Search
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/category/writing')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Writing & Editorial
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Research & Editorial */}
            <div>
              <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
                Knowledge
              </div>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => onNavigate('/benchmarks')} className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 font-medium text-[#2F5BFF]">
                    <span>Live Benchmarks</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/free-apis')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Free AI APIs Hub
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/blog')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Research &amp; Guides
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/compare')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Compare Matrix
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/nexus-3d')} className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1">
                    <span>3D Constellation</span>
                    <Sparkles className="w-3 h-3 text-[#2F5BFF]" />
                  </button>
                </li>
                <li>
                  <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1">
                    <span>XML Sitemap</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
                <li>
                  <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1">
                    <span>robots.txt</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Organization & Legal */}
            <div>
              <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
                Company
              </div>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => onNavigate('/about')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    About & Methodology
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/submit')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Submit a Tool
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/contact')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Contact &amp; Inquiries
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/privacy')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/terms')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Hairline & Legal Bar */}
          <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 AI Finder Technologies. All rights reserved. Zero-tracking evaluations.
            </div>
            <div className="flex items-center gap-4">
              <span>Domain: https://yourdomain.com</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">WCAG 2.2 AA Compliant</span>
            </div>
          </div>
        </div>
      </footer>

      {showBrandGuide && (
        <BrandGuideModal onClose={() => setShowBrandGuide(false)} />
      )}
    </>
  );
};
