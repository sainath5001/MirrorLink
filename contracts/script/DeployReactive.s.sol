// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script, console} from "forge-std/Script.sol";
import {RC_PriceSync} from "../src/RC_PriceSync.s.sol";

/**
 * @title DeployReactive
 * @notice Deploy RC_PriceSync to Reactive Network
 * @dev Deploy this contract to Reactive Network (testnet or mainnet)
 */
contract DeployReactive is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        // Get destination price store address from .env
        address destinationPriceStore = vm.envAddress("DESTINATION_PRICE_STORE");
        
        console.log("=== Deploying RC_PriceSync to Reactive Network ===");
        console.log("Deployer:", deployer);
        console.log("Destination Price Store:", destinationPriceStore);
        
        // Deploy to Reactive Network
        // Note: Use Reactive Network RPC URL from .env when deploying
        // For now, we'll deploy using the configured RPC endpoint
        
        vm.startBroadcast(deployerPrivateKey);
        
        RC_PriceSync reactiveContract = new RC_PriceSync(destinationPriceStore);
        
        console.log("RC_PriceSync deployed at:", address(reactiveContract));
        console.log("Origin Feed (Arbitrum):", reactiveContract.ORIGIN_FEED());
        console.log("Origin Chain ID:", reactiveContract.ORIGIN_CHAIN_ID());
        console.log("Destination Chain ID:", reactiveContract.DESTINATION_CHAIN_ID());
        console.log("\nNext steps:");
        console.log("1. Subscribe to AnswerUpdated events from Chainlink feed");
        console.log("2. Chain: Arbitrum Sepolia (421614)");
        console.log("3. Contract:", reactiveContract.ORIGIN_FEED());
        console.log("4. Event signature:", vm.toString(uint256(reactiveContract.ANSWER_UPDATED_SIG())));
        
        vm.stopBroadcast();
    }
}

