const { ethers } = require('hardhat');

const main = async () => {
  // Initialize wallet instance with private key and provider
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider);

  // Get contract factory for BatchCallDelegation smart contract
  const BatchCallDelegation = await ethers.getContractFactory("BatchCallDelegation", wallet);
  
  // Deploy BatchCallDelegation contract
  console.log("Deploying BatchCallDelegation contract...");
  const batchCallDelegation = await BatchCallDelegation.deploy();
  
  // Wait until the contract is fully deployed on the blockchain
  await batchCallDelegation.waitForDeployment();
  
  console.log("BatchCallDelegation deployed to:", batchCallDelegation.target);

  // Define contract interface with execute function signature
  const batchInterface = new ethers.Interface([
    "function execute(tuple(bytes data, address to, uint256 value)[] calls)"
  ]);
    
  // Define sample transaction parameters for batch execution
  const calls = [
    {
      data: "0x", // Empty calldata for simple ETH transfer
      to: "0xf19588Ce7eF802F26bf7a7d9d96444dD4Ed8DA59", // Recipient address
      value: ethers.parseEther("0.001") // Amount of ETH to transfer (0.001 ETH)
    }
  ];

  // Encode the execute function call with parameters
  const calldata = batchInterface.encodeFunctionData("execute", [calls]);

  // Get current nonce for the wallet address
  const currentNonce = await ethers.provider.getTransactionCount(wallet.address);

  // Prepare authorization data for the transaction
  const authorizationData = {
    chainId: '0x01a5ee289c', // Mekong testnet chain ID
    address: batchCallDelegation.target, // Deployed contract address
    nonce: ethers.toBeHex(currentNonce + 1), // Next nonce in hex format
  }

  // Encode authorization data according to EIP-712 standard
  const encodedAuthorizationData = ethers.concat([
    '0x05', // MAGIC code for EIP7702
    ethers.encodeRlp([
      authorizationData.chainId,
      authorizationData.address,
      authorizationData.nonce,
    ])
  ]);

  // Generate and sign authorization data hash
  const authorizationDataHash = ethers.keccak256(encodedAuthorizationData);
  const authorizationSignature = wallet.signingKey.sign(authorizationDataHash);

  // Store signature components
  authorizationData.yParity = authorizationSignature.yParity == 0 ? '0x' : '0x01';
  authorizationData.r = authorizationSignature.r;
  authorizationData.s = authorizationSignature.s;

  // Get current gas fee data from the network
  const feeData = await ethers.provider.getFeeData();

  // Prepare complete transaction data structure
  const txData = [
    authorizationData.chainId,
    ethers.toBeHex(currentNonce),
    ethers.toBeHex(feeData.maxPriorityFeePerGas), // Priority fee (tip)
    ethers.toBeHex(feeData.maxFeePerGas), // Maximum total fee willing to pay
    ethers.toBeHex(1000000), // Gas limit
    wallet.address, // Sender address
    '0x', // Value (in addition to batch transfers)
    calldata, // Encoded function call
    [], // Access list (empty for this transaction)
    [
      [
        authorizationData.chainId,
        authorizationData.address,
        authorizationData.nonce,
        authorizationData.yParity,
        authorizationData.r,
        authorizationData.s
      ]
    ]
  ];

  // Encode final transaction data with version prefix
  const encodedTxData = ethers.concat([
    '0x04', // Transaction type identifier
    ethers.encodeRlp(txData)
  ]);

  // Sign the complete transaction
  const txDataHash = ethers.keccak256(encodedTxData);
  const txSignature = wallet.signingKey.sign(txDataHash);

  // Construct the fully signed transaction
  const signedTx = ethers.hexlify(ethers.concat([
    '0x04',
    ethers.encodeRlp([
      ...txData,
      txSignature.yParity == 0 ? '0x' : '0x01',
      txSignature.r,
      txSignature.s
    ])
  ]));

  // Send the raw transaction to the network
  const tx = await ethers.provider.send('eth_sendRawTransaction', [signedTx]);
  
  console.log('tx sent: ', tx);
}

// Execute main function and handle success/error cases
main().then(() => {
  console.log('done');
  process.exit(0);
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
