'use client';

import { useEffect, useState } from 'react';
import { getProvider } from '@/lib/ethers';
import { CONTRACT_ADDRESSES } from '@/lib/constants';
import DestinationPriceStoreABI from '@/lib/abis/DestinationPriceStore.json';
import { ethers, type Log } from 'ethers';

export interface PriceUpdateEvent {
  oldPrice: bigint;
  newPrice: bigint;
  roundId: bigint;
  updatedAt: bigint;
  blockNumber: number;
  transactionHash: string;
}

export function useEvents() {
  const [events, setEvents] = useState<PriceUpdateEvent[]>([]);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!CONTRACT_ADDRESSES.DESTINATION) return;

    const provider = getProvider('base');
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.DESTINATION,
      DestinationPriceStoreABI,
      provider
    );

    const filter = contract.filters.PriceUpdated();
    
    // Fetch past events
    contract.queryFilter(filter, -1000).then((pastEvents) => {
      const formattedEvents: PriceUpdateEvent[] = pastEvents
        .slice(-20)
        .map((event) => ({
          oldPrice: event.args.oldPrice,
          newPrice: event.args.newPrice,
          roundId: event.args.roundId,
          updatedAt: event.args.updatedAt,
          blockNumber: event.blockNumber || 0,
          transactionHash: event.transactionHash || '',
        }))
        .reverse();
      setEvents(formattedEvents);
    });

    // Listen for new events
    const handleEvent = (
      oldPrice: bigint,
      newPrice: bigint,
      roundId: bigint,
      updatedAt: bigint,
      event: Log
    ) => {
      const newEvent: PriceUpdateEvent = {
        oldPrice,
        newPrice,
        roundId,
        updatedAt,
        blockNumber: event.blockNumber || 0,
        transactionHash: event.transactionHash || '',
      };
      setEvents((prev) => [newEvent, ...prev].slice(0, 50));
    };

    contract.on(filter, handleEvent);
    setIsListening(true);

    return () => {
      contract.off(filter, handleEvent);
      setIsListening(false);
    };
  }, []);

  return { events, isListening };
}

