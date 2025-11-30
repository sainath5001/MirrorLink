'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchPriceUpdateEvents } from '@/utils/fetchLogs';
import { POLLING_INTERVAL, MAX_HISTORY_POINTS } from '@/lib/constants';

export interface PriceHistoryPoint {
  timestamp: bigint;
  price: bigint;
  roundId: bigint;
}

export function usePriceHistory(chain: 'base' | 'origin', limit: number = MAX_HISTORY_POINTS) {
  return useQuery({
    queryKey: ['priceHistory', chain, limit],
    queryFn: async () => {
      if (chain === 'base') {
        const events = await fetchPriceUpdateEvents(0, 'latest', limit);
        return events.map((event) => ({
          timestamp: event.updatedAt,
          price: event.newPrice,
          roundId: event.roundId,
        })) as PriceHistoryPoint[];
      } else {
        // For origin, we'd need to fetch AnswerUpdated events
        // This is a simplified version - in production, implement full event fetching
        return [];
      }
    },
    refetchInterval: POLLING_INTERVAL,
    retry: 2,
  });
}

