"use strict";

var mmdbreader = require('maxmind-db-reader');
var path = require('path');
var conf = require(path.join(__dirname, "../configs"));

mmdbreader.open(conf.get('services:' + path.basename(__filename, '.js') + ":dbfile"), function (err, countries) {
    // get geodata
    countries.getGeoData('128.101.101.101', function (err, geodata) {
        // log data :D
        console.log(geodata);
    });
});


