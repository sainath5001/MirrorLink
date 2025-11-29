// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {AbstractReactive} from "reactive-lib/abstract-base/AbstractReactive.sol";
import {IReactive} from "reactive-lib/interfaces/IReactive.sol";
import {IPriceStore} from "./interfaces/IPriceStore.sol";

/**
 * @title RC_PriceSync
 * @notice Reactive Contract for syncing Chainlink price feeds across chains
 * @dev This contract:
 *      1. Subscribes to Chainlink AnswerUpdated events on Arbitrum Sepolia
 *      2. Extracts price data from the event
 *      3. Calls updatePrice() on DestinationPriceStore on Base Sepolia
 *
 * @dev Reactive Contracts use inversion-of-control: they react to events rather than
 *      being called directly. The Reactive Network monitors the origin chain and
 *      automatically invokes this contract's react() function when subscribed events occur.
 */
contract RC_PriceSync is AbstractReactive {
    /**
     * @notice Address of the Chainlink aggregator on origin chain (Arbitrum Sepolia)
     * @dev This is the feed we subscribe to for AnswerUpdated events
     */
    address public constant ORIGIN_FEED = 0xD30EF1a1D4fb1bEa3172B6b766a07F79844428A2; // ETH/USD on Arbitrum Sepolia

    /**
     * @notice Address of the DestinationPriceStore on destination chain (Base Sepolia)
     * @dev This contract will receive price updates
     */
    address public destinationPriceStore;

    /**
     * @notice Origin chain ID (Arbitrum Sepolia)
     */
    uint256 public constant ORIGIN_CHAIN_ID = 421614;

    /**
     * @notice Destination chain ID (Base Sepolia)
     */
    uint256 public constant DESTINATION_CHAIN_ID = 84532;

    /**
     * @notice Event signature for Chainlink AnswerUpdated
     * @dev keccak256("AnswerUpdated(int256 indexed current,uint256 indexed roundId,uint256 updatedAt)")
     */
    bytes32 public constant ANSWER_UPDATED_SIG = 0x0559884fd3a460db3073b7fc896ccd86f8d6c01a0b74c8f9ff67210f09bf2849;

    /**
     * @notice Constructor
     * @param _destinationPriceStore Address of DestinationPriceStore on destination chain
     */
    constructor(address _destinationPriceStore) {
        require(_destinationPriceStore != address(0), "Invalid destination address");
        destinationPriceStore = _destinationPriceStore;
    }

    /**
     * @notice React to AnswerUpdated events from Chainlink aggregator
     * @dev This function is called by the Reactive Network when an AnswerUpdated event
     *      is detected on the origin chain. It extracts the price data and triggers
     *      an update on the destination chain.
     *
     * @param log LogRecord containing event data from Chainlink AnswerUpdated event
     *        AnswerUpdated(int256 indexed current, uint256 indexed roundId, uint256 updatedAt)
     */
    function react(IReactive.LogRecord calldata log) external override {
        // Verify this is the AnswerUpdated event from the correct contract
        require(log._contract == ORIGIN_FEED, "Wrong contract");
        require(log.topic_0 == uint256(ANSWER_UPDATED_SIG), "Wrong event");
        require(log.chain_id == ORIGIN_CHAIN_ID, "Wrong chain");

        // Decode AnswerUpdated event:
        // AnswerUpdated(int256 indexed current, uint256 indexed roundId, uint256 updatedAt)
        // topic_1 = current (int256, but stored as uint256)
        // topic_2 = roundId (uint256)
        // data = updatedAt (uint256)
        
        int256 current = int256(log.topic_1);
        uint256 roundIdRaw = log.topic_2;
        
        // Decode updatedAt from data (first 32 bytes)
        require(log.data.length >= 32, "Invalid data length");
        uint256 updatedAt = abi.decode(log.data, (uint256));

        uint80 roundId = uint80(roundIdRaw);
        uint80 answeredInRound = roundId; // Typically same as roundId
        uint256 startedAt = updatedAt; // Approximation

        // Update price on destination chain
        _updateDestinationPrice(roundId, current, startedAt, updatedAt, answeredInRound);
    }

    /**
     * @notice Internal function to update price on destination chain
     * @dev The Reactive Network infrastructure handles the cross-chain call.
     *      When this contract is deployed on Reactive Network, it can directly
     *      call contracts on destination chains. The Reactive Network's execution
     *      environment provides cross-chain capabilities.
     * 
     *      In the actual deployment, the Reactive Network will execute this call
     *      on the destination chain (Base Sepolia) automatically.
     */
    function _updateDestinationPrice(
        uint80 _roundId,
        int256 _answer,
        uint256 _startedAt,
        uint256 _updatedAt,
        uint80 _answeredInRound
    ) internal {
        // The Reactive Network execution environment allows direct cross-chain calls
        // This will be executed on the destination chain (Base Sepolia)
        // The Reactive Network infrastructure handles the message passing
        
        // Import the interface for type safety (will be available at deployment)
        IPriceStore destination = IPriceStore(destinationPriceStore);
        
        // Call updatePrice on destination chain
        // Reactive Network handles the cross-chain execution
        destination.updatePrice(
            _roundId,
            _answer,
            _startedAt,
            _updatedAt,
            _answeredInRound
        );
        
        emit PriceSyncTriggered(_roundId, _answer, _updatedAt, destinationPriceStore);
    }

    /**
     * @notice Event emitted when price sync is triggered
     */
    event PriceSyncTriggered(uint80 roundId, int256 answer, uint256 updatedAt, address destination);

    /**
     * @notice Set destination price store address (for flexibility)
     * @param _newDestination New destination address
     */
    function setDestination(address _newDestination) external {
        require(_newDestination != address(0), "Invalid address");
        destinationPriceStore = _newDestination;
    }
}
