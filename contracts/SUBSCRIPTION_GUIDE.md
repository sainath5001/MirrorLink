# How to Subscribe to Chainlink Events on Reactive Network

## Current Status
- Contract deployed: ✅ 0x8D47F346E4439E3a03fa574A9E8F40Acf0571Ee4
- Contract funded: ✅ 0.1 ETH
- Subscription via contract call: ❌ Reverting

## Subscription Parameters Needed

When subscribing via Reactive Network CLI or dashboard, use these values:

- **RC Contract Address**: `0x8D47F346E4439E3a03fa574A9E8F40Acf0571Ee4`
- **Chain ID**: `421614` (Arbitrum Sepolia)
- **Contract to Monitor**: `0xD30EF1a1D4fb1bEa3172B6B766a07F79844428A2` (Chainlink ETH/USD Feed)
- **Event Signature**: `0x0559884fd3a460db3073b7fc896ccd86f8d6c01a0b74c8f9ff67210f09bf2849`
- **Event**: `AnswerUpdated(int256 indexed, uint256 indexed, uint256)`
- **Topic 0**: Event signature (required)
- **Topic 1**: IGNORE (catch all)
- **Topic 2**: IGNORE (catch all)
- **Topic 3**: IGNORE

## Next Steps

Contact Reactive Network support or check their CLI tools to subscribe manually.
The contract is ready - it just needs the subscription to be registered in their system.

