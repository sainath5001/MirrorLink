# Transaction Hashes Documentation

This document tracks all transaction hashes for the Chainlink Price Feed Mirroring workflow.

## Deployment Transactions

### Origin Chain (Arbitrum Sepolia)

#### OriginPriceReader Deployment
- **Transaction Hash**: `TBD - Run deployment script and paste here`
- **Contract Address**: `TBD`
- **Block Number**: `TBD`
- **Timestamp**: `TBD`
- **Chainlink Feed Address**: `0xD30EF1a1D4fb1bEa3172B6b766a07F79844428A2`

**Command to deploy:**
```bash
forge script script/Deploy.s.sol:Deploy --rpc-url arbitrum_sepolia --broadcast --verify
```

### Destination Chain (Base Sepolia)

#### DestinationPriceStore Deployment
- **Transaction Hash**: `TBD - Run deployment script and paste here`
- **Contract Address**: `TBD`
- **Block Number**: `TBD`
- **Timestamp**: `TBD`
- **Reactive Executor Address**: `TBD`

**Command to deploy:**
```bash
forge script script/Deploy.s.sol:Deploy --rpc-url base_sepolia --broadcast --verify
```

### Reactive Network

#### RC_PriceSync Deployment
- **Transaction Hash**: `TBD - Deploy via Reactive Network infrastructure`
- **Contract Address**: `TBD`
- **Network**: Reactive Testnet/Mainnet
- **Timestamp**: `TBD`

**Note**: Reactive Contract deployment is done through Reactive Network's infrastructure. See README for instructions.

## Workflow Transaction Hashes

### Step 1: Initial Price Read (Origin Chain)
- **Transaction Hash**: `TBD`
- **Action**: Read initial ETH/USD price from Chainlink feed on Arbitrum Sepolia
- **Block Number**: `TBD`
- **Price Read**: `TBD`

### Step 2: Reactive Contract Subscription
- **Subscription ID**: `TBD`
- **Event Monitored**: `AnswerUpdated` from Chainlink aggregator
- **Origin Chain**: Arbitrum Sepolia (Chain ID: 421614)
- **Status**: `TBD`

### Step 3: First Price Update Trigger (Reactive Network)
- **Transaction Hash**: `TBD`
- **Action**: Reactive Contract detects price change and triggers update
- **Block Number**: `TBD`
- **Event Data**: `TBD`

### Step 4: Price Update on Destination (Base Sepolia)
- **Transaction Hash**: `TBD`
- **Action**: `updatePrice()` called on DestinationPriceStore
- **Block Number**: `TBD`
- **Old Price**: `TBD`
- **New Price**: `TBD`
- **Round ID**: `TBD`

### Step 5: Verify Price Update
- **Transaction Hash**: `TBD` (if any read transaction)
- **Action**: Read `latestRoundData()` from DestinationPriceStore
- **Verified Price**: `TBD`
- **Block Number**: `TBD`

## Additional Test Transactions

### Manual Test Trigger (Base Sepolia)
- **Transaction Hash**: `0xdd9a5c91b3afb08ed9dffc9fe5a5df5ad139106c8347500cfdf6b53527065fc4`
- **Action**: Manual price update via TestTrigger script
- **Block Number**: `34337263`
- **Contract Address**: `0x8D47F346E4439E3a03fa574A9E8F40Acf0571Ee4`
- **Function Called**: `updatePrice(uint80,int256,uint256,uint256,uint80)`
- **Price Before**: `3000000` (0.03 USD with 8 decimals)
- **Price After**: `4000000` (0.04 USD with 8 decimals)
- **Round ID**: Updated from `3` to `4`
- **Gas Used**: `49647`
- **Gas Price**: `0.000215101 gwei`
- **Cost**: `0.000000010679119347 ETH`
- **Status**: ✅ Success
- **Command**: 
```bash
forge script script/TestTrigger.s.sol:TestTrigger --rpc-url $BASE_SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast
```

## Verification Links

### Arbitrum Sepolia
- Explorer: https://sepolia.arbiscan.io
- Contract Verification: `TBD`

### Base Sepolia
- Explorer: https://sepolia.basescan.org
- Contract Verification: `TBD`

### Reactive Network
- Explorer: `TBD`
- Contract Verification: `TBD`

## Notes

- Replace all `TBD` entries with actual transaction hashes after deployment and testing
- Keep this file updated as you execute the workflow
- Include block numbers and timestamps for complete traceability
- Document any failed transactions or retries


