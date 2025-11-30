import React from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorBanner({
  message,
  onDismiss,
  onRetry,
  className = '',
}: ErrorBannerProps) {
  return (
    <div
      className={`bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-3 ${className}`}
      role="alert"
    >
      <FiAlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-medium">Error</p>
        <p className="text-sm">{message}</p>
      </div>
      <div className="flex gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-red-800 hover:text-red-900 underline text-sm"
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-800 hover:text-red-900"
            aria-label="Dismiss error"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

