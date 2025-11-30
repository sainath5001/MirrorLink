import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            MirrorLink - Cross-chain Chainlink price feed mirroring
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Built with Next.js, wagmi, and Reactive Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

