# MirrorLink Frontend

A production-ready Next.js dashboard for monitoring cross-chain Chainlink price feed mirroring from Arbitrum Sepolia to Base Sepolia using Reactive Network automation.

## Project Overview

MirrorLink is a cross-chain price feed mirroring system that:
- Monitors Chainlink ETH/USD price feeds on Arbitrum Sepolia (origin chain)
- Automatically syncs price updates to Base Sepolia (destination chain) via Reactive Network
- Provides a real-time dashboard to visualize price synchronization
- Shows price history, events, and network status

## Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: wagmi v2, ethers.js v6, viem
- **Data Fetching**: @tanstack/react-query
- **Charts**: Recharts
- **Testing**: Vitest, Testing Library, MSW
- **E2E**: Playwright

## Prerequisites

- Node.js 18+ and npm
- Deployed smart contracts (see contract addresses below)
- Wallet with Base Sepolia testnet ETH (for test trigger page)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your contract addresses:

```env
# RPC Endpoints
NEXT_PUBLIC_BASE_RPC=https://sepolia.base.org
NEXT_PUBLIC_ORIGIN_RPC=https://sepolia-rollup.arbitrum.io/rpc

# Contract Addresses (REQUIRED - Update with your deployed addresses)
NEXT_PUBLIC_DESTINATION_ADDR=0xYourDestinationPriceStoreAddress
NEXT_PUBLIC_ORIGIN_FEED_ADDR=0xD30EF1a1D4fb1bEa3172B6b766a07F79844428A2
NEXT_PUBLIC_REACTIVE_CONTRACT=0xYourRC_PriceSyncAddress

# Block Explorers
NEXT_PUBLIC_BASE_EXPLORER=https://sepolia.basescan.org
NEXT_PUBLIC_ORIGIN_EXPLORER=https://sepolia.arbiscan.io

# Chain IDs
NEXT_PUBLIC_CHAIN_ID_BASE=84532
NEXT_PUBLIC_CHAIN_ID_ORIGIN=421614

# Configuration
NEXT_PUBLIC_PRICE_DECIMALS=8
FEATURE_FLAG_ENABLE_DEV=true
```

**Important**: Replace `0xYourDestinationPriceStoreAddress` and `0xYourRC_PriceSyncAddress` with your actual deployed contract addresses.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:ui` - Run tests with UI
- `npm run test:e2e` - Run E2E tests with Playwright

## Project Structure

```
frontend/
├── src/
│   ├── components/       # React components
│   │   ├── NavBar.tsx
│   │   ├── WalletConnectButton.tsx
│   │   ├── PriceCard.tsx
│   │   ├── PriceChart.tsx
│   │   ├── ComparePanel.tsx
│   │   ├── EventList.tsx
│   │   ├── ContractInfo.tsx
│   │   ├── NetworkStatus.tsx
│   │   ├── Loader.tsx
│   │   ├── ErrorBanner.tsx
│   │   ├── CopyButton.tsx
│   │   └── Footer.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useWagmiProvider.ts
│   │   ├── useLatestPrice.ts
│   │   ├── useOriginPrice.ts
│   │   ├── useDestinationPrice.ts
│   │   ├── usePriceHistory.ts
│   │   ├── useEvents.ts
│   │   └── useExplorerLinks.ts
│   ├── lib/             # Utilities and constants
│   │   ├── constants.ts
│   │   ├── ethers.ts
│   │   ├── format.ts
│   │   └── abis/         # Contract ABIs
│   ├── pages/            # Next.js pages
│   │   ├── _app.tsx
│   │   ├── index.tsx     # Dashboard
│   │   ├── origin.tsx
│   │   ├── destination.tsx
│   │   ├── contracts.tsx
│   │   ├── test-trigger.tsx
│   │   └── api/
│   │       └── logs.ts
│   ├── styles/           # Global styles
│   │   └── globals.css
│   └── utils/            # Helper functions
│       ├── rpc.ts
│       └── fetchLogs.ts
├── public/               # Static assets
├── .env.local.example    # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Features

### Dashboard (`/`)
- **Compare Panel**: Side-by-side comparison of origin and destination prices
- **Price Chart**: Historical price visualization with toggleable series
- **Event List**: Recent price update events with transaction links
- **Network Status**: RPC health and block number monitoring

### Origin Page (`/origin`)
- View current Chainlink feed price on Arbitrum Sepolia
- Contract information and explorer links

### Destination Page (`/destination`)
- View mirrored price on Base Sepolia
- Contract information and explorer links

### Contracts Page (`/contracts`)
- All contract addresses with copy buttons
- Direct links to block explorers

### Test Trigger Page (`/test-trigger`)
- Development-only page for manual price updates
- Requires wallet connection and Base Sepolia network
- Only visible when `FEATURE_FLAG_ENABLE_DEV=true`

## Configuration

### Contract Addresses

After deploying your smart contracts, update these in `.env.local`:

1. **DestinationPriceStore**: Deployed on Base Sepolia
   - Get address from deployment logs or `deployment-addresses.txt`
   - Set as `NEXT_PUBLIC_DESTINATION_ADDR`

2. **RC_PriceSync**: Deployed on Reactive Network
   - Get address from Reactive Network deployment
   - Set as `NEXT_PUBLIC_REACTIVE_CONTRACT`

3. **Origin Chainlink Feed**: Already configured
   - Address: `0xD30EF1a1D4fb1bEa3172B6b766a07F79844428A2`
   - Set as `NEXT_PUBLIC_ORIGIN_FEED_ADDR`

### Wallet Connection

The app uses wagmi for wallet connections. Supported wallets:
- MetaMask (injected)
- WalletConnect

Users are prompted to switch to Base Sepolia when connecting.

## Testing

### Unit Tests

```bash
npm run test
```

Tests are located in `src/__tests__/` and use:
- Vitest for test runner
- Testing Library for component testing
- MSW for API mocking

### E2E Tests

```bash
npm run test:e2e
```

Playwright tests verify:
- Dashboard loads and displays prices
- Wallet connection flow
- Price updates are reflected in UI

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual Deployment

```bash
npm run build
npm run start
```

## Demo Script (2-3 Minutes)

### For Hackathon Video Recording

**Introduction (0:00 - 0:30)**
1. Open the dashboard at `/`
2. Show the main interface: "This is MirrorLink, a cross-chain price feed mirroring dashboard"
3. Point out the Compare Panel showing origin (Arbitrum) and destination (Base) prices
4. Mention the real-time synchronization via Reactive Network

**Key Features (0:30 - 1:30)**
1. **Price Comparison**: "Here we can see the origin Chainlink feed price on Arbitrum Sepolia and the mirrored price on Base Sepolia. The delta shows they're in sync."
2. **Price Chart**: Scroll to chart, toggle series visibility: "The chart shows historical price data from both chains, demonstrating the mirroring in action."
3. **Event List**: "Recent price update events are shown here, with direct links to transactions on the block explorer."
4. **Network Status**: "Network health indicators show both chains are operational."

**Contract Information (1:30 - 2:00)**
1. Navigate to `/contracts` page
2. Show contract addresses with copy buttons
3. Click explorer link to show contract on Basescan
4. Mention: "All contracts are verified and accessible on block explorers"

**Live Update Demo (2:00 - 2:30)**
1. Wait for or trigger a price update (if test trigger is enabled)
2. Show the price updating in real-time
3. Point out the event appearing in the event list
4. Show transaction hash and link to explorer

**Closing (2:30 - 3:00)**
1. Return to dashboard
2. Summarize: "MirrorLink provides a complete dashboard for monitoring cross-chain price feed synchronization, with real-time updates, historical data, and full transparency through block explorer integration."
3. Mention tech stack: "Built with Next.js, wagmi, and Reactive Network for seamless cross-chain automation."

### What to Record

- Screen recording of the dashboard
- Smooth navigation between pages
- Real-time price updates (if available)
- Wallet connection flow (optional)
- Block explorer links working
- Responsive design (show mobile view briefly)

## Troubleshooting

### Prices Not Loading

1. Check RPC endpoints are accessible
2. Verify contract addresses in `.env.local`
3. Check browser console for errors
4. Ensure contracts are deployed and verified

### Wallet Connection Issues

1. Ensure MetaMask or compatible wallet is installed
2. Add Base Sepolia network to wallet:
   - Network Name: Base Sepolia
   - RPC URL: https://sepolia.base.org
   - Chain ID: 84532
   - Currency Symbol: ETH

### Build Errors

1. Clear `.next` folder: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check TypeScript errors: `npm run lint`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT

## Support

For issues or questions:
- Check the smart contract documentation
- Review deployment logs
- Verify environment variables are set correctly

---

**Note**: This frontend requires the smart contracts to be deployed. Refer to the main project README for contract deployment instructions.

