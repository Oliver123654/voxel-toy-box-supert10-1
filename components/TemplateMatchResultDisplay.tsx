import React from 'react';
import { Search, XCircle, Target } from 'lucide-react';
import { TemplateMatchResult } from '../types';

interface TemplateMatchResultDisplayProps {
  result: TemplateMatchResult;
}

export const TemplateMatchResultDisplay: React.FC<TemplateMatchResultDisplayProps> = ({ result }) => {
  const { matched, templateName, confidence, templateInfo } = result;

  if (!matched) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-slate-500">
          <Search size={18} />
          <span className="font-medium">Template Match</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
          <XCircle size={14} />
          <span>No template matched, full generation will proceed</span>
        </div>
      </div>
    );
  }

  const confidencePercent = confidence ? Math.round(confidence * 100) : 0;
  const confidenceColor = confidencePercent >= 80 ? 'text-emerald-600' : confidencePercent >= 50 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-indigo-700">
        <Target size={18} />
        <span className="font-bold">Template Match Result</span>
      </div>

      <div className="bg-white rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Template Name</span>
          <span className="font-bold text-indigo-700">{templateName || 'Unknown Template'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Confidence</span>
          <span className={`font-bold ${confidenceColor}`}>{confidencePercent}%</span>
        </div>
        {templateInfo && (
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 block mb-1">Template Info</span>
            <p className="text-sm text-slate-700">{templateInfo}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateMatchResultDisplay;