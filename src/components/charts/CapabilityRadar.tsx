import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Tool, TaskId } from '../../types/index.ts';

interface CapabilityRadarProps {
  tools: Tool[];
  className?: string;
}

const TASKS: { id: TaskId; label: string }[] = [
  { id: 'coding', label: 'Coding' },
  { id: 'chat', label: 'Reasoning' },
  { id: 'writing', label: 'Writing' },
  { id: 'research', label: 'Research' },
  { id: 'docAnalysis', label: 'Doc/PDF' },
  { id: 'dataAnalysis', label: 'Data Analysis' },
  { id: 'agents', label: 'Agents' },
  { id: 'imageGen', label: 'Image' }
];

const RADAR_COLORS = ['#2F5BFF', '#10B981', '#F59E0B'];

export const CapabilityRadar: React.FC<CapabilityRadarProps> = ({ tools, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();
  const selectedTools = tools.slice(0, 3);

  const size = 300;
  const center = size / 2;
  const radius = center - 42;
  const angleStep = (Math.PI * 2) / TASKS.length;

  // Helper to convert polar coordinates to Cartesian
  const getCoordinates = (taskIndex: number, score: number) => {
    // score is 0, 1, or 2 -> normalized to 0, 0.5, 1
    const r = (score / 2) * radius;
    const angle = taskIndex * angleStep - Math.PI / 2;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  return (
    <div className={`flex flex-col items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs ${className}`}>
      <div className="text-center mb-2">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Multidimensional Capability Radar
        </h4>
        <p className="text-[11px] text-slate-500">
          Overlaying task aptitudes (0 = none, 1 = limited, 2 = strong)
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-2 text-xs">
        {selectedTools.map((tool, idx) => (
          <div key={tool.id} className="flex items-center gap-1.5 font-medium">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: RADAR_COLORS[idx % RADAR_COLORS.length] }}
            />
            <span className="text-slate-800 dark:text-slate-200">{tool.name}</span>
          </div>
        ))}
      </div>

      <div className="relative w-[280px] h-[280px]">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full select-none" role="img" aria-label="Capability Radar Chart">
          {/* Concentric Grid Polygons */}
          {[1, 2].map((level) => {
            const levelPoints = TASKS.map((_, i) => {
              const { x, y } = getCoordinates(i, level);
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            }).join(' ');

            return (
              <polygon
                key={level}
                points={levelPoints}
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                strokeDasharray="3 3"
                className="text-slate-200 dark:text-slate-800"
              />
            );
          })}

          {/* Radial Spokes and Labels */}
          {TASKS.map((task, i) => {
            const outer = getCoordinates(i, 2);
            const labelCoord = {
              x: center + (radius + 20) * Math.cos(i * angleStep - Math.PI / 2),
              y: center + (radius + 20) * Math.sin(i * angleStep - Math.PI / 2)
            };

            return (
              <g key={task.id}>
                <line
                  x1={center}
                  y1={center}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="currentColor"
                  strokeWidth={1}
                  className="text-slate-200 dark:text-slate-800"
                />
                <text
                  x={labelCoord.x}
                  y={labelCoord.y + 3}
                  textAnchor="middle"
                  className="fill-slate-600 dark:fill-slate-400 text-[10px] font-semibold"
                >
                  {task.label}
                </text>
              </g>
            );
          })}

          {/* Tool Polygons */}
          {selectedTools.map((tool, idx) => {
            const color = RADAR_COLORS[idx % RADAR_COLORS.length];
            const pointsString = TASKS.map((task, tIdx) => {
              const score = tool.capabilities?.[task.id] ?? 0;
              const { x, y } = getCoordinates(tIdx, score);
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            }).join(' ');

            return (
              <motion.g
                key={tool.id}
                initial={shouldReduceMotion ? { scale: 1, opacity: 0.8 } : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.15 }}
                style={{ transformOrigin: `${center}px ${center}px` }}
              >
                <polygon
                  points={pointsString}
                  fill={color}
                  fillOpacity={0.25}
                  stroke={color}
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
                {TASKS.map((task, tIdx) => {
                  const score = tool.capabilities?.[task.id] ?? 0;
                  const { x, y } = getCoordinates(tIdx, score);
                  return (
                    <circle
                      key={tIdx}
                      cx={x}
                      cy={y}
                      r={3}
                      fill={color}
                      stroke="white"
                      strokeWidth={1}
                    />
                  );
                })}
              </motion.g>
            );
          })}
        </svg>
      </div>

      <div className="text-[10px] text-slate-400 text-center mt-2">
        Editorial rating by AI Finder. Evaluated across 8 practical workflow pillars.
      </div>
    </div>
  );
};
