import React from 'react';
import { CONTRACT_ADDRESSES, EXPLORER_URLS } from '@/lib/constants';
import { formatAddress } from '@/lib/format';
import CopyButton from './CopyButton';
import { FiExternalLink } from 'react-icons/fi';

interface ContractInfoProps {
  className?: string;
}

export default function ContractInfo({ className = '' }: ContractInfoProps) {
  const contracts = [
    {
      name: 'Origin Chainlink Feed',
      address: CONTRACT_ADDRESSES.ORIGIN_FEED,
      explorer: EXPLORER_URLS.ORIGIN,
      chain: 'Arbitrum Sepolia',
    },
    {
      name: 'Destination Price Store',
      address: CONTRACT_ADDRESSES.DESTINATION,
      explorer: EXPLORER_URLS.BASE,
      chain: 'Base Sepolia',
    },
    {
      name: 'Reactive Contract',
      address: CONTRACT_ADDRESSES.REACTIVE,
      explorer: EXPLORER_URLS.BASE,
      chain: 'Reactive Network',
    },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {contracts.map((contract) => {
        if (!contract.address) return null;

        const explorerUrl = `${contract.explorer}/address/${contract.address}`;

        return (
          <div
            key={contract.name}
            className="bg-gray-900 rounded-lg shadow-md p-4 border border-gray-800"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-300">
                {contract.name}
              </h3>
              <span className="text-xs text-gray-500">{contract.chain}</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 font-mono text-sm text-white bg-gray-800 px-3 py-2 rounded">
                {formatAddress(contract.address, 10)}
              </code>
              <CopyButton text={contract.address} size="sm" />
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-gray-100 rounded-md hover:bg-gray-800 transition-colors"
                aria-label={`View ${contract.name} on explorer`}
              >
                <FiExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

