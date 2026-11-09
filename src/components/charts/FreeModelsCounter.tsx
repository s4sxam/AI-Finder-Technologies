import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'motion/react';
import { Sparkles, Gift, ArrowRight } from 'lucide-react';

interface FreeModelsCounterProps {
  count: number;
  onExploreFree?: () => void;
}

export const FreeModelsCounter: React.FC<FreeModelsCounterProps> = ({
  count,
  onExploreFree
}) => {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (latest) => Math.round(latest));
  const shouldReduceMotion = useReducedMotion();
  const [displayCount, setDisplayCount] = useState(shouldReduceMotion ? count : 0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayCount(count);
      return;
    }
    const controls = animate(motionVal, count, {
      duration: 1.0,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayCount(Math.round(latest))
    });
    return () => controls.stop();
  }, [count, shouldReduceMotion]);

  // Sparkline points (simulated growth trend in free model offerings over recent quarters)
  const sparklineData = [8, 11, 14, 17, 19, 21, count];
  const maxSpark = Math.max(...sparklineData);
  const minSpark = Math.min(...sparklineData);

  const svgWidth = 140;
  const svgHeight = 36;
  const points = sparklineData.map((val, i) => {
    const x = (i / (sparklineData.length - 1)) * svgWidth;
    const y = svgHeight - ((val - minSpark) / (maxSpark - minSpark || 1)) * (svgHeight - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 dark:border-emerald-500/30 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
          <Gift className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {displayCount}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
              Zero Cost APIs
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Active community-free frontier and open-weights models available on OpenRouter without token charges.
          </p>
        </div>
      </div>

      {/* Sparkline & Explore CTA */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="hidden md:block">
          <div className="text-[10px] font-mono text-slate-400 text-right mb-1">Growth Trajectory</div>
          <svg width={svgWidth} height={svgHeight} className="overflow-visible" role="img" aria-label="Free models growth sparkline">
            <polyline
              fill="none"
              stroke="#10B981"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>

        {onExploreFree && (
          <button
            type="button"
            onClick={onExploreFree}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition-colors"
          >
            <span>Browse Free AI Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
