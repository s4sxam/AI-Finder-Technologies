import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Tool } from '../../types';

interface ToolFaqSectionProps {
  tool: Tool;
}

export const ToolFaqSection: React.FC<ToolFaqSectionProps> = ({ tool }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!tool.faqs || tool.faqs.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        Frequently Asked Questions
      </h2>
      <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
        {tool.faqs.map((faq, idx) => {
          const isOpen = openFaqIndex === idx;
          return (
            <div key={idx} className="p-4 transition-colors">
              <button
                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left font-semibold text-xs text-slate-900 dark:text-white gap-4"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed animate-in fade-in duration-150">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
