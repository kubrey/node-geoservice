"use strict";

var geo = require('../lib/geosearch');
var ip = process.argv[2] || '8.8.8.8';
geo.lookup(ip, function (err, res) {
    console.log(err, res);
});