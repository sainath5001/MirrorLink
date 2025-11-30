'use client';

import React from 'react';
import { useOriginPrice } from '@/hooks/useOriginPrice';
import PriceCard from '@/components/PriceCard';
import { CONTRACT_ADDRESSES, EXPLORER_URLS } from '@/lib/constants';
import { formatAddress } from '@/lib/format';
import CopyButton from '@/components/CopyButton';
import { FiExternalLink } from 'react-icons/fi';
import ErrorBanner from '@/components/ErrorBanner';

export default function OriginPage() {
  const {
    data: priceData,
    isLoading,
    error,
    refetch,
  } = useOriginPrice();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Origin Chain Feed
        </h1>
        <p className="text-gray-400">
          Chainlink ETH/USD price feed on Arbitrum Sepolia
        </p>
      </div>

      {error && (
        <ErrorBanner
          message={`Error loading price: ${error.message}`}
          onRetry={() => refetch()}
        />
      )}

      <PriceCard
        title="Current Price"
        price={priceData?.price || null}
        roundId={priceData?.roundId || null}
        updatedAt={priceData?.updatedAt || null}
        isLoading={isLoading}
        error={error?.message || null}
      />

      <div className="bg-gray-900 rounded-lg shadow-md p-6 border border-gray-800">
        <h2 className="text-lg font-semibold text-white mb-4">
          Contract Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400">
              Chainlink Feed Address
            </label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 font-mono text-sm text-white bg-gray-800 px-3 py-2 rounded">
                {formatAddress(CONTRACT_ADDRESSES.ORIGIN_FEED, 10)}
              </code>
              <CopyButton text={CONTRACT_ADDRESSES.ORIGIN_FEED} size="sm" />
              <a
                href={`${EXPLORER_URLS.ORIGIN}/address/${CONTRACT_ADDRESSES.ORIGIN_FEED}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-gray-100 rounded-md hover:bg-gray-800 transition-colors"
              >
                <FiExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400">
              Chain
            </label>
            <p className="text-sm text-white mt-1">
              Arbitrum Sepolia (Chain ID: 421614)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

