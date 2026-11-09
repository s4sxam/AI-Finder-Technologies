import React, { useState } from 'react';
import { Table, BarChart2, ExternalLink, Clock, ShieldCheck } from 'lucide-react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  source: string;
  sourceUrl?: string;
  updatedAt?: string;
  controls?: React.ReactNode;
  children: React.ReactNode;
  tableData?: {
    columns: string[];
    rows: (string | number | React.ReactNode)[][];
  };
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  source,
  sourceUrl,
  updatedAt,
  controls,
  children,
  tableData,
  className = ''
}) => {
  const [showTable, setShowTable] = useState(false);

  // Calculate formatted relative time
  const getFormattedTime = (dateStr?: string) => {
    if (!dateStr) return 'Live data';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffHours < 1) return 'Updated just now';
      if (diffHours < 24) return `Updated ${diffHours}h ago`;
      return `Showing data from ${date.toISOString().split('T')[0]}`;
    } catch {
      return 'Updated recently';
    }
  };

  return (
    <figure
      aria-label={title}
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors ${className}`}
    >
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h3>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {controls}
            {tableData && (
              <button
                type="button"
                onClick={() => setShowTable((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2F5BFF]"
                aria-pressed={showTable}
              >
                {showTable ? (
                  <>
                    <BarChart2 className="w-3.5 h-3.5 text-[#2F5BFF]" />
                    <span>View Chart</span>
                  </>
                ) : (
                  <>
                    <Table className="w-3.5 h-3.5 text-slate-500" />
                    <span>View as Table</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Chart View or Table View */}
        <div className="min-h-[300px] flex items-center justify-center">
          {showTable && tableData ? (
            <div className="w-full overflow-x-auto max-h-[360px] overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-800/80 sticky top-0 text-[11px] font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  <tr>
                    {tableData.columns.map((col, idx) => (
                      <th key={idx} scope="col" className="px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-700">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {tableData.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3.5 py-2 whitespace-nowrap">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="w-full">{children}</div>
          )}
        </div>
      </div>

      {/* Footer / Attribution */}
      <figcaption className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Source:</span>
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#2F5BFF] hover:underline inline-flex items-center gap-0.5"
            >
              {source}
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
            </a>
          ) : (
            <span className="font-medium text-slate-700 dark:text-slate-300">{source}</span>
          )}
        </div>

        {updatedAt && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{getFormattedTime(updatedAt)}</span>
          </div>
        )}
      </figcaption>
    </figure>
  );
};
