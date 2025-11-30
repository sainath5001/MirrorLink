import { ethers } from 'ethers';
import { RPC_URLS, CONTRACT_ADDRESSES } from './constants';
import AggregatorV3InterfaceABI from './abis/AggregatorV3Interface.json';
import DestinationPriceStoreABI from './abis/DestinationPriceStore.json';

export type ChainType = 'base' | 'origin';

export function getProvider(chain: ChainType): ethers.JsonRpcProvider {
  const rpcUrl = chain === 'base' ? RPC_URLS.BASE : RPC_URLS.ORIGIN;
  return new ethers.JsonRpcProvider(rpcUrl);
}

export function getContract(
  address: string,
  chain: ChainType,
  abi: ethers.InterfaceAbi
): ethers.Contract {
  const provider = getProvider(chain);
  return new ethers.Contract(address, abi, provider);
}

export function getOriginFeedContract(): ethers.Contract {
  return getContract(
    CONTRACT_ADDRESSES.ORIGIN_FEED,
    'origin',
    AggregatorV3InterfaceABI
  );
}

export function getDestinationContract(): ethers.Contract {
  return getContract(
    CONTRACT_ADDRESSES.DESTINATION,
    'base',
    DestinationPriceStoreABI
  );
}

export interface PriceData {
  roundId: bigint;
  answer: bigint;
  startedAt: bigint;
  updatedAt: bigint;
  answeredInRound: bigint;
}

export async function fetchLatestPriceData(
  chain: ChainType
): Promise<PriceData | null> {
  try {
    const address =
      chain === 'base'
        ? CONTRACT_ADDRESSES.DESTINATION
        : CONTRACT_ADDRESSES.ORIGIN_FEED;
    const abi =
      chain === 'base'
        ? DestinationPriceStoreABI
        : AggregatorV3InterfaceABI;

    const contract = getContract(address, chain, abi);
    const data = await contract.latestRoundData();

    return {
      roundId: data[0],
      answer: data[1],
      startedAt: data[2],
      updatedAt: data[3],
      answeredInRound: data[4],
    };
  } catch (error) {
    console.error(`Error fetching price from ${chain}:`, error);
    return null;
  }
}

