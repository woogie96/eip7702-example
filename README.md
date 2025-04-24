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

This project is configured to run on the Sepolia testnet. To get started:

```shell
# Install dependencies
npm install

# Configure .env file
PRIVATE_KEY="your_private_key"
RPC_URL="https://sepolia.infura.io/v3/YOUR-PROJECT-ID"
RECIPIENT_ADDRESS="your_recipient_address"

# Step 1: Deploy the contract
npx hardhat run scripts/deployBatchCallDelegation.js --network sepolia

# Step 2: Execute batch calls
npx hardhat run scripts/executeBatchCallDelegation.js --network sepolia
```

During deployment, a `deployments/{network}.json` file will be created containing the deployed contract address and related information. The execution script then uses this deployment information to perform the batch calls.

## Testnet Information

This project is tested on Sepolia testnet:
- Chain ID: 11155111
- RPC URL: https://sepolia.infura.io/v3/YOUR-PROJECT-ID

## Contract Structure

```solidity
struct Call {
    bytes data;    // Call data for the transaction
    address to;    // Target address
    uint256 value; // ETH value to send
}
```

The contract allows multiple calls to be executed in a single transaction, with proper authorization and signature verification according to EIP-7702 standards.

## EIP-7702 Structure and Principles

### Basic Structure
```
┌─────────────────────────────────────────┐
│              EOA Account                │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│           Before EIP-7702               │
├─────────────────────────────────────────┤
│  • Single transaction execution         │
│  • Limited to basic transfers           │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│           After EIP-7702                │
├─────────────────────────────────────────┤
│  • Delegated code execution             │
│  • Multiple operations in one tx        │
│  • Smart contract-like capabilities     │
└─────────────────────────────────────────┘
```

### How It Works

1. **Delegation Setup**
```
┌──────────┐                              ┌──────────┐
│   EOA    │                              │Delegate  │
│ Account  │                              │Contract  │
└──────────┘                              └──────────┘
     │                                           │
     │     1. Request Code Delegation            │
     │──────────────────────────────────────────>│
     │                                           │
     │     2. Return Code Reference              │
     │<──────────────────────────────────────────│
     │                                           │
     │                                           │
     ▼                                           ▼
┌──────────┐                              ┌──────────┐
│  EOA     │                              │  Code    │
│ Storage  │                              │ Storage  │
├──────────┤                              ├──────────┤
│0xef0100  │                              │Actual    │
│+ address │                              │Code      │
└──────────┘                              └──────────┘
     │                                           │
     │     3. Load Code for Execution            │
     │<──────────────────────────────────────────│
     │                                           │
     ▼                                           ▼
┌─────────────────────────────────────────┐
│           EOA with Delegated Code       │
└─────────────────────────────────────────┘
```

2. **Execution Flow**
```
┌─────────────────────────────────────────┐
│           Transaction Execution         │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│          1. Verify Delegation           │
│          • Check designator format      │
│          • Validate permissions         │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│          2. Load Actual Code            │
│          • Fetch from delegate address  │
│          • Prepare execution context    │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│          3. Execute Code                │
│          • Run in EOA context           │
│          • Process multiple operations  │
└─────────────────────────────────────────┘
```

### Key Features

- **Temporary Delegation**: EOA can temporarily behave like a smart contract
- **Permission Verification**: Secure delegation through signatures and nonce checks
- **Flexible Execution**: Ability to perform various operations in delegated code
- **Gas Efficiency**: More efficient gas usage compared to traditional EOA operations
- **Batch Operations**: Execute multiple operations in a single transaction
- **Signature Validation**: Secure authorization through EIP-7702 compliant signatures

---
Reference: 
- [Viem EIP-7702 Documentation](https://viem.sh/experimental/eip7702)
- [EIP-7702 Official Documentation](https://eips.ethereum.org/EIPS/eip-7702)

## Benefits of EIP-7702

EIP-7702 brings several significant improvements to Ethereum's account abstraction capabilities:

### 1. Gas Sponsorship
- **Transaction Sponsorship**: Allows third parties to pay gas fees for users' transactions
- **Flexible Payment Models**: Sponsors can be paid in ERC-20 tokens or operate as free service providers
- **Enhanced User Experience**: Users can interact with dApps without holding ETH for gas

### 2. Batch Operations
- **Atomic Transactions**: Execute multiple operations in a single transaction
- **DEX Workflows**: Common operations like approve + transfer can be combined
- **Dependent Operations**: Output of one operation can be used as input for the next
- **Gas Efficiency**: Reduces overall gas costs by combining multiple transactions

### 3. Enhanced Security
- **Privilege Management**: Create sub-keys with limited permissions
- **Granular Control**: Restrict permissions to specific tokens or daily spending limits
- **Application-Specific Access**: Limit interactions to specific dApps or contracts
- **Secure Delegation**: Built-in signature verification and nonce management

### 4. Developer Benefits
- **Simplified Integration**: Compatible with existing ERC-4337 EntryPoint
- **No New Opcodes**: Uses existing infrastructure without requiring new opcodes
- **Future-Proof**: Designed for compatibility with future account abstraction improvements
- **Storage Management**: Flexible storage layout options for delegate contracts

---
Reference: 
- [Viem EIP-7702 Documentation](https://viem.sh/experimental/eip7702)
- [EIP-7702 Official Documentation](https://eips.ethereum.org/EIPS/eip-7702)

## Coworkers

- [@Miller-kk](https://github.com/Miller-kk) - Account Abstraction pioneer
- [@shamshod01](https://github.com/shamshod01) - Blockchain & AI Enthusiast