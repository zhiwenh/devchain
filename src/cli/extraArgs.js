'use strict';
const defaultConfig = require('./../devchain/devconfig');

/**
 * Filters args for the properties in a commander object
 * @param {Array} args - An array of args to filter
 * @param {Object} commandOptions - Object of commander options
 * @param {Object} config - Config object
 * @returns {Array} - Array of filtered args
 */
module.exports = (args, commandOptions, config) => {
  let filter = true;
  const newArgs = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i].match(/^--/)) {
      // console.log(args[i]);
      let option = args[i].replace(/^--/, '');
      console.log('option', option);
      if (!commandOptions.hasOwnProperty(option)) {
        newArgs.push(args[i]);
        filter = false;
      } else {
        filter = true;
      }
    } else if (!filter && typeof args[i] === 'string' || typeof args[i] === 'number') {
      newArgs.push(args[i]);
    }
    console.log(newArgs);
  }

  /** Add additional config properties to rawArgs */
  for (let key in config) {
    if (!defaultConfig.hasOwnProperty(key) && !commandOptions.hasOwnProperty(key)) {
      newArgs.push('--' + key);
      console.log(typeof config[key]);
      if (typeof config[key] === 'string' || typeof config[key] === 'number') {
        newArgs.push(config[key]);
      }
    }
  }

  return newArgs;
};
