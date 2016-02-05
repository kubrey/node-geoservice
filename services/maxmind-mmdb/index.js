"use strict";

var mmdbreader = require('maxmind-db-reader');
var path = require('path');
var conf = require(path.join(__dirname, "../../configs"));

function lookup(ip, callback) {
    mmdbreader.open(conf.get('services:' + path.basename(path.dirname(__filename)) + ":dbfile"), function (err, geoip) {
        // get geodata
        geoip.getGeoData(ip, function (err, geodata) {
            callback(err, geodata);
        });
    });
}


module.exports = {
    lookup: lookup
};


