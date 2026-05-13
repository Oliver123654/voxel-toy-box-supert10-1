// File: C:\Users\94234\Downloads\voxel-toy-box-supert10-1-main\components\ModeSelection.tsx
import React from 'react';
import { Zap, Wrench, Sparkles, Cog } from 'lucide-react';

export type AppMode = 'expert' | 'quick';

interface ModeSelectionProps {
  onSelect: (mode: AppMode) => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelect }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative text-center space-y-12 animate-in fade-in zoom-in duration-700">
        <div className="space-y-4">
          <h1 className="text-6xl font-black text-gray-800 tracking-tight drop-shadow-lg">
            Voxel Toy Box
          </h1>
          <p className="text-gray-600 text-xl font-medium">
            Choose your creative mode
          </p>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => onSelect('quick')}
            className="group relative w-80 p-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-3xl shadow-xl hover:scale-105 transition-all duration-300"
          >
            <div className="relative space-y-6">
              <div className="flex items-center justify-center w-24 h-24 mx-auto bg-white/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Zap size={44} className="text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-white">Quick Mode</h2>
                <p className="text-white/80 text-sm font-medium px-4">
                  Just enter a prompt and generate instantly
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/70 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} />
                <span>Fast & Simple</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelect('expert')}
            className="group relative w-80 p-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl shadow-xl hover:scale-105 transition-all duration-300"
          >
            <div className="relative space-y-6">
              <div className="flex items-center justify-center w-24 h-24 mx-auto bg-white/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Cog size={44} className="text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-white">Expert Mode</h2>
                <p className="text-white/80 text-sm font-medium px-4">
                  Full control over models and parameters
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/70 text-xs font-bold uppercase tracking-wider">
                <Wrench size={14} />
                <span>Full Control</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelection;