import React, { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md';
}

export default function CopyButton({
  text,
  className = '',
  size = 'md',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${sizeClasses[size]} ${className}`}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <FiCheck className="w-4 h-4 text-green-600" />
      ) : (
        <FiCopy className="w-4 h-4 text-gray-600" />
      )}
    </button>
  );
}

