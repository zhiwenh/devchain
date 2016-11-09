# devchain

Private Ethereum blockchain creator and development geth server

With **devchain** you can easily create your own private Ethereum blockchain. It abstracts away the setup needed, and you can create multiple private blockchains in seconds!

Additionally, a Javascript file is preloaded into geth that comes with a ton of addons to help with your development. It automates creating accounts, distributing Ether to your accounts, and auto mining for transactions. It also displays transaction info and contains an object (`dev`) containing useful helper methods.

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

In your terminal type:

```
-> devchain
```

This will create a folder called `devchain/` that contains the blockchain data, the blockchain's genesis file called `devgenesis.json`, and an optional config file called `devconfig.js`. The genesis file `devgenesis.json` contains the data for the blockchain's first block. Its most useful property is the mining difficulty, which determines how fast mining new blocks will be. Go [here](http://ethereum.stackexchange.com/questions/2376/what-does-each-genesis-json-parameter-mean) to learn more about it. The file `devconfig.js` allows you to adjust the options of the geth preload script and server. It's optional and can be overwritten with command line options.  

Adjust `devgenesis.json` and `devconfig.js` as needed then call the command again to initialize the blockchain and start up the geth server.

By default the geth server will create 3 accounts and automatically start mining. 10 Ether will be distributed from your coinbase (first account created) to all other accounts after 30 Ether is reached. It will then mine 50 Ether and wait for pending transactions before mining again, or to keep the coinbase topped off.

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
   * **.help()** - *Display delib methods*

## Options

The `devchain` command has the following options:

**delib devchain `--reset --off --accounts <amount> --password <value> --staticnodes <enodes>..<enodes> --identity <value> --datadir <path> --port <number> --rpchost <value> --rpcport <number> --verbosity <number> --rpccorsdomain <value>`**

| Options | Type | Description |
| --- | --- | --- |
| `--reset` | `-- `| Reset blockchain data |
| `--off` | `--`  | Turn off auto mine |
| `--accounts` | `<amount>` | Number of accounts to initially create |
| `--password` | `<value>` |  Password to give and unlock the accounts created |
| `--staticnodes` | `<enodes>..<enodes>` | Comma seperated list of static nodes to connect with. This will create a static-nodes.json file within your blockchain's data directory |
| `--identity ` | `<value>` | Geth node identity name. Default is "dev" |
| `--datadir` | `<path>` | Relative path to blockchain data |
| `--port` | `<number>` | Geth server network p2p port. Default is 30303 |
| `--rpchost` | `<value>` | Geth server HTTP-RPC host. Default is 'localhost' |
| `--rpcport` | `<number>` | Geth server HTTP-RPC port. Default is 8545 |
| `--verbosity` | `<number>`  | Logging verbosity: 0=silent, 1=error, 2=warn, 3=info, 4=core, 5=debug, 6=detail. Default is 3 |
| `--rpccorsdomain` | `<value>` | Comma separated list of domains from which to accept cross origin requests. Default is * |


## Useful Options

#### Reset blockchain data

This deletes your accounts and blockchain data.
```
-> delib devchain --reset
```

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

<a name="network"></a>
#### Connect with other private blockchains

Get the geth enode addresses you wish to connect with and pass them in as an option when you call the `devchain` command.

```
-> delib devchain --staticnodes enode://pubkey1@ip:port, enode://pubkey2@ip:port
```

If the other geth servers are running a blockchain with the same identity and genesis file as you, then syncing will begin. Your enode address is shown when you start up devchain. It will look like this: *enode://pubkey@ip:port*. You can have multiple blockchains synced on your computer by configuring them with an unique RPC port and network p2p port. By default these are 8545 and 30303 respectively.
