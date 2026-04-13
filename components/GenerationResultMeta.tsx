import React from 'react';
import { Box, Palette, Ruler, AlertTriangle, CheckCircle } from 'lucide-react';
import { GenerationMetadata } from '../types';

interface GenerationResultMetaProps {
  metadata: GenerationMetadata;
}

export const GenerationResultMeta: React.FC<GenerationResultMetaProps> = ({ metadata }) => {
  const { voxelCount, colorCount, dimensions, warnings } = metadata;

  return (
    <div className="bg-[#41436B]/90 backdrop-blur-xl border border-[#974064]/30 rounded-xl p-4 space-y-3 shadow-lg">
      <h3 className="font-bold text-white flex items-center gap-2">
        <CheckCircle size={18} className="text-[#F54867]" />
        Generation Result
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <MetaItem
          icon={<Box size={16} />}
          label="Voxel Count"
          value={voxelCount.toLocaleString()}
          color="text-[#FF9678]"
          bgColor="bg-[#FF9678]/10"
        />
        <MetaItem
          icon={<Palette size={16} />}
          label="Color Count"
          value={colorCount.toString()}
          color="text-white"
          bgColor="bg-[#F54867]/10"
        />
        <MetaItem
          icon={<Ruler size={16} />}
          label="Dimensions"
          value={`${dimensions.width} × ${dimensions.height} × ${dimensions.depth}`}
          color="text-[#F54867]"
          bgColor="bg-[#FF9678]/10"
          className="col-span-2"
        />
      </div>

      {warnings && warnings.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#974064]/20">
          <div className="flex items-start gap-2 text-[#FF9678]">
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold uppercase">Warning</span>
              <ul className="text-sm mt-1 space-y-1 text-white/60">
                {warnings.map((warning, idx) => (
                  <li key={idx}>• {warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface MetaItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
  bgColor?: string;
  className?: string;
}

const MetaItem: React.FC<MetaItemProps> = ({ icon, label, value, color = 'text-white', bgColor = 'bg-[#FF9678]/10', className = '' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className={`p-2 rounded-lg ${bgColor}`}>{icon}</div>
    <div>
      <span className="text-xs text-white/40 block">{label}</span>
      <span className={`font-bold text-sm ${color}`}>{value}</span>
    </div>
  </div>
);

export default GenerationResultMeta;