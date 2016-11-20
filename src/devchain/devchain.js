var CONFIG = {"autoMine":true,"isMute":false,"accountAmount":3,"password":"","minAmount":50,"distributeAmount":10,"rpcaddr":"localhost","rpcport":8545,"port":30303,"networkid":1,"staticNodes":[],"path":"/Users/zhiwen/Development/devchain/test/devchain"}; 
/* global web3, CONFIG */

/** The global dev methods */
var dev = CONFIG; // CONFIG object gets built onto this file

/** Displays all accounts, balances, and indexes */
dev.accounts = function() {
  console.log('');
  this.log('=== Accounts ===');
  this.log('Index  Account                                      Ether');
  for (var i = 0; i < web3.eth.accounts.length; i++) {
    if (web3.eth.accounts[i] === web3.eth.coinbase) {
      dev.log(i, '    ', web3.eth.accounts[i], ' ', this.weiToEther(web3.eth.getBalance(web3.eth.accounts[i]).toString(10)), '- coinbase');
    } else {
      dev.log(i, '    ', web3.eth.accounts[i], ' ', this.weiToEther(web3.eth.getBalance(web3.eth.accounts[i]).toString(10)));
    }
  }
  console.log('');
  return true;
};

/**
 * To start mining
 * @param {number} threads - Optional. The number of threads to mine with. Defaults to 1/
 */
dev.start = function(threads) {
  threads = threads || 1;
  if (!web3.eth.mining) {
    console.log('');
    dev.log('Starting miner');
    console.log('');
    web3.miner.start(threads);
    return true;
  }
  return false;
};

/** To stop mining */
dev.stop = function() {
  if (web3.eth.mining) {
    console.log('');
    dev.log('Stopping miner');
    console.log('');
    web3.miner.stop();
    return true;
  }
  return false;
};

/** Toggles auto mining */
dev.auto = function() {
  if (this.autoMine === true) {
    this.autoMine = false;
    console.log('');
    this.log('Auto mining is off');
    console.log('');
  } else {
    this.autoMine = true;
    console.log('');
    this.log('Auto mining is on');
    console.log('');
  }
  this.stop();
  return true;
};


/**
 * Distributes Ether to all of your accounts from an account
 * @param {number} fromIndex - Index in web3.eth.accounts to sender Ether from
 * @param {number} etherAmount - Amount to transfer to all accounts
 */
dev.distribute = function(fromIndex, etherAmount) {
  var requiredAmount = etherAmount * (web3.eth.accounts.length - 1) + 2;
  if (web3.eth.getBalance(web3.eth.accounts[fromIndex]).greaterThan(this.etherToWei(requiredAmount))) {
    for (var i = 0; i < web3.eth.accounts.length; i++) {
      if (i === fromIndex) continue;
      var object = {
        from: web3.eth.accounts[fromIndex],
        to: web3.eth.accounts[i],
        value: this.etherToWei(etherAmount)
      };
      web3.eth.sendTransaction(object);
    }
    console.log('');
    this.log(etherAmount, 'Ether distributed to accounts');
    console.log('');
    this.mine(2);
    return true;
  } else {
    var balanceEther = this.etherToWei(web3.eth.getBalance(web3.eth.accounts[fromIndex]));
    console.log('');
    this.log('Not enough Ether. Balance:', balanceEther, 'Required:', requiredAmount);
    console.log('');
    return false;
  }
};

/**
 * Transfer Ether between your accounts
 * @param {number} fromIndex - Index in web3.eth.accounts to send Ether from.
 * @param {number} toIndex - Index in web3.eth.accounts to send Ether to.
 * @param {number} etherAmount - Amount of Ether to transfer over
 */
dev.transfer = function(fromIndex , toIndex, etherAmount) {
  if (fromIndex === toIndex) return;
  if (fromIndex < 0 || toIndex < 0) return;
  if (fromIndex > web3.eth.accounts.length - 1 || toIndex > web3.eth.accounts.length - 1) return;

  var balanceEther = this.weiToEther(web3.eth.getBalance(web3.eth.accounts[fromIndex]));
  if (balanceEther < etherAmount) {
    console.log('');
    this.log('Not enough Ether. Balance:', balanceEther);
    console.log('');
    return;
  }
  var object = {
    from: web3.eth.accounts[fromIndex],
    to: web3.eth.accounts[toIndex],
    value: this.etherToWei(etherAmount)
  };
  web3.eth.sendTransaction(object);
  console.log('');
  this.log(etherAmount, 'Ether transfered to', web3.eth.accounts[fromIndex], 'from', web3.eth.accounts[toIndex]);
  console.log('');
  this.mine(2);
  return true;
};

/**
 * Mine a specified number of blocks
 * @param {number} blockAmount - Number of blocks to mine
 */
dev.mine = function(blockAmount) {
  blockAmount = blockAmount || 1;
  if (blockAmount <= 0 || web3.eth.mining === true) return false;
  var stopBlock = web3.eth.blockNumber + blockAmount;
  this.start();

  // keep ref to auto mine status when called to set it back to it later
  var autoStatus = this.autoMine;
  this.autoMine = false;

  // Create the filter to watch with check function
  var filter = web3.eth.filter('latest');
  filter.watch(check.bind(this));

  console.log('');
  dev.log('Mining', blockAmount, 'blocks');
  console.log('');

  function check() {
    if (web3.eth.blockNumber >= stopBlock || web3.eth.mining === false) {
      // Stop watching filter
      this.autoMine = autoStatus;
      if (this.autoMine !== true) this.stop();
      filter.stopWatching();
    }
  }
  return true;
};

/**
 * Display block info
 * @param {number} blockNumber - Optional. The block number to display the info of. Defaults to 'latest'.
 */
dev.block = function(blockNumber) {
  blockNumber = blockNumber || 'latest';
  web3.eth.getBlock(blockNumber, function(err, block) {
    if (!err) {
      console.log('');
      this.log('Block Info');
      this.log('Number:     ' + block.number);
      this.log('Hash:       ' + block.hash);
      this.log('Difficulty: ' + block.difficulty);
      this.log('Gas Limit:  ' + block.gasLimit.toString());
      this.log('Gas Price:  ' + web3.eth.gasPrice.toString());
      this.log('Total Gas:  ' + block.gasUsed);
      this.log('Miner:      ' + block.miner);
      console.log('');
    }
  }.bind(this));
  return true;
};

/**
* Change the coinbase to another one of your accounts. This is where the Ether mining rewards are deposited.
* @param accountIndex - Index in web3.eth.accounts.
*/
dev.coinbase = function(accountIndex) {
  if (accountIndex < 0 || accountIndex > web3.eth.accounts.length - 1) return false;
  web3.miner.setEtherbase(web3.eth.accounts[accountIndex]);
  console.log('');
  this.log('Coinbase set to', web3.eth.coinbase);
  console.log('');
  return true;
};

/** Wei to Ether conversion */
dev.weiToEther = function (amount) {
  return Number(web3.fromWei(amount, 'ether').toString());
};

/** Ether to Wei conversion */
dev.etherToWei = function(amount) {
  return Number(web3.toWei(amount, 'ether').toString());
};

/** dev console log */
dev.log = function() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('[dev]');
  args.concat(arguments);
  console.log.apply(this, args);
};

/** Toggles transaction receipt display status */
dev.mute = function() {
  this.isMute = this.isMute ? false : true;
  if (this.isMute === true) {
    console.log('');
    this.log('Transaction receipts are muted');
    console.log('');
  } else {
    console.log('');
    this.log('Transaction receipts are unmuted');
    console.log('');
  }

  return true;
};

/** Display dev methods */
dev.help = function() {
  console.log('');
  this.log('=== devchain Methods ===');
  this.log('dev');
  this.log(' .minAmount', '                           Set the minimum amount to mine to');
  this.log(' .accounts()', '                          Displays all accounts, balances, and indexes');
  this.log(' .auto()', '                              Toggles auto mining');
  this.log(' .start(threads)', '                      Start mining', '- threads defaults to 1');
  this.log(' .stop()', '                              Stop mining');
  this.log(' .transfer(fromIndex, toIndex, ether)', ' Transfer Ether between your accounts');
  this.log(' .distribute(fromIndex, ether)   ', '     Distribute Ether to all of your accounts from an account');
  this.log(' .mine(blockAmount)', '                   Mine a specified number of blocks', '- blockAmount defaults to 1');
  this.log(' .block(blockNumber)', '                  Display block info', '- blockNumber defaults to latest');
  this.log(' .coinbase(accountIndex)', '              Change coinbase');
  this.log(' .mute()', '                              Toggles transaction receipt display');
  this.log(' .help()', '                              Display devchain methods');
  console.log('');
  return true;
};

/**
 * Run on devchain start
 */
(function () {
  // Amount of Ether for coinbank to always have
  dev.minAmount;
  // Transaction receipt display status
  dev.isMute;
  // Amount of accounts to create. Always creates 1 account.
  var accountAmount = (dev.accountAmount > 0) ? dev.accountAmount : 1;
  accountAmount -= web3.eth.accounts.length; // Don't allow creation if accounts are already there
  // Amount of Ether to distribute to accounts
  var distributeAmount = (dev.distributeAmount < 0) ? 0 : dev.distributeAmount;
  // Amount of Ether needed by coinbank
  var requiredEtherAmount = dev.distributeAmount * dev.accountAmount + 1;
  // Status of toggling mining if there are transactions pending and whether to keep coinbank topped off at minAmount
  var password = dev.password; // password for the accounts created
  var blockNumber = web3.eth.blockNumber; // the block number to keep mining too

  // For the automatic Ether distribution
  var distributeBlock; // block number when distributed for reference
  var isBalanceDisplayed = false;
  var isDistributed = (distributeAmount === 0 || !dev.reset) ? true : false; // status of ether distribution

  var transactions = []; // to contain pending transaction hashes of a block
  var pendingBlock; // to make sure transactions are only displayed after another block is mined
  if (!dev.reset) {
    addPeers(dev.staticNodes);
  }

  console.log('');
  dev.log('=== Devchain Development Server ===');
  console.log('');
  dev.log('Path to blockchain data:', dev.path);
  console.log('');
  dev.log('Node address:', web3.admin.nodeInfo.enode);
  dev.help(); // Display dev methods and info

  if (dev.autoMine === true) {
    dev.log('Auto mining is on');
    dev.log('Coinbase will be remain above', dev.minAmount, 'Ether. Set dev.minAmount to adjust');
    dev.log('Mining will start automatically when there are transactions pending');
    if (distributeAmount !== 0) {
      dev.log('Distributing', distributeAmount, 'to accounts when coinbase has', requiredEtherAmount, 'Ether');
    }
  } else {
    isDistributed = true; // Don't allow for auto distribution if auto is off at the start
    dev.log('Auto mining is off');
    dev.log('To start/stop mining call dev.start() / dev.stop()');
    dev.log('To toggle auto mining call dev.auto()');
  }

  // Creates all accounts
  if (accountAmount > 0) {
    createAccounts(accountAmount, password);
  } else {
    unlockAccounts();
  }
  dev.accounts();

  // To allow for continous checking of status
  web3.eth.filter('latest', checkStatus);
  web3.eth.filter('pending', checkStatus);

  if (dev.autoMine === true) dev.start();

  function checkStatus() {
    // Display the transaction receipt of previous blocks
    if (transactions.length > 0 && web3.eth.blockNumber > pendingBlock) {
      for (var i = 0; i < transactions.length; i++) {
        var transactionHash = transactions[i];
        transactionReceipt(transactionHash);
      }
      transactions = [];
    }

    // Fill transactions array to display receipts in next bock
    if (web3.eth.getBlock('pending').transactions.length > 0) {
      pendingBlock = web3.eth.blockNumber;
      transactions = web3.eth.getBlock('pending').transactions;
    }

    // Auto mining actions
    if (dev.autoMine === true) {
      // For distributing Ether to accounts and displaying it
      if (isBalanceDisplayed === false && distributeBlock + 2 <= web3.eth.blockNumber) {
        dev.accounts();
        isBalanceDisplayed = true;
      }
      if (isDistributed === false) {
        distributeEther();
      }

      if (web3.eth.getBlock('pending').transactions.length > 0) {
        blockNumber = web3.eth.blockNumber + 3;
        dev.start();
        return;
      }

      if (web3.eth.getBalance(web3.eth.coinbase).lessThan(dev.etherToWei(dev.minAmount))) {
        dev.start();
        return;
      }

      if (web3.eth.blockNumber > blockNumber) {
        dev.stop();
        return;
      }
    }
  }

  // Create the specified number of accounts
  function createAccounts(accountAmount, password) {
    if (accountAmount <= 0) return;
    console.log('');
    dev.log('Creating ' + accountAmount + ' accounts with password ' + '"' + password + '"');
    for (var i = 0; i < accountAmount; i++) {
      web3.personal.newAccount(password);
      web3.personal.unlockAccount(web3.eth.accounts[web3.eth.accounts.length - 1], password, 10000000);
      dev.log('.');
    }
  }

  function unlockAccounts() {
    console.log('');
    dev.log('Unlocking accounts');
    for (var i = 0; i < web3.eth.accounts.length; i++) {
      try {
        web3.personal.unlockAccount(web3.eth.accounts[i], password, 10000000);
        dev.log('.');
      } catch (e) {
        dev.log('Unable to unlock account', i);
        dev.log('Unlock with: web3.personal.unlockAccount(' + web3.eth.accounts[i] + ', \'yourpassword\', 100000)');
      }
    }
    console.log('.');
  }
  // Display the transaction receipts
  function transactionReceipt(transactionHash) {
    if (dev.isMute === true) return;

    var transactionObj = web3.eth.getTransactionReceipt(transactionHash);
    console.log('');
    dev.log('=== Transaction Receipt ===');
    dev.log('Block:            ', transactionObj.blockNumber);
    dev.log('Hash:             ', transactionObj.transactionHash);
    dev.log('From:             ', transactionObj.from);
    dev.log('To:               ', transactionObj.to);
    dev.log('Gas Used:         ', transactionObj.gasUsed);
    dev.log('Ether Cost Est:   ', dev.weiToEther(web3.eth.gasPrice * transactionObj.gasUsed));
    dev.log('Created Contract: ', transactionObj.contractAddress);
    console.log('');
  }

  // Auto distribute ether to all your accounts
  function distributeEther() {
    if (web3.eth.getBalance(web3.eth.coinbase).greaterThan(dev.etherToWei(requiredEtherAmount))) {
      var doesOneDistribute = false; // check to see if there needs to be a blank line consoled
      for (var i = 0; i < web3.eth.accounts.length; i++) {
        if (web3.eth.accounts[i] !== web3.eth.coinbase && web3.eth.getBalance(web3.eth.accounts[i]) == 0) {
          var object = {
            from: web3.eth.coinbase,
            to: web3.eth.accounts[i],
            value: dev.etherToWei(distributeAmount)
          };
          web3.eth.sendTransaction(object);
          if (!doesOneDistribute) {
            console.log('');
            doesOneDistribute = true;
          }
          dev.log('Distributed', distributeAmount, 'Ether to account', i);
          distributeBlock = web3.eth.blockNumber;
        }
      }
      if (doesOneDistribute) console.log('');
      isDistributed = true;
    }
  }

  function addPeers(enodes) {
    if (!Array.isArray(enodes)) return;
    for (var i = 0; i < enodes.length; i++) {
      console.log('enodes', enodes[i]);
      web3.admin.addPeer(enodes[i]);
    }
  }

})();
