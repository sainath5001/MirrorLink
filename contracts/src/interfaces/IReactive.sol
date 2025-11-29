// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title IReactive
 * @notice Interface for Reactive Network contracts
 * @dev This interface defines the structure for Reactive Contracts that respond to cross-chain events
 */
interface IReactive {
    /**
     * @notice Called by Reactive Network when a subscribed event is detected
     * @param eventData The event data from the origin chain
     * @param eventMetadata Metadata about the event (chain, block, etc.)
     */
    function react(bytes calldata eventData, bytes calldata eventMetadata) external;
}
