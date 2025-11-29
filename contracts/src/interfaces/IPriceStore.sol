// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title IPriceStore
 * @notice Interface for destination price store contract
 * @dev Compatible with Chainlink AggregatorV3Interface for easy integration
 */
interface IPriceStore {
    /**
     * @notice Get the latest price data
     * @return roundId The round ID
     * @return answer The price answer
     * @return startedAt Timestamp when the round started
     * @return updatedAt Timestamp when the round was updated
     * @return answeredInRound The round ID in which the answer was computed
     */
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );

    /**
     * @notice Get price data for a specific round
     * @param _roundId The round ID to query
     * @return roundId The round ID
     * @return answer The price answer
     * @return startedAt Timestamp when the round started
     * @return updatedAt Timestamp when the round was updated
     * @return answeredInRound The round ID in which the answer was computed
     */
    function getRoundData(uint80 _roundId)
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
    
    /**
     * @notice Update the price data (only callable by Reactive executor)
     * @param _roundId The round ID
     * @param _answer The price answer
     * @param _startedAt Timestamp when the round started
     * @param _updatedAt Timestamp when the round was updated
     * @param _answeredInRound The round ID in which the answer was computed
     */
    function updatePrice(
        uint80 _roundId,
        int256 _answer,
        uint256 _startedAt,
        uint256 _updatedAt,
        uint80 _answeredInRound
    ) external;

    /**
     * @notice Get the number of decimals for the price feed
     * @return The number of decimals
     */
    function decimals() external view returns (uint8);

    /**
     * @notice Get the description of the price feed
     * @return The description string
     */
    function description() external view returns (string memory);
}

