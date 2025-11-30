/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@react-native-async-storage/async-storage': false,
      };
    }
    return config;
  },
  env: {
    NEXT_PUBLIC_BASE_RPC: process.env.NEXT_PUBLIC_BASE_RPC,
    NEXT_PUBLIC_ORIGIN_RPC: process.env.NEXT_PUBLIC_ORIGIN_RPC,
    NEXT_PUBLIC_DESTINATION_ADDR: process.env.NEXT_PUBLIC_DESTINATION_ADDR,
    NEXT_PUBLIC_ORIGIN_FEED_ADDR: process.env.NEXT_PUBLIC_ORIGIN_FEED_ADDR,
    NEXT_PUBLIC_REACTIVE_CONTRACT: process.env.NEXT_PUBLIC_REACTIVE_CONTRACT,
    NEXT_PUBLIC_BASE_EXPLORER: process.env.NEXT_PUBLIC_BASE_EXPLORER,
    NEXT_PUBLIC_ORIGIN_EXPLORER: process.env.NEXT_PUBLIC_ORIGIN_EXPLORER,
    NEXT_PUBLIC_CHAIN_ID_BASE: process.env.NEXT_PUBLIC_CHAIN_ID_BASE,
    NEXT_PUBLIC_CHAIN_ID_ORIGIN: process.env.NEXT_PUBLIC_CHAIN_ID_ORIGIN,
    NEXT_PUBLIC_PRICE_DECIMALS: process.env.NEXT_PUBLIC_PRICE_DECIMALS,
    FEATURE_FLAG_ENABLE_DEV: process.env.FEATURE_FLAG_ENABLE_DEV,
  },
};

module.exports = nextConfig;

