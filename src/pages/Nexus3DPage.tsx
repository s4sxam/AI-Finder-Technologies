import React from 'react';
import { ThreeScene } from '../components/ThreeScene';
import { ToolCategory } from '../types';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface Nexus3DPageProps {
  onNavigate: (path: string) => void;
  onSelectCategory: (category: ToolCategory) => void;
}

export const Nexus3DPage: React.FC<Nexus3DPageProps> = ({ onNavigate, onSelectCategory }) => {
  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-slate-950 flex flex-col">
      {/* Floating Header */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-3">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white rounded-lg transition-colors shadow-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit 3D View</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 border border-slate-800 text-xs text-slate-300 rounded-lg shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-[#2F5BFF]" />
          <span>Interactive AI Constellation Nexus (WebGL PBR)</span>
        </div>
      </div>

      {/* Full-bleed 3D Viewport */}
      <div className="flex-1 w-full h-full">
        <ThreeScene
          className="w-full h-full"
          onSelectCategory={(cat) => onNavigate(`/category/${cat}`)}
        />
      </div>
    </div>
  );
};
