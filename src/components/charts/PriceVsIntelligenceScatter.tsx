import React, { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { LiveModel } from '../../types/index.ts';
import { ChartCard } from './ChartCard.tsx';

interface PriceVsIntelligenceScatterProps {
  models: LiveModel[];
  updatedAt?: string;
  onSelectTool?: (slug: string) => void;
}

export const PriceVsIntelligenceScatter: React.FC<PriceVsIntelligenceScatterProps> = ({
  models,
  updatedAt,
  onSelectTool
}) => {
  const [hoveredModel, setHoveredModel] = useState<LiveModel | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Valid models with intelligence index
  const validModels = useMemo(() => {
    return models.filter((m) => m.intelligenceIndex !== null && m.intelligenceIndex > 45);
  }, [models]);

  // Compute blended price = (priceIn + priceOut) / 2
  const getBlendedPrice = (m: LiveModel) => {
    if (m.isFree) return 0;
    const pIn = m.priceInPerM ?? 0;
    const pOut = m.priceOutPerM ?? 0;
    return (pIn + pOut) / 2;
  };

  // Dimensions
  const svgWidth = 650;
  const svgHeight = 340;
  const padding = { top: 30, right: 30, bottom: 45, left: 65, freeStripWidth: 70 };

  // Y scale: Intelligence index (45 to 75)
  const minY = 48;
  const maxY = 74;
  const getY = (intel: number) => {
    const ratio = (intel - minY) / (maxY - minY);
    return svgHeight - padding.bottom - ratio * (svgHeight - padding.top - padding.bottom);
  };

  // X scale: Log scale for price (from $0.10 to $40.00)
  const minPrice = 0.1;
  const maxPrice = 40.0;
  const minLog = Math.log10(minPrice);
  const maxLog = Math.log10(maxPrice);

  const plotAreaLeft = padding.left + padding.freeStripWidth;
  const plotAreaWidth = svgWidth - plotAreaLeft - padding.right;

  const getX = (price: number) => {
    if (price <= 0) {
      // In the free strip
      return padding.left + padding.freeStripWidth / 2;
    }
    const clampedPrice = Math.max(minPrice, Math.min(price, maxPrice));
    const ratio = (Math.log10(clampedPrice) - minLog) / (maxLog - minLog);
    return plotAreaLeft + ratio * plotAreaWidth;
  };

  // Radius based on context length (min 4px, max 14px)
  const getRadius = (ctx: number | null) => {
    if (!ctx) return 5;
    if (ctx >= 1000000) return 12;
    if (ctx >= 200000) return 9;
    if (ctx >= 128000) return 7;
    return 5;
  };

  // Compute Pareto Frontier (best intelligence for equal or lower price)
  const paretoPoints = useMemo(() => {
    const sorted = [...validModels]
      .map((m) => ({ model: m, price: getBlendedPrice(m), intel: m.intelligenceIndex! }))
      .sort((a, b) => a.price - b.price);

    const frontier: { x: number; y: number; name: string }[] = [];
    let maxIntelSoFar = -1;

    for (const item of sorted) {
      if (item.intel > maxIntelSoFar) {
        maxIntelSoFar = item.intel;
        frontier.push({
          x: getX(item.price),
          y: getY(item.intel),
          name: item.model.name
        });
      }
    }
    return frontier;
  }, [validModels]);

  const paretoPathD = paretoPoints
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(' ');

  // Table Data
  const tableData = {
    columns: ['Model', 'Creator', 'Intelligence', 'Blended Price / 1M', 'Context Window'],
    rows: validModels.map((m) => [
      m.name,
      m.creator,
      `${m.intelligenceIndex?.toFixed(1)} pts`,
      m.isFree ? '100% Free' : `$${getBlendedPrice(m).toFixed(2)}`,
      m.contextLength ? `${(m.contextLength / 1000).toLocaleString()}k tokens` : 'Standard'
    ])
  };

  return (
    <ChartCard
      title="Price vs. Intelligence Efficiency Frontier"
      subtitle="Logarithmic price against reasoning capability. Points on the dashed green line represent the Pareto optimal cost-to-performance frontier."
      source="Artificial Analysis & OpenRouter"
      sourceUrl="https://artificialanalysis.ai"
      updatedAt={updatedAt}
      tableData={tableData}
    >
      <div className="relative w-full overflow-hidden flex flex-col items-center">
        {/* SVG Scatter Plot */}
        <div className="w-full max-w-[650px] aspect-[650/340] relative">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full select-none"
            role="img"
            aria-label="Scatter chart showing price versus intelligence"
          >
            {/* Free strip background */}
            <rect
              x={padding.left - 10}
              y={padding.top}
              width={padding.freeStripWidth + 10}
              height={svgHeight - padding.top - padding.bottom}
              fill="currentColor"
              className="text-emerald-500/10 dark:text-emerald-400/5"
              rx={6}
            />
            <text
              x={padding.left + padding.freeStripWidth / 2}
              y={padding.top + 14}
              textAnchor="middle"
              className="fill-emerald-600 dark:fill-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider"
            >
              Free Strip
            </text>

            {/* Grid lines: Y Axis (Intelligence) */}
            {[50, 55, 60, 65, 70].map((val) => {
              const y = getY(val);
              return (
                <g key={`y-${val}`}>
                  <line
                    x1={padding.left - 10}
                    y1={y}
                    x2={svgWidth - padding.right}
                    y2={y}
                    stroke="currentColor"
                    strokeDasharray="3 3"
                    className="text-slate-200 dark:text-slate-800"
                  />
                  <text
                    x={padding.left - 18}
                    y={y + 3}
                    textAnchor="end"
                    className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Grid lines: X Axis (Price Log: $0.10, $1.00, $10.00) */}
            {[0.1, 1.0, 10.0, 30.0].map((price) => {
              const x = getX(price);
              return (
                <g key={`x-${price}`}>
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={svgHeight - padding.bottom}
                    stroke="currentColor"
                    strokeDasharray="3 3"
                    className="text-slate-200 dark:text-slate-800"
                  />
                  <text
                    x={x}
                    y={svgHeight - padding.bottom + 16}
                    textAnchor="middle"
                    className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono"
                  >
                    ${price < 1 ? price.toFixed(2) : price.toFixed(0)}
                  </text>
                </g>
              );
            })}

            {/* Pareto Frontier Connecting Line */}
            {paretoPathD && (
              <motion.path
                d={paretoPathD}
                fill="none"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="4 4"
                initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            )}

            {/* Model Bubbles */}
            {validModels.map((model) => {
              const price = getBlendedPrice(model);
              const cx = getX(price);
              const cy = getY(model.intelligenceIndex!);
              const r = getRadius(model.contextLength);
              const isPareto = paretoPoints.some((p) => p.name === model.name);

              return (
                <g
                  key={model.id}
                  className="cursor-pointer transition-transform"
                  onClick={() => model.toolSlug && onSelectTool && onSelectTool(model.toolSlug)}
                  onMouseEnter={() => setHoveredModel(model)}
                  onMouseLeave={() => setHoveredModel(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${model.name}: Intelligence ${model.intelligenceIndex}, Price $${price.toFixed(2)}`}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    className={`transition-all duration-150 ${
                      model.isFree
                        ? 'fill-emerald-500 stroke-emerald-600 dark:stroke-emerald-400'
                        : isPareto
                        ? 'fill-[#2F5BFF] stroke-white dark:stroke-slate-900 shadow-md'
                        : 'fill-slate-400 dark:fill-slate-600 stroke-white dark:stroke-slate-900 opacity-70 hover:opacity-100'
                    }`}
                    strokeWidth={1.5}
                  />

                  {/* Label for notable models */}
                  {(isPareto || model.isFree || model.intelligenceIndex! >= 68) && (
                    <text
                      x={cx + (cx > svgWidth - 100 ? -8 : 8)}
                      y={cy - 4}
                      textAnchor={cx > svgWidth - 100 ? 'end' : 'start'}
                      className="fill-slate-700 dark:fill-slate-300 text-[9px] font-semibold pointer-events-none drop-shadow-xs"
                    >
                      {model.name.replace(/ \(.*\)/, '')}
                    </text>
                  )}
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
              Blended API Price per 1M Tokens (Log Scale)
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

        {/* Hover Tooltip Card */}
        {hoveredModel && (
          <div className="mt-2 p-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg text-xs shadow-lg flex items-center gap-4 animate-fade-in border border-slate-700 dark:border-slate-300">
            <div>
              <div className="font-bold">{hoveredModel.name}</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-600">by {hoveredModel.creator}</div>
            </div>
            <div className="border-l border-slate-700 dark:border-slate-300 pl-3">
              <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-slate-600 block">Intelligence</span>
              <span className="font-bold font-mono text-emerald-400 dark:text-emerald-600">{hoveredModel.intelligenceIndex} pts</span>
            </div>
            <div className="border-l border-slate-700 dark:border-slate-300 pl-3">
              <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-slate-600 block">Cost / 1M</span>
              <span className="font-bold font-mono">{hoveredModel.isFree ? 'Free' : `$${getBlendedPrice(hoveredModel).toFixed(2)}`}</span>
            </div>
          </div>
        )}
      </div>
    </ChartCard>
  );
};
