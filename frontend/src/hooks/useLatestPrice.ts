'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchLatestPriceData, PriceData } from '@/lib/ethers';
import { POLLING_INTERVAL } from '@/lib/constants';

export interface NormalizedPriceData {
  price: bigint;
  priceUSD: string;
  roundId: bigint;
  updatedAt: bigint;
  startedAt: bigint;
  answeredInRound: bigint;
  decimals: number;
}

function normalizePriceData(data: PriceData | null): NormalizedPriceData | null {
  if (!data) return null;
  return {
    price: data.answer,
    priceUSD: (Number(data.answer) / 1e8).toFixed(2),
    roundId: data.roundId,
    updatedAt: data.updatedAt,
    startedAt: data.startedAt,
    answeredInRound: data.answeredInRound,
    decimals: 8,
  };
}

export function useLatestPrice(chain: 'base' | 'origin') {
  return useQuery({
    queryKey: ['latestPrice', chain],
    queryFn: () => fetchLatestPriceData(chain),
    select: normalizePriceData,
    refetchInterval: POLLING_INTERVAL,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

