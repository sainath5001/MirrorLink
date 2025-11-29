// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script, console} from "forge-std/Script.sol";
import {DestinationPriceStore} from "../src/DestinationPriceStore.sol";

/**
 * @title TestTrigger
 * @notice Script to manually trigger price updates for testing
 * @dev This simulates what the Reactive Contract would do
 *      Use this to test the destination contract before Reactive Contract is deployed
 */
contract TestTrigger is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        // Get destination contract address
        address destinationAddress = vm.envAddress("DESTINATION_PRICE_STORE");
        DestinationPriceStore destination = DestinationPriceStore(destinationAddress);

        console.log("Testing price update on destination contract");
        console.log("Destination address:", destinationAddress);
        console.log("Caller:", deployer);

        // Get current price
        (uint80 currentRoundId, int256 currentPrice,,,) = destination.latestRoundData();
        console.log("\nCurrent state:");
        console.log("  Round ID:", currentRoundId);
        console.log("  Price:", uint256(currentPrice));

        // For testing, we need to be the reactive executor or owner
        // If deployer is the executor, we can call directly
        // Otherwise, we'll need to update the executor first

        vm.startBroadcast(deployerPrivateKey);

        // Check if we're the executor
        address executor = destination.reactiveExecutor();
        if (deployer != executor) {
            console.log("\nWARNING: Deployer is not the reactive executor");
            console.log("Current executor:", executor);
            console.log("Updating executor to deployer for testing...");

            // If deployer is owner, update executor
            destination.setReactiveExecutor(deployer);
            console.log("Executor updated to:", deployer);
        }

        // Trigger a test price update
        // Use a new round ID and slightly different price
        uint80 newRoundId = currentRoundId + 1;
        int256 newPrice = currentPrice + 1000000; // Add 0.01 USD (8 decimals)
        uint256 timestamp = block.timestamp;

        console.log("\nTriggering price update:");
        console.log("  New Round ID:", newRoundId);
        console.log("  New Price:", uint256(newPrice));
        console.log("  Timestamp:", timestamp);

        destination.updatePrice(
            newRoundId,
            newPrice,
            timestamp - 60, // startedAt (1 minute ago)
            timestamp, // updatedAt (now)
            newRoundId // answeredInRound
        );

        // Verify update
        (uint80 updatedRoundId, int256 updatedPrice,, uint256 updatedAt,) = destination.latestRoundData();
        console.log("\nUpdated state:");
        console.log("  Round ID:", updatedRoundId);
        console.log("  Price:", uint256(updatedPrice));
        console.log("  Updated At:", updatedAt);

        require(updatedPrice == newPrice, "Price update failed");
        require(updatedRoundId == newRoundId, "Round ID update failed");

        console.log("\nPrice update successful!");

        vm.stopBroadcast();
    }
}
