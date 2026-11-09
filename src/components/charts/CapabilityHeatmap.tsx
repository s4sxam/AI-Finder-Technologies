import React, { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CheckCircle2, MinusCircle, XCircle, ArrowUpDown, Info } from 'lucide-react';
import { Tool, TaskId, TaskScore } from '../../types/index.ts';

interface CapabilityHeatmapProps {
  tools: Tool[];
  onSelectTool?: (slug: string) => void;
  limit?: number;
}

const TASK_COLUMNS: { id: TaskId; label: string; short: string }[] = [
  { id: 'chat', label: 'Conversational Logic', short: 'Chat' },
  { id: 'coding', label: 'Code Generation & Refactoring', short: 'Coding' },
  { id: 'writing', label: 'Long-Form Prose & Copy', short: 'Writing' },
  { id: 'research', label: 'Web & Academic Grounding', short: 'Research' },
  { id: 'docAnalysis', label: 'Document & PDF Parsing', short: 'Docs/PDF' },
  { id: 'dataAnalysis', label: 'Data & Code Interpreter', short: 'Data' },
  { id: 'agents', label: 'Autonomous Tool Calling', short: 'Agents' },
  { id: 'imageGen', label: 'Visual Synthesis', short: 'Image' },
  { id: 'videoGen', label: 'Generative Video', short: 'Video' },
  { id: 'audioVoice', label: 'Speech & Audio', short: 'Voice' }
];

export const CapabilityHeatmap: React.FC<CapabilityHeatmapProps> = ({
  tools,
  onSelectTool,
  limit = 20
}) => {
  const [sortedTask, setSortedTask] = useState<TaskId | null>('coding');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const shouldReduceMotion = useReducedMotion();

  const handleHeaderClick = (taskId: TaskId) => {
    if (sortedTask === taskId) {
      setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortedTask(taskId);
      setSortDirection('desc');
    }
  };

  // Filter tools that have capabilities defined
  const displayedTools = useMemo(() => {
    const list = tools.filter((t) => t.capabilities && Object.keys(t.capabilities).length > 0);

    if (sortedTask) {
      list.sort((a, b) => {
        const scoreA = a.capabilities?.[sortedTask] ?? -1;
        const scoreB = b.capabilities?.[sortedTask] ?? -1;
        if (sortDirection === 'desc') {
          return scoreB - scoreA || a.trendingRank - b.trendingRank;
        }
        return scoreA - scoreB || a.trendingRank - b.trendingRank;
      });
    } else {
      list.sort((a, b) => a.trendingRank - b.trendingRank);
    }

    return list.slice(0, limit);
  }, [tools, sortedTask, sortDirection, limit]);

  const renderBadge = (score: TaskScore | undefined, rowIndex: number, colIndex: number) => {
    if (score === undefined) {
      return (
        <span className="text-slate-300 dark:text-slate-700 text-xs">—</span>
      );
    }

    // Delay for diagonal stagger
    const delay = shouldReduceMotion ? 0 : (rowIndex + colIndex) * 0.015;

    if (score === 2) {
      return (
        <motion.span
          initial={shouldReduceMotion ? { scale: 1 } : { scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay }}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
          title="Strong Capability (Documented & Verified)"
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>Strong</span>
        </motion.span>
      );
    }

    if (score === 1) {
      return (
        <motion.span
          initial={shouldReduceMotion ? { scale: 1 } : { scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay }}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
          title="Limited Capability"
        >
          <MinusCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>Limited</span>
        </motion.span>
      );
    }

    return (
      <span
        className="inline-flex items-center gap-1 px-1 py-0.5 text-[10px] text-slate-400 dark:text-slate-600"
        title="No native support"
      >
        <XCircle className="w-2.5 h-2.5 opacity-40" />
        <span>No</span>
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            What Can Each AI Do? Capability Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cross-discipline breakdown of practical tool strengths. Click any task column header to re-sort.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Strong (2)
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400">
            <MinusCircle className="w-3.5 h-3.5" /> Limited (1)
          </span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <XCircle className="w-3.5 h-3.5" /> No (0)
          </span>
        </div>
      </div>

      {/* Responsive Table with Sticky First Column */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-100 dark:bg-slate-800/90 text-[11px] font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            <tr>
              <th scope="col" className="sticky left-0 z-20 bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 min-w-[170px] shadow-xs">
                Tool Name
              </th>
              {TASK_COLUMNS.map((col) => {
                const isSorted = sortedTask === col.id;
                return (
                  <th
                    key={col.id}
                    scope="col"
                    onClick={() => handleHeaderClick(col.id)}
                    className="px-3 py-3 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700/60 transition-colors whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1" title={col.label}>
                      <span>{col.short}</span>
                      <ArrowUpDown className={`w-3 h-3 ${isSorted ? 'text-[#2F5BFF]' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {displayedTools.map((tool, rIdx) => (
              <tr
                key={tool.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                onClick={() => onSelectTool && onSelectTool(tool.slug)}
              >
                {/* Sticky Left Column: Tool Name */}
                <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/90 px-4 py-2.5 font-semibold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800 shadow-xs whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: tool.accentColor || '#2F5BFF' }}
                    >
                      {tool.monogram}
                    </span>
                    <span className="group-hover:text-[#2F5BFF] transition-colors truncate max-w-[130px]">
                      {tool.name}
                    </span>
                  </div>
                </td>

                {/* Task Cells */}
                {TASK_COLUMNS.map((col, cIdx) => (
                  <td key={col.id} className="px-3 py-2.5 text-center whitespace-nowrap">
                    {renderBadge(tool.capabilities?.[col.id], rIdx, cIdx)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Disclaimers & Methodology Note */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#2F5BFF]" />
          <span>Editorial rating by AI Finder research team based on official documentation and verified feature sets.</span>
        </div>
        <div className="font-mono text-slate-400">
          Last reviewed: March 2026
        </div>
      </div>
    </div>
  );
};
