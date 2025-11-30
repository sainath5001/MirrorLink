import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { RPC_URLS, CONTRACT_ADDRESSES } from '@/lib/constants';
import DestinationPriceStoreABI from '@/lib/abis/DestinationPriceStore.json';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { chain, fromBlock, toBlock, limit } = req.query;

  try {
    const chainType = chain === 'origin' ? 'origin' : 'base';
    const rpcUrl = chainType === 'base' ? RPC_URLS.BASE : RPC_URLS.ORIGIN;
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    if (chainType === 'base' && CONTRACT_ADDRESSES.DESTINATION) {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.DESTINATION,
        DestinationPriceStoreABI,
        provider
      );

      const filter = contract.filters.PriceUpdated();
      const from = fromBlock ? parseInt(fromBlock as string) : 0;
      const to = toBlock === 'latest' ? 'latest' : toBlock ? parseInt(toBlock as string) : 'latest';
      const maxLimit = limit ? parseInt(limit as string) : 100;

      const events = await contract.queryFilter(filter, from, to);
      const formattedEvents = events
        .slice(-maxLimit)
        .map((event) => ({
          oldPrice: event.args.oldPrice.toString(),
          newPrice: event.args.newPrice.toString(),
          roundId: event.args.roundId.toString(),
          updatedAt: event.args.updatedAt.toString(),
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        }))
        .reverse();

      return res.status(200).json({ events: formattedEvents });
    }

    // For origin chain, you'd implement AnswerUpdated event fetching here
    return res.status(200).json({ events: [] });
  } catch (error: unknown) {
    console.error('Error fetching logs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: errorMessage });
  }
}

