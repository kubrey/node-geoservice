"use strict";

var nconf = require('nconf'),
    path = require('path');

var tmpFile = "tmpconf.json";
var env = process.argv[2] ? process.argv[2] : 'production';

var confFile = env === 'development' ? 'config_local.json' : 'config.json';

nconf.argv().env().file({file: path.join(__dirname, confFile)});

/**
 * Encapsulating get method to avoid overwriting file path
 * @param {String} key
 */
nconf.getVal = function(key){
    nconf.argv().env().file({file: path.join(__dirname, confFile)});

    return nconf.get(key);
};

module.exports = nconf;