import React from 'react';
import PriceCard from './PriceCard';
import { calculatePriceDelta, calculateLatency } from '@/lib/format';
import { FiArrowRight, FiClock } from 'react-icons/fi';

interface ComparePanelProps {
  originPrice: bigint | number | null;
  originRoundId: bigint | number | null;
  originUpdatedAt: bigint | number | null;
  destPrice: bigint | number | null;
  destRoundId: bigint | number | null;
  destUpdatedAt: bigint | number | null;
  originLoading?: boolean;
  destLoading?: boolean;
  originError?: string | null;
  destError?: string | null;
}

export default function ComparePanel({
  originPrice,
  originRoundId,
  originUpdatedAt,
  destPrice,
  destRoundId,
  destUpdatedAt,
  originLoading = false,
  destLoading = false,
  originError = null,
  destError = null,
}: ComparePanelProps) {
  const delta =
    originPrice !== null && destPrice !== null
      ? calculatePriceDelta(originPrice, destPrice)
      : null;

  const latency =
    originUpdatedAt !== null && destUpdatedAt !== null
      ? calculateLatency(originUpdatedAt, destUpdatedAt)
      : null;

  const trend =
    delta && delta.percentage > 0.01
      ? 'up'
      : delta && delta.percentage < -0.01
      ? 'down'
      : 'neutral';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <PriceCard
        title="Origin (Arbitrum Sepolia)"
        price={originPrice}
        roundId={originRoundId}
        updatedAt={originUpdatedAt}
        isLoading={originLoading}
        error={originError}
        trend="neutral"
      />

      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2 text-gray-400">
          <FiArrowRight className="w-5 h-5" />
          <span className="text-sm font-medium">Mirroring</span>
        </div>

        {delta && (
          <div className="text-center">
            <div
              className={`text-lg font-semibold ${
                Math.abs(delta.percentage) < 0.01
                  ? 'text-green-600'
                  : 'text-yellow-600'
              }`}
            >
              Δ {delta.absolute.toFixed(4)} USD
            </div>
            <div className="text-xs text-gray-500">
              {delta.percentage > 0 ? '+' : ''}
              {delta.percentage.toFixed(4)}%
            </div>
          </div>
        )}

        {latency !== null && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <FiClock className="w-3 h-3" />
            <span>Latency: {latency}s</span>
          </div>
        )}
      </div>

      <PriceCard
        title="Destination (Base Sepolia)"
        price={destPrice}
        roundId={destRoundId}
        updatedAt={destUpdatedAt}
        isLoading={destLoading}
        error={destError}
        trend={trend}
      />
    </div>
  );
}

