# devchain

Private Ethereum blockchain creator and development geth server

With **devchain** you can easily create your own private Ethereum blockchains and private networks. The setup needed is abstracted away, and you can create multiple private blockchains in seconds! It's great for development because you can adjust the mining difficulty and keep your blockchain state over multiple sessions.

Additionally, a Javascript file is preloaded into geth that comes with a ton of useful addons. It automates account creation, distributing Ether to your accounts, and auto mining for transactions. It also displays transaction info and contains an object (`dev`) containing helper methods such as distributing Ether from 1 account to all others.

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
The first time you use the command it will initialize devchain.

In your current directory this will create a folder called `devchain/`, a file called `devgenesis.json`, and a file called `devconfig.js`. The folder will contain your Ethereum blockchain data such as blocks and accounts. The file `devgenesis.json` is your blockchain's genesis file, which contains the data for the blockchain's first block. [Go here](http://ethereum.stackexchange.com/questions/2376/what-does-each-genesis-json-parameter-mean) to learn more about the genesis file.

The genesis file's most useful property is the "difficulty". The difficulty refers to how fast new blocks can be mined. You can set a low difficulty for development purposes or a high difficulty to mimic actual production.

The file `devconfig.js` lets you adjust the options of the geth preload script and the geth server options. The default options are shown below. All [command options](#options) will overwrite the config file's expect staticNodes, which gets added on instead.

```
{
  /** Preload script options */
  autoMine: true, // Set false to turn off auto mining
  isMute: false, // Set true to turn off transaction receipt display
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
Call the devchain command again to start up the geth server. If there's no blockchain data it will initialize a new blockchain based on `devgenesis.json`.

If you wish to have a set of accounts all preallocated with Ether wait until the initial setup actions are completed. Setup actions can be adjusted from `devconfig.js` or thru [command options](#options). If you set your own password you will need to leave it inside the config file or remember it for next time to pass in as an option.

By default the geth server will create 3 accounts and automatically start mining. 10 Ether will be distributed from your coinbase (first account created) to all other accounts after 31 Ether is reached. It will then mine 50 Ether and wait for pending transactions before mining again, or to keep the coinbase topped off.

Ether will only be distributed to all accounts on a new blockchain geth start. To disable this feature turn off auto mining with the option `--off`. You can turn auto mining back on with the geth console's `dev` object.

### Console helper methods
In the geth console you're given access to an object called `dev`. The methods are shown below. These methods are also shown upon starting up the geth server or by using `dev.help()`.

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
   * **.help()** - *Display dev methods*

### Connection
The geth option to enable an RPC connection, `--rpc`, is used by default. The connection listens at the address and port that you set. The default is `localhost:8545`. To turn off the RPC connection use the option `--rpcoff`.

### Reset
To reset your blockchain data and accounts use:

```
-> devchain --reset
```

This will create a new `devchain/` folder and if the `devgenesis.json` exists in the current directory it will start up a new blockchain.

### Connecting with other blockchains
To connect with other blockchains you will need the geth enode addresses you wish to connect with. The other blockchains will need to have the same genesis file and be using the same network id as you. Your enode address is shown when you start the geth server.

You can pass in static nodes with the command option `--staticnodes` or you can add them into the `devconfig.js` staticNodes property. For new blockchains it creates a `static-nodes.json` file within your blockchain folder, otherwise it connects them within geth. [Go here](https://github.com/ethereum/go-ethereum/wiki/Connecting-to-the-network) to learn more about static nodes and connecting to peers.

The geth option `--nodiscover` is used by default so only people who manually add you will be able to find you. Use the option `--nodiscoveroff` to disable it.

To connect with nodes running on the network id 1000:

```
-> devchain --staticnodes enode://pubkey1@ip:port,enode://pubkey2@ip:port --networkid 1000
```

You can create multiple private blockchains running on your computer by giving them an unique RPC port, network p2p port, and blockchain data location.

The default ports opened:
```
-> devchain --rpcport 8545 --port 30303
```

You can specify a custom path to the blockchain data. Alternatively you can go to that directory to call the command.

```
-> devchain --datadir './relative/path/to/chaindata' --rpcport 8546 --port 30304
```

<a name="options"></a>
## Options
All command options will overwrite the `devconfig.js` options except `--staticnodes`, which gets added on instead.

**devchain `-r --reset, -o --off, -m --mute, -a --accounts <number>, -t --distribute <number>, -p --password <value>, -d --datadir <path>, --rpcaddr <value>, --rpcport <number>, --port <number>, --networkid <number>, --rpcoff, --nodiscoveroff, -s --staticnodes <enodes>`**

```
Options            Type         Description

-r --reset         --           Reset blockchain data
-o --off           --           Turn off auto mine
-m --mute          --           Turn off transaction receipt display
-a --accounts      <number>     Number of accounts to initially create. Default is 3
-t --distribute    <number>     Ether amount to distribute to accounts initially. Default is 10
-p --password      <value>      Password to give and unlock the accounts created. Default is ""
-d --datadir       <path>       Relative path to blockchain data
--rpcaddr          <value>      Geth server HTTP-RPC addr. Default is 'localhost'
--rpcport          <number>     Geth server HTTP-RPC port. Default is 8545
--port             <number>     Geth server network p2p port. Default is 30303
--networkid        <number>     Geth network identifier. To connect with other nodes. Default is 1
--rpcoff           --           Disable the Geth RPC connection. Don't set `--rpc` option for geth
--nodiscoveroff    --           Don't set `--nodiscover` option for geth
-s --staticnodes   <enodes>     Comma separated list with no spaces of static nodes to connect with.
                                This will create a static-nodes.json file within your blockchain's data directory for new blockchains
```

You can pass in additional options that aren't listed for geth. You can also do this via `devconfig.js` as additional properties. The key will be the option name with the '--' removed. If your desired option doesn't require a value, set it as true. An example is shown below:

```
{
  ipcdisable: true,
  ipcapi: 'admin, eth, personal, web3',
  fast: true
}
```
