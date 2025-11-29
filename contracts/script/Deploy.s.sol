// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script, console} from "forge-std/Script.sol";
import {OriginPriceReader} from "../src/OriginPriceReader.sol";
import {DestinationPriceStore} from "../src/DestinationPriceStore.sol";

/**
 * @title Deploy
 * @notice Deployment script for Chainlink Price Feed Mirroring contracts
 * @dev Deploys contracts to Arbitrum Sepolia (origin) and Base Sepolia (destination)
 */
contract Deploy is Script {
    // Chainlink ETH/USD feed on Arbitrum Sepolia
    // Update this address if needed: https://docs.chain.link/data-feeds/price-feeds/addresses?network=arbitrum&page=1
    address constant ARBITRUM_SEPOLIA_ETH_USD_FEED = 0xD30EF1a1D4fb1bEa3172B6b766a07F79844428A2;
    
    // Chain IDs
    uint256 constant ARBITRUM_SEPOLIA_CHAIN_ID = 421614;
    uint256 constant BASE_SEPOLIA_CHAIN_ID = 84532;
    
    // Price feed configuration
    uint8 constant PRICE_FEED_DECIMALS = 8;
    string constant PRICE_FEED_DESCRIPTION = "ETH / USD";
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts...");
        console.log("Deployer address:", deployer);
        
        // Deploy OriginPriceReader on Arbitrum Sepolia
        console.log("\n=== Deploying to Arbitrum Sepolia ===");
        vm.startBroadcast(deployerPrivateKey);
        
        OriginPriceReader originReader = new OriginPriceReader(ARBITRUM_SEPOLIA_ETH_USD_FEED);
        
        console.log("OriginPriceReader deployed at:", address(originReader));
        console.log("Chainlink feed address:", ARBITRUM_SEPOLIA_ETH_USD_FEED);
        
        // Read initial price for verification (skip if call fails)
        // Read initial price for verification (commented out - requires fork)
        // Uncomment after deployment to verify:
        // (uint80 roundId, int256 price, , uint256 updatedAt, ) = originReader.getLatestPrice();
        // console.log("Current ETH/USD price:", uint256(price));
        // console.log("Round ID:", roundId);
        // console.log("Last updated:", updatedAt);
        console.log("Note: Price reading skipped (deploy first, then verify manually)");
        
        vm.stopBroadcast();
        
        // Deploy DestinationPriceStore on Base Sepolia
        console.log("\n=== Deploying to Base Sepolia ===");
        console.log("NOTE: Set REACTIVE_EXECUTOR_ADDRESS before deploying destination contract");
        console.log("For now, using deployer address as placeholder");
        
        // In production, this should be the Reactive Contract executor address
        // For initial deployment, we'll use deployer and update later
        address reactiveExecutor = vm.envOr("REACTIVE_EXECUTOR_ADDRESS", deployer);
        
        vm.selectFork(vm.createFork(vm.envString("BASE_SEPOLIA_RPC_URL")));
        vm.startBroadcast(deployerPrivateKey);
        
        DestinationPriceStore destinationStore = new DestinationPriceStore(
            reactiveExecutor,
            PRICE_FEED_DECIMALS,
            PRICE_FEED_DESCRIPTION,
            BASE_SEPOLIA_CHAIN_ID
        );
        
        console.log("DestinationPriceStore deployed at:", address(destinationStore));
        console.log("Reactive executor:", reactiveExecutor);
        console.log("Decimals:", PRICE_FEED_DECIMALS);
        console.log("Description:", PRICE_FEED_DESCRIPTION);
        
        vm.stopBroadcast();
        
        // Save deployment addresses
        console.log("\n=== Deployment Summary ===");
        console.log("Origin Chain (Arbitrum Sepolia):");
        console.log("  OriginPriceReader:", address(originReader));
        console.log("  Chainlink Feed:", ARBITRUM_SEPOLIA_ETH_USD_FEED);
        console.log("\nDestination Chain (Base Sepolia):");
        console.log("  DestinationPriceStore:", address(destinationStore));
        console.log("  Reactive Executor:", reactiveExecutor);
        
        // Write addresses to file for easy reference
        string memory addresses = string.concat(
            "ORIGIN_CHAIN=Arbitrum Sepolia\n",
            "ORIGIN_PRICE_READER=", vm.toString(address(originReader)), "\n",
            "ORIGIN_CHAINLINK_FEED=", vm.toString(ARBITRUM_SEPOLIA_ETH_USD_FEED), "\n",
            "\n",
            "DESTINATION_CHAIN=Base Sepolia\n",
            "DESTINATION_PRICE_STORE=", vm.toString(address(destinationStore)), "\n",
            "REACTIVE_EXECUTOR=", vm.toString(reactiveExecutor), "\n"
        );
        
        vm.writeFile("deployment-addresses.txt", addresses);
        console.log("\nDeployment addresses saved to: deployment-addresses.txt");
    }
}

