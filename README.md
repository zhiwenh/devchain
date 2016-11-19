# devchain

Private Ethereum blockchain creator and development geth server

With **devchain** you can easily create your own private Ethereum blockchain and private networks. The setup needed is abstracted away, and you can create multiple private blockchains in seconds! It's great for development because you can adjust the mining difficulty and keep your blockchain state over multiple sessions.

Additionally, a Javascript file is preloaded into geth that comes with a ton of useful addons. It automates creating accounts, distributing Ether to your accounts, and auto mining for transactions. It also displays transaction info and contains an object (`dev`) containing helper methods such as distributing Ether from 1 account to all others.

## Install
You must [install geth](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum). Here are the Mac OSX install commands with brew:

```
brew tap ethereum/ethereum
brew install ethereum
```

After that install devchain:

```
npm install -g devchain
```

## Usage

### Initialize
In your terminal type:

```
-> devchain
```
The first time you type in the command it will initialize devchain.

This will create, in your current directory, a folder called `devchain/`, a file called `devgenesis.json`, and a file called `devconfig.js`. The folder will contain your Ethereum blockchain data such as blocks and accounts. The file `devgenesis.json` is your blockchain's genesis file, which contains the data for the blockchain's first block. [Click here](http://ethereum.stackexchange.com/questions/2376/what-does-each-genesis-json-parameter-mean) to learn more about it.

The genesis file's most important property that you will be adjusting is the "difficulty". The difficulty refers to how fast new blocks will be mined. You can set a low difficulty for development purposes or a high difficulty to mimic actual production.

The file `devconfig.js` lets you adjust the options of the geth preload script and the geth server options. It lets you adjust your auto mining status, RPC connection, and network p2p port. This file is optional, and the default options are shown below.

```
{
  /** Preload script options */
  autoMine: true, // Auto mining status
  accountAmount: 3, // Number of accounts to create
  password: '', // Password to create accounts with
  minAmount: 50, // Ether amount to keep coinbank topped off at
  distributeAmount: 10, // Ether amount to distribute to all accounts

  /** Custom geth node start options */
  rpcaddr: 'localhost', // RPC host
  rpcport: 8545, // RPC port
  port: 30303, // P2P network listening port
  networkid: 1, // Network identifier. To connect with other nodes
  staticNodes: [] // Geth enode addresses to connect with
}
```

Adjust `devgenesis.json` and `devconfig.js` as needed.

### Start
Call the devchain command again to initialize the blockchain and start up the geth server.

By default the geth server will create 3 accounts and automatically start mining. 10 Ether will be distributed from your coinbase (first account created) to all other accounts after 31 Ether is reached. It will then mine 50 Ether and wait for pending transactions before mining again, or to keep the coinbase topped off.

In the console you're given access to an object called `dev`. The methods are shown below. These methods are also shown upon starting up the geth server or by typing `dev.help()`.

* **dev**
   * **.minAmount** - *Adjust the minimum amount of Ether to keep above*
   * **.accounts()** - *Displays all accounts, balances, and indexes*
   * **.auto()** - *Toggles auto mining*
   * **.start(threads)** - *Start mining -- threads defaults to 1*
   * **.stop()** - *Stop mining*
   * **.transfer(fromIndex, toIndex, etherAmount)** - *Transfer Ether between your accounts*
   * **.distribute(fromIndex, etherAmount)** - *Distribute Ether to all your accounts from one account*
   * **.mine(blockAmount)** - *Mine a certain amount of blocks -- blockAmount defaults to 1*
   * **.block(blockNumber)** - *Display block information -- blockNumber defaults to latest*
   * **.coinbase(accountIndex)** - *Change coinbase*
   * **.mute()** - *Toggles transaction receipt display*
   * **.help()** - *Display delib methods*

### Reset
To reset your blockchain data and accounts type:

```
-> devchain --reset
```

This will create a new `devchain/` folder and if the `devgenesis.json` exists in the current directory it will start up a new blockchain.

### Connecting with other blockchains
To connect with other blockchains you will need the geth enode addresses you wish to connect with. The other blockchains will need to have the same genesis file and network id as you.

You can pass in static nodes as a command option or you can add them into the `devconfig.js` staticNodes property. It creates a `static-nodes.json` file inside your blockchain folder. [Click here](https://github.com/ethereum/go-ethereum/wiki/Connecting-to-the-network) to learn more about connecting to peers and static nodes.

```
-> delib devchain --staticnodes enode://pubkey1@ip:port, enode://pubkey2@ip:port --networkid 1000
```

You can have multiple blockchains synced on your computer by configuring them with an unique RPC port and network p2p port.

## Options
The `devchain` command has the following options:

**delib devchain `-r --reset --off --accounts <amount> --password <value> --datadir <path> --rpchost <value> --rpcport <number> --port <number> --networkid <number> --staticnodes <enodes>..<enodes>`**

| Options | Type | Description |
| --- | --- | --- |
| `-r --reset` | `-- `| Reset blockchain data |
| `--off` | `--`  | Turn off auto mine |
| `--accounts` | `<amount>` | Number of accounts to initially create |
| `--password` | `<value>` |  Password to give and unlock the accounts created |
| `--datadir` | `<path>` | Relative path to blockchain data |
| `--rpchost` | `<value>` | Geth server HTTP-RPC host. Default is 'localhost' |
| `--rpcport` | `<number>` | Geth server HTTP-RPC port. Default is 8545 |
| `--port` | `<number>` | Geth server network p2p port. Default is 30303 |
| `--networkid` | `<number>` | Geth network identifier. To connect with other nodes. Default is 1 |
| `--staticnodes` | `<enodes>..<enodes>` | Comma seperated list of static nodes to connect with. This will create a static-nodes.json file within your blockchain's data directory |

You can pass in geth options that aren't listed above and you can set them within `devconfig.js` as additional properties. To do this set the key as the option name and the value as the value. If your desired option doesn't require a value, set it as true. An example is shown below:

```
{
  ipcdisable: true,
  ipcapi: 'admin, eth, personal, web3',
  fast: true
}
```

## Useful Options

#### Turn off auto mining
```
-> delib devchain --off
```

#### Choose number of accounts to create
This option only works if you are creating or reseting a blockchain.
```
-> delib devchain --accounts 6 --password hello
```
If you choose your own password you will need to pass it in next time to unlock your accounts.

#### Choose custom path to blockchain data
This will create or use a specified folder for the blockchain data. It will try and reference a `devgenesis.json` file in the directory above and will create it if not found.
```
-> delib devchain --datadir './relative/path/to/folder'
```

#### Specify RPC port and network p2p port
You can create multiple private blockchains running on separate geth servers by giving them an unique RPC and network p2p port.

The default ports opened:
```
-> delib devchain --datadir './relative/path/to/folder1/chaindata' --rpcport 8545 --port 30303
```

Open up another private blockchain node
```
-> delib devchain --datadir './relative/path/to/folder2/chaindata' --rpcport 8546 --port 30304
```
