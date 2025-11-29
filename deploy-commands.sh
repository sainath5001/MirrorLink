#!/bin/bash

# Load environment variables
source .env

# Deploy to Arbitrum Sepolia (Origin Chain)
echo "Deploying to Arbitrum Sepolia..."
cd contracts
forge script script/Deploy.s.sol:Deploy \
  --rpc-url $ARBITRUM_SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  -vvvv

# Deploy to Base Sepolia (Destination Chain)  
echo "Deploying to Base Sepolia..."
forge script script/Deploy.s.sol:Deploy \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  -vvvv
