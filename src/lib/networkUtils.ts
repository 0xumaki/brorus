// Network configuration and utilities for cross-chain functionality

export interface NetworkConfig {
  id: string;
  name: string;
  chainId: string;
  rpcUrl: string;
  explorer: string;
  ccipRouter: string;
  linkToken: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Network configurations for supported chains
export const NETWORK_CONFIGS: Record<string, NetworkConfig> = {
  sepolia: {
    id: "sepolia",
    name: "Sepolia Testnet",
    chainId: "0xaa36a7", // 11155111
    rpcUrl: "https://sepolia.infura.io/v3/48ea4bb6184940eca8870e134d4711df",
    explorer: "https://sepolia.etherscan.io",
    ccipRouter: "0xD0daae2231E9CB96b94C8512223533293C3693Bf",
    linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  mumbai: {
    id: "mumbai",
    name: "Polygon Mumbai",
    chainId: "0x13881", // 80001
    rpcUrl: "https://polygon-mumbai.infura.io/v3/48ea4bb6184940eca8870e134d4711df",
    explorer: "https://mumbai.polygonscan.com",
    ccipRouter: "0x70499c328e1E2a3c41108bd3730F6670a44595D1",
    linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
  },
};

// Token addresses for each network
export const TOKEN_ADDRESSES: Record<string, Record<string, string>> = {
  sepolia: {
    USDT: "0x91093128F514e4D99759FB2816BBc961d7eaAF39",
    USDC: "0xF025544BB1f91eE2BD6a1741CBCC7a9Bfd902E0B",
    CHF: "0x54F1BcF82A329E37804e7627b1cbd29D7323fe9c",
    AUD: "0xeb5Aaf8f2DFE1fca72fDa345d5e9080c133c8C20",
  },
  mumbai: {
    USDT: "0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832", // Example Mumbai USDT
    USDC: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747", // Example Mumbai USDC
    CHF: "0x0000000000000000000000000000000000000000", // Not deployed on Mumbai
    AUD: "0x0000000000000000000000000000000000000000", // Not deployed on Mumbai
  },
};

/**
 * Switch to a specific network in MetaMask
 */
export const switchToNetwork = async (networkId: string): Promise<boolean> => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const networkConfig = NETWORK_CONFIGS[networkId];
  if (!networkConfig) {
    throw new Error(`Network ${networkId} is not supported`);
  }

  try {
    // Try to switch to the network
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: networkConfig.chainId }],
    });
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: networkConfig.chainId,
              chainName: networkConfig.name,
              nativeCurrency: networkConfig.nativeCurrency,
              rpcUrls: [networkConfig.rpcUrl],
              blockExplorerUrls: [networkConfig.explorer],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error("Error adding network:", addError);
        throw new Error(`Failed to add network ${networkConfig.name}`);
      }
    } else {
      console.error("Error switching network:", switchError);
      throw new Error(`Failed to switch to network ${networkConfig.name}`);
    }
  }
};

/**
 * Get the current network from MetaMask
 */
export const getCurrentNetwork = async (): Promise<string | null> => {
  if (!window.ethereum) {
    return null;
  }

  try {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    
    // Find network by chainId
    for (const [networkId, config] of Object.entries(NETWORK_CONFIGS)) {
      if (config.chainId === chainId) {
        return networkId;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error getting current network:", error);
    return null;
  }
};

/**
 * Check if the current network is supported
 */
export const isNetworkSupported = (networkId: string): boolean => {
  return networkId in NETWORK_CONFIGS;
};

/**
 * Get network configuration by ID
 */
export const getNetworkConfig = (networkId: string): NetworkConfig | null => {
  return NETWORK_CONFIGS[networkId] || null;
};

/**
 * Get token address for a specific network and token
 */
export const getTokenAddress = (networkId: string, tokenSymbol: string): string | null => {
  const networkTokens = TOKEN_ADDRESSES[networkId];
  if (!networkTokens) {
    return null;
  }
  return networkTokens[tokenSymbol] || null;
};

/**
 * Format chain ID to hex string
 */
export const formatChainId = (chainId: number | string): string => {
  if (typeof chainId === "number") {
    return `0x${chainId.toString(16)}`;
  }
  return chainId;
};

/**
 * Parse chain ID from hex string
 */
export const parseChainId = (chainId: string): number => {
  return parseInt(chainId, 16);
};

/**
 * Get network name by chain ID
 */
export const getNetworkNameByChainId = (chainId: string): string | null => {
  for (const [networkId, config] of Object.entries(NETWORK_CONFIGS)) {
    if (config.chainId === chainId) {
      return config.name;
    }
  }
  return null;
};

/**
 * Listen for network changes
 */
export const onNetworkChange = (callback: (chainId: string) => void) => {
  if (!window.ethereum) {
    return () => {}; // Return empty cleanup function
  }

  const handleChainChanged = (chainId: string) => {
    callback(chainId);
  };

  window.ethereum.on("chainChanged", handleChainChanged);

  // Return cleanup function
  return () => {
    if (window.ethereum && window.ethereum.removeListener) {
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    }
  };
};

// Add window.ethereum type for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
} 