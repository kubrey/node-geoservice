"use strict";

var nconf = require('nconf'),
    path = require('path');

var env = process.argv[2] ? process.argv[2] : 'production';

var confFile = env === 'development' ? 'config_local.json' : 'config.json';

var fileObj = {file: path.join(__dirname, confFile)};

/**
 * Encapsulating get method to avoid overwriting file path
 * @param {String} key
 */
nconf.getVal = function (key) {
    var sourceBefore = nconf.argv().stores ?
        (nconf.argv().stores.file ?
            (nconf.argv().stores.file.file ? nconf.argv().stores.file.file : null)
            : null)
        : null;
    nconf.use('file', fileObj);
    //nconf.argv().env().file({file: path.join(__dirname, confFile)});
    var val = nconf.get(key);

    if (sourceBefore) {
        nconf.use('file', {file: sourceBefore});
    }

    return val;
};

module.exports = nconf;