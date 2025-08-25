# EIP-7702 Batch Call Delegation Example

A demonstration of EIP-7702 implementation using Hardhat. This project showcases how to implement batch call delegation with EIP-7702 signature validation.

## Key Features

- Batch execution of multiple transactions
- EIP-7702 compliant signatures and authorization (using type 0x04 transactions)
- Support for ETH transfers and contract calls
- RLP encoding for transaction data
- Permanent account code delegation
- Secure signature verification

## Smart Contract

`BatchCallDelegation.sol`: 
- Main contract for executing multiple calls
- Handles call data, target address, and value for each transaction
- Emits events for execution results
- Implements batch delegation pattern

## Development Setup and Execution Steps

This project supports multiple networks and is configured to work with any EVM-compatible blockchain that supports EIP-7702, including Substrate-based chains with EVM compatibility. The recent network configuration changes were specifically implemented to support Substrate-based blockchains. To get started:

```shell
# Install dependencies
npm install

# Configure .env file
PRIVATE_KEY="your_private_key"
RPC_URL="your_rpc_url"
RECIPIENT_ADDRESS="your_recipient_address"

# Step 1: Deploy the contract
npx hardhat run scripts/deployBatchCallDelegation.js --network target

# Step 2: Execute batch calls
npx hardhat run scripts/executeBatchCallDelegation.js --network target

# Step 3: Remove account code (optional)
npx hardhat run scripts/executeRemoveAccountCode.js --network target
```

During deployment, a `deployments/{network}.json` file will be created containing the deployed contract address and related information. The execution script then uses this deployment information to perform the batch calls.

## Supported Networks

This project can be deployed and executed on any EVM-compatible network that supports EIP-7702, including Substrate-based chains with EVM compatibility. The flexible network configuration allows seamless integration with various blockchain ecosystems.

## Network Configuration

The project uses a flexible network configuration in `hardhat.config.js` that was specifically designed to support Substrate-based chains:

```javascript
networks: {
  target: {
    url: process.env.RPC_URL
  }
}
```

This configuration allows you to easily switch between different networks, including Substrate-based chains, by simply changing the `RPC_URL` in your `.env` file. The deployment and execution scripts automatically detect the network and save/load deployment information accordingly.

### Substrate Chain Support

The recent network configuration changes were implemented to provide seamless support for Substrate-based blockchains with EVM compatibility. The flexible RPC configuration ensures that the same deployment and execution scripts work across all supported networks without modification.

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Your wallet private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# RPC URL for your target network
RPC_URL=https://your-network-rpc-url

# Recipient address for test transactions
RECIPIENT_ADDRESS=0x...
```

**Important Notes:**
- Never commit your `.env` file to version control
- Ensure your target network supports EIP-7702 before deployment
- Test on testnets first before deploying to mainnet
- Make sure you have sufficient native tokens for gas fees
- For Substrate-based chains, verify EVM compatibility and EIP-7702 support
- Some Substrate chains may have different gas fee structures or transaction formats

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

- **Permanent Delegation**: EOA can permanently behave like a smart contract
- **Permission Verification**: Secure delegation through signatures and nonce checks
- **Flexible Execution**: Ability to perform various operations in delegated code
- **Gas Efficiency**: More efficient gas usage compared to traditional EOA operations
- **Batch Operations**: Execute multiple operations in a single transaction
- **Signature Validation**: Secure authorization through EIP-7702 compliant signatures

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

## Scripts Overview

### 1. `deployBatchCallDelegation.js`
Deploys the BatchCallDelegation contract to the specified network and saves deployment information.
- Automatically detects the current network from the RPC URL
- Creates network-specific deployment files in `deployments/{network}.json`
- Supports any EVM-compatible network with EIP-7702 support

### 2. `executeBatchCallDelegation.js`
Executes batch calls using EIP-7702 delegation:
- Creates authorization data with proper chain ID and nonce
- Signs authorization data according to EIP-7702 standards
- Constructs type 0x04 transaction with RLP encoding
- Sends raw transaction to the network
- Automatically loads deployment information for the current network

### 3. `executeRemoveAccountCode.js`
Removes delegated account code:
- Sets delegate address to zero address
- Removes permanent code delegation
- Returns EOA to its original state
- Works across all supported networks

## Network-Specific Features

- **Automatic Network Detection**: Scripts automatically detect the network from the RPC URL
- **Network-Specific Deployment Files**: Each network gets its own deployment file for isolation
- **Cross-Network Compatibility**: Same scripts work across different networks without modification
- **Flexible RPC Configuration**: Easy switching between networks via environment variables
- **Substrate Chain Support**: Native support for Substrate-based chains with EVM compatibility
- **Multi-Ecosystem Integration**: Seamless deployment across Ethereum, Polygon, and Substrate ecosystems

## Technical Implementation Details

### Transaction Type 0x04
EIP-7702 uses transaction type 0x04 which includes:
- Authorization data in the access list
- RLP-encoded transaction parameters
- Signature verification for delegation

### Authorization Process
1. Create authorization data with chain ID, delegate address, and nonce
2. Encode with magic byte 0x05 and RLP encoding
3. Sign the authorization data hash
4. Include signature components in transaction access list

### Code Delegation
- Permanent delegation of smart contract code to EOA
- Code is stored at delegate contract address
- EOA can execute delegated code during transaction
- Code remains active until explicitly removed

## References

- [Viem EIP-7702 Documentation](https://viem.sh/experimental/eip7702)
- [EIP-7702 Official Documentation](https://eips.ethereum.org/EIPS/eip-7702)
- [Account Abstraction Overview](https://ethereum.org/en/roadmap/account-abstraction/)

## Contributors

- [@Miller-kk](https://github.com/Miller-kk) - Account Abstraction pioneer
- [@shamshod01](https://github.com/shamshod01) - Blockchain & AI Enthusiast

## License

This project is licensed under the MIT License.