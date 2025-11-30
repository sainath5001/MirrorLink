'use client';

import { useLatestPrice } from './useLatestPrice';

export function useDestinationPrice() {
  return useLatestPrice('base');
}

