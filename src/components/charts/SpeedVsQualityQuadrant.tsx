import React, { useState } from 'react';
import { LiveModel } from '../../types/index.ts';
import { ChartCard } from './ChartCard.tsx';

interface SpeedVsQualityQuadrantProps {
  models: LiveModel[];
  updatedAt?: string;
  onSelectTool?: (slug: string) => void;
}

export const SpeedVsQualityQuadrant: React.FC<SpeedVsQualityQuadrantProps> = ({
  models,
  updatedAt,
  onSelectTool
}) => {
  const [hoveredModel, setHoveredModel] = useState<LiveModel | null>(null);

  // Models with speed and intelligence metrics
  const validModels = models.filter(
    (m) => m.intelligenceIndex !== null && m.outputTokensPerSec !== null && m.outputTokensPerSec > 0
  );

  const svgWidth = 650;
  const svgHeight = 340;
  const padding = { top: 30, right: 30, bottom: 45, left: 65 };

  // Speed: X axis (20 to 160 tokens/s)
  const minSpeed = 20;
  const maxSpeed = 160;
  const speedMidpoint = 85;

  const getX = (spd: number) => {
    const ratio = (spd - minSpeed) / (maxSpeed - minSpeed);
    return padding.left + ratio * (svgWidth - padding.left - padding.right);
  };

  // Intelligence: Y axis (50 to 74 pts)
  const minIntel = 50;
  const maxIntel = 74;
  const intelMidpoint = 63;

  const getY = (intel: number) => {
    const ratio = (intel - minIntel) / (maxIntel - minIntel);
    return svgHeight - padding.bottom - ratio * (svgHeight - padding.top - padding.bottom);
  };

  const midX = getX(speedMidpoint);
  const midY = getY(intelMidpoint);

  // Table Data
  const tableData = {
    columns: ['Model', 'Creator', 'Output Speed', 'Intelligence', 'Quadrant'],
    rows: validModels.map((m) => {
      const isFast = (m.outputTokensPerSec ?? 0) >= speedMidpoint;
      const isSmart = (m.intelligenceIndex ?? 0) >= intelMidpoint;
      let quadrant = 'Balanced';
      if (isFast && isSmart) quadrant = 'Fast & Frontier Smart';
      else if (!isFast && isSmart) quadrant = 'Deep Reasoning & Thinking';
      else if (isFast && !isSmart) quadrant = 'Ultra High-Throughput';
      else quadrant = 'Standard Utility';

      return [
        m.name,
        m.creator,
        `${m.outputTokensPerSec?.toFixed(0)} tok/s`,
        `${m.intelligenceIndex?.toFixed(1)} pts`,
        quadrant
      ];
    })
  };

  return (
    <ChartCard
      title="Speed vs. Quality Quadrant Matrix"
      subtitle="Evaluates real-world token generation throughput (tok/sec) against reasoning intelligence. Top-right models deliver both frontier intelligence and instant speed."
      source="Artificial Analysis & OpenRouter"
      sourceUrl="https://artificialanalysis.ai"
      updatedAt={updatedAt}
      tableData={tableData}
    >
      <div className="relative w-full overflow-hidden flex flex-col items-center">
        <div className="w-full max-w-[650px] aspect-[650/340] relative">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full select-none"
            role="img"
            aria-label="Speed versus Quality quadrant matrix"
          >
            {/* Quadrant Background Shading */}
            {/* Top-Right: Fast & Smart */}
            <rect
              x={midX}
              y={padding.top}
              width={svgWidth - padding.right - midX}
              height={midY - padding.top}
              fill="currentColor"
              className="text-emerald-500/10 dark:text-emerald-500/5"
            />
            {/* Top-Left: Deep Reasoning */}
            <rect
              x={padding.left}
              y={padding.top}
              width={midX - padding.left}
              height={midY - padding.top}
              fill="currentColor"
              className="text-blue-500/10 dark:text-blue-500/5"
            />
            {/* Bottom-Right: High Speed */}
            <rect
              x={midX}
              y={midY}
              width={svgWidth - padding.right - midX}
              height={svgHeight - padding.bottom - midY}
              fill="currentColor"
              className="text-amber-500/10 dark:text-amber-500/5"
            />
            {/* Bottom-Left: Standard */}
            <rect
              x={padding.left}
              y={midY}
              width={midX - padding.left}
              height={svgHeight - padding.bottom - midY}
              fill="currentColor"
              className="text-slate-500/5"
            />

            {/* Quadrant Labels */}
            <text
              x={svgWidth - padding.right - 10}
              y={padding.top + 18}
              textAnchor="end"
              className="fill-emerald-600 dark:fill-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider"
            >
              ✦ Fast & Smart (Optimal)
            </text>
            <text
              x={padding.left + 10}
              y={padding.top + 18}
              textAnchor="start"
              className="fill-blue-600 dark:fill-blue-400 text-[10px] font-mono font-bold uppercase tracking-wider"
            >
              ◈ Deep Reasoning (Extended Thinking)
            </text>
            <text
              x={svgWidth - padding.right - 10}
              y={svgHeight - padding.bottom - 10}
              textAnchor="end"
              className="fill-amber-600 dark:fill-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider"
            >
              ⚡ High-Throughput Engine
            </text>
            <text
              x={padding.left + 10}
              y={svgHeight - padding.bottom - 10}
              textAnchor="start"
              className="fill-slate-500 dark:fill-slate-400 text-[10px] font-mono font-bold uppercase tracking-wider"
            >
              Standard Utility
            </text>

            {/* Crosshair Center Dividing Lines */}
            <line
              x1={midX}
              y1={padding.top}
              x2={midX}
              y2={svgHeight - padding.bottom}
              stroke="currentColor"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              className="text-slate-300 dark:text-slate-700"
            />
            <line
              x1={padding.left}
              y1={midY}
              x2={svgWidth - padding.right}
              y2={midY}
              stroke="currentColor"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              className="text-slate-300 dark:text-slate-700"
            />

            {/* Model Points */}
            {validModels.map((model) => {
              const cx = getX(model.outputTokensPerSec!);
              const cy = getY(model.intelligenceIndex!);
              const isFastAndSmart = (model.outputTokensPerSec ?? 0) >= speedMidpoint && (model.intelligenceIndex ?? 0) >= intelMidpoint;

              return (
                <g
                  key={model.id}
                  className="cursor-pointer transition-transform"
                  onClick={() => model.toolSlug && onSelectTool && onSelectTool(model.toolSlug)}
                  onMouseEnter={() => setHoveredModel(model)}
                  onMouseLeave={() => setHoveredModel(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${model.name}: Speed ${model.outputTokensPerSec} tok/s, Intelligence ${model.intelligenceIndex}`}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={7}
                    className={`transition-all duration-150 ${
                      isFastAndSmart
                        ? 'fill-[#2F5BFF] stroke-white dark:stroke-slate-900 shadow-md ring-2 ring-emerald-400/40'
                        : 'fill-slate-600 dark:fill-slate-400 stroke-white dark:stroke-slate-900 opacity-80 hover:opacity-100'
                    }`}
                    strokeWidth={1.5}
                  />
                  <text
                    x={cx + (cx > svgWidth - 120 ? -8 : 8)}
                    y={cy - 4}
                    textAnchor={cx > svgWidth - 120 ? 'end' : 'start'}
                    className="fill-slate-800 dark:fill-slate-200 text-[9px] font-semibold pointer-events-none drop-shadow-xs"
                  >
                    {model.name.replace(/ \(.*\)/, '')}
                  </text>
                </g>
              );
            })}

            {/* Axis labels */}
            <text
              x={svgWidth / 2}
              y={svgHeight - 8}
              textAnchor="middle"
              className="fill-slate-500 text-[10px] font-medium"
            >
              Output Speed (tokens / second)
            </text>
            <text
              x={-svgHeight / 2}
              y={16}
              textAnchor="middle"
              transform="rotate(-90)"
              className="fill-slate-500 text-[10px] font-medium"
            >
              Intelligence Index (0-100)
            </text>
          </svg>
        </div>

        {/* Hover detail info */}
        {hoveredModel && (
          <div className="mt-2 p-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg text-xs shadow-lg flex items-center gap-4 animate-fade-in border border-slate-700 dark:border-slate-300">
            <div>
              <div className="font-bold">{hoveredModel.name}</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-600">by {hoveredModel.creator}</div>
            </div>
            <div className="border-l border-slate-700 dark:border-slate-300 pl-3">
              <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-slate-600 block">Speed</span>
              <span className="font-bold font-mono text-emerald-400 dark:text-emerald-600">
                {hoveredModel.outputTokensPerSec?.toFixed(0)} tok/s
              </span>
            </div>
            <div className="border-l border-slate-700 dark:border-slate-300 pl-3">
              <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-slate-600 block">Intelligence</span>
              <span className="font-bold font-mono">{hoveredModel.intelligenceIndex?.toFixed(1)} pts</span>
            </div>
          </div>
        )}
      </div>
    </ChartCard>
  );
};
