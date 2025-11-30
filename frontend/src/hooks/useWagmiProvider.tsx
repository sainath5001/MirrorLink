'use client';

import { createConfig, http, WagmiProvider as WagmiProviderBase } from 'wagmi';
import { baseSepolia, arbitrumSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RPC_URLS } from '@/lib/constants';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const config = createConfig({
  chains: [baseSepolia, arbitrumSepolia],
  connectors: [
    injected(),
    ...(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
      ? [
          walletConnect({
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
          }),
        ]
      : []),
  ],
  transports: {
    [baseSepolia.id]: http(RPC_URLS.BASE, {
      retryCount: 3,
      retryDelay: 1000,
      timeout: 30000,
    }),
    [arbitrumSepolia.id]: http(RPC_URLS.ORIGIN, {
      retryCount: 3,
      retryDelay: 1000,
      timeout: 30000,
    }),
  },
});

export { config, queryClient };

export function WagmiConfigProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProviderBase config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProviderBase>
  );
}

WagmiConfigProvider.displayName = 'WagmiConfigProvider';

