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
  // const defaultCopy = Object.assign({}, defaultConfig);
  let config = {};
  if (pathExists(configPath)) {
    config = require(path.relative(__dirname, configPath));
    config = Object.assign({}, defaultConfig, config);
  } else {
    config = Object.assign({}, defaultConfig);
  }

  /** Set config based on options */
  config.autoMine = (options.off) ? false : config.autoMine;
  config.accountAmount = options.accounts || config.accountAmount;
  config.password = options.password || config.password;
  config.rpcaddr = options.rpchost || config.rpcaddr;
  config.rpcport = options.rpcport || config.rpcport;
  config.port = options.port || config.port;
  config.networkid = options.networkid || config.networkid;

  if (options.staticnodes) {
    config.staticNodes = config.staticNodes.concat(options.staticnodes);
  }

  return config;
};
