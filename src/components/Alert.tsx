import React from 'react';
import { AlertProps } from '../types';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import clsx from 'clsx';

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
  };

  const styles = {
    success: 'bg-green-500/20 border-green-500/30 text-green-200',
    error: 'bg-red-500/20 border-red-500/30 text-red-200',
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-200',
    warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-200',
  };

  return (
    <div className={clsx(
      'glass-card p-4 mb-6 border flex items-center gap-3',
      styles[type]
    )}>
      {icons[type]}
      <div className="flex-1">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;