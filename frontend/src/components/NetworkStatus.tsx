'use client';

import React, { useEffect, useState } from 'react';
import { checkRPCHealth, getLatestBlock } from '@/utils/rpc';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Loader from './Loader';

interface NetworkStatusProps {
  className?: string;
}

export default function NetworkStatus({ className = '' }: NetworkStatusProps) {
  const [baseHealth, setBaseHealth] = useState<boolean | null>(null);
  const [originHealth, setOriginHealth] = useState<boolean | null>(null);
  const [baseBlock, setBaseBlock] = useState<number | null>(null);
  const [originBlock, setOriginBlock] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      setIsLoading(true);
      const [baseHealthy, originHealthy, baseBlockNum, originBlockNum] =
        await Promise.all([
          checkRPCHealth('base'),
          checkRPCHealth('origin'),
          getLatestBlock('base'),
          getLatestBlock('origin'),
        ]);

      setBaseHealth(baseHealthy);
      setOriginHealth(originHealthy);
      setBaseBlock(baseBlockNum);
      setOriginBlock(originBlockNum);
      setIsLoading(false);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className={`bg-gray-900 rounded-lg shadow-md p-4 ${className}`}>
        <Loader size="sm" />
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-900 rounded-lg shadow-md p-4 border border-gray-800 ${className}`}
    >
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Network Status
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {baseHealth ? (
              <FiCheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <FiXCircle className="w-4 h-4 text-red-600" />
            )}
            <span className="text-sm text-gray-400">
              Base Sepolia
            </span>
          </div>
          {baseBlock !== null && (
            <span className="text-xs text-gray-500 font-mono">
              Block: {baseBlock.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {originHealth ? (
              <FiCheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <FiXCircle className="w-4 h-4 text-red-600" />
            )}
            <span className="text-sm text-gray-400">
              Arbitrum Sepolia
            </span>
          </div>
          {originBlock !== null && (
            <span className="text-xs text-gray-500 font-mono">
              Block: {originBlock.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

