export const CHAIN_IDS = {
  BASE: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID_BASE || '84532'),
  ORIGIN: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID_ORIGIN || '421614'),
} as const;

export const RPC_URLS = {
  BASE: process.env.NEXT_PUBLIC_BASE_RPC || 'https://sepolia.base.org',
  ORIGIN: process.env.NEXT_PUBLIC_ORIGIN_RPC || 'https://sepolia-rollup.arbitrum.io/rpc',
} as const;

// Fallback RPC endpoints
export const FALLBACK_RPC_URLS = {
  BASE: [
    'https://sepolia.base.org',
    'https://base-sepolia-rpc.publicnode.com',
    'https://base-sepolia.gateway.tenderly.co',
  ],
  ORIGIN: [
    'https://sepolia-rollup.arbitrum.io/rpc',
    'https://arbitrum-sepolia-rpc.publicnode.com',
  ],
} as const;

export const EXPLORER_URLS = {
  BASE: process.env.NEXT_PUBLIC_BASE_EXPLORER || 'https://sepolia.basescan.org',
  ORIGIN: process.env.NEXT_PUBLIC_ORIGIN_EXPLORER || 'https://sepolia.arbiscan.io',
} as const;

export const CONTRACT_ADDRESSES = {
  DESTINATION: process.env.NEXT_PUBLIC_DESTINATION_ADDR || '',
  ORIGIN_FEED: process.env.NEXT_PUBLIC_ORIGIN_FEED_ADDR || '0xD30EF1a1D4fb1bEa3172B6b766a07F79844428A2',
  REACTIVE: process.env.NEXT_PUBLIC_REACTIVE_CONTRACT || '',
} as const;

export const PRICE_DECIMALS = parseInt(process.env.NEXT_PUBLIC_PRICE_DECIMALS || '8');

export const FEATURE_FLAGS = {
  ENABLE_DEV: process.env.FEATURE_FLAG_ENABLE_DEV === 'true',
} as const;

export const POLLING_INTERVAL = 15000; // 15 seconds
export const MAX_HISTORY_POINTS = 200;
export const RPC_TIMEOUT = 10000; // 10 seconds

export const CHAIN_NAMES = {
  [CHAIN_IDS.BASE]: 'Base Sepolia',
  [CHAIN_IDS.ORIGIN]: 'Arbitrum Sepolia',
} as const;

