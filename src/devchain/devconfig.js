/** Config file for devchain. This file is not required to use devchain */
module.exports = {

  /** Preload script options */
  autoMine: true, // Auto mining status
  accountAmount: 3, // Number of accounts to create
  password: '', // Password to create accounts with
  minAmount: 50, // Ether amount to keep coinbank topped off at
  distributeAmount: 10, // Ether amount to distribute to all accounts

  /** Custom geth node start options */
  identity: 'devchain', // RPC identity name
  rpcaddr: 'localhost', // RPC host
  rpcport: 8545, // RPC port
  port: 30303, // Geth p2p network listening port
  staticNodes: [] // Geth enode addresses to connect with
}
