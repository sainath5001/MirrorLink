import { ethers } from 'ethers';
import { RPC_URLS, CONTRACT_ADDRESSES } from '@/lib/constants';
import DestinationPriceStoreABI from '@/lib/abis/DestinationPriceStore.json';

export interface PriceUpdateEvent {
  oldPrice: bigint;
  newPrice: bigint;
  roundId: bigint;
  updatedAt: bigint;
  blockNumber: number;
  transactionHash: string;
}

export async function fetchPriceUpdateEvents(
  fromBlock: number = 0,
  toBlock: number | 'latest' = 'latest',
  limit: number = 100
): Promise<PriceUpdateEvent[]> {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URLS.BASE);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.DESTINATION,
      DestinationPriceStoreABI,
      provider
    );

    const filter = contract.filters.PriceUpdated();
    const events = await contract.queryFilter(filter, fromBlock, toBlock);

    const formattedEvents: PriceUpdateEvent[] = events
      .slice(-limit)
      .map((event) => ({
        oldPrice: event.args.oldPrice,
        newPrice: event.args.newPrice,
        roundId: event.args.roundId,
        updatedAt: event.args.updatedAt,
        blockNumber: event.blockNumber || 0,
        transactionHash: event.transactionHash || '',
      }));

    return formattedEvents.reverse(); // Most recent first
  } catch (error) {
    console.error('Error fetching price update events:', error);
    return [];
  }
}

