// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script, console} from "forge-std/Script.sol";
import {RC_PriceSync} from "../src/RC_PriceSync.s.sol";

/**
 * @title SubscribeEvents
 * @notice Script to subscribe RC_PriceSync to Chainlink AnswerUpdated events
 * @dev This calls the subscribeToPriceUpdates() function on the deployed RC contract
 */
contract SubscribeEvents is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        // Get deployed RC_PriceSync address
        address rcAddress = vm.envOr("REACTIVE_CONTRACT_ADDRESS", address(0x8D47F346E4439E3a03fa574A9E8F40Acf0571Ee4));

        console.log("=== Subscribing RC_PriceSync to Chainlink Events ===");
        console.log("RC Contract Address:", rcAddress);
        console.log("Deployer:", deployer);

        RC_PriceSync rc = RC_PriceSync(payable(rcAddress));

        console.log("\nSubscription Details:");
        console.log("  Origin Chain ID:", rc.ORIGIN_CHAIN_ID());
        console.log("  Origin Feed (Chainlink):", rc.ORIGIN_FEED());
        console.log("  Event Signature:", vm.toString(uint256(rc.ANSWER_UPDATED_SIG())));
        console.log("  Destination Chain ID:", rc.DESTINATION_CHAIN_ID());
        console.log("  Destination Price Store:", rc.destinationPriceStore());

        vm.startBroadcast(deployerPrivateKey);

        console.log("\nCalling subscribeToPriceUpdates()...");
        rc.subscribeToPriceUpdates();

        console.log("Subscription successful!");
        console.log("\nYour RC_PriceSync contract is now monitoring:");
        console.log("  - Chain: Arbitrum Sepolia (421614)");
        console.log("  - Contract: Chainlink ETH/USD Feed");
        console.log("  - Event: AnswerUpdated");
        console.log("\nWhen Chainlink updates the price, your contract will");
        console.log("automatically update the price on Base Sepolia!");

        vm.stopBroadcast();
    }
}
