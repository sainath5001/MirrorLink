// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script, console} from "forge-std/Script.sol";
import {DestinationPriceStore} from "../src/DestinationPriceStore.sol";

/**
 * @title DeployDestination
 * @notice Deploy DestinationPriceStore to Base Sepolia
 */
contract DeployDestination is Script {
    uint256 constant BASE_SEPOLIA_CHAIN_ID = 84532;
    uint8 constant PRICE_FEED_DECIMALS = 8;
    string constant PRICE_FEED_DESCRIPTION = "ETH / USD";
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        // Use deployer as reactive executor (update later with actual RC executor address)
        address reactiveExecutor = vm.envOr("REACTIVE_EXECUTOR_ADDRESS", deployer);
        
        console.log("=== Deploying DestinationPriceStore to Base Sepolia ===");
        console.log("Deployer:", deployer);
        console.log("Reactive Executor:", reactiveExecutor);
        
        vm.startBroadcast(deployerPrivateKey);
        
        DestinationPriceStore destinationStore = new DestinationPriceStore(
            reactiveExecutor,
            PRICE_FEED_DECIMALS,
            PRICE_FEED_DESCRIPTION,
            BASE_SEPOLIA_CHAIN_ID
        );
        
        console.log("DestinationPriceStore deployed at:", address(destinationStore));
        console.log("Reactive Executor:", reactiveExecutor);
        console.log("\nSave this address:", address(destinationStore));
        
        vm.stopBroadcast();
    }
}

