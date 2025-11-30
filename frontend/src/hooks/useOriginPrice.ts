'use client';

import { useLatestPrice } from './useLatestPrice';

export function useOriginPrice() {
  return useLatestPrice('origin');
}

