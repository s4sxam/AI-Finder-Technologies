import React, { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BenchmarkHistory } from '../../types/index.ts';
import { ChartCard } from './ChartCard.tsx';

interface HistoryLinesProps {
  history: BenchmarkHistory;
  updatedAt?: string;
  onSelectTool?: (slug: string) => void;
}

const LINE_COLORS = ['#2F5BFF', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

export const HistoryLines: React.FC<HistoryLinesProps> = ({
  history,
  updatedAt,
  onSelectTool
}) => {
  const shouldReduceMotion = useReducedMotion();

  // If fewer than 7 points, show collecting data state
  const isCollectingData = history.length < 7;

  // Find top 5 models from the latest snapshot
  const latestSnapshot = history[history.length - 1];
  const topModelIds = useMemo(() => {
    if (!latestSnapshot?.models) return [];
    return latestSnapshot.models.slice(0, 5).map((m) => m.id);
  }, [latestSnapshot]);

  const [activeSeries, setActiveSeries] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    topModelIds.forEach((id) => (init[id] = true));
    return init;
  });

  const toggleSeries = (id: string) => {
    setActiveSeries((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const svgWidth = 650;
  const svgHeight = 320;
  const padding = { top: 30, right: 30, bottom: 40, left: 55 };

  // Y Scale: 60 to 72
  const minY = 62;
  const maxY = 72;
  const getY = (val: number) => {
    const ratio = (val - minY) / (maxY - minY);
    return svgHeight - padding.bottom - ratio * (svgHeight - padding.top - padding.bottom);
  };

  // X Scale: Date snapshots
  const getX = (index: number) => {
    const count = Math.max(history.length - 1, 1);
    const ratio = index / count;
    return padding.left + ratio * (svgWidth - padding.left - padding.right);
  };

  // Map each model series
  const seriesData = useMemo(() => {
    return topModelIds.map((modelId, idx) => {
      const color = LINE_COLORS[idx % LINE_COLORS.length];
      const modelName =
        history.find((h) => h.models.some((m) => m.id === modelId))?.models.find((m) => m.id === modelId)
          ?.name || modelId;

      const points = history.map((snapshot, sIdx) => {
        const found = snapshot.models.find((m) => m.id === modelId);
        return {
          x: getX(sIdx),
          y: found ? getY(found.intelligenceIndex) : getY(minY),
          value: found?.intelligenceIndex ?? null,
          date: snapshot.date
        };
      });

      const validPoints = points.filter((p) => p.value !== null);
      const pathD = validPoints
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
        .join(' ');

      return {
        id: modelId,
        name: modelName,
        color,
        points: validPoints,
        pathD
      };
    });
  }, [topModelIds, history]);

  // Table Data
  const tableData = {
    columns: ['Date', ...seriesData.map((s) => s.name)],
    rows: history.map((snapshot) => [
      snapshot.date,
      ...seriesData.map((s) => {
        const found = snapshot.models.find((m) => m.id === s.id);
        return found ? `${found.intelligenceIndex.toFixed(1)}` : '—';
      })
    ])
  };

  if (isCollectingData) {
    return (
      <ChartCard
        title="Intelligence Trajectory Over Time"
        subtitle="Tracking multi-week progression in reasoning intelligence across frontier models."
        source="Artificial Analysis Independent Snapshots"
        sourceUrl="https://artificialanalysis.ai"
        updatedAt={updatedAt}
      >
        <div className="py-16 text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-[#2F5BFF] border-t-transparent animate-spin mx-auto" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Collecting Daily Benchmark Snapshots
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Our autonomous crawler currently holds {history.length} snapshots. A minimum of 7 daily historical points is required to render time-series curves.
          </p>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Intelligence Trajectory Over Time"
      subtitle="Historical timeline of reasoning indexes across top frontier models from automated daily crawl snapshots."
      source="Artificial Analysis Independent Snapshots"
      sourceUrl="https://artificialanalysis.ai"
      updatedAt={updatedAt}
      tableData={tableData}
    >
      <div className="w-full flex flex-col items-center">
        {/* Series Toggles / Legend */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          {seriesData.map((series) => {
            const isActive = activeSeries[series.id] !== false;
            return (
              <button
                key={series.id}
                type="button"
                onClick={() => toggleSeries(series.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'opacity-40 border-transparent text-slate-500 hover:opacity-75'
                }`}
                aria-pressed={isActive}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: series.color }}
                  aria-hidden="true"
                />
                <span>{series.name}</span>
              </button>
            );
          })}
        </div>

        {/* SVG Time Series Chart */}
        <div className="w-full max-w-[650px] aspect-[650/320] relative">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full select-none"
            role="img"
            aria-label="Intelligence over time chart"
          >
            {/* Horizontal Grid lines */}
            {[62, 64, 66, 68, 70, 72].map((val) => {
              const y = getY(val);
              return (
                <g key={`y-${val}`}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={svgWidth - padding.right}
                    y2={y}
                    stroke="currentColor"
                    strokeDasharray="3 3"
                    className="text-slate-200 dark:text-slate-800"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 3}
                    textAnchor="end"
                    className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Date Labels on X Axis */}
            {history.map((snapshot, idx) => {
              // Show label on every second point to avoid crowding
              if (idx % 2 !== 0 && idx !== history.length - 1) return null;
              const x = getX(idx);
              const formattedDate = snapshot.date.slice(5); // e.g. "02-15"
              return (
                <text
                  key={snapshot.date}
                  x={x}
                  y={svgHeight - padding.bottom + 16}
                  textAnchor="middle"
                  className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono"
                >
                  {formattedDate}
                </text>
              );
            })}

            {/* Model Lines with Stroke-dashoffset animation */}
            {seriesData.map((series) => {
              if (activeSeries[series.id] === false) return null;

              return (
                <g key={series.id}>
                  <motion.path
                    d={series.pathD}
                    fill="none"
                    stroke={series.color}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />

                  {/* Marker dots */}
                  {series.points.map((pt, pIdx) => (
                    <circle
                      key={pIdx}
                      cx={pt.x}
                      cy={pt.y}
                      r={3.5}
                      fill={series.color}
                      stroke="currentColor"
                      strokeWidth={1}
                      className="text-white dark:text-slate-900"
                    />
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </ChartCard>
  );
};
