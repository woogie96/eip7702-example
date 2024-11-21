# EIP-7702 Batch Call Delegation Example

A demonstration of EIP-7702 implementation using Hardhat. This project showcases how to implement batch call delegation with EIP-7702 signature validation.

## Key Features

- Batch execution of multiple transactions
- EIP-7702 compliant signatures and authorization (using type 0x04 transactions)
- Support for ETH transfers and contract calls
- RLP encoding for transaction data

## Smart Contract

`BatchCallDelegation.sol`: 
- Main contract for executing multiple calls
- Handles call data, target address, and value for each transaction
- Emits events for execution results
- Implements batch delegation pattern

## Development Setup and Execution Steps

This project is configured to run on the Mekong testnet. To get started:

```shell
# Install dependencies
npm install

# Configure .env file
PRIVATE_KEY="your_private_key"
RPC_URL="https://rpc.mekong.ethpandaops.io"
RECIPIENT_ADDRESS="your_recipient_address"

# Step 1: Deploy the contract
npx hardhat run scripts/deployBatchCallDelegation.js --network mekong

# Step 2: Execute batch calls
npx hardhat run scripts/executeBatchCallDelegation.js --network mekong
```

During deployment, a `deployments/{network}.json` file will be created containing the deployed contract address and related information. The execution script then uses this deployment information to perform the batch calls.

## Testnet Information

This project is tested on Mekong testnet:
- Chain ID: 0x01a5ee289c
- RPC URL: https://rpc.mekong.ethpandaops.io

## Contract Structure

```solidity
struct Call {
    bytes data;    // Call data for the transaction
    address to;    // Target address
    uint256 value; // ETH value to send
}
```

The contract allows multiple calls to be executed in a single transaction, with proper authorization and signature verification according to EIP-7702 standards.

---
Reference: [Viem EIP-7702 Documentation](https://viem.sh/experimental/eip7702)

## Coworkers

- [@Miller-kk](https://github.com/Miller-kk) - Account Abstraction pioneer
- [@shamshod01](https://github.com/shamshod01) - Blockchain & AI Enthusiast
