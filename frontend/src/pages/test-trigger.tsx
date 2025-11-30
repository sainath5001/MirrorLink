'use client';

import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, FEATURE_FLAGS } from '@/lib/constants';
import DestinationPriceStoreABI from '@/lib/abis/DestinationPriceStore.json';
import ErrorBanner from '@/components/ErrorBanner';
import { FiAlertTriangle } from 'react-icons/fi';

export default function TestTriggerPage() {
  const { isConnected, chain } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const [testRoundId, setTestRoundId] = useState('1');
  const [testPrice, setTestPrice] = useState('200000000000'); // 2000 USD with 8 decimals

  if (!FEATURE_FLAGS.ENABLE_DEV) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">
          This page is only available in development mode.
        </p>
      </div>
    );
  }

  const handleTrigger = () => {
    if (!CONTRACT_ADDRESSES.DESTINATION) {
      alert('Destination contract address not configured');
      return;
    }

    writeContract({
      address: CONTRACT_ADDRESSES.DESTINATION as `0x${string}`,
      abi: DestinationPriceStoreABI,
      functionName: 'updatePrice',
      args: [
        BigInt(testRoundId),
        BigInt(testPrice),
        BigInt(Math.floor(Date.now() / 1000) - 60),
        BigInt(Math.floor(Date.now() / 1000)),
        BigInt(testRoundId),
      ],
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
        <FiAlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
            Development Only
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            This page is for testing purposes only. Only use this if you have
            permission to update the price store contract.
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Test Trigger
        </h1>
        <p className="text-gray-400">
          Manually trigger a price update (requires wallet connection and
          permissions)
        </p>
      </div>

      {!isConnected && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200">
            Please connect your wallet to continue.
          </p>
        </div>
      )}

      {isConnected && chain?.id !== 84532 && (
        <ErrorBanner message="Please switch to Base Sepolia network" />
      )}

      {error && (
        <ErrorBanner
          message={`Error: ${error.message}. ${
            error.message.includes('too many errors') || error.message.includes('not available')
              ? 'The RPC endpoint may be rate-limited. Try again in a few moments or check your network connection.'
              : ''
          }`}
        />
      )}

      {isSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-800 dark:text-green-200">
            Transaction successful! Hash: {hash}
          </p>
        </div>
      )}

      <div className="bg-gray-900 rounded-lg shadow-md p-6 border border-gray-800 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Round ID
          </label>
          <input
            type="number"
            value={testRoundId}
            onChange={(e) => setTestRoundId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-900 dark:bg-gray-700 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Price (with 8 decimals, e.g., 200000000000 = $2000.00)
          </label>
          <input
            type="text"
            value={testPrice}
            onChange={(e) => setTestPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-900 dark:bg-gray-700 text-white"
          />
        </div>

        <button
          onClick={handleTrigger}
          disabled={!isConnected || isPending || isConfirming || chain?.id !== 84532}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending
            ? 'Confirming...'
            : isConfirming
            ? 'Processing...'
            : 'Trigger Price Update'}
        </button>
      </div>
    </div>
  );
}

