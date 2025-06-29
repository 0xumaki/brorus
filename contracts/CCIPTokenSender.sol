// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// CCIP Router interface (simplified for Remix)
interface IRouterClient {
    function ccipSend(uint64 destinationChainSelector, bytes calldata message) external payable returns (bytes32);
    function getFee(uint64 destinationChainSelector, bytes calldata message) external view returns (uint256);
}

/**
 * @title CCIPTokenSender
 * @dev A contract for sending tokens cross-chain using Chainlink CCIP
 * This version is compatible with Remix IDE
 */
contract CCIPTokenSender is Ownable {
    using SafeERC20 for IERC20;

    // CCIP Message structures (copied from Chainlink Client library)
    struct EVM2AnyMessage {
        bytes receiver;
        bytes data;
        TokenAmount[] tokenAmounts;
        address feeToken;
        bytes extraArgs;
    }

    struct TokenAmount {
        address token;
        uint256 amount;
    }

    struct EVMExtraArgsV1 {
        uint256 gasLimit;
    }

    IRouterClient public router;
    IERC20 public linkToken;

    event TokensTransferred(
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiver,
        address token,
        uint256 amount,
        address feeToken,
        uint256 fees
    );

    constructor(address _router, address _link) Ownable(msg.sender) {
        router = IRouterClient(_router);
        linkToken = IERC20(_link);
    }

    /**
     * @dev Sends tokens cross-chain using CCIP
     * @param destinationChainSelector The destination chain selector
     * @param receiver The address to receive tokens on destination chain
     * @param token The token address to send
     * @param amount The amount of tokens to send
     * @param feeToken The token used for fees (LINK or native token)
     */
    function transferTokens(
        uint64 destinationChainSelector,
        address receiver,
        address token,
        uint256 amount,
        address feeToken
    ) external payable returns (bytes32 messageId) {
        // Create token amounts array
        TokenAmount[] memory tokenAmounts = new TokenAmount[](1);
        tokenAmounts[0] = TokenAmount({
            token: token,
            amount: amount
        });

        // Create the CCIP message
        EVM2AnyMessage memory evm2AnyMessage = EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: "",
            tokenAmounts: tokenAmounts,
            extraArgs: _argsToBytes(EVMExtraArgsV1({gasLimit: 200_000})),
            feeToken: feeToken
        });

        // Encode the message for the router
        bytes memory encodedMessage = abi.encode(evm2AnyMessage);

        // Get the fee required
        uint256 fees = router.getFee(destinationChainSelector, encodedMessage);

        // Transfer tokens to this contract
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        // Approve router to spend tokens
        IERC20(token).approve(address(router), amount);

        // Send the message
        if (feeToken == address(0)) {
            // Pay fees in native token
            messageId = router.ccipSend{value: fees}(
                destinationChainSelector,
                encodedMessage
            );
        } else {
            // Pay fees in LINK token
            linkToken.safeTransferFrom(msg.sender, address(this), fees);
            linkToken.approve(address(router), fees);
            messageId = router.ccipSend(destinationChainSelector, encodedMessage);
        }

        emit TokensTransferred(
            messageId,
            destinationChainSelector,
            receiver,
            token,
            amount,
            feeToken,
            fees
        );
    }

    /**
     * @dev Get the fee for a cross-chain transfer
     * @param destinationChainSelector The destination chain selector
     * @param receiver The address to receive tokens on destination chain
     * @param token The token address to send
     * @param amount The amount of tokens to send
     * @param feeToken The token used for fees
     */
    function getTransferFee(
        uint64 destinationChainSelector,
        address receiver,
        address token,
        uint256 amount,
        address feeToken
    ) external view returns (uint256) {
        // Create token amounts array
        TokenAmount[] memory tokenAmounts = new TokenAmount[](1);
        tokenAmounts[0] = TokenAmount({
            token: token,
            amount: amount
        });

        // Create the CCIP message
        EVM2AnyMessage memory evm2AnyMessage = EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: "",
            tokenAmounts: tokenAmounts,
            extraArgs: _argsToBytes(EVMExtraArgsV1({gasLimit: 200_000})),
            feeToken: feeToken
        });

        // Encode the message for the router
        bytes memory encodedMessage = abi.encode(evm2AnyMessage);

        return router.getFee(destinationChainSelector, encodedMessage);
    }

    /**
     * @dev Convert EVMExtraArgsV1 to bytes
     */
    function _argsToBytes(EVMExtraArgsV1 memory extraArgs) internal pure returns (bytes memory) {
        return abi.encodeWithSelector(0x97a657c9, extraArgs);
    }

    /**
     * @dev Withdraw tokens from contract (emergency function)
     * @param token The token to withdraw
     * @param amount The amount to withdraw
     */
    function withdrawTokens(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }

    /**
     * @dev Withdraw native tokens from contract (emergency function)
     */
    function withdrawNative() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @dev Update router address
     * @param _router New router address
     */
    function updateRouter(address _router) external onlyOwner {
        router = IRouterClient(_router);
    }

    /**
     * @dev Update LINK token address
     * @param _link New LINK token address
     */
    function updateLinkToken(address _link) external onlyOwner {
        linkToken = IERC20(_link);
    }
} 