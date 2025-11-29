// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script, console} from "forge-std/Script.sol";
import {OriginPriceReader} from "../src/OriginPriceReader.sol";

/**
 * @title DeployOrigin
 * @notice Deploy OriginPriceReader to Arbitrum Sepolia
 */
contract DeployOrigin is Script {
    address constant ARBITRUM_SEPOLIA_ETH_USD_FEED = 0xD30EF1a1D4fb1bEa3172B6b766a07F79844428A2;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("=== Deploying OriginPriceReader to Arbitrum Sepolia ===");
        console.log("Deployer:", deployer);
        
        vm.startBroadcast(deployerPrivateKey);
        
        OriginPriceReader originReader = new OriginPriceReader(ARBITRUM_SEPOLIA_ETH_USD_FEED);
        
        console.log("OriginPriceReader deployed at:", address(originReader));
        console.log("Chainlink feed:", ARBITRUM_SEPOLIA_ETH_USD_FEED);
        console.log("\nSave this address:", address(originReader));
        
        vm.stopBroadcast();
    }
}

