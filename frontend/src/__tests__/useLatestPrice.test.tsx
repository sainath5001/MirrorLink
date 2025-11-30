import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLatestPrice } from '@/hooks/useLatestPrice';
import * as ethersLib from '@/lib/ethers';

// Mock the ethers library
vi.mock('@/lib/ethers', () => ({
  fetchLatestPriceData: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

describe('useLatestPrice', () => {
  it('fetches and normalizes price data', async () => {
    const mockPriceData = {
      roundId: BigInt('1'),
      answer: BigInt('200000000000'),
      startedAt: BigInt('1701234567'),
      updatedAt: BigInt('1701234587'),
      answeredInRound: BigInt('1'),
    };

    vi.mocked(ethersLib.fetchLatestPriceData).mockResolvedValue(mockPriceData);

    const { result } = renderHook(() => useLatestPrice('base'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchObject({
      price: BigInt('200000000000'),
      priceUSD: '2000.00',
      roundId: BigInt('1'),
      updatedAt: BigInt('1701234587'),
    });
  });

  it('handles errors gracefully', async () => {
    vi.mocked(ethersLib.fetchLatestPriceData).mockRejectedValue(
      new Error('RPC error')
    );

    const { result } = renderHook(() => useLatestPrice('base'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});

