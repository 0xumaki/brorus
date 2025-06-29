import Web3 from "web3";

// CCIP Router addresses for testnets
export const CCIP_ROUTER_ADDRESSES = {
  sepolia: "0xD0daae2231E9CB96b94C8512223533293C3693Bf",
  mumbai: "0x70499c328e1E2a3c41108bd3730F6670a44595D1",
};

// LINK token addresses for testnets
export const LINK_TOKEN_ADDRESSES = {
  sepolia: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  mumbai: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
};

// CCIP Token Sender contract addresses (updated with deployed contract)
export const CCIP_SENDER_ADDRESSES = {
  sepolia: "0xBc3a84d7073973366153ecB7A0aDb66A615Db999", // Deployed contract
  mumbai: "0xYourDeployedContractAddress", // Update after deployment
};

// CCIP Router ABI (minimal for our needs)
export const CCIP_ROUTER_ABI = [
  {
    "inputs": [
      { "internalType": "uint64", "name": "destinationChainSelector", "type": "uint64" },
      { "internalType": "struct Client.EVM2AnyMessage", "name": "message", "type": "tuple" }
    ],
    "name": "ccipSend",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint64", "name": "destinationChainSelector", "type": "uint64" },
      { "internalType": "struct Client.EVM2AnyMessage", "name": "message", "type": "tuple" }
    ],
    "name": "getFee",
    "outputs": [{ "internalType": "uint256", "name": "fee", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// CCIP Token Sender ABI
export const CCIP_SENDER_ABI = [
  {
    "inputs": [
      { "internalType": "uint64", "name": "destinationChainSelector", "type": "uint64" },
      { "internalType": "address", "name": "receiver", "type": "address" },
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "address", "name": "feeToken", "type": "address" }
    ],
    "name": "transferTokens",
    "outputs": [{ "internalType": "bytes32", "name": "messageId", "type": "bytes32" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint64", "name": "destinationChainSelector", "type": "uint64" },
      { "internalType": "address", "name": "receiver", "type": "address" },
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "address", "name": "feeToken", "type": "address" }
    ],
    "name": "getTransferFee",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// ERC-20 ABI for token operations
export const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      { "name": "_owner", "type": "address" },
      { "name": "_spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "name": "", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_spender", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_to", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "name": "", "type": "bool" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_from", "type": "address" },
      { "name": "_to", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "transferFrom",
    "outputs": [{ "name": "", "type": "bool" }],
    "type": "function"
  }
];

/**
 * Calculate CCIP fee for cross-chain transfer
 */
export const calculateCCIPFee = async (
  web3: Web3,
  sourceChain: string,
  destinationChainSelector: string,
  tokenAddress: string,
  amount: string,
  feeToken: string
): Promise<string> => {
  try {
    const senderAddress = CCIP_SENDER_ADDRESSES[sourceChain as keyof typeof CCIP_SENDER_ADDRESSES];
    if (!senderAddress || senderAddress === "0xYourDeployedContractAddress") {
      throw new Error("CCIP Sender contract not deployed. Please deploy the contract first.");
    }

    const contract = new web3.eth.Contract(CCIP_SENDER_ABI, senderAddress);
    const fee = await contract.methods.getTransferFee(
      destinationChainSelector,
      "0x0000000000000000000000000000000000000000", // placeholder receiver
      tokenAddress,
      amount,
      feeToken
    ).call();

    return fee;
  } catch (error) {
    console.error("Error calculating CCIP fee:", error);
    throw error;
  }
};

/**
 * Approve CCIP sender contract to spend tokens
 */
export const approveCCIPSender = async (
  web3: Web3,
  tokenAddress: string,
  amount: string,
  sourceChain: string,
  account: string
): Promise<void> => {
  try {
    const senderAddress = CCIP_SENDER_ADDRESSES[sourceChain as keyof typeof CCIP_SENDER_ADDRESSES];
    if (!senderAddress || senderAddress === "0xYourDeployedContractAddress") {
      throw new Error("CCIP Sender contract not deployed. Please deploy the contract first.");
    }

    const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
    
    // Check current allowance
    const currentAllowance = await tokenContract.methods.allowance(account, senderAddress).call() as string;
    
    if (BigInt(currentAllowance) < BigInt(amount)) {
      // Approve the sender contract to spend tokens
      await tokenContract.methods.approve(senderAddress, amount).send({ from: account });
      console.log("Approved CCIP Sender to spend tokens");
    } else {
      console.log("Sufficient allowance already exists");
    }
  } catch (error) {
    console.error("Error approving CCIP sender:", error);
    throw error;
  }
};

/**
 * Approve LINK token for CCIP fees
 */
export const approveLINKForFees = async (
  web3: Web3,
  sourceChain: string,
  feeAmount: string,
  account: string
): Promise<void> => {
  try {
    const senderAddress = CCIP_SENDER_ADDRESSES[sourceChain as keyof typeof CCIP_SENDER_ADDRESSES];
    const linkAddress = LINK_TOKEN_ADDRESSES[sourceChain as keyof typeof LINK_TOKEN_ADDRESSES];
    
    if (!senderAddress || senderAddress === "0xYourDeployedContractAddress") {
      throw new Error("CCIP Sender contract not deployed. Please deploy the contract first.");
    }

    const linkContract = new web3.eth.Contract(ERC20_ABI, linkAddress);
    
    // Check current allowance
    const currentAllowance = await linkContract.methods.allowance(account, senderAddress).call() as string;
    
    if (BigInt(currentAllowance) < BigInt(feeAmount)) {
      // Approve the sender contract to spend LINK tokens
      await linkContract.methods.approve(senderAddress, feeAmount).send({ from: account });
      console.log("Approved CCIP Sender to spend LINK tokens for fees");
    } else {
      console.log("Sufficient LINK allowance already exists");
    }
  } catch (error) {
    console.error("Error approving LINK for fees:", error);
    throw error;
  }
};

/**
 * Execute cross-chain transfer using CCIP
 */
export const executeCrossChainTransfer = async (
  web3: Web3,
  sourceChain: string,
  destinationChainSelector: string,
  receiver: string,
  tokenAddress: string,
  amount: string,
  feeToken: string,
  account: string
): Promise<string> => {
  try {
    const senderAddress = CCIP_SENDER_ADDRESSES[sourceChain as keyof typeof CCIP_SENDER_ADDRESSES];
    if (!senderAddress || senderAddress === "0xYourDeployedContractAddress") {
      throw new Error("CCIP Sender contract not deployed. Please deploy the contract first.");
    }

    const contract = new web3.eth.Contract(CCIP_SENDER_ABI, senderAddress);
    
    let tx;
    if (feeToken === "0x0000000000000000000000000000000000000000") {
      // Pay fees in native token (ETH)
      const fee = await calculateCCIPFee(web3, sourceChain, destinationChainSelector, tokenAddress, amount, feeToken);
      tx = await contract.methods.transferTokens(
        destinationChainSelector,
        receiver,
        tokenAddress,
        amount,
        feeToken
      ).send({ 
        from: account, 
        value: fee 
      });
    } else {
      // Pay fees in LINK token
      const fee = await calculateCCIPFee(web3, sourceChain, destinationChainSelector, tokenAddress, amount, feeToken);
      await approveLINKForFees(web3, sourceChain, fee, account);
      
      tx = await contract.methods.transferTokens(
        destinationChainSelector,
        receiver,
        tokenAddress,
        amount,
        feeToken
      ).send({ from: account });
    }

    return tx.transactionHash;
  } catch (error) {
    console.error("Error executing cross-chain transfer:", error);
    throw error;
  }
};

/**
 * Get token balance for a specific token
 */
export const getTokenBalance = async (
  web3: Web3,
  tokenAddress: string,
  account: string
): Promise<string> => {
  try {
    const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
    const balance = await tokenContract.methods.balanceOf(account).call() as string;
    return balance;
  } catch (error) {
    console.error("Error getting token balance:", error);
    throw error;
  }
};

/**
 * Get LINK token balance
 */
export const getLINKBalance = async (
  web3: Web3,
  sourceChain: string,
  account: string
): Promise<string> => {
  try {
    const linkAddress = LINK_TOKEN_ADDRESSES[sourceChain as keyof typeof LINK_TOKEN_ADDRESSES];
    return await getTokenBalance(web3, linkAddress, account);
  } catch (error) {
    console.error("Error getting LINK balance:", error);
    throw error;
  }
};

/**
 * Format amount with proper decimals
 */
export const formatAmount = (amount: string, decimals: number): string => {
  return (Number(amount) / Math.pow(10, decimals)).toString();
};

/**
 * Convert amount to wei with proper decimals
 */
export const toWei = (amount: string, decimals: number): string => {
  return (Number(amount) * Math.pow(10, decimals)).toLocaleString('fullwide', { useGrouping: false });
}; 