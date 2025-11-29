#!/bin/bash

# Load environment variables
source .env

# Function to deploy with retry
deploy_with_retry() {
    local chain=$1
    local rpc=$2
    local max_attempts=3
    local attempt=1
    
    echo "Deploying to $chain (attempt $attempt)..."
    
    while [ $attempt -le $max_attempts ]; do
        if forge script script/Deploy.s.sol:Deploy \
            --rpc-url "$rpc" \
            --private-key "$PRIVATE_KEY" \
            --broadcast \
            --slow \
            -vvvv; then
            echo "✓ Deployment successful!"
            return 0
        else
            echo "✗ Attempt $attempt failed. Retrying..."
            attempt=$((attempt + 1))
            sleep 5
        fi
    done
    
    echo "✗ Deployment failed after $max_attempts attempts"
    return 1
}

# Deploy to Arbitrum Sepolia
echo "=== Deploying to Arbitrum Sepolia ==="
deploy_with_retry "Arbitrum Sepolia" "$ARBITRUM_SEPOLIA_RPC_URL"

# Deploy to Base Sepolia
echo "=== Deploying to Base Sepolia ==="
deploy_with_retry "Base Sepolia" "$BASE_SEPOLIA_RPC_URL"
