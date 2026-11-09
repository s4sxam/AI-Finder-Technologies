import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Code, MessageSquare, PenTool, Image, Video, Mic, Search, FileText, Database, Bot, ArrowRight, Star } from 'lucide-react';
import { Tool, TaskId } from '../types/index.ts';

interface TaskToolSelectorProps {
  tools: Tool[];
  onSelectTool: (slug: string) => void;
}

const TASKS: { id: TaskId; title: string; prompt: string; icon: React.ElementType }[] = [
  { id: 'coding', title: 'Write & Refactor Code', prompt: 'I want to build software, refactor algorithms, or run automated coding agents', icon: Code },
  { id: 'chat', title: 'Deep Logic & Reasoning', prompt: 'I want complex chain-of-thought analysis, math proofs, or strategic planning', icon: MessageSquare },
  { id: 'research', title: 'Academic Research & Citations', prompt: 'I want verified peer-reviewed papers, web research, and cited synthesis', icon: Search },
  { id: 'writing', title: 'Long-Form Writing & Copy', prompt: 'I want nuanced essays, editorial copywriting, and persuasive prose', icon: PenTool },
  { id: 'docAnalysis', title: 'Analyze Long PDFs & Docs', prompt: 'I want to upload multi-hundred page documents, contracts, and research reports', icon: FileText },
  { id: 'imageGen', title: 'Synthesize & Edit Images', prompt: 'I want photorealistic renders, UI assets, concept art, and vector graphics', icon: Image },
  { id: 'videoGen', title: 'Generate AI Video', prompt: 'I want cinematic generative video clips, camera physics, and avatar presenters', icon: Video },
  { id: 'audioVoice', title: 'Voice & Audio Cloning', prompt: 'I want emotional text-to-speech, transcription, music synthesis, and podcasts', icon: Mic },
  { id: 'dataAnalysis', title: 'Analyze Structured Data', prompt: 'I want to execute Python scripts over CSVs, run regressions, and chart SQL data', icon: Database },
  { id: 'agents', title: 'Autonomous Multi-Step Agents', prompt: 'I want AI agents that execute terminal commands, browse, and build end-to-end', icon: Bot }
];

export const TaskToolSelector: React.FC<TaskToolSelectorProps> = ({ tools, onSelectTool }) => {
  const [selectedTask, setSelectedTask] = useState<TaskId>('coding');
  const shouldReduceMotion = useReducedMotion();

  // Find tools with strong capability (2) for this task, sorted by rating
  const matchingTools = tools
    .filter((t) => t.capabilities?.[selectedTask] === 2)
    .sort((a, b) => b.rating - a.rating || a.trendingRank - b.trendingRank)
    .slice(0, 6);

  const currentTaskMeta = TASKS.find((t) => t.id === selectedTask) || TASKS[0];

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
      {/* Selector Header */}
      <div>
        <div className="text-xs font-mono font-semibold text-[#2F5BFF] uppercase tracking-wider mb-1">
          Smart Task Recommendation Engine
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          What do you want to accomplish today?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {currentTaskMeta.prompt}
        </p>
      </div>

      {/* Task Buttons Carousel / Grid */}
      <div className="flex flex-wrap gap-2">
        {TASKS.map((task) => {
          const Icon = task.icon;
          const isSelected = selectedTask === task.id;

          return (
            <button
              key={task.id}
              type="button"
              onClick={() => setSelectedTask(task.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-[#2F5BFF] text-white shadow-md shadow-blue-500/20 font-semibold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{task.title}</span>
            </button>
          );
        })}
      </div>

      {/* Matching Tools List with Motion Layout Animation */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-slate-800">
          <span>Top Verified Platforms for {currentTaskMeta.title}</span>
          <span className="font-mono text-[11px] text-[#2F5BFF]">Editorial Score: Strong (2/2)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {matchingTools.map((tool, idx) => (
            <motion.div
              key={tool.id}
              layout={!shouldReduceMotion}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              onClick={() => onSelectTool(tool.slug)}
              className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-[#2F5BFF]/60 rounded-xl p-4 cursor-pointer transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-xs"
                      style={{ backgroundColor: tool.accentColor || '#2F5BFF' }}
                    >
                      {tool.monogram}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-white group-hover:text-[#2F5BFF] transition-colors truncate">
                        {tool.name}
                      </div>
                      <div className="text-[10px] text-slate-400 capitalize">{tool.pricing}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{tool.rating.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {tool.tagline}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400 group-hover:text-white transition-colors">
                <span className="text-[11px] font-medium">{tool.bestFor.slice(0, 36)}...</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2F5BFF] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
