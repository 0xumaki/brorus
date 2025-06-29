# Chainlink CCIP Cross-Chain Transfer Implementation

This document provides instructions for deploying and using the Chainlink CCIP (Cross-Chain Interoperability Protocol) functionality for cross-chain token transfers.

## 🚀 **What's Implemented**

### 1. **Smart Contract (`CCIPTokenSender.sol`)**
- Complete CCIP-enabled contract for cross-chain token transfers
- Supports both native token (ETH) and LINK token fee payments
- Includes fee calculation and emergency withdrawal functions

### 2. **Frontend Integration**
- Updated `CrossChainTransferForm.tsx` with full CCIP functionality
- Real-time fee calculation
- Token balance checking
- Proper error handling and user feedback

### 3. **Utility Functions (`ccipUtils.ts`)**
- Complete set of CCIP utility functions
- Fee calculation, token approval, and transfer execution
- Balance checking and formatting utilities

## 📋 **Prerequisites**

1. **Node.js and npm/yarn** installed
2. **MetaMask** wallet with Sepolia testnet configured
3. **Sepolia testnet ETH** for gas fees
4. **LINK tokens** on Sepolia for CCIP fees (optional, can use ETH)

## 🔧 **Deployment Steps**

### Step 1: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 2: Configure Environment
Create a `.env` file in the root directory:
```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_key
MUMBAI_RPC_URL=https://polygon-mumbai.infura.io/v3/your_infura_key
```

### Step 3: Deploy CCIP Contract
```bash
# Deploy to Sepolia
npx hardhat run scripts/deploy-ccip.js --network sepolia
```

### Step 4: Update Contract Addresses
After deployment, update the contract addresses in `src/lib/ccipUtils.ts`:

```typescript
export const CCIP_SENDER_ADDRESSES = {
  sepolia: "0xYourDeployedContractAddress", // Replace with actual address
  mumbai: "0xYourDeployedContractAddress", // Replace with actual address
};
```

### Step 5: Get Test Tokens
1. **Sepolia ETH**: Get from [Sepolia Faucet](https://sepoliafaucet.com/)
2. **Sepolia LINK**: Get from [Chainlink Faucet](https://faucets.chain.link/sepolia)
3. **Test Tokens**: Your existing USDT, USDC, CHF, AUD tokens on Sepolia

## 🌐 **Supported Networks**

### Current Implementation
- **Source**: Sepolia Testnet
- **Destinations**: 
  - Sepolia Testnet (same chain)
  - Polygon Mumbai Testnet

### CCIP Router Addresses
- **Sepolia**: `0xD0daae2231E9CB96b94C8512223533293C3693Bf`
- **Mumbai**: `0x70499c328e1E2a3c41108bd3730F6670a44595D1`

### LINK Token Addresses
- **Sepolia**: `0x779877A7B0D9E8603169DdbD7836e478b4624789`
- **Mumbai**: `0x326C977E6efc84E512bB9C30f76E30c160eD06FB`

## 💰 **Fee Structure**

### CCIP Fees
- **Native Token (ETH)**: Pay fees in ETH
- **LINK Token**: Pay fees in LINK tokens
- **Fee Calculation**: Automatic calculation based on destination chain and token amount

### Gas Fees
- **Source Chain**: Standard gas fees for approval and transfer
- **Destination Chain**: Handled by CCIP protocol

## 🔄 **How It Works**

### 1. **User Flow**
1. User selects destination chain (Sepolia → Mumbai)
2. User selects token to transfer (USDT, USDC, CHF, AUD)
3. User enters recipient address and amount
4. System calculates CCIP fees automatically
5. User approves tokens for CCIP sender contract
6. User executes cross-chain transfer
7. Tokens are transferred to destination chain

### 2. **Technical Flow**
1. **Token Approval**: Approve CCIP sender to spend tokens
2. **Fee Calculation**: Calculate CCIP fees using `getTransferFee()`
3. **Message Construction**: Build CCIP message with token details
4. **Cross-Chain Transfer**: Execute `transferTokens()` function
5. **Confirmation**: Return transaction hash for tracking

## 🛠 **Usage Instructions**

### For Users
1. **Connect Wallet**: Ensure MetaMask is connected to Sepolia
2. **Navigate to Transfer**: Go to Transfer page in the app
3. **Select Cross Chain**: Click "Cross Chain" tab
4. **Configure Transfer**:
   - Select destination chain
   - Choose fee token (ETH or LINK)
   - Select token to transfer
   - Enter recipient address
   - Enter amount
5. **Review Fees**: Check estimated CCIP fees
6. **Execute Transfer**: Click "Send Cross-Chain"

### For Developers
1. **Deploy Contract**: Use deployment script
2. **Update Addresses**: Update contract addresses in utils
3. **Test Functionality**: Test with small amounts first
4. **Monitor Transactions**: Use transaction hash to track progress

## 🔍 **Testing**

### Test Scenarios
1. **Same Chain Transfer**: Sepolia → Sepolia
2. **Cross Chain Transfer**: Sepolia → Mumbai
3. **Fee Payment**: Test both ETH and LINK fee payments
4. **Error Handling**: Test with insufficient balances

### Test Tokens
- **USDT**: `0x91093128F514e4D99759FB2816BBc961d7eaAF39`
- **USDC**: `0xF025544BB1f91eE2BD6a1741CBCC7a9Bfd902E0B`
- **CHF**: `0x54F1BcF82A329E37804e7627b1cbd29D7323fe9c`
- **AUD**: `0xeb5Aaf8f2DFE1fca72fDa345d5e9080c133c8C20`

## ⚠️ **Important Notes**

### Security
- **Testnet Only**: This implementation is for testnet use only
- **Private Keys**: Never commit private keys to version control
- **Contract Verification**: Verify deployed contracts on Etherscan

### Limitations
- **Testnet Tokens**: Only works with testnet tokens
- **Network Support**: Limited to supported CCIP networks
- **Fee Requirements**: Requires sufficient fees for cross-chain transfers

### Troubleshooting
1. **Contract Not Deployed**: Ensure contract is deployed and addresses are updated
2. **Insufficient Fees**: Check LINK/ETH balance for fees
3. **Token Approval**: Ensure tokens are approved for CCIP sender
4. **Network Issues**: Verify MetaMask is on correct network

## 📚 **Resources**

- [Chainlink CCIP Documentation](https://docs.chain.link/ccip)
- [CCIP Supported Networks](https://docs.chain.link/ccip/supported-networks)
- [CCIP Fee Calculator](https://docs.chain.link/ccip/fees)
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Chainlink Faucet](https://faucets.chain.link/)

## 🎯 **Next Steps**

1. **Deploy Contract**: Follow deployment steps above
2. **Update Addresses**: Update contract addresses in utils
3. **Test Functionality**: Test with small amounts
4. **Production Ready**: Add mainnet support when ready

---

**Note**: This implementation provides a complete cross-chain transfer solution using Chainlink CCIP. Make sure to test thoroughly on testnets before considering mainnet deployment. 