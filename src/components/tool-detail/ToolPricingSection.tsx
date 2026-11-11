import React from 'react';
import { Tool } from '../../types';

interface ToolPricingSectionProps {
  tool: Tool;
}

export const ToolPricingSection: React.FC<ToolPricingSectionProps> = ({ tool }) => {
  return (
    <section className="p-6 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">
        Pricing Structure &amp; Value Analysis
      </h2>
      <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {tool.pricingDetails}
      </div>
      {tool.priceVerifiedAt && (
        <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
          <span>Pricing verified directly with official documentation on {tool.priceVerifiedAt}.</span>
        </div>
      )}
    </section>
  );
};
