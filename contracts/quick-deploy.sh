#!/bin/bash
source .env

echo "Trying alternative RPC endpoints..."

# Try PublicNode RPC (often more reliable)
ARBITRUM_RPC="https://arbitrum-sepolia-rpc.publicnode.com"
BASE_RPC="https://base-sepolia-rpc.publicnode.com"

echo "Deploying to Arbitrum Sepolia..."
forge script script/Deploy.s.sol:Deploy \
  --rpc-url "$ARBITRUM_RPC" \
  --private-key "$PRIVATE_KEY" \
  --broadcast \
  --slow \
  -vvvv

echo "Deploying to Base Sepolia..."
forge script script/Deploy.s.sol:Deploy \
  --rpc-url "$BASE_RPC" \
  --private-key "$PRIVATE_KEY" \
  --broadcast \
  --slow \
  -vvvv
