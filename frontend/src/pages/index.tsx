'use client';

import React, { useMemo } from 'react';
import { useOriginPrice } from '@/hooks/useOriginPrice';
import { useDestinationPrice } from '@/hooks/useDestinationPrice';
import { usePriceHistory } from '@/hooks/usePriceHistory';
import { useEvents } from '@/hooks/useEvents';
import ComparePanel from '@/components/ComparePanel';
import PriceChart from '@/components/PriceChart';
import EventList from '@/components/EventList';
import NetworkStatus from '@/components/NetworkStatus';
import ErrorBanner from '@/components/ErrorBanner';
import Loader from '@/components/Loader';

export default function Dashboard() {
  const {
    data: originPrice,
    isLoading: originLoading,
    error: originError,
    refetch: refetchOrigin,
  } = useOriginPrice();

  const {
    data: destPrice,
    isLoading: destLoading,
    error: destError,
    refetch: refetchDest,
  } = useDestinationPrice();

  const { data: originHistory = [] } = usePriceHistory('origin');
  const { data: destHistory = [] } = usePriceHistory('base');
  const { events } = useEvents();

  const combinedEvents = useMemo(() => {
    const destEvents = events.map((e) => ({
      type: 'destination' as const,
      price: e.newPrice,
      roundId: e.roundId,
      updatedAt: e.updatedAt,
      transactionHash: e.transactionHash,
      blockNumber: e.blockNumber,
    }));

    // In a full implementation, you'd also fetch origin events
    return destEvents;
  }, [events]);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          MirrorLink Dashboard
        </h1>
        <p className="text-gray-400">
          Real-time Chainlink ETH/USD price mirroring from Arbitrum Sepolia to Base Sepolia
        </p>
      </div>

      {(originError || destError) && (
        <ErrorBanner
          message={
            originError
              ? `Origin error: ${originError}`
              : `Destination error: ${destError}`
          }
          onRetry={() => {
            if (originError) refetchOrigin();
            if (destError) refetchDest();
          }}
        />
      )}

      <ComparePanel
        originPrice={originPrice?.price || null}
        originRoundId={originPrice?.roundId || null}
        originUpdatedAt={originPrice?.updatedAt || null}
        destPrice={destPrice?.price || null}
        destRoundId={destPrice?.roundId || null}
        destUpdatedAt={destPrice?.updatedAt || null}
        originLoading={originLoading}
        destLoading={destLoading}
        originError={originError?.message || null}
        destError={destError?.message || null}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {(originLoading || destLoading) && (
            <div className="flex items-center justify-center h-96">
              <Loader size="lg" />
            </div>
          )}
          {!originLoading && !destLoading && (
            <PriceChart originData={originHistory} destData={destHistory} />
          )}
        </div>

        <div className="space-y-6">
          <NetworkStatus />
          <EventList events={combinedEvents} />
        </div>
      </div>
    </div>
  );
}

