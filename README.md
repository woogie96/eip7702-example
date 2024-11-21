# EIP-7702 Batch Call Delegation Example

A demonstration of EIP-7702 implementation using Hardhat. This project showcases how to implement batch call delegation with EIP-7702 signature validation.

## Key Features

- Batch execution of multiple transactions
- EIP-7702 compliant signatures and authorization
- Support for ETH transfers and contract calls
- RLP encoding for transaction data

## Smart Contract

`BatchCallDelegation.sol`: 
- Main contract for executing multiple calls
- Handles call data, target address, and value for each transaction
- Emits events for execution results
- Implements batch delegation pattern

## Development Setup

This project is configured to run on the Mekong testnet. To get started:

```shell
# Install dependencies
npm install

# Configure .env file
PRIVATE_KEY="your_private_key"
RPC_URL="https://rpc.mekong.ethpandaops.io"

# Deploy and execute contract
npx hardhat run scripts/executeBatchCallDelegation.js --network mekong
```

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
