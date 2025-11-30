import React from 'react';
import { formatPrice, formatRelativeTime } from '@/lib/format';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

interface PriceCardProps {
  title: string;
  price: bigint | number | null;
  roundId: bigint | number | null;
  updatedAt: bigint | number | null;
  isLoading?: boolean;
  error?: string | null;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export default function PriceCard({
  title,
  price,
  roundId,
  updatedAt,
  isLoading = false,
  error = null,
  trend = 'neutral',
  className = '',
}: PriceCardProps) {
  const TrendIcon = {
    up: FiTrendingUp,
    down: FiTrendingDown,
    neutral: FiMinus,
  }[trend];

  const trendColor = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  }[trend];

  return (
    <div
      className={`bg-gray-900 rounded-lg shadow-md p-6 border border-gray-800 ${className}`}
    >
      <h3 className="text-sm font-medium text-gray-400 mb-4">
        {title}
      </h3>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-red-600 text-sm py-4">{error}</div>
      )}

      {!isLoading && !error && price !== null && (
        <>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-white">
              ${formatPrice(price)}
            </span>
            <TrendIcon className={`w-6 h-6 ${trendColor}`} />
          </div>

          <div className="space-y-1 text-sm text-gray-400">
            {roundId !== null && (
              <div className="flex items-center justify-between">
                <span>Round ID:</span>
                <span className="font-mono">{roundId.toString()}</span>
              </div>
            )}
            {updatedAt !== null && (
              <div className="flex items-center justify-between">
                <span>Updated:</span>
                <span>{formatRelativeTime(updatedAt)}</span>
              </div>
            )}
          </div>
        </>
      )}

      {!isLoading && !error && price === null && (
        <div className="text-gray-500 text-sm py-4">No data available</div>
      )}
    </div>
  );
}

