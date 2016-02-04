"use strict";

var nconf = require('nconf'),
    path = require('path');

var env = process.argv[2] ? process.argv[2] : 'production';

var confFile = env === 'development' ? 'config_local.json' : 'config.json';

nconf.argv().env().file({file: path.join(__dirname, confFile)});

module.exports = nconf;