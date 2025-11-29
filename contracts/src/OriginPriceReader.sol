// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {AggregatorV3Interface} from "@chainlink/contracts/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * @title OriginPriceReader
 * @notice Contract that reads Chainlink price feeds on the origin chain (Arbitrum Sepolia)
 * @dev This contract serves as a reference for the Reactive Contract to understand the feed structure
 *      The Reactive Contract will subscribe to events from the Chainlink aggregator directly
 */
contract OriginPriceReader {
    AggregatorV3Interface public immutable priceFeed;

    /**
     * @notice Emitted when price data is read (for testing/debugging)
     * @param roundId The round ID
     * @param answer The price answer
     * @param updatedAt Timestamp when the round was updated
     */
    event PriceRead(uint80 roundId, int256 answer, uint256 updatedAt);

    /**
     * @notice Constructor
     * @param _priceFeed Address of the Chainlink AggregatorV3Interface on origin chain
     */
    constructor(address _priceFeed) {
        require(_priceFeed != address(0), "Invalid price feed address");
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    /**
     * @notice Read the latest price data from Chainlink
     * @return roundId The round ID
     * @return answer The price answer
     * @return startedAt Timestamp when the round started
     * @return updatedAt Timestamp when the round was updated
     * @return answeredInRound The round ID in which the answer was computed
     */
    function getLatestPrice()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return priceFeed.latestRoundData();
    }

    /**
     * @notice Read price data for a specific round
     * @param _roundId The round ID to query
     * @return roundId The round ID
     * @return answer The price answer
     * @return startedAt Timestamp when the round started
     * @return updatedAt Timestamp when the round was updated
     * @return answeredInRound The round ID in which the answer was computed
     */
    function getRoundPrice(uint80 _roundId)
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return priceFeed.getRoundData(_roundId);
    }

    /**
     * @notice Get the decimals of the price feed
     * @return The number of decimals
     */
    function getDecimals() external view returns (uint8) {
        return priceFeed.decimals();
    }

    /**
     * @notice Get the description of the price feed
     * @return The description string
     */
    function getDescription() external view returns (string memory) {
        return priceFeed.description();
    }
}

