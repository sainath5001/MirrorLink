'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { CHAIN_IDS } from '@/lib/constants';
import { FiCreditCard, FiX } from 'react-icons/fi';

export default function WalletConnectButton() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="px-4 py-2 bg-primary-600 text-white rounded-lg opacity-50">
        <span className="hidden sm:inline">Loading...</span>
      </div>
    );
  }

  const isCorrectChain = chain?.id === CHAIN_IDS.BASE;

  const handleConnect = (connector: (typeof connectors)[0]) => {
    connect({ connector });
    setShowMenu(false);
  };

  const handleSwitchChain = () => {
    switchChain({ chainId: CHAIN_IDS.BASE });
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiCreditCard className="w-4 h-4" />
          <span className="hidden sm:inline">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-lg shadow-lg border border-gray-800 z-20">
              <div className="p-4 border-b border-gray-800">
                <p className="text-sm text-gray-400">
                  Connected
                </p>
                <p className="font-mono text-sm mt-1 break-all">{address}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Chain: {chain?.name || 'Unknown'} ({chain?.id})
                </p>
              </div>
              {!isCorrectChain && (
                <div className="p-4 border-b border-gray-800">
                  <p className="text-sm text-yellow-600 mb-2">
                    Please switch to Base Sepolia
                  </p>
                  <button
                    onClick={handleSwitchChain}
                    className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Switch Chain
                  </button>
                </div>
              )}
              <div className="p-2">
                <button
                  onClick={() => {
                    disconnect();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FiX className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isPending}
        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <FiCreditCard className="w-4 h-4" />
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-lg shadow-lg border border-gray-800 z-20">
            <div className="p-2">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => handleConnect(connector)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-800 rounded-lg transition-colors text-gray-300"
                >
                  {connector.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

