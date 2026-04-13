import React, { useState } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => Promise<void>;
  isGenerating: boolean;
  disabled?: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  onSubmit,
  isGenerating,
  disabled = false
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating || disabled) return;
    await onSubmit(prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the 3D voxel model you want to generate..."
            disabled={isGenerating || disabled}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-indigo-200 focus:border-indigo-500 focus:bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-inner"
          />
        </div>
        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating || disabled}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all transform active:scale-95 disabled:transform-none shadow-lg hover:shadow-xl"
        >
          {isGenerating ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Generate</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PromptInput;