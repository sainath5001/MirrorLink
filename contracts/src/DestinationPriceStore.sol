// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IPriceStore} from "./interfaces/IPriceStore.sol";

/**
 * @title DestinationPriceStore
 * @notice Stores mirrored Chainlink price feed data on the destination chain (Base Sepolia)
 * @dev Implements AggregatorV3Interface-compatible interface for easy integration
 *      Only the Reactive Contract executor can update prices
 */
contract DestinationPriceStore is Ownable, IPriceStore {
    /**
     * @notice Emitted when price is updated
     * @param oldPrice The previous price
     * @param newPrice The new price
     * @param roundId The round ID of the update
     * @param updatedAt Timestamp of the update
     */
    event PriceUpdated(
        int256 oldPrice,
        int256 newPrice,
        uint80 roundId,
        uint256 updatedAt
    );

    /**
     * @notice The Reactive Contract executor address (authorized to update prices)
     */
    address public reactiveExecutor;

    /**
     * @notice Current price data
     */
    uint80 public roundId;
    int256 public answer;
    uint256 public startedAt;
    uint256 public updatedAt;
    uint80 public answeredInRound;

    /**
     * @notice Number of decimals for the price feed
     */
    uint8 public immutable decimals;

    /**
     * @notice Description of the price feed
     */
    string public description;

    /**
     * @notice Domain separator for message verification
     */
    bytes32 public immutable domainSeparator;

    /**
     * @notice Version for message verification
     */
    bytes32 public constant VERSION = keccak256("1");

    /**
     * @notice Modifier to restrict function to Reactive executor only
     */
    modifier onlyReactiveExecutor() {
        require(
            msg.sender == reactiveExecutor,
            "DestinationPriceStore: only Reactive executor"
        );
        _;
    }

    /**
     * @notice Constructor
     * @param _reactiveExecutor Address of the Reactive Contract executor
     * @param _decimals Number of decimals for the price feed
     * @param _description Description of the price feed
     * @param _chainId Chain ID for domain separator
     */
    constructor(
        address _reactiveExecutor,
        uint8 _decimals,
        string memory _description,
        uint256 _chainId
    ) Ownable(msg.sender) {
        require(_reactiveExecutor != address(0), "Invalid executor address");
        reactiveExecutor = _reactiveExecutor;
        decimals = _decimals;
        description = _description;

        // Create domain separator for message verification
        domainSeparator = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes("ChainlinkPriceMirror")),
                VERSION,
                _chainId,
                address(this)
            )
        );
    }

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
    ) external onlyReactiveExecutor {
        int256 oldPrice = answer;

        // Prevent spam: only update if price actually changed
        require(_answer != answer || _roundId != roundId, "Price unchanged");

        // Update price data
        roundId = _roundId;
        answer = _answer;
        startedAt = _startedAt;
        updatedAt = _updatedAt;
        answeredInRound = _answeredInRound;

        emit PriceUpdated(oldPrice, _answer, _roundId, _updatedAt);
    }

    /**
     * @notice Get the latest price data (AggregatorV3Interface compatible)
     * @return roundId The round ID
     * @return answer The price answer
     * @return startedAt Timestamp when the round started
     * @return updatedAt Timestamp when the round was updated
     * @return answeredInRound The round ID in which the answer was computed
     */
    function latestRoundData()
        external
        view
        override
        returns (
            uint80,
            int256,
            uint256,
            uint256,
            uint80
        )
    {
        return (roundId, answer, startedAt, updatedAt, answeredInRound);
    }

    /**
     * @notice Get price data for a specific round (for current implementation, returns latest)
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
        override
        returns (
            uint80,
            int256,
            uint256,
            uint256,
            uint80
        )
    {
        // For simplicity, return latest data if round matches, otherwise revert
        require(_roundId == roundId, "Round not found");
        return (roundId, answer, startedAt, updatedAt, answeredInRound);
    }

    /**
     * @notice Update the Reactive executor address (only owner)
     * @param _newExecutor New executor address
     */
    function setReactiveExecutor(address _newExecutor) external onlyOwner {
        require(_newExecutor != address(0), "Invalid executor address");
        reactiveExecutor = _newExecutor;
    }

    /**
     * @notice Get the latest price (convenience function)
     * @return The current price
     */
    function getLatestPrice() external view returns (int256) {
        return answer;
    }
}

