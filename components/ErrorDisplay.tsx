import React from 'react';
import { AlertCircle, AlertTriangle, Info, XCircle, CheckCircle, RefreshCw, X } from 'lucide-react';

export type ErrorType = 'error' | 'warning' | 'info' | 'success';

interface ErrorDisplayProps {
  type: ErrorType;
  title: string;
  message: string;
  details?: string;
  onDismiss?: () => void;
}

const iconMap = {
  error: <XCircle size={20} className="text-[#F54867]" />,
  warning: <AlertTriangle size={20} className="text-[#FF9678]" />,
  info: <Info size={20} className="text-[#974064]" />,
  success: <CheckCircle size={20} className="text-[#F54867]" />
};

const bgMap = {
  error: 'bg-[#F54867]/10 border-[#F54867]/30',
  warning: 'bg-[#FF9678]/10 border-[#FF9678]/30',
  info: 'bg-[#974064]/10 border-[#974064]/30',
  success: 'bg-[#F54867]/10 border-[#F54867]/30'
};

const titleColorMap = {
  error: 'text-[#FF9678]',
  warning: 'text-[#FF9678]',
  info: 'text-white',
  success: 'text-white'
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  type,
  title,
  message,
  details,
  onDismiss
}) => {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm ${bgMap[type]}`}>
      <div className="flex-shrink-0 mt-0.5">
        {iconMap[type]}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`font-bold text-sm ${titleColorMap[type]}`}>
          {title}
        </h4>
        <p className="text-sm text-white/60 mt-0.5">{message}</p>
        {details && (
          <details className="mt-2">
            <summary className="text-xs text-white/40 cursor-pointer hover:text-white/60">
              View details
            </summary>
            <pre className="mt-1 p-2 bg-[#41436B]/50 rounded-lg text-xs text-white/60 overflow-x-auto">
              {details}
            </pre>
          </details>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 hover:bg-[#F54867]/10 rounded-lg transition-colors"
        >
          <X size={16} className="text-white/40" />
        </button>
      )}
    </div>
  );
};

export const GenerationError: React.FC<{ error: string; onRetry?: () => void; onDismiss?: () => void }> = ({
  error,
  onRetry,
  onDismiss
}) => {
  let title = 'Generation Failed';
  let type: ErrorType = 'error';

  if (error.includes('invalid') || error.includes('parse') || error.includes('格式错误') || error.includes('解析')) {
    title = 'Invalid Response Format';
  } else if (error.includes('timeout') || error.includes('超时')) {
    title = 'Request Timeout';
  } else if (error.includes('network') || error.includes('网络')) {
    title = 'Network Error';
  }

  return (
    <div className="bg-[#41436B]/90 backdrop-blur-xl border border-[#974064]/30 rounded-xl p-4 space-y-3 shadow-lg">
      <ErrorDisplay
        type={type}
        title={title}
        message={error}
        onDismiss={onDismiss}
      />
      {onRetry && (
        <button
          onClick={onRetry}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-[#FF9678] to-[#F54867] hover:from-[#F54867] hover:to-[#FF9678] text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#41436B]/50"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;