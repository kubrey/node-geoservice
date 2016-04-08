"use strict";

var geo = require('../lib/geosearch');
var ip = process.argv[2] || '8.8.8.8';
var options = {
    services: {
        'maxmind-dat': false,
        'maxmind-mmdb': false,
        'ipgeobase': false,
        'ipinfo':false
    }
};
geo.setOptions(options);
geo.lookup(ip, function (err, res) {
    console.log(err, res);
});

