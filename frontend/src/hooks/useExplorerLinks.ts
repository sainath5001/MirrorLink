'use client';

import { EXPLORER_URLS } from '@/lib/constants';

export function useExplorerLinks() {
  const getTxUrl = (txHash: string, chain: 'base' | 'origin' = 'base') => {
    const explorer = chain === 'base' ? EXPLORER_URLS.BASE : EXPLORER_URLS.ORIGIN;
    return `${explorer}/tx/${txHash}`;
  };

  const getAddressUrl = (address: string, chain: 'base' | 'origin' = 'base') => {
    const explorer = chain === 'base' ? EXPLORER_URLS.BASE : EXPLORER_URLS.ORIGIN;
    return `${explorer}/address/${address}`;
  };

  const getBlockUrl = (blockNumber: number, chain: 'base' | 'origin' = 'base') => {
    const explorer = chain === 'base' ? EXPLORER_URLS.BASE : EXPLORER_URLS.ORIGIN;
    return `${explorer}/block/${blockNumber}`;
  };

  return {
    getTxUrl,
    getAddressUrl,
    getBlockUrl,
  };
}

