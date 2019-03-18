'use strict';
const path = require('path');
const pathExists = require('path-exists').sync;
const defaultConfig = require('./../devchain/devconfig');

/**
 * Create a config object based on commander options
 * @param {string} configPath - Path to config file
 * @param {Command} options - Commander object with process.argv parsed
 * @returns {Object} Config object
 */
module.exports = (configPath, options) => {
  /** Check to see if devconfig.js is there to overwrite default config options */
  let config = {};
  if (pathExists(configPath)) {
    config = require(path.relative(__dirname, configPath));
    config = Object.assign({}, defaultConfig, config);
  } else {
    config = Object.assign({}, defaultConfig);
  }

  /** Set config based on options */
  config.autoMine = (options.off || config.autoMine === false) ? false : true;
  config.accountAmount = options.accounts || config.accountAmount;
  config.password = options.password || config.password;
  config.distributeAmount = options.distribute || config.distributeAmount;
  config.blocks = options.blocks || config.blocks;
  config.isMute = (options.isMute || config.isMute === true) ? true : false;
  config.rpcaddr = options.rpcaddr || config.rpcaddr;
  config.rpcport = options.rpcport || config.rpcport;
  config.port = options.port || config.port;
  config.networkid = options.networkid || config.networkid;

  if (options.staticnodes) {
    options.staticnodes = options.staticnodes.split(',')
      .map(node => node.trim());
    config.staticNodes = config.staticNodes.concat(options.staticnodes);
  }

  return config;
};
