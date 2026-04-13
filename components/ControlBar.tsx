import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Pause, Play } from 'lucide-react';

interface ControlBarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  isAutoRotate: boolean;
  onToggleRotate: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  isAutoRotate,
  onToggleRotate
}) => {
  return (
    <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-2 py-1.5 flex items-center gap-1">
        <button
          onClick={onZoomIn}
          className="p-2 rounded-lg hover:bg-indigo-100 text-slate-600 hover:text-indigo-600 transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>

        <button
          onClick={onZoomOut}
          className="p-2 rounded-lg hover:bg-indigo-100 text-slate-600 hover:text-indigo-600 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>

        <div className="w-px h-5 bg-slate-200 mx-0.5" />

        <button
          onClick={onReset}
          className="p-2 rounded-lg hover:bg-indigo-100 text-slate-600 hover:text-indigo-600 transition-colors"
          title="Reset View"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <button
        onClick={onToggleRotate}
        className={`p-2.5 rounded-xl shadow-lg transition-colors ${
          isAutoRotate
            ? 'bg-indigo-500 text-white hover:bg-indigo-600'
            : 'bg-white/95 backdrop-blur-sm text-slate-600 hover:bg-indigo-100'
        }`}
        title={isAutoRotate ? 'Pause Rotation' : 'Auto Rotate'}
      >
        {isAutoRotate ? <Pause size={18} /> : <Play size={18} />}
      </button>
    </div>
  );
};

export default ControlBar;