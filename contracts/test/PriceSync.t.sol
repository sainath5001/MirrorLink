// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Test, console} from "forge-std/Test.sol";
import {OriginPriceReader} from "../src/OriginPriceReader.sol";
import {DestinationPriceStore} from "../src/DestinationPriceStore.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * @title PriceSyncTest
 * @notice Comprehensive tests for Chainlink Price Feed Mirroring
 */
contract PriceSyncTest is Test {
    // Mock Chainlink feed for testing
    address constant MOCK_FEED = address(0x1234567890123456789012345678901234567890);
    
    // Test constants
    uint256 constant ARBITRUM_SEPOLIA_CHAIN_ID = 421614;
    uint256 constant BASE_SEPOLIA_CHAIN_ID = 84532;
    uint8 constant DECIMALS = 8;
    string constant DESCRIPTION = "ETH / USD";
    
    OriginPriceReader originReader;
    DestinationPriceStore destinationStore;
    address reactiveExecutor;
    address user;
    
    event PriceUpdated(
        int256 oldPrice,
        int256 newPrice,
        uint80 roundId,
        uint256 updatedAt
    );
    
    function setUp() public {
        reactiveExecutor = address(0x1111);
        user = address(0x2222);
        
        // Set a base timestamp to avoid underflow issues
        vm.warp(1000000);
        
        // Deploy origin reader (using mock feed for unit tests)
        // In integration tests, use real Chainlink feed address
        originReader = new OriginPriceReader(MOCK_FEED);
        
        // Deploy destination store
        destinationStore = new DestinationPriceStore(
            reactiveExecutor,
            DECIMALS,
            DESCRIPTION,
            BASE_SEPOLIA_CHAIN_ID
        );
    }
    
    /**
     * @notice Test that destination contract initializes correctly
     */
    function test_DestinationInitialization() public view {
        assertEq(destinationStore.reactiveExecutor(), reactiveExecutor);
        assertEq(destinationStore.decimals(), DECIMALS);
        assertEq(keccak256(bytes(destinationStore.description())), keccak256(bytes(DESCRIPTION)));
        
        // Initial price should be zero
        (uint80 roundId, int256 price, , , ) = destinationStore.latestRoundData();
        assertEq(roundId, 0);
        assertEq(price, 0);
    }
    
    /**
     * @notice Test that only reactive executor can update price
     */
    function test_OnlyExecutorCanUpdate() public {
        vm.prank(user);
        vm.expectRevert("DestinationPriceStore: only Reactive executor");
        destinationStore.updatePrice(1, 2000e8, block.timestamp, block.timestamp, 1);
    }
    
    /**
     * @notice Test successful price update by executor
     */
    function test_SuccessfulPriceUpdate() public {
        uint80 roundId = 1;
        int256 price = 2000e8; // $2000 with 8 decimals
        uint256 timestamp = block.timestamp;
        
        vm.prank(reactiveExecutor);
        vm.expectEmit(true, true, true, true);
        emit PriceUpdated(0, price, roundId, timestamp);
        
        destinationStore.updatePrice(roundId, price, timestamp - 60, timestamp, roundId);
        
        // Verify update
        (uint80 updatedRoundId, int256 updatedPrice, , uint256 updatedAt, ) = 
            destinationStore.latestRoundData();
        
        assertEq(updatedRoundId, roundId);
        assertEq(updatedPrice, price);
        assertEq(updatedAt, timestamp);
    }
    
    /**
     * @notice Test that update fails if price didn't change (spam prevention)
     */
    function test_UpdateFailsIfPriceUnchanged() public {
        uint80 roundId = 1;
        int256 price = 2000e8;
        uint256 timestamp = block.timestamp;
        
        // First update succeeds
        vm.prank(reactiveExecutor);
        destinationStore.updatePrice(roundId, price, timestamp - 60, timestamp, roundId);
        
        // Second update with same price and round ID fails
        vm.prank(reactiveExecutor);
        vm.expectRevert("Price unchanged");
        destinationStore.updatePrice(roundId, price, timestamp - 60, timestamp, roundId);
    }
    
    /**
     * @notice Test that update succeeds if price changed
     */
    function test_UpdateSucceedsIfPriceChanged() public {
        uint80 roundId1 = 1;
        int256 price1 = 2000e8;
        uint256 timestamp1 = block.timestamp;
        
        // First update
        vm.prank(reactiveExecutor);
        destinationStore.updatePrice(roundId1, price1, timestamp1 - 60, timestamp1, roundId1);
        
        // Second update with different price succeeds
        uint80 roundId2 = 2;
        int256 price2 = 2100e8;
        uint256 timestamp2 = block.timestamp + 60;
        
        vm.prank(reactiveExecutor);
        vm.expectEmit(true, true, true, true);
        emit PriceUpdated(price1, price2, roundId2, timestamp2);
        
        destinationStore.updatePrice(roundId2, price2, timestamp2 - 60, timestamp2, roundId2);
        
        // Verify new price
        (, int256 updatedPrice, , , ) = destinationStore.latestRoundData();
        assertEq(updatedPrice, price2);
    }
    
    /**
     * @notice Test that update succeeds if round ID changed (even with same price)
     */
    function test_UpdateSucceedsIfRoundIdChanged() public {
        uint80 roundId1 = 1;
        int256 price = 2000e8;
        uint256 timestamp1 = block.timestamp;
        
        // First update
        vm.prank(reactiveExecutor);
        destinationStore.updatePrice(roundId1, price, timestamp1 - 60, timestamp1, roundId1);
        
        // Second update with same price but different round ID succeeds
        uint80 roundId2 = 2;
        uint256 timestamp2 = block.timestamp + 60;
        
        vm.prank(reactiveExecutor);
        destinationStore.updatePrice(roundId2, price, timestamp2 - 60, timestamp2, roundId2);
        
        // Verify round ID updated
        (uint80 updatedRoundId, , , , ) = destinationStore.latestRoundData();
        assertEq(updatedRoundId, roundId2);
    }
    
    /**
     * @notice Test getLatestPrice convenience function
     */
    function test_GetLatestPrice() public {
        uint80 roundId = 1;
        int256 price = 2000e8;
        uint256 timestamp = block.timestamp;
        
        vm.prank(reactiveExecutor);
        destinationStore.updatePrice(roundId, price, timestamp - 60, timestamp, roundId);
        
        int256 latestPrice = destinationStore.getLatestPrice();
        assertEq(latestPrice, price);
    }
    
    /**
     * @notice Test getRoundData function
     */
    function test_GetRoundData() public {
        uint80 roundId = 1;
        int256 price = 2000e8;
        uint256 timestamp = block.timestamp;
        
        vm.prank(reactiveExecutor);
        destinationStore.updatePrice(roundId, price, timestamp - 60, timestamp, roundId);
        
        (uint80 retrievedRoundId, int256 retrievedPrice, , , ) = 
            destinationStore.getRoundData(roundId);
        
        assertEq(retrievedRoundId, roundId);
        assertEq(retrievedPrice, price);
    }
    
    /**
     * @notice Test getRoundData reverts for non-existent round
     */
    function test_GetRoundDataRevertsForNonExistentRound() public {
        vm.expectRevert("Round not found");
        destinationStore.getRoundData(999);
    }
    
    /**
     * @notice Test owner can update reactive executor
     */
    function test_OwnerCanUpdateExecutor() public {
        address newExecutor = address(0x3333);
        
        vm.prank(destinationStore.owner());
        destinationStore.setReactiveExecutor(newExecutor);
        
        assertEq(destinationStore.reactiveExecutor(), newExecutor);
    }
    
    /**
     * @notice Test non-owner cannot update executor
     */
    function test_NonOwnerCannotUpdateExecutor() public {
        address newExecutor = address(0x3333);
        
        vm.prank(user);
        vm.expectRevert();
        destinationStore.setReactiveExecutor(newExecutor);
    }
    
    /**
     * @notice Test that executor cannot be set to zero address
     */
    function test_CannotSetZeroExecutor() public {
        vm.prank(destinationStore.owner());
        vm.expectRevert("Invalid executor address");
        destinationStore.setReactiveExecutor(address(0));
    }
    
    /**
     * @notice Test latestRoundData returns correct format (AggregatorV3Interface compatible)
     */
    function test_LatestRoundDataFormat() public {
        uint80 roundId = 42;
        int256 price = 2500e8;
        uint256 startedAt = block.timestamp - 120;
        uint256 updatedAt = block.timestamp;
        uint80 answeredInRound = 42;
        
        vm.prank(reactiveExecutor);
        destinationStore.updatePrice(roundId, price, startedAt, updatedAt, answeredInRound);
        
        (
            uint80 retRoundId,
            int256 retPrice,
            uint256 retStartedAt,
            uint256 retUpdatedAt,
            uint80 retAnsweredInRound
        ) = destinationStore.latestRoundData();
        
        assertEq(retRoundId, roundId);
        assertEq(retPrice, price);
        assertEq(retStartedAt, startedAt);
        assertEq(retUpdatedAt, updatedAt);
        assertEq(retAnsweredInRound, answeredInRound);
    }
    
    /**
     * @notice Test event emission on price update
     */
    function test_EventEmission() public {
        uint80 roundId = 1;
        int256 oldPrice = 0;
        int256 newPrice = 2000e8;
        uint256 timestamp = block.timestamp;
        
        vm.prank(reactiveExecutor);
        vm.expectEmit(true, true, true, true);
        emit PriceUpdated(oldPrice, newPrice, roundId, timestamp);
        
        destinationStore.updatePrice(roundId, newPrice, timestamp - 60, timestamp, roundId);
    }
}

