#!/bin/bash
# Helper script to get contract address from transaction hash

source .env

if [ -z "$1" ]; then
    echo "Usage: ./get-contract-address.sh <TX_HASH> [chain]"
    echo "  chain: arbitrum (default) or base"
    exit 1
fi

TX_HASH=$1
CHAIN=${2:-arbitrum}

if [ "$CHAIN" = "arbitrum" ]; then
    RPC=$ARBITRUM_SEPOLIA_RPC_URL
    echo "Checking Arbitrum Sepolia transaction: $TX_HASH"
elif [ "$CHAIN" = "base" ]; then
    RPC=$BASE_SEPOLIA_RPC_URL
    echo "Checking Base Sepolia transaction: $TX_HASH"
else
    echo "Invalid chain. Use 'arbitrum' or 'base'"
    exit 1
fi

echo "Extracting contract address..."
cast receipt $TX_HASH --rpc-url $RPC | grep -E "(contractAddress|to)" || echo "Run: cast receipt $TX_HASH --rpc-url $RPC"
