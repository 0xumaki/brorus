
/**
 * Formats a wallet address to show only first 6 and last 4 characters
 */
export const formatWalletAddress = (address: string): string => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};
