import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'motion/react';
import { LiveModel } from '../../types/index.ts';
import { ChartCard } from './ChartCard.tsx';

interface AnimatedBarRaceProps {
  models: LiveModel[];
  updatedAt?: string;
  onSelectTool?: (slug: string) => void;
}

type MetricKey = 'intelligence' | 'coding' | 'agentic' | 'speed' | 'price';

const CREATOR_COLORS: Record<string, string> = {
  Anthropic: '#D97706',
  OpenAI: '#10B981',
  DeepSeek: '#2563EB',
  Google: '#EA4335',
  Meta: '#0668E1',
  'Alibaba Qwen': '#8B5CF6',
  'Mistral AI': '#F97316',
  xAI: '#64748B'
};

function NumberCounter({ value, suffix = '', decimals = 1 }: { value: number; suffix?: string; decimals?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => `${latest.toFixed(decimals)}${suffix}`);
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(shouldReduceMotion ? `${value.toFixed(decimals)}${suffix}` : '0');

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(`${value.toFixed(decimals)}${suffix}`);
      return;
    }
    const controls = animate(count, value, {
      duration: 0.7,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayValue(`${latest.toFixed(decimals)}${suffix}`)
    });
    return () => controls.stop();
  }, [value, suffix, decimals, shouldReduceMotion]);

  return <span>{displayValue}</span>;
}

export const AnimatedBarRace: React.FC<AnimatedBarRaceProps> = ({
  models,
  updatedAt,
  onSelectTool
}) => {
  const [metric, setMetric] = useState<MetricKey>('intelligence');
  const shouldReduceMotion = useReducedMotion();

  // Metric extraction
  const getMetricValue = (m: LiveModel, key: MetricKey): number => {
    switch (key) {
      case 'intelligence':
        return m.intelligenceIndex ?? 0;
      case 'coding':
        return m.codingIndex ?? 0;
      case 'agentic':
        return m.agenticIndex ?? 0;
      case 'speed':
        return m.outputTokensPerSec ?? 0;
      case 'price':
        // For price, lower is better, but we plot blended price per 1M tokens ($)
        return (m.priceInPerM ?? 0) * 0.5 + (m.priceOutPerM ?? 0) * 0.5;
    }
  };

  const getMetricUnit = (key: MetricKey) => {
    switch (key) {
      case 'intelligence':
      case 'coding':
      case 'agentic':
        return 'pts';
      case 'speed':
        return ' tok/s';
      case 'price':
        return ' $/M';
    }
  };

  // Sort top 10 models (or top 8 on smaller screens)
  const rankedModels = [...models]
    .filter((m) => {
      const val = getMetricValue(m, metric);
      return val > 0 || m.isFree;
    })
    .sort((a, b) => {
      const valA = getMetricValue(a, metric);
      const valB = getMetricValue(b, metric);
      if (metric === 'price') {
        // Cheaper first
        return valA - valB;
      }
      return valB - valA;
    })
    .slice(0, 10);

  const maxValue = Math.max(...rankedModels.map((m) => getMetricValue(m, metric)), 1);

  // Table Data for Accessibility
  const tableData = {
    columns: ['Rank', 'Model', 'Creator', 'Category', 'Score / Value'],
    rows: rankedModels.map((m, idx) => [
      `#${idx + 1}`,
      m.name,
      m.creator,
      metric.toUpperCase(),
      `${getMetricValue(m, metric).toFixed(1)}${getMetricUnit(metric)}`
    ])
  };

  const controls = (
    <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      {(['intelligence', 'coding', 'agentic', 'speed', 'price'] as MetricKey[]).map((mKey) => (
        <button
          key={mKey}
          type="button"
          onClick={() => setMetric(mKey)}
          className={`px-2.5 py-1 text-[11px] font-semibold capitalize rounded-md transition-all ${
            metric === mKey
              ? 'bg-[#2F5BFF] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {mKey === 'price' ? 'Cost' : mKey}
        </button>
      ))}
    </div>
  );

  return (
    <ChartCard
      title="Frontier Model Performance Race"
      subtitle="Dynamic benchmark leaderboards across reasoning intelligence, coding agility, latency speed, and API economics."
      source="Artificial Analysis & OpenRouter"
      sourceUrl="https://artificialanalysis.ai"
      updatedAt={updatedAt}
      controls={controls}
      tableData={tableData}
    >
      <div className="w-full space-y-2.5 py-2">
        {rankedModels.map((model, index) => {
          const val = getMetricValue(model, metric);
          const widthPercent = Math.max(Math.min((val / maxValue) * 100, 100), 4);
          const color = CREATOR_COLORS[model.creator] || '#2F5BFF';

          return (
            <motion.div
              key={model.id}
              layout={!shouldReduceMotion}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="flex items-center gap-3 text-xs group cursor-pointer"
              onClick={() => model.toolSlug && onSelectTool && onSelectTool(model.toolSlug)}
            >
              {/* Rank and Creator Dot */}
              <div className="w-6 text-right font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500">
                #{index + 1}
              </div>

              {/* Model Name and Creator */}
              <div className="w-36 sm:w-48 truncate flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#2F5BFF] transition-colors truncate">
                  {model.name}
                </span>
              </div>

              {/* Bar Container */}
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-6 rounded-md overflow-hidden relative flex items-center px-2">
                <motion.div
                  initial={shouldReduceMotion ? { width: `${widthPercent}%` } : { width: '0%' }}
                  whileInView={{ width: `${widthPercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.04 }}
                  className="absolute inset-y-0 left-0 rounded-md opacity-85 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: color }}
                />

                {/* Number inside / alongside bar */}
                <span className="relative z-10 font-mono text-[11px] font-bold text-slate-900 dark:text-white drop-shadow-xs ml-auto">
                  {metric === 'price' && model.isFree ? (
                    <span className="text-emerald-500 dark:text-emerald-400 font-bold">100% Free</span>
                  ) : (
                    <NumberCounter value={val} suffix={getMetricUnit(metric)} />
                  )}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </ChartCard>
  );
};
