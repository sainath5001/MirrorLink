'use client';

import React from 'react';
import ContractInfo from '@/components/ContractInfo';

export default function ContractsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Contract Information
        </h1>
        <p className="text-gray-400">
          View and interact with deployed smart contracts
        </p>
      </div>

      <ContractInfo />
    </div>
  );
}

