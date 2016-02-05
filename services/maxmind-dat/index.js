"use strict";

var geoip = require('geoip-lite');
var path = require("path");
var conf = require(path.join(__dirname, "../../configs"));

var ip = "207.97.227.239";
var geodatafile = conf.get('services:' + path.basename(path.dirname(__filename)) + ":dbfile");
global.geodatadir = path.dirname(geodatafile);


module.exports = {
    lookup: function (ip, callback) {
        var result = geoip.lookup(ip);
        callback(null, result);
    }
};
