# MirrorLink Demo Script (2-3 Minutes)

## Introduction (0:00 - 0:30)
1. Open the dashboard at `http://localhost:3000` (or deployed URL)
2. Show the main interface: "This is MirrorLink, a cross-chain price feed mirroring dashboard"
3. Point out the Compare Panel showing origin (Arbitrum Sepolia) and destination (Base Sepolia) prices
4. Mention: "The system automatically syncs Chainlink ETH/USD price feeds from Arbitrum to Base using Reactive Network"

## Key Features (0:30 - 1:30)

### Price Comparison
- "Here we can see the origin Chainlink feed price on Arbitrum Sepolia and the mirrored price on Base Sepolia"
- Point out the delta calculation showing price synchronization
- "The latency indicator shows how quickly updates propagate across chains"

### Price Chart
- Scroll to the price chart
- Toggle series visibility: "The chart shows historical price data from both chains, demonstrating the mirroring in action"
- Hover over data points to show tooltips with timestamps and round IDs
- "You can see both price series tracking closely together"

### Event List
- "Recent price update events are shown here, with direct links to transactions on the block explorer"
- Click on an explorer link to show transaction details (optional)

### Network Status
- "Network health indicators show both chains are operational"
- Point out block numbers and connection status

## Contract Information (1:30 - 2:00)
1. Navigate to `/contracts` page
2. Show contract addresses with copy buttons
3. Click explorer link to show contract on Basescan
4. Mention: "All contracts are verified and accessible on block explorers"
5. Show the three main contracts:
   - Origin Chainlink Feed (Arbitrum)
   - Destination Price Store (Base)
   - Reactive Contract (Reactive Network)

## Live Update Demo (2:00 - 2:30)
1. Return to dashboard
2. Wait for or trigger a price update (if test trigger is enabled)
3. Show the price updating in real-time
4. Point out the event appearing in the event list
5. Show transaction hash and link to explorer
6. "The system automatically detects price changes on the origin chain and updates the destination in real-time"

## Additional Pages (2:30 - 2:45)
1. Navigate to `/origin` - Show origin feed details
2. Navigate to `/destination` - Show destination store details
3. Mention: "Each page provides detailed information about the respective chain's price feed"

## Closing (2:45 - 3:00)
1. Return to dashboard
2. Summarize: "MirrorLink provides a complete dashboard for monitoring cross-chain price feed synchronization, with real-time updates, historical data, and full transparency through block explorer integration"
3. Mention tech stack: "Built with Next.js, wagmi, ethers.js, and Reactive Network for seamless cross-chain automation"
4. "The system ensures price feeds are always in sync across chains, enabling reliable DeFi applications on Base Sepolia"

## What to Record

### Screen Recording
- Full screen capture of the browser
- Smooth navigation between pages
- Real-time price updates (if available)
- Block explorer links working
- Responsive design (show mobile view briefly)

### Audio Narration
- Clear, professional voiceover
- Explain each feature as you demonstrate it
- Mention technical details (Reactive Network, cross-chain, etc.)
- Keep pace steady (not too fast)

### Tips
- Use a clean browser (no extensions visible)
- Have test data ready (recent price updates)
- Test all links before recording
- Record in 1080p or higher
- Use screen recording software (OBS, Loom, etc.)

## Optional Enhancements
- Show wallet connection flow
- Demonstrate test trigger page (if enabled)
- Show error states and recovery
- Display mobile responsive view
- Show network switching in wallet

